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
        let result = getCalendarFunction(testedDate, modifier);
        if (result instanceof Date) {
            result = result.toUTCString();
        }
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
        ["2001-3-20, 13:00:00", "UTC+00:00", 360],
        ["2050-9-22, 19:28:00", "UTC+00:00", 180],
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

function testGetNextSolarLunarEclipse() {
    return runCalendarTests("Eclipse", astronomicalData.getNextSolarLunarEclipse, [
        ["2024-04-08, 18:20:46", "UTC+00:00", "Mon, 08 Apr 2024 18:20:46 GMT\nTotal | Ascending\nNorthern Hemisphere", 0],      // Coda's eclipse
        ["-3339-11-2, 00:00:00", "UTC+00:00", "Sun, 03 Nov -3339 21:06:22 GMT\nAnnular | Descending\nNorthern Hemisphere", 0],  // Earliest recorded solar eclipse
        ["-584-5-21, 00:00:00", "UTC+00:00", "Wed, 22 May -0584 14:03:03 GMT\nTotal | Ascending\nNorthern Hemisphere", 0],      // Herodotus's eclipse
        ["1916-6-14, 00:00:00", "UTC+00:00", "Sat, 15 Jul 1916 04:39:39 GMT\nPartial | Ascending\nSouthern Hemisphere", 0.5],   // Ernest Shackleton's Antarctic Eclipse
    ]);
}

function testGetNewMoon() {
    const currentDateTime = new Date(Date.UTC(2024, 3, 8, 18, 20, 46));
    astronomicalData.generateAllNewMoons(currentDateTime);
    return runCalendarTests("New Moon", astronomicalData.getNewMoon, [
        ["2024-04-08, 10:20:46", "UTC+00:00", "Sun, 10 Mar 2024 09:00:17 GMT", 0],
        ["2024-04-08, 18:20:47", "UTC+00:00", "Mon, 08 Apr 2024 18:20:46 GMT", 0],
        ["2024-04-08, 18:20:47", "UTC+00:00", "Sun, 10 Mar 2024 09:00:17 GMT", -1],
        ["2024-04-08, 18:20:47", "UTC+00:00", "Wed, 08 May 2024 03:21:49 GMT", 1],
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
        testGetNextSolarLunarEclipse,
        testGetNewMoon,
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