//|-------------------------|
//|     Lunar Calendars     |
//|-------------------------|

// A set of functions for calculating data in the Lunar Calendars category.


// Some dates are weird on month or year change
// Returns a formatted Hijri calendar AST date
function getHijriDate(currentDateTime) {

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

    // Get the date of last day of New Moon and calculate it's sunset at Mecca (6:00pm UTC+3)
    const firstDayOfIslamicMonth = dateOfLastDayAfterNewMoonBeforeSunset(currentDateTime);
    firstDayOfIslamicMonth.setDate(firstDayOfIslamicMonth.getDate()-1);
    firstDayOfIslamicMonth.setUTCHours(18-3);
    firstDayOfIslamicMonth.setMinutes(0);
    firstDayOfIslamicMonth.setSeconds(0);
    // Calculate the number of days since the first day of the Islamic month
    const timeDifference = currentDateTime.getTime() - firstDayOfIslamicMonth.getTime();
    const daysSinceStartOfMonth = Math.trunc(timeDifference / 60 / 60 / 24 / 1000);
    const currentLunationSince2000 = calculateLunationNumber(currentDateTime);
    const hijriMonthYear = calculateIslamicMonthAndYear(currentLunationSince2000);
    
    let hijriMonthIndex = hijriMonthYear.month;
    let hijriDay = daysSinceStartOfMonth;
    
    // Some complex, undecipherable logic about handling day and month changes due to the day starting/ending at sunset
    // Pure witchcraft, but it seems to work
    if (currentDateTime.getUTCHours() > 18-3) {
        hijriDay -= 1;
        if (hijriDay === 0) {
            hijriDay = 30;
            hijriMonthIndex -= 1;
            if (hijriMonthIndex < 0) {
                hijriMonthIndex = 11;
            }
        }
    }
    if (hijriDay === 0) {
        hijriDay = 30;
    }
    let hijriYear = hijriMonthYear.year;
    let hijriMonth = HijriMonths[hijriMonthIndex];

    // Determine if before 622 Epoch or after, then adjust for no 0 year
    let suffix = 'AH';
    if (hijriYear < 1) {
        hijriYear -= 1;
        suffix = 'BH'
    }

    return hijriDay + ' ' + hijriMonth + ' ' + hijriYear + ' ' + suffix;
}

function calculateIslamicMonthAndYear(ln) {
    // Add 9 lunations to get in sync with the calendar
    const lunation = ln + 9;
    const islamicYears = Math.trunc(lunation / 12);
    let currentMonth = (lunation % 12);
    if (currentMonth < 0) {
        currentMonth += 12;
    }
    const currentYear = 1420 + islamicYears; // Start year + number of complete Islamic years
    return { month: currentMonth, year: currentYear };
}

// Find the last day that occurred after a New Moon happened before sunset in Mecca
function dateOfLastDayAfterNewMoonBeforeSunset(currentDateTime) {
    const newMoonThisMonth = getNewMoonThisMonth(currentDateTime, 0);
    
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
    const newMoonLastMonth = getNewMoonThisMonth(dateBack29Days, 0);
    // Check if the New Moon happened before 18:00 Mecca time (UTC+3), rough approximation of sunset
    if (newMoonLastMonth.getUTCHours() < 15) {
        return newMoonLastMonth;
    } else {
        // If it happened before sunset, return that day
        return new Date(newMoonLastMonth.setDate(newMoonLastMonth.getDate()))
    }
}