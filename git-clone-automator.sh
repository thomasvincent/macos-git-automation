#!/bin/bash

# Check if pbpaste command is available
if ! command -v pbpaste > /dev/null; then
  echo "Error: pbpaste command not found. Please make sure it is installed and available in the PATH."
  exit 1
fi

# Check if gh command is available
if ! command -v gh > /dev/null; then
  echo "Error: gh command not found. Please make sure it is installed and available in the PATH."
  exit 1
fi

# Get the repository URL from the clipboard
REPOPATH=$(pbpaste)

# Check if repository URL is not empty
if [ -z "$REPOPATH" ]; then
  echo "Error: Repository URL is empty. Please copy the repository URL to your clipboard and try again."
  exit 1
fi

# Change to the selected folder
cd "$@"

# Get the repository name from the URL
REPOFULL=$(basename "$REPOPATH")
REPONAME="${REPOFULL%.*}"

# Clone the repository using the gh command
gh repo "$REPOPATH"

# Check if terminal-notifier is available
NOTIFIERAPP="/usr/local/bin/terminal-notifier"
if [ -e "$NOTIFIERAPP" ]; then
  "$NOTIFIERAPP" -title "Git Clone Completed" -message "Git repo '$REPONAME' has been cloned"
fi
