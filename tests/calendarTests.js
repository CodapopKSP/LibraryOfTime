
import {convertUTCOffsetToMinutes, parseInputDate, adjustCalendarType, setCalendarType} from '../userInterface.js';
import * as solarCalendars from '../Calendars/solarCalendars.js';
import * as astronomicalData from '../Other/astronomicalData.js';


function testTimezoneFormatter() {
    let testCount = 0;
    let passedTestCount = 0;

    function testTimezoneFormatter_test(timezoneTest, minutesTest) {
        testCount += 1;
        let minutes = convertUTCOffsetToMinutes(timezoneTest);
        if (minutes === minutesTest) {
            passedTestCount += 1;
        } else {
            console.error('Timezone Offset: Test ' + testCount + ' failed.');
        }
    }

    // Tests - Timezone, Output Minutes
    testTimezoneFormatter_test('UTC+08:00', 480);
    testTimezoneFormatter_test('UTC+00:00', 0);
    testTimezoneFormatter_test('UTC-12:00', -720);

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Timezone Offset: All Tests Passed');
    }
}

function testParseDate() {
    let testCount = 0;
    let passedTestCount = 0;

    function testParseDate_test(testedDate, testedTimezone, parsedDateTest) {
        testCount += 1;
        let parsedDate = parseInputDate(testedDate, testedTimezone);
        parsedDate = parsedDate.toUTCString();
        if (parsedDate === parsedDateTest) {
            passedTestCount += 1;
        } else {
            console.error('Parse Date: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Timezone, Output Date
    testParseDate_test('1950-1-1, 00:00:00', 'UTC+00:00', 'Sun, 01 Jan 1950 00:00:00 GMT');
    testParseDate_test('2000-12-31, 00:00:00', 'UTC+08:00', 'Sat, 30 Dec 2000 16:00:00 GMT');
    testParseDate_test('2016-2-29, 00:00:00', 'UTC+12:00', 'Sun, 28 Feb 2016 12:00:00 GMT');
    testParseDate_test('0001-1-2, 00:00:00', 'UTC-10:00', 'Tue, 02 Jan 0001 10:00:00 GMT');

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Parse Date: All Tests Passed');
    }
}

function testCalendarType() {
    let testCount = 0;
    let passedTestCount = 0;

    function testCalendarType_test(testedDate_, testedTimezone, parsedDateTest) {
        testCount += 1;
        let testedDate = parseInputDate(testedDate_, testedTimezone);
        let parsedDate = adjustCalendarType(testedDate);
        parsedDate = parsedDate.toUTCString();
        if (parsedDate === parsedDateTest) {
            passedTestCount += 1;
        } else {
            console.error('Calendar Type: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Calendar Type, Output Date
    testCalendarType_test("2024-1-1, 00:00:00", "UTC+00:00", 'Mon, 01 Jan 2024 00:00:00 GMT');
    setCalendarType('julian-liturgical');
    testCalendarType_test("2000-1-1, 23:00:00", "UTC+00:00", 'Fri, 14 Jan 2000 23:00:00 GMT');
    setCalendarType('astronomical');
    testCalendarType_test("1000-1-1, 00:00:00", "UTC+00:00", 'Mon, 06 Jan 1000 00:00:00 GMT');
    setCalendarType('gregorian-proleptic');

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Calendar Type: All Tests Passed');
    }
}

function testGregorianCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testGregorianCalendar_test(testedDate_, testedTimezone, parsedDateTest, parsedTimeTest) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        let testedTimezoneOffset = convertUTCOffsetToMinutes(testedTimezone)
        let gregDateTime = solarCalendars.getGregorianDateTime(testedDate, testedTimezoneOffset);
        let parsedDate = gregDateTime.date;
        let parsedTime = gregDateTime.time;
        if (parsedDate === parsedDateTest) {
            passedTestCount += 0.5;
        } else {
            console.error('Gregorian Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
        if (parsedTime === parsedTimeTest) {
            passedTestCount += 0.5;
        } else {
            console.error('Gregorian Calendar: Test ' + testCount + ' failed.');
            console.error(parsedTime);
        }
    }

    // Tests - Input Date, Output Date, Output Time
    testGregorianCalendar_test("100-1-1, 00:00:00", "UTC+00:00", "1 January 100 CE\nFriday", "00:00:00");
    testGregorianCalendar_test("-1000-1-1, 16:00:00", "UTC+12:00", "1 January 1000 BCE\nWednesday", "16:00:00");
    testGregorianCalendar_test("2012-2-29, 08:00:00", "UTC+00:00", "29 February 2012 CE\nWednesday", "08:00:00");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Gregorian Calendar: All Tests Passed');
    }
}

function testFrenchRepublicanCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testFrenchRepublicanCalendar_test(testedDate_, testedTimezone, testCase) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        const springEquinox = astronomicalData.getCurrentSolsticeOrEquinox(testedDate, 'autumn');
        let parsedDate = solarCalendars.getRepublicanCalendar(testedDate, springEquinox);
        if (parsedDate === testCase) {
            passedTestCount += 1;
        } else {
            console.error('French Republican Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Output Date, Output Time
    testFrenchRepublicanCalendar_test("1792-9-22, 01:00:00", "UTC+00:00", "1 Vendémiaire I RE\nPrimidi Décade 1");
    testFrenchRepublicanCalendar_test("1793-9-22, 01:00:00", "UTC+00:00", "1 Vendémiaire II RE\nPrimidi Décade 1");
    testFrenchRepublicanCalendar_test("1793-9-22, 10:00:00", "UTC+00:00", "1 Vendémiaire II RE\nPrimidi Décade 1");
    testFrenchRepublicanCalendar_test("1795-9-22, 01:00:00", "UTC+00:00", "6 Sansculottides III RE\nLa Fête de la Révolution");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('French Republican Calendar: All Tests Passed');
    }
}

function testBahaiCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testBahaiCalendar_test(testedDate_, testedTimezone, testCase) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        const springEquinox = astronomicalData.getCurrentSolsticeOrEquinox(testedDate, 'spring');
        let parsedDate = solarCalendars.getBahaiCalendar(testedDate, springEquinox);
        if (parsedDate === testCase) {
            passedTestCount += 1;
        } else {
            console.error('Bahai Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Output Date, Output Time
    testBahaiCalendar_test("2025-3-19, 14:30:00", "UTC+00:00", "1 Bahá 182 BE\n‘Idál");
    testBahaiCalendar_test("1844-3-19, 18:00:00", "UTC+03:30", "1 Bahá 1 BE\nFiḍál");
    testBahaiCalendar_test("2064-3-19, 14:30:00", "UTC+00:00", "1 Bahá 221 BE\n‘Idál");
    testBahaiCalendar_test("2035-11-1, 13:30:00", "UTC+00:00", "17 ‘Ilm 192 BE\nIstijlál");
    testBahaiCalendar_test("2018-2-28, 14:30:00", "UTC+00:00", "5 Ayyám-i-Há 174 BE\n‘Idál");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Bahai Calendar: All Tests Passed');
    }
}

function testSolarHijriCalendar() {
    let testCount = 0;
    let passedTestCount = 0;

    function testSolarHijriCalendar_test(testedDate_, testedTimezone, testCase) {
        testCount += 1;

        let testedDate = parseInputDate(testedDate_, testedTimezone);
        const springEquinox = astronomicalData.getCurrentSolsticeOrEquinox(testedDate, 'spring');
        let parsedDate = solarCalendars.getSolarHijriDate(testedDate, springEquinox);
        if (parsedDate === testCase) {
            passedTestCount += 1;
        } else {
            console.error('Solar Hijri Calendar: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Output Date, Output Time
    testSolarHijriCalendar_test("2025-6-11, 17:30:00", "UTC+00:00", "21 Khordad 1404 SH\nSeshanbeh");
    testSolarHijriCalendar_test("2025-6-11, 20:30:00", "UTC+00:00", "22 Khordad 1404 SH\nChaharshanbeh");
    testSolarHijriCalendar_test("622-3-19, 23:00:00", "UTC+03:30", "1 Farvardin 1 SH\nDoshanbeh");
    testSolarHijriCalendar_test("622-3-18, 20:00:00", "UTC+03:30", "30 Esfand -1 SH\nYekshanbeh");
    testSolarHijriCalendar_test("622-3-17, 00:00:00", "UTC+03:30", "29 Esfand -1 SH\nShanbeh");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Solar Hijri Calendar: All Tests Passed');
    }
}

function runCalendarTests(calendarName, getCalendarFunction, testCases) {
    let testCount = 0;
    let passedTestCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount += 1;
        const testedDate = parseInputDate(inputDate, timezone);
        const result = getCalendarFunction(testedDate);
        if (result === expectedOutput) {
            passedTestCount += 1;
        } else {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
        }
    }

    if (testCount === passedTestCount) {
        console.log(`${calendarName}: All Tests Passed`);
    }
}

function testJulianCalendar() {
    runCalendarTests("Julian Calendar", solarCalendars.getJulianCalendar, [
        ["1950-1-1, 00:00:00", "UTC+00:00", "19 December 1949 AD\nSunday"],
        ["2-1-1, 00:00:00", "UTC+00:00", "3 January 2 AD\nTuesday"],
        ["1917-11-7, 00:00:00", "UTC+00:00", "25 October 1917 AD\nWednesday"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "11 January 1001 BC\nWednesday"],
    ]);
}

function testAstronomicalCalendar() {
    runCalendarTests("Astronomical Calendar", solarCalendars.getAstronomicalDate, [
        ["1950-1-1, 00:00:00", "UTC+00:00", "1 January 1950\nSunday"],
        ["2-1-1, 00:00:00", "UTC+00:00", "3 January 2\nTuesday"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "11 January -1000\nWednesday"],
    ]);
}

function testMinguoCalendar() {
    runCalendarTests("Minguo Calendar", solarCalendars.getMinguo, [
        ["1950-1-1, 00:00:00", "UTC+08:00", "民國 39年 1月 1日\n星期天"],
        ["2-1-1, 00:00:00", "UTC+00:00", "民國 -1909年 1月 1日\n星期二"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "民國 -2911年 1月 1日\n星期三"],
    ]);
}

function testJucheCalendar() {
    runCalendarTests("Juche Calendar", solarCalendars.getJuche, [
        ["1950-1-1, 00:00:00", "UTC+08:00", "Juche 39.01.1\n일요일"],
        ["2-1-1, 00:00:00", "UTC+00:00", "Juche -1909.01.1\n화요일"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "Juche -2911.01.1\n수요일"],
    ]);
}

function testThaiSolarCalendar() {
    runCalendarTests("Thai Solar Calendar", solarCalendars.getThaiSolar, [
        ["1950-1-1, 01:00:00", "UTC+08:00", "1 มกราคม B.E. 2493\nอาทิตย์"],
        ["2-1-1, 00:00:00", "UTC+00:00", "1 มกราคม B.E. 545\nอังคาร"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "1 มกราคม B.E. -457\nพุธ"],
    ]);
}

function testEraFascistaCalendar() {
    runCalendarTests("Era Fascista Calendar", solarCalendars.getEraFascista, [
        ["1922-10-29, 00:00:00", "UTC+01:00", "Anno I"],
        ["1922-10-29, 00:00:00", "UTC+02:00", "Anno O"],
        ["1931-10-29, 00:00:00", "UTC+01:00", "Anno X"],
        ["1932-10-29, 00:00:00", "UTC+01:00", "Anno XI"],
    ]);
}

function testCopticCalendar() {
    runCalendarTests("Coptic Calendar", solarCalendars.getCopticDate, [
        ["284-8-29, 00:00:00", "UTC+02:00", "1 Thout 1 AM\nⲃⲉⲕⲃⲁⲧ"],
        ["2025-6-9, 00:00:00", "UTC+02:00", "2 Paoni 1741 AM\nⲥⲟⲙ"],
        ["1875-9-11, 00:00:00", "UTC+02:00", "1 Thout 1592 AM\nⲁⲧⲟⲃⲁⲣ"],
        ["2019-9-11, 00:00:00", "UTC+02:00", "6 Pi Kogi Enavot 1735 AM\nⲅⲟⲡ"],
    ]);
}

function testGeezCalendar() {
    runCalendarTests("Ge'ez Calendar", solarCalendars.getEthiopianDate, [
        ["284-8-29, 00:00:00", "UTC+03:00", "1 Mäskäräm ዓ.ም.277\nዓርብ"],
        ["2025-6-9, 00:00:00", "UTC+03:00", "2 Säne ዓ.ም.2017\nሰኑይ"],
        ["1875-9-11, 00:00:00", "UTC+03:00", "1 Mäskäräm ዓ.ም.1868\nቀዳሚት"],
        ["2019-9-11, 00:00:00", "UTC+03:00", "6 Ṗagume ዓ.ም.2011\nረቡዕ"],
    ]);
}

function testByzantineCalendar() {
    runCalendarTests("Byzantine Calendar", solarCalendars.getByzantineCalendar, [
        ["-5508-7-19, 00:00:00", "UTC+03:00", "1 September 1 AM\nSaturday"],
        ["-5508-7-19, 23:00:00", "UTC+03:00", "1 September 1 AM\nSaturday"],
        ["-5508-7-18, 00:00:00", "UTC+03:00", "31 August 0 AM\nFriday"],
        ["2025-6-10, 00:00:00", "UTC+03:00", "28 May 7533 AM\nTuesday"],
        ["1492-8-10, 00:00:00", "UTC+03:00", "1 August 7000 AM\nWednesday"],
    ]);
}

function testFlorentineCalendar() {
    runCalendarTests("Florentine Calendar", solarCalendars.getFlorentineCalendar, [
        ["1-3-22, 17:00:00", "UTC+00:00", "25 March 1 AD\nFriday"],
        ["1-3-22, 16:00:00", "UTC+00:00", "24 March 1 BC\nThursday"],
        ["2000-8-10, 18:00:00", "UTC+01:00", "29 July 2000 AD\nFriday"],
        ["2000-1-13, 18:00:00", "UTC+01:00", "1 January 1999 AD\nFriday"],
    ]);
}

function testPisanCalendar() {
    runCalendarTests("Pisan Calendar", solarCalendars.getPisanCalendar, [
        ["0-3-22, 23:00:00", "UTC+00:00", "25 March 1 AD\nThursday"],
        ["1-3-22, 16:00:00", "UTC+00:00", "24 March 1 AD\nThursday"],
        ["2000-8-10, 00:00:00", "UTC+01:00", "28 July 2001 AD\nThursday"],
        ["2000-1-14, 00:00:00", "UTC+01:00", "1 January 2000 AD\nFriday"],
    ]);
}

function testVenetianCalendar() {
    runCalendarTests("Venetian Calendar", solarCalendars.getVenetianCalendar, [
        ["1-2-25, 23:00:00", "UTC+00:00", "28 February 1 BC\nMonday"],
        ["1-2-26, 23:00:00", "UTC+00:00", "1 March 1 AD\nTuesday"],
        ["1-3-22, 16:00:00", "UTC+00:00", "24 March 1 AD\nThursday"],
        ["2000-8-10, 00:00:00", "UTC+01:00", "28 July 2000 AD\nThursday"],
        ["2000-1-13, 00:00:00", "UTC+01:00", "31 December 1999 AD\nThursday"],
        ["2000-1-14, 00:00:00", "UTC+01:00", "1 January 1999 AD\nFriday"],
    ]);
}

function testPataphysicalCalendar() {
    runCalendarTests("Pataphysical Calendar", solarCalendars.getPataphysicalDate, [
        ["1873-9-8, 00:00:00", "UTC+00:00", "1 Absolu 1 A.P.\nLundi"],
        ["2000-1-1, 00:00:00", "UTC+00:00", "4 Décervelage 127 A.P.\nSamedi"],
        ["2012-11-10, 00:00:00", "UTC+00:00", "8 As 140 A.P.\nSamedi"],
    ]);
}

function testDiscordianCalendar() {
    runCalendarTests("Discordian Calendar", solarCalendars.getDiscordianDate, [
        ["-1165-1-5, 00:00:00", "UTC+00:00", "5 Chaos 1 YOLD\nSweetmorn"],
        ["2000-3-19, 00:00:00", "UTC+00:00", "5 Discord 3166 YOLD\nPrickle-Prickle"],
        ["2025-12-8, 00:00:00", "UTC+00:00", "50 The Aftermath 3191 YOLD\nPungenday"],
    ]);
}

// Run all tests.
testParseDate();
testTimezoneFormatter();
testCalendarType();
testGregorianCalendar();
testJulianCalendar();
testAstronomicalCalendar();
testMinguoCalendar();
testJucheCalendar();
testThaiSolarCalendar();
testFrenchRepublicanCalendar();
testEraFascistaCalendar();
testCopticCalendar();
testGeezCalendar();
testByzantineCalendar();
testFlorentineCalendar();
testPisanCalendar();
testVenetianCalendar();
testBahaiCalendar();
testPataphysicalCalendar();
testDiscordianCalendar();
testSolarHijriCalendar();

if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}
