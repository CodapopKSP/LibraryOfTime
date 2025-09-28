# TAI

| Epoch                          | Confidence |
| ------------------------------ | ---------- |
| 31 December 1971 CE, +23:59:50 | Exact      |

#### Overview

International Atomic Time is the average of several atomic clocks and is based on the passage of time on Earth\'s geoid. It is the basis for UTC but deviates from UTC by several seconds due to TAI not including leap seconds, specifically the number of leap seconds since 1972 plus 10 extra to account for missed leap seconds since 1958.

#### Info

Ironically, the clock displayed here is derived from UTC even though it is itself the basis for UTC.

#### Accuracy

This clock is considered to be perfectly accurate, as it's a simple calculation from UTC. However, this only applies to dates after the Unix epoch of 1 January 1970. Prior to that, leap seconds aren't taken into account in this calculation.

#### Source

Much of the information for this clock came from its <a href="https://en.wikipedia.org/wiki/International_Atomic_Time">Wikipedia article</a>.

Some information for this clock came from <a href="http://www.leapsecond.com/java/gpsclock.htm">this website</a>.

---

### Calculation

Calculating TAI is typically done using sensitive instruments rather than programmatically. However, an approximation that is good enough for an 'Exact' confidence classification on this site can be calculated by adding up the number of leap seconds that have passed plus 10 seconds.

```js
const TAIleapSeconds = [
    "1972-06-30T23:59:59Z",
    "1972-12-31T23:59:59Z",
    "1973-12-31T23:59:59Z",
    "1974-12-31T23:59:59Z",
    "1975-12-31T23:59:59Z",
    "1976-12-31T23:59:59Z",
    "1977-12-31T23:59:59Z",
    "1978-12-31T23:59:59Z",
    "1979-12-31T23:59:59Z",
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
let leapSecondsCount = 0;
    TAIleapSeconds.forEach(leapSecond => {
        if (new Date(leapSecond).getTime() <= currentDateTime) {
            leapSecondsCount++;
        }
    });
    // Add accumulated leap seconds plus the initial 10
    taiDateTime.setSeconds(taiDateTime.getSeconds() + (10 + leapSecondsCount));
```
