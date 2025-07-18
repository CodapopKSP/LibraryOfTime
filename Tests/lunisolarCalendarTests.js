import { parseInputDate } from '../userInterface.js';
import * as lunisolarCalendars from '../Calendars/lunisolarCalendars.js';
import { generateAllNewMoons, generateAllSolsticesEquinoxes } from '../Other/astronomicalData.js';
import { setGregJulianDifference } from '../utilities.js'
import { calculateGregorianJulianDifference } from '../Calendars/solarCalendars.js';

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

function runGetChineseLunisolarCalendarDate(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, country, expectedOutput] of testCases) {
        testCount++;
        const testedDate = parseInputDate(inputDate, timezone);
        let result = getCalendarFunction(testedDate, country);
        if (result !== expectedOutput) {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testGetSolarTermTypeThisMonth() {
    return runSingleParameterTests("Solar Term Type This Month", lunisolarCalendars.getSolarTermTypeThisMonth, [
        ["2025-5-27, 00:00:00", "UTC+08:00", "major"],
        ["2025-2-28, 00:00:00", "UTC+08:00", "major"],
        ["2025-7-25, 00:00:00", "UTC+08:00", "minor"],
    ]);
}

function testGetMonthEleven() {
    return runSingleParameterTests("Get Month Eleven", lunisolarCalendars.getMonthEleven, [
        ["2025-12-21, 00:00:00", "UTC+08:00", "Fri, 19 Dec 2025 16:00:00 GMT"],
        ["2024-12-21, 00:00:00", "UTC+08:00", "Sat, 30 Nov 2024 16:00:00 GMT"],
    ]);
}

function testCalculateFirstMonthWithoutMajorSolarTerm() {
    return runSingleParameterTests("First Month Without A major Solar Term", lunisolarCalendars.calculateFirstMonthWithoutMajorSolarTerm, [
        ["2024-12-1, 00:00:00", "UTC+08:00", 7],
        ["2024-4-9, 00:00:00", "UTC+08:00", 0],
        ["2025-3-1, 00:00:00", "UTC+08:00", 3],
    ]);
}

function testGetLunisolarCalendarDate() {
    return runSingleParameterTests("Lunisolar Calendar Date", lunisolarCalendars.getLunisolarCalendarDate, [
        ["2025-12-1, 00:00:00", "UTC+08:00", "month: 10, day: 12, leapMonth: false"],
        ["2025-4-15, 00:00:00", "UTC+08:00", "month: 3, day: 18, leapMonth: false"],
        ["2025-7-29, 00:00:00", "UTC+08:00", "month: 6, day: 5, leapMonth: true"],
    ]);
}

function testGetChineseLunisolarCalendarDate() {
    return runGetChineseLunisolarCalendarDate("Chinese Calendar Date", lunisolarCalendars.getChineseLunisolarCalendarDate, [
        ["2025-12-1, 00:00:00", "UTC+08:00", "china", "4723年 10月 12日\nYear of the Snake (蛇)"],
        ["2025-12-1, 00:00:00", "UTC+08:00", "vietnam", "2025 10 11\nYear of the Snake (𧋻)"],
        ["2025-12-1, 00:00:00", "UTC+08:00", "korea", "4358년 10월 12일"],
    ]);
}

function testGetSexagenaryYear() {
    return runSingleParameterTests("Chinese Calendar Date", lunisolarCalendars.getSexagenaryYear, [
        ["2024-12-1, 00:00:00", "UTC+08:00", "甲辰 (JiaChen)"],
        ["2025-12-1, 00:00:00", "UTC+08:00", "乙巳 (YiSi)"],
        ["2026-3-1, 00:00:00", "UTC+08:00", "丙午 (BingWu)"],
    ]);
}

function testCalculateHebrewCalendar() {
    return runSingleParameterTests("Hebrew Calendar", lunisolarCalendars.calculateHebrewCalendar, [
        //["2024-10-2, 16:00:00", "UTC+00:00", "1 Tishri 5785 AM\nYom Chamishi"],
        //["2024-10-2, 15:00:00", "UTC+00:00", "29 Elul 5784 AM\nYom Revi'i"],
        //["2000-5-17, 10:00:00", "UTC+00:00", "12 Iyyar 5760 AM\nYom Revi'i"],
        //["1999-9-11, 10:00:00", "UTC+00:00", "1 Tishri 5760 AM\nShabbat"],
        //["1999-12-8, 10:00:00", "UTC+00:00", "29 Kislev 5760 AM\nYom Revi'i"],
        //["1999-12-30, 16:00:00", "UTC+00:00", "22 Tevet 5760 AM\nYom Shishi"],
        //["2000-9-30, 10:00:00", "UTC+00:00", "1 Tishri 5761 AM\nShabbat"],
        //["1971-9-20, 10:00:00", "UTC+00:00", "1 Tishri 5732 AM\nYom Sheni"],
        //["359-9-10, 10:00:00", "UTC+00:00", "1 Tishri 4120 AM\nYom Chamishi"],
        //["1797-9-21, 10:00:00", "UTC+00:00", "1 Tishri 5558 AM\nYom Chamishi"],
        //["2005-10-4, 10:00:00", "UTC+00:00", "1 Tishri 5558 AM\nYom Chamishi"],
        //["2006-9-23, 10:00:00", "UTC+00:00", "1 Tishri 5767 AM\nShabbat"],
        //["1972-9-20, 10:00:00", "UTC+00:00", "1 Tishri 5732 AM\nYom Sheni"],
        //["1973-9-20, 10:00:00", "UTC+00:00", "1 Tishri 5732 AM\nYom Sheni"],
    ]);
}

function testCalculateMoladTishri() {
    return runSingleParameterTests("Molad Tishri", lunisolarCalendars.calculateMoladTishri, [
        ["2024-10-2, 16:00:00", "UTC+00:00", "Wed, 02 Oct 2024 16:00:00 GMT"],
        ["1999-9-11, 10:00:00", "UTC+00:00", "Fri, 10 Sep 1999 16:00:00 GMT"],
        ["2000-9-30, 10:00:00", "UTC+00:00", "Fri, 29 Sep 2000 16:00:00 GMT"],
        ["1971-9-20, 10:00:00", "UTC+00:00", "Sun, 19 Sep 1971 16:00:00 GMT"],
        ["359-9-10, 10:00:00", "UTC+00:00", "Wed, 09 Sep 0359 16:00:00 GMT"],
        ["1797-9-21, 10:00:00", "UTC+00:00", "Wed, 20 Sep 1797 16:00:00 GMT"],
        ["2005-10-4, 10:00:00", "UTC+00:00", "Mon, 03 Oct 2005 16:00:00 GMT"],
        ["2006-9-23, 10:00:00", "UTC+00:00", "Fri, 22 Sep 2006 16:00:00 GMT"],
        ["1972-9-20, 10:00:00", "UTC+00:00", "Fri, 08 Sep 1972 16:00:00 GMT"],
        ["1984-9-20, 10:00:00", "UTC+00:00", "Wed, 26 Sep 1984 16:00:00 GMT"],
        ["2035-9-20, 10:00:00", "UTC+00:00", "Wed, 03 Oct 2035 16:00:00 GMT"],
        ["2116-9-20, 10:00:00", "UTC+00:00", "Sun, 06 Sep 2116 16:00:00 GMT"],
        ["2117-9-20, 10:00:00", "UTC+00:00", "Sun, 26 Sep 2117 16:00:00 GMT"],
        ["2115-9-20, 10:00:00", "UTC+00:00", "Wed, 18 Sep 2115 16:00:00 GMT"],
        ["2106-9-20, 10:00:00", "UTC+00:00", "Wed, 29 Sep 2106 16:00:00 GMT"],
        ["1910-9-20, 10:00:00", "UTC+00:00", "Mon, 03 Oct 1910 16:00:00 GMT"],
        ["1800-9-20, 10:00:00", "UTC+00:00", "Fri, 19 Sep 1800 16:00:00 GMT"],
        ["1600-9-20, 10:00:00", "UTC+00:00", "Fri, 08 Sep 1600 16:00:00 GMT"],
        ["2001-9-20, 10:00:00", "UTC+00:00", "Mon, 17 Sep 2001 16:00:00 GMT"],
        ["2002-9-20, 10:00:00", "UTC+00:00", "Fri, 06 Sep 2002 16:00:00 GMT"],
        ["2003-9-20, 10:00:00", "UTC+00:00", "Fri, 26 Sep 2003 16:00:00 GMT"],
    ]);
}

// Run all tests.
export function runLunisolarCalendarTests() {
    const currentDateTime = new Date(Date.UTC(2025, 4, 8, 18, 20, 46));
    setGregJulianDifference(calculateGregorianJulianDifference(currentDateTime));
    generateAllNewMoons(currentDateTime);
    generateAllSolsticesEquinoxes(currentDateTime);
    const testFunctions = [
        testGetSolarTermTypeThisMonth,
        testGetMonthEleven,
        testCalculateFirstMonthWithoutMajorSolarTerm,
        testGetLunisolarCalendarDate,
        testGetChineseLunisolarCalendarDate,
        testGetSexagenaryYear,
        testCalculateHebrewCalendar,
        testCalculateMoladTishri
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Lunisolar Calendars: All Tests Passed.');
    }
}