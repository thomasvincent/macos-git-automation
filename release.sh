#!/bin/bash

# This script handles the complete release process:
# 1. Commits all changes
# 2. Creates a tag
# 3. Pushes to GitHub
# 4. Creates a GitHub release

# Get the current version from the plugin file
CURRENT_VERSION=$(grep "Version:" google-calendar-widget.php | sed 's/.*Version: \(.*\)/\1/')
echo "Current version: $CURRENT_VERSION"

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "GitHub CLI (gh) is not installed. Please install it first:"
    echo "https://cli.github.com/manual/installation"
    exit 1
fi

# Check if user is logged in to GitHub
if ! gh auth status &> /dev/null; then
    echo "You are not logged in to GitHub. Please run 'gh auth login' first."
    exit 1
fi

# Commit all changes
echo "Committing all changes..."
git add .
git commit -F commit-message.txt

# Create a tag
echo "Creating tag v$CURRENT_VERSION..."
git tag -a "v$CURRENT_VERSION" -m "Release $CURRENT_VERSION"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main
git push origin "v$CURRENT_VERSION"

# Create a GitHub release
echo "Creating GitHub release..."
gh release create "v$CURRENT_VERSION" \
    --title "Release $CURRENT_VERSION" \
    --notes-file CHANGELOG.md \
    --target main

echo "Release process completed successfully!"
echo "Version $CURRENT_VERSION has been released on GitHub."
