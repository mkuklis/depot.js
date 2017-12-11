import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/depot.browser.js',
      format: 'iife',
      name: 'depot',
    },
    {
      file: 'dist/depot.js',
      format: 'cjs',
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      presets: [ 'es2015-rollup' ],
      babelrc: false
    }),
    resolve({
      browser: true,
      main: true
    }),
    uglify()
  ]
};
