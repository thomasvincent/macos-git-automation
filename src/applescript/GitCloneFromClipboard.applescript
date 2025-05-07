#!/usr/bin/osascript
(*
    Script: Git Clone From Clipboard
    Version: 2.0.0
    
    -------------------------------------------
    
    Created By: Thomas Vincent
    Repository: https://github.com/thomasvincent/macos-git-automation
    License: MIT
    Copyright (c) 2024 Thomas Vincent
    
    -------------------------------------------
    
    Purpose:
        This script clones a Git repository from the URL in the clipboard
        to a directory in the user's Documents folder, and opens the
        resulting directory in Finder.
    
    Requirements:
        - macOS 10.15 Catalina or later recommended
        - GitHub CLI (gh) installed and authenticated
        - Valid Git repository URL in the clipboard
    
    Parameters:
        None - Script takes the URL from clipboard
    
    Return Value:
        None - Script displays alerts for feedback
    
    Usage Examples:
        1. Copy a Git repository URL to the clipboard
        2. Run this script via Script Editor or as an application
    
    -------------------------------------------
*)

-- Constants
property DEFAULT_CLONE_LOCATION : (path to documents folder as text)
property REGEX_ILLEGAL_CHARS : "[^[:alnum:]_-]"

-- Main handler
on run
    -- Get the URL from clipboard and validate it
    set gitURL to getClipboardContents()
    if not isValidGitURL(gitURL) then
        displayErrorAlert("Invalid Git URL", "The clipboard does not contain a valid Git repository URL. Please copy a URL starting with 'http', 'https', or 'git@'.")
        return
    end if
    
    -- Extract repository name and prepare directory
    set repoName to extractRepoName(gitURL)
    set cloneDir to DEFAULT_CLONE_LOCATION & repoName
    
    -- Clone the repository
    set cloneResult to cloneRepository(gitURL, cloneDir)
    
    if cloneResult's success then
        -- Open the cloned repository in Finder
        revealInFinder(cloneDir)
        displaySuccessNotification(repoName)
    else
        displayErrorAlert("Clone Failed", cloneResult's errorMessage)
    end if
end run

-- Get contents of the clipboard
-- @return: String - contents of the clipboard
on getClipboardContents()
    try
        return the clipboard as text
    on error
        return ""
    end try
end getClipboardContents

-- Validate if a string is a valid Git URL
-- @param urlString: String - the URL to validate
-- @return: Boolean - true if valid Git URL, false otherwise
on isValidGitURL(urlString)
    if urlString is "" then return false
    
    -- Test for common Git URL formats
    if urlString starts with "http://" or urlString starts with "https://" then
        return true
    end if
    
    if urlString starts with "git@" and urlString contains ":" then
        return true
    end if
    
    return false
end isValidGitURL

-- Extract repository name from Git URL
-- @param urlString: String - the Git URL
-- @return: String - sanitized repository name
on extractRepoName(urlString)
    try
        -- Use shell scripting to extract and sanitize repo name
        set repoName to do shell script "basename " & quoted form of urlString & " .git | tr -dc '[:alnum:]_-'"
        
        -- If somehow we got an empty string, use a default
        if repoName is "" then
            set repoName to "git-repo-" & (do shell script "date +%Y%m%d%H%M%S")
        end if
        
        return repoName
    on error
        -- Fallback if shell command fails
        set defaultName to "git-repo-" & (do shell script "date +%Y%m%d%H%M%S")
        return defaultName
    end try
end extractRepoName

-- Clone the Git repository
-- @param gitURL: String - the Git URL to clone
-- @param targetDir: String - the directory where to clone
-- @return: Record - {success: Boolean, errorMessage: String}
on cloneRepository(gitURL, targetDir)
    try
        -- Ensure parent directory exists
        do shell script "mkdir -p " & quoted form of targetDir
        
        -- Clone the repository using GitHub CLI
        do shell script "cd " & quoted form of targetDir & " && gh repo clone " & quoted form of gitURL & " ."
        
        return {success:true, errorMessage:""}
    on error errMsg
        return {success:false, errorMessage:errMsg}
    end try
end cloneRepository

-- Reveal a directory in Finder
-- @param directoryPath: String - path to the directory to reveal
on revealInFinder(directoryPath)
    tell application "Finder"
        reveal directoryPath as POSIX file
        activate
    end tell
end revealInFinder

-- Display an error alert
-- @param alertTitle: String - title of the alert
-- @param alertMessage: String - message to display
on displayErrorAlert(alertTitle, alertMessage)
    display alert alertTitle message alertMessage as warning
end displayErrorAlert

-- Display a success notification
-- @param repoName: String - name of the cloned repository
on displaySuccessNotification(repoName)
    display notification "Successfully cloned repository: " & repoName with title "Git Clone Complete"
end displaySuccessNotification