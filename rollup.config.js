import Resolve from 'rollup-plugin-node-resolve'
import Cjs from 'rollup-plugin-commonjs'
import Ts from 'rollup-plugin-typescript2'
import {
  terser,
} from 'rollup-plugin-terser'
import FileSize from 'rollup-plugin-filesize'

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'utils',
      format: 'umd',
      file: 'dist/utils.browser.min.js',
    },
    plugins: [
      Resolve(),
      Cjs(),
      Ts(),
      terser(),
      FileSize(),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      name: 'utils',
      format: 'cjs',
      file: 'dist/utils.min.js',
    },
    plugins: [
      Resolve(),
      Cjs(),
      Ts(),
      terser(),
      FileSize(),
    ],
    external: [
      'lodash',
      'mathjs'
    ]
  }
]
