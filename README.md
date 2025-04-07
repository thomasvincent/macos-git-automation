# Google Calendar Widget

A WordPress plugin that displays Google Calendar events in a sidebar widget.

[![CI](https://github.com/yourusername/google-calendar-widget/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/google-calendar-widget/actions/workflows/ci.yml)
[![Release](https://github.com/yourusername/google-calendar-widget/actions/workflows/release.yml/badge.svg)](https://github.com/yourusername/google-calendar-widget/actions/workflows/release.yml)

## Description

This plugin adds a sidebar widget containing an agenda from a Google Calendar. It displays upcoming events from one or more Google Calendars in a customizable format.

### Features

- Display events from multiple Google Calendars in a single widget
- Customize the number of events to display
- Format event titles with customizable templates
- Option to auto-expand event details
- Supports all-day events and multi-day events
- Internationalization support

## Installation

1. Upload all the files to the `/wp-content/plugins/google-calendar-widget` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Get a Google API Key from the [Developer Console](https://console.developers.google.com) and save it in the Google Calendar Widget Settings page.
4. Drag the 'Google Calendar' widget to your sidebar
5. Fill out the settings for each instance in your sidebar. You can get the calendar ID from your Google calendar settings.

### Getting a Google API Key

1. Go to [https://console.developers.google.com](https://console.developers.google.com)
2. Create or select a project for your web site
3. In the left sidebar, select **APIs & Services** then select **Library**
4. Search for "Calendar API" and select it
5. Click **Enable** to enable the Calendar API
6. In the left sidebar, select **Credentials**
7. Click on **Create Credentials** and choose **API key**
8. For security, restrict the API key to your domain under "Application restrictions"
9. Under "API restrictions", restrict the key to the Google Calendar API
10. Enter the key in the Google Calendar Widget Settings page

### Finding Your Calendar ID

1. Go to [Google Calendar](https://calendar.google.com/)
2. Click on the three dots next to the calendar name in the left sidebar
3. Select "Settings and sharing"
4. Scroll down to the "Integrate calendar" section
5. Copy the "Calendar ID" value (it will look like an email address)

## Usage

### Widget Settings

- **Calendar Title**: The title displayed above the calendar events
- **Maximum Results**: The maximum number of events to display
- **Expand Entries by Default**: If checked, event details will be expanded by default
- **Calendar ID 1**: The ID of the primary Google Calendar to display
- **Calendar ID 2 (Optional)**: The ID of a secondary Google Calendar to display
- **Calendar ID 3 (Optional)**: The ID of a tertiary Google Calendar to display
- **Event Title Format**: Format string for event titles

### Event Title Format

The "Event Title Format" option allows you to customize how event titles appear in the widget. You can use the following placeholders:

- `[TITLE]`: The event title
- `[STARTTIME]`: The start time (or "All Day" for all-day events)
- `[ENDTIME]`: The end time (not shown for all-day events)

Any characters included within the brackets will only be shown if the value exists. For example, `[ENDTIME - ]` will insert " - " after the end time, but only if there is an end time.

Examples:
- `[STARTTIME] - [TITLE]` becomes "6:00AM - Test Event" or "All Day - Test Event"
- `[STARTTIME] - [ENDTIME - ][TITLE]` becomes "6:00AM - 9:00AM - Test Event" or "All Day - Test Event"
- `[STARTTIME][ - ENDTIME] : [TITLE]` becomes "6:00AM - 9:00AM : Test Event" or "All Day : Test Event"
- `[STARTTIME][ - ENDTIME]<br>[TITLE]` becomes "6:00AM - 9:00AM<br>Test Event" or "All Day<br>Test Event"

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (for JavaScript testing)
- [Composer](https://getcomposer.org/) (for PHP testing)
- [WordPress](https://wordpress.org/) development environment
- [Git](https://git-scm.com/) (for version control)

### Setup

1. Clone the repository: `git clone https://github.com/yourusername/google-calendar-widget.git`
2. Install JavaScript dependencies: `npm install`
3. Install PHP dependencies: `composer install`
4. Set up the WordPress test environment: `bin/install-wp-tests.sh wordpress_test root root localhost latest`

### Testing

- Run JavaScript tests: `npm test`
- Run PHP tests: `composer test`
- Run PHP CodeSniffer: `composer phpcs`

### GitHub Flow

This project follows the [GitHub Flow](https://guides.github.com/introduction/flow/) branching strategy:

1. Create a branch from `main` for your feature or bugfix
2. Develop your changes on your branch
3. Create a pull request to merge your changes into `main`
4. After review and approval, your changes will be merged

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Release Process

Releases are managed by the project maintainers. To create a new release:

1. Run the release script: `bin/create-release.sh`
2. Follow the prompts to update version numbers and create a release branch
3. Create a pull request from the release branch to `main`
4. After merging, tag the release and push the tag to GitHub
5. The GitHub Actions workflow will automatically create a GitHub release and build the plugin

For more details, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

This plugin is licensed under the GPL v2 or later.

## Credits

- Original author: Kaz Okuda
- Uses [DateJS](http://www.datejs.com/) for date formatting
- Uses [Wiky.js](http://goessner.net/articles/wiky/) for wiki markup parsing
