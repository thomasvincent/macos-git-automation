#!/usr/bin/env bash

# This script initializes a Git repository for the Google Calendar Widget plugin
# and sets up the initial structure following GitHub Flow.

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

# Initialize git repository if not already initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    echo "Git repository initialized."
else
    echo "Git repository already initialized."
fi

# Add all files to git
echo "Adding files to git..."
git add .

# Create initial commit
echo "Creating initial commit..."
git commit -m "Initial commit: Refactored Google Calendar Widget plugin"

# Create main branch (if not already on main)
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Creating main branch..."
    git branch -M main
    echo "Switched to main branch."
fi

# Create develop branch
echo "Creating develop branch..."
git checkout -b develop
echo "Switched to develop branch."

# Instructions for pushing to GitHub
echo ""
echo "Repository initialized with main and develop branches."
echo ""
echo "To push to GitHub, run the following commands:"
echo "  1. Create a new repository on GitHub (do not initialize with README, .gitignore, or license)"
echo "  2. Run the following commands:"
echo "     git remote add origin https://github.com/yourusername/google-calendar-widget.git"
echo "     git push -u origin main"
echo "     git push -u origin develop"
echo ""
echo "To create a new feature branch:"
echo "  git checkout develop"
echo "  git checkout -b feature/your-feature-name"
echo ""
echo "To create a new bugfix branch:"
echo "  git checkout main"
echo "  git checkout -b fix/your-bugfix-name"
echo ""
echo "To create a release:"
echo "  git checkout main"
echo "  git checkout -b release/vX.Y.Z"
echo "  # Update version numbers in files"
echo "  git add ."
echo "  git commit -m \"Prepare release vX.Y.Z\""
echo "  git checkout main"
echo "  git merge --no-ff release/vX.Y.Z"
echo "  git tag -a vX.Y.Z -m \"Release vX.Y.Z\""
echo "  git push origin main --tags"
echo "  git checkout develop"
echo "  git merge --no-ff release/vX.Y.Z"
echo "  git push origin develop"
echo ""
