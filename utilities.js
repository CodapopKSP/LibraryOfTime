//|-------------------|
//|     Utilities     |
//|-------------------|

// A set of functions for calculating times in the Computing Time category.


// Export required functions for testing
if (typeof module !== "undefined") {
    module.exports = { differenceInDays, getMidnightInUTC };
}

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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
    const day = 86400000;       // Equals 1000*60*60*24, converts ms to days
    return (date1 - date2) / day;
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
  
  