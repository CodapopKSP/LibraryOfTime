//|-------------------|
//|     Utilities     |
//|-------------------|

// A set of functions for calculating times in the Computing Time category.

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getMidnightInUTC(dateToFind, utcMidnight) {
    let midnightInChina = new Date(dateToFind);
    midnightInChina.setUTCDate(dateToFind.getDate()-1);
    midnightInChina.setUTCHours(utcMidnight);
    midnightInChina.setMinutes(0);
    midnightInChina.setSeconds(0);
    midnightInChina.setMilliseconds(0);
    return midnightInChina;
}

// Takes two dates and returns the difference between them in days
function differenceInDays(date1, date2) {
    return (date1 - date2)/1000/60/60/24;
}