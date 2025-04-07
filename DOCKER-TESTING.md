# Containerized Testing Environment

This project includes a fully containerized testing environment using Docker and Docker Compose. This ensures consistent test results across different development environments and CI/CD pipelines.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Running Tests Locally

To run the tests in the containerized environment:

```bash
# Build the Docker images
docker-compose build

# Run the tests
docker-compose up
```

You can also specify a WordPress version to test against:

```bash
WP_VERSION=6.4 docker-compose up
```

Available WordPress versions include:
- `latest` (default)
- `6.4`
- `6.3`
- `6.2`
- Any other valid WordPress version

## Understanding the Containerized Environment

The containerized environment consists of:

1. **WordPress Test Container**: A PHP 8.0 environment with all necessary dependencies installed, including:
   - WordPress core
   - PHPUnit
   - Composer dependencies
   - Node.js and npm dependencies

2. **MySQL Container**: A MySQL 8.0 database server for WordPress tests

## CI/CD Integration

The GitHub Actions workflow in `.github/workflows/containerized-ci.yml` uses this containerized environment to run tests against multiple WordPress versions.

## Customizing the Environment

You can customize the environment by modifying:

- `Dockerfile`: Change PHP version, add extensions, or modify the base environment
- `docker-compose.yml`: Adjust service configurations, add services, or modify environment variables
- `docker-entrypoint.sh`: Modify the container startup process

## Troubleshooting

If you encounter issues with the containerized environment:

1. **Database Connection Issues**:
   - Ensure the MySQL container is running: `docker-compose ps`
   - Check MySQL logs: `docker-compose logs mysql`

2. **WordPress Test Setup Issues**:
   - Check the WordPress test container logs: `docker-compose logs wordpress-tests`
   - Verify the WordPress test files are downloaded correctly

3. **Test Failures**:
   - Access the container: `docker-compose exec wordpress-tests bash`
   - Run tests manually: `composer test` or `npm test`
