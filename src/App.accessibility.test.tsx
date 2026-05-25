import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "@/App";

describe("App accessibility shell", () => {
  it("renders a global skip link and binds main-content target", async () => {
    render(<App />);

    const skipLink = screen.getByRole("link", { name: /skip to main content/i });
    expect(skipLink).toHaveAttribute("href", "#main-content");

    await waitFor(() => {
      const mainTarget = document.getElementById("main-content");
      expect(mainTarget).not.toBeNull();
    });
  });
});
