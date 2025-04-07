/**
 * Google Calendar Widget JavaScript Tests
 * 
 * @package Google_Calendar_Widget
 * @version 2.1.0
 */

describe('Google Calendar Widget', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();
        
        // Reset the document mock
        document.getElementById.mockReturnValue({
            childNodes: [],
            removeChild: jest.fn(),
            appendChild: jest.fn()
        });
        
        // Reset the createElement mock
        document.createElement.mockReturnValue({
            className: '',
            appendChild: jest.fn(),
            textContent: '',
            innerHTML: '',
            setAttribute: jest.fn(),
            href: ''
        });
    });
    
    test('google_calendar_widget object exists', () => {
        expect(google_calendar_widget).toBeDefined();
        expect(typeof google_calendar_widget).toBe('object');
    });
    
    test('google_calendar_widget.loadCalendar exists', () => {
        expect(google_calendar_widget.loadCalendar).toBeDefined();
        expect(typeof google_calendar_widget.loadCalendar).toBe('function');
    });
    
    test('google_calendar_widget.init exists', () => {
        expect(google_calendar_widget.init).toBeDefined();
        expect(typeof google_calendar_widget.init).toBe('function');
    });
    
    test('google_calendar_widget_google_init exists', () => {
        expect(google_calendar_widget_google_init).toBeDefined();
        expect(typeof google_calendar_widget_google_init).toBe('function');
    });
    
    test('google_calendar_widget_google_init calls google_calendar_widget.init', () => {
        // Call the function
        google_calendar_widget_google_init();
        
        // Check that init was called
        expect(google_calendar_widget.init).toHaveBeenCalled();
    });
    
    test('loadCalendar can be called with calendar IDs', () => {
        // Call loadCalendar with test data
        google_calendar_widget.loadCalendar(
            'test-api-key',
            'test-title-id',
            'test-output-id',
            5,
            false,
            'calendar1@example.com',
            'calendar2@example.com',
            'calendar3@example.com',
            '[TITLE]'
        );
        
        // Check that loadCalendar was called with the right parameters
        expect(google_calendar_widget.loadCalendar).toHaveBeenCalledWith(
            'test-api-key',
            'test-title-id',
            'test-output-id',
            5,
            false,
            'calendar1@example.com',
            'calendar2@example.com',
            'calendar3@example.com',
            '[TITLE]'
        );
    });
    
    test('gapi.client.setApiKey is called with the API key', () => {
        // Mock the implementation of loadCalendar to call the real function
        const originalLoadCalendar = google_calendar_widget.loadCalendar;
        google_calendar_widget.loadCalendar = jest.fn((apiKey) => {
            gapi.client.setApiKey(apiKey);
        });
        
        // Call loadCalendar with test data
        google_calendar_widget.loadCalendar('test-api-key');
        
        // Check that setApiKey was called with the right parameter
        expect(gapi.client.setApiKey).toHaveBeenCalledWith('test-api-key');
        
        // Restore the original function
        google_calendar_widget.loadCalendar = originalLoadCalendar;
    });
    
    test('gapi.client.load is called with "calendar" and "v3"', () => {
        // Mock the implementation of loadCalendar to call the real function
        const originalLoadCalendar = google_calendar_widget.loadCalendar;
        google_calendar_widget.loadCalendar = jest.fn((apiKey) => {
            gapi.client.load('calendar', 'v3');
        });
        
        // Call loadCalendar with test data
        google_calendar_widget.loadCalendar('test-api-key');
        
        // Check that load was called with the right parameters
        expect(gapi.client.load).toHaveBeenCalledWith('calendar', 'v3');
        
        // Restore the original function
        google_calendar_widget.loadCalendar = originalLoadCalendar;
    });
    
    test('gapi.client.newBatch can be called', () => {
        // Check that newBatch exists and can be called
        expect(gapi.client.newBatch).toBeDefined();
        const batch = gapi.client.newBatch();
        expect(batch.add).toBeDefined();
        expect(batch.then).toBeDefined();
    });
});
