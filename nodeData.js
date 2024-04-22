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
        confidence: 'Exact',
        description: 'This is the current local time based on the timezone provided by your device.'
    },

    {
        name: 'UTC',
        id: 'utc',
        type: 'Standard Time',
        epoch: 'UTC Midnight',
        confidence: 'Exact',
        description: 'This is the current UTC time regardless of location.'
    },

    {
        name: 'Second',
        id: 'second',
        type: 'Standard Time',
        epoch: 'Every Second',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current second.'
    },

    {
        name: 'Minute',
        id: 'minute',
        type: 'Standard Time',
        epoch: 'Every Minute',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current minute.'
    },

    {
        name: 'Hour',
        id: 'hour',
        type: 'Standard Time',
        epoch: 'Every Hour',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current hour.'
    },

    {
        name: 'Day',
        id: 'day',
        type: 'Standard Time',
        epoch: 'Every Day',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current day.'
    },

    {
        name: 'Month',
        id: 'month',
        type: 'Standard Time',
        epoch: 'Every Month',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current month.'
    },

    {
        name: 'Year',
        id: 'year',
        type: 'Standard Time',
        epoch: 'Every Year',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current year.'
    },

    {
        name: 'Decade',
        id: 'decade',
        type: 'Standard Time',
        epoch: 'Every Decade',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current decade.'
    },

    {
        name: 'Century',
        id: 'century',
        type: 'Standard Time',
        epoch: 'Every Century',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current century.'
    },

    {
        name: 'Millennium',
        id: 'millennium',
        type: 'Standard Time',
        epoch: 'Every Millennium',
        confidence: 'Exact',
        description: 'This is the fraction of time passed in the current millennium.'
    },
]

const computingTimeData = [
    {
        name: 'Unix',
        id: 'unix',
        type: 'Computing Time',
        epoch: 'January 1st, 1970 CE',
        confidence: 'Exact',
        description: 'Unix is the most widespread timing system in computing and on the internet. It is a simple count of number of seconds since midnight on January 1st, 1970. Many of the calculations on this website are derived from Unix timestamps. It is exactly accurate.'
    },

    {
        name: 'GPS',
        id: 'gps',
        type: 'Computing Time',
        epoch: 'January 6th, 1980 CE',
        confidence: 'Exact',
        description: 'GPS time is the standard by which all GPS satellites and GPS-enabled devices coordinate their positions. It is a simple count of seconds from midnight on January 6th, 1980. When converted into the Gregorian calendar, it drifts ahead by a second every now and then as it does not follow leap seconds found in other timekeeping standards.'
    },

    {
        name: 'TAI',
        id: 'tai',
        type: 'Computing Time',
        epoch: 'January 1st, 1972 CE +10 seconds',
        confidence: 'Exact',
        description: 'International Atomic Time is the average of several atomic clocks and is based on the passage of time on Earth\'s geoid. It is the basis for UTC but deviates from UTC by several seconds due to TAI not including leap seconds, specifically the number of leap seconds since 1972 plus 10 extra to account for missed leap seconds since 1958.'
    },

    {
        name: 'LORAN-C',
        id: 'loran-c',
        type: 'Computing Time',
        epoch: 'January 1st, 1958 CE',
        confidence: 'Exact',
        description: 'Long Range Navigational time was the standard used by the US and other jurisdictions prior to the creation of GPS. It deviates from UTC by the number of leap seconds since 1972 and doesn\'t include the 10 extra leap seconds in TAI.'
    },

    {
        name: 'FILETIME',
        id: 'filetime',
        type: 'Computing Time',
        epoch: 'January 1st, 1601 CE',
        confidence: 'Exact',
        description: 'FILETIME is the timing method found on Windows filesystems. It is a simple count of number of nanoseconds since midnight on January 1st, 1601.'
    },

    {
        name: 'Julian Day Number',
        id: 'julian-day-number',
        type: 'Computing Time',
        epoch: 'Noon, November 24, 4713 BCE',
        confidence: 'Exact',
        description: 'The Julian Day Number is a simple count of number of days since 12:00 (noon) on November 24, 4713 BCE (or 4714 BCE when not using astronomical dates). The JDN is used by astronomers and programmers to simplify calculations for the passage of time, and many of the calculations in this calendar are based off of the JDN.'
    },

    {
        name: 'Rata Die',
        id: 'rata-die',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        description: 'Rata Die is similar to the Julian Day Number and is a simple count of number of days in the Gregorian Calendar since January 1st, 1 CE.'
    },

    {
        name: 'Julian Period',
        id: 'julian-period',
        type: 'Computing Time',
        epoch: '4712 BCE',
        confidence: 'High',
        description: 'The Julian Period is a cycle of 7980 years beginning in the year 4712 BCE (or 4713 BCE when not using astronomical dates). It is used by historians to date events when no calendar date is given or when previous given dates are deemed to be incorrect. Confidence is listed as high due to confusion regarding the exact epoch.'
    },

    {
        name: 'ISO 8601',
        id: 'iso8601',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        description: 'ISO 8601 is the standard of displaying date and time provided by the International Organization for Standardization. It is based off the Gregorian calendar and is thus exactly accurate.'
    },

    {
        name: 'Dynamical Time',
        id: 'dynamical-time',
        type: 'Computing Time',
        epoch: '',
        confidence: 'Medium',
        description: 'Dynamical Time is an approximation of the difference in time due to various factors that affect Earth\'s orbit, such as gravitational effects from other planets. It matches UTC at around the year 1880 and deviates the further away in time as a parabolic equation, with an uncertainty as much as two hours by the year 4000 BCE. This calculation was sourced from Astronomical Algorithms (1991) by Jean Meeus.'
    },
]

