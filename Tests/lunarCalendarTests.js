import { parseInputDate } from '../userInterface.js';
import { getUmmalQuraDate, timeOfSunsetAfterLastNewMoon, calculateIslamicMonthAndYear } from '../Calendars/lunarCalendars.js';
import { generateAllNewMoons } from '../Other/astronomicalData.js';

function runGetUmmalQuraDateTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedDate] of testCases) {
        testCount++;

        const testedDate = parseInputDate(inputDate, timezone);
        const actualDate = getUmmalQuraDate(testedDate);
        if (actualDate !== expectedDate) {
            console.error(`Umm al-Qura: Test ${testCount} failed.`);
            console.error('Expected:', expectedDate);
            console.error('Received:', actualDate);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runTimeOfSunsetAfterLastNewMoonTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedDate] of testCases) {
        testCount++;

        const testedDate = parseInputDate(inputDate, timezone);
        const actualDate = timeOfSunsetAfterLastNewMoon(testedDate).toUTCString();
        if (actualDate !== expectedDate) {
            console.error(`TimeOfSunsetAfterLastNewMoon: Test ${testCount} failed.`);
            console.error('Expected:', expectedDate);
            console.error('Received:', actualDate);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runCalculateIslamicMonthAndYearTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [lunation, expectedDate] of testCases) {
        testCount++;

        const actualDate_ = calculateIslamicMonthAndYear(lunation);
        const actualDate = actualDate_.year + ' ' + actualDate_.month;

        if (actualDate !== expectedDate) {
            console.error(`IslamicMonthAndYear: Test ${testCount} failed.`);
            console.error('Expected:', expectedDate);
            console.error('Received:', actualDate);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testGetUmmalQuraDate() {
    return runGetUmmalQuraDateTests([
        ["2024-6-14, 18:00:00", "UTC+03:00", "9 Dhū al-Ḥijjah 1445 AH\nYawm as-Sabt"],
        ["2024-6-14, 18:00:00", "UTC+00:00", "9 Dhū al-Ḥijjah 1445 AH\nYawm as-Sabt"],
        ["2024-6-14, 10:00:00", "UTC+03:00", "8 Dhū al-Ḥijjah 1445 AH\nYawm al-Jumu'ah"],
        ["2024-7-6, 18:00:00", "UTC+03:00", "1 al-Muḥarram 1446 AH\nYawm al-Ahad"],
    ]);
}

function testTimeOfSunsetAfterLastNewMoon() {
    return runTimeOfSunsetAfterLastNewMoonTests([
        ["2024-6-14, 00:00:00", "UTC+00:00", "Thu, 06 Jun 2024 15:00:00 GMT"],
        ["2024-1-1, 00:00:00", "UTC+00:00", "Wed, 13 Dec 2023 15:00:00 GMT"],
        ["2024-2-15, 00:00:00", "UTC+00:00", "Sat, 10 Feb 2024 15:00:00 GMT"],
    ]);
}

function testCalculateIslamicMonthAndYear() {
    return runCalculateIslamicMonthAndYearTests([
        [0, "1420 9"],
        [10, "1421 7"],
        [144, "1432 9"],
    ]);
}

// Run all tests.
function runTests() {
    const currentDateTime = new Date(Date.UTC(2024, 3, 8, 18, 20, 46));
    generateAllNewMoons(currentDateTime);
    const testFunctions = [
        testTimeOfSunsetAfterLastNewMoon,
        testCalculateIslamicMonthAndYear,
        testGetUmmalQuraDate,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);
    if (allTests === 0) {
        console.log('Lunar Calendars: All Tests Passed.');
    }
}

runTests();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}