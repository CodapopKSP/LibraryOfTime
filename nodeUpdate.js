/*
    |===================|
    |    Node Update    |
    |===================|

    This is a collection of container functions for updating nodes.
*/

import * as solarCalendars from './Calendars/solarCalendars.js';
import * as proposedCalendars from './Calendars/proposedCalendars.js';
import * as computingTime from './Timekeeping/computingTime.js';
import * as timeFractions from './Timekeeping/timeFractions.js';
import * as otherTime from './Timekeeping/otherTime.js';
import * as decimalTime from './Timekeeping/decimalTime.js';
import * as otherCalendars from './Calendars/otherCalendars.js';
import * as astronomicalData from './Other/astronomicalData.js';
import * as lunisolarCalendars from './Calendars/lunisolarCalendars.js';
import * as lunarCalendars from './Calendars/lunarCalendars.js';
import * as userInterface from './userInterface.js';
import * as utilities from './utilities.js';

export function updateSolarCalendars(currentDateTime, timezoneOffset) {
    const springEquinox = astronomicalData.getSolsticeEquinox(currentDateTime, 'spring');
    userInterface.setTimeValue('gregorian-node', solarCalendars.getGregorianDateTime(currentDateTime, timezoneOffset).date);
    userInterface.setTimeValue('julian-node', solarCalendars.getJulianCalendar(currentDateTime));
    userInterface.setTimeValue('astronomical-node', solarCalendars.getAstronomicalDate(currentDateTime));
    userInterface.setTimeValue('byzantine-node', solarCalendars.getByzantineCalendar(currentDateTime));
    userInterface.setTimeValue('florentine-node', solarCalendars.getFlorentineCalendar(currentDateTime));
    userInterface.setTimeValue('pisan-node', solarCalendars.getPisanCalendar(currentDateTime));
    userInterface.setTimeValue('venetian-node', solarCalendars.getVenetianCalendar(currentDateTime));
    userInterface.setTimeValue('french-republican-node', solarCalendars.getRepublicanCalendar(currentDateTime, astronomicalData.getSolsticeOrEquinox(currentDateTime, 'autumn')));
    userInterface.setTimeValue('era-fascista-node', solarCalendars.getEraFascista(currentDateTime));
    userInterface.setTimeValue('minguo-node', solarCalendars.getMinguo(currentDateTime));
    userInterface.setTimeValue('thai-node', solarCalendars.getThaiSolar(currentDateTime));
    userInterface.setTimeValue('juche-node', solarCalendars.getJuche(currentDateTime));
    userInterface.setTimeValue('coptic-node', solarCalendars.getCopticDate(currentDateTime));
    userInterface.setTimeValue('ethiopian-node', solarCalendars.getEthiopianDate(currentDateTime));
    userInterface.setTimeValue('bahai-node', solarCalendars.getBahaiCalendar(currentDateTime, springEquinox));
    userInterface.setTimeValue('pataphysical-node', solarCalendars.getPataphysicalDate(currentDateTime, timezoneOffset));
    userInterface.setTimeValue('discordian-node', solarCalendars.getDiscordianDate(currentDateTime, timezoneOffset));
    userInterface.setTimeValue('solar-hijri-node', solarCalendars.getSolarHijriDate(currentDateTime, springEquinox));
    userInterface.setTimeValue('qadimi-node', solarCalendars.getQadimiDate(currentDateTime));
    userInterface.setTimeValue('egyptian-civil-node', solarCalendars.getEgyptianDate(currentDateTime));
    userInterface.setTimeValue('iso-week-date-node', solarCalendars.getISOWeekDate(currentDateTime, timezoneOffset));
    userInterface.setTimeValue('haab-node', solarCalendars.getHaabDate(currentDateTime));
}

export function updateLunisolarCalendars(currentDateTime) {
    userInterface.setTimeValue('chinese-node', lunisolarCalendars.getChineseLunisolarCalendarDate(currentDateTime, 'china'));
    userInterface.setTimeValue('sexagenary-year-node', lunisolarCalendars.getSexagenaryYear(currentDateTime));
    userInterface.setTimeValue('vietnamese-node', lunisolarCalendars.getChineseLunisolarCalendarDate(currentDateTime, 'vietnam'));
    userInterface.setTimeValue('dangun-node', lunisolarCalendars.getChineseLunisolarCalendarDate(currentDateTime, 'korea'));
    userInterface.setTimeValue('umm-al-qura-node', lunarCalendars.getUmmalQuraDate(currentDateTime));
}

