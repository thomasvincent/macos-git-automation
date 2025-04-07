<?php
/**
 * Plugin Name: Google Calendar Widget
 * Plugin URI: http://notions.okuda.ca/wordpress-plugins/google-calendar-widget/
 * Description: This plugin adds a sidebar widget containing an agenda from a Google Calendar. It displays upcoming events from one or more Google Calendars in a customizable format.
 * Version: 2.0.0
 * Author: Kaz Okuda
 * Author URI: http://notions.okuda.ca
 * Text Domain: ko-calendar
 * Domain Path: /languages
 * License: GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package Google_Calendar_Widget
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Currently plugin version.
 * Start at version 2.0.0 and use SemVer - https://semver.org
 */
define( 'GOOGLE_CALENDAR_WIDGET_VERSION', '2.0.0' );

/**
 * The core plugin class.
 */
class Google_Calendar_Widget {

    /**
     * Initialize the plugin.
     */
    public function __construct() {
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
        
        // Add custom styles to head.
        add_action( 'wp_head', array( $this, 'add_custom_styles' ) );
    }

    /**
     * Load the plugin text domain for translation.
     */
    public function load_plugin_textdomain() {
        load_plugin_textdomain(
            'ko-calendar',
            false,
            basename( dirname( __FILE__ ) ) . '/languages'
        );
    }

    /**
     * Register the widget.
     */
    public function register_widget() {
        register_widget( 'Google_Calendar_Widget_Display' );
    }

    /**
     * Add admin menu.
     */
    public function add_admin_menu() {
        add_options_page(
            __( 'Google Calendar Widget', 'ko-calendar' ),
            __( 'Google Calendar Widget', 'ko-calendar' ),
            'manage_options',
            'google_calendar_widget_admin',
            array( $this, 'display_admin_page' )
        );
    }

    /**
     * Display the admin settings page.
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
     */
    public function register_settings() {
        register_setting(
            'google_calendar_widget_settings_group',
            'google_calendar_widget_settings',
            array( $this, 'sanitize_settings' )
        );

        add_settings_section(
            'google_calendar_widget_setting_section',
            __( 'Settings', 'ko-calendar' ),
            array( $this, 'settings_section_callback' ),
            'google_calendar_widget_admin'
        );

        add_settings_field(
            'google_calendar_widget_api_key',
            __( 'Google API Key', 'ko-calendar' ),
            array( $this, 'api_key_field_callback' ),
            'google_calendar_widget_admin',
            'google_calendar_widget_setting_section'
        );
    }

    /**
     * Sanitize settings.
     *
     * @param array $input The input array to sanitize.
     * @return array The sanitized input.
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
     */
    public function settings_section_callback() {
        ?>
        <p><?php _e( 'You need a unique Google API key for users of your web site to access Google services.', 'ko-calendar' ); ?></p>
        <ol>
            <li><?php _e( 'Go to <a href="https://console.developers.google.com" target="_blank">https://console.developers.google.com</a>.', 'ko-calendar' ); ?></li>
            <li><?php _e( 'Create or select a project for your web site', 'ko-calendar' ); ?></li>
            <li><?php _e( 'In the left sidebar, select <b>APIs & Services</b> then select <b>Library</b>', 'ko-calendar' ); ?></li>
            <li><?php _e( 'Search for "Calendar API" and select it', 'ko-calendar' ); ?></li>
            <li><?php _e( 'Click <b>Enable</b> to enable the Calendar API', 'ko-calendar' ); ?></li>
            <li><?php _e( 'In the left sidebar, select <b>Credentials</b>', 'ko-calendar' ); ?></li>
            <li><?php _e( 'Click on <b>Create Credentials</b> and choose <b>API key</b>', 'ko-calendar' ); ?></li>
            <li><?php _e( 'For security, restrict the API key to your domain under "Application restrictions"', 'ko-calendar' ); ?></li>
            <li><?php _e( 'Under "API restrictions", restrict the key to the Google Calendar API', 'ko-calendar' ); ?></li>
            <li><?php _e( 'Enter the key below', 'ko-calendar' ); ?></li>
        </ol>
        <?php
    }

    /**
     * API key field callback.
     */
    public function api_key_field_callback() {
        $settings = (array) get_option( 'google_calendar_widget_settings' );
        $api_key = isset( $settings['apikey'] ) ? esc_attr( $settings['apikey'] ) : '';
        
        echo '<input name="google_calendar_widget_settings[apikey]" size="40" type="text" value="' . $api_key . '" />';
    }

