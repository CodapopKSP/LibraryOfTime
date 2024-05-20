//|-------------------|
//|     Utilities     |
//|-------------------|

// A set of functions for calculating times in the Computing Time category.

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


function cleanStupidDate1900Issue(currentDateTime) {
  let year = currentDateTime.getFullYear();
  let dateToFix = new Date(currentDateTime);
  dateToFix.setFullYear(year);
  return dateToFix;
}

// Probably used in the Chinese calendar, might delete later idk

function getMidnightInUTC(dateToFind, utcMidnight) {
  let midnightInChina = new Date(dateToFind);
  midnightInChina.setUTCDate(dateToFind.getDate() - 1);
  midnightInChina.setUTCHours(utcMidnight);
  midnightInChina.setMinutes(0);
  midnightInChina.setSeconds(0);
  midnightInChina.setMilliseconds(0);
  return midnightInChina;
}

// Takes two datetimes in ms and returns the number of days between them
function differenceInDays(date1, date2) {
  return (date1 - date2) / 1000 / 60 / 60 / 24;
}
