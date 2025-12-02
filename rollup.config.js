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
  fileName: path.resolve("./src/_data/manifest.json"),
};

const audioLoopsManifestOpts = {
  isMerge: true,
  fileName: path.resolve("./src/_data/manifest.json"),
  generate: (keyValueDecorator, seed) => (chunks, bundle) => {
    const manifest = { ...seed };
    chunks.forEach(({ fileName }) => {
      manifest["audioLoops.js"] = fileName;
    });
    return manifest;
  },
};

const digitalRainManifestOpts = {
  isMerge: true,
  fileName: path.resolve("./src/_data/manifest.json"),
  generate: (keyValueDecorator, seed) => (chunks, bundle) => {
    const manifest = { ...seed };
    chunks.forEach(({ fileName }) => {
      manifest["digitalRain.js"] = fileName;
    });
    return manifest;
  },
};

const workerManifestOpts = {
  isMerge: true,
  fileName: path.resolve("./src/_data/manifest.json"),
  generate: (keyValueDecorator, seed) => (chunks, bundle) => {
    const manifest = { ...seed };
    chunks.forEach(({ fileName }) => {
      manifest["worker.pixel-mangler.js"] = fileName;
    });
    return manifest;
  },
};

const pixelManglerManifestOpts = {
  isMerge: true,
  fileName: path.resolve("./src/_data/manifest.json"),
  generate: (keyValueDecorator, seed) => (chunks, bundle) => {
    const manifest = { ...seed };
    chunks.forEach(({ fileName }) => {
      manifest["pixelMangler.js"] = fileName;
    });
    return manifest;
  },
};

const workerDecoderManifestOpts = {
  isMerge: true,
  fileName: path.resolve("./src/_data/manifest.json"),
  generate: (keyValueDecorator, seed) => (chunks, bundle) => {
    const manifest = { ...seed };
    chunks.forEach(({ fileName }) => {
      manifest["worker.audio-decoder.js"] = fileName;
    });
    return manifest;
  },
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
      devMode
        ? noop()
        : terser({
            ecma: 2020,
            mangle: { toplevel: true },
            compress: {
              module: true,
              toplevel: true,
              unsafe_arrows: true,
              drop_console: false,
              drop_debugger: false,
            },
            output: {
              quote_style: 1,
              comments: false,
            },
          }),
    ],
    output: {
      entryFileNames: devMode ? "bundle.esm.js" : "bundle-[hash].esm.js",
      generatedCode: "es2015",
      name: "bundle",
      format: "es",
      dir: "./_site/js/",
      sourcemap: devMode ? "inline" : false,
    },
    watch: {
      include: "./src/js/**",
      clearScreen: false,
    },
  },
  {
    input: "./src/js/_components/audioLoops/index.js",
    plugins: [
      nodeResolve(),
      devMode ? noop() : outputManifest(audioLoopsManifestOpts),
      devMode
        ? noop()
        : terser({
            ecma: 2020,
            mangle: { toplevel: true },
            compress: {
              module: true,
              toplevel: true,
              unsafe_arrows: true,
              drop_console: false,
              drop_debugger: false,
            },
            output: {
              quote_style: 1,
              comments: false,
            },
          }),
    ],
    output: {
      entryFileNames: devMode ? "audioLoops.js" : "audioLoops-[hash].esm.js",
      generatedCode: "es2015",
      format: "es",
      dir: "./_site/js/audioLoops/",
      sourcemap: devMode ? "inline" : false,
    },
    watch: {
      include: "./src/js/_components/audioLoops/**",
      clearScreen: false,
    },
  },
  {
    input: "./src/js/_components/digitalRain/index.js",
    plugins: [
      nodeResolve(),
      devMode ? noop() : outputManifest(digitalRainManifestOpts),
      devMode
        ? noop()
        : terser({
            ecma: 2020,
            mangle: { toplevel: true },
            compress: {
              module: true,
              toplevel: true,
              unsafe_arrows: true,
              drop_console: false,
              drop_debugger: false,
            },
            output: {
              quote_style: 1,
              comments: false,
            },
          }),
    ],
    output: {
      entryFileNames: devMode ? "digitalRain.js" : "digitalRain-[hash].esm.js",
      generatedCode: "es2015",
      format: "es",
      dir: "./_site/js/digitalRain",
      sourcemap: devMode ? "inline" : false,
    },
    watch: {
      include: "./src/js/_components/digitalRain/**",
      clearScreen: false,
    },
  },
  {
    input: "./src/js/_components/pixelMangler/index.js",
    plugins: [
      nodeResolve(),
      devMode ? noop() : outputManifest(pixelManglerManifestOpts),
      devMode
        ? noop()
        : terser({
            ecma: 2020,
            mangle: { toplevel: true },
            compress: {
              module: true,
              toplevel: true,
              unsafe_arrows: true,
              drop_console: false,
              drop_debugger: false,
            },
            output: {
              quote_style: 1,
              comments: false,
            },
          }),
    ],
    output: {
      entryFileNames: devMode
        ? "pixelMangler.js"
        : "pixelMangler-[hash].esm.js",
      generatedCode: "es2015",
      format: "es",
      dir: "./_site/js/pixelMangler/",
      sourcemap: devMode ? "inline" : false,
    },
    watch: {
      include: "./src/js/_components/pixelMangler/**",
      clearScreen: false,
    },
  },
  {
    input: "./src/js/_components/pixelMangler/workers/worker.pixel-mangler.js",
    plugins: [
      nodeResolve(),
      devMode ? noop() : outputManifest(workerManifestOpts),
      devMode
        ? noop()
        : terser({
            ecma: 2020,
            mangle: { toplevel: true },
            compress: {
              module: true,
              toplevel: true,
              unsafe_arrows: true,
              drop_console: false,
              drop_debugger: false,
            },
            output: {
              quote_style: 1,
              comments: false,
            },
          }),
    ],
    output: {
      entryFileNames: devMode
        ? "worker.pixel-mangler.js"
        : "worker.pixel-mangler-[hash].js",
      generatedCode: "es2015",
      format: "es",
      dir: "./_site/js/pixelMangler/workers/",
      sourcemap: devMode ? "inline" : false,
    },
    watch: {
      include: "./src/workers/**",
      clearScreen: false,
    },
  },
  {
    input: "./src/js/_components/audioLoops/workers/worker.audio-decoder.js",
    plugins: [
      nodeResolve(),
      devMode ? noop() : outputManifest(workerDecoderManifestOpts),
      devMode
        ? noop()
        : terser({
            ecma: 2020,
            mangle: { toplevel: true },
            compress: {
              module: true,
              toplevel: true,
              unsafe_arrows: true,
              drop_console: false,
              drop_debugger: false,
            },
            output: {
              quote_style: 1,
              comments: false,
            },
          }),
    ],
    output: {
      entryFileNames: devMode
        ? "worker.audio-decoder.js"
        : "worker.audio-decoder-[hash].js",
      generatedCode: "es2015",
      format: "es",
      dir: "./_site/js/audioLoops/workers/",
      sourcemap: devMode ? "inline" : false,
    },
    watch: {
      include: "./src/js/_components/audioLoops/workers/**",
      clearScreen: false,
    },
  },
];
