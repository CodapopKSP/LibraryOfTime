/*
    |===================|
    |    Node Update    |
    |===================|

    This is a collection of container functions for updating nodes.
*/

// Manages the update interval of the calculator
let _currentUpdateInterval = setInterval(updateAllNodes, updateMilliseconds);
function getCurrentUpdateInterval() {
    return _currentUpdateInterval;
}
function setCurrentUpdateInterval(newInterval) {
    _currentUpdateInterval = newInterval;
}

function updateAllNodes(dateInput, timezoneOffset_, firstPass) {

    // Set Timezone to local time if there is none specified
    let timezoneOffset = timezoneOffset_;
    let timezoneOffsetConverted = 0;
    if (timezoneOffset === undefined) {
        timezoneOffset = getLocalTimezoneOffset();
    }
    timezoneOffsetConverted = convertUTCOffsetToMinutes(timezoneOffset);

    // Get the current datetime, keeping in mind the timezone, calendar type, and Date() bullshit
    let currentDateTime = dateInput ? parseInputDate(dateInput, timezoneOffset) : new Date();

    // Make adjustments based on calendar choice
    currentDateTime = adjustCalendarType(currentDateTime);

    // Update once per day
    if ((getNeedsUpdate_PerDay() && (currentDateTime.getHours() < 5))||firstPass) {
        generateAllNewMoons(currentDateTime);
        generateAllSolsticesEquinoxes(currentDateTime);
        updateAstronomicalData(currentDateTime);
        setNeedsUpdate_PerDay(false);
    }
    // Reset the update interval for the next day
    if (currentDateTime.getHours() > 5) {
        setNeedsUpdate_PerDay(true);
    }

    // Update once per quarter hour
    if ((getNeedsUpdate_PerQuarterHour() && ((currentDateTime.getMinutes() % 15) < 5))||firstPass) {
        updateLunisolarCalendars(currentDateTime);
        updateProposedCalendars(currentDateTime, timezoneOffset);
        updateAstronomicalData(currentDateTime);
        updateSolarCalendars(currentDateTime, timezoneOffsetConverted);
        updateComputingTimes(currentDateTime, timezoneOffsetConverted);
        updateOtherCalendars(currentDateTime);
        updatePopCultureCalendars(currentDateTime, timezoneOffsetConverted);
        setNeedsUpdate_PerQuarterHour(false);
    }
    // Reset the update interval for the next second
    if ((currentDateTime.getMinutes() % 15) > 5) {
        setNeedsUpdate_PerQuarterHour(true);
    }

    // Update once per second
    if ((getNeedsUpdate_PerSecond() && (currentDateTime.getMilliseconds() < 500))||firstPass) {
        updateClocks_Slow(currentDateTime, timezoneOffsetConverted);
        setNeedsUpdate_PerSecond(false);
    }
    // Reset the update interval for the next second
    if ((currentDateTime.getMilliseconds() > 500)) {
        setNeedsUpdate_PerSecond(true);
    }

    // Update everything that needs to change constantly
    updateClocks_Fast(currentDateTime, timezoneOffsetConverted, dateInput);
}

// Main function for populating a node
function setTimeValue(type, value) {
    // Update the original node
    const originalNode = document.getElementById(type);
    if (originalNode) {
        originalNode.textContent = value;
    }

    // Update cloned nodes, if any
    const clonedNodes = document.querySelectorAll(`.grid-item .${type}`);
    clonedNodes.forEach(clonedNode => {
        clonedNode.textContent = value;
    });
}

function updateAstronomicalData(currentDateTime) {
    setTimeValue('northward-equinox-node', getSolsticeOrEquinox(currentDateTime, 'SPRING').toUTCString());
    setTimeValue('northern-solstice-node', getSolsticeOrEquinox(currentDateTime, 'SUMMER').toUTCString());
    setTimeValue('southward-equinox-node', getSolsticeOrEquinox(currentDateTime, 'AUTUMN').toUTCString());
    setTimeValue('southern-solstice-node', getSolsticeOrEquinox(currentDateTime, 'WINTER').toUTCString());
    setTimeValue('longitude-of-the-sun-node', getLongitudeOfSun(currentDateTime) + '°');
    setTimeValue('this-months-new-moon-node', getMoonPhase(currentDateTime, 0).toUTCString());
    setTimeValue('this-months-first-quarter-moon-node', getMoonPhase(currentDateTime, 0.25).toUTCString());
    setTimeValue('this-months-full-moon-node', getMoonPhase(currentDateTime, 0.5).toUTCString());
    setTimeValue('this-months-last-quarter-moon-node', getMoonPhase(currentDateTime, 0.75).toUTCString());
    setTimeValue('next-solar-eclipse-node', getNextSolarLunarEclipse(currentDateTime, 0));
    setTimeValue('next-lunar-eclipse-node', getNextSolarLunarEclipse(currentDateTime, 0.5));
}

