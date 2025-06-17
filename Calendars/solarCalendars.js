//|-------------------------|
//|     Solar Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Solar Calendars category.

import * as utilities from '../utilities.js';
import * as astronomicalData from '../Other/astronomicalData.js';

// Function to compute the Julian Day Number from a Gregorian date
export function gregorianToJDN(currentDateTime) {
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
export function JDNToJulianDate(JDN) {
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
export function getRealJulianDate(currentDateTime) {
    // Compute JDN from Gregorian date
    const JDN = gregorianToJDN(currentDateTime);

    // Convert JDN to Julian date
    const julianDate = JDNToJulianDate(JDN);

    // Return Julian date object
    return julianDate;
}

// Returns an unformatted Julian date object, useful for calculating many calendars
export function getApproxJulianDate(currentDateTime) {
    let year = currentDateTime.getUTCFullYear();
    let daysAhead = Math.trunc(year / 100) - Math.trunc(year / 400) - 2;
    let julianDate = new Date(currentDateTime);
    julianDate.setUTCDate(julianDate.getUTCDate() - daysAhead);
    return julianDate;
}

export function calculateGregorianJulianDifference(currentDateTime) {
    let gregJulDifference = 0;
    let julianDateParts = getRealJulianDate(currentDateTime);
    const totalSeconds = (julianDateParts.fractionalDay) * 24 * 60 * 60; // Total seconds in the fraction
    const hours = Math.floor(totalSeconds / 3600); // Get the whole hours
    const minutes = Math.floor((totalSeconds % 3600) / 60); // Remaining minutes
    const seconds = Math.floor(totalSeconds % 60); // Remaining seconds
    let julianDate = utilities.createDateWithFixedYear(julianDateParts.year, julianDateParts.month - 1, julianDateParts.day, hours, minutes, seconds);
    julianDate.setTime(julianDate.getTime() - 0.5 * 24 * 60 * 60 * 1000);
    gregJulDifference = utilities.differenceInDays(currentDateTime, julianDate);
    return gregJulDifference;
}

// Returns a formatted Astronomical calendar UTC date
export function getAstronomicalDate(currentDateTime) {
    const startOfGregorian = new Date(Date.UTC(1582, 9, 15));
    let astronomical = new Date(currentDateTime);
    let year = astronomical.getUTCFullYear();
    let day = astronomical.getUTCDate().toString();
    let month = astronomical.getUTCMonth();
    const dayOfWeek = currentDateTime.getUTCDay();

    if (currentDateTime<startOfGregorian) {
        const julianDate = getRealJulianDate(currentDateTime);
        year = julianDate.year;
        month = julianDate.month-1;
        day = julianDate.day;
    }

    return day + ' ' + utilities.monthNames[month] + ' ' + year + '\n' + utilities.weekNames[dayOfWeek];
}

// Returns a formatted Gregorian calendar local date and time
export function getGregorianDateTime(currentDateTime, timezoneOffset) {
    // Convert timezone offset from minutes to milliseconds
    const offsetMilliseconds = timezoneOffset * 60 * 1000;

    // Adjust the date with the offset
    const adjustedDate = new Date(currentDateTime.getTime() + offsetMilliseconds);
    let day = adjustedDate.getUTCDate().toString();
    let month = adjustedDate.getUTCMonth();
    let year = adjustedDate.getUTCFullYear();
    let hour = adjustedDate.getUTCHours().toString().padStart(2, '0');
    let minute = adjustedDate.getUTCMinutes().toString().padStart(2, '0');
    let second = adjustedDate.getUTCSeconds().toString().padStart(2, '0');
    const dayOfWeek = adjustedDate.getUTCDay();

    // Set year suffix based on the value of year
    let yearSuffix = 'CE';
    if (year < 1) {
        yearSuffix = 'BCE';
        year = Math.abs(year);  // Adjust year for BCE without negative sign
    }
    
    let dateDisplayString = day + ' ' + utilities.monthNames[month] + ' ' + year + ' ' + yearSuffix + '\n' + utilities.weekNames[dayOfWeek];
    let timeDisplayString = hour + ':' + minute + ':' + second;
    return {date: dateDisplayString, time: timeDisplayString};
}

// Returns a formatted Julian calendar UTC date
export function getJulianCalendar(currentDateTime) {
    const julianDate = getRealJulianDate(currentDateTime);
    const dayOfWeek = currentDateTime.getUTCDay();
    const { year, month, day } = julianDate;
    let yearSuffix = 'AD';
    let displayYear = year;
    if (year <= 0) {
        yearSuffix = 'BC';
        displayYear = -year + 1; // Convert to BC notation
    }
    return `${day} ${utilities.monthNames[month-1]} ${displayYear} ${yearSuffix}\n${utilities.weekNames[dayOfWeek]}`;
}

// Returns a formatted Minguo CST (Chinese Standard Time) date
export function getMinguo(currentDateTime) {
    let taiwanTime = new Date(currentDateTime);
    taiwanTime.setTime(taiwanTime.getTime()+(8*3600000));
    let day = taiwanTime.getUTCDate();
    let month = taiwanTime.getUTCMonth() + 1; // Month is zero-based, so add 1
    let year = taiwanTime.getUTCFullYear() - 1911;
    let dayOfWeek = taiwanTime.getUTCDay();
    const minguoWeek = ['天','一','二','三','四','五','六']
    
    return '民國 ' + year + '年 ' + month + '月 ' + day + '日\n星期' + minguoWeek[dayOfWeek];
}

// Returns a formatted Juche KST date
export function getJuche(currentDateTime) {
    let jucheTime = new Date(currentDateTime);
    jucheTime.setTime(jucheTime.getTime()+(9*3600000));
    let day = jucheTime.getUTCDate();
    let month = jucheTime.getUTCMonth() + 1; // Month is zero-based, so add 1
    let year = jucheTime.getUTCFullYear() - 1911;
    let dayOfWeek = jucheTime.getUTCDay();
    const jucheWeek = ['일', '월', '화', '수', '목', '금', '토'];
    
    // Add leading zeros if necessary
    let monthString = (month < 10) ? '0' + month : month;
    return 'Juche ' + year + '.' + monthString + '.' + day + '\n' + jucheWeek[dayOfWeek] + '요일';
}

// Returns a formatted Thai Solar THB date
export function getThaiSolar(currentDateTime) {

    const thaiSolarMonths = [
        "มกราคม","กุมภาพันธ์","มีนาคม","เมษายน",
        "พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม",
        "กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"
    ];

    const thaiSolarWeek = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

    let thaiTime = new Date(currentDateTime);
    thaiTime.setTime(thaiTime.getTime()+(7*3600000));
    let day = thaiTime.getUTCDate();
    let month = thaiTime.getUTCMonth();
    let year = thaiTime.getUTCFullYear() + 543;
    let dayOfWeek = thaiTime.getUTCDay();
    return day + ' ' + thaiSolarMonths[month] + ' B.E. ' + year + '\n' + thaiSolarWeek[dayOfWeek];
}

// Returns a formatted French Republican CET date
export function getRepublicanCalendar(currentDateTime, vernalEquinox) {

    const FrenchRevolutionaryMonths = {
        1:'Vendémiaire', 2:'Brumaire', 3:'Frimaire', 4:'Nivôse',
        5:'Pluviôse', 6:'Ventôse', 7:'Germinal', 8:'Floréal',
        9:'Prairial', 10:'Messidor', 11:'Thermidor',
        12:'Fructidor', 13:'Sansculottides'
    };

    const frenchWeek = ['Primidi', 'Duodi', 'Tridi', 'Quartidi', 'Quintidi', 'Sextidi', 'Septidi', 'Octidi', 'Nonidi', 'Décadi'];
    const SansculottidesWeek = ['La Fête de la Vertu','La Fête du Génie','La Fête du Travail',
        'La Fête de l\'Opinion','La Fête des Récompenses','La Fête de la Révolution'
    ];

    // Get starting and ending equinoxes, Paris Time (CET)
    let startingEquinox = new Date(vernalEquinox);
    startingEquinox.setUTCHours(1);
    startingEquinox.setUTCMinutes(0);
    startingEquinox.setUTCSeconds(0);
    startingEquinox.setUTCMilliseconds(0);
    if (currentDateTime < startingEquinox) {
        let lastYear = new Date(currentDateTime);
        lastYear.setUTCFullYear(currentDateTime.getUTCFullYear()-1);
        lastYear.setUTCMonth(10);
        startingEquinox = astronomicalData.getSolsticeOrEquinox(lastYear, 'autumn');
        startingEquinox.setUTCHours(1);
        startingEquinox.setUTCMinutes(0);
        startingEquinox.setUTCSeconds(0);
        startingEquinox.setUTCMilliseconds(0);
    }

    // Get start of year, Paris Time (CET)
    let startOfRepublicanYear = new Date(startingEquinox);

    // Calculate the number of years since 1792
    let yearsSince1792 = startOfRepublicanYear.getUTCFullYear() - 1791;

    // Find days in current year
    let daysSinceSeptember22 = Math.floor(utilities.differenceInDays(currentDateTime, startOfRepublicanYear));
    
    let month = Math.floor(daysSinceSeptember22 / 30) + 1;
    if (month > 13) {
        month = 0;
    }

    // Increment up by 1 to account for no 0 day
    let day = Math.floor(daysSinceSeptember22 % 30)+1;

    // Calculate day of week
    let weekString = frenchWeek[(day-1)%10];
    weekString += ' Décade ' + (Math.floor((day-1)/10)+1);
    if (month===13) {
        weekString = SansculottidesWeek[day-1];
    }

    return day + " " + FrenchRevolutionaryMonths[month] + " " + utilities.toRomanNumerals(yearsSince1792) + ' RE\n' + weekString;
}

// Returns a formatted EF CET date
export function getEraFascista(currentDateTime) {
    // Only update the year if past October 29th, otherwise it is the previous year.
    let october29 = utilities.createDateWithFixedYear(currentDateTime.getUTCFullYear(), 9, 28, 23);
    if (currentDateTime < october29) {
        october29.setUTCFullYear(october29.getUTCFullYear() - 1);
    }
    let yearsSince1922 = october29.getUTCFullYear() - 1921;
    return `Anno ${utilities.toRomanNumerals(yearsSince1922)}`;
}

// Returns a formatted Coptic UTC date based on the Julian Day (not Julian date)
export function getCopticDate(currentDateTime) {

    const copticMonths = [
        "Thout", "Paopi", "Hathor", "Koiak", "Tobi", "Meshir",
        "Paremhat", "Parmouti", "Pashons", "Paoni", "Epip", "Mesori", "Pi Kogi Enavot"
    ];

    const copticWeek = [
        "ⲁⲕⲃⲟⲩⲗ",   // Sunday
        "ⲥⲟⲙ",      // Monday
        "ⲅⲃⲁⲣ",     // Tuesday
        "ⲅⲟⲡ",      // Wednesday
        "ⲃⲁⲣⲙⲁⲕ",   // Thursday
        "ⲃⲉⲕⲃⲁⲧ",   // Friday
        "ⲁⲧⲟⲃⲁⲣ"    // Saturday
    ];

    // Number of days in each Coptic month
    let Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];

    // Fix months if Julian leap year
    let currentJulianYear = getApproxJulianDate(currentDateTime).getFullYear();
    if (currentJulianYear % 4 === 3) {
        Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 6];
    }

    // Calculate days and years from epoch
    const ThoutYear1 = new Date(Date.UTC(283, 7, 28, 22, 0, 0));
    const daysSinceEpoch = Math.floor(utilities.differenceInDays(currentDateTime, ThoutYear1));
    const yearsSinceEpoch = Math.floor((4 * daysSinceEpoch + 3) / 1461);
    let CopticYear = yearsSinceEpoch;
    
    // Get the weekday based on midnight in Egypt
    const dayOfWeek = utilities.getWeekdayAtTime(currentDateTime, { hour: 22, minute: 0 });

    let remainingDays = daysSinceEpoch - Math.floor((365 * yearsSinceEpoch + Math.floor(yearsSinceEpoch / 4)));
    if (remainingDays <= 0) {
        CopticYear -= 1;
        remainingDays += 365 + (CopticYear % 4 === 3 ? 1 : 0); // Adjust for leap year
    }
    let CopticMonth = 0;
    while (remainingDays > Coptic_monthDays[CopticMonth]) {
        remainingDays -= Coptic_monthDays[CopticMonth];
        CopticMonth++;
    }

    if ((remainingDays<=0)) {
        CopticMonth--;
        if (CopticMonth<0) {
            CopticMonth += 13;
        }
        remainingDays = Coptic_monthDays[CopticMonth];
    }

    return remainingDays + ' ' + copticMonths[CopticMonth] + ' ' + CopticYear + ' AM\n' + copticWeek[dayOfWeek];
}

