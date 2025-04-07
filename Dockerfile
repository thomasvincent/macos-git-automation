FROM php:8.0-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libxml2-dev \
    nodejs \
    npm \
    default-mysql-client \
    curl \
    && docker-php-ext-install zip pdo_mysql mysqli intl

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Create a non-root user
RUN useradd -m wordpress && \
    chown -R wordpress:wordpress /var/www/html

# Copy project files
COPY --chown=wordpress:wordpress . .

# Switch to non-root user
USER wordpress

# Install PHP dependencies
RUN composer install

# Install Node.js dependencies
RUN npm install

# Install WordPress Coding Standards and dependencies
RUN composer global require wp-coding-standards/wpcs \
    phpcompatibility/phpcompatibility-wp \
    phpcsstandards/phpcsutils \
    phpcsstandards/phpcsextra \
    && composer global config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true \
    && vendor/bin/phpcs --config-set installed_paths $HOME/.composer/vendor/wp-coding-standards/wpcs,$HOME/.composer/vendor/phpcompatibility/php-compatibility,$HOME/.composer/vendor/phpcompatibility/phpcompatibility-paragonie,$HOME/.composer/vendor/phpcompatibility/phpcompatibility-wp,$HOME/.composer/vendor/phpcsstandards/phpcsutils,$HOME/.composer/vendor/phpcsstandards/phpcsextra

# Make run-tests.sh executable
RUN chmod +x run-tests.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Command to run tests
CMD ["./run-tests.sh"]
