// https://dev.to/benweiser/how-to-set-up-eslint-typescript-prettier-with-create-react-app-3675
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'prettier'],
  env: {
    browser: true,
    jasmine: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 0,
    'prettier/prettier': ['error', { singleQuote: true }],
    '@typescript-eslint/camelcase': 0,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
};
