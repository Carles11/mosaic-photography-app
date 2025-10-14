// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    plugins: {
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      'import': require('eslint-plugin-import')
    },
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        project: ['./tsconfig.json'],
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    rules: {
      ...require('@typescript-eslint/eslint-plugin').configs.recommended.rules,
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      // Add import resolver errors to warning level (optional)
      'import/no-unresolved': 'warn'
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['./tsconfig.json']
        },
        alias: {
          map: [
            ['@', './src']
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        }
      }
    }
  }
]);