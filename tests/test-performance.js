/**
 * Performance Tests for Google Calendar Widget
 * 
 * This file contains performance tests for the Google Calendar Widget.
 * 
 * @package Google_Calendar_Widget
 * @version 2.1.0
 * @author Thomas Vincent (2025)
 * @copyright 2025 Thomas Vincent
 * @license GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.txt
 */

describe('Google Calendar Widget Performance', () => {
  // Mock the global jQuery object
  global.jQuery = jest.fn();
  
  // Mock the global console object
  const originalConsole = global.console;
  beforeEach(() => {
    global.console = {
      log: jest.fn(),
      error: jest.fn(),
      time: jest.fn(),
      timeEnd: jest.fn()
    };
    
    // Add performance measurement
    jest.spyOn(console, 'time');
    jest.spyOn(console, 'timeEnd');
  });
  
  afterEach(() => {
    global.console = originalConsole;
  });
  
  // Mock the global window object
  global.window = {
    googleCalendarWidgetDebug: true,
    google_calendar_widget_loc: {
      all_day: 'All Day',
      all_day_event: 'All Day Event'
    },
    performance: {
      now: jest.fn()
    }
  };
  
  // Mock the global document object
  global.document = {
    getElementById: jest.fn(),
    createElement: jest.fn()
  };
  
  // Mock the global gapi object
  global.gapi = {
    client: {
      setApiKey: jest.fn(),
      load: jest.fn(),
      newBatch: jest.fn(),
      calendar: {
        events: {
          list: jest.fn()
        }
      }
    }
  };
  
  // Load the module
  const googleCalendarWidget = require('../assets/js/google-calendar-widget');
  
  describe('Event Processing Performance', () => {
    test('should process a large number of events efficiently', () => {
      // Create a large array of events
      const events = [];
      for (let i = 0; i < 1000; i++) {
        events.push({
          id: `event-${i}`,
          summary: `Test Event ${i}`,
          start: {
            dateTime: `2025-04-${(i % 30) + 1}T10:00:00`
          },
          end: {
            dateTime: `2025-04-${(i % 30) + 1}T11:00:00`
          }
        });
      }
      
      // Mock document.getElementById to return a div
      const mockDiv = {
        childNodes: [],
        appendChild: jest.fn(),
        removeChild: jest.fn()
      };
      document.getElementById.mockReturnValue(mockDiv);
      
      // Mock document.createElement to return elements
      document.createElement.mockReturnValue({
        className: '',
        textContent: '',
        innerHTML: '',
        appendChild: jest.fn(),
        setAttribute: jest.fn()
      });
      
      // Mock the getTime function to return a time object
      const mockTime = {
        getDate: jest.fn().mockReturnValue(new Date()),
        isDateOnly: jest.fn().mockReturnValue(false)
      };
      
      // Mock the getStartTime and getEndTime functions
      googleCalendarWidget.getStartTime = jest.fn().mockReturnValue(mockTime);
      googleCalendarWidget.getEndTime = jest.fn().mockReturnValue(mockTime);
      
      // Mock the formatEventDetails function
      googleCalendarWidget.formatEventDetails = jest.fn().mockReturnValue('Test Event');
      
      // Mock the createClickHandler function
      googleCalendarWidget.createClickHandler = jest.fn().mockReturnValue(() => {});
      
      // Measure the time it takes to process the events
      const startTime = Date.now();
      
      // Call the processFinalFeed function
      googleCalendarWidget.processFinalFeed(events);
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      // Verify that the processing time is reasonable (less than 1 second for 1000 events)
      expect(processingTime).toBeLessThan(1000);
      
      // Verify that the output div was updated
      expect(mockDiv.appendChild).toHaveBeenCalled();
      
      // Verify that the formatEventDetails function was called for each event
      expect(googleCalendarWidget.formatEventDetails).toHaveBeenCalledTimes(1000);
      
      // Verify that the createClickHandler function was called for each event
      expect(googleCalendarWidget.createClickHandler).toHaveBeenCalledTimes(1000);
    });
  });
  
  describe('Batch Request Performance', () => {
    test('should handle multiple calendars efficiently', () => {
      // Mock the gapi.client.load function to return a resolved promise
      gapi.client.load.mockReturnValue(Promise.resolve());
      
      // Mock the gapi.client.newBatch function to return a batch object
      const mockBatch = {
        add: jest.fn(),
        then: jest.fn().mockImplementation(callback => {
          // Simulate a successful batch response with multiple calendars
          const mockResponse = {
            result: {}
          };
          
          // Add 100 calendars to the response
          for (let i = 0; i < 100; i++) {
            mockResponse.result[`calendar-id-${i}`] = {
              result: {
                items: [
                  {
                    id: `event-${i}`,
                    summary: `Test Event ${i}`,
                    start: {
                      dateTime: `2025-04-${(i % 30) + 1}T10:00:00`
                    },
                    end: {
                      dateTime: `2025-04-${(i % 30) + 1}T11:00:00`
                    }
                  }
                ]
              }
            };
          }
          
          callback(mockResponse);
          return { catch: jest.fn() };
        })
      };
      gapi.client.newBatch.mockReturnValue(mockBatch);
      
      // Mock the gapi.client.calendar.events.list function
      gapi.client.calendar.events.list.mockReturnValue({});
      
      // Mock document.getElementById to return a div
      const mockDiv = {
        childNodes: [],
        appendChild: jest.fn(),
        removeChild: jest.fn()
      };
      document.getElementById.mockReturnValue(mockDiv);
      
      // Mock document.createElement to return elements
      document.createElement.mockReturnValue({
        className: '',
        textContent: '',
        innerHTML: '',
        appendChild: jest.fn(),
        setAttribute: jest.fn()
      });
      
      // Create an array of 100 calendar IDs
      const calendarIds = [];
      for (let i = 0; i < 100; i++) {
        calendarIds.push(`calendar-id-${i}`);
      }
      
      // Mock window.performance.now to measure time
      window.performance.now.mockReturnValueOnce(0).mockReturnValueOnce(500);
      
      // Call the loadCalendar function with multiple calendars
      return googleCalendarWidget.loadCalendar(
        'API_KEY',
        'title-id',
        'output-id',
        10,
        false,
        calendarIds.join(',')
      ).then(() => {
        // Verify that the events.list method was added to the batch 100 times (once for each calendar)
        expect(mockBatch.add).toHaveBeenCalledTimes(100);
        
        // Verify that the batch was executed
        expect(mockBatch.then).toHaveBeenCalled();
        
        // Verify that the output div was updated
        expect(mockDiv.appendChild).toHaveBeenCalled();
      });
    });
  });
  
  describe('Memory Usage', () => {
    test('should not leak memory when processing events', () => {
      // This test is more of a demonstration of how to test for memory leaks
      // In a real environment, you would use a memory profiler
      
      // Create a large array of events
      const events = [];
      for (let i = 0; i < 1000; i++) {
        events.push({
          id: `event-${i}`,
          summary: `Test Event ${i}`,
          start: {
            dateTime: `2025-04-${(i % 30) + 1}T10:00:00`
          },
          end: {
            dateTime: `2025-04-${(i % 30) + 1}T11:00:00`
          }
        });
      }
      
      // Mock document.getElementById to return a div
      const mockDiv = {
        childNodes: [],
        appendChild: jest.fn(),
        removeChild: jest.fn()
      };
      document.getElementById.mockReturnValue(mockDiv);
      
      // Mock document.createElement to return elements
      document.createElement.mockReturnValue({
        className: '',
        textContent: '',
        innerHTML: '',
        appendChild: jest.fn(),
        setAttribute: jest.fn()
      });
      
      // Mock the getTime function to return a time object
      const mockTime = {
        getDate: jest.fn().mockReturnValue(new Date()),
        isDateOnly: jest.fn().mockReturnValue(false)
      };
      
      // Mock the getStartTime and getEndTime functions
      googleCalendarWidget.getStartTime = jest.fn().mockReturnValue(mockTime);
      googleCalendarWidget.getEndTime = jest.fn().mockReturnValue(mockTime);
      
      // Mock the formatEventDetails function
      googleCalendarWidget.formatEventDetails = jest.fn().mockReturnValue('Test Event');
      
      // Mock the createClickHandler function
      googleCalendarWidget.createClickHandler = jest.fn().mockReturnValue(() => {});
      
      // Record the initial memory usage
      const initialMemoryUsage = process.memoryUsage().heapUsed;
      
      // Process the events multiple times
      for (let i = 0; i < 10; i++) {
        googleCalendarWidget.processFinalFeed(events);
      }
      
      // Record the final memory usage
      const finalMemoryUsage = process.memoryUsage().heapUsed;
      
      // Calculate the memory usage per iteration
      const memoryUsagePerIteration = (finalMemoryUsage - initialMemoryUsage) / 10;
      
      // Verify that the memory usage per iteration is reasonable (less than 10MB)
      expect(memoryUsagePerIteration).toBeLessThan(10 * 1024 * 1024);
    });
  });
  
  describe('Rendering Performance', () => {
    test('should render events efficiently', () => {
      // Create a mock event
      const event = {
        id: 'event-1',
        summary: 'Test Event',
        start: {
          dateTime: '2025-04-15T10:00:00'
        },
        end: {
          dateTime: '2025-04-15T11:00:00'
        }
      };
      
      // Mock the getTime function to return a time object
      const mockTime = {
        getDate: jest.fn().mockReturnValue(new Date()),
        isDateOnly: jest.fn().mockReturnValue(false)
      };
      
      // Mock the getStartTime and getEndTime functions
      googleCalendarWidget.getStartTime = jest.fn().mockReturnValue(mockTime);
      googleCalendarWidget.getEndTime = jest.fn().mockReturnValue(mockTime);
      
      // Mock document.createElement to return elements
      document.createElement.mockReturnValue({
        className: '',
        textContent: '',
        innerHTML: '',
        appendChild: jest.fn()
      });
      
      // Measure the time it takes to build the date display
      const startTime = Date.now();
      
      // Call the buildDate function 1000 times
      for (let i = 0; i < 1000; i++) {
        googleCalendarWidget.buildDate(event);
      }
      
      const endTime = Date.now();
      const renderingTime = endTime - startTime;
      
      // Verify that the rendering time is reasonable (less than 1 second for 1000 renders)
      expect(renderingTime).toBeLessThan(1000);
    });
  });
});
