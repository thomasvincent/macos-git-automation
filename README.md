# macOS Git Automation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS-lightgrey.svg)](https://developer.apple.com/macos/)
[![Node Version](https://img.shields.io/badge/Node.js-%E2%89%A516.0.0-green.svg)](https://nodejs.org/)
[![GitHub CLI](https://img.shields.io/badge/GitHub%20CLI-Required-orange.svg)](https://cli.github.com/)

> A suite of tools for automating Git operations on macOS through AppleScript, JavaScript for Automation (JXA), and Bash. Clone repositories from clipboard URLs with a single command or click.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Implementation Details](#implementation-details)
- [Development](#development)
- [Testing](#testing)
- [License](#license)
- [Contributing](#contributing)

## Features

- **Clone repositories from clipboard** - Copy a Git URL, run the script, and the repository is cloned
- **Smart directory creation** - Repository name is automatically extracted from the URL
- **Multiple implementation options:**
  - AppleScript for integration with macOS automation
  - JavaScript for Automation (JXA) for modern scripting
  - Bash script for command-line usage
- **Comprehensive error handling** - Validation of URLs and proper error reporting
- **macOS integration** - Uses native notifications and Finder integration
- **Secure implementation** - Input validation and safe command execution

## Prerequisites

- macOS 10.15 Catalina or later (recommended)
- [GitHub CLI](https://cli.github.com/) (`gh`) installed and authenticated
- For development: Node.js 16.0.0 or later

## Installation

### Option 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/thomasvincent/macos-git-automation.git

# Navigate to the directory
cd macos-git-automation

# Build the scripts
npm run build

# Make scripts executable (if needed)
chmod +x dist/*.sh
```

### Option 2: Download Individual Scripts

Download the specific implementation you need:

- [AppleScript Version](dist/GitCloneFromClipboard.applescript)
- [JavaScript Version](dist/GitCloneFromClipboard.js)
- [Bash Version](dist/git-clone-from-clipboard.sh)

## Usage

### AppleScript Version

1. Copy a Git repository URL to your clipboard (e.g., `https://github.com/username/repo.git`)
2. Run the AppleScript:
   - From Script Editor: Open `src/applescript/GitCloneFromClipboard.applescript` and click Run
   - From Terminal: `osascript src/applescript/GitCloneFromClipboard.applescript`
   - Or create an application from the script for easy access

### JavaScript (JXA) Version

1. Copy a Git repository URL to your clipboard
2. Run the JavaScript:
   - From Terminal: `osascript -l JavaScript src/javascript/GitCloneFromClipboard.js`
   - From Automator: Create a new "Run JavaScript" action and paste the script

### Bash Version

1. Copy a Git repository URL to your clipboard
2. Run the Bash script:
   ```bash
   ./src/bash/git-clone-from-clipboard.sh [optional_target_directory]
   ```
   If no target directory is specified, the repository will be cloned to `~/Documents/[repo-name]`

## Implementation Details

<details>
<summary><strong>AppleScript Implementation</strong></summary>

The AppleScript version uses AppleScript's native clipboard access and shell script execution to:

1. Get and validate the Git URL from clipboard
2. Extract the repository name
3. Clone using GitHub CLI
4. Open the result in Finder

```applescript
set gitURL to the clipboard as text
set repoName to do shell script "basename " & quoted form of gitURL & " .git | tr -dc '[:alnum:]_-'"
set cloneDir to (path to documents folder as text) & repoName
do shell script "gh repo clone " & quoted form of gitURL & space & quoted form of cloneDir
tell application "Finder" to reveal cloneDir as POSIX file
```
</details>

<details>
<summary><strong>JavaScript (JXA) Implementation</strong></summary>

The JavaScript for Automation version offers more robust error handling and modern syntax:

```javascript
const gitURL = Application.currentApplication().clipboard();
const repoName = extractRepoName(gitURL);
const cloneDir = `${app.pathTo('documents').toString()}/${repoName}`;
app.doShellScript(`gh repo clone ${app.quoted(gitURL)} ${app.quoted(cloneDir)}`);
const finder = Application('Finder');
finder.reveal(Path(cloneDir));
```
</details>

<details>
<summary><strong>Bash Implementation</strong></summary>

The Bash script version provides comprehensive logging, dependency checking, and more configuration options:

```bash
# Get URL from clipboard
git_url=$(pbpaste)

# Extract repo name
repo_name=$(basename "$git_url" .git | tr -dc '[:alnum:]_-')

# Determine target directory
target_dir="${DEFAULT_CLONE_DIR}/${repo_name}"

# Clone repository
gh repo clone "$git_url" "$target_dir"

# Show notification and open in Finder
osascript -e "display notification \"Repository cloned\" with title \"Git Clone Complete\""
open "$target_dir"
```
</details>

## Development

This project is structured for clean organization of multiple implementations:

```
macos-git-automation/
├── src/
│   ├── applescript/        # AppleScript implementation
│   ├── javascript/         # JavaScript (JXA) implementation
│   └── bash/               # Bash script implementation
├── tests/                  # Test scripts
├── original/               # Original script versions
├── package.json            # Node.js configuration
└── README.md               # Documentation
```

### Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/thomasvincent/macos-git-automation.git
   cd macos-git-automation
   ```

2. Install development dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   npm test
   ```

## Testing

Tests for each implementation are available in the `tests/` directory:

```bash
# Test all implementations
npm test

# Test specific implementation
npm run test:applescript
npm run test:javascript
npm run test:bash
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request