//|---------------------------|
//|     Astronomical Data     |
//|---------------------------|

// A set of functions for calculating data in the Astronomical Data category.

// Manages the global list of new moons
let allNewMoons = [];

// Generate a list of all new moons to reduce resource usage
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

// Get a new moon from the allNewMoons list, with lunations = 0 being just before the date
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
    const seasons = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
    const centerYear = currentDateTime.getUTCFullYear();
    const solsticesEquinoxes = [];

    for (let yearOffset = -3; yearOffset <= 3; yearOffset++) {
        const year = centerYear + yearOffset;

        for (const season of seasons) {
            const date = getSolsticeOrEquinox(createAdjustedDateTime({currentDateTime: currentDateTime, year: year, month: 1, day: 1}), season);
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
    let unfixedDateTime = createAdjustedDateTime({year: year, month: month, day: day, hour: hours, minute: minutes, second: seconds});
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
    let yearStart = createAdjustedDateTime({year: year, month: 1, day: 1});
    let nextYearStart = createAdjustedDateTime({year: year + 1, month: 1, day: 1});
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
        if (season === 'SPRING') {
            JDE_ = calculateSolsEquiJDE(Y, 2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057);
        }
        if (season === 'SUMMER') {
            JDE_ = calculateSolsEquiJDE(Y, 2451716.56767, 365241.62603, 0.00325, 0.00888, -0.00030);
        }
        if (season === 'AUTUMN') {
            JDE_ = calculateSolsEquiJDE(Y, 2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078);
        }
        if (season === 'WINTER') {
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
        if (season === 'SPRING') {
            JDE_ = calculateSolsEquiJDE(Y, 1721139.29189, 365242.13740, 0.06134, 0.00111, -0.00071);
        }
        if (season === 'SUMMER') {
            JDE_ = calculateSolsEquiJDE(Y, 1721233.25401, 365241.72562, -0.05323, 0.00907, 0.00025);
        }
        if (season === 'AUTUMN') {
            JDE_ = calculateSolsEquiJDE(Y, 1721325.70455, 365242.49558, -0.11677, -0.00297, 0.00074);
        }
        if (season === 'WINTER') {
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

// Taken from Astronomical Algorithms
function getPositionOfTheMoon(currentDateTime) {
    const T = ((getJulianDayNumber(currentDateTime) - 2451545.0) / 36525.0);

    // Get all variables
    const L_prime = 218.3164477 + (481267.88123421 * T) - (0.0015786 * T**2) + ((T**3) / 538841) - ((T**4) / 65194000);
    const D = 297.8501921 + (445267.1114034 * T) - (0.0018819 * T**2) + ((T**3) / 545868) - ((T**4) / 113065000);
    const M = 357.5291092 + (35999.0502909 * T) - (0.0001536 * T**2) - ((T**3) / 24490000);
    const M_prime = 134.9633964 + (477198.8675055 * T) + (0.0087414 * T**2) + ((T**3) / 69699) - ((T**4) / 14712000);
    const F = 93.2720950 + (483202.0175233 * T) - (0.0036539 * T**2) + ((T**3) / 3526000) - ((T**4) / 863310000);
    const A1 = 119.75 + (131.849 * T);
    const A2 = 53.09 + (479264.290 * T);
    const A3 = 313.45 + (481266.484 * T);

    // Define E based on the provided formula (Equation 47.6)
    const E = 1 - (0.002516 * T) - (0.0000074 * T**2);

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

    // Additional lunar perturbation coefficients
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
    let sumΣL = 0;
    let sumΣR = 0;
    let sumΣB = 0;

    // Process lunar perturbation terms with eccentricity correction
    for (const term of lunarPerturbations) {
        const arg = (term.D * D) + (term.M * M) + (term.M_prime * M_prime) + (term.F * F);
        const argRad = radians(arg);
        
        // Apply eccentricity correction
        let ΣL = term.SigmaL;
        let ΣR = term.SigmaR;
        
        // Terms with M or -M in argument: multiply coefficient by E
        if (Math.abs(term.M) === 1) {
            ΣL *= E;
            if (ΣR !== null) ΣR *= E;
        }
        // Terms with 2M or -2M in argument: multiply coefficient by E^2
        else if (Math.abs(term.M) === 2) {
            ΣL *= E * E;
            if (ΣR !== null) ΣR *= E * E;
        }
        
        sumΣL += ΣL * Math.sin(argRad);
        if (ΣR !== null) {
            sumΣR += ΣR * Math.cos(argRad);
        }
    }

    // Process additional lunar perturbation terms (sine terms only)
    for (const term of additionalLunarPerturbations) {
        const arg = (term.D * D) + (term.M * M) + (term.M_prime * M_prime) + (term.F * F);
        const argRad = radians(arg);
        
        // Apply eccentricity correction factor E
        let ΣB = term.SigmaB;
        
        sumΣB += ΣB * Math.sin(argRad);
    }

    const add_to_ΣL = 3958*Math.sin(radians(A1)) + 1962*Math.sin(radians(L_prime - F)) + 318*Math.sin(radians(A2));

    const add_to_ΣB = -2235*Math.sin(radians(L_prime)) + 
        382*Math.sin(radians(A3)) + 
        175*Math.sin(radians(A1-F)) + 
        175*Math.sin(radians(A1+F)) +
        127*Math.sin(radians(L_prime-M_prime)) -
        115*Math.sin(radians(L_prime+M_prime));

    sumΣL += add_to_ΣL;
    sumΣB += add_to_ΣB;

    // Get remaining variables
    const λ = L_prime + sumΣL/1000000;
    const β = sumΣB/1000000;
    const δ = 385000.56 + (sumΣR/1000);
    const var_pi = Math.asin(6378.14 / δ);
    const var_pi_deg = var_pi * (180 / Math.PI);
    const [dPsi, dEpsilon] = getNutationAndObliquity(T);
    const epsilon0 = getObliquity(T);
    const ε = epsilon0 + (dEpsilon/3600);
    const apparent_λ = λ + (dPsi/3600);

    return getAlphaAndDelta(apparent_λ, ε, β);
}


//|-------------------------------|
//|     Stellar  Calculations     |
//|-------------------------------|

// Taken from Astronomical Algorithms
function getApparentStellarCoordinates(currentDateTime, rightAscension, declination) {
    const α = rightAscension;
    const δ = declination;
    const JDE = getJulianEphemerisDay(currentDateTime);

    // Find Nutation
    const T = (JDE-2451545)/36525;
    const [Δψ, Δε] = getNutationAndObliquity(T);
    const ε = (23 + 26/60 + 21.448/3600) + (-46.8150*T - 0.00059*T**2 + 0.001813*T**3)/3600;

    // Get Sun True Longitude
    const L0 = 280.4665 + (36000.7698 * T) + (0.0003032 * T**2);
    const M = 357.52911 + (35999.05029 * T) + (0.0001537 * T**2);
    const e = 0.016708634 - (0.000042037 * T) - (0.0000001267 * T**2);
    const C = (1.914602 - (0.004817 * T)
        - (0.000014 * T**2))
        * Math.sin(radians(M))
        + (0.019993 - (0.000101 * T))
        * Math.sin(2 * radians(M))
        + 0.000289 * Math.sin(3 * radians(M));
    const sunTrueLongitude = (L0 + C)%360;

    const Π = 102.93735 + (1.71946 * T) + (0.00046 * T**2);

    const Δα1 = ((Math.cos(radians(ε)) + 
        (Math.sin(radians(ε)) * Math.sin(radians(α)) * Math.tan(radians(δ)))) * Δψ)
         - ((Math.cos(radians(α)) * Math.tan(radians(δ))) * Δε);

    const Δδ1 = ((Math.sin(radians(ε)) * Math.cos(radians(α))) * Δψ)
        + (Math.sin(radians(α)) * Δε);

    const k = 20.49552;


    // New aberration corrections (Delta Alpha 2 and Delta Delta 2)
    const Δα2 = (
        -k * (Math.cos(radians(α))
        * Math.cos(radians(sunTrueLongitude))
        * Math.cos(radians(ε))
        * + Math.sin(radians(α))
        * Math.sin(radians(sunTrueLongitude)))
        + e
        * k
        * (Math.cos(radians(α))
        * Math.cos(radians(Π))
        * Math.cos(radians(ε))
        + Math.sin(radians(α))
        * Math.sin(radians(Π)))
    ) / Math.cos(radians(δ));

    const temp_sub_expression_δ2 = Math.tan(radians(ε))
        * Math.cos(radians(δ))
        - Math.sin(radians(α))
        * Math.sin(radians(δ));

    const Δδ2 = -k * (
        Math.cos(radians(sunTrueLongitude))
        * Math.cos(radians(ε))
        * temp_sub_expression_δ2
        + Math.cos(radians(α))
        * Math.sin(radians(δ))
        * Math.sin(radians(sunTrueLongitude))
    ) + e * k * (
        Math.cos(radians(Π))
        * Math.cos(radians(ε))
        * temp_sub_expression_δ2
        + Math.cos(radians(α))
        * Math.sin(radians(δ))
        * Math.sin(radians(Π))
    );

    const Δα = rightAscension + (Δα1 + Δα2)/3600;
    const Δδ = declination + (Δδ1 + Δδ2)/3600;

    return [Δα, Δδ];
}

// Taken from Astronomical Algorithms
function getNutationAndObliquity(T) {

    const L  = 280.4665 + 36000.7698 * T;
    const Lprime = 218.3165 + 481267.8813 * T;
    const Ω = 125.04452 - (1934.136261 * T)
        + (0.0020708 *T**2)
        + ((T**3)/450000);

    const Δψ = -17.20 * Math.sin(radians(Ω))
            -  1.32 * Math.sin(2 * radians(L))
            -  0.23 * Math.sin(2 * radians(Lprime))
            +  0.21 * Math.sin(2 * radians(Ω));

    const Δε = + 9.20 * Math.cos(radians(Ω))
            + 0.57 * Math.cos(2 * radians(L))
            + 0.10 * Math.cos(2 * radians(Lprime))
            - 0.09 * Math.cos(2 * radians(Ω));

    return [Δψ, Δε];
}

// Taken from Astronomical Algorithms
function getObliquity(T) {
    const U = T/100;
    return (23 + 26/60 + 21.448/3600)
        - (4680.93*U - 1.55*U**2
            + 1999.25*U**3 - 51.38*U**4
            - 249.67*U**5 - 39.05*U**6
            + 7.12*U**7 + 27.87*U**8
            - 5.79*U**9 - 2.45*U**10
        ) / 3600;
}

// Taken from Astronomical Algorithms
function getAlphaAndDelta(apparent_lambda, epsilon, beta) {
    const λ = radians(apparent_lambda);
    const ε = radians(epsilon);
    const β = radians(beta);
    const y = Math.sin(λ) * Math.cos(ε) - Math.tan(β) * Math.sin(ε);
    const x = Math.cos(λ);
  
    let α = Math.atan2(y, x);
    if (α < 0) α += 2 * Math.PI;
  
    const δ = Math.asin(Math.sin(β) * Math.cos(ε) + Math.cos(β) * Math.sin(ε) * Math.sin(λ));
  
    return [α * (180 / Math.PI), δ * (180 / Math.PI)];
}

