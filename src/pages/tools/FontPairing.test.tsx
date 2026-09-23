import { afterEach, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter } from "react-router-dom";
import FontPairing from "./FontPairing";

const originalFonts = Object.getOwnPropertyDescriptor(document, "fonts");

afterEach(() => {
  vi.unstubAllGlobals();
  if (originalFonts) Object.defineProperty(document, "fonts", originalFonts);
  else Reflect.deleteProperty(document, "fonts");
});

it("shows uploaded filenames while keeping preview families unique and exports readable", async () => {
  const loadedFamilies: string[] = [];
  vi.stubGlobal("FontFace", class {
    constructor(public family: string) {
      loadedFamilies.push(family);
    }
    async load() { return this; }
  });
  vi.stubGlobal("crypto", { randomUUID: () => `upload-${loadedFamilies.length}` });
  Object.defineProperty(document, "fonts", { configurable: true, value: { add: vi.fn() } });

  const { container } = render(
    <HelmetProvider><MemoryRouter><FontPairing /></MemoryRouter></HelmetProvider>,
  );
  const name = "ABCDiatypeTrial-Regular";
  const file = new File(["font bytes"], `${name}.otf`);
  Object.defineProperty(file, "arrayBuffer", { value: async () => new ArrayBuffer(8) });

  for (const pickerName of ["Playfair Display", `${name} Custom`]) {
    fireEvent.click(screen.getByRole("button", { name: pickerName }));
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [file] } });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: `${name} Custom` })).toHaveStyle({
        fontFamily: `"${loadedFamilies.at(-1)}", sans-serif`,
      });
    });
  }

  expect(new Set(loadedFamilies).size).toBe(2);
  expect(screen.getByRole("heading", { name: "Article heading" })).toHaveStyle({
    fontFamily: `"${loadedFamilies[1]}", sans-serif`,
  });
  expect(container.querySelector("pre")?.textContent).toContain(`--font-heading: "${name}", sans-serif;`);
  expect(container.textContent).not.toContain("Custom-heading-");

  fireEvent.mouseDown(screen.getByRole("tab", { name: "Tailwind" }), { button: 0, ctrlKey: false });
  expect(container.querySelector("pre")?.textContent).toContain(`heading: ["${name}", 'sans-serif']`);
});
