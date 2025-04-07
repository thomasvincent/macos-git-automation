#!/usr/bin/env bash

# This script helps create a new release of the Google Calendar Widget plugin.
# It updates version numbers in files, creates a release branch, and guides
# through the release process.

# Exit on error
set -e

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "Error: git is not installed. Please install git and try again."
    exit 1
fi

# Check if we're in the plugin directory
if [ ! -f "ko-calendar.php" ]; then
    echo "Error: This script must be run from the plugin root directory."
    exit 1
fi

# Check if the working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "Error: Working directory is not clean. Please commit or stash your changes before creating a release."
    exit 1
fi

# Make sure we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Error: You must be on the main branch to create a release."
    echo "Current branch: $CURRENT_BRANCH"
    echo "Please run: git checkout main"
    exit 1
fi

# Make sure the main branch is up to date
echo "Updating main branch..."
git pull origin main || { echo "Error: Failed to pull from origin main. Please resolve any conflicts and try again."; exit 1; }

# Get the current version from ko-calendar.php
CURRENT_VERSION=$(grep -o "Version: [0-9]\+\.[0-9]\+\.[0-9]\+" ko-calendar.php | cut -d' ' -f2)
echo "Current version: $CURRENT_VERSION"

# Ask for the new version
read -p "Enter new version (e.g., 2.1.0): " NEW_VERSION

# Validate version format
if ! [[ $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid version format. Please use semantic versioning (e.g., 2.1.0)."
    exit 1
fi

# Create release branch
RELEASE_BRANCH="release/v$NEW_VERSION"
echo "Creating release branch: $RELEASE_BRANCH"
git checkout -b "$RELEASE_BRANCH"

# Update version in ko-calendar.php
echo "Updating version in ko-calendar.php..."
sed -i.bak "s/Version: $CURRENT_VERSION/Version: $NEW_VERSION/" ko-calendar.php
rm ko-calendar.php.bak

# Update version in package.json
echo "Updating version in package.json..."
sed -i.bak "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" package.json
rm package.json.bak

# Update version in composer.json
echo "Updating version in composer.json..."
sed -i.bak "s/\"version\": \"$CURRENT_VERSION\"/\"version\": \"$NEW_VERSION\"/" composer.json 2>/dev/null || echo "No version field in composer.json, skipping."
if [ -f "composer.json.bak" ]; then
    rm composer.json.bak
fi

# Prompt for changelog entry
echo ""
echo "Please update CHANGELOG.md with the changes for version $NEW_VERSION."
echo "Press Enter when you're done..."
read

# Commit changes
echo "Committing changes..."
git add ko-calendar.php package.json composer.json CHANGELOG.md
git commit -m "Prepare release v$NEW_VERSION"

# Push release branch
echo "Pushing release branch..."
git push origin "$RELEASE_BRANCH"

# Instructions for completing the release
echo ""
echo "Release branch created and pushed to GitHub."
echo ""
echo "Next steps:"
echo "  1. Create a pull request from $RELEASE_BRANCH to main on GitHub"
echo "  2. After the pull request is approved and merged, run:"
echo "     git checkout main"
echo "     git pull origin main"
echo "     git tag -a v$NEW_VERSION -m \"Release v$NEW_VERSION\""
echo "     git push origin v$NEW_VERSION"
echo ""
echo "  3. The GitHub Actions workflow will automatically create a GitHub release and build the plugin"
echo ""
echo "  4. After the release is complete, merge the changes back to develop:"
echo "     git checkout develop"
echo "     git pull origin develop"
echo "     git merge --no-ff main"
echo "     git push origin develop"
echo ""
