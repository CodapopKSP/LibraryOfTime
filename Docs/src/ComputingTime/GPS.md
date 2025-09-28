# GPS

| Epoch             | Confidence |
| ----------------- | ---------- |
| 6 January 1980 CE | Exact      |

### Overview

GPS time is the standard by which all GPS satellites and GPS-enabled devices coordinate their positions. It is a simple count of seconds from midnight on January 6th, 1980. When converted into the Gregorian calendar, it drifts ahead by a second every now and then as it does not follow leap seconds found in other timekeeping standards.

### Info

GPS became available to the public in 2000 CE.

### Accuracy

This clock is considered to be perfectly accurate, as it's a simple calculation from Unix.

### Source

Much of the information for this clock came from its <a href="https://en.wikipedia.org/wiki/Global_Positioning_System#Timekeeping">Wikipedia article</a>.

Some information for this clock came from <a href="http://www.leapsecond.com/java/gpsclock.htm">this website</a>.

---

## Calculation

Calculating the current GPS time requires starting with the GPS epoch. and subtracting it from the current datetime.

```js
gpsEpoch = new Date("1980-01-06T00:00:00Z").getTime();
// Calculate total time difference in seconds
let gpsTime = Math.floor((currentDateTime - gpsEpoch) / 1000);
```

After that, the leap seconds that have already passed need to be added.

```js
const GPSleapSeconds = [
    "1981-06-30T23:59:59Z",
    "1982-06-30T23:59:59Z",
    "1983-06-30T23:59:59Z",
    "1985-06-30T23:59:59Z",
    "1987-12-31T23:59:59Z",
    "1989-12-31T23:59:59Z",
    "1990-12-31T23:59:59Z",
    "1992-06-30T23:59:59Z",
    "1993-06-30T23:59:59Z",
    "1994-06-30T23:59:59Z",
    "1995-12-31T23:59:59Z",
    "1997-06-30T23:59:59Z",
    "1998-12-31T23:59:59Z",
    "2005-12-31T23:59:59Z",
    "2008-12-31T23:59:59Z",
    "2012-06-30T23:59:59Z",
    "2015-06-30T23:59:59Z",
    "2016-12-31T23:59:59Z"
];
```

```js
// Calculate how many leap seconds have occurred before the currentDateTime
let leapSecondsCount = 0;
GPSleapSeconds.forEach(leapSecond => {
    if (new Date(leapSecond).getTime() <= currentDateTime) {
        leapSecondsCount++;
    }
});

// Add leap seconds to account for the growing difference between GPS and UTC.
gpsTime += leapSecondsCount;
```
