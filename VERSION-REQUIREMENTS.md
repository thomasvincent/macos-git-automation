# Version Requirements for Google Calendar Widget

## Versions
We should ensure compatibility with the following versions:

### PHP
- Minimum: 7.4 (will reach EOL in November 2025)
- Recommended: 8.0 and above
- Tested with: 7.4, 8.0, 8.1, 8.2, 8.3

### WordPress
- Minimum: 6.3
- Recommended: Latest
- Tested with: 6.3, 6.4, 6.5, and latest

### Node.js (Development only)
- Minimum: 20.x (LTS)
- Recommended: 20.x or 22.x
- For CI/Testing: 20.x

## Testing and CI Commands
- Run PHP tests: `composer test`
- Run JS tests: `npm test`
- Run PHP linting: `composer phpcs`
- Run JS linting: `npm run lint`
- Run all tests and linting: `bin/run-tests.sh`

## Docker Support
- Build: `docker compose build`
- Run: `docker compose up`
- Run with specific WordPress version: `WP_VERSION=6.4 docker compose up`

## GitHub Actions
- Matrix tests for PHP 7.4, 8.0, 8.1, 8.2, 8.3
- WordPress tests for latest, 6.5, 6.4, 6.3
- Node.js 20.x for JavaScript tests

## Dependencies
Current PHP dependencies in composer.json should use:
- PHP: >=7.4
- composer/installers: ^2.3.0
- Plus appropriate development dependencies

Current JavaScript dependencies in package.json:
- Node.js: 20.x
- All ESLint packages: Latest compatible versions
- Jest: 29.x