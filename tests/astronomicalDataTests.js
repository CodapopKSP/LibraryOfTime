import { parseInputDate } from '../userInterface.js';
import * as astronomicalData from '../Other/astronomicalData.js';
import { setGregJulianDifference } from '../utilities.js';
import { calculateGregorianJulianDifference } from '../Calendars/solarCalendars.js';

function runCalculateDateFromJDETests(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, expectedOutput, modifier] of testCases) {
        testCount++;
        const result = getCalendarFunction(inputDate, modifier).toUTCString();
        if (result !== expectedOutput) {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runCalendarTestsReturnNumber(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput, modifier] of testCases) {
        testCount++;
        const testedDate = parseInputDate(inputDate, timezone);
        const result = getCalendarFunction(testedDate, modifier);
        if (result !== expectedOutput) {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runCalendarTests(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput, modifier] of testCases) {
        testCount++;
        const testedDate = parseInputDate(inputDate, timezone);
        setGregJulianDifference(calculateGregorianJulianDifference(testedDate));
        const result = getCalendarFunction(testedDate, modifier, 1).toUTCString();
        if (result !== expectedOutput) {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testCalculateDateFromJDE() {
    return runCalculateDateFromJDETests("DateFromJDE", astronomicalData.calculateDateFromJDE, [
        [2086302.5, "Tue, 31 Dec 0999 23:33:40 GMT"],
        [2451544.5, "Fri, 31 Dec 1999 23:58:56 GMT"],
    ]);
}

function testCalculateUTCYearFraction() {
    return runCalendarTestsReturnNumber("UTCYearFraction", astronomicalData.calculateUTCYearFraction, [
        ["1500-1-1, 00:00:00", "UTC+00:00", 0],
        ["2000-12-31, 23:59:59", "UTC+00:00", 0.9999999683768468],
    ]);
}

function testGetLongitudeOfSun() {
    return runCalendarTestsReturnNumber("LongitudeOfSun", astronomicalData.getLongitudeOfSun, [
        ["2001-3-20, 13:00:00", "UTC+00:00", '360.00'],
        ["2050-9-22, 19:28:00", "UTC+00:00", '180.00'],
    ]);
}

function testCalculateLunationNumber() {
    return runCalendarTestsReturnNumber("LunationNumber", astronomicalData.calculateLunationNumber, [
        ["2000-1-7, 00:00:00", "UTC+00:00", 0],
        ["2000-2-7, 00:00:00", "UTC+00:00", 1],
        ["2001-1-7, 00:00:00", "UTC+00:00", 12],
        ["1999-1-7, 00:00:00", "UTC+00:00", -12],
    ]);
}

function testGetSolsticeOrEquinox() {
    return runCalendarTests("SolsticeOrEquinox", astronomicalData.getSolsticeOrEquinox, [
        ["2001-3-20, 00:00:00", "UTC+00:00", "Tue, 20 Mar 2001 13:30:41 GMT", 'spring'],
        ["2100-3-20, 00:00:00", "UTC+00:00", "Sat, 20 Mar 2100 13:03:11 GMT", 'spring'],
        ["2050-9-22, 00:00:00", "UTC+00:00", "Thu, 22 Sep 2050 19:28:30 GMT", 'autumn'],
    ]);
}

function testGetMoonPhase() {
    return runCalendarTests("Moon Phase", astronomicalData.getMoonPhase, [
        ["2025-3-20, 00:00:00", "UTC+00:00", "Fri, 28 Feb 2025 00:44:37 GMT", 0],
        ["1-1-12, 00:00:00", "UTC+00:00", "Thu, 11 Jan 0001 10:49:07 GMT", 0],          // Off by 9 mins in Ephemeris
        ["4000-12-20, 00:00:00", "UTC+00:00", "Sun, 31 Dec 4000 01:13:56 GMT", 0.75],   // Off by 5 mins in Ephemeris
        ["622-7-12, 00:00:00", "UTC+00:00", "Wed, 17 Jul 0622 05:21:49 GMT", 0],        // Off by 5 mins in Ephemeris
    ]);
}

// Run all tests.
function runTests() {
    const testFunctions = [
        testCalculateDateFromJDE,
        testCalculateUTCYearFraction,
        testGetLongitudeOfSun,
        testCalculateLunationNumber,
        testGetSolsticeOrEquinox,
        testGetMoonPhase,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Astronomical Data: All Tests Passed.');
    }
}

runTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}