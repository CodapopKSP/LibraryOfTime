//|------------------------|
//|     Computing Time     |
//|------------------------|

// A set of functions for calculating times in the Computing Time category.

// This is a manual count of the total number of leap seconds. Last updated 4/18/2024.
const leapSeconds_ = 27;

function getUnixTime(currentDateTime) {
    return Math.trunc(currentDateTime.getTime()/1000);
}

function getCurrentFiletime(currentDateTime) {
    const jan1601 = new Date(Date.UTC(1601, 0, 1));
    const filetime = Math.trunc((currentDateTime.getTime() - jan1601.getTime())/1000) * 10000000;
    return filetime;
}

function getGPSTime(currentDateTime) {
    const gpsEpoch = new Date("1980-01-06T00:00:00Z").getTime();
    
    // Calculate total time difference in seconds
    let gpsTime = Math.trunc((currentDateTime - gpsEpoch) / 1000);
    
    // Calculate how many leap seconds have occurred before the currentDateTime
    let leapSecondsCount = 0;
    GPSleapSeconds.forEach(leapSecond => {
        if (new Date(leapSecond).getTime() <= currentDateTime) {
            leapSecondsCount++;
        }
    });

    // Add leap seconds to account for the growing difference between GPS and UTC.
    gpsTime += leapSecondsCount;
    
    return gpsTime;
}

function getTAI(currentDateTime) {
    let taiDateTime = new Date(currentDateTime);
    let leapSecondsCount = 0;
    TAIleapSeconds.forEach(leapSecond => {
        if (new Date(leapSecond).getTime() <= currentDateTime) {
            leapSecondsCount++;
        }
    });
    taiDateTime.setSeconds(taiDateTime.getSeconds() + (10 + leapSecondsCount));
    return taiDateTime;
}

