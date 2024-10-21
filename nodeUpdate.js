/*
    |===================|
    |    Node Update    |
    |===================|

    This is a collection of container functions for updating nodes.
*/

function updateSolarCalendars(currentDateTime, calendarType) {
    const springEquinox = getCurrentSolsticeOrEquinox(currentDateTime, 'spring');
    setTimeValue('gregorian-node', getGregorianDateTime(currentDateTime).date);
    setTimeValue('julian-node', getJulianCalendar(currentDateTime, calendarType));
    setTimeValue('astronomical-node', getAstronomicalDate(currentDateTime));
    setTimeValue('byzantine-node', getByzantineCalendar(currentDateTime));
    setTimeValue('florentine-node', getFlorentineCalendar(currentDateTime));
    setTimeValue('pisan-node', getPisanCalendar(currentDateTime));
    setTimeValue('venetian-node', getVenetianCalendar(currentDateTime));
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

function updateLunisolarCalendars(currentDateTime) {
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

function updateOtherCalendars(currentDateTime, marsSolDay) {
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

function updateFractionalTimes(currentDateTime, dayFraction, dateInput) {
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
}

function updateComputingTimes(currentDateTime, julianDay, marsSolDay) {
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
    setTimeValue('spreadsheet-now-node',getSpreadsheetNowTime(currentDateTime));

    const lunationNumber = calculateLunationNumber(currentDateTime);
    setTimeValue('lunation-number-node', lunationNumber);
    setTimeValue('brown-lunation-number-node', getBrownLunationNumber(lunationNumber));
    setTimeValue('goldstine-lunation-number-node', getGoldstineLunationNumber(lunationNumber));
    setTimeValue('hebrew-lunation-number-node', getHebrewLunationNumber(lunationNumber));
    setTimeValue('islamic-lunation-number-node', getIslamicLunationNumber(lunationNumber));
    setTimeValue('thai-lunation-number-node', getThaiLunationNumber(lunationNumber));
}

function updateProposedCalendars(currentDateTime) {
    setTimeValue('human-era-node', getHumanEra(currentDateTime));
    setTimeValue('invariable-node', getInvariableCalendarDate(currentDateTime));
    setTimeValue('world-calendar-node', getWorldCalendarDate(currentDateTime));
    setTimeValue('symmetry454-node', getSymmetry454Date(currentDateTime));
}

function updateOtherAndDecimalTimes(currentDateTime, dayFraction, marsSolDay) {
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
}