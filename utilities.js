//|-------------------|
//|     Utilities     |
//|-------------------|

// A set of functions for calculating times in the Computing Time category.

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const decimals = 10;  // Decimals to show in some nodes
const updateMilliseconds = 20;  // Update tick length

function radians(num) {
    return num * Math.PI / 180;
}

// Convert chosen timezone into minutes to add
function convertUTCOffsetToMinutes(offsetString) {
    // Validate the input format
    const regex = /^UTC([+-])(\d{2}):(\d{2})$/;
    const match = offsetString.trim().match(regex);

    // Extract the sign, hours, and minutes from the matched parts
    const sign = match[1] === "+" ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    // Convert the total offset to minutes
    return sign * (hours * 60 + minutes);
}

// Hour enum keywords
const HOUR_ENUM = {
    MIDNIGHT: 0,
    SUNRISE: 6,    // Approximation: actual sunrise varies by location and date
    NOON: 12,
    SUNSET: 18     // Approximation: actual sunset varies by location and date
};

// Creates a new Date object with the given timezone offset in UTC
function createFauxUTCDate(currentDateTime, timezone='UTC+00:00') {
    const timezoneOffset = typeof timezone === 'number' ? timezone : convertUTCOffsetToMinutes(timezone);
    const fauxUTCDate = new Date(currentDateTime.getTime() + timezoneOffset * 60 * 1000);
    return fauxUTCDate;
}

// Fix JS datetime objects to handle:
// - Years 1-99 return years 1901-1999
// - Months 1-12 return months 0-11
// - Timezones are in UTC+00:00 format
// - Smaller units of time are set to 0 if not provided
function createAdjustedDateTime({currentDateTime=null, timezone='UTC+00:00', year=null, month=null, day=null, hour=null, minute=null, second=null, millisecond=null, nullSeconds=true, nullHourMinute=true}) {
    // Extract values from currentDateTime if provided, otherwise use defaults
    const dateValues = currentDateTime ? {
        year: currentDateTime.getUTCFullYear(),
        month: currentDateTime.getUTCMonth(),
        day: currentDateTime.getUTCDate(),
        hour: currentDateTime.getUTCHours(),
        minute: currentDateTime.getUTCMinutes(),
        second: currentDateTime.getUTCSeconds(),
        millisecond: currentDateTime.getUTCMilliseconds()
    } : {
        year: 0,
        month: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0
    };

    // Convert hour enum keyword to numeric value if needed
    let resolvedHour = hour;
    if (hour !== null && typeof hour === 'string') {
        const upperHour = hour.toUpperCase();
        if (upperHour === 'MIDNIGHT') {
            resolvedHour = HOUR_ENUM.MIDNIGHT;
        } else if (upperHour === 'SUNRISE') {
            resolvedHour = HOUR_ENUM.SUNRISE;
        } else if (upperHour === 'NOON') {
            resolvedHour = HOUR_ENUM.NOON;
        } else if (upperHour === 'SUNSET') {
            resolvedHour = HOUR_ENUM.SUNSET;
        } else {
            // If it's not a recognized enum, keep the original value (will be treated as invalid)
            resolvedHour = hour;
        }
    }

    // Override with provided values (month needs adjustment: 1-based to 0-based)
    const finalYear = year !== null ? year : dateValues.year;
    const finalMonth = month !== null ? month - 1 : dateValues.month;
    const finalDay = day !== null ? day : dateValues.day;
    // nullHourMinute only applies to currentDateTime values, not explicitly provided hour/minute
    const finalHour = resolvedHour !== null ? resolvedHour : (nullHourMinute ? 0 : dateValues.hour);
    const finalMinute = minute !== null ? minute : (nullHourMinute ? 0 : dateValues.minute);
    // If seconds are explicitly provided, don't null them out (nullSeconds is effectively false)
    const finalSecond = second !== null ? second : (nullSeconds ? 0 : dateValues.second);
    const finalMillisecond = millisecond !== null ? millisecond : (nullSeconds ? 0 : dateValues.millisecond);

    // Create date and apply timezone offset
    const fixedDate = new Date(Date.UTC(finalYear, finalMonth, finalDay, finalHour, finalMinute, finalSecond, finalMillisecond));
    // Handle timezone: if it's a number, use it directly (already in minutes); if string, convert from UTC format
    const timezoneOffset = typeof timezone === 'number' ? timezone : convertUTCOffsetToMinutes(timezone);
    fixedDate.setUTCFullYear(finalYear);
    fixedDate.setTime(fixedDate.getTime() - timezoneOffset * 60 * 1000);
    return fixedDate;
}

