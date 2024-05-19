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
    const daysSinceStartOfYear = Math.trunc((currentDateTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))+1;
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
    const daysSinceStartOfYear = Math.trunc((currentDateTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))+1;
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