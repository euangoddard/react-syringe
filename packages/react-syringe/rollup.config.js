const resolve = require('@rollup/plugin-node-resolve').default;
const sucrase = require('@rollup/plugin-sucrase');
const { terser } = require('rollup-plugin-terser');
const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup');

const requiredNxPlugin = new Set(['copy', 'rpt2', 'rollup-plugin-nx-analyzer']);

module.exports = (config) => {
  const nxConfig = nrwlConfig(config);
  return {
    ...nxConfig,
    plugins: [
      ...nxConfig.plugins.filter(({ name }) => requiredNxPlugin.has(name)),
      sucrase({
        exclude: ['**/node_modules/**'],
        transforms: ['typescript', 'jsx'],
      }),
      resolve(),
      terser(),
    ],
  };
};
