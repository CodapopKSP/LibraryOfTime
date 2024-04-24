//|-------------------------|
//|     Solar Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Solar Calendars category.

// Array of month names
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getHumanEra(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth();
    let year = currentDateTime.getFullYear() + 10000;

    // Add leading zeros if necessary
    let dayString = (day < 10) ? '0' + day : day;

    return dayString + ' ' + monthNames[month] + ' ' + year + ' ' + 'HE';
}

function getJulianDate(currentDateTime) {
    let year = currentDateTime.getFullYear();
    let daysAhead = Math.floor(year / 100) - Math.floor(year / 400) - 2;
    let julianDate = new Date(currentDateTime);
    julianDate.setDate(julianDate.getDate() - daysAhead);
    
    // Extract year, month, and day components
    let yearString = julianDate.getFullYear();
    let monthIndex = julianDate.getMonth(); // Month is zero-based
    let monthString = monthNames[monthIndex];
    let dayString = (julianDate.getDate() < 10) ? '0' + julianDate.getDate() : julianDate.getDate();

    let yearSuffix = 'AD';
    if (yearString<1) {
        yearSuffix = 'BC';
    }
    
    let dateString = dayString + ' ' + monthString + ' ' + yearString + ' ' + yearSuffix;
    return dateString;
}


function getMinguo(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth() + 1; // Month is zero-based, so add 1
    let year = currentDateTime.getFullYear() - 1911;
    
    // Add leading zeros if necessary
    let dayString = (day < 10) ? '0' + day : day;
    
    return dayString + '日 ' + month + '月 ' + year + '民國';
}

function getJuche(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth() + 1; // Month is zero-based, so add 1
    let year = currentDateTime.getFullYear() - 1911;
    
    // Add leading zeros if necessary
    let monthString = (month < 10) ? '0' + month : month;
    let dayString = (day < 10) ? '0' + day : day;
    
    return dayString + ' ' + monthString + ' ' + year + ' Juche';
}

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

    // Add leading zeros if necessary
    let dayString = (day < 10) ? '0' + day : day;

    return dayString + ' ' + thaiSolarMonths[month] + ' B.E. ' + year;
}

function getRepublicanCalendar(currentDateTime) {
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

    // Date of September 22nd of the current year
    let september22 = new Date(currentDateTime.getFullYear(), 8, 22); // Note: Month is 8 for September (0-indexed)
    // If the current date is before September 22nd, subtract 1 year
    if (currentDateTime < september22) {
        september22.setFullYear(september22.getFullYear() - 1);
    }
    // Calculate the number of years since 1792
    let yearsSince1792 = (september22.getFullYear() - 1792) + 1;
    // Calculate the total number of days since the most recent September 22nd
    let daysSinceSeptember22 = Math.floor((currentDateTime - september22) / (1000 * 60 * 60 * 24));
    let month = Math.floor(daysSinceSeptember22 / 30) + 1;
    if ((month > 12) || (month == 0)) {
        month = 'Sansculottides';
    }
    let day = Math.floor(daysSinceSeptember22 % 30)+1;
    return day + " " + FrenchRevolutionaryMonths[month] + " " + toRomanNumerals(yearsSince1792) + ' RE';
}

function getEraFascista(currentDateTime) {
    // Only update the year if past October 22nd, otherwise it is the previous year.
    let october22 = new Date(currentDateTime.getFullYear(), 9, 22);
    if (currentDateTime < october22) {
        october22.setFullYear(october22.getFullYear() - 1);
    }
    let yearsSince1922 = october22.getFullYear() - 1921;
    return `Anno ${toRomanNumerals(yearsSince1922)}`;
}

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

function julianDayToCoptic(julianDay) {
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

    const JD_epoch = 1824665.5; // Julian Day of the start of the Coptic calendar
    const Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]; // Number of days in each Coptic month

    // Add 0.5 to JD to make it happen with UTC
    const daysSinceEpoch = Math.floor(julianDay+0.5) - JD_epoch;
    const yearsSinceEpoch = Math.floor((4 * daysSinceEpoch + 3) / 1461);
    const CopticYear = yearsSinceEpoch;

    let remainingDays = daysSinceEpoch - (365 * yearsSinceEpoch + Math.floor(yearsSinceEpoch / 4));
    let CopticMonth = 1;
    while (remainingDays >= Coptic_monthDays[CopticMonth - 1]) {
        remainingDays -= Coptic_monthDays[CopticMonth - 1];
        CopticMonth++;
    }

    // Add 2 days for some reason but it keeps it in sync with Wiki
    const CopticDay = Math.floor(remainingDays + 2);

    return CopticDay + ' ' + copticMonths[CopticMonth-1] + ' ' + CopticYear + ' AM';
}

function julianDayToEthiopian(julianDay) {
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

    const JD_epoch = 1724221.5; // Julian Day of the start of the Coptic calendar
    const Ethiopian_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]; // Number of days in each Coptic month

    // Add 0.5 to JD to make it happen with UTC
    const daysSinceEpoch_ = Math.floor(julianDay+0.5) - JD_epoch;
    const yearsSinceEpoch_ = Math.floor((4 * daysSinceEpoch_ + 3) / 1461);
    const EthiopianYear = yearsSinceEpoch_ + 2;

    let remainingDays_ = daysSinceEpoch_ - (365 * yearsSinceEpoch_ + Math.floor(yearsSinceEpoch_ / 4));
    let EthiopianMonth = 1;
    while (remainingDays_ >= Ethiopian_monthDays[EthiopianMonth - 1]) {
        remainingDays_ -= Ethiopian_monthDays[EthiopianMonth - 1];
        EthiopianMonth++;
    }

    // Add 2 days for some reason but it keeps it in sync with Wiki
    const CopticDay = Math.floor(remainingDays_ + 1);

    return CopticDay + ' ' + ethiopianMonths[EthiopianMonth-1] + ' ዓ.ም.' + EthiopianYear;
}

function getInvariableCalendarDate(currentDateTime) {
    const year = currentDateTime.getFullYear();
    const startOfYear = new Date(year, 0, 1, 0, 0, 0);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);
    const daysSinceStartOfYear = Math.floor((currentDateTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))+1;
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
    const daysSinceStartOfYear = Math.floor((currentDateTime.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))+1;
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
