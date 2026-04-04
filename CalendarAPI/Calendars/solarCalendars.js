//|-------------------------|
//|     Solar Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Solar Calendars category.

// Function to compute the Julian Day Number from a Gregorian date
function gregorianToJDN(currentDateTime) {
    let year = currentDateTime.getUTCFullYear();
    let month = currentDateTime.getUTCMonth() + 1; // JavaScript months are 0-based
    let day = currentDateTime.getUTCDate();
    if (month <= 2) {
        year -= 1;
        month += 12;
    }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JDN = Math.floor(365.25 * (year + 4716)) +
                Math.floor(30.6001 * (month + 1)) +
                day + B - 1524;
    return JDN;
}

// Function to convert a JDN to a Julian calendar date
function JDNToJulianDate(JDN) {
    const J = JDN + 0.5;
    const Z = Math.floor(J);
    const F = J - Z;
    let A = Z;
    const B = A + 1524;
    const C = Math.floor((B - 122.1) / 365.25);
    const D = Math.floor(365.25 * C);
    const E = Math.floor((B - D) / 30.6001);

    const day = B - D - Math.floor(30.6001 * E) + F;
    let month = (E < 14) ? E - 1 : E - 13;
    let year = (month > 2) ? C - 4716 : C - 4715;

    // Adjust for fractional day
    const dayInt = Math.floor(day);
    const fractionalDay = day - dayInt;

    return { year, month, day: dayInt, fractionalDay };
}

// Revised getJulianDate function using JDN conversion
function getRealJulianDate(currentDateTime) {
    // Compute JDN from Gregorian date
    const JDN = gregorianToJDN(currentDateTime);

    // Convert JDN to Julian date
    const julianDate = JDNToJulianDate(JDN);

    // Return Julian date object
    return julianDate;
}

// Returns an unformatted Julian date object, useful for calculating many calendars
function getApproxJulianDate(currentDateTime) {
    let year = currentDateTime.getUTCFullYear();
    let daysAhead = Math.trunc(year / 100) - Math.trunc(year / 400) - 2;
    let julianDate = createAdjustedDateTime({ currentDateTime, nullHourMinute: false, nullSeconds: false });
    julianDate.setUTCDate(julianDate.getUTCDate() - daysAhead);
    return julianDate;
}

function calculateGregorianJulianDifference(currentDateTime) {
    let gregJulDifference = 0;
    let julianDateParts = getRealJulianDate(currentDateTime);
    const totalSeconds = (julianDateParts.fractionalDay) * 24 * 60 * 60; // Total seconds in the fraction
    const hours = Math.floor(totalSeconds / 3600); // Get the whole hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
    const seconds = Math.floor(totalSeconds % 60); // Remaining seconds
    let julianDate = createAdjustedDateTime({year: julianDateParts.year, month: julianDateParts.month, day: julianDateParts.day, hour: hours, minute: minutes, second: seconds});
    julianDate.setTime(julianDate.getTime() - 0.5 * 24 * 60 * 60 * 1000);
    gregJulDifference = differenceInDays(currentDateTime, julianDate);
    return gregJulDifference;
}

// Shared helper for calendars that convert an equinox instant to a local
// day boundary (for example sunset/noon and optionally next midnight).
function adjustEquinoxAtLocalBoundary(equinoxDateTime, timezone, boundaryHour, moveToNextLocalMidnight) {
    const equinox = addDay(equinoxDateTime, 0, true);
    const boundaryDateTime = createAdjustedDateTime({ currentDateTime: equinox, timezone, hour: boundaryHour });
    if (equinox < boundaryDateTime) {
        addDay(boundaryDateTime, -1);
    }
    if (moveToNextLocalMidnight === true) {
        const nextLocalMidnight = createAdjustedDateTime({ currentDateTime: boundaryDateTime, timezone });
        addDay(nextLocalMidnight, 1);
        return nextLocalMidnight;
    }
    return boundaryDateTime;
}

// Returns a formatted Astronomical calendar UTC date
function getAstronomicalDate(currentDateTime) {
    const startOfGregorian = createAdjustedDateTime({year: 1582, month: 10, day: 15});
    let year = currentDateTime.getUTCFullYear();
    let day = currentDateTime.getUTCDate();
    let month = currentDateTime.getUTCMonth();
    const dayOfWeek = currentDateTime.getUTCDay();

    if (currentDateTime<startOfGregorian) {
        const julianDate = getRealJulianDate(currentDateTime);
        year = julianDate.year;
        month = julianDate.month-1;
        day = julianDate.day;
    }

    const output = `${day} ${monthNames[month]} ${year}\n${weekNames[dayOfWeek]}`;
    return { output, day, month, year, dayOfWeek };
}

// Returns a formatted Gregorian calendar local date and time
function getGregorianDateTime(currentDateTime, timezoneOffset) {
    // Adjust the date with the offset
    const adjustedDate = createFauxUTCDate(currentDateTime, timezoneOffset);
    let day = adjustedDate.getUTCDate();
    let month = adjustedDate.getUTCMonth();
    let year = adjustedDate.getUTCFullYear();
    let hour = adjustedDate.getUTCHours().toString().padStart(2, '0');
    let minute = adjustedDate.getUTCMinutes().toString().padStart(2, '0');
    let second = adjustedDate.getUTCSeconds().toString().padStart(2, '0');
    const dayOfWeek = adjustedDate.getUTCDay();

    // Set year suffix based on the value of year
    let yearSuffix = 'CE';
    let displayYear = year;
    if (year < 1) {
        yearSuffix = 'BCE';
        displayYear = Math.abs(year);  // Adjust year for BCE without negative sign
    }
    
    const dateDisplayString = `${day} ${monthNames[month]} ${displayYear} ${yearSuffix}\n${weekNames[dayOfWeek]}`;
    let timeDisplayString = hour + ':' + minute + ':' + second;
    return {
        date: dateDisplayString,
        time: timeDisplayString,
        output: dateDisplayString,
        day: day,
        month: month,
        year: year,
        dayOfWeek: dayOfWeek
    };
}

// Returns a formatted Julian calendar UTC date
function getJulianCalendar(currentDateTime) {
    const julianDate = getRealJulianDate(currentDateTime);
    const dayOfWeek = currentDateTime.getUTCDay();
    const { year, month, day } = julianDate;
    let yearSuffix = 'AD';
    let displayYear = year;
    if (year <= 0) {
        yearSuffix = 'BC';
        displayYear = -year + 1; // Convert to BC notation
    }
    const output = `${day} ${monthNames[month - 1]} ${displayYear} ${yearSuffix}\n${weekNames[dayOfWeek]}`;
    return { output, day, month: month - 1, year, dayOfWeek };
}

// --- Minguo (Republic of China) ---
const MINGUO_TZ = 'UTC+08:00';
const MINGUO_WEEK = ['天', '一', '二', '三', '四', '五', '六'];

// Returns a formatted Minguo CST (Chinese Standard Time) date
function getMinguo(currentDateTime) {
    const taiwanTime = createFauxUTCDate(currentDateTime, MINGUO_TZ);
    const day = taiwanTime.getUTCDate();
    const month = taiwanTime.getUTCMonth();
    const year = taiwanTime.getUTCFullYear() - 1911;
    const dayOfWeek = taiwanTime.getUTCDay();
    const output = `民國 ${year}年 ${month+1}月 ${day}日\n星期${MINGUO_WEEK[dayOfWeek]}`;
    return { output, day, month, year, dayOfWeek };
}