export function updateOtherCalendars(currentDateTime, marsSolDay) {
    userInterface.setTimeValue('maya-long-count-node', otherCalendars.getCurrentMayaLongCount(currentDateTime));
    userInterface.setTimeValue('tzolkin-node', otherCalendars.getTzolkinDate(currentDateTime));
    userInterface.setTimeValue('lord-of-the-night-node', otherCalendars.getLordOfTheNight(currentDateTime));
    userInterface.setTimeValue('darian-mars-node', otherCalendars.getDarianMarsDate(computingTime.getJulianSolDate(currentDateTime)));
    userInterface.setTimeValue('galilean-io-node', otherCalendars.getGalileanDate(currentDateTime, 'Io'));
    userInterface.setTimeValue('galilean-europa-node', otherCalendars.getGalileanDate(currentDateTime, 'Eu'));
    userInterface.setTimeValue('galilean-ganymede-node', otherCalendars.getGalileanDate(currentDateTime, 'Gan'));
    userInterface.setTimeValue('galilean-callisto-node', otherCalendars.getGalileanDate(currentDateTime, 'Cal'));
    userInterface.setTimeValue('darian-io-node', otherCalendars.getDarianGalileanDate(currentDateTime, 'Io'));
    userInterface.setTimeValue('darian-europa-node', otherCalendars.getDarianGalileanDate(currentDateTime, 'Eu'));
    userInterface.setTimeValue('darian-ganymede-node', otherCalendars.getDarianGalileanDate(currentDateTime, 'Gan'));
    userInterface.setTimeValue('darian-callisto-node', otherCalendars.getDarianGalileanDate(currentDateTime, 'Cal'));
    userInterface.setTimeValue('darian-titan-node', otherCalendars.getDarianTitanDate(currentDateTime));
    userInterface.setTimeValue('yuga-cycle-node', otherCalendars.getYugaCycle(currentDateTime));
    userInterface.setTimeValue('sothic-cycle-node', otherCalendars.getSothicCycle(currentDateTime));
    userInterface.setTimeValue('olympiad-node', otherCalendars.getOlympiad(currentDateTime));
}

export function updateFractionalTimes(currentDateTime, dayFraction, dateInput) {
    userInterface.setTimeValue('day-node', dayFraction.toFixed(utilities.decimals));
    userInterface.setTimeValue('month-node', timeFractions.calculateMonth(currentDateTime).toFixed(utilities.decimals));
    userInterface.setTimeValue('year-node', timeFractions.calculateYear(currentDateTime).toFixed(utilities.decimals));
    userInterface.setTimeValue('hour-node', timeFractions.calculateHour(currentDateTime).toFixed(utilities.decimals));
    userInterface.setTimeValue('minute-node', timeFractions.calculateMinute(currentDateTime).toFixed(utilities.decimals));
    // Create the illusion of actual microsecond calculation
    if ((dateInput === 0)||(dateInput === undefined)) {
        userInterface.setTimeValue('second-node', timeFractions.calculateSecond(currentDateTime));
    } else {
        userInterface.setTimeValue('second-node', '0.0000000000');
    }
    userInterface.setTimeValue('decade-node', timeFractions.calculateDecade(currentDateTime).toFixed(utilities.decimals));
    userInterface.setTimeValue('century-node', timeFractions.calculateCentury(currentDateTime).toFixed(utilities.decimals));
}

