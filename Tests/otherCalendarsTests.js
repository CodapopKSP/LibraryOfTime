//|-------------------------------|
//|     Other Calendars Tests     |
//|-------------------------------|

// Tests for all other calendars

function runOtherCalendarSingleParamTests(timeName, getCalendarFunction, testCases) {
    let failedTestCount = 0;
    let testCount = 0;

    for (const [inputDate, timezone, expectedOutput] of testCases) {
        testCount++;
        const timezoneOffset = convertUTCOffsetToMinutes(timezone);
        const testedDate = parseInputDate(inputDate, timezone);
        let result = getCalendarFunction(testedDate);
        const display = (result && typeof result === 'object' && 'output' in result && result.output != null) ? result.output : (result instanceof Date ? result.toUTCString() : (typeof result === 'string' ? result : String(result || '')));
        if (display !== expectedOutput) {
            console.error(`${timeName}: Test ${testCount} failed.`);
            console.error('Expected:', expectedOutput);
            console.error('Received:', display);
            failedTestCount++;
        }
    }

    return failedTestCount;
}

function testMayaLongCount() {
    return runOtherCalendarSingleParamTests("Maya Long Count", getCurrentMayaLongCount, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "0.0.0.0.0"],
        ["2012-12-21, 06:00:00", "UTC+00:00", "13.0.0.0.0"],
    ]);
}

function testTzolkin() {
    return runOtherCalendarSingleParamTests("Tzolkin", getTzolkinDate, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "4 Ajaw"],
        ["2025-7-21, 06:00:00", "UTC+00:00", "10 Men"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "9 Ix"],
    ]);
}

function testLordOfTheNightY() {
    return runOtherCalendarSingleParamTests("Lord of the Night | Y", getLordOfTheNight, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "G9 | Y3"],
        ["2025-7-21, 06:00:00", "UTC+00:00", "G5 | Y3"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "G4 | Y2"],
    ]);
}

function testYugaCycle() {
    return runOtherCalendarSingleParamTests("Yuga Cycle", getYugaCycle, [
        ["-3101-1-22, 00:00:00", "UTC+00:00", "Dvapara Yuga: Sandhyamsa"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "Kali Yuga: Sandhya"],
    ]);
}

function testSothicCycle() {
    return runOtherCalendarSingleParamTests("Sothic Cycle", getSothicCycle, [
        ["-2781-6-27, 00:00:00", "UTC+00:00", "Cycle: 1 | Year: 1"],
        ["139-7-19, 00:00:00", "UTC+00:00", "Cycle: 3 | Year: 1"],
    ]);
}

function testOlympiad() {
    return runOtherCalendarSingleParamTests("Olympiad", getOlympiad, [
        ["-775-7-24, 00:00:00", "UTC+00:00", "1 | Year: 1"],
        ["-775-7-23, 00:00:00", "UTC+00:00", "0 | Year: 4"],
        ["-771-7-24, 00:00:00", "UTC+00:00", "2 | Year: 1"],
    ]);
}

function testPawukon() {
    return runOtherCalendarSingleParamTests("Pawukon", getPawukonCalendarDate, [
        ["2020-7-4, 16:00:00", "UTC+00:00", "Menga Pasah Sri Paing Tungleh Redite Sri Dangu Sri\nWeek Name: Sinta"],
        ["2020-7-5, 16:00:00", "UTC+00:00", "Luang Pepet Beteng Laba Pon Aryang Soma Indra Dangu Pati\nWeek Name: Sinta"],
        ["2020-7-3, 16:00:00", "UTC+00:00", "Menga Kajeng Menala Umanis Maulu Saniscara Uma Dadi Sri\nWeek Name: Watugunung"],
        ["2020-9-13, 16:00:00", "UTC+00:00", "Luang Pepet Kajeng Jaya Pon Maulu Soma Kala Erangan Pati\nWeek Name: Dunggulan"],
        ["2020-9-14, 16:00:00", "UTC+00:00", "Luang Pepet Pasah Jaya Wage Tungleh Anggara Kala Urungan Raja\nWeek Name: Dunggulan"],
        ["2020-9-15, 16:00:00", "UTC+00:00", "Luang Pepet Beteng Menala Keliwon Aryang Buda Uma Tulus Manuh\nWeek Name: Dunggulan"],
        ["2021-1-30, 16:00:00", "UTC+00:00", "Menga Pasah Sri Paing Tungleh Redite Sri Dangu Sri\nWeek Name: Sinta"],
        ["2021-1-29, 16:00:00", "UTC+00:00", "Menga Kajeng Menala Umanis Maulu Saniscara Uma Dadi Sri\nWeek Name: Watugunung"],
        ["2019-12-7, 16:00:00", "UTC+00:00", "Menga Pasah Sri Paing Tungleh Redite Sri Dangu Sri\nWeek Name: Sinta"],
        ["2019-12-6, 16:00:00", "UTC+00:00", "Menga Kajeng Menala Umanis Maulu Saniscara Uma Dadi Sri\nWeek Name: Watugunung"],
        ["2020-2-16, 16:00:00", "UTC+00:00", "Luang Pepet Kajeng Jaya Pon Maulu Soma Kala Erangan Pati\nWeek Name: Dunggulan"],
        ["2020-2-17, 16:00:00", "UTC+00:00", "Luang Pepet Pasah Jaya Wage Tungleh Anggara Kala Urungan Raja\nWeek Name: Dunggulan"],
        ["2020-2-18, 16:00:00", "UTC+00:00", "Luang Pepet Beteng Menala Keliwon Aryang Buda Uma Tulus Manuh\nWeek Name: Dunggulan"],
    ]);
}

