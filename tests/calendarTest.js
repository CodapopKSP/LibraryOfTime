function testGregorianAgainstKnownDate(currentDateTime, knownDate, functionToTest) {
    const result = functionToTest(currentDateTime);
    if ((result.date === knownDate.date)&&(result.time === knownDate.time)) {
        console.log(`Test passed for ${functionToTest.name}`);
        return true;
    } else {
        console.error(
            `Test failed for ${functionToTest.name}: Expected ${knownDate.date} / ${knownDate.time}, but got ${result.date} / ${result.time}`
        );
        return false;
    }
}

function testJulianAgainstKnownDate(currentDateTime, knownDate, functionToTest) {
    const result = functionToTest(currentDateTime);
    if (result === knownDate) {
        console.log(`Test passed for ${functionToTest.name}`);
        return true;
    } else {
        console.error(
            `Test failed for ${functionToTest.name}: Expected ${knownDate} but got ${result}`
        );
        return false;
    }
}

testGregorianAgainstKnownDate(
    parseInputDate('1950-1-1, 00:00:00', 'UTC+00:00'), 
    {date: "1 January 1950 CE\nSunday", time: "00:00:00"}, 
    getGregorianDateTime
);

testGregorianAgainstKnownDate(
    new Date(100, 0, 1, 0, 0, 0), 
    {date: "1 January 100 CE\nFriday", time: "00:00:00"}, 
    getGregorianDateTime
);

testGregorianAgainstKnownDate(
    new Date(-1000, 0, 1, 0, 0, 0), 
    {date: "1 January 1000 BCE\nWednesday", time: "00:00:00"}, 
    getGregorianDateTime
);

testGregorianAgainstKnownDate(
    new Date(2012, 1, 29, 16, 0, 0), 
    {date: "29 February 2012 CE\nWednesday", time: "16:00:00"}, 
    getGregorianDateTime
);

testJulianAgainstKnownDate(
    new Date(1950, 0, 1, 0, 0, 0), 
    "18 December 1949 AD\nSaturday", 
    getJulianCalendar
);

testJulianAgainstKnownDate(
    new Date(100, 0, 1, 0, 0, 0), 
    "2 January 100 AD\nThursday", 
    getJulianCalendar
);

function testTimezoneFormatter() {
    let testCount = 0;
    let passedTestCount = 0;

    function testTimezoneFormatter_test(timezoneTest, minutesTest) {
        testCount += 1;
        let minutes = convertUTCOffsetToMinutes(timezoneTest);
        if (minutes==minutesTest){
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
    if (testCount==passedTestCount){
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
        if (parsedDate==parsedDateTest){
            passedTestCount += 1;
        } else {
            console.error('Parse Date: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Timezone, Output Date
    testParseDate_test('1950-1-1, 00:00:00', 'UTC+00:00', 'Sun, 01 Jan 1950 00:00:00 GMT');
    testParseDate_test('2000-12-31, 00:00:00', 'UTC+08:00', 'Sun, 31 Dec 2000 08:00:00 GMT');
    testParseDate_test('2016-2-29, 00:00:00', 'UTC+12:00', 'Mon, 29 Feb 2016 12:00:00 GMT');

    // Cumulative Test Check
    if (testCount==passedTestCount){
        console.log('Parse Date: All Tests Passed');
    }
}

function testCalendarType() {
    let testCount = 0;
    let passedTestCount = 0;

    function testCalendarType_test(testedDate, testedCalendarType, parsedDateTest) {
        testCount += 1;
        let parsedDate = adjustCalendarType(testedDate, testedCalendarType);
        parsedDate = parsedDate.toUTCString();
        if (parsedDate==parsedDateTest){
            passedTestCount += 1;
        } else {
            console.error('Calendar Type: Test ' + testCount + ' failed.');
            console.error(parsedDate);
        }
    }

    // Tests - Input Date, Calendar Type, Output Date
    testCalendarType_test(new Date(Date.UTC(2024,0,1,0,0,0)), 'gregorian', 'Mon, 01 Jan 2024 00:00:00 GMT');
    testCalendarType_test(new Date(Date.UTC(2000,0,1,0,0,0)), 'julian-liturgical', 'Fri, 14 Jan 2000 00:00:00 GMT');
    testCalendarType_test(new Date(Date.UTC(1000,0,1,0,0,0)), 'astronomical', 'Mon, 06 Jan 1000 00:00:00 GMT');

    // Cumulative Test Check
    if (testCount==passedTestCount){
        console.log('Calendar Type: All Tests Passed');
    }
}



// Run all tests
testParseDate();
testTimezoneFormatter();
testCalendarType();