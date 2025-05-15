FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libxml2-dev \
    libonig-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    default-mysql-client \
    subversion \
    curl \
    gnupg \
    && docker-php-ext-install \
    mysqli \
    pdo_mysql \
    zip \
    mbstring \
    exif \
    pcntl \
    bcmath \
    intl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd

# Use official Node.js setup to install a supported version
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm

# Verify Node.js and npm installation
RUN node -v && npm -v

# Install PHPUnit CodeCoverage
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy bin directory first to ensure scripts are available
COPY bin/ bin/
RUN chmod +x bin/*.sh

# Copy composer.json 
COPY composer.json ./
RUN composer install --no-interaction --no-progress --no-autoloader

# Copy package.json and install Node dependencies
COPY package.json ./
RUN npm install --no-audit --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Generate autoloader with the complete codebase
RUN composer dump-autoload --optimize

# Make entrypoint script executable
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create logs and test-results directories
RUN mkdir -p logs test-results && chmod 777 logs test-results

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php", "-a"]