function getLORANC(currentDateTime) {
    let taiDateTime = getTAI(currentDateTime);
    taiDateTime.setSeconds(taiDateTime.getSeconds() - 10);
    return taiDateTime;
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

function getJulianPeriod(currentDateTime) {
    const JP = currentDateTime.getUTCFullYear() + 4713;
    return JP;
}

function getDynamicalTimeForward(currentDateTime) {
    let secondsAhead = getTerrestrialTimeOffset(currentDateTime);
    const dynamicalTimestamp = currentDateTime.getTime() + (secondsAhead*1000);
    const dynamicalDateTime = new Date(dynamicalTimestamp);
    return dynamicalDateTime.toISOString();
}

function getDynamicalTimeBackward(currentDateTime) {
    let secondsAhead = getTerrestrialTimeOffset(currentDateTime);
    const dynamicalTimestamp = currentDateTime.getTime() - (secondsAhead*1000);
    const dynamicalDateTime = new Date(dynamicalTimestamp);
    return dynamicalDateTime.toISOString();
}

function getTerrestrialTimeOffset(currentDateTime) {
    const year = currentDateTime.getUTCFullYear();
    if (year < -500) {
        const year_factor = (year - 1820) / 100;
        return -20 + 32 * year_factor**2;
    }
    if (year < 500) {
        const year_factor = year / 100;
        return 10583.6 - 1014.41 * year_factor +
            33.78311 * year_factor**2 - 5.952053 * year_factor**3 -
            0.1798452 * year_factor**4 + 0.022174192 * year_factor**5 + 0.0090316521 * year_factor**6;
    }
    if (year < 1600) {
        const year_factor = (year - 1000) / 100;
        return 1574.2 - 556.01 * year_factor + 71.23472 * year_factor**2 + 
            0.319781 * year_factor**3 - 0.8503463 * year_factor**4 - 
            0.005050998 * year_factor**5 + 0.0083572073 * year_factor**6;
    }
    if (year < 1700) {
        const year_factor = year - 1600;
        return 120 - 0.9808 * year_factor - 0.01532 * year_factor**2 + year_factor**3 / 7129;
    }
    if (year < 1800) {
        const year_factor = year - 1700;
        return 8.83 + 0.1603 * year_factor - 0.0059285 * year_factor**2 + 0.00013336 * year_factor**3 - year_factor**4 / 1174000;
    } 
    if (year < 1860) {
        const year_factor = year - 1800;
        return 13.72 - 0.332447 * year_factor + 0.0068612 * year_factor**2 + 
            0.0041116 * year_factor**3 - 0.00037436 * year_factor**4 + 
            0.0000121272 * year_factor**5 - 0.0000001699 * year_factor**6 + 0.000000000875 * year_factor**7;
    }
    if (year < 1900) {
        const year_factor = year - 1860;
        return 7.62 + 0.5737 * year_factor - 0.251754 * year_factor**2 + 
            0.01680668 * year_factor**3 - 0.0004473624 * year_factor**4 + year_factor**5 / 233174;
    }
    if (year < 1920) {
        const year_factor = year - 1900;
        return -2.79 + 1.494119 * year_factor - 0.0598939 * year_factor**2 + 
            0.0061966 * year_factor**3 - 0.000197 * year_factor**4;
    }
    if (year < 1941) {
        const year_factor = year - 1920;
        return 21.20 + 0.84493 * year_factor - 
            0.076100 * year_factor**2 + 0.0020936 * year_factor**3;
    }
    if (year < 1961) {
        const year_factor = year - 1950;
        return 29.07 + 0.407 * year_factor - year_factor**2 / 233 + (year_factor**3) / 2547;
    }
    if (year < 1986) {
        const year_factor = year - 1975;
        return 45.45 + 1.067 * year_factor - year_factor**2 / 260 - (year_factor**3) / 718;
    }
    if (year < 2005) {
        const year_factor = year - 2000;
        return 63.86 + 0.3345 * year_factor - 0.060374 * year_factor**2 + 
            0.0017275 * year_factor**3 + 0.000651814 * year_factor**4 +0.00002373599 * year_factor**5;
    }
    if (year < 2050) {
        const year_factor = year - 2000;
        return 62.92 + 0.32217 * year_factor + 0.005589 * year_factor**2;
    }
    if (year < 2150) {
        return -20 + 32 * (((year - 1820) / 100)**2) - 0.5628 * (2150 - year);
    }
    const year_factor = (year - 1820) / 100;
    return -20 + 32 * year_factor**2;
}

function getLilianDate(julianDay) {
    const lilianDate = Math.trunc(julianDay - 2299159.5);
    return lilianDate;
}

function getMarsSolDate(julianDay) {
    return (julianDay - 2451549.5 + (1/4000))/1.02749125 + 44796.0
}

function getJulianSolDate(marsSolDate) {
    return marsSolDate + 94129;
}

// Return the Kali Ahargana from midnight (IST)
function getKaliAhargana(currentDateTime) {
    const kAOf10July2001 = 1863635;
    const July10of2001 = new Date(Date.UTC(2001, 6, 9, 18, 30));
    return differenceInDays(currentDateTime, July10of2001) + kAOf10July2001;
}

function getBrownLunationNumber(lunationNumber) {
    return lunationNumber + 953;
}

function getGoldstineLunationNumber(lunationNumber) {
    return lunationNumber + 37105;
}

function getHebrewLunationNumber(lunationNumber) {
    return lunationNumber + 71234;
}

function getIslamicLunationNumber(lunationNumber) {
    return lunationNumber + 17038;
}

function getThaiLunationNumber(lunationNumber) {
    return lunationNumber + 16843;
}

function getJulianCircadNumber(currentDateTime) {
    const epoch = new Date(Date.UTC(1609, 2, 15, 18, 37, 32));
    const titanCircad = 0.998068439;
    const titanDayMilliseconds = titanCircad * 24 * 60 * 60 * 1000;
    return ((currentDateTime-epoch)/titanDayMilliseconds)+1;
}