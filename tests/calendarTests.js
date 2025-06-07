
import {convertUTCOffsetToMinutes, parseInputDate, adjustCalendarType, setCalendarType} from '../userInterface.js';
import * as solarCalendars from '../Calendars/solarCalendars.js';


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

    function testCalendarType_test(testedDate_, testedTimezone, parsedDateTest) {
        testCount += 1;
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
    testCalendarType_test("2024-1-1, 00:00:00", "UTC+00:00", 'Mon, 01 Jan 2024 00:00:00 GMT');
    setCalendarType('julian-liturgical');
    testCalendarType_test("2000-1-1, 23:00:00", "UTC+00:00", 'Fri, 14 Jan 2000 23:00:00 GMT');
    setCalendarType('astronomical');
    testCalendarType_test("1000-1-1, 00:00:00", "UTC+00:00", 'Mon, 06 Jan 1000 00:00:00 GMT');
    setCalendarType('gregorian-proleptic');

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Calendar Type: All Tests Passed');
    }
}

function testGregorianCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testGregorianCalendar_test(testedDate_, testedTimezone, parsedDateTest, parsedTimeTest) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        let testedTimezoneOffset = convertUTCOffsetToMinutes(testedTimezone)
        let gregDateTime = solarCalendars.getGregorianDateTime(testedDate, testedTimezoneOffset);
        let parsedDate = gregDateTime.date;
        let parsedTime = gregDateTime.time;
        if (parsedDate === parsedDateTest) {
            passedTestCount += 0.5;
        } else {
            console.error('Gregorian Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
        if (parsedTime === parsedTimeTest) {
            passedTestCount += 0.5;
        } else {
            console.error('Gregorian Calendar: Test ' + testCount + ' failed.');
            console.error(parsedTime);
        }
    }

    // Tests - Input Date, Output Date, Output Time
    testGregorianCalendar_test("100-1-1, 00:00:00", "UTC+00:00", "1 January 100 CE\nFriday", "00:00:00");
    testGregorianCalendar_test("-1000-1-1, 16:00:00", "UTC+12:00", "1 January 1000 BCE\nWednesday", "16:00:00");
    testGregorianCalendar_test("2012-2-29, 08:00:00", "UTC+00:00", "29 February 2012 CE\nWednesday", "08:00:00");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Gregorian Calendar: All Tests Passed');
    }
}

function testJulianCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testJulianCalendar_test(testedDate_, testedTimezone, parsedDateTest) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        let parsedDate = solarCalendars.getJulianCalendar(testedDate);
        if (parsedDate === parsedDateTest) {
            passedTestCount += 1;
        } else {
            console.error('Julian Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Output Date
    testJulianCalendar_test("1950-1-1, 00:00:00", "UTC+00:00", "19 December 1949 AD\nSunday");
    testJulianCalendar_test("2-1-1, 00:00:00", "UTC+00:00", "3 January 2 AD\nTuesday");
    testJulianCalendar_test("1917-11-7, 00:00:00", "UTC+00:00", "25 October 1917 AD\nWednesday");
    testJulianCalendar_test("-1000-1-1, 16:00:00", "UTC+12:00", "11 January 1001 BC\nWednesday");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Julian Calendar: All Tests Passed');
    }
}

function testAstronomicalCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testAstronomicalCalendar_test(testedDate_, testedTimezone, parsedDateTest) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        let parsedDate = solarCalendars.getAstronomicalDate(testedDate);
        if (parsedDate === parsedDateTest) {
            passedTestCount += 1;
        } else {
            console.error('Astronomical Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Output Date
    testAstronomicalCalendar_test("1950-1-1, 00:00:00", "UTC+00:00", "1 January 1950 CE\nSunday");
    testAstronomicalCalendar_test("2-1-1, 00:00:00", "UTC+00:00", "3 January 2 AD\nTuesday");
    testAstronomicalCalendar_test("-1000-1-1, 16:00:00", "UTC+12:00", "11 January 1001 BC\nWednesday");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Astronomical Calendar: All Tests Passed');
    }
}

function testMinguoCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testMinguoCalendar_test(testedDate_, testedTimezone, parsedDateTest) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        let parsedDate = solarCalendars.getMinguo(testedDate);
        if (parsedDate === parsedDateTest) {
            passedTestCount += 1;
        } else {
            console.error('Minguo Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Output Date
    testMinguoCalendar_test("1950-1-1, 00:00:00", "UTC+08:00", "民國 39年 1月 1日\n星期天");
    testMinguoCalendar_test("2-1-1, 00:00:00", "UTC+00:00", "民國 -1909年 1月 1日\n星期二");
    testMinguoCalendar_test("-1000-1-1, 16:00:00", "UTC+12:00", "民國 -2911年 1月 1日\n星期三");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Minguo Calendar: All Tests Passed');
    }
}

function testJucheCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testJucheCalendar_test(testedDate_, testedTimezone, parsedDateTest) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        let parsedDate = solarCalendars.getJuche(testedDate);
        if (parsedDate === parsedDateTest) {
            passedTestCount += 1;
        } else {
            console.error('Juche Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Output Date
    testJucheCalendar_test("1950-1-1, 00:00:00", "UTC+08:00", "Juche 39.01.1\n일요일");
    testJucheCalendar_test("2-1-1, 00:00:00", "UTC+00:00", "Juche -1909.01.1\n화요일");
    testJucheCalendar_test("-1000-1-1, 16:00:00", "UTC+12:00", "Juche -2911.01.1\n수요일");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Juche Calendar: All Tests Passed');
    }
}

// Run all tests.
testParseDate();
testTimezoneFormatter();
testCalendarType();
testGregorianCalendar();
testJulianCalendar();
testAstronomicalCalendar();
testMinguoCalendar();
testJucheCalendar();
if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}
