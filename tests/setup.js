/**
 * Jest setup file for Google Calendar Widget
 * 
 * This file sets up the testing environment for Jest.
 * 
 * @package Google_Calendar_Widget
 * @version 2.1.0
 */

// Set up Jest mock functions
jest.mock('jquery', () => jest.fn());

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

// Mock the global console object
const originalConsole = global.console;
beforeEach(() => {
  global.console = {
    log: jest.fn(),
    error: jest.fn(),
    time: jest.fn(),
    timeEnd: jest.fn()
  };
});

afterEach(() => {
  global.console = originalConsole;
});

// Create directory for mocks if it doesn't exist
const fs = require('fs');
const path = require('path');
const mockDir = path.join(__dirname, 'mocks');

if (!fs.existsSync(mockDir)) {
  fs.mkdirSync(mockDir);
}
