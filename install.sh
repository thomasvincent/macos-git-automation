#!/bin/bash
#
# Install Git Clone Automator scripts
#
# This script installs the Git Clone Automator scripts
# and creates an Automator application for easy access.
#

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Git Clone Automator Installation ===${NC}"

# Check for GitHub CLI
if ! command -v gh >/dev/null; then
  echo -e "${YELLOW}GitHub CLI (gh) not found. Installing with Homebrew...${NC}"
  
  # Check for Homebrew
  if ! command -v brew >/dev/null; then
    echo -e "${RED}Homebrew not found. Please install Homebrew first:${NC}"
    echo -e "${YELLOW}  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\"${NC}"
    exit 1
  fi
  
  # Install GitHub CLI
  brew install gh
  
  # Check if installation was successful
  if ! command -v gh >/dev/null; then
    echo -e "${RED}Failed to install GitHub CLI. Please install it manually.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}GitHub CLI installed successfully.${NC}"
fi

# Check GitHub authentication
if ! gh auth status &>/dev/null; then
  echo -e "${YELLOW}GitHub CLI not authenticated. Please authenticate:${NC}"
  gh auth login
  
  # Check if authentication was successful
  if ! gh auth status &>/dev/null; then
    echo -e "${RED}GitHub CLI authentication failed. Please try again manually.${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}GitHub CLI authenticated successfully.${NC}"
fi

# Create applications directory if it doesn't exist
APPS_DIR="${HOME}/Applications/GitAutomation"
mkdir -p "$APPS_DIR"
echo -e "${GREEN}Created applications directory at $APPS_DIR${NC}"

# Copy scripts to applications directory
cp -f dist/GitCloneFromClipboard.applescript "$APPS_DIR/"
cp -f dist/CloneGitRepoJXA.js "$APPS_DIR/"
cp -f dist/git-clone-automator.sh "$APPS_DIR/"
chmod +x "$APPS_DIR/git-clone-automator.sh"
echo -e "${GREEN}Copied scripts to $APPS_DIR${NC}"

# Create AppleScript application
echo -e "${YELLOW}Creating AppleScript application...${NC}"
osacompile -o "$APPS_DIR/Git Clone.app" dist/GitCloneFromClipboard.applescript

# Success message
echo -e "${GREEN}=== Installation Complete ===${NC}"
echo -e "Scripts installed to: ${YELLOW}$APPS_DIR${NC}"
echo -e "Application created: ${YELLOW}$APPS_DIR/Git Clone.app${NC}"
echo
echo -e "${YELLOW}Usage:${NC}"
echo -e "  1. Copy a Git repository URL to your clipboard"
echo -e "  2. Run ${YELLOW}$APPS_DIR/Git Clone.app${NC} or use one of the scripts:"
echo -e "     - ${YELLOW}$APPS_DIR/git-clone-automator.sh${NC}"
echo -e "     - ${YELLOW}osascript $APPS_DIR/GitCloneFromClipboard.applescript${NC}"
echo -e "     - ${YELLOW}osascript -l JavaScript $APPS_DIR/CloneGitRepoJXA.js${NC}"
echo
echo -e "You can also add the application to your Dock for easier access."