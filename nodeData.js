//|-------------------|
//|     Node Data     |
//|-------------------|

/*
Node Data is a collection of data for each node.
    name:           The name of the node.
    type:           The type of calendar/time.
    epoch:          The starting epoch of the calendar/time.
    confidence:     A measure of how confident I am in the node's accuracy.
    description:    The text that appears on hover.
*/

const standardTimeData = [
    {
        name: 'Local Time',
        id: 'local-time',
        type: 'Standard Time',
        epoch: 'Local Midnight',
        condfidence: 'Exact',
        description: 'This is the current local time based on the timezone provided by your device.'
    },

    {
        name: 'UTC',
        id: 'utc',
        type: 'Standard Time',
        epoch: 'UTC Midnight',
        condfidence: 'Exact',
        description: 'This is the current UTC time regardless of location.'
    },

    {
        name: 'Second',
        id: 'second',
        type: 'Standard Time',
        epoch: 'Every Second',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current second.'
    },

    {
        name: 'Minute',
        id: 'minute',
        type: 'Standard Time',
        epoch: 'Every Minute',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current minute.'
    },

    {
        name: 'Hour',
        id: 'hour',
        type: 'Standard Time',
        epoch: 'Every Hour',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current hour.'
    },

    {
        name: 'Day',
        id: 'day',
        type: 'Standard Time',
        epoch: 'Every Day',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current day.'
    },

    {
        name: 'Month',
        id: 'month',
        type: 'Standard Time',
        epoch: 'Every Month',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current month.'
    },

    {
        name: 'Year',
        id: 'year',
        type: 'Standard Time',
        epoch: 'Every Year',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current year.'
    },

    {
        name: 'Decade',
        id: 'decade',
        type: 'Standard Time',
        epoch: 'Every Decade',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current decade.'
    },

    {
        name: 'Century',
        id: 'century',
        type: 'Standard Time',
        epoch: 'Every Century',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current century.'
    },

    {
        name: 'Millennium',
        id: 'millennium',
        type: 'Standard Time',
        epoch: 'Every Millennium',
        condfidence: 'Exact',
        description: 'This is the fraction of time passed in the current millennium.'
    },
]

const computingTimeData = [
    {
        name: 'Unix',
        id: 'unix',
        type: 'Computing Time',
        epoch: 'January 1st, 1970 CE',
        condfidence: 'Exact',
        description: 'Unix is the most widespread timing system in computing and on the internet. It is a simple count of number of seconds since midnight on January 1st, 1970. Many of the calculations on this website are derived from Unix timestamps. It is exactly accurate.'
    },

    {
        name: 'ISO 8601',
        id: 'iso8601',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        condfidence: 'Exact',
        description: 'ISO 8601 is the standard of displaying date and time provided by the International Organization for Standardization. It is based off the Gregorian calendar and is thus exactly accurate.'
    },

    {
        name: 'GPS',
        id: 'gps',
        type: 'Computing Time',
        epoch: 'January 6th, 1980 CE',
        condfidence: 'Exact',
        description: 'GPS time is the standard by which all GPS satellites and GPS-enabled devices coordinate their positions. It is a simple count of seconds from midnight on January 6th, 1980. When converted into the Gregorian calendar, it drifts ahead by a second every now and then as it does not follow leap seconds found in other timekeeping standards.'
    },

    {
        name: 'TAI',
        id: 'tai',
        type: 'Computing Time',
        epoch: 'January 1st, 1972 CE +10 seconds',
        condfidence: 'Exact',
        description: 'International Atomic Time is the average of several atomic clocks and is based on the passage of time on Earth\'s geoid. It is the basis for UTC but deviates from UTC by several seconds due to TAI not including leap seconds, specifically the number of leap seconds since 1972 plus 10 extra to account for missed leap seconds since 1958.'
    },

    {
        name: 'LORAN-C',
        id: 'loran-c',
        type: 'Computing Time',
        epoch: 'January 1st, 1958 CE',
        condfidence: 'Exact',
        description: 'Long Range Navigational time was the standard used by the US and other jurisdictions prior to the creation of GPS. It deviates from UTC by the number of leap seconds since 1972 and doesn\'t include the 10 extra leap seconds in TAI.'
    },

    {
        name: 'FILETIME',
        id: 'filetime',
        type: 'Computing Time',
        epoch: 'January 1st, 1601 CE',
        condfidence: 'Exact',
        description: 'FILETIME is the timing method found on Windows filesystems. It is a simple count of number of nanoseconds since midnight on January 1st, 1601.'
    },

    {
        name: 'Julian Day Number',
        id: 'julian-day-number',
        type: 'Computing Time',
        epoch: 'Noon, November 24, 4713 BCE',
        condfidence: 'Exact',
        description: 'The Julian Day Number is a simple count of number of days since 12:00 (noon) on November 24, 4713 BCE (or 4714 BCE when not using astronomical dates). The JDN is used by astronomers and programmers to simplify calculations for the passage of time, and many of the calculations in this calendar are based off of the JDN.'
    },

    {
        name: 'Rata Die',
        id: 'rata-die',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        condfidence: 'Exact',
        description: 'Rata Die is similar to the Julian Day Number and is a simple count of number of days in the Gregorian Calendar since January 1st, 1 CE.'
    },

    {
        name: 'Julian Period',
        id: 'julian-period',
        type: 'Computing Time',
        epoch: '4712 BCE',
        condfidence: 'High',
        description: 'The Julian Period is a cycle of 7980 years beginning in the year 4712 BCE (or 4713 BCE when not using astronomical dates). It is used by historians to date events when no calendar date is given or when previous given dates are deemed to be incorrect. Confidence is listed as high due to confusion regarding the exact epoch.'
    },
]

