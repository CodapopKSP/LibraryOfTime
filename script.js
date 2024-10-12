//https://www.fourmilab.ch/documents/calendar/
//https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up
//http://www.leapsecond.com/java/gpsclock.htm
//https://www.tondering.dk/claus/cal/julperiod.php
//https://en.wikipedia.org/wiki/Date_and_time_notation_in_Thailand
//https://ytliu0.github.io/ChineseCalendar/rules.html
//https://www.jewfaq.org/jewish_calendar_calculation
//https://ops-alaska.com/time/gangale_converter/calendar_clock.htm
//https://planetcalc.com/9166/
//https://assets.cambridge.org/97811070/57623/frontmatter/9781107057623_frontmatter.pdf
//https://archive.org/details/calendrical-calculations/page/n11/mode/2up
//https://libgen.li/edition.php?id=138174808

const updateMiliseconds = 20;       // Update tick length
let gregJulDifference = 0;          // Place holder for calculating Julian/Gregorian/Astronomical display date
let calendarType = 'gregorian-proleptic';

let selectedNode = '';              // The current selected node, blank if none
let dateInput = '';                 // Text string from the date input box
let currentDescriptionPage = [];    // The current arrangement of information to be displayed in the description box
let updateIntervalId;               // The current interval ID for spreading calculations out so they don't happen all at once

