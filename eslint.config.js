const path = require('node:path');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: path.resolve(),
});

module.exports = [
  ...compat.config({
    extends: ['next/core-web-vitals'],
  }),
  {
    ignores: ['**/node_modules/**', 'public/**', '.next/**', 'eslint.config.js'],
  },
];