// --- Juche (North Korea) ---
const JUCHE_TZ = 'UTC+09:00';
const JUCHE_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

// Returns a formatted Juche KST date
function getJuche(currentDateTime) {
    const jucheTime = createFauxUTCDate(currentDateTime, JUCHE_TZ);
    const day = jucheTime.getUTCDate();
    const month = jucheTime.getUTCMonth() + 1;
    const year = jucheTime.getUTCFullYear() - 1911;
    const dayOfWeek = jucheTime.getUTCDay();
    const monthString = month < 10 ? '0' + month : month;
    const output = `Juche ${year}.${monthString}.${day}\n${JUCHE_WEEK[dayOfWeek]}요일`;
    return { output, day, month: month - 1, year, dayOfWeek };
}

// --- Thai Solar ---
const THAI_SOLAR_TZ = 'UTC+07:00';
const THAI_SOLAR_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];
const THAI_SOLAR_WEEK = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

// Returns a formatted Thai Solar THB date
function getThaiSolar(currentDateTime) {
    const thaiTime = createFauxUTCDate(currentDateTime, THAI_SOLAR_TZ);
    const day = thaiTime.getUTCDate();
    const month = thaiTime.getUTCMonth();
    const year = thaiTime.getUTCFullYear() + 543;
    const dayOfWeek = thaiTime.getUTCDay();
    const output = `${day} ${THAI_SOLAR_MONTHS[month]} B.E. ${year}\n${THAI_SOLAR_WEEK[dayOfWeek]}`;
    return { output, day, month, year, dayOfWeek };
}

// --- French Republican ---
const FRENCH_REPUBLICAN_TZ = 'UTC+01:00';
const FRENCH_REVOLUTIONARY_MONTHS = {
    1: 'Vendémiaire', 2: 'Brumaire', 3: 'Frimaire', 4: 'Nivôse',
    5: 'Pluviôse', 6: 'Ventôse', 7: 'Germinal', 8: 'Floréal',
    9: 'Prairial', 10: 'Messidor', 11: 'Thermidor',
    12: 'Fructidor', 13: 'Sansculottides'
};
const FRENCH_WEEK = ['Primidi', 'Duodi', 'Tridi', 'Quartidi', 'Quintidi', 'Sextidi', 'Septidi', 'Octidi', 'Nonidi', 'Décadi'];
const SANSCULOTTIDES_WEEK = [
    "La Fête de la Vertu", "La Fête du Génie", "La Fête du Travail",
    "La Fête de l'Opinion", "La Fête des Récompenses", "La Fête de la Révolution"
];

// Returns a formatted French Republican CET date
function getRepublicanCalendar(currentDateTime) {
    // Get starting and ending equinoxes, Paris Time (CET)
    let thisYear = createAdjustedDateTime({currentDateTime: currentDateTime, month: 10});
    let autumnalEquinox = getSolsticeEquinox(thisYear, 'AUTUMN');
    let startingEquinox = createAdjustedDateTime({ currentDateTime: autumnalEquinox, timezone: FRENCH_REPUBLICAN_TZ });
    if (currentDateTime < startingEquinox) {
        thisYear.setUTCFullYear(currentDateTime.getUTCFullYear() - 1);
        autumnalEquinox = getSolsticeEquinox(thisYear, 'AUTUMN');
        startingEquinox = createAdjustedDateTime({ currentDateTime: autumnalEquinox, timezone: FRENCH_REPUBLICAN_TZ });
    }

    // Get start of year, Paris Time (CET)
    let startOfRepublicanYear = createAdjustedDateTime({ currentDateTime: startingEquinox, nullHourMinute: false, nullSeconds: false });

    // Calculate the number of years since 1792
    let yearsSince1792 = startOfRepublicanYear.getUTCFullYear() - 1791;

    // Find days in current year
    let daysSinceSeptember22 = Math.floor(differenceInDays(currentDateTime, startOfRepublicanYear));
    
    let month = Math.floor(daysSinceSeptember22 / 30) + 1;
    if (month > 13) {
        month = 0;
    }

    // Increment up by 1 to account for no 0 day
    let day = Math.floor(daysSinceSeptember22 % 30)+1;

    // Calculate day of week
    let weekString = month === 13 ? SANSCULOTTIDES_WEEK[day - 1] : `${FRENCH_WEEK[(day - 1) % 10]} Décade ${Math.floor((day - 1) / 10) + 1}`;

    const output = `${day} ${FRENCH_REVOLUTIONARY_MONTHS[month]} ${toRomanNumerals(yearsSince1792)} RE\n${weekString}`;
    return { output, day, month: month > 0 ? month - 1 : null, year: yearsSince1792 };
}

// --- Era Fascista ---
const ERA_FASCISTA_TZ = 'UTC+01:00';

// Returns a formatted EF CET date
function getEraFascista(currentDateTime) {
    let october29 = createAdjustedDateTime({ currentDateTime, timezone: ERA_FASCISTA_TZ, month: 10, day: 29 });
    if (currentDateTime < october29) {
        october29.setUTCFullYear(currentDateTime.getUTCFullYear() - 1);
    }
    let yearsSince1922 = october29.getUTCFullYear() - 1921;
    const output = `Anno ${toRomanNumerals(yearsSince1922)}`;
    return { output, year: yearsSince1922 };
}

// --- Coptic ---
const COPTIC_TZ = 'UTC+02:00';
const COPTIC_MONTHS = [
    'Thout', 'Paopi', 'Hathor', 'Koiak', 'Tobi', 'Meshir',
    'Paremhat', 'Parmouti', 'Pashons', 'Paoni', 'Epip', 'Mesori', 'Pi Kogi Enavot'
];
const COPTIC_WEEK = [
    'ⲁⲕⲃⲟⲩⲗ', 'ⲥⲟⲙ', 'ⲅⲃⲁⲣ', 'ⲅⲟⲡ', 'ⲃⲁⲣⲙⲁⲕ', 'ⲃⲉⲕⲃⲁⲧ', 'ⲁⲧⲟⲃⲁⲣ'
];
const COPTIC_MONTH_DAYS = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];
const COPTIC_MONTH_DAYS_LEAP = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 6];

function getAlexandrian13MonthDateParts(currentDateTime, epochDate) {
    const currentJulianYear = getApproxJulianDate(currentDateTime).getFullYear();
    const monthDays = currentJulianYear % 4 === 3 ? COPTIC_MONTH_DAYS_LEAP : COPTIC_MONTH_DAYS;
    const daysSinceEpoch = Math.floor(differenceInDays(currentDateTime, epochDate));
    const yearsSinceEpoch = Math.floor((4 * daysSinceEpoch + 3) / 1461);
    let year = yearsSinceEpoch;

    let remainingDays = daysSinceEpoch - Math.floor((365 * yearsSinceEpoch + Math.floor(yearsSinceEpoch / 4)));
    if (remainingDays <= 0) {
        year -= 1;
        remainingDays += 365 + (year % 4 === 3 ? 1 : 0); // Adjust for leap year
    }

    let month = 0;
    while (remainingDays > monthDays[month]) {
        remainingDays -= monthDays[month];
        month++;
    }

    if (remainingDays <= 0) {
        month--;
        if (month < 0) {
            month += 13;
        }
        remainingDays = monthDays[month];
    }

    return { day: remainingDays, month, year };
}

