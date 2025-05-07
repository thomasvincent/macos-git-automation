# Git Clone Automator Scripts for macOS

A collection of scripts to easily clone a Git repository from a URL in your clipboard to a directory on your Mac.

## Scripts

1. `dist/git-clone-automator.sh`: Bash script version
2. `dist/GitCloneFromClipboard.applescript`: AppleScript version
3. `dist/CloneGitRepoJXA.js`: JavaScript for Automation (JXA) version

## Features

- Validates the Git URL in the clipboard
- Extracts the repository name from the URL
- Clones the repository to a directory in your Documents folder
- Opens the cloned repository directory in Finder
- Displays notifications for success or failure
- Support for both HTTP(S) and SSH repository URLs

## Prerequisites

- macOS 10.15 Catalina or later
- [GitHub CLI](https://cli.github.com/) (`gh`) installed and authenticated

## Installation

### Quick Installation

Run the installation script to install all scripts and create an application:

```bash
./install.sh
```

This will:
1. Check for and install GitHub CLI if needed
2. Create a directory at ~/Applications/GitAutomation
3. Copy all scripts to this directory
4. Create an AppleScript application for easy access

### Manual Installation

## Usage

### Bash Script

1. Copy a Git repository URL to your clipboard
2. Run the bash script:
   ```bash
   ./dist/git-clone-automator.sh [optional_target_directory]
   ```
   If no target directory is specified, repositories will be cloned to `~/Documents/`.

### AppleScript

1. Copy a Git repository URL to your clipboard
2. Run the AppleScript:
   - From Script Editor: Open `dist/GitCloneFromClipboard.applescript` and click Run
   - From Terminal: `osascript dist/GitCloneFromClipboard.applescript`
   - From Automator: Create a new Application workflow with a "Run AppleScript" action, paste the script content, and save

### JavaScript for Automation (JXA)

1. Copy a Git repository URL to your clipboard
2. Run the JavaScript:
   - From Terminal: `osascript -l JavaScript dist/CloneGitRepoJXA.js`
   - From Automator: Create a new Application workflow with a "Run JavaScript" action, paste the script content, and save

## Automator Integration

For quick access, you can create Automator workflows:

1. Open Automator and create a new Application
2. Choose either "Run AppleScript" or "Run JavaScript"
3. Paste the content of the respective script
4. Save the application and use it whenever you need to clone a repository

You can also assign keyboard shortcuts to your Automator applications using macOS System Settings > Keyboard > Keyboard Shortcuts > App Shortcuts.

## Error Handling

- Each script validates that the clipboard contains a valid Git repository URL
- Error alerts are displayed if the URL is invalid or if cloning fails
- Successful clones are confirmed with a notification

## License

This project is licensed under the MIT License.

## Author

Thomas Vincent