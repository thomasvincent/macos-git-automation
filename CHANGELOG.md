# Changelog

All notable changes to the Google Calendar Widget plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-04-06

### Added
- Comprehensive PHPDoc comments throughout the codebase
- JavaScript tests using Jest
- PHP unit tests using PHPUnit
- Development environment setup with Composer and npm
- Detailed README.md with installation and usage instructions
- Standalone example with improved documentation
- Error handling for API requests with user-friendly error messages
- Responsive design for mobile devices
- Accessibility improvements

### Changed
- Refactored plugin to use modern PHP OOP practices
- Updated to use the latest WordPress Widget API
- Modernized JavaScript using ES6+ syntax
- Improved module pattern to avoid global namespace pollution
- Enhanced calendar event processing and display
- Better support for multiple calendars
- Improved CSS with flexbox and better visual hierarchy
- Updated standalone example to use the latest Google Calendar API

### Fixed
- Timezone handling for all-day events
- Duplicate event detection and removal
- Error handling for invalid API keys
- Calendar ID validation and error reporting

## [1.4.6] - 2014-11-17
- Added definition of ko_calendar_loc if it was not previously defined by the WordPress loc system to support stand alone pages.

## [1.4.5] - 2014-11-17
- Made URL of apis.google.com protocol relative so it will work with secure sites
- Added initial support for localization and an en_US localization database. I will include user contributed localizations.
- Added support for `<br>` and `<p>` tags inside of the title format to get more formatting options. For example "`[STARTTIME][ - ENDTIME]<br/>[TITLE]`"

## [1.4.4] - 2014-11-17
- Clearer error message if using an invalid API key.

## [1.4.3] - 2014-11-17
- Replaced WP_PLUGIN_URL with plugins_url for better compatibility
- Fixed typo in PHP which broke the Google Console URL in the settings screen
- Added error handling to batch query (it returns success even when parts of the batch fail, so we have to now check for individual errors).
- Entry will now expand with the time and location even if there is no description.
- Removed some unused code.

## [1.4.2] - 2014-11-17
- Use Google client API batching to query multiple calendars
- Added support for comma delimited calendar ids. You can now add multiple calendars in one entry by separating them with commas.
- Maintained the 3 ID entries for compatibility, but the second and third fields will likely be deprecated in the future and replaced with a single comma delimited list.

## [1.4.1] - 2014-11-17
- Fixed typo data->date
- Corrected the timezone for the all-day events

## [1.4.0] - 2014-11-17
- Upgraded to Google Calendar API v3
- Replaced calendar "URL" with calendar "ID"
- Added Setting for Google API Key. Each site must use a unique key.

## [1.3.2] - 2014-11-17
- Optimizations:
- Removed the version number from the Google jsapi so as to allow for more cache hits with other users.
- Removed the script includes from the admin interface.

## [1.3.1] - 2014-11-17
- Fixed problem where spaces around the loading GIF caused it to not stop when the calendar loads.

## [1.3] - 2014-11-17
- Remove duplicate events when showing multiple calendars that have been invited to the same event. If you create an event in calendar A and invite calendar B as a guest, then load them as "url" and "url2", the event should only appear once.
- Added "Event Title Format" option to specify a format string to customize event titles (with or without the time).
- Added error checking for errors that can occur when used offline (for test servers).
- Changed the layout of the widget settings to increase the size of the text boxes.

## [1.2] - 2014-11-17
- Added "Expand Entries by Default" checkbox to widget settings to auto expand all the calendar entries. If this is checked, the each calendar item will open as though they were clicked by default.

## [1.1] - 2014-11-17
- Added ability to support multiple feeds (up to 3) from one widget.

## [1.0] - 2014-11-17
- Initial release
