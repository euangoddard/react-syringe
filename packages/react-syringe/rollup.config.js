const resolve = require('@rollup/plugin-node-resolve').default;
const sucrase = require('@rollup/plugin-sucrase');
const { terser } = require('rollup-plugin-terser');
const nrwlConfig = require('@nrwl/react/plugins/bundle-rollup')

module.exports = (config) => {
    const nxConfig = nrwlConfig(config)
    return {
        ...nxConfig,
        plugins: [
          nxConfig.plugins.find(x => x.name === "rollup-plugin-nx-analyzer"),
          sucrase({
            exclude: ['**/node_modules/**'],
            transforms: ['typescript', 'jsx']
          }),
          resolve(),
          terser(),
        ],
    }
}