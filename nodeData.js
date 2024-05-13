//|-------------------|
//|     Node Data     |
//|-------------------|

/*
Node Data is a collection of data for each node.
    name:           The name of the node.
    type:           The type of calendar/time.
    epoch:          The starting epoch of the calendar/time.
    confidence:     A measure of how confident I am in the node's accuracy.
    overview:    The text that appears on hover.
*/

const standardTimeData = [
    {
        name: 'Local Time',
        id: 'local-time',
        type: 'Standard Time',
        epoch: 'Local Midnight',
        confidence: 'Exact',
        overview: 'This is the current local time based on the timezone provided by your device.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'UTC',
        id: 'utc',
        type: 'Standard Time',
        epoch: 'UTC Midnight',
        confidence: 'Exact',
        overview: 'This is the current UTC time regardless of location.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Second',
        id: 'second',
        type: 'Standard Time',
        epoch: 'Every Second',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current second.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Minute',
        id: 'minute',
        type: 'Standard Time',
        epoch: 'Every Minute',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current minute.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Hour',
        id: 'hour',
        type: 'Standard Time',
        epoch: 'Every Hour',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current hour.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Day',
        id: 'day',
        type: 'Standard Time',
        epoch: 'Every Day',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current day.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Month',
        id: 'month',
        type: 'Standard Time',
        epoch: 'Every Month',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current month.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Year',
        id: 'year',
        type: 'Standard Time',
        epoch: 'Every Year',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current year.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Decade',
        id: 'decade',
        type: 'Standard Time',
        epoch: 'Every Decade',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current decade.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Century',
        id: 'century',
        type: 'Standard Time',
        epoch: 'Every Century',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current century.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Millennium',
        id: 'millennium',
        type: 'Standard Time',
        epoch: 'Every Millennium',
        confidence: 'Exact',
        overview: 'This is the fraction of time passed in the current millennium.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },
]

const computingTimeData = [
    {
        name: 'Unix',
        id: 'unix',
        type: 'Computing Time',
        epoch: 'January 1st, 1970 CE',
        confidence: 'Exact',
        overview: 'Unix is the most widespread timing system in computing and on the internet. It is a simple count of number of seconds since midnight on January 1st, 1970. Many of the calculations on this website are derived from Unix timestamps. It is exactly accurate.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'GPS',
        id: 'gps',
        type: 'Computing Time',
        epoch: 'January 6th, 1980 CE',
        confidence: 'Exact',
        overview: 'GPS time is the standard by which all GPS satellites and GPS-enabled devices coordinate their positions. It is a simple count of seconds from midnight on January 6th, 1980. When converted into the Gregorian calendar, it drifts ahead by a second every now and then as it does not follow leap seconds found in other timekeeping standards.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'TAI',
        id: 'tai',
        type: 'Computing Time',
        epoch: 'January 1st, 1972 CE +10 seconds',
        confidence: 'Exact',
        overview: 'International Atomic Time is the average of several atomic clocks and is based on the passage of time on Earth\'s geoid. It is the basis for UTC but deviates from UTC by several seconds due to TAI not including leap seconds, specifically the number of leap seconds since 1972 plus 10 extra to account for missed leap seconds since 1958.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'LORAN-C',
        id: 'loran-c',
        type: 'Computing Time',
        epoch: 'January 1st, 1958 CE',
        confidence: 'Exact',
        overview: 'Long Range Navigational time was the standard used by the US and other jurisdictions prior to the creation of GPS. It deviates from UTC by the number of leap seconds since 1972 and doesn\'t include the 10 extra leap seconds in TAI.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'FILETIME',
        id: 'filetime',
        type: 'Computing Time',
        epoch: 'January 1st, 1601 CE',
        confidence: 'Exact',
        overview: 'FILETIME is the timing method found on Windows filesystems. It is a simple count of number of nanoseconds since midnight on January 1st, 1601.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Julian Day Number',
        id: 'julian-day-number',
        type: 'Computing Time',
        epoch: 'Noon, November 24, 4713 BCE',
        confidence: 'Exact',
        overview: 'The Julian Day Number is a simple count of number of days since 12:00 (noon) on November 24, 4713 BCE (or 4714 BCE when not using astronomical dates). The JDN is used by astronomers and programmers to simplify calculations for the passage of time, and many of the calculations in this calendar are based off of the JDN.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Rata Die',
        id: 'rata-die',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        overview: 'Rata Die is similar to the Julian Day Number and is a simple count of number of days in the Gregorian Calendar since January 1st, 1 CE.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Julian Period',
        id: 'julian-period',
        type: 'Computing Time',
        epoch: '4712 BCE',
        confidence: 'High',
        overview: 'The Julian Period is a cycle of 7980 years beginning in the year 4712 BCE (or 4713 BCE when not using astronomical dates). It is used by historians to date events when no calendar date is given or when previous given dates are deemed to be incorrect. Confidence is listed as high due to confusion regarding the exact epoch.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Lilian Date',
        id: 'lilian-date',
        type: 'Computing Time',
        epoch: 'October 15th, 1582 CE',
        confidence: 'Exact',
        overview: 'Lilian Date is a timekeeping standard similar to the Julian Day. It was invented by Bruce G. Ohms to be used with IBM systems and is named after Aloysius Lilius, the creator of the Gregorian calendar. It is a simple count of number of days since the beginning of the Gregorian calendar on October 15th, 1582 CE, which is Lilian 1.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'ISO 8601',
        id: 'iso8601',
        type: 'Computing Time',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        overview: 'ISO 8601 is the standard of displaying date and time provided by the International Organization for Standardization. It is based off the Gregorian calendar and is thus exactly accurate.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Dynamical Time',
        id: 'dynamical-time',
        type: 'Computing Time',
        epoch: 'Undefined',
        confidence: 'Medium',
        overview: 'Dynamical Time is an approximation of the difference in time due to various factors that affect Earth\'s orbit, such as gravitational effects from other planets. It matches UTC at around the year 1880 and deviates the further away in time as a parabolic equation, with an uncertainty as much as two hours by the year 4000 BCE. This calculation was sourced from Astronomical Algorithms (1991) by Jean Meeus.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },
]

const decimalTimeData = [
    {
        name: 'Revolutionary Time',
        id: 'revolutionary-time',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        overview: 'Revolutionary Time is the timekeeping system employed by France during the French Revolution from 1794 to 1800. It divides the day into 10 hours, each hour into 100 minutes, and each minute into 100 seconds. The French would have used Paris Mean Time (GMT + 00:09:21) but this website uses local time.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: '.beat (BMT)',
        id: 'beat-time',
        type: 'Decimal Time',
        epoch: 'Midnight (BMT)',
        confidence: 'Exact',
        overview: '.beat time, also known as Swatch Internet Time, is a timekeeping system developed in 1998 by the Swatch corporation. It divides the day into 1000 equal parts, called .beats, and is set to the BMT timezone (UTC +2).',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Hexadecimal',
        id: 'hexadecimal',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        overview: 'Hexadecimal time is a simple representation of the current fraction of a day in hexadecimal. Midnight starts at .0000 and the moment just before midnight is .FFFF. The smallest unit of resolution is 675/512 seconds, or about 1.318 seconds.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Binary (16 bit)',
        id: 'binary',
        type: 'Decimal Time',
        epoch: 'Midnight',
        confidence: 'Exact',
        overview: 'Binary time is the binary representation of the day divided into 2^16 (65,536) equal parts, with all 0s being midnight and a 1 followed by 15 zeros being exactly half the day (noon). The smallest unit of resolution is 675/512 seconds, or about 1.318 seconds.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },
]

const solarCalendarsData = [
    {
        name: 'Gregorian',
        id: 'gregorian',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        overview: 'The Gregorian Calendar is the calendar used by most of the world. It has 365 days, with an extra leap day every year divisible by 4 unless divisible by 100, except for years also divisible by 400. The era is denoted \'CE\' meaning \'Common Era\' and \'BCE\' meaning \'Before Common Era\'.\n\nIt was issued by Pope Gregory XIII on October 15th, 1582 and is derived from the Julian Calendar after skipping 10 days between October 5th and 15th and differs via the 4-century leap year rule. This calendar is exactly accurate, however dates before October 15th 1582 are proleptic, and many countries did not adopt it until much later than 1582.',
        info: 'Months:\n  January\n  February\n  March\n  April\n  May\n  June\n  July\n  August\n  September\n  October\n  November\n  December',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Julian',
        id: 'julian',
        type: 'Solar Calendar',
        epoch: 'January 3rd, 1 CE',
        confidence: 'High',
        overview: 'The Julian Calendar was issued by Julius Caesar in 45 BC after several corrections to the solar date. It features a leap day every 4 years, leading it to drift from the Gregorian calendar by 3 days every 400 years. Years are denoted \'AD\' or \'Anno Domini\', meaning \'in the year of the Lord\', as well as \'BC\' meaning \'Before Christ\'.\n\nThe Julian calendar was the principal calendar in much of the world, especially Europe, prior to the adoption of the Gregorian calendar. It is exactly accurate in relation to the Gregorian calendar, but dates before 40 BC might not reflect civic dates of the era due to a series of corrections. The date of leap days might not be exactly aligned with the Gregorian calendar here, but they are accurate to the year.',
        info: 'Months:\n  January\n  February\n  March\n  April\n  May\n  June\n  July\n  August\n  September\n  October\n  November\n  December',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'French Republican',
        id: 'french-republican',
        type: 'Solar Calendar',
        epoch: 'September 22nd, 1792 CE',
        confidence: 'High',
        overview: `The French Republican calendar was used during and after the French Revolution from 1793 to 1805 and was a drastic change to the Gregorian calendar. It featured twelve months of 30 days each, broken into 3 weeks of 10 days. The remaining 5 or 6 days of each solar year were the Sansculottides, to be treated as national holidays at the end of the year. The new year started on September 22nd or 23rd of the Gregorian calendar, and years were written in Roman numerals with the era name of \'l\'ère républicaine\', or \'Republican Era\', abbreviated here as \'RE\'.`,
        info: 'Months:\n  Vendémiaire\n  Brumaire\n  Frimaire\n  Nivôse\n  Pluviôse\n  Ventôse\n  Germinal\n  Floréal\n  Prairial\n  Messidor\n  Thermidor\n  Fructidor\n  Sansculottides',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Era Fascista',
        id: 'era-fascista',
        type: 'Solar Calendar',
        epoch: 'October 22nd, 1922 CE',
        confidence: 'High',
        overview: 'Era Fascista is a simple count of number of years since the start of the Fascist Era in Italy on October 22nd, 1922, starting with Anno I. Taking inspiration from the French Republican calendar, years were written in Roman numerals and it was intended to replace the Gregorian calendar.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Coptic (UTC)',
        id: 'coptic',
        type: 'Solar Calendar',
        epoch: 'August 29th, 284 CE',
        confidence: 'High',
        overview: 'The Coptic calendar, also known as the Alexandrian calendar, was used in Egypt until the adoption of the Gregorian calendar in 1875. It is based on the ancient Egyptian calendar but with leap days every four years, keeping it in sync with the Julian calendar while sharing months and days with the Ge\'ez calendar. It has 12 months of 30 days plus a smaller 13th month of 5 or 6 days. The new year starts on the 11th or 12th of September, and years are abbreviated with \'AM\', meaning Anno Martyrum, or \'Year of the Martyrs\'. The Coptic calendar is still in use today by Egyptian farmers as well as the Coptic Orthodox Church.',
        info: 'Months:\n  Thout\n  Paopi\n  Hathor\n  Koiak\n  Tobi\n  Meshir\n  Paremhat\n  Parmouti\n  Pashons\n  Paoni\n  Epip\n  Mesori\n  Pi Kogi Enavot',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Ge\'ez (UTC)',
        id: 'ethiopian',
        type: 'Solar Calendar',
        epoch: 'August 27th, 8 CE',
        confidence: 'High',
        overview: 'The Ge\'ez calendar is the official calendar of Ethiopia. It has 12 months of 30 days plus a smaller 13th month of 5 or 6 days. It has a leap day every 4 years, keeping it in sync with the Julian calendar while sharing months and days with the Coptic calendar. The New Year starts on September 11th or 12th, with years abbreviated with ዓ.ም. which is pronounced \'am\', short for Amätä Mihret, meaning \'Year of Mercy\'.',
        info: 'Months:\n  Mäskäräm\n  Ṭəqəmt\n  Ḫədar\n  Taḫśaś\n  Ṭərr\n  Yäkatit\n  Mägabit\n  Miyazya\n  Gənbo\n  Säne\n  Ḥamle\n  Nähase\n  Ṗagume',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Minguo',
        id: 'minguo',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        confidence: 'Exact',
        overview: 'The Minguo calendar, also known as the Republic of China calendar, is used in Taiwan and its territories. Following the traditional convention of numbering years after the current dynastic era, dates are counted in 民國 ("MinGuo"), translated as \'Year of the Republic\' with year 1 being the establishment of the ROC in 1912, while its numerical months (月 "yue") and days (日 "ri") follow the Gregorian calendar.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Thai Solar',
        id: 'thai-solar',
        type: 'Solar Calendar',
        epoch: 'January 1st, 543 BCE',
        confidence: 'High',
        overview: 'The Thai Solar calendar is used in Thailand and is 543 years ahead of the Gregorian calendar, though it shares the same months with different names. It represents the number of years of the current Buddhist Era (B.E.), the Era of the Shaka Buddha. Year 0 falls on the Gregorian year of 543 BCE.',
        info: 'Months:\n  มกราคม\n  กุมภาพันธ์\n  มีนาคม\n  เมษายน\n  พฤษภาคม\n  มิถุนายน\n  กรกฎาคม\n  สิงหาคม\n  กันยายน\n  ตุลาคม\n  พฤศจิกายน\n  ธันวาคม',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Juche',
        id: 'juche',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        confidence: 'Exact',
        overview: 'The Juche calendar is used in North Korea. It represents the number of years since the birth year of Kim Il Sung, the founder of the DPRK, and was adopted in 1997. For its months and days it follows the Gregorian calendar.',
        info: 'calendar info',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Byzantine',
        id: 'byzantine',
        type: 'Solar Calendar',
        epoch: 'July 19th, 5508 BCE',
        confidence: 'Exact',
        overview: 'The Byzantine calendar was the official calendar of the Byzantine Empire from 988 to 1453 and was used in Ukraine and Russia until 1700. It followed the Julian calendar but differed by the new year starting on September 1st and the epoch being September 1st, 5509 BC (July 19th, 5508 BCE in the proleptic Gregorian calendar). Years are counted in AM, or \'Anno Mundi\' meaning \'Year After Creation\'.',
        info: 'Months:\n  September\n  October\n  November\n  December\n  January\n  February\n  March\n  April\n  May\n  June\n  July\n  August',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Florentine (CET)',
        id: 'florentine',
        type: 'Solar Calendar',
        epoch: 'March 21st, 0 BCE',
        confidence: 'Exact',
        overview: 'The Florentine calendar was the calendar used in the Republic of Florence during the Middle Ages. It followed the Julian calendar for its years, months, and days with a few key differences: the new year started on March 25th, meaning January 1st of a given year was immediately after December 31st of the same year, and March 24th of that year was followed by March 25th of the next year. Days also started at sunset, which is displayed here as 6:00pm in Florence.',
        info: 'Months:\n  March\n  April\n  May\n  June\n  July\n  August\n  September\n  October\n  November\n  December\n  January\n  February\n  March',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
    },

    {
        name: 'Baháʼí (IRST)',
        id: 'bahai',
        type: 'Solar Calendar',
        epoch: 'March 3rd, 1844 CE',
        confidence: 'High',
        overview: 'The Baháʼí calendar is the calendar of the Baháʼí Faith. It is a pure solar calendar, as it begins its New Year on the day of the Spring Equinox, preventing it from drifting from the tropical year and causing it to very slowly drift from the Gregorian calendar. It features 19 months (or sometimes referred to as weeks) of 19 days, for a total of 361 days. The remaining 4 or 5 days of each year are called Ayyám-i-Há and take place between the final two months, Mulk and ‘Alá’, typically at the end of February. Days start at sunset in Tehran, which is approximated here as 18:00 IRST. Years are denoted with \'BE\', meaning Baháʼí Era. The accuracy of this calendar depends on the equinox calculations and may be off by a day for a whole year but is likely to self-correct. The equation breaks down considerably if rolled back or forward several thousand years as the equinox drifts due to precession.',
        info: 'Months:\n  Bahá\n  Jalál\n  Jamál\n  ‘Aẓamat\n  Núr\n  Raḥmat\n  Kalimát\n  Kamál\n  Asmá’\n  ‘Izzat\n  Mashíyyat\n  ‘Ilm\n  Qudrat\n  Qawl\n  Masá’il\n  Sharaf\n  Sulṭán\n  Mulk\n  Ayyám-i-Há\n  ‘Alá’',
        accuracy: 'calendar accuracy',
        source: 'calendar source'
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
        overview: `The Hijri calendar is the principal calendar used in Islam, and it is perhaps the only extant true lunar calendar in the world. It features 12 lunar months of 29 or 30 days, with days starting at sunset, for a total of 355 or 356 days per year, causing it to be out of sync with solar calendars.\n\nEra dates are denoted \'AH\' from \'Anno Hegirae\', meaning \'In the year of the Hijrah\'. Each month starts shortly after the New Moon when it begins to appear as a crescent.\n\nThe desert culture of Islam is apparent in this calendar, as such a civilization is less affected by seasonal changes than civilizations in most other biomes. Thus, they would have had no need to implement an intercalary month system to synchronize the calendar with the solar year.`,
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
        source: 'Much of the information on the Mayan Long Count calendar can be found at its <a href="https://en.wikipedia.org/wiki/Mesoamerican_Long_Count_calendar">Wikipedia article</a>.\n\nThe <a href="https://maya.nmai.si.edu/calendar/maya-calendar-converter">Smithsonian website</a> has the current day as well as a converter.'
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

const politics = [
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