//|-------------------------|
//|     Solar Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Solar Calendars category.


// Returns an unformatted Julian date object, useful for calculating many calendars
function getJulianDate(currentDateTime) {
    let year = currentDateTime.getFullYear();
    let daysAhead = Math.trunc(year / 100) - Math.trunc(year / 400) - 2;
    let julianDate = new Date(currentDateTime);
    julianDate.setDate(julianDate.getDate() - daysAhead);
    return julianDate;
}

function getAstronomicalDate(currentDateTime) {
    const startOfGregorian = new Date(1582, 9, 15);
    let astronomical = new Date(currentDateTime);
    let year = astronomical.getFullYear();

    let yearSuffix = 'CE';
    if (year < 1) {
        yearSuffix = 'BCE';
    }

    if (currentDateTime<startOfGregorian) {
        astronomical = getJulianDate(currentDateTime);
        year = astronomical.getFullYear();
        yearSuffix = 'AD';
        if (year < 1) {
            yearSuffix = 'BC';
        }
    }
    let day = astronomical.getDate().toString();
    let month = astronomical.getMonth();

    return day + ' ' + monthNames[month] + ' ' + year + ' ' + yearSuffix;
}

// Converts a number to Roman numerals
function toRomanNumerals(num) {
    if (num === 0) {
        return 'O';
    }
    if (num < 0) {
        return '-' + toRomanNumerals(-num);
    }

    const romanNumerals = [
        { value: 1000, symbol: 'M' },
        { value: 900, symbol: 'CM' },
        { value: 500, symbol: 'D' },
        { value: 400, symbol: 'CD' },
        { value: 100, symbol: 'C' },
        { value: 90, symbol: 'XC' },
        { value: 50, symbol: 'L' },
        { value: 40, symbol: 'XL' },
        { value: 10, symbol: 'X' },
        { value: 9, symbol: 'IX' },
        { value: 5, symbol: 'V' },
        { value: 4, symbol: 'IV' },
        { value: 1, symbol: 'I' }
    ];

    let result = '';
    for (let i = 0; i < romanNumerals.length; i++) {
        while (num >= romanNumerals[i].value) {
            result += romanNumerals[i].symbol;
            num -= romanNumerals[i].value;
        }
    }
    return result;
}

// Returns a formatted Gregorian calendar local date and time
function getGregorianDateTime(currentDateTime) {
    let day = currentDateTime.getDate().toString();
    let month = currentDateTime.getMonth();
    let year = currentDateTime.getFullYear();
    let hour = currentDateTime.getHours().toString().padStart(2, '0');
    let minute = currentDateTime.getMinutes().toString().padStart(2, '0');
    let second = currentDateTime.getSeconds().toString().padStart(2, '0');
    const dayOfWeek = currentDateTime.getDay();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let yearSuffix = 'CE';
    if (year<1) {
        yearSuffix = 'BCE';
    }
    let dateDisplayString = day + ' ' + monthNames[month] + ' ' + year + ' ' + yearSuffix;
    let timeDisplayString = dayNames[dayOfWeek] + ' ' + hour + ':' + minute + ':' + second;
    return {date: dateDisplayString, time: timeDisplayString};
}

// Returns a formatted Julian calendar local date
function getJulianCalendar(currentDateTime, calendarType) {
    const julianDate = getJulianDate(currentDateTime);
    // Extract year, month, and day components
    let yearString = julianDate.getFullYear();
    let monthIndex = julianDate.getMonth(); // Month is zero-based
    let monthString = monthNames[monthIndex];
    let dayString = julianDate.getDate();

    let yearSuffix = 'AD';
    if (yearString<1) {
        yearSuffix = 'BC';
        yearString--;
    }
    
    let dateString = dayString + ' ' + monthString + ' ' + yearString + ' ' + yearSuffix;
    return dateString;
}

// Returns a formatted Minguo local date
function getMinguo(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth() + 1; // Month is zero-based, so add 1
    let year = currentDateTime.getFullYear() - 1911;
    
    return '民國 ' + year + '年 ' + month + '月 ' + day + '日';
}

// Returns a formatted Juche local date
function getJuche(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth() + 1; // Month is zero-based, so add 1
    let year = currentDateTime.getFullYear() - 1911;
    
    // Add leading zeros if necessary
    let monthString = (month < 10) ? '0' + month : month;
    return 'Juche ' + year + '.' + monthString + '.' + day;
}

