// rollup.config.js
// https://rollupjs.org/guide/en/
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

/* Hack for unusual ESM/npm package structure - oudated plugin */
/* https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/21#issuecomment-1368169746 */
import pluginManifest from "rollup-plugin-output-manifest";
const { default: outputManifest } = pluginManifest;

const devMode = process.env.NODE_ENV !== "production";

// Options for creating hash manifest of the outputs.
const manifestOpts = {
  isMerge: true,
  fileName: "../../src/_data/manifest.json",
};

const noop = () => {};

export default [
  {
    input: "./src/js/main.js",
    plugins: [nodeResolve(), devMode ? noop() : outputManifest(manifestOpts)],
    output: {
      entryFileNames: devMode ? "bundle.esm.js" : "bundle-[hash].esm.js",
      generatedCode: "es2015",
      name: "bundle",
      format: "es",
      dir: "./_site/js/",
      sourcemap: devMode ? "inline" : false,
      plugins: [
        devMode
          ? noop()
          : terser({
              ecma: 2020,
              mangle: { toplevel: true },
              compress: {
                module: true,
                toplevel: true,
                unsafe_arrows: true,
                drop_console: !devMode,
                drop_debugger: !devMode,
              },
              output: {
                quote_style: 1,
                comments: false,
              },
            }),
      ],
    },
    watch: {
      include: "./src/js/**",
      clearScreen: false,
    },
  },
];
