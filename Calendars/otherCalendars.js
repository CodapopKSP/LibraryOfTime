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

function getDarianIODate(currentDateTime) {
    const GallileanMonths = [
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

    const GallileanWeek = [
        'Solis',
        'Lunae',
        'Terrae',
        'Martis',
        'Mercurii',
        'Jovis',
        'Veneris',
        'Saturni'
    ];

    const daysInMonths = [32,32,32,32,32,32,32,32,32,32,32,32,24];
    const daysInMonthsLeap = [32,32,32,32,32,32,32,32,32,32,32,32,32];

    function isLeapYear(Y) {
        let leap = true;
        if ((Y-2)%10 === 0) {
            leap = false;
        }
        if ((Y-4)%10 === 0) {
            leap = false;
        }
        if ((Y-7)%10 === 0) {
            leap = false;
        }
        if ((Y-9)%10 === 0) {
            leap = false;
        }
        if (Y%50 === 0) {
            leap = true;
        }
        if (Y%100 === 0) {
            leap = false;
        }
        if (Y%200 === 0) {
            leap = true;
        }
        if (Y%400 === 0) {
            leap = false;
        }
        if (Y%1000 === 0) {
            leap = true;
        }
        if (Y===0) {
            leap = true;
        }
        return leap;
    }

    const epoch = new Date(Date.UTC(2001, 11, 31, 16, 7, 45));
    const ioCircad = 21.238325;
    const ioDayMilliseconds = ioCircad * 60 * 60 * 1000;
    let ioDaysSince = Math.floor((currentDateTime-epoch)/ioDayMilliseconds);
    const dayOfWeek = GallileanWeek[ioDaysSince%8]

    let ioYear = 2002; // starting year after the epoch
    while (true) {
        let daysInYear = isLeapYear(ioYear) ? 416 : 408;
        if (ioDaysSince < daysInYear) {
            break;
        }
        ioDaysSince -= daysInYear;
        ioYear++;
    }

    let remainingDays = ioDaysSince;
    const daysInMonthsArray = isLeapYear(ioYear) ? daysInMonthsLeap : daysInMonths;
    let ioMonth = 0;
    while (remainingDays >= daysInMonthsArray[ioMonth]) {
        remainingDays -= daysInMonthsArray[ioMonth];
        ioMonth++;
    }

    const ioDay = remainingDays + 1;

    return ioDay + ' Io ' + GallileanMonths[ioMonth] + ' ' + ioYear + '\n' + dayOfWeek;
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