function testJapaneseLunisolarCalendar() {
    const currentDateTime = createAdjustedDateTime({ year: 2025, month: 4, day: 8, hour: 18, minute: 20, second: 46 });
    setGregJulianDifference(calculateGregorianJulianDifference(currentDateTime));
    generateAllNewMoons(currentDateTime);
    generateAllSolsticesEquinoxes(currentDateTime);
    return runOtherCalendarSingleParamTests('Japanese Lunisolar', getJapaneseLunisolarCalendarDate, [
        ['2025-12-1, 00:00:00', 'UTC+09:00', '令和7年12月1日\n神武紀元2685年\n甲辰'],
        ['2019-5-1, 00:00:00', 'UTC+09:00', '令和元年5月1日\n神武紀元2679年\n戊戌'],
        ['2020-5-1, 00:00:00', 'UTC+09:00', '令和2年5月1日\n神武紀元2680年\n甲辰'],
        ['1872-12-30, 00:00:00', 'UTC+09:00', '明治5年12月1日\n神武紀元2532年\n辛亥'],
        ['1872-12-31, 00:00:00', 'UTC+09:00', '明治5年12月2日\n神武紀元2532年\n壬子'],
        ['1872-12-31, 17:59:59', 'UTC+09:00', '明治5年12月2日\n神武紀元2532年\n壬子'],
        ['1872-12-31, 18:00:00', 'UTC+09:00', '明治5年12月2日\n神武紀元2532年\n壬子'],
        ['1873-1-1, 00:00:00', 'UTC+09:00', '明治6年1月1日\n神武紀元2533年\n癸丑'],
        ['1873-1-2, 00:00:00', 'UTC+09:00', '明治6年1月2日\n神武紀元2533年\n甲寅'],
        ['1461-2-9, 15:00:00', 'UTC+09:00', '長禄5年1月20日\n神武紀元2121年\n壬辰'],
        ['1461-2-9, 18:00:00', 'UTC+09:00', '長禄5年1月20日\n神武紀元2121年\n壬辰'],
        ['1461-2-10, 00:00:00', 'UTC+09:00', '寛正元年1月21日\n神武紀元2121年\n癸巳'],
        // Lunar New Year 645 CE (JST): Jinmu 1305 per 西暦+660 anchored to lunisolar year before 1873 reform
        ['645-2-5, 12:00:00', 'UTC+09:00', '1305年1月1日\n庚午'],
        ['2019-1-27, 00:00:00', 'UTC+09:00', '平成31年1月27日\n神武紀元2679年\n甲子'],
    ]);
}

// Expectations derived from the calendar definitions: each epoch instant is
// day 1 of Januarius/Sagittarius of the starting year on weekday Solis, and the
// 8-circad week cycles continuously in both directions from there.
function testGalileanCalendar() {
    let failedTestCount = 0;
    failedTestCount += runOtherCalendarSingleParamTests("Galilean (Io)", (dt) => getGalileanDate(dt, 'Io'), [
        ["2001-12-31, 16:07:45", "UTC+00:00", "1 Io Januarius 2002\nIo Solis"],          // exact epoch
        ["2002-1-1, 13:22:03", "UTC+00:00", "2 Io Januarius 2002\nIo Lunae"],            // epoch + 1 circad (21.23833h)
        ["2001-12-31, 16:07:44", "UTC+00:00", "32 Io December 2001\nIo Saturni"],        // last day of leap year 2001 (416 circads)
        ["2001-1-4, 15:00:00", "UTC+00:00", "9 Io Januarius 2001\nIo Solis"],            // 408 circads before epoch
    ]);
    failedTestCount += runOtherCalendarSingleParamTests("Galilean (Eu)", (dt) => getGalileanDate(dt, 'Eu'), [
        ["2002-1-2, 17:12:57", "UTC+00:00", "1 Eu Januarius 2002\nEu Solis"],
    ]);
    failedTestCount += runOtherCalendarSingleParamTests("Galilean (Gan)", (dt) => getGalileanDate(dt, 'Gan'), [
        ["2002-1-1, 11:08:29", "UTC+00:00", "1 Gan Januarius 2002\nGan Solis"],
    ]);
    failedTestCount += runOtherCalendarSingleParamTests("Galilean (Cal)", (dt) => getGalileanDate(dt, 'Cal'), [
        ["2001-12-28, 12:27:23", "UTC+00:00", "1 Cal Januarius 2002\nCal Solis"],
    ]);
    return failedTestCount;
}