// Returns a formatted Coptic UTC date based on the Julian Day (not Julian date)
function getCopticDate(currentDateTime) {
    const thoutYear1 = createAdjustedDateTime({ timezone: COPTIC_TZ, year: 283, month: 8, day: 29 });
    const copticDate = getAlexandrian13MonthDateParts(currentDateTime, thoutYear1);
    
    // Get the weekday based on midnight in Egypt
    const dayOfWeek = getWeekdayAtTime(currentDateTime, { hour: 22, minute: 0 });

    const output = `${copticDate.day} ${COPTIC_MONTHS[copticDate.month]} ${copticDate.year} AM\n${COPTIC_WEEK[dayOfWeek]}`;
    return { output, day: copticDate.day, month: copticDate.month, year: copticDate.year, dayOfWeek };
}

// --- Ethiopian ---
const ETHIOPIAN_TZ = 'UTC+03:00';
const ETHIOPIAN_MONTHS = [
    'Mäskäräm', 'Ṭəqəmt', 'Ḫədar', 'Taḫśaś', 'Ṭərr', 'Yäkatit', 'Mägabit',
    'Miyazya', 'Gənbo', 'Säne', 'Ḥamle', 'Nähase', 'Ṗagume'
];
const ETHIOPIAN_WEEK = [
    'ሰንበት', 'ሰኑይ', 'ሠሉስ', 'ረቡዕ', 'ሓሙስ', 'ዓርብ', 'ቀዳሚት'
];

// Returns a formatted Ethiopian EET date
function getEthiopianDate(currentDateTime) {
    const thoutYear1 = createAdjustedDateTime({ timezone: ETHIOPIAN_TZ, year: 7, month: 8, day: 27 });
    const ethiopianDate = getAlexandrian13MonthDateParts(currentDateTime, thoutYear1);
    
    // Get the weekday based on midnight in Ethiopia
    const dayOfWeek = getWeekdayAtTime(currentDateTime, { hour: 21, minute: 0 });

    const output = `${ethiopianDate.day} ${ETHIOPIAN_MONTHS[ethiopianDate.month]} ዓ.ም.${ethiopianDate.year}\n${ETHIOPIAN_WEEK[dayOfWeek]}`;
    return { output, day: ethiopianDate.day, month: ethiopianDate.month, year: ethiopianDate.year, dayOfWeek };
}

// Returns a formatted Byzantine TRT date
function getByzantineCalendar(currentDateTime) {
    let adjustedDateTime = createAdjustedDateTime({ currentDateTime, nullHourMinute: false, nullSeconds: false });

    // Check if time is before 21:00:00 (9 PM)
    if (adjustedDateTime.getUTCHours() < 21) {
        // Subtract one day
        addDay(adjustedDateTime, -1);
    }

    // Get Julian date from Gregorian via JDN
    const JDN = gregorianToJDN(adjustedDateTime);
    const julianDate = JDNToJulianDate(JDN+1);
    let byzantineYear = julianDate.year + 5508; // Start with 5508

    // Determine if date is on or after September 1 in Julian calendar
    if (julianDate.month > 8) {
        byzantineYear += 1;
    }

    // Get weekday based on midnight in Istanbul
    const dayOfWeek = getWeekdayAtTime(currentDateTime, { hour: 21, minute: 0 });
    const month = julianDate.month - 1;
    
    const monthString = monthNames[month]; // Adjust for 0-based index
    const dayString = julianDate.day;

    const output = `${dayString} ${monthString} ${byzantineYear} AM\n${weekNames[dayOfWeek]}`;
    return { output, day: julianDate.day, month: month, year: byzantineYear, dayOfWeek };
}

function getJulianDerivedCivilCalendarDate(adjustedDateTime, yearResolver) {
    const adjustedJDN = gregorianToJDN(adjustedDateTime);
    const adjustedJulianDate = JDNToJulianDate(adjustedJDN);
    const year = yearResolver(adjustedJulianDate);
    const dayOfWeek = adjustedDateTime.getUTCDay();
    const month = adjustedJulianDate.month - 1;
    const monthString = monthNames[month];
    const dayString = adjustedJulianDate.day;

    let displayYear = year;
    let yearSuffix = 'AD';
    if (year <= 0) {
        displayYear = -year + 1;
        yearSuffix = 'BC';
    }

    const output = `${dayString} ${monthString} ${displayYear} ${yearSuffix}\n${weekNames[dayOfWeek]}`;
    return { output, day: dayString, month: month, year, dayOfWeek };
}

// Returns a formatted Florentine (CET) date
function getFlorentineCalendar(currentDateTime) {
    const adjustedDate = createAdjustedDateTime({ currentDateTime });

    // Check for approximate sunset and increment the day
    if (currentDateTime.getUTCHours() >= 17) {
        addDay(adjustedDate, 1);
    }

    return getJulianDerivedCivilCalendarDate(adjustedDate, (adjustedJulianDate) => {
        // Florentine year starts on March 25 (Julian).
        let florentineYear = adjustedJulianDate.year;
        if (adjustedJulianDate.month < 3 || (adjustedJulianDate.month === 3 && adjustedJulianDate.day < 25)) {
            florentineYear -= 1;
        }
        return florentineYear;
    });
}

// Returns a formatted Pisan (CET) date
function getPisanCalendar(currentDateTime) {
    const adjustedDate = createAdjustedDateTime({ currentDateTime });

    // Check for approximate sunset and increment the day
    if (currentDateTime.getUTCHours() >= 23) {
        addDay(adjustedDate, 1);
    }

    return getJulianDerivedCivilCalendarDate(adjustedDate, (adjustedJulianDate) => {
        // Pisan year starts on March 25 (Julian), with +1 year style.
        let pisanYear = adjustedJulianDate.year + 1;
        if (adjustedJulianDate.month < 3 || (adjustedJulianDate.month === 3 && adjustedJulianDate.day < 25)) {
            pisanYear -= 1;
        }
        return pisanYear;
    });
}

// --- Venetian ---
const VENETIAN_TZ = 'UTC+03:00';

// Returns a formatted Venetian (CET) date
function getVenetianCalendar(currentDateTime) {
    const venetianDay = createFauxUTCDate(currentDateTime, VENETIAN_TZ);

    return getJulianDerivedCivilCalendarDate(venetianDay, (adjustedJulianDate) => {
        // Venetian year starts on March 1 (Julian).
        let venetianYear = adjustedJulianDate.year;
        if (adjustedJulianDate.month < 3) {
            venetianYear -= 1;
        }
        return venetianYear;
    });
}

// --- Baha'i ---
const BAHAI_TZ = 'UTC+03:30';

