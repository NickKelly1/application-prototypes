module.exports = {
  extends: [
    'airbnb',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:node/recommended',
    'plugin:jest/recommended',
    'prettier/@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
    'node',
    'prettier',
  ],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  parserOptions: {
    sourceType: 'module',
  },
  rules: {
    'class-methods-use-this': 'off',
    'no-useless-constructor': 'off',
    'max-len': ['error', { 'code': 144, 'ignoreComments': true }],
    'no-underscore-dangle': ['off'],
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        'js': 'never',
        'jsx': 'never',
        'ts': 'never',
        'tsx': 'never'
      }
    ],
    'node/no-unpublished-import': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        // devDependencies: [
        //   '**/spec.ts',
        //   '**/spec.tsx',
        //   '**/test.tsx',
        //   '**/test.ts'
        // ]
      }
    ],
    'import/prefer-default-export': 'off',
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
      },
    ],
    'node/no-missing-import': ['error', {
      'allowModules': [],
      'tryExtensions': ['.tsx', '.ts', '.js', '.d.ts']
    }],

  },
};