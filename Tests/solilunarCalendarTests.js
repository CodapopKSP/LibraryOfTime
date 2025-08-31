

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

function testGetTogysDate() {
    return runSingleParameterTests("Togys Calendar", getTogysDate, [
        ["2024-5-2, 19:00:00", "UTC+00:00", " "],
    ]);
}

// Run all tests.
function runSolilunarCalendarTests() {
    const currentDateTime = new Date(Date.UTC(2025, 4, 8, 18, 20, 46));
    setGregJulianDifference(calculateGregorianJulianDifference(currentDateTime));
    generateAllNewMoons(currentDateTime);
    const testFunctions = [
        testGetTogysDate,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Solilunar Calendars: All Tests Passed.');
    }
}