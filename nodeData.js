//|-------------------|
//|     Node Data     |
//|-------------------|

/*
Node Data is a collection of data for each node.
    name:           The name of the node.
    type:           The type of calendar/time.
    epoch:          The starting epoch of the calendar/time.
    confidence:     A measure of how confident I am in the node's accuracy.
    overview:       The text that appears in the overview tab.
    info:           The text that appears in the info tab.
    accuracy:       The text that appears in the accuracy tab.
    source:         The text that appears in the source tab.
*/

const standardTimeData = [
    {
        name: 'Local Time',
        id: 'local-time',
        type: 'Standard Time',
        epoch: 'Local Midnight',
        confidence: 'Exact',
        overview: 'This is the current local time based on the timezone provided by your device.',
        info: 'Local Time can vary depending on location, timezone, Daylight Savings Time, and historical adjustments.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: `Local Time is sourced directly from JavaScript's Date library and your device's system time.`
    },

    {
        name: 'UTC',
        id: 'utc',
        type: 'Standard Time',
        epoch: 'UTC Midnight',
        confidence: 'Exact',
        overview: 'Coordinated Universal Time is the global time standard. The time expressed here is the same regardless of timezone. It is based on the timezone of the Prime Meridian at 0°.',
        info: 'UTC is the successor to GMT.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: `UTC is sourced directly from JavaScript's Date library and your device's system time.`
    },

    {
        name: 'Second',
        id: 'second',
        type: 'Standard Time',
        epoch: 'Every Second',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current second.',
        info: 'This calculation is based on local time.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },

    {
        name: 'Minute',
        id: 'minute',
        type: 'Standard Time',
        epoch: 'Every Minute',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current minute.',
        info: 'This calculation is based on local time.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },

    {
        name: 'Hour',
        id: 'hour',
        type: 'Standard Time',
        epoch: 'Every Hour',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current hour.',
        info: 'This calculation is based on local time.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },

    {
        name: 'Day',
        id: 'day',
        type: 'Standard Time',
        epoch: 'Every Day',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current day.',
        info: 'This calculation is based on local time.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },

    {
        name: 'Month',
        id: 'month',
        type: 'Standard Time',
        epoch: 'Every Month',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current month.',
        info: 'This calculation is based on local time.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },

    {
        name: 'Year',
        id: 'year',
        type: 'Standard Time',
        epoch: 'Every Year',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current year.',
        info: 'Due to leap days, this fraction might not be a perfect 10x multiplication of the century calculation.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },

    {
        name: 'Decade',
        id: 'decade',
        type: 'Standard Time',
        epoch: 'Every Decade',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current decade.',
        info: 'Due to leap days, midnight on the 1st of January of the 6th year in the decade might not be exactly 50% of the way through the decade.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },

    {
        name: 'Century',
        id: 'century',
        type: 'Standard Time',
        epoch: 'Every Century',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current century.',
        info: 'Due to leap days, midnight on the 1st of January of the 51st year in the century might not be exactly 50% of the way through the century.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },

    {
        name: 'Millennium',
        id: 'millennium',
        type: 'Standard Time',
        epoch: 'Every Millennium',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current millennium.',
        info: 'Due to leap days, this fraction might not be a perfect /10 division of the century calculation.',
        accuracy: 'This calculation is perfectly accurate to the millisecond.',
        source: 'This is a simple calculation with no source.'
    },
]

const computingTimeData = [
    {
        name: 'Unix',
        id: 'unix',
        type: 'Computing Time',
        epoch: 'January 1st, 1970 CE',
        confidence: 'Exact',
        overview: 'Unix is the most widespread timing system in computing and on the internet. It is a simple count of number of seconds since midnight on January 1st, 1970. Many of the calculations on this website are derived from Unix timestamps.',
        info: 'Unix time skips leap seconds, operating as if that time never happened.',
        accuracy: 'As Unix is the source of all timekeeping systems on this site, it is perfectly accurate.',
        source: `Unix time is the source of all other timekeeping systems on this website. It is as accurate as JavaScript's Date library and your device's system time allow.\n\nSome information for this clock came from <a href="https://en.wikipedia.org/wiki/Unix_time">this website</a>.`
    },

    {
        name: 'GPS',
        id: 'gps',
        type: 'Computing Time',
        epoch: 'January 6th, 1980 CE',
        confidence: 'Exact',
        overview: 'GPS time is the standard by which all GPS satellites and GPS-enabled devices coordinate their positions. It is a simple count of seconds from midnight on January 6th, 1980. When converted into the Gregorian calendar, it drifts ahead by a second every now and then as it does not follow leap seconds found in other timekeeping standards.',
        info: 'GPC became available to the public in 2000 CE.',
        accuracy: `This clock is considered to be perfectly accurate, as it's a simple calculation from Unix.`,
        source: 'Much of the information for this clock came from its <a href="https://en.wikipedia.org/wiki/Global_Positioning_System#Timekeeping">Wikipedia article</a>.\n\nSome information for this clock came from <a href="http://www.leapsecond.com/java/gpsclock.htm">this website</a>.'
    },

    {
        name: 'TAI',
        id: 'tai',
        type: 'Computing Time',
        epoch: 'January 1st, 1972 CE +10 seconds',
        confidence: 'Exact',
        overview: 'International Atomic Time is the average of several atomic clocks and is based on the passage of time on Earth\'s geoid. It is the basis for UTC but deviates from UTC by several seconds due to TAI not including leap seconds, specifically the number of leap seconds since 1972 plus 10 extra to account for missed leap seconds since 1958.',
        info: 'Ironically, the clock displayed here is derived from UTC even though it is itself the basis for UTC.',
        accuracy: `This clock is considered to be perfectly accurate, as it's a simple calculation from UTC.`,
        source: 'Much of the information for this clock came from its <a href="https://en.wikipedia.org/wiki/International_Atomic_Time">Wikipedia article</a>.\n\nSome information for this clock came from <a href="http://www.leapsecond.com/java/gpsclock.htm">this website</a>.'
    },

    {
        name: 'LORAN-C',
        id: 'loran-c',
        type: 'Computing Time',
        epoch: 'January 1st, 1958 CE',
        confidence: 'Exact',
        overview: 'Long Range Navigational time was the standard used by the US and other jurisdictions prior to the creation of GPS. It deviates from UTC by the number of leap seconds since 1972 and doesn\'t include the 10 extra leap seconds in TAI.',
        info: 'LORAN-C uses a network of radio transmitters to determine distance using the synchronized time, similar to GPS that uses satellites.',
        accuracy: 'It is difficult to find a current representation of LORAN-C despite it apparently still being in use. I have reconstructed this clock based off of the provided source as well as explanations of the specifics.',
        source: 'Much of the information for this clock came from <a href="http://www.leapsecond.com/java/gpsclock.htm">this website</a>.'
    },

    {
        name: 'FILETIME',
        id: 'filetime',
        type: 'Computing Time',
        epoch: 'January 1st, 1601 CE',
        confidence: 'Exact',
        overview: 'FILETIME is the timing method found on Windows filesystems. It is a simple count of number of nanoseconds since midnight on January 1st, 1601.',
        info: 'Most systems use Unix or a similar epoch. FILETIME is unique in its choice of the year 1601.',
        accuracy: 'FILETIME is accurate to the microsecond, but it does not count nanoseconds.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Gregorian_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Julian Day Number',
        id: 'julian-day-number',
        type: 'Computing Time',
        epoch: 'Noon, November 24, 4713 BCE',
        confidence: 'Exact',
        overview: 'The Julian Day Number is a simple count of number of days since 12:00 (noon) on November 24, 4713 BCE (or 4714 BCE when not using astronomical dates). The JDN is used by astronomers and programmers to simplify calculations for the passage of time, and many of the calculations in this website are based off of the JDN.',
        info: 'There are many versions of the JDN, most of which involve truncating the large number for easier calculations.',
        accuracy: 'This counter is rigorously-studied and exactly accurate, with the only question being the addition of Dynamical Time.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Julian_day">Wikipedia article</a>.'
    },

    {
        name: 'Rata Die',
        id: 'rata-die',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        overview: 'Rata Die is similar to the Julian Day Number and is a simple count of number of days in the Gregorian Calendar since January 1st, 1 CE.',
        info: 'Rata Die was created as a way to calculate calendars more easily, though most day-based calculations on this site still use the Julian Day.',
        accuracy: 'The Rata Die is a simple count of days, meaning it is exactly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Rata_Die">Wikipedia article</a>.'
    },

    {
        name: 'Julian Period',
        id: 'julian-period',
        type: 'Computing Time',
        epoch: '4712 BCE',
        confidence: 'High',
        overview: 'The Julian Period is a cycle of 7980 years beginning in the year 4712 BCE (or 4713 BCE when not using astronomical dates). It is used by historians to date events when no calendar date is given or when previous given dates are deemed to be incorrect.',
        info: 'The Julian Period is the count of days since the last time Indiction, Solar and Lunar cycles all started on the same day.',
        accuracy: 'The Julian Period is a simple count of days, meaning it should be exactly accurate. However, I have had some difficulty ensuring this counter is perfectly calibrated.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Julian_day">Wikipedia article</a>.'
    },

    {
        name: 'Lilian Date',
        id: 'lilian-date',
        type: 'Computing Time',
        epoch: 'October 15th, 1582 CE',
        confidence: 'Exact',
        overview: 'Lilian Date is a timekeeping standard similar to the Julian Day. It was invented by Bruce G. Ohms to be used with IBM systems and is named after Aloysius Lilius, the creator of the Gregorian calendar. It is a simple count of number of days since the beginning of the Gregorian calendar on October 15th, 1582 CE, which is Lilian 1.',
        info: 'Lilian Date technically does not use a specific timezone for its calculation, so this website uses the Julian Day which is based on UTC.',
        accuracy: 'The Lilian Date is a simple calculation on the Gregorian calendar, making it exactly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Lilian_date">Wikipedia article</a>.'
    },

    {
        name: 'ISO 8601',
        id: 'iso8601',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        overview: 'ISO 8601 is the standard of displaying date and time provided by the International Organization for Standardization. It is based off the Gregorian calendar.',
        info: 'ISO 8601 is intended to provide a clear, unambiguous date time format for international use.',
        accuracy: 'ISO 8601 is derived directly from Unix time and thus is exactly accurate.',
        source: `ISO 8601 is actually a supported string of JavaScript's native Date library, so there is nothing for this website to calculate. General information came from its <a href="https://en.wikipedia.org/wiki/ISO_8601">Wikipedia article</a>.`
    },

    {
        name: 'Dynamical Time',
        id: 'dynamical-time',
        type: 'Computing Time',
        epoch: 'Undefined',
        confidence: 'Medium',
        overview: 'Dynamical Time is an approximation of the difference in time due to various factors that affect Earth\'s orbit, such as gravitational effects from other planets. It matches UTC at around the year 1880 and deviates the further away in time as a parabolic equation, with an uncertainty as much as two hours by the year 4000 BCE.',
        info: 'The exact time of the year is slowly changing on the order of a few seconds per year. This rate is not constant, though it can be estimated.',
        accuracy: `Dynamical Time is itself an approximation, so the results here can only be as good as that approximation. Unfortunately, there seems to be a bit of induced error on top of that, as my solutions don't exactly match those provided by Meeus. This could be due to JavaScript's base-2 calculation or due to a misunderstanding in some of the steps.`,
        source: 'This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.'
    },

    {
        name: 'Mars Sol Date',
        id: 'mars-sol-date',
        type: 'Computing Time',
        epoch: 'December 29th, 1873 CE',
        confidence: 'High',
        overview: `The Mars Sol Date, similar to the Julian Day Number, is the number of sols that have passed since the epoch. A sol is the name for the Martian day, and it is slightly longer than an Earth day. Currently I haven't been able to figure out exactly why the epoch was chosen. The day increments when the Airy-0 crater reaches midnight.`,
        info: 'One Mars sol is 39 minutes and 35 seconds longer than an Earth day.',
        accuracy: 'This clock should be very accurate, though I am unsure how Dynamical Time factors into it, which could cause it to be off by a few minutes.',
        source: `All of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Timekeeping_on_Mars">Wikipedia article</a>.`
    },

    {
        name: 'Julian Sol Number',
        id: 'julian-sol-number',
        type: 'Computing Time',
        epoch: '12 March 1609 CE, 18:40:06',
        confidence: 'High',
        overview: `The Julian Sol Number, similar to the Julian Day Number, is the number of sols that have passed since the epoch. A sol is the name for the Martian day, and it is slightly longer than an Earth day. This epoch marks an important Martian Vernal Equinox. The day increments when the Airy-0 crater reaches midnight.`,
        info: 'One Mars sol is 39 minutes and 35 seconds longer than an Earth day.',
        accuracy: 'This clock should be very accurate, though I am unsure how Dynamical Time factors into it, which could cause it to be off by a few minutes.',
        source: `Much of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Timekeeping_on_Mars">Wikipedia article</a>.\n\nDates can also be verified with <a href="https://ops-alaska.com/time/gangale_converter/calendar_clock.htm">this website</a>, though some inaccuracies have been noted.`
    },

    {
        name: 'Kali Ahargaṅa (IST)',
        id: 'kali-ahargaṅa',
        type: 'Computing Time',
        epoch: '18 February 3102 BCE',
        confidence: 'High',
        overview: ``,
        info: '',
        accuracy: '',
        source: ``
    },
]

const decimalTimeData = [
    {
        name: 'Revolutionary Time',
        id: 'revolutionary-time',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        overview: 'Revolutionary Time is the timekeeping system employed by France during the French Revolution from 1794 to 1800. It divides the day into 10 hours, each hour into 100 minutes, and each minute into 100 seconds.\n\nThe French would have used Paris Mean Time (GMT + 00:09:21) but this website uses local time.',
        info: '<table class="table-short"><tr><td>Revolutionary Time</td><td>Standard Time</td></tr><tr><td>Decimal Second</td><td>0.864 Seconds</td></tr><tr><td>Decimal Minute</td><td>1.44 Minutes (86.4 Seconds)</td></tr><tr><td>Decimal Hour</td><td>2.4 Hours (144 Minutes)</td></tr></table>',
        accuracy: 'As this is a simple mathematical calculation, this clock is exactly accuerate.',
        source: 'All of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Decimal_time">Wikipedia article</a>.'
    },

    {
        name: '.beat (BMT)',
        id: 'beat-time',
        type: 'Decimal Time',
        epoch: 'Midnight (BMT)',
        confidence: 'Exact',
        overview: '.beat time, also known as Swatch Internet Time, is a timekeeping system developed in 1998 by the Swatch corporation. It divides the day into 1000 equal parts, called .beats, and is set to the BMT timezone (UTC +2).',
        info: '<table class="table-long"><tr><th>.Beats</th><th>Seconds</th><th>Minutes</th></tr><tr><td>1</td><td>86.4</td><td>1.44</td></tr><tr><td>100</td><td>8640</td><td>144</td></tr><tr><td>200</td><td>17280</td><td>288</td></tr><tr><td>300</td><td>25920</td><td>432</td></tr><tr><td>400</td><td>34560</td><td>576</td></tr><tr><td>500</td><td>43200</td><td>720</td></tr><tr><td>600</td><td>51840</td><td>864</td></tr><tr><td>700</td><td>60480</td><td>1008</td></tr><tr><td>800</td><td>69120</td><td>1152</td></tr><tr><td>900</td><td>77760</td><td>1296</td></tr><tr><td>1000</td><td>86400</td><td>1440</td></tr></table>',
        accuracy: 'As this is a simple mathematical calculation, this clock is exactly accuerate.',
        source: 'All of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Swatch_Internet_Time">Wikipedia article</a>.'
    },

    {
        name: 'Hexadecimal',
        id: 'hexadecimal',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        overview: 'Hexadecimal time is a simple representation of the current fraction of a day in hexadecimal. Midnight starts at .0000 and the moment just before midnight is .FFFF. The smallest unit of resolution is 675/512 seconds, or about 1.318 seconds.',
        info: '<table class="table-long"><tr><th>Decimal</th><th>Hexadecimal</th></tr><tr><td>0</td><td>0000</td></tr><tr><td>1</td><td>0001</td></tr><tr><td>2</td><td>0002</td></tr><tr><td>3</td><td>0003</td></tr><tr><td>4</td><td>0004</td></tr><tr><td>5</td><td>0005</td></tr><tr><td>6</td><td>0006</td></tr><tr><td>7</td><td>0007</td></tr><tr><td>8</td><td>0008</td></tr><tr><td>9</td><td>0009</td></tr><tr><td>10</td><td>000A</td></tr><tr><td>11</td><td>000B</td></tr><tr><td>12</td><td>000C</td></tr><tr><td>13</td><td>000D</td></tr><tr><td>14</td><td>000E</td></tr><tr><td>15</td><td>000F</td></tr><tr><td>16</td><td>0010</td></tr><tr><td>17</td><td>0011</td></tr></table>',
        accuracy: 'As this is a simple mathematical calculation, this clock is exactly accuerate.',
        source: 'All of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Gregorian_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Binary (16 bit)',
        id: 'binary',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        overview: 'Binary time is the binary representation of the day divided into 2^16 (65,536) equal parts, with all 0s being midnight and a 1 followed by 15 zeros being exactly half the day (noon). The smallest unit of resolution is 675/512 seconds, or about 1.318 seconds.',
        info: '<table class="table-long"><tr><th>Decimal</th><th>Binary</th></tr><tr><td>0</td><td>0000000000000000</td></tr><tr><td>1</td><td>0000000000000001</td></tr><tr><td>2</td><td>0000000000000010</td></tr><tr><td>3</td><td>0000000000000011</td></tr><tr><td>4</td><td>0000000000000100</td></tr><tr><td>5</td><td>0000000000000101</td></tr><tr><td>6</td><td>0000000000000110</td></tr><tr><td>7</td><td>0000000000000111</td></tr><tr><td>8</td><td>0000000000001000</td></tr><tr><td>9</td><td>0000000000001001</td></tr><tr><td>10</td><td>0000000000001010</td></tr><tr><td>11</td><td>0000000000001011</td></tr><tr><td>12</td><td>0000000000001100</td></tr><tr><td>13</td><td>0000000000001101</td></tr><tr><td>14</td><td>0000000000001110</td></tr><tr><td>15</td><td>0000000000001111</td></tr></table>',
        accuracy: 'As this is a simple mathematical calculation, this clock is exactly accuerate.',
        source: 'All of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Binary_clock">Wikipedia article</a>.'
    },
]

const otherTimeData = [
    {
        name: 'Coordinated Mars Time',
        id: 'coordinated-mars-time',
        type: 'Other Time',
        epoch: 'Martian Midnight',
        confidence: 'High',
        overview: `Coordinated Mars Time, also called MTC as well as Airy Mean Time (AMT), is a proposed clock for use on Mars which has gained some level of mainstream traction in the scientific community. It is intended to be a Martian analog to Earth's UTC. The time is displayed as hours, minutes, and seconds since midnight on Mars at the location of the Airy-0 crater. The clock is the same as clocks on Earth, with 24 hours and 60 minutes in an hour, though each unit is slightly longer due to the length of the sol being 39 minutes and 35 seconds longer than the day.`,
        info: 'This clock uses the Mars Sol Date for the calculation determining where midnight begins.\n\n<table class="table-short"><tr><td>MTC</td><td>Standard Time</td></tr><tr><td>MTC Second</td><td>1.02749125 Seconds</td></tr><tr><td>MTC Minute</td><td>61.649475 Seconds</td></tr><tr><td>MTC Hour</td><td>61.649475 Minutes</td></tr></table>',
        accuracy: 'This clock should be reasonably accurate, though it might be off by a feww minutes or seconds due to Dynamical Time.',
        source: `All of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Timekeeping_on_Mars">Wikipedia article</a>.`
    },
]

const solarCalendarsData = [
    {
        name: 'Gregorian',
        id: 'gregorian',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        overview: 'The Gregorian Calendar is the calendar used by most of the world. It has 365 days, with an extra leap day every year divisible by 4 unless divisible by 100, except for years also divisible by 400.\n\nThe era is denoted \'CE\' meaning \'Common Era\' and \'BCE\' meaning \'Before Common Era\'. Dates can also be expressed in AD/BC as in the Julian calendar.\n\nThe calendar was issued by Pope Gregory XIII on October 15th, 1582 and is derived from the Julian Calendar after skipping 10 days between October 5th and 15th. The two calendars differ by the 400-year leap year rule.\n\nThis calendar is exactly accurate, however dates before October 15th 1582 are proleptic, and many countries did not adopt it until much later than 1582.',
        info: `After the initial 10-day skip in 1582 and the following centuries to the 21st century, the Gregorian calendar and the Julian calendar are 13 days apart.\n\n<table class="table-long"><tr><th>Month</th><th>Days</th></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>28 or 29</td></tr><tr><td>March</td><td>31</td></tr><tr><td>April</td><td>30</td></tr><tr><td>May</td><td>31</td></tr><tr><td>June</td><td>30</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>31</td></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>31</td></tr></table>`,
        accuracy: 'The Gregorian calendar is exactly accurate, as it is what this entire site is based on. However, it does drift from the solar year ever so slightly at a rate of about 1 day every 3030 years without taking axial precession into account, or 1 day every 7700 years if taken into account.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Gregorian_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Julian',
        id: 'julian',
        type: 'Solar Calendar',
        epoch: 'January 3rd, 1 CE',
        confidence: 'High',
        overview: 'The Julian Calendar was issued by Julius Caesar in 45 BC after several corrections to the solar date.\n\nIt features a leap day every 4 years, leading it to drift from the Gregorian calendar by 3 days every 400 years. Years are denoted \'AD\' or \'Anno Domini\', meaning \'in the year of the Lord\', as well as \'BC\' meaning \'Before Christ\'.\n\nThe Julian calendar was the principal calendar in much of the world, especially Europe, prior to the adoption of the Gregorian calendar.',
        info: `The Julian calendar drifts from the solar year by about 1 day every 129 years, as it has too many leap years. The Gregorian calendar is meant to correct this drift. As of the 21st century, the two calendars are 13 days apart.\n\n<table class="table-long"><tr><th>Month</th><th>Days</th></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>28 or 29</td></tr><tr><td>March</td><td>31</td></tr><tr><td>April</td><td>30</td></tr><tr><td>May</td><td>31</td></tr><tr><td>June</td><td>30</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>31</td></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>31</td></tr></table>`,
        accuracy: 'The Julian calendar is exactly accurate in relation to the Gregorian calendar, but dates before 40 BC might not reflect civic dates of the era due to a series of corrections.\n\nThe date of leap days might not be exactly aligned with the Gregorian calendar here, but they are accurate to the year.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Julian_calendar">Wikipedia article</a>.'
    },

    {
        name: 'French Republican (CET)',
        id: 'french-republican',
        type: 'Solar Calendar',
        epoch: 'September 22nd, 1792 CE',
        confidence: 'High',
        overview: `The French Republican calendar was used during and after the French Revolution from 1793 to 1805 and was a drastic change to the Gregorian calendar.\n\nIt featured twelve months of 30 days each, broken into 3 weeks of 10 days. The remaining 5 or 6 days of each solar year were the Sansculottides, to be treated as national holidays at the end of the year.\n\nThe new year started on the Autumn Equinox, and years were written in Roman numerals with the era name of \'l\'ère républicaine\', or \'Republican Era\', abbreviated here as \'RE\'.`,
        info: `<table class="table-long"><tr><th>Month</th><th>Days</th><th>Approx. Gregorian Dates</th></tr><tr><td>Vendémiaire</td><td>30</td><td>Sep 22 - Oct 21</td></tr><tr><td>Brumaire</td><td>30</td><td>Oct 22 - Nov 20</td></tr><tr><td>Frimaire</td><td>30</td><td>Nov 21 - Dec 20</td></tr><tr><td>Nivôse</td><td>30</td><td>Dec 21 - Jan 19</td></tr><tr><td>Pluviôse</td><td>30</td><td>Jan 20 - Feb 18</td></tr><tr><td>Ventôse</td><td>30</td><td>Feb 19 - Mar 20</td></tr><tr><td>Germinal</td><td>30</td><td>Mar 21 - Apr 19</td></tr><tr><td>Floréal</td><td>30</td><td>Apr 20 - May 19</td></tr><tr><td>Prairial</td><td>30</td><td>May 20 - Jun 18</td></tr><tr><td>Messidor</td><td>30</td><td>Jun 19 - Jul 18</td></tr><tr><td>Thermidor</td><td>30</td><td>Jul 19 - Aug 17</td></tr><tr><td>Fructidor</td><td>30</td><td>Aug 18 - Sep 16</td></tr><tr><td>Sansculottides</td><td>5 or 6</td><td>Sep 17 - Sep 21</td></tr></table>`,
        accuracy: `This calendar depends on the accuracy of the equinox calculations, which are generally within a few minutes of accuracy and should only affect years where the equinox happens very close to midnight CET.\n\nThe French Republican calendar also had some issues with rules that contracticted each other, like a 4 year leap year rule conflicting with the date of the equinox. That rule has been ignored in favor of the equinox rule.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/French_Republican_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Era Fascista',
        id: 'era-fascista',
        type: 'Solar Calendar',
        epoch: 'October 29th, 1922 CE',
        confidence: 'High',
        overview: 'Era Fascista is a simple count of number of years since the start of the Fascist Era in Italy on October 29th, 1922, starting with Anno I.\n\nTaking inspiration from the French Republican calendar, years were written in Roman numerals and it was intended to replace the Gregorian calendar.',
        info: `Era Fascista didn't really implement months, as it was used alongside the Gregorian calendar. Enscriptions marked in Era Fascista dates could use a number of different abbreviations, such as 'Anno', 'E.F.', 'Anno Fascista', 'A.F.', or simply 'A.'.`,
        accuracy: 'Era Fascista is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Era_Fascista">Wikipedia article</a>.'
    },

    {
        name: 'Coptic (UTC)',
        id: 'coptic',
        type: 'Solar Calendar',
        epoch: 'August 29th, 284 CE',
        confidence: 'High',
        overview: 'The Coptic calendar, also known as the Alexandrian calendar, was used in Egypt until the adoption of the Gregorian calendar in 1875. It is based on the ancient Egyptian calendar but with leap days every four years, keeping it in sync with the Julian calendar while sharing months and days with the Ge\'ez calendar.\n\nIt has 12 months of 30 days plus a smaller 13th month of 5 or 6 days. The new year starts on the 11th or 12th of September, and years are abbreviated with \'AM\', meaning Anno Martyrum, or \'Year of the Martyrs\'.\n\nThe Coptic calendar is still in use today by Egyptian farmers as well as the Coptic Orthodox Church.',
        info: `The Ge\'ez calendar is precisely aligned with the Coptic calendar for its months and days. It's epoch, translated to 'Year of the Martyrs', is counted from the year Diocletian became Emperor of Rome, which was followed by a period of mass persecution of Christians.\n\n<table class="table-long"><tr><th>Month</th><th>Days</th><th>Approx. Gregorian Dates</th></tr><tr><td>Thout</td><td>30</td><td>Sep 11 - Oct 10</td></tr><tr><td>Paopi</td><td>30</td><td>Oct 11 - Nov 9</td></tr><tr><td>Hathor</td><td>30</td><td>Nov 10 - Dec 9</td></tr><tr><td>Koiak</td><td>30</td><td>Dec 10 - Jan 8</td></tr><tr><td>Tobi</td><td>30</td><td>Jan 9 - Feb 7</td></tr><tr><td>Meshir</td><td>30</td><td>Feb 8 - Mar 9</td></tr><tr><td>Paremhat</td><td>30</td><td>Mar 10 - Apr 8</td></tr><tr><td>Parmouti</td><td>30</td><td>Apr 9 - May 8</td></tr><tr><td>Pashons</td><td>30</td><td>May 9 - Jun 7</td></tr><tr><td>Paoni</td><td>30</td><td>Jun 8 - Jul 7</td></tr><tr><td>Epip</td><td>30</td><td>Jul 8 - Aug 6</td></tr><tr><td>Mesori</td><td>30</td><td>Aug 7 - Sep 5</td></tr><tr><td>Pi Kogi Enavot</td><td>5 or 6</td><td>Sep 6 - Sep 10</td></tr></table>`,
        accuracy: 'The Coptic calendar is intrinsically based on and locked to the Julian calendar, making it perfectly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Coptic_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Ge\'ez (UTC)',
        id: 'ethiopian',
        type: 'Solar Calendar',
        epoch: 'August 27th, 8 CE',
        confidence: 'High',
        overview: 'The Ge\'ez calendar is the official calendar of Ethiopia. It has 12 months of 30 days plus a smaller 13th month of 5 or 6 days. It has a leap day every 4 years, keeping it in sync with the Julian calendar while sharing months and days with the Coptic calendar.\n\nThe New Year starts on September 11th or 12th, with years abbreviated with ዓ.ም. which is pronounced \'am\', short for Amätä Mihret, meaning \'Year of Mercy\'.',
        info: `The Ge\'ez calendar is precisely aligned with the Coptic calendar for its months and days. It nearly shares an epoch with the Julian calendar, as they both are counting years since the same event, but is actually 7-8 years behind due to a difference in calculation of the date of the Annunciation.\n\n<table class="table-long"><tr><th>Month</th><th>Days</th><th>Approx. Gregorian Dates</th></tr><tr><td>Mäskäräm</td><td>30</td><td>Sep 11 - Oct 10</td></tr><tr><td>Ṭəqəmt</td><td>30</td><td>Oct 11 - Nov 9</td></tr><tr><td>Ḫədar</td><td>30</td><td>Nov 10 - Dec 9</td></tr><tr><td>Taḫśaś</td><td>30</td><td>Dec 10 - Jan 8</td></tr><tr><td>Ṭərr</td><td>30</td><td>Jan 9 - Feb 7</td></tr><tr><td>Yäkatit</td><td>30</td><td>Feb 8 - Mar 9</td></tr><tr><td>Mägabit</td><td>30</td><td>Mar 10 - Apr 8</td></tr><tr><td>Miyazya</td><td>30</td><td>Apr 9 - May 8</td></tr><tr><td>Gənbo</td><td>30</td><td>May 9 - Jun 7</td></tr><tr><td>Säne</td><td>30</td><td>Jun 8 - Jul 7</td></tr><tr><td>Ḥamle</td><td>30</td><td>Jul 8 - Aug 6</td></tr><tr><td>Nähase</td><td>30</td><td>Aug 7 - Sep 5</td></tr><tr><td>Ṗagume</td><td>5 or 6</td><td>Sep 6 - Sep 10</td></tr></table>`,
        accuracy: 'The Ge\'ez calendar is intrinsically based on and locked to the Julian calendar, making it perfectly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Ethiopian_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Minguo',
        id: 'minguo',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        confidence: 'Exact',
        overview: `The Minguo calendar, also known as the Republic of China calendar, is used in Taiwan and its territories. Following the traditional convention of numbering years after the current dynastic era, dates are counted in 民國 ('MinGuo'), translated as 'Year of the Republic' with year 1 being the establishment of the ROC in 1912, while its numerical months (月 "yue") and days (日 "ri") follow the Gregorian calendar.\n\nThe Minguo calendar was also used in China between 1912 and the fleeing of the ROC to Taiwan in 1949.`,
        info: `Prior to the establishment of the Repiblic of China in 1912, the Chinese people and government used the traditional Chinese lunisolar calendar. The ROC adopted the Gregorian calendar for official business but used the new Era of the Republic as the epoch. After claiming victory over the Chinese mainland in 1949, the PRC opted to use the Gregorian calendar along with its epoch.`,
        accuracy: 'The Minguo calendar is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Republic_of_China_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Thai',
        id: 'thai',
        type: 'Solar Calendar',
        epoch: 'January 1st, 543 BCE',
        confidence: 'High',
        overview: 'The Thai solar calendar is used in Thailand and is 543 years ahead of the Gregorian calendar, though it shares the same months with different names.\n\nIt represents the number of years of the current Buddhist Era (B.E.), the Era of the Shaka Buddha. Year 0 falls on the Gregorian year of 543 BCE.',
        info: `<table class="table-long"><tr><th>Months</th><th>English</th><th>Days</th></tr><tr><td>มกราคม</td><td>January</td><td>31</td></tr><tr><td>กุมภาพันธ์</td><td>February</td><td>28 or 29</td></tr><tr><td>มีนาคม</td><td>March</td><td>31</td></tr><tr><td>เมษายน</td><td>April</td><td>30</td></tr><tr><td>พฤษภาคม</td><td>May</td><td>31</td></tr><tr><td>มิถุนายน</td><td>June</td><td>30</td></tr><tr><td>กรกฎาคม</td><td>July</td><td>31</td></tr><tr><td>สิงหาคม</td><td>August</td><td>31</td></tr><tr><td>กันยายน</td><td>September</td><td>30</td></tr><tr><td>ตุลาคม</td><td>October</td><td>31</td></tr><tr><td>พฤศจิกายน</td><td>November</td><td>30</td></tr><tr><td>ธันวาคม</td><td>December</td><td>31</td></tr></table>`,
        accuracy: 'The Thai solar calendar is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Thai_solar_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Juche',
        id: 'juche',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        confidence: 'Exact',
        overview: 'The Juche calendar is used in North Korea. It represents the number of years since the birth year of Kim Il Sung, the founder of the DPRK, and was adopted in 1997. For its months and days it follows the Gregorian calendar.',
        info: `Juche refers to the specific ideology of the Worker's Party of Korea and is related to Marxist-Leninism.`,
        accuracy: 'The Juche calendar is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Juche_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Byzantine',
        id: 'byzantine',
        type: 'Solar Calendar',
        epoch: 'July 19th, 5508 BCE',
        confidence: 'Exact',
        overview: 'The Byzantine calendar was the official calendar of the Byzantine Empire from 988 to 1453 and was used in Ukraine and Russia until 1700.\n\nIt followed the Julian calendar but differed by the new year starting on September 1st and the epoch being September 1st, 5509 BC (July 19th, 5508 BCE in the proleptic Gregorian calendar). Years are counted in AM, or \'Anno Mundi\' meaning \'Year After Creation\'.',
        info: `<table class="table-long"><tr><th>Months</th><th>Days</th></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>31</td></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>28 or 29</td></tr><tr><td>March</td><td>31</td></tr><tr><td>April</td><td>30</td></tr><tr><td>May</td><td>31</td></tr><tr><td>June</td><td>30</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>31</td></tr></table>`,
        accuracy: 'The Byzantine calendar is intrinsically based on and locked to the Julian calendar, making it perfectly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Byzantine_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Florentine (CET)',
        id: 'florentine',
        type: 'Solar Calendar',
        epoch: 'March 21st, 0 BCE',
        confidence: 'Exact',
        overview: 'The Florentine calendar was the calendar used in the Republic of Florence during the Middle Ages. It followed the Julian calendar for its years, months, and days with a few key differences: the new year started on March 25th.\n\nThis meant that January 1st of a given year was immediately after December 31st of the same year, and March 24th of that year was followed by March 25th of the next year.\n\nDays also started at sunset, which is approximated here as 6:00pm in Florence.',
        info: `<table class="table-long"><tr><th>Months</th><th>Days</th></tr><tr><td>March (25th - 31st)</td><td>7</td></tr><tr><td>April</td><td>30</td></tr><tr><td>May</td><td>31</td></tr><tr><td>June</td><td>30</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>31</td></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>31</td></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>28 or 29</td></tr><tr><td>March (1st - 24th)</td><td>24</td></tr></table>`,
        accuracy: 'The Florentine calendar is intrinsically based on and locked to the Julian calendar, making it perfectly accurate. The only inaccuracies are the differences in the approximation of sunset to the actual time of sunset, which is expected to only differ by a few hours or minutes per day.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Florentine_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Baháʼí (IRST)',
        id: 'bahai',
        type: 'Solar Calendar',
        epoch: 'March 3rd, 1844 CE',
        confidence: 'High',
        overview: 'The Baháʼí calendar is the calendar of the Baháʼí Faith. It is a pure solar calendar, as it begins its New Year on the day of the Spring Equinox, preventing it from drifting from the tropical year and causing it to very slowly drift from the Gregorian calendar.\n\nIt features 19 months (or sometimes referred to as weeks) of 19 days, for a total of 361 days. The remaining 4 or 5 days of each year are called Ayyám-i-Há and take place between the final two months, Mulk and ‘Alá’, typically at the end of February.\n\nDays start at sunset in Tehran, which is approximated here as 18:00 IRST. Years are denoted with \'BE\', meaning Baháʼí Era.',
        info: `<table class="table-long"><tr><th>Months</th><th>Days</th><th>Approx. Gregorian Time</th></tr><tr><td>Bahá</td><td>19</td><td>Mar 21 - Apr 8</td></tr><tr><td>Jalál</td><td>19</td><td>Apr 9 - Apr 27</td></tr><tr><td>Jamál</td><td>19</td><td>Apr 28 - May 16</td></tr><tr><td>‘Aẓamat</td><td>19</td><td>May 17 - Jun 4</td></tr><tr><td>Núr</td><td>19</td><td>Jun 5 - Jun 23</td></tr><tr><td>Raḥmat</td><td>19</td><td>Jun 24 - Jul 12</td></tr><tr><td>Kalimát</td><td>19</td><td>Jul 13 - Jul 31</td></tr><tr><td>Kamál</td><td>19</td><td>Aug 1 - Aug 19</td></tr><tr><td>Asmá’</td><td>19</td><td>Aug 20 - Sep 7</td></tr><tr><td>‘Izzat</td><td>19</td><td>Sep 8 - Sep 26</td></tr><tr><td>Mashíyyat</td><td>19</td><td>Sep 27 - Oct 15</td></tr><tr><td>‘Ilm</td><td>19</td><td>Oct 16 - Nov 3</td></tr><tr><td>Qudrat</td><td>19</td><td>Nov 4 - Nov 22</td></tr><tr><td>Qawl</td><td>19</td><td>Nov 23 - Dec 11</td></tr><tr><td>Masá’il</td><td>19</td><td>Dec 12 - Dec 30</td></tr><tr><td>Sharaf</td><td>19</td><td>Dec 31 - Jan 18</td></tr><tr><td>Sulṭán</td><td>19</td><td>Jan 19 - Feb 6</td></tr><tr><td>Mulk</td><td>19</td><td>Feb 7 - Feb 25</td></tr><tr><td>Ayyám-i-Há</td><td>4 or 5</td><td>Feb 26 - Mar 1</td></tr><tr><td>‘Alá’</td><td>19</td><td>Mar 2 - Mar 20</td></tr></table>`,
        accuracy: 'The accuracy of this calendar depends on the equinox calculations and may be off by a day for a whole year, but it is likely to self-correct by the next year. The equation breaks down considerably if rolled back or forward several thousand years as the equinox drifts due to precession and Dynamical Time invokes inaccuracies.\n\nThe sunset approximation is also likely to cause slight inaccuracies if the New Moon happens very near to sunset, though this is similarly likely to self-correct by the next year. On that note, the dates may change slightly too early or late depending on the real time of sunset.',
        source: 'A lot of the information about this calendar came from its <a href="https://en.wikipedia.org/wiki/Bah%C3%A1%CA%BC%C3%AD_calendar">Wikipedia article</a>.\n\nDates can be referenced at the <a href="https://www.bahai.org/action/devotional-life/calendar">official Baháʼí website</a>.'
    },

    {
        name: 'Pataphysical',
        id: 'pataphysical',
        type: 'Solar Calendar',
        epoch: '8 September 1873 CE',
        confidence: 'Exact',
        overview: `The Pataphysical calendar is a strange take on the Gregorian calendar. It is based off of the philosophy of Pataphysics, which is a parody of science created by Alfred Jarry in 1893, though the calendar wasn't created until 1949.\n\nIt features 13 months of 29 days, though for each month the 29th day is imaginary except for the month of Gidouille as well as Gueules in leap years. New Year is on September 8th of the Gregorian calendar, and the epoch is the day of Alfred Jarry's birth, 8 September 1873 CE.`,
        info: `<table class="table-long"><tr><th>Months</th><th>Days</th><th>English</th><th>Approx. Gregorian Time</th></tr><tr><td>Absolu</td><td>28</td><td>Absolute</td><td>Sept 8 - Oct 5</td></tr><tr><td>Haha</td><td>28</td><td>Haha</td><td>Oct 6 - Nov 2</td></tr><tr><td>As</td><td>28</td><td>Skiff</td><td>Nov 3 - Nov 30</td></tr><tr><td>Sable</td><td>28</td><td>Sand or heraldic black</td><td>Dec 1 - Dec 28</td></tr><tr><td>Décervelage</td><td>28</td><td>Debraining</td><td>Dec 29 - Jan 25</td></tr><tr><td>Gueules</td><td>28 or 29</td><td>Heraldic red or gob</td><td>Jan 26 - Feb 22</td></tr><tr><td>Pédale</td><td>28</td><td>Bicycle pedal</td><td>Feb 23 - Mar 22</td></tr><tr><td>Clinamen</td><td>28</td><td>Swerve</td><td>Mar 23 - Apr 19</td></tr><tr><td>Palotin</td><td>28</td><td>Ubu's henchmen</td><td>Apr 20 - May 17</td></tr><tr><td>Merdre</td><td>28</td><td>Pshit</td><td>May 18 - Jun 14</td></tr><tr><td>Gidouille</td><td>29</td><td>Spiral</td><td>Jun 15 - Jul 13</td></tr><tr><td>Tatane</td><td>28</td><td>Shoe or being worn out</td><td>Jul 14 - Aug 10</td></tr><tr><td>Phalle</td><td>28</td><td>Phallus</td><td>Aug 11 - Sept 7</td></tr></table>`,
        accuracy: `The Pataphysical calendar is based off the Gregorian calendar and is thus exactly accurate.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/%27Pataphysics#Pataphysical_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Discordian',
        id: 'discordian',
        type: 'Solar Calendar',
        epoch: '1 January 1165 BCE',
        confidence: 'Exact',
        overview: `The Discordian calendar is the calendar used in the virtual religion of Discordianism. It features 5 months, each of 73 days, with the year beginning on January 1st.\n\nIt follows Gregorian leap years, inserting a day between the 59th and 60th of the month of Chaos, lining up with February 29th on the Gregorian calendar. The leap day is called 'St. Tib's Day', and it takes place outside of any month or week, as though the calendar paused for a day.`,
        info: `<table class="table-long"><tr><th>Months</th><th>Days</th><th>Approx. Gregorian Time</th></tr><tr><td>Chaos</td><td>73</td><td>Jan 1 - Mar 14</td></tr><tr><td>Discord</td><td>73</td><td>Mar 15 - May 26</td></tr><tr><td>Confusion</td><td>73</td><td>May 27 - Aug 8</td></tr><tr><td>Bureaucracy</td><td>73</td><td>Aug 9 - Oct 19</td></tr><tr><td>The Aftermath</td><td>73</td><td>Oct 20 - Dec 31</td></tr><tr><td>St. Tib's Day</td><td>1</td><td>Feb 29</td></tr></table>`,
        accuracy: `The Discordian calendar is based off the Gregorian calendar and is thus exactly accurate.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Discordian_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Solar Hijri',
        id: 'solar-hijri',
        type: 'Solar Calendar',
        epoch: '',
        confidence: 'High',
        overview: ``,
        info: ``,
        accuracy: ``,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Solar_Hijri_calendar">Wikipedia article</a>.'
    },
]

const lunisolarCalendarsData = [
    {
        name: 'Chinese (CST)',
        id: 'chinese',
        type: 'Lunisolar Calendar',
        epoch: '2698 BCE',
        confidence: 'Medium',
        overview: 'The Chinese lunisolar calendar is one of the most successful and widespread calendars in history. It has been used since ancient times and is still used today by much of East Asia.\n\nIt features numerically-named months (月 "yue") of 29 or 30 days (日 "ri") that begin on the same day as the New Moon in China (CST), with an intercalary month added on leap years that happen roughly every 2 or 3 solar years (年 "nian"). Years are also named in a 12-year cycle of the 12 Earthly Branches (Chinese Zodiac).\n\nDifferent versions of this calendar use different eras, but this website uses 2698 BCE as the Year of the Yellow Emperor, a date which was standardized by Sun Yat-sen in 1912 despite there being controversy over the exact date.',
        info: '<table class="table-long"><tr><th>Year Cycle</th><th>English</th></tr><tr><td>鼠</td><td>Rat</td></tr><tr><td>牛</td><td>Ox</td></tr><tr><td>虎</td><td>Tiger</td></tr><tr><td>兔</td><td>Rabbit</td></tr><tr><td>龍</td><td>Dragon</td></tr><tr><td>蛇</td><td>Snake</td></tr><tr><td>馬</td><td>Horse</td></tr><tr><td>羊</td><td>Goat</td></tr><tr><td>猴</td><td>Monkey</td></tr><tr><td>雞</td><td>Rooster</td></tr><tr><td>狗</td><td>Dog</td></tr><tr><td>豬</td><td>Pig</td></tr></table>',
        accuracy: 'Calculating this calendar is very difficult and requires calculating the Winter Solstice, Spring Equinox, Longitude of the Sun, and any given New Moon. Due to the difficulty of this calculation, months and days might be off by 1 at times, though they typically self-correct by the next month.',
        source: 'This equation was based off of the steps found <a href="https://ytliu0.github.io/ChineseCalendar/rules.html">here</a>.\n\nGeneral information was taken from the <a href="https://en.wikipedia.org/wiki/Chinese_calendar">Wikipedia article</a> for this calendar.'
    },

    {
        name: 'Sexagenary Year (CST)',
        id: 'sexagenary-year',
        type: 'Lunisolar Calendar',
        epoch: '2698 BCE',
        confidence: 'High',
        overview: 'The Sexagenary Cycle is a system of counting years in the Chinese calendar (and several other aspects of life). It is a multiplication of the 10 Heavenly Stems and the 12 Earthly Branches (Chinese Zodiac) with half of the combinations left out, leading to a total cycle length of 60. The cycle moves to the next combination on the day of the New Year in the Chinese lunisolar calendar.',
        info: '<table class="table-long"><tr><th>10 Heavenly Stems</th><th>12 Earthly Branches</th></tr><tr><td>甲 (Jia)</td><td>子 (Zi)</td></tr><tr><td>乙 (Yi)</td><td>丑 (Chou)</td></tr><tr><td>丙 (Bing)</td><td>寅 (Yin)</td></tr><tr><td>丁 (Ding)</td><td>卯 (Mao)</td></tr><tr><td>戊 (Wu)</td><td>辰 (Chen)</td></tr><tr><td>己 (Ji)</td><td>巳 (Si)</td></tr><tr><td>庚 (Geng)</td><td>午 (Wu)</td></tr><tr><td>辛 (Xin)</td><td>未 (Wei)</td></tr><tr><td>壬 (Ren)</td><td>申 (Shen)</td></tr><tr><td>癸 (Gui)</td><td>酉 (You)</td></tr><tr><td></td><td>戌 (Xu)</td></tr><tr><td></td><td>亥 (Hai)</td></tr></table>',
        accuracy: 'This calendar system should be very accurate. At most it will be off by a few days at the start of a given year due to the inaccuracies from the Chinese lunisolar calendar calculations. However, it quickly corrects itself after a few days.',
        source: 'Some general information was taken from the <a href="https://en.wikipedia.org/wiki/Sexagenary_cycle">Wikipedia article</a> for this calendar, but the general calculation is derived from the Chinese lunisolar calendar.'
    },

    {
        name: 'Đại lịch (ICT)',
        id: 'vietnamese',
        type: 'Lunisolar Calendar',
        epoch: '1 CE',
        confidence: 'Medium',
        overview: 'The Đại lịch calendar is the traditional calendar of Vietnam. It is derived from the Chinese lunisolar calendar and shares many of the same elements, but it is set to Vietnamese time, meaning on rare occasions the two calendars can temporarily be significantly offset, only to realign again later.\n\nIt features 12 months of 29 or 30 days with a leap month on average every 2-3 years.\n\nThe Đại lịch calendar also follows a similar 12 Earthly Branches (Vietnamese Zodiac) theme for each year, though a few of the animals are different from the Chinese calendar.\n\nThis calendar uses the same epoch as the Gregorian calendar and may not reflect historic epochs. Similarly, the calendar hasn\'t always been set to Vietnamese time, changing back from Chinese time in the mid-20th century, so dates before that are likely to be incorrect.',
        info: `<table class="table-long"><tr><th>Year Cycle</th><th>English</th></tr><tr><td>𤝞</td><td>Rat</td></tr><tr><td>𤛠</td><td>Water Buffalo</td></tr><tr><td>𧲫</td><td>Tiger</td></tr><tr><td>猫</td><td>Cat</td></tr><tr><td>龍</td><td>Dragon</td></tr><tr><td>𧋻</td><td>Snake</td></tr><tr><td>馭</td><td>Horse</td></tr><tr><td>羝</td><td>Goat</td></tr><tr><td>𤠳</td><td>Monkey</td></tr><tr><td>𪂮</td><td>Rooster</td></tr></table>`,
        accuracy: 'calendar accuracy',
        source: 'Some general information was taken from the <a href="https://en.wikipedia.org/wiki/Vietnamese_calendar">Wikipedia article</a> for this calendar, but the general calculation is derived from the Chinese lunisolar calendar.'
    },

    {
        name: 'Dangun (KST)',
        id: 'dangun',
        type: 'Lunisolar Calendar',
        epoch: '1 CE',
        confidence: 'Medium',
        overview: 'The Dangun calendar is the traditional calendar of Korea. It is no longer officially used, but it is still maintained by the South Korean goverment for cultural purposes and holidays. It is derived from the Chinese lunisolar calendar where it gets its months (월) and days (일) while sharing years (년) with the Gregorian calendar, though it doesn\'t increment the year until the lunisolar new year in January or February.\n\nThe Dangun calendar is calculated based on midnight in Korea, and as such its dates may misalign, sometimes significantly, from the Chinese lunisolar calendar.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'Some general information was taken from the <a href="https://en.wikipedia.org/wiki/Korean_calendar">Wikipedia article</a> for this calendar, but the general calculation is derived from the Chinese lunisolar calendar.'
    },

    {
        name: 'Hebrew (IST)',
        id: 'hebrew',
        type: 'Lunisolar Calendar',
        epoch: 'October 6th, 3761 BCE',
        confidence: 'High',
        overview: 'The Hebrew calendar is a lunisolar calendar used by the Jewish faith for religious and celebratory purposes, and it is also an official calendar of Israel.\n\nIt features 12 months of 29 or 30 days that start approximately on the day of the New Moon, referred to as a Molad. It has an intercalary 13th month added after the month of Adar, called Adar II, based on the Metonic cycle which places 7 leap years in every cycle of 19 years. \n\nYears are denoted with AM for \'Anno Mundi\', meaning \'in the year of the world\', referring to the Jewish date of Creation around the year 3761 BCE.',
        info: `The Hebrew calendar is not strictly based on the moon, as it became a mathematical equation by the year 1178. Days start at sunset, which is approximated on this website as 18:00 in Israel.\n\n<table class="table-long"><tr><th>Months</th><th>Approx. Gregorian Dates</th></tr><tr><td>Tishri</td><td>September - October</td></tr><tr><td>Heshvan</td><td>October - November</td></tr><tr><td>Kislev</td><td>November - December</td></tr><tr><td>Tevet</td><td>December - January</td></tr><tr><td>Shevat</td><td>January - February</td></tr><tr><td>Adar</td><td>February - March</td></tr><tr><td>(Adar II)</td><td>February - March</td></tr><tr><td>Nisan</td><td>March - April</td></tr><tr><td>Iyyar</td><td>April - May</td></tr><tr><td>Sivan</td><td>May - June</td></tr><tr><td>Tammuz</td><td>June - July</td></tr><tr><td>Av</td><td>July - August</td></tr><tr><td>Elul</td><td>August - September</td></tr></table>`,
        accuracy: `This calendar should be very accurate, as it is based on the same calculation that is used by official sources. However, some of the dates on this site do not line up perfectly, leading me to believe I've made a mistake at some point in the calculation.\n\nIn addition, the time for sunset is approximated as 18:00 in Israel, which could lead to further inaccuracies. These inaccuracies typically fix themselves by the next month or two.`,
        source: 'The main calculation of this calendar came from <a href="https://www.jewfaq.org/jewish_calendar_calculation">this website</a>.\n\nDates can be checked for calibration <a href="https://www.chabad.org/calendar/view/month.htm">here</a>.\n\nSome general information was taken from the <a href="https://en.wikipedia.org/wiki/Hebrew_calendar">Wikipedia article</a> for this calendar.'
    },
]

const lunarCalendarsData = [
    {
        name: 'Hijri (AST)',
        id: 'hijri',
        type: 'Lunar Calendar',
        epoch: 'July 19, 622 CE',
        confidence: 'Medium',
        overview: `The Hijri calendar is the principal calendar used in Islam, and it is perhaps the only extant true lunar calendar in the world. It features 12 lunar months of 29 or 30 days, with days starting at sunset, for a total of 355 or 356 days per year, causing it to be out of sync with solar calendars.\n\nEra dates are denoted \'AH\' from \'Anno Hegirae\', meaning \'In the year of the Hijrah\'. Each month starts shortly after the New Moon when it begins to appear as a crescent.\n\nThe desert-faring culture of Islam is apparent in this calendar, as such a civilization is less affected by seasonal changes than civilizations in most other biomes. Thus, they would have had no need to implement an intercalary month system to synchronize the calendar with the solar year.`,
        info: `The Hijri calendar is on a roughly 37-year cycle when compared with the solar year. Dates and holidays drift throughout the entire year before arriving back where they started 37 years prior.\n\n<table class="table-long"><tr><th>Months</th></tr><tr><td>al-Muḥarram</td></tr><tr><td>Ṣafar</td></tr><tr><td>Rabīʿ al-ʾAwwal</td></tr><tr><td>Rabīʿ ath-Thānī</td></tr><tr><td>Jumādā al-ʾŪlā</td></tr><tr><td>Jumādā al-ʾĀkhirah</td></tr><tr><td>Rajab</td></tr><tr><td>Shaʿbān</td></tr><tr><td>Ramaḍān</td></tr><tr><td>Shawwāl</td></tr><tr><td>Dhū al-Qaʿdah</td></tr><tr><td>Dhū al-Ḥijjah</td></tr></table>
        `,
        accuracy: `Many Muslim nations have their own rules for determining the start of the month, often based on direct observation, and as such their calendar dates may occasionally misalign for a month or two. The algorithm used by this website requires calculating the New Moon and uses 18:00 local time in Mecca for sunset. Its accuracy is dependent on the New Moon calculations and may not reflect historical records.`,
        source: 'A lot of the information about this calendar came from its <a href="https://en.wikipedia.org/wiki/Islamic_calendar">Wikipedia article</a>.\n\n<a href="https://www.islamicfinder.org/islamic-calendar/">This site</a> seems to be a good source for callibrating dates.'
    },
]

const proposedCalendars = [
    {
        name: 'Human Era',
        id: 'human-era',
        type: 'Proposed Calendar',
        epoch: 'January 1st, 9999 BCE',
        confidence: 'Exact',
        overview: 'The Human Era, also known as the Holocene Era, is the calendar representation of time since the beginning of the Holocene and the Neolithic Revolution, when humans started living in fixed agricultural settlements. It was proposed by Cesare Emiliani in 1993 CE and is based on the Gregorian calendar.',
        info: `The Human Era is an attempt to adapt the Gregorian calendar, which has become widespread enough that it could be considered the default calendar of the world, in a way that is free from religious influence. It chooses its epoch based on what may be the most significant moment in human history: the time when humans first created civilization. Conventiently, this occurs roughly 10000 years before 1 AD, allowing for simple math to arrive at the converted date.\n\n<table class="table-long"><tr><th>Months</th><th>Days</th></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>28 or 29</td></tr><tr><td>March</td><td>31</td></tr><tr><td>April</td><td>30</td></tr><tr><td>May</td><td>31</td></tr><tr><td>June</td><td>30</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>31</td></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>31</td></tr></table>`,
        accuracy: `As this calendar is only a proposal, there really isn't anything to compare it to historically. It is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Holocene_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Invariable',
        id: 'invariable',
        type: 'Proposed Calendar',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        overview: 'The Invariable calendar was proposed by L. A. Grosclaude in 1900 CE as well as by Gaston Armelin in 1887 CE. It features months in a repeating pattern of 30/30/31 days with New Years Day happening between December and January and Leap Day occurring between June and July in leap years, which happen in the same years as the Gregorian calendar. These two special days are not part of any week nor month, as if the calendar has paused for 24 hours.\n\nThe regular month lengths ensure that the first of every month always lands on a Monday, Wednesday, or Friday in a predictable pattern that is the same every year.',
        info: `<table class=table-short><tr><th>Calendar Unit</th><th>Days</th></tr><tr><td>New Years Day</td><td>1</td></tr><tr><td>January</td><td>30</td></tr><tr><td>February</td><td>30</td></tr><tr><td>March</td><td>31</td></tr><tr><td>April</td><td>30</td></tr><tr><td>May</td><td>30</td></tr><tr><td>June</td><td>31</td></tr><tr><td>(Leap Day)</td><td>1</td></tr><tr><td>July</td><td>30</td></tr><tr><td>August</td><td>30</td></tr><tr><td>September</td><td>31</td></tr><tr><td>October</td><td>30</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>31</td></tr></table>`,
        accuracy: `As this calendar is only a proposal, there really isn't anything to compare it to historically. It is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Invariable_Calendar">Wikipedia article</a>.'
    },

    {
        name: 'The World Calendar',
        id: 'world-calendar',
        type: 'Proposed Calendar',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        overview: 'The World Calendar was proposed by Elisabeth Achelis in 1930 CE and was nearly adopted by the League of Nations. It features months in a repeating pattern of 31/30/30 days with World\'s Day happening between December and January and Leapyear Day occurring between June and July in leap years, which happen in the same years as the Gregorian calendar. These two special days are not part of any week nor month, as if the calendar has paused for 24 hours.\n\nThe regular month lengths ensure that the first of every month always lands on a Sunday, Wednesday, or Friday in a predictable pattern that is the same every year.',
        info: `<table class=table-short><tr><th>Calendar Unit</th><th>Days</th></tr><tr><td>World's Day</td><td>1</td></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>30</td></tr><tr><td>March</td><td>30</td></tr><tr><td>April</td><td>31</td></tr><tr><td>May</td><td>30</td></tr><tr><td>June</td><td>30</td></tr><tr><td>(Leapyear Day)</td><td>1</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>30</td></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>30</td></tr></table>`,
        accuracy: `As this calendar is only a proposal, there really isn't anything to compare it to historically. It is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/World_Calendar">Wikipedia article</a>.'
    },
]

const otherCalendars = [
    {
        name: 'Mayan Long Count',
        id: 'mayan-long-count',
        type: 'Other Calendar',
        epoch: 'August 8th, 3113 BCE',
        confidence: 'Exact',
        overview: 'The Mayan Long Count calendar is essentially a simple count of the number of days since the Mayan date of creation. It is a five digit number, typically expressed with periods between the digits, made up of base-20 counters with the exception of the middle-right digit which is base-18.\n\nStarting with the right, the smallest unit is the <b>kʼin</b>, which is equivalent to a day. Twenty kʼins make up one <b>winal</b>, 18 winals make up one <b>tun</b>, 20 tuns make up one <b>kʼatun</b>, and finally 20 kʼatuns make up one <b>bʼakʼtun</b>. A bʼakʼtun is roughly 394 solar years.\n\nThe Mayan Long Count Calendar was of international interest in 2012 as it was the time when the bʼakʼtun incremented from 12 to 13, leading to superstitious theories and hysteria.',
        info: `Notably, winals are counted in base-18 rather than base-20 like the rest of the units. This is to reasonably match the tun to the length of the solar year. However, it is still over 5 days short, meaning it will drift about half as much as a true lunar calendar. 20 winals would be 400 days, which wouldn't have been as useful.\n\n<table class=table-short><tr><th>Mayan Unit</th><th>Length</th></tr><tr><td>kʼin</td><td>1 day</td></tr><tr><td>winal</td><td>20 kʼins, 20 days</td></tr><tr><td>tun</td><td>18 winals, 360 days</td></tr><tr><td>kʼatun</td><td>20 tuns, 7200 days</td></tr><tr><td>bʼakʼtun</td><td>20 kʼatuns, 144000 days</td></tr></table>`,
        accuracy: 'Correlating the Mayan Long Count calendar was a matter of debate even in recent times. The vast majority of scholars seem to have accepted the Goodman–Martinez–Thompson (GMT) correlation as verifiable fact.\n\nWith that in mind, this calendar is actually very easy to calculate, as it is just a count of days since the epoch, not unlike the Julian Day Number. It has no concept of intercalary time such as leap days and the count is agnostic of the solar or lunar years. The only method of inaccuracy with this calendar could be when exactly each day increments, but that does not affect the rest of the calendar in any meaningful way.',
        source: 'Much of the information on this calendar can be found at its <a href="https://en.wikipedia.org/wiki/Mesoamerican_Long_Count_calendar">Wikipedia article</a>.\n\nThe <a href="https://maya.nmai.si.edu/calendar/maya-calendar-converter">Smithsonian website</a> has the current day as well as a converter.'
    },

    {
        name: 'Darian',
        id: 'darian',
        type: 'Other Calendar',
        epoch: '12 March 1609 CE, 18:40:06',
        confidence: 'High',
        overview: 'The Darian calendar is a proposed calendar for use on Mars. It was created in 1985 by Thomas Gangale and named after his son, Darius.\n\nIt takes the ~668.5 sol Martian year (~687 Earth days) and divides it into 24 months of 28 or 27 sols. The new year is on the day of the Martian Northern Equinox.\n\nThe epoch is the Vernal Equinox of Julian Sol Number 0, taking place on 12 March 1609 CE at 18:40:06 UTC.\n\nLeap years add one extra day in the final month, and they take place if the year number is odd or divisible by 10, unless also divisible by 100 except if divisible by 500.',
        info: `<table class="table-very-long"><tr><th>Month</th><th>Days</th></tr><tr><td>Sagittarius</td><td>28</td></tr><tr><td>Dhanus</td><td>28</td></tr><tr><td>Capricornus</td><td>28</td></tr><tr><td>Makara</td><td>28</td></tr><tr><td>Aquarius</td><td>28</td></tr><tr><td>Khumba</td><td>27</td></tr><tr><td>Pisces</td><td>28</td></tr><tr><td>Mina</td><td>28</td></tr><tr><td>Aries</td><td>28</td></tr><tr><td>Mesha</td><td>28</td></tr><tr><td>Taurus</td><td>28</td></tr><tr><td>Rishabha</td><td>27</td></tr><tr><td>Gemini</td><td>28</td></tr><tr><td>Mithuna</td><td>28</td></tr><tr><td>Cancer</td><td>28</td></tr><tr><td>Karka</td><td>28</td></tr><tr><td>Leo</td><td>28</td></tr><tr><td>Simha</td><td>27</td></tr><tr><td>Virgo</td><td>28</td></tr><tr><td>Kanya</td><td>28</td></tr><tr><td>Libra</td><td>28</td></tr><tr><td>Tula</td><td>28</td></tr><tr><td>Scorpius</td><td>28</td></tr><tr><td>Vrishika</td><td>27 or 28</td></tr></table>`,
        accuracy: `This calendar depends on the Julian Sol Number which is in turn based on the Mars Sol Date. Assuming these are all accurate, then the Darian calendar should be correct.\n\nThere is one more stipulation that the current calendar is only perfectly accurate between the years 0 and 2000 due to the shortening of the Martian equinox year. Whether those are Martian years or Earth years isn't clear, but the difference is rather small and is currently ignored for this calendar.`,
        source: 'Much of the information on this calendar can be found at its <a href="https://en.wikipedia.org/wiki/Darian_calendar">Wikipedia article</a>.\n\nThe actual creator of the calendar has a website and a date converter <a href="https://ops-alaska.com/time/gangale_converter/calendar_clock.htm">here</a>, but it uses a slightly different Dynamical Time correction for the Mars sol.'
    },
]

const astronomicalData = [
    {
        name: 'Northward Equinox',
        id: 'spring-equinox',
        type: 'Astronomical Data',
        epoch: 'Northward Equinox',
        confidence: 'High',
        overview: 'This is the approximate date and time of this year\'s Northward Equinox. In the Northern Hemisphere this is known as the Spring Equinox. In the Southern Hemisphere it is known as the Fall Equinox. It is the time when the length of the day and night are equal all over the planet and the solar declination is heading northward.',
        info: 'The Northward Equinox is an important starting point or anchor point in some calendars. It usually occurs around March 20th. Over time, roughly in a cycle of 25,772 years, Earth\'s axes precess, causing the equinoxes and solstices to slowly drift through the entire year.',
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. On top of that, my solutions don\'t exactly match those provided by Meeus, either due to Javascript\'s base-2 calculations or due to misinterpreting steps such as adding Dynamical Time. Overall these results are very close, usually within a few minutes of reality, but they aren\'t perfect.',
        source: 'This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.'
    },
    
    {
        name: 'Northern Solstice',
        id: 'summer-solstice',
        type: 'Astronomical Data',
        epoch: 'Summer Solstice',
        confidence: 'High',
        overview: 'This is the approximate date and time of this year\'s Northern Solstice. In the Northern Hemisphere this is known as the Summer Solstice. In the Southern Hemisphere it is known as the Winter Solstice. It is the time when the Northern Hemisphere experiences its longest day while the Southern Hemisphere experiences its shortest day.',
        info: 'The Northern Solstice usually occurs around June 20th. Over time, roughly in a cycle of 25,772 years, Earth\'s axes precess, causing the equinoxes and solstices to slowly drift through the entire year.',
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. On top of that, my solutions don\'t exactly match those provided by Meeus, either due to Javascript\'s base-2 calculations or due to misinterpreting steps such as adding Dynamical Time. Overall these results are very close, usually within a few minutes of reality, but they aren\'t perfect.',
        source: 'This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.'
    },

    {
        name: 'Southward Equinox',
        id: 'autumn-equinox',
        type: 'Astronomical Data',
        epoch: 'Southward Equinox',
        confidence: 'High',
        overview: 'This is the approximate date and time of this year\'s Southward Equinox. In the Northern Hemisphere this is known as the Fall Equinox. In the Southern Hemisphere it is known as the Spring Equinox. It is the time when the length of the day and night are equal all over the planet and the solar declination is heading southward.',
        info: 'The Southward Equinox is an important starting point or anchor point in many calendars. It usually occurs around September 20th. Over time, roughly in a cycle of 25,772 years, Earth\'s axes precess, causing the equinoxes and solstices to slowly drift through the entire year.',
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. On top of that, my solutions don\'t exactly match those provided by Meeus, either due to Javascript\'s base-2 calculations or due to misinterpreting steps such as adding Dynamical Time. Overall these results are very close, usually within a few minutes of reality, but they aren\'t perfect.',
        source: 'This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.'
    },

    {
        name: 'Southern Solstice',
        id: 'winter-solstice',
        type: 'Astronomical Data',
        epoch: 'Winter Solstice',
        confidence: 'High',
        overview: 'This is the approximate date and time of this year\'s Southern Solstice. In the Northern Hemisphere this is known as the Winter Solstice. In the Southern Hemisphere it is known as the Summer Solstice. It is the time when the Northern Hemisphere experiences its shortest day while the Southern Hemisphere experiences its longest day.',
        info: 'The Southern Solstice is an important starting point or anchor point in some calendars. It usually occurs around December 20th. Over time, roughly in a cycle of 25,772 years, Earth\'s axes precess, causing the equinoxes and solstices to slowly drift through the entire year.',
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. On top of that, my solutions don\'t exactly match those provided by Meeus, either due to Javascript\'s base-2 calculations or due to misinterpreting steps such as adding Dynamical Time. Overall these results are very close, usually within a few minutes of reality, but they aren\'t perfect.',
        source: 'This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.'
    },

    {
        name: 'Longitude of the Sun',
        id: 'sun-longitude',
        type: 'Astronomical Data',
        epoch: 'Northward Equinox',
        confidence: 'High',
        overview: 'This is the approximate longitude of the sun, the distance in degrees the Earth has traveled along its orbit since the last Northward Equinox.',
        info: 'The longitude of the sun is an important factor in the Chinese lunisolar calendar and its derivatives. As a circle has 360 degrees and the year has roughly 365 days, the longitude of the sun increments a little less than 1 degree each day.',
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. My solutions for the example problems matched those from the book, so I am reasonably sure it is correct and only deviates slightly from reality.',
        source: 'This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.'
    },

    {
        name: 'This Month\'s New Moon',
        id: 'this-new-moon',
        type: 'Astronomical Data',
        epoch: 'New Moon',
        confidence: 'High',
        overview: 'This is the approximate time of the New Moon, also known as a Lunar Conjunction, of the current month. It is an important event in many cultures, and most lunar or lunisolar calendars use the New Moon as the beginning of the month.',
        info: 'Calculating the New Moon is no easy task. It involves several steps and different tables of equations, and it is likely the most resource-taxing calculation on this site. Unfortunately it also must be calculated several times due to the nature of lunar calendars, though the date shown here is resused when possible. New Moons are on average 29.53059 days apart, but that number can vary by several hours in a given cycle due to the shape of the moon\'s orbit as well as other gravitational effects. Thus, it is often necessary to calculate each New Moon directly.',
        accuracy: 'This calculation is <i>mostly</i> accurate, but it differs from Jean Meeus\'s solutions by a few minutes. I am not sure why this is the case, though I suspect it has to do with the base-2 calculations in JavaScript. It is also possible that my Dynamical Time calculations are independently incorrect, which are factored into the New Moon calculation. Dates far away from the current year are likely to be significantly off.',
        source: 'This calculation in its entirety was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.'
    },
]

const popCultureData = [
    {
        name: 'Minecraft Time',
        id: 'minecraft-time',
        type: 'Pop Culture',
        epoch: 'Midnight',
        confidence: 'Exact',
        overview: 'One day/night cycle in Minecraft is exactly 20 minutes. Days typically start when the player wakes up from their bed, and although there is a clock in the game, it has little information to expand upon that. This representation of Minecraft time divides the Minecraft day into 24-hour segments with minutes and seconds, set to midnight in the real world when it also resets the day counter.',
        info: 'Time in Minecraft, and many games for that matter, is counted in ticks, which are the game loop cycles. One tick is 50ms, allowing for a rate of 20Hz. These are then counted and converted into game time.',
        accuracy: 'This clock should be perfectly accurate, with the caveat that time in an actual Minecraft game can vary due to the fact that players can skip the night by sleeping in a bed.',
        source: 'This calculation was sourced from <a href="https://minecraft.fandom.com/wiki/Daylight_cycle">the Minecraft Fandom Wiki</a>.'
    },

    {
        name: 'Dream Time',
        id: 'dream-time',
        type: 'Pop Culture',
        epoch: 'Midnight',
        confidence: 'Exact',
        overview: 'According to the movie Inception, time in a dream is experienced 20 times slower, allowing for several days to be experienced in a single night\'s sleep. The time displayed here is the current time in your dream if you had begun sleeping at midnight.',
        info: 'The concept of time dilation in dreams is actually a fascinating area of study, with some results showing little or no dilation while others show differences in reaction times in dreams. Whatever the real dilation ratio may be, it is nowhere near that expressed in the film.',
        accuracy: 'This timekeeping system should be perfectly accurate but the epoch will not be the same for everyone, as people don\'t all sleep at the same time.',
        source: 'This calculation was sourced from the movie <a href="https://en.wikipedia.org/wiki/Inception">Inception</a>.'
    },
]

const politicalCycles = [
    {
        name: 'US Presidential Terms',
        id: 'us-presidential-terms',
        type: 'Politics',
        epoch: 'April 30, 1789',
        confidence: 'High',
        overview: 'The term of the US president lasts 4 years, starting from January 20th at noon and ending January 20th at noon four years later. This is a running count of how many presidential terms have passed since the inauguration of George Washington in 1789. The inauguration date has changed over the years, making this display inaccurate for years before 1937.',
        info: `<div class="presidential-terms-container">George Washington 1789-1797\nJohn Adams 1797-1801\nThomas Jefferson 1801-1809\nJames Madison 1809-1817\nJames Monroe 1817-1825\nJohn Quincy Adams 1825-1829\nAndrew Jackson 1829-1837\nMartin Van Buren 1837-1841\nWilliam Henry Harrison 1841\nJohn Tyler 1841-1845\nJames K. Polk 1845-1849\nZachary Taylor 1849-1850\nMillard Fillmore 1850-1853\nFranklin Pierce 1853-1857\nJames Buchanan 1857-1861\nAbraham Lincoln 1861-1865\nAndrew Johnson 1865-1869\nUlysses S. Grant 1869-1877\nRutherford B. Hayes 1877-1881\nJames A. Garfield 1881\nChester A. Arthur 1881-1885\nGrover Cleveland 1885-1889\nBenjamin Harrison 1889-1893\nGrover Cleveland 1893-1897\nWilliam McKinley 1897-1901\nTheodore Roosevelt 1901-1909\nWilliam Howard Taft 1909-1913\nWoodrow Wilson 1913-1921\nWarren G. Harding 1921-1923\nCalvin Coolidge 1923-1929\nHerbert Hoover 1929-1933\nFranklin D. Roosevelt 1933-1945\nHarry S. Truman 1945-1953\nDwight D. Eisenhower 1953-1961\nJohn F. Kennedy 1961-1963\nLyndon B. Johnson 1963-1969\nRichard Nixon 1969-1974\nGerald Ford 1974-1977\nJimmy Carter 1977-1981\nRonald Reagan 1981-1989\nGeorge H. W. Bush 1989-1993\nBill Clinton 1993-2001\nGeorge W. Bush 2001-2009\nBarack Obama 2009-2017\nDonald Trump 2017-2021\nJoe Biden 2021-</div>`,
        accuracy: 'US terms don\'t always start on January 20th, with certain stipulations such as if the 20th falls on a Sunday that could change the date slightly. The current system of terms starting on the 20th didn\'t start until 1937, and previously it was March 4th, with George Washington starting on April 30th.',
        source: 'The data for this entry was sourced from <a href="https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States">this Wikipedia page</a>.'
    },
]