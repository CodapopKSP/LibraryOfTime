//|------------------------|
//|     Time Fractions     |
//|------------------------|

// A set of functions for calculating fractions of units of time.

const TIME_MS_PER_SECOND = 1000;
const TIME_SECONDS_PER_MINUTE = 60;
const TIME_MINUTES_PER_HOUR = 60;
const TIME_HOURS_PER_DAY = 24;
const TIME_SECONDS_PER_HOUR = TIME_SECONDS_PER_MINUTE * TIME_MINUTES_PER_HOUR;
const TIME_MINUTES_PER_DAY = TIME_MINUTES_PER_HOUR * TIME_HOURS_PER_DAY;
const TIME_SECONDS_PER_DAY = TIME_SECONDS_PER_HOUR * TIME_HOURS_PER_DAY;
const TIME_MS_PER_MINUTE = TIME_MS_PER_SECOND * TIME_SECONDS_PER_MINUTE;
const TIME_MS_PER_HOUR = TIME_MS_PER_MINUTE * TIME_MINUTES_PER_HOUR;
const TIME_MS_PER_DAY = TIME_MS_PER_HOUR * TIME_HOURS_PER_DAY;

const SECOND_DECIMAL_PRECISION = 2;
const SECOND_EXTRA_DIGITS_COUNT = 8;
const SECOND_DIGIT_BASE = 10;

// Fraction of the current second from UTC milliseconds only (timezone-independent).
function calculateSecond(currentDateTime) {
    const dateTime = new Date(currentDateTime);
    const milliseconds = dateTime.getMilliseconds();
    const secondFraction = milliseconds / TIME_MS_PER_SECOND;
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

// Fraction of the current minute in the requested observer timezone (defaults to UTC).
function calculateMinute(currentDateTime_, timezoneOffset = 'UTC+00:00') {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    return (currentDateTime.getUTCSeconds() + currentDateTime.getUTCMilliseconds() / TIME_MS_PER_SECOND) / TIME_SECONDS_PER_MINUTE;
}

// Fraction of the current hour in the requested observer timezone.
function calculateHour(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    return (currentDateTime.getUTCMinutes() +
        currentDateTime.getUTCSeconds() / TIME_SECONDS_PER_MINUTE +
        currentDateTime.getUTCMilliseconds() / TIME_MS_PER_MINUTE) / TIME_MINUTES_PER_HOUR;
}

// Fraction of the current day in the requested observer timezone.
function calculateDay(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    return (currentDateTime.getUTCHours() +
        currentDateTime.getUTCMinutes() / TIME_MINUTES_PER_HOUR +
        currentDateTime.getUTCSeconds() / TIME_SECONDS_PER_HOUR +
        currentDateTime.getUTCMilliseconds() / TIME_MS_PER_HOUR) / TIME_HOURS_PER_DAY;
}

// Fraction of the current month in the requested observer timezone.
function calculateMonth(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    const month = currentDateTime.getUTCMonth() + 1;
    const startOfMonth = createAdjustedDateTime({ year, month, day: 1 });
    const startOfNextMonth = createAdjustedDateTime({ year, month: month + 1, day: 1 });
    // Month length is derived from the elapsed days between consecutive month starts.
    const daysInMonth = differenceInDays(startOfNextMonth, startOfMonth);
    return (currentDateTime.getUTCDate() - 1 +
        currentDateTime.getUTCHours() / TIME_HOURS_PER_DAY +
        currentDateTime.getUTCMinutes() / TIME_MINUTES_PER_DAY +
        currentDateTime.getUTCSeconds() / TIME_SECONDS_PER_DAY +
        currentDateTime.getUTCMilliseconds() / TIME_MS_PER_DAY) / daysInMonth;
}

// Fraction of the current year in the requested observer timezone.
function calculateYear(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = createAdjustedDateTime({ year, month: 1, day: 1 });
    const startOfNextYear = createAdjustedDateTime({ year: year + 1, month: 1, day: 1 });
    return (currentDateTime - startOfYear) / (startOfNextYear - startOfYear);
}

// Fraction of an era span (decade/century/millennium) in the requested observer timezone.
function calculateEraFraction(currentDateTime_, timezoneOffset, spanYears) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    let eraStartYear = Math.floor(year / spanYears) * spanYears + 1;

    if (currentDateTime < createAdjustedDateTime({ year: eraStartYear, month: 1, day: 1 })) {
        eraStartYear -= spanYears;
    }

    const startOfEra = createAdjustedDateTime({ year: eraStartYear, month: 1, day: 1 });
    const nextEraStart = createAdjustedDateTime({ year: eraStartYear + spanYears, month: 1, day: 1 });
    return (currentDateTime - startOfEra) / (nextEraStart - startOfEra);
}

const DECADE_YEARS = 10;

function calculateDecade(currentDateTime_, timezoneOffset) {
    return calculateEraFraction(currentDateTime_, timezoneOffset, DECADE_YEARS);
}

const CENTURY_YEARS = 100;

function calculateCentury(currentDateTime_, timezoneOffset) {
    return calculateEraFraction(currentDateTime_, timezoneOffset, CENTURY_YEARS);
}

const MILLENNIUM_YEARS = 1000;

function calculateMillennium(currentDateTime_, timezoneOffset) {
    return calculateEraFraction(currentDateTime_, timezoneOffset, MILLENNIUM_YEARS);
}

