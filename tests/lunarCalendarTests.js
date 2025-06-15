import {parseInputDate} from '../userInterface.js';

import * as lunarCalendars from '../Calendars/lunarCalendars.js';
import * as astronomicalData from '../Other/astronomicalData.js';

function runGetUmmalQuraDateTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedDate] of testCases) {
        testCount++;

        const testedDate = parseInputDate(inputDate, timezone);
        const newMoonThisMonth = astronomicalData.getMoonPhase(testedDate, 0);
        const newMoonLastMonth = astronomicalData.getMoonPhase(testedDate, -1);
        const actualDate = lunarCalendars.getUmmalQuraDate(testedDate, newMoonThisMonth, newMoonLastMonth);

        if (actualDate !== expectedDate) {
            console.error(`Umm al-Qura: Test ${testCount} failed.`);
            console.error('Expected:', expectedDate);
            console.error('Received:', actualDate);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runTimeOfSunsetAfterLastNewMoonTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedDate] of testCases) {
        testCount++;

        const testedDate = parseInputDate(inputDate, timezone);
        const newMoonThisMonth = astronomicalData.getMoonPhase(testedDate, 0);
        const newMoonLastMonth = astronomicalData.getMoonPhase(testedDate, -1);
        const actualDate = lunarCalendars.timeOfSunsetAfterLastNewMoon(testedDate, newMoonThisMonth, newMoonLastMonth).toUTCString();

        if (actualDate !== expectedDate) {
            console.error(`DateOfLastDayAfterNewMoonBeforeSunset: Test ${testCount} failed.`);
            console.error('Expected:', expectedDate);
            console.error('Received:', actualDate);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runCalculateIslamicMonthAndYearTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [lunation, expectedDate] of testCases) {
        testCount++;

        const actualDate_ = lunarCalendars.calculateIslamicMonthAndYear(lunation);
        const actualDate = actualDate_.year + ' ' + actualDate_.month;

        if (actualDate !== expectedDate) {
            console.error(`CalculateIslamicMonthAndYear: Test ${testCount} failed.`);
            console.error('Expected:', expectedDate);
            console.error('Received:', actualDate);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testTimeOfSunsetAfterLastNewMoon() {
    return runTimeOfSunsetAfterLastNewMoonTests([
        ["2025-6-14, 00:00:00", "UTC+00:00", "Tue, 27 May 2025 15:00:00 GMT"],
        ["2000-1-1, 00:00:00", "UTC+00:00", "Wed, 08 Dec 1999 15:00:00 GMT"],
        ["-2000-1-1, 00:00:00", "UTC+00:00", "Tue, 28 Dec -2001 15:00:00 GMT"],
    ]);
}

function testCalculateIslamicMonthAndYear() {
    return runCalculateIslamicMonthAndYearTests([
        [0, "1420 9"],
        [10, "1421 7"],
        [144, "1432 9"],
    ]);
}

// Run all tests.
function runTests() {
    const testFunctions = [
        testTimeOfSunsetAfterLastNewMoon,
        testCalculateIslamicMonthAndYear,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Lunar Calendars: All Tests Passed.');
    }
}

runTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}