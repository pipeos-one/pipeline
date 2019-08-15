module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': ['error', 2],
    'object-curly-spacing': ['error', 'never'],
    'object-curly-newline': 'off',
    'no-plusplus': 'off',
    'func-names': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'import/extensions': 'off',
    'arrow-body-style': 'off',
    'no-param-reassign': 'off',
    'space-before-function-paren': 'off',
    'no-await-in-loop': 'off',
  },
};
