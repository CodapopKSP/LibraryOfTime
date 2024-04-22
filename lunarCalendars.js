//|-------------------------|
//|     Lunar Calendars     |
//|-------------------------|

// A set of functions for calculating data in the Lunar Calendars category.

// Find the last day that occurred after a New Moon happened before sunset in Mecca
function dateOfLastDayAfterNewMoonBeforeSunset(currentDateTime) {
    const newMoonThisMonth = getNewMoonThisMonth(currentDateTime);

    // Check if the New Moon has passed for this month
    if (currentDateTime.getTime() > newMoonThisMonth.getTime()) {
        // Check if the New Moon happened before 18:00 Mecca time (UTC+3), rough approximation of sunset
        if (newMoonThisMonth.getUTCHours() < 15) {
            return newMoonThisMonth;
        } else {
            // If it happened after sunset, return one day later
            return new Date(newMoonThisMonth.setDate(newMoonThisMonth.getDate() + 1))
        }
    }
    let dateBack29Days = new Date(currentDateTime);
    dateBack29Days.setDate(dateBack29Days.getDate() - 29);
    const newMoonLastMonth = getNewMoonThisMonth(dateBack29Days);
    // Check if the New Moon happened before 18:00 Mecca time (UTC+3), rough approximation of sunset
    if (newMoonLastMonth.getUTCHours() < 15) {
        return newMoonLastMonth;
    } else {
        // If it happened after sunset, return one day later
        return new Date(newMoonLastMonth.setDate(newMoonLastMonth.getDate() + 1))
    }
}

function findCurrentHijriDate(currentDateTime) {
    const firstDayOfIslamicMonth = dateOfLastDayAfterNewMoonBeforeSunset(currentDateTime);
    firstDayOfIslamicMonth.setDate(firstDayOfIslamicMonth.getDate()-1);
    firstDayOfIslamicMonth.setUTCHours(18-3);
    firstDayOfIslamicMonth.setMinutes(0);
    firstDayOfIslamicMonth.setSeconds(0);
    // Calculate the number of days since the first day of the Islamic month
    const timeDifference = currentDateTime.getTime() - firstDayOfIslamicMonth.getTime();
    const daysSinceStartOfMonth = Math.floor(timeDifference / 60 / 60 / 24 / 1000);
    const currentLunationSince2000 = calculateLunationNumber(currentDateTime);
    const hijriMonthYear = calculateIslamicMonthAndYear(currentLunationSince2000);
    const hijriDay = daysSinceStartOfMonth;
    
    return hijriDay + ' ' + hijriMonthYear.month + ' ' + hijriMonthYear.year + ' AH';
}

function calculateIslamicMonthAndYear(ln) {
    const lunation = ln + 9;
    const HijriMonths = {
        0: 'al-Muḥarram',
        1: 'Ṣafar',
        2: 'Rabīʿ al-ʾAwwal',
        3: 'Rabīʿ ath-Thānī',
        4: 'Jumādā al-ʾŪlā',
        5: 'Jumādā al-ʾĀkhirah',
        6: 'Rajab',
        7: 'Shaʿbān',
        8: 'Ramaḍān',
        9: 'Shawwāl',
        10: 'Dhū al-Qaʿdah',
        11: 'Dhū al-Ḥijjah'
    };
    const islamicYears = Math.floor(lunation / 12);
    let currentMonth = (lunation % 12);
    console.log(currentMonth);
    if (currentMonth < 0) {
        currentMonth += 12;
    }
    const currentMonthName = HijriMonths[currentMonth];
    const currentYear = 1420 + islamicYears; // Start year + number of complete Islamic years
    return { month: currentMonthName, year: currentYear };
}

function calculateLunationNumber(currentDateTime) {
    const firstNewMoon2000 = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    const secondsSince2000 = (currentDateTime - firstNewMoon2000)/1000;

    // Calculate the number of days since the first new moon of 2000
    const daysSince2000 = secondsSince2000 / (60 * 60 * 24);

    // Calculate the number of lunations since Lunation 0
    const lunationNumber = Math.floor(daysSince2000 / 29.530588);
    return lunationNumber;
}