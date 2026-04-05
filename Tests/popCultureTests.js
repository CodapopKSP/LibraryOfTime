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

function testTamrielicDate() {
    return runSingleParamaterTests("Tamrielic Date", getTamrielicDate, [
        ["2025-1-1, 00:00:00", "UTC+00:00", "1 Morning Star\nMiddas"],
        ["2024-2-29, 00:00:00", "UTC+00:00", "29 Sun's Dawn\nTurdas"],
        ["2026-3-18, 12:34:56", "UTC+00:00", "18 First Seed\nMiddas"],
    ]);
}

function testPopCultureClockSystems() {
    let failed = 0;
    failed += runSingleParamaterTests("Minecraft Time", getMinecraftTime, [
        ["2025-1-1, 00:00:00", "UTC+00:00", "Day: 1 | 00:00:00"],
        ["2026-3-18, 12:34:56", "UTC+00:00", "Day: 38 | 17:55:11"],
    ]);
    failed += runSingleParamaterTests("Inception Dream Time", getInceptionDreamTime, [
        ["2025-1-1, 00:00:00", "UTC+00:00", "Day: 1 | 00:00:00"],
        ["2026-3-18, 12:34:56", "UTC+00:00", "Day: 11 | 11:38:40"],
    ]);
    failed += runSingleParamaterTests("Termina Time", getTerminaTime, [
        ["2025-1-1, 00:00:00", "UTC+00:00", "06:00:00\nThe First Day\n72 Hours Remain"],
        ["2026-3-18, 12:34:56", "UTC+00:00", "07:58:23\nNight of the First Day\n59 Hours Remain"],
        ["2025-7-21, 05:00:00", "UTC+08:00", "06:00:00\nThe Third Day\n24 Hours Remain"],
    ]);
    return failed;
}

// Run all pop culture tests.
function runPopCultureCalendarTests() {
    const testFunctions = [
        testShireCalendar,
        testTamrielicDate,
        testPopCultureClockSystems,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Pop Culture: All Tests Passed.');
    }
}