// Get Timezone offset for Timezone dropdown
const now = new Date();
const timezoneOffset = now.getTimezoneOffset();
// Convert offset to hours and minutes
const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
const offsetMinutes = Math.abs(timezoneOffset) % 60;
const offsetSign = timezoneOffset > 0 ? "-" : "+";
let formattedOffset = `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

// Create the nodes
const nodeDataArrays = [
    standardTimeData,
    computingTimeData,
    decimalTimeData,
    otherTimeData,
    solarCalendarsData,
    lunisolarCalendarsData,
    lunarCalendarsData,
    proposedCalendars,
    otherCalendars,
    astronomicalData,
    popCultureData,
    politicalCycles
];

nodeDataArrays.forEach(dataArray => {
    dataArray.forEach(item => {
        createNode(item);
    });
});

// Main function for 
function updateDateAndTime(dateInput, calendarType, timezoneOffset, firstPass) {
    let currentPass = 0;
    let currentDateTime = '';
    const decimals = 10; // Decimals to show in some nodes
    const millisecondStart = 20; // The timeframe that 1s incrementing updates have each second, starting at 0ms

    // If there is no date input
    if ((dateInput === 0)||(dateInput === undefined)) {
        currentDateTime = new Date();

        // Create pass number for optimization so that calendars don't all update constantly
        currentPass = currentDateTime.getSeconds();

    // There is a date input
    } else {
        let inputYear = 0;
        let inputMonth = 0;
        let inputDay = 1; // Default to 1st if not provided
        let inputHour = 0;
        let inputMinute = 0;
        let inputSecond = 0;

        const dateTimeParts = dateInput.split(', ');

        if (dateTimeParts[0]) {
            const dateParts = dateTimeParts[0].split('-');
            if (dateParts[0]) {
                inputYear = dateParts[0];
            }
            if (dateParts[1]) {
                inputMonth = dateParts[1] - 1; // Month is zero-based
            }
            if (dateParts[2]) {
                inputDay = dateParts[2];
            }
        }

        if (dateTimeParts[1]) {
            const timeParts = dateTimeParts[1].split(':');
            if (timeParts[0]) {
                inputHour = timeParts[0];
            }
            if (timeParts[1]) {
                inputMinute = timeParts[1];
            }
            if (timeParts[2]) {
                inputSecond = timeParts[2];
            }
        }

        const offsetInMinutes = convertUTCOffsetToMinutes(timezoneOffset);
        currentDateTime = new Date(Date.UTC(inputYear, inputMonth, inputDay, inputHour, inputMinute-offsetInMinutes, inputSecond));
        currentDateTime.setUTCFullYear(inputYear);
        currentPass = 100;
    }

    // Website just loaded, so update all calendars
    if (firstPass===true) {
        currentPass = 100;
    }

    // Get difference between Julian and Gregorian
    gregJulDifference = differenceInDays(currentDateTime, getJulianDate(currentDateTime));

    // User chose Julian
    if (calendarType==='julian-liturgical') {
        // No Year 0 exists, so add 1 to negative years
        if (currentDateTime.getFullYear() < 0) {
            currentDateTime.setFullYear(currentDateTime.getFullYear()+1);
        
        // No Year 0 exists, so return current date
        } else if (currentDateTime.getFullYear()===0) {
            currentDateTime = new Date();
        }
        currentDateTime.setDate(currentDateTime.getDate() + gregJulDifference);

    // User chose Astronomical
    } else if (calendarType==='astronomical') {
        const startOfGregorian = new Date(1582, 9, 15);
        if (currentDateTime<startOfGregorian) {
            currentDateTime.setDate(currentDateTime.getDate() + gregJulDifference);
        }
    }

    // Calculations that are used by multiple nodes
    const julianDay = getJulianDayNumber(currentDateTime)
    const dayFraction = calculateDay(currentDateTime)
    const marsSolDay = getMarsSolDate(julianDay);

    // All fractional times
    if ((currentDateTime.getMilliseconds() < millisecondStart)||(currentPass===100)) {
        setTimeValue('local-time-node', getGregorianDateTime(currentDateTime).time);
        setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    }
    setTimeValue('day-node', dayFraction.toFixed(decimals));
    setTimeValue('month-node', calculateMonth(currentDateTime).toFixed(decimals));
    setTimeValue('year-node', calculateYear(currentDateTime).toFixed(decimals));
    setTimeValue('hour-node', calculateHour(currentDateTime).toFixed(decimals));
    setTimeValue('minute-node', calculateMinute(currentDateTime).toFixed(decimals));
    // Create the illusion of actual microsecond calculation
    if ((dateInput === 0)||(dateInput === undefined)) {
        setTimeValue('second-node', calculateSecond(currentDateTime));
    } else {
        setTimeValue('second-node', '0.0000000000');
    }
    setTimeValue('decade-node', calculateDecade(currentDateTime).toFixed(decimals));
    setTimeValue('century-node', calculateCentury(currentDateTime).toFixed(decimals));
    if ((currentDateTime.getMilliseconds() > 900)||(currentPass===100)) {
        setTimeValue('millennium-node', calculateMillennium(currentDateTime).toFixed(decimals));
    }

    // Computing Times
    setTimeValue('julian-day-number-node', julianDay);
    setTimeValue('terrestrial-time-node', getTerrestrialTimeOffset(currentDateTime));
    setTimeValue('iso8601-node', currentDateTime.toISOString());
    if ((currentDateTime.getMilliseconds() < millisecondStart)||(currentPass===100)) {
        setTimeValue('unix-node', getUnixTime(currentDateTime));
        setTimeValue('filetime-node', getCurrentFiletime(currentDateTime));
        setTimeValue('gps-node', getGPSTime(currentDateTime));
        setTimeValue('julian-period-node', getJulianPeriod(currentDateTime));
        setTimeValue('rata-die-node', getRataDie(currentDateTime));
        setTimeValue('tai-node', getTAI(currentDateTime).toISOString().slice(0, -5));
        setTimeValue('loran-c-node', getLORANC(currentDateTime).toISOString().slice(0, -5));
        setTimeValue('lilian-date-node', getLilianDate(julianDay));
        setTimeValue('mars-sol-date-node', marsSolDay.toFixed(5));
        setTimeValue('julian-sol-number-node', getJulianSolDate(marsSolDay).toFixed(0));
        setTimeValue('julian-circad-number-node', getJulianCircadNumber(currentDateTime).toFixed(0));
        setTimeValue('kali-ahargaṅa-node', getKaliAhargana(currentDateTime).toFixed(0));

        const lunationNumber = calculateLunationNumber(currentDateTime);
        setTimeValue('lunation-number-node', lunationNumber);
        setTimeValue('brown-lunation-number-node', getBrownLunationNumber(lunationNumber));
        setTimeValue('goldstine-lunation-number-node', getGoldstineLunationNumber(lunationNumber));
        setTimeValue('hebrew-lunation-number-node', getHebrewLunationNumber(lunationNumber));
        setTimeValue('islamic-lunation-number-node', getIslamicLunationNumber(lunationNumber));
        setTimeValue('thai-lunation-number-node', getThaiLunationNumber(lunationNumber));
    }

    // Decimal Time
    setTimeValue('revolutionary-time-node', getRevolutionaryTime(dayFraction));
    setTimeValue('beat-time-node', convertToSwatchBeats(currentDateTime));
    setTimeValue('hexadecimal-node', getHexadecimalTime(dayFraction));
    setTimeValue('binary-node', getBinaryTime(dayFraction));

    // Other Time
    setTimeValue('coordinated-mars-time-node', getMTC(marsSolDay));
    setTimeValue('io-meridian-time-node', getIoPrimeMeridianTime(currentDateTime));
    setTimeValue('europa-meridian-time-node', getEuropaPrimeMeridianTime(currentDateTime));
    setTimeValue('ganymede-meridian-time-node', getGanymedePrimeMeridianTime(currentDateTime));
    setTimeValue('callisto-meridian-time-node', getCallistoPrimeMeridianTime(currentDateTime));
    setTimeValue('titan-meridian-time-node', getTitanPrimeMeridianTime(currentDateTime));

    // Solar Calendars
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 500 + millisecondStart))&&(currentPass===8))||(currentPass===100)) {
        const springEquinox = getCurrentSolsticeOrEquinox(currentDateTime, 'spring');
        setTimeValue('gregorian-node', getGregorianDateTime(currentDateTime).date);
        setTimeValue('julian-node', getJulianCalendar(currentDateTime, calendarType));
        setTimeValue('astronomical-node', getAstronomicalDate(currentDateTime));
        setTimeValue('byzantine-node', getByzantineCalendar(currentDateTime));
        setTimeValue('florentine-node', getFlorentineCalendar(currentDateTime));
        setTimeValue('french-republican-node', getRepublicanCalendar(currentDateTime, getCurrentSolsticeOrEquinox(currentDateTime, 'autumn')));
        setTimeValue('era-fascista-node', getEraFascista(currentDateTime));
        setTimeValue('minguo-node', getMinguo(currentDateTime));
        setTimeValue('thai-node', getThaiSolar(currentDateTime));
        setTimeValue('juche-node', getJuche(currentDateTime));
        setTimeValue('coptic-node', getCopticDate(currentDateTime));
        setTimeValue('ethiopian-node', getEthiopianDate(currentDateTime));
        setTimeValue('bahai-node', getBahaiCalendar(currentDateTime, springEquinox));
        setTimeValue('pataphysical-node', getPataphysicalDate(currentDateTime));
        setTimeValue('discordian-node', getDiscordianDate(currentDateTime));
        setTimeValue('solar-hijri-node', getSolarHijriDate(currentDateTime, springEquinox));
        setTimeValue('qadimi-node', getQadimiDate(currentDateTime));
        setTimeValue('egyptian-civil-node', getEgyptianDate(currentDateTime));
        setTimeValue('iso-week-date-node', getISOWeekDate(currentDateTime));
        setTimeValue('haab-node', getHaabDate(currentDateTime));
    }

    // Other Calendars
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 500 + millisecondStart))&&(currentPass===9))||(currentPass===100)) {
        setTimeValue('maya-long-count-node', getCurrentMayaLongCount(currentDateTime));
        setTimeValue('tzolkin-node', getTzolkinDate(currentDateTime));
        setTimeValue('lord-of-the-night-node', getLordOfTheNight(currentDateTime));
        setTimeValue('darian-mars-node', getDarianMarsDate(getJulianSolDate(marsSolDay)));
        setTimeValue('galilean-io-node', getGalileanDate(currentDateTime, 'Io'));
        setTimeValue('galilean-europa-node', getGalileanDate(currentDateTime, 'Eu'));
        setTimeValue('galilean-ganymede-node', getGalileanDate(currentDateTime, 'Gan'));
        setTimeValue('galilean-callisto-node', getGalileanDate(currentDateTime, 'Cal'));
        setTimeValue('darian-io-node', getDarianGalileanDate(currentDateTime, 'Io'));
        setTimeValue('darian-europa-node', getDarianGalileanDate(currentDateTime, 'Eu'));
        setTimeValue('darian-ganymede-node', getDarianGalileanDate(currentDateTime, 'Gan'));
        setTimeValue('darian-callisto-node', getDarianGalileanDate(currentDateTime, 'Cal'));
        setTimeValue('darian-titan-node', getDarianTitanDate(currentDateTime));
        setTimeValue('yuga-cycle-node', getYugaCycle(currentDateTime));
        setTimeValue('sothic-cycle-node', getSothicCycle(currentDateTime));
        setTimeValue('olympiad-node', getOlympiad(currentDateTime));
    }

    // Lunisolar and Lunar Calendars
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 500 + millisecondStart))&&(currentPass===1))||(currentPass===100)) {
        const winterSolstice = getCurrentSolsticeOrEquinox(currentDateTime, 'winter');
        let lastYear = new Date(currentDateTime);
        lastYear.setFullYear(currentDateTime.getFullYear()-1);
        const winterSolsticeLastYear = getCurrentSolsticeOrEquinox(lastYear, 'winter');
        const newMoonThisMonth = getNewMoonThisMonth(currentDateTime, 0);
        const newMoonLastMonth = getNewMoonThisMonth(currentDateTime, -1);
        let lunisolarCalendarChina = getLunisolarCalendarDate(currentDateTime, newMoonThisMonth, newMoonLastMonth, winterSolstice, winterSolsticeLastYear, 16); // China midnight happens at UTC 16:00
        let chineseCalendar = getChineseLunisolarCalendarDate(currentDateTime, lunisolarCalendarChina, 'china');
        setTimeValue('chinese-node', chineseCalendar);
        setTimeValue('sexagenary-year-node', getSexagenaryYear(chineseCalendar));
        let lunisolarCalendarVietnam = getLunisolarCalendarDate(currentDateTime, newMoonThisMonth, newMoonLastMonth, winterSolstice, winterSolsticeLastYear, 15); // Vietnam midnight happens at UTC 15:00
        setTimeValue('vietnamese-node', getChineseLunisolarCalendarDate(currentDateTime, lunisolarCalendarVietnam, 'vietnam'));
        let lunisolarCalendarKorea = getLunisolarCalendarDate(currentDateTime, newMoonThisMonth, newMoonLastMonth, winterSolstice, winterSolsticeLastYear, 17); // Korea midnight happens at UTC 17:00
        setTimeValue('dangun-node', getChineseLunisolarCalendarDate(currentDateTime, lunisolarCalendarKorea, 'korea'));
        setTimeValue('hijri-node', getHijriDate(currentDateTime, newMoonThisMonth, newMoonLastMonth)); // Returns a wrong day for May 8 2024
    }
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 500 + millisecondStart))&&(currentPass===3))||(currentPass===100)) {
        setTimeValue('hebrew-node', calculateHebrewCalendar(currentDateTime)); // Returns a wrong day for October 10 1989
    }

    // Proposed Calendars
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 500 + millisecondStart))&&(currentPass===5))||(currentPass===100)) {
        setTimeValue('human-era-node', getHumanEra(currentDateTime));
        setTimeValue('invariable-node', getInvariableCalendarDate(currentDateTime));
        setTimeValue('world-calendar-node', getWorldCalendarDate(currentDateTime));
        setTimeValue('symmetry454-node', getSymmetry454Date(currentDateTime));
    }

    // Astronomical Data
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 500 + millisecondStart))&&(currentPass===6))||(currentPass===100)) {
        setTimeValue('spring-equinox-node', getCurrentSolsticeOrEquinox(currentDateTime, 'spring').toUTCString());
        setTimeValue('summer-solstice-node', getCurrentSolsticeOrEquinox(currentDateTime, 'summer').toUTCString());
        setTimeValue('autumn-equinox-node', getCurrentSolsticeOrEquinox(currentDateTime, 'autumn').toUTCString());
    }
    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 500 + millisecondStart))&&(currentPass===7))||(currentPass===100)) {
        const newMoonThisMonth = getNewMoonThisMonth(currentDateTime, 0);
        setTimeValue('winter-solstice-node', getCurrentSolsticeOrEquinox(currentDateTime, 'winter').toUTCString());
        setTimeValue('sun-longitude-node', getLongitudeOfSun(currentDateTime)+'°');
        setTimeValue('this-new-moon-node', newMoonThisMonth.toUTCString());
    }

    if ((((currentDateTime.getMilliseconds() > 500)&&(currentDateTime.getMilliseconds() < 500 + millisecondStart))&&(currentPass===4))||(currentPass===100)) {
        setTimeValue('next-solar-eclipse-node', getNextSolarEclipse(currentDateTime, 0));
    }

    // Pop Culture
    setTimeValue('minecraft-time-node', getMinecraftTime(currentDateTime));
    setTimeValue('dream-time-node', getInceptionDreamTime(currentDateTime));
    setTimeValue('termina-time-node', getTerminaTime(currentDateTime));

    // Politics
    setTimeValue('us-presidential-terms-node', getCurrentPresidentialTerm(currentDateTime).toFixed(10));
}

// Main function for populating a node
function setTimeValue(type, value) {
    document.getElementById(type).textContent = value;
}

// Read the input box and set the date or restart the current time ticker
function changeDateTime() {
    clearInterval(updateIntervalId);
    // Get the value entered in the input box
    const newDateString = document.getElementById('date-input').value;
    calendarType = document.getElementById('calendar-type').value;
    let timezoneChoice = document.getElementById('timezone').value;

    // Date was input, add it as an argument
    if (newDateString!=='') {
        updateDateAndTime(newDateString, calendarType, timezoneChoice);
        setTimeout(() => {
            updateIntervalId = setInterval(updateDateAndTime(newDateString, calendarType, timezoneChoice), updateMiliseconds);
        }, 1000);
    
    // Date was cleared, restart without argument
    } else {
        updateDateAndTime(0, true);
        setTimeout(() => {
            updateIntervalId = setInterval(updateDateAndTime, updateMiliseconds);
        }, 1);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Masonry Tiling library
    var grid = document.querySelector('.node-wrapper');
    var msnry = new Masonry(grid, {
        itemSelector: '.container',
        columnWidth: '.container',
        percentPosition: true,
    });

    const timezoneSelect = document.getElementById('timezone');
    const timezones = [
        'UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:30', 'UTC-09:00',
        'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00',
        'UTC-03:30', 'UTC-03:00', 'UTC-02:00', 'UTC-01:00', 'UTC+00:00',
        'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+03:30', 'UTC+04:00',
        'UTC+04:30', 'UTC+05:00', 'UTC+05:30', 'UTC+05:45', 'UTC+06:00',
        'UTC+06:30', 'UTC+07:00', 'UTC+08:00', 'UTC+08:45', 'UTC+09:00',
        'UTC+09:30', 'UTC+10:00', 'UTC+10:30', 'UTC+11:00', 'UTC+12:00',
        'UTC+12:45', 'UTC+13:00', 'UTC+14:00'
    ];

    timezones.forEach(timezone => {
        const option = document.createElement('option');
        option.value = timezone;
        option.text = timezone;
        if (timezone === formattedOffset) {
            option.selected = true;
        }
        timezoneSelect.appendChild(option);
    });
});

function convertUTCOffsetToMinutes(offsetString) {
    // Validate the input format
    const regex = /^UTC([+-])(\d{2}):(\d{2})$/;
    const match = offsetString.trim().match(regex);

    if (!match) {
        throw new Error("Invalid UTC offset format. Expected format: UTC±HH:MM");
    }

    // Extract the sign, hours, and minutes from the matched parts
    const sign = match[1] === "+" ? 1 : -1;
    const hours = parseInt(match[2], 10);
    const minutes = parseInt(match[3], 10);

    // Convert the total offset to minutes
    const totalMinutes = sign * (hours * 60 + minutes);

    return totalMinutes;
}

// Display the initial panel info
homeButton();

// Update the date and time every update tick
updateIntervalId = setInterval(updateDateAndTime, updateMiliseconds);
changeActiveHeaderButton('header-button-1', 0);

// Initial update
updateDateAndTime(0, 'gregorian-proleptic', formattedOffset, true);