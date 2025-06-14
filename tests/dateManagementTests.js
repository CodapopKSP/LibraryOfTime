import {convertUTCOffsetToMinutes, parseInputDate, adjustCalendarType, setCalendarType} from '../userInterface.js';

function testTimezoneFormatter() {
    let testCount = 0;
    let passedTestCount = 0;

    function testTimezoneFormatter_test(timezoneTest, minutesTest) {
        testCount += 1;
        let minutes = convertUTCOffsetToMinutes(timezoneTest);
        if (minutes === minutesTest) {
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
    if (testCount === passedTestCount) {
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
        if (parsedDate === parsedDateTest) {
            passedTestCount += 1;
        } else {
            console.error('Parse Date: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Timezone, Output Date
    testParseDate_test('1950-1-1, 00:00:00', 'UTC+00:00', 'Sun, 01 Jan 1950 00:00:00 GMT');
    testParseDate_test('2000-12-31, 00:00:00', 'UTC+08:00', 'Sat, 30 Dec 2000 16:00:00 GMT');
    testParseDate_test('2016-2-29, 00:00:00', 'UTC+12:00', 'Sun, 28 Feb 2016 12:00:00 GMT');
    testParseDate_test('0001-1-2, 00:00:00', 'UTC-10:00', 'Tue, 02 Jan 0001 10:00:00 GMT');

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Parse Date: All Tests Passed');
    }
}

function testCalendarType() {
    let testCount = 0;
    let passedTestCount = 0;

    function testCalendarType_test(testedDate_, testedTimezone, parsedDateTest, calendarType) {
        testCount += 1;

        setCalendarType(calendarType);
        let testedDate = parseInputDate(testedDate_, testedTimezone);
        let parsedDate = adjustCalendarType(testedDate);
        parsedDate = parsedDate.toUTCString();
        if (parsedDate === parsedDateTest) {
            passedTestCount += 1;
        } else {
            console.error('Calendar Type: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Calendar Type, Output Date
    testCalendarType_test("2024-1-1, 00:00:00", "UTC+00:00", 'Mon, 01 Jan 2024 00:00:00 GMT', 'gregorian-proleptic');
    testCalendarType_test("2000-1-1, 23:00:00", "UTC+00:00", 'Fri, 14 Jan 2000 23:00:00 GMT', 'julian-liturgical');
    testCalendarType_test("1000-1-1, 00:00:00", "UTC+00:00", 'Mon, 06 Jan 1000 00:00:00 GMT', 'astronomical');
    

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Calendar Type: All Tests Passed');
    }
    setCalendarType('gregorian-proleptic');
}

// Run all tests.
testParseDate();
testTimezoneFormatter();
testCalendarType();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}