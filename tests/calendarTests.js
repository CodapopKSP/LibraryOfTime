(function (global) {
    // If running in Node, load dependencies (here, utilities.js)
    // In the browser, these names are already in the global scope.
    let convertUTCOffsetToMinutes, parseInputDate, adjustCalendarType, getGregorianDateTime, getJulianCalendar;
    if (typeof require !== 'undefined') {
      // Adjust the relative path as needed
      ({ monthNames, weekNames, differenceInDays } = require('../utilities.js'));
    } else {
        convertUTCOffsetToMinutes = global.convertUTCOffsetToMinutes;
        parseInputDate = global.parseInputDate;
        adjustCalendarType = global.adjustCalendarType;
        getGregorianDateTime = global.getGregorianDateTime;
        getJulianCalendar = global.getJulianCalendar;
    }

function testTimezoneFormatter() {
    let testCount = 0;
    let passedTestCount = 0;

    function testTimezoneFormatter_test(timezoneTest, minutesTest) {
        testCount += 1;
        let minutes = convertUTCOffsetToMinutes(timezoneTest);
        if (minutes==minutesTest){
            passedTestCount += 1;
        } else {
            console.error('Timezone Offset: Test ' + testCount + ' failed.');
        }
    }

    // Tests - Timezone, Output Minutes
    testTimezoneFormatter_test('UTC+08:00', 480);
    testTimezoneFormatter_test('UTC+00:00', 0);
    testTimezoneFormatter_test('UTC-12:00', -720);

    // Cumulative Test Check
    if (testCount==passedTestCount){
        console.log('Timezone Offset: All Tests Passed');
    }
}

function testParseDate() {
    let testCount = 0;
    let passedTestCount = 0;

    function testParseDate_test(testedDate, testedTimezone, parsedDateTest) {
        testCount += 1;
        let parsedDate = parseInputDate(testedDate, testedTimezone);
        parsedDate = parsedDate.toUTCString();
        if (parsedDate==parsedDateTest){
            passedTestCount += 1;
        } else {
            console.error('Parse Date: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Timezone, Output Date
    testParseDate_test('1950-1-1, 00:00:00', 'UTC+00:00', 'Sun, 01 Jan 1950 00:00:00 GMT');
    testParseDate_test('2000-12-31, 00:00:00', 'UTC+08:00', 'Sun, 31 Dec 2000 08:00:00 GMT');
    testParseDate_test('2016-2-29, 00:00:00', 'UTC+12:00', 'Mon, 29 Feb 2016 12:00:00 GMT');

    // Cumulative Test Check
    if (testCount==passedTestCount){
        console.log('Parse Date: All Tests Passed');
    }
}

function testCalendarType() {
    let testCount = 0;
    let passedTestCount = 0;

    function testCalendarType_test(testedDate, testedCalendarType, parsedDateTest) {
        testCount += 1;
        let parsedDate = adjustCalendarType(testedDate, testedCalendarType);
        parsedDate = parsedDate.toUTCString();
        if (parsedDate==parsedDateTest){
            passedTestCount += 1;
        } else {
            console.error('Calendar Type: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Calendar Type, Output Date
    testCalendarType_test(new Date(Date.UTC(2024,0,1,0,0,0)), 'gregorian', 'Mon, 01 Jan 2024 00:00:00 GMT');
    testCalendarType_test(new Date(Date.UTC(2000,0,1,23,0,0)), 'julian-liturgical', 'Fri, 14 Jan 2000 23:00:00 GMT');
    testCalendarType_test(new Date(Date.UTC(1000,0,1,0,0,0)), 'astronomical', 'Mon, 06 Jan 1000 00:00:00 GMT');

    // Cumulative Test Check
    if (testCount==passedTestCount){
        console.log('Calendar Type: All Tests Passed');
    }
}

function testGregorianCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testGregorianCalendar_test(testedDate, parsedDateTest, parsedTimeTest) {
        testCount += 1;
        let gregDateTime = getGregorianDateTime(testedDate);
        let parsedDate = gregDateTime.date;
        let parsedTime = gregDateTime.time;
        if (parsedDate==parsedDateTest){
            passedTestCount += 0.5;
        } else {
            console.error('Gregorian Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
        if (parsedTime==parsedTimeTest){
            passedTestCount += 0.5;
        } else {
            console.error('Gregorian Calendar: Test ' + testCount + ' failed.');
            console.error(parsedTime);
        }
    }

    // Tests - Input Date, Output Date, Output Time
    testGregorianCalendar_test(parseInputDate("100-1-1, 00:00:00", "UTC+00:00"), "1 January 100 CE\nFriday", "08:06:00" );
    testGregorianCalendar_test(parseInputDate("-1000-1-1, 16:00:00", "UTC+00:00"), "2 January 1000 BCE\nThursday", "00:06:00" );
    testGregorianCalendar_test(parseInputDate("2012-2-29, 08:00:00", "UTC+00:00"), "29 February 2012 CE\nWednesday", "16:00:00" );

    // Cumulative Test Check
    if (testCount==passedTestCount){
        console.log('Gregorian Calendar: All Tests Passed');
    }
}

function testJulianCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testJulianCalendar_test(testedDate, parsedDateTest) {
        testCount += 1;
        let parsedDate = getJulianCalendar(testedDate);
        if (parsedDate==parsedDateTest){
            passedTestCount += 1;
        } else {
            console.error('Julian Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Output Date
    testJulianCalendar_test(parseInputDate("1950-1-1, 00:00:00", "UTC+00:00"), "19 December 1949 AD\nSunday");
    testJulianCalendar_test(parseInputDate("2-1-1, 00:00:00", "UTC+00:00"), "3 January 2 AD\nTuesday");
    testJulianCalendar_test(parseInputDate("1917-11-7, 00:00:00", "UTC+12:00"), "25 October 1917 AD\nWednesday");

    // Cumulative Test Check
    if (testCount==passedTestCount){
        console.log('Julian Calendar: All Tests Passed');
    }
}

// Export the functions
const exportsObject = {
    testTimezoneFormatter,
    testParseDate,
    testCalendarType,
    testGregorianCalendar,
    testJulianCalendar,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exportsObject;
  } else {
    Object.assign(global, exportsObject);
  }
})(typeof window !== 'undefined' ? window : global);

// Run all tests
testParseDate();
testTimezoneFormatter();
testCalendarType();
testGregorianCalendar();
testJulianCalendar();