// Returns a formatted Ethiopian EET date
export function getEthiopianDate(currentDateTime) {

    const ethiopianMonths = [
        "Mäskäräm","Ṭəqəmt","Ḫədar","Taḫśaś","Ṭərr","Yäkatit","Mägabit",
        "Miyazya","Gənbo","Säne","Ḥamle","Nähase","Ṗagume"
    ];

    const ethiopianWeek = [
        "ሰንበት", // Sunday (Ge'ez)
        "ሰኑይ",   // Monday (Ge'ez)
        "ሠሉስ",   // Tuesday (Ge'ez)
        "ረቡዕ",   // Wednesday (Ge'ez)
        "ሓሙስ",   // Thursday (Ge'ez)
        "ዓርብ",   // Friday (Ge'ez)
        "ቀዳሚት"  // Saturday (Ge'ez)
    ];

    // Number of days in each Coptic month
    let Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];

    // Fix months if Julian leap year
    let currentJulianYear = getApproxJulianDate(currentDateTime).getFullYear();
    if (currentJulianYear % 4 === 3) {
        Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 6];
    }

    // Calculate days and years from epoch
    let ThoutYear1 = utilities.createDateWithFixedYear(7, 7, 26, 21, 0, 0);
    const daysSinceEpoch = Math.floor(utilities.differenceInDays(currentDateTime, ThoutYear1));
    const yearsSinceEpoch = Math.floor((4 * daysSinceEpoch + 3) / 1461);
    let EthiopianYear = yearsSinceEpoch;
    
    // Get the weekday based on midnight in Ethiopia
    const dayOfWeek = utilities.getWeekdayAtTime(currentDateTime, { hour: 21, minute: 0 });

    let remainingDays = daysSinceEpoch - Math.floor((365 * yearsSinceEpoch + Math.floor(yearsSinceEpoch / 4)));
    if (remainingDays <= 0) {
        EthiopianYear -= 1;
        remainingDays += 365 + (EthiopianYear % 4 === 3 ? 1 : 0); // Adjust for leap year
    }
    let EthiopianMonth = 0;
    while (remainingDays > Coptic_monthDays[EthiopianMonth]) {
        remainingDays -= Coptic_monthDays[EthiopianMonth];
        EthiopianMonth++;
    }

    if ((remainingDays<=0)) {
        EthiopianMonth--;
        if (EthiopianMonth<0) {
            EthiopianMonth += 13;
        }
        remainingDays = Coptic_monthDays[EthiopianMonth];
    }

    return remainingDays + ' ' + ethiopianMonths[EthiopianMonth] + ' ዓ.ም.' + EthiopianYear + '\n' + ethiopianWeek[dayOfWeek];
}