// Adds years to a date (mutates the original and returns it)
// To get a new object instead, clone first: let newDate = addYear(new Date(date), years)
function addYear(date, years, createNew=false) {
    const newYear = date.getUTCFullYear() + years;
    if (!createNew) {
        date.setUTCFullYear(newYear);
        return date;
    }
    return createAdjustedDateTime({year: newYear, month: date.getUTCMonth()+1, day: date.getUTCDate(), hour: date.getUTCHours(), minute: date.getUTCMinutes(), second: date.getUTCSeconds(), millisecond: date.getUTCMilliseconds()});
}

// Adds days to a date (mutates the original and returns it)
// To get a new object instead, clone first: let newDate = addDay(new Date(date), days)
function addDay(date, days) {   
    const newDay = date.getUTCDate() + days;
    date.setUTCDate(newDay);
    return date;
}

// Takes two dates and returns the difference between them in days
function differenceInDays(date1, date2) {
    const day = 86400000;       // Equals 1000*60*60*24, converts ms to days
    return (date1 - date2) / day;
}

// Takes a date and returns a weekday assuming the day changes after a specified time rather than UTC 00:00
// Useful for calculating calendars that change day after sunrise or sunset
function getWeekdayAtTime(currentDateTime, afterTime, timezone='UTC+00:00') {
    // Convert hour enum keyword to numeric value if needed, and skip minute if enum
    let resolvedHour = afterTime.hour;
    let resolvedMinute = afterTime.minute;
    if (afterTime.hour !== null && typeof afterTime.hour === 'string') {
        const upperHour = afterTime.hour.toUpperCase();
        if (upperHour === 'MIDNIGHT') {
            resolvedHour = HOUR_ENUM.MIDNIGHT;
        } else if (upperHour === 'SUNRISE') {
            resolvedHour = HOUR_ENUM.SUNRISE;
        } else if (upperHour === 'NOON') {
            resolvedHour = HOUR_ENUM.NOON;
        } else if (upperHour === 'SUNSET') {
            resolvedHour = HOUR_ENUM.SUNSET;
        }
        resolvedMinute = 0;
    }
    let afterDate = createAdjustedDateTime({currentDateTime: currentDateTime, timezone: timezone, hour: resolvedHour, minute: resolvedMinute});
    let dayOfWeek = afterDate.getUTCDay();
    if (currentDateTime >= afterDate) {
        dayOfWeek += 1;
    }
    if (dayOfWeek > 6) {
        dayOfWeek -= 7;
    }
    return dayOfWeek;
}

// Converts a number to Roman numerals
function toRomanNumerals(num) {
    if (num === 0) {
        return 'O';
    }
    if (num < 0) {
        return '-' + toRomanNumerals(-num);
    }

    const romanNumerals = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];

    let result = '';
    for (let i = 0; i < romanNumerals.length; i++) {
        while (num >= romanNumerals[i].value) {
            result += romanNumerals[i].symbol;
            num -= romanNumerals[i].value;
        }
    }
    return result;
}

const TAIleapSeconds = [
    "1972-06-30T23:59:59Z",
    "1972-12-31T23:59:59Z",
    "1973-12-31T23:59:59Z",
    "1974-12-31T23:59:59Z",
    "1975-12-31T23:59:59Z",
    "1976-12-31T23:59:59Z",
    "1977-12-31T23:59:59Z",
    "1978-12-31T23:59:59Z",
    "1979-12-31T23:59:59Z",
    "1981-06-30T23:59:59Z",
    "1982-06-30T23:59:59Z",
    "1983-06-30T23:59:59Z",
    "1985-06-30T23:59:59Z",
    "1987-12-31T23:59:59Z",
    "1989-12-31T23:59:59Z",
    "1990-12-31T23:59:59Z",
    "1992-06-30T23:59:59Z",
    "1993-06-30T23:59:59Z",
    "1994-06-30T23:59:59Z",
    "1995-12-31T23:59:59Z",
    "1997-06-30T23:59:59Z",
    "1998-12-31T23:59:59Z",
    "2005-12-31T23:59:59Z",
    "2008-12-31T23:59:59Z",
    "2012-06-30T23:59:59Z",
    "2015-06-30T23:59:59Z",
    "2016-12-31T23:59:59Z"
];

const GPSleapSeconds = [
    "1981-06-30T23:59:59Z",
    "1982-06-30T23:59:59Z",
    "1983-06-30T23:59:59Z",
    "1985-06-30T23:59:59Z",
    "1987-12-31T23:59:59Z",
    "1989-12-31T23:59:59Z",
    "1990-12-31T23:59:59Z",
    "1992-06-30T23:59:59Z",
    "1993-06-30T23:59:59Z",
    "1994-06-30T23:59:59Z",
    "1995-12-31T23:59:59Z",
    "1997-06-30T23:59:59Z",
    "1998-12-31T23:59:59Z",
    "2005-12-31T23:59:59Z",
    "2008-12-31T23:59:59Z",
    "2012-06-30T23:59:59Z",
    "2015-06-30T23:59:59Z",
    "2016-12-31T23:59:59Z"
];