const decimalTimeData = [
    {
        name: 'Revolutionary Time',
        id: 'revolutionary-time',
        type: 'Decimal Time',
        epoch: 'Midnight',
        condfidence: 'Exact',
        description: 'Revolutionary Time is the timekeeping system employed by France during the French Revolution from 1794 to 1800. It divides the day into 10 hours, each hour into 100 minutes, and each minute into 100 seconds. The French would have used Paris Mean Time (GMT + 00:09:21) but this website uses local time.'
    },

    {
        name: '.beat (BMT)',
        id: 'beat-time',
        type: 'Decimal Time',
        epoch: 'Midnight (BMT)',
        condfidence: 'Exact',
        description: '.beat time, also known as Swatch Internet Time, is a timekeeping system developed in 1998 by the Swatch corporation. It divides the day into 1000 equal parts, called .beats, and is set to the BMT timezone (UTC +2).'
    },

    {
        name: 'Hexadecimal',
        id: 'hexadecimal',
        type: 'Decimal Time',
        epoch: 'Midnight',
        condfidence: 'Exact',
        description: 'Hexadecimal time is a simple representation of the current fraction of a day in hexadecimal. Midnight starts at .0000 and the moment just before midnight is .FFFF. The smallest unit of resolution is 675/512 seconds, or about 1.318 seconds.'
    },

    {
        name: 'Binary (16 bit)',
        id: 'binary',
        type: 'Decimal Time',
        epoch: 'Midnight',
        condfidence: 'Exact',
        description: 'Binary time is the binary representation of the day divided into 2^16 (65,536) equal parts, with all 0s being midnight and a 1 followed by 15 zeros being exactly half the day (noon). The smallest unit of resolution is 675/512 seconds, or about 1.318 seconds.'
    },
]

const solarCalendarsData = [
    {
        name: 'Gregorian',
        id: 'gregorian',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1 CE',
        condfidence: 'Exact',
        description: 'The Gregorian Calendar is the calendar used by most of the world. It has 365 days, with an extra leap day every year divisible by 4 unless divisible by 100 and not 400. It was issued by Pope Gregory XIII on October 15th, 1582 and is derived from the Julian Calendar after skipping 10 days between October 5th and 15th and differs via the 4-century leap year rule. This calendar is exactly accurate, however dates before October 15th 1582 are proleptic, and many countries did not adopt it until much later than 1582.'
    },

    {
        name: 'Julian',
        id: 'julian',
        type: 'Solar Calendar',
        epoch: 'January 3rd, 1 CE',
        condfidence: 'High',
        description: 'The Julian Calendar was issued by Julius Caesar in 45 BC after several corrections to the solar date. It features a leap day every 4 years, leading it to drift from the Gregorian calendar by 3 days every 400 years. The Julian calendar was the principal calendar in much of the world, especially Europe, prior to the adoption of the Gregorian calendar. It is exactly accurate in relation to the Gregorian calendar, but dates before 40 BC might not reflect civic dates of the era due to a series of corrections. The date of leap days might not be exactly aligned with the Gregorian calendar here, but they are accurate to the year.'
    },

    {
        name: 'Human Era',
        id: 'human-era',
        type: 'Solar Calendar',
        epoch: 'January 1st, 10000 BCE',
        condfidence: 'Exact',
        description: 'The Human Era, also known as the Holocene Era, is the calendar representation of time since the beginning of the Holocene and the Neolithic Revolution, when humans started living in fixed agricultural settlements. It was proposed by Cesare Emiliani in 1993 CE.'
    },

    {
        name: 'Minguo',
        id: 'minguo',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        condfidence: 'Exact',
        description: 'The Minguo calendar, also known as the Republic of China calendar, is used in Taiwan and its territories. Following the traditional convention of numbering years after the current dynastic era, dates are translated as \'Year of the Republic\' with year 1 being the establishment of the ROC in 1912. For its months and days, it follows the Gregorian calendar and can be calculated by subtracting 1911 from the Gregorian year.'
    },

    {
        name: 'Thai Solar',
        id: 'thai-solar',
        type: 'Solar Calendar',
        epoch: 'January 1st, 543 BCE',
        condfidence: 'High',
        description: 'The Thai Solar calendar is used in Thailand and is 543 years ahead of the Gregorian calendar. It represents the number of years of the current Buddhist Era, the Era of the Shaka Buddha. Year 0 falls on the Gregorian year of 543 BCE.'
    },

    {
        name: 'Juche',
        id: 'juche',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        condfidence: 'Exact',
        description: 'The Juche calendar is used in North Korea. It represents the number of years since the birth year of Kim Il Sung, the founder of the DPRK, and was adopted in 1997. For its months and days it follows the Gregorian calendar and can be calculated by subtracting 1911 from the Gregorian year.'
    },

    {
        name: 'French Republican',
        id: 'french-republican',
        type: 'Solar Calendar',
        epoch: 'September 22nd, 1792 CE',
        condfidence: 'High',
        description: 'The French Republican calendar was used during and after the French Revolution from 1793 to 1805. It was a drastic change to the Gregorian calendar. It featured twelve months of 30 days each, broken into 3 weeks of 10 days. The remaining 5 or 6 days of each solar year were the Sansculottides, to be treated as national holidays before the new year. The new year started on September 22nd or 23rd of the Gregorian calendar, and years were written in Roman numerals.'
    },

    {
        name: 'Era Fascista',
        id: 'era-fascista',
        type: 'Solar Calendar',
        epoch: 'October 22nd, 1922',
        condfidence: 'High',
        description: 'Era Fascista is a simple count of number of years since the start of the Fascist Era in Italy on October 22nd, 1922, starting with Anno I. Taking inspiration from the French Republican calendar, years were written in Roman numerals and it was intended to replace the Gregorian calendar.'
    },
]