const decimalTimeData = [
    {
        name: 'Revolutionary Time',
        id: 'revolutionary-time',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        description: 'Revolutionary Time is the timekeeping system employed by France during the French Revolution from 1794 to 1800. It divides the day into 10 hours, each hour into 100 minutes, and each minute into 100 seconds. The French would have used Paris Mean Time (GMT + 00:09:21) but this website uses local time.'
    },

    {
        name: '.beat (BMT)',
        id: 'beat-time',
        type: 'Decimal Time',
        epoch: 'Midnight (BMT)',
        confidence: 'Exact',
        description: '.beat time, also known as Swatch Internet Time, is a timekeeping system developed in 1998 by the Swatch corporation. It divides the day into 1000 equal parts, called .beats, and is set to the BMT timezone (UTC +2).'
    },

    {
        name: 'Hexadecimal',
        id: 'hexadecimal',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        description: 'Hexadecimal time is a simple representation of the current fraction of a day in hexadecimal. Midnight starts at .0000 and the moment just before midnight is .FFFF. The smallest unit of resolution is 675/512 seconds, or about 1.318 seconds.'
    },

    {
        name: 'Binary (16 bit)',
        id: 'binary',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        description: 'Binary time is the binary representation of the day divided into 2^16 (65,536) equal parts, with all 0s being midnight and a 1 followed by 15 zeros being exactly half the day (noon). The smallest unit of resolution is 675/512 seconds, or about 1.318 seconds.'
    },
]

