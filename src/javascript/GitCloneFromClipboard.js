#!/usr/bin/env osascript -l JavaScript
/**
 * @file GitCloneFromClipboard.js
 * @description Advanced Git repository cloning script for macOS
 * @author Thomas Vincent
 * @license MIT
 * @copyright Copyright (c) 2024 Thomas Vincent
 * @version 2.0.0
 */

/**
 * Main function to clone Git repository from clipboard URL
 * 
 * @param {Array} input - Input parameters (unused)
 * @param {Object} parameters - Parameters (unused)
 * @returns {undefined}
 */
function run(input, parameters) {
  const app = Application.currentApplication();
  app.includeStandardAdditions = true;
  
  try {
    // Get clipboard contents and validate
    const gitURL = getClipboardContents(app);
    if (!isValidGitURL(gitURL)) {
      displayErrorAlert(
        app, 
        "Invalid Git URL", 
        "The clipboard does not contain a valid Git repository URL. Please copy a URL starting with 'http', 'https', or 'git@'."
      );
      return;
    }
    
    // Extract repository name and prepare clone directory
    const repoName = extractRepoName(app, gitURL);
    const documentsPath = app.pathTo('documents').toString();
    const cloneDir = `${documentsPath}/${repoName}`;
    
    // Clone the repository
    const cloneResult = cloneRepository(app, gitURL, cloneDir);
    
    if (cloneResult.success) {
      // Reveal in Finder and notify user
      revealInFinder(cloneDir);
      displaySuccessNotification(app, repoName);
    } else {
      displayErrorAlert(app, "Clone Failed", cloneResult.errorMessage);
    }
  } catch (error) {
    displayErrorAlert(app, "Script Error", `An unexpected error occurred: ${error.message}`);
  }
}

/**
 * Gets the content of the clipboard
 * 
 * @param {Object} app - Application object with StandardAdditions
 * @returns {string} Clipboard content as text
 */
function getClipboardContents(app) {
  try {
    return app.clipboard() || "";
  } catch (error) {
    return "";
  }
}

/**
 * Validates if a string is a valid Git URL
 * 
 * @param {string} urlString - URL to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidGitURL(urlString) {
  if (!urlString) return false;
  
  // Check for HTTP/HTTPS URLs
  if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
    return true;
  }
  
  // Check for SSH URLs (git@github.com:user/repo.git)
  if (urlString.startsWith('git@') && urlString.includes(':')) {
    return true;
  }
  
  return false;
}

/**
 * Extracts repository name from Git URL
 * 
 * @param {Object} app - Application object with StandardAdditions
 * @param {string} urlString - Git repository URL
 * @returns {string} Sanitized repository name
 */
function extractRepoName(app, urlString) {
  try {
    // Use shell command to extract and sanitize the repo name
    const repoName = app.doShellScript(`basename ${app.quoted(urlString)} .git | tr -dc '[:alnum:]_-'`);
    
    // If somehow we got an empty string, use a default name
    if (!repoName) {
      return `git-repo-${new Date().toISOString().replace(/[^0-9]/g, '').substring(0, 14)}`;
    }
    
    return repoName;
  } catch (error) {
    // Fallback if shell command fails
    return `git-repo-${new Date().toISOString().replace(/[^0-9]/g, '').substring(0, 14)}`;
  }
}

/**
 * Clones the Git repository
 * 
 * @param {Object} app - Application object with StandardAdditions
 * @param {string} gitURL - Git repository URL
 * @param {string} targetDir - Target directory for clone
 * @returns {Object} Result object with success status and error message
 */
function cloneRepository(app, gitURL, targetDir) {
  try {
    // Create directory if it doesn't exist
    app.doShellScript(`mkdir -p ${app.quoted(targetDir)}`);
    
    // Clone repository using GitHub CLI
    app.doShellScript(`cd ${app.quoted(targetDir)} && gh repo clone ${app.quoted(gitURL)} .`);
    
    return { success: true, errorMessage: "" };
  } catch (error) {
    return { success: false, errorMessage: error.message };
  }
}

/**
 * Reveals a directory in Finder
 * 
 * @param {string} directoryPath - Path to reveal
 */
function revealInFinder(directoryPath) {
  const finder = Application('Finder');
  finder.reveal(Path(directoryPath));
  finder.activate();
}

/**
 * Displays an error alert
 * 
 * @param {Object} app - Application object with StandardAdditions
 * @param {string} title - Alert title
 * @param {string} message - Alert message
 */
function displayErrorAlert(app, title, message) {
  app.displayAlert(title, { message: message, as: "critical" });
}

/**
 * Displays a success notification
 * 
 * @param {Object} app - Application object with StandardAdditions
 * @param {string} repoName - Name of the cloned repository
 */
function displaySuccessNotification(app, repoName) {
  app.displayNotification(`Successfully cloned repository: ${repoName}`, {
    withTitle: "Git Clone Complete",
    soundName: "Glass"
  });
}