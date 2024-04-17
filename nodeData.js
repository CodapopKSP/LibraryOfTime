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
        description: ''
    },

    {
        name: 'UTC',
        id: 'utc',
        type: 'Standard Time',
        epoch: 'UTC Midnight',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Second',
        id: 'second',
        type: 'Standard Time',
        epoch: 'Every Second',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Minute',
        id: 'minute',
        type: 'Standard Time',
        epoch: 'Every Minute',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Hour',
        id: 'hour',
        type: 'Standard Time',
        epoch: 'Every Hour',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Day',
        id: 'day',
        type: 'Standard Time',
        epoch: 'Every Day',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Month',
        id: 'month',
        type: 'Standard Time',
        epoch: 'Every Month',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Year',
        id: 'year',
        type: 'Standard Time',
        epoch: 'Every Year',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Decade',
        id: 'decade',
        type: 'Standard Time',
        epoch: 'Every Decade',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Century',
        id: 'century',
        type: 'Standard Time',
        epoch: 'Every Century',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Millennium',
        id: 'millennium',
        type: 'Standard Time',
        epoch: 'Every Millennium',
        condfidence: 'Exact',
        description: ''
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
        epoch: '',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'LORAN-C',
        id: 'loran-c',
        type: 'Computing Time',
        epoch: '',
        condfidence: 'Exact',
        description: ''
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
        name: 'Julian Day',
        id: 'julian-day-number',
        type: 'Computing Time',
        epoch: '',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Rata Die',
        id: 'rata-die',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        condfidence: 'Exact',
        description: ''
    },
]

const decimalTimeData = [
    {
        name: 'Revolutionary Time',
        id: 'revolutionary-time',
        type: 'Decimal Time',
        epoch: '',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: '.beat Time (BMT)',
        id: 'beat-time',
        type: 'Decimal Time',
        epoch: '',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Hexadecimal',
        id: 'hexadecimal',
        type: 'Decimal Time',
        epoch: '',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Binary',
        id: 'binary',
        type: 'Decimal Time',
        epoch: '',
        condfidence: 'Exact',
        description: ''
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
        epoch: 'January 1st, 1 CE',
        condfidence: 'Low',
        description: 'The Julian Calendar was issued by Julius Caesar in 45 BC after several corrections to the solar date. It features a leap day every 4 years, leading it to drift from the Gregorian calendar by 3 days every 400 years. The Julian calendar was the principal calendar in much of the world, especially Europe, prior to the adoption of the Gregorian calendar. It is exactly accurate in relation to the Gregorian calendar, but dates before 40 BC might not reflect civic dates of the era due to a series of corrections.'
    },

    {
        name: 'Human Era',
        id: 'human-era',
        type: 'Solar Calendar',
        epoch: 'January 1st, 10000 BCE',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Minguo',
        id: 'minguo',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1911 CE',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'Thai Solar',
        id: 'thai-solar',
        type: 'Solar Calendar',
        epoch: 'January 1st, 542 BCE',
        condfidence: 'High',
        description: '543 years ahead of Gregorian'
    },

    {
        name: 'Juche',
        id: 'juche',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1911 CE',
        condfidence: 'Exact',
        description: ''
    },

    {
        name: 'French Republican',
        id: 'french-republican',
        type: 'Solar Calendar',
        epoch: '',
        condfidence: 'High',
        description: ''
    },

    {
        name: 'Era Fascista',
        id: 'era-fascista',
        type: 'Solar Calendar',
        epoch: '',
        condfidence: 'High',
        description: ''
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