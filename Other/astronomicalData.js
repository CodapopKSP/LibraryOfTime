//|---------------------------|
//|     Astronomical Data     |
//|---------------------------|

// A set of functions for calculating data in the Astronomical Data category.

// Manages the global list of new moons
let allNewMoons = [];

function generateAllNewMoons(currentDateTime) {
    let newMoons = [];
    let lunation = -14;
    while (lunation < 13) {
        const newMoon = getMoonPhase(currentDateTime, lunation);
        newMoons.push(newMoon);
        lunation++;
    }
    allNewMoons = newMoons;
}

function getNewMoon(referenceDate, lunations) {
    const len = allNewMoons.length;
    if (len === 0) return null;

    let bestIndex = -1;

    // Binary search to find the last date < referenceDate
    let low = 0;
    let high = len - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (allNewMoons[mid] <= referenceDate) {
            bestIndex = mid;
            low = mid + 1; // keep searching to the right
        } else {
            high = mid - 1;
        }
    }

    // Apply the lunations to the index after we've found the best match
    const adjustedIndex = bestIndex + lunations;
    if (adjustedIndex >= 0 && adjustedIndex < len) {
        return new Date(allNewMoons[adjustedIndex]);
    }

    return null;
}

// Manages the global list of solstices and equinoxes
let allSolsticesEquinoxes = [];

function generateAllSolsticesEquinoxes(currentDateTime) {
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    const centerYear = currentDateTime.getUTCFullYear();
    const solsticesEquinoxes = [];

    for (let yearOffset = -3; yearOffset <= 3; yearOffset++) {
        const year = centerYear + yearOffset;

        for (const season of seasons) {
            const date = getSolsticeOrEquinox(createDateWithFixedYear(year, 0, 1, 0, 0, 0), season);
            solsticesEquinoxes.push({ date, season });
        }
    }

    allSolsticesEquinoxes = solsticesEquinoxes;
}

