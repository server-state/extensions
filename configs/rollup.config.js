import typescript from 'rollup-plugin-typescript2';
import externals from 'rollup-plugin-node-externals';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import rollupPluginLicense from 'rollup-plugin-license';
import graphql from '@rollup/plugin-graphql';
import path from 'path';

/**
 * A rollup configuration for a Typescript based extension with `src/index.ts`
 * @param {Record<string, string>} deps the dependency object from the `package.json`
 * @returns {import('rollup').RollupOptions} The rollup configuration
 */
export function rollupConfig(deps) {
	return {
		input: 'src/index.ts',
		output: [
			{
				dir: 'dist',
				format: 'cjs',
				sourcemap: true,
				exports: 'auto',
				plugins: [terser()]
			},
			{
				file: 'dist/index.esm.js',
				format: 'esm',
				sourcemap: true,
				exports: 'auto',
				plugins: [terser()]
			}
		],
		// external: [...Object.keys(deps || {}), 'fs', 'os', 'path'],
		plugins: [
			externals({
				exclude: 'tslib'
			}),
			// @ts-ignore
			peerDepsExternal(),
			resolve(),
			commonjs(),
			typescript(),
			graphql(),
			rollupPluginLicense({
				sourcemap: true,
				banner: {
					commentStyle: 'ignored',
					content: {
						file: path.join(__dirname, 'LICENSE'),
						encoding: 'utf8'
					}
				}
			})
		]
	};
}
