import { parseInputDate, adjustCalendarType, setCalendarType } from '../userInterface.js';
import { convertUTCOffsetToMinutes } from '../utilities.js';

function runTimezoneFormatterTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [timezoneInput, expectedMinutes] of testCases) {
        testCount++;
        const result = convertUTCOffsetToMinutes(timezoneInput);
        if (result !== expectedMinutes) {
            console.error(`Timezone Offset: Test ${testCount} failed.`);
            console.error('Expected:', expectedMinutes);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runParseDateTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;

        const parsedDate = parseInputDate(inputDate, timezone).toUTCString();

        if (parsedDate !== expectedOutput) {
            console.error(`Parse Date: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', parsedDate);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runCalendarTypeTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput, calendarType] of testCases) {
        testCount++;

        setCalendarType(calendarType);
        const testedDate = parseInputDate(inputDate, timezone);
        const result = adjustCalendarType(testedDate).toUTCString();

        if (result !== expectedOutput) {
            console.error(`Calendar Type: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    // Always reset to default at the end
    setCalendarType('gregorian-proleptic');

    return failedTestCount;
}

function testTimezoneFormatter() {
    return runTimezoneFormatterTests([
        ['UTC+08:00', 480],
        ['UTC+00:00', 0],
        ['UTC-12:00', -720]
    ]);
}

function testParseDate() {
    return runParseDateTests([
        ['1950-1-1, 00:00:00', 'UTC+00:00', 'Sun, 01 Jan 1950 00:00:00 GMT'],
        ['2000-12-31, 00:00:00', 'UTC+08:00', 'Sat, 30 Dec 2000 16:00:00 GMT'],
        ['2016-2-29, 00:00:00', 'UTC+12:00', 'Sun, 28 Feb 2016 12:00:00 GMT'],
        ['0001-1-2, 00:00:00', 'UTC-10:00', 'Tue, 02 Jan 0001 10:00:00 GMT']
    ]);
}

function testCalendarType() {
    return runCalendarTypeTests([
        ["2024-1-1, 00:00:00", "UTC+00:00", "Mon, 01 Jan 2024 00:00:00 GMT", "gregorian-proleptic"],
        ["2000-1-1, 23:00:00", "UTC+00:00", "Fri, 14 Jan 2000 23:00:00 GMT", "julian-liturgical"],
        ["1000-1-1, 00:00:00", "UTC+00:00", "Mon, 06 Jan 1000 00:00:00 GMT", "astronomical"]
    ]);
}


// Run all tests.
function runTests() {
    const testFunctions = [
        testTimezoneFormatter,
        testParseDate,
        testCalendarType
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Date Management: All Tests Passed.');
    }
}

runTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}