
# Git Clone Automator Scripts for Mac

This repository contains three scripts that allow you to easily clone a Git repository from a URL in your clipboard to a directory in your Documents folder on a Mac using Automator or the command line.

## Scripts

1. `CloneGitRepo.sh`: Bash script version
2. `GitCloneFromClipboard.scpt`: AppleScript version
3. `CloneGitRepoJXA.js`: JavaScript for Automation (JXA) version

## Features

- Validates the Git URL in the clipboard
- Extracts the repository name from the URL
- Clones the repository to a directory named after the repo in the Documents folder
- Opens the cloned repository directory in Finder (optional for the Bash version)
- Provides error alerts or messages for invalid URLs or cloning failures

## Prerequisites

1. Install the GitHub CLI (`gh`) command-line tool and authenticate it.
2. Ensure you have a valid Git repository URL in your clipboard.
3. For the Bash version, ensure you have the `pbpaste` command (built-in in macOS) and optionally `terminal-notifier` (installable via Homebrew) for notifications.

## Usage

### Bash Script
1. Copy the Git repository URL to your clipboard.
2. Run the `CloneGitRepo.sh` script from the command line:
`./CloneGitRepo.sh`

### AppleScript

1. Open the `GitCloneFromClipboard.scpt` file in Script Editor.
2. Copy the Git repository URL to your clipboard.
3. Run the script from Script Editor or save it as an application and run it.

### JavaScript for Automation (JXA)

1. Open Automator and create a new Application workflow.
2. Add a "Run JavaScript" action to the workflow.
3. Copy and paste the contents of the `CloneGitRepoJXA.js` file into the script area.
4. Save the Automator application with a descriptive name, such as "Clone Git Repository".
5. Copy the Git repository URL to your clipboard.
6. Run the saved Automator application.

### Troubleshooting

- If you encounter an "Invalid Git URL" error, ensure that the URL in your clipboard is a valid Git repository URL starting with "http" or "https".
- If the cloning process fails, check that you have the GitHub CLI (`gh`) installed and properly authenticated.
- For the Bash version, make sure you have the required commands (`pbpaste`, `gh`, and optionally `terminal-notifier`) installed.

### License

These scripts are released under the MIT License. See the [LICENSE](LICENSE) file for more information.

### Author

Thomas Vincent
