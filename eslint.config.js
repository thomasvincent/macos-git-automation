/**
 * ESLint configuration for Google Calendar Widget
 * 
 * @package Google_Calendar_Widget
 * @version 2.1.0
 */

const jestPlugin = require('eslint-plugin-jest');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020, // Modern ECMAScript for Jest files
      sourceType: 'module',
      globals: {
        'google_calendar_widget_loc': 'readonly',
        'gapi': 'readonly',
        'jQuery': 'readonly',
        'Wiky': 'readonly',
        'document': 'readonly',
        'window': 'readonly',
        '$': 'readonly'
      }
    },
    plugins: {
      jest: jestPlugin
    },
    rules: {
      // Relaxed rules to match existing code
      'indent': 'off',
      'linebreak-style': ['error', 'unix'],
      'quotes': 'off', 
      'semi': ['error', 'always'],
      'no-unused-vars': 'off',
      'no-console': 'off',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error'
    }
  },
  {
    ignores: [
      'node_modules/',
      'vendor/',
      'dist/',
      'build/',
      'coverage/',
      'assets/js/date.js', // Ignoring problematic files
      'assets/js/wiky.js',
      'assets/js/google-calendar-widget.js'
    ]
  }
];