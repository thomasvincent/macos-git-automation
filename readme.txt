=== Google Calendar Widget ===
Contributors: kazokuda
Tags: calendar, events, google, widget, google calendar
Requires at least: 5.6
Tested up to: 6.4
Stable tag: 2.1.0
Requires PHP: 7.2
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Display upcoming events from one or more Google Calendars in a customizable widget.

== Description ==

Google Calendar Widget allows you to display upcoming events from Google Calendars on your WordPress site. The widget is highly customizable and can display events from multiple calendars, with options for formatting and display.

= Features =

* Display upcoming events from one or more Google Calendars
* Customize the number of events to display
* Format event titles with customizable templates
* Option to expand event details by default
* Responsive design that works on all devices
* Accessibility-ready with keyboard navigation and screen reader support
* Internationalization support with translation-ready text

= Getting Started =

1. After installing and activating the plugin, go to Settings > Google Calendar Widget to configure your Google API key
2. Add the Google Calendar Widget to your sidebar through the 'Widgets' menu in WordPress
3. Configure the widget settings with your Google Calendar ID and display preferences

= Getting a Google API Key =

1. Go to the [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API for your project
4. Create an API key
5. Restrict the API key to your domain for security
6. Enter the API key in the plugin settings (Settings > Google Calendar Widget)

== Installation ==

1. Upload the `google-calendar-widget` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to Settings > Google Calendar Widget to configure your Google API key
4. Add the Google Calendar Widget to your sidebar through the 'Widgets' menu in WordPress

== Frequently Asked Questions ==

= How do I find my Google Calendar ID? =

1. Go to [Google Calendar](https://calendar.google.com/)
2. Click on the three dots next to the calendar name in the left sidebar
3. Select "Settings and sharing"
4. Scroll down to "Integrate calendar"
5. The Calendar ID is listed there (e.g., `example@group.calendar.google.com`)

= How do I make my Google Calendar public? =

1. Go to [Google Calendar](https://calendar.google.com/)
2. Click on the three dots next to the calendar name in the left sidebar
3. Select "Settings and sharing"
4. Under "Access permissions," check "Make available to public"
5. Save your changes

= Can I display events from multiple calendars? =

Yes, you can display events from up to three different calendars. Enter each Calendar ID in the widget settings, or separate multiple IDs with commas in a single field.

= How do I customize the event title format? =

Use the following placeholders in the Event Title Format field:
* `[TITLE]`: The event title
* `[STARTTIME]`: The start time (or "All Day" for all-day events)
* `[ENDTIME]`: The end time (blank for all-day events)

You can also include additional text within the brackets, which will only appear if the value exists. For example, `[STARTTIME - ][TITLE]` will display the start time followed by a dash and a space, but only if there is a start time.

= Why do I need a Google API key? =

The plugin uses the Google Calendar API to fetch events from your calendars. Google requires an API key to authenticate requests to their API. This helps them manage usage and prevent abuse.

= Is there a limit to how many events I can display? =

You can display up to 50 events in the widget. However, for performance reasons, we recommend keeping the number lower (5-10) for most use cases.

= Does this plugin work with private calendars? =

The plugin works with public calendars by default. To display events from private calendars, you would need to implement additional authentication methods, which are not currently supported in this version of the plugin.

== Screenshots ==

1. The Google Calendar Widget displaying upcoming events
2. Widget configuration options
3. Plugin settings page for Google API key

== Changelog ==

= 2.1.0 =
* Complete refactoring of the plugin for better performance and maintainability
* Added accessibility improvements for keyboard navigation and screen readers
* Enhanced error handling and user feedback
* Improved responsive design for mobile devices
* Added support for high contrast mode
* Added RTL language support
* Updated documentation

= 2.0.0 =
* Initial release of the refactored plugin

== Upgrade Notice ==

= 2.1.0 =
This update includes a complete refactoring of the plugin with improved performance, accessibility enhancements, and better error handling. After upgrading, please check your widget settings to ensure everything is configured correctly.

== Credits ==

* Original plugin by Kaz Okuda
* Uses the [Google Calendar API](https://developers.google.com/calendar)
