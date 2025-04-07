#!/bin/bash
set -e

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
until mysql -h mysql -u root -proot -e "SELECT 1"; do
  sleep 1
done

# Set up WordPress test environment
if [ ! -d "/tmp/wordpress-tests-lib" ]; then
  echo "Setting up WordPress test environment..."
  bash bin/install-wp-tests.sh wordpress_test root root mysql $WP_VERSION
fi

# Execute the command passed to docker run
exec "$@"
