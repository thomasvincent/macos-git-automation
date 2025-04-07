<?php
/**
 * PHPUnit bootstrap file.
 *
 * @package Google_Calendar_Widget
 */

// Require composer autoloader.
require_once dirname( __DIR__ ) . '/vendor/autoload.php';

// Path to the WordPress tests bootstrap file.
$_tests_dir = getenv( 'WP_TESTS_DIR' );
if ( ! $_tests_dir ) {
	$_tests_dir = rtrim( sys_get_temp_dir(), '/\\' ) . '/wordpress-tests-lib';
}

// Give access to tests_add_filter() function.
require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
function _manually_load_plugin() {
	require dirname( __DIR__ ) . '/google-calendar-widget.php';
}

// Register the plugin with WordPress
tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

// Define a constant to skip database connection
define( 'WP_TESTS_SKIP_DB', true );

// Start up the WP testing environment.
require $_tests_dir . '/includes/bootstrap.php';

// Make sure the plugin is loaded
if ( ! class_exists( 'Google_Calendar_Widget' ) ) {
	require dirname( __DIR__ ) . '/includes/class-google-calendar-widget.php';
}

if ( ! class_exists( 'Google_Calendar_Widget_Display' ) ) {
	require dirname( __DIR__ ) . '/includes/class-google-calendar-widget-display.php';
}
