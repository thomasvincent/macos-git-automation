<?php
/**
 * Plugin Name: Google Calendar Widget
 * Plugin URI: http://notions.okuda.ca/wordpress-plugins/google-calendar-widget/
 * Description: This plugin adds a sidebar widget containing an agenda from a Google Calendar. It displays upcoming events from one or more Google Calendars in a customizable format.
 * Version: 2.1.0
 * Author: Kaz Okuda, Thomas Vincent
 * Author URI: http://notions.okuda.ca
 * Text Domain: google-calendar-widget
 * Domain Path: /languages
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 * Requires at least: 5.6
 * Requires PHP: 7.2
 *
 * @package Google_Calendar_Widget
 * @author Kaz Okuda
 * @author Thomas Vincent (2025)
 * @copyright 2020-2023 Kaz Okuda
 * @copyright 2025 Thomas Vincent
 * @license GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.txt
 */

/*
 * Google Calendar Widget - Display Google Calendar events in WordPress
 * Copyright (C) 2020-2023 Kaz Okuda
 * Copyright (C) 2025 Thomas Vincent
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 2.1.0 and use SemVer - https://semver.org
 */
define( 'GOOGLE_CALENDAR_WIDGET_VERSION', '2.1.0' );
define( 'GOOGLE_CALENDAR_WIDGET_PATH', plugin_dir_path( __FILE__ ) );
define( 'GOOGLE_CALENDAR_WIDGET_URL', plugin_dir_url( __FILE__ ) );
define( 'GOOGLE_CALENDAR_WIDGET_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Autoload classes from the 'includes' directory.
 *
 * @param string $class_name The name of the class to load.
 */
function google_calendar_widget_autoloader( $class_name ) {
	// If the class does not start with our prefix, return.
	if ( strpos( $class_name, 'Google_Calendar_Widget' ) !== 0 ) {
		return;
	}

	// Convert the class name to a file path.
	$class_file = str_replace( 'Google_Calendar_Widget\\', '', $class_name );
	$class_file = str_replace( '_', '-', $class_file );
	$class_file = strtolower( $class_file );
	$class_file = 'class-' . $class_file . '.php';

	// Get the file path.
	$file_path = GOOGLE_CALENDAR_WIDGET_PATH . 'includes/' . $class_file;

	// If the file exists, require it.
	if ( file_exists( $file_path ) ) {
		require_once $file_path;
	}
}

// Register the autoloader.
spl_autoload_register( 'google_calendar_widget_autoloader' );

// Include required files.
require_once GOOGLE_CALENDAR_WIDGET_PATH . 'includes/class-google-calendar-widget.php';
require_once GOOGLE_CALENDAR_WIDGET_PATH . 'includes/class-google-calendar-widget-display.php';

/**
 * Begins execution of the plugin.
 *
 * @since 2.1.0
 */
function run_google_calendar_widget() {
	// Initialize the plugin.
	$plugin = new Google_Calendar_Widget();
	$plugin->run();
}

// Run the plugin.
run_google_calendar_widget();
