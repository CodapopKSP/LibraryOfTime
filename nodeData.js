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

const gregorian = {
    name: 'Gregorian',
    type: 'Solar Calendar',
    epoch: 'January 1st, 1 AD',
    condfidence: 'Exact',
    description: 'The Gregorian Calendar is the calendar used by most of the world. It has 365 days, with an extra leap day every year divisible by 4 unless divisible by 100 and not 400. It was issued by Pope Gregory XIII on October 15th, 1582 and is derived from the Julian Calendar after skipping 10 days between October 5th and 15th and differs via the 4-century leap year rule. This calendar is exactly accurate, however dates before October 15th 1582 are proleptic, and many countries did not adopt it until much later than 1582.'
}

const julian = {
    name: 'Julian',
    type: 'Solar Calendar',
    epoch: 'January 1st, 1 AD',
    condfidence: 'Low',
    description: 'The Julian Calendar was issued by Julius Caesar in 45 BC after several corrections to the solar date. It features a leap day every 4 years, leading it to drift from the Gregorian calendar by 3 days every 400 years. The Julian calendar was the principal calendar in much of the world, especially Europe, prior to the adoption of the Gregorian calendar. It is exactly accurate in relation to the Gregorian calendar, but dates before 40 BC might not reflect civic dates of the era due to a series of corrections.'
}

const unix = {
    name: 'Unix',
    type: 'time',
    epoch: 'January 1st, 1970',
    condfidence: 'Exact',
    description: 'Unix is the most widespread timing system in computing and on the internet. It is a simple count of number of seconds since midnight on January 1st, 1970. Many of the calculations on this website are derived from Unix timestamps. It is exactly accurate.'
}

const filetime = {
    name: 'FILETIME',
    type: 'time',
    epoch: 'January 1st, 1601 AD',
    condfidence: 'Exact',
    description: 'FILETIME is the timing method found on Windows filesystems. It is a simple count of number of nanoseconds since midnight on January 1st, 1601.'
}

const iso8601 = {
    name: 'ISO 8601',
    type: 'time',
    epoch: 'January 1st, 1 AD',
    condfidence: 'Exact',
    description: 'ISO 8601 is the standard of displaying date and time provided by the International Organization for Standardization. It is based off the Gregorian calendar and is thus exactly accurate.'
}

const gps = {
    name: 'GPS',
    type: 'time',
    epoch: 'January 6th, 1980 AD',
    condfidence: 'Exact',
    description: 'GPS time is the standard by which all GPS satellites and GPS-enabled devices coordinate their positions. It is a simple count of seconds from midnight on January 6th, 1980. When converted into the Gregorian calendar, it drifts ahead by a second every now and then as it does not follow leap seconds found in other timekeeping standards.'
}

window.gregorian = gregorian;
window.julian = julian;
window.unix = unix;
window.filetime = filetime;
window.iso8601 = iso8601;
window.gps = gps;
