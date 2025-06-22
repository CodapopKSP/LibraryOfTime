//|-------------------|
//|     Utilities     |
//|-------------------|

// A set of functions for calculating times in the Computing Time category.

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const decimals = 10;  // Decimals to show in some nodes
export const updateMilliseconds = 20;  // Update tick length 

// Keeps track of how far ahead the Julian calendar is from the Gregorian
let _gregJulianDifference = 0;
export function getGregJulianDifference() {
    return _gregJulianDifference;
}
export function setGregJulianDifference(newDifference) {
    _gregJulianDifference = newDifference;
}

// Delete this maybe
export function getMidnightInUTC(dateToFind, utcMidnight) {
    let midnightInChina = new Date(dateToFind);
    midnightInChina.setUTCDate(dateToFind.getDate()-1);
    midnightInChina.setUTCHours(utcMidnight);
    midnightInChina.setMinutes(0);
    midnightInChina.setSeconds(0);
    midnightInChina.setMilliseconds(0);
    return midnightInChina;
}

// Fix JS Datetime objects: Years 1-99 return years 1901-1999. This returns the proper date.
export function createDateWithFixedYear(year, month, day, hour=0, minute=0, second=0, millisecond=0) {
    let fixedDate = new Date(Date.UTC(year, month, day, hour, minute, second));
    fixedDate.setUTCFullYear(year);
    return fixedDate;
}

// Takes two dates and returns the difference between them in days
export function differenceInDays(date1, date2) {
    const day = 86400000;       // Equals 1000*60*60*24, converts ms to days
    return (date1 - date2) / day;
}

// Takes a date and returns a weekday assuming the day changes after a specified time rather than UTC 00:00
// Useful for calculating calendars that change day after sunrise or sunset
export function getWeekdayAtTime(currentDateTime, afterTime) {
    let afterDate = new Date(currentDateTime);
    afterDate.setUTCHours(afterTime.hour);
    afterDate.setUTCMinutes(afterTime.minute);
    afterDate.setUTCSeconds(0);
    afterDate.setUTCMilliseconds(0);
    let dayOfWeek = afterDate.getUTCDay();
    if (currentDateTime >= afterDate) {
        dayOfWeek += 1;
    }
    if (dayOfWeek > 6) {
        dayOfWeek -= 7;
    }
    return dayOfWeek;
}

// Convert chosen timezone into minutes to add
export function convertUTCOffsetToMinutes(offsetString) {
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

// Converts a number to Roman numerals
export function toRomanNumerals(num) {
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

export const TAIleapSeconds = [
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

export const GPSleapSeconds = [
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