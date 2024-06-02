import { fileURLToPath } from 'url';
import { dirname } from 'path';
import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import * as pluginImport from 'eslint-plugin-i';
import pluginUnusedImport from 'eslint-plugin-unused-imports';
import ts from '@typescript-eslint/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import nxEslintPlugin from '@nx/eslint-plugin';
import jsRules from './javascript.eslint.js';

/* Directory ESM */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
});

const typeAwareRules = {
	'dot-notation': 'off',
	'no-implied-eval': 'off',
	'no-throw-literal': 'off',
	'ts/await-thenable': 'error',
	'ts/dot-notation': ['error', { allowKeywords: true }],
	'ts/no-floating-promises': 'error',
	'ts/no-for-in-array': 'error',
	'ts/no-implied-eval': 'error',
	'ts/no-misused-promises': 'error',
	'ts/no-throw-literal': 'error',
	'ts/no-unnecessary-type-assertion': 'error',
	'ts/no-unsafe-argument': 'warn',
	'ts/no-unsafe-assignment': 'warn',
	'ts/no-unsafe-call': 'error',
	'ts/no-unsafe-member-access': 'warn',
	'ts/no-unsafe-return': 'error',
	'ts/restrict-plus-operands': 'error',
	'ts/restrict-template-expressions': 'error',
	'ts/unbound-method': 'warn',
};

const stylisticRules = 	stylistic.configs.customize({
	pluginName: 'style',
	indent: 'tab',
	quotes: 'single',
	semi: ['error', 'always'],
	jsx: true,
	curly: ['error', 'multi-or-nest', 'consistent'],
});

export default [
	{
		plugins: {
			'@nx': nxEslintPlugin,
			'import': pluginImport,
			'ts': ts,
			'style': stylistic,
			'unused-imports': pluginUnusedImport,
		},
	},
	{
		files: ['**/eslint.config.js'],
		rules: {
			'@nx/enforce-module-boundaries': 'off',
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
		rules: {
			...jsRules,
			'@nx/enforce-module-boundaries': [
				'warn',
				{
					enforceBuildableLibDependency: true,
					allow: ['eslint.config.js'],
					depConstraints: [
						{
							sourceTag: '*',
							onlyDependOnLibsWithTags: ['*'],
						},
					],
				},
			],
			...stylisticRules.rules,
			'import/first': 'error',
			'import/no-duplicates': 'error',
			'import/no-mutable-exports': 'error',
			'import/no-named-default': 'error',
			'import/no-self-import': 'error',
			'import/no-webpack-loader-syntax': 'error',
			'import/no-commonjs': 'error',
			'import/order': 'error',
			'import/newline-after-import': ['error', { considerComments: true, count: 1 }],
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		languageOptions: {
			parserOptions: {
				project: ['./tsconfig(.*)?.json'],
			},
		},
		rules: {
			...typeAwareRules,
			'ts/ban-ts-comment': ['error', { 'ts-ignore': 'allow-with-description' }],
			'ts/no-import-type-side-effects': 'error',
			'ts/no-invalid-this': 'error',
			'ts/no-redeclare': 'error',
			'ts/no-require-imports': 'error',
			'ts/consistent-type-definitions': ['error', 'type'],
		},
	},
	...compat.config({ extends: ['plugin:@nx/typescript'] }).map(config => ({
		...config,
		files: ['**/*.ts', '**/*.tsx'],
		rules: {},
	})),
	...compat.config({ extends: ['plugin:@nx/javascript'] }).map(config => ({
		...config,
		files: ['**/*.js', '**/*.jsx'],
		rules: {},
	})),
	...compat.config({ env: { jest: true } }).map(config => ({
		...config,
		files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
		rules: {},
	})),
];
