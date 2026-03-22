//|------------------------|
//|     Time Fractions     |
//|------------------------|

// A set of functions for calculating fractions of units of time.

const SECOND_MS_PER_SECOND = 1000;
const SECOND_DECIMAL_PRECISION = 2;
const SECOND_EXTRA_DIGITS_COUNT = 8;
const SECOND_DIGIT_BASE = 10;

function calculateSecond(currentDateTime) {
    const dateTime = new Date(currentDateTime);
    const milliseconds = dateTime.getMilliseconds();
    const secondFraction = milliseconds / SECOND_MS_PER_SECOND;
    const fractionString = secondFraction.toFixed(SECOND_DECIMAL_PRECISION);

    const onesDigit = fractionString[0];
    const decimalPoint = fractionString[1];
    const tenthsDigit = fractionString[2];
    let hundredthsDigit = parseInt(fractionString[3], 10);

    let result = `${onesDigit}${decimalPoint}${tenthsDigit}${hundredthsDigit}`;

    for (let i = 0; i < SECOND_EXTRA_DIGITS_COUNT; i++) {
        hundredthsDigit = (hundredthsDigit + 1) % SECOND_DIGIT_BASE;
        result += hundredthsDigit;
    }
    return result;
}

const MINUTE_MS_PER_SECOND = 1000;
const MINUTE_SECONDS_PER_MINUTE = 60;

function calculateMinute(currentDateTime) {
    return (currentDateTime.getUTCSeconds() + currentDateTime.getUTCMilliseconds() / MINUTE_MS_PER_SECOND) / MINUTE_SECONDS_PER_MINUTE;
}

const HOUR_SECONDS_PER_MINUTE = 60;
const HOUR_MS_PER_MINUTE = 60000;
const HOUR_MINUTES_PER_HOUR = 60;

function calculateHour(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    return (currentDateTime.getUTCMinutes() +
        currentDateTime.getUTCSeconds() / HOUR_SECONDS_PER_MINUTE +
        currentDateTime.getUTCMilliseconds() / HOUR_MS_PER_MINUTE) / HOUR_MINUTES_PER_HOUR;
}

const DAY_MINUTES_PER_HOUR = 60;
const DAY_SECONDS_PER_HOUR = 3600;
const DAY_MS_PER_HOUR = 3600000;
const DAY_HOURS_PER_DAY = 24;

function calculateDay(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    return (currentDateTime.getUTCHours() +
        currentDateTime.getUTCMinutes() / DAY_MINUTES_PER_HOUR +
        currentDateTime.getUTCSeconds() / DAY_SECONDS_PER_HOUR +
        currentDateTime.getUTCMilliseconds() / DAY_MS_PER_HOUR) / DAY_HOURS_PER_DAY;
}

const MONTH_HOURS_PER_DAY = 24;
const MONTH_MINUTES_PER_DAY = 1440;
const MONTH_SECONDS_PER_DAY = 86400;
const MONTH_MS_PER_DAY = 86400000;

function calculateMonth(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    const month = currentDateTime.getUTCMonth() + 1;
    const thisMonth = createAdjustedDateTime({ year, month, day: 0 });
    const nextMonth = createAdjustedDateTime({ year, month: month + 1, day: 0 });
    const daysInMonth = differenceInDays(nextMonth, thisMonth);
    return (currentDateTime.getUTCDate() - 1 +
        currentDateTime.getUTCHours() / MONTH_HOURS_PER_DAY +
        currentDateTime.getUTCMinutes() / MONTH_MINUTES_PER_DAY +
        currentDateTime.getUTCSeconds() / MONTH_SECONDS_PER_DAY +
        currentDateTime.getUTCMilliseconds() / MONTH_MS_PER_DAY) / daysInMonth;
}

function calculateYear(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = createAdjustedDateTime({ year, month: 1, day: 1 });
    const startOfNextYear = createAdjustedDateTime({ year: year + 1, month: 1, day: 1 });
    return (currentDateTime - startOfYear) / (startOfNextYear - startOfYear);
}

const DECADE_YEARS = 10;

function calculateDecade(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    let decadeStartYear = Math.floor(year / DECADE_YEARS) * DECADE_YEARS + 1;

    if (currentDateTime < createAdjustedDateTime({ year: decadeStartYear, month: 1, day: 1 })) {
        decadeStartYear -= DECADE_YEARS;
    }

    const startOfDecade = createAdjustedDateTime({ year: decadeStartYear, month: 1, day: 1 });
    const nextDecadeStart = createAdjustedDateTime({ year: decadeStartYear + DECADE_YEARS, month: 1, day: 1 });
    return (currentDateTime - startOfDecade) / (nextDecadeStart - startOfDecade);
}

const CENTURY_YEARS = 100;

function calculateCentury(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    let centuryStartYear = Math.floor(year / CENTURY_YEARS) * CENTURY_YEARS + 1;

    if (currentDateTime < createAdjustedDateTime({ year: centuryStartYear, month: 1, day: 1 })) {
        centuryStartYear -= CENTURY_YEARS;
    }

    const startOfCentury = createAdjustedDateTime({ year: centuryStartYear, month: 1, day: 1 });
    const nextCenturyStart = createAdjustedDateTime({ year: centuryStartYear + CENTURY_YEARS, month: 1, day: 1 });
    return (currentDateTime - startOfCentury) / (nextCenturyStart - startOfCentury);
}

const MILLENNIUM_YEARS = 1000;

function calculateMillennium(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    let millenniumStartYear = Math.floor(year / MILLENNIUM_YEARS) * MILLENNIUM_YEARS + 1;

    if (currentDateTime < createAdjustedDateTime({ year: millenniumStartYear, month: 1, day: 1 })) {
        millenniumStartYear -= MILLENNIUM_YEARS;
    }

    const startOfMillennium = createAdjustedDateTime({ year: millenniumStartYear, month: 1, day: 1 });
    const nextMillenniumStart = createAdjustedDateTime({ year: millenniumStartYear + MILLENNIUM_YEARS, month: 1, day: 1 });
    return (currentDateTime - startOfMillennium) / (nextMillenniumStart - startOfMillennium);
}

