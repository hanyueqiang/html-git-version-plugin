import { babel } from '@rollup/plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: "lib/index.js",
  output: {
    file: "dist/html-git-version-plugin.js",
    format: "cjs",
    name: 'bundle-name'
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' }),
  ]
};