import { defineConfig } from 'eslint/config';
import { globSync } from 'glob';
import js from '@eslint/js';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import vitestPlugin from '@vitest/eslint-plugin';
import importPlugin from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

const devFiles = [
  'eslint.config.js',
  'packages/**/*.test.{ts,tsx}',
  'packages/**/*.spec.{ts,tsx}',
  'packages/**/__tests__/**/*.{ts,tsx}',
  'packages/**/dev/**/*.{ts,tsx}',
];

export default defineConfig([
  {
    ignores: ['**/node_modules/', '**/dist/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.strict,
  prettierPlugin,
  {
    files: ['**/*.ts'],
    plugins: {
      '@eslint-community/eslint-comments': eslintComments,
      '@typescript-eslint': tseslint.plugin,
      'import-x': importPlugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    settings: {
      'import-x/resolver': {
        typescript: true,
      },
    },
    rules: {
      // ESLint comments rules
      '@eslint-community/eslint-comments/require-description': 'error',

      // TypeScript rules
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-invalid-void-type': [
        'error',
        {
          allowAsThisParameter: true,
        },
      ],

      // Core rules
      'func-style': ['error', 'declaration'],
      'no-console': 'error',
      'no-use-before-define': 'off',

      // Import rules
      'no-useless-rename': 'error',
      'import-x/order': [
        'error',
        {
          'newlines-between': 'always-and-inside-groups',
          groups: [['builtin', 'external'], ['parent'], ['sibling', 'index']],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import-x/no-default-export': 'error',
      'import-x/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: devFiles,
          peerDependencies: true,
          packageDir: ['./', ...globSync('./packages/*')],
        },
      ],
    },
  },
  // Конфигурационные файлы
  {
    files: ['**/eslint.config.js'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },
  // Правила для прод-файлов
  {
    files: ['**/*.ts'],
    ignores: devFiles,
    rules: {
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  // Правила для файлов с тестами
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    ...vitestPlugin.configs.recommended,
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/consistent-test-filename': [
        'error',
        {
          allTestPattern: '.*\\.spec(\\.ts)?$',
          pattern: '.*\\.spec(\\.ts)?$',
        },
      ],
    },
  },
]);
