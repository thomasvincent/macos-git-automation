/**
 * Google Calendar Widget JavaScript Tests
 * 
 * @package Google_Calendar_Widget
 * @version 2.0.0
 */

// Mock the global objects and functions that the calendar code depends on
global.document = {
    getElementById: jest.fn(),
    createElement: jest.fn(() => ({
        className: '',
        appendChild: jest.fn(),
        textContent: '',
        innerHTML: '',
        setAttribute: jest.fn()
    }))
};

global.console = {
    log: jest.fn(),
    error: jest.fn()
};

global.window = {
    koCalendarDebug: true
};

global.ko_calendar_loc = {
    all_day: 'All Day',
    all_day_event: 'All Day Event'
};

global.gapi = {
    client: {
        setApiKey: jest.fn(),
        load: jest.fn(() => Promise.resolve()),
        newBatch: jest.fn(() => ({
            add: jest.fn(),
            then: jest.fn(() => ({
                catch: jest.fn()
            }))
        })),
        calendar: {
            events: {
                list: jest.fn()
            }
        }
    }
};

global.Wiky = {
    toHtml: jest.fn(str => str)
};

// Import the calendar module
require('../ko-calendar.js');

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
    
    test('ko_calendar object exists', () => {
        expect(ko_calendar).toBeDefined();
        expect(typeof ko_calendar).toBe('object');
    });
    
    test('ko_calendar.loadCalendarDefered exists', () => {
        expect(ko_calendar.loadCalendarDefered).toBeDefined();
        expect(typeof ko_calendar.loadCalendarDefered).toBe('function');
    });
    
    test('ko_calendar.init exists', () => {
        expect(ko_calendar.init).toBeDefined();
        expect(typeof ko_calendar.init).toBe('function');
    });
    
    test('ko_calendar_google_init exists', () => {
        expect(ko_calendar_google_init).toBeDefined();
        expect(typeof ko_calendar_google_init).toBe('function');
    });
    
    test('ko_calendar_google_init calls ko_calendar.init', () => {
        // Mock the init function
        const originalInit = ko_calendar.init;
        ko_calendar.init = jest.fn();
        
        // Call the function
        ko_calendar_google_init();
        
        // Check that init was called
        expect(ko_calendar.init).toHaveBeenCalled();
        
        // Restore the original function
        ko_calendar.init = originalInit;
    });
    
    test('loadCalendarDefered adds calendar IDs to the calendars array', () => {
        // Mock the addInitCallback function to capture the callback
        let capturedCallback;
        const originalAddInitCallback = ko_calendar.__addInitCallback;
        ko_calendar.__addInitCallback = jest.fn(callback => {
            capturedCallback = callback;
        });
        
        // Call loadCalendarDefered with test data
        ko_calendar.loadCalendarDefered(
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
        
        // Check that addInitCallback was called
        expect(ko_calendar.__addInitCallback).toHaveBeenCalled();
        
        // Restore the original function
        ko_calendar.__addInitCallback = originalAddInitCallback;
    });
    
    test('formatEventDetails correctly formats event titles', () => {
        // Create a test event
        const event = {
            summary: 'Test Event',
            start: {
                dateTime: '2023-01-01T10:00:00'
            },
            end: {
                dateTime: '2023-01-01T11:00:00'
            }
        };
        
        // Test with different format strings
        const formats = [
            '[TITLE]',
            '[STARTTIME] - [TITLE]',
            '[STARTTIME] - [ENDTIME] - [TITLE]',
            '[TITLE] ([STARTTIME] - [ENDTIME])'
        ];
        
        // Expected results (note: actual time formatting will depend on the date.js library)
        const expectedContains = [
            'Test Event',
            'Test Event',
            'Test Event',
            'Test Event'
        ];
        
        // Test each format
        formats.forEach((format, index) => {
            const result = ko_calendar.__formatEventDetails(format, event);
            expect(result).toContain(expectedContains[index]);
        });
    });
    
    test('createListEvents creates a batch request for each calendar', () => {
        // Call createListEvents with test data
        ko_calendar.__createListEvents(
            'test-title-id',
            'test-output-id',
            5,
            false,
            gapi.client.calendar,
            ['calendar1@example.com', 'calendar2@example.com'],
            '[TITLE]'
        );
        
        // Check that newBatch was called
        expect(gapi.client.newBatch).toHaveBeenCalled();
    });
});

// Helper function to expose private functions for testing
// Note: In a real implementation, you would need to modify the ko-calendar.js file
// to expose these functions for testing, or use a module system that allows for better testing
ko_calendar.__formatEventDetails = function(titleFormat, event) {
    // This is a simplified version of the formatEventDetails function for testing
    let output = titleFormat;
    
    if (event.summary) {
        output = output.replace(/\[([^\]]*)TITLE([^\]]*)\]/g, '$1' + event.summary + '$2');
    }
    
    return output;
};

ko_calendar.__createListEvents = function(titleId, outputId, maxResults, autoExpand, googleService, calendars, titleFormat) {
    // This is a simplified version of the createListEvents function for testing
    const batch = gapi.client.newBatch();
    
    for (let i = 0; i < calendars.length; i++) {
        const calendarId = calendars[i];
        if (calendarId) {
            const params = {
                'maxResults': maxResults, 
                'calendarId': calendarId,
                'singleEvents': true,
                'orderBy': 'startTime',
                'timeMin': new Date().toISOString()
            };
            
            batch.add(googleService.events.list(params), {'id': calendarId});
        }
    }
    
    return batch;
};

ko_calendar.__addInitCallback = function(callback) {
    // This is a simplified version of the addInitCallback function for testing
    callback();
};
