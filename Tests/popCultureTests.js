//|------------------------------|
//|     Pop Culture Tests       |
//|------------------------------|
//
// Tests for all Pop Culture time systems

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

function testShireCalendar() {
    return runSingleParamaterTests("Shire Calendar", getShireDate, [
        ["2025-1-1, 00:00:00", "UTC+00:00", "7 Afteryule S.R. 1502\nSterday"],
        ["2026-3-18, 12:34:56", "UTC+00:00", "23 Rethe S.R. 1503\nHighday"],
        ["1941-12-25, 00:00:00", "UTC+00:00", "2 Yule S.R. 1419\nSterday"],
        ["1942-12-25, 00:00:00", "UTC+00:00", "2 Yule S.R. 1420\nSterday"],
        // Leap intercalary days (weekday system skips them).
        ["1943-6-24, 00:00:00", "UTC+00:00", "1 Lithe S.R. 1420\nHighday"],
        ["1943-6-25, 00:00:00", "UTC+00:00", "Mid-year's Day S.R. 1420"],
        // Leap intercalary day (leap years are every 4 years under this epoch model)
        ["1943-6-26, 00:00:00", "UTC+00:00", "Overlithe S.R. 1420"],
        ["1943-6-27, 00:00:00", "UTC+00:00", "2 Lithe S.R. 1420\nSterday"],
    ]);
}

// Run all pop culture tests.
function runPopCultureCalendarTests() {
    const testFunctions = [
        testShireCalendar,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Pop Culture: All Tests Passed.');
    }
}

