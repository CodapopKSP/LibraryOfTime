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
        epoch: '1 January 1970 CE',
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
        epoch: '6 January 1980 CE',
        confidence: 'Exact',
        overview: 'GPS time is the standard by which all GPS satellites and GPS-enabled devices coordinate their positions. It is a simple count of seconds from midnight on January 6th, 1980. When converted into the Gregorian calendar, it drifts ahead by a second every now and then as it does not follow leap seconds found in other timekeeping standards.',
        info: 'GPS became available to the public in 2000 CE.',
        accuracy: `This clock is considered to be perfectly accurate, as it's a simple calculation from Unix.`,
        source: 'Much of the information for this clock came from its <a href="https://en.wikipedia.org/wiki/Global_Positioning_System#Timekeeping">Wikipedia article</a>.\n\nSome information for this clock came from <a href="http://www.leapsecond.com/java/gpsclock.htm">this website</a>.'
    },

    {
        name: 'TAI',
        id: 'tai',
        type: 'Computing Time',
        epoch: '1 January 1972 CE, +00:00:10',
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
        epoch: '1 January 1958 CE',
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
        epoch: '1 January 1601 CE',
        confidence: 'Exact',
        overview: 'FILETIME is the timing method found on Windows filesystems. It is a simple count of number of nanoseconds since midnight on January 1st, 1601.',
        info: 'Most systems use Unix or a similar epoch. FILETIME is unique in its choice of the year 1601.',
        accuracy: 'FILETIME is accurate to the microsecond, but it does not count nanoseconds.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/System_time">Wikipedia article</a>.'
    },

    {
        name: 'Julian Day Number',
        id: 'julian-day-number',
        type: 'Computing Time',
        epoch: '24 November 4713 BCE, +12:00:00',
        confidence: 'Exact',
        overview: 'The Julian Day Number is a simple count of number of days since 12:00 (noon) on November 24, 4713 BCE (or 4714 BCE when not using astronomical dates). The JDN is used by astronomers and programmers to simplify calculations for the passage of time, and many of the calculations in this website are based off of the JDN.',
        info: 'There are many versions of the JDN, most of which involve truncating the large number for easier calculations.',
        accuracy: 'This counter is rigorously-studied and exactly accurate, with the only question being the addition of Terrestrial Time.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Julian_day">Wikipedia article</a>.'
    },

    {
        name: 'Rata Die',
        id: 'rata-die',
        type: 'Computing Time',
        epoch: '1 January 1 CE',
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
        epoch: '24 November 4712 BCE, +12:00:00',
        confidence: 'High',
        overview: 'The Julian Period is a cycle of 7980 years beginning on 1 January 4712 BCE of the Julian calendar (or 4713 BCE when not using astronomical dates). It is used by historians to date events when no calendar date is given or when previous given dates are deemed to be incorrect.',
        info: 'The Julian Period is the count of days since the last time Indiction, Solar and Lunar cycles all started on the same day.',
        accuracy: 'The Julian Period is a simple count of days, meaning it should be exactly accurate. However, I have had some difficulty ensuring this counter is perfectly calibrated.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Julian_day">Wikipedia article</a>.'
    },

    {
        name: 'Lilian Date',
        id: 'lilian-date',
        type: 'Computing Time',
        epoch: '15 October 1582 CE',
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
        epoch: '1 January 1 CE',
        confidence: 'Exact',
        overview: 'ISO 8601 is the standard of displaying date and time provided by the International Organization for Standardization. It is based off the Gregorian calendar.',
        info: 'ISO 8601 is intended to provide a clear, unambiguous date time format for international use.',
        accuracy: 'ISO 8601 is derived directly from Unix time and thus is exactly accurate.',
        source: `ISO 8601 is actually a supported string of JavaScript's native Date library, so there is nothing for this website to calculate. General information came from its <a href="https://en.wikipedia.org/wiki/ISO_8601">Wikipedia article</a>.`
    },

    {
        name: 'Terrestrial Time',
        id: 'terrestrial-time',
        type: 'Computing Time',
        epoch: 'Undefined',
        confidence: 'Medium',
        overview: 'Terrestrial Time is an approximation of the difference in time due to various factors that affect Earth\'s orbit, such as gravitational effects from other planets. It matches UTC at around the year 1880 and deviates the further away in time as a parabolic equation, with an uncertainty as much as two hours by the year 4000 BCE.',
        info: 'The exact time of the year is slowly changing on the order of a few seconds per year. This rate is not constant, though it can be estimated.',
        accuracy: `Terrestrial Time is itself an approximation, so the results here can only be as good as that approximation. Unfortunately, there seems to be a bit of induced error on top of that, as my solutions don't exactly match those provided by Meeus. This could be due to JavaScript's base-2 calculation or due to a misunderstanding in some of the steps.`,
        source: `This calculation was originally sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.\n\nI also borrowed much of the base code for this calculation from <a href="https://github.com/Fabiz/MeeusJs/blob/master/lib/Astro.DeltaT.js">this GitHub repository</a> as it seems to be based on a later version of Meeus's calculation.`
    },

    {
        name: 'Mars Sol Date',
        id: 'mars-sol-date',
        type: 'Computing Time',
        epoch: '29 December 1873 CE 12:02:29',
        confidence: 'High',
        overview: `The Mars Sol Date, similar to the Julian Day Number, is the number of sols that have passed since the epoch. A sol is the name for the Martian day, and it is slightly longer than an Earth day. Currently I haven't been able to figure out exactly why the epoch was chosen. The day increments when the Airy-0 crater reaches midnight.`,
        info: 'One Mars sol is 39 minutes and 35 seconds longer than an Earth day.',
        accuracy: 'This clock should be very accurate, though I am unsure how Terrestrial Time factors into it, which could cause it to be off by a few minutes.',
        source: `All of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Timekeeping_on_Mars">Wikipedia article</a>.`
    },

    {
        name: 'Julian Sol Number',
        id: 'julian-sol-number',
        type: 'Computing Time',
        epoch: '12 March 1609 CE, 18:40:06',
        confidence: 'High',
        overview: `The Julian Sol Number, created by Thomas Gangale, is similar to the Julian Day Number but it counts the number of sols that have passed since the epoch. A sol is the name for the Martian day, and it is slightly longer than an Earth day. This epoch marks an important Martian Vernal Equinox. The day increments when the Airy-0 crater reaches midnight.\n\nIn a chat I had with with Mr. Gangale, he expressed his desire for this standard to be deprecated, as the Mars Sol Date created by Michael Allison had received wider use. However, since it was used at one point, I have opted to include it in this website.\n\n"The sooner that things become standardized, the better, so consider the JS to be obsolete." -Thomas Gangale, 2024`,
        info: 'One Mars sol is 39 minutes and 35 seconds longer than an Earth day.',
        accuracy: 'This clock should be very accurate, though I am unsure how Terrestrial Time factors into it, which could cause it to be off by a few minutes.',
        source: `Much of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Timekeeping_on_Mars">Wikipedia article</a>.\n\nDates can also be verified with <a href="https://ops-alaska.com/time/gangale_converter/calendar_clock.htm">this website</a>, though some inaccuracies have been noted.`
    },

    {
        name: 'Julian Circad Number',
        id: 'julian-circad-number',
        type: 'Computing Time',
        epoch: '15 March 1609 +18:37:32',
        confidence: 'High',
        overview: ``,
        info: '',
        accuracy: '',
        source: ``
    },

    {
        name: 'Kali Ahargaṅa (IST)',
        id: 'kali-ahargaṅa',
        type: 'Computing Time',
        epoch: '23 January 3101 BCE +6:30:00',
        confidence: 'High',
        overview: `Kali Ahargaṅa is a simple count of days since the kali epoch. According to Hindu timekeeping, the current yuga, Kali Yuga, began in 3101 BCE and will last for 432,000 years, ending in 428,899 CE.\n\nKali Yuga is the fourth, shortest, and worst of the four yugas.`,
        info: `Each yuga has a shorter dawn and duck period before and after the longer main period.\n\n<table><tr><th>Part</th><th>Start</th><th>Length</th></tr><tr><td>Kali-yuga-sandhya (dawn)</td><td>3102 BCE</td><td>36,000 (100)</td></tr><tr><td>Kali-yuga (proper)</td><td>32,899 CE</td><td>360,000 (1,000)</td></tr><tr><td>Kali-yuga-sandhyamsa (dusk)</td><td>392,899–428,899 CE</td><td>36,000 (100)</td></tr></table>`,
        accuracy: 'The Kali Ahargaṅa is based off the Gregorian calendar and is considered to be very accurate compared with historical records.',
        source: `Much of the information for this timekeeping system has come from its <a href="https://en.wikipedia.org/wiki/Kali_ahargana">Wikipedia article</a>.\n\nYou can find another converter for this system <a href="https://planetcalc.com/9166/">here</a>.`
    },

    {
        name: 'Lunation Number',
        id: 'lunation-number',
        type: 'Computing Time',
        epoch: '6 January 2000 CE',
        confidence: 'High',
        overview: `The Lunation Number is the number of New Moons since the epoch. There are several variations of this number.\n\nThis lunation number was created by Jean Meeus in 1998. It uses the New Moon of 6 January 2000 CE for its epoch, in this case denoted as Lunation 0.`,
        info: `As lunations are important to many calendars and cultures, there are many competing standards.\n\nThe Lunation Number is the standard used by this website to calculate other lunation numbers as well as certain calendars and calculations.`,
        accuracy: `The lunation number is a simple calculation of time since the epoch divided by the average lunar cycle length. As the lunar cycle can vary by several hours, the time that the lunation number changes might not exactly match the current lunation. It is mostly intended to be used as an approximate reference rather than as a rigid definition of when the lunation has occurred.`,
        source: `This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.\n\nMore information can be found in its <a href="https://en.wikipedia.org/wiki/New_moon">Wikipedia article</a>.`
    },

    {
        name: 'Brown Lunation Number',
        id: 'brown-lunation-number',
        type: 'Computing Time',
        epoch: '17 January 1923 CE',
        confidence: 'High',
        overview: `The Lunation Number is the number of New Moons since the epoch. There are several variations of this number.\n\nThis lunation number was created by Ernest William Brown. It uses the New Moon of 17 January 1923 CE for its epoch, in this case denoted as Lunation 1.`,
        info: `As lunations are important to many calendars and cultures, there are many competing standards.\n\nThe Brown Lunation Number can be calculated by adding 953 to the Lunation Number.`,
        accuracy: `The lunation number is a simple calculation of time since the epoch divided by the average lunar cycle length. As the lunar cycle can vary by several hours, the time that the lunation number changes might not exactly match the current lunation. It is mostly intended to be used as an approximate reference rather than as a rigid definition of when the lunation has occurred.`,
        source: `This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.\n\nMore information can be found in its <a href="https://en.wikipedia.org/wiki/New_moon">Wikipedia article</a>.`
    },

    {
        name: 'Goldstine Lunation Number',
        id: 'goldstine-lunation-number',
        type: 'Computing Time',
        epoch: '11 January 1000 BCE',
        confidence: 'High',
        overview: `The Lunation Number is the number of New Moons since the epoch. There are several variations of this number.\n\nThis lunation number was created by Herman Goldstine. It uses the New Moon of 11 January 1001 CE for its epoch, in this case denoted as Lunation 0.`,
        info: `As lunations are important to many calendars and cultures, there are many competing standards.\n\nThe Goldstine Lunation Number can be calculated by adding 37105 to the Lunation Number.`,
        accuracy: `The lunation number is a simple calculation of time since the epoch divided by the average lunar cycle length. As the lunar cycle can vary by several hours, the time that the lunation number changes might not exactly match the current lunation. It is mostly intended to be used as an approximate reference rather than as a rigid definition of when the lunation has occurred.`,
        source: `This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.\n\nMore information can be found in its <a href="https://en.wikipedia.org/wiki/New_moon">Wikipedia article</a>.`
    },

    {
        name: 'Hebrew Lunation Number',
        id: 'hebrew-lunation-number',
        type: 'Computing Time',
        epoch: '6 October 3761 BCE?',
        confidence: 'High',
        overview: `The Lunation Number is the number of New Moons since the epoch. There are several variations of this number.\n\nThis lunation number is used by the Hebrew calendar. It uses the New Moon of 6 October 3761 BCE? for its epoch, in this case denoted as Lunation 1.`,
        info: `As lunations are important to many calendars and cultures, there are many competing standards.\n\nThe Hebrew Lunation Number can be calculated by adding 71234 to the Lunation Number.`,
        accuracy: `The lunation number is a simple calculation of time since the epoch divided by the average lunar cycle length. As the lunar cycle can vary by several hours, the time that the lunation number changes might not exactly match the current lunation. It is mostly intended to be used as an approximate reference rather than as a rigid definition of when the lunation has occurred.`,
        source: `This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.\n\nMore information can be found in its <a href="https://en.wikipedia.org/wiki/New_moon">Wikipedia article</a>.`
    },

    {
        name: 'Islamic Lunation Number',
        id: 'islamic-lunation-number',
        type: 'Computing Time',
        epoch: '18 July 622 CE',
        confidence: 'High',
        overview: `The Lunation Number is the number of New Moons since the epoch. There are several variations of this number.\n\nThis lunation number is used by the Hijri calendar. It uses the New Moon of 18 July 622 CE for its epoch, in this case denoted as Lunation 1.`,
        info: `As lunations are important to many calendars and cultures, there are many competing standards.\n\nThe Islamic Lunation Number can be calculated by adding 17038 to the Lunation Number.`,
        accuracy: `The lunation number is a simple calculation of time since the epoch divided by the average lunar cycle length. As the lunar cycle can vary by several hours, the time that the lunation number changes might not exactly match the current lunation. It is mostly intended to be used as an approximate reference rather than as a rigid definition of when the lunation has occurred.`,
        source: `This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.\n\nMore information can be found in its <a href="https://en.wikipedia.org/wiki/New_moon">Wikipedia article</a>.`
    },

    {
        name: 'Thai Lunation Number',
        id: 'thai-lunation-number',
        type: 'Computing Time',
        epoch: '22 March 638 CE',
        confidence: 'High',
        overview: `The Lunation Number is the number of New Moons since the epoch. There are several variations of this number.\n\nThis lunation number is used by the Buddhist calendar. It uses the New Moon of 22 March 638 CE for its epoch, in this case denoted as Lunation 0.`,
        info: `As lunations are important to many calendars and cultures, there are many competing standards.\n\nThe Thai Lunation Number can be calculated by adding 16843 to the Lunation Number.`,
        accuracy: `The lunation number is a simple calculation of time since the epoch divided by the average lunar cycle length. As the lunar cycle can vary by several hours, the time that the lunation number changes might not exactly match the current lunation. It is mostly intended to be used as an approximate reference rather than as a rigid definition of when the lunation has occurred.`,
        source: `This calculation was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.\n\nMore information can be found in its <a href="https://en.wikipedia.org/wiki/New_moon">Wikipedia article</a>.`
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
        overview: `Coordinated Mars Time, also called MTC as well as Airy Mean Time (AMT), is a proposed clock for use on Mars which has gained some level of mainstream traction in the scientific community. It is intended to be a Martian analog to Earth's UTC.\n\nThe time is displayed as hours, minutes, and seconds since midnight on Mars at the location of the Airy-0 crater. The clock is the same as clocks on Earth, with 24 hours and 60 minutes in an hour, though each unit is slightly longer due to the length of the sol being 39 minutes and 35 seconds longer than the day.`,
        info: 'This clock uses the Mars Sol Date for the calculation determining where midnight begins.\n\n<table class="table-short"><tr><td>MTC</td><td>Standard Time</td></tr><tr><td>MTC Second</td><td>1.02749125 Seconds</td></tr><tr><td>MTC Minute</td><td>61.649475 Seconds</td></tr><tr><td>MTC Hour</td><td>61.649475 Minutes</td></tr></table>',
        accuracy: 'This clock should be reasonably accurate, though it might be off by a feww minutes or seconds due to Terrestrial Time.',
        source: `All of the information on this clock came from its <a href="https://en.wikipedia.org/wiki/Timekeeping_on_Mars">Wikipedia article</a>.`
    },

    {
        name: 'Io Meridian Time',
        id: 'io-meridian-time',
        type: 'Other Time',
        epoch: '31 December 2001 +16:07:45',
        confidence: 'High',
        overview: `Io Meridian Time is a measure of time passed since midnight on the prime meridian of Io, moon of Jupiter.\n\nIt features a similar 24-hour clock to Earth time, but the units are about 11.5% shorter. One Io solar day is about two Earth days, so the day is further broken up into two circads of 21 hours each.\n\nIo is tidally locked with Jupiter, meaning one side of the moon always faces the planet and the other side always faces away. The prime meridian is determined to be the meridian on the moon's surface that is facing directly at Jupiter.\n\nMidnight is thus the time when the moon is directly between Jupiter and the sun, though this is only used as an epoch for the beginning of the first circad in each solar day. The second circad happens when the moon is on the opposite side of Jupiter from the sun.\n\nIo Meridian Time is a name that was chosen for this website and might not be accurate.`,
        info: `Io is in a 2/4/8 Laplace resonance with Europa and Ganymede, so their solar days are equally comprised of 2/4/8 circads, though the length of their circads are very slightly different. The circad of Io is 21.23833 Earth hours long, which is then broken into 24 Io hours.\n\n<table class="table-short"><tr><td>IMT</td><td>Standard Time</td></tr><tr><td>IMT Second</td><td>0.8849304 Seconds</td></tr><tr><td>IMT Minute</td><td>53.095825 Seconds</td></tr><tr><td>IMT Hour</td><td>53.095825 Minutes</td></tr></table>\n\n<table class="table-short"><tr><td>Moon</td><td>Circad Length</td><td>Circads Per Orbit</td></tr><tr><td>Io</td><td>21.23833 Hours</td><td>2</td></tr><tr><td>Europa</td><td>21.32456 Hours</td><td>4</td></tr><tr><td>Ganymede</td><td>21.49916 Hours</td><td>8</td></tr><tr><td>Callisto</td><td>21.16238 Hours</td><td>19</td></tr></table>\n\nAs the orbit of Io is not very inclined, midnight on Circad 1 is also the time of a total solar eclipse on Jupiter.`,
        accuracy: `The accuracy of this timekeeping system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.\n\nThe name of this timekeeping system is my own creation, as Mr. Gangale did not give it a name himself.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Europa Meridian Time',
        id: 'europa-meridian-time',
        type: 'Other Time',
        epoch: '2 January 2002 +17:12:57',
        confidence: 'High',
        overview: `Europa Meridian Time is a measure of time passed since midnight on the prime meridian of Europa, moon of Jupiter.\n\nIt features a similar 24-hour clock to Earth time, but the units are about 11.5% shorter. One Europa solar day is about four Earth days, so the day is further broken up into four circads of 21 hours each.\n\nEuropa is tidally locked with Jupiter, meaning one side of the moon always faces the planet and the other side always faces away. The prime meridian is determined to be the meridian on the moon's surface that is facing directly at Jupiter.\n\nMidnight is thus the time when the moon is directly between Jupiter and the sun, though this is only used as an epoch for the beginning of the first circad in each solar day. The third circad happens when the moon is on the opposite side of Jupiter from the sun.\n\nEuropa Meridian Time is a name that was chosen for this website and might not be accurate.`,
        info: `Europa is in a 2/4/8 Laplace resonance with Io and Ganymede, so their solar days are equally comprised of 2/4/8 circads, though the length of their circads are very slightly different. The circad of Europa is 21.32456 Earth hours long, which is then broken into 24 Europa hours.\n\n<table class="table-short"><tr><td>EMT</td><td>Standard Time</td></tr><tr><td>EMT Second</td><td>0.8885233 Seconds</td></tr><tr><td>EMT Minute</td><td>53.3114 Seconds</td></tr><tr><td>EMT Hour</td><td>53.3114 Minutes</td></tr></table>\n\n<table class="table-short"><tr><td>Moon</td><td>Circad Length</td><td>Circads Per Orbit</td></tr><tr><td>Io</td><td>21.23833 Hours</td><td>2</td></tr><tr><td>Europa</td><td>21.32456 Hours</td><td>4</td></tr><tr><td>Ganymede</td><td>21.49916 Hours</td><td>8</td></tr><tr><td>Callisto</td><td>21.16238 Hours</td><td>19</td></tr></table>\n\nAs the orbit of Europa is not very inclined, midnight on Circad 1 is also roughly the time of a total solar eclipse on Jupiter.`,
        accuracy: `The accuracy of this timekeeping system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.\n\nThe name of this timekeeping system is my own creation, as Mr. Gangale did not give it a name himself.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Ganymede Meridian Time',
        id: 'ganymede-meridian-time',
        type: 'Other Time',
        epoch: '1 January 2002 +11:08:29',
        confidence: 'High',
        overview: `Ganymede Meridian Time is a measure of time passed since midnight on the prime meridian of Ganymede, moon of Jupiter.\n\nIt features a similar 24-hour clock to Earth time, but the units are about 11.5% shorter. One Ganymede solar day is about eight Earth days, so the day is further broken up into eight circads of 21 hours each.\n\Ganymede is tidally locked with Jupiter, meaning one side of the moon always faces the planet and the other side always faces away. The prime meridian is determined to be the meridian on the moon's surface that is facing directly at Jupiter.\n\nMidnight is thus the time when the moon is directly between Jupiter and the sun, though this is only used as an epoch for the beginning of the first circad in each solar day. The fifth circad happens when the moon is on the opposite side of Jupiter from the sun.\n\Ganymede Meridian Time is a name that was chosen for this website and might not be accurate.`,
        info: `Ganymede is in a 2/4/8 Laplace resonance with Io and Europa, so their solar days are equally comprised of 2/4/8 circads, though the length of their circads are very slightly different. The circad of Ganymede is 21.49916 Earth hours long, which is then broken into 24 Ganymede hours.\n\n<table class="table-short"><tr><td>GMT</td><td>Standard Time</td></tr><tr><td>GMT Second</td><td>0.8957983 Seconds</td></tr><tr><td>GMT Minute</td><td>53.7479 Seconds</td></tr><tr><td>GMT Hour</td><td>53.7479 Minutes</td></tr></table>\n\n<table class="table-short"><tr><td>Moon</td><td>Circad Length</td><td>Circads Per Orbit</td></tr><tr><td>Io</td><td>21.23833 Hours</td><td>2</td></tr><tr><td>Europa</td><td>21.32456 Hours</td><td>4</td></tr><tr><td>Ganymede</td><td>21.49916 Hours</td><td>8</td></tr><tr><td>Callisto</td><td>21.16238 Hours</td><td>19</td></tr></table>\n\nAs the orbit of Ganymede is not very inclined, midnight on Circad 1 is also roughly the time of a total solar eclipse on Jupiter.`,
        accuracy: `The accuracy of this timekeeping system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.\n\nThe name of this timekeeping system is my own creation, as Mr. Gangale did not give it a name himself.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Callisto Meridian Time',
        id: 'callisto-meridian-time',
        type: 'Other Time',
        epoch: '28 December 2001 +12:27:23',
        confidence: 'High',
        overview: `Callisto Meridian Time is a measure of time passed since midnight on the prime meridian of Callisto, moon of Jupiter.\n\nIt features a similar 24-hour clock to Earth time, but the units are about 11.5% shorter. One Callisto solar day is about nineteen Earth days, so the day is further broken up into nineteen circads of 21 hours each.\n\nCallisto is tidally locked with Jupiter, meaning one side of the moon always faces the planet and the other side always faces away. The prime meridian is determined to be the meridian on the moon's surface that is facing directly at Jupiter.\n\nMidnight is thus the time when the moon is directly between Jupiter and the sun, though this is only used as an epoch for the beginning of the first circad in each solar day.\n\nCallisto Meridian Time is a name that was chosen for this website and might not be accurate.`,
        info: `Though Callisto isn't in Laplace resonance with the other three Galilean moons, its orbit can still be broken down into 19 circads of a similar length. The circad of Callisto is 21.16238 Earth hours long, which is then broken into 24 Callisto hours.\n\n<table class="table-short"><tr><td>CMT</td><td>Standard Time</td></tr><tr><td>CMT Second</td><td>0.8817658 Seconds</td></tr><tr><td>CMT Minute</td><td>52.90595 Seconds</td></tr><tr><td>CMT Hour</td><td>52.90595 Minutes</td></tr></table>\n\n<table class="table-short"><tr><td>Moon</td><td>Circad Length</td><td>Circads Per Orbit</td></tr><tr><td>Io</td><td>21.23833 Hours</td><td>2</td></tr><tr><td>Europa</td><td>21.32456 Hours</td><td>4</td></tr><tr><td>Ganymede</td><td>21.49916 Hours</td><td>8</td></tr><tr><td>Callisto</td><td>21.16238 Hours</td><td>19</td></tr></table>\n\nAs the orbit of Callisto is not very inclined, midnight on Circad 1 is also roughly the time of a total solar eclipse on Jupiter.`,
        accuracy: `The accuracy of this timekeeping system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.\n\nThe name of this timekeeping system is my own creation, as Mr. Gangale did not give it a name himself.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Titan Meridian Time',
        id: 'titan-meridian-time',
        type: 'Other Time',
        epoch: '15 March 1609 +18:37:32',
        confidence: 'High',
        overview: `Titan Meridian Time is a measure of time passed since midnight on the prime meridian of Titan, moon of Saturn.\n\nIt features a similar 24-hour clock to Earth time, but the units are very slightly shorter by roughly 3 minutes every day. One Titan solar day is about sixteen Earth days, so the day is further broken up into sixteen circads of ~23.95 hours each.\n\Titan is tidally locked with Saturn, meaning one side of the moon always faces the planet and the other side always faces away. The prime meridian is determined to be the meridian on the moon's surface that is facing directly at Saturn.\n\nMidnight is thus the time when the moon is directly between Saturn and the sun, though this is only used as an epoch for the beginning of the first circad in each solar day.\n\nTiutan Meridian Time is a name that was chosen for this website and might not be accurate.`,
        info: `As the orbit of Titan is not very inclined, midnight on Circad 1 is also roughly the time of a total solar eclipse on Saturn.\n\n<table class="table-short"><tr><td>TMT</td><td>Standard Time</td></tr><tr><td>TMT Second</td><td>0.998068 Seconds</td></tr><tr><td>TMT Minute</td><td>59.88410 Seconds</td></tr><tr><td>TMT Hour</td><td>59.88410 Minutes</td></tr></table>`,
        accuracy: `The accuracy of this timekeeping system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter in the Galilean calendars, but it isn't clear if it has also been accounted for in this calendar.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_saturn/Darian_Titan_main.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/observing/interactive-sky-watching-tools/saturns-moons-javascript-utility/">this model</a> if you know what you're doing.`
    },
]

