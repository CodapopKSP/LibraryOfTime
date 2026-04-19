//|------------------------------|
//|     Computing Time Tests     |
//|------------------------------|

// Tests for all computing time functions

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
    return runComputingTests("Unix", getUnixTime, [
        ["1970-1-1, 00:00:00", "UTC+00:00", 0],
        ["1999-1-1, 00:00:00", "UTC+00:00", 915148800],
        ["1998-12-31, 23:59:58", "UTC+00:00", 915148798],
        ["2038-1-19, 03:14:07", "UTC+00:00", 2147483647],
    ]);
}

function testGPSTime() {
    return runComputingTests("GPS", getGPSTime, [
        ["1980-1-6, 00:00:00", "UTC+00:00", 0],
        ["1999-1-1, 00:00:00", "UTC+00:00", 599184013],
        ["1998-12-31, 23:59:58", "UTC+00:00", 599184010],
        ["2038-1-19, 03:14:07", "UTC+00:00", 1831518865],
    ]);
}

function testGpsWeekNumberAndSecondsOfWeek() {
    return runComputingTests("GPS Week Number", getGpsWeekNumberAndSecondsOfWeek, [
        ["1980-1-6, 00:00:00", "UTC+00:00", "0 0"],
        ["1999-1-1, 00:00:00", "UTC+00:00", "990 432013"],
    ]);
}

function testTAI() {
    return runComputingTests("TAI", getTAI, [
        ["1971-12-31, 23:59:50", "UTC+00:00", "Sat, 01 Jan 1972 00:00:00 GMT"],
        ["1998-12-31, 23:59:58", "UTC+00:00", "Fri, 01 Jan 1999 00:00:29 GMT"],
        ["1999-1-1, 00:00:00", "UTC+00:00", "Fri, 01 Jan 1999 00:00:32 GMT"],
    ]);
}

function testLORANC() {
    return runComputingTests("TAI", getLORANC, [
        ["1971-12-31, 23:59:50", "UTC+00:00", "Fri, 31 Dec 1971 23:59:50 GMT"],
        ["1998-12-31, 23:59:58", "UTC+00:00", "Fri, 01 Jan 1999 00:00:19 GMT"],
        ["1999-1-1, 00:00:00", "UTC+00:00", "Fri, 01 Jan 1999 00:00:22 GMT"],
    ]);
}

function testFILETIME() {
    return runComputingTests("FILETIME", getCurrentFiletime, [
        ["1601-1-1, 00:00:00", "UTC+00:00", 0],
        ["1998-12-31, 23:59:58", "UTC+00:00", 125596223980000000],
        ["1999-1-1, 00:00:00", "UTC+00:00", 125596224000000000],
    ]);
}

function testDotNetDateTimeTicks() {
    return runComputingTests(".NET DateTime Ticks", getDotNetDateTimeTicks, [
        ["1-1-1, 00:00:00", "UTC+00:00", 0],
        ["1999-1-1, 00:00:00", "UTC+00:00", 630507456000000000],
    ]);
}

function testChromeTimestampMicroseconds() {
    return runComputingTests("Chrome", getChromeTimestampMicroseconds, [
        ["1601-1-1, 00:00:00", "UTC+00:00", 0],
        ["1999-1-1, 00:00:00", "UTC+00:00", 12559622400000000],
    ]);
}

function testUnixTimeHex() {
    return runComputingTests("Unix Hex", getUnixTimeHex, [
        ["1970-1-1, 00:00:00", "UTC+00:00", "0"],
        ["1999-1-1, 00:00:00", "UTC+00:00", "368C1000"],
        ["1960-1-1, 00:00:00", "UTC+00:00", "-12CFF780"],
    ]);
}

function testCocoaCoreDataSeconds() {
    return runComputingTests("Cocoa Core Data", getCocoaCoreDataSeconds, [
        ["2001-1-1, 00:00:00", "UTC+00:00", 0],
        ["1970-1-1, 00:00:00", "UTC+00:00", -978307200],
    ]);
}

function testMacHfsPlusSeconds() {
    return runComputingTests("Mac HFS+", getMacHfsPlusSeconds, [
        ["1904-1-1, 00:00:00", "UTC+00:00", 0],
        ["1970-1-1, 00:00:00", "UTC+00:00", 2082844800],
        ["2040-2-6, 06:28:15", "UTC+00:00", 4294967295],
        ["2040-2-6, 06:28:16", "UTC+00:00", 0],
        ["2040-2-6, 06:28:17", "UTC+00:00", 1],
    ]);
}

function testNtpTimestampSeconds() {
    return runComputingTests("NTP", getNtpTimestampSeconds, [
        ["1900-1-1, 00:00:00", "UTC+00:00", "0\n0"],
        ["1970-1-1, 00:00:00", "UTC+00:00", "2208988800\n83AA7E80"],
        ["1899-12-31, 23:59:59", "UTC+00:00", "4294967295\nFFFFFFFF"],
        ["2036-2-7, 06:28:15", "UTC+00:00", "4294967295\nFFFFFFFF"],
        ["2036-2-7, 06:28:16", "UTC+00:00", "0\n0"],
        ["2036-2-7, 06:28:17", "UTC+00:00", "1\n1"],
    ]);
}

