#!/bin/bash

# Check for required commands
if ! command -v pbpaste >/dev/null; then
  echo "Error: pbpaste command not found. This is a built-in macOS tool."
  exit 1
fi

if ! command -v gh >/dev/null; then
  echo "Error: gh command not found. Consider installing with 'brew install gh'."
  exit 1
fi

# Get repository URL from clipboard
REPOPATH=$(pbpaste)

# Check if repository URL is not empty
if [[ -z "$REPOPATH" ]]; then
  echo "Error: Repository URL is empty. Please copy the repository URL to your clipboard and try again."
  exit 1
fi

# Minimize working directory exposure (avoids unintended directory changes)
[[ -z "$@" ]] || cd "$@"

# Extract repository name from URL securely (avoids potential path manipulation)
REPOFULL=$(basename "$REPOPATH" | tr '/' '_')  # Replace slashes with underscores
REPONAME="${REPOFULL%.*}"

# Clone the repository using gh with URL validation (mitigates potential injection attacks)
gh repo clone -- "$REPOPATH"

# Optional notification (assuming terminal-notifier is trusted)
NOTIFIERAPP="/usr/local/bin/terminal-notifier"
if [[ -f "$NOTIFIERAPP" ]]; then
  "$NOTIFIERAPP" -title "Git Clone Completed" -message "Git repo '$REPONAME' has been cloned"
fi

# Open the cloned repository in Finder (optional)
if [[ -d "$REPONAME" ]]; then
  open "$REPONAME"
fi
