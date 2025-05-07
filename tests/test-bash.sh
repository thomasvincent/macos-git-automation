#!/bin/bash
#
# Test script for Bash Git Clone functionality
#

echo "=== Testing Bash Git Clone ==="
echo "This test will copy a test repository URL to the clipboard"
echo "and execute the Bash script."
echo

SCRIPT_PATH="../src/bash/git-clone-from-clipboard.sh"

if [ ! -f "$SCRIPT_PATH" ]; then
    echo "ERROR: Script not found at $SCRIPT_PATH"
    exit 1
fi

# Setup test repository URL
TEST_REPO="https://github.com/octocat/Hello-World.git"

echo "Setting clipboard to: $TEST_REPO"
echo -n "$TEST_REPO" | pbcopy

# Create temporary test directory
TEST_DIR=$(mktemp -d)
echo "Created temporary test directory: $TEST_DIR"

echo "Running Bash script..."
"$SCRIPT_PATH" "$TEST_DIR"

echo
echo "Test complete. Check $TEST_DIR for cloned repository."
echo "=== End of Test ==="