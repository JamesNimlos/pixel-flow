import pkg from './package.json'
import sourceMaps from 'rollup-plugin-sourcemaps'
import cleanup from 'rollup-plugin-cleanup'

const banner = `
/*
 ** pixel-flow@${pkg.version}
 ** https://github.com/JamesNimlos/pixel-flow
 **
 ** Developed by
 ** - James Nimlos
 **
 ** Licensed under MIT license
 */
`

const plugins = [cleanup(), sourceMaps()]
export default [
  {
    input: 'src/jquery.js',
    external: ['jquery'],
    output: [
      {
        file: 'jquery.js',
        format: 'umd',
        sourcemap: true,
        name: 'pixel-flow',
        globals: {
          jquery: 'jQuery'
        },
        banner
      }
    ],
    plugins
  },
  {
    input: 'src/pixel-flow.js',
    output: [
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true,
        banner
      },
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        banner
      }
    ],
    plugins
  }
]
