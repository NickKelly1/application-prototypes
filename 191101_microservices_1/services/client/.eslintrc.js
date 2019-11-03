module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
  ],
  "env": {
    "browser": true,
    "amd": true,
    "node": true,
  },
  parserOptions: {
    // ecmaVersion: 2019, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    // project: './tsconfig.json', //https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
  },
  rules: {
    'no-console': "off",
    'quotes': ['error', 'single',],
    'no-trailing-spaces': ['error'],
    // stop node plugin from removing shebangs
    'node/shebang': 'off',
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'node/no-missing-import': ['error', {
      "allowModules": [],
      "tryExtensions": ['.ts', '.js', '.d.ts']
    }],
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