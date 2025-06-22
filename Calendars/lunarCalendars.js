//|-------------------------|
//|     Lunar Calendars     |
//|-------------------------|

// A set of functions for calculating data in the Lunar Calendars category.

import * as utilities from '../utilities.js';
import * as astronomicalData from '../Other/astronomicalData.js';
import { parseInputDate } from '../userInterface.js';

// Returns a formatted Hijri calendar AST date
export function getUmmalQuraDate(currentDateTime) {

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

    const islamicWeek = [
        "Yawm al-Ahad",      // Sunday
        "Yawm al-Ithnayn",   // Monday
        "Yawm ath-Thulatha", // Tuesday
        "Yawm al-Arba'a",    // Wednesday
        "Yawm al-Khamis",    // Thursday
        "Yawm al-Jumu'ah",   // Friday
        "Yawm as-Sabt"       // Saturday
    ];

    // Get the date of last day of New Moon and calculate it's sunset at Mecca (5:30pm UTC+3)
    let firstDayOfIslamicMonth = new Date(timeOfSunsetAfterLastNewMoon(currentDateTime));

    // Calculate the number of days since the first day of the Islamic month
    const daysSinceStartOfMonth = Math.floor(utilities.differenceInDays(currentDateTime, firstDayOfIslamicMonth));
    const currentLunationSince2000 = astronomicalData.calculateLunationNumber(firstDayOfIslamicMonth);
    const hijriMonthYear = calculateIslamicMonthAndYear(currentLunationSince2000);
    
    let hijriMonthIndex = hijriMonthYear.month;
    let hijriDay = daysSinceStartOfMonth + 1;
    let hijriYear = hijriMonthYear.year;
    let hijriMonth = HijriMonths[hijriMonthIndex];

    // Determine if before 622 Epoch or after, then adjust for no 0 year
    let suffix = 'AH';
    if (hijriYear < 1) {
        hijriYear -= 1;
        suffix = 'BH'
    }

    // Get the weekday based on sunset in Mecca
    const dayOfWeek = utilities.getWeekdayAtTime(currentDateTime, {hour: 15, minute: 0});

    return hijriDay + ' ' + hijriMonth + ' ' + hijriYear + ' ' + suffix + '\n' + islamicWeek[dayOfWeek];
}

export function calculateIslamicMonthAndYear(ln) {
    // Add 9 lunations to get in sync with the calendar
    const lunation = ln + 9;
    const islamicYears = Math.floor(lunation / 12);
    let currentMonth = (lunation % 12);
    if (currentMonth < 0) {
        currentMonth += 12;
    }
    const currentYear = 1420 + islamicYears; // Start year + number of complete Islamic years
    return { month: currentMonth, year: currentYear };
}

// Find the sunset that occurred after the last New Moon happened in Mecca
export function timeOfSunsetAfterLastNewMoon(currentDateTime) {
    function adjustToSunsetDate(newMoon) {
        // If the new moon happened after 15:00 UTC, move to the next day’s sunset
        if (newMoon.getUTCHours() > 15) {
            newMoon.setUTCDate(newMoon.getUTCDate() + 1);
        }
        newMoon.setUTCHours(15, 0, 0, 0); // Set to 15:00 UTC (approximate Mecca sunset)
        return newMoon;
    }

    let offset = 0;
    let sunsetTime;

    // Try up to 3 previous new moons
    for (let attempts = 0; attempts < 3; attempts++) {
        let newMoon = astronomicalData.getNewMoon(currentDateTime, offset);
        sunsetTime = adjustToSunsetDate(new Date(newMoon));

        if (currentDateTime >= sunsetTime) {
            return sunsetTime;
        }

        offset--;
    }

    // If none found, fallback to the last adjusted one
    return sunsetTime;
}
