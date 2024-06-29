//|-------------------------|
//|     Solar Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Other Calendars category.

function getCurrentMayaLongCount(currentDateTime) {
    const mayaStartDate = new Date(-3113, 7, 11); // September 6, 3113 BC
    const daysSinceStart = Math.floor((currentDateTime - mayaStartDate) / (1000 * 60 * 60 * 24));
    
    const baktuns = Math.floor(daysSinceStart / (20 * 20 * 18 * 20));
    const remainingDays1 = daysSinceStart % (20 * 20 * 18 * 20);
    
    const katuns = Math.floor(remainingDays1 / (20 * 18 * 20));
    const remainingDays2 = remainingDays1 % (20 * 18 * 20);
    
    const tuns = Math.floor(remainingDays2 / (18 * 20));
    const remainingDays3 = remainingDays2 % (18 * 20);
    
    const uinals = Math.floor(remainingDays3 / 20);
    const kins = remainingDays3 % 20;
    
    return `${baktuns}.${katuns}.${tuns}.${uinals}.${kins}`;
}

function getDarianMarsDate(julianSolNumber) {
    const DarianMonths = [
        "Sagittarius",
        "Dhanus",
        "Capricornus",
        "Makara",
        "Aquarius",
        "Khumba",
        "Pisces",
        "Mina",
        "Aries",
        "Mesha",
        "Taurus",
        "Rishabha",
        "Gemini",
        "Mithuna",
        "Cancer",
        "Karka",
        "Leo",
        "Simha",
        "Virgo",
        "Kanya",
        "Libra",
        "Tula",
        "Scorpius",
        "Vrishika"
    ];

    const darianWeek = ['Solis', 'Lunae', 'Martis', 'Mercurii', 'Jovis', 'Veneris', 'Saturni'];

    const daysOfMonthsLeapYear = [28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 28];
    const daysOfMonthsNonLeapYear = [28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27];

    // Odd years except if divisible by 10, but not 100 except for 500
    function isLeapYear(year) {
        let leap = false;
        if ((year-1)%2 === 0) {
            leap = true;
        }
        if (year%10 === 0) {
            leap = true;
        }
        if (year%100 == 0) {
            leap = false;
        }
        if (year%500 == 0) {
            leap = true;
        }
        return leap;
    }

    function getDaysInYear(year) {
        return isLeapYear(year) ? 669 : 668;
    }

    // Handle negative Julian Sol Numbers
    let remainingDays = julianSolNumber;
    let year = 0;

    if (remainingDays >= 0) {
        // Positive years
        while (remainingDays >= getDaysInYear(year)) {
            remainingDays -= getDaysInYear(year);
            year++;
        }
    } else {
        // Negative years
        while (remainingDays < 0) {
            year--;
            remainingDays += getDaysInYear(year);
        }
    }

    // Find the day and month based on remaining days
    const daysOfMonths = isLeapYear(year) ? daysOfMonthsLeapYear : daysOfMonthsNonLeapYear;
    let month = 0;
    while (remainingDays >= daysOfMonths[month]) {
        remainingDays -= daysOfMonths[month];
        month++;
    }
    let day = Math.trunc(remainingDays) + 1; // Days in calendar start from 1

    const dayOfWeek = (day-1) % 7;

    // Display negative years as negative
    return day + ' ' + DarianMonths[month] + ' ' + (year >= 0 ? year : year) + '\nSol ' + darianWeek[dayOfWeek];
}