    /**
     * Enqueue scripts and styles.
     */
    public function enqueue_scripts() {
        if ( ! is_admin() ) {
            // Register and enqueue styles
            wp_enqueue_style(
                'google-calendar-widget-style',
                plugins_url( 'ko-calendar.css', __FILE__ ),
                array(),
                GOOGLE_CALENDAR_WIDGET_VERSION
            );

            // Register scripts
            wp_register_script(
                'date-js',
                plugins_url( 'date.js', __FILE__ ),
                array(),
                'alpha-1',
                true
            );

            wp_register_script(
                'wiky-js',
                plugins_url( 'wiky.js', __FILE__ ),
                array(),
                '1.0',
                true
            );

            wp_register_script(
                'google-calendar-widget',
                plugins_url( 'ko-calendar.js', __FILE__ ),
                array( 'date-js' ),
                GOOGLE_CALENDAR_WIDGET_VERSION,
                true
            );

            // Localize script
            $translation_array = array(
                'all_day'      => __( 'All Day', 'ko-calendar' ),
                'all_day_event' => __( 'All Day Event', 'ko-calendar' ),
                'ajax_url'     => admin_url( 'admin-ajax.php' ),
                'plugin_url'   => plugins_url( '', __FILE__ ),
            );
            
            wp_localize_script( 'google-calendar-widget', 'ko_calendar_loc', $translation_array );

            // Enqueue scripts
            wp_enqueue_script( 'wiky-js' );
            wp_enqueue_script( 'date-js' );
            wp_enqueue_script( 'google-calendar-widget' );
            
            // Google API client
            wp_enqueue_script(
                'google-api-client',
                '//apis.google.com/js/client.js?onload=ko_calendar_google_init',
                array( 'google-calendar-widget' ),
                null,
                true
            );
        }
    }

    /**
     * Add custom styles to head.
     */
    public function add_custom_styles() {
        // This is kept for backward compatibility
        // Modern approach would be to enqueue styles, but this maintains the original behavior
    }
}

/**
 * The widget class.
 */
class Google_Calendar_Widget_Display extends WP_Widget {

    /**
     * Constructor.
     */
    public function __construct() {
        $widget_ops = array(
            'classname'   => 'ko_calendar',
            'description' => __( 'Google Calendar Widget', 'ko-calendar' ),
        );
        
        $control_ops = array(
            'width'  => 400,
            'height' => 350,
        );
        
        parent::__construct(
            'ko_calendar',
            __( 'Google Calendar', 'ko-calendar' ),
            $widget_ops,
            $control_ops
        );
    }

    /**
     * Widget display.
     *
     * @param array $args     Widget arguments.
     * @param array $instance Saved values from database.
     */
    public function widget( $args, $instance ) {
        extract( $args );
        
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'Calendar', 'ko-calendar' );
        $url = ! empty( $instance['url'] ) ? $instance['url'] : 'developer-calendar@google.com';
        $url2 = ! empty( $instance['url2'] ) ? $instance['url2'] : '';
        $url3 = ! empty( $instance['url3'] ) ? $instance['url3'] : '';
        $max_results = ! empty( $instance['maxresults'] ) ? intval( $instance['maxresults'] ) : 5;
        $auto_expand = ! empty( $instance['autoexpand'] ) ? true : false;
        $title_format = ! empty( $instance['titleformat'] ) ? $instance['titleformat'] : '[STARTTIME - ][TITLE]';

        $title_id = $this->get_field_id( 'widget_title' );
        $event_id = $this->get_field_id( 'widget_events' );
        
        echo $before_widget;
        echo $before_title . '<div class="ko-calendar-widget-title" id="' . esc_attr( $title_id ) . '">' . esc_html( $title ) . '</div>' . $after_title;
        echo '<div class="ko-calendar-widget-events" id="' . esc_attr( $event_id ) . '">';
        echo '<div class="ko-calendar-widget-loading"><img class="ko-calendar-widget-image" src="' . esc_url( plugins_url( '/loading.gif', __FILE__ ) ) . '" alt="' . esc_attr__( 'Loading...', 'ko-calendar' ) . '"/></div>';
        echo '</div>';
        echo $after_widget;
        
        $settings = (array) get_option( 'google_calendar_widget_settings' );
        $api_key = isset( $settings['apikey'] ) ? esc_attr( $settings['apikey'] ) : '';