const solarCalendarsData = [
    {
        name: 'Gregorian',
        id: 'gregorian',
        type: 'Solar Calendar',
        epoch: '1 January 1 CE',
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
        epoch: '30 December 0 BCE',
        confidence: 'Exact',
        overview: 'The Julian Calendar was issued by Julius Caesar in 45 BC after several corrections to the solar date.\n\nIt features a leap day every 4 years, leading it to drift from the Gregorian calendar by 3 days every 400 years. Years are denoted \'AD\' or \'Anno Domini\', meaning \'in the year of the Lord\', as well as \'BC\' meaning \'Before Christ\'.\n\nThe Julian calendar was the principal calendar in much of the world, especially Europe, prior to the adoption of the Gregorian calendar.',
        info: `The Julian calendar drifts from the solar year by about 1 day every 129 years, as it has too many leap years. The Gregorian calendar is meant to correct this drift. As of the 21st century, the two calendars are 13 days apart.\n\n<table class="table-long"><tr><th>Month</th><th>Days</th></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>28 or 29</td></tr><tr><td>March</td><td>31</td></tr><tr><td>April</td><td>30</td></tr><tr><td>May</td><td>31</td></tr><tr><td>June</td><td>30</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>31</td></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>31</td></tr></table>`,
        accuracy: 'The Julian calendar is exactly accurate in relation to the Gregorian calendar, but dates before 40 BC might not reflect civic dates of the era due to a series of corrections.\n\nThe date of leap days might not be exactly aligned with the Gregorian calendar here, but they are accurate to the year.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Julian_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Astronomical',
        id: 'astronomical',
        type: 'Solar Calendar',
        epoch: '30 December 0 BCE',
        confidence: 'Exact',
        overview: 'The Astronomical calendar is a combination of the Gregorian calendar for dates after midnight on 15 October 1582 and the Julian calendar for dates before.\n\nIt is a standard for calculating dates of astronomical events as well as historical events.',
        info: `<table class="table-long"><tr><th>Month</th><th>Days</th></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>28 or 29</td></tr><tr><td>March</td><td>31</td></tr><tr><td>April</td><td>30</td></tr><tr><td>May</td><td>31</td></tr><tr><td>June</td><td>30</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>31</td></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>31</td></tr></table>`,
        accuracy: 'This calendar is a simple calculation and is considered to be exactly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Astronomical_year_numbering">Wikipedia article</a>.'
    },

    {
        name: 'French Republican (CET)',
        id: 'french-republican',
        type: 'Solar Calendar',
        epoch: '22 September 1792 CE',
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
        epoch: '29 October 1922 CE',
        confidence: 'Exact',
        overview: 'Era Fascista is a simple count of number of years since the start of the Fascist Era in Italy on October 29th, 1922, starting with Anno I.\n\nTaking inspiration from the French Republican calendar, years were written in Roman numerals and it was intended to replace the Gregorian calendar.',
        info: `Era Fascista didn't really implement months, as it was used alongside the Gregorian calendar. Enscriptions marked in Era Fascista dates could use a number of different abbreviations, such as 'Anno', 'E.F.', 'Anno Fascista', 'A.F.', or simply 'A.'.`,
        accuracy: 'Era Fascista is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.',
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Era_Fascista">Wikipedia article</a>.'
    },

    {
        name: 'Coptic (EET)',
        id: 'coptic',
        type: 'Solar Calendar',
        epoch: '29 August 284 CE',
        confidence: 'High',
        overview: 'The Coptic calendar, also known as the Alexandrian calendar, was used in Egypt until the adoption of the Gregorian calendar in 1875. It is based on the ancient Egyptian calendar but with leap days every four years, keeping it in sync with the Julian calendar while sharing months and days with the Ge\'ez calendar.\n\nIt has 12 months of 30 days plus a smaller 13th month of 5 or 6 days. The new year starts on the 11th or 12th of September, and years are abbreviated with \'AM\', meaning Anno Martyrum, or \'Year of the Martyrs\'.\n\nThe Coptic calendar is still in use today by Egyptian farmers as well as the Coptic Orthodox Church.',
        info: `The Ge\'ez calendar is precisely aligned with the Coptic calendar for its months and days. It's epoch, translated to 'Year of the Martyrs', is counted from the year Diocletian became Emperor of Rome, which was followed by a period of mass persecution of Christians.\n\n<table class="table-long"><tr><th>Month</th><th>Days</th><th>Approx. Gregorian Dates</th></tr><tr><td>Thout</td><td>30</td><td>Sep 11 - Oct 10</td></tr><tr><td>Paopi</td><td>30</td><td>Oct 11 - Nov 9</td></tr><tr><td>Hathor</td><td>30</td><td>Nov 10 - Dec 9</td></tr><tr><td>Koiak</td><td>30</td><td>Dec 10 - Jan 8</td></tr><tr><td>Tobi</td><td>30</td><td>Jan 9 - Feb 7</td></tr><tr><td>Meshir</td><td>30</td><td>Feb 8 - Mar 9</td></tr><tr><td>Paremhat</td><td>30</td><td>Mar 10 - Apr 8</td></tr><tr><td>Parmouti</td><td>30</td><td>Apr 9 - May 8</td></tr><tr><td>Pashons</td><td>30</td><td>May 9 - Jun 7</td></tr><tr><td>Paoni</td><td>30</td><td>Jun 8 - Jul 7</td></tr><tr><td>Epip</td><td>30</td><td>Jul 8 - Aug 6</td></tr><tr><td>Mesori</td><td>30</td><td>Aug 7 - Sep 5</td></tr><tr><td>Pi Kogi Enavot</td><td>5 or 6</td><td>Sep 6 - Sep 10</td></tr></table>`,
        accuracy: 'The Coptic calendar is intrinsically based on and locked to the Julian calendar, making it perfectly accurate.',
        source: 'Much of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Coptic_calendar">Wikipedia article</a>.\n\nThis calendar has been calibrated using the calendar found <a href="https://www.copticbook.net/daily.php?m=9&d=25&mode=1&itemnum=1">here</a>.'
    },

    {
        name: 'Ge\'ez (EAT)',
        id: 'ethiopian',
        type: 'Solar Calendar',
        epoch: '27 August 8 CE',
        confidence: 'High',
        overview: 'The Ge\'ez calendar is the official calendar of Ethiopia. It has 12 months of 30 days plus a smaller 13th month of 5 or 6 days. It has a leap day every 4 years, keeping it in sync with the Julian calendar while sharing months and days with the Coptic calendar.\n\nThe New Year starts on September 11th or 12th, with years abbreviated with ዓ.ም. which is pronounced \'am\', short for Amätä Mihret, meaning \'Year of Mercy\'.',
        info: `The Ge\'ez calendar is precisely aligned with the Coptic calendar for its months and days. It nearly shares an epoch with the Julian calendar, as they both are counting years since the same event, but is actually 7-8 years behind due to a difference in calculation of the date of the Annunciation.\n\n<table class="table-long"><tr><th>Month</th><th>Days</th><th>Approx. Gregorian Dates</th></tr><tr><td>Mäskäräm</td><td>30</td><td>Sep 11 - Oct 10</td></tr><tr><td>Ṭəqəmt</td><td>30</td><td>Oct 11 - Nov 9</td></tr><tr><td>Ḫədar</td><td>30</td><td>Nov 10 - Dec 9</td></tr><tr><td>Taḫśaś</td><td>30</td><td>Dec 10 - Jan 8</td></tr><tr><td>Ṭərr</td><td>30</td><td>Jan 9 - Feb 7</td></tr><tr><td>Yäkatit</td><td>30</td><td>Feb 8 - Mar 9</td></tr><tr><td>Mägabit</td><td>30</td><td>Mar 10 - Apr 8</td></tr><tr><td>Miyazya</td><td>30</td><td>Apr 9 - May 8</td></tr><tr><td>Gənbo</td><td>30</td><td>May 9 - Jun 7</td></tr><tr><td>Säne</td><td>30</td><td>Jun 8 - Jul 7</td></tr><tr><td>Ḥamle</td><td>30</td><td>Jul 8 - Aug 6</td></tr><tr><td>Nähase</td><td>30</td><td>Aug 7 - Sep 5</td></tr><tr><td>Ṗagume</td><td>5 or 6</td><td>Sep 6 - Sep 10</td></tr></table>`,
        accuracy: 'The Ge\'ez calendar is intrinsically based on and locked to the Julian calendar, making it perfectly accurate.',
        source: 'Much of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Ethiopian_calendar">Wikipedia article</a>.\n\nThis calendar has been calibrated using the calendar found <a href="https://www.ethcalendar.com/">here</a>.'
    },

    {
        name: 'Minguo',
        id: 'minguo',
        type: 'Solar Calendar',
        epoch: '1 January 1912 CE',
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
        epoch: '1 January 543 BCE',
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
        epoch: '1 January 1912 CE',
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
        epoch: '19 July 5508 BCE',
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
        epoch: '22 March 0 BCE',
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
        epoch: '19? March 1844 CE +12:30:00',
        confidence: 'High',
        overview: 'The Baháʼí calendar is the calendar of the Baháʼí Faith. It is a pure solar calendar, as it begins its New Year on the day of the Spring Equinox, preventing it from drifting from the tropical year and causing it to very slowly drift from the Gregorian calendar.\n\nIt features 19 months (or sometimes referred to as weeks) of 19 days, for a total of 361 days. The remaining 4 or 5 days of each year are called Ayyám-i-Há and take place between the final two months, Mulk and ‘Alá’, typically at the end of February.\n\nDays start at sunset in Tehran, which is approximated here as 18:00 IRST. Years are denoted with \'BE\', meaning Baháʼí Era.',
        info: `<table class="table-long"><tr><th>Months</th><th>Days</th><th>Approx. Gregorian Time</th></tr><tr><td>Bahá</td><td>19</td><td>Mar 21 - Apr 8</td></tr><tr><td>Jalál</td><td>19</td><td>Apr 9 - Apr 27</td></tr><tr><td>Jamál</td><td>19</td><td>Apr 28 - May 16</td></tr><tr><td>‘Aẓamat</td><td>19</td><td>May 17 - Jun 4</td></tr><tr><td>Núr</td><td>19</td><td>Jun 5 - Jun 23</td></tr><tr><td>Raḥmat</td><td>19</td><td>Jun 24 - Jul 12</td></tr><tr><td>Kalimát</td><td>19</td><td>Jul 13 - Jul 31</td></tr><tr><td>Kamál</td><td>19</td><td>Aug 1 - Aug 19</td></tr><tr><td>Asmá’</td><td>19</td><td>Aug 20 - Sep 7</td></tr><tr><td>‘Izzat</td><td>19</td><td>Sep 8 - Sep 26</td></tr><tr><td>Mashíyyat</td><td>19</td><td>Sep 27 - Oct 15</td></tr><tr><td>‘Ilm</td><td>19</td><td>Oct 16 - Nov 3</td></tr><tr><td>Qudrat</td><td>19</td><td>Nov 4 - Nov 22</td></tr><tr><td>Qawl</td><td>19</td><td>Nov 23 - Dec 11</td></tr><tr><td>Masá’il</td><td>19</td><td>Dec 12 - Dec 30</td></tr><tr><td>Sharaf</td><td>19</td><td>Dec 31 - Jan 18</td></tr><tr><td>Sulṭán</td><td>19</td><td>Jan 19 - Feb 6</td></tr><tr><td>Mulk</td><td>19</td><td>Feb 7 - Feb 25</td></tr><tr><td>Ayyám-i-Há</td><td>4 or 5</td><td>Feb 26 - Mar 1</td></tr><tr><td>‘Alá’</td><td>19</td><td>Mar 2 - Mar 20</td></tr></table>`,
        accuracy: 'The accuracy of this calendar depends on the equinox calculations and may be off by a day for a whole year, but it is likely to self-correct by the next year. The equation breaks down considerably if rolled back or forward several thousand years as the equinox drifts due to precession and Terrestrial Time invokes inaccuracies.\n\nThe sunset approximation is also likely to cause slight inaccuracies if the New Moon happens very near to sunset, though this is similarly likely to self-correct by the next year. On that note, the dates may change slightly too early or late depending on the real time of sunset.\n\nThere seems to be an issue with the stated epoch on Wikipedia being 1 day later than the calculated epoch here.',
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
        overview: `The Discordian calendar is the calendar used in the virtual religion of Discordianism. It features 5 months, each of 73 days, with the year beginning on January 1st.\n\nIt follows Gregorian leap years, inserting a day between the 59th and 60th of the month of Chaos, lining up with February 29th on the Gregorian calendar. The leap day is called 'St. Tib's Day', and it takes place outside of any month or week, as though the calendar paused for a day.\n\nYears are denoted with 'YOLD' meaning 'Year of Our Lady Discord'.`,
        info: `<table class="table-long"><tr><th>Months</th><th>Days</th><th>Approx. Gregorian Time</th></tr><tr><td>Chaos</td><td>73</td><td>Jan 1 - Mar 14</td></tr><tr><td>Discord</td><td>73</td><td>Mar 15 - May 26</td></tr><tr><td>Confusion</td><td>73</td><td>May 27 - Aug 8</td></tr><tr><td>Bureaucracy</td><td>73</td><td>Aug 9 - Oct 19</td></tr><tr><td>The Aftermath</td><td>73</td><td>Oct 20 - Dec 31</td></tr><tr><td>St. Tib's Day</td><td>1</td><td>Feb 29</td></tr></table>`,
        accuracy: `The Discordian calendar is based off the Gregorian calendar and is thus exactly accurate.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Discordian_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Solar Hijri (IRST)',
        id: 'solar-hijri',
        type: 'Solar Calendar',
        epoch: '18 March 622, +20:30:00',
        confidence: 'Medium',
        overview: `The Solar Hijri calendar is a solar calendar used in Islam. It is the official calendar of Iran and Afghanistan. Each year begins on the Spring Equinox or the day after; thus it has no intrinsic error and it very slowly drifts through the Gregorian year following the precession of the equinoxes.\n\nIt features 12 months, corresponding to the zodiacal signs, with the first 6 having 31 days and the latter 6 having 30 (or 29) days to account for the sun traveling slower through the Zodiac due to Earth's oblong orbit. In Afghanistan the month names still refer to the Zodiac while elsewhere this calendar uses the Zoroastrian month names.\n\nUnlike the lunar Hijri calendar, days start at midnight, though they both share the same epoch of number of years from the Hijrah. In this calendar, years are denoted with 'SH', 'HS', 'AH', or 'AHSh', typically referencing the name of the calendar.`,
        info: `The new year starts on the day that the equinox occurs before noon in Iran, or the next day if it occurs after noon. The starting of the new year results in the final month having 29 or 30 days depending on when exactly the equinox occurs.\n\n<table><tr><th>Month</th><th>Zodiac</th><th>Days</th></tr><tr><td>Farvardin</td><td>Aries</td><td>31</td></tr><tr><td>Ordibehesht</td><td>Taurus</td><td>31</td></tr><tr><td>Khordad</td><td>Gemini</td><td>31</td></tr><tr><td>Tir</td><td>Cancer</td><td>31</td></tr><tr><td>Mordad</td><td>Leo</td><td>31</td></tr><tr><td>Shahrivar</td><td>Virgo</td><td>31</td></tr><tr><td>Mehr</td><td>Libra</td><td>30</td></tr><tr><td>Aban</td><td>Scorpio</td><td>30</td></tr><tr><td>Azar</td><td>Sagittarius</td><td>30</td></tr><tr><td>Dey</td><td>Capricorn</td><td>30</td></tr><tr><td>Bahman</td><td>Aquarius</td><td>30</td></tr><tr><td>Esfand</td><td>Pisces</td><td>29 or 30</td></tr></table>`,
        accuracy: `This calendar is reasonably accurate for modern years, but as its calculation relies on the calculation of the equinox, it may experience significant errors for years that are thousands of years out from modern times. It also approximates sunset in Tehran.\n\nThis calendar also may experience errors in its alignment with the Zodiac, as it is tied to the precession of the equinoxes.`,
        source: 'Much of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Solar_Hijri_calendar">Wikipedia article</a>.'
    },

    {
        name: 'Qadimi (IRST)',
        id: 'qadimi',
        type: 'Solar Calendar',
        epoch: '19 June 632, +2:30:00',
        confidence: 'High',
        overview: `The Qadimi calendar is one of the calendars of Zoroastrianism. It was intended to follow the Spring Equinox, but a lack of intercalary days has resulted in this calendar drifting significantly.\n\nIt features 12 months of 30 days, plus a period of 5 days at the end of each year called the Gatha days. Each of the 30 days of the month are named, as well as each of the Gatha days.\n\nYears are denoted with 'Y.Z.' for the 'Yazdegerdi era', a count of years since the accession of the last Sassanid ruler, Yazdegerd III, but there have been several epochs used in the past.\n\nCompared to the Gregorian calendar, the Qadimi calendar drifts by about 1 day every 3 years.`,
        info: `<table class="table-very-very-long"><tr><th>Month</th><th>Days</th></tr><tr><td>Farvardin</td><td>30</td></tr><tr><td>Ardibehesht</td><td>30</td></tr><tr><td>Khordad</td><td>30</td></tr><tr><td>Tir</td><td>30</td></tr><tr><td>Amardad</td><td>30</td></tr><tr><td>Shehrevar</td><td>30</td></tr><tr><td>Mehr</td><td>30</td></tr><tr><td>Aban</td><td>30</td></tr><tr><td>Azar</td><td>30</td></tr><tr><td>Dae</td><td>30</td></tr><tr><td>Bahman</td><td>30</td></tr><tr><td>Asfand</td><td>30</td></tr><tr><td>Gatha</td><td>5</td></tr></table>\n<table class="table-very-very-long"><tr><th colspan="3">Day Names</th></tr><tr><td>1: Hormazd</td><td>2: Bahman</td><td>3: Ardibehesht</td></tr><tr><td>4: Shehrevar</td><td>5: Aspandard</td><td>6: Khordad</td></tr><tr><td>7: Amardad</td><td>8: Dae-Pa-Adar</td><td>9: Adar</td></tr><tr><td>10: Avan</td><td>11: Khorshed</td><td>12: Mohor</td></tr><tr><td>13: Tir</td><td>14: Gosh</td><td>15: Dae-Pa-Meher</td></tr><tr><td>16: Meher</td><td>17: Srosh</td><td>18: Rashne</td></tr><tr><td>19: Fravardin</td><td>20: Behram</td><td>21: Ram</td></tr><tr><td>22: Govad</td><td>23: Dae-Pa-Din</td><td>24: Din</td></tr><tr><td>25: Ashishvangh</td><td>26: Ashtad</td><td>27: Asman</td></tr><tr><td>28: Zamyad</td><td>29: Mareshpand</td><td>30: Aneran</td></tr></table>\n<table class="table-very-very-long"><tr><th colspan="3">Gatha Days</th></tr><tr><td>1: Ahunavaiti</td><td>2: Ushtavaiti</td><td>3: Spentamainyu</td></tr><tr><td>4: Vohuxshathra</td><td>5: Vahishtoishti</td><td></td></tr></table>`,
        accuracy: `This calendar is a simple calculation based off the Gregorian calendar. However, historically this calendar has received many revisions, particularly prior to 1006 CE, so the dates here might not accurately reflect historical dates.`,
        source: 'Much of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Zoroastrian_calendar">Wikipedia article</a>.\n\nThis calendar can be calibrated using the calculator at  <a href="http://www.zcserv.com/calendar/">this site</a>.'
    },

    {
        name: 'Egyptian Civil',
        id: 'egyptian-civil',
        type: 'Solar Calendar',
        epoch: '27 June 2781 BCE',
        confidence: 'High',
        overview: `The Egyptian Civil calendar was the calendar used by Ancient Egypt, alongside its lunar calendar.\n\nIt featured 12 months of 30 days, divided into 3 seasons of 4 months each. The months have names but are usually labeled by their sequence in each season, leading to a pattern of [month] [season] [day]. Each year has 5 intercalary days with individual names at the end, for a total of 365 days.\n\nThe new year historically was intended to mark the heliacal rising of the star Sirius, but due to its inaccuracy it drifted by one day every 3 years. The new year eventually lines back up with the heliacal rising of Sirius every 1461 years, called the Sothic Cycle.\n\nThe epoch changed with each dynasty, and I could not find evidence of a standardized epoch. Here I have chosen to show the years since the believed beginning of the calendar, which is the day of the heliacal rising of Sirius in 2781 BCE.`,
        info: `<table class="table-long"><tr><th>Season</th><th>Month</th><th>Month Number</th><th>Days</th></tr><tr><td>Akhet</td><td>Tekh</td><td>I</td><td>30</td></tr><tr><td>Akhet</td><td>Menhet</td><td>II</td><td>30</td></tr><tr><td>Akhet</td><td>Hwt-Hrw</td><td>III</td><td>30</td></tr><tr><td>Akhet</td><td>Ka-Hr-Ka</td><td>IV</td><td>30</td></tr><tr><td>Peret</td><td>Sf-Bdt</td><td>I</td><td>30</td></tr><tr><td>Peret</td><td>Rekh Wer</td><td>II</td><td>30</td></tr><tr><td>Peret</td><td>Rekh Neds</td><td>III</td><td>30</td></tr><tr><td>Peret</td><td>Renwet</td><td>IV</td><td>30</td></tr><tr><td>Shemu</td><td>Hnsw</td><td>I</td><td>30</td></tr><tr><td>Shemu</td><td>Hnt-Htj</td><td>II</td><td>30</td></tr><tr><td>Shemu</td><td>Ipt-Hmt</td><td>III</td><td>30</td></tr><tr><td>Shemu</td><td>Wep-Renpet</td><td>IV</td><td>30</td></tr></table>\nThe intercalary days, called Heriu Renpet, celebrated the birthdays of the children of the god Nut.\n\n<table><tr><th>Heriu Renpet</th></tr><tr><td>1: Osiris</td></tr><tr><td>2: Horus the Elder</td></tr><tr><td>3: Set</td></tr><tr><td>4: Isis</td></tr><tr><td>5: Nephthys</td></tr></table>`,
        accuracy: `This calendar is based on the Sothic Cycle, which is well-established to the Gregorian calendar via the Julian calendar. Some liberties were taken with the epoch, which is why it is in parentheses.\n\nSimilar to the Sothic Cycle, some of my dates did not perfectly match those provided by sources such as the Wiki, so there's a chance that these calculations are off by one, either in year or in day.`,
        source: 'Much of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Egyptian_calendar">Wikipedia article</a>.\n\nMonth names and other general data came from <a href="https://ancientegyptonline.co.uk/calendar/">this site</a>.'
    },

    {
        name: 'ISO Week Date',
        id: 'iso-week-date',
        type: 'Solar Calendar',
        epoch: '1 January 1 CE',
        confidence: 'Exact',
        overview: `The ISO Week Date is part of the ISO standard for time. It breaks the year entirely into a whole number of weeks rather than months, which is often useful for business accounting.\n\nEach year can have either 52 weeks (364 days) or 53 weeks (371 days). It keeps in sync with the Gregorian calendar.`,
        info: `The ISO Week Date follows the format of Year-Week-Weekday, with Monday being the first day of the week and Sunday being the 7th day of the week.`,
        accuracy: `Being an ISO standard with a standard calculation, this calendar is expected to be perfectly accurate.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/ISO_week_date">Wikipedia article</a>.'
    },

    {
        name: 'Haab',
        id: 'haab',
        type: 'Solar Calendar',
        epoch: '~550 BCE',
        confidence: 'High',
        overview: `The Haab is one of many calendars used by the Maya people. It features 18 months of 20 days plus a short month of 5 days, with days counted starting from 0. Thus, it has 365 days with no intercalation.\n\nThe Haab combines with another Maya calendar, the 260-day Tzolkin, to create the Maya Calendar Round. This is the cycle that the two calendars create, which takes roughly 52 years to complete.\n\nYears do not increment outside the Calendar Round, so it is impossible to say for certain what the epoch for the Haab should be, but sometime around 550 BCE is accepted among historians.`,
        info: `<table><tr><th colspan="4">Haab</th></tr><tr><th>Month</th><th>Days</th><th>Month</th><th>Days</th></tr><tr><td>Pop</td><td>20</td><td>Yax</td><td>20</td></tr><tr><td>Wo</td><td>20</td><td>Sak</td><td>20</td></tr><tr><td>Sip</td><td>20</td><td>Keh</td><td>20</td></tr><tr><td>Sotz'</td><td>20</td><td>Mak</td><td>20</td></tr><tr><td>Sek</td><td>20</td><td>K'ank'in</td><td>20</td></tr><tr><td>Xul</td><td>20</td><td>Muwan</td><td>20</td></tr><tr><td>Yaxk'in</td><td>20</td><td>Pax</td><td>20</td></tr><tr><td>Mol</td><td>20</td><td>K'ayab</td><td>20</td></tr><tr><td>Ch'en</td><td>20</td><td>Kumk'u</td><td>20</td></tr><tr><td></td><td></td><td>Wayeb'</td><td>5</td></tr></table>`,
        accuracy: `This calendar is still used today in some Maya groups, and it has been calibrated using the calculator provided by the Smithsonian National Museum of the American Indian. However, it also relies on the Long Count calendar being accurate.`,
        source: `Much of the information on this calendar can be found at its <a href="https://en.wikipedia.org/wiki/Maya_calendar">Wikipedia article</a>.\n\nThe <a href="https://maya.nmai.si.edu/calendar/maya-calendar-converter">Smithsonian website</a> has the current day as well as a converter, though it is broken for dates before the Long Count epoch.`
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
        epoch: '2333 BCE',
        confidence: 'Medium',
        overview: 'The Dangun calendar is the traditional calendar of Korea. It is no longer officially used, but it is still maintained by the South Korean goverment for cultural purposes and holidays. It is derived from the Chinese lunisolar calendar where it gets its months (월) and days (일) while years (년) are counted from 2333 BCE.\n\nThe Dangun calendar is calculated based on midnight in Korea, and as such its dates may misalign, sometimes significantly, from the Chinese lunisolar calendar.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'Some general information was taken from the <a href="https://en.wikipedia.org/wiki/Korean_calendar">Wikipedia article</a> for this calendar, but the general calculation is derived from the Chinese lunisolar calendar.'
    },

    {
        name: 'Hebrew (IST)',
        id: 'hebrew',
        type: 'Lunisolar Calendar',
        epoch: '6 October 3761 BCE',
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
        epoch: '17 July 622 CE, +15:00:00',
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
        epoch: '1 January 9999 BCE',
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
        epoch: '1 January 1 CE',
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
        epoch: '1 January 1 CE',
        confidence: 'Exact',
        overview: 'The World Calendar was proposed by Elisabeth Achelis in 1930 CE and was nearly adopted by the League of Nations. It features months in a repeating pattern of 31/30/30 days with World\'s Day happening between December and January and Leapyear Day occurring between June and July in leap years, which happen in the same years as the Gregorian calendar. These two special days are not part of any week nor month, as if the calendar has paused for 24 hours.\n\nThe regular month lengths ensure that the first of every month always lands on a Sunday, Wednesday, or Friday in a predictable pattern that is the same every year.',
        info: `<table class=table-short><tr><th>Calendar Unit</th><th>Days</th></tr><tr><td>World's Day</td><td>1</td></tr><tr><td>January</td><td>31</td></tr><tr><td>February</td><td>30</td></tr><tr><td>March</td><td>30</td></tr><tr><td>April</td><td>31</td></tr><tr><td>May</td><td>30</td></tr><tr><td>June</td><td>30</td></tr><tr><td>(Leapyear Day)</td><td>1</td></tr><tr><td>July</td><td>31</td></tr><tr><td>August</td><td>30</td></tr><tr><td>September</td><td>30</td></tr><tr><td>October</td><td>31</td></tr><tr><td>November</td><td>30</td></tr><tr><td>December</td><td>30</td></tr></table>`,
        accuracy: `As this calendar is only a proposal, there really isn't anything to compare it to historically. It is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.`,
        source: 'All of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/World_Calendar">Wikipedia article</a>.'
    },

    {
        name: 'Symmetry454',
        id: 'symmetry454',
        type: 'Proposed Calendar',
        epoch: '1 January 1 CE',
        confidence: 'Exact',
        overview: `The Symmetry454 calendar is a proposed calendar reform created in 2005 by Irv Bromberg that is based on the Gregorian calendar.\n\nIt features the same months as the Gregorian calendar but of different lengths, following a pattern of 28/35/28 days. This allows for a whole number of weeks in each month, 4/5/4 respectively, hence the calendar's name.\n\nThe calendar features a leap year that extends December by an extra week, occurring every 5 or 6 years. This keeps it in line with the Gregorian calendar on a 293-year cycle containing 52 leap years.\n\nThe format of the calendar allows each day of the year to always occur on the same day of the week.`,
        info: `This calendar is calibrated using 1 January 2001 as a reference date.\n\n<table class=table-short><tr><th>Months</th><th>Days</th></tr><tr><td>January</td><td>28</td></tr><tr><td>February</td><td>35</td></tr><tr><td>March</td><td>28</td></tr><tr><td>April</td><td>28</td></tr><tr><td>May</td><td>35</td></tr><tr><td>June</td><td>28</td></tr><tr><td>July</td><td>28</td></tr><tr><td>August</td><td>35</td></tr><tr><td>September</td><td>28</td></tr><tr><td>October</td><td>28</td></tr><tr><td>November</td><td>35</td></tr><tr><td>December</td><td>28 or 35</td></tr></table>`,
        accuracy: `As this calendar is only a proposal, there really isn't anything to compare it to historically. It is intrinsically based on and locked to the Gregorian calendar, making it perfectly accurate.\n\nIt has also been calibrated using the Kalendis tool which was created by the same creator of Symmetry454.`,
        source: 'Much of the information on this calendar came from its <a href="https://en.wikipedia.org/wiki/Symmetry454">Wikipedia article</a>.\n\nThis calendar has also been calibrated using a Windows app created by the creator of the Symmetry454 calendar, which can be found <a href="http://individual.utoronto.ca/kalendis/kalendis.htm">here</a>.'
    },
]