function getGalileanDate(currentDateTime, body) {
    const GalileanMonths = [
        'Januarius',
        'Februarius',
        'Mercedonius',
        'Martius',
        'Aprilis',
        'Maius',
        'Junius',
        'Julius',
        'Augustus',
        'September',
        'October',
        'November',
        'December'
    ];

    const GalileanWeek = ['Solis','Lunae','Terrae','Martis','Mercurii','Jovis','Veneris','Saturni'];
    const daysInMonths = [32,32,32,32,32,32,32,32,32,32,32,32,24];
    const daysInMonthsLeap = [32,32,32,32,32,32,32,32,32,32,32,32,32];
    const daysInMonthsGanymedeShort = [32,32,32,32,32,32,24,32,32,32,32,32,24];
    const daysInMonthsGanymedeLeap = [32,32,32,32,32,32,24,32,32,32,32,32,32];

    // The original formula doesn't make sense to me, so I added my own
    function isLeapYearIo(Y) {
        if (Y === 0) {
            return true;
        }
        if (Y % 1000 === 0) {
            return true;
        }
        if (Y % 400 === 0) {
            return false;
        }
        if (Y % 200 === 0) {
            return true;
        }
        if (Y % 100 === 0) {
            return false;
        }
        if (Y % 50 === 0) {
            return true;
        }
        if ((Y % 10 === 2) || (Y % 10 === 4) || (Y % 10 === 7) || (Y % 10 === 9)) {
            return false;
        }
        return true;
    }

    // The original formula doesn't make sense to me, so I added my own
    function isLeapYearEuropa(Y) {
        if (Y === 0) {
            return true;
        }
        if (Y % 1000 === 0) {
            return false;
        }
        if (Y % 800 === 0) {
            return true;
        }
        if (Y % 400 === 0) {
            return false;
        }
        if (Y % 200 === 0) {
            return true;
        }
        if (Y % 50 === 0) {
            return false;
        }
        if ((Y % 5 === 0) || ((Y-2) % 5 === 0)) {
            return true;
        }
        return false;
    }

    // The original formula doesn't make sense to me, so I added my own
    function isLeapYearGanymede(Y) {
        if (Y % 40 === 0) {
            return false;
        }
        if (Y % 60 === 0) {
            return false;
        }
        return true;
    }

    function isLeapYearCallisto(Y) {
        if (Y % 400 === 0) {
            return true;
        }
        if (Y % 40 === 0) {
            return false;
        }
        if ((Y-7) % 10 === 0) {
            return false;
        }
        if ((Y-2) % 10 === 0) {
            return false;
        }
        return true;
    }

    let epoch = new Date();
    let circad = 0;
    if (body==='Io') {
        epoch = new Date(Date.UTC(2001, 11, 31, 16, 7, 45));
        circad = 21.238325;
    }
    if (body==='Eu') {
        epoch = new Date(Date.UTC(2002, 0, 2, 17, 12, 57));
        circad = 21.32456;
    }
    if (body==='Gan') {
        epoch = new Date(Date.UTC(2002, 0, 1, 11, 8, 29));
        circad = 21.49916;
    }
    if (body==='Cal') {
        epoch = new Date(Date.UTC(2001, 11, 28, 12, 27, 23));
        circad = 21.16238;
    }

    const dayMilliseconds = circad * 60 * 60 * 1000;
    let daysSince = Math.floor((currentDateTime - epoch) / dayMilliseconds);
    const isNegative = daysSince < 0;
    daysSince = Math.abs(daysSince);

    let year = 2002; // starting year after the epoch
    let daysInYear = 0;
    while (true) {
        if (body === 'Io') {
            daysInYear = isLeapYearIo(year) ? 416 : 408;
        }
        if (body === 'Eu') {
            daysInYear = isLeapYearEuropa(year) ? 416 : 408;
        }
        if (body === 'Gan') {
            daysInYear = isLeapYearGanymede(year) ? 408 : 400;
        }
        if (body === 'Cal') {
            daysInYear = isLeapYearCallisto(year) ? 416 : 408;
        }
        if (daysSince < daysInYear) {
            break;
        }
        daysSince -= daysInYear;
        year += isNegative ? -1 : 1;
    }

    if (isNegative) {
        daysSince = daysInYear - daysSince;
    }

    let remainingDays = daysSince;
    let daysInMonthsArray = '';

    if (body === 'Io') {
        daysInMonthsArray = isLeapYearIo(year) ? daysInMonthsLeap : daysInMonths;
    }
    if (body === 'Eu') {
        daysInMonthsArray = isLeapYearEuropa(year) ? daysInMonthsLeap : daysInMonths;
    }
    if (body === 'Gan') {
        daysInMonthsArray = isLeapYearGanymede(year) ? daysInMonthsGanymedeLeap : daysInMonthsGanymedeShort;
    }
    if (body === 'Cal') {
        daysInMonthsArray = isLeapYearCallisto(year) ? daysInMonthsLeap : daysInMonths;
    }

    let month = 0;
    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = remainingDays + 1;
    const dayOfWeek = GalileanWeek[(isNegative ? -daysSince : daysSince) % 8];
    return day + ' ' + body + ' ' + GalileanMonths[month] + ' ' + year + '\n' + body + ' ' + dayOfWeek;
}

