import { parseInputDate } from '../userInterface.js';
import * as lunisolarCalendars from '../Calendars/lunisolarCalendars.js';
import { generateAllNewMoons, generateAllSolsticesEquinoxes } from '../Other/astronomicalData.js';
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
        } else if (typeof result === 'object' && result !== null) {
            result = `month: ${result.month}, day: ${result.day}, leapMonth: ${result.leapMonth}`;
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

function runChineseCalendarTests(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, country, localMidnight, expectedOutput] of testCases) {
        testCount++;
        const testedDate = parseInputDate(inputDate, timezone);
        let result = getCalendarFunction(testedDate, lunisolarDate, country);
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

function testGetLunisolarCalendarDateTerm() {
    return runSingleParameterTests("Lunisolar Calendar Date", lunisolarCalendars.getLunisolarCalendarDate, [
        ["2025-12-1, 00:00:00", "UTC+08:00", "month: 10, day: 12, leapMonth: false"],
        ["2025-4-15, 00:00:00", "UTC+08:00", "month: 3, day: 18, leapMonth: false"],
        ["2025-7-29, 00:00:00", "UTC+08:00", "month: 6, day: 5, leapMonth: true"],
    ]);
}

// Run all tests.
export function runLunisolarCalendarTests() {
    const currentDateTime = new Date(Date.UTC(2025, 4, 8, 18, 20, 46));
    setGregJulianDifference(calculateGregorianJulianDifference(currentDateTime));
    generateAllNewMoons(currentDateTime);
    generateAllSolsticesEquinoxes(currentDateTime);
    const testFunctions = [
        testGetSolarTermTypeThisMonth,
        testGetMonthEleven,
        testCalculateFirstMonthWithoutMajorSolarTerm,
        testGetLunisolarCalendarDateTerm,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Lunisolar Calendars: All Tests Passed.');
    }
}