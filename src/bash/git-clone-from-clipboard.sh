#!/bin/bash
#
# Git Clone From Clipboard
# Version: 2.0.0
#
# Description: Clone a Git repository from a URL in the clipboard
# Author: Thomas Vincent
# License: MIT
# Copyright (c) 2024 Thomas Vincent
#
# Requirements:
# - macOS 10.15 Catalina or later
# - GitHub CLI (gh) installed and authenticated
# - pbpaste command (built-in on macOS)
#
# Usage:
# ./git-clone-from-clipboard.sh [target_directory]
#
# If target_directory is not provided, the repository will be cloned
# into a directory with the repository name in the current working directory.

# Exit on any error
set -e

# Config
DEFAULT_CLONE_DIR="${HOME}/Documents"
LOG_FILE="${HOME}/.git-clone-from-clipboard.log"

# Enable logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Display error and exit
error() {
    log "ERROR: $1"
    osascript -e "display notification \"$1\" with title \"Git Clone Error\" sound name \"Basso\""
    exit 1
}

# Check for required dependencies
check_dependencies() {
    log "Checking dependencies..."
    
    if ! command -v pbpaste &> /dev/null; then
        error "pbpaste command not found. This tool requires macOS."
    fi
    
    if ! command -v gh &> /dev/null; then
        error "GitHub CLI (gh) not found. Install with 'brew install gh'."
    fi
    
    log "All dependencies available."
}

# Validate that the clipboard contains a Git URL
validate_git_url() {
    local url="$1"
    
    if [[ -z "$url" ]]; then
        error "Clipboard is empty. Please copy a Git repository URL."
    fi
    
    # Check if it's a valid Git URL (HTTP/HTTPS or SSH)
    if [[ ! "$url" =~ ^(https?://|git@) ]]; then
        error "Invalid Git URL: $url"
    fi
    
    log "URL validated: $url"
}

# Extract repository name from URL
extract_repo_name() {
    local url="$1"
    local repo_name
    
    # Extract repo name, remove .git extension if present
    repo_name=$(basename "$url" .git)
    
    # Sanitize name (remove characters that aren't alphanumeric, _, or -)
    repo_name=$(echo "$repo_name" | tr -dc '[:alnum:]_-')
    
    if [[ -z "$repo_name" ]]; then
        # Fallback if extraction fails
        repo_name="git-repo-$(date +%Y%m%d%H%M%S)"
    fi
    
    echo "$repo_name"
}

# Clone the repository
clone_repository() {
    local url="$1"
    local target_dir="$2"
    
    log "Cloning repository to: $target_dir"
    
    # Create directory if it doesn't exist
    mkdir -p "$target_dir"
    
    # Clone the repository
    if gh repo clone "$url" "$target_dir"; then
        log "Repository cloned successfully"
        return 0
    else
        error "Failed to clone repository: $url"
        return 1
    fi
}

# Show success notification
show_success_notification() {
    local repo_name="$1"
    local target_dir="$2"
    
    # Show success notification
    osascript -e "display notification \"Repository '$repo_name' cloned to: $target_dir\" with title \"Git Clone Complete\" sound name \"Glass\""
    
    # Open in Finder
    open "$target_dir"
}

# Main function
main() {
    log "=== Starting Git Clone From Clipboard ==="
    
    # Check dependencies
    check_dependencies
    
    # Get URL from clipboard
    local git_url
    git_url=$(pbpaste)
    
    # Validate URL
    validate_git_url "$git_url"
    
    # Determine target directory
    local repo_name
    repo_name=$(extract_repo_name "$git_url")
    
    local target_dir
    if [[ -n "$1" ]]; then
        # Use provided directory if given
        target_dir="$1/$repo_name"
    else
        # Otherwise use default
        target_dir="$DEFAULT_CLONE_DIR/$repo_name"
    fi
    
    # Clone repository
    clone_repository "$git_url" "$target_dir"
    
    # Show success notification
    show_success_notification "$repo_name" "$target_dir"
    
    log "=== Finished Git Clone From Clipboard ==="
}

# Run the main function with arguments
main "$@"