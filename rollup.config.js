import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/main.js',
  output: [
    {
      file: 'dist/iife/gmaps-address-locator.js',
      format: 'iife',
      name: 'gmapsAddressLocator'
    },
    {
      file: 'dist/cjs/gmaps-address-locator.js',
      format: 'cjs',
      name: 'gmapsAddressLocator'
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};
