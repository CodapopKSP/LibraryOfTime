//|------------------------|
//|     Computing Time     |
//|------------------------|

// A set of functions for calculating times in the Computing Time category.

function getUnixTime(currentDateTime) {
    return Math.floor(currentDateTime.getTime()/1000);
}

function getCurrentFiletime(currentDateTime) {
    let jan1601 = new Date(Date.UTC(1601, 0, 1));
    let filetime = Math.floor((currentDateTime.getTime() - jan1601.getTime())/1000) * 10000000;
    return filetime;
}

function getGPSTime(currentDateTime) {
    let gpsTime = Math.floor((currentDateTime - new Date("1980-01-06T00:00:00Z").getTime()) / 1000)+19;
    return gpsTime;
}

// https://quasar.as.utexas.edu/BillInfo/JulianDatesG.html
function getJulianDayNumber(currentDateTime) {
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth()+1;
    year = convertAstronomicalYear(currentDateTime.getFullYear());
    hour = currentDateTime.getHours();
    if (month < 3) {
        year-=1;
        month+=12;
    }
    let A = Math.floor(year/100);
    let B = Math.floor(A/4);
    let C = 2-A+B;
    let E = Math.floor(365.25*(year+4716));
    let F = Math.floor(30.6001*(month+1));
    let JD = C+day+E+F-1524.5;
    return JD;
}

function getRataDie(currentDateTime) {
    let JD = getJulianDayNumber(currentDateTime);
    let RD = Math.floor(JD - 1721424.5);
    return RD;
}

//http://www.leapsecond.com/java/gpsclock.htm