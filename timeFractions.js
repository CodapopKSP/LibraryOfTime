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
    let decadeStart = new Date(Math.floor(year / 10) * 10, 0, 1, 0, 0);
    decadeStart.setFullYear(Math.floor(year / 10) * 10);
    let nextDecadeStart = new Date(Math.floor(year / 10) * 10 + 10, 0, 1, 0, 0);
    nextDecadeStart.setFullYear(Math.floor(year / 10) * 10 + 10);
    let decadeFraction = (currentDateTime - decadeStart) / (nextDecadeStart - decadeStart);
    return decadeFraction;
}

function calculateCentury(currentDateTime) {
    year = currentDateTime.getFullYear();
    let centuryStart = new Date(Math.floor(year / 100) * 100, 0, 1);
    centuryStart.setFullYear(Math.floor(year / 100) * 100);
    let nextCenturyStart = new Date(Math.floor(year / 100) * 100 + 100, 0, 1);
    nextCenturyStart.setFullYear(Math.floor(year / 100) * 100 + 100);
    let centuryFraction = (currentDateTime - centuryStart) / (nextCenturyStart - centuryStart);
    return centuryFraction;
}

function calculateMillennium(currentDateTime) {
    year = currentDateTime.getFullYear();
    let millenniumStart = new Date(Math.floor(year / 1000) * 1000, 0, 1);
    millenniumStart.setFullYear(Math.floor(year / 1000) * 1000);
    let nextMillenniumStart = new Date(Math.floor(year / 1000) * 1000 + 1000, 0, 1);
    nextMillenniumStart.setFullYear(Math.floor(year / 1000) * 1000 + 1000);
    let millenniumFraction = (currentDateTime - millenniumStart) / (nextMillenniumStart - millenniumStart);
    return millenniumFraction;
}
