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
        testGalacticTickDay,
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Other Calendars: All Tests Passed.');
    }
}