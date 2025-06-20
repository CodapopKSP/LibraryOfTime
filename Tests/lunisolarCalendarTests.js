import { parseInputDate } from '../userInterface.js';
import * as lunisolarCalendars from '../Calendars/lunisolarCalendars.js';
import { getSolsticeOrEquinox } from '../Other/astronomicalData.js';
import { convertUTCOffsetToMinutes } from '../utilities.js';

function runSolarTermTypeThisMonthTests(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;
        const testedDate = parseInputDate(inputDate, timezone);
        const result = getCalendarFunction(testedDate, 16);
        if (result !== expectedOutput) {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testGetSolarTermTypeThisMonthCalendar() {
    return runSolarTermTypeThisMonthTests("Solar Term Type This Month Calendar", lunisolarCalendars.getSolarTermTypeThisMonth, [
        ["2025-5-27, 00:00:00", "UTC+08:00", "major"],
        ["2025-2-28, 00:00:00", "UTC+08:00", "major"],
        ["2025-7-25, 00:00:00", "UTC+08:00", "minor"],
    ]);
}

// Run all tests.
function runTests() {
    const testFunctions = [
        testGetSolarTermTypeThisMonthCalendar,

    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Solar Calendars: All Tests Passed.');
    }
}

runTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}