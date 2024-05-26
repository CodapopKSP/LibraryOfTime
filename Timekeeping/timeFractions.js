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
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    hour = currentDateTime.getHours();
    minute = currentDateTime.getMinutes();
    let minuteStart = new Date(year, month, day, hour, minute);
    minuteStart.setFullYear(year)
    let nextMinuteStart = new Date(year, month, day, hour, minute + 1);
    nextMinuteStart.setFullYear(year)
    let minuteFraction = (currentDateTime - minuteStart) / (nextMinuteStart - minuteStart);
    return minuteFraction;
}

function calculateHour(currentDateTime) {
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    hour = currentDateTime.getHours();
    let hourStart = new Date(year, month, day, hour);
    hourStart.setFullYear(year);
    let nextHourStart = new Date(year, month, day, hour + 1);
    nextHourStart.setFullYear(year);
    let hourFraction = (currentDateTime - hourStart) / (nextHourStart - hourStart);
    return hourFraction;
}

function calculateDay(currentDateTime) {
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    let dayStart = new Date(year, month, day);
    dayStart.setFullYear(year);
    let nextDayStart = new Date(year, month, day + 1);
    nextDayStart.setFullYear(year);
    let dayFraction = (currentDateTime - dayStart) / (nextDayStart - dayStart);
    return dayFraction;
}

function calculateMonth(currentDateTime) {
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    let monthStart = new Date(year, month, 1);
    monthStart.setFullYear(year);
    let nextMonthStart = new Date(year, month + 1, 1);
    nextMonthStart.setFullYear(year);
    let monthFraction = (currentDateTime - monthStart) / (nextMonthStart - monthStart);
    return monthFraction;
}

function calculateYear(currentDateTime) {
    year = currentDateTime.getFullYear();
    let yearStart = new Date(year, 0, 1);
    yearStart.setFullYear(year);
    let nextYearStart = new Date(year + 1, 0, 1);
    nextYearStart.setFullYear(year + 1);
    let yearFraction = (currentDateTime - yearStart) / (nextYearStart - yearStart);
    return yearFraction;
}

function calculateDecade(currentDateTime) {
    year = currentDateTime.getFullYear();
    let decadeStart = new Date(Math.trunc(year / 10) * 10, 0, 1, 0, 0);
    decadeStart.setFullYear(Math.trunc(year / 10) * 10);
    let nextDecadeStart = new Date(Math.trunc(year / 10) * 10 + 10, 0, 1, 0, 0);
    nextDecadeStart.setFullYear(Math.trunc(year / 10) * 10 + 10);
    let decadeFraction = (currentDateTime - decadeStart) / (nextDecadeStart - decadeStart);
    return decadeFraction;
}

function calculateCentury(currentDateTime) {
    year = currentDateTime.getFullYear();
    let centuryStart = new Date(Math.trunc(year / 100) * 100, 0, 1);
    centuryStart.setFullYear(Math.trunc(year / 100) * 100);
    let nextCenturyStart = new Date(Math.trunc(year / 100) * 100 + 100, 0, 1);
    nextCenturyStart.setFullYear(Math.trunc(year / 100) * 100 + 100);
    let centuryFraction = (currentDateTime - centuryStart) / (nextCenturyStart - centuryStart);
    return centuryFraction;
}

function calculateMillennium(currentDateTime) {
    year = currentDateTime.getFullYear();
    let millenniumStart = new Date(Math.trunc(year / 1000) * 1000, 0, 1);
    millenniumStart.setFullYear(Math.trunc(year / 1000) * 1000);
    let nextMillenniumStart = new Date(Math.trunc(year / 1000) * 1000 + 1000, 0, 1);
    nextMillenniumStart.setFullYear(Math.trunc(year / 1000) * 1000 + 1000);
    let millenniumFraction = (currentDateTime - millenniumStart) / (nextMillenniumStart - millenniumStart);
    return millenniumFraction;
}
