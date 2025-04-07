<?php
/**
 * Class TestCalendarWidget
 *
 * @package Google_Calendar_Widget
 */

/**
 * Calendar widget test case.
 */
class TestCalendarWidget extends WP_UnitTestCase {

    /**
     * Test instance of the main plugin class.
     */
    private $plugin;

    /**
     * Test instance of the widget class.
     */
    private $widget;

    /**
     * Set up test environment.
     */
    public function setUp(): void {
        parent::setUp();
        
        // Create an instance of the plugin class
        $this->plugin = new Google_Calendar_Widget();
        
        // Create an instance of the widget class
        $this->widget = new Google_Calendar_Widget_Display();
    }

    /**
     * Test that the plugin initializes correctly.
     */
    public function test_plugin_initialization() {
        // Check that the plugin class exists
        $this->assertTrue(class_exists('Google_Calendar_Widget'));
        
        // Check that the widget class exists
        $this->assertTrue(class_exists('Google_Calendar_Widget_Display'));
        
        // Check that the plugin instance is created
        $this->assertInstanceOf('Google_Calendar_Widget', $this->plugin);
        
        // Check that the widget instance is created
        $this->assertInstanceOf('Google_Calendar_Widget_Display', $this->widget);
        
        // Check that the widget extends WP_Widget
        $this->assertInstanceOf('WP_Widget', $this->widget);
    }

    /**
     * Test the widget form method.
     */
    public function test_widget_form() {
        // Start output buffering
        ob_start();
        
        // Call the form method with default instance
        $this->widget->form(array());
        
        // Get the output
        $output = ob_get_clean();
        
        // Check that the form contains expected elements
        $this->assertStringContainsString('Calendar Title', $output);
        $this->assertStringContainsString('Maximum Results', $output);
        $this->assertStringContainsString('Expand Entries by Default', $output);
        $this->assertStringContainsString('Calendar ID 1', $output);
        $this->assertStringContainsString('Event Title Format', $output);
    }

    /**
     * Test the widget update method.
     */
    public function test_widget_update() {
        // Create test data
        $old_instance = array();
        $new_instance = array(
            'submit'      => '1',
            'title'       => 'Test Calendar',
            'url'         => 'test@example.com',
            'url2'        => 'test2@example.com',
            'url3'        => 'test3@example.com',
            'maxresults'  => '10',
            'autoexpand'  => 'true',
            'titleformat' => '[TITLE]',
        );
        
        // Call the update method
        $updated_instance = $this->widget->update($new_instance, $old_instance);
        
        // Check that the values are updated correctly
        $this->assertEquals('Test Calendar', $updated_instance['title']);
        $this->assertEquals('test@example.com', $updated_instance['url']);
        $this->assertEquals('test2@example.com', $updated_instance['url2']);
        $this->assertEquals('test3@example.com', $updated_instance['url3']);
        $this->assertEquals(10, $updated_instance['maxresults']);
        $this->assertTrue($updated_instance['autoexpand']);
        $this->assertEquals('[TITLE]', $updated_instance['titleformat']);
    }

    /**
     * Test the widget sanitization.
     */
    public function test_widget_sanitization() {
        // Create test data with potentially unsafe values
        $old_instance = array();
        $new_instance = array(
            'submit'      => '1',
            'title'       => '<script>alert("XSS")</script>Test Calendar',
            'url'         => 'test@example.com',
            'url2'        => 'test2@example.com',
            'url3'        => 'test3@example.com',
            'maxresults'  => 'not-a-number',
            'autoexpand'  => 'true',
            'titleformat' => '<script>alert("XSS")</script>[TITLE]<p>Test</p>',
        );
        
        // Call the update method
        $updated_instance = $this->widget->update($new_instance, $old_instance);
        
        // Check that the values are sanitized correctly
        $this->assertStringNotContainsString('<script>', $updated_instance['title']);
        $this->assertEquals(0, $updated_instance['maxresults']); // Invalid number should be converted to 0
        $this->assertStringNotContainsString('<script>', $updated_instance['titleformat']);
        $this->assertStringContainsString('<p>Test</p>', $updated_instance['titleformat']); // <p> tags are allowed
    }

    /**
     * Test the settings sanitization.
     */
    public function test_settings_sanitization() {
        // Create test data with potentially unsafe values
        $input = array(
            'apikey' => '<script>alert("XSS")</script>API_KEY_123',
        );
        
        // Call the sanitize_settings method
        $sanitized = $this->plugin->sanitize_settings($input);
        
        // Check that the values are sanitized correctly
        $this->assertStringNotContainsString('<script>', $sanitized['apikey']);
    }

    /**
     * Test the widget output.
     */
    public function test_widget_output() {
        // Set up test data
        $args = array(
            'before_widget' => '<div class="widget">',
            'after_widget'  => '</div>',
            'before_title'  => '<h2 class="widget-title">',
            'after_title'   => '</h2>',
        );
        
        $instance = array(
            'title'       => 'Test Calendar',
            'url'         => 'test@example.com',
            'maxresults'  => 5,
            'autoexpand'  => false,
            'titleformat' => '[STARTTIME - ][TITLE]',
        );
        
        // Start output buffering
        ob_start();
        
        // Call the widget method
        $this->widget->widget($args, $instance);
        
        // Get the output
        $output = ob_get_clean();
        
        // Check that the output contains expected elements
        $this->assertStringContainsString('<div class="widget">', $output);
        $this->assertStringContainsString('<h2 class="widget-title">', $output);
        $this->assertStringContainsString('Test Calendar', $output);
        $this->assertStringContainsString('google-calendar-widget-events', $output);
        $this->assertStringContainsString('google-calendar-widget-loading', $output);
        $this->assertStringContainsString('google_calendar_widget.loadCalendar', $output);
    }

    /**
     * Test the enqueue_scripts method.
     */
    public function test_enqueue_scripts() {
        // Call the enqueue_scripts method
        $this->plugin->enqueue_scripts();
        
        // Check that the scripts and styles are enqueued
        $this->assertTrue(wp_style_is('google-calendar-widget-style', 'registered'));
        $this->assertTrue(wp_script_is('date-js', 'registered'));
        $this->assertTrue(wp_script_is('wiky-js', 'registered'));
        $this->assertTrue(wp_script_is('google-calendar-widget', 'registered'));
        $this->assertTrue(wp_script_is('google-api-client', 'registered'));
    }

    /**
     * Test plugin constants are defined.
     */
    public function test_plugin_constants() {
        $this->assertTrue(defined('GOOGLE_CALENDAR_WIDGET_VERSION'));
        $this->assertTrue(defined('GOOGLE_CALENDAR_WIDGET_PATH'));
        $this->assertTrue(defined('GOOGLE_CALENDAR_WIDGET_URL'));
        $this->assertTrue(defined('GOOGLE_CALENDAR_WIDGET_BASENAME'));
    }

    /**
     * Test plugin action links.
     */
    public function test_plugin_action_links() {
        $links = array();
        $new_links = $this->plugin->add_plugin_action_links($links);
        
        $this->assertIsArray($new_links);
        $this->assertGreaterThan(0, count($new_links));
        $this->assertStringContainsString('Settings', $new_links[0]);
        $this->assertStringContainsString('options-general.php?page=google_calendar_widget_admin', $new_links[0]);
    }

    /**
     * Tear down test environment.
     */
    public function tearDown(): void {
        // Clean up
        unset($this->plugin);
        unset($this->widget);
        
        parent::tearDown();
    }
}
