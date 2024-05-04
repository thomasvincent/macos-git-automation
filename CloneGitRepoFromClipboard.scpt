(*
    Script: GitCloneFromClipboard.scpt
    Description: Clones a Git repository from the URL in the clipboard using the GitHub CLI (gh).
    Author: Thomas Vincent
    Version: 1.0
    Date: 2024-05-27

    Usage:
    1. Copy the Git repository URL to the clipboard.
    2. Run this script.

    Requirements:
    - macOS with built-in 'pbpaste' command
    - GitHub CLI (gh) installed (https://cli.github.com/)

    Notes:
    - The cloned repository will be placed in the Documents folder.
    - The repository name is derived from the URL, with special characters removed.
    - The script displays an alert if the clipboard does not contain a valid Git URL.
    - The script reveals the cloned repository in the Finder upon successful cloning.
*)

on run {input, parameters}
    set gitURL to (the clipboard as text)
    
    if gitURL does not start with "http" then
        display alert "Invalid Git URL" message "Please copy a valid Git repository URL to the clipboard."
        return
    end if
    
    set repoName to do shell script "basename " & quoted form of gitURL & " .git | tr -dc '[:alnum:]_-'"
    set cloneDir to (path to documents folder as text) & repoName
    
    try
        do shell script "mkdir -m 700 " & quoted form of cloneDir
        do shell script "gh repo clone " & quoted form of gitURL & space & quoted form of cloneDir
    on error errMsg
        display alert "Clone Failed" message errMsg
        return
    end try
    
    tell application "Finder"
        reveal cloneDir as POSIX file
        activate
    end tell
end run