// Returns a formatted Byzantine TRT date
export function getByzantineCalendar(currentDateTime) {
    const adjustedDateTime = new Date(currentDateTime);

    // Check if time is before 21:00:00 (9 PM)
    if (adjustedDateTime.getUTCHours() < 21) {
        // Subtract one day
        adjustedDateTime.setUTCDate(adjustedDateTime.getUTCDate() - 1);
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
    const dayOfWeek = utilities.getWeekdayAtTime(currentDateTime, { hour: 21, minute: 0 });
    
    const monthString = utilities.monthNames[julianDate.month - 1]; // Adjust for 0-based index
    const dayString = julianDate.day;

    let dateString = `${dayString} ${monthString} ${byzantineYear} AM\n${utilities.weekNames[dayOfWeek]}`;
    return dateString;
}

// Returns a formatted Florentine (CET) date
export function getFlorentineCalendar(currentDateTime) {
    const adjustedDate = new Date(currentDateTime);

    // Check for approximate sunset and increment the day
    const utcHour = currentDateTime.getUTCHours();
    if (currentDateTime.getUTCHours() >= 17) {
        adjustedDate.setUTCDate(adjustedDate.getUTCDate() + 1);
    }

    // Recompute JDN for the adjusted date
    const adjustedJDN = gregorianToJDN(adjustedDate);
    const adjustedJulian = JDNToJulianDate(adjustedJDN);

    // Determine Florentine year (starts on March 25 in Julian calendar)
    let florentineYear = adjustedJulian.year;
    if (
        adjustedJulian.month < 3 ||
        (adjustedJulian.month === 3 && adjustedJulian.day < 25)
    ) {
        // Before March 25, subtract one year
        florentineYear -= 1;
    }

    // Prepare date components for display
    const dayOfWeek    = adjustedDate.getUTCDay();   // 0 = Sunday … 6 = Saturday
    const monthString  = utilities.monthNames[adjustedJulian.month - 1];
    const dayString    = adjustedJulian.day;
    let   displayYear  = florentineYear;
    let   yearSuffix   = 'AD';
    if (florentineYear <= 0) {
        displayYear = -florentineYear + 1;
        yearSuffix  = 'BC';
    }

    let dateString = `${dayString} ${monthString} ${displayYear} ${yearSuffix}\n${utilities.weekNames[dayOfWeek]}`;
    return dateString;
}

// Returns a formatted Pisan (CET) date
export function getPisanCalendar(currentDateTime) {
    const adjustedDate = new Date(currentDateTime);

    // Check for approximate sunset and increment the day
    const utcHour = currentDateTime.getUTCHours();
    if (currentDateTime.getUTCHours() >= 23) {
        adjustedDate.setUTCDate(adjustedDate.getUTCDate() + 1);
    }

    // Recompute JDN for the adjusted date
    const adjustedJDN = gregorianToJDN(adjustedDate);
    const adjustedJulian = JDNToJulianDate(adjustedJDN);

    // Determine Pisan year (starts on March 25 in Julian calendar)
    let pisanYear = adjustedJulian.year +1;
    if (
        adjustedJulian.month < 3 ||
        (adjustedJulian.month === 3 && adjustedJulian.day < 25)
    ) {
        // Before March 25, subtract one year
        pisanYear -= 1;
    }

    // Prepare date components for display
    // Prepare date components for display
    const dayOfWeek    = adjustedDate.getUTCDay();   // 0 = Sunday … 6 = Saturday
    const monthString  = utilities.monthNames[adjustedJulian.month - 1];
    const dayString    = adjustedJulian.day;
    let   displayYear  = pisanYear;
    let   yearSuffix   = 'AD';
    if (pisanYear <= 0) {
        displayYear = -pisanYear + 1;
        yearSuffix  = 'BC';
    }

    let dateString = `${dayString} ${monthString} ${displayYear} ${yearSuffix}\n${utilities.weekNames[dayOfWeek]}`;
    return dateString;
}

// Returns a formatted Venetian (CET) date
export function getVenetianCalendar(currentDateTime) {

    // Adjust for timezone
    let venetianDay = new Date(currentDateTime);
    venetianDay.setTime(venetianDay.getTime() + 3600000);

    // Recompute JDN for the adjusted date
    const adjustedJDN = gregorianToJDN(venetianDay);
    const adjustedJulianDate = JDNToJulianDate(adjustedJDN);

    // Determine Venetian year (starts on March 25 in Julian calendar)
    let venetianYear = adjustedJulianDate.year;
    if (adjustedJulianDate.month < 3) {
        // Before March 1, subtract one year
        venetianYear -= 1;
    }

    // Prepare date components for display
    const dayOfWeek = venetianDay.getUTCDay();
    const monthString = utilities.monthNames[adjustedJulianDate.month - 1]; // Adjust for 0-based index
    const dayString = adjustedJulianDate.day;

    let yearSuffix = 'AD';
    let displayYear = venetianYear;
    if (venetianYear <= 0) {
        yearSuffix = 'BC';
        displayYear = -venetianYear + 1; // Adjust for BC notation
    }

    let dateString = `${dayString} ${monthString} ${displayYear} ${yearSuffix}\n${utilities.weekNames[dayOfWeek]}`;
    return dateString;
}

// Returns a formatted Baha'i IRST date
export function getBahaiCalendar(currentDateTime, vernalEquinox) {

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

    // Calculate if the New Year should start later or earlier based on sunset in Tehran (UTC+3:30)
    function figureOutEquinoxBeforeAfterSunset(equinox) {
        let equinoxDaySunset = new Date(equinox);
        equinoxDaySunset.setUTCHours(14);
        equinoxDaySunset.setUTCMinutes(30);
        equinoxDaySunset.setUTCSeconds(0);
        equinoxDaySunset.setUTCMilliseconds(0);
        if (equinox < equinoxDaySunset) {
            equinox.setUTCDate(equinox.getUTCDate()-1);
        }
        equinox.setUTCHours(14);
        equinox.setUTCMinutes(30);
        equinox.setUTCSeconds(0);
        equinox.setUTCMilliseconds(0);
        return equinox;
    }

    // Figure out if the beginning of Bahai year was last Gregorian year or this year based on equinox
    let startingEquinox = '';
    let endingEquinox = '';
    if (currentDateTime < vernalEquinox) {
        let lastYear = new Date(currentDateTime);
        lastYear.setUTCFullYear(currentDateTime.getUTCFullYear()-1);
        lastYear.setUTCMonth(10);
        startingEquinox = astronomicalData.getSolsticeOrEquinox(lastYear, 'spring');
        endingEquinox = new Date(vernalEquinox);
    } else {
        let nextYear = new Date(currentDateTime);
        nextYear.setUTCFullYear(currentDateTime.getUTCFullYear()+1);
        nextYear.setUTCMonth(10);
        startingEquinox = new Date(vernalEquinox);
        endingEquinox = astronomicalData.getSolsticeOrEquinox(nextYear, 'spring');
    }

    // Calculate if the New Year should start later or earlier based on sunset in Tehran (UTC+3:30)
    startingEquinox = figureOutEquinoxBeforeAfterSunset(startingEquinox);
    endingEquinox = figureOutEquinoxBeforeAfterSunset(endingEquinox);

    // Calculate when today started based on sunset in Tehran (UTC+3:30)
    let currentDayOfYear = Math.trunc(utilities.differenceInDays(currentDateTime, startingEquinox))+1;
    let todaySunsetInTehran = new Date(currentDateTime);
    todaySunsetInTehran.setUTCHours(12);
    todaySunsetInTehran.setUTCMinutes(30);
    todaySunsetInTehran.setUTCSeconds(0);
    todaySunsetInTehran.setUTCMilliseconds(0);
    
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
            let firstDayOfFinalMonth = new Date(endingEquinox);
            firstDayOfFinalMonth.setUTCDate(endingEquinox.getUTCDate() - 19);

            // If before that time, then it's the intercalary 4 or 5 days
            if (currentDateTime < firstDayOfFinalMonth) {
                currentDayOfYear -= 19;
                monthIndex=18;

            // It's after the start of the month
            } else {
                // Get new current day of year by working from the final month
                currentDayOfYear = Math.trunc(utilities.differenceInDays(currentDateTime, firstDayOfFinalMonth))+1;
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
    const dayOfWeek = utilities.getWeekdayAtTime(currentDateTime, { hour: 14, minute: 30 });

    return currentDayOfYear + ' ' + bahaiMonths[monthIndex] + ' ' + year + ' BE\n' + bahaiWeek[dayOfWeek];
}

// Returns a formatted Pataphysical local date
export function getPataphysicalDate(currentDateTime, timezoneOffset) {

    const pataphysicalMonths = [
        "Absolu","Haha","As","Sable","Décervelage","Gueules","Pédale",
        "Clinamen","Palotin","Merdre","Gidouille","Tatane","Phalle"
    ];

    const pataphysicalWeek = [
        "Dimanche", // Sunday
        "Lundi",    // Monday
        "Mardi",    // Tuesday
        "Mercredi", // Wednesday
        "Jeudi",    // Thursday
        "Vendredi", // Friday
        "Samedi"    // Saturday
    ];

    // Clear timezone offset from original datetime
    let localTime = new Date(currentDateTime.getTime() + (timezoneOffset * 60000));

    // September 8 at midnight
    let localYear = currentDateTime.getUTCFullYear();
    let mostRecentSept8 = utilities.createDateWithFixedYear(localYear, 8, 8);

    if (localTime < mostRecentSept8) {
        mostRecentSept8.setUTCFullYear(localTime.getUTCFullYear()-1);
    }

    // Get days since last September, add 1 because days are 0 based
    let remainingDays = Math.floor(utilities.differenceInDays(localTime, mostRecentSept8));
    
    // Last mont doesn't really have 30 days, but it's necessary
    let daysOfMonths = [28,28,28,28,28,28,28,28,28,28,29,28,29];
    let nextSept8 = new Date(mostRecentSept8);
    nextSept8.setUTCFullYear(mostRecentSept8.getUTCFullYear()+1);
    const daysInYear = utilities.differenceInDays(nextSept8, mostRecentSept8);

    if (daysInYear===366) {
        daysOfMonths = [28,28,28,28,28,29,28,28,28,28,29,28,28];
    }

    // Iterate through days of months and subtract from remaining days
    let monthIndex = 0;
    for (; monthIndex < daysOfMonths.length; monthIndex++) {
        if (remainingDays < daysOfMonths[monthIndex]) {
            break;
        }
        remainingDays -= daysOfMonths[monthIndex];
    }

    const day = remainingDays+1;
    const month = pataphysicalMonths[monthIndex];
    let year = mostRecentSept8.getUTCFullYear()-1872; // Get epoch
    const dayOfWeek = localTime.getUTCDay();

    return day + ' ' + month + ' ' + year + ' A.P.\n' + pataphysicalWeek[dayOfWeek];
}

// Returns a formatted Discordian local date
export function getDiscordianDate(currentDateTime, timezoneOffset) {

    const discordianMonths = [
        "Chaos",
        "Discord",
        "Confusion",
        "Bureaucracy",
        "The Aftermath"
    ];

    const discordianWeek = [
        "Sweetmorn",
        "Boomtime",
        "Pungenday",
        "Prickle-Prickle",
        "Setting Orange"
    ];

    // Clear timezone offset from original datetime
    let localTime = new Date(currentDateTime.getTime() + (timezoneOffset * 60000));

    const startOfYear = utilities.createDateWithFixedYear(localTime.getUTCFullYear(), 0, 1);
    const endOfYear = utilities.createDateWithFixedYear(localTime.getUTCFullYear()+1, 0, 1);
    let remainingDays = Math.floor(utilities.differenceInDays(localTime, startOfYear)+1);
    const leapYear = utilities.differenceInDays(endOfYear, startOfYear) === 366;

    let dayMonthString = '';

    if ((leapYear)&&(remainingDays>=60)) {
        if (remainingDays===60) {
            dayMonthString = `St. Tib's Day`;
        }
        remainingDays--;
    }

    const daysPerMonth = 73;
    let month = Math.floor(remainingDays / daysPerMonth);
    let day = Math.floor(remainingDays % daysPerMonth);
    let year = localTime.getUTCFullYear() + 1166;
    const dayOfWeek = remainingDays % 5;

    if (dayMonthString==='') {
        dayMonthString = day + ' ' + discordianMonths[month];
    }


    return dayMonthString + ' ' + year + ' YOLD\n' + discordianWeek[dayOfWeek];
}

// Returns a formatted Solar Hijri IRST date
export function getSolarHijriDate(currentDateTime, vernalEquinox_) {

    // Solar Hijri month and week names
    const solarHijriMonths = [
        "Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar",
        "Mehr", "Aban", "Azar", "Dey", "Bahman", "Esfand"
    ];

    const solarHijriWeek = [
        "Shanbeh", "Yekshanbeh", "Doshanbeh", "Seshanbeh", "Chaharshanbeh",
        "Panjshanbeh", "Jomeh"
    ];

    let vernalEquinox = figureOutEquinoxBeforeAfterNoon(vernalEquinox_);

    // Calculate if the New Year should start later or earlier based on noon in Tehran (UTC+3:30)
    function figureOutEquinoxBeforeAfterNoon(equinox) {
        let equinoxDayNoon = new Date(equinox);
        equinoxDayNoon.setUTCHours(8);
        equinoxDayNoon.setUTCMinutes(30);
        equinoxDayNoon.setUTCSeconds(0);
        equinoxDayNoon.setUTCMilliseconds(0);
        if (equinox < equinoxDayNoon) {
            equinox.setUTCDate(equinox.getUTCDate() - 1);
        }
        equinox.setUTCHours(20);
        equinox.setUTCMinutes(30);
        equinox.setUTCSeconds(0);
        equinox.setUTCMilliseconds(0);
        return equinox;
    }

    // Determine the starting and ending equinoxes
    let startingEquinox, endingEquinox;
    if (currentDateTime < vernalEquinox) {
        let lastYear = new Date(currentDateTime);
        lastYear.setUTCFullYear(currentDateTime.getUTCFullYear() - 1);
        lastYear.setUTCMonth(10);
        startingEquinox = astronomicalData.getSolsticeOrEquinox(lastYear, 'spring');
        startingEquinox = figureOutEquinoxBeforeAfterNoon(startingEquinox);
        endingEquinox = vernalEquinox;
    } else {
        let nextYear = new Date(currentDateTime);
        nextYear.setUTCFullYear(currentDateTime.getUTCFullYear() + 1);
        nextYear.setUTCMonth(10);
        startingEquinox = vernalEquinox;
        endingEquinox = astronomicalData.getSolsticeOrEquinox(nextYear, 'spring');
        endingEquinox = figureOutEquinoxBeforeAfterNoon(endingEquinox);
    }
    
    const leapYear = utilities.differenceInDays(endingEquinox, startingEquinox) === 366;
    let remainingDays = Math.floor(utilities.differenceInDays(currentDateTime, startingEquinox));

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
    
    const month = solarHijriMonths[monthIndex];
    let year = startingEquinox.getUTCFullYear() - 621;

    // Adjust for dates before epoch
    if (year <= 0) {
        year -= 1; // Correct 0 year to -1
    }

    // Determine weekday based on midnight in Tehran (20:30 UTC)
    const dayOfWeek = utilities.getWeekdayAtTime(currentDateTime, { hour: 20, minute: 30 });

    return day + ' ' + month + ' ' + year + ' SH\n' + solarHijriWeek[dayOfWeek];
}

// Returns a formatted Qadimi IRST date
export function getQadimiDate(currentDateTime) {

    // Qadimi calendar months 
    let qadimiMonths = [
        'Farvardin','Ardibehesht','Khordad','Tir','Amardad','Shehrevar',
        'Mehr','Aban','Azar','Dae','Bahman','Asfand','Gatha'
    ];


    // Names of Qadimi days
    const qadimiDays = [
        "Hormazd","Bahman","Ardibehesht","Shehrevar","Aspandard","Khordad","Amardad","Dae-Pa-Adar","Adar","Avan",
        "Khorshed","Mohor","Tir","Gosh","Dae-Pa-Meher","Meher","Srosh","Rashne","Fravardin","Behram",
        "Ram","Govad","Dae-Pa-Din","Din","Ashishvangh","Ashtad","Asman","Zamyad","Mareshpand","Aneran"
    ];


    // The names of the days that happen at the end of the year
    const gathaDays = [
        "Ahunavaiti","Ushtavaiti","Spentamainyu","Vohuxshathra","Vahishtoishti"
    ];

    // Names of Qadimi days of the week (calibrated to -1)
    const qadimiWeek = [
        "Jomeh",        // Saturday
        "Shanbeh",      // Sunday
        "Yekshanbeh",   // Monday
        "Doshanbeh",    // Tuesday
        "Seshanbeh",    // Wednesday
        "Chaharshanbeh",// Thursday
        "Panjshanbeh",  // Friday
    ];

    // Noon in Iran in 19 June 632, a base Nowruz day
    let Nowruz632Noon = new Date(Date.UTC(632, 5, 19, 2, 30, 0));
    Nowruz632Noon.setUTCFullYear(632);
    const daysSince632 = Math.floor(utilities.differenceInDays(currentDateTime, Nowruz632Noon));
    const yearsSince632 = Math.floor(daysSince632/365);
    let remainingDays = daysSince632 - (yearsSince632*365)+1;

    // Step through months
    let monthIndex = 0;
    while (remainingDays > 30) {
        monthIndex++;
        remainingDays -= 30;
    }

    let day = qadimiDays[remainingDays-1];
    let month = qadimiMonths[monthIndex];
    const year = yearsSince632 +1;

    // Determine weekday based on sunrise in Tehran (2:30 UTC)
    const dayOfWeek = utilities.getWeekdayAtTime(currentDateTime, { hour: 2, minute: 30 });

    // If Gatha days, use Gatha day names
    if ((monthIndex>11)&&(remainingDays<6)) {
        day = gathaDays[remainingDays-1];
        return day + ' ' + year + ' Y.Z.\n' + qadimiWeek[dayOfWeek];
    }

  return day + ' ' + month + ' ' + year + ' Y.Z.\n' + qadimiWeek[dayOfWeek];
}

// Returns a formatted Egyptian Civil local date
export function getEgyptianDate(currentDateTime) {

    const EgyptianSeasons = ["Akhet", "Peret", "Shemu", "Heriu Renpet"];
    const EgyptianIntercalaryDays = ["Osiris", "Horus the Elder", "Set", "Isis", "Nephthys"];
    const EgyptianMonthNumbers = ["I", "II", "III", "IV"];

    // Unused
    const EgyptianMonths = [
        "Tekh","Menhet","Hwt-Hrw","Ka-Hr-Ka","Sf-Bdt","Rekh Wer",
        "Rekh Neds","Renwet","Hnsw","Hnt-Htj","Ipt-Hmt","Wep-Renpet"
    ];

    const startOfAkhet2781 = new Date(Date.UTC(-2781, 5, 26, 22, 0, 0));
    const daysSincestartOfAkhet2781 = Math.floor(utilities.differenceInDays(currentDateTime, startOfAkhet2781));
    const yearsSinceStartOfAkhet2781 = Math.floor(daysSincestartOfAkhet2781/365);
    const currentDayOfYear = ((daysSincestartOfAkhet2781 % 365) + 365) % 365 + 1;

    let currentSeason = '';
    if (currentDayOfYear<121) {
        currentSeason = EgyptianSeasons[0];
    } else if (currentDayOfYear<241) {
        currentSeason = EgyptianSeasons[1];
    } else if (currentDayOfYear<361) {
        currentSeason = EgyptianSeasons[2];
    } else {
        currentSeason = EgyptianSeasons[3];
    }

    const dayOfSeason = currentDayOfYear%120;
    let currentMonthNumber = Math.floor(dayOfSeason/30);
    const dayOfMonth = dayOfSeason%30;

    let monthAndDayText = EgyptianMonthNumbers[currentMonthNumber] + ' ' + currentSeason + ' ' + dayOfMonth;

    if (currentSeason=="Heriu Renpet") {
        monthAndDayText = EgyptianIntercalaryDays[dayOfMonth-1];
    }
    

    return monthAndDayText + ' (' + yearsSinceStartOfAkhet2781 + ')';
}

export function getISOWeekDate(currentDateTime, timezoneOffset) {
    // Adjust for timezone
    let localTime = new Date(currentDateTime.getTime() + timezoneOffset * 60000);

    // ISO weekday: 1 (Mon) to 7 (Sun)
    const isoDay = localTime.getUTCDay() === 0 ? 7 : localTime.getUTCDay(); // 0 => 7 (Sunday)
    
    // Move date to the Thursday in the current ISO week
    const thursday = new Date(localTime);
    thursday.setUTCDate(localTime.getUTCDate() + (4 - isoDay));

    const weekYear = thursday.getUTCFullYear();

    // Find the first Thursday of the year
    let firstThursday = utilities.createDateWithFixedYear(weekYear, 0, 4);
    const firstIsoDay = firstThursday.getUTCDay() === 0 ? 7 : firstThursday.getUTCDay();
    firstThursday.setUTCDate(firstThursday.getUTCDate() + (4 - firstIsoDay));

    // Calculate week number
    const diff = thursday - firstThursday;
    const weekNumber = Math.round(diff / (7 * 86400000)) + 1;

    return `${weekYear}-W${weekNumber}-${isoDay}`;
}


export function getHaabDate(localTime) {

    const haabMonths = [
        "Pop", "Wo'", "Sip", "Sotz'", "Sek", "Xul",
        "Yaxk'in'", "Mol", "Ch'en", "Yax", "Sak'",
        "Keh", "Mak", "K'ank'in'", "Muwan", "Pax",
        "K'ayab'", "Kumk'u", "Wayeb'"
    ];

    const mayaLongCount0 = new Date(Date.UTC(-3113, 7, 11, 6, 0, 0));
    const totalDays = Math.floor(utilities.differenceInDays(localTime, mayaLongCount0));
    
    const startingHaabDay = 8;
    const startingHaabMonthIndex = haabMonths.indexOf("Kumk'u");

    const daysInYear = 365;
    const adjustedDays = (totalDays % daysInYear + daysInYear) % daysInYear;
    const totalHaabDays = (startingHaabMonthIndex * 20 + startingHaabDay + adjustedDays) % daysInYear;
    const haabMonthIndex = Math.floor(totalHaabDays / 20);
    const haabDay = totalHaabDays % 20;
    
    return `${haabDay} ${haabMonths[haabMonthIndex]}`;
};