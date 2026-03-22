//|-------------------------|
//|     Lunar Calendars     |
//|-------------------------|

// A set of functions for calculating data in the Lunar Calendars category.

// --- Umm al-Qura / Islamic Hijri constants ---
const HIJRI_MONTH_NAMES = {
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

const HIJRI_WEEKDAY_NAMES = [
    'Yawm al-Ahad',      // Sunday
    'Yawm al-Ithnayn',   // Monday
    'Yawm ath-Thulatha', // Tuesday
    'Yawm al-Arba\'a',   // Wednesday
    'Yawm al-Khamis',    // Thursday
    'Yawm al-Jumu\'ah',  // Friday
    'Yawm as-Sabt'       // Saturday
];

const MECCA_TZ = 'UTC+03:00';
const HIJRI_LUNATION_OFFSET = 9;
const HIJRI_EPOCH_YEAR = 1420;
const MECCA_UTC_HOUR_CUTOFF_FOR_NEXT_DAY = 15;
const MAX_NEW_MOON_ATTEMPTS = 3;

// Returns a formatted Hijri calendar AST date
function getUmmalQuraDate(currentDateTime) {
    const firstDayOfMonth = timeOfSunsetAfterLastNewMoon(currentDateTime);

    const daysSinceStartOfMonth = Math.floor(differenceInDays(currentDateTime, firstDayOfMonth));
    const lunationSince2000 = calculateLunationNumber(firstDayOfMonth, true);
    const { month: monthIndex, year } = calculateIslamicMonthAndYear(lunationSince2000);

    let day = daysSinceStartOfMonth + 1;
    let displayYear = year;
    let yearSuffix = 'AH';
    if (year < 1) {
        displayYear = year - 1;
        yearSuffix = 'BH';
    }

    const monthName = HIJRI_MONTH_NAMES[monthIndex];
    const dayOfWeek = getWeekdayAtTime(currentDateTime, { hour: 'SUNSET' }, MECCA_TZ);

    const output = day + ' ' + monthName + ' ' + displayYear + ' ' + yearSuffix + '\n' + HIJRI_WEEKDAY_NAMES[dayOfWeek];
    return { output, day, month: monthName, year: displayYear, dayOfWeek };
}

function calculateIslamicMonthAndYear(lunationSince2000) {
    const lunation = lunationSince2000 + HIJRI_LUNATION_OFFSET;
    const yearsCompleted = Math.floor(lunation / 12);
    let monthIndex = lunation % 12;
    if (monthIndex < 0) {
        monthIndex += 12;
    }
    const year = HIJRI_EPOCH_YEAR + yearsCompleted;
    return { month: monthIndex, year };
}

// Find the sunset that occurred after the last New Moon happened in Mecca
function timeOfSunsetAfterLastNewMoon(currentDateTime) {
    function adjustToSunsetDate(newMoon) {
        const adjusted = createAdjustedDateTime({ currentDateTime: newMoon, timezone: MECCA_TZ, hour: 'SUNSET' });
        if (newMoon.getUTCHours() > MECCA_UTC_HOUR_CUTOFF_FOR_NEXT_DAY) {
            addDay(adjusted, 1);
        }
        return adjusted;
    }

    let lunationOffset = 0;
    let lastSunset;

    for (let attempt = 0; attempt < MAX_NEW_MOON_ATTEMPTS; attempt++) {
        const newMoon = getNewMoon(currentDateTime, lunationOffset);
        lastSunset = adjustToSunsetDate(newMoon);
        if (currentDateTime >= lastSunset) {
            return lastSunset;
        }
        lunationOffset--;
    }

    return lastSunset;
}