// Returns a formatted Thai solar local date
function getThaiSolar(currentDateTime) {
    const thaiSolarMonths = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม"
    ];

    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth();
    let year = currentDateTime.getFullYear() + 543;
    return day + ' ' + thaiSolarMonths[month] + ' B.E. ' + year;
}

// Returns a formatted French Republican local date
function getRepublicanCalendar(currentDateTime, vernalEquinox) {
    const FrenchRevolutionaryMonths = {
        1: 'Vendémiaire',
        2: 'Brumaire',
        3: 'Frimaire',
        4: 'Nivôse',
        5: 'Pluviôse',
        6: 'Ventôse',
        7: 'Germinal',
        8: 'Floréal',
        9: 'Prairial',
        10: 'Messidor',
        11: 'Thermidor',
        12: 'Fructidor',
        13: 'Sansculottides'
    };

    // Get starting and ending equinoxes, Paris Time (CET)
    let startingEquinox = '';
    let thisYearEquinox = new Date(vernalEquinox);
    thisYearEquinox.setUTCHours(1);
    thisYearEquinox.setMinutes(0);
    thisYearEquinox.setMilliseconds(0);
    if (currentDateTime < thisYearEquinox) {
        let lastYear = new Date(currentDateTime);
        lastYear.setFullYear(currentDateTime.getFullYear()-1);
        lastYear.setMonth(10);
        startingEquinox = getCurrentSolsticeOrEquinox(lastYear, 'autumn');
    } else {
        let nextYear = new Date(currentDateTime);
        nextYear.setFullYear(currentDateTime.getFullYear()+1);
        nextYear.setMonth(10);
        startingEquinox = thisYearEquinox;
    }

    // Get start of year, Paris Time (CET)
    let startOfRepublicanYear = new Date(startingEquinox);
    startOfRepublicanYear.setUTCHours(1);
    startOfRepublicanYear.setMinutes(0);
    startOfRepublicanYear.setMilliseconds(0);

    // Calculate the number of years since 1792
    let yearsSince1792 = (startOfRepublicanYear.getFullYear() - 1792) + 1;

    // Find days in current year
    let daysSinceSeptember22 = Math.floor(differenceInDays(currentDateTime, startOfRepublicanYear));
    
    let month = Math.trunc(daysSinceSeptember22 / 30) + 1;
    if (month > 13) {
        month = 0;
    }
    // Increment up by 1 to account for no 0 day
    let day = Math.floor(daysSinceSeptember22 % 30)+1;
    return day + " " + FrenchRevolutionaryMonths[month] + " " + toRomanNumerals(yearsSince1792) + ' RE';
}

// Returns a formatted EF local date
function getEraFascista(currentDateTime) {
    // Only update the year if past October 29th, otherwise it is the previous year.
    let october22 = new Date(currentDateTime.getFullYear(), 9, 29);
    october22.setFullYear(currentDateTime.getFullYear());
    if (currentDateTime < october22) {
        october22.setFullYear(october22.getFullYear() - 1);
    }
    let yearsSince1922 = october22.getFullYear() - 1921;
    return `Anno ${toRomanNumerals(yearsSince1922)}`;
}

// Returns a formatted Coptic UTC date based on the Julian Day (not Julian date)
function getCopticDate(currentDateTime) {
    const copticMonths = [
        "Thout",
        "Paopi",
        "Hathor",
        "Koiak",
        "Tobi",
        "Meshir",
        "Paremhat",
        "Parmouti",
        "Pashons",
        "Paoni",
        "Epip",
        "Mesori",
        "Pi Kogi Enavot"
    ];

    // Number of days in each Coptic month
    let Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];

    // Fix months if Julian leap year
    let currentJulianYear = getJulianDate(currentDateTime).getFullYear();
    if (currentJulianYear % 4 === 2) {
        Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 6];
    }

    // Calculate days and years from epoch
    const ThoutYear1 = new Date(Date.UTC(283, 7, 28, 21, 0, 0));
    const daysSinceEpoch = Math.floor(differenceInDays(currentDateTime, ThoutYear1));
    const yearsSinceEpoch = Math.floor((4 * daysSinceEpoch + 3) / 1461);
    let CopticYear = yearsSinceEpoch;

    let remainingDays = daysSinceEpoch - Math.floor((365 * yearsSinceEpoch + Math.floor(yearsSinceEpoch / 4)));
    if (remainingDays < 0) {
        CopticYear -= 1;
        remainingDays += 365 + (CopticYear % 4 === 3 ? 1 : 0); // Adjust for leap year
    }
    let CopticMonth = 0;
    while (remainingDays > Coptic_monthDays[CopticMonth]) {
        remainingDays -= Coptic_monthDays[CopticMonth];
        CopticMonth++;
    }

    if ((remainingDays===0)) {
        CopticMonth--;
        if (CopticMonth<0) {
            CopticMonth += 13;
        }
        remainingDays = Coptic_monthDays[CopticMonth];
    }

    return remainingDays + ' ' + copticMonths[CopticMonth] + ' ' + CopticYear + ' AM ';
}

