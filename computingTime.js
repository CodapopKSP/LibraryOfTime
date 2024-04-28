//|------------------------|
//|     Computing Time     |
//|------------------------|

// A set of functions for calculating times in the Computing Time category.

// This is a manual count of the total number of leap seconds. Last updated 4/18/2024.
const leapSeconds = 27;

function getUnixTime(currentDateTime) {
    return Math.trunc(currentDateTime.getTime()/1000);
}

function getCurrentFiletime(currentDateTime) {
    const jan1601 = new Date(Date.UTC(1601, 0, 1));
    const filetime = Math.trunc((currentDateTime.getTime() - jan1601.getTime())/1000) * 10000000;
    return filetime;
}

function getGPSTime(currentDateTime) {
    const gpsTime = Math.trunc((currentDateTime - new Date("1980-01-06T00:00:00Z").getTime()) / 1000) + leapSeconds - 8;
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
    
    const A = Math.trunc(year / 100);
    const B = Math.trunc(A / 4);
    const C = 2 - A + B;
    const E = Math.trunc(365.25 * (year + 4716));
    const F = Math.trunc(30.6001 * (month + 1));
    var JD = C + day + E + F - 1524.5;

    JD += (hour + (minute / 60) + (second / 3600) + (millisecond / 3600000)) / 24;
    JD = parseFloat(JD.toFixed(7));
    return JD;
}

function getRataDie(currentDateTime) {
    const JD = getJulianDayNumber(currentDateTime);
    const RD = Math.trunc(JD - 1721424.5);
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

function getDynamicalTimeForward(currentDateTime) {
    let secondsAhead = getDynamicalTimeOffset(currentDateTime);
    const dynamicalTimestamp = currentDateTime.getTime() + (secondsAhead*1000);
    const dynamicalDateTime = new Date(dynamicalTimestamp);
    return dynamicalDateTime.toISOString();
}

function getDynamicalTimeBackward(currentDateTime) {
    let secondsAhead = getDynamicalTimeOffset(currentDateTime);
    const dynamicalTimestamp = currentDateTime.getTime() - (secondsAhead*1000);
    const dynamicalDateTime = new Date(dynamicalTimestamp);
    return dynamicalDateTime.toISOString();
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

function getLilianDate(julianDay) {
    const lilianDate = Math.trunc(julianDay - 2299159.5);
    return lilianDate;
}