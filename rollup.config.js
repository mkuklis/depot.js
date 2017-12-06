import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/depot.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      presets: [ 'es2015-rollup' ],
      babelrc: false
    })
  ]
};
