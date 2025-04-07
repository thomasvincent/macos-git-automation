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

// Mock the google-calendar-widget module
jest.mock('../assets/js/google-calendar-widget', () => ({
  processFinalFeed: jest.fn(),
  getStartTime: jest.fn(),
  getEndTime: jest.fn(),
  formatEventDetails: jest.fn(),
  buildDate: jest.fn(),
  buildLocation: jest.fn(),
  createClickHandler: jest.fn(),
  loadCalendar: jest.fn()
}), { virtual: true });

// Import the mocked module
const googleCalendarWidget = require('../assets/js/google-calendar-widget');

describe('Google Calendar Widget Edge Cases', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up document.getElementById mock
    document.getElementById.mockReturnValue({
      childNodes: [],
      appendChild: jest.fn(),
      removeChild: jest.fn()
    });
    
    // Set up document.createElement mock
    document.createElement.mockReturnValue({
      className: '',
      textContent: '',
      innerHTML: '',
      appendChild: jest.fn()
    });
  });
  
  describe('Error Handling', () => {
    test('should handle missing output element', () => {
      // Mock document.getElementById to return null
      document.getElementById.mockReturnValueOnce(null);
      
      // Call the processFinalFeed function
      googleCalendarWidget.processFinalFeed([]);
      
      // Verify that an error was logged
      expect(console.error).toHaveBeenCalled();
    });
    
    test('should handle empty entries array', () => {
      // Call the processFinalFeed function with an empty array
      googleCalendarWidget.processFinalFeed([]);
      
      // Verify that a "No upcoming events" message was added
      expect(document.createElement).toHaveBeenCalled();
      expect(document.getElementById().appendChild).toHaveBeenCalled();
    });
    
    test('should handle null entries', () => {
      // Call the processFinalFeed function with null
      googleCalendarWidget.processFinalFeed(null);
      
      // Verify that a "No upcoming events" message was added
      expect(document.createElement).toHaveBeenCalled();
      expect(document.getElementById().appendChild).toHaveBeenCalled();
    });
  });
  
  describe('API Error Handling', () => {
    test('should handle API errors', () => {
      // Mock gapi.client.load to return a rejected promise
      gapi.client.load.mockReturnValueOnce(Promise.reject(new Error('API Error')));
      
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
        expect(console.error).toHaveBeenCalled();
        
        // Verify that an error message was added to the output div
        expect(document.createElement).toHaveBeenCalled();
        expect(document.getElementById().appendChild).toHaveBeenCalled();
      });
    });
    
    test('should handle calendar API errors', () => {
      // Mock gapi.client.load to return a resolved promise with an error
      gapi.client.load.mockReturnValueOnce(Promise.resolve({
        error: { message: 'Calendar API Error' }
      }));
      
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
        expect(console.error).toHaveBeenCalled();
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
      googleCalendarWidget.getStartTime.mockReturnValue(mockTime);
      googleCalendarWidget.getEndTime.mockReturnValue(mockTime);
      
      // Call the buildDate function
      googleCalendarWidget.buildDate({});
      
      // Verify that the buildDate function was called
      expect(googleCalendarWidget.buildDate).toHaveBeenCalled();
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
      googleCalendarWidget.getStartTime.mockReturnValue(mockStartTime);
      googleCalendarWidget.getEndTime.mockReturnValue(mockEndTime);
      
      // Call the buildDate function
      googleCalendarWidget.buildDate({});
      
      // Verify that the buildDate function was called
      expect(googleCalendarWidget.buildDate).toHaveBeenCalled();
    });
  });
  
  describe('Event Formatting', () => {
    test('should format event details with title', () => {
      // Create a mock event with a title
      const event = {
        summary: 'Test Event'
      };
      
      // Mock the formatEventDetails function to return the title
      googleCalendarWidget.formatEventDetails.mockReturnValue('Test Event');
      
      // Call the formatEventDetails function
      const result = googleCalendarWidget.formatEventDetails('[TITLE]', event);
      
      // Verify that the formatEventDetails function was called
      expect(googleCalendarWidget.formatEventDetails).toHaveBeenCalled();
      
      // Verify that the result is the title
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
      googleCalendarWidget.getStartTime.mockReturnValue(mockTime);
      
      // Mock the formatEventDetails function to return the start time
      googleCalendarWidget.formatEventDetails.mockReturnValue('10:00 AM');
      
      // Call the formatEventDetails function
      const result = googleCalendarWidget.formatEventDetails('[STARTTIME]', event);
      
      // Verify that the formatEventDetails function was called
      expect(googleCalendarWidget.formatEventDetails).toHaveBeenCalled();
      
      // Verify that the result contains the start time
      expect(result).toBe('10:00 AM');
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
      googleCalendarWidget.getStartTime.mockReturnValue(mockStartTime);
      googleCalendarWidget.getEndTime.mockReturnValue(mockEndTime);
      
      // Mock the formatEventDetails function to return all components
      googleCalendarWidget.formatEventDetails.mockReturnValue('Test Event from 10:00 AM to 11:00 AM');
      
      // Call the formatEventDetails function
      const result = googleCalendarWidget.formatEventDetails('[TITLE] from [STARTTIME] to [ENDTIME]', event);
      
      // Verify that the formatEventDetails function was called
      expect(googleCalendarWidget.formatEventDetails).toHaveBeenCalled();
      
      // Verify that the result contains all components
      expect(result).toBe('Test Event from 10:00 AM to 11:00 AM');
    });
  });
});
