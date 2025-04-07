#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Running JavaScript tests..."
npm test || { echo "JavaScript tests failed"; exit 1; }

echo "Running PHP CodeSniffer..."
composer phpcs || { echo "PHP CodeSniffer failed"; exit 1; }

echo "Running PHP tests..."
composer test || { echo "PHP tests failed"; exit 1; }

echo "Tests completed successfully."
