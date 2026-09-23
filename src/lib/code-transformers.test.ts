import { readFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { transformCode } from "@/lib/code-transformers";

// Keep the real WASM and bindings; only replace Vite's browser fetch transport.
vi.mock("@minify-html/wasm/index_bg.wasm?init", () => ({
  default: async (imports: WebAssembly.Imports) => {
    const bytes = await readFile("node_modules/@minify-html/wasm/index_bg.wasm");
    return (await WebAssembly.instantiate(bytes, imports)).instance;
  },
}));

describe("code transforms", () => {
  it("formats and minifies HTML, CSS, and JavaScript with the actual processors", async () => {
    const html = "<main><h1>Heading</h1><p>Paragraph text</p></main>";
    const formattedHtml = await transformCode(html, "html", "format");
    expect(formattedHtml).toContain("\n  <h1>Heading</h1>\n");
    const minifiedHtml = await transformCode(html, "html", "minify");
    expect(new DOMParser().parseFromString(minifiedHtml, "text/html").body.innerHTML).toBe(html);
    expect(minifiedHtml.length).toBeLessThan(html.length);

    const css = ".card { color: #ff0000; margin: 0px; }";
    expect(await transformCode(css, "css", "format")).toContain("\n  color: #ff0000;\n");
    expect(await transformCode(css, "css", "minify")).toBe(".card{color:red;margin:0}");

    const js = "function add(a,b){return a+b}";
    const formattedJs = await transformCode(js, "js", "format");
    expect(formattedJs).toContain("\n  return a + b;\n");
    const minifiedJs = await transformCode(js, "js", "minify");
    expect(new Function(`${minifiedJs}; return add(2, 3);`)()).toBe(5);
    expect(minifiedJs.length).toBeLessThan(formattedJs.length);

    expect(await transformCode("  \n", "html", "minify")).toBe("");
  });
});
