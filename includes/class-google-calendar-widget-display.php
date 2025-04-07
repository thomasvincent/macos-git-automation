<?php
/**
 * The widget-specific functionality of the plugin.
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
 * The widget-specific functionality of the plugin.
 *
 * Defines the widget class, properties, and methods.
 *
 * @package    Google_Calendar_Widget
 * @subpackage Google_Calendar_Widget/includes
 * @author     Kaz Okuda
 * @author     Thomas Vincent (2025)
 */
class Google_Calendar_Widget_Display extends WP_Widget {

	/**
	 * Constructor.
	 *
	 * @since    2.1.0
	 */
	public function __construct() {
		$widget_ops = array(
			'classname'                   => 'google_calendar_widget',
			'description'                 => __( 'Google Calendar Widget', 'google-calendar-widget' ),
			'customize_selective_refresh' => true,
		);
		
		$control_ops = array(
			'width'  => 400,
			'height' => 350,
		);
		
		parent::__construct(
			'google_calendar_widget',
			__( 'Google Calendar', 'google-calendar-widget' ),
			$widget_ops,
			$control_ops
		);
	}

	/**
	 * Widget display.
	 *
	 * @since    2.1.0
	 * @param    array $args     Widget arguments.
	 * @param    array $instance Saved values from database.
	 */
	public function widget( $args, $instance ) {
		// Extract the widget arguments.
		extract( $args );
		
		// Get the widget settings.
		$title = ! empty( $instance['title'] ) ? apply_filters( 'widget_title', $instance['title'] ) : __( 'Calendar', 'google-calendar-widget' );
		$url = ! empty( $instance['url'] ) ? $instance['url'] : 'developer-calendar@google.com';
		$url2 = ! empty( $instance['url2'] ) ? $instance['url2'] : '';
		$url3 = ! empty( $instance['url3'] ) ? $instance['url3'] : '';
		$max_results = ! empty( $instance['maxresults'] ) ? intval( $instance['maxresults'] ) : 5;
		$auto_expand = ! empty( $instance['autoexpand'] ) ? true : false;
		$title_format = ! empty( $instance['titleformat'] ) ? $instance['titleformat'] : '[STARTTIME - ][TITLE]';

		// Generate unique IDs for this widget instance.
		$title_id = $this->get_field_id( 'widget_title' );
		$event_id = $this->get_field_id( 'widget_events' );
		
		// Output the widget.
		echo $before_widget;
		
		if ( $title ) {
			echo $before_title . '<div class="google-calendar-widget-title" id="' . esc_attr( $title_id ) . '">' . esc_html( $title ) . '</div>' . $after_title;
		}
		
		echo '<div class="google-calendar-widget-events" id="' . esc_attr( $event_id ) . '">';
		echo '<div class="google-calendar-widget-loading"><img class="google-calendar-widget-image" src="' . esc_url( GOOGLE_CALENDAR_WIDGET_URL . 'assets/images/loading.gif' ) . '" alt="' . esc_attr__( 'Loading...', 'google-calendar-widget' ) . '"/></div>';
		echo '</div>';
		
		echo $after_widget;
		
		// Get the API key from settings.
		$settings = (array) get_option( 'google_calendar_widget_settings' );
		$api_key = isset( $settings['apikey'] ) ? esc_attr( $settings['apikey'] ) : '';

		// If no API key is set, display an error message.
		if ( empty( $api_key ) ) {
			?>
			<script type="text/javascript">
				document.addEventListener('DOMContentLoaded', function() {
					const eventDiv = document.getElementById('<?php echo esc_js( $event_id ); ?>');
					if (eventDiv) {
						eventDiv.innerHTML = '<div class="google-calendar-widget-error"><?php echo esc_js( __( 'Error: Google API Key is not set. Please configure it in the plugin settings.', 'google-calendar-widget' ) ); ?></div>';
					}
				});
			</script>
			<?php
			return;
		}

		// Initialize the calendar.
		?>
		<script type="text/javascript">
			document.addEventListener('DOMContentLoaded', function() {
				google_calendar_widget.loadCalendar(
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
			});
		</script>
		<?php
	}

	/**
	 * Update widget settings.
	 *
	 * @since    2.1.0
	 * @param    array $new_instance New settings for this instance.
	 * @param    array $old_instance Old settings for this instance.
	 * @return   array               Updated settings to save.
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
	 * @since    2.1.0
	 * @param    array $instance Current settings.
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
		<div class="google-calendar-widget-form">
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
					<?php esc_html_e( 'Calendar Title:', 'google-calendar-widget' ); ?>
				</label>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" value="<?php echo esc_attr( $title ); ?>" />
			</p>
			
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'maxresults' ) ); ?>">
					<?php esc_html_e( 'Maximum Results:', 'google-calendar-widget' ); ?>
				</label>
				<input type="number" class="small-text" id="<?php echo esc_attr( $this->get_field_id( 'maxresults' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'maxresults' ) ); ?>" value="<?php echo esc_attr( $max_results ); ?>" min="1" max="50" />
				<span class="description"><?php esc_html_e( 'Number of events to display (1-50)', 'google-calendar-widget' ); ?></span>
			</p>
			
			<p>
				<input type="checkbox" id="<?php echo esc_attr( $this->get_field_id( 'autoexpand' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'autoexpand' ) ); ?>" <?php checked( $auto_expand ); ?> value="true" />
				<label for="<?php echo esc_attr( $this->get_field_id( 'autoexpand' ) ); ?>">
					<?php esc_html_e( 'Expand Entries by Default', 'google-calendar-widget' ); ?>
				</label>
			</p>
			
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'url' ) ); ?>">
					<?php esc_html_e( 'Calendar ID 1:', 'google-calendar-widget' ); ?>
				</label>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'url' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'url' ) ); ?>" value="<?php echo esc_attr( $url ); ?>" />
				<small><?php esc_html_e( 'Example: example@group.calendar.google.com', 'google-calendar-widget' ); ?></small>
			</p>
			
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'url2' ) ); ?>">
					<?php esc_html_e( 'Calendar ID 2 (Optional):', 'google-calendar-widget' ); ?>
				</label>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'url2' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'url2' ) ); ?>" value="<?php echo esc_attr( $url2 ); ?>" />
				<small><?php esc_html_e( 'You can separate multiple IDs with commas', 'google-calendar-widget' ); ?></small>
			</p>
			
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'url3' ) ); ?>">
					<?php esc_html_e( 'Calendar ID 3 (Optional):', 'google-calendar-widget' ); ?>
				</label>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'url3' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'url3' ) ); ?>" value="<?php echo esc_attr( $url3 ); ?>" />
			</p>
			
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'titleformat' ) ); ?>">
					<?php esc_html_e( 'Event Title Format:', 'google-calendar-widget' ); ?>
				</label>
				<input type="text" class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'titleformat' ) ); ?>" name="<?php echo esc_attr( $this->get_field_name( 'titleformat' ) ); ?>" value="<?php echo esc_attr( $title_format ); ?>" />
				<small><?php esc_html_e( 'Use [TITLE], [STARTTIME], and [ENDTIME] placeholders', 'google-calendar-widget' ); ?></small>
			</p>
			
			<?php if ( $api_key_missing ) : ?>
				<p class="google-calendar-widget-error">
					<?php esc_html_e( 'WARNING: You must set a Google API Key before the widget will work.', 'google-calendar-widget' ); ?>
					<a href="<?php echo esc_url( admin_url( 'options-general.php?page=google_calendar_widget_admin' ) ); ?>">
						<?php esc_html_e( 'Add your API Key here.', 'google-calendar-widget' ); ?>
					</a>
				</p>
			<?php endif; ?>
			
			<input type="hidden" name="<?php echo esc_attr( $this->get_field_name( 'submit' ) ); ?>" id="<?php echo esc_attr( $this->get_field_id( 'submit' ) ); ?>" value="1" />
		</div>
		<?php
	}
}
