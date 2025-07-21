
import { parseInputDate } from '../userInterface.js';
import * as computingTime from '../Timekeeping/computingTime.js';
import { convertUTCOffsetToMinutes } from '../utilities.js';


function runComputingTests(timeName, getCalendarFunction, testCases) {
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

function testUnixTime() {
    return runComputingTests("Unix", computingTime.getUnixTime, [
        ["1970-1-1, 00:00:00", "UTC+00:00", 0],
        ["1999-1-1, 00:00:00", "UTC+00:00", 915148800],
        ["1998-12-31, 23:59:58", "UTC+00:00", 915148798],
        ["2038-1-19, 03:14:07", "UTC+00:00", 2147483647],
    ]);
}

function testGPSTime() {
    return runComputingTests("GPS", computingTime.getGPSTime, [
        ["1980-1-6, 00:00:00", "UTC+00:00", 0],
        ["1999-1-1, 00:00:00", "UTC+00:00", 599184013],
        ["1998-12-31, 23:59:58", "UTC+00:00", 599184010],
        ["2038-1-19, 03:14:07", "UTC+00:00", 1831518865],
    ]);
}

function testTAI() {
    return runComputingTests("TAI", computingTime.getTAI, [
        ["1971-12-31, 23:59:50", "UTC+00:00", "Sat, 01 Jan 1972 00:00:00 GMT"],
        ["1998-12-31, 23:59:58", "UTC+00:00", "Fri, 01 Jan 1999 00:00:29 GMT"],
        ["1999-1-1, 00:00:00", "UTC+00:00", "Fri, 01 Jan 1999 00:00:32 GMT"],
    ]);
}

function testLORANC() {
    return runComputingTests("TAI", computingTime.getLORANC, [
        ["1971-12-31, 23:59:50", "UTC+00:00", "Fri, 31 Dec 1971 23:59:50 GMT"],
        ["1998-12-31, 23:59:58", "UTC+00:00", "Fri, 01 Jan 1999 00:00:19 GMT"],
        ["1999-1-1, 00:00:00", "UTC+00:00", "Fri, 01 Jan 1999 00:00:22 GMT"],
    ]);
}

function testFILETIME() {
    return runComputingTests("FILETIME", computingTime.getCurrentFiletime, [
        ["1601-1-1, 00:00:00", "UTC+00:00", 0],
        ["1998-12-31, 23:59:58", "UTC+00:00", 125596223980000000],
        ["1999-1-1, 00:00:00", "UTC+00:00", 125596224000000000],
    ]);
}

function testJDN() {
    return runComputingTests("JDN", computingTime.getJulianDayNumber, [
        ["-4713-11-24, 12:00:00", "UTC+00:00", 0],
        ["2000-1-1, 12:00:00", "UTC+00:00", 2451545],
        ["2013-1-1, 00:30:00", "UTC+00:00", 2456293.5208333],
    ]);
}

function testRataDie() {
    return runComputingTests("Rata Die", computingTime.getRataDie, [
        ["1-1-1, 00:00:00", "UTC+00:00", 1],
        ["2000-7-5, 00:00:00", "UTC+00:00", 730306],
    ]);
}

function testJulianPeriod() {
    return runComputingTests("Julian Period", computingTime.getJulianPeriod, [
        ["-4713-11-24, 12:00:00", "UTC+00:00", "1 (Cycle: 1)"],
        ["-4713-11-24, 11:00:00", "UTC+00:00", "7980 (Cycle: 0)"],
        ["3268-1-23, 12:00:00", "UTC+00:00", "1 (Cycle: 2)"],
    ]);
}

function testLilianDate() {
    return runComputingTests("Lilian Date", computingTime.getLilianDate, [
        ["1582-10-15, 00:00:00", "UTC+00:00", 1],
        ["1583-10-15, 00:00:00", "UTC+00:00", 366],
        ["2000-7-5, 00:00:00", "UTC+00:00", 152571],
    ]);
}

function testTerrestrialTime() {
    return runComputingTests("ΔT", computingTime.getDeltaT, [
        ["-1000-1-1, 00:00:00", "UTC+00:00", 25427.68],
        ["0-1-1, 00:00:00", "UTC+00:00", 10583.6],
        ["1000-1-1, 00:00:00", "UTC+00:00", 1574.2],
        ["2025-1-1, 00:00:00", "UTC+00:00", 74.467375],
    ]);
}

function testMarsSolDate() {
    return runComputingTests("Mars Sol Date", computingTime.getMarsSolDate, [
        ["1873-12-29, 12:04:10", "UTC+00:00", -0.000004301070382259765],
        ["2000-1-1, 00:00:00", "UTC+00:00", 44791.13353526427],
    ]);
}

function testJulianSolNumber() {
    return runComputingTests("Julian Sol Number", computingTime.getJulianSolDate, [
        ["1873-12-29, 12:04:10", "UTC+00:00", 94128.99999569893],
        ["2025-7-21, 00:00:00", "UTC+00:00", 148003.42267016353],
    ]);
}

function testKaliAharhana() {
    return runComputingTests("Kali Ahargana", computingTime.getKaliAhargana, [
        ["-3101-1-22, 18:30:00", "UTC+00:00", 0],
        ["2025-7-20, 18:30:00", "UTC+00:00", 1872412],
    ]);
}

function testLunationNumber() {
    return runComputingTests("Lunation Number", computingTime.calculateLunationNumber, [
        ["2000-1-6, 18:30:00", "UTC+00:00", 0],
        ["2000-2-6, 18:30:00", "UTC+00:00", 1],
        ["1999-12-6, 18:30:00", "UTC+00:00", -1],
    ]);
}

function testSpreadsheetNowTime() {
    return runComputingTests("Lunation Number", computingTime.getSpreadsheetNowTime, [
        ["1899-12-30, 00:00:00", "UTC+00:00", 0],
        ["1899-12-31, 00:00:00", "UTC+00:00", 1],
        ["2025-7-21, 00:00:00", "UTC+00:00", 45859],
    ]);
}

// Run all tests.
export function runComputingTimeTests() {
    const testFunctions = [
        testUnixTime,
        testGPSTime,
        testTAI,
        testLORANC,
        testFILETIME,
        testJDN,
        testRataDie,
        testJulianPeriod,
        testLilianDate,
        testTerrestrialTime,
        testMarsSolDate,
        testJulianSolNumber,
        testKaliAharhana,
        testLunationNumber,
        testSpreadsheetNowTime
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Computing Time: All Tests Passed.');
    }
}