function getDarianGalileanDate(currentDateTime, body) {
    const DarianMonths = [
        "Sagittarius",
        "Dhanus",
        "Capricornus",
        "Makara",
        "Aquarius",
        "Khumba",
        "Pisces",
        "Mina",
        "Aries",
        "Mesha",
        "Taurus",
        "Rishabha",
        "Gemini",
        "Mithuna",
        "Cancer",
        "Karka",
        "Leo",
        "Simha",
        "Virgo",
        "Kanya",
        "Libra",
        "Tula",
        "Scorpius",
        "Vrishika"
    ];

    const GalileanWeek = ['Solis','Lunae','Terrae','Martis','Mercurii','Jovis','Veneris','Saturni'];

    const daysInIoCallistoMonths = [32,32,32,32,32,32,32,32,32,32,32,40,32,32,32,32,32,32,32,32,32,32,32,32];
    const daysInEuropaMonths = [32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32];
    const daysInGanymedeMonths = [32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,24];

    const daysInIoCallistoMonthsLeap = [32,32,32,32,32,32,32,32,32,32,32,40,32,32,32,32,32,32,32,32,32,32,32,40];
    const daysInEuropaMonthsLeap = [32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40];
    const daysInGanymedeMonthsLeap = [32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32];

    function isLeapYearIo(Y) {
        if (Y <= 3200) {
            if (Y % 80 === 0) {
                return true;
            }
            if (Y % 40 === 0) {
                return false;
            }
        } else if (Y <= 9600) {
            if (Y % 1600 === 0) {
                return true;
            }
            if (Y % 80 === 0) {
                return false;
            }
        } else if (Y > 9600) {
            if (Y % 800 === 0) {
                return true;
            }
            if (Y % 80 === 0) {
                return false;
            }
        }
        if (Y % 20 === 0) {
            return true;
        }
        return false;
    }

    function isLeapYearEuropa(Y) {
        if (Y === 0) {
            return false;
        }
        if (Y > 8000) {
            if (Y % 800 === 0) {
                return true;
            }
        } else if (Y > 3200) {
            if (Y % 1600 === 0) {
                return true;
            }
        }
        if (Y % 200 === 0) {
            return false;
        }
        if (Y % 20 === 0) {
            return true;
        }
        if (Y % 5 === 0) {
            return false;
        }
        if ((Y-3) % 5 === 0) {
            return false;
        }
        return true;
    }

    function isLeapYearGanymede(Y) {
        if (Y > 8400) {
            if (Y % 800 === 0) {
                return true;
            }
        } else if (Y > 3200) {
            if (Y % 1200 === 0) {
                return true;
            }
        }
        if (Y % 400 === 0) {
            return false;
        }
        if (Y % 80 === 0) {
            return true;
        }
        if (Y % 20 === 0) {
            return false;
        }
        if ((Y-5) % 10 === 0) {
            return false;
        }
        return true;
    }

    function isLeapYearCallisto(Y) {
        if (Y % 1200 === 0) {
            return true;
        }
        if (Y % 400 === 0) {
            return false;
        }
        if (Y % 80 === 0) {
            return true;
        }
        if (Y % 40 === 0) {
            return false;
        }
        if ((Y-2) % 5 === 0) {
            return true;
        }
        if (Y % 5 === 0) {
            return true;
        }
        return false;
    }

    let epoch = new Date();
    let circad = 0;
    if (body==='Io') {
        epoch = new Date(Date.UTC(1609, 2, 13, 5, 29, 26));
        circad = 21.238325;
    }
    if (body==='Eu') {
        epoch = new Date(Date.UTC(1609, 2, 12, 1, 19, 41));
        circad = 21.32456;
    }
    if (body==='Gan') {
        epoch = new Date(Date.UTC(1609, 2, 11, 9, 52, 12));
        circad = 21.49916;
    }
    if (body==='Cal') {
        epoch = new Date(Date.UTC(1609, 2, 17, 20, 57, 24));
        circad = 21.16238;
    }

    const dayMilliseconds = circad * 60 * 60 * 1000;
    let daysSince = Math.floor((currentDateTime - epoch) / dayMilliseconds);
    const isNegative = daysSince < 0;
    daysSince = Math.abs(daysSince);

    const dayOfWeek = GalileanWeek[daysSince % 8];
    let year = 0;
    while (true) {
        let daysInYear = 0;
        if (body === 'Io') {
            daysInYear = isLeapYearIo(year) ? 784 : 776;
        }
        if (body === 'Eu') {
            daysInYear = isLeapYearEuropa(year) ? 776 : 768;
        }
        if (body === 'Gan') {
            daysInYear = isLeapYearGanymede(year) ? 768 : 760;
        }
        if (body === 'Cal') {
            daysInYear = isLeapYearCallisto(year) ? 784 : 776;
        }
        if (daysSince < daysInYear) {
            break;
        }
        daysSince -= daysInYear;
        year += isNegative ? -1 : 1;
    }
    let remainingDays = daysSince;
    let daysInMonthsArray = '';

    if (body === 'Io') {
        daysInMonthsArray = isLeapYearIo(year) ? daysInIoCallistoMonthsLeap : daysInIoCallistoMonths;
    }
    if (body === 'Eu') {
        daysInMonthsArray = isLeapYearEuropa(year) ? daysInEuropaMonthsLeap : daysInEuropaMonths;
    }
    if (body === 'Gan') {
        daysInMonthsArray = isLeapYearGanymede(year) ? daysInGanymedeMonthsLeap : daysInGanymedeMonths;
    }
    if (body === 'Cal') {
        daysInMonthsArray = isLeapYearCallisto(year) ? daysInIoCallistoMonthsLeap : daysInIoCallistoMonths;
    }

    let month = 0;
    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = remainingDays + 1;
    return day + ' ' + body + ' ' + DarianMonths[month] + ' ' + year + '\n' + body + ' ' + dayOfWeek;
}

