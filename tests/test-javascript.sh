#!/bin/bash
#
# Test script for JavaScript Git Clone functionality
#

echo "=== Testing JavaScript Git Clone ==="
echo "This test will copy a test repository URL to the clipboard"
echo "and execute the JavaScript."
echo

SCRIPT_PATH="../src/javascript/GitCloneFromClipboard.js"

if [ ! -f "$SCRIPT_PATH" ]; then
    echo "ERROR: Script not found at $SCRIPT_PATH"
    exit 1
fi

# Setup test repository URL
TEST_REPO="https://github.com/octocat/Hello-World.git"

echo "Setting clipboard to: $TEST_REPO"
echo -n "$TEST_REPO" | pbcopy

echo "Running JavaScript..."
osascript -l JavaScript "$SCRIPT_PATH"

echo
echo "Test complete. Check for any error alerts or successful clone."
echo "=== End of Test ==="