# API Documentation

This document provides detailed information about the functions, handlers, and parameters available in the macOS Git Automation tools.

## AppleScript Implementation

### Handlers

#### `run`

Main entry point of the script, executed when the script is run.

##### Returns

None - Displays alerts for feedback

##### Side Effects

- Reads the clipboard
- Creates a directory
- Clones a Git repository 
- Shows notifications
- Opens Finder

#### `getClipboardContents()`

Gets the content of the clipboard as text.

##### Returns

| Type | Description |
|------|-------------|
| String | Contents of the clipboard |

#### `isValidGitURL(urlString)`

Validates if a string is a valid Git URL.

##### Parameters 

| Name | Type | Description |
|------|------|-------------|
| urlString | String | URL to validate |

##### Returns

| Type | Description |
|------|-------------|
| Boolean | `true` if valid Git URL, `false` otherwise |

#### `extractRepoName(urlString)`

Extracts repository name from a Git URL.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| urlString | String | Git repository URL |

##### Returns

| Type | Description |
|------|-------------|
| String | Sanitized repository name |

#### `cloneRepository(gitURL, targetDir)`

Clones the Git repository.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| gitURL | String | Git repository URL |
| targetDir | String | Target directory for clone |

##### Returns

| Type | Description |
|------|-------------|
| Record | `{success: Boolean, errorMessage: String}` |

#### `revealInFinder(directoryPath)`

Reveals a directory in Finder.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| directoryPath | String | Path to reveal |

##### Returns

None

#### `displayErrorAlert(alertTitle, alertMessage)`

Displays an error alert.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| alertTitle | String | Alert title |
| alertMessage | String | Alert message |

##### Returns

None

#### `displaySuccessNotification(repoName)`

Displays a success notification.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| repoName | String | Name of the cloned repository |

##### Returns

None

## JavaScript (JXA) Implementation

### Functions

#### `run(input, parameters)`

Main function executed when the script runs.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| input | Array | Input parameters (unused) |
| parameters | Object | Parameters (unused) |

##### Returns

None

#### `getClipboardContents(app)`

Gets content from the clipboard.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| app | Object | Application object with StandardAdditions |

##### Returns

| Type | Description |
|------|-------------|
| String | Clipboard content as text |

#### `isValidGitURL(urlString)`

Validates if a string is a valid Git URL.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| urlString | String | URL to validate |

##### Returns

| Type | Description |
|------|-------------|
| Boolean | `true` if valid, `false` otherwise |

#### `extractRepoName(app, urlString)`

Extracts repository name from Git URL.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| app | Object | Application object with StandardAdditions |
| urlString | String | Git repository URL |

##### Returns

| Type | Description |
|------|-------------|
| String | Sanitized repository name |

#### `cloneRepository(app, gitURL, targetDir)`

Clones the Git repository.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| app | Object | Application object with StandardAdditions |
| gitURL | String | Git repository URL |
| targetDir | String | Target directory for clone |

##### Returns

| Type | Description |
|------|-------------|
| Object | `{ success: Boolean, errorMessage: String }` |

#### `revealInFinder(directoryPath)`

Reveals directory in Finder.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| directoryPath | String | Path to reveal |

##### Returns

None

#### `displayErrorAlert(app, title, message)`

Displays an error alert.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| app | Object | Application object with StandardAdditions |
| title | String | Alert title |
| message | String | Alert message |

##### Returns

None

#### `displaySuccessNotification(app, repoName)`

Displays a success notification.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| app | Object | Application object with StandardAdditions |
| repoName | String | Name of the cloned repository |

##### Returns

None

## Bash Implementation

### Functions

#### `main()`

Main function that coordinates the entire script execution.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| $@ | String... | Optional target directory |

##### Returns

None

#### `log(message)`

Logs a message to both console and log file.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| message | String | Message to log |

##### Returns

None

#### `error(message)`

Displays an error, shows notification, and exits.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| message | String | Error message |

##### Returns

None (exits script)

#### `check_dependencies()`

Checks for required dependencies.

##### Returns

None (exits on missing dependency)

#### `validate_git_url(url)`

Validates that the clipboard contains a Git URL.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| url | String | URL to validate |

##### Returns

None (exits on invalid URL)

#### `extract_repo_name(url)`

Extracts repository name from URL.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| url | String | Git repository URL |

##### Returns

| Type | Description |
|------|-------------|
| String | Sanitized repository name |

#### `clone_repository(url, target_dir)`

Clones the repository.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| url | String | Git repository URL |
| target_dir | String | Target directory path |

##### Returns

| Type | Description |
|------|-------------|
| Integer | 0 on success, non-zero on failure |

#### `show_success_notification(repo_name, target_dir)`

Shows success notification and opens directory.

##### Parameters

| Name | Type | Description |
|------|------|-------------|
| repo_name | String | Repository name |
| target_dir | String | Target directory path |

##### Returns

None