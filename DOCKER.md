# Docker Setup for Google Calendar Widget

This project includes Docker configuration for development, testing, and CI/CD. Using Docker ensures consistent environments across different systems and simplifies the setup process.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### Running Tests with Docker

To run all tests (PHP and JavaScript) using Docker:

```bash
docker-compose up
```

This will:
1. Build the Docker image with all dependencies
2. Start a MySQL container for WordPress tests
3. Run all tests (PHP unit tests, PHPCS, and JavaScript tests)

### Development Environment

For development, you can use the Docker setup as follows:

```bash
# Build the image
docker-compose build

# Run a specific command in the container
docker-compose run wordpress-plugin composer install
docker-compose run wordpress-plugin npm install
docker-compose run wordpress-plugin composer test
docker-compose run wordpress-plugin composer phpcs
docker-compose run wordpress-plugin npm test
```

## Docker Files

- `Dockerfile`: Main Docker configuration for development and testing
- `docker-compose.yml`: Docker Compose configuration for local development and testing
- GitHub Actions workflows use Docker for CI/CD:
  - `.github/workflows/ci.yml`: Continuous Integration workflow
  - `.github/workflows/wordpress-security.yml`: WordPress security checks
  - `.github/workflows/release.yml`: Release workflow

## Benefits of Using Docker

1. **Consistent Environments**: Ensures the same environment for development, testing, and CI/CD
2. **Simplified Setup**: No need to install PHP, Node.js, MySQL, and other dependencies locally
3. **Isolated Testing**: Tests run in isolated containers, preventing conflicts with local system
4. **Reproducible Builds**: Builds are reproducible across different systems
5. **Easier Onboarding**: New developers can get started quickly without complex setup

## Troubleshooting

If you encounter issues with Docker:

- Check Docker logs: `docker-compose logs`
- Rebuild the image: `docker-compose build --no-cache`
- Remove containers and volumes: `docker-compose down -v`
- Ensure Docker has enough resources allocated (memory, CPU)
