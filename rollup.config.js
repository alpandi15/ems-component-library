const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const postcss = require('rollup-plugin-postcss')
const del = require('rollup-plugin-delete')
const dts = require('rollup-plugin-dts').default
const tailwindcss = require('tailwindcss')
const postcssImport = require('postcss-import')
const external = require('rollup-plugin-peer-deps-external')

const pkg = require('./package.json')

module.exports = [
    {
        input: 'src/index.ts',
        output: [
            {
                file: pkg.main,
                format: 'cjs',
                sourcemap: true
            },
            {
                file: pkg.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            del({ targets: ['dist/*'] }),
            resolve(),
            commonjs(),
            // external({ includeDependencies: true }),
            typescript({ tsconfig: './tsconfig.json' }),
            // styles(),
            postcss({
                plugins: [
                  postcssImport(),
                  tailwindcss('./tailwind.config.js'),
                  require('autoprefixer'),
                ],
                // inject: false,
                // // only write out CSS for the first bundle (avoids pointless extra files):
                // extract: true
            }),
        ],
        // external: Object.keys(pkg.peerDependencies || {}),
        external: ["react", "react-dom"]
    },
    {
        input: 'dist/esm/types/index.d.ts',
        output: [{file: 'dist/index.d.ts', format: 'esm'}],
        plugins: [dts()],
        external: [/\.css$/]
    }
]