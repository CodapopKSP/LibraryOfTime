//|------------------------|
//|     Time Fractions     |
//|------------------------|

// A set of functions for calculating fractions of units of time.

export function calculateSecond(currentDateTime) {
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

export function calculateMinute(currentDateTime) {
    return (currentDateTime.getSeconds() + currentDateTime.getMilliseconds() / 1000) / 60;
}

export function calculateHour(currentDateTime) {
    return (currentDateTime.getMinutes() + 
            currentDateTime.getSeconds() / 60 + 
            currentDateTime.getMilliseconds() / 60000) / 60;
}

export function calculateDay(currentDateTime) {
    return (currentDateTime.getHours() + 
            currentDateTime.getMinutes() / 60 + 
            currentDateTime.getSeconds() / 3600 + 
            currentDateTime.getMilliseconds() / 3600000) / 24;
}

export function calculateMonth(currentDateTime) {
    const year = currentDateTime.getFullYear();
    const month = currentDateTime.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get last day of the month
    return (currentDateTime.getDate() - 1 + 
            currentDateTime.getHours() / 24 + 
            currentDateTime.getMinutes() / 1440 + 
            currentDateTime.getSeconds() / 86400 + 
            currentDateTime.getMilliseconds() / 86400000) / daysInMonth;
}

export function calculateYear(currentDateTime) {
    const year = currentDateTime.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const daysInYear = (new Date(year + 1, 0, 1) - startOfYear) / 86400000; // Total days in year
    return (currentDateTime - startOfYear) / (daysInYear * 86400000);
}

export function calculateDecade(currentDateTime) {
    const year = currentDateTime.getFullYear();
    const decadeStartYear = Math.floor(year / 10) * 10;
    const startOfDecade = new Date(decadeStartYear, 0, 1);
    const nextDecadeStart = new Date(decadeStartYear + 10, 0, 1);

    return (currentDateTime - startOfDecade) / (nextDecadeStart - startOfDecade);
}

export function calculateCentury(currentDateTime) {
    const year = currentDateTime.getFullYear();
    const centuryStartYear = Math.floor(year / 100) * 100;
    const startOfCentury = new Date(centuryStartYear, 0, 1);
    const nextCenturyStart = new Date(centuryStartYear + 100, 0, 1);
    return (currentDateTime - startOfCentury) / (nextCenturyStart - startOfCentury);
}

export function calculateMillennium(currentDateTime) {
    const year = currentDateTime.getFullYear();
    const millenniumStartYear = Math.floor(year / 1000) * 1000;
    const startOfMillennium = new Date(millenniumStartYear, 0, 1);
    const nextMillenniumStart = new Date(millenniumStartYear + 1000, 0, 1);
    return (currentDateTime - startOfMillennium) / (nextMillenniumStart - startOfMillennium);
}

