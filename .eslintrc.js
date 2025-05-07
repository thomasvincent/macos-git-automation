module.exports = {
  env: {
    node: true,
    es2022: true
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'off'
  },
  globals: {
    // JXA global objects
    'Application': 'readonly',
    'Path': 'readonly',
    'ObjC': 'readonly'
  }
};