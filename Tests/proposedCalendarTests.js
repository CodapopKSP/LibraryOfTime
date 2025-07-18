
import { parseInputDate } from '../userInterface.js';
import * as proposedCalendars from '../Calendars/proposedCalendars.js';
import { convertUTCOffsetToMinutes } from '../utilities.js';


function runCalendarTests(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;
        // Get Timezone Offset for Local Calendars
        const timezoneOffset = convertUTCOffsetToMinutes(timezone);
        const testedDate = parseInputDate(inputDate, timezone);
        const result = getCalendarFunction(testedDate, timezoneOffset);
        if (result !== expectedOutput) {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testHumanEraCalendar() {
    return runCalendarTests("Human Era Calendar", proposedCalendars.getHumanEra, [
        ["-5508-7-19, 00:00:00", "UTC+00:00", "19 July 4492 HE\nSaturday"],
        ["2025-6-10, 23:00:00", "UTC+00:00", "10 June 12025 HE\nTuesday"],
        ["-9999-1-1, 00:00:00", "UTC+00:00", "1 January 1 HE\nMonday"],
    ]);
}

function testInvariableCalendar() {
    return runCalendarTests("Invariable Calendar", proposedCalendars.getInvariableCalendarDate, [
        ["1990-1-1, 00:00:00", "UTC+08:00", "New Years Day 1990 CE"],
        ["1990-1-1, 23:59:59", "UTC+00:00", "New Years Day 1990 CE"],
        ["2024-7-1, 23:59:59", "UTC+00:00", "31 June 2024 CE\nSunday"],
        ["2024-7-2, 00:00:00", "UTC+10:00", "Leap Day 2024 CE"],
    ]);
}

function testWorldCalendar() {
    return runCalendarTests("World Calendar", proposedCalendars.getWorldCalendarDate, [
        ["1990-1-1, 00:00:00", "UTC+08:00", "World's Day 1990 CE"],
        ["2024-7-2, 23:00:00", "UTC+10:00", "Leapyear Day 2024 CE"],
        ["2024-7-1, 15:59:59", "UTC+14:00", "30 June 2024 CE\nSaturday"],
    ]);
}

function testSymmetry454Calendar() {
    return runCalendarTests("Symmetry454 Calendar", proposedCalendars.getSymmetry454Date, [
        ["1-1-1, 00:00:00", "UTC+00:00", "1 January 1 CE\nMonday"],
        ["2022-3-7, 00:00:00", "UTC+00:00", "1 March 2022 CE\nMonday"],
        ["2022-1-2, 00:00:00", "UTC+00:00", "35 December 2021 CE\nSunday"],
    ]);
}

// Run all tests.
export function runProposedCalendarTests() {
    const testFunctions = [
        testHumanEraCalendar,
        testInvariableCalendar,
        testWorldCalendar,
        testSymmetry454Calendar
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Proposed Calendars: All Tests Passed.');
    }
}