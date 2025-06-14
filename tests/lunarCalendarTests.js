import {convertUTCOffsetToMinutes, parseInputDate} from '../userInterface.js';

import * as lunarCalendars from '../Calendars/lunarCalendars.js';

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
    testBahaiCalendar_test("2025-3-19, 14:30:00", "UTC+00:00", "1 Bahá 182 BE\nIstijlál");
    testBahaiCalendar_test("1844-3-19, 18:00:00", "UTC+03:30", "1 Bahá 1 BE\n‘Idál");
    testBahaiCalendar_test("2064-3-19, 14:30:00", "UTC+00:00", "1 Bahá 221 BE\nIstijlál");
    testBahaiCalendar_test("2035-11-1, 13:30:00", "UTC+00:00", "17 ‘Ilm 192 BE\nIstijlál");
    testBahaiCalendar_test("2018-2-28, 14:30:00", "UTC+00:00", "5 Ayyám-i-Há 174 BE\nIstijlál");

    // Cumulative Test Check
    if (testCount === passedTestCount) {
        console.log('Bahai Calendar: All Tests Passed');
    }
}

// Run all tests.


if (typeof process !== "undefined" && process.exit) {
    process.exit(0);
}