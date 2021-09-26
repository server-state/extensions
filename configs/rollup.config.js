import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import rollupPluginLicense from 'rollup-plugin-license';
import graphql from '@rollup/plugin-graphql';

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
		external: [...Object.keys(deps || {}), 'fs', 'os', 'path'],
		plugins: [
			typescript({
				declaration: true
			}),
			graphql(),
			rollupPluginLicense({
				sourcemap: true,
				banner: {
					commentStyle: 'ignored',
					content: 'MIT Licensed. Copyright 2021 Ludwig Richter, Pablo Klaschka'
				}
			})
		]
	};
}
