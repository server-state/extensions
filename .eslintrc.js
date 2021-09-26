module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 11,
		sourceType: 'module'
	},
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		node: true,
		commonjs: true,
		es2020: true,
		jest: true
	},
	globals: {
		NodeJS: 'readonly',
		getRedisClientMock: 'readonly'
	},
	plugins: ['@typescript-eslint', 'jsdoc', 'prettier'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'airbnb/base',
		'prettier',
		'plugin:prettier/recommended'
	],
	rules: {
		// Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
		'no-prototype-builtins': 'off',
		'no-bitwise': 'warn',
		// why not?
		'no-plusplus': 'off',
		// Use function hoisting to improve code readability
		'no-use-before-define': [
			'error',
			{ functions: false, classes: true, variables: true }
		],
		// allow voids as statements
		// https://eslint.org/docs/rules/no-void
		'no-void': [
			'error',
			{
				allowAsStatement: true
			}
		],
		// eslint does not detect exported members properly
		'no-unused-vars': 'off',
		// https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
		'import/prefer-default-export': 'off',
		'jsdoc/require-jsdoc': [
			'error',
			{
				contexts: [
					'TSInterfaceDeclaration',
					'TSTypeAliasDeclaration',
					'TSEnumDeclaration'
				]
			}
		],
		'import/no-unresolved': 0,
		'jsdoc/require-description': 1,
		'jsdoc/require-param-description': 'error',
		//'jsdoc/require-hyphen-before-param-description': 'error',
		//'jsdoc/no-types': 'error',
		'jsdoc/require-throws': 'error',
		'jsdoc/require-param-type': 0,
		'jsdoc/require-property-type': 0,
		'jsdoc/require-returns-type': 0,
		// treat wrong format as warning instead of error
		// to inform the user and not slap him
		'prettier/prettier': 'warn',
		'import/no-extraneous-dependencies': 0
	},
	ignorePatterns: [
		'scripts',
		'configs',
		'sample',
		'bin',
		'types',
		'.eslintrc.js',
		'docs',
		'types.d.ts',
		'*.spec.js',
		'*.test.js',
		'test/*.js',
		'**/__tests__/**/*.js'
	],
	overrides: [
		{
			files: ['src/index.ts'],
			rules: {
				'@typescript-eslint/no-namespace': 'off',
				'@typescript-eslint/no-unused-vars': 'off'
			}
		}
	]
};