function testDarianGalileanCalendar() {
    let failedTestCount = 0;
    failedTestCount += runOtherCalendarSingleParamTests("Darian Galilean (Io)", (dt) => getDarianGalileanDate(dt, 'Io'), [
        ["1609-3-13, 05:29:26", "UTC+00:00", "1 Io Sagittarius 0\nIo Solis"],            // exact epoch
        ["1609-3-13, 05:29:25", "UTC+00:00", "32 Io Vrishika -1\nIo Saturni"],           // last day of year -1 (776 circads)
    ]);
    failedTestCount += runOtherCalendarSingleParamTests("Darian Galilean (Eu)", (dt) => getDarianGalileanDate(dt, 'Eu'), [
        ["1609-3-12, 01:19:41", "UTC+00:00", "1 Eu Sagittarius 0\nEu Solis"],
    ]);
    failedTestCount += runOtherCalendarSingleParamTests("Darian Galilean (Gan)", (dt) => getDarianGalileanDate(dt, 'Gan'), [
        ["1609-3-11, 09:52:12", "UTC+00:00", "1 Gan Sagittarius 0\nGan Solis"],
    ]);
    failedTestCount += runOtherCalendarSingleParamTests("Darian Galilean (Cal)", (dt) => getDarianGalileanDate(dt, 'Cal'), [
        ["1609-3-17, 20:57:24", "UTC+00:00", "1 Cal Sagittarius 0\nCal Solis"],
    ]);
    return failedTestCount;
}

function testDarianTitanCalendar() {
    return runOtherCalendarSingleParamTests("Darian Titan", getDarianTitanDate, [
        ["1609-3-15, 18:37:32", "UTC+00:00", "1 Ti Sagittarius 0\nTi Solis"],            // exact epoch
        ["1609-3-16, 18:34:46", "UTC+00:00", "2 Ti Sagittarius 0\nTi Lunae"],            // epoch + 1 circad (0.998068439 d)
        ["1609-3-15, 18:37:31", "UTC+00:00", "28 Ti Vrishika -1\nTi Saturni"],           // last day of year -1 (688 circads)
    ]);
}

function testGalacticTickDay() {
    return runOtherCalendarSingleParamTests("Galactic Tick Day", getGalacticTickDay, [
        ["1608-10-2, 00:00:00", "UTC+00:00", "0th"],
        ["2016-9-29, 23:00:00", "UTC+00:00", "235th"],
        ["2018-6-26, 23:00:00", "UTC+00:00", "236th"],
        ["2020-3-21, 23:00:00", "UTC+00:00", "237th"],
        ["2021-12-15, 23:00:00", "UTC+00:00", "238th"],
        ["2023-9-10, 23:00:00", "UTC+00:00", "239th"],
        ["2025-6-5, 23:00:00", "UTC+00:00", "240th"],
        ["2027-3-1, 23:00:00", "UTC+00:00", "241st"],
        ["2028-11-24, 23:00:00", "UTC+00:00", "242nd"],
        ["2030-8-20, 23:00:00", "UTC+00:00", "243rd"],
        ["1608-10-1, 23:00:00", "UTC+00:00", "-1st"],
        ["1610-6-28, 23:00:00", "UTC+00:00", "1st"],
    ]);
}

// Run all tests.
function runOtherCalendarTests() {
    const testFunctions = [
        testMayaLongCount,
        testTzolkin,
        testLordOfTheNightY,
        testYugaCycle,
        testSothicCycle,
        testOlympiad,
        testPawukon,
        testJapaneseLunisolarCalendar,
        testGalileanCalendar,
        testDarianGalileanCalendar,
        testDarianTitanCalendar,
        testGalacticTickDay,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Other Calendars: All Tests Passed.');
    }
}