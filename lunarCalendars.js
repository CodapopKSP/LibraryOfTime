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

    const dateBack29Days = new Date(currentDateTime.setDate(currentDateTime.getDate() - 29))
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
    firstDayOfIslamicMonth.setHours(18);
    firstDayOfIslamicMonth.setMinutes(0);
    firstDayOfIslamicMonth.setSeconds(0);
    // Calculate the number of days since the first day of the Islamic month
    const timeDifference = currentDateTime.getTime() - firstDayOfIslamicMonth.getTime();
    const daysSinceStartOfMonth = Math.floor(timeDifference / 60 / 60 / 24 / 1000);
    
    const hijriMonth = HijriMonths[10];
    const hijriDay = daysSinceStartOfMonth;
    
    return hijriDay + ' ' + hijriMonth;
}

const HijriMonths = {
    1: 'al-Muḥarram',
    2: 'Ṣafar',
    3: 'Rabīʿ al-ʾAwwal',
    4: 'Rabīʿ ath-Thānī',
    5: 'Jumādā al-ʾŪlā',
    6: 'Jumādā al-ʾĀkhirah',
    7: 'Rajab',
    8: 'Shaʿbān',
    9: 'Ramaḍān',
    10: 'Shawwāl',
    11: 'Dhū al-Qaʿdah',
    12: 'Dhū al-Ḥijjah'
};