// Returns a formatted Baha'i IRST date
function getBahaiCalendar(currentDateTime, _vernalEquinoxUnused) {
    const bahaiMonths = [
        "Bahá","Jalál","Jamál","‘Aẓamat","Núr","Raḥmat","Kalimát","Kamál","Asmá’","‘Izzat",
        "Mashíyyat","‘Ilm","Qudrat","Qawl","Masá’il","Sharaf","Sulṭán","Mulk","Ayyám-i-Há","‘Alá’"
    ];

    const bahaiWeek = [
        "Jamál",    // Beauty
        "Kamál",    // Perfection
        "Fiḍál",    // Grace
        "‘Idál",    // Justice
        "Istijlál", // Majesty
        "Istiqlál", // Independence
        "Jalál"     // Glory
    ];

    // Bahá'í year runs from one Naw-Rúz (vernal equinox) to the next. Use the spring equinox of the
    // current Gregorian year, not getSolsticeEquinox(dt) ("last spring ≤ dt"), which is still the
    // previous March when viewing early March before this year's equinox — that mis-sized the year and
    // flipped bounds mid-month. Second argument kept for API compatibility with callers.
    const gregorianYear = currentDateTime.getUTCFullYear();
    const midThisYear = createAdjustedDateTime({ currentDateTime, year: gregorianYear, month: 7, day: 1 });
    const springThisGregorianYear = getSolsticeOrEquinox(midThisYear, 'SPRING');
    const midPrevYear = createAdjustedDateTime({ currentDateTime, year: gregorianYear - 1, month: 7, day: 1 });
    const springPrevGregorianYear = getSolsticeOrEquinox(midPrevYear, 'SPRING');
    const midNextYear = createAdjustedDateTime({ currentDateTime, year: gregorianYear + 1, month: 7, day: 1 });
    const springNextGregorianYear = getSolsticeOrEquinox(midNextYear, 'SPRING');

    let startingEquinox;
    let endingEquinox;
    if (currentDateTime < springThisGregorianYear) {
        startingEquinox = springPrevGregorianYear;
        endingEquinox = springThisGregorianYear;
    } else {
        startingEquinox = springThisGregorianYear;
        endingEquinox = springNextGregorianYear;
    }

    // Calculate if the New Year should start later or earlier based on sunset in Tehran (UTC+3:30)
    startingEquinox = adjustEquinoxAtLocalBoundary(startingEquinox, BAHAI_TZ, 'SUNSET', false);
    endingEquinox = adjustEquinoxAtLocalBoundary(endingEquinox, BAHAI_TZ, 'SUNSET', false);

    // Calculate when today started based on sunset in Tehran (UTC+3:30)
    let currentDayOfYear = Math.trunc(differenceInDays(currentDateTime, startingEquinox))+1;
    
    // Iterate through months from start until Mulk, find intercalary days, then iterate backwards for Ala
    let monthIndex = 0;
    
    while (currentDayOfYear > 19) {
        // Months before intercalary days
        if (monthIndex<17) {
            currentDayOfYear -= 19;
            monthIndex++;

        // Months after intercalary days
        } else {
            // Get first day of final month, which is 19 days before the ending equinox
            let firstDayOfFinalMonth = addDay(endingEquinox, -19, true);

            // If before that time, then it's the intercalary 4 or 5 days
            if (currentDateTime < firstDayOfFinalMonth) {
                currentDayOfYear -= 19;
                monthIndex=18;

            // It's after the start of the month
            } else {
                // Get new current day of year by working from the final month
                currentDayOfYear = Math.trunc(differenceInDays(currentDateTime, firstDayOfFinalMonth))+1;
                // Day is within final month
                if (currentDayOfYear<20) {
                    monthIndex=19;
                // Day is after final month
                } else {
                    currentDayOfYear = 1;
                    monthIndex = 0;
                }
            }
        }
    }

    // If after February but less than Month 17 in Bahai, it's past the Bahai New Year
    let year = currentDateTime.getUTCFullYear() - 1844;
    if ((currentDateTime.getUTCMonth()>1)&&(monthIndex<16)) {
        year++
    }

    // Get the weekday based on sunset in Tehran
    const dayOfWeek = getWeekdayAtTime(currentDateTime, { hour: 'SUNSET' }, BAHAI_TZ);

    const output = `${currentDayOfYear} ${bahaiMonths[monthIndex]} ${year} BE\n${bahaiWeek[dayOfWeek]}`;
    return { output, day: currentDayOfYear, month: monthIndex, year, dayOfWeek };
}

// --- Pataphysical ---
const PATAPHYSICAL_MONTHS = [
    "Absolu", "Haha", "As", "Sable", "Décervelage", "Gueules", "Pédale",
    "Clinamen", "Palotin", "Merdre", "Gidouille", "Tatane", "Phalle"
];
const PATAPHYSICAL_WEEK = [
    "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
];

// Returns a formatted Pataphysical local date
function getPataphysicalDate(currentDateTime, timezoneOffset) {
    // Clear timezone offset from original datetime
    let localTime = createFauxUTCDate(currentDateTime, timezoneOffset);

    // September 8 at midnight
    let mostRecentSept8 = createAdjustedDateTime({currentDateTime: localTime, month: 9, day: 8});
    if (localTime < mostRecentSept8) {
        addYear(mostRecentSept8, -1);
    }

    // Get days since last September
    let remainingDays = Math.floor(differenceInDays(localTime, mostRecentSept8));
    
    // Figure out leap year rules
    let nextSept8 = addYear(mostRecentSept8, 1, true);
    const daysInYear = differenceInDays(nextSept8, mostRecentSept8);
    const daysOfMonths = daysInYear === 366 
        ? [28,28,28,28,28,29,28,28,28,28,29,28,28]
        : [28,28,28,28,28,28,28,28,28,28,29,28,29];

    // Iterate through days of months and subtract from remaining days
    let monthIndex = 0;
    for (; monthIndex < daysOfMonths.length; monthIndex++) {
        if (remainingDays < daysOfMonths[monthIndex]) {
            break;
        }
        remainingDays -= daysOfMonths[monthIndex];
    }

    // Add 1 because days are 0 based
    const day = remainingDays + 1;
    const month = PATAPHYSICAL_MONTHS[monthIndex];
    let year = mostRecentSept8.getUTCFullYear()-1872; // Get epoch
    const dayOfWeek = localTime.getUTCDay();

    const output = `${day} ${month} ${year} A.P.\n${PATAPHYSICAL_WEEK[dayOfWeek]}`;
    return { output, day, month: monthIndex, year, dayOfWeek };
}

// --- Discordian ---
const DISCORDIAN_MONTHS = ["Chaos", "Discord", "Confusion", "Bureaucracy", "The Aftermath"];
const DISCORDIAN_WEEK = ["Sweetmorn", "Boomtime", "Pungenday", "Prickle-Prickle", "Setting Orange"];

// Returns a formatted Discordian local date
function getDiscordianDate(currentDateTime, timezoneOffset) {
    // Clear timezone offset from original datetime
    let localTime = createFauxUTCDate(currentDateTime, timezoneOffset);

    // Figure out year and leap year status
    const startOfYear = createAdjustedDateTime({currentDateTime: localTime, month: 1, day: 1});
    const endOfYear = addYear(startOfYear, 1, true);
    let remainingDays = Math.floor(differenceInDays(localTime, startOfYear)+1);
    const leapYear = differenceInDays(endOfYear, startOfYear) === 366;

    let dayMonthString = '';

    // Find if on or after St. Tib's Day, not part of the numbered days of the year
    if ((leapYear)&&(remainingDays>=60)) {
        if (remainingDays===60) {
            dayMonthString = `St. Tib's Day`;
        }
        remainingDays--;
    }

    // Calculate basic calendar elements (1-based day-in-year: 1–365)
    const daysPerMonth = 73;
    const dayIndex = remainingDays - 1;
    let month = Math.floor(dayIndex / daysPerMonth);
    let day = (dayIndex % daysPerMonth) + 1;
    let year = localTime.getUTCFullYear() + 1166;
    const dayOfWeek = remainingDays % 5;

    if (dayMonthString==='') {
        dayMonthString = `${day} ${DISCORDIAN_MONTHS[month]}`;
    }

    const output = `${dayMonthString} ${year} YOLD\n${DISCORDIAN_WEEK[dayOfWeek]}`;
    return { output, day, month, year, dayOfWeek };
}

