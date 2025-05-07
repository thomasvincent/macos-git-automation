# Contributing to macOS Git Automation

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

1. A clear, descriptive title
2. A detailed description of the bug
3. Steps to reproduce the issue
4. Expected behavior
5. Actual behavior
6. Your environment information (macOS version, GitHub CLI version, etc.)
7. Screenshots if applicable

### Suggesting Features

Feature suggestions are welcome! Please create an issue with:

1. A clear, descriptive title
2. A detailed description of the proposed feature
3. Any relevant examples or mockups
4. Why this feature would be beneficial to the project

### Pull Requests

Follow these steps to submit a pull request:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm test` and `npm run lint`)
5. Commit your changes using a descriptive commit message (following [Conventional Commits](https://www.conventionalcommits.org/) format)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/thomasvincent/macos-git-automation.git
   cd macos-git-automation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. To run tests:
   ```bash
   npm test
   ```

4. To run linting:
   ```bash
   npm run lint
   ```

## Project Structure

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

## Coding Standards

### General

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Maintain existing documentation standards
- Update documentation when necessary

### AppleScript

- Use descriptive handler (function) names
- Document handlers with comments explaining parameters and return values
- Use error handling with try/on error blocks
- Follow macOS AppleScript best practices

### JavaScript (JXA)

- Follow standard JS best practices
- Use JSDoc for documentation
- Use modern JavaScript features (ES2022+)
- Properly handle errors

### Bash

- Follow [Google's Shell Style Guide](https://google.github.io/styleguide/shellguide.html)
- Use proper error handling
- Add helpful comments
- Use safe coding practices (quote variables, check command existence, etc.)

## Testing

- Test all implementations on macOS
- Ensure compatibility with the minimum supported macOS version (10.15 Catalina)
- Verify GitHub CLI integration works properly
- Test with various repository URLs (HTTP, HTTPS, SSH)

## Documentation

- Update the README.md if your changes affect the usage or features
- Keep the code comments up to date
- Update examples if necessary

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## Questions

If you have any questions about contributing, please open an issue or contact the project maintainer.

Thank you for contributing to macOS Git Automation!