const solarCalendarsData = [
    {
        name: 'Gregorian',
        id: 'gregorian',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        description: 'The Gregorian Calendar is the calendar used by most of the world. It has 365 days, with an extra leap day every year divisible by 4 unless divisible by 100 and not 400. It was issued by Pope Gregory XIII on October 15th, 1582 and is derived from the Julian Calendar after skipping 10 days between October 5th and 15th and differs via the 4-century leap year rule. This calendar is exactly accurate, however dates before October 15th 1582 are proleptic, and many countries did not adopt it until much later than 1582.'
    },

    {
        name: 'Julian',
        id: 'julian',
        type: 'Solar Calendar',
        epoch: 'January 3rd, 1 CE',
        confidence: 'High',
        description: 'The Julian Calendar was issued by Julius Caesar in 45 BC after several corrections to the solar date. It features a leap day every 4 years, leading it to drift from the Gregorian calendar by 3 days every 400 years. The Julian calendar was the principal calendar in much of the world, especially Europe, prior to the adoption of the Gregorian calendar. It is exactly accurate in relation to the Gregorian calendar, but dates before 40 BC might not reflect civic dates of the era due to a series of corrections. The date of leap days might not be exactly aligned with the Gregorian calendar here, but they are accurate to the year.'
    },

    {
        name: 'Human Era',
        id: 'human-era',
        type: 'Solar Calendar',
        epoch: 'January 1st, 10000 BCE',
        confidence: 'Exact',
        description: 'The Human Era, also known as the Holocene Era, is the calendar representation of time since the beginning of the Holocene and the Neolithic Revolution, when humans started living in fixed agricultural settlements. It was proposed by Cesare Emiliani in 1993 CE.'
    },

    {
        name: 'French Republican',
        id: 'french-republican',
        type: 'Solar Calendar',
        epoch: 'September 22nd, 1792 CE',
        confidence: 'High',
        description: `The French Republican calendar was used during and after the French Revolution from 1793 to 1805 and was a drastic change to the Gregorian calendar. It featured twelve months of 30 days each, broken into 3 weeks of 10 days. The remaining 5 or 6 days of each solar year were the Sansculottides, to be treated as national holidays at the end of the year. The new year started on September 22nd or 23rd of the Gregorian calendar, and years were written in Roman numerals.\n\nMonths:\n  Vendémiaire\n  Brumaire\n  Frimaire\n  Nivôse\n  Pluviôse\n  Ventôse\n  Germinal\n  Floréal\n  Prairial\n  Messidor\n  Thermidor\n  Fructidor\n  Sansculottides`
    },

    {
        name: 'Era Fascista',
        id: 'era-fascista',
        type: 'Solar Calendar',
        epoch: 'October 22nd, 1922',
        confidence: 'High',
        description: 'Era Fascista is a simple count of number of years since the start of the Fascist Era in Italy on October 22nd, 1922, starting with Anno I. Taking inspiration from the French Republican calendar, years were written in Roman numerals and it was intended to replace the Gregorian calendar.'
    },

    {
        name: 'Minguo',
        id: 'minguo',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        confidence: 'Exact',
        description: 'The Minguo calendar, also known as the Republic of China calendar, is used in Taiwan and its territories. Following the traditional convention of numbering years after the current dynastic era, dates are translated as \'Year of the Republic\' with year 1 being the establishment of the ROC in 1912. For its months and days, it follows the Gregorian calendar and can be calculated by subtracting 1911 from the Gregorian year.'
    },

    {
        name: 'Thai Solar',
        id: 'thai-solar',
        type: 'Solar Calendar',
        epoch: 'January 1st, 543 BCE',
        confidence: 'High',
        description: 'The Thai Solar calendar is used in Thailand and is 543 years ahead of the Gregorian calendar. It represents the number of years of the current Buddhist Era (B.E.), the Era of the Shaka Buddha. Year 0 falls on the Gregorian year of 543 BCE.'
    },

    {
        name: 'Juche',
        id: 'juche',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        confidence: 'Exact',
        description: 'The Juche calendar is used in North Korea. It represents the number of years since the birth year of Kim Il Sung, the founder of the DPRK, and was adopted in 1997. For its months and days it follows the Gregorian calendar and can be calculated by subtracting 1911 from the Gregorian year.'
    },
]

