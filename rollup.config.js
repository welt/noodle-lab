// rollup.config.js
// https://rollupjs.org/guide/en/
import dotenv from "dotenv";
dotenv.config();
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import fs from "fs";
import path from "path";
import normalizeRepoUrl from "./scripts/normalizeRepoUrl.js";

const pkg = JSON.parse(fs.readFileSync(path.resolve("./package.json"), "utf8"));
const repoUrl = normalizeRepoUrl(pkg.repository);

/* Hack for unusual ESM/npm package structure - oudated plugin */
/* https://github.com/shuizhongyueming/rollup-plugin-output-manifest/issues/21#issuecomment-1368169746 */
import pluginManifest from "rollup-plugin-output-manifest";
const { default: outputManifest } = pluginManifest;
/* end Hack */

const devMode = process.env.NODE_ENV !== "production";

const logEnabled = process.env.LOG_LEVEL === "1";
console.log(">>>> Log enabled:", logEnabled);

// Options for creating hash manifest of the outputs.
const manifestOpts = {
  isMerge: true,
  fileName: "../../src/_data/manifest.json",
};

const noop = () => {};

export default [
  {
    input: "./src/js/main.js",
    plugins: [
      nodeResolve(),
      replace({
        preventAssignment: true,
        __GITHUB_REPO_URL__: JSON.stringify(repoUrl),
      }),
      devMode ? noop() : outputManifest(manifestOpts),
    ],
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
              mangle: { toplevel: false }, // For Firebug ;]
              compress: {
                module: true,
                toplevel: true,
                unsafe_arrows: true,
                drop_console: false, // MessagePanel uses console.log
                drop_debugger: false,
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
