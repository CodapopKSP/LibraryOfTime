//|---------------------------------|
//|     Astronomical Data Tests     |
//|---------------------------------|

// Tests for all astronomical data

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

function runAstronomicalTests(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput, modifier] of testCases) {
        testCount++;
        const testedDate = parseInputDate(inputDate, timezone);
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
    return runCalculateDateFromJDETests("DateFromJDE", calculateDateFromJDE, [
        [2086302.5, "Tue, 31 Dec 0999 23:33:40 GMT"],
        [2451544.5, "Fri, 31 Dec 1999 23:58:56 GMT"],
    ]);
}

function testCalculateUTCYearFraction() {
    return runCalendarTestsReturnNumber("UTCYearFraction", calculateUTCYearFraction, [
        ["1500-1-1, 00:00:00", "UTC+00:00", 0],
        ["2000-12-31, 23:59:59", "UTC+00:00", 0.9999999683768468],
    ]);
}

function testGetLongitudeOfSun() {
    return runCalendarTestsReturnNumber("LongitudeOfSun", getLongitudeOfSun, [
        ["2001-3-20, 13:00:00", "UTC+00:00", 359.995453],
        ["2050-9-22, 19:28:00", "UTC+00:00", 179.9994],
    ]);
}

function testGetSolsticeOrEquinox() {
    return runAstronomicalTests("SolsticeOrEquinox", getSolsticeOrEquinox, [
        ["2001-3-20, 00:00:00", "UTC+00:00", "Tue, 20 Mar 2001 13:30:41 GMT", 'SPRING'],
        ["2100-3-20, 00:00:00", "UTC+00:00", "Sat, 20 Mar 2100 13:03:11 GMT", 'SPRING'],
        ["2050-9-22, 00:00:00", "UTC+00:00", "Thu, 22 Sep 2050 19:28:30 GMT", 'AUTUMN'],
    ]);
}

function testGetMoonPhase() {
    return runAstronomicalTests("Moon Phase", getMoonPhase, [
        ["2025-3-20, 00:00:00", "UTC+00:00", "Fri, 28 Feb 2025 00:44:37 GMT", 0],
        ["1-1-12, 00:00:00", "UTC+00:00", "Thu, 11 Jan 0001 10:49:07 GMT", 0],          // Off by 9 mins in Ephemeris
        ["4000-12-20, 00:00:00", "UTC+00:00", "Sun, 31 Dec 4000 01:13:56 GMT", 0.75],   // Off by 5 mins in Ephemeris
        ["622-7-12, 00:00:00", "UTC+00:00", "Wed, 17 Jul 0622 05:21:49 GMT", 0],        // Off by 5 mins in Ephemeris
        ["-1999-11-19, 00:00:00", "UTC+00:00", "Mon, 19 Nov -1999 09:59:04 GMT", 0],    // Off by 24 mins in Ephemeris
        ["-1900-5-20, 00:00:00", "UTC+00:00", "Wed, 12 May -1900 07:03:59 GMT", 0],     // Off by 23 mins in Ephemeris
        ["4000-3-20, 00:00:00", "UTC+00:00", "Sun, 02 Apr 4000 05:21:03 GMT", 0.5],     // Off by 4 mins in Ephemeris
    ]);
}

function testGetNextMoonPhase() {
    return runAstronomicalTests("Next Moon Phase", getNextMoonPhase, [
        ["2024-04-08, 10:20:46", "UTC+00:00", "Mon, 08 Apr 2024 18:20:46 GMT", 0],
        ["2024-04-08, 18:20:47", "UTC+00:00", "Wed, 08 May 2024 03:21:49 GMT", 0],
        ["2024-04-08, 18:20:47", "UTC+00:00", "Tue, 23 Apr 2024 23:48:58 GMT", 0.5],
        ["2025-3-20, 00:00:00", "UTC+00:00", "Sat, 29 Mar 2025 10:57:37 GMT", 0],
        ["1801-3-10, 00:00:00", "UTC+00:00", "Mon, 30 Mar 1801 05:23:43 GMT", 0.5],
        ["1801-3-11, 00:00:00", "UTC+00:00", "Mon, 30 Mar 1801 05:23:43 GMT", 0.5],
    ]);
}

function testGetNextSolarLunarEclipse() {
    return runAstronomicalTests("Eclipse", getNextSolarLunarEclipse, [
        ["2024-04-08, 18:20:46", "UTC+00:00", "Mon, 08 Apr 2024 18:20:46 GMT\nTotal | Ascending\nNorthern Hemisphere", 0],      // Coda's eclipse
        ["-3339-11-2, 00:00:00", "UTC+00:00", "Sun, 03 Nov -3339 21:06:22 GMT\nAnnular | Descending\nNorthern Hemisphere", 0],  // Earliest recorded solar eclipse
        ["-584-5-21, 00:00:00", "UTC+00:00", "Wed, 22 May -0584 14:03:03 GMT\nTotal | Ascending\nNorthern Hemisphere", 0],      // Herodotus's eclipse
        ["1916-6-14, 00:00:00", "UTC+00:00", "Sat, 15 Jul 1916 04:39:39 GMT\nPartial | Ascending\nSouthern Hemisphere", 0.5],   // Ernest Shackleton's Antarctic Eclipse
        ["-1999-11-19, 00:00:00", "UTC+00:00", "Mon, 19 Nov -1999 09:59:04 GMT\nAnnular | Descending\nSouthern Hemisphere", 0], // Oldest solar eclipse in source that doesn't bridge Greg/Jul years
        ["1801-3-10, 00:00:00", "UTC+00:00", "Mon, 30 Mar 1801 05:23:43 GMT\nTotal | Descending\nNorthern Hemisphere", 0.5],
        ["1801-3-11, 00:00:00", "UTC+00:00", "Mon, 30 Mar 1801 05:23:43 GMT\nTotal | Descending\nNorthern Hemisphere", 0.5],
    ]);
}

function testGetNewMoon() {
    const currentDateTime = new Date(Date.UTC(2024, 3, 8, 18, 20, 46));
    generateAllNewMoons(currentDateTime);
    return runAstronomicalTests("New Moon", getNewMoon, [
        ["2024-04-08, 10:20:46", "UTC+00:00", "Sun, 10 Mar 2024 09:00:17 GMT", 0],
        ["2024-04-08, 18:20:47", "UTC+00:00", "Mon, 08 Apr 2024 18:20:46 GMT", 0],
        ["2024-04-08, 18:20:47", "UTC+00:00", "Sun, 10 Mar 2024 09:00:17 GMT", -1],
        ["2024-04-08, 18:20:47", "UTC+00:00", "Wed, 08 May 2024 03:21:49 GMT", 1],
        ["4000-03-20, 00:00:00", "UTC+00:00", "Sun, 19 Mar 4000 05:24:22 GMT", 0],
    ]);
}

// Run all tests.
function runAstronomicalDataTests() {
    const testFunctions = [
        testCalculateDateFromJDE,
        testCalculateUTCYearFraction,
        testGetLongitudeOfSun,
        testGetSolsticeOrEquinox,
        testGetMoonPhase,
        testGetNextMoonPhase,
        testGetNextSolarLunarEclipse,
        testGetNewMoon,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Astronomical Data: All Tests Passed.');
    }
}