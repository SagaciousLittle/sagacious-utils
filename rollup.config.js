import fs from 'fs'
import Resolve from 'rollup-plugin-node-resolve'
import Cjs from 'rollup-plugin-commonjs'
import Ts from 'rollup-plugin-typescript2'
import {
  terser,
} from 'rollup-plugin-terser'
import FileSize from 'rollup-plugin-filesize'

function getCjsOrEsConfig (target) {
  if (target !== 'es') target = 'cjs'
  const input = {}
  fs.readdirSync('./src').forEach(f => {
    if (/(?<!\.test)\.ts$/.test(f)) {
      input[f.replace(/\.ts$/, '')] = `src/${f}`
    }
  })
  return {
    input,
    output: {
      format: target,
      dir: `dist/${target}`,
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
}

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'utils',
      format: 'umd',
      file: 'dist/browser/utils.min.js',
    },
    plugins: [
      Resolve(),
      Cjs(),
      Ts(),
      terser(),
      FileSize(),
    ],
  },
  getCjsOrEsConfig('cjs'),
  getCjsOrEsConfig('es'),
]
