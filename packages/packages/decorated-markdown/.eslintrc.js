module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
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
  parserOptions: {
    parser: 'babel-eslint',
  },
};