// Returns a formatted Ethiopian UTC date based on the Julian Day (not Julian date)
function getEthiopianDate(currentDateTime) {
    const ethiopianMonths = [
        "Mäskäräm",
        "Ṭəqəmt",
        "Ḫədar",
        "Taḫśaś",
        "Ṭərr",
        "Yäkatit",
        "Mägabit",
        "Miyazya",
        "Gənbo",
        "Säne",
        "Ḥamle",
        "Nähase",
        "Ṗagume"
    ];

    // Number of days in each Coptic month
    let Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5];

    // Fix months if Julian leap year
    let currentJulianYear = getJulianDate(currentDateTime).getFullYear();
    if (currentJulianYear % 4 === 2) {
        Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 6];
    }

    // Calculate days and years from epoch
    let ThoutYear1 = new Date(Date.UTC(7, 7, 26, 21, 0, 0));
    ThoutYear1.setUTCFullYear(7);
    const daysSinceEpoch = Math.floor(differenceInDays(currentDateTime, ThoutYear1));
    const yearsSinceEpoch = Math.floor((4 * daysSinceEpoch + 3) / 1461);
    let EthiopianYear = yearsSinceEpoch;

    let remainingDays = daysSinceEpoch - Math.floor((365 * yearsSinceEpoch + Math.floor(yearsSinceEpoch / 4)));
    if (remainingDays < 0) {
        EthiopianYear -= 1;
        remainingDays += 365 + (EthiopianYear % 4 === 3 ? 1 : 0); // Adjust for leap year
    }
    let EthiopianMonth = 0;
    while (remainingDays > Coptic_monthDays[EthiopianMonth]) {
        remainingDays -= Coptic_monthDays[EthiopianMonth];
        EthiopianMonth++;
    }

    if ((remainingDays===0)) {
        EthiopianMonth--;
        if (EthiopianMonth<0) {
            EthiopianMonth += 13;
        }
        remainingDays = Coptic_monthDays[EthiopianMonth];
    }

    return remainingDays + ' ' + ethiopianMonths[EthiopianMonth] + ' ዓ.ም.' + EthiopianYear;
}

// Returns a formatted Byzantine local date
function getByzantineCalendar(currentDateTime) {
    const julianDate = getJulianDate(currentDateTime);
    // Extract year, month, and day components
    let yearString = julianDate.getFullYear() + 5509 - 1; // Year 1 being 5509
    let monthIndex = julianDate.getMonth(); // Month is zero-based
    let monthString = monthNames[monthIndex];
    let dayString = julianDate.getDate();

    if (monthIndex>7) {
        yearString += 1;
    }

    let dateString = dayString + ' ' + monthString + ' ' + yearString + ' AM';
    return dateString;
}

// Returns a formatted Florentine CET date
function getFlorentineCalendar(currentDateTime) {
    let florentineDate = getJulianDate(currentDateTime);

    // Get March 25 of the Florentine calendar (sunset on the 24th UTC+1)
    let march25ThisYear = new Date(florentineDate);
    march25ThisYear.setMonth(2);
    march25ThisYear.setUTCDate(24);
    march25ThisYear.setUTCHours(19);
    march25ThisYear.setMinutes(0);
    march25ThisYear.setSeconds(0);
    march25ThisYear.setMilliseconds(0);

    if (florentineDate.getUTCHours()>=19) {
        florentineDate.setUTCDate(florentineDate.getUTCDate()+2);
    } else {
        florentineDate.setUTCDate(florentineDate.getUTCDate()+1);
    }

    if (florentineDate>march25ThisYear) {
        florentineDate.setUTCFullYear(florentineDate.getUTCFullYear()+1);
    }

    // Extract year, month, and day components
    let yearString = florentineDate.getUTCFullYear();
    let monthIndex = florentineDate.getUTCMonth(); // Month is zero-based
    let monthString = monthNames[monthIndex];
    let dayString = florentineDate.getUTCDate();

    let yearSuffix = 'AD';
    if (yearString<1) {
        yearSuffix = 'BC';
    }
    
    let dateString = dayString + ' ' + monthString + ' ' + yearString + ' ' + yearSuffix;
    return dateString;
}