export function updateComputingTimes(currentDateTime, timezoneOffset) {
    userInterface.setTimeValue('unix-node', computingTime.getUnixTime(currentDateTime));
    userInterface.setTimeValue('filetime-node', computingTime.getCurrentFiletime(currentDateTime));
    userInterface.setTimeValue('gps-node', computingTime.getGPSTime(currentDateTime));
    userInterface.setTimeValue('julian-period-node', computingTime.getJulianPeriod(currentDateTime));
    userInterface.setTimeValue('rata-die-node', computingTime.getRataDie(currentDateTime));
    userInterface.setTimeValue('tai-node', computingTime.getTAI(currentDateTime).toISOString().slice(0, -5));
    userInterface.setTimeValue('tt-node', computingTime.getTT(currentDateTime).toISOString().slice(0, -5));
    userInterface.setTimeValue('loran-c-node', computingTime.getLORANC(currentDateTime).toISOString().slice(0, -5));
    userInterface.setTimeValue('lilian-date-node', computingTime.getLilianDate(currentDateTime));
    userInterface.setTimeValue('mars-sol-date-node', computingTime.getMarsSolDate(currentDateTime).toFixed(5));
    userInterface.setTimeValue('julian-sol-number-node', computingTime.getJulianSolDate(currentDateTime).toFixed(0));
    userInterface.setTimeValue('julian-circad-number-node', computingTime.getJulianCircadNumber(currentDateTime).toFixed(0));
    userInterface.setTimeValue('kali-ahargaṅa-node', computingTime.getKaliAhargana(currentDateTime).toFixed(0));
    userInterface.setTimeValue('spreadsheet-now-node', computingTime.getSpreadsheetNowTime(currentDateTime, timezoneOffset));

    const lunationNumber = computingTime.calculateLunationNumber(currentDateTime);
    userInterface.setTimeValue('lunation-number-node', lunationNumber);
    userInterface.setTimeValue('brown-lunation-number-node', computingTime.getBrownLunationNumber(lunationNumber));
    userInterface.setTimeValue('goldstine-lunation-number-node', computingTime.getGoldstineLunationNumber(lunationNumber));
    userInterface.setTimeValue('hebrew-lunation-number-node', computingTime.getHebrewLunationNumber(lunationNumber));
    userInterface.setTimeValue('islamic-lunation-number-node', computingTime.getIslamicLunationNumber(lunationNumber));
    userInterface.setTimeValue('thai-lunation-number-node', computingTime.getThaiLunationNumber(lunationNumber));
}

export function updateProposedCalendars(currentDateTime, timezoneOffset) {
    userInterface.setTimeValue('human-era-node', proposedCalendars.getHumanEra(currentDateTime, timezoneOffset));
    userInterface.setTimeValue('invariable-node', proposedCalendars.getInvariableCalendarDate(currentDateTime, timezoneOffset));
    userInterface.setTimeValue('world-calendar-node', proposedCalendars.getWorldCalendarDate(currentDateTime, timezoneOffset));
    userInterface.setTimeValue('symmetry454-node', proposedCalendars.getSymmetry454Date(currentDateTime, timezoneOffset));
}

export function updateOtherAndDecimalTimes(currentDateTime, dayFraction, marsSolDay) {
    // Decimal Time
    userInterface.setTimeValue('revolutionary-time-node', decimalTime.getRevolutionaryTime(dayFraction));
    userInterface.setTimeValue('beat-time-node', decimalTime.convertToSwatchBeats(currentDateTime));
    userInterface.setTimeValue('hexadecimal-node', decimalTime.getHexadecimalTime(dayFraction));
    userInterface.setTimeValue('binary-node', decimalTime.getBinaryTime(dayFraction));

    // Other Time
    userInterface.setTimeValue('coordinated-mars-time-node', otherTime.getMTC(marsSolDay));
    userInterface.setTimeValue('io-meridian-time-node', otherTime.getIoPrimeMeridianTime(currentDateTime));
    userInterface.setTimeValue('europa-meridian-time-node', otherTime.getEuropaPrimeMeridianTime(currentDateTime));
    userInterface.setTimeValue('ganymede-meridian-time-node', otherTime.getGanymedePrimeMeridianTime(currentDateTime));
    userInterface.setTimeValue('callisto-meridian-time-node', otherTime.getCallistoPrimeMeridianTime(currentDateTime));
    userInterface.setTimeValue('titan-meridian-time-node', otherTime.getTitanPrimeMeridianTime(currentDateTime));
}