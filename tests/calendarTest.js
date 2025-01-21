

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
    new Date(1950, 0, 1, 0, 0, 0), 
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