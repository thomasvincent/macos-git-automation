# This can be used to easily create a git repository within a Finder folder on a Mac
#
# You need to create an Automator service:
# - Select 'New Service' in Automator
# - Click on Service receives selected "Folders" in "Finder"
# - Select Library/Utilities from the list on the left, then drag and drop
# - Execute the Shell Script action in the workspace
# - Copy and paste the following script into the script area
# - Be sure to set the 'Pass input:' selection to "as arguments"
# - Save the service with a name that will make it easy to locate. I used "Clone Git Repo"
#
# To use:
# - Copy the path to the repository to your clipboard, as on a Github repository page
# - Right-click on the folder in which the repository will be stored
# - Choose "Service" from the menu, then "Git Clone Here" to copy the repository to the folder
#
# - If you have the terminal-notifier app installed, it'll let you know when it's done
#     https://github.com/alloy/terminal-notifier
#   As soon as terminal-notifier is installed, you should check the location of the NOTIFIERAPP value and update it appropriately

cd "$@"
REPOPATH=`pbpaste`
REPOFULL=$(basename "$REPOPATH")
REPONAME="${REPOFULL%.*}"
gh repo $REPOPATH

NOTIFIERAPP="/usr/local/bin/terminal-notifier"
if [ -e $NOTIFIERAPP ]
then
    $NOTIFIERAPP -title "Git Clone Completed" -message "Git repo '$REPONAME' has been cloned"
fi
