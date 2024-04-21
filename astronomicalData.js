//|---------------------------|
//|     Astronomical Data     |
//|---------------------------|

// A set of functions for calculating data in the Astronomical Data category.

function getCurrentSolsticeOrEquinoxJDE(currentDateTime, season) {
    const year = currentDateTime.getUTCFullYear();
    if (year > 999) {
        const Y = (year-2000)/1000;
        let JDE_ = 0;
        if (season === 'spring') {
            JDE_ = 2451623.80984 + 365242.37404*Y + 0.05169*Y**2 - 0.00411*Y**3 - 0.00057*Y**4;
        }
        if (season === 'summer') {
            JDE_ = 2451716.56767 + 365241.62603*Y + 0.00325*Y**2 + 0.00888*Y**3 - 0.00030*Y**4;
        }
        if (season === 'autumn') {
            JDE_ = 2451810.21715 + 365242.01767*Y - 0.11575*Y**2 + 0.00337*Y**3 + 0.00078*Y**4;
        }
        if (season === 'winter') {
            JDE_ = 2451900.05952 + 365242.74049*Y - 0.06223*Y**2 - 0.00823*Y**3 + 0.00032*Y**4;
        }
        const T = (JDE_ - 2451545)/36525;
        const W = 35999.373*T - 2.47;
        const DeltaLambda =  1 + (0.0334 * Math.cos(W* Math.PI / 180)) + (0.0007 * Math.cos(2*W* Math.PI / 180));
        const S = sumSolsticeEquinoxTable(T);
        const specialDay = JDE_ + ((0.00001*S)/DeltaLambda);
        return calculateDateFromJDE(specialDay);
    } else {
        const Y = year/1000;
        let JDE_ = 0;
        if (season === 'spring') {
            JDE_ = 1721139.29189 + 365242.13740*Y + 0.06134*Y**2 + 0.00111*Y**3 - 0.00071*Y**4;
        }
        if (season === 'summer') {
            JDE_ = 1721233.25401 + 365241.72562*Y - 0.05323*Y**2 + 0.00907*Y**3 + 0.00025*Y**4;
        }
        if (season === 'autumn') {
            JDE_ = 1721325.70455 + 365242.49558*Y - 0.11677*Y**2 - 0.00297*Y**3 + 0.00074*Y**4;
        }
        if (season === 'winter') {
            JDE_ = 1721414.39987 + 365242.88257*Y - 0.00769*Y**2 - 0.00933*Y**3 - 0.00006*Y**4;
        }
        const T = (JDE_ - 2451545)/36525;
        const W = 35999.373*T - 2.47;
        const DeltaLambda =  1 + (0.0334 * Math.cos(W* Math.PI / 180)) + (0.0007 * Math.cos(2*W* Math.PI / 180));
        const S = sumSolsticeEquinoxTable(T);
        const specialDay = JDE_ + ((0.00001*S)/DeltaLambda);
        return calculateDateFromJDE(specialDay);
    }
}

function sumSolsticeEquinoxTable(T) {
    const sum =
    485 * Math.cos((324.96 + 1934.136*T)* Math.PI / 180) +
    203 * Math.cos((337.23 + 32964.467*T)* Math.PI / 180) +
    199 * Math.cos((342.08 + 20.186*T)* Math.PI / 180) +
    182 * Math.cos((27.85 + 445267.112*T)* Math.PI / 180) +
    156 * Math.cos((73.14 + 45036.886*T)* Math.PI / 180) +
    136 * Math.cos((171.52 + 22518.443*T)* Math.PI / 180) +
    77 * Math.cos((222.54 + 65928.934*T)* Math.PI / 180) +
    74 * Math.cos((296.72 + 3034.906*T)* Math.PI / 180) +
    70 * Math.cos((243.58 + 9037.513*T)* Math.PI / 180) +
    58 * Math.cos((119.81 + 33718.147*T)* Math.PI / 180) +
    52 * Math.cos((297.17 + 150.678*T)* Math.PI / 180) +
    50 * Math.cos((21.02 + 2281.226*T)* Math.PI / 180);
    return sum;
}

function calculateDateFromJDE(JDE) {
    const newJDE = JDE + 0.5;
    const Z = Math.floor(newJDE);
    const F = newJDE - Z;
    const alpha = Math.floor((Z - 1867216.25)/36524.25);
    let A = 0;
    if (Z < 2299161) {
        A = Z;
    } else {
        A = Z + 1 + alpha - Math.floor(alpha/4);
    }
    const B = A + 1524;
    const C = Math.floor((B - 122.1)/365.25);
    const D = Math.floor(365.25*C);
    const E = Math.floor((B - D)/30.6001);
    const dayDecimal = B - D - Math.floor(30.6001*E) + F;
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
    const day = Math.floor(dayDecimal);
    const remainingDayDecimal = dayDecimal - day;
    const totalSecondsInDay = 24 * 60 * 60;
    const totalSecondsOfRemainingDay = Math.floor(remainingDayDecimal * totalSecondsInDay);
    const hours = Math.floor(totalSecondsOfRemainingDay / 3600);
    const minutes = Math.floor((totalSecondsOfRemainingDay % 3600) / 60);
    const seconds = totalSecondsOfRemainingDay % 60;
    const unfixedDateTime = new Date(Date.UTC(year, month-1, day, hours, minutes, seconds));
    const fixedDateTime = getDynamicalTimeBackward(unfixedDateTime);
    return fixedDateTime;
}