function getSolsticeEquinox(referenceDate, season, offset = 0) {
    // Check if list is out of date
    if (
        !allSolsticesEquinoxes.length || 
        referenceDate < allSolsticesEquinoxes[0].date || 
        referenceDate > allSolsticesEquinoxes[allSolsticesEquinoxes.length - 1].date
    ) {
        generateAllSolsticesEquinoxes(referenceDate);
    }

    // Filter to only the desired season
    const filtered = allSolsticesEquinoxes.filter(e => e.season === season);
    let bestIndex = -1;

    // Binary search to find the last matching season <= referenceDate
    let low = 0;
    let high = filtered.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (filtered[mid].date <= referenceDate) {
            bestIndex = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    const adjustedIndex = bestIndex + offset;
    if (adjustedIndex >= 0 && adjustedIndex < filtered.length) {
        return new Date(filtered[adjustedIndex].date); // Return copy
    }
    console.error("List out of range. Consider increasing the size.");
    return null;
}


// Return an unformatted date from an unsigned JDE
// This equation was sourced from Astronomical Algorithms
function calculateDateFromJDE(JDE) {
    const newJDE = JDE + 0.5;
    const Z = Math.trunc(newJDE);
    const F = newJDE - Z;
    const alpha = Math.trunc((Z - 1867216.25)/36524.25);
    let A = 0;
    if (Z < 2299161) {
        A = Z;
    } else {
        A = Z + 1 + alpha - Math.trunc(alpha/4);
    }
    const B = A + 1524;
    const C = Math.trunc((B - 122.1)/365.25);
    const D = Math.trunc(365.25*C);
    const E = Math.trunc((B - D)/30.6001);
    const dayDecimal = B - D - Math.trunc(30.6001*E) + F;
    let month;
    if (E < 14) {
        month = E - 1;
    } else {
        month = E - 13;
    }
    let year;
    if (month > 2) {
        year = C - 4716;
    } else {
        year = C - 4715;
    }
    const day = Math.trunc(dayDecimal);
    const remainingDayDecimal = dayDecimal - day;
    const totalSecondsInDay = 24 * 60 * 60;
    const totalSecondsOfRemainingDay = Math.trunc(remainingDayDecimal * totalSecondsInDay);
    const hours = Math.trunc(totalSecondsOfRemainingDay / 3600);
    const minutes = Math.trunc((totalSecondsOfRemainingDay % 3600) / 60);
    const seconds = totalSecondsOfRemainingDay % 60;
    let unfixedDateTime = createDateWithFixedYear(year, month-1, day, hours, minutes, seconds);
    // I think this is how to add Dynamical Time but I'm not sure
    let fixedDateTime = new Date(getDynamicalTimeBackward(unfixedDateTime));
    
    const startOfGregorian = new Date(Date.UTC(1582, 9, 15));
    if (fixedDateTime < startOfGregorian) { //&& (getCalendarType()==='gregorian-proleptic')) {
        setGregJulianDifference(calculateGregorianJulianDifference(fixedDateTime));
        fixedDateTime.setUTCDate(fixedDateTime.getUTCDate() + getGregJulianDifference());
    }

    return fixedDateTime;
}

function calculateUTCYearFraction(currentDateTime) {
    let year = currentDateTime.getUTCFullYear();
    let yearStart = createDateWithFixedYear(year, 0, 1);
    let nextYearStart = createDateWithFixedYear(year + 1, 0, 1);
    let yearFraction = (currentDateTime - yearStart) / (nextYearStart - yearStart);
    return yearFraction;
}



//|----------------------------|
//|     Solar Calculations     |
//|----------------------------|


// Returns the unformatted date of a solstice or equinox
// The equations and hardcoded values come from Astronomical Algorithms
function getSolsticeOrEquinox(currentDateTime, season) {

    // Sum up all the values in a table from Astronomical Algorithms
    function sumSolsticeEquinoxTable(T) {
        function sumSolsticeEquinoxTableHelper(T, num1, num2, num3) {
            return num1 * Math.cos((num2 + num3*T)* Math.PI / 180);
        }
        const sum =
        sumSolsticeEquinoxTableHelper(T, 485, 324.96, 1934.136) +
        sumSolsticeEquinoxTableHelper(T, 203, 337.23, 32964.467) +
        sumSolsticeEquinoxTableHelper(T, 199, 342.08, 20.186) +
        sumSolsticeEquinoxTableHelper(T, 182, 27.85, 445267.112) +
        sumSolsticeEquinoxTableHelper(T, 156, 73.14, 45036.886) +
        sumSolsticeEquinoxTableHelper(T, 136, 171.52, 22518.443) +
        sumSolsticeEquinoxTableHelper(T, 77, 222.54, 65928.934) +
        sumSolsticeEquinoxTableHelper(T, 74, 296.72, 3034.906) +
        sumSolsticeEquinoxTableHelper(T, 70, 243.58, 9037.513) +
        sumSolsticeEquinoxTableHelper(T, 58, 119.81, 33718.147) +
        sumSolsticeEquinoxTableHelper(T, 52, 297.17, 150.678) +
        sumSolsticeEquinoxTableHelper(T, 50, 21.02, 2281.226)
        return sum;
    }

    function calculateSolsEquiJDE(Y, num1, num2, num3, num4, num5) {
        return num1 + num2*Y + num3*Y**2 + num4*Y**3 + num5*Y**4;
    }

    // Get the JDE for the event
    const year = currentDateTime.getUTCFullYear();
    if (year > 999) {
        const Y = (year-2000)/1000;
        let JDE_ = 0;
        if (season === 'spring') {
            JDE_ = calculateSolsEquiJDE(Y, 2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057);
        }
        if (season === 'summer') {
            JDE_ = calculateSolsEquiJDE(Y, 2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030);
        }
        if (season === 'autumn') {
            JDE_ = calculateSolsEquiJDE(Y, 2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078);
        }
        if (season === 'winter') {
            JDE_ = calculateSolsEquiJDE(Y, 2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032);
        }
        const T = (JDE_ - 2451545)/36525;
        const W = 35999.373*T - 2.47;
        const DeltaLambda =  1 + (0.0334 * Math.cos(W* Math.PI / 180)) + (0.0007 * Math.cos(2*W* Math.PI / 180));
        const S = sumSolsticeEquinoxTable(T);
        const specialDay = JDE_ + ((0.00001*S)/DeltaLambda);
        return new Date(calculateDateFromJDE(specialDay));
    } else {
        const Y = year/1000;
        let JDE_ = 0;
        if (season === 'spring') {
            JDE_ = calculateSolsEquiJDE(Y, 1721139.29189, 365242.13740, 0.06134, 0.00111, -0.00071);
        }
        if (season === 'summer') {
            JDE_ = calculateSolsEquiJDE(Y, 1721233.25401, 365241.72562, -0.05323, 0.00907, 0.00025);
        }
        if (season === 'autumn') {
            JDE_ = calculateSolsEquiJDE(Y, 1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074);
        }
        if (season === 'winter') {
            JDE_ = calculateSolsEquiJDE(Y, 1721414.39987, 365242.88257, -0.00769, -0.00933, -0.00006);
        }
        const T = (JDE_ - 2451545)/36525;
        const W = 35999.373*T - 2.47;
        const DeltaLambda =  1 + (0.0334 * Math.cos(W* Math.PI / 180)) + (0.0007 * Math.cos(2*W* Math.PI / 180));
        const S = sumSolsticeEquinoxTable(T);
        const specialDay = JDE_ + ((0.00001*S)/DeltaLambda);
        return new Date(calculateDateFromJDE(specialDay));
    }
}

// Returns the calculated longitude of the sun
// This equation was sourced from Astronomical Algorithms
function getLongitudeOfSun(currentDateTime) {

    function normalizeAngleTo360(angle) {
        let normalizeAngle = (angle+360)%360;
        if (normalizeAngle<0) {
            normalizeAngle += 360;
        }
        return normalizeAngle;
    }

    const JD = getJulianDayNumber(currentDateTime);
    const T = (JD - 2451545.0)/36525;
    const L =  normalizeAngleTo360(280.46645 + 36000.76983*T + 0.0003032*T**2);
    const M =  normalizeAngleTo360(357.52910 + 35999.05030*T - 0.0001559*T**2 - 0.00000048*T**3);
    const C = + (1.914600 - 0.004817*T - 0.000014*T**2)*Math.sin(M* Math.PI / 180) + (0.019993 - 0.000101*T)*Math.sin((2*M)* Math.PI / 180) + 0.000290*Math.sin((3*M)* Math.PI / 180);
    const sunLongitude = L + C;
    return Number(normalizeAngleTo360(sunLongitude).toFixed(2));
}



//|-----------------------------|
//|     Lunar  Calculations     |
//|-----------------------------|

// Calculates a moon phase
function getMoonPhase(currentDateTime, monthModifier) {
    let year = currentDateTime.getUTCFullYear();
    year += calculateUTCYearFraction(currentDateTime);
    const k = Math.trunc((year - 2000)*12.3685) + monthModifier;
    const T = k/1236.85;
    const E = 1 - 0.002516*T - 0.0000074*T**2;
    const JDE =  2451550.09765 + 29.530588853*k +  0.0001337*T**2 + - 0.000000150*T**3 + 0.00000000073*T**4;
    const SunM = 2.5534 + 29.10535669*k - 0.0000218*T**2 - 0.00000011*T**3;
    const MoonM = 201.5643 + 385.81693528*k + 0.0107438*T**2 + 0.00001239*T**3 - 0.000000058*T**4;
    const F = 160.7108 + 390.67050274*k - 0.0016341*T**2 - 0.00000227*T**3 + 0.000000011*T**4;
    const lunarNode = 124.7746 - 1.56375580*k + 0.0020691*T**2 + 0.00000215*T**3;
    const sumOfAllPhaseTable = allLunarPhaseTable(k, T);
    let tableSum = 0;
    if (monthModifier % 1 === 0) {
        tableSum = sumNewMoonTable(SunM, MoonM, F, E, lunarNode);
    }
    else if (monthModifier % 1 === 0.5) {
        tableSum = sumFullMoonTable(SunM, MoonM, F, E, lunarNode);
    }
    else {
        tableSum = sumQuarterMoonTable(SunM, MoonM, F, E, lunarNode, monthModifier);
    }    

    const calculatedMoonPhaseJDE = JDE + sumOfAllPhaseTable + tableSum;
    return new Date(calculateDateFromJDE(calculatedMoonPhaseJDE));
}

// Sum the New Moon table from Astronomical Algorithms
function sumNewMoonTable(SunM, MoonM, F, E, lunarNode) {
    function sumNewMoonTableHelper(num1, num2) {
        return num1 * Math.sin((num2)* Math.PI / 180)
    }
    const sum =
        sumNewMoonTableHelper(-0.40720, MoonM) +
        sumNewMoonTableHelper(0.17241*E, SunM) +
        sumNewMoonTableHelper(0.01608, MoonM*2) +
        sumNewMoonTableHelper(0.01039, F*2) +
        sumNewMoonTableHelper(0.00739*E, MoonM-SunM) +
        sumNewMoonTableHelper(-0.00514*E, MoonM+SunM) +
        sumNewMoonTableHelper(0.00208*E*E, SunM*2) +
        sumNewMoonTableHelper(-0.00111, MoonM-F*2) +
        sumNewMoonTableHelper(-0.00057, MoonM + F*2) +
        sumNewMoonTableHelper(0.00056*E, 2*MoonM + SunM) +
        sumNewMoonTableHelper(-0.00042, 3*MoonM) +
        sumNewMoonTableHelper(0.00042*E, SunM + F*2) +
        sumNewMoonTableHelper(0.00038*E, SunM - F*2) +
        sumNewMoonTableHelper(-0.00024*E, 2*MoonM-SunM) +
        sumNewMoonTableHelper(-0.00017, lunarNode) +
        sumNewMoonTableHelper(-0.00007, MoonM+2*SunM) +
        sumNewMoonTableHelper(0.00004, 2*MoonM - 2*F) +
        sumNewMoonTableHelper(0.00004, 3*SunM) +
        sumNewMoonTableHelper(0.00003, SunM + MoonM - 2*F) +
        sumNewMoonTableHelper(0.00003, 2*MoonM + 2*F) +
        sumNewMoonTableHelper(-0.00003, SunM + MoonM + 2*F) +
        sumNewMoonTableHelper(0.00003, MoonM - SunM + 2*F) +
        sumNewMoonTableHelper(-0.00002, MoonM - SunM - 2*F) +
        sumNewMoonTableHelper(-0.00002, MoonM*3 + SunM) +
        sumNewMoonTableHelper(0.00002, MoonM*4);
    return sum;
}

// Sum the New Moon table from Astronomical Algorithms
function sumFullMoonTable(SunM, MoonM, F, E, lunarNode) {
    function sumFullMoonTableHelper(num1, num2) {
        return num1 * Math.sin((num2)* Math.PI / 180)
    }
    const sum =
        sumFullMoonTableHelper(-0.40614, MoonM) +
        sumFullMoonTableHelper(0.17302*E, SunM) +
        sumFullMoonTableHelper(0.01614, MoonM*2) +
        sumFullMoonTableHelper(0.01043, F*2) +
        sumFullMoonTableHelper(0.00734*E, MoonM-SunM) +
        sumFullMoonTableHelper(-0.00515*E, MoonM+SunM) +
        sumFullMoonTableHelper(0.00209*E*E, SunM*2) +
        sumFullMoonTableHelper(-0.00111, MoonM-F*2) +
        sumFullMoonTableHelper(-0.00057, MoonM + F*2) +
        sumFullMoonTableHelper(0.00056*E, 2*MoonM + SunM) +
        sumFullMoonTableHelper(-0.00042, 3*MoonM) +
        sumFullMoonTableHelper(0.00042*E, SunM + F*2) +
        sumFullMoonTableHelper(0.00038*E, SunM - F*2) +
        sumFullMoonTableHelper(-0.00024*E, 2*MoonM-SunM) +
        sumFullMoonTableHelper(-0.00017, lunarNode) +
        sumFullMoonTableHelper(-0.00007, MoonM+2*SunM) +
        sumFullMoonTableHelper(0.00004, 2*MoonM - 2*F) +
        sumFullMoonTableHelper(0.00004, 3*SunM) +
        sumFullMoonTableHelper(0.00003, SunM + MoonM - 2*F) +
        sumFullMoonTableHelper(0.00003, 2*MoonM + 2*F) +
        sumFullMoonTableHelper(-0.00003, SunM + MoonM + 2*F) +
        sumFullMoonTableHelper(0.00003, MoonM - SunM + 2*F) +
        sumFullMoonTableHelper(-0.00002, MoonM - SunM - 2*F) +
        sumFullMoonTableHelper(-0.00002, MoonM*3 + SunM) +
        sumFullMoonTableHelper(0.00002, MoonM*4);
    return sum;
}

// Sum the New Moon table from Astronomical Algorithms
function sumQuarterMoonTable(SunM, MoonM, F, E, lunarNode, monthModifier) {
    function sumQuarterMoonTableHelper(num1, num2) {
        return num1 * Math.sin((num2)* Math.PI / 180)
    }
    function sumQuarterMoonTableHelperW(num1, num2) {
        return num1 * Math.cos((num2)* Math.PI / 180)
    }
    let sum =
        sumQuarterMoonTableHelper(-0.62801, MoonM) +
        sumQuarterMoonTableHelper(0.17172*E, SunM) +
        sumQuarterMoonTableHelper(-0.01183*E, MoonM+SunM) +
        sumQuarterMoonTableHelper(0.00862, MoonM*2) +
        sumQuarterMoonTableHelper(0.00804, F*2) +
        sumQuarterMoonTableHelper(0.00454*E, MoonM-SunM) +
        sumQuarterMoonTableHelper(0.00204*E*E, SunM*2) +
        sumQuarterMoonTableHelper(-0.00180, MoonM-F*2) +
        sumQuarterMoonTableHelper(-0.00070, MoonM + F*2) +
        sumQuarterMoonTableHelper(-0.00040, 3*MoonM) +
        sumQuarterMoonTableHelper(-0.00034*E, 2*MoonM-SunM) +
        sumQuarterMoonTableHelper(0.00032*E, SunM + F*2) +
        sumQuarterMoonTableHelper(0.00032*E, SunM - F*2) +
        sumQuarterMoonTableHelper(-0.00028*E*E, MoonM+SunM*2) +
        sumQuarterMoonTableHelper(0.00027*E, MoonM*2+SunM) +
        sumQuarterMoonTableHelper(-0.00017, lunarNode) +
        sumQuarterMoonTableHelper(-0.00005, MoonM-SunM - 2*F) +
        sumQuarterMoonTableHelper(0.00004, MoonM*2+F*2) +
        sumQuarterMoonTableHelper(-0.00004, SunM + MoonM + 2*F) +
        sumQuarterMoonTableHelper(0.00004, MoonM - SunM*2) +
        sumQuarterMoonTableHelper(0.00003, SunM + MoonM - 2*F) +
        sumQuarterMoonTableHelper(0.00003, 3*SunM) +
        sumQuarterMoonTableHelper(0.00002, 2*MoonM - 2*F) +
        sumQuarterMoonTableHelper(0.00002, MoonM - SunM + F*2) +
        sumQuarterMoonTableHelper(-0.00002, MoonM*3+SunM);
    
    const w = 0.00306 -
        sumQuarterMoonTableHelperW(0.00038*E, SunM) +
        sumQuarterMoonTableHelperW(0.00026, MoonM) +
        sumQuarterMoonTableHelperW(-0.00002, MoonM-SunM) +
        sumQuarterMoonTableHelperW(0.00002, MoonM+SunM) +
        sumQuarterMoonTableHelperW(0.00002, F*2);

    if (monthModifier % 1 === 0.25) {
        sum += w;
    }
    else {
        sum -= w;
    }
    return sum;
}

// Sum the All Phases table from Astronomical Algorithms
function allLunarPhaseTable(k, T) {
    function allPhaseTableHelper(num, A) {
        return num*Math.sin(A* Math.PI / 180);
    }

    const A1 = 299.77+0.107408*k-0.009173*T**2;
    const A2 = 251.88+0.016321*k;
    const A3 = 251.83+26.651886*k;
    const A4 = 349.42+36.412478*k;
    const A5 = 84.66+18.206239*k;
    const A6 = 141.74+53.303771*k;
    const A7 = 207.14+2.453732*k;
    const A8 = 154.84+7.306860*k;
    const A9 = 34.52+27.261239*k;
    const A10 = 207.19+0.121824*k;
    const A11 = 291.34+1.844379*k;
    const A12 = 161.72+24.198154*k;
    const A13 = 239.56+25.513099*k;
    const A14 = 331.55+3.592518*k;
    let sum = allPhaseTableHelper(0.000325, A1) +
        allPhaseTableHelper(0.000165, A2) +
        allPhaseTableHelper(0.000164, A3) +
        allPhaseTableHelper(0.000126, A4) +
        allPhaseTableHelper(0.000110, A5) +
        allPhaseTableHelper(0.000062, A6) +
        allPhaseTableHelper(0.000060, A7) +
        allPhaseTableHelper(0.000056, A8) +
        allPhaseTableHelper(0.000047, A9) +
        allPhaseTableHelper(0.000042, A10) +
        allPhaseTableHelper(0.000040, A11) +
        allPhaseTableHelper(0.000037, A12) +
        allPhaseTableHelper(0.000035, A13) +
        allPhaseTableHelper(0.000023, A14);
    return sum;
}

// Get formatted information about the next solar eclipse
function getNextSolarLunarEclipse(currentDateTime, monthModifier) {
    let year = currentDateTime.getUTCFullYear();
    year += calculateUTCYearFraction(currentDateTime);
    const k = Math.trunc((year - 2000)*12.3685) + monthModifier;
    const T = k/1236.85;
    const F = 160.7108 + 390.67050274*k - 0.0016341*T**2 - 0.00000227*T**3 + 0.000000011*T**4;

    // Eclipse is impossible
    if (Math.abs(Math.sin(F*(Math.PI / 180)))>0.36) {
        return getNextSolarLunarEclipse(currentDateTime, monthModifier+1);
    }

    // Calculate a bunch of values from Astronomical Algorithms
    const E = 1 - 0.002516*T - 0.0000074*T**2;
    const SunM = 2.5534 + 29.10535669*k - 0.0000218*T**2 - 0.00000011*T**3;
    const MoonM = 201.5643 + 385.81693528*k + 0.0107438*T**2 + 0.00001239*T**3 - 0.000000058*T**4;
    const lunarNode = 124.7746 - 1.56375580*k + 0.0020691*T**2 + 0.00000215*T**3;
    const F1 = F - 0.02665 * Math.sin(lunarNode*(Math.PI / 180));
    const A1 = 299.77 + (0.107408*k) - (0.009173*T**2);

    function PTableHelper(num1, num2) {
        return num1*Math.sin(num2*(Math.PI / 180));
    }
    const P = PTableHelper(0.2070*E, SunM) +
        PTableHelper(0.0024*E, 2*SunM) +
        PTableHelper(-0.0392, MoonM) +
        PTableHelper(0.0116, 2*MoonM) +
        PTableHelper(-0.0073*E, MoonM+SunM) +
        PTableHelper(0.0067*E, MoonM-SunM) +
        PTableHelper(0.0118, 2*F1);

    function QTableHelper(num1, num2) {
        return num1*Math.cos(num2*(Math.PI / 180));
    }
    const Q = 5.2207+
        QTableHelper(-0.0048*E, SunM) +
        QTableHelper(0.0020*E, 2*SunM) +
        QTableHelper(-0.3299, MoonM) +
        QTableHelper(-0.0060*E, MoonM+SunM) +
        QTableHelper(0.0041*E, MoonM-SunM);

    const W = Math.abs(Math.cos(F1*(Math.PI / 180)));
    const Y = (P*Math.cos(F1*(Math.PI / 180))+Q*Math.sin(F1*(Math.PI / 180)))*(1-0.0048*W);

    function uTableHelper(num1, num2) {
        return num1*Math.cos(num2*(Math.PI / 180));
    }
    const u = 0.0059 +
        uTableHelper(0.0046*E, SunM) +
        uTableHelper(-0.0182, MoonM) +
        uTableHelper(0.0004, 2*MoonM) +
        uTableHelper(-0.0005, SunM+MoonM);

    // Calculate Lunar Node, Ascending if ~360 and Descending if ~180
    let eclipseNode = 'Ascending';
    let Fdegrees = F %360;
    if (Fdegrees < 0) {
        Fdegrees += 360;
    }
    if ((Fdegrees < 200)&&(Fdegrees > 160)) {
        eclipseNode = 'Descending';
    }

    // Calculate which hemisphere it will occur in
    let hemisphere = '';
    if (Y>0) {
        hemisphere = 'Northern Hemisphere'
    } else {
        hemisphere = 'Southern Hemisphere'
    }

    let eclipseType = 'None';

    // Lunar Eclipse
    if ((monthModifier%1)===0.5) {
        // Not an umbral eclipse
        const umbra = 0.7403 - u;
        const umbralEclipseMagnitude = (1.0128 - u - Math.abs(Y))/0.5450;
        if (umbralEclipseMagnitude < 0) {
            eclipseType = 'Penumbral';
        }

        const umbralP = 1.0128 - u;
        const umbralT = 0.4678 - u;
        const umbraln = 0.5458 + 0.0400 * Math.cos(MoonM*(Math.PI / 180));

        // Partial phase
        const partialPhase = (60 / umbraln) * Math.sqrt(Math.pow(umbralP, 2) - Math.pow(Y, 2));

        // Total phase
        const totalPhase = (60 / umbraln) * Math.sqrt(Math.pow(umbralT, 2) - Math.pow(Y, 2));

        if (partialPhase>0) {
            eclipseType = 'Partial';
        }

        if (totalPhase>0) {
            eclipseType = 'Total';
        }

    // Solar Eclipse
    } else {
        // Umbra cannot be seen from Earth, not a solar eclipse
        if (Math.abs(Y) > 1.5433+u) {
            return getNextSolarLunarEclipse(currentDateTime, monthModifier+1);
        }

        // Central eclipse

        if ((Y>-0.9972)&&(Y<0.9972)) {
            eclipseType = 'Annular';
            if (u < 0) {
                eclipseType = 'Total';
            }
        } else {
            eclipseType = 'Partial';
        }
    }

    // Get date of eclipse
    const eclipseDate = getMoonPhase(currentDateTime, monthModifier)

    return eclipseDate.toUTCString() + '\n' + eclipseType + ' | ' + eclipseNode + '\n' + hemisphere;
}

function getApparentStellarCoordinates(currentDateTime, rightAscension, declination) {
    const variable_alpha = rightAscension;
    const variable_delta = declination;
    const JDE = getJulianEphemerisDay(currentDateTime);

    // Find Nutation
    const variable_T = (JDE-2451545)/36525; // 0.2886705

    const [dPsi, dEpsilon] = getNutationAndObliquity(variable_T);


    const epsilon = (23 + 26/60 + 21.448/3600) + (-46.8150*variable_T - 0.00059*variable_T*variable_T + 0.001813*variable_T*variable_T*variable_T)/3600;

    // Get Sun True Longitude
    const variable_L0 = 280.4665 + (36000.7698 * variable_T) + (0.0003032 * variable_T*variable_T);
    const variable_M = 357.52911 + (35999.05029 * variable_T) + (0.0001537 * variable_T*variable_T);
    const variable_e = 0.016708634 - (0.000042037 * variable_T) - (0.0000001267 * variable_T*variable_T); // 0.016696488600211598 compared to 0.01669649
    const variable_C = (1.914602 - (0.004817 * variable_T) - (0.000014 * variable_T*variable_T)) * Math.sin(variable_M * Math.PI / 180) + (0.019993 - (0.000101 * variable_T)) * Math.sin(2 * variable_M * Math.PI / 180) + 0.000289 * Math.sin(3 * variable_M * Math.PI / 180);
    const sunTrueLongitude = (variable_L0 + variable_C)%360; // 231.32846124391835 compared to 231.328

    const variable_pi = 102.93735 + (1.71946 * variable_T) + (0.00046 * variable_T*variable_T);

    const delta_alpha1 = ((Math.cos(epsilon * Math.PI / 180) + 
        (Math.sin(epsilon * Math.PI / 180) * Math.sin(variable_alpha * Math.PI / 180) * Math.tan(variable_delta * Math.PI / 180))) * dPsi)
         - ((Math.cos(variable_alpha * Math.PI / 180) * Math.tan(variable_delta * Math.PI / 180)) * dEpsilon);

    const delta_delta1 = ((Math.sin(epsilon * Math.PI / 180) * Math.cos(variable_alpha * Math.PI / 180)) * dPsi)
        + (Math.sin(variable_alpha * Math.PI / 180) * dEpsilon);

    const variable_k = 20.49552;


    // New aberration corrections (Delta Alpha 2 and Delta Delta 2)
    const delta_alpha2 = (
        -variable_k * (Math.cos(variable_alpha * Math.PI / 180) * Math.cos(sunTrueLongitude * Math.PI / 180) * Math.cos(epsilon * Math.PI / 180) + Math.sin(variable_alpha * Math.PI / 180) * Math.sin(sunTrueLongitude * Math.PI / 180))
        + variable_e * variable_k * (Math.cos(variable_alpha * Math.PI / 180) * Math.cos(variable_pi * Math.PI / 180) * Math.cos(epsilon * Math.PI / 180) + Math.sin(variable_alpha * Math.PI / 180) * Math.sin(variable_pi * Math.PI / 180))
    ) / Math.cos(variable_delta * Math.PI / 180);

    const temp_sub_expression_delta2 = Math.tan(epsilon * Math.PI / 180) * Math.cos(variable_delta * Math.PI / 180) - Math.sin(variable_alpha * Math.PI / 180) * Math.sin(variable_delta * Math.PI / 180);

    const delta_delta2 = -variable_k * (
        Math.cos(sunTrueLongitude * Math.PI / 180) * Math.cos(epsilon * Math.PI / 180) * temp_sub_expression_delta2
        + Math.cos(variable_alpha * Math.PI / 180) * Math.sin(variable_delta * Math.PI / 180) * Math.sin(sunTrueLongitude * Math.PI / 180)
    ) + variable_e * variable_k * (
        Math.cos(variable_pi * Math.PI / 180) * Math.cos(epsilon * Math.PI / 180) * temp_sub_expression_delta2
        + Math.cos(variable_alpha * Math.PI / 180) * Math.sin(variable_delta * Math.PI / 180) * Math.sin(variable_pi * Math.PI / 180)
    );

    const delta_alpha = rightAscension + (delta_alpha1 + delta_alpha2)/3600;
    const delta_delta = declination + (delta_delta1 + delta_delta2)/3600;

    return [delta_alpha, delta_delta];
}

function getNutationAndObliquity(variable_T) {

    const variable_L  = 280.4665 + 36000.7698 * variable_T;
    const Lprime = 218.3165 + 481267.8813 * variable_T;
    const Omega = 125.04452 - (1934.136261 * variable_T) + (0.0020708 *variable_T*variable_T) + ((variable_T*variable_T*variable_T)/450000);

    const dPsi = -17.20 * Math.sin(Omega * Math.PI / 180)
            -  1.32 * Math.sin(2 * variable_L * Math.PI / 180)
            -  0.23 * Math.sin(2 * Lprime * Math.PI / 180)
            +  0.21 * Math.sin(2 * Omega * Math.PI / 180);

    const dEpsilon = + 9.20 * Math.cos(Omega * Math.PI / 180)
            + 0.57 * Math.cos(2 * variable_L * Math.PI / 180)
            + 0.10 * Math.cos(2 * Lprime * Math.PI / 180)
            - 0.09 * Math.cos(2 * Omega * Math.PI / 180);

    return [dPsi, dEpsilon];
}

function getObliquity(variable_T) {
    const var_U = variable_T/100;
    return (23 + 26/60 + 21.448/3600)
        - (4680.93*var_U - 1.55*var_U*var_U + 1999.25*var_U*var_U*var_U - 51.38*var_U*var_U*var_U*var_U - 249.67*var_U*var_U*var_U*var_U*var_U
            - 39.05*var_U*var_U*var_U*var_U*var_U*var_U + 7.12*var_U*var_U*var_U*var_U*var_U*var_U*var_U + 27.87*var_U*var_U*var_U*var_U*var_U*var_U*var_U*var_U
            - 5.79*var_U*var_U*var_U*var_U*var_U*var_U*var_U*var_U*var_U - 2.45*var_U*var_U*var_U*var_U*var_U*var_U*var_U*var_U*var_U*var_U
        ) / 3600;
}

function getAlphaAndDelta(apparent_lambda, var_epsilon, var_beta) {
    const λ = apparent_lambda * Math.PI / 180;
    const ε = var_epsilon * Math.PI / 180;
    const β = var_beta * Math.PI / 180;
  
    const y = Math.sin(λ) * Math.cos(ε) - Math.tan(β) * Math.sin(ε);
    const x = Math.cos(λ);
  
    // α in radians, correct quadrant
    let α = Math.atan2(y, x);
    if (α < 0) α += 2 * Math.PI;          // normalize to 0..2π
  
    const δ = Math.asin(Math.sin(β) * Math.cos(ε) + Math.cos(β) * Math.sin(ε) * Math.sin(λ));
  
    return [α * 180 / Math.PI, δ * 180 / Math.PI]; // degrees
}

function getPositionOfTheMoon(currentDateTime) {
    const variable_T = ((getJulianDayNumber(currentDateTime) - 2451545.0) / 36525.0);

    const var_L_prime = 218.3164477 + (481267.88123421 * variable_T) - (0.0015786 * variable_T * variable_T) + ((variable_T * variable_T * variable_T) / 538841) - ((variable_T * variable_T * variable_T * variable_T) / 65194000);
    const var_D = 297.8501921 + (445267.1114034 * variable_T) - (0.0018819 * variable_T * variable_T) + ((variable_T * variable_T * variable_T) / 545868) - ((variable_T * variable_T * variable_T * variable_T) / 113065000);
    const var_M = 357.5291092 + (35999.0502909 * variable_T) - (0.0001536 * variable_T * variable_T) - ((variable_T * variable_T * variable_T) / 24490000);

    const var_M_prime = 134.9633964 + (477198.8675055 * variable_T) + (0.0087414 * variable_T * variable_T) + ((variable_T * variable_T * variable_T) / 69699) - ((variable_T * variable_T * variable_T * variable_T) / 14712000);

    const var_F = 93.2720950 + (483202.0175233 * variable_T) - (0.0036539 * variable_T * variable_T) + ((variable_T * variable_T * variable_T) / 3526000) - ((variable_T * variable_T * variable_T * variable_T) / 863310000);
    const var_A1 = 119.75 + (131.849 * variable_T);
    const var_A2 = 53.09 + (479264.290 * variable_T);
    const var_A3 = 313.45 + (481266.484 * variable_T);

    // Define E based on the provided formula (Equation 47.6)
    const var_E = 1 - (0.002516 * variable_T) - (0.0000074 * variable_T * variable_T);

    // Lunar perturbation coefficients table
    const lunarPerturbations = [
        { D: 0, M: 0, M_prime: 1, F: 0, SigmaL: 6288774, SigmaR: -20905355 },
        { D: 2, M: 0, M_prime: -1, F: 0, SigmaL: 1274027, SigmaR: -3699111 },
        { D: 2, M: 0, M_prime: 0, F: 0, SigmaL: 658314, SigmaR: -2955968 },
        { D: 0, M: 0, M_prime: 2, F: 0, SigmaL: 213618, SigmaR: -569925 },
        { D: 0, M: 1, M_prime: 0, F: 0, SigmaL: -185116, SigmaR: 48888 },
        { D: 0, M: 0, M_prime: 0, F: 2, SigmaL: -114332, SigmaR: -3149 },
        { D: 2, M: 0, M_prime: -2, F: 0, SigmaL: 58793, SigmaR: 246158 },
        { D: 2, M: -1, M_prime: -1, F: 0, SigmaL: 57066, SigmaR: -152138 },
        { D: 2, M: 0, M_prime: 1, F: 0, SigmaL: 53322, SigmaR: -170733 },
        { D: 2, M: -1, M_prime: 0, F: 0, SigmaL: 45758, SigmaR: -204586 },
        { D: 0, M: 1, M_prime: -1, F: 0, SigmaL: -40923, SigmaR: -129620 },
        { D: 1, M: 0, M_prime: 0, F: 0, SigmaL: -34720, SigmaR: 108743 },
        { D: 0, M: 1, M_prime: 1, F: 0, SigmaL: -30383, SigmaR: 104755 },
        { D: 2, M: 0, M_prime: 0, F: -2, SigmaL: 15327, SigmaR: 10321 },
        { D: 0, M: 0, M_prime: 1, F: 2, SigmaL: -12528, SigmaR: null },
        { D: 0, M: 0, M_prime: 1, F: -2, SigmaL: 10980, SigmaR: 79661 },
        { D: 4, M: 0, M_prime: -1, F: 0, SigmaL: 10675, SigmaR: -34782 },
        { D: 0, M: 0, M_prime: 3, F: 0, SigmaL: 10034, SigmaR: -23210 },
        { D: 4, M: 0, M_prime: -2, F: 0, SigmaL: 8548, SigmaR: -21636 },
        { D: 2, M: 1, M_prime: -1, F: 0, SigmaL: -7888, SigmaR: 24208 },
        { D: 2, M: 1, M_prime: 0, F: 0, SigmaL: -6766, SigmaR: 30824 },
        { D: 1, M: 0, M_prime: -1, F: 0, SigmaL: -5163, SigmaR: -8379 },
        { D: 1, M: 1, M_prime: 0, F: 0, SigmaL: 4987, SigmaR: -16675 },
        { D: 2, M: -1, M_prime: 1, F: 0, SigmaL: 4036, SigmaR: -12831 },
        { D: 2, M: 0, M_prime: 2, F: 0, SigmaL: 3994, SigmaR: -10445 },
        { D: 4, M: 0, M_prime: 0, F: 0, SigmaL: 3861, SigmaR: -11650 },
        { D: 2, M: 0, M_prime: -3, F: 0, SigmaL: 3665, SigmaR: 14403 },
        { D: 0, M: 1, M_prime: -2, F: 0, SigmaL: -2689, SigmaR: -7003 },
        { D: 2, M: 0, M_prime: -1, F: 2, SigmaL: -2602, SigmaR: null },
        { D: 2, M: -1, M_prime: -2, F: 0, SigmaL: 2390, SigmaR: 10056 },
        { D: 1, M: 0, M_prime: 1, F: 0, SigmaL: -2348, SigmaR: 6322 },
        { D: 2, M: -2, M_prime: 0, F: 0, SigmaL: 2236, SigmaR: -9884 },
        
        { D: 0, M: 1, M_prime: 2, F: 0, SigmaL: -2120, SigmaR: 5751 },
        { D: 0, M: 2, M_prime: 0, F: 0, SigmaL: -2069, SigmaR: null },
        { D: 2, M: -2, M_prime: -1, F: 0, SigmaL: 2048, SigmaR: -4950 },
        { D: 2, M: 0, M_prime: 1, F: -2, SigmaL: -1773, SigmaR: 4130 },
        { D: 2, M: 0, M_prime: 0, F: 2, SigmaL: -1595, SigmaR: null },
        { D: 4, M: -1, M_prime: -1, F: 0, SigmaL: 1215, SigmaR: -3958 },
        { D: 0, M: 0, M_prime: 2, F: 2, SigmaL: -1110, SigmaR: null },
        { D: 3, M: 0, M_prime: -1, F: 0, SigmaL: -892, SigmaR: 3258 },
        { D: 2, M: 1, M_prime: 1, F: 0, SigmaL: -810, SigmaR: 2616 },
        { D: 4, M: -1, M_prime: -2, F: 0, SigmaL: 759, SigmaR: -1897 },
        { D: 0, M: 2, M_prime: -1, F: 0, SigmaL: -713, SigmaR: -2117 },
        { D: 2, M: 2, M_prime: -1, F: 0, SigmaL: -700, SigmaR: 2354 },
        { D: 2, M: 1, M_prime: -2, F: 0, SigmaL: 691, SigmaR: null },
        { D: 2, M: -1, M_prime: 0, F: -2, SigmaL: 596, SigmaR: null },
        { D: 4, M: 0, M_prime: 1, F: 0, SigmaL: 549, SigmaR: -1423 },
        { D: 0, M: 0, M_prime: 4, F: 0, SigmaL: 537, SigmaR: -1117 },
        { D: 4, M: -1, M_prime: 0, F: 0, SigmaL: 520, SigmaR: -1571 },
        { D: 1, M: 0, M_prime: -2, F: 0, SigmaL: -487, SigmaR: -1739 },
        { D: 2, M: 1, M_prime: 0, F: -2, SigmaL: -399, SigmaR: null },
        { D: 0, M: 0, M_prime: 2, F: -2, SigmaL: -381, SigmaR: -4421 },
        { D: 1, M: 1, M_prime: 1, F: 0, SigmaL: 351, SigmaR: null },
        { D: 3, M: 0, M_prime: -2, F: 0, SigmaL: -340, SigmaR: null },
        { D: 4, M: 0, M_prime: -3, F: 0, SigmaL: 330, SigmaR: null },
        { D: 2, M: -1, M_prime: 2, F: 0, SigmaL: 327, SigmaR: null },
        { D: 0, M: 2, M_prime: 1, F: 0, SigmaL: -323, SigmaR: 1165 },
        { D: 1, M: 1, M_prime: -1, F: 0, SigmaL: 299, SigmaR: null },
        { D: 2, M: 0, M_prime: 3, F: 0, SigmaL: 294, SigmaR: null },
        { D: 2, M: 0, M_prime: -1, F: -2, SigmaL: null, SigmaR: 8752 }
    ];

    // Additional lunar perturbation coefficients (sine terms only)
    const additionalLunarPerturbations = [
        { D: 0, M: 0, M_prime: 0, F: 1, SigmaB: 5128122 },
        { D: 0, M: 0, M_prime: 1, F: 1, SigmaB: 280602 },
        { D: 0, M: 0, M_prime: 1, F: -1, SigmaB: 277693 },
        { D: 2, M: 0, M_prime: 0, F: -1, SigmaB: 173237 },
        { D: 2, M: 0, M_prime: -1, F: 1, SigmaB: 55413 },
        { D: 2, M: 0, M_prime: -1, F: -1, SigmaB: 46271 },
        { D: 2, M: 0, M_prime: 0, F: 1, SigmaB: 32573 },
        { D: 0, M: 0, M_prime: 2, F: 1, SigmaB: 17198 },
        { D: 2, M: 0, M_prime: 1, F: -1, SigmaB: 9266 },
        { D: 0, M: 0, M_prime: 2, F: -1, SigmaB: 8822 },
        { D: 2, M: -1, M_prime: 0, F: -1, SigmaB: 8216 },
        { D: 2, M: 0, M_prime: -2, F: -1, SigmaB: 4324 },
        { D: 2, M: 0, M_prime: 1, F: 1, SigmaB: 4200 },
        { D: 2, M: 1, M_prime: 0, F: -1, SigmaB: -3359 },
        { D: 2, M: -1, M_prime: -1, F: 1, SigmaB: 2463 },
        { D: 2, M: -1, M_prime: 0, F: 1, SigmaB: 2211 },
        { D: 2, M: -1, M_prime: -1, F: -1, SigmaB: 2065 },
        { D: 0, M: 1, M_prime: -1, F: -1, SigmaB: -1870 },
        { D: 4, M: 0, M_prime: -1, F: -1, SigmaB: 1828 },
        { D: 0, M: 1, M_prime: 0, F: 1, SigmaB: -1794 },
        { D: 0, M: 0, M_prime: 0, F: 3, SigmaB: -1749 },
        { D: 0, M: 1, M_prime: -1, F: 1, SigmaB: -1565 },
        { D: 1, M: 0, M_prime: 0, F: 1, SigmaB: -1491 },
        { D: 0, M: 1, M_prime: 1, F: 1, SigmaB: -1475 },
        { D: 0, M: 1, M_prime: 1, F: -1, SigmaB: -1410 },
        { D: 0, M: 1, M_prime: 0, F: -1, SigmaB: -1344 },
        { D: 1, M: 0, M_prime: 0, F: -1, SigmaB: -1335 },
        { D: 0, M: 0, M_prime: 3, F: 1, SigmaB: 1107 },
        { D: 4, M: 0, M_prime: 0, F: -1, SigmaB: 1021 },
        { D: 4, M: 0, M_prime: -1, F: 1, SigmaB: 833 },
        
        { D: 0, M: 0, M_prime: 1, F: -3, SigmaB: 777 },
        { D: 4, M: 0, M_prime: -2, F: 1, SigmaB: 671 },
        { D: 2, M: 0, M_prime: 0, F: -3, SigmaB: 607 },
        { D: 2, M: 0, M_prime: 2, F: -1, SigmaB: 596 },
        { D: 2, M: -1, M_prime: 1, F: -1, SigmaB: 491 },
        { D: 2, M: 0, M_prime: -2, F: 1, SigmaB: -451 },
        { D: 0, M: 0, M_prime: 3, F: -1, SigmaB: 439 },
        { D: 2, M: 0, M_prime: 2, F: 1, SigmaB: 422 },
        { D: 2, M: 0, M_prime: -3, F: -1, SigmaB: 421 },
        { D: 2, M: 1, M_prime: -1, F: 1, SigmaB: -366 },
        { D: 2, M: 1, M_prime: 0, F: 1, SigmaB: -351 },
        { D: 4, M: 0, M_prime: 0, F: 1, SigmaB: 331 },
        { D: 2, M: -1, M_prime: 1, F: 1, SigmaB: 315 },
        { D: 2, M: -2, M_prime: 0, F: -1, SigmaB: 302 },
        { D: 0, M: 0, M_prime: 1, F: 3, SigmaB: -283 },
        { D: 2, M: 1, M_prime: 1, F: -1, SigmaB: -229 },
        { D: 1, M: 1, M_prime: 0, F: -1, SigmaB: 223 },
        { D: 1, M: 1, M_prime: 0, F: 1, SigmaB: 223 },
        { D: 0, M: 1, M_prime: -2, F: -1, SigmaB: -220 },
        { D: 2, M: 1, M_prime: -1, F: -1, SigmaB: -220 },
        { D: 1, M: 0, M_prime: 1, F: 1, SigmaB: -185 },
        { D: 2, M: -1, M_prime: -2, F: -1, SigmaB: 181 },
        { D: 0, M: 1, M_prime: 2, F: 1, SigmaB: -177 },
        { D: 4, M: 0, M_prime: -2, F: -1, SigmaB: 176 },
        { D: 4, M: -1, M_prime: -1, F: -1, SigmaB: 166 },
        { D: 1, M: 0, M_prime: 1, F: -1, SigmaB: -164 },
        { D: 4, M: 0, M_prime: 1, F: -1, SigmaB: 132 },
        { D: 1, M: 0, M_prime: -1, F: -1, SigmaB: -119 },
        { D: 4, M: -1, M_prime: 0, F: -1, SigmaB: 115 },
        { D: 2, M: -2, M_prime: 0, F: 1, SigmaB: 107 }
    ];

    // Calculate lunar perturbations
    let sumSigmaL = 0;
    let sumSigmaR = 0;
    let sumSigmaB = 0;

    // Process lunar perturbation terms with eccentricity correction
    for (const term of lunarPerturbations) {
        const arg = (term.D * var_D) + (term.M * var_M) + (term.M_prime * var_M_prime) + (term.F * var_F);
        const argRad = arg * Math.PI / 180;
        
        // Apply eccentricity correction factor E
        let sigmaL = term.SigmaL;
        let sigmaR = term.SigmaR;
        
        // Terms with M or -M in argument: multiply coefficient by E
        if (Math.abs(term.M) === 1) {
            sigmaL *= var_E;
            if (sigmaR !== null) sigmaR *= var_E;
        }
        // Terms with 2M or -2M in argument: multiply coefficient by E^2
        else if (Math.abs(term.M) === 2) {
            sigmaL *= var_E * var_E;
            if (sigmaR !== null) sigmaR *= var_E * var_E;
        }
        
        sumSigmaL += sigmaL * Math.sin(argRad);
        if (sigmaR !== null) {
            sumSigmaR += sigmaR * Math.cos(argRad);
        }
    }

    // Process additional lunar perturbation terms (sine terms only)
    for (const term of additionalLunarPerturbations) {
        const arg = (term.D * var_D) + (term.M * var_M) + (term.M_prime * var_M_prime) + (term.F * var_F);
        const argRad = arg * Math.PI / 180;
        
        // Apply eccentricity correction factor E
        let sigmaB = term.SigmaB;
        
        
        sumSigmaB += sigmaB * Math.sin(argRad);
    }

    const add_to_SigmaL = 3958*Math.sin(var_A1*Math.PI/180) + 1962*Math.sin((var_L_prime - var_F)*Math.PI/180) + 318*Math.sin(var_A2*Math.PI/180);

    const add_to_SigmaB = -2235*Math.sin(var_L_prime*Math.PI/180) + 
        382*Math.sin(var_A3*Math.PI/180) + 
        175*Math.sin((var_A1-var_F)*Math.PI/180) + 
        175*Math.sin((var_A1+var_F)*Math.PI/180) +
        127*Math.sin((var_L_prime-var_M_prime)*Math.PI/180) -
        115*Math.sin((var_L_prime+var_M_prime)*Math.PI/180);

    sumSigmaL += add_to_SigmaL;
    sumSigmaB += add_to_SigmaB;


    const var_lambda = var_L_prime + sumSigmaL/1000000;
    const var_beta = sumSigmaB/1000000;
    const var_delta = 385000.56 + (sumSigmaR/1000);

    const var_pi = Math.asin(6378.14 / var_delta);
    const var_pi_deg = var_pi * (180 / Math.PI);

    const [dPsi, dEpsilon] = getNutationAndObliquity(variable_T);
    const epsilon0 = getObliquity(variable_T);

    const var_epsilon = epsilon0 + (dEpsilon/3600);

    const apparent_lambda = var_lambda + (dPsi/3600);

    return getAlphaAndDelta(apparent_lambda, var_epsilon, var_beta);

}