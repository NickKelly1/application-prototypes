// https://dev.to/benweiser/how-to-set-up-eslint-typescript-prettier-with-create-react-app-3675
// https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:jest/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'jest', 'jsx-a11y'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019, // allows for parsing of modern ECMAScript features
    sourceType: 'module',
    ecmaFeatures: {},
    // 'project': './tsconfig.json',
  },
  env: { es6: true, browser: true, jest: true },
  globals: {
    // window,
    // document,
    // fetch,
  },
  rules: {
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    'no-console': 0,
    '@typescript-eslint/indent': ['error', 2],
    // https://www.npmjs.com/package/eslint-plugin-react-hooks
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'quotes': ['error', 'single',],
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
