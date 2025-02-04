(function(global) {
    // Declare variables to hold our test functions.
    let testParseDate,
        testTimezoneFormatter,
        testCalendarType,
        testGregorianCalendar,
        testJulianCalendar;
        
    // If running in Node, use require() to load the exports.
    if (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports) {
      // Adjust the relative path as needed.
      ({ 
        testParseDate, 
        testTimezoneFormatter, 
        testCalendarType, 
        testGregorianCalendar, 
        testJulianCalendar 
      } = require('./calendarTests.js'));
    } else {
      // In the browser, assume the functions are attached to the global object (window).
      ({ 
        testParseDate, 
        testTimezoneFormatter, 
        testCalendarType, 
        testGregorianCalendar, 
        testJulianCalendar 
      } = global);
    }
    
    // Run all tests.
    testParseDate();
    testTimezoneFormatter();
    testCalendarType();
    testGregorianCalendar();
    testJulianCalendar();
    
  })(typeof window !== 'undefined' ? window : global);
  