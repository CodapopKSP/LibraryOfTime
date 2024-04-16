//|------------------------|
//|     Computing Time     |
//|------------------------|

// A set of functions for calculating times in the Computing Time category.

function getCurrentFiletime(currentDateTime) {
    let jan1601 = new Date(Date.UTC(1601, 0, 1));
    let filetime = Math.floor((currentDateTime.getTime() - jan1601.getTime())/1000) * 10000000;
    return filetime;
}

function getGPSTime(currentDateTime) {
    let gpsTime = Math.floor((currentDateTime - new Date("1980-01-06T00:00:00Z").getTime()) / 1000)+19;
    return gpsTime;
}

function getJulianDayNumber(currentDateTime) {
    let gregorianEpoch = new Date(-4714, 10, 24, 12);
    let daysSinceEpoch = currentDateTime - gregorianEpoch;
    if (currentDateTime.getFullYear() > 0) {
        return Math.floor(daysSinceEpoch / (1000 * 60 * 60 * 24)-365);
    }
    return Math.floor(daysSinceEpoch / (1000 * 60 * 60 * 24));
}