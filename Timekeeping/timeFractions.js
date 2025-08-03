//|------------------------|
//|     Time Fractions     |
//|------------------------|

// A set of functions for calculating fractions of units of time.

function calculateSecond(currentDateTime) {
    // Ensure currentDateTime is a Date object
    let dateTime = new Date(currentDateTime);

    // Calculate the milliseconds fraction within the current second
    let milliseconds = dateTime.getMilliseconds();
    let secondFraction = milliseconds / 1000;

    // Convert the fraction to a string with enough precision
    let fractionString = secondFraction.toFixed(2);

    // Extract the ones digit, the decimal, the tenths digit, and the hundredths digit
    let onesDigit = fractionString[0]; // Should be '0' because seconds are always less than 1
    let decimalPoint = fractionString[1]; // Should be '.'
    let tenthsDigit = fractionString[2];
    let hundredthsDigit = parseInt(fractionString[3], 10);

    // Initialize the result string with the initial part
    let result = `${onesDigit}${decimalPoint}${tenthsDigit}${hundredthsDigit}`;

    // Add the incrementing hundredths digits
    for (let i = 0; i < 8; i++) {
        hundredthsDigit = (hundredthsDigit + 1) % 10; // Increment and wrap around if necessary
        result += hundredthsDigit;
    }
    return result;
}

function calculateMinute(currentDateTime) {
    return (currentDateTime.getUTCSeconds() + currentDateTime.getUTCMilliseconds() / 1000) / 60;
}

function calculateHour(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    return (currentDateTime.getUTCMinutes() + 
            currentDateTime.getUTCSeconds() / 60 + 
            currentDateTime.getUTCMilliseconds() / 60000) / 60;
}

function calculateDay(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    return (currentDateTime.getUTCHours() + 
            currentDateTime.getUTCMinutes() / 60 + 
            currentDateTime.getUTCSeconds() / 3600 + 
            currentDateTime.getUTCMilliseconds() / 3600000) / 24;
}

function calculateMonth(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    const year = currentDateTime.getUTCFullYear();
    const month = currentDateTime.getUTCMonth();
    const nextMonth = createDateWithFixedYear(year, month + 1, 0);
    const thisMonth = createDateWithFixedYear(year, month, 0);
    const daysInMonth = (nextMonth - thisMonth)/1000/60/60/24;
    return (currentDateTime.getUTCDate() - 1 + 
            currentDateTime.getUTCHours() / 24 + 
            currentDateTime.getUTCMinutes() / 1440 + 
            currentDateTime.getUTCSeconds() / 86400 + 
            currentDateTime.getUTCMilliseconds() / 86400000) / daysInMonth;
}

function calculateYear(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = createDateWithFixedYear(year, 0, 1);
    const daysInYear = (createDateWithFixedYear(year + 1, 0, 1) - startOfYear) / 86400000; // Total days in year
    return (currentDateTime - startOfYear) / (daysInYear * 86400000);
}

function calculateDecade(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset * 60 * 1000));
    
    // Calculate ordinal decade start (ending in 1)
    const year = currentDateTime.getUTCFullYear();
    let decadeStartYear = Math.floor(year / 10) * 10 + 1;

    // If the calculated start is in the future, move to the previous decade
    if (currentDateTime < createDateWithFixedYear(decadeStartYear, 0, 1)) {
        decadeStartYear -= 10;
    }

    const startOfDecade = createDateWithFixedYear(decadeStartYear, 0, 1);
    const nextDecadeStart = createDateWithFixedYear(decadeStartYear + 10, 0, 1);
    return (currentDateTime - startOfDecade) / (nextDecadeStart - startOfDecade);
}


function calculateCentury(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));

    // Calculate ordinal decade start (ending in 1)
    const year = currentDateTime.getUTCFullYear();
    let centuryStartYear = Math.floor(year / 100) * 100 + 1;

    // If the calculated start is in the future, move to the previous century
    if (currentDateTime < createDateWithFixedYear(centuryStartYear, 0, 1)) {
        centuryStartYear -= 100;
    }
    const startOfCentury = createDateWithFixedYear(centuryStartYear, 0, 1);
    const nextCenturyStart = createDateWithFixedYear(centuryStartYear + 100, 0, 1);
    return (currentDateTime - startOfCentury) / (nextCenturyStart - startOfCentury);
}

function calculateMillennium(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    // Calculate ordinal decade start (ending in 1)
    const year = currentDateTime.getUTCFullYear();
    let millenniumStartYear = Math.floor(year / 1000) * 1000 + 1;

    // If the calculated start is in the future, move to the previous millennium
    if (currentDateTime < createDateWithFixedYear(millenniumStartYear, 0, 1)) {
        millenniumStartYear -= 1000;
    }
    const startOfMillennium = createDateWithFixedYear(millenniumStartYear, 0, 1);
    const nextMillenniumStart = createDateWithFixedYear(millenniumStartYear + 1000, 0, 1);
    return (currentDateTime - startOfMillennium) / (nextMillenniumStart - startOfMillennium);
}

