#!/bin/bash
#
# Test script for AppleScript Git Clone functionality
#

echo "=== Testing AppleScript Git Clone ==="
echo "This test will copy a test repository URL to the clipboard"
echo "and execute the AppleScript."
echo

SCRIPT_PATH="../src/applescript/GitCloneFromClipboard.applescript"

if [ ! -f "$SCRIPT_PATH" ]; then
    echo "ERROR: Script not found at $SCRIPT_PATH"
    exit 1
fi

# Setup test repository URL
TEST_REPO="https://github.com/octocat/Hello-World.git"

echo "Setting clipboard to: $TEST_REPO"
echo -n "$TEST_REPO" | pbcopy

echo "Running AppleScript..."
osascript "$SCRIPT_PATH"

echo
echo "Test complete. Check for any error alerts or successful clone."
echo "=== End of Test ==="