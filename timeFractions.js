//|------------------------|
//|     Time Fractions     |
//|------------------------|

// A set of functions for calculating fractions of units of time.

function calculateSecond(currentDateTime) {
    let secondStart = new Date(currentDateTime).setMilliseconds(0);
    let nextSecondStart = new Date(secondStart).setMilliseconds(999);
    let secondFraction = (currentDateTime - secondStart) / (nextSecondStart - secondStart);
    return secondFraction;
}

function calculateMinute(currentDateTime) {
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    hour = currentDateTime.getHours();
    let minuteStart = new Date(year, month, day, hour, minute);
    let nextMinuteStart = new Date(year, month, day, hour, minute + 1);
    let minuteFraction = (currentDateTime - minuteStart) / (nextMinuteStart - minuteStart);
    return minuteFraction;
}

function calculateHour(currentDateTime) {
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    hour = currentDateTime.getHours();
    let hourStart = new Date(year, month, day, hour);
    let nextHourStart = new Date(year, month, day, hour + 1);
    let hourFraction = (currentDateTime - hourStart) / (nextHourStart - hourStart);
    return hourFraction;
}

function calculateDay(currentDateTime) {
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    let dayStart = new Date(year, month, day);
    let nextDayStart = new Date(year, month, day + 1);
    let dayFraction = (currentDateTime - dayStart) / (nextDayStart - dayStart);
    return dayFraction;
}

function calculateMonth(currentDateTime) {
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    let monthStart = new Date(year, month, 1);
    let nextMonthStart = new Date(year, month + 1, 1);
    let monthFraction = (currentDateTime - monthStart) / (nextMonthStart - monthStart);
    return monthFraction;
}

function calculateYear(currentDateTime) {
    year = currentDateTime.getFullYear();
    let yearStart = new Date(year, 0, 1);
    let nextYearStart = new Date(year + 1, 0, 1);
    let yearFraction = (currentDateTime - yearStart) / (nextYearStart - yearStart);
    return yearFraction;
}

function calculateDecade(currentDateTime) {
    year = currentDateTime.getFullYear();
    let decadeStart = new Date(Math.floor(year / 10) * 10, 0, 1, 0, 0);
    let nextDecadeStart = new Date(Math.floor(year / 10) * 10 + 10, 0, 1, 0, 0);
    let decadeFraction = (currentDateTime - decadeStart) / (nextDecadeStart - decadeStart);
    return decadeFraction;
}

function calculateCentury(currentDateTime) {
    year = currentDateTime.getFullYear();
    let centuryStart = new Date(Math.floor(year / 100) * 100, 0, 1);
    let nextCenturyStart = new Date(Math.floor(year / 100) * 100 + 100, 0, 1);
    let centuryFraction = (currentDateTime - centuryStart) / (nextCenturyStart - centuryStart);
    return centuryFraction;
}

function calculateMillennium(currentDateTime) {
    year = currentDateTime.getFullYear();
    let millenniumStart = new Date(Math.floor(year / 1000) * 1000, 0, 1);
    let nextMillenniumStart = new Date(Math.floor(year / 1000) * 1000 + 1000, 0, 1);
    let millenniumFraction = (currentDateTime - millenniumStart) / (nextMillenniumStart - millenniumStart);
    return millenniumFraction;
}
