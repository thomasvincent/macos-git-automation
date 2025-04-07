# Makefile for Google Calendar Widget

.PHONY: all test install release push-github create-releases create-version-branches

# Default target
all: test

# Install dependencies
install:
	@echo "Installing dependencies..."
	composer install
	npm install

# Run tests
test: install
	@echo "Running tests..."
	composer test
	npm test

# Create a new release
release:
	@echo "Creating a new release..."
	@echo "Enter new version (e.g., 2.1.0):"
	@read VERSION && \
	git pull origin main && \
	./bin/create-release.sh

# Push all branches and tags to GitHub
push-github:
	@echo "Pushing all branches and tags to GitHub..."
	git pull origin main && \
	git pull origin develop && \
	./bin/push-to-github.sh https://github.com/thomasvincent/google-calendar-widget.git

# Create GitHub releases for all tags
create-releases:
	@echo "Creating GitHub releases for all tags..."
	git pull origin main && \
	./bin/create-github-releases.sh

# Create version branches
create-version-branches:
	@echo "Creating version branches..."
	git pull origin main && \
	./bin/create-version-branches.sh

# Deploy (push to GitHub and create releases)
deploy: push-github create-releases
	@echo "Deployment complete!"

# Help
help:
	@echo "Available targets:"
	@echo "  all             - Default target, runs tests"
	@echo "  install         - Install dependencies"
	@echo "  test            - Run tests"
	@echo "  release         - Create a new release"
	@echo "  push-github     - Push all branches and tags to GitHub"
	@echo "  create-releases - Create GitHub releases for all tags"
	@echo "  create-version-branches - Create version branches"
	@echo "  deploy          - Push to GitHub and create releases"
	@echo "  help            - Show this help message"
