#!/usr/bin/env bash

# This script creates GitHub releases for each tag using the GitHub CLI.
# It requires the GitHub CLI (gh) to be installed and authenticated.

# Exit on error
set -e

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "Error: GitHub CLI (gh) is not installed. Please install it and try again."
    echo "Installation instructions: https://github.com/cli/cli#installation"
    exit 1
fi

# Check if we're in the plugin directory
if [ ! -f "ko-calendar.php" ]; then
    echo "Error: This script must be run from the plugin root directory."
    exit 1
fi

# Check if gh is authenticated
if ! gh auth status &> /dev/null; then
    echo "Error: GitHub CLI is not authenticated. Please run 'gh auth login' and try again."
    exit 1
fi

# Get all tags
TAGS=$(git tag)

# Create a release for each tag
for TAG in $TAGS; do
    echo "Processing tag $TAG..."
    
    # Get the version from the tag (remove the 'v' prefix if present)
    VERSION=${TAG#v}
    
    # Check if release already exists
    if gh release view "$TAG" &> /dev/null; then
        echo "Release for $TAG already exists. Skipping."
        continue
    fi
    
    echo "Creating release for tag $TAG..."
    
    # Get the changes for this version from the version-changes file
    if [ -f "version-changes-$VERSION.txt" ]; then
        CHANGES=$(cat "version-changes-$VERSION.txt")
    elif [ -f "CHANGELOG.md" ]; then
        # Try to extract changes from CHANGELOG.md
        CHANGELOG_SECTION=$(sed -n "/## \[$VERSION\]/,/## \[/p" CHANGELOG.md | sed '$d')
        if [ -n "$CHANGELOG_SECTION" ]; then
            CHANGES="$CHANGELOG_SECTION"
        else
            CHANGES="Release $VERSION"
        fi
    else
        CHANGES="Release $VERSION"
    fi
    
    # Create the release
    gh release create "$TAG" \
        --title "Release $VERSION" \
        --notes "$CHANGES" \
        || echo "Failed to create release for $TAG. Please check for errors."
    
    echo "Release for $TAG created successfully."
    echo ""
done

echo "All releases have been created."
echo ""
echo "You can view the releases at:"
echo "  https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/releases"
echo ""