function updateSolarCalendars(currentDateTime, timezoneOffset) {
    const springEquinox = getSolsticeEquinox(currentDateTime, 'SPRING');
    setTimeValue('gregorian-node', getGregorianDateTime(currentDateTime, timezoneOffset).date);
    setTimeValue('julian-node', getJulianCalendar(currentDateTime));
    setTimeValue('astronomical-node', getAstronomicalDate(currentDateTime));
    setTimeValue('byzantine-node', getByzantineCalendar(currentDateTime));
    setTimeValue('florentine-node', getFlorentineCalendar(currentDateTime));
    setTimeValue('pisan-node', getPisanCalendar(currentDateTime));
    setTimeValue('venetian-node', getVenetianCalendar(currentDateTime));
    setTimeValue('french-republican-node', getRepublicanCalendar(currentDateTime));
    setTimeValue('era-fascista-node', getEraFascista(currentDateTime));
    setTimeValue('minguo-node', getMinguo(currentDateTime));
    setTimeValue('thai-node', getThaiSolar(currentDateTime));
    setTimeValue('juche-node', getJuche(currentDateTime));
    setTimeValue('coptic-node', getCopticDate(currentDateTime));
    setTimeValue('geez-node', getEthiopianDate(currentDateTime));
    setTimeValue('bahai-node', getBahaiCalendar(currentDateTime, springEquinox));
    setTimeValue('pataphysical-node', getPataphysicalDate(currentDateTime, timezoneOffset));
    setTimeValue('discordian-node', getDiscordianDate(currentDateTime, timezoneOffset));
    setTimeValue('solar-hijri-node', getSolarHijriDate(currentDateTime, springEquinox));
    setTimeValue('qadimi-node', getQadimiDate(currentDateTime));
    setTimeValue('egyptian-civil-node', getEgyptianDate(currentDateTime));
    setTimeValue('iso-week-date-node', getISOWeekDate(currentDateTime, timezoneOffset));
    setTimeValue('haab-node', getHaabDate(currentDateTime));
    setTimeValue('anno-lucis-node', getAnnoLucisDate(currentDateTime, timezoneOffset));
    setTimeValue('tabot-node', getTabotDate(currentDateTime));
    setTimeValue('icelandic-node', getIcelandicDate(currentDateTime));
    setTimeValue('saka-samvat-node', getSakaSamvatDate(currentDateTime));
    setTimeValue('sca-node', getSocietyForCreativeAnachronismDate(currentDateTime, timezoneOffset));
}

function updateLunisolarCalendars(currentDateTime) {
    setTimeValue('chinese-node', getChineseLunisolarCalendarDate(currentDateTime, 'CHINA'));
    setTimeValue('sexagenary-year-node', getSexagenaryYear(currentDateTime));
    setTimeValue('dai-lich-node', getChineseLunisolarCalendarDate(currentDateTime, 'VIETNAM'));
    setTimeValue('dangun-node', getChineseLunisolarCalendarDate(currentDateTime, 'KOREA'));
    setTimeValue('umm-al-qura-node', getUmmalQuraDate(currentDateTime));
    setTimeValue('hebrew-node', calculateHebrewCalendar(currentDateTime));
}

function updateOtherCalendars(currentDateTime) {
    setTimeValue('maya-long-count-node', getCurrentMayaLongCount(currentDateTime));
    setTimeValue('tzolkin-node', getTzolkinDate(currentDateTime));
    setTimeValue('lord-of-the-night-y-node', getLordOfTheNight(currentDateTime));
    setTimeValue('darian-mars-node', getDarianMarsDate(getJulianSolDate(currentDateTime)));
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
    setTimeValue('pawukon-node', getPawukonCalendarDate(currentDateTime));
    setTimeValue('togys-node', getTogysDate(currentDateTime));
}

function updateComputingTimes(currentDateTime, timezoneOffset) {
    setTimeValue('julian-period-node', getJulianPeriod(currentDateTime));
    setTimeValue('rata-die-node', getRataDie(currentDateTime));
    setTimeValue('lilian-date-node', getLilianDate(currentDateTime));
    setTimeValue('ordinal-date-node', getOrdinalDate(currentDateTime));
    setTimeValue('julian-sol-number-node', getJulianSolDate(currentDateTime).toFixed(0));
    setTimeValue('julian-circad-number-node', getJulianCircadNumber(currentDateTime).toFixed(0));
    setTimeValue('kali-ahargana-node', getKaliAhargana(currentDateTime).toFixed(0));
    setTimeValue('deltat-node', getDeltaT(currentDateTime));
    setTimeValue('spreadsheet-now-node', getSpreadsheetNowTime(currentDateTime, timezoneOffset));
    const lunationNumber = calculateLunationNumber(currentDateTime);
    setTimeValue('lunation-number-node', lunationNumber);
    setTimeValue('brown-lunation-number-node', getBrownLunationNumber(lunationNumber));
    setTimeValue('goldstine-lunation-number-node', getGoldstineLunationNumber(lunationNumber));
    setTimeValue('hebrew-lunation-number-node', getHebrewLunationNumber(lunationNumber));
    setTimeValue('islamic-lunation-number-node', getIslamicLunationNumber(lunationNumber));
    setTimeValue('thai-lunation-number-node', getThaiLunationNumber(lunationNumber));
}

