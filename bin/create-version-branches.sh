#!/usr/bin/env bash

# This script creates Git branches for each version mentioned in the CHANGELOG.md file.
# It helps maintain the history of the plugin in Git.

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

# Make sure we're on the main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "Switching to main branch..."
    git checkout main
fi

# Function to create a version branch
create_version_branch() {
    VERSION=$1
    BRANCH_NAME="version/$VERSION"
    CHANGES=$2
    
    # Check if branch already exists
    if git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
        echo "Branch $BRANCH_NAME already exists, skipping..."
        return
    fi
    
    echo "Creating branch $BRANCH_NAME..."
    git checkout -b "$BRANCH_NAME" main
    
    # Update version in ko-calendar.php
    echo "Updating version in ko-calendar.php..."
    sed -i.bak "s/Version: [0-9]\+\.[0-9]\+\.[0-9]\+/Version: $VERSION/" ko-calendar.php
    rm ko-calendar.php.bak
    
    # Update version in package.json if it exists
    if [ -f "package.json" ]; then
        echo "Updating version in package.json..."
        sed -i.bak "s/\"version\": \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/\"version\": \"$VERSION\"/" package.json
        rm package.json.bak
    fi
    
    # Update version in composer.json if it exists
    if [ -f "composer.json" ]; then
        echo "Updating version in composer.json..."
        sed -i.bak "s/\"version\": \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/\"version\": \"$VERSION\"/" composer.json 2>/dev/null || echo "No version field in composer.json, skipping."
        if [ -f "composer.json.bak" ]; then
            rm composer.json.bak
        fi
    fi
    
    # Create a file with version-specific changes
    echo "Creating version-specific changes..."
    echo "$CHANGES" > "version-changes-$VERSION.txt"
    
    # Commit changes
    echo "Committing changes..."
    git add ko-calendar.php package.json composer.json "version-changes-$VERSION.txt" 2>/dev/null || true
    git commit -m "Version $VERSION"
    
    # Create tag
    echo "Creating tag v$VERSION..."
    git tag -a "v$VERSION" -m "Version $VERSION"
    
    echo "Branch $BRANCH_NAME created and tagged as v$VERSION"
    echo ""
}

# Create branches for each version with specific changes
echo "Creating branches for each version..."

# Version 1.0
create_version_branch "1.0" "Initial release"

# Version 1.1
create_version_branch "1.1" "Added ability to support multiple feeds (up to 3) from one widget."

# Version 1.2
create_version_branch "1.2" "Added 'Expand Entries by Default' checkbox to widget settings to auto expand all the calendar entries."

# Version 1.3
create_version_branch "1.3" "- Remove duplicate events when showing multiple calendars
- Added 'Event Title Format' option
- Added error checking for offline use
- Changed layout of widget settings"

# Version 1.3.1
create_version_branch "1.3.1" "Fixed problem where spaces around the loading GIF caused it to not stop when the calendar loads."

# Version 1.3.2
create_version_branch "1.3.2" "- Removed version number from Google jsapi
- Removed script includes from admin interface"

# Version 1.4.0
create_version_branch "1.4.0" "- Upgraded to Google Calendar API v3
- Replaced calendar 'URL' with calendar 'ID'
- Added Setting for Google API Key"

# Version 1.4.1
create_version_branch "1.4.1" "- Fixed typo data->date
- Corrected timezone for all-day events"

# Version 1.4.2
create_version_branch "1.4.2" "- Use Google client API batching
- Added support for comma delimited calendar ids
- Maintained backward compatibility"

# Version 1.4.3
create_version_branch "1.4.3" "- Replaced WP_PLUGIN_URL with plugins_url
- Fixed Google Console URL in settings
- Added error handling to batch query
- Entry expands with time and location even without description
- Removed unused code"

# Version 1.4.4
create_version_branch "1.4.4" "Clearer error message if using an invalid API key."

# Version 1.4.5
create_version_branch "1.4.5" "- Made URL of apis.google.com protocol relative
- Added initial support for localization
- Added support for <br> and <p> tags in title format"

# Version 1.4.6
create_version_branch "1.4.6" "Added definition of ko_calendar_loc if not defined by WordPress loc system"

# Version 2.0.0
create_version_branch "2.0.0" "- Refactored plugin to use modern PHP OOP practices
- Updated to use the latest WordPress Widget API
- Modernized JavaScript using ES6+ syntax
- Improved module pattern to avoid global namespace pollution
- Enhanced calendar event processing and display
- Better support for multiple calendars
- Improved CSS with flexbox and better visual hierarchy
- Updated standalone example to use the latest Google Calendar API
- Added comprehensive documentation and tests"

# Return to the original branch
echo "Returning to $CURRENT_BRANCH branch..."
git checkout "$CURRENT_BRANCH"

echo ""
echo "All version branches created successfully!"
echo ""
echo "To push all branches and tags to GitHub, run:"
echo "  git push --all origin"
echo "  git push --tags origin"
echo ""
