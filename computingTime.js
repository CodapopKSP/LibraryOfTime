//|------------------------|
//|     Computing Time     |
//|------------------------|

// A set of functions for calculating times in the Computing Time category.

// This is a manual count of the total number of leap seconds. Last updated 4/18/2024.
const leapSeconds = 27;

function getUnixTime(currentDateTime) {
    return Math.floor(currentDateTime.getTime()/1000);
}

function getCurrentFiletime(currentDateTime) {
    const jan1601 = new Date(Date.UTC(1601, 0, 1));
    const filetime = Math.floor((currentDateTime.getTime() - jan1601.getTime())/1000) * 10000000;
    return filetime;
}

function getGPSTime(currentDateTime) {
    const gpsTime = Math.floor((currentDateTime - new Date("1980-01-06T00:00:00Z").getTime()) / 1000) + leapSeconds - 8;
    return gpsTime;
}

function getJulianDayNumber(currentDateTime) {
    const day = currentDateTime.getUTCDate();
    let month = currentDateTime.getUTCMonth() + 1;
    let year = currentDateTime.getUTCFullYear();
    const hour = currentDateTime.getUTCHours();
    const minute = currentDateTime.getUTCMinutes();
    const second = currentDateTime.getUTCSeconds();
    const millisecond = currentDateTime.getUTCMilliseconds();
    if (month < 3) {
        year -= 1;
        month += 12;
    }
    
    const A = Math.floor(year / 100);
    const B = Math.floor(A / 4);
    const C = 2 - A + B;
    const E = Math.floor(365.25 * (year + 4716));
    const F = Math.floor(30.6001 * (month + 1));
    var JD = C + day + E + F - 1524.5;

    JD += (hour + (minute / 60) + (second / 3600) + (millisecond / 3600000)) / 24;
    JD = parseFloat(JD.toFixed(7));
    return JD;
}

function getRataDie(currentDateTime) {
    const JD = getJulianDayNumber(currentDateTime);
    const RD = Math.floor(JD - 1721424.5);
    return RD;
}

function getTAI(currentDateTime) {
    let taiDateTime = new Date(currentDateTime);
    taiDateTime.setSeconds(taiDateTime.getSeconds() + 10 + leapSeconds);
    return taiDateTime;
}

function getLORANC(currentDateTime) {
    let taiDateTime = getTAI(currentDateTime);
    taiDateTime.setSeconds(taiDateTime.getSeconds() - 10);
    return taiDateTime;
}

function getJulianPeriod(currentDateTime) {
    const JP = currentDateTime.getUTCFullYear() + 4713;
    return JP;
}

function getDynamicalTime(currentDateTime) {
    let secondsAhead = getDynamicalTimeOffset(currentDateTime);
    const dynamicalTimestamp = currentDateTime.getTime() + (secondsAhead*1000);
    const dynamicalDateTime = new Date(dynamicalTimestamp);
    return dynamicalDateTime.toUTCString();
}

function getDynamicalTimeOffset(currentDateTime) {
    let year = currentDateTime.getUTCFullYear();
    const fractionOfCurrentYear = calculateYear(currentDateTime);
    year = year + fractionOfCurrentYear;
    const T = (year-2000)/100;
    let secondsAhead = 0;
    if (year < 949) {
        secondsAhead = 2415.6 + (573.36*T) + (46.5*T**2);
    } else if (year < 1601) {
        secondsAhead = 50.6 + (67.5*T) + (22.5*T**2);
    } else {
        secondsAhead = 102.3 + (123.5*T) + (32.5*T**2);
    }
    return secondsAhead;
}

function getJDE(currentDateTime) {
    const secondsAhead = getDynamicalTimeOffset(currentDateTime);
    const JDN = getJulianDayNumber(currentDateTime);
    const JDESeconds = JDN*24*60*60 + secondsAhead;
    const JDE = JDESeconds/24/60/60;
    return JDE;
}

function getSolEqT(currentDateTime) {
    const year = 1962; //currentDateTime.getUTCFullYear();

    if (year > 999) {
        const Y = (year-2000)/1000;
        const JDE_ = 2451716.56767 + 365241.62603*Y + 0.00325*Y**2 - 0.00888*Y**3 - 0.00030*Y**4;
        const T = (JDE_ - 2451545)/36525;
        const W = 35999.373*T - 2.47;
        const DeltaLambda =  1 + (0.0334 * Math.cos(W* Math.PI / 180)) + (0.0007 * Math.cos(2*W* Math.PI / 180));
        const S = sumThatCrazyTable(T);
        console.log(JDE_ + ((0.00001*S)/DeltaLambda));
        return DeltaLambda;
    } else {
        const Y = year/1000;
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