function testDosFatTimestamp() {
    return runComputingTests("DOS FAT", getDosFatTimestamp, [
        ["2026-4-18, 17:19:28", "UTC+00:00", "0x5C928A6E\n0x6E8A925C"],
    ]);
}

function testSas4glDatetime() {
    return runComputingTests("SAS 4GL", getSas4glDatetime, [
        ["1960-1-1, 00:00:00", "UTC+00:00", "0\n0"],
        ["1970-1-1, 00:00:00", "UTC+00:00", "315619200\n3653"],
    ]);
}

function testJDN() {
    return runComputingTests("JDN", getJulianDayNumber, [
        ["-4713-11-24, 12:00:00", "UTC+00:00", 0],
        ["2000-1-1, 12:00:00", "UTC+00:00", 2451545],
        ["2013-1-1, 00:30:00", "UTC+00:00", 2456293.5208333],
    ]);
}

function testRataDie() {
    return runComputingTests("Rata Die", getRataDie, [
        ["1-1-1, 00:00:00", "UTC+00:00", 1],
        ["2000-7-5, 00:00:00", "UTC+00:00", 730306],
    ]);
}

function testJulianPeriod() {
    return runComputingTests("Julian Period", getJulianPeriod, [
        ["-4713-11-24, 12:00:00", "UTC+00:00", "1 (Cycle: 1)"],
        ["-4713-11-24, 11:00:00", "UTC+00:00", "7980 (Cycle: 0)"],
        ["3268-1-23, 12:00:00", "UTC+00:00", "1 (Cycle: 2)"],
    ]);
}

function testLilianDate() {
    return runComputingTests("Lilian Date", getLilianDate, [
        ["1582-10-15, 00:00:00", "UTC+00:00", 1],
        ["1583-10-15, 00:00:00", "UTC+00:00", 366],
        ["2000-7-5, 00:00:00", "UTC+00:00", 152571],
    ]);
}

function testTerrestrialTime() {
    return runComputingTests("ΔT", getDeltaT, [
        ["-1000-1-1, 00:00:00", "UTC+00:00", 25427.68],
        ["0-1-1, 00:00:00", "UTC+00:00", 10583.6],
        ["1000-1-1, 00:00:00", "UTC+00:00", 1574.2],
        ["2025-1-1, 00:00:00", "UTC+00:00", 74.467375],
    ]);
}

function testMarsSolDate() {
    return runComputingTests("Mars Sol Date", getMarsSolDate, [
        ["1873-12-29, 12:04:10", "UTC+00:00", -0.000004301070382259765],
        ["2000-1-1, 00:00:00", "UTC+00:00", 44791.13353526427],
    ]);
}

function testJulianSolNumber() {
    return runComputingTests("Julian Sol Number", getJulianSolDate, [
        ["1873-12-29, 12:04:10", "UTC+00:00", 94128.99999569893],
        ["2025-7-21, 00:00:00", "UTC+00:00", 148003.42267016353],
    ]);
}

function testKaliAharhana() {
    return runComputingTests("Kali Ahargana", getKaliAhargana, [
        ["-3101-1-22, 18:30:00", "UTC+00:00", 0],
        ["2025-7-20, 18:30:00", "UTC+00:00", 1872412],
    ]);
}

function testLunationNumber() {
    return runComputingTests("Lunation Number", calculateLunationNumber, [
        ["2000-1-6, 18:30:00", "UTC+00:00", 0],
        ["2000-2-6, 18:30:00", "UTC+00:00", 1],
        ["1999-12-9, 18:30:00", "UTC+00:00", -1],
        ["2001-1-7, 00:00:00", "UTC+00:00", 12],
        ["1999-1-20, 00:00:00", "UTC+00:00", -12],
    ]);
}

function testSpreadsheetNowTime() {
    return runComputingTests("Lunation Number", getSpreadsheetNowTime, [
        ["1899-12-30, 00:00:00", "UTC+00:00", 0],
        ["1899-12-31, 00:00:00", "UTC+00:00", 1],
        ["2025-7-21, 00:00:00", "UTC+00:00", 45859],
    ]);
}

function testOrdinalDate() {
    return runComputingTests("Ordinal Date", getOrdinalDate, [
        ["2000-1-1, 00:00:00", "UTC+00:00", "00001"],
        ["2025-12-31, 00:00:00", "UTC+00:00", "25365"],
    ]);
}

// Run all tests.
function runComputingTimeTests() {
    const testFunctions = [
        testUnixTime,
        testGPSTime,
        testGpsWeekNumberAndSecondsOfWeek,
        testTAI,
        testLORANC,
        testFILETIME,
        testDotNetDateTimeTicks,
        testChromeTimestampMicroseconds,
        testUnixTimeHex,
        testCocoaCoreDataSeconds,
        testMacHfsPlusSeconds,
        testNtpTimestampSeconds,
        testDosFatTimestamp,
        testSas4glDatetime,
        testJDN,
        testRataDie,
        testJulianPeriod,
        testLilianDate,
        testTerrestrialTime,
        testMarsSolDate,
        testJulianSolNumber,
        testKaliAharhana,
        testLunationNumber,
        testSpreadsheetNowTime,
        testOrdinalDate
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Computing Time: All Tests Passed.');
    }
}