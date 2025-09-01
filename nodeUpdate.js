/*
    |===================|
    |    Node Update    |
    |===================|

    This is a collection of container functions for updating nodes.
*/

function updateSolarCalendars(currentDateTime, timezoneOffset) {
    const springEquinox = getSolsticeEquinox(currentDateTime, 'spring');
    setTimeValue('gregorian-node', getGregorianDateTime(currentDateTime, timezoneOffset).date);
    setTimeValue('julian-node', getJulianCalendar(currentDateTime));
    setTimeValue('astronomical-node', getAstronomicalDate(currentDateTime));
    setTimeValue('byzantine-node', getByzantineCalendar(currentDateTime));
    setTimeValue('florentine-node', getFlorentineCalendar(currentDateTime));
    setTimeValue('pisan-node', getPisanCalendar(currentDateTime));
    setTimeValue('venetian-node', getVenetianCalendar(currentDateTime));
    setTimeValue('french-republican-node', getRepublicanCalendar(currentDateTime, getSolsticeEquinox(currentDateTime, 'autumn')));
    setTimeValue('era-fascista-node', getEraFascista(currentDateTime));
    setTimeValue('minguo-node', getMinguo(currentDateTime));
    setTimeValue('thai-node', getThaiSolar(currentDateTime));
    setTimeValue('juche-node', getJuche(currentDateTime));
    setTimeValue('coptic-node', getCopticDate(currentDateTime));
    setTimeValue('ethiopian-node', getEthiopianDate(currentDateTime));
    setTimeValue('bahai-node', getBahaiCalendar(currentDateTime, springEquinox));
    setTimeValue('pataphysical-node', getPataphysicalDate(currentDateTime, timezoneOffset));
    setTimeValue('discordian-node', getDiscordianDate(currentDateTime, timezoneOffset));
    setTimeValue('solar-hijri-node', getSolarHijriDate(currentDateTime, springEquinox));
    setTimeValue('qadimi-node', getQadimiDate(currentDateTime));
    setTimeValue('egyptian-civil-node', getEgyptianDate(currentDateTime));
    setTimeValue('iso-week-date-node', getISOWeekDate(currentDateTime, timezoneOffset));
    setTimeValue('haab-node', getHaabDate(currentDateTime));
}

function updateLunisolarCalendars(currentDateTime) {
    setTimeValue('chinese-node', getChineseLunisolarCalendarDate(currentDateTime, 'china'));
    setTimeValue('sexagenary-year-node', getSexagenaryYear(currentDateTime));
    setTimeValue('vietnamese-node', getChineseLunisolarCalendarDate(currentDateTime, 'vietnam'));
    setTimeValue('dangun-node', getChineseLunisolarCalendarDate(currentDateTime, 'korea'));
    setTimeValue('umm-al-qura-node', getUmmalQuraDate(currentDateTime));
}

function updateOtherCalendars(currentDateTime) {
    setTimeValue('maya-long-count-node', getCurrentMayaLongCount(currentDateTime));
    setTimeValue('tzolkin-node', getTzolkinDate(currentDateTime));
    setTimeValue('lord-of-the-night-node', getLordOfTheNight(currentDateTime));
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

function updateFractionalTimes(currentDateTime, dateInput, timezoneOffset) {
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

function updateComputingTimes(currentDateTime, timezoneOffset) {
    setTimeValue('unix-node', getUnixTime(currentDateTime));
    setTimeValue('filetime-node', getCurrentFiletime(currentDateTime));
    setTimeValue('gps-node', getGPSTime(currentDateTime));
    setTimeValue('julian-period-node', getJulianPeriod(currentDateTime));
    setTimeValue('rata-die-node', getRataDie(currentDateTime));
    setTimeValue('tai-node', getTAI(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('tt-node', getTT(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('loran-c-node', getLORANC(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('lilian-date-node', getLilianDate(currentDateTime));
    setTimeValue('ordinal-date-node', getOrdinalDate(currentDateTime));
    setTimeValue('mars-sol-date-node', getMarsSolDate(currentDateTime).toFixed(5));
    setTimeValue('julian-sol-number-node', getJulianSolDate(currentDateTime).toFixed(0));
    setTimeValue('julian-circad-number-node', getJulianCircadNumber(currentDateTime).toFixed(0));
    setTimeValue('kali-ahargaṅa-node', getKaliAhargana(currentDateTime).toFixed(0));
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
    setTimeValue('world-calendar-node', getWorldCalendarDate(currentDateTime, timezoneOffset));
    setTimeValue('symmetry454-node', getSymmetry454Date(currentDateTime, timezoneOffset));
    setTimeValue('symmetry010-node', getSymmetry010Date(currentDateTime, timezoneOffset));
}

function updateOtherAndDecimalTimes(currentDateTime, timezoneOffset) {
    // Decimal Time
    setTimeValue('revolutionary-time-node', getRevolutionaryTime(currentDateTime, timezoneOffset));
    setTimeValue('beat-time-node', convertToSwatchBeats(currentDateTime));
    setTimeValue('hexadecimal-node', getHexadecimalTime(currentDateTime, timezoneOffset));
    setTimeValue('binary-node', getBinaryTime(currentDateTime, timezoneOffset));

    // Other Time
    setTimeValue('coordinated-mars-time-node', getMTC(currentDateTime));
    setTimeValue('io-meridian-time-node', getIoPrimeMeridianTime(currentDateTime));
    setTimeValue('europa-meridian-time-node', getEuropaPrimeMeridianTime(currentDateTime));
    setTimeValue('ganymede-meridian-time-node', getGanymedePrimeMeridianTime(currentDateTime));
    setTimeValue('callisto-meridian-time-node', getCallistoPrimeMeridianTime(currentDateTime));
    setTimeValue('titan-meridian-time-node', getTitanPrimeMeridianTime(currentDateTime));
}