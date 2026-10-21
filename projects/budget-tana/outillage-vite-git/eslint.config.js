import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  {
    files: ['src/**/*.js', 'tests/**/*.mjs', '*.config.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: { ...js.configs.recommended.rules },
  },
];
