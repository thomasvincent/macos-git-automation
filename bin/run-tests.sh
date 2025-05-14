#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Create logs and test-results directories if they don't exist
mkdir -p logs test-results

# Parse arguments
USE_DOCKER=false
WP_VERSION="latest"
RUN_JS=true
RUN_PHP=true
RUN_PHPCS=true

for arg in "$@"; do
  case $arg in
    --docker)
      USE_DOCKER=true
      shift
      ;;
    --wp-version=*)
      WP_VERSION="${arg#*=}"
      shift
      ;;
    --js-only)
      RUN_JS=true
      RUN_PHP=false
      RUN_PHPCS=false
      shift
      ;;
    --php-only)
      RUN_JS=false
      RUN_PHP=true
      RUN_PHPCS=true
      shift
      ;;
    --skip-phpcs)
      RUN_PHPCS=false
      shift
      ;;
    --help)
      echo "Usage: $0 [options]"
      echo "Options:"
      echo "  --docker            Run tests using Docker"
      echo "  --wp-version=X.Y    Specify WordPress version (default: latest)"
      echo "  --js-only           Run only JavaScript tests"
      echo "  --php-only          Run only PHP tests (including PHPCS)"
      echo "  --skip-phpcs        Skip PHP CodeSniffer"
      echo "  --help              Show this help message"
      exit 0
      ;;
  esac
done

# Function to run commands in Docker or locally
run_command() {
  if [ "$USE_DOCKER" = true ]; then
    echo "Running in Docker: $1"
    WP_VERSION=$WP_VERSION docker compose run --rm wordpress-tests bash -c "$1"
  else
    echo "Running locally: $1"
    eval "$1"
  fi
}

# Print environment info
echo "============================================"
echo "Test Environment:"
echo "  Docker: $USE_DOCKER"
echo "  WordPress Version: $WP_VERSION"
echo "  Running JS Tests: $RUN_JS"
echo "  Running PHP Tests: $RUN_PHP"
echo "  Running PHPCS: $RUN_PHPCS"
echo "============================================"

# Run tests based on configuration
if [ "$RUN_JS" = true ]; then
  echo "Running JavaScript tests..."
  if run_command "npm test"; then
    echo "✅ JavaScript tests passed"
  else
    echo "❌ JavaScript tests failed"
    exit 1
  fi
fi

if [ "$RUN_PHPCS" = true ]; then
  echo "Running PHP CodeSniffer..."
  if run_command "composer phpcs"; then
    echo "✅ PHP CodeSniffer passed"
  else
    echo "⚠️ PHP CodeSniffer found issues (continuing anyway)"
    # Don't exit here to allow tests to run even with style issues
  fi
fi

if [ "$RUN_PHP" = true ]; then
  echo "Running PHP tests..."
  if run_command "composer test"; then
    echo "✅ PHP tests passed"
  else
    echo "❌ PHP tests failed"
    exit 1
  fi
fi

echo "✅ All requested tests completed successfully."