const lunisolarCalendarsData = [
    {
        name: 'Sexagenary Year',
        id: 'sexagenary-year',
        type: 'Lunisolar Calendar',
        epoch: '',
        confidence: 'Medium',
        description: ''
    },

    {
        name: 'Chinese Zodiac',
        id: 'chinese-zodiac',
        type: 'Lunisolar Calendar',
        epoch: '',
        confidence: 'Medium',
        description: ''
    },

    {
        name: 'Vietnamese Zodiac',
        id: 'vietnamese-zodiac',
        type: 'Lunisolar Calendar',
        epoch: '',
        confidence: 'Medium',
        description: ''
    },

    {
        name: 'Dangun',
        id: 'dangun',
        type: 'Lunisolar Calendar',
        epoch: '',
        confidence: '',
        description: ''
    },

    {
        name: 'Hebrew',
        id: 'hebrew',
        type: 'Lunisolar Calendar',
        epoch: '',
        confidence: '',
        description: ''
    },
]

const lunarCalendarsData = [
    {
        name: 'Hijri (AST)',
        id: 'hijri',
        type: 'Lunar Calendar',
        epoch: 'July 19, 622 CE',
        confidence: 'Medium',
        description: 'The Hijri calendar is the principal calendar used in Islam, and it is perhaps the only extant true lunar calendar in the world. It features 12 lunar months of 29 or 30 days, with days starting at sunset, for a total of 355 or 356 days per year, causing it to be out of sync with solar calendars. Each month starts shortly after the New Moon when it begins to appear as a crescent. Many Muslim nations have their own rules for determining the start of the month, often based on direct observation, and as such their calendar dates may occasionally misalign for a month or two. The algorithm used by this website requires calculating the New Moon and uses 18:00 local time in Mecca for sunset. Its accuracy is dependent on the New Moon calculations and may not reflect historical records.\n\nMonths:\n  al-Muḥarram\n  Ṣafar\n  Rabīʿ al-ʾAwwal\n  Rabīʿ ath-Thānī\n  Jumādā al-ʾŪlā\n  Jumādā al-ʾĀkhirah\n  Rajab\n  Shaʿbān\n  Ramaḍān\n  Shawwāl\n  Dhū al-Qaʿdah\n  Dhū al-Ḥijjah'
    },
]

const astronomicalData = [
    {
        name: 'Spring Equinox',
        id: 'spring-equinox',
        type: 'Astronomical Data',
        epoch: 'Spring Equinox',
        confidence: 'High',
        description: 'This is the approximate date and time of this year\'s spring equinox. This calculation was sourced from Astronomical Algorithms (1991) by Jean Meeus.'
    },
    
    {
        name: 'Summer Solstice',
        id: 'summer-solstice',
        type: 'Astronomical Data',
        epoch: 'Summer Solstice',
        confidence: 'High',
        description: 'This is the approximate date and time of this year\'s summer solstice. This calculation was sourced from Astronomical Algorithms (1991) by Jean Meeus.'
    },

    {
        name: 'Autumn Equinox',
        id: 'autumn-equinox',
        type: 'Astronomical Data',
        epoch: 'Autumn Equinox',
        confidence: 'High',
        description: 'This is the approximate date and time of this year\'s autumn equinox. This calculation was sourced from Astronomical Algorithms (1991) by Jean Meeus.'
    },

    {
        name: 'Winter Solstice',
        id: 'winter-solstice',
        type: 'Astronomical Data',
        epoch: 'Winter Solstice',
        confidence: 'High',
        description: 'This is the approximate date and time of this year\'s winter solstice. This calculation was sourced from Astronomical Algorithms (1991) by Jean Meeus.'
    },

    {
        name: 'Longitude of the Sun',
        id: 'sun-longitude',
        type: 'Astronomical Data',
        epoch: 'Spring Equinox',
        confidence: 'High',
        description: 'This is the approximate longitude of the sun, the distance in degrees the Earth has traveled since the last Spring Equinox. This calculation was sourced from Astronomical Algorithms (1991) by Jean Meeus.'
    },

    {
        name: 'This Month\'s New Moon',
        id: 'this-new-moon',
        type: 'Astronomical Data',
        epoch: 'New Moon',
        confidence: 'High',
        description: 'This is the approximate time of the New Moon, also known as a Lunar Conjunction, of the current month. This calculation was sourced from Astronomical Algorithms (1991) by Jean Meeus.'
    },
]