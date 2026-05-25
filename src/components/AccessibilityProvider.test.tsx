import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import AccessibilityProvider from "@/components/AccessibilityProvider";

const A11Y_CLASSES = [
  "a11y-reduced-motion",
  "a11y-high-contrast",
  "a11y-underline-links",
  "a11y-readable-font",
  "a11y-increased-spacing",
];

function resetDocumentA11yState() {
  document.documentElement.classList.remove(...A11Y_CLASSES);
  delete document.documentElement.dataset.a11yTextScale;
}

function renderWithRoute(route = "/", content?: ReactNode) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AccessibilityProvider>{content ?? <main>Page content</main>}</AccessibilityProvider>
    </MemoryRouter>,
  );
}

describe("AccessibilityProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetDocumentA11yState();
  });

  it("assigns main-content id to the first main landmark", async () => {
    renderWithRoute("/", <main>Main area</main>);

    await waitFor(() => {
      const main = screen.getByRole("main");
      expect(main).toHaveAttribute("id", "main-content");
    });
  });

  it("does not render the floating accessibility menu on /98", () => {
    renderWithRoute("/98", <div>Win98 page</div>);

    expect(screen.queryByRole("button", { name: /accessibility menu/i })).not.toBeInTheDocument();
  });

  it("opens menu, moves focus to first control, and returns focus on close", async () => {
    renderWithRoute();

    const trigger = screen.getByRole("button", { name: /open accessibility menu/i });
    fireEvent.click(trigger);

    const firstScaleButton = await screen.findByRole("button", { name: "100%" });
    expect(firstScaleButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /accessibility/i })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /open accessibility menu/i })).toHaveFocus();
    });
  });

  it("persists toggle state to localStorage and html classes", async () => {
    renderWithRoute();

    fireEvent.click(screen.getByRole("button", { name: /open accessibility menu/i }));

    const reducedMotionSwitch = await screen.findByRole("switch", { name: /reduce motion/i });
    fireEvent.click(reducedMotionSwitch);

    await waitFor(() => {
      expect(document.documentElement).toHaveClass("a11y-reduced-motion");
    });

    const stored = window.localStorage.getItem("minerva.a11y.v1");
    expect(stored).toBeTruthy();
    expect(stored).toContain('"reducedMotion":true');
  });

  it("reset restores system-derived defaults when no saved settings exist", async () => {
    const originalMatchMedia = window.matchMedia;
    try {
      window.matchMedia = vi.fn().mockImplementation((query: string) => ({
        matches:
          query.includes("prefers-reduced-motion: reduce") ||
          query.includes("forced-colors: active"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }));

      renderWithRoute();

      fireEvent.click(screen.getByRole("button", { name: /open accessibility menu/i }));

      const reducedMotionSwitch = await screen.findByRole("switch", { name: /reduce motion/i });
      const highContrastSwitch = await screen.findByRole("switch", { name: /high contrast/i });

      expect(reducedMotionSwitch).toHaveAttribute("aria-checked", "true");
      expect(highContrastSwitch).toHaveAttribute("aria-checked", "true");

      fireEvent.click(reducedMotionSwitch);
      await waitFor(() => {
        expect(document.documentElement).not.toHaveClass("a11y-reduced-motion");
      });

      fireEvent.click(screen.getByRole("button", { name: /reset defaults/i }));

      await waitFor(() => {
        expect(document.documentElement).toHaveClass("a11y-reduced-motion");
        expect(document.documentElement).toHaveClass("a11y-high-contrast");
      });
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });
});
