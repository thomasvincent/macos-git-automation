/**
 * Integration Tests for Google Calendar Widget
 * 
 * This file contains integration tests for the Google Calendar Widget.
 * 
 * @package Google_Calendar_Widget
 * @version 2.1.0
 * @author Thomas Vincent (2025)
 * @copyright 2025 Thomas Vincent
 * @license GPL-2.0+ https://www.gnu.org/licenses/gpl-2.0.txt
 */

describe('Google Calendar Widget Integration', () => {
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
    googleCalendarWidgetDebug: true,
    google_calendar_widget_loc: {
      all_day: 'All Day',
      all_day_event: 'All Day Event'
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
  
  describe('Calendar Integration', () => {
    test('should load calendar and display events', () => {
      // Mock the gapi.client.load function to return a resolved promise
      gapi.client.load.mockReturnValue(Promise.resolve());
      
      // Mock the gapi.client.newBatch function to return a batch object
      const mockBatch = {
        add: jest.fn(),
        then: jest.fn().mockImplementation(callback => {
          // Simulate a successful batch response
          const mockResponse = {
            result: {
              'calendar-id': {
                result: {
                  items: [
                    {
                      id: 'event-1',
                      summary: 'Test Event 1',
                      start: {
                        dateTime: '2025-04-15T10:00:00'
                      },
                      end: {
                        dateTime: '2025-04-15T11:00:00'
                      }
                    },
                    {
                      id: 'event-2',
                      summary: 'Test Event 2',
                      start: {
                        date: '2025-04-16'
                      },
                      end: {
                        date: '2025-04-17'
                      }
                    }
                  ]
                }
              }
            }
          };
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
      const mockElements = {
        div: {
          className: '',
          textContent: '',
          appendChild: jest.fn()
        },
        a: {
          className: '',
          href: '',
          innerHTML: '',
          setAttribute: jest.fn(),
          onclick: null
        }
      };
      document.createElement.mockImplementation(tag => {
        return {
          ...mockElements[tag],
          tagName: tag
        };
      });
      
      // Call the loadCalendar function
      return googleCalendarWidget.loadCalendar(
        'API_KEY',
        'title-id',
        'output-id',
        10,
        false,
        'calendar-id'
      ).then(() => {
        // Verify that the API key was set
        expect(gapi.client.setApiKey).toHaveBeenCalledWith('API_KEY');
        
        // Verify that the Calendar API was loaded
        expect(gapi.client.load).toHaveBeenCalledWith('calendar', 'v3');
        
        // Verify that a batch request was created
        expect(gapi.client.newBatch).toHaveBeenCalled();
        
        // Verify that the events.list method was added to the batch
        expect(mockBatch.add).toHaveBeenCalled();
        
        // Verify that the batch was executed
        expect(mockBatch.then).toHaveBeenCalled();
        
        // Verify that the output div was updated
        expect(mockDiv.appendChild).toHaveBeenCalled();
      });
    });
    
    test('should handle multiple calendars', () => {
      // Mock the gapi.client.load function to return a resolved promise
      gapi.client.load.mockReturnValue(Promise.resolve());
      
      // Mock the gapi.client.newBatch function to return a batch object
      const mockBatch = {
        add: jest.fn(),
        then: jest.fn().mockImplementation(callback => {
          // Simulate a successful batch response with multiple calendars
          const mockResponse = {
            result: {
              'calendar-id-1': {
                result: {
                  items: [
                    {
                      id: 'event-1',
                      summary: 'Test Event 1',
                      start: {
                        dateTime: '2025-04-15T10:00:00'
                      },
                      end: {
                        dateTime: '2025-04-15T11:00:00'
                      }
                    }
                  ]
                }
              },
              'calendar-id-2': {
                result: {
                  items: [
                    {
                      id: 'event-2',
                      summary: 'Test Event 2',
                      start: {
                        date: '2025-04-16'
                      },
                      end: {
                        date: '2025-04-17'
                      }
                    }
                  ]
                }
              }
            }
          };
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
      const mockElements = {
        div: {
          className: '',
          textContent: '',
          appendChild: jest.fn()
        },
        a: {
          className: '',
          href: '',
          innerHTML: '',
          setAttribute: jest.fn(),
          onclick: null
        }
      };
      document.createElement.mockImplementation(tag => {
        return {
          ...mockElements[tag],
          tagName: tag
        };
      });
      
      // Call the loadCalendar function with multiple calendars
      return googleCalendarWidget.loadCalendar(
        'API_KEY',
        'title-id',
        'output-id',
        10,
        false,
        'calendar-id-1',
        'calendar-id-2'
      ).then(() => {
        // Verify that the API key was set
        expect(gapi.client.setApiKey).toHaveBeenCalledWith('API_KEY');
        
        // Verify that the Calendar API was loaded
        expect(gapi.client.load).toHaveBeenCalledWith('calendar', 'v3');
        
        // Verify that a batch request was created
        expect(gapi.client.newBatch).toHaveBeenCalled();
        
        // Verify that the events.list method was added to the batch twice (once for each calendar)
        expect(mockBatch.add).toHaveBeenCalledTimes(2);
        
        // Verify that the batch was executed
        expect(mockBatch.then).toHaveBeenCalled();
        
        // Verify that the output div was updated
        expect(mockDiv.appendChild).toHaveBeenCalled();
      });
    });
    
    test('should handle comma-separated calendar IDs', () => {
      // Mock the gapi.client.load function to return a resolved promise
      gapi.client.load.mockReturnValue(Promise.resolve());
      
      // Mock the gapi.client.newBatch function to return a batch object
      const mockBatch = {
        add: jest.fn(),
        then: jest.fn().mockImplementation(callback => {
          // Simulate a successful batch response
          const mockResponse = {
            result: {
              'calendar-id-1': {
                result: {
                  items: []
                }
              },
              'calendar-id-2': {
                result: {
                  items: []
                }
              },
              'calendar-id-3': {
                result: {
                  items: []
                }
              }
            }
          };
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
        appendChild: jest.fn()
      });
      
      // Call the loadCalendar function with comma-separated calendar IDs
      return googleCalendarWidget.loadCalendar(
        'API_KEY',
        'title-id',
        'output-id',
        10,
        false,
        'calendar-id-1,calendar-id-2',
        'calendar-id-3'
      ).then(() => {
        // Verify that the events.list method was added to the batch three times (once for each calendar)
        expect(mockBatch.add).toHaveBeenCalledTimes(3);
      });
    });
  });
  
  describe('Event Display Integration', () => {
    test('should create click handlers for events', () => {
      // Mock document.createElement to return elements
      const mockItem = {
        appendChild: jest.fn(),
        removeChild: jest.fn(),
        setAttribute: jest.fn()
      };
      const mockDescDiv = {
        appendChild: jest.fn()
      };
      const mockBodyDiv = {
        className: '',
        innerHTML: ''
      };
      document.createElement.mockImplementation(tag => {
        if (tag === 'div') {
          if (!mockDescDiv.className) {
            mockDescDiv.className = 'mock-desc-div';
            return mockDescDiv;
          } else if (!mockBodyDiv.className) {
            mockBodyDiv.className = 'mock-body-div';
            return mockBodyDiv;
          }
        }
        return {
          className: '',
          textContent: '',
          appendChild: jest.fn()
        };
      });
      
      // Create a mock event
      const mockEvent = {
        summary: 'Test Event',
        description: 'Test Description',
        location: 'Test Location',
        start: {
          dateTime: '2025-04-15T10:00:00'
        },
        end: {
          dateTime: '2025-04-15T11:00:00'
        }
      };
      
      // Mock the buildDate and buildLocation functions
      googleCalendarWidget.buildDate = jest.fn().mockReturnValue({});
      googleCalendarWidget.buildLocation = jest.fn().mockReturnValue({});
      
      // Create a mock event object for the click handler
      const mockClickEvent = {
        preventDefault: jest.fn()
      };
      
      // Call the createClickHandler function
      const clickHandler = googleCalendarWidget.createClickHandler(mockItem, mockEvent);
      
      // Call the click handler
      clickHandler(mockClickEvent);
      
      // Verify that preventDefault was called
      expect(mockClickEvent.preventDefault).toHaveBeenCalled();
      
      // Verify that buildDate and buildLocation were called
      expect(googleCalendarWidget.buildDate).toHaveBeenCalledWith(mockEvent);
      expect(googleCalendarWidget.buildLocation).toHaveBeenCalledWith(mockEvent);
      
      // Verify that the description div was appended to the item
      expect(mockItem.appendChild).toHaveBeenCalledWith(mockDescDiv);
      
      // Verify that the aria-expanded attribute was set
      expect(mockItem.setAttribute).toHaveBeenCalledWith('aria-expanded', 'true');
      
      // Call the click handler again to test toggling
      clickHandler(mockClickEvent);
      
      // Verify that the description div was removed
      expect(mockItem.removeChild).toHaveBeenCalledWith(mockDescDiv);
      
      // Verify that the aria-expanded attribute was set to false
      expect(mockItem.setAttribute).toHaveBeenCalledWith('aria-expanded', 'false');
    });
  });
});