function getDarianTitanDate(currentDateTime, body) {
    const DarianMonths = [
        "Sagittarius",
        "Dhanus",
        "Capricornus",
        "Makara",
        "Aquarius",
        "Khumba",
        "Pisces",
        "Mina",
        "Aries",
        "Mesha",
        "Taurus",
        "Rishabha",
        "Gemini",
        "Mithuna",
        "Cancer",
        "Karka",
        "Leo",
        "Simha",
        "Virgo",
        "Kanya",
        "Libra",
        "Tula",
        "Scorpius",
        "Vrishika"
    ];

    const GalileanWeek = ['Solis','Lunae','Terrae','Martis','Mercurii','Jovis','Veneris','Saturni'];

    const titanMonthDays = [28,28,32,28,28,28,28,28,32,28,28,28,28,28,32,28,28,28,28,28,32,28,28,28];
    const titanMonthDaysLeap = [28,28,32,28,28,28,28,28,32,28,28,32,28,28,32,28,28,28,28,28,32,28,28,32];

    function isLeapYear(Y) {
        if (Y % 400 === 0) {
            return false;
        }
        if (Y % 25 === 0) {
            return true;
        }
        return false;
    }

    const epoch = new Date(Date.UTC(1609, 2, 15, 18, 37, 32));
    const titanCircad = 0.998068439;
    const titanDayMilliseconds = titanCircad * 24 * 60 * 60 * 1000;
    let titanDaysSince = (currentDateTime-epoch)/titanDayMilliseconds;
    const isNegative = titanDaysSince < 0;
    titanDaysSince = Math.abs(titanDaysSince);

    const dayOfWeek = GalileanWeek[Math.floor(titanDaysSince % 8)];
    let year = 0;
    while (true) {
        let daysInYear = 0;
        daysInYear = isLeapYear(year) ? 696 : 688;
        titanDaysSince -= daysInYear;
        year += isNegative ? -1 : 1;
        if (titanDaysSince < daysInYear) {
            break;
        }
    }
    let remainingDays = titanDaysSince;
    let daysInMonthsArray = '';
    daysInMonthsArray = isLeapYear(year) ? titanMonthDaysLeap : titanMonthDays;
    let month = 0;
    while (remainingDays >= daysInMonthsArray[month]) {
        remainingDays -= daysInMonthsArray[month];
        month++;
    }

    const day = Math.floor(remainingDays) + 1;
    return day + ' Ti ' + DarianMonths[month] + ' ' + year + '\nTi ' + dayOfWeek;
}