// Crashes the site on March 20 2020
// Returns a formatted Baha'i IRST date
function getBahaiCalendar(currentDateTime, vernalEquinox) {

    // Calculate if the New Year should start later or earlier based on sunset in Tehran (UTC+3:30)
    function figureOutEquinoxBeforeAfterSunset(equinox) {
        let equinoxDaySunset = new Date(equinox);
        equinoxDaySunset.setUTCHours(12);
        equinoxDaySunset.setMinutes(30);
        equinoxDaySunset.setSeconds(0);
        equinoxDaySunset.setMilliseconds(0);
        if (equinox < equinoxDaySunset) {
            equinox.setDate(equinox.getDate()-1);
        }
        equinox.setUTCHours(12);
        equinox.setMinutes(30);
        equinox.setSeconds(0);
        equinox.setMilliseconds(0);
        return equinox;
    }

    // Figure out if the beginning of Bahai year was last Gregorian year or this year based on equinox
    let startingEquinox = '';
    let endingEquinox = '';
    if (currentDateTime < vernalEquinox) {
        let lastYear = new Date(currentDateTime);
        lastYear.setFullYear(currentDateTime.getFullYear()-1);
        lastYear.setMonth(10);
        startingEquinox = getCurrentSolsticeOrEquinox(lastYear, 'spring');
        endingEquinox = new Date(vernalEquinox);
    } else {
        let nextYear = new Date(currentDateTime);
        nextYear.setFullYear(currentDateTime.getFullYear()+1);
        nextYear.setMonth(10);
        startingEquinox = new Date(vernalEquinox);
        endingEquinox = getCurrentSolsticeOrEquinox(nextYear, 'spring');
    }

    // Calculate if the New Year should start later or earlier based on sunset in Tehran (UTC+3:30)
    startingEquinox = figureOutEquinoxBeforeAfterSunset(startingEquinox);
    endingEquinox = figureOutEquinoxBeforeAfterSunset(endingEquinox);

    // Calculate when today started based on sunset in Tehran (UTC+3:30)
    currentDayOfYear = Math.trunc(differenceInDays(currentDateTime, startingEquinox))+1;
    let todaySunsetInTehran = new Date(currentDateTime);
    todaySunsetInTehran.setUTCHours(12);
    todaySunsetInTehran.setMinutes(30);
    todaySunsetInTehran.setMilliseconds(0);

    const BahaMonths = [
        "Bahá",
        "Jalál",
        "Jamál",
        "‘Aẓamat",
        "Núr",
        "Raḥmat",
        "Kalimát",
        "Kamál",
        "Asmá’",
        "‘Izzat",
        "Mashíyyat",
        "‘Ilm",
        "Qudrat",
        "Qawl",
        "Masá’il",
        "Sharaf",
        "Sulṭán",
        "Mulk",
        "Ayyám-i-Há",
        "‘Alá’"
    ];

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
            firstDayOfFinalMonth.setDate(endingEquinox.getDate() - 19);

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
    if ((currentDateTime.getMonth()>1)&&(monthIndex<16)) {
        year++
    }
    return currentDayOfYear + ' ' + BahaMonths[monthIndex] + ' ' + year + ' BE';
}

// Returns a formatted Pataphysical local date
function getPataphysicalDate(currentDateTime) {
    let mostRecentSept8 = new Date(currentDateTime.getFullYear(), 8, 8);
    if (currentDateTime < mostRecentSept8) {
        mostRecentSept8.setFullYear(currentDateTime.getFullYear()-1);
    }

    // Get days since last September, add 1 because days are 0 based
    let remainingDays = Math.floor(differenceInDays(currentDateTime, mostRecentSept8));

    const months = [
        "Absolu",
        "Haha",
        "As",
        "Sable",
        "Décervelage",
        "Gueules",
        "Pédale",
        "Clinamen",
        "Palotin",
        "Merdre",
        "Gidouille",
        "Tatane",
        "Phalle",
    ];

    // Last mont doesn't really have 30 days, but it's necessary
    let daysOfMonths = [28,28,28,28,28,28,28,28,28,28,29,28,29];
    let nextSept8 = new Date(mostRecentSept8);
    nextSept8.setFullYear(mostRecentSept8.getFullYear()+1);
    const daysInYear = differenceInDays(nextSept8, mostRecentSept8);

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
    const month = months[monthIndex];
    let year = mostRecentSept8.getFullYear()-1872; // Get epoch

    return day + ' ' + month + ' ' + year;
}