// --- Solar Hijri ---
const SOLAR_HIJRI_TZ = 'UTC+03:30';
const SOLAR_HIJRI_MONTHS = [
    "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
    "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"
];
const SOLAR_HIJRI_WEEK = [
    "Shanbeh", "Yekshanbeh", "Doshanbeh", "Seshanbeh", "Chaharshanbeh",
    "Panjshanbeh", "Jomeh"
];

// Returns a formatted Solar Hijri IRST date
function getSolarHijriDate(currentDateTime, vernalEquinox_) {
    let vernalEquinox = adjustEquinoxAtLocalBoundary(vernalEquinox_, SOLAR_HIJRI_TZ, 'NOON', true);

    // Determine the starting and ending equinoxes
    let startingEquinox, endingEquinox;
    const octoberThisYear = createAdjustedDateTime({currentDateTime: currentDateTime, month: 10});
    if (currentDateTime < vernalEquinox) {
        let lastYear = addYear(octoberThisYear, -1);
        startingEquinox = getSolsticeEquinox(lastYear, 'SPRING');
        startingEquinox = adjustEquinoxAtLocalBoundary(startingEquinox, SOLAR_HIJRI_TZ, 'NOON', true);
        endingEquinox = vernalEquinox;
    } else {
        let nextYear = addYear(octoberThisYear, 1);
        startingEquinox = vernalEquinox;
        endingEquinox = getSolsticeEquinox(nextYear, 'SPRING');
        endingEquinox = adjustEquinoxAtLocalBoundary(endingEquinox, SOLAR_HIJRI_TZ, 'NOON', true);
    }
    
    const leapYear = differenceInDays(endingEquinox, startingEquinox) === 366;
    let remainingDays = Math.floor(differenceInDays(currentDateTime, startingEquinox));

    // Days per month in Solar Hijri calendar
    let daysOfMonths = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    if (leapYear) {
        daysOfMonths[11] = 30;
    }

    // Iterate through months to find the current month and day
    let monthIndex = 0;
    for (; monthIndex < daysOfMonths.length; monthIndex++) {
        if (remainingDays <= daysOfMonths[monthIndex]) {
            break;
        }
        remainingDays -= daysOfMonths[monthIndex];
    }

    // It is next month if days are still too many
    let day = remainingDays+1;
    if (day > daysOfMonths[monthIndex]) {
        day = 1;
        monthIndex += 1;
    }

    // If monthIndex rolls over, adjust to first month of the next year
    if (monthIndex > 11) {
        monthIndex = 0;
    }
    
    const month = SOLAR_HIJRI_MONTHS[monthIndex];
    let year = startingEquinox.getUTCFullYear() - 621;

    // Adjust for dates before epoch
    if (year <= 0) {
        year -= 1; // Correct 0 year to -1
    }

    // Determine weekday based on midnight in Tehran (20:30 UTC)
    const dayOfWeek = getWeekdayAtTime(currentDateTime, { hour: 20, minute: 30 });

    const output = `${day} ${month} ${year} SH\n${SOLAR_HIJRI_WEEK[dayOfWeek]}`;
    return { output, day, month: monthIndex, year, dayOfWeek };
}

// --- Qadimi ---
const QADIMI_TZ = 'UTC+03:30';
const QADIMI_MONTHS = [
    'Farvardin', 'Ardibehesht', 'Khordad', 'Tir', 'Amardad', 'Shehrevar',
    'Mehr', 'Aban', 'Azar', 'Dae', 'Bahman', 'Asfand', 'Gatha'
];
const QADIMI_DAYS = [
    "Hormazd", "Bahman", "Ardibehesht", "Shehrevar", "Aspandard", "Khordad", "Amardad", "Dae-Pa-Adar", "Adar", "Avan",
    "Khorshed", "Mohor", "Tir", "Gosh", "Dae-Pa-Meher", "Meher", "Srosh", "Rashne", "Fravardin", "Behram",
    "Ram", "Govad", "Dae-Pa-Din", "Din", "Ashishvangh", "Ashtad", "Asman", "Zamyad", "Mareshpand", "Aneran"
];
const GATHA_DAYS = ["Ahunavaiti", "Ushtavaiti", "Spentamainyu", "Vohuxshathra", "Vahishtoishti"];
const QADIMI_WEEK = [
    "Jomeh", "Shanbeh", "Yekshanbeh", "Doshanbeh", "Seshanbeh", "Chaharshanbeh", "Panjshanbeh"
];

// Returns a formatted Qadimi IRST date
function getQadimiDate(currentDateTime) {
    // Sunrise in Iran in 19 June 632, a base Nowruz day
    const Nowruz632Sunrise = createAdjustedDateTime({ timezone: QADIMI_TZ, year: 632, month: 6, day: 19, hour: 'SUNRISE' }); 
    const daysSince632 = Math.floor(differenceInDays(currentDateTime, Nowruz632Sunrise));
    const yearsSince632 = Math.floor(daysSince632/365);
    let remainingDays = daysSince632 - (yearsSince632*365)+1;

    // Step through months
    let monthIndex = 0;
    while (remainingDays > 30) {
        monthIndex++;
        remainingDays -= 30;
    }

    let day = QADIMI_DAYS[remainingDays - 1];
    let month = QADIMI_MONTHS[monthIndex];
    const year = yearsSince632 +1;

    // Determine weekday based on sunrise in Tehran (2:30 UTC)
    const dayOfWeek = getWeekdayAtTime(currentDateTime, { hour: 'SUNRISE' }, QADIMI_TZ);

    // If Gatha days, use Gatha day names
    if (monthIndex > 11 && remainingDays < 6) {
        day = GATHA_DAYS[remainingDays - 1];
        const outputGatha = `${day} ${year} Y.Z.\n${QADIMI_WEEK[dayOfWeek]}`;
        return { output: outputGatha, day, month: monthIndex, year, dayOfWeek, other: { gatha: true } };
    }

    const outputQadimi = `${day} ${month} ${year} Y.Z.\n${QADIMI_WEEK[dayOfWeek]}`;
    return { output: outputQadimi, day: remainingDays, month: monthIndex, year, dayOfWeek, other: { dayName: day } };
}

// --- Egyptian Civil ---
const EGYPTIAN_TZ = 'UTC+02:00';
const EGYPTIAN_SEASONS = ["Akhet", "Peret", "Shemu", "Heriu Renpet"];
const EGYPTIAN_INTERCALARY_DAYS = ["Osiris", "Horus the Elder", "Set", "Isis", "Nephthys"];
const EGYPTIAN_MONTH_NUMBERS = ["I", "II", "III", "IV"];

