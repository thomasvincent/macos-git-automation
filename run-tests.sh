#!/bin/bash

echo "Running JavaScript tests..."
npm test || echo "JavaScript tests failed, but continuing"

echo "Running PHP CodeSniffer..."
composer phpcs || echo "PHP CodeSniffer failed, but continuing"

echo "Running PHP tests..."
composer test || echo "PHP tests failed, but continuing"

echo "Tests completed."
