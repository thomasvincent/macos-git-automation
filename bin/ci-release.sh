#!/bin/bash

# This script:
# 1. Commits changes using conventional commit standard
# 2. Pushes to GitHub
# 3. Waits for CI to pass
# 4. Creates a release if CI passes

# Exit on error
set -e

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

# Commit all changes using conventional commit standard
echo "Committing all changes..."
git add .
git commit -F commit-message.txt

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

# Wait for CI to complete
echo "Waiting for CI to complete..."
gh run watch

# Check if the most recent workflow run was successful
WORKFLOW_STATUS=$(gh run list --limit 1 --json status --jq '.[0].status')
WORKFLOW_CONCLUSION=$(gh run list --limit 1 --json conclusion --jq '.[0].conclusion')

if [ "$WORKFLOW_STATUS" = "completed" ] && [ "$WORKFLOW_CONCLUSION" = "success" ]; then
    echo "CI passed successfully! Creating release..."
    
    # Create a tag
    echo "Creating tag v$CURRENT_VERSION..."
    git tag -a "v$CURRENT_VERSION" -m "Release $CURRENT_VERSION"
    git push origin "v$CURRENT_VERSION"
    
    # Create a GitHub release
    echo "Creating GitHub release..."
    gh release create "v$CURRENT_VERSION" \
        --title "Release $CURRENT_VERSION" \
        --notes-file CHANGELOG.md \
        --target main
    
    echo "Release process completed successfully!"
    echo "Version $CURRENT_VERSION has been released on GitHub."
else
    echo "CI failed or is still running. Please check the GitHub Actions tab for details."
    echo "Once CI passes, you can run the release script manually:"
    echo "./release.sh"
    exit 1
fi
