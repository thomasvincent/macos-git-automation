# Git Clone Automator Service for Mac

This service allows you to easily create a Git repository within a Finder folder on a Mac using Automator.

## Prerequisites
1. Install the `gh` command-line tool.
2. Install the `terminal-notifier` app (optional).

## Step 1: Create an Automator Service
1. Open Automator and select "New Service".
2. In the Service receives section, select "Folders" in "Finder".
3. From the Library/Utilities list on the left, drag and drop the "Execute Shell Script" action into the workspace.
4. Copy and paste the contents of the `git-clone-automator.sh` file into the script area.
5. Be sure to set the "Pass input:" selection to "as arguments".
6. Save the service with a descriptive name, such as "Clone Git Repository".

## Step 2: Use the Automator Service
1. Copy the repository URL to your clipboard, as you would on a Github repository page.
2. Right-click on the folder in which the repository will be stored.
3. Choose "Service" from the menu, then select "Clone Git Repository".

Note: If you have the `terminal-notifier` app installed, it will notify you when the cloning process is complete. Make sure to check the location of the `NOTIFIERAPP` value in the `git-clone-automator.sh` file and update it appropriately after installing `terminal-notifier`. You can find more information about `terminal-notifier` at https://github.com/alloy/terminal-notifier.
