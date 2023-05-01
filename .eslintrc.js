module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    requireConfigFile: false,
  },
  rules: {
    'import/prefer-default-export': 0,
    'import/extensions': 'off',
  },
};