const lunisolarCalendarsData = [
    {
        name: 'Sexagenary Year',
        id: 'sexagenary-year',
        type: 'Lunisolar Calendar',
        epoch: '',
        condfidence: 'Low',
        description: ''
    },

    {
        name: 'Chinese Zodiac',
        id: 'chinese-zodiac',
        type: 'Lunisolar Calendar',
        epoch: '',
        condfidence: 'High',
        description: ''
    },

    {
        name: 'Vietnamese Zodiac',
        id: 'vietnamese-zodiac',
        type: 'Lunisolar Calendar',
        epoch: '',
        condfidence: 'High',
        description: ''
    },

    {
        name: 'Dangun',
        id: 'dangun',
        type: 'Lunisolar Calendar',
        epoch: '',
        condfidence: '',
        description: ''
    },

    {
        name: 'Hebrew',
        id: 'hebrew',
        type: 'Lunisolar Calendar',
        epoch: '',
        condfidence: '',
        description: ''
    },
]

const lunarCalendarsData = [
    {
        name: 'Islamic',
        id: 'islamic',
        type: 'Lunar Calendar',
        epoch: '',
        condfidence: '',
        description: ''
    },
]

const astronomicalData = [
    {
        name: 'Last Spring Equinox',
        id: 'last-spring-equinox',
        type: 'Astronomical Data',
        epoch: 'Spring Equinox',
        condfidence: 'High',
        description: 'This is the approximate date and time of the most recent spring equinox.'
    },

    {
        name: 'Next Spring Equinox',
        id: 'next-spring-equinox',
        type: 'Astronomical Data',
        epoch: 'Spring Equinox',
        condfidence: 'High',
        description: 'This is the approximate date and time of the next spring equinox.'
    },
    
    {
        name: 'Last Summer Solstice',
        id: 'last-summer-solstice',
        type: 'Astronomical Data',
        epoch: 'Summer Solstice',
        condfidence: 'High',
        description: 'This is the approximate date and time of the most recent summer solstice.'
    },

    {
        name: 'Next Summer Solstice',
        id: 'next-summer-solstice',
        type: 'Astronomical Data',
        epoch: 'Summer Solstice',
        condfidence: 'High',
        description: 'This is the approximate date and time of the next summer solstice.'
    },

    {
        name: 'Last Autumn Equinox',
        id: 'last-autumn-equinox',
        type: 'Astronomical Data',
        epoch: 'Autumn Equinox',
        condfidence: 'High',
        description: 'This is the approximate date and time of the most recent autumn equinox.'
    },

    {
        name: 'Next Autumn Equinox',
        id: 'next-autumn-equinox',
        type: 'Astronomical Data',
        epoch: 'Autumn Equinox',
        condfidence: 'High',
        description: 'This is the approximate date and time of the next autumn equinox.'
    },

    {
        name: 'Last Winter Solstice',
        id: 'last-winter-solstice',
        type: 'Astronomical Data',
        epoch: 'Winter Solstice',
        condfidence: 'High',
        description: 'This is the approximate date and time of the most recent winter solstice.'
    },

    {
        name: 'Next Winter Solstice',
        id: 'next-winter-solstice',
        type: 'Astronomical Data',
        epoch: 'Winter Solstice',
        condfidence: 'High',
        description: 'This is the approximate date and time of the next winter solstice.'
    },
]