// Returns a formatted Discordian local date
function getDiscordianDate(currentDateTime) {
    const startOfYear = new Date(currentDateTime.getFullYear(), 0, 1);
    const endOfYear = new Date(currentDateTime.getFullYear()+1, 0, 1);
    let remainingDays = Math.floor(differenceInDays(currentDateTime, startOfYear)+1);
    const leapYear = differenceInDays(endOfYear, startOfYear) === 366;

    const months = [
        "Chaos",
        "Discord",
        "Confusion",
        "Bureaucracy",
        "The Aftermath"
    ];

    if ((leapYear)&&(remainingDays>=60)) {
        if (remainingDays===60) {
            return `St. Tib's Day`;
        }
        remainingDays--;
    }

    const daysPerMonth = 73;
    let month = Math.floor(remainingDays / daysPerMonth);
    let day = Math.floor(remainingDays % daysPerMonth);
    let year = currentDateTime.getFullYear() + 1166;

    return day + ' ' + months[month] + ' ' + year + ' YOLD';
}

// Returns a formatted Solar Hijri IRST date
function getSolarHijriDate(currentDateTime, vernalEquinox) {
    // Calculate if the New Year should start later or earlier based on noon in Tehran (UTC+3:30)
    function figureOutEquinoxBeforeAfterNoon(equinox) {
        let equinoxDayNoon = new Date(equinox);
        equinoxDayNoon.setUTCHours(8);
        equinoxDayNoon.setMinutes(30);
        equinoxDayNoon.setSeconds(0);
        equinoxDayNoon.setMilliseconds(0);
        if (equinox > equinoxDayNoon) {
            equinox.setDate(equinox.getDate()+1);
        }
        equinox.setUTCHours(20);
        equinox.setMinutes(30);
        equinox.setSeconds(0);
        equinox.setMilliseconds(0);
        return equinox;
    }

    // Figure out starting and ending equinoxes
    let startingEquinox = '';
    let endingEquinox = '';
    if (currentDateTime < vernalEquinox) {
        let lastYear = new Date(currentDateTime);
        lastYear.setFullYear(currentDateTime.getFullYear()-1);
        lastYear.setMonth(10);
        startingEquinox = getCurrentSolsticeOrEquinox(lastYear, 'spring');
        endingEquinox = new Date(vernalEquinox);
    } else {
        let nextYear = new Date(currentDateTime);
        nextYear.setFullYear(currentDateTime.getFullYear()+1);
        nextYear.setMonth(10);
        startingEquinox = new Date(vernalEquinox);
        endingEquinox = getCurrentSolsticeOrEquinox(nextYear, 'spring');
    }

    // Calculate if the New Year should start later or earlier based on noon in Tehran (UTC+3:30)
    startingEquinox = figureOutEquinoxBeforeAfterNoon(startingEquinox);
    endingEquinox = figureOutEquinoxBeforeAfterNoon(endingEquinox);
    const leapYear = differenceInDays(endingEquinox, startingEquinox) === 366;
    let remainingDays = Math.floor(differenceInDays(currentDateTime, startingEquinox))+1;

    // Month names
    const SolarHijri = [
        "Farvardin",
        "Ordibehesht",
        "Khordad",
        "Tir",
        "Mordad",
        "Shahrivar",
        "Mehr",
        "Aban",
        "Azar",
        "Dey",
        "Bahman",
        "Esfand",
    ];

    // Figure out how many days are in each month
    let daysOfMonths = [31,31,31,31,31,31,30,30,30,30,30,29];
    if (leapYear) {
        daysOfMonths = [31,31,31,31,31,31,30,30,30,30,30,30];
    }

    // Iterate through days of months and subtract from remaining days
    let monthIndex = 0;
    for (; monthIndex < daysOfMonths.length; monthIndex++) {
        if (remainingDays < daysOfMonths[monthIndex]) {
            break;
        }
        remainingDays -= daysOfMonths[monthIndex];
    }
    // Handle weird roll over issues
    if (monthIndex>11) {
        monthIndex=0;
    }

    const day = remainingDays+1;
    const month = SolarHijri[monthIndex];
    const year = startingEquinox.getFullYear() - 621;


    return day + ' ' + month + ' ' + year + ' SH';
}

