//|-------------------------|
//|     Solar Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Other Calendars category.

function getCurrentMayanLongCount(currentDateTime) {
    const mayanStartDate = new Date(-3113, 7, 11); // September 6, 3113 BC
    const daysSinceStart = Math.floor((currentDateTime - mayanStartDate) / (1000 * 60 * 60 * 24));
    
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

function getDarianCalendar(julianSolNumber) {
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

    const daysOfMonthsLeapYear = [28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 28];
    const daysOfMonthsNonLeapYear = [28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27, 28, 28, 28, 28, 28, 27];

    // Odd years except if divisible by 10, but not 100 except for 500
    function isLeapYear(year) {
        return (((year % 2 !== 0) || (year % 10 === 0)) && ((year % 100 !== 0)||(year % 500 === 0)));
    }

    function getDaysInYear(year) {
        return isLeapYear(year) ? 669 : 668;
    }

    // Start with Julian Sol Number
    let remainingDays = julianSolNumber;
    let year = 0;

    // Subtract days based on if Leap Year or Normal Year
    while (remainingDays >= getDaysInYear(year)) {
        remainingDays -= getDaysInYear(year);
        year++;
    }

    // Find the day and month based on remaining days
    const daysOfMonths = isLeapYear(year) ? daysOfMonthsLeapYear : daysOfMonthsNonLeapYear;
    let month = 0;
    while (remainingDays >= daysOfMonths[month]) {
        remainingDays -= daysOfMonths[month];
        month++;
    }
    let day = Math.trunc(remainingDays) + 1; // Days in calendar start from 1

    return day + ' ' + DarianMonths[month] + ' ' + year;
}