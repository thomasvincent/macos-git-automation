#!/bin/bash

# This script simulates creating a new release

# Get the current version from the plugin file
CURRENT_VERSION=$(grep "Version:" google-calendar-widget.php | sed 's/.*Version: \(.*\)/\1/')
echo "Current version: $CURRENT_VERSION"

# Create a new tag
echo "Creating tag v$CURRENT_VERSION..."
# git tag -a "v$CURRENT_VERSION" -m "Release $CURRENT_VERSION"

# Build the plugin
echo "Building plugin..."
mkdir -p build/google-calendar-widget
cp -r *.php *.txt *.md languages examples build/google-calendar-widget/ 2>/dev/null || true
cp -r assets includes build/google-calendar-widget/ 2>/dev/null || true
cd build
zip -r google-calendar-widget.zip google-calendar-widget

echo "Release simulation completed. Plugin zip file created at build/google-calendar-widget.zip"
echo "To create an actual release, you would run:"
echo "git tag -a \"v$CURRENT_VERSION\" -m \"Release $CURRENT_VERSION\""
echo "git push origin \"v$CURRENT_VERSION\""