function updateProposedCalendars(currentDateTime, timezoneOffset) {
    setTimeValue('human-era-node', getHumanEra(currentDateTime, timezoneOffset));
    setTimeValue('invariable-node', getInvariableCalendarDate(currentDateTime, timezoneOffset));
    setTimeValue('the-world-calendar-node', getWorldCalendarDate(currentDateTime, timezoneOffset));
    setTimeValue('symmetry454-node', getSymmetry454Date(currentDateTime, timezoneOffset));
    setTimeValue('symmetry010-node', getSymmetry010Date(currentDateTime, timezoneOffset));
    setTimeValue('positivist-node', getPositivistDate(currentDateTime, timezoneOffset));
}

function updatePopCultureCalendars(currentDateTime, timezoneOffset) {
    setTimeValue('tamrielic-node', getTamrielicDate(currentDateTime, timezoneOffset));
    setTimeValue('imperial-dating-system-node', getImperialDatingSystem(currentDateTime, timezoneOffset));
}

// Update clocks that change every millisecond
function updateClocks_Fast(currentDateTime, timezoneOffset, dateInput) {

    // Decimal Time
    setTimeValue('french-revolutionary-node', getRevolutionaryTime(currentDateTime, timezoneOffset));
    setTimeValue('beat-node', convertToSwatchBeats(currentDateTime));
    setTimeValue('hexadecimal-node', getHexadecimalTime(currentDateTime, timezoneOffset));
    setTimeValue('binary-16-bit-node', getBinaryTime(currentDateTime, timezoneOffset));

    // Other Time
    setTimeValue('coordinated-mars-time-node', getMTC(currentDateTime));
    setTimeValue('io-meridian-time-node', getIoPrimeMeridianTime(currentDateTime));
    setTimeValue('europa-meridian-time-node', getEuropaPrimeMeridianTime(currentDateTime));
    setTimeValue('ganymede-meridian-time-node', getGanymedePrimeMeridianTime(currentDateTime));
    setTimeValue('callisto-meridian-time-node', getCallistoPrimeMeridianTime(currentDateTime));
    setTimeValue('titan-meridian-time-node', getTitanPrimeMeridianTime(currentDateTime));

    // Political Cycles
    setTimeValue('us-presidential-terms-node', getCurrentPresidentialTerm(currentDateTime).toFixed(10));

    // Computing Times
    setTimeValue('julian-day-number-node', getJulianDayNumber(currentDateTime));
    setTimeValue('iso-8601-node', currentDateTime.toISOString());
    setTimeValue('mars-sol-date-node', getMarsSolDate(currentDateTime).toFixed(5));

    // Pop Culture
    setTimeValue('minecraft-time-node', getMinecraftTime(currentDateTime, timezoneOffset));
    setTimeValue('dream-time-node', getInceptionDreamTime(currentDateTime, timezoneOffset));
    setTimeValue('termina-time-node', getTerminaTime(currentDateTime, timezoneOffset));
    setTimeValue('stardate-node', getStardate(currentDateTime, timezoneOffset));

    // Fractional Time
    setTimeValue('day-node', calculateDay(currentDateTime, timezoneOffset).toFixed(decimals));
    setTimeValue('month-node', calculateMonth(currentDateTime, timezoneOffset).toFixed(decimals));
    setTimeValue('year-node', calculateYear(currentDateTime, timezoneOffset).toFixed(decimals));
    setTimeValue('hour-node', calculateHour(currentDateTime, timezoneOffset).toFixed(decimals));
    setTimeValue('minute-node', calculateMinute(currentDateTime).toFixed(decimals));
    // Create the illusion of actual microsecond calculation
    if ((dateInput === 0)||(dateInput === undefined)) {
        setTimeValue('second-node', calculateSecond(currentDateTime));
    } else {
        setTimeValue('second-node', '0.0000000000');
    }
    setTimeValue('decade-node', calculateDecade(currentDateTime, timezoneOffset).toFixed(decimals));
    setTimeValue('century-node', calculateCentury(currentDateTime, timezoneOffset).toFixed(decimals));
}

// Update clocks that change every second
function updateClocks_Slow(currentDateTime, timezoneOffset) {
    setTimeValue('local-time-node', getGregorianDateTime(currentDateTime, timezoneOffset).time);
    setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    setTimeValue('millennium-node', calculateMillennium(currentDateTime, timezoneOffset).toFixed(decimals));

    // Computing Times
    setTimeValue('unix-node', getUnixTime(currentDateTime));
    setTimeValue('filetime-node', getCurrentFiletime(currentDateTime));
    setTimeValue('gps-node', getGPSTime(currentDateTime));
    setTimeValue('tai-node', getTAI(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('tt-node', getTT(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('loran-c-node', getLORANC(currentDateTime).toISOString().slice(0, -5));
}