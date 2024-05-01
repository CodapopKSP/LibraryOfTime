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
        name: 'Lilian Date',
        id: 'lilian-date',
        type: 'Computing Time',
        epoch: 'October 15th, 1582 CE',
        confidence: 'Exact',
        description: 'Lilian Date is a timekeeping standard similar to the Julian Day. It was invented by Bruce G. Ohms to be used with IBM systems and is named after Aloysius Lilius, the creator of the Gregorian calendar. It is a simple count of number of days since the beginning of the Gregorian calendar on October 15th, 1582 CE, which is Lilian 1.'
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
        epoch: 'Undefined',
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
        description: 'The Gregorian Calendar is the calendar used by most of the world. It has 365 days, with an extra leap day every year divisible by 4 unless divisible by 100, except for years also divisible by 400. The era is denoted \'CE\' meaning \'Common Era\' and \'BCE\' meaning \'Before Common Era\'. It was issued by Pope Gregory XIII on October 15th, 1582 and is derived from the Julian Calendar after skipping 10 days between October 5th and 15th and differs via the 4-century leap year rule. This calendar is exactly accurate, however dates before October 15th 1582 are proleptic, and many countries did not adopt it until much later than 1582.\n\nMonths:\n  January\n  February\n  March\n  April\n  May\n  June\n  July\n  August\n  September\n  October\n  November\n  December'
    },

    {
        name: 'Julian',
        id: 'julian',
        type: 'Solar Calendar',
        epoch: 'January 3rd, 1 CE',
        confidence: 'High',
        description: 'The Julian Calendar was issued by Julius Caesar in 45 BC after several corrections to the solar date. It features a leap day every 4 years, leading it to drift from the Gregorian calendar by 3 days every 400 years. Years are denoted \'AD\' or \'Anno Domini\', meaning \'in the year of the Lord\', as well as \'BC\' meaning \'Before Christ\'. The Julian calendar was the principal calendar in much of the world, especially Europe, prior to the adoption of the Gregorian calendar. It is exactly accurate in relation to the Gregorian calendar, but dates before 40 BC might not reflect civic dates of the era due to a series of corrections. The date of leap days might not be exactly aligned with the Gregorian calendar here, but they are accurate to the year.\n\nMonths:\n  January\n  February\n  March\n  April\n  May\n  June\n  July\n  August\n  September\n  October\n  November\n  December'
    },

    {
        name: 'French Republican',
        id: 'french-republican',
        type: 'Solar Calendar',
        epoch: 'September 22nd, 1792 CE',
        confidence: 'High',
        description: `The French Republican calendar was used during and after the French Revolution from 1793 to 1805 and was a drastic change to the Gregorian calendar. It featured twelve months of 30 days each, broken into 3 weeks of 10 days. The remaining 5 or 6 days of each solar year were the Sansculottides, to be treated as national holidays at the end of the year. The new year started on September 22nd or 23rd of the Gregorian calendar, and years were written in Roman numerals with the era name of \'l\'ère républicaine\', or \'Republican Era\', abbreviated here as \'RE\'.\n\nMonths:\n  Vendémiaire\n  Brumaire\n  Frimaire\n  Nivôse\n  Pluviôse\n  Ventôse\n  Germinal\n  Floréal\n  Prairial\n  Messidor\n  Thermidor\n  Fructidor\n  Sansculottides`
    },

    {
        name: 'Era Fascista',
        id: 'era-fascista',
        type: 'Solar Calendar',
        epoch: 'October 22nd, 1922 CE',
        confidence: 'High',
        description: 'Era Fascista is a simple count of number of years since the start of the Fascist Era in Italy on October 22nd, 1922, starting with Anno I. Taking inspiration from the French Republican calendar, years were written in Roman numerals and it was intended to replace the Gregorian calendar.'
    },

    {
        name: 'Coptic (UTC)',
        id: 'coptic',
        type: 'Solar Calendar',
        epoch: 'August 29th, 284 CE',
        confidence: 'High',
        description: 'The Coptic calendar, also known as the Alexandrian calendar, was used in Egypt until the adoption of the Gregorian calendar in 1875. It is based on the ancient Egyptian calendar but with leap days every four years, keeping it in sync with the Julian calendar while sharing months and days with the Ge\'ez calendar. It has 12 months of 30 days plus a smaller 13th month of 5 or 6 days. The new year starts on the 11th or 12th of September, and years are abbreviated with \'AM\', meaning Anno Martyrum, or \'Year of the Martyrs\'. The Coptic calendar is still in use today by Egyptian farmers as well as the Coptic Orthodox Church.\n\nMonths:\n  Thout\n  Paopi\n  Hathor\n  Koiak\n  Tobi\n  Meshir\n  Paremhat\n  Parmouti\n  Pashons\n  Paoni\n  Epip\n  Mesori\n  Pi Kogi Enavot'
    },

    {
        name: 'Ge\'ez (UTC)',
        id: 'ethiopian',
        type: 'Solar Calendar',
        epoch: 'August 27th, 8 CE',
        confidence: 'High',
        description: 'The Ge\'ez calendar is the official calendar of Ethiopia. It has 12 months of 30 days plus a smaller 13th month of 5 or 6 days. It has a leap day every 4 years, keeping it in sync with the Julian calendar while sharing months and days with the Coptic calendar. The New Year starts on September 11th or 12th, with years abbreviated with ዓ.ም. which is pronounced \'am\', short for Amätä Mihret, meaning \'Year of Mercy\'.\n\nMonths:\n  Mäskäräm\n  Ṭəqəmt\n  Ḫədar\n  Taḫśaś\n  Ṭərr\n  Yäkatit\n  Mägabit\n  Miyazya\n  Gənbo\n  Säne\n  Ḥamle\n  Nähase\n  Ṗagume'
    },

    {
        name: 'Minguo',
        id: 'minguo',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        confidence: 'Exact',
        description: 'The Minguo calendar, also known as the Republic of China calendar, is used in Taiwan and its territories. Following the traditional convention of numbering years after the current dynastic era, dates are counted in 民國 ("MinGuo"), translated as \'Year of the Republic\' with year 1 being the establishment of the ROC in 1912, while its numerical months (月 "yue") and days (日 "ri") follow the Gregorian calendar.'
    },

    {
        name: 'Thai Solar',
        id: 'thai-solar',
        type: 'Solar Calendar',
        epoch: 'January 1st, 543 BCE',
        confidence: 'High',
        description: 'The Thai Solar calendar is used in Thailand and is 543 years ahead of the Gregorian calendar, though it shares the same months with different names. It represents the number of years of the current Buddhist Era (B.E.), the Era of the Shaka Buddha. Year 0 falls on the Gregorian year of 543 BCE.\n\nMonths:\n  มกราคม\n  กุมภาพันธ์\n  มีนาคม\n  เมษายน\n  พฤษภาคม\n  มิถุนายน\n  กรกฎาคม\n  สิงหาคม\n  กันยายน\n  ตุลาคม\n  พฤศจิกายน\n  ธันวาคม'
    },

    {
        name: 'Juche',
        id: 'juche',
        type: 'Solar Calendar',
        epoch: 'January 1st, 1912 CE',
        confidence: 'Exact',
        description: 'The Juche calendar is used in North Korea. It represents the number of years since the birth year of Kim Il Sung, the founder of the DPRK, and was adopted in 1997. For its months and days it follows the Gregorian calendar.'
    },

    {
        name: 'Byzantine',
        id: 'byzantine',
        type: 'Solar Calendar',
        epoch: 'July 19th, 5508 BCE',
        confidence: 'Exact',
        description: 'The Byzantine calendar was the official calendar of the Byzantine Empire from 988 to 1453 and was used in Ukraine and Russia until 1700. It followed the Julian calendar but differed by the new year starting on September 1st and the epoch being September 1st, 5509 BC (July 19th, 5508 BCE in the Gregorian Astronomical). Years are counted in AM, or \'Anno Mundi\' meaning \'Year After Creation\'.\n\nMonths:\n  September\n  October\n  November\n  December\n  January\n  February\n  March\n  April\n  May\n  June\n  July\n  August'
    },

    {
        name: 'Florentine (CET)',
        id: 'florentine',
        type: 'Solar Calendar',
        epoch: 'March 21st, 0 BCE',
        confidence: 'Exact',
        description: 'The Florentine calendar was the calendar used in the Republic of Florence during the Middle Ages. It followed the Julian calendar for its years, months, and days with a few key differences: the new year started on March 25th, meaning January 1st of a given year was immediately after December 31st of the same year, and March 24th of that year was followed by March 25th of the next year. Days also started at sunset, which is displayed here as 6:00pm in Florence.\n\nMonths:\n  March\n  April\n  May\n  June\n  July\n  August\n  September\n  October\n  November\n  December\n  January\n  February\n  March'
    },
]

