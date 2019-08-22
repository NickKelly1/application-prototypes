// https://dev.to/robertcoopercode/using-eslint-and-prettier-in-a-typescript-project-53jb
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:node/recommended', // https://github.com/mysticatea/eslint-plugin-node#readme
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    // unnecessary:?
    // project: './tsconfig.json', //https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/camelcase': 'off',
    'no-console': 'off',
    'quotes': ['error', 'single',],
    '@typescript-eslint/indent': ['error', 2],
    // '@typescript-eslint/explicit-member-accessibility': 1,
    '@typescript-eslint/explicit-member-accessibility': 'off',
    // the eslint node plugin can be used to see which features are/aren't provided in node
    // node version is specified in "engines" in package.json
    // https://github.com/mysticatea/eslint-plugin-node/blob/master/docs/rules/no-unsupported-features/es-syntax.md
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
      },
    ],
  },
};
