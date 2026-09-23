export type CodeLanguage = "html" | "css" | "js";
export type CodeMode = "format" | "minify";

let prettierCache:
  | Promise<{
      prettier: typeof import("prettier/standalone");
      babelPlugin: unknown;
      estreePlugin: unknown;
      htmlPlugin: unknown;
      postcssPlugin: unknown;
    }>
  | null = null;

let terserCache: Promise<typeof import("terser")> | null = null;
let cssoCache: Promise<typeof import("csso")> | null = null;
let htmlMinifierCache:
  | Promise<{
      minify: (code: Uint8Array, cfg: Record<string, unknown>) => Uint8Array;
    }>
  | null = null;

function pluginValue(mod: unknown): unknown {
  const maybeDefault = (mod as { default?: unknown }).default;
  return maybeDefault ?? mod;
}

async function loadPrettier() {
  if (!prettierCache) {
    prettierCache = Promise.all([
      import("prettier/standalone"),
      import("prettier/plugins/babel"),
      import("prettier/plugins/estree"),
      import("prettier/plugins/html"),
      import("prettier/plugins/postcss"),
    ]).then(([prettier, babelPlugin, estreePlugin, htmlPlugin, postcssPlugin]) => ({
      prettier,
      babelPlugin: pluginValue(babelPlugin),
      estreePlugin: pluginValue(estreePlugin),
      htmlPlugin: pluginValue(htmlPlugin),
      postcssPlugin: pluginValue(postcssPlugin),
    }));
  }

  return prettierCache;
}

async function loadTerser() {
  if (!terserCache) {
    terserCache = import("terser");
  }
  return terserCache;
}

async function loadCsso() {
  if (!cssoCache) {
    cssoCache = import("csso");
  }
  return cssoCache;
}

async function loadHtmlMinifier() {
  if (!htmlMinifierCache) {
    htmlMinifierCache = Promise.all([
      import("@minify-html/wasm/index_bg.js"),
      import("@minify-html/wasm/index_bg.wasm?init"),
    ]).then(async ([minifier, wasmLoaderModule]) => {
      const wasm = await wasmLoaderModule.default({ "./index_bg.js": minifier });
      minifier.__wbg_set_wasm(wasm.exports);
      return { minify: minifier.minify };
    });
  }
  return htmlMinifierCache;
}

async function formatWithPrettier(input: string, language: CodeLanguage): Promise<string> {
  const { prettier, babelPlugin, estreePlugin, htmlPlugin, postcssPlugin } = await loadPrettier();

  if (language === "js") {
    return prettier.format(input, {
      parser: "babel",
      plugins: [babelPlugin, estreePlugin],
      semi: true,
      singleQuote: false,
      printWidth: 100,
    });
  }

  if (language === "css") {
    return prettier.format(input, {
      parser: "css",
      plugins: [postcssPlugin],
      printWidth: 100,
    });
  }

  return prettier.format(input, {
    parser: "html",
    plugins: [htmlPlugin],
    printWidth: 100,
    htmlWhitespaceSensitivity: "css",
  });
}

async function minifyJs(input: string): Promise<string> {
  const terser = await loadTerser();
  const result = await terser.minify(input, {
    compress: true,
    mangle: true,
    format: {
      comments: false,
    },
  });

  if (result.code == null) {
    throw new Error("Terser failed to generate output.");
  }

  return result.code;
}

async function minifyCss(input: string): Promise<string> {
  const csso = await loadCsso();
  return csso.minify(input, { restructure: true }).css;
}

async function minifyHtml(input: string): Promise<string> {
  const { minify } = await loadHtmlMinifier();
  const inputBytes = new TextEncoder().encode(input);
  const outputBytes = minify(inputBytes, {
    keep_comments: false,
    keep_spaces_between_attributes: false,
    minify_css: true,
    minify_js: true,
  });
  return new TextDecoder().decode(outputBytes).trim();
}

export async function transformCode(input: string, language: CodeLanguage, mode: CodeMode): Promise<string> {
  if (!input.trim()) return "";

  if (mode === "format") {
    return formatWithPrettier(input, language);
  }

  if (language === "js") return minifyJs(input);
  if (language === "css") return minifyCss(input);
  return minifyHtml(input);
}