// Returns a formatted Qadimi IRST date
function getQadimiDate(currentDateTime) {
    // Noon in Iran in 19 June 632, a base Nowruz day
    const Nowruz632Noon = new Date(Date.UTC(632, 5, 19, 2, 30, 0));
    const daysSince632 = Math.floor(differenceInDays(currentDateTime, Nowruz632Noon));
    const yearsSince632 = Math.floor(daysSince632/365);
    let remainingDays = daysSince632 - (yearsSince632*365)+1;

    // Zoroastrian calendar months 
    let months = [
        'Farvardin',
        'Ardibehesht',
        'Khordad',
        'Tir',
        'Amardad',
        'Shehrevar',
        'Mehr',
        'Aban',
        'Azar',
        'Dae',
        'Bahman',
        'Asfand',
        'Gatha'
    ];

    // Names of Zoroastrian days
    const zoroastrianDays = [
        "Hormazd",      // Day 1
        "Bahman",       // Day 2
        "Ardibehesht",  // Day 3
        "Shehrevar",    // Day 4
        "Aspandard",    // Day 5
        "Khordad",      // Day 6
        "Amardad",      // Day 7
        "Dae-Pa-Adar",  // Day 8
        "Adar",         // Day 9
        "Avan",         // Day 10
        "Khorshed",     // Day 11
        "Mohor",        // Day 12
        "Tir",          // Day 13
        "Gosh",         // Day 14
        "Dae-Pa-Meher", // Day 15
        "Meher",        // Day 16
        "Srosh",        // Day 17
        "Rashne",       // Day 18
        "Fravardin",    // Day 19
        "Behram",       // Day 20
        "Ram",          // Day 21
        "Govad",        // Day 22
        "Dae-Pa-Din",   // Day 23
        "Din",          // Day 24
        "Ashishvangh",  // Day 25
        "Ashtad",       // Day 26
        "Asman",        // Day 27
        "Zamyad",       // Day 28
        "Mareshpand",   // Day 29
        "Aneran",       // Day 30
    ];

    // The names of the days that happen at the end of the year
    const gathaDays = [
        "Ahunavaiti",
        "Ushtavaiti",
        "Spentamainyu",
        "Vohuxshathra",
        "Vahishtoishti"
    ];

    // Step through months
    let monthIndex = 0;
    while (remainingDays > 30) {
        monthIndex++;
        remainingDays -= 30;
    }

    let day = zoroastrianDays[remainingDays-1];
    let month = months[monthIndex];
    const year = yearsSince632 +1;

    // If Gatha days, use Gatha day names
    if ((monthIndex>11)&&(remainingDays<6)) {
        day = gathaDays[remainingDays-1];
        return day + ' ' + year + ' Y.Z.';
    }

  return day + ' ' + month + ' ' + year + ' Y.Z.';
}

// Returns a formatted Egyptian Civil local date
function getEgyptianDate(currentDateTime) {
    const EgyptianSeasons = ["Akhet", "Peret", "Shemu", "Heriu Renpet"];
    const EgyptianMonths = [
        "Tekh",
        "Menhet",
        "Hwt-Hrw",
        "Ka-Hr-Ka",
        "Sf-Bdt",
        "Rekh Wer",
        "Rekh Neds",
        "Renwet",
        "Hnsw",
        "Hnt-Htj",
        "Ipt-Hmt",
        "Wep-Renpet"
    ];
    const EgyptianIntercalaryDays = ["Osiris", "Horus the Elder", "Set", "Isis", "Nephthys"];
    const EgyptianMonthNumbers = ["I", "II", "III", "IV"];

    const startOfAkhet2781 = new Date(-2781, 5, 27);
    const daysSincestartOfAkhet2781 = Math.floor(differenceInDays(currentDateTime, startOfAkhet2781));
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

function getISOWeekDate(currentDateTime) {
    const target = new Date(currentDateTime.valueOf());
    const dayNumber = (currentDateTime.getUTCDay() + 6) % 7 + 1; // ISO week day (1 = Monday, ..., 7 = Sunday)
    
    // Set to nearest Thursday (current date + 4 - current day number) to determine the ISO week year
    target.setUTCDate(target.getUTCDate() + 4 - dayNumber);
    const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
    
    // Calculate ISO week number
    const weekNumber = Math.ceil((((target - yearStart) / 86400000) + 1) / 7);
    
    // Calculate ISO week year
    const weekYear = target.getUTCFullYear();

    return weekYear + '-W' + weekNumber + '-' + dayNumber;
}
