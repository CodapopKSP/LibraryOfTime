//|----------------------------|
//|     Proposed Calendars     |
//|----------------------------|

// A set of functions for calculating dates in the Proposed Calendars category.

function getHumanEra(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth();
    let year = currentDateTime.getFullYear() + 10000;
    return day + ' ' + monthNames[month] + ' ' + year + ' ' + 'HE';
}

function getInvariableCalendarDate(currentDateTime) {
    const year = currentDateTime.getFullYear();
    const startOfYear = new Date(year, 0, 1, 0, 0, 0);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    const daysSinceStartOfYear = Math.trunc(differenceInDays(currentDateTime, startOfYear))+1;
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
    }

    // Remove the date string if using a named day
    if ((invariableMonth==='New Years Day') || (invariableMonth==='Leap Day')) {
        invariableDate = '';
    }

    return invariableDate + invariableMonth + ' ' + year + ' CE';
}

function getWorldCalendarDate(currentDateTime) {
    const year = currentDateTime.getFullYear();
    const startOfYear = new Date(year, 0, 1, 0, 0, 0);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    const daysSinceStartOfYear = Math.trunc(differenceInDays(currentDateTime, startOfYear))+1;
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
    }

    // Remove the date string if using a named day
    if ((invariableMonth==='World\'s Day') || (invariableMonth==='Leapyear Day')) {
        invariableDate = '';
    }

    return invariableDate + invariableMonth + ' ' + year + ' CE';
}

function getSymmetry454Date(currentDateTime) {
    let monthDays = [28, 35, 28, 28, 35, 28, 28, 35, 28, 28, 35, 28];
    
    // Choose a date that has the same January 1st in both calendars
    const knownJan1st = new Date(2001, 0, 1);
    let daysSinceKnownJan1st = Math.floor(differenceInDays(currentDateTime, knownJan1st))+1;

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

    return daysSinceKnownJan1st + ' ' + monthNames[symmetryMonth] + ' ' + symmetryYear + ' CE';
}