// Returns a formatted Egyptian Civil EET date
function getEgyptianDate(currentDateTime) {
    // Find days since epoch and calculate years
    const startOfAkhet2781 = createAdjustedDateTime({ timezone: EGYPTIAN_TZ, year: -2781, month: 6, day: 27 });
    const daysSincestartOfAkhet2781 = Math.floor(differenceInDays(currentDateTime, startOfAkhet2781));
    const yearsSinceStartOfAkhet2781 = Math.floor(daysSincestartOfAkhet2781/365);
    const currentDayOfYear = ((daysSincestartOfAkhet2781 % 365) + 365) % 365 + 1;
    const dayIndex = currentDayOfYear - 1;

    // First 360 days are 3 seasons x 4 months x 30 days; last 5 are intercalary.
    let currentSeason;
    let currentMonthNumber = null;
    let dayOfMonth;
    let monthAndDayText;

    if (dayIndex < 360) {
        const seasonIndex = Math.floor(dayIndex / 120);
        const dayOfSeasonIndex = dayIndex % 120;
        currentSeason = EGYPTIAN_SEASONS[seasonIndex];
        currentMonthNumber = Math.floor(dayOfSeasonIndex / 30);
        dayOfMonth = (dayOfSeasonIndex % 30) + 1;
        monthAndDayText = `${EGYPTIAN_MONTH_NUMBERS[currentMonthNumber]} ${currentSeason} ${dayOfMonth}`;
    } else {
        currentSeason = EGYPTIAN_SEASONS[3];
        dayOfMonth = (dayIndex - 360) + 1;
        monthAndDayText = EGYPTIAN_INTERCALARY_DAYS[dayOfMonth - 1];
    }

    const output = `${monthAndDayText} (${yearsSinceStartOfAkhet2781})`;
    return { output, day: dayOfMonth, month: currentMonthNumber, year: yearsSinceStartOfAkhet2781, other: { season: currentSeason } };
}

// Returns an ISO Week local date
function getISOWeekDate(currentDateTime, timezoneOffset) {
    // Adjust for timezone
    let localTime = createFauxUTCDate(currentDateTime, timezoneOffset);
    const startOfLocalDay = createAdjustedDateTime({ currentDateTime: localTime });

    // ISO weekday: 1 (Mon) to 7 (Sun)
    const isoDay = localTime.getUTCDay() === 0 ? 7 : localTime.getUTCDay(); // 0 => 7 (Sunday)
    
    // Move date to the Thursday in the current ISO week
    const thursday = addDay(startOfLocalDay, 4 - isoDay, true);

    const weekYear = thursday.getUTCFullYear();

    // Find the first Thursday of the year
    let firstThursday = createAdjustedDateTime({year: weekYear, month: 1, day: 4});
    const firstIsoDay = firstThursday.getUTCDay() === 0 ? 7 : firstThursday.getUTCDay();
    firstThursday = addDay(firstThursday, 4 - firstIsoDay, true);

    // Calculate week number using whole-day math to avoid time-of-day drift.
    const wholeDaysBetweenThursdays = Math.floor(differenceInDays(thursday, firstThursday));
    const weekNumber = Math.floor(wholeDaysBetweenThursdays / 7) + 1;

    const output = `${weekYear}-W${weekNumber}-${isoDay}`;
    return { output, day: isoDay, month: null, year: weekYear, dayOfWeek: isoDay, other: { weekNumber } };
}

// --- Haab (Maya) ---
const HAAB_TZ = 'UTC-06:00';
const HAAB_MONTHS = [
    "Pop", "Wo'", "Sip", "Sotz'", "Sek", "Xul",
    "Yaxk'in'", "Mol", "Ch'en", "Yax", "Sak'",
    "Keh", "Mak", "K'ank'in'", "Muwan", "Pax",
    "K'ayab'", "Kumk'u", "Wayeb'"
];

// Returns a formatted Haab CST date
function getHaabDate(localTime) {
    // Use Maya Long Count, even though it's not really the epoch
    const mayaLongCount0 = createAdjustedDateTime({ timezone: HAAB_TZ, year: -3113, month: 8, day: 11 });
    const totalDays = Math.floor(differenceInDays(localTime, mayaLongCount0));

    // Maya Long Count epoch doesn't begin a cycle
    const startingHaabDay = 8;
    const startingHaabMonthIndex = HAAB_MONTHS.indexOf("Kumk'u");

    // Find current place in the cycle
    const daysInYear = 365;
    const adjustedDays = (totalDays % daysInYear + daysInYear) % daysInYear;
    const totalHaabDays = (startingHaabMonthIndex * 20 + startingHaabDay + adjustedDays) % daysInYear;
    const haabMonthIndex = Math.floor(totalHaabDays / 20);
    const haabDay = totalHaabDays % 20;
    const output = `${haabDay} ${HAAB_MONTHS[haabMonthIndex]}`;
    return { output: output, day: haabDay, month: haabMonthIndex };
}

// Returns a formatted Anno Lucis local date
function getAnnoLucisDate(currentDateTime, timezoneOffset) {
    const greg = getGregorianDateTime(currentDateTime, timezoneOffset);
    const annoLucisDay = greg.day;
    const annoLucisMonth = monthNames[greg.month];
    const annoLucisWeek = weekNames[greg.dayOfWeek];
    let annoLucisYearNumber = greg.year;

    // Add 4000 years to the year
    annoLucisYearNumber += 4000;

    const output = `${annoLucisDay} ${annoLucisMonth} ${annoLucisYearNumber} AL\n${annoLucisWeek}`;
    return { output, day: greg.day, month: greg.month, year: annoLucisYearNumber, dayOfWeek: greg.dayOfWeek };
}

// --- Tabot ---
const TABOT_TZ = 'UTC-05:00';
const TABOT_MONTHS = [
    "Anbassa", "Hymanot", "Immanuel", "Ras", "Ta'Berhan", "Manassa",
    "Danaffa", "Negest", "Tafari", "Emru", "Sawwara", "Negus & Dejazmatch"
];
const TABOT_WEEK = [
    "Ergat", "Tazajenat", "Kedusenant", "Ra'ee", "Makrab", "Mamlak", "Germa"
];

// Returns a formatted Tabot EST date
function getTabotDate(currentDateTime) {
    // Get start of today's date
    const startOfToday = createFauxUTCDate(currentDateTime, TABOT_TZ);
    const dayOfWeek = startOfToday.getUTCDay();

    // Get start of this year and next year
    let startOfThisYear = createAdjustedDateTime({ currentDateTime, timezone: TABOT_TZ, year: currentDateTime.getUTCFullYear(), month: 11, day: 2 });
    if (currentDateTime < startOfThisYear) {
        addYear(startOfThisYear, -1);
    }
    let startOfNextYear = addYear(startOfThisYear, 1, true);

    // Get days in year and days since start of this year
    const daysInYear = differenceInDays(startOfNextYear, startOfThisYear);
    const daysSinceStartOfThisYear = Math.floor(differenceInDays(currentDateTime, startOfThisYear));
    let currentDay = daysSinceStartOfThisYear;

    // Get leap day
    let leapDay = false;
    if ((daysInYear===366)&&(daysSinceStartOfThisYear>=120)) {
        currentDay -= 1;
        if (daysSinceStartOfThisYear===120) {
            leapDay = true;
        }
    }

    // Handle final month having 35 days, set day and month
    let day = (currentDay % 30)+1;
    let monthIndex = 0;
    if (currentDay > 359) {
        monthIndex = 11;
        day = (currentDay % 30)+31;
    } else {
        monthIndex = Math.floor(currentDay / 30);
    }

    // If leap day, set day and month
    if (leapDay) {
        day = 31;
        monthIndex = 3;
    }
    
    // Get month and year
    const month = TABOT_MONTHS[monthIndex];
    const year = startOfThisYear.getUTCFullYear() - 1930;

    const output = `${day} ${month} H.I.M. ${year}\n${TABOT_WEEK[dayOfWeek]}`;
    return { output, day, month: monthIndex, year, dayOfWeek };
}

