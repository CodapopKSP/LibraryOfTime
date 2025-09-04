//|------------------------------|
//|     Solar Calendar Tests     |
//|------------------------------|

// Tests for all solar calendars

function runGregorianCalendarTests(testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedDate, expectedTime] of testCases) {
        testCount++;

        const testedDate = parseInputDate(inputDate, timezone);
        const testedTimezoneOffset = convertUTCOffsetToMinutes(timezone);
        const { date: actualDate, time: actualTime } = getGregorianDateTime(testedDate, testedTimezoneOffset);

        if (actualDate !== expectedDate) {
            console.error(`Gregorian Calendar: Test ${testCount} failed (Date).`);
            console.error('Expected:', expectedDate);
            console.error('Received:', actualDate);
            failedTestCount++;
        }

        if (actualTime !== expectedTime) {
            console.error(`Gregorian Calendar: Test ${testCount} failed (Time).`);
            console.error('Expected:', expectedTime);
            console.error('Received:', actualTime);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runCalendarEquinoxTests(calendarName, season, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;
        const testedDate = parseInputDate(inputDate, timezone);
        setGregJulianDifference(calculateGregorianJulianDifference(testedDate));
        const equinox = getSolsticeOrEquinox(testedDate, season);
        const result = getCalendarFunction(testedDate, equinox);

        if (result !== expectedOutput) {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function runSolarTests(calendarName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;
        // Get Timezone Offset for Local Calendars
        const timezoneOffset = convertUTCOffsetToMinutes(timezone);
        const testedDate = parseInputDate(inputDate, timezone);
        const result = getCalendarFunction(testedDate, timezoneOffset);
        if (result !== expectedOutput) {
            console.error(`${calendarName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', result);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testGregorianCalendar() {
    return runGregorianCalendarTests([
        ["100-1-1, 00:00:00", "UTC+00:00", "1 January 100 CE\nFriday", "00:00:00"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "1 January 1000 BCE\nWednesday", "16:00:00"],
        ["2012-2-29, 08:00:00", "UTC+00:00", "29 February 2012 CE\nWednesday", "08:00:00"]
    ]);
}

function testJulianCalendar() {
    return runSolarTests("Julian Calendar", getJulianCalendar, [
        ["1950-1-1, 00:00:00", "UTC+00:00", "19 December 1949 AD\nSunday"],
        ["2-1-1, 00:00:00", "UTC+00:00", "3 January 2 AD\nTuesday"],
        ["1917-11-7, 00:00:00", "UTC+00:00", "25 October 1917 AD\nWednesday"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "11 January 1001 BC\nWednesday"],
    ]);
}

function testAstronomicalCalendar() {
    return runSolarTests("Astronomical Calendar", getAstronomicalDate, [
        ["1950-1-1, 00:00:00", "UTC+00:00", "1 January 1950\nSunday"],
        ["2-1-1, 00:00:00", "UTC+00:00", "3 January 2\nTuesday"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "11 January -1000\nWednesday"],
    ]);
}

function testMinguoCalendar() {
    return runSolarTests("Minguo Calendar", getMinguo, [
        ["1950-1-1, 00:00:00", "UTC+08:00", "民國 39年 1月 1日\n星期天"],
        ["2-1-1, 00:00:00", "UTC+00:00", "民國 -1909年 1月 1日\n星期二"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "民國 -2911年 1月 1日\n星期三"],
    ]);
}

function testJucheCalendar() {
    return runSolarTests("Juche Calendar", getJuche, [
        ["1950-1-1, 00:00:00", "UTC+08:00", "Juche 39.01.1\n일요일"],
        ["2-1-1, 00:00:00", "UTC+00:00", "Juche -1909.01.1\n화요일"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "Juche -2911.01.1\n수요일"],
    ]);
}

function testThaiSolarCalendar() {
    return runSolarTests("Thai Solar Calendar", getThaiSolar, [
        ["1950-1-1, 01:00:00", "UTC+08:00", "1 มกราคม B.E. 2493\nอาทิตย์"],
        ["2-1-1, 00:00:00", "UTC+00:00", "1 มกราคม B.E. 545\nอังคาร"],
        ["-1000-1-1, 16:00:00", "UTC+12:00", "1 มกราคม B.E. -457\nพุธ"],
    ]);
}

function testEraFascistaCalendar() {
    return runSolarTests("Era Fascista Calendar", getEraFascista, [
        ["1922-10-29, 00:00:00", "UTC+01:00", "Anno I"],
        ["1922-10-29, 00:00:00", "UTC+02:00", "Anno O"],
        ["1931-10-29, 00:00:00", "UTC+01:00", "Anno X"],
        ["1932-10-29, 00:00:00", "UTC+01:00", "Anno XI"],
    ]);
}

function testCopticCalendar() {
    return runSolarTests("Coptic Calendar", getCopticDate, [
        ["284-8-29, 00:00:00", "UTC+02:00", "1 Thout 1 AM\nⲃⲉⲕⲃⲁⲧ"],
        ["2025-6-9, 00:00:00", "UTC+02:00", "2 Paoni 1741 AM\nⲥⲟⲙ"],
        ["1875-9-11, 00:00:00", "UTC+02:00", "1 Thout 1592 AM\nⲁⲧⲟⲃⲁⲣ"],
        ["2019-9-11, 00:00:00", "UTC+02:00", "6 Pi Kogi Enavot 1735 AM\nⲅⲟⲡ"],
    ]);
}

function testGeezCalendar() {
    return runSolarTests("Ge'ez Calendar", getEthiopianDate, [
        ["284-8-29, 00:00:00", "UTC+03:00", "1 Mäskäräm ዓ.ም.277\nዓርብ"],
        ["2025-6-9, 00:00:00", "UTC+03:00", "2 Säne ዓ.ም.2017\nሰኑይ"],
        ["1875-9-11, 00:00:00", "UTC+03:00", "1 Mäskäräm ዓ.ም.1868\nቀዳሚት"],
        ["2019-9-11, 00:00:00", "UTC+03:00", "6 Ṗagume ዓ.ም.2011\nረቡዕ"],
    ]);
}

function testByzantineCalendar() {
    return runSolarTests("Byzantine Calendar", getByzantineCalendar, [
        ["-5508-7-19, 00:00:00", "UTC+03:00", "1 September 1 AM\nSaturday"],
        ["-5508-7-19, 23:00:00", "UTC+03:00", "1 September 1 AM\nSaturday"],
        ["-5508-7-18, 00:00:00", "UTC+03:00", "31 August 0 AM\nFriday"],
        ["2025-6-10, 00:00:00", "UTC+03:00", "28 May 7533 AM\nTuesday"],
        ["1492-8-10, 00:00:00", "UTC+03:00", "1 August 7000 AM\nWednesday"],
    ]);
}

function testFlorentineCalendar() {
    return runSolarTests("Florentine Calendar", getFlorentineCalendar, [
        ["1-3-22, 17:00:00", "UTC+00:00", "25 March 1 AD\nFriday"],
        ["1-3-22, 16:00:00", "UTC+00:00", "24 March 1 BC\nThursday"],
        ["2000-8-10, 18:00:00", "UTC+01:00", "29 July 2000 AD\nFriday"],
        ["2000-1-13, 18:00:00", "UTC+01:00", "1 January 1999 AD\nFriday"],
    ]);
}

function testPisanCalendar() {
    return runSolarTests("Pisan Calendar", getPisanCalendar, [
        ["0-3-22, 23:00:00", "UTC+00:00", "25 March 1 AD\nThursday"],
        ["1-3-22, 16:00:00", "UTC+00:00", "24 March 1 AD\nThursday"],
        ["2000-8-10, 00:00:00", "UTC+01:00", "28 July 2001 AD\nThursday"],
        ["2000-1-14, 00:00:00", "UTC+01:00", "1 January 2000 AD\nFriday"],
    ]);
}

function testVenetianCalendar() {
    return runSolarTests("Venetian Calendar", getVenetianCalendar, [
        ["1-2-25, 23:00:00", "UTC+00:00", "28 February 1 BC\nMonday"],
        ["1-2-26, 23:00:00", "UTC+00:00", "1 March 1 AD\nTuesday"],
        ["1-3-22, 16:00:00", "UTC+00:00", "24 March 1 AD\nThursday"],
        ["2000-8-10, 00:00:00", "UTC+01:00", "28 July 2000 AD\nThursday"],
        ["2000-1-13, 00:00:00", "UTC+01:00", "31 December 1999 AD\nThursday"],
        ["2000-1-14, 00:00:00", "UTC+01:00", "1 January 1999 AD\nFriday"],
    ]);
}

function testPataphysicalCalendar() {
    return runSolarTests("Pataphysical Calendar", getPataphysicalDate, [
        ["1873-9-8, 00:00:00", "UTC+00:00", "1 Absolu 1 A.P.\nLundi"],
        ["1873-9-8, 00:00:00", "UTC+14:00", "1 Absolu 1 A.P.\nLundi"],
        ["2000-1-1, 00:00:00", "UTC-00:00", "4 Décervelage 127 A.P.\nSamedi"],
        ["2000-1-1, 00:00:00", "UTC-12:00", "4 Décervelage 127 A.P.\nSamedi"],
        ["2012-11-10, 00:00:00", "UTC+00:00", "8 As 140 A.P.\nSamedi"],
        ["2012-11-10, 23:00:00", "UTC+14:00", "8 As 140 A.P.\nSamedi"],
    ]);
}

function testDiscordianCalendar() {
    return runSolarTests("Discordian Calendar", getDiscordianDate, [
        ["-1165-1-5, 00:00:00", "UTC+00:00", "5 Chaos 1 YOLD\nSweetmorn"],
        ["-1165-1-5, 00:00:00", "UTC+14:00", "5 Chaos 1 YOLD\nSweetmorn"],
        ["2000-3-19, 00:00:00", "UTC+00:00", "5 Discord 3166 YOLD\nPrickle-Prickle"],
        ["2000-3-19, 00:00:00", "UTC-12:00", "5 Discord 3166 YOLD\nPrickle-Prickle"],
        ["2025-12-8, 00:00:00", "UTC+00:00", "50 The Aftermath 3191 YOLD\nPungenday"],
        ["2025-12-8, 23:00:00", "UTC+14:00", "50 The Aftermath 3191 YOLD\nPungenday"],
        ["2024-2-29, 23:00:00", "UTC+14:00", "St. Tib's Day 3190 YOLD\nSetting Orange"],
    ]);
}

function testQadimiCalendar() {
    return runSolarTests("Qadimi Calendar", getQadimiDate, [
        ["632-6-19, 02:30:00", "UTC+00:00", "Hormazd Farvardin 1 Y.Z.\nDoshanbeh"],
        ["632-6-19, 01:30:00", "UTC+00:00", "Vahishtoishti 0 Y.Z.\nYekshanbeh"],
        ["2000-7-22, 02:30:00", "UTC+00:00", "Hormazd Farvardin 1370 Y.Z.\nJomeh"],
        ["1300-1-8, 06:00:00", "UTC+03:30", "Hormazd Farvardin 669 Y.Z.\nPanjshanbeh"],
        ["1301-1-8, 06:00:00", "UTC+03:30", "Hormazd Farvardin 670 Y.Z.\nJomeh"],
    ]);
}

function testEgyptianCivilCalendar() {
    return runSolarTests("Egyptian Civil Calendar", getEgyptianDate, [
        ["-2781-6-26, 22:00:00", "UTC+00:00", "I Akhet 1 (0)"],
        ["-2781-6-26, 21:00:00", "UTC+00:00", "Nephthys (-1)"],
        ["-3500-6-18, 00:00:00", "UTC+02:00", "III Peret 3 (-720)"],
        ["500-7-22, 00:00:00", "UTC+02:00", "IV Akhet 2 (3283)"],
    ]);
}

function testISOWeekDateCalendar() {
    return runSolarTests("ISO Week Date Calendar", getISOWeekDate, [
        ["1-1-1, 00:00:00", "UTC+00:00", "1-W1-1"],
        ["1-1-1, 00:00:00", "UTC+14:00", "1-W1-1"],
        ["2005-1-1, 00:00:00", "UTC+00:00", "2004-W53-6"],
        ["2005-1-1, 00:00:00", "UTC-12:00", "2004-W53-6"],
        ["2025-6-14, 23:00:00", "UTC+14:00", "2025-W24-6"],
        ["2025-6-14, 00:00:00", "UTC+00:00", "2025-W24-6"],
        ["2006-12-31, 00:00:00", "UTC+00:00", "2006-W52-7"],
        ["2006-12-31, 23:00:00", "UTC+00:00", "2006-W52-7"],
    ]);
}

function testHaabCalendar() {
    return runSolarTests("Haab Calendar", getHaabDate, [
        ["2025-6-14, 06:00:00", "UTC+00:00", "16 Sotz'"],
        ["1000-1-6, 00:00:00", "UTC-06:00", "13 Wo'"],
        ["1500-6-25, 00:00:00", "UTC-06:00", "4 K'ayab'"],
    ]);
}

function testBahaiCalendar() {
    const equinox = 'spring';
    return runCalendarEquinoxTests("Bahai Calendar", equinox, getBahaiCalendar, [
        ["2025-3-19, 14:30:00", "UTC+00:00", "1 Bahá 182 BE\nIstijlál"],
        ["1844-3-19, 18:00:00", "UTC+03:30", "1 Bahá 1 BE\n‘Idál"],
        ["2064-3-19, 14:30:00", "UTC+00:00", "1 Bahá 221 BE\nIstijlál"],
        ["2035-11-1, 13:30:00", "UTC+00:00", "17 ‘Ilm 192 BE\nIstijlál"],
        ["2018-2-28, 14:30:00", "UTC+00:00", "5 Ayyám-i-Há 174 BE\nIstijlál"]
    ]);
}

function testSolarHijriCalendar() {
    const equinox = 'spring';
    return runCalendarEquinoxTests("Solar Hijri Calendar", equinox, getSolarHijriDate, [
        ["2025-6-11, 17:30:00", "UTC+00:00", "21 Khordad 1404 SH\nSeshanbeh"],
        ["2025-6-11, 20:30:00", "UTC+00:00", "22 Khordad 1404 SH\nChaharshanbeh"],
        ["622-3-22, 23:00:00", "UTC+03:30", "1 Farvardin 1 SH\nPanjshanbeh"],
        ["622-3-21, 20:00:00", "UTC+03:30", "30 Esfand -1 SH\nChaharshanbeh"],
        ["622-3-20, 00:00:00", "UTC+03:30", "29 Esfand -1 SH\nSeshanbeh"]
    ]);
}

function testFrenchRepublicanCalendar() {
    const equinox = 'autumn';
    return runCalendarEquinoxTests("French Republican Calendar", equinox, getRepublicanCalendar, [
        ["1792-9-22, 01:00:00", "UTC+00:00", "1 Vendémiaire I RE\nPrimidi Décade 1"],
        ["1793-9-22, 01:00:00", "UTC+00:00", "1 Vendémiaire II RE\nPrimidi Décade 1"],
        ["1793-9-22, 10:00:00", "UTC+00:00", "1 Vendémiaire II RE\nPrimidi Décade 1"],
        ["1795-9-22, 01:00:00", "UTC+00:00", "6 Sansculottides III RE\nLa Fête de la Révolution"]
    ]);
}

function testAnnoLucisCalendar() {
    return runSolarTests("Anno Lucis Calendar", getAnnoLucisDate, [
        ["2025-1-1, 00:00:00", "UTC+00:00", "1 January 6025 AL\nWednesday"],
        ["-3999-1-1, 00:00:00", "UTC+14:00", "1 January 1 AL\nMonday"],
        ["-4001-1-1, 00:00:00", "UTC+14:00", "1 January -1 AL\nFriday"],
    ]);
}

// Run all tests.
function runSolarCalendarTests() {
    const testFunctions = [
        testGregorianCalendar,
        testJulianCalendar,
        testAstronomicalCalendar,
        testMinguoCalendar,
        testJucheCalendar,
        testThaiSolarCalendar,
        testFrenchRepublicanCalendar,
        testEraFascistaCalendar,
        testCopticCalendar,
        testGeezCalendar,
        testByzantineCalendar,
        testFlorentineCalendar,
        testPisanCalendar,
        testVenetianCalendar,
        testBahaiCalendar,
        testPataphysicalCalendar,
        testDiscordianCalendar,
        testSolarHijriCalendar,
        testQadimiCalendar,
        testEgyptianCivilCalendar,
        testISOWeekDateCalendar,
        testHaabCalendar,
        testAnnoLucisCalendar
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Solar Calendars: All Tests Passed.');
    }
}