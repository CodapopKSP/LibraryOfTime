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
        const S = sumThatCrazyTable(T);
        const specialDay = JDE_ + ((0.00001*S)/DeltaLambda);
        return calculateDateFromJDE(specialDay);
    } else {
        const Y = year/1000;
        let JDE_ = 0;
        if (season === 'spring') {
            JDE_ = 1721139.29189 + 365242.13740*Y + 0.06134*Y**2 + 0.00111*Y**3 - 0.00071*y**4;
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
        const S = sumThatCrazyTable(T);
        const specialDay = JDE_ + ((0.00001*S)/DeltaLambda);
        return calculateDateFromJDE(specialDay);
    }
}

function sumThatCrazyTable(T) {
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