        ?>
        <script type="text/javascript">
            ko_calendar.loadCalendarDefered(
                '<?php echo esc_js( $api_key ); ?>',
                '<?php echo esc_js( $title_id ); ?>',
                '<?php echo esc_js( $event_id ); ?>',
                <?php echo esc_js( $max_results ); ?>,
                <?php echo $auto_expand ? 'true' : 'false'; ?>,
                '<?php echo esc_js( $url ); ?>',
                '<?php echo esc_js( $url2 ); ?>',
                '<?php echo esc_js( $url3 ); ?>',
                '<?php echo esc_js( $title_format ); ?>'
            );
        </script>
        <?php
    }

    /**
     * Update widget settings.
     *
     * @param array $new_instance New settings for this instance.
     * @param array $old_instance Old settings for this instance.
     * @return array Updated settings to save.
     */
    public function update( $new_instance, $old_instance ) {
        if ( ! isset( $new_instance['submit'] ) ) {
            return false;
        }
        
        $instance = $old_instance;
        $instance['title'] = sanitize_text_field( $new_instance['title'] );
        $instance['url'] = sanitize_text_field( $new_instance['url'] );
        $instance['url2'] = sanitize_text_field( $new_instance['url2'] );
        $instance['url3'] = sanitize_text_field( $new_instance['url3'] );
        $instance['maxresults'] = intval( $new_instance['maxresults'] );
        $instance['autoexpand'] = ! empty( $new_instance['autoexpand'] ) ? true : false;
        $instance['titleformat'] = wp_kses( $new_instance['titleformat'], array(
            'br' => array(),
            'p'  => array(),
        ) );
        
        return $instance;
    }

    /**
     * Widget settings form.
     *
     * @param array $instance Current settings.
     */
    public function form( $instance ) {
        $defaults = array(
            'title'       => '',
            'url'         => '',
            'url2'        => '',
            'url3'        => '',
            'maxresults'  => 5,
            'autoexpand'  => false,
            'titleformat' => '[STARTTIME - ][TITLE]',
        );
        
        $instance = wp_parse_args( (array) $instance, $defaults );
        
        $title = esc_attr( $instance['title'] );
        $url = esc_attr( $instance['url'] );
        $url2 = esc_attr( $instance['url2'] );
        $url3 = esc_attr( $instance['url3'] );
        $max_results = intval( $instance['maxresults'] );
        $auto_expand = ! empty( $instance['autoexpand'] ) ? true : false;
        $title_format = esc_attr( $instance['titleformat'] );

        $settings = (array) get_option( 'google_calendar_widget_settings' );
        $api_key = isset( $settings['apikey'] ) ? esc_attr( $settings['apikey'] ) : '';
        $api_key_missing = empty( $api_key );

        ?>
        <div>
            <p>
                <label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
                    <?php esc_html_e( 'Calendar Title:', 'ko-calendar' ); ?>
                </label>
                <input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" value="<?php echo esc_attr( $title ); ?>" />
            </p>
            
            <p>
                <label for="<?php echo esc_attr( $this->get_field_id( 'maxresults' ) ); ?>">
                    <?php esc_html_e( 'Maximum Results:', 'ko-calendar' ); ?>
                </label>
                <input type="number" class="small-text" id="<?php echo esc_attr( $this->get_field_id( 'maxresults' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'maxresults' ) ); ?>" value="<?php echo esc_attr( $max_results ); ?>" min="1" max="50" />
            </p>
            
            <p>
                <input type="checkbox" id="<?php echo esc_attr( $this->get_field_id( 'autoexpand' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'autoexpand' ) ); ?>" <?php checked( $auto_expand ); ?> value="true" />
                <label for="<?php echo esc_attr( $this->get_field_id( 'autoexpand' ) ); ?>">
                    <?php esc_html_e( 'Expand Entries by Default', 'ko-calendar' ); ?>
                </label>
            </p>
            
            <p>
                <label for="<?php echo esc_attr( $this->get_field_id( 'url' ) ); ?>">
                    <?php esc_html_e( 'Calendar ID 1:', 'ko-calendar' ); ?>
                </label>
                <input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'url' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'url' ) ); ?>" value="<?php echo esc_attr( $url ); ?>" />
                <small><?php esc_html_e( 'Example: example@group.calendar.google.com', 'ko-calendar' ); ?></small>
            </p>
            
            <p>
                <label for="<?php echo esc_attr( $this->get_field_id( 'url2' ) ); ?>">
                    <?php esc_html_e( 'Calendar ID 2 (Optional):', 'ko-calendar' ); ?>
                </label>
                <input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'url2' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'url2' ) ); ?>" value="<?php echo esc_attr( $url2 ); ?>" />
                <small><?php esc_html_e( 'You can separate multiple IDs with commas', 'ko-calendar' ); ?></small>
            </p>
            
            <p>
                <label for="<?php echo esc_attr( $this->get_field_id( 'url3' ) ); ?>">
                    <?php esc_html_e( 'Calendar ID 3 (Optional):', 'ko-calendar' ); ?>
                </label>
                <input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'url3' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'url3' ) ); ?>" value="<?php echo esc_attr( $url3 ); ?>" />
            </p>
            
            <p>
                <label for="<?php echo esc_attr( $this->get_field_id( 'titleformat' ) ); ?>">
                    <?php esc_html_e( 'Event Title Format:', 'ko-calendar' ); ?>
                </label>
                <input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'titleformat' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'titleformat' ) ); ?>" value="<?php echo esc_attr( $title_format ); ?>" />
                <small><?php esc_html_e( 'Use [TITLE], [STARTTIME], and [ENDTIME] placeholders', 'ko-calendar' ); ?></small>
            </p>
            
            <?php if ( $api_key_missing ) : ?>
                <p style="color:red">
                    <?php esc_html_e( 'WARNING: You must set a Google API Key before the widget will work.', 'ko-calendar' ); ?>
                    <a href="<?php echo esc_url( admin_url( 'options-general.php?page=google_calendar_widget_admin' ) ); ?>">
                        <?php esc_html_e( 'Add your API Key here.', 'ko-calendar' ); ?>
                    </a>
                </p>
            <?php endif; ?>
            
            <input type="hidden" name="<?php echo esc_attr( $this->get_field_name( 'submit' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'submit' ) ); ?>" value="1" />
        </div>
        <?php
    }
}

// Initialize the plugin
$google_calendar_widget = new Google_Calendar_Widget();