const otherCalendars = [
    {
        name: 'Maya Long Count',
        id: 'maya-long-count',
        type: 'Other Calendar',
        epoch: '11 August 3113 BCE',
        confidence: 'Exact',
        overview: 'The Maya Long Count calendar is essentially a simple count of the number of days since the Maya date of creation. It is a five digit number, typically expressed with periods between the digits, made up of base-20 counters with the exception of the middle-right digit which is base-18.\n\nStarting with the right, the smallest unit is the <b>kʼin</b>, which is equivalent to a day. Twenty kʼins make up one <b>winal</b>, 18 winals make up one <b>tun</b>, 20 tuns make up one <b>kʼatun</b>, and finally 20 kʼatuns make up one <b>bʼakʼtun</b>. A bʼakʼtun is roughly 394 solar years.\n\nThe Maya Long Count Calendar was of international interest in 2012 as it was the time when the bʼakʼtun incremented from 12 to 13, leading to superstitious theories and hysteria.',
        info: `Notably, winals are counted in base-18 rather than base-20 like the rest of the units. This is to reasonably match the tun to the length of the solar year. However, it is still over 5 days short, meaning it will drift about half as much as a true lunar calendar. 20 winals would be 400 days, which wouldn't have been as useful.\n\n<table class=table-short><tr><th>Maya Unit</th><th>Length</th></tr><tr><td>kʼin</td><td>1 day</td></tr><tr><td>winal</td><td>20 kʼins, 20 days</td></tr><tr><td>tun</td><td>18 winals, 360 days</td></tr><tr><td>kʼatun</td><td>20 tuns, 7200 days</td></tr><tr><td>bʼakʼtun</td><td>20 kʼatuns, 144000 days</td></tr></table>`,
        accuracy: 'Correlating the Maya Long Count calendar was a matter of debate even in recent times. The majority of scholars seem to have accepted the Goodman–Martinez–Thompson (GMT) correlation.\n\nWith that in mind, this calendar is actually very easy to calculate, as it is just a count of days since the epoch, not unlike the Julian Day Number. It has no concept of intercalary time such as leap days and the count is agnostic of the solar or lunar years. The only method of inaccuracy with this calendar could be when exactly each day increments, but that does not affect the rest of the calendar in any meaningful way.',
        source: 'Much of the information on this calendar can be found at its <a href="https://en.wikipedia.org/wiki/Mesoamerican_Long_Count_calendar">Wikipedia article</a>.\n\nThe <a href="https://maya.nmai.si.edu/calendar/maya-calendar-converter">Smithsonian website</a> has the current day as well as a converter, though it is broken for dates before the epoch.'
    },

    {
        name: 'Tzolkin',
        id: 'tzolkin',
        type: 'Other Calendar',
        epoch: '~1100 BCE',
        confidence: 'High',
        overview: `The Tzolkin is one of the calendars used by the Maya. It is a 260-day calendar with an unknown significance; suggestions include simple multiplications of important numbers as well as the length of a typical human gestation period.\n\nThe Tzolkin is a unique calendar, with day numbers increasing sequentially from 1-13 while the 20 day names also increment, leading to a system where 1 of a given day name is followed by 2 of the next day name, completing a cycle in 260 days.\n\nThe Tzolkin combines with another Maya calendar, the 365-day Haab, to create the Maya Calendar Round. This is the cycle that the two calendars create, which takes roughly 52 years to complete.\n\nCycles do not increment outside the Calendar Round, so it is impossible to say for certain what the epoch for the Tzolkin should be, but sometime around 1100 BCE is accepted among historians.`,
        info: `<table class="table-very-long"><tr><th colspan="4">Tzolkin</th></tr><tr><th>Day</th><th>Meaning</th><th>Day</th><th>Meaning</th></tr><tr><td>Imix</td><td>Crocodile</td><td>Chuwen</td><td>Monkey</td></tr><tr><td>Ik'</td><td>Wind</td><td>Eb'</td><td>Road</td></tr><tr><td>Ak'b'al</td><td>Night</td><td>B'en</td><td>Reed</td></tr><tr><td>K'an</td><td>Seed</td><td>Ix</td><td>Jaguar</td></tr><tr><td>Chikchan</td><td>Serpent</td><td>Men</td><td>Eagle</td></tr><tr><td>Kimi</td><td>Death</td><td>K'ib'</td><td>Wisdom</td></tr><tr><td>Manik'</td><td>Deer</td><td>Kaban</td><td>Earth</td></tr><tr><td>Lamat</td><td>Star</td><td>Etz'nab'</td><td>Flint</td></tr><tr><td>Muluk</td><td>Water</td><td>Kawak</td><td>Storm</td></tr><tr><td>Ok</td><td>Dog</td><td>Ajaw</td><td>Sun</td></tr></table>`,
        accuracy: `This calendar is still used today in some Maya groups, and it has been calibrated using the calculator provided by the Smithsonian National Museum of the American Indian. However, it also relies on the Long Count calendar being accurate.`,
        source: `Much of the information on this calendar can be found at its <a href="https://en.wikipedia.org/wiki/Maya_calendar">Wikipedia article</a>.\n\nThe <a href="https://maya.nmai.si.edu/calendar/maya-calendar-converter">Smithsonian website</a> has the current day as well as a converter, though it is broken for dates before the Long Count epoch.`
    },

    {
        name: 'Lord of the Night | Y',
        id: 'lord-of-the-night',
        type: 'Other Calendar',
        epoch: 'Unknown',
        confidence: 'High',
        overview: `The Lord of the Night is a day cycle used by the Maya people. It is a simple cycle of 9 incrementing days that reflect the Maya deity that rules that night.\n\nThe names of 8 of the lords have not been identified, but the G9 lord is named Pauahtun.\n\nThe Maya also had another day cycle of 7 days of unknown utility, referred to simply as 'Y'.`,
        info: `The Lords of the Night were also known by the Aztecs, and historians have identified the names of all 9 deities.`,
        accuracy: `Being a simple calculation, these two cycles are expected to be perfectly accurate.`,
        source: `Much of the information on this calendar can be found at its <a href="https://en.wikipedia.org/wiki/Lords_of_the_Night">Wikipedia article</a>.\n\nThe <a href="https://maya.nmai.si.edu/calendar/maya-calendar-converter">Smithsonian website</a> has the current day as well as a converter, though it is broken for dates before the Long Count epoch.`
    },

    {
        name: 'Darian (Mars)',
        id: 'darian-mars',
        type: 'Other Calendar',
        epoch: '12 March 1609 CE, 18:40:06',
        confidence: 'High',
        overview: 'The Darian calendar is a proposed calendar for use on Mars. It was created in 1985 by Thomas Gangale and named after his son, Darius.\n\nIt takes the ~668.5 sol Martian year (~687 Earth days) and divides it into 24 months of 28 or 27 sols. The new year is on the day of the Martian Northern Equinox.\n\nThe epoch is the Vernal Equinox of Julian Sol Number 0, taking place on 12 March 1609 CE at 18:40:06 UTC.\n\nLeap years add one extra day in the final month, and they take place if the year number is odd or divisible by 10, unless also divisible by 100 except if divisible by 1000, though this formula changes after Darian year 2000 and gets updated every few thousand years as the orbit of Mars becomes more eccentric.',
        info: `<table class="table-very-long"><tr><th>Month</th><th>Days</th></tr><tr><td>Sagittarius</td><td>28</td></tr><tr><td>Dhanus</td><td>28</td></tr><tr><td>Capricornus</td><td>28</td></tr><tr><td>Makara</td><td>28</td></tr><tr><td>Aquarius</td><td>28</td></tr><tr><td>Khumba</td><td>27</td></tr><tr><td>Pisces</td><td>28</td></tr><tr><td>Mina</td><td>28</td></tr><tr><td>Aries</td><td>28</td></tr><tr><td>Mesha</td><td>28</td></tr><tr><td>Taurus</td><td>28</td></tr><tr><td>Rishabha</td><td>27</td></tr><tr><td>Gemini</td><td>28</td></tr><tr><td>Mithuna</td><td>28</td></tr><tr><td>Cancer</td><td>28</td></tr><tr><td>Karka</td><td>28</td></tr><tr><td>Leo</td><td>28</td></tr><tr><td>Simha</td><td>27</td></tr><tr><td>Virgo</td><td>28</td></tr><tr><td>Kanya</td><td>28</td></tr><tr><td>Libra</td><td>28</td></tr><tr><td>Tula</td><td>28</td></tr><tr><td>Scorpius</td><td>28</td></tr><tr><td>Vrishika</td><td>27 or 28</td></tr></table>`,
        accuracy: `This calendar depends on the Julian Sol Number which is in turn based on the Mars Sol Date. Assuming these are all accurate, then the Darian calendar should be correct.\n\nThere is one more stipulation that the current calendar is only perfectly accurate between the years 0 and 2000 due to the shortening of the Martian equinox year. Whether those are Martian years or Earth years isn't clear, but the difference is rather small and is currently ignored for this calendar.`,
        source: 'Much of the information on this calendar can be found at its <a href="https://en.wikipedia.org/wiki/Darian_calendar">Wikipedia article</a>.\n\nThe actual creator of the calendar has a website and a date converter <a href="https://ops-alaska.com/time/gangale_converter/calendar_clock.htm">here</a>, but it uses a slightly different Terrestrial Time correction for the Mars sol.'
    },

    {
        name: 'Galilean (Io)',
        id: 'galilean-io',
        type: 'Other Calendar',
        epoch: '31 December 2001 +16:07:45',
        confidence: 'Medium',
        overview: `The Galilean calendars were created by Thomas Gangale for use on the four Galilean moons of Jupiter---Io, Europa, Ganymede, and Callisto. They are intended to loosely align with the Earth-based Gregorian calendar, roughly sharing an epoch and most month names.\n\nThe inner three moons are in a 2:4:8 Laplace resonance, and thus their orbits and solar days are in nearly exact ratios. As the solar day of Io, the inner-most moon, is over 42 hours, its day is broken into two units of time called 'circads' that are ~21 hours each and act as calendar days. The remaining moons have their orbits broken up into similar-sized circads: 4 for Europa, 8 for Ganymede, and 19 for Callisto.\n\nThe calendars all share circads, months, and weeks of 8 circads, though they drift in and out of phase with each other depending on intercalation. There are 13 months, with the 'extra' month of Mercedonius added between the February and March analogs. Generally months have 32 circads, but Ganymede's Junius is only 24 circads, as well as the month of December for all moons in non-leap years. The months are also prefixed with a shorthand name of the moon.`,
        info: `All four of the Galilean calendars use roughly the same epoch, within a week, as the Gregorian calendar, each of which corresponds with their Meridian Time.\n\nThe Galilean months are roughly equal to the Gregorian months, though with slightly different names as well as a 13th month added between Februarius and Martius. Each moon has a slightly different day arrangement.\n\n<table class="table-very-long"><tr><th>Io Month</th><th>Circads</th></tr><tr><td>Io Januarius</td><td>32</td></tr><tr><td>Io Februarius</td><td>32</td></tr><tr><td>Io Mercedonius</td><td>32</td></tr><tr><td>Io Martius</td><td>32</td></tr><tr><td>Io Aprilis</td><td>32</td></tr><tr><td>Io Maius</td><td>32</td></tr><tr><td>Io Junius</td><td>32</td></tr><tr><td>Io Julius</td><td>32</td></tr><tr><td>Io Augustus</td><td>32</td></tr><tr><td>Io September</td><td>32</td></tr><tr><td>Io October</td><td>32</td></tr><tr><td>Io November</td><td>32</td></tr><tr><td>Io December</td><td>24-32</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.\n\nI was unable to properly understand the intercalary system employed by Mr. Gangale, so I introduced my own while attempting to match his intent as closely as possible.\n\nThe name of this calendar was only implied in the original text but never explicitly stated.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Galilean (Europa)',
        id: 'galilean-europa',
        type: 'Other Calendar',
        epoch: '2 January 2002 +17:12:57',
        confidence: 'Medium',
        overview: `The Galilean calendars were created by Thomas Gangale for use on the four Galilean moons of Jupiter---Io, Europa, Ganymede, and Callisto. They are intended to loosely align with the Earth-based Gregorian calendar, roughly sharing an epoch and most month names.\n\nThe inner three moons are in a 2:4:8 Laplace resonance, and thus their orbits and solar days are in nearly exact ratios. As the solar day of Io, the inner-most moon, is over 42 hours, its day is broken into two units of time called 'circads' that are ~21 hours each and act as calendar days. The remaining moons have their orbits broken up into similar-sized circads: 4 for Europa, 8 for Ganymede, and 19 for Callisto.\n\nThe calendars all share circads, months, and weeks of 8 circads, though they drift in and out of phase with each other depending on intercalation. There are 13 months, with the 'extra' month of Mercedonius added between the February and March analogs. Generally months have 32 circads, but Ganymede's Junius is only 24 circads, as well as the month of December for all moons in non-leap years. The months are also prefixed with a shorthand name of the moon.`,
        info: `All four of the Galilean calendars use roughly the same epoch, within a week, as the Gregorian calendar, each of which corresponds with their Meridian Time.\n\nThe Galilean months are roughly equal to the Gregorian months, though with slightly different names as well as a 13th month added between Februarius and Martius. Each moon has a slightly different day arrangement.\n\n<table class="table-very-long"><tr><th>Europa Month</th><th>Circads</th></tr><tr><td>Eu Januarius</td><td>32</td></tr><tr><td>Eu Februarius</td><td>32</td></tr><tr><td>Eu Mercedonius</td><td>32</td></tr><tr><td>Eu Martius</td><td>32</td></tr><tr><td>Eu Aprilis</td><td>32</td></tr><tr><td>Eu Maius</td><td>32</td></tr><tr><td>Eu Junius</td><td>32</td></tr><tr><td>Eu Julius</td><td>32</td></tr><tr><td>Eu Augustus</td><td>32</td></tr><tr><td>Eu September</td><td>32</td></tr><tr><td>Eu October</td><td>32</td></tr><tr><td>Eu November</td><td>32</td></tr><tr><td>Eu December</td><td>24-32</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.\n\nI was unable to properly understand the intercalary system employed by Mr. Gangale, so I introduced my own while attempting to match his intent as closely as possible.\n\nThe name of this calendar was only implied in the original text but never explicitly stated.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Galilean (Ganymede)',
        id: 'galilean-ganymede',
        type: 'Other Calendar',
        epoch: '1 January 2002 +11:08:29',
        confidence: 'Medium',
        overview: `The Galilean calendars were created by Thomas Gangale for use on the four Galilean moons of Jupiter---Io, Europa, Ganymede, and Callisto. They are intended to loosely align with the Earth-based Gregorian calendar, roughly sharing an epoch and most month names.\n\nThe inner three moons are in a 2:4:8 Laplace resonance, and thus their orbits and solar days are in nearly exact ratios. As the solar day of Io, the inner-most moon, is over 42 hours, its day is broken into two units of time called 'circads' that are ~21 hours each and act as calendar days. The remaining moons have their orbits broken up into similar-sized circads: 4 for Europa, 8 for Ganymede, and 19 for Callisto.\n\nThe calendars all share circads, months, and weeks of 8 circads, though they drift in and out of phase with each other depending on intercalation. There are 13 months, with the 'extra' month of Mercedonius added between the February and March analogs. Generally months have 32 circads, but Ganymede's Junius is only 24 circads, as well as the month of December for all moons in non-leap years. The months are also prefixed with a shorthand name of the moon.`,
        info: `All four of the Galilean calendars use roughly the same epoch, within a week, as the Gregorian calendar, each of which corresponds with their Meridian Time.\n\nThe Galilean months are roughly equal to the Gregorian months, though with slightly different names as well as a 13th month added between Februarius and Martius. Each moon has a slightly different day arrangement.\n\n<table class="table-very-long"><tr><th>Ganymede Month</th><th>Circads</th></tr><tr><td>Gan Januarius</td><td>32</td></tr><tr><td>Gan Februarius</td><td>32</td></tr><tr><td>Gan Mercedonius</td><td>32</td></tr><tr><td>Gan Martius</td><td>32</td></tr><tr><td>Gan Aprilis</td><td>32</td></tr><tr><td>Gan Maius</td><td>32</td></tr><tr><td>Gan Junius</td><td>24</td></tr><tr><td>Gan Julius</td><td>32</td></tr><tr><td>Gan Augustus</td><td>32</td></tr><tr><td>Gan September</td><td>32</td></tr><tr><td>Gan October</td><td>32</td></tr><tr><td>Gan November</td><td>32</td></tr><tr><td>Gan December</td><td>24-32</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.\n\nI was unable to properly understand the intercalary system employed by Mr. Gangale, so I introduced my own while attempting to match his intent as closely as possible.\n\nThe name of this calendar was only implied in the original text but never explicitly stated.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Galilean (Callisto)',
        id: 'galilean-callisto',
        type: 'Other Calendar',
        epoch: '28 December 2001 +12:27:23',
        confidence: 'Medium',
        overview: `The Galilean calendars were created by Thomas Gangale for use on the four Galilean moons of Jupiter---Io, Europa, Ganymede, and Callisto. They are intended to loosely align with the Earth-based Gregorian calendar, roughly sharing an epoch and most month names.\n\nThe inner three moons are in a 2:4:8 Laplace resonance, and thus their orbits and solar days are in nearly exact ratios. As the solar day of Io, the inner-most moon, is over 42 hours, its day is broken into two units of time called 'circads' that are ~21 hours each and act as calendar days. The remaining moons have their orbits broken up into similar-sized circads: 4 for Europa, 8 for Ganymede, and 19 for Callisto.\n\nThe calendars all share circads, months, and weeks of 8 circads, though they drift in and out of phase with each other depending on intercalation. There are 13 months, with the 'extra' month of Mercedonius added between the February and March analogs. Generally months have 32 circads, but Ganymede's Junius is only 24 circads, as well as the month of December for all moons in non-leap years. The months are also prefixed with a shorthand name of the moon.`,
        info: `All four of the Galilean calendars use roughly the same epoch, within a week, as the Gregorian calendar, each of which corresponds with their Meridian Time.\n\nThe Galilean months are roughly equal to the Gregorian months, though with slightly different names as well as a 13th month added between Februarius and Martius. Each moon has a slightly different day arrangement.\n\n<table class="table-very-long"><tr><th>Callisto Month</th><th>Circads</th></tr><tr><td>Cal Januarius</td><td>32</td></tr><tr><td>Cal Februarius</td><td>32</td></tr><tr><td>Cal Mercedonius</td><td>32</td></tr><tr><td>Cal Martius</td><td>32</td></tr><tr><td>Cal Aprilis</td><td>32</td></tr><tr><td>Cal Maius</td><td>32</td></tr><tr><td>Cal Junius</td><td>32</td></tr><tr><td>Cal Julius</td><td>32</td></tr><tr><td>Cal Augustus</td><td>32</td></tr><tr><td>Cal September</td><td>32</td></tr><tr><td>Cal October</td><td>32</td></tr><tr><td>Cal November</td><td>32</td></tr><tr><td>Cal December</td><td>24-32</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.\n\nI was unable to properly understand the intercalary system employed by Mr. Gangale, so I introduced my own while attempting to match his intent as closely as possible.\n\nThe name of this calendar was only implied in the original text but never explicitly stated.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Darian (Io)',
        id: 'darian-io',
        type: 'Other Calendar',
        epoch: '13 March 1609 +05:29:26',
        confidence: 'High',
        overview: `The Galilean Darian calendars were created by Thomas Gangale for use on the four Galilean moons of Jupiter---Io, Europa, Ganymede, and Callisto. They are intended to loosely align with the Mars-based Darian calendar, roughly sharing an epoch as well as all 24 months.\n\nThe inner three moons are in a 2:4:8 Laplace resonance, and thus their orbits and solar days are in nearly exact ratios. As the solar day of Io, the inner-most moon, is over 42 hours, its day is broken into two units of time called 'circads' that are ~21 hours each and act as calendar days. The remaining moons have their orbits broken up into similar-sized circads: 4 for Europa, 8 for Ganymede, and 19 for Callisto.\n\nThe calendars all share circads, months, and weeks of 8 circads, though they drift in and out of phase with each other depending on intercalation. Generally months have 32 circads, with few exceptions, most notably the final month that can be intercalated to have 24, 32, or 40 circads. The months are also prefixed with a shorthand name of the moon.`,
        info: `All four of the Galilean Darian calendars use roughly the same epoch, within a week, as the Martian Darian calendar, each of which corresponds with their Meridian Time.\n\n<table class="table-very-very-long"><tr><th>Io Month</th><th>Circads</th></tr><tr><td>Io Sagittarius</td><td>32</td></tr><tr><td>Io Dhanus</td><td>32</td></tr><tr><td>Io Capricornus</td><td>32</td></tr><tr><td>Io Makara</td><td>32</td></tr><tr><td>Io Aquarius</td><td>32</td></tr><tr><td>Io Khumba</td><td>32</td></tr><tr><td>Io Pisces</td><td>32</td></tr><tr><td>Io Mina</td><td>32</td></tr><tr><td>Io Aries</td><td>32</td></tr><tr><td>Io Mesha</td><td>32</td></tr><tr><td>Io Taurus</td><td>32</td></tr><tr><td>Io Rishabha</td><td>40</td></tr><tr><td>Io Gemini</td><td>32</td></tr><tr><td>Io Mithuna</td><td>32</td></tr><tr><td>Io Cancer</td><td>32</td></tr><tr><td>Io Karka</td><td>32</td></tr><tr><td>Io Leo</td><td>32</td></tr><tr><td>Io Simha</td><td>32</td></tr><tr><td>Io Virgo</td><td>32</td></tr><tr><td>Io Kanya</td><td>32</td></tr><tr><td>Io Libra</td><td>32</td></tr><tr><td>Io Tula</td><td>32</td></tr><tr><td>Io Scorpius</td><td>32</td></tr><tr><td>Io Vrishika</td><td>32-40</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Darian (Europa)',
        id: 'darian-europa',
        type: 'Other Calendar',
        epoch: '12 March 1609 +01:19:41',
        confidence: 'High',
        overview: `The Galilean Darian calendars were created by Thomas Gangale for use on the four Galilean moons of Jupiter---Io, Europa, Ganymede, and Callisto. They are intended to loosely align with the Mars-based Darian calendar, roughly sharing an epoch as well as all 24 months.\n\nThe inner three moons are in a 2:4:8 Laplace resonance, and thus their orbits and solar days are in nearly exact ratios. As the solar day of Io, the inner-most moon, is over 42 hours, its day is broken into two units of time called 'circads' that are ~21 hours each and act as calendar days. The remaining moons have their orbits broken up into similar-sized circads: 4 for Europa, 8 for Ganymede, and 19 for Callisto.\n\nThe calendars all share circads, months, and weeks of 8 circads, though they drift in and out of phase with each other depending on intercalation. Generally months have 32 circads, with few exceptions, most notably the final month that can be intercalated to have 24, 32, or 40 circads. The months are also prefixed with a shorthand name of the moon.`,
        info: `All four of the Galilean Darian calendars use roughly the same epoch, within a week, as the Martian Darian calendar, each of which corresponds with their Meridian Time.\n\n<table class="table-very-very-long"><tr><th>Europa Month</th><th>Circads</th></tr><tr><td>Eu Sagittarius</td><td>32</td></tr><tr><td>Eu Dhanus</td><td>32</td></tr><tr><td>Eu Capricornus</td><td>32</td></tr><tr><td>Eu Makara</td><td>32</td></tr><tr><td>Eu Aquarius</td><td>32</td></tr><tr><td>Eu Khumba</td><td>32</td></tr><tr><td>Eu Pisces</td><td>32</td></tr><tr><td>Eu Mina</td><td>32</td></tr><tr><td>Eu Aries</td><td>32</td></tr><tr><td>Eu Mesha</td><td>32</td></tr><tr><td>Eu Taurus</td><td>32</td></tr><tr><td>Eu Rishabha</td><td>32</td></tr><tr><td>Eu Gemini</td><td>32</td></tr><tr><td>Eu Mithuna</td><td>32</td></tr><tr><td>Eu Cancer</td><td>32</td></tr><tr><td>Eu Karka</td><td>32</td></tr><tr><td>Eu Leo</td><td>32</td></tr><tr><td>Eu Simha</td><td>32</td></tr><tr><td>Eu Virgo</td><td>32</td></tr><tr><td>Eu Kanya</td><td>32</td></tr><tr><td>Eu Libra</td><td>32</td></tr><tr><td>Eu Tula</td><td>32</td></tr><tr><td>Eu Scorpius</td><td>32</td></tr><tr><td>Eu Vrishika</td><td>32-40</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Darian (Ganymede)',
        id: 'darian-ganymede',
        type: 'Other Calendar',
        epoch: '11 March 1609 +09:52:12',
        confidence: 'High',
        overview: `The Galilean Darian calendars were created by Thomas Gangale for use on the four Galilean moons of Jupiter---Io, Europa, Ganymede, and Callisto. They are intended to loosely align with the Mars-based Darian calendar, roughly sharing an epoch as well as all 24 months.\n\nThe inner three moons are in a 2:4:8 Laplace resonance, and thus their orbits and solar days are in nearly exact ratios. As the solar day of Io, the inner-most moon, is over 42 hours, its day is broken into two units of time called 'circads' that are ~21 hours each and act as calendar days. The remaining moons have their orbits broken up into similar-sized circads: 4 for Europa, 8 for Ganymede, and 19 for Callisto.\n\nThe calendars all share circads, months, and weeks of 8 circads, though they drift in and out of phase with each other depending on intercalation. Generally months have 32 circads, with few exceptions, most notably the final month that can be intercalated to have 24, 32, or 40 circads. The months are also prefixed with a shorthand name of the moon.`,
        info: `All four of the Galilean Darian calendars use roughly the same epoch, within a week, as the Martian Darian calendar, each of which corresponds with their Meridian Time.\n\n<table class="table-very-very-long"><tr><th>Ganymede Month</th><th>Circads</th></tr><tr><td>Gan Sagittarius</td><td>32</td></tr><tr><td>Gan Dhanus</td><td>32</td></tr><tr><td>Gan Capricornus</td><td>32</td></tr><tr><td>Gan Makara</td><td>32</td></tr><tr><td>Gan Aquarius</td><td>32</td></tr><tr><td>Gan Khumba</td><td>32</td></tr><tr><td>Gan Pisces</td><td>32</td></tr><tr><td>Gan Mina</td><td>32</td></tr><tr><td>Gan Aries</td><td>32</td></tr><tr><td>Gan Mesha</td><td>32</td></tr><tr><td>Gan Taurus</td><td>32</td></tr><tr><td>Gan Rishabha</td><td>32</td></tr><tr><td>Gan Gemini</td><td>32</td></tr><tr><td>Gan Mithuna</td><td>32</td></tr><tr><td>Gan Cancer</td><td>32</td></tr><tr><td>Gan Karka</td><td>32</td></tr><tr><td>Gan Leo</td><td>32</td></tr><tr><td>Gan Simha</td><td>32</td></tr><tr><td>Gan Virgo</td><td>32</td></tr><tr><td>Gan Kanya</td><td>32</td></tr><tr><td>Gan Libra</td><td>32</td></tr><tr><td>Gan Tula</td><td>32</td></tr><tr><td>Gan Scorpius</td><td>32</td></tr><tr><td>Gan Vrishika</td><td>24-32</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Darian (Callisto)',
        id: 'darian-callisto',
        type: 'Other Calendar',
        epoch: '17 March 1609 +20:57:24',
        confidence: 'High',
        overview: `The Galilean Darian calendars were created by Thomas Gangale for use on the four Galilean moons of Jupiter---Io, Europa, Ganymede, and Callisto. They are intended to loosely align with the Mars-based Darian calendar, roughly sharing an epoch as well as all 24 months.\n\nThe inner three moons are in a 2:4:8 Laplace resonance, and thus their orbits and solar days are in nearly exact ratios. As the solar day of Io, the inner-most moon, is over 42 hours, its day is broken into two units of time called 'circads' that are ~21 hours each and act as calendar days. The remaining moons have their orbits broken up into similar-sized circads: 4 for Europa, 8 for Ganymede, and 19 for Callisto.\n\nThe calendars all share circads, months, and weeks of 8 circads, though they drift in and out of phase with each other depending on intercalation. Generally months have 32 circads, with few exceptions, most notably the final month that can be intercalated to have 24, 32, or 40 circads. The months are also prefixed with a shorthand name of the moon.`,
        info: `All four of the Galilean Darian calendars use roughly the same epoch, within a week, as the Martian Darian calendar, each of which corresponds with their Meridian Time.\n\n<table class="table-very-very-long"><tr><th>Callisto Month</th><th>Circads</th></tr><tr><td>Cal Sagittarius</td><td>32</td></tr><tr><td>Cal Dhanus</td><td>32</td></tr><tr><td>Cal Capricornus</td><td>32</td></tr><tr><td>Cal Makara</td><td>32</td></tr><tr><td>Cal Aquarius</td><td>32</td></tr><tr><td>Cal Khumba</td><td>32</td></tr><tr><td>Cal Pisces</td><td>32</td></tr><tr><td>Cal Mina</td><td>32</td></tr><tr><td>Cal Aries</td><td>32</td></tr><tr><td>Cal Mesha</td><td>32</td></tr><tr><td>Cal Taurus</td><td>32</td></tr><tr><td>Cal Rishabha</td><td>40</td></tr><tr><td>Cal Gemini</td><td>32</td></tr><tr><td>Cal Mithuna</td><td>32</td></tr><tr><td>Cal Cancer</td><td>32</td></tr><tr><td>Cal Karka</td><td>32</td></tr><tr><td>Cal Leo</td><td>32</td></tr><tr><td>Cal Simha</td><td>32</td></tr><tr><td>Cal Virgo</td><td>32</td></tr><tr><td>Cal Kanya</td><td>32</td></tr><tr><td>Cal Libra</td><td>32</td></tr><tr><td>Cal Tula</td><td>32</td></tr><tr><td>Cal Scorpius</td><td>32</td></tr><tr><td>Cal Vrishika</td><td>32-40</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_jupiter/jupiter.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/wp-content/plugins/observing-tools/jupiter_moons/jupiter.html">this model</a> if you know what you're doing.`
    },

    {
        name: 'Darian (Titan)',
        id: 'darian-titan',
        type: 'Other Calendar',
        epoch: '15 March 1609 +18:37:32',
        confidence: 'High',
        overview: `The Darian calendar for Titan, moon of Saturn, was created by Thomas Gangale and is a continuation of the calendars created for Mars and the four Galilean moons of Jupiter. It is intended to closely align with the Martian Darian calendar, roughly sharing an epoch as well as all 24 months.\n\nAs the solar day of Titan is nearly 16 Earth days long, its day is broken into 16 units of time called 'circads' that are ~23 hours each and act as calendar days.\n\nThis calendar features 24 months of 28 or 32 circads each, allowing for a clean division of the 8-circad week.\n\nLeap years add an entire week, split evenly between the 12th and 24th months, adding 4 circads each for a total of 32 circads, allowing it to stay in sync with the Martian Darian calendar.\n\nYears don't always begin and end at midnight on Titan's prime meridian, as the circad system takes precedence over the solar day.`,
        info: `<table class="table-very-very-long"><tr><th>Titan Month</th><th>Circads</th></tr><tr><td>Ti Sagittarius</td><td>28</td></tr><tr><td>Ti Dhanus</td><td>28</td></tr><tr><td>Ti Capricornus</td><td>32</td></tr><tr><td>Ti Makara</td><td>28</td></tr><tr><td>Ti Aquarius</td><td>28</td></tr><tr><td>Ti Khumba</td><td>28</td></tr><tr><td>Ti Pisces</td><td>28</td></tr><tr><td>Ti Mina</td><td>28</td></tr><tr><td>Ti Aries</td><td>32</td></tr><tr><td>Ti Mesha</td><td>28</td></tr><tr><td>Ti Taurus</td><td>28</td></tr><tr><td>Ti Rishabha</td><td>28-32</td></tr><tr><td>Ti Gemini</td><td>28</td></tr><tr><td>Ti Mithuna</td><td>28</td></tr><tr><td>Ti Cancer</td><td>32</td></tr><tr><td>Ti Karka</td><td>28</td></tr><tr><td>Ti Leo</td><td>28</td></tr><tr><td>Ti Simha</td><td>28</td></tr><tr><td>Ti Virgo</td><td>28</td></tr><tr><td>Ti Kanya</td><td>28</td></tr><tr><td>Ti Libra</td><td>32</td></tr><tr><td>Ti Tula</td><td>28</td></tr><tr><td>Ti Scorpius</td><td>28</td></tr><tr><td>Ti Vrishika</td><td>28-32</td></tr></table>`,
        accuracy: `The accuracy of this calendar system is wholely dependent on the writings and calculations of Thomas Gangale. It is likely that these calculations weren't precise enough to extend more than a few decades, as they do seem to drift from ephemeris data.\n\nThe epoch is noted to account for the time it takes light to travel from Jupiter in the Galilean calendars, but it isn't clear if it has also been accounted for in this calendar.`,
        source: `This formula was extrapolated from the writings of Thomas Gangale found at <a href="https://ops-alaska.com/time/gangale_saturn/Darian_Titan_main.htm">this website</a>.\n\nIt can be somewhat calibrated using <a href="https://skyandtelescope.org/observing/interactive-sky-watching-tools/saturns-moons-javascript-utility/">this model</a> if you know what you're doing.`
    },

    {
        name: 'Yuga Cycle (IST)',
        id: 'yuga-cycle',
        type: 'Other Calendar',
        epoch: '3,891,102 BCE',
        confidence: 'High',
        overview: `The Yuga Cycle is the cyclic age in Hindu cosmology. It is divided into 4 yugas, each divided into dawn, proper, and dusk periods, that lasts for a total of 4,320,000 years.\n\nEach yuga in the cycle lasts for a shorter amount of time but, according to Hindu cosmology, also reduces the moral and phsical state of the world before a cataclysm and re-establishment of the dharma and restarting of the cycle.\n\nThe current yuga, Kali Yuga, is the shortest and worst. It will last until the year 428,899 CE.`,
        info: `<table class="table-long"><tr><th>Yuga</th><th>Start</th><th>Length</th></tr><tr><td>Krita (Satya)</td><td>3,891,102 BCE</td><td>1,728,000</td></tr><tr><td>Treta</td><td>2,163,102 BCE</td><td>1,296,000</td></tr><tr><td>Dvapara</td><td>867,102 BCE</td><td>864,000</td></tr><tr><td>Kali</td><td>3102 BCE</td><td>432,000</td></tr></table>\n\n<table class="table-long"><tr><th>Yuga Part</th><th>Solar years</th></tr><tr><td>Satya Yuga: Sandhya (dawn)</td><td>144,000</td></tr><tr><td>Satya Yuga (proper)</td><td>1,440,000</td></tr><tr><td>Satya Yuga: Sandhyamsa (dusk)</td><td>144,000</td></tr><tr><td>Treta Yuga: Sandhya (dawn)</td><td>108,000</td></tr><tr><td>Treta Yuga (proper)</td><td>1,080,000</td></tr><tr><td>Treta Yuga: Sandhyamsa (dusk)</td><td>108,000</td></tr><tr><td>Dvapara Yuga: Sandhya (dawn)</td><td>72,000</td></tr><tr><td>Dvapara Yuga (proper)</td><td>720,000</td></tr><tr><td>Dvapara Yuga: Sandhyamsa (dusk)</td><td>72,000</td></tr><tr><td>Kali Yuga: Sandhya (dawn)</td><td>36,000</td></tr><tr><td>Kali Yuga (proper)</td><td>360,000</td></tr><tr><td>Kali Yuga: Sandhyamsa (dusk)</td><td>36,000</td></tr></table>`,
        accuracy: 'The Yuga Cycle is ultimately based off the Gregorian calendar via the Kali Ahargaṅa and is considered to be very accurate compared with historical records.',
        source: `All of the information for this timekeeping system has come from its <a href="https://en.wikipedia.org/wiki/Yuga_cycle">Wikipedia article</a>.`
    },

    {
        name: 'Sothic Cycle',
        id: 'sothic-cycle',
        type: 'Other Calendar',
        epoch: '27 June 2781 BCE',
        confidence: 'High',
        overview: `The Sothic Cycle is the relationship between the start of the new year of the Egyptian calendar and the heliacal rising of the star of Sirius, which was originally what the calendar was based on.\n\nThe Egyptian calendar had years of exactly 365 days while the heliacal rising of Siruis is on a cycle of 365.25 days, causing the two to drift apart and eventually come together again over the course of 1460 years. This rate of error was one of the references for the creation of the Julian calendar, meaning the two calendars share the same relationship through the cycle. For every 1460 Julian years there are 1461 Egyptian years.\n\nThe first cycle is believed to begin on 27 June 2781 BCE, which is implied to be the date of the creation of the Egyptian calendar.\n\nThe Sothic Cycle was instrumental in calibrating the Egyptian date by historians.`,
        info: `The Sothic Cycle shows a relationship between the Julian and Egyptian calendars of 1460/1461. The Gregorian calendar does not line up in the same way due to the revised leap year rules.\n\n<table class="table-short"><tr><th>Cycle</th><th>Julian Date</th><th>Gregorian Date</th></tr><tr><td>1</td><td>20 July 2781 BC</td><td>27 June 2781 BCE</td></tr><tr><td>2</td><td>20 July 1321 BC</td><td>8 July 1321 BCE</td></tr><tr><td>3</td><td>20 July 139 AD</td><td>19 July 139 CE</td></tr><tr><td>4</td><td>20 July 1599 AD</td><td>30 July 1599 CE</td></tr><tr><td>5</td><td>20 July 3059 AD</td><td>10 August 3059 CE</td></tr><tr><td>6</td><td>20 July 4519 AD</td><td>21 August 4519 CE</td></tr></table>`,
        accuracy: `This calendar is mathematically exact, though my calculations are sometimes a day off from official sources. This could be due to leap day rules or due to astronomical dates.\n\nHistorians are also somewhat unsure about how many cycles have passed, and it's possible that there has been one more cycle before the accepted first cycle.`,
        source: `All of the information for this timekeeping system has come from its <a href="https://en.wikipedia.org/wiki/Sothic_cycle">Wikipedia article</a>.`
    },

    {
        name: 'Olympiad',
        id: 'olympiad',
        type: 'Other Calendar',
        epoch: '24 July 775 BCE',
        confidence: 'High',
        overview: `The Olympiad is an ancient unit of measurement that corresponds with 4 solar years, counting the number of Olympic games since the first Olympic games in 775 BCE. It was used for over 1000 years by Ancient Greece as well as Ancient Rome.\n\nThe Olympics eventually ceased to be held around 400 AD, and with it the Olympiad fell out of use.`,
        info: `The ancient Olympiad has little connection to the modern olympic games, as they are out of phase with each other and start with a different epoch.`,
        accuracy: `The exact start of the Olympic games is unclear, and most sources will just say it was held in the summer of 776 BCE. This website uses astronomical dates, so it is displayed here as 775 BCE. I have chosen to use 1 August of the Julian calendar for the middle of summer.`,
        source: `All of the information for this timekeeping system has come from its <a href="https://en.wikipedia.org/wiki/Olympiad">Wikipedia article</a>.`
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
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. On top of that, my solutions don\'t exactly match those provided by Meeus, either due to Javascript\'s base-2 calculations or due to misinterpreting steps such as adding Terrestrial Time. Overall these results are very close, usually within a few minutes of reality, but they aren\'t perfect.',
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
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. On top of that, my solutions don\'t exactly match those provided by Meeus, either due to Javascript\'s base-2 calculations or due to misinterpreting steps such as adding Terrestrial Time. Overall these results are very close, usually within a few minutes of reality, but they aren\'t perfect.',
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
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. On top of that, my solutions don\'t exactly match those provided by Meeus, either due to Javascript\'s base-2 calculations or due to misinterpreting steps such as adding Terrestrial Time. Overall these results are very close, usually within a few minutes of reality, but they aren\'t perfect.',
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
        accuracy: 'The accuracy of this calculation depends on the precision of Meeus\'s calculations. On top of that, my solutions don\'t exactly match those provided by Meeus, either due to Javascript\'s base-2 calculations or due to misinterpreting steps such as adding Terrestrial Time. Overall these results are very close, usually within a few minutes of reality, but they aren\'t perfect.',
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
        accuracy: 'This calculation is <i>mostly</i> accurate, but it differs from Jean Meeus\'s solutions by a few minutes. I am not sure why this is the case, though I suspect it has to do with the base-2 calculations in JavaScript. It is also possible that my Terrestrial Time calculations are independently incorrect, which are factored into the New Moon calculation. Dates far away from the current year are likely to be significantly off.',
        source: 'This calculation in its entirety was sourced from <a href="https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up"><i>Astronomical Algorithms</i> (1991)</a> by Jean Meeus.'
    },

    {
        name: 'Next Solar Eclipse',
        id: 'next-solar-eclipse',
        type: 'Astronomical Data',
        epoch: 'Undefined',
        confidence: 'High',
        overview: `A solar eclipse occurs when the moon casts a shadow anywhere onto the Earth. It is a fairly rare event that always occurs during a New Moon.\n\nWhen the moon completely covers the disk of the sun from the perpective of a point on the Earth, it is called a Total Solar Eclipse. When the moon appears to be smaller than the sun, with the sun visible in a 'Ring of Fire' around the edge, it is called an Annular Solar Eclipse. When the moon covers part of the sun but doesn't intersect the center of the sun's disk, it is called a Partial Solar Eclipse.\n\nThis entry also displays the node at which the eclipse took place as well as the hemisphere of Earth where it is visible at its maximum.\n\nSolar eclipses typically are only viewable from a small area on the Eath's surface, and they are historically significant events that have inspired legend, religion, and myth. The solar eclipse of 8 April 2024 CE is what inspired me to build this website.`,
        info: `Solar eclipses typically happen every one or two years, though total solar eclipses are rarer. They can only occur when a New Moon happens very near to the moon's ascending or descending nodes—the points along the lunar orbit that intersect the Earth's equator. These are at 0°/360° and 180° respectively.\n\nDue to the oblong shape of the moon's orbit, the moon can either appear larger or smaller than the sun from the perspective of Earth. This coincidence produces the two different types of central eclipses, total and annular.\n\nDuring a total solar eclipse, the sun's corona is visible to the naked eye, providing a spectacular sight as well as an opportunity to conduct science.`,
        accuracy: 'This calculation is reasonably accurate within thousands of years of 2000 CE. After that, errors are induced which can grow from hours to even days.\n\nThis calculation relies on the New Moon calculation as well as Terrestrial Time, each of which have potential to induce errors, either due to my own misunderstanding of the source or because of the uncertainty of the cosmos.',
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

    {
        name: 'Termina Time (Slowed)',
        id: 'termina-time',
        type: 'Pop Culture',
        epoch: '6:00:00',
        confidence: 'Exact',
        overview: `Termina Time is the timekeeping system found in The Legend of Zelda: Majora's Mask.\n\nIt features a cycle of 3 days of 24 hours that are each 150 seconds long when slowed. Days start at sunrise at 6:00am, so 5:00 of one day is followed by 6:00 of the next day.`,
        info: 'Slowed time was chosen over regular time due to the former fitting cleanly within three real life hours. The entire 3-day cycle in regular time takes 54 minutes, which would create an awkward short cycle at each real life day change (or rather, 6:00am).',
        accuracy: 'This timekeeping system should be perfectly accurate based on local time.',
        source: 'This calculation was sourced from the <a href="https://zelda.fandom.com/wiki/Time#Majora\'s_Mask">Zelda Fandom Website</a>.'
    },
]

const politicalCycles = [
    {
        name: 'US Presidential Terms',
        id: 'us-presidential-terms',
        type: 'Politics',
        epoch: '30 April 1789',
        confidence: 'High',
        overview: 'The term of the US president lasts 4 years, starting from January 20th at noon and ending January 20th at noon four years later. This is a running count of how many presidential terms have passed since the inauguration of George Washington in 1789. The inauguration date has changed over the years, making this display inaccurate for years before 1937.',
        info: `<div class="presidential-terms-container">George Washington 1789-1797\nJohn Adams 1797-1801\nThomas Jefferson 1801-1809\nJames Madison 1809-1817\nJames Monroe 1817-1825\nJohn Quincy Adams 1825-1829\nAndrew Jackson 1829-1837\nMartin Van Buren 1837-1841\nWilliam Henry Harrison 1841\nJohn Tyler 1841-1845\nJames K. Polk 1845-1849\nZachary Taylor 1849-1850\nMillard Fillmore 1850-1853\nFranklin Pierce 1853-1857\nJames Buchanan 1857-1861\nAbraham Lincoln 1861-1865\nAndrew Johnson 1865-1869\nUlysses S. Grant 1869-1877\nRutherford B. Hayes 1877-1881\nJames A. Garfield 1881\nChester A. Arthur 1881-1885\nGrover Cleveland 1885-1889\nBenjamin Harrison 1889-1893\nGrover Cleveland 1893-1897\nWilliam McKinley 1897-1901\nTheodore Roosevelt 1901-1909\nWilliam Howard Taft 1909-1913\nWoodrow Wilson 1913-1921\nWarren G. Harding 1921-1923\nCalvin Coolidge 1923-1929\nHerbert Hoover 1929-1933\nFranklin D. Roosevelt 1933-1945\nHarry S. Truman 1945-1953\nDwight D. Eisenhower 1953-1961\nJohn F. Kennedy 1961-1963\nLyndon B. Johnson 1963-1969\nRichard Nixon 1969-1974\nGerald Ford 1974-1977\nJimmy Carter 1977-1981\nRonald Reagan 1981-1989\nGeorge H. W. Bush 1989-1993\nBill Clinton 1993-2001\nGeorge W. Bush 2001-2009\nBarack Obama 2009-2017\nDonald Trump 2017-2021\nJoe Biden 2021-</div>`,
        accuracy: 'US terms don\'t always start on January 20th, with certain stipulations such as if the 20th falls on a Sunday that could change the date slightly. The current system of terms starting on the 20th didn\'t start until 1937, and previously it was March 4th, with George Washington starting on April 30th.',
        source: 'The data for this entry was sourced from <a href="https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States">this Wikipedia page</a>.'
    },
]