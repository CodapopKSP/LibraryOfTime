


function runSingleParamaterTests(timeName, getCalendarFunction, testCases) {
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

function testMayaLongCount() {
    return runSingleParamaterTests("Maya Long Count", getCurrentMayaLongCount, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "0.0.0.0.0"],
        ["2012-12-21, 06:00:00", "UTC+00:00", "13.0.0.0.0"],
    ]);
}

function testTzolkin() {
    return runSingleParamaterTests("Tzolkin", getTzolkinDate, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "4 Ajaw"],
        ["2025-7-21, 06:00:00", "UTC+00:00", "10 Men"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "9 Ix"],
    ]);
}

function testLordOfTheNightY() {
    return runSingleParamaterTests("Lord of the Night | Y", getLordOfTheNight, [
        ["-3113-8-11, 06:00:00", "UTC+00:00", "G9 | Y3"],
        ["2025-7-21, 06:00:00", "UTC+00:00", "G5 | Y3"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "G4 | Y2"],
    ]);
}

function testYugaCycle() {
    return runSingleParamaterTests("Yuga Cycle", getYugaCycle, [
        ["-3101-1-22, 00:00:00", "UTC+00:00", "Dvapara Yuga: Sandhyamsa"],
        ["2025-7-21, 05:00:00", "UTC+00:00", "Kali Yuga: Sandhya"],
    ]);
}

function testSothicCycle() {
    return runSingleParamaterTests("Sothic Cycle", getSothicCycle, [
        ["-2781-6-27, 00:00:00", "UTC+00:00", "Cycle: 1 | Year: 1"],
        ["139-7-19, 00:00:00", "UTC+00:00", "Cycle: 3 | Year: 1"],
    ]);
}

function testOlympiad() {
    return runSingleParamaterTests("Olympiad", getOlympiad, [
        ["-775-7-24, 00:00:00", "UTC+00:00", "1 | Year: 1"],
        ["-775-7-23, 00:00:00", "UTC+00:00", "0 | Year: 4"],
        ["-771-7-24, 00:00:00", "UTC+00:00", "2 | Year: 1"],
    ]);
}

function testPawukon() {
    return runSingleParamaterTests("Pawukon", getPawukonCalendarDate, [
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
    ];

    const allTests = testFunctions.reduce((sum, fn) => sum + fn(), 0);

    if (allTests === 0) {
        console.log('Other Calendars: All Tests Passed.');
    }
}