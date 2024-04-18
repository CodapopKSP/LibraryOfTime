//|------------------------|
//|     Computing Time     |
//|------------------------|

// A set of functions for calculating times in the Computing Time category.

function getHumanEra(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth();
    let year = currentDateTime.getFullYear() + 10000;
    return `${year}-${month + 1}-${day}`;
}

function getJulianDate(currentDateTime) {
    let year = currentDateTime.getFullYear();
    let daysAhead = Math.floor(year / 100) - Math.floor(year / 400) - 2;
    let julianDate = new Date(currentDateTime);
    julianDate.setDate(julianDate.getDate() - daysAhead);
    // Extract year, month, and day components
    let yearString = julianDate.getFullYear();
    let monthString = julianDate.getMonth() + 1; // Month is zero-based, so add 1
    let dayString = julianDate.getDate();
    let dateString = yearString + '-' + monthString + '-' + dayString;
    return dateString;
}

function getMinguoJuche(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth();
    let year = currentDateTime.getFullYear() -1911;
    return `${year}-${month + 1}-${day}`;
}

function getThaiSolar(currentDateTime) {
    let day = currentDateTime.getDate();
    let month = currentDateTime.getMonth();
    let year = currentDateTime.getFullYear() + 543;
    return `B.E. ${year}-${month + 1}-${day}`;
}










function getRepublicanCalendar(currentDateTime) {
    // Date of September 22nd of the current year
    let september22 = new Date(currentDateTime.getFullYear(), 8, 22); // Note: Month is 8 for September (0-indexed)
    // If the current date is before September 22nd, subtract 1 year
    if (currentDateTime < september22) {
        september22.setFullYear(september22.getFullYear() - 1);
    }
    // Calculate the number of years since 1792
    let yearsSince1792 = (september22.getFullYear() - 1792) + 1;
    if (yearsSince1792 <= 0 && currentDateTime.getFullYear() > 0) {
        yearsSince1792--;
    }
    // Calculate the total number of days since the most recent September 22nd
    let daysSinceSeptember22 = Math.floor((currentDateTime - september22) / (1000 * 60 * 60 * 24));
    let month = Math.floor(daysSinceSeptember22 / 30)+1;
    if ((month > 12) || (month == 0)) {
        month = 'Sansculottides';
    }
    let day = Math.floor(daysSinceSeptember22 % 30)+1;
    return {year: yearsSince1792, month: month, day: day};
}



function toRomanNumerals(num) {
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