// --- Icelandic ---
const ICELANDIC_MONTHS = ['Harpa', 'Skerpla', 'Sólmánuðr', 'Aukanætur', 'Heyannir', 'Tvímánuðr', 'Haustmánuðr', 'Gormánuðr', 'Ýlir', 'Mörsugr', 'Þorri', 'Góa', 'Einmánuðr'];
const ICELANDIC_MONTHS_LEAP = ['Harpa', 'Skerpla', 'Sólmánuðr', 'Aukanætur', 'Sumarauki', 'Heyannir', 'Tvímánuðr', 'Haustmánuðr', 'Gormánuðr', 'Ýlir', 'Mörsugr', 'Þorri', 'Góa', 'Einmánuðr'];
const ICELANDIC_DAYS = ['sunnudagr', 'mánadagr', 'týrsdagr', 'óðinsdagr', 'þorsdagr', 'frjádagr', 'laugardagr'];
const ICELANDIC_DAYS_PER_MONTH = [30, 30, 30, 4, 30, 30, 30, 30, 30, 30, 30, 30, 30];
const ICELANDIC_DAYS_PER_MONTH_LEAP = [30, 30, 30, 4, 7, 30, 30, 30, 30, 30, 30, 30, 30, 30];
const ICELANDIC_MESSIERI_WEEKS = [26, 26];
const ICELANDIC_MESSIERI_WEEKS_LEAP = [27, 26];

// Returns a formatted Icelandic (GMT) date
function getIcelandicDate(currentDateTime) {
    // Helper function to get the Thursday on or after April 19 for a given year
    function getThursdayOnOrAfterApril19(year) {
        let april19 = createAdjustedDateTime({currentDateTime: currentDateTime, year: year, month: 4, day: 19});
        let dayOfWeek = april19.getUTCDay(); // 0 = Sunday, 4 = Thursday
        let daysToAdd = (4 - dayOfWeek + 7) % 7; // Days to add to get to Thursday (on or after April 19)
        return addDay(april19, daysToAdd);
    }

    let startingThursdayThisYear = getThursdayOnOrAfterApril19(currentDateTime.getUTCFullYear());
    
    let thursdayBefore, thursdayAfter;
    if (currentDateTime < startingThursdayThisYear) {
        // Current date is before this year's Thursday, so get previous year's Thursday
        thursdayBefore = getThursdayOnOrAfterApril19(currentDateTime.getUTCFullYear() - 1);
        thursdayAfter = startingThursdayThisYear;
    } else {
        // Current date is on or after this year's Thursday, so get next year's Thursday
        thursdayBefore = startingThursdayThisYear;
        thursdayAfter = getThursdayOnOrAfterApril19(currentDateTime.getUTCFullYear() + 1);
    }

    // Calculate the number of days in the Icelandic year (between the two Thursdays)
    const daysInYear = Math.floor(differenceInDays(thursdayAfter, thursdayBefore));

    const icelandicDaysPerMonth = daysInYear === 371 ? ICELANDIC_DAYS_PER_MONTH_LEAP : ICELANDIC_DAYS_PER_MONTH;
    const icelandicMonths = daysInYear === 371 ? ICELANDIC_MONTHS_LEAP : ICELANDIC_MONTHS;
    const icelandicMessieriWeeks = daysInYear === 371 ? ICELANDIC_MESSIERI_WEEKS_LEAP : ICELANDIC_MESSIERI_WEEKS;

    // Calculate days since thursdayBefore
    let daysSinceThursdayBefore = Math.floor(differenceInDays(currentDateTime, thursdayBefore)) + 1;
    const icelandicDayOfWeek = (daysSinceThursdayBefore+3) % 7;
    let missieriWeek = Math.floor((daysSinceThursdayBefore-1) / 7) + 1;

    // Iterate through icelandicDaysPerMonth to find the current month
    let icelandicMonthIndex = 0;
    let remainingDays = daysSinceThursdayBefore;
    while (remainingDays > icelandicDaysPerMonth[icelandicMonthIndex]) {
        remainingDays -= icelandicDaysPerMonth[icelandicMonthIndex];
        icelandicMonthIndex++;
    }
    
    // Get the current Icelandic month name using the index
    const icelandicMonth = icelandicMonths[icelandicMonthIndex];
    const icelandicDay = remainingDays;
    
    // Find the season boundary (Winter starts after Gormánuðr)
    const winterStartIndex = icelandicMonths.indexOf('Gormánuðr');
    const icelandicSeason = icelandicMonthIndex < winterStartIndex ? 'Summer' : 'Winter';

    if (icelandicSeason === 'Winter') {
        missieriWeek -= icelandicMessieriWeeks[0];
    }

    const output = `${icelandicDay} ${icelandicMonth}\nMisseri: ${icelandicSeason}\nWeek: ${missieriWeek}\n${ICELANDIC_DAYS[icelandicDayOfWeek]}`;
    return { output, day: icelandicDay, month: icelandicMonthIndex, year: undefined, dayOfWeek: icelandicDayOfWeek, other: { season: icelandicSeason, week: missieriWeek } };
}

// --- Saka Samvat ---
const SAKA_SAMVAT_TZ = 'UTC+05:30';
const SAKA_SAMVAT_MONTHS = [
    "Chaitra", "Vaishakha", "Jyestha", "Ashadha", "Sravana", "Bhadra",
    "Asvina", "Kartika", "Agrahayana", "Pausha", "Magha", "Phalguna"
];
const SAKA_SAMVAT_WEEK = ["Ravivāra", "Somavāra", "Maṅgalavāra", "Budhavāra", "Bṛhaspativāra", "Śukravāra", "Śanivāra"];
const SAKA_SAMVAT_DAYS = [30, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
const SAKA_SAMVAT_DAYS_LEAP = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];

