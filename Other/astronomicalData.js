//|---------------------------|
//|     Astronomical Data     |
//|---------------------------|

// A set of functions for calculating data in the Astronomical Data category.

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
    let unfixedDateTime = new Date(Date.UTC(year, month-1, day, hours, minutes, seconds));
    unfixedDateTime.setUTCFullYear(year);
    // I think this is how to add Dynamical Time but I'm not sure
    let fixedDateTime = new Date(getDynamicalTimeBackward(unfixedDateTime));
    
    const startOfGregorian = new Date(Date.UTC(1582, 9, 15));
    if ((fixedDateTime < startOfGregorian) && (calendarType==='gregorian-proleptic')) {
        fixedDateTime.setUTCDate(fixedDateTime.getUTCDate() + gregJulDifference);
    }
    return fixedDateTime;
}

function calculateUTCYear(currentDateTime) {
    year = currentDateTime.getUTCFullYear();
    let yearStart = new Date(Date.UTC(year, 0, 1));
    yearStart.setUTCFullYear(year);
    let nextYearStart = new Date(Date.UTC(year + 1, 0, 1));
    nextYearStart.setUTCFullYear(year + 1);
    let yearFraction = (currentDateTime - yearStart) / (nextYearStart - yearStart);
    return yearFraction;
}



//|----------------------------|
//|     Solar Calculations     |
//|----------------------------|


// Returns the unformatted date of a solstice or equinox
// The equations and hardcoded values come from Astronomical Algorithms
function getCurrentSolsticeOrEquinox(currentDateTime, season) {

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
    return normalizeAngleTo360(sunLongitude).toFixed(2);
}



//|-----------------------------|
//|     Lunar  Calculations     |
//|-----------------------------|


// Returns the number of lunations (lunar cycles) since January 6 2000
// This equation was sourced from Astronomical Algorithms
function calculateLunationNumber(currentDateTime) {
    // Using Jean Meeus's date for lunation epoch
    const firstNewMoon2000 = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    const secondsSince2000 = (currentDateTime - firstNewMoon2000)/1000;

    // Calculate the number of days since the first new moon of 2000
    const daysSince2000 = secondsSince2000 / (60 * 60 * 24);

    // Calculate the number of lunations since Lunation 0
    const lunationNumber = Math.floor(daysSince2000 / 29.530588);
    return lunationNumber;
}

// Returns the calculated unformatted date of the most recent New Moon
// This equation was sourced from Astronomical Algorithms
function getNewMoonThisMonth(currentDateTime, monthModifier) {

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
            sumNewMoonTableHelper(0.00208*E*2, SunM*2) +
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

    let year = currentDateTime.getUTCFullYear();
    year += calculateUTCYear(currentDateTime);
    const k = Math.trunc((year - 2000)*12.3685) + monthModifier;
    const T = k/1236.85;
    const E = 1 - 0.002516*T - 0.0000074*T**2;
    const JDE =  2451550.09765 + 29.530588853*k +  0.0001337*T**2 + - 0.000000150*T**3 + 0.00000000073*T**4;
    const SunM = 2.5534 + 29.10535669*k - 0.0000218*T**2 - 0.00000011*T**3;
    const MoonM = 201.5643 + 385.81693528*k + 0.0107438*T**2 + 0.00001239*T**3 - 0.000000058*T**4;
    const F = 160.7108 + 390.67050274*k - 0.0016341*T**2 - 0.00000227*T**3 + 0.000000011*T**4;
    const lunarNode = 124.7746 - 1.56375580*k + 0.0020691*T**2 + 0.00000215*T**3;
    const sumOfNewMoonTable = sumNewMoonTable(SunM, MoonM, F, E, lunarNode);
    const sumOfAllPhaseTable = allPhaseTable(k, T);

    const newMoonJDE = JDE + sumOfNewMoonTable + sumOfAllPhaseTable;
    return new Date(calculateDateFromJDE(newMoonJDE));
}

// Sum the All Phases table from Astronomical Algorithms
function allPhaseTable(k, T) {
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
function getNextSolarEclipse(currentDateTime, monthModifier) {
    let year = currentDateTime.getUTCFullYear();
    year += calculateUTCYear(currentDateTime);
    const k = Math.trunc((year - 2000)*12.3685) + monthModifier;
    const T = k/1236.85;
    const F = 160.7108 + 390.67050274*k - 0.0016341*T**2 - 0.00000227*T**3 + 0.000000011*T**4;

    // Eclipse is impossible
    if (Math.abs(Math.sin(F*(Math.PI / 180)))>0.36) {
        return getNextSolarEclipse(currentDateTime, monthModifier+1);
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


    // Umbra cannot be seen from Earth, not a solar eclipse
    if (Math.abs(Y) > 1.5433+u) {
        return getNextSolarEclipse(currentDateTime, monthModifier+1);
    }

    // Central eclipse
    let eclipseType = 'None';
    if ((Y>-0.9972)&&(Y<0.9972)) {
        eclipseType = 'Annular';
        if (u < 0) {
            eclipseType = 'Total'
        }
    } else {
        eclipseType = 'Partial';
    }

    // Calculate which hemisphere it will occur in
    let hemisphere = '';
    if (Y>0) {
        hemisphere = 'Northern Hemisphere'
    } else {
        hemisphere = 'Southern Hemisphere'
    }
    
    // Calculate Lunar Node, Ascending if ~360 and Descending if ~180
    let eclipseNode = 'Ascending';
    let Fdegrees = F %360;
    if (Fdegrees < 0) {
        Fdegrees += 360;
    }
    if ((Fdegrees < 200)&&(Fdegrees > 160)) {
        eclipseNode = 'Descending';
    }

    // Get date of eclipse
    const eclipseDate = getNewMoonThisMonth(currentDateTime, monthModifier)

    return eclipseDate.toUTCString() + '\n' + eclipseType + ' | ' + eclipseNode + '\n' + hemisphere;
}