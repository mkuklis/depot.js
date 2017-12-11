import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/depot.js',
    format: 'umd',
    name: 'depot'
  },
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
