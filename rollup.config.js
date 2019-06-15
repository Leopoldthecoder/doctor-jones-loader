import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import { eslint } from 'rollup-plugin-eslint'
import json from 'rollup-plugin-json'

export default {
  input: 'index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  external: [
    'babel-eslint',
    'doctor-jones',
    'loader-utils',
    'schema-utils',
    'splice-string'
  ],
  plugins: [
    eslint(),
    json(),
    resolve(),
    commonjs({
      include: 'node_modules/**',
      sourceMap: false
    }),
    buble({
      transforms: { forOf: false }
    })
  ]
}
