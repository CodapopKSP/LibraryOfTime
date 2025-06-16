import {parseInputDate} from '../userInterface.js';
import * as solarCalendars from '../Calendars/solarCalendars.js';
import * as lunarCalendars from '../Calendars/lunarCalendars.js';
import * as astronomicalData from '../Other/astronomicalData.js';
import * as userInterface from '../userInterface.js';

function runGetUmmalQuraDateTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedDate] of testCases) {
        testCount++;

        const testedDate = parseInputDate(inputDate, timezone);
        const newMoonThisMonth = astronomicalData.getMoonPhase(testedDate, 0);
        const newMoonLastMonth = astronomicalData.getMoonPhase(testedDate, -1);
        const newMoonTwoMonthsAgo = astronomicalData.getMoonPhase(testedDate, -2);
        const actualDate = lunarCalendars.getUmmalQuraDate(testedDate, newMoonThisMonth, newMoonLastMonth, newMoonTwoMonthsAgo, 1);

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
        userInterface.setGregJulianDifference(solarCalendars.calculateGregorianJulianDifference(testedDate));
        const newMoonThisMonth = astronomicalData.getMoonPhase(testedDate, 0);
        const newMoonLastMonth = astronomicalData.getMoonPhase(testedDate, -1);
        const newMoonTwoMonthsAgo = astronomicalData.getMoonPhase(testedDate, -2);
        const actualDate = lunarCalendars.timeOfSunsetAfterLastNewMoon(testedDate, newMoonThisMonth, newMoonLastMonth, newMoonTwoMonthsAgo).toUTCString();

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

        const actualDate_ = lunarCalendars.calculateIslamicMonthAndYear(lunation);
        const actualDate = actualDate_.year + ' ' + actualDate_.month;

        if (actualDate !== expectedDate) {
            console.error(`CalculateIslamicMonthAndYear: Test ${testCount} failed.`);
            console.error('Expected:', expectedDate);
            console.error('Received:', actualDate);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testGetUmmalQuraDate() {
    return runGetUmmalQuraDateTests([
        ["2025-6-14, 18:00:00", "UTC+03:00", "19 Dhū al-Ḥijjah 1446 AH\nYawm al-Ahad"],
        ["2025-6-14, 18:00:00", "UTC+00:00", "19 Dhū al-Ḥijjah 1446 AH\nYawm al-Ahad"],
        ["2025-6-14, 10:00:00", "UTC+03:00", "18 Dhū al-Ḥijjah 1446 AH\nYawm as-Sabt"],
        ["2015-1-1, 18:00:00", "UTC+03:00", "11 Rabīʿ al-ʾAwwal 1436 AH\nYawm al-Jumu'ah"],
        ["2015-1-1, 18:00:00", "UTC+00:00", "11 Rabīʿ al-ʾAwwal 1436 AH\nYawm al-Jumu'ah"],
        ["2015-1-1, 18:00:00", "UTC+08:00", "10 Rabīʿ al-ʾAwwal 1436 AH\nYawm al-Khamis"],
        ["2015-1-1, 12:00:00", "UTC+00:00", "10 Rabīʿ al-ʾAwwal 1436 AH\nYawm al-Khamis"],
        ["2015-10-13, 18:00:00", "UTC+03:00", "1 al-Muḥarram 1437 AH\nYawm al-Arba'a"],
        ["2015-10-13, 18:00:00", "UTC+08:00", "30 Dhū al-Ḥijjah 1436 AH\nYawm ath-Thulatha"],
        ["2024-9-4, 18:00:00", "UTC+03:00", "2 Rabīʿ al-ʾAwwal 1446 AH\nYawm al-Khamis"],
        ["2035-12-30, 18:00:00", "UTC+03:00", "2 Dhū al-Qaʿdah 1457 AH\nYawm al-Ithnayn"],
    ]);
}

function testTimeOfSunsetAfterLastNewMoon() {
    return runTimeOfSunsetAfterLastNewMoonTests([
        ["2025-6-14, 00:00:00", "UTC+00:00", "Tue, 27 May 2025 15:00:00 GMT"],
        ["2000-1-1, 00:00:00", "UTC+00:00", "Wed, 08 Dec 1999 15:00:00 GMT"],
        ["-2000-1-1, 00:00:00", "UTC+00:00", "Sat, 11 Dec -2001 15:00:00 GMT"],
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