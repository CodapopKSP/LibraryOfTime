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
    let jan1601 = new Date(Date.UTC(1601, 0, 1));
    let filetime = Math.floor((currentDateTime.getTime() - jan1601.getTime())/1000) * 10000000;
    return filetime;
}

function getGPSTime(currentDateTime) {
    let gpsTime = Math.floor((currentDateTime - new Date("1980-01-06T00:00:00Z").getTime()) / 1000) + leapSeconds - 8;
    return gpsTime;
}

function getJulianDayNumber(currentDateTime) {
    var day = currentDateTime.getUTCDate();
    var month = currentDateTime.getUTCMonth() + 1;
    var year = currentDateTime.getUTCFullYear();
    var hour = currentDateTime.getUTCHours();
    var minute = currentDateTime.getUTCMinutes();
    var second = currentDateTime.getUTCSeconds();
    var millisecond = currentDateTime.getUTCMilliseconds();
    
    if (month < 3) {
        year -= 1;
        month += 12;
    }
    
    var A = Math.floor(year / 100);
    var B = Math.floor(A / 4);
    var C = 2 - A + B;
    var E = Math.floor(365.25 * (year + 4716));
    var F = Math.floor(30.6001 * (month + 1));
    var JD = C + day + E + F - 1524.5;

    JD += (hour + (minute / 60) + (second / 3600) + (millisecond / 3600000)) / 24;
    JD = parseFloat(JD.toFixed(7));
    
    return JD;
}

function getRataDie(currentDateTime) {
    let JD = getJulianDayNumber(currentDateTime);
    let RD = Math.floor(JD - 1721424.5);
    return RD;
}

function getTAI(currentDateTime) {
    var taiDateTime = new Date(currentDateTime);
    taiDateTime.setSeconds(taiDateTime.getSeconds() + 10 + leapSeconds);
    return taiDateTime;
}

function getLORANC(currentDateTime) {
    var taiDateTime = getTAI(currentDateTime);
    taiDateTime.setSeconds(taiDateTime.getSeconds() - 10);
    return taiDateTime;
}

function getJulianPeriod(currentDateTime) {
    let JP = currentDateTime.getFullYear() + 4713;
    return JP;
}

//http://www.leapsecond.com/java/gpsclock.htm