const lunisolarCalendarsData = [
    {
        name: 'Chinese (CST)',
        id: 'chinese',
        type: 'Lunisolar Calendar',
        epoch: '2698 BCE',
        confidence: 'Medium',
        description: 'The Chinese lunisolar calendar is one of the most successful and widespread calendars in history. It has been used since ancient times and is still used today by much of East Asia. It features numerically-named months (月 "yue") of 29 or 30 days (日 "ri") that begin on the same day as the New Moon in China (CST), with an intercalary month added on leap years that happen roughly every 2 or 3 solar years (年 "nian"). Years are also named in a 12-year cycle of the 12 Earthly Branches (Chinese Zodiac). Different versions of this calendar use different eras, but this website uses 2698 BCE as the Year of the Yellow Emperor, a date which was standardized by Sun Yat-sen in 1912 despite there being controversy over the exact date. Calculating this calendar is very difficult and requires calculating the Winter Solstice, Spring Equinox, Longitude of the Sun, and any given New Moon. Due to the difficulty of this calculation, months and days might be off by 1 at times, though they typically self-correct by the next month. This equation was based off of the steps found here: https://ytliu0.github.io/ChineseCalendar/rules.html.\n\nYear Cycle:\n  Rat (鼠)                    Horse (馬)\n  Ox (牛)                     Goat (羊)\n  Tiger (虎)                 Monkey (猴)\n  Rabbit (兔)               Rooster (雞)\n  Dragon (龍)              Dog (狗)\n  Snake (蛇)                Pig (豬)'
    },

    {
        name: 'Sexagenary Year (CST)',
        id: 'sexagenary-year',
        type: 'Lunisolar Calendar',
        epoch: '2698 BCE',
        confidence: 'High',
        description: 'The Sexagenary Cycle is a system of counting years in the Chinese calendar (and several other aspects of life). It is a multiplication of the 10 Heavenly Stems and the 12 Earthly Branches (Chinese Zodiac) with half of the combinations left out, leading to a total cycle length of 60. The cycle moves to the next combination on the day of the New Year in the Chinese lunisolar calendar.\n\n10 Heavenly Stems:          12 Earthly Branches:\n  甲 (Jia)                              子 (Zi)\n  乙 (Yi)                               丑 (Chou)\n  丙 (Bing)                           寅 (Yin)\n  丁 (Ding)                           卯 (Mao)\n  戊 (Wu)                             辰 (Chen)\n  己 (Ji)                                巳 (Si)\n  庚 (Geng)                          午 (Wu)\n  辛 (Xin)                             未 (Wei)\n  壬 (Ren)                            申 (Shen)\n  癸 (Gui)                             酉 (You)\n                                            戌 (Xu)\n                                            亥 (Hai)'
    },

    {
        name: 'Đại lịch (ICT)',
        id: 'vietnamese',
        type: 'Lunisolar Calendar',
        epoch: '1 CE',
        confidence: 'Medium',
        description: 'The Đại lịch calendar is the traditional calendar of Vietnam. It is derived from the Chinese lunisolar calendar and shares many of the same elements, but it is set to Vietnamese time, meaning on rare occasions the two calendars can temporarily be significantly offset, only to realign again later. It features 12 months of 29 or 30 days with a leap month on average every 2-3 years. The Đại lịch calendar also follows a similar 12 Earthly Branches (Vietnamese Zodiac) theme for each year, though a few of the animals are different from the Chinese calendar. This calendar uses the same epoch as the Gregorian calendar and may not reflect historic epochs. Similarly, the calendar hasn\'t always been set to Vietnamese time, changing back from Chinese time in the mid-20th century, so dates before that are likely to be incorrect.\n\nYear Cycle:\n  Rat (𤝞)                    Horse (馭)\n  Water Buffalo (𤛠)   Goat (羝)\n  Tiger (𧲫)                 Monkey (𤠳)\n  Cat (猫)                    Rooster (𪂮)\n  Dragon (龍)              Dog (㹥)\n  Snake (𧋻)                Pig (㺧)'
    },

    {
        name: 'Dangun',
        id: 'dangun',
        type: 'Lunisolar Calendar',
        epoch: '1 CE',
        confidence: 'Medium',
        description: 'The Dangun calendar is the traditional calendar of Korea. It is no longer officially used, but it is still maintained by the South Korean goverment for cultural purposes and holidays. It is derived from the Chinese lunisolar calendar where it gets its months (월) and days (일) while sharing years (년) with the Gregorian calendar, though it doesn\'t increment the year until the lunisolar new year in January or February.'
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
        description: 'The Hijri calendar is the principal calendar used in Islam, and it is perhaps the only extant true lunar calendar in the world. It features 12 lunar months of 29 or 30 days, with days starting at sunset, for a total of 355 or 356 days per year, causing it to be out of sync with solar calendars. Era dates are denoted \'AH\' from \'Anno Hegirae\', meaning \'In the year of the Hijrah\'. Each month starts shortly after the New Moon when it begins to appear as a crescent. Many Muslim nations have their own rules for determining the start of the month, often based on direct observation, and as such their calendar dates may occasionally misalign for a month or two. The algorithm used by this website requires calculating the New Moon and uses 18:00 local time in Mecca for sunset. Its accuracy is dependent on the New Moon calculations and may not reflect historical records.\n\nMonths:\n  al-Muḥarram\n  Ṣafar\n  Rabīʿ al-ʾAwwal\n  Rabīʿ ath-Thānī\n  Jumādā al-ʾŪlā\n  Jumādā al-ʾĀkhirah\n  Rajab\n  Shaʿbān\n  Ramaḍān\n  Shawwāl\n  Dhū al-Qaʿdah\n  Dhū al-Ḥijjah'
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

const popCultureData = [
    {
        name: 'Minecraft Time',
        id: 'minecraft-time',
        type: 'Pop Culture',
        epoch: 'Midnight',
        confidence: 'Exact',
        description: 'One day/night cycle in Minecraft is exactly 20 minutes. Days typically start when the player wakes up from their bed, and although there is a clock in the game, it has little information to expand upon that. This representation of Minecraft time divides the Minecraft day into 24-hour segments with minutes and seconds, set to midnight in the real world when it also resets the day counter.'
    },
    /*
    {
        name: 'Shake of a Lamb\'s Tail',
        id: 'shake-of-a-lambs-tail',
        type: 'Pop Culture',
        epoch: 'Midnight',
        confidence: 'High',
        description: 'In the 1994 film Pulp Fiction, Mia Wallace (Uma Thurman) tells Vincent Vega (John Travolta) she will be down in \'two shakes of a lamb\'s tail\'. She takes a minute and 10 seconds to reach Vincent, indicating that one shake of a lamb\'s tail is 35 seconds, not to be confused with the length of time used in nuclear physics called a Shake. The current Shake of a Lamb\'s Tail is indicated here, resetting every local midnight.'
    },
    */
    {
        name: 'Dream Time',
        id: 'dream-time',
        type: 'Pop Culture',
        epoch: 'Midnight',
        confidence: 'Exact',
        description: 'According to the movie Inception, time in a dream is experienced 20 times slower, allowing for several days to be experienced in a single night\'s sleep. The time displayed here is the current time in your dream if you had begun sleeping at midnight.'
    },
]

const politics = [
    {
        name: 'US Presidential Terms',
        id: 'us-presidential-terms',
        type: 'Politics',
        epoch: 'April 30, 1789',
        confidence: 'High',
        description: 'The term of the US president lasts 4 years, starting from January 20th at noon and ending January 20th at noon four years later. This is a running count of how many presidential terms have passed since the inauguration of George Washington in 1789. The inauguration date has changed over the years, making this display inaccurate for years before 1937.'
    },
]

const proposedCalendars = [
    {
        name: 'Human Era',
        id: 'human-era',
        type: 'Proposed Calendar',
        epoch: 'January 1st, 9999 BCE',
        confidence: 'Exact',
        description: 'The Human Era, also known as the Holocene Era, is the calendar representation of time since the beginning of the Holocene and the Neolithic Revolution, when humans started living in fixed agricultural settlements. It was proposed by Cesare Emiliani in 1993 CE and is based on the Gregorian calendar.'
    },

    {
        name: 'Invariable',
        id: 'invariable',
        type: 'Proposed Calendar',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        description: 'The Invariable calendar was proposed by L. A. Grosclaude in 1900 CE as well as by Gaston Armelin in 1887 CE. It features months in a repeating pattern of 30/30/31 days with New Years Day happening between December and January and Leap Day occurring between June and July in leap years, which happen in the same years as the Gregorian calendar. These two special days are not part of any week nor month, as if the calendar has paused for 24 hours. The regular month lengths ensure that the first of every month always lands on a Monday, Wednesday, or Friday in a predictable pattern that is the same every year.'
    },

    {
        name: 'The World Calendar',
        id: 'world-calendar',
        type: 'Proposed Calendar',
        epoch: 'January 1st, 1 CE',
        confidence: 'Exact',
        description: 'The World Calendar was proposed by Elisabeth Achelis in 1930 CE and was nearly adopted by the League of Nations. It features months in a repeating pattern of 31/30/30 days with World\'s Day happening between December and January and Leapyear Day occurring between June and July in leap years, which happen in the same years as the Gregorian calendar. These two special days are not part of any week nor month, as if the calendar has paused for 24 hours. The regular month lengths ensure that the first of every month always lands on a Sunday, Wednesday, or Friday in a predictable pattern that is the same every year.'
    },
]