function getLongitudeOfSun(currentDateTime) {
    const JD = getJulianDayNumber(currentDateTime);
    const T = (JD - 2451545.0)/36525;
    const L =  normalizeAngleTo360(280.46645 + 36000.76983*T + 0.0003032*T**2);
    const M =  normalizeAngleTo360(357.52910 + 35999.05030*T - 0.0001559*T**2 - 0.00000048*T**3);
    const C = + (1.914600 - 0.004817*T - 0.000014*T**2)*Math.sin(M* Math.PI / 180) + (0.019993 - 0.000101*T)*Math.sin((2*M)* Math.PI / 180) + 0.000290*Math.sin((3*M)* Math.PI / 180);
    const sunLongitude = L + C;
    return normalizeAngleTo360(sunLongitude).toFixed(2) + '°';
}

function normalizeAngleTo360(angle) {
    let normalizeAngle = (angle+360)%360;
    if (normalizeAngle<0) {
        normalizeAngle += 360;
    }
    return normalizeAngle;
}

function getPhaseOfMoon(currentDateTime) {
    let year = currentDateTime.getUTCFullYear();
    year += calculateYear(currentDateTime);
    const k = Math.floor((year - 2000)*12.3685);
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
    return calculateDateFromJDE(newMoonJDE);
}

function sumNewMoonTable(SunM, MoonM, F, E, lunarNode) {
    const sum =
    - 0.40720     * Math.sin((MoonM)* Math.PI / 180)
    + 0.17241*E   * Math.sin((SunM)* Math.PI / 180)
    + 0.01608     * Math.sin((MoonM*2)* Math.PI / 180)
    + 0.01039     * Math.sin((F*2)* Math.PI / 180)
    + 0.00739*E   * Math.sin((MoonM-SunM)* Math.PI / 180)
    - 0.00514*E   * Math.sin((MoonM+SunM)* Math.PI / 180)
    + 0.00208*E*2 * Math.sin((SunM*2)* Math.PI / 180)
    - 0.00111     * Math.sin((MoonM-F*2)* Math.PI / 180)
    - 0.00057     * Math.sin((MoonM + F*2)* Math.PI / 180)
    + 0.00056*E   * Math.sin((2*MoonM + SunM)* Math.PI / 180)
    - 0.00042     * Math.sin((3*MoonM)* Math.PI / 180)
    + 0.00042*E   * Math.sin((SunM + F*2)* Math.PI / 180)
    + 0.00038*E   * Math.sin((SunM - F*2)* Math.PI / 180)
    - 0.00024*E   * Math.sin((2*MoonM-SunM)* Math.PI / 180)
    - 0.00017     * Math.sin((lunarNode)* Math.PI / 180)
    - 0.00007     * Math.sin((MoonM+2*SunM)* Math.PI / 180)
    + 0.00004     * Math.sin((2*MoonM - 2*F)* Math.PI / 180)
    + 0.00004     * Math.sin((3*SunM)* Math.PI / 180)
    + 0.00003     * Math.sin((SunM + MoonM - 2*F)* Math.PI / 180)
    + 0.00003     * Math.sin((2*MoonM + 2*F)* Math.PI / 180)
    - 0.00003     * Math.sin((SunM + MoonM + 2*F)* Math.PI / 180)
    + 0.00003     * Math.sin((MoonM - SunM + 2*F)* Math.PI / 180)
    - 0.00002     * Math.sin((MoonM - SunM - 2*F)* Math.PI / 180)
    - 0.00002     * Math.sin((MoonM*3 + SunM)* Math.PI / 180)
    + 0.00002     * Math.sin((MoonM*4)* Math.PI / 180);
    return sum;
}

function allPhaseTable(k, T) {
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
    let sum = allPhaseTableHelper(0.000325, A1);
    sum += allPhaseTableHelper(0.000165, A2)
    sum += allPhaseTableHelper(0.000164, A3)
    sum += allPhaseTableHelper(0.000126, A4)
    sum += allPhaseTableHelper(0.000110, A5)
    sum += allPhaseTableHelper(0.000062, A6)
    sum += allPhaseTableHelper(0.000060, A7)
    sum += allPhaseTableHelper(0.000056, A8)
    sum += allPhaseTableHelper(0.000047, A9)
    sum += allPhaseTableHelper(0.000042, A10)
    sum += allPhaseTableHelper(0.000040, A11)
    sum += allPhaseTableHelper(0.000037, A12)
    sum += allPhaseTableHelper(0.000035, A13)
    sum += allPhaseTableHelper(0.000023, A14)
    return sum;
}

function allPhaseTableHelper(num, A) {
    return num*Math.sin(A* Math.PI / 180);
}
