#!/usr/bin/env bash

# This script pushes all branches and tags to GitHub and creates releases for each tag.
# It assumes you have already created a GitHub repository and added it as a remote.

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

# Check if the GitHub repository URL is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <github-repo-url>"
    echo "Example: $0 https://github.com/yourusername/google-calendar-widget.git"
    exit 1
fi

GITHUB_REPO_URL=$1

# Check if the remote 'origin' already exists
if git remote | grep -q "^origin$"; then
    echo "Remote 'origin' already exists. Updating URL..."
    git remote set-url origin "$GITHUB_REPO_URL"
else
    echo "Adding remote 'origin'..."
    git remote add origin "$GITHUB_REPO_URL"
fi

# Push main branch
echo "Pushing main branch to GitHub..."
git push -u origin main

# Push develop branch
echo "Pushing develop branch to GitHub..."
git push -u origin develop

# Push all branches
echo "Pushing all branches to GitHub..."
git push --all origin

# Push all tags
echo "Pushing all tags to GitHub..."
git push --tags origin

echo ""
echo "All branches and tags have been pushed to GitHub."
echo ""
echo "GitHub Actions workflows will now run automatically for the main and develop branches."
echo "The release workflow will run for each tag, creating GitHub releases."
echo ""
echo "You can check the status of the workflows at:"
echo "  $GITHUB_REPO_URL/actions"
echo ""
echo "You can view the releases at:"
echo "  $GITHUB_REPO_URL/releases"
echo ""
echo "Note: It may take a few minutes for the workflows to complete and for the releases to appear."
echo ""
