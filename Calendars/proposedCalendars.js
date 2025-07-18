//|----------------------------|
//|     Proposed Calendars     |
//|----------------------------|

// A set of functions for calculating dates in the Proposed Calendars category.

import * as utilities from '../utilities.js';

export function getHumanEra(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    let day = currentDateTime.getUTCDate();
    let month = currentDateTime.getUTCMonth();
    let year = currentDateTime.getUTCFullYear() + 10000;
    const dayOfWeek = currentDateTime.getUTCDay();
    return day + ' ' + utilities.monthNames[month] + ' ' + year + ' ' + 'HE\n' + utilities.weekNames[dayOfWeek];
}

export function getInvariableCalendarDate(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = utilities.createDateWithFixedYear(year, 0, 1, 0, 0, 0);
    const endOfYear = utilities.createDateWithFixedYear(year, 11, 31, 23, 59, 59);
    const daysSinceStartOfYear = Math.trunc(utilities.differenceInDays(currentDateTime, startOfYear))+1;
    let daysRemaining = daysSinceStartOfYear;

    // Need two lists for each for Leap Years and non Leap Years
    const monthDaysLeapYear = [1, 30, 30, 31, 30, 30, 31, 1, 30, 30, 31, 30, 30, 31];
    const monthDays = [1, 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];
    const monthNamesLeapYear = ['New Years Day', 'January', 'February', 'March', 'April', 'May', 'June', 'Leap Day', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNames = ['New Years Day', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Designate a leap year if the year is 366 days
    let leapYear = false;
    if ((endOfYear-startOfYear) > 365*1000*60*60*24) {
        leapYear = true;
    }
    let invariableMonth = '';
    let invariableDate = '';
    let invariableWeek = '\n';

    // Iterate through month days to find the current month if a Leap Year
    if (leapYear===true) {
        for (let i = 0; i < monthDaysLeapYear.length; i++) {
            // Find the last month before daysRemaining turns negative
            daysRemaining -= monthDaysLeapYear[i];
            if (daysRemaining <= 0) {
                invariableMonth = monthNamesLeapYear[i];
                // Add a space after for formatting
                invariableDate = (daysRemaining + monthDaysLeapYear[i]) + ' ';
                break;
            }
        }

        // Skip day of week if Leap Day or New Years Day, start on Monday
        if (daysSinceStartOfYear >= 184) {
            invariableWeek += utilities.weekNames[(daysSinceStartOfYear-2) % 7];
        } else {
            invariableWeek += utilities.weekNames[(daysSinceStartOfYear-1) % 7];
        }
    }

    // Iterate through month days to find the current month if not a Leap Year
    if (leapYear===false) {
        for (let i = 0; i < monthDays.length; i++) {
            // Find the last month before daysRemaining turns negative
            daysRemaining -= monthDays[i];
            if (daysRemaining <= 0) {
                invariableMonth = monthNames[i];
                // Add a space after for formatting
                invariableDate = (daysRemaining + monthDays[i]) + ' ';
                break;
            }
        }

        // Skip day of week if New Years Day, start on Monday
        invariableWeek += utilities.weekNames[(daysSinceStartOfYear-1) % 7];
    }

    // Remove the date and week strings if using a named day
    if ((invariableMonth==='New Years Day') || (invariableMonth==='Leap Day')) {
        invariableDate = '';
        invariableWeek = '';
    }

    return invariableDate + invariableMonth + ' ' + year + ' CE' + invariableWeek;
}

export function getWorldCalendarDate(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = utilities.createDateWithFixedYear(year, 0, 1, 0, 0, 0);
    const endOfYear = utilities.createDateWithFixedYear(year, 11, 31, 23, 59, 59);
    const daysSinceStartOfYear = Math.trunc(utilities.differenceInDays(currentDateTime, startOfYear))+1;
    let daysRemaining = daysSinceStartOfYear;

    // Need two lists for each for Leap Years and non Leap Years
    const monthDaysLeapYear = [1, 31, 30, 30, 31, 30, 30, 1, 31, 30, 30, 31, 30, 30];
    const monthDays = [1, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30];
    const monthNamesLeapYear = ['World\'s Day', 'January', 'February', 'March', 'April', 'May', 'June', 'Leapyear Day', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNames = ['World\'s Day', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Designate a leap year if the year is 366 days
    let leapYear = false;
    if ((endOfYear-startOfYear) > 365*1000*60*60*24) {
        leapYear = true;
    }
    let invariableMonth = '';
    let invariableDate = '';
    let invariableWeek = '\n';

    // Iterate through month days to find the current month if a Leap Year
    if (leapYear===true) {
        for (let i = 0; i < monthDaysLeapYear.length; i++) {
            // Find the last month before daysRemaining turns negative
            daysRemaining -= monthDaysLeapYear[i];
            if (daysRemaining <= 0) {
                invariableMonth = monthNamesLeapYear[i];
                // Add a space after for formatting
                invariableDate = (daysRemaining + monthDaysLeapYear[i]) + ' ';
                break;
            }
        }

        // Skip day of week if Leap Day or New Years Day, start on Sunday
        if (daysSinceStartOfYear >= 184) {
            invariableWeek += utilities.weekNames[(daysSinceStartOfYear-3) % 7];
        } else {
            invariableWeek += utilities.weekNames[(daysSinceStartOfYear-2) % 7];
        }
    }

    // Iterate through month days to find the current month if not a Leap Year
    if (leapYear===false) {
        for (let i = 0; i < monthDays.length; i++) {
            // Find the last month before daysRemaining turns negative
            daysRemaining -= monthDays[i];
            if (daysRemaining <= 0) {
                invariableMonth = monthNames[i];
                // Add a space after for formatting
                invariableDate = (daysRemaining + monthDays[i]) + ' ';
                break;
            }
        }

        // Skip day of week if New Years Day, start on Sunday
        invariableWeek += utilities.weekNames[(daysSinceStartOfYear-2) % 7];
    }

    // Remove the date string if using a named day
    if ((invariableMonth==='World\'s Day') || (invariableMonth==='Leapyear Day')) {
        invariableDate = '';
        invariableWeek = '';
    }

    return invariableDate + invariableMonth + ' ' + year + ' CE' + invariableWeek;
}

export function getSymmetry454Date(currentDateTime_, timezoneOffset) {
    let currentDateTime = new Date(currentDateTime_.getTime() + (timezoneOffset*60*1000));

    let monthDays = [28, 35, 28, 28, 35, 28, 28, 35, 28, 28, 35, 28];
    
    // Choose a date that has the same January 1st in both calendars
    let knownJan1st_ = new Date(2001, 0, 1);
    const knownJan1st = new Date(knownJan1st_.getTime() + (timezoneOffset*60*1000));
    let daysSinceKnownJan1st = Math.floor(utilities.differenceInDays(currentDateTime, knownJan1st))+1;

    // Iterate through years and subtract days based on if leap year or normal year
    let symmetryYear = 2001;
    let isLeapYear = false;
    if (daysSinceKnownJan1st > 0) {
        while (daysSinceKnownJan1st > (isLeapYear ? 371 : 364)) {
            daysSinceKnownJan1st -= (isLeapYear ? 371 : 364);
            symmetryYear++;
            const nextYearRemainder = ((52 * symmetryYear) + 146) % 293;
            isLeapYear = (nextYearRemainder < 52);
        }
    } else {
        while (daysSinceKnownJan1st <= 0) {
            symmetryYear--;
            const previousYearRemainder = ((52 * symmetryYear) + 146) % 293;
            isLeapYear = (previousYearRemainder < 52);
            daysSinceKnownJan1st += (isLeapYear ? 371 : 364);
        }
    }
    
    // Set month days based on leap year
    const yearRemainder = ((52*symmetryYear)+146)%293;
    const thisYearIsLeapYear = (yearRemainder < 52);
    if (thisYearIsLeapYear) {
        monthDays = [28, 35, 28, 28, 35, 28, 28, 35, 28, 28, 35, 35];
    }

    // Calculate the Symmetry454 month and day
    let symmetryMonth = 0;
    while (daysSinceKnownJan1st > monthDays[symmetryMonth]) {
        daysSinceKnownJan1st -= monthDays[symmetryMonth];
        symmetryMonth++;
    }

    const dayOfWeek = daysSinceKnownJan1st % 7;

    return daysSinceKnownJan1st + ' ' + utilities.monthNames[symmetryMonth] + ' ' + symmetryYear + ' CE\n' + utilities.weekNames[dayOfWeek];
}