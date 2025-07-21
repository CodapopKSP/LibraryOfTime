
import { parseInputDate } from '../userInterface.js';
import * as otherCalendars from '../Calendars/otherCalendars.js';
import { convertUTCOffsetToMinutes } from '../utilities.js';


function runSingleParamaterTests(timeName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;
        // Get Timezone Offset for Local Calendars
        const timezoneOffset = convertUTCOffsetToMinutes(timezone);
        const testedDate = parseInputDate(inputDate, timezone);
        let result = getCalendarFunction(testedDate, timezoneOffset);
        if (result instanceof Date) {
            result = result.toUTCString();
        }
        if (result !== expectedOutput) {
            console.error(`${timeName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testMayaLongCount() {
    return runSingleParamaterTests("Maya Long Count", otherCalendars.getCurrentMayaLongCount, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "0.0.0.0.0"],
        ["2012-12-21, 06:00:00", "UTC+00:00", "13.0.0.0.0"],
    ]);
}

function testTzolkin() {
    return runSingleParamaterTests("Tzolkin", otherCalendars.getTzolkinDate, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "4 Ajaw"],
        ["2025-7-21, 06:00:00", "UTC+00:00", "10 Men"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "9 Ix"],
    ]);
}

function testLordOfTheNightY() {
    return runSingleParamaterTests("Lord of the Night | Y", otherCalendars.getLordOfTheNight, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "G9 | Y3"],
        ["2025-7-21, 06:00:00", "UTC+00:00", "G5 | Y3"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "G4 | Y2"],
    ]);
}

function testYugaCycle() {
    return runSingleParamaterTests("Yuga Cycle", otherCalendars.getYugaCycle, [
        ["-3101-1-22, 00:00:00", "UTC+00:00", "Dvapara Yuga: Sandhyamsa"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "Kali Yuga: Sandhya"],
    ]);
}

function testSothicCycle() {
    return runSingleParamaterTests("Sothic Cycle", otherCalendars.getSothicCycle, [
        ["-2781-6-27, 00:00:00", "UTC+00:00", "Cycle: 1 | Year: 1"],
        ["139-7-19, 00:00:00", "UTC+00:00", "Cycle: 3 | Year: 1"],
    ]);
}

function testOlympiad() {
    return runSingleParamaterTests("Olympiad", otherCalendars.getOlympiad, [
        ["-775-7-24, 00:00:00", "UTC+00:00", "1 | Year: 1"],
        ["-775-7-23, 00:00:00", "UTC+00:00", "0 | Year: 4"],
        ["-771-7-24, 00:00:00", "UTC+00:00", "2 | Year: 1"],
    ]);
}

// Run all tests.
export function runOtherCalendarTests() {
    const testFunctions = [
        testMayaLongCount,
        testTzolkin,
        testLordOfTheNightY,
        testYugaCycle,
        testSothicCycle,
        testOlympiad,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Computing Time: All Tests Passed.');
    }
}