function getYugaCycle(currentDateTime) {
    const YugaCycle = [
        /*
        "Satya Yuga: Sandhya",
        "Satya Yuga",
        "Satya Yuga: Sandhyamsa",
        "Treta Yuga: Sandhya",
        "Treta Yuga",
        "Treta Yuga: Sandhyamsa",
        "Dvapara Yuga: Sandhya",*/
        "Dvapara Yuga",
        "Dvapara Yuga: Sandhyamsa",
        "Kali Yuga: Sandhya",
        "Kali Yuga",
        "Kali Yuga: Sandhyamsa",
    ];

    const yearsOfYugas = [
        /*
        144000,
        1440000,
        144000,
        108000,
        1080000,
        108000,
        72000,*/
        720000,
        72000,
        36000,
        360000,
        36000
    ];

    const kaliAhargana = getKaliAhargana(currentDateTime);
    const yearsOfKaliYuga = Math.floor(kaliAhargana / 365.25);

    // Get total years of cycle up until the start of Kali Yuga
    const totalYugaCycleYearsUpToKaliYuga = 720000+72000;

    // Get current year of Yuga Cycle
    let yearsOfYugaCycle = totalYugaCycleYearsUpToKaliYuga + yearsOfKaliYuga;

    // Find the current Yuga segment based on the yearsOfYugaCycle
    let cycleIndex = 0;
    for (let i = 0; i < yearsOfYugas.length; i++) {
        
        if (yearsOfYugaCycle <= 0) {
            cycleIndex = i;
            break;
        }
        yearsOfYugaCycle -= yearsOfYugas[i];
    }

    // Ensure cycleIndex is always between 0 and 11
    cycleIndex = (cycleIndex-1) % 5;

    return YugaCycle[cycleIndex];
}

function getSothicCycle(currentDateTime) {
    const startOf139Cycle = new Date(139, 6, 19); // Start of a Sothic Cycle as per the wiki
    const daysSinceStartOf139Cycle = differenceInDays(currentDateTime, startOf139Cycle);
    const yearsSince139Cycle = Math.floor(daysSinceStartOf139Cycle/365.25);
    const currentCycle = Math.floor(yearsSince139Cycle/1460)+3;
    const yearsInCurrentCycle = yearsSince139Cycle%1460;

    return 'Cycle: ' + currentCycle + ' | Year: ' + yearsInCurrentCycle;
}

function getOlympiad(currentDateTime) {
    const julianDate = getJulianDate(currentDateTime);
    const olympiad1_ = new Date(-775, 6, 24); // Starting Olympiad, astronomical
    const olympiad1 = getJulianDate(olympiad1_);
    const daysSinceOlympiad1 = differenceInDays(julianDate, olympiad1);
    const yearsSinceOlympiad1 = daysSinceOlympiad1/365.2425;
    const olympiad = Math.floor(yearsSinceOlympiad1/4)+1
    const currentYearOfOlympiad = Math.floor(yearsSinceOlympiad1%4)+1;
    return olympiad + ' | Year: ' + currentYearOfOlympiad;
}

function getTzolkinDate(currentDateTime) {
    const tzolkinMonths = [
        "Imix", "Ik'", "Ak'b'al", "K'an", "Chikchan",
        "Kimi", "Manik'", "Lamat", "Muluk", "Ok",
        "Chuwen", "Eb'", "B'en", "Ix", "Men",
        "K'ib'", "Kab'an", "Etz'nab'", "Kawak", "Ajaw"
    ];

    const mayaLongCount0 = new Date(-3113, 7, 11);
    const totalDays = Math.floor(differenceInDays(currentDateTime, mayaLongCount0));
    
    const startingTzolkinDay = 4; // 4 Ahau is the starting Tzolk'in day for 0.0.0.0.0
    const startingTzolkinMonthIndex = tzolkinMonths.indexOf("Ajaw");

    const adjustedDays = (totalDays % 260 + 260) % 260;
    const dayNumber = (startingTzolkinDay + adjustedDays) % 13 || 13;
    const monthIndex = (startingTzolkinMonthIndex + adjustedDays) % 20;
    
    return `${dayNumber} ${tzolkinMonths[monthIndex]}`;
};

function getLordOfTheNight(currentDateTime) {
    const startingBaktun13 = new Date(2012, 11, 21);
    const daysSince = differenceInDays(currentDateTime, startingBaktun13);
    let lord = Math.floor(((daysSince % 9) + 9) % 9);
    if (lord === 0) {
        lord = 9;
    }
    let Y = Math.floor(((daysSince % 7) + 7) % 7);
    if (Y === 0) {
        Y = 7;
    }
    return 'G' + lord + ' | Y' + Y;
}