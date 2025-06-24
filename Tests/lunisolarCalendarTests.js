import { parseInputDate } from '../userInterface.js';
import * as lunisolarCalendars from '../Calendars/lunisolarCalendars.js';
import { generateAllNewMoons } from '../Other/astronomicalData.js';
import { setGregJulianDifference } from '../utilities.js'
import { calculateGregorianJulianDifference } from '../Calendars/solarCalendars.js';

function runSingleParameterTests(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;
        const testedDate = parseInputDate(inputDate, timezone);
        let result = getCalendarFunction(testedDate, 16);
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

function testGetSolarTermTypeThisMonth() {
    return runSingleParameterTests("Solar Term Type This Month", lunisolarCalendars.getSolarTermTypeThisMonth, [
        ["2025-5-27, 00:00:00", "UTC+08:00", "major"],
        ["2025-2-28, 00:00:00", "UTC+08:00", "major"],
        ["2025-7-25, 00:00:00", "UTC+08:00", "minor"],
    ]);
}

function testGetMonthEleven() {
    return runSingleParameterTests("Get Month Eleven", lunisolarCalendars.getMonthEleven, [
        ["2025-12-21, 00:00:00", "UTC+08:00", "Fri, 19 Dec 2025 16:00:00 GMT"],
        ["2024-12-21, 00:00:00", "UTC+08:00", "Sat, 30 Nov 2024 16:00:00 GMT"],
    ]);
}

function testCalculateFirstMonthWithoutMajorSolarTerm() {
    return runSingleParameterTests("First Month Without A major Solar Term", lunisolarCalendars.calculateFirstMonthWithoutMajorSolarTerm, [
        ["2024-12-1, 00:00:00", "UTC+08:00", 7],
        ["2024-4-9, 00:00:00", "UTC+08:00", 0],
        ["2025-3-1, 00:00:00", "UTC+08:00", 3],
    ]);
}

// Run all tests.
function runTests() {
    const currentDateTime = new Date(Date.UTC(2025, 4, 8, 18, 20, 46));
    setGregJulianDifference(calculateGregorianJulianDifference(currentDateTime));
    generateAllNewMoons(currentDateTime);
    const testFunctions = [
        testGetSolarTermTypeThisMonth,
        testGetMonthEleven,
        testCalculateFirstMonthWithoutMajorSolarTerm,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Lunisolar Calendars: All Tests Passed.');
    }
}

runTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}