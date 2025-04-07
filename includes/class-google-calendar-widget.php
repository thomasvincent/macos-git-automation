<?php
/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * @since      2.1.0
 * @package    Google_Calendar_Widget
 * @subpackage Google_Calendar_Widget/includes
 * @author     Kaz Okuda
 * @author     Thomas Vincent (2025)
 * @copyright  2020-2023 Kaz Okuda
 * @copyright  2025 Thomas Vincent
 * @license    GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.txt
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

/**
 * The core plugin class.
 *
 * @since      2.1.0
 * @package    Google_Calendar_Widget
 * @subpackage Google_Calendar_Widget/includes
 * @author     Kaz Okuda
 * @author     Thomas Vincent (2025)
 */
class Google_Calendar_Widget {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    2.1.0
	 * @access   protected
	 * @var      Google_Calendar_Widget_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    2.1.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    2.1.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * @since    2.1.0
	 */
	public function __construct() {
		$this->version     = GOOGLE_CALENDAR_WIDGET_VERSION;
		$this->plugin_name = 'google-calendar-widget';
	}

	/**
	 * Run the plugin.
	 *
	 * Execute all of the hooks with WordPress.
	 *
	 * @since    2.1.0
	 */
	public function run() {
		// Load plugin text domain for translations.
		add_action( 'plugins_loaded', array( $this, 'load_plugin_textdomain' ) );
		
		// Register widget.
		add_action( 'widgets_init', array( $this, 'register_widget' ) );
		
		// Add admin menu.
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
		
		// Register admin settings.
		add_action( 'admin_init', array( $this, 'register_settings' ) );
		
		// Enqueue scripts and styles.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		
		// Add plugin action links.
		add_filter( 'plugin_action_links_' . GOOGLE_CALENDAR_WIDGET_BASENAME, array( $this, 'add_plugin_action_links' ) );
	}

	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    2.1.0
	 */
	public function load_plugin_textdomain() {
		load_plugin_textdomain(
			'google-calendar-widget',
			false,
			dirname( GOOGLE_CALENDAR_WIDGET_BASENAME ) . '/languages'
		);
	}

	/**
	 * Register the widget.
	 *
	 * @since    2.1.0
	 */
	public function register_widget() {
		register_widget( 'Google_Calendar_Widget_Display' );
	}

	/**
	 * Add admin menu.
	 *
	 * @since    2.1.0
	 */
	public function add_admin_menu() {
		add_options_page(
			__( 'Google Calendar Widget', 'google-calendar-widget' ),
			__( 'Google Calendar Widget', 'google-calendar-widget' ),
			'manage_options',
			'google_calendar_widget_admin',
			array( $this, 'display_admin_page' )
		);
	}

	/**
	 * Add plugin action links.
	 *
	 * @since    2.1.0
	 * @param    array $links    Plugin action links.
	 * @return   array           Plugin action links.
	 */
	public function add_plugin_action_links( $links ) {
		$settings_link = '<a href="' . admin_url( 'options-general.php?page=google_calendar_widget_admin' ) . '">' . __( 'Settings', 'google-calendar-widget' ) . '</a>';
		array_unshift( $links, $settings_link );
		return $links;
	}

	/**
	 * Display the admin settings page.
	 *
	 * @since    2.1.0
	 */
	public function display_admin_page() {
		?>
		<div class="wrap">
			<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
			<form action="options.php" method="POST">
				<?php
				settings_fields( 'google_calendar_widget_settings_group' );
				do_settings_sections( 'google_calendar_widget_admin' );
				submit_button();
				?>
			</form>
		</div>
		<?php
	}

	/**
	 * Register settings.
	 *
	 * @since    2.1.0
	 */
	public function register_settings() {
		register_setting(
			'google_calendar_widget_settings_group',
			'google_calendar_widget_settings',
			array( $this, 'sanitize_settings' )
		);

		add_settings_section(
			'google_calendar_widget_setting_section',
			__( 'Settings', 'google-calendar-widget' ),
			array( $this, 'settings_section_callback' ),
			'google_calendar_widget_admin'
		);

		add_settings_field(
			'google_calendar_widget_api_key',
			__( 'Google API Key', 'google-calendar-widget' ),
			array( $this, 'api_key_field_callback' ),
			'google_calendar_widget_admin',
			'google_calendar_widget_setting_section'
		);
	}

	/**
	 * Sanitize settings.
	 *
	 * @since    2.1.0
	 * @param    array $input    The input array to sanitize.
	 * @return   array           The sanitized input.
	 */
	public function sanitize_settings( $input ) {
		$sanitized_input = array();
		
		if ( isset( $input['apikey'] ) ) {
			$sanitized_input['apikey'] = sanitize_text_field( $input['apikey'] );
		}
		
		return $sanitized_input;
	}

	/**
	 * Settings section callback.
	 *
	 * @since    2.1.0
	 */
	public function settings_section_callback() {
		?>
		<p><?php _e( 'You need a unique Google API key for users of your web site to access Google services.', 'google-calendar-widget' ); ?></p>
		<ol>
			<li><?php _e( 'Go to <a href="https://console.developers.google.com" target="_blank">https://console.developers.google.com</a>.', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'Create or select a project for your web site', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'In the left sidebar, select <b>APIs & Services</b> then select <b>Library</b>', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'Search for "Calendar API" and select it', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'Click <b>Enable</b> to enable the Calendar API', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'In the left sidebar, select <b>Credentials</b>', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'Click on <b>Create Credentials</b> and choose <b>API key</b>', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'For security, restrict the API key to your domain under "Application restrictions"', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'Under "API restrictions", restrict the key to the Google Calendar API', 'google-calendar-widget' ); ?></li>
			<li><?php _e( 'Enter the key below', 'google-calendar-widget' ); ?></li>
		</ol>
		<?php
	}

	/**
	 * API key field callback.
	 *
	 * @since    2.1.0
	 */
	public function api_key_field_callback() {
		$settings = (array) get_option( 'google_calendar_widget_settings' );
		$api_key = isset( $settings['apikey'] ) ? esc_attr( $settings['apikey'] ) : '';
		
		echo '<input name="google_calendar_widget_settings[apikey]" size="40" type="text" value="' . $api_key . '" />';
	}

	/**
	 * Enqueue scripts and styles.
	 *
	 * @since    2.1.0
	 */
	public function enqueue_scripts() {
		if ( ! is_admin() ) {
			// Register and enqueue styles
			wp_enqueue_style(
				'google-calendar-widget-style',
				GOOGLE_CALENDAR_WIDGET_URL . 'assets/css/google-calendar-widget.css',
				array(),
				$this->version
			);

			// Register scripts
			wp_register_script(
				'date-js',
				GOOGLE_CALENDAR_WIDGET_URL . 'assets/js/date.js',
				array(),
				'alpha-1',
				true
			);

			wp_register_script(
				'wiky-js',
				GOOGLE_CALENDAR_WIDGET_URL . 'assets/js/wiky.js',
				array(),
				'1.0',
				true
			);

			wp_register_script(
				'google-calendar-widget',
				GOOGLE_CALENDAR_WIDGET_URL . 'assets/js/google-calendar-widget.js',
				array( 'date-js', 'jquery' ),
				$this->version,
				true
			);

			// Localize script
			$translation_array = array(
				'all_day'       => __( 'All Day', 'google-calendar-widget' ),
				'all_day_event' => __( 'All Day Event', 'google-calendar-widget' ),
				'ajax_url'      => admin_url( 'admin-ajax.php' ),
				'plugin_url'    => GOOGLE_CALENDAR_WIDGET_URL,
				'nonce'         => wp_create_nonce( 'google_calendar_widget_nonce' ),
			);
			
			wp_localize_script( 'google-calendar-widget', 'google_calendar_widget_loc', $translation_array );

			// Enqueue scripts
			wp_enqueue_script( 'wiky-js' );
			wp_enqueue_script( 'date-js' );
			wp_enqueue_script( 'google-calendar-widget' );
			
			// Google API client
			wp_enqueue_script(
				'google-api-client',
				'//apis.google.com/js/client.js?onload=google_calendar_widget_google_init',
				array( 'google-calendar-widget' ),
				null,
				true
			);
		}
	}
}
