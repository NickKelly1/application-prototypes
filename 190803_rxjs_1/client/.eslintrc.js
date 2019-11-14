// https://dev.to/benweiser/how-to-set-up-eslint-typescript-prettier-with-create-react-app-3675
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    'plugin:react/recommended',
    'eslint:recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  env: {
    es6: true,
    browser: true,
    jasmine: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'prettier/prettier': ['error', { singleQuote: true }],
    '@typescript-eslint/camelcase': 0,
    'no-console': 0,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
