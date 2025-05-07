#!/bin/bash
#
# Simple test script for Git Clone Automator
#

# Set colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Testing Git Clone Automator Scripts ===${NC}"

# Make sure we're in the right directory
cd "$(dirname "$0")" || exit 1

# Test 1: Validate bash script syntax
echo "Test 1: Validating bash script syntax"
if bash -n dist/git-clone-automator.sh; then
  echo -e "${GREEN}✅ Bash script syntax is valid${NC}"
else
  echo -e "${RED}❌ Bash script syntax check failed${NC}"
  exit 1
fi

# Test 2: Check if AppleScript file exists
echo "Test 2: Checking AppleScript file"
if [ -f dist/GitCloneFromClipboard.applescript ]; then
  echo -e "${GREEN}✅ AppleScript file exists${NC}"
else
  echo -e "${RED}❌ AppleScript file not found${NC}"
  exit 1
fi

# Test 3: Check if JavaScript file exists
echo "Test 3: Checking JavaScript file"
if [ -f dist/CloneGitRepoJXA.js ]; then
  echo -e "${GREEN}✅ JavaScript file exists${NC}"
else
  echo -e "${RED}❌ JavaScript file not found${NC}"
  exit 1
fi

# Test 4: Check if Automator workflow exists
echo "Test 4: Checking Automator workflow"
if [ -f dist/CloneGitRepo.workflow ]; then
  echo -e "${GREEN}✅ Automator workflow exists${NC}"
else
  echo -e "${RED}❌ Automator workflow not found${NC}"
  exit 1
fi

echo -e "${GREEN}All tests passed!${NC}"
exit 0