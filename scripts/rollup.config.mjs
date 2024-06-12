import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import replace from "@rollup/plugin-replace";
import strip from "@rollup/plugin-strip";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensions = [".js", ".jsx", ".ts", ".tsx"];
const babelConfigFile = path.join(__dirname, "../babel.config.cjs");
const config = {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.mjs",
      format: "es",
    },
    {
      file: "dist/index.cjs",
      format: "cjs",
    },
  ],
  plugins: [
    resolve({
      jsnext: true,
      extensions: extensions,
    }),
    commonjs(),
    json(),
    babel({ babelHelpers: "bundled", extensions, configFile: babelConfigFile }),
  ],
  external: [
    "lodash",
    "npmlog",
    "resolve",
    "dayjs",
    /@babel\//,
    /@rollup\//,
    /node:*/,
    "react",
    "fs",
    "os",
    "fs-extra",
    "path",
    "zx",
    "lodash",
    "minimist",
    "tslib",
    /@pnpm\./,
  ],
};

export default config;