function getSakaSamvatDate(currentDateTime) {
    function isLeapYear(dt) {
        const year = dt.getUTCFullYear();
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    // Find the start of today
    let startOfToday = createFauxUTCDate(currentDateTime, SAKA_SAMVAT_TZ);
    addDay(startOfToday, -1);

    // Find the start of the Saka year
    let newYearThisYear = createAdjustedDateTime({ timezone: SAKA_SAMVAT_TZ, year: currentDateTime.getUTCFullYear(), month: 3, day: 22 });
    if (isLeapYear(newYearThisYear)) {
        addDay(newYearThisYear, -1);
    }
    if (currentDateTime < newYearThisYear) {
        newYearThisYear = createAdjustedDateTime({ timezone: SAKA_SAMVAT_TZ, year: currentDateTime.getUTCFullYear() - 1, month: 3, day: 22 });
        if (isLeapYear(newYearThisYear)) {
            addDay(newYearThisYear, -1);
        }
    }

    const sakaSamvatDays = isLeapYear(newYearThisYear) ? SAKA_SAMVAT_DAYS_LEAP : SAKA_SAMVAT_DAYS;
    const sakaSamvatYear = newYearThisYear.getUTCFullYear() - 78;

    let daysSinceStartOfYear = Math.floor(differenceInDays(currentDateTime, newYearThisYear)) + 1;
    let monthIndex = 0;
    let remainingDays = daysSinceStartOfYear;
    while (remainingDays > sakaSamvatDays[monthIndex]) {
        remainingDays -= sakaSamvatDays[monthIndex];
        monthIndex++;
    }

    const month = SAKA_SAMVAT_MONTHS[monthIndex];
    const day = remainingDays;  

    // Get day of week (same as Gregorian, using IST-adjusted date)
    addDay(startOfToday, 1);
    const dayOfWeek = startOfToday.getUTCDay();
    const weekday = SAKA_SAMVAT_WEEK[dayOfWeek];

    const output = `${day} ${month} ${sakaSamvatYear}\n${weekday}`;
    return { output, day, month: monthIndex, year: sakaSamvatYear, dayOfWeek };
}

function getSocietyForCreativeAnachronismDate(currentDateTime, timezoneOffset) {
    let today = createFauxUTCDate(currentDateTime, timezoneOffset);
    const greg = getGregorianDateTime(today, 0);
    const SCAday = greg.day;
    const SCAmonth = monthNames[greg.month];
    const SCAweek = weekNames[greg.dayOfWeek];

    let yearSCA = greg.year - 1965;
    const thisYearMay1 = createAdjustedDateTime({currentDateTime: today, month: 5, day: 1});
    if (today < thisYearMay1) {
        yearSCA -= 1;
    }

    const output = `${SCAday} ${SCAmonth} A.S. ${toRomanNumerals(yearSCA)}\n${SCAweek}`;
    return { output, day: SCAday, month: greg.month, year: yearSCA, dayOfWeek: SCAweek };
}

// --- Mandaean ---
// Fixed 365-day year: twelve 30-day months, then five intercalary days (ࡐࡀࡅࡅࡀࡍࡀࡉࡉࡀ) after month 8, then months 9–12.
// Calendar days start at sunrise; regional offset matches Babylonian (UTC+03:00).
// Anchor: 18 July 2019 CE at sunrise = year 481343 AA, month 1 (ࡃࡀࡅࡋࡀ), day 1.
const MANDAEAN_TZ = 'UTC+03:00';
const MANDAEAN_ANCHOR_AA = 481343;
const MANDAEAN_MONTHS = [
    'ࡃࡀࡅࡋࡀ',
    'ࡍࡅࡍࡀ',
    'ࡏࡌࡁࡓࡀ',
    'ࡕࡀࡅࡓࡀ',
    'ࡑࡉࡋࡌࡉࡀ',
    'ࡎࡀࡓࡈࡀࡍࡀ',
    'ࡀࡓࡉࡀ',
    'ࡔࡅࡌࡁࡅࡋࡕࡀ',
    'ࡒࡀࡉࡍࡀ',
    'ࡀࡓࡒࡁࡀ',
    'ࡄࡉࡈࡉࡀ',
    'ࡂࡀࡃࡉࡀ'
];
const MANDAEAN_PARWANAYA = 'ࡐࡀࡅࡅࡀࡍࡀࡉࡉࡀ';
// Weekdays from Sunday (index 0), aligned with getWeekdayAtTime / getUTCDay.
const MANDAEAN_WEEK = [
    'Habšaba',
    'Trin Habšaba',
    'Tlata Habšaba',
    'Arba Habšaba',
    'Hamša Habšaba',
    'Yuma ḏ-Rahatia',
    'Yuma ḏ-Šafta'
];
// Four quarters of three 30-day months each (not tied to solar seasons). Parwanaya is grouped with giṭa (between months 8 and 9).
const MANDAEAN_SEASONS = ['sitwa', 'abhar', 'giṭa', 'paiz'];

// Anno Adam (AA) is divided into four 480,000-year spans (216k + 156k + 100k + 8k). Years after the 480,000th have no epoch label.
// The first two epochs are too early for the usual Library of Time timeline; names are documented here only:
//   Epoch of Adam and Hawa - First 216k years
//   Epoch of Ram and Rud - Next 156k years
// Epoch of Šurbai and Šarhabʿil - Next 100k years
// Epoch of Noah and Nuraita - Final 8k years
// (No label for AA years after the 480,000th year.)
const MANDAEAN_EPOCH_SURBAI = 'Epoch of Šurbai and Šarhabʿil';
const MANDAEAN_EPOCH_NOAH = 'Epoch of Noah and Nuraita';
const MANDAEAN_AA_EPOCH_END_ADAM = 216000;
const MANDAEAN_AA_EPOCH_END_RAM = 372000;
const MANDAEAN_AA_EPOCH_END_SURBAI = 472000;
const MANDAEAN_AA_EPOCH_END_NOAH = 480000;

function getMandaeanAaEpochName(aaYear) {
    if (aaYear <= MANDAEAN_AA_EPOCH_END_ADAM) {
        return 'Epoch of Adam and Hawa';
    }
    if (aaYear <= MANDAEAN_AA_EPOCH_END_RAM) {
        return 'Epoch of Ram and Rud';
    }
    if (aaYear <= MANDAEAN_AA_EPOCH_END_SURBAI) {
        return MANDAEAN_EPOCH_SURBAI;
    }
    if (aaYear <= MANDAEAN_AA_EPOCH_END_NOAH) {
        return MANDAEAN_EPOCH_NOAH;
    }
    return null;
}

function getMandaeanSeason(monthIndex, isParwanaya) {
    if (isParwanaya) {
        return MANDAEAN_SEASONS[2];
    }
    if (monthIndex <= 2) {
        return MANDAEAN_SEASONS[0];
    }
    if (monthIndex <= 5) {
        return MANDAEAN_SEASONS[1];
    }
    if (monthIndex <= 8) {
        return MANDAEAN_SEASONS[2];
    }
    return MANDAEAN_SEASONS[3];
}

function getMandaeanDate(currentDateTime, _timezoneOffset) {
    const epoch = createAdjustedDateTime({ timezone: MANDAEAN_TZ, year: 2019, month: 7, day: 18, hour: 'SUNRISE' });
    const daysSinceEpoch = Math.floor(differenceInDays(currentDateTime, epoch));
    const aaYear = MANDAEAN_ANCHOR_AA + Math.floor(daysSinceEpoch / 365);
    const dayOfYear = ((daysSinceEpoch % 365) + 365) % 365 + 1;
    const dayOfWeek = getWeekdayAtTime(currentDateTime, { hour: 'SUNRISE' }, MANDAEAN_TZ);
    const LRM = '\u200E';

    let day;
    let monthLabel;
    let monthIndex = null;
    const other = {};

    if (dayOfYear <= 240) {
        monthIndex = Math.floor((dayOfYear - 1) / 30);
        day = ((dayOfYear - 1) % 30) + 1;
        monthLabel = MANDAEAN_MONTHS[monthIndex];
    } else if (dayOfYear <= 245) {
        day = dayOfYear - 240;
        monthLabel = MANDAEAN_PARWANAYA;
        other.parwanaya = true;
    } else {
        const d2 = dayOfYear - 245;
        monthIndex = 8 + Math.floor((d2 - 1) / 30);
        day = ((d2 - 1) % 30) + 1;
        monthLabel = MANDAEAN_MONTHS[monthIndex];
    }

    const season = getMandaeanSeason(monthIndex, Boolean(other.parwanaya));
    other.season = season;

    const aaEpochName = getMandaeanAaEpochName(aaYear);
    other.aaEpoch = aaEpochName;

    const dateAndWeekAndSeason = `${LRM}${day} ${monthLabel} ${LRM}${aaYear} AA\n${MANDAEAN_WEEK[dayOfWeek]}\n${season}`;
    const output = aaEpochName == null ? dateAndWeekAndSeason : `${dateAndWeekAndSeason}\n${aaEpochName}`;
    return { output, day, month: monthIndex, year: aaYear, dayOfWeek, other };
}
