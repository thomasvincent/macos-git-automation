/**
 * Edge Case Tests for Google Calendar Widget
 * 
 * This file contains tests for edge cases and error handling in the Google Calendar Widget.
 * 
 * @package Google_Calendar_Widget
 * @version 2.1.0
 * @author Thomas Vincent (2025)
 * @copyright 2025 Thomas Vincent
 * @license GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.txt
 */

describe('Google Calendar Widget Edge Cases', () => {
  // Mock the global jQuery object
  global.jQuery = jest.fn();
  
  // Mock the global console object
  const originalConsole = global.console;
  beforeEach(() => {
    global.console = {
      log: jest.fn(),
      error: jest.fn()
    };
  });
  
  afterEach(() => {
    global.console = originalConsole;
  });
  
  // Mock the global window object
  global.window = {
    googleCalendarWidgetDebug: true
  };
  
  // Mock the global document object
  global.document = {
    getElementById: jest.fn(),
    createElement: jest.fn()
  };
  
  // Load the module
  const googleCalendarWidget = require('../assets/js/google-calendar-widget');
  
  describe('Error Handling', () => {
    test('should handle missing output element', () => {
      // Mock document.getElementById to return null
      document.getElementById.mockReturnValue(null);
      
      // Call the processFinalFeed function
      googleCalendarWidget.processFinalFeed([]);
      
      // Verify that an error was logged
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Could not find output element')
      );
    });
    
    test('should handle empty entries array', () => {
      // Mock document.getElementById to return a div
      const mockDiv = {
        childNodes: [],
        appendChild: jest.fn(),
        removeChild: jest.fn()
      };
      document.getElementById.mockReturnValue(mockDiv);
      
      // Call the processFinalFeed function with an empty array
      googleCalendarWidget.processFinalFeed([]);
      
      // Verify that a "No upcoming events" message was added
      expect(mockDiv.appendChild).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('div');
    });
    
    test('should handle null entries', () => {
      // Mock document.getElementById to return a div
      const mockDiv = {
        childNodes: [],
        appendChild: jest.fn(),
        removeChild: jest.fn()
      };
      document.getElementById.mockReturnValue(mockDiv);
      
      // Call the processFinalFeed function with null
      googleCalendarWidget.processFinalFeed(null);
      
      // Verify that a "No upcoming events" message was added
      expect(mockDiv.appendChild).toHaveBeenCalled();
      expect(document.createElement).toHaveBeenCalledWith('div');
    });
  });
  
  describe('API Error Handling', () => {
    test('should handle API errors', () => {
      // Mock gapi.client.load to return a rejected promise
      global.gapi = {
        client: {
          setApiKey: jest.fn(),
          load: jest.fn().mockReturnValue(Promise.reject(new Error('API Error')))
        }
      };
      
      // Mock document.getElementById to return a div
      const mockDiv = {
        childNodes: [],
        appendChild: jest.fn(),
        removeChild: jest.fn()
      };
      document.getElementById.mockReturnValue(mockDiv);
      
      // Call the loadCalendar function
      return googleCalendarWidget.loadCalendar(
        'API_KEY',
        'title-id',
        'output-id',
        10,
        false,
        'calendar-id'
      ).then(() => {
        // Verify that an error was logged
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('Error loading Google Calendar API')
        );
        
        // Verify that an error message was added to the output div
        expect(mockDiv.appendChild).toHaveBeenCalled();
        expect(document.createElement).toHaveBeenCalledWith('div');
      });
    });
    
    test('should handle calendar API errors', () => {
      // Mock gapi.client.load to return a resolved promise with an error
      global.gapi = {
        client: {
          setApiKey: jest.fn(),
          load: jest.fn().mockReturnValue(Promise.resolve({
            error: { message: 'Calendar API Error' }
          }))
        }
      };
      
      // Call the loadCalendar function
      return googleCalendarWidget.loadCalendar(
        'API_KEY',
        'title-id',
        'output-id',
        10,
        false,
        'calendar-id'
      ).then(() => {
        // Verify that an error was logged
        expect(console.error).toHaveBeenCalledWith(
          expect.stringContaining('Error loading calendar client API')
        );
      });
    });
  });
  
  describe('Date Handling', () => {
    test('should handle all-day events', () => {
      // Mock the getTime function to return a date-only time object
      const mockTime = {
        getDate: jest.fn().mockReturnValue(new Date()),
        isDateOnly: jest.fn().mockReturnValue(true)
      };
      
      // Mock the getStartTime and getEndTime functions
      googleCalendarWidget.getStartTime = jest.fn().mockReturnValue(mockTime);
      googleCalendarWidget.getEndTime = jest.fn().mockReturnValue(mockTime);
      
      // Mock document.createElement to return elements
      const mockDateRow = {
        className: '',
        appendChild: jest.fn()
      };
      const mockDateDisplay = {
        innerHTML: '',
        className: ''
      };
      document.createElement.mockImplementation((tag) => {
        if (tag === 'div') {
          return tag === 'div' ? mockDateRow : mockDateDisplay;
        }
      });
      
      // Call the buildDate function
      const result = googleCalendarWidget.buildDate({});
      
      // Verify that the date row was created correctly
      expect(result).toBe(mockDateRow);
      expect(mockDateRow.className).toBe('google-calendar-widget-entry-date-row');
      expect(mockDateDisplay.className).toBe('google-calendar-widget-entry-date-text');
      expect(mockDateDisplay.innerHTML).toBe('All Day Event');
    });
    
    test('should handle events with start and end times', () => {
      // Mock the getTime function to return a time object with date and time
      const mockStartTime = {
        getDate: jest.fn().mockReturnValue(new Date(2025, 3, 15, 10, 0, 0)),
        isDateOnly: jest.fn().mockReturnValue(false)
      };
      const mockEndTime = {
        getDate: jest.fn().mockReturnValue(new Date(2025, 3, 15, 11, 0, 0)),
        isDateOnly: jest.fn().mockReturnValue(false)
      };
      
      // Mock the getStartTime and getEndTime functions
      googleCalendarWidget.getStartTime = jest.fn().mockReturnValue(mockStartTime);
      googleCalendarWidget.getEndTime = jest.fn().mockReturnValue(mockEndTime);
      
      // Mock document.createElement to return elements
      const mockDateRow = {
        className: '',
        appendChild: jest.fn()
      };
      const mockDateDisplay = {
        innerHTML: '',
        className: ''
      };
      document.createElement.mockImplementation((tag) => {
        if (tag === 'div') {
          return tag === 'div' ? mockDateRow : mockDateDisplay;
        }
      });
      
      // Call the buildDate function
      const result = googleCalendarWidget.buildDate({});
      
      // Verify that the date row was created correctly
      expect(result).toBe(mockDateRow);
      expect(mockDateRow.className).toBe('google-calendar-widget-entry-date-row');
      expect(mockDateDisplay.className).toBe('google-calendar-widget-entry-date-text');
      // The innerHTML should contain the formatted date and time
      expect(mockDateDisplay.innerHTML).toContain('2025');
    });
  });
  
  describe('Event Formatting', () => {
    test('should format event details with title', () => {
      // Create a mock event with a title
      const event = {
        summary: 'Test Event'
      };
      
      // Call the formatEventDetails function
      const result = googleCalendarWidget.formatEventDetails('[TITLE]', event);
      
      // Verify that the title was included in the result
      expect(result).toBe('Test Event');
    });
    
    test('should format event details with start time', () => {
      // Mock the getTime function to return a time object
      const mockTime = {
        getDate: jest.fn().mockReturnValue(new Date(2025, 3, 15, 10, 0, 0)),
        isDateOnly: jest.fn().mockReturnValue(false)
      };
      
      // Create a mock event with start time
      const event = {
        summary: 'Test Event',
        start: {
          dateTime: '2025-04-15T10:00:00'
        }
      };
      
      // Mock the getStartTime function
      googleCalendarWidget.getStartTime = jest.fn().mockReturnValue(mockTime);
      
      // Call the formatEventDetails function
      const result = googleCalendarWidget.formatEventDetails('[STARTTIME]', event);
      
      // Verify that the start time was included in the result
      expect(result).toContain('10:00');
    });
    
    test('should format event details with all components', () => {
      // Mock the getTime function to return time objects
      const mockStartTime = {
        getDate: jest.fn().mockReturnValue(new Date(2025, 3, 15, 10, 0, 0)),
        isDateOnly: jest.fn().mockReturnValue(false)
      };
      const mockEndTime = {
        getDate: jest.fn().mockReturnValue(new Date(2025, 3, 15, 11, 0, 0)),
        isDateOnly: jest.fn().mockReturnValue(false)
      };
      
      // Create a mock event with title, start time, and end time
      const event = {
        summary: 'Test Event',
        start: {
          dateTime: '2025-04-15T10:00:00'
        },
        end: {
          dateTime: '2025-04-15T11:00:00'
        }
      };
      
      // Mock the getStartTime and getEndTime functions
      googleCalendarWidget.getStartTime = jest.fn().mockReturnValue(mockStartTime);
      googleCalendarWidget.getEndTime = jest.fn().mockReturnValue(mockEndTime);
      
      // Call the formatEventDetails function
      const result = googleCalendarWidget.formatEventDetails('[TITLE] from [STARTTIME] to [ENDTIME]', event);
      
      // Verify that all components were included in the result
      expect(result).toBe('Test Event from 10:00 AM to 11:00 AM');
    });
  });
});
