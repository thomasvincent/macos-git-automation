#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status

echo "Running JavaScript tests..."
npm test

echo "Running PHP CodeSniffer..."
composer phpcs

echo "Running PHP tests..."
composer test

echo "Tests completed."
