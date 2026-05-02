//|------------------------------|
//|     Alternative Time Tests    |
//|------------------------------|

function runAlternativeTimeTestsInner(timeName, getFn, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;
        const timezoneOffset = convertUTCOffsetToMinutes(timezone);
        const testedDate = parseInputDate(inputDate, timezone);
        let result = getFn(testedDate, timezoneOffset);
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

function testZoroastrianGahTime() {
    return runAlternativeTimeTestsInner('Zoroastrian Gah', getZoroastrianGahTime, [
        ['2000-1-1, 00:00:00', 'UTC+00:00', 'Ushahin'],
        ['2000-1-1, 05:59:59', 'UTC+00:00', 'Ushahin'],
        ['2000-1-1, 06:00:00', 'UTC+00:00', 'Hawan'],
        ['2000-1-1, 11:30:00', 'UTC+00:00', 'Hawan'],
        ['2000-1-1, 12:00:00', 'UTC+00:00', 'Rapithwin'],
        ['2000-1-1, 14:59:59', 'UTC+00:00', 'Rapithwin'],
        ['2000-1-1, 15:00:00', 'UTC+00:00', 'Uzerin'],
        ['2000-1-1, 18:00:00', 'UTC+00:00', 'Aiwisruthrem'],
        ['2000-1-1, 23:59:59', 'UTC+00:00', 'Aiwisruthrem'],
        ['2000-1-1, 12:00:00', 'UTC+03:30', 'Rapithwin'],
        ['2000-1-1, 09:30:00', 'UTC+03:30', 'Hawan']
    ]);
}

function runAlternativeTimeTests() {
    const testFunctions = [testZoroastrianGahTime];
    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);
    if (allTests === 0) {
        console.log('Alternative Time: All Tests Passed.');
    }
}
