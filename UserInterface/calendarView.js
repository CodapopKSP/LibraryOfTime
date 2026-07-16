/*
    |=====================|
    |   Calendar View     |
    |=====================|
    Opens a basic Gregorian calendar of the current month.
    The system shown in the grid (month shading and per-day values) uses
    _calendarViewDisplayNodeId, updated by this modal’s dropdown, opening the
    modal while a node is selected, or the Select (◎) button — not by browsing
    the grid or Home (see calendarViewBootstrapDisplayFromMainIfNeeded).
*/

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Map of node id (e.g. 'chinese', 'unix') to a getter(dt, tzOffset) returning a string.
 * tzOffset = minutes from UTC (from convertUTCOffsetToMinutes).
 * Used to display the selected system's output for each day at midnight.
 */
function buildNodeValueGetters(tzOffset) {
    var offset = (typeof tzOffset === 'number') ? tzOffset : (typeof getDatePickerTimezone === 'function' && typeof convertUTCOffsetToMinutes === 'function' ? convertUTCOffsetToMinutes(getDatePickerTimezone()) : 0);
    var lunationNum = function (dt) {
        return typeof calculateLunationNumber === 'function' ? calculateLunationNumber(dt) : 0;
    };
    return {
        'gregorian': function (dt) { return typeof getGregorianDateTime === 'function' ? getGregorianDateTime(dt, offset) : ''; },
        'julian': function (dt) { return typeof getJulianCalendar === 'function' ? getJulianCalendar(dt) : ''; },
        'astronomical': function (dt) { return typeof getAstronomicalDate === 'function' ? getAstronomicalDate(dt) : ''; },
        'byzantine': function (dt) { return typeof getByzantineCalendar === 'function' ? getByzantineCalendar(dt) : ''; },
        'florentine': function (dt) { return typeof getFlorentineCalendar === 'function' ? getFlorentineCalendar(dt) : ''; },
        'pisan': function (dt) { return typeof getPisanCalendar === 'function' ? getPisanCalendar(dt) : ''; },
        'venetian': function (dt) { return typeof getVenetianCalendar === 'function' ? getVenetianCalendar(dt) : ''; },
        'french-republican': function (dt) { return typeof getRepublicanCalendar === 'function' ? getRepublicanCalendar(dt) : ''; },
        'era-fascista': function (dt) { return typeof getEraFascista === 'function' ? getEraFascista(dt) : ''; },
        'minguo': function (dt) { return typeof getMinguo === 'function' ? getMinguo(dt) : ''; },
        'thai': function (dt) { return typeof getThaiSolar === 'function' ? getThaiSolar(dt) : ''; },
        'bengali': function (dt) { return typeof getBengaliSolarDate === 'function' ? getBengaliSolarDate(dt, offset) : ''; },
        'juche': function (dt) { return typeof getJuche === 'function' ? getJuche(dt) : ''; },
        'armenian': function (dt) { return typeof getArmenianSolarDate === 'function' ? getArmenianSolarDate(dt, offset) : ''; },
        'coptic': function (dt) { return typeof getCopticDate === 'function' ? getCopticDate(dt) : ''; },
        'geez': function (dt) { return typeof getEthiopianDate === 'function' ? getEthiopianDate(dt) : ''; },
        'bahai': function (dt) { var seq = typeof getSolsticeEquinox === 'function' ? getSolsticeEquinox(dt, 'SPRING') : null; return typeof getBahaiCalendar === 'function' && seq ? getBahaiCalendar(dt, seq) : ''; },
        'pataphysical': function (dt) { return typeof getPataphysicalDate === 'function' ? getPataphysicalDate(dt, offset) : ''; },
        'discordian': function (dt) { return typeof getDiscordianDate === 'function' ? getDiscordianDate(dt, offset) : ''; },
        'solar-hijri': function (dt) { var seq = typeof getSolsticeEquinox === 'function' ? getSolsticeEquinox(dt, 'SPRING') : null; return typeof getSolarHijriDate === 'function' && seq ? getSolarHijriDate(dt, seq) : ''; },
        'qadimi': function (dt) { return typeof getQadimiDate === 'function' ? getQadimiDate(dt) : ''; },
        'mandaean': function (dt) { return typeof getMandaeanDate === 'function' ? getMandaeanDate(dt) : ''; },
        'nakaiy': function (dt) { return typeof getNakaiyDate === 'function' ? getNakaiyDate(dt) : ''; },
        'igbo': function (dt) { return typeof getIgboDate === 'function' ? getIgboDate(dt, offset) : ''; },
        'egyptian-civil': function (dt) { return typeof getEgyptianDate === 'function' ? getEgyptianDate(dt) : ''; },
        'iso-week-date': function (dt) { return typeof getISOWeekDate === 'function' ? getISOWeekDate(dt, offset) : ''; },
        'haab': function (dt) { return typeof getHaabDate === 'function' ? getHaabDate(dt) : ''; },
        'anno-lucis': function (dt) { return typeof getAnnoLucisDate === 'function' ? getAnnoLucisDate(dt, offset) : ''; },
        'tabot': function (dt) { return typeof getTabotDate === 'function' ? getTabotDate(dt) : ''; },
        'icelandic': function (dt) { return typeof getIcelandicDate === 'function' ? getIcelandicDate(dt) : ''; },
        'saka-samvat': function (dt) { return typeof getSakaSamvatDate === 'function' ? getSakaSamvatDate(dt) : ''; },
        'sca': function (dt) { return typeof getSocietyForCreativeAnachronismDate === 'function' ? getSocietyForCreativeAnachronismDate(dt, offset) : ''; },
        'solar-term': function (dt) { return typeof getSolarTermCalendar === 'function' ? getSolarTermCalendar(dt) : ''; },
        'japanese-solar-term': function (dt) { return typeof getJapaneseSolarTermCalendar === 'function' ? getJapaneseSolarTermCalendar(dt) : ''; },
        'chinese': function (dt) { return typeof getChineseLunisolarCalendarDate === 'function' ? getChineseLunisolarCalendarDate(dt, 'CHINA') : ''; },
        'sexagenary-year': function (dt) { return typeof getSexagenaryYear === 'function' ? getSexagenaryYear(dt) : ''; },
        'japanese': function (dt) { return typeof getJapaneseLunisolarCalendarDate === 'function' ? getJapaneseLunisolarCalendarDate(dt) : ''; },
        'dai-lich': function (dt) { return typeof getChineseLunisolarCalendarDate === 'function' ? getChineseLunisolarCalendarDate(dt, 'VIETNAM') : ''; },
        'dangun': function (dt) { return typeof getChineseLunisolarCalendarDate === 'function' ? getChineseLunisolarCalendarDate(dt, 'KOREA') : ''; },
        'babylonian': function (dt) { return typeof getBabylonianLunisolarCalendar === 'function' ? getBabylonianLunisolarCalendar(dt) : ''; },
        'umm-al-qura': function (dt) { return typeof getUmmalQuraDate === 'function' ? getUmmalQuraDate(dt) : ''; },
        'hebrew': function (dt) { return typeof calculateHebrewCalendar === 'function' ? calculateHebrewCalendar(dt) : ''; },
        'epirote': function (dt) { return typeof getEpiroteCalendar === 'function' ? getEpiroteCalendar(dt) : ''; },
        'maya-long-count': function (dt) { return typeof getCurrentMayaLongCount === 'function' ? getCurrentMayaLongCount(dt) : ''; },
        'tzolkin': function (dt) { return typeof getTzolkinDate === 'function' ? getTzolkinDate(dt) : ''; },
        'lord-of-the-night-y': function (dt) { return typeof getLordOfTheNight === 'function' ? getLordOfTheNight(dt) : ''; },
        'darian-mars': function (dt) { return typeof getJulianSolDate === 'function' && typeof getDarianMarsDate === 'function' ? getDarianMarsDate(getJulianSolDate(dt)) : ''; },
        'galilean-io': function (dt) { return typeof getGalileanDate === 'function' ? getGalileanDate(dt, 'Io') : ''; },
        'galilean-europa': function (dt) { return typeof getGalileanDate === 'function' ? getGalileanDate(dt, 'Eu') : ''; },
        'galilean-ganymede': function (dt) { return typeof getGalileanDate === 'function' ? getGalileanDate(dt, 'Gan') : ''; },
        'galilean-callisto': function (dt) { return typeof getGalileanDate === 'function' ? getGalileanDate(dt, 'Cal') : ''; },
        'darian-io': function (dt) { return typeof getDarianGalileanDate === 'function' ? getDarianGalileanDate(dt, 'Io') : ''; },
        'darian-europa': function (dt) { return typeof getDarianGalileanDate === 'function' ? getDarianGalileanDate(dt, 'Eu') : ''; },
        'darian-ganymede': function (dt) { return typeof getDarianGalileanDate === 'function' ? getDarianGalileanDate(dt, 'Gan') : ''; },
        'darian-callisto': function (dt) { return typeof getDarianGalileanDate === 'function' ? getDarianGalileanDate(dt, 'Cal') : ''; },
        'darian-titan': function (dt) { return typeof getDarianTitanDate === 'function' ? getDarianTitanDate(dt) : ''; },
        'yuga-cycle': function (dt) { return typeof getYugaCycle === 'function' ? getYugaCycle(dt) : ''; },
        'sothic-cycle': function (dt) { return typeof getSothicCycle === 'function' ? getSothicCycle(dt) : ''; },
        'olympiad': function (dt) { return typeof getOlympiad === 'function' ? getOlympiad(dt) : ''; },
        'pawukon': function (dt) { return typeof getPawukonCalendarDate === 'function' ? getPawukonCalendarDate(dt) : ''; },
        'galactic-tick-day': function (dt) { return typeof getGalacticTickDay === 'function' ? getGalacticTickDay(dt) : ''; },
        'togys-esebi': function (dt) { return typeof getTogysDate === 'function' ? getTogysDate(dt) : ''; },
        'julian-period': function (dt) { return typeof getJulianPeriod === 'function' ? getJulianPeriod(dt) : ''; },
        'rata-die': function (dt) { return typeof getRataDie === 'function' ? getRataDie(dt) : ''; },
        'lilian-date': function (dt) { return typeof getLilianDate === 'function' ? getLilianDate(dt) : ''; },
        'ordinal-date': function (dt) { return typeof getOrdinalDate === 'function' ? getOrdinalDate(dt) : ''; },
        'julian-sol-number': function (dt) { return typeof getJulianSolDate === 'function' ? getJulianSolDate(dt).toFixed(0) : ''; },
        'julian-circad-number': function (dt) { return typeof getJulianCircadNumber === 'function' ? getJulianCircadNumber(dt).toFixed(0) : ''; },
        'kali-ahargana': function (dt) { return typeof getKaliAhargana === 'function' ? getKaliAhargana(dt).toFixed(0) : ''; },
        'deltat': function (dt) { return typeof getDeltaT === 'function' ? getDeltaT(dt) : ''; },
        'spreadsheet-now': function (dt) { return typeof getSpreadsheetNowTime === 'function' ? getSpreadsheetNowTime(dt, offset) : ''; },
        'lunation-number': function (dt) { return String(lunationNum(dt)); },
        'brown-lunation-number': function (dt) { return typeof getBrownLunationNumber === 'function' ? getBrownLunationNumber(lunationNum(dt)) : ''; },
        'goldstine-lunation-number': function (dt) { return typeof getGoldstineLunationNumber === 'function' ? getGoldstineLunationNumber(lunationNum(dt)) : ''; },
        'hebrew-lunation-number': function (dt) { return typeof getHebrewLunationNumber === 'function' ? getHebrewLunationNumber(lunationNum(dt)) : ''; },
        'islamic-lunation-number': function (dt) { return typeof getIslamicLunationNumber === 'function' ? getIslamicLunationNumber(lunationNum(dt)) : ''; },
        'thai-lunation-number': function (dt) { return typeof getThaiLunationNumber === 'function' ? getThaiLunationNumber(lunationNum(dt)) : ''; },
        'nabonassar-lunation-number': function (dt) { return typeof getNabonassarLunationNumber === 'function' ? getNabonassarLunationNumber(lunationNum(dt)) : ''; },
        'human-era': function (dt) { return typeof getHumanEra === 'function' ? getHumanEra(dt, offset) : ''; },
        'mpslc': function (dt) { return typeof getMPSLCDate === 'function' ? getMPSLCDate(dt, offset) : ''; },
        'invariable': function (dt) { return typeof getInvariableCalendarDate === 'function' ? getInvariableCalendarDate(dt, offset) : ''; },
        'the-world-calendar': function (dt) { return typeof getWorldCalendarDate === 'function' ? getWorldCalendarDate(dt, offset) : ''; },
        'symmetry454': function (dt) { return typeof getSymmetry454Date === 'function' ? getSymmetry454Date(dt, offset) : ''; },
        'symmetry010': function (dt) { return typeof getSymmetry010Date === 'function' ? getSymmetry010Date(dt, offset) : ''; },
        'positivist': function (dt) { return typeof getPositivistDate === 'function' ? getPositivistDate(dt, offset) : ''; },
        'yerm': function (dt) { return typeof getYermDate === 'function' ? getYermDate(dt, offset) : ''; },
        'tamrielic': function (dt) { return typeof getTamrielicDate === 'function' ? getTamrielicDate(dt, offset) : ''; },
        'imperial-dating-system': function (dt) { return typeof getImperialDatingSystem === 'function' ? getImperialDatingSystem(dt, offset) : ''; },
        'shire': function (dt) { return typeof getShireDate === 'function' ? getShireDate(dt, offset) : ''; },
        'french-revolutionary': function (dt) { return typeof getRevolutionaryTime === 'function' ? getRevolutionaryTime(dt, offset) : ''; },
        'beat': function (dt) { return typeof convertToSwatchBeats === 'function' ? convertToSwatchBeats(dt) : ''; },
        'hexadecimal': function (dt) { return typeof getHexadecimalTime === 'function' ? getHexadecimalTime(dt, offset) : ''; },
        'binary-16-bit': function (dt) { return typeof getBinaryTime === 'function' ? getBinaryTime(dt, offset) : ''; },
        'babylonian-time': function (dt) { return typeof getBabylonianTime === 'function' ? getBabylonianTime(dt, offset) : ''; },
        'helek': function (dt) { return typeof getHelek === 'function' ? getHelek(dt, offset) : ''; },
        'thai-time': function (dt) { return typeof getThaiTime === 'function' ? getThaiTime(dt, offset) : ''; },
        'zoroastrian': function (dt) { return typeof getZoroastrianGahTime === 'function' ? getZoroastrianGahTime(dt, offset) : ''; },
        'coordinated-mars-time': function (dt) { return typeof getMTC === 'function' ? getMTC(dt) : ''; },
        'io-meridian-time': function (dt) { return typeof getIoPrimeMeridianTime === 'function' ? getIoPrimeMeridianTime(dt) : ''; },
        'europa-meridian-time': function (dt) { return typeof getEuropaPrimeMeridianTime === 'function' ? getEuropaPrimeMeridianTime(dt) : ''; },
        'ganymede-meridian-time': function (dt) { return typeof getGanymedePrimeMeridianTime === 'function' ? getGanymedePrimeMeridianTime(dt) : ''; },
        'callisto-meridian-time': function (dt) { return typeof getCallistoPrimeMeridianTime === 'function' ? getCallistoPrimeMeridianTime(dt) : ''; },
        'titan-meridian-time': function (dt) { return typeof getTitanPrimeMeridianTime === 'function' ? getTitanPrimeMeridianTime(dt) : ''; },
        'us-presidential-terms': function (dt) { return typeof getCurrentPresidentialTerm === 'function' ? getCurrentPresidentialTerm(dt).toFixed(10) : ''; },
        'julian-day-number': function (dt) { return typeof getJulianDayNumber === 'function' ? getJulianDayNumber(dt) : ''; },
        'iso-8601': function (dt) { return dt ? dt.toISOString() : ''; },
        'mars-sol-date': function (dt) { return typeof getMarsSolDate === 'function' ? getMarsSolDate(dt).toFixed(5) : ''; },
        'minecraft-time': function (dt) { return typeof getMinecraftTime === 'function' ? getMinecraftTime(dt, offset) : ''; },
        'dream-time': function (dt) { return typeof getInceptionDreamTime === 'function' ? getInceptionDreamTime(dt, offset) : ''; },
        'termina-time': function (dt) { return typeof getTerminaTime === 'function' ? getTerminaTime(dt, offset) : ''; },
        'stardate': function (dt) { return typeof getStardate === 'function' ? getStardate(dt, offset) : ''; },
        'day': function (dt) { return typeof calculateDay === 'function' && typeof decimals !== 'undefined' ? calculateDay(dt, offset).toFixed(decimals) : ''; },
        'month': function (dt) { return typeof calculateMonth === 'function' && typeof decimals !== 'undefined' ? calculateMonth(dt, offset).toFixed(decimals) : ''; },
        'year': function (dt) { return typeof calculateYear === 'function' && typeof decimals !== 'undefined' ? calculateYear(dt, offset).toFixed(decimals) : ''; },
        'hour': function (dt) { return typeof calculateHour === 'function' && typeof decimals !== 'undefined' ? calculateHour(dt, offset).toFixed(decimals) : ''; },
        'minute': function (dt) { return typeof calculateMinute === 'function' && typeof decimals !== 'undefined' ? calculateMinute(dt).toFixed(decimals) : ''; },
        'second': function (dt) { return typeof calculateSecond === 'function' ? calculateSecond(dt) : ''; },
        'decade': function (dt) { return typeof calculateDecade === 'function' && typeof decimals !== 'undefined' ? calculateDecade(dt, offset).toFixed(decimals) : ''; },
        'century': function (dt) { return typeof calculateCentury === 'function' && typeof decimals !== 'undefined' ? calculateCentury(dt, offset).toFixed(decimals) : ''; },
        'local-time': function (dt) { return typeof getGregorianDateTime === 'function' ? getGregorianDateTime(dt, offset).time : ''; },
        'utc': function (dt) { return dt ? dt.toISOString().slice(0, -5) : ''; },
        'millennium': function (dt) { return typeof calculateMillennium === 'function' && typeof decimals !== 'undefined' ? calculateMillennium(dt, offset).toFixed(decimals) : ''; },
        'unix': function (dt) { return typeof getUnixTime === 'function' ? getUnixTime(dt) : ''; },
        'unix-hex': function (dt) { return typeof getUnixTimeHex === 'function' ? getUnixTimeHex(dt) : ''; },
        'filetime': function (dt) { return typeof getCurrentFiletime === 'function' ? getCurrentFiletime(dt) : ''; },
        'chrome': function (dt) { return typeof getChromeTimestampMicroseconds === 'function' ? getChromeTimestampMicroseconds(dt) : ''; },
        'net-datetime-ticks': function (dt) { return typeof getDotNetDateTimeTicks === 'function' ? getDotNetDateTimeTicks(dt) : ''; },
        'cocoa-core-data': function (dt) { return typeof getCocoaCoreDataSeconds === 'function' ? getCocoaCoreDataSeconds(dt) : ''; },
        'mac-hfs': function (dt) { return typeof getMacHfsPlusSeconds === 'function' ? getMacHfsPlusSeconds(dt) : ''; },
        'ntp': function (dt) { return typeof getNtpTimestampSeconds === 'function' ? getNtpTimestampSeconds(dt) : ''; },
        'dos-fatfat32': function (dt) { return typeof getDosFatTimestamp === 'function' ? getDosFatTimestamp(dt, offset) : ''; },
        'sas-4gl': function (dt) { return typeof getSas4glDatetime === 'function' ? getSas4glDatetime(dt) : ''; },
        'gps': function (dt) { return typeof getGPSTime === 'function' ? getGPSTime(dt) : ''; },
        'gps-week-number': function (dt) { return typeof getGpsWeekNumberAndSecondsOfWeek === 'function' ? getGpsWeekNumberAndSecondsOfWeek(dt) : ''; },
        'tai': function (dt) { return typeof getTAI === 'function' ? getTAI(dt).toISOString().slice(0, -5) : ''; },
        'tt': function (dt) { return typeof getTT === 'function' ? getTT(dt).toISOString().slice(0, -5) : ''; },
        'loran-c': function (dt) { return typeof getLORANC === 'function' ? getLORANC(dt).toISOString().slice(0, -5) : ''; }
    };
}

/** Midnight instant of Gregorian { year, month, day } in the picker's timezone, or null. */
function instantForGregorianParts(parts) {
    if (typeof parseGregorianDate !== 'function') return null;
    var dateStr = parts.year + '-' + String(parts.month).padStart(2, '0') + '-' + String(parts.day).padStart(2, '0') + ', 00:00:00';
    var tz = typeof getDatePickerTimezone === 'function' ? getDatePickerTimezone() : 'UTC+00:00';
    try {
        // Gregorian-only parse: the grid is framed in Gregorian dates even
        // when a non-Gregorian input calendar is selected in the picker
        return parseGregorianDate(dateStr, tz);
    } catch (e) {
        return null;
    }
}

/** Returns { display, monthKey, day, monthValue, dayOfWeek, other } when a calendar is selected, or null. */
function getNodeValueForDay(nodeId, year, month, day, getters) {
    if (!nodeId) return null;
    var dt = instantForGregorianParts({ year: year, month: month, day: day });
    if (!dt) return null;
    return getNodeValueAtInstant(nodeId, dt, getters);
}

/** Same normalization as getNodeValueForDay, but for an arbitrary instant. */
function getNodeValueAtInstant(nodeId, dt, getters) {
    var getter = getters ? getters[nodeId] : null;
    if (!getter) return null;
    try {
        var raw = getter(dt);
        if (raw == null) return null;
        var display = typeof out === 'function' ? out(raw) : String(raw);
        var monthKey = '';
        var isObj = raw && typeof raw === 'object';
        if (isObj && raw.month != null) {
            var m = raw.month, y = raw.year;
            monthKey = (y != null && y !== '') ? String(y) + '-' + String(m) : String(m);
        }
        return {
            display: display,
            monthKey: monthKey,
            day: isObj ? raw.day : undefined,
            monthValue: isObj ? raw.month : undefined,
            dayOfWeek: isObj ? raw.dayOfWeek : undefined,
            other: isObj ? raw.other : undefined
        };
    } catch (e) {
        return null;
    }
}

function getDaysInMonth(year, month) {
    var lastDay = createAdjustedDateTime({ year: year, month: month + 1, day: 0 });
    return lastDay.getUTCDate();
}

function getFirstDayOfMonth(year, month) {
    var firstDay = createAdjustedDateTime({ year: year, month: month, day: 1 });
    return firstDay.getUTCDay();
}

/** Gregorian { year, month (1-based), day } of the date picker's selected date, falling back to today. */
function getSelectedGregorianDateParts() {
    var year, month, day;
    var dateStr = typeof getDatePickerTime === 'function' ? getDatePickerTime() : '';
    var inputConfig = (typeof getInputCalendarConfig === 'function' && typeof getCalendarType === 'function')
        ? getInputCalendarConfig(getCalendarType()) : null;
    if (dateStr && inputConfig && typeof parseInputDate === 'function' && typeof createFauxUTCDate === 'function') {
        // The picker string holds input-calendar components (e.g. a Chinese
        // date); resolve it to an instant and read the Gregorian wall date in
        // the picker timezone.
        try {
            var tz = typeof getDatePickerTimezone === 'function' ? getDatePickerTimezone() : 'UTC+00:00';
            var local = createFauxUTCDate(parseInputDate(dateStr, tz), tz);
            year = local.getUTCFullYear();
            month = local.getUTCMonth() + 1;
            day = local.getUTCDate();
        } catch (e) {}
    } else if (dateStr) {
        var datePart = dateStr.split(', ')[0];
        var parts = datePart ? datePart.replace(/^-/, '').split('-') : [];
        year = parseInt(parts[0] || '0', 10);
        month = parseInt(parts[1] || '1', 10);
        day = parseInt(parts[2] || '1', 10);
        if (datePart && datePart.startsWith('-')) year = -year;
    }
    if (year == null || Number.isNaN(year) || Number.isNaN(month) || month < 1 || month > 12 || Number.isNaN(day) || day < 1) {
        var now = new Date();
        year = now.getFullYear();
        month = now.getMonth() + 1;
        day = now.getDate();
    }
    return { year: year, month: month, day: day };
}

/** Shifts Gregorian date parts by whole days (setUTCDate handles month/year rollover for all years). */
function shiftGregorianDayParts(parts, delta) {
    var dt = createAdjustedDateTime({ year: parts.year, month: parts.month, day: parts.day });
    dt.setUTCDate(dt.getUTCDate() + delta);
    return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
}

/** exactStart (optional Date): the cell is a sol/circad starting at this instant — show its date AND time. */
function formatDateTooltip(year, month, day, eventLabels, systemLabel, systemValue, exactStart) {
    var gregorianText = '—';
    if (typeof parseGregorianDate === 'function' && typeof getGregorianDateTime === 'function' && typeof getDatePickerTimezone === 'function' && typeof convertUTCOffsetToMinutes === 'function') {
        try {
            var tz = getDatePickerTimezone();
            var offset = convertUTCOffsetToMinutes(tz);
            var dt = exactStart || parseGregorianDate(year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0') + ', 00:00:00', tz);
            var raw = getGregorianDateTime(dt, offset);
            gregorianText = (raw && raw.output != null) ? raw.output : '';
            if (exactStart && raw && raw.time) {
                gregorianText += '\n' + raw.time + ' (start)';
            }
        } catch (e) {}
    }
    var sections = ['Gregorian:\n' + gregorianText];
    if (systemLabel) {
        var calendarText = (systemValue != null && systemValue !== '') ? systemValue : '—';
        sections.push(systemLabel + ':\n' + calendarText);
    }
    if (eventLabels && eventLabels.length > 0) {
        sections.push('Astronomical Event:\n' + eventLabels.join(', '));
    }
    return sections.join('\n\n');
}

var ASTRONOMICAL_ICONS = {
    'spring-equinox': { symbol: '\u2648', title: 'Vernal (Spring) Equinox' },
    'summer-solstice': { symbol: '\u264B', title: 'Summer Solstice' },
    'autumn-equinox': { symbol: '\u264E', title: 'Autumnal Equinox' },
    'winter-solstice': { symbol: '\u2651', title: 'Winter Solstice' },
    'new-moon': { symbol: '\u25CB', title: 'New Moon' },
    'first-quarter': { symbol: '\u25D0', title: 'First Quarter Moon' },
    'full-moon': { symbol: '\u25CF', title: 'Full Moon' },
    'last-quarter': { symbol: '\u25D1', title: 'Last Quarter Moon' },
    'solar-eclipse': { symbol: '\u2297', title: 'Solar Eclipse' },
    'lunar-eclipse': { symbol: '\u263E', title: 'Lunar Eclipse' }
};

function getAstronomicalEventsForMonth(year, month) {
    var eventsByDay = {};
    var refDate = createAdjustedDateTime({ year: year, month: month, day: 15 });

    function addEvent(day, key) {
        if (!eventsByDay[day]) eventsByDay[day] = [];
        if (eventsByDay[day].indexOf(key) === -1) eventsByDay[day].push(key);
    }

    try {
        var seasons = [
            ['SPRING', 'spring-equinox'],
            ['SUMMER', 'summer-solstice'],
            ['AUTUMN', 'autumn-equinox'],
            ['WINTER', 'winter-solstice']
        ];
        for (var s = 0; s < seasons.length; s++) {
            var d = getSolsticeOrEquinox(refDate, seasons[s][0]);
            if (d.getUTCFullYear() === year && d.getUTCMonth() === month - 1) {
                addEvent(d.getUTCDate(), seasons[s][1]);
            }
        }
    } catch (e) {}

    try {
        var lunationOffsets = [
            [-2, -1, 0, 1, 2],
            [-1.5, -0.5, 0.5, 1.5],
            [-1.25, -0.75, 0.25, 1.25],
            [-1.75, -0.25, 0.75, 1.75]
        ];
        var phaseKeys = ['new-moon', 'full-moon', 'first-quarter', 'last-quarter'];
        for (var p = 0; p < 4; p++) {
            for (var i = 0; i < lunationOffsets[p].length; i++) {
                var phaseDate = getMoonPhase(refDate, lunationOffsets[p][i]);
                if (phaseDate.getUTCFullYear() === year && phaseDate.getUTCMonth() === month - 1) {
                    addEvent(phaseDate.getUTCDate(), phaseKeys[p]);
                }
            }
        }
    } catch (e) {}

    try {
        var refDate = createAdjustedDateTime({ year: year, month: month, day: 15 });
        for (var attempt = -2; attempt <= 2; attempt++) {
            var solarStr = trySolarLunarEclipseAtModifier(refDate, attempt, false);
            if (solarStr) {
                var firstLine = solarStr.split('\n')[0];
                var eclipseDate = parseDateFromUTCStringLine(firstLine);
                if (eclipseDate && eclipseDate.getUTCFullYear() === year && eclipseDate.getUTCMonth() === month - 1) {
                    addEvent(eclipseDate.getUTCDate(), 'solar-eclipse');
                }
            }
            var lunarStr = trySolarLunarEclipseAtModifier(refDate, attempt + 0.5, true);
            if (lunarStr) {
                var lunarFirst = lunarStr.split('\n')[0];
                var lunarDate = parseDateFromUTCStringLine(lunarFirst);
                if (lunarDate && lunarDate.getUTCFullYear() === year && lunarDate.getUTCMonth() === month - 1) {
                    addEvent(lunarDate.getUTCDate(), 'lunar-eclipse');
                }
            }
        }
    } catch (e) {}

    return eventsByDay;
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '&#10;');
}

/** Light background tints for calendar month shading (on dark base). Six distinct hues so no color repeats within any six-month span. */

var CALENDAR_MONTH_SHADES = [
    'rgba(54, 86, 148, 0.2)',
    'rgba(97, 50, 129, 0.2)',
    'rgba(35, 114, 98, 0.2)',
    'rgba(116, 79, 32, 0.2)',
    'rgba(116, 40, 70, 0.2)',
    'rgba(68, 112, 39, 0.2)'
];

function hashMonthKey(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
    return Math.abs(h);
}

/** Fixed cycle for numeric months; hash for composite (year-month) or named months. */
function getShadeForMonthKey(monthKey, monthKeyToIndex) {
    if (!monthKey) return '';
    var idx;
    if (monthKey.indexOf('-') >= 0) {
        idx = hashMonthKey(monthKey) % CALENDAR_MONTH_SHADES.length;
    } else {
        var n = parseInt(monthKey, 10);
        if (!isNaN(n) && n >= 0 && n <= 31) {
            idx = n % CALENDAR_MONTH_SHADES.length;
        } else {
            if (!monthKeyToIndex) return '';
            if (!(monthKey in monthKeyToIndex)) {
                monthKeyToIndex[monthKey] = Object.keys(monthKeyToIndex).length;
            }
            idx = monthKeyToIndex[monthKey] % CALENDAR_MONTH_SHADES.length;
        }
    }
    return CALENDAR_MONTH_SHADES[idx];
}

/**
 * Which calendar/timekeeping system the calendar modal draws (month shading and cell values).
 * Independent of the main grid/description selection (selectedNodeData).
 */
var _calendarViewDisplayNodeId = null;

function normalizeCalendarViewNodeId(nodeId) {
    if (!nodeId) return null;
    var id = String(nodeId);
    if (id.endsWith('-node')) {
        id = id.slice(0, -5);
    }
    if (id === 'togys') {
        return 'togys-esebi';
    }
    return id;
}

function syncCalendarViewDisplayFromMainSelection(nodeId) {
    _calendarViewDisplayNodeId = normalizeCalendarViewNodeId(nodeId);
}

function findCalendarNodeDataById(nodeId) {
    var id = normalizeCalendarViewNodeId(nodeId);
    if (!id) return null;
    if (typeof window.findNodeDataById === 'function') {
        return window.findNodeDataById(id);
    }
    if (typeof nodeDataArrays === 'undefined' || !nodeDataArrays) {
        return null;
    }
    for (var i = 0; i < nodeDataArrays.length; i++) {
        var arr = nodeDataArrays[i];
        for (var j = 0; j < arr.length; j++) {
            if (arr[j] && arr[j].id === id) {
                return arr[j];
            }
        }
    }
    return null;
}

function getCalendarViewDisplayNodeData() {
    if (!_calendarViewDisplayNodeId) {
        return null;
    }
    return findCalendarNodeDataById(_calendarViewDisplayNodeId);
}

function tryResolveCalendarViewNodeDataFromSelectValue() {
    var sel = document.getElementById('calendar-view-node-select');
    if (!sel) return null;
    var raw = sel.value || '';
    if (!raw) return null;
    if (typeof window.SiteNodeListConstants === 'object' && window.SiteNodeListConstants) {
        var c = window.SiteNodeListConstants;
        if ((c.TYPE_PREFIX && raw.indexOf(c.TYPE_PREFIX) === 0) || raw === c.BACK || raw === c.BROWSE || raw === c.DRILL) {
            return null;
        }
    } else if (raw.indexOf('category:') === 0 || raw === '__back__' || raw === '__browse__' || raw === '__drill__') {
        return null;
    }
    var id = normalizeCalendarViewNodeId(raw);
    var item = findCalendarNodeDataById(id);
    if (item) {
        _calendarViewDisplayNodeId = id;
    }
    return item;
}

function syncCalendarViewNodeSelectRowButtons() {
    var clearBtn = document.getElementById('calendar-view-node-clear');
    var selectBtn = document.getElementById('calendar-view-node-select-btn');
    var item = getCalendarViewDisplayNodeData();
    if (clearBtn) {
        clearBtn.disabled = !item;
    }
    if (selectBtn) {
        selectBtn.disabled = !item;
    }
}

/**
 * Fills the calendar modal’s node &lt;select&gt; once per page load (nodeData is static until the next visit).
 * Same categorized flow as populateFloatingPanelNodeSelectIfNeeded in userPanel.js.
 */
function populateCalendarViewNodeSelect() {
    var sel = document.getElementById('calendar-view-node-select');
    if (!sel || sel.dataset.prepared === '1') {
        return;
    }
    if (typeof fillNodeSelectCategoryList === 'function') {
        fillNodeSelectCategoryList(sel);
    }
    sel.dataset.prepared = '1';
    syncCalendarViewNodeSelectRowButtons();
    if (typeof mountMobileSiteNodePicker === 'function') {
        mountMobileSiteNodePicker(sel);
    }
    if (typeof wireNodeSelectDrillRestore === 'function') {
        wireNodeSelectDrillRestore(sel);
    }
}

function syncCalendarViewNodeSelect() {
    var sel = document.getElementById('calendar-view-node-select');
    if (!sel || sel.dataset.prepared !== '1') {
        return;
    }
    var id = normalizeCalendarViewNodeId(_calendarViewDisplayNodeId) || '';
    var item = id ? findCalendarNodeDataById(id) : null;
    if (item && item.type && typeof fillNodeSelectNodesForCategory === 'function') {
        fillNodeSelectNodesForCategory(sel, item.type, id);
        if (typeof clearNodeSelectDrillDraft === 'function') {
            clearNodeSelectDrillDraft(sel);
        }
    } else if (typeof fillNodeSelectCategoryList === 'function') {
        fillNodeSelectCategoryList(sel);
        sel.value = '';
    }
    syncCalendarViewNodeSelectRowButtons();
    if (typeof syncMobileSiteNodePickerTrigger === 'function') {
        syncMobileSiteNodePickerTrigger(sel);
    }
}

function refreshCalendarViewIfOpen() {
    var modal = document.getElementById('calendar-view-modal');
    if (!modal || modal.style.display === 'none' || modal.style.display === '') {
        return;
    }
    renderCalendarView(_calendarViewYear, _calendarViewMonth);
    syncCalendarViewNodeSelect();
}

/**
 * When the modal opens: if a node is selected in the main grid/description, show that system
 * in the calendar. If not (e.g. user went Home), keep the previous calendar-only choice.
 * Browsing nodes or Home does not change _calendarViewDisplayNodeId — only this, the dropdown, or Select.
 */
function calendarViewBootstrapDisplayFromMainIfNeeded() {
    if (typeof selectedNodeData !== 'undefined' && selectedNodeData && selectedNodeData.id) {
        syncCalendarViewDisplayFromMainSelection(selectedNodeData.id);
    }
}

function buildCalendarHTML(year, month, selectedNodeData) {
    var daysInMonth = getDaysInMonth(year, month);
    var firstDay = getFirstDayOfMonth(year, month);
    var eventsByDay = (typeof getAstronomicalEventsForMonth === 'function') ? getAstronomicalEventsForMonth(year, month) : {};

    var nodeId = null;
    var systemLabel = null;
    var getters = null;
    var monthKeyToIndex = {};
    var selected = getSelectedGregorianDateParts();
    var selectedYear = selected.year, selectedMonth = selected.month, selectedDay = selected.day;
    if (selectedNodeData && selectedNodeData.id) {
        nodeId = selectedNodeData.id;
        systemLabel = selectedNodeData.name || selectedNodeData.id;
        var tz = typeof getDatePickerTimezone === 'function' ? getDatePickerTimezone() : 'UTC+00:00';
        var tzOffset = typeof convertUTCOffsetToMinutes === 'function' ? convertUTCOffsetToMinutes(tz) : 0;
        getters = buildNodeValueGetters(tzOffset);
    }

    var html = '<div class="calendar-view-header-row">';
    DAY_NAMES.forEach(function (name) {
        html += '<div class="calendar-view-cell calendar-view-day-name">' + name + '</div>';
    });
    html += '</div>';

    var day = 1;
    var started = false;

    for (var row = 0; row < 6; row++) {
        html += '<div class="calendar-view-week-row">';
        for (var col = 0; col < 7; col++) {
            if (!started && col === firstDay) {
                started = true;
            }
            if (started && day <= daysInMonth) {
                var dayEvents = eventsByDay[day] || [];
                var eventLabels = dayEvents.map(function (k) {
                    return ASTRONOMICAL_ICONS[k] ? ASTRONOMICAL_ICONS[k].title : k;
                });
                var nodeResult = (nodeId && getters) ? getNodeValueForDay(nodeId, year, month, day, getters) : null;
                var displayValue = nodeResult ? nodeResult.display : null;
                var tooltip = formatDateTooltip(year, month, day, eventLabels, systemLabel, displayValue);
                var iconHtml = '';
                dayEvents.forEach(function (k) {
                    if (ASTRONOMICAL_ICONS[k]) {
                        iconHtml += '<span class="calendar-astronomy-icon">' + ASTRONOMICAL_ICONS[k].symbol + '</span>';
                    }
                });
                var cellContent = '';
                var shadeStyle = '';
                var isSelectedDay = (year === selectedYear && month === selectedMonth && day === selectedDay);
                var todayClass = isSelectedDay ? ' calendar-view-day-today' : '';
                if (displayValue !== null && displayValue !== '') {
                    cellContent = '<span class="calendar-view-day-num">' + day + '</span><span class="calendar-view-system-value">' + escapeHtml(String(displayValue)) + '</span>';
                    var monthKey = nodeResult ? nodeResult.monthKey : '';
                    if (monthKey) {
                        var shade = getShadeForMonthKey(monthKey, monthKeyToIndex);
                        if (shade) shadeStyle = ' style="background-color:' + shade + '"';
                    }
                } else {
                    cellContent = String(day);
                }
                var yearAttr = year < 0 ? '-' + Math.abs(year) : String(year);
                html += '<div class="calendar-view-cell calendar-view-day' + todayClass + '" data-year="' + yearAttr + '" data-month="' + month + '" data-day="' + day + '" data-tooltip="' + escapeHtml(tooltip) + '"' + shadeStyle + '>' + cellContent + (iconHtml ? '<div class="calendar-astronomy-icons">' + iconHtml + '</div>' : '') + '</div>';
                day++;
            } else {
                html += '<div class="calendar-view-cell calendar-view-empty"></div>';
            }
        }
        html += '</div>';
        if (day > daysInMonth) break;
    }

    return html;
}

/*
    |=====================================|
    |   Native (own-calendar) month view  |
    |=====================================|
    Alternative to the Gregorian grid: shows one month of the selected calendar
    itself (e.g. Messidor CCXXXIV), discovered generically by scanning Gregorian
    midnights outward from an anchor date until the calendar's month key changes.
    Cells are Gregorian days labeled with the calendar's own day numbers, tinted
    by Gregorian month (the inverse of the Gregorian view's native-month shading).
*/

/** Max Gregorian days scanned in each direction when finding a native month's bounds. */
var CALENDAR_NATIVE_SCAN_LIMIT = 400;

var _calendarViewNativeMode = false;
var _calendarViewNativeAnchor = null;   // Gregorian {year, month, day} inside the displayed native month
var _calendarViewNativePrevDate = null; // Gregorian day just before / after the displayed native month
var _calendarViewNativeNextDate = null;

var _nativeWeekRegistry = null;

/**
 * Week structure used for the native view's columns:
 *   names — column headers (null = calendar has no weekday cycle: blank headers)
 *   len   — number of columns
 *   col(entry) — column index for a day; null marks a day OUTSIDE the week
 *                cycle (St. Tib's Day, Year Day, …) drawn as a full-width row
 *   flow  — place days sequentially with no weekday alignment
 * Registry entries pair each calendar's weekday-name constant with the same
 * index its own function uses, so headers and alignment follow the calendar's
 * week (which may differ from Gregorian's), not Gregorian weekdays.
 */
function getNativeWeekStructure(nodeId) {
    if (!_nativeWeekRegistry) {
        var reg = {};
        // Numeric raw.dayOfWeek indexes the calendar's own week-name array
        var byIndex = function (names) {
            return names && {
                names: names, len: names.length,
                col: function (e) { var d = Number(e.dayOfWeek); return Number.isFinite(d) ? ((d % names.length) + names.length) % names.length : null; }
            };
        };
        // String raw.dayOfWeek holds a week-name; look it up in indexNames
        var byName = function (names, indexNames, shift) {
            return names && {
                names: names, len: names.length,
                col: function (e) {
                    var i = (indexNames || names).indexOf(String(e.dayOfWeek == null ? '' : e.dayOfWeek).trim());
                    return i < 0 ? null : (i + (shift || 0)) % names.length;
                }
            };
        };
        // No weekday cycle: blank headers, rows of len aligned by day number
        var blankByDay = function (len, zeroBased) {
            return {
                names: null, len: len,
                col: function (e) { var d = Number(e.nativeDay); return Number.isFinite(d) ? (((d - (zeroBased ? 0 : 1)) % len) + len) % len : 0; }
            };
        };
        var globalWeekNames = typeof weekNames !== 'undefined' ? weekNames : null;
        var MON_FIRST = DAY_NAMES.slice(1).concat(DAY_NAMES[0]);
        // Header-only abbreviation for Solar Hijri/Qadimi: names ending in lowercase
        // "shanbeh" (Yekshanbeh, Doshanbeh, ...) drop that suffix, leaving just the
        // prefix (Yek, Do, ...). Case-sensitive so the bare "Shanbeh" (Saturday) is
        // left whole, since its leading "S" doesn't match the lowercase suffix.
        // Does not touch SOLAR_HIJRI_WEEK/QADIMI_WEEK, so normal weekday output is unaffected.
        var truncateShanbehNames = function (names) {
            return names && names.map(function (n) { return /shanbeh$/.test(n) ? n.slice(0, -7) : n; });
        };

        // 7-day weeks with the calendar's own day names (index = raw.dayOfWeek)
        reg['minguo'] = byIndex(typeof MINGUO_WEEK !== 'undefined' && MINGUO_WEEK);
        reg['juche'] = byIndex(typeof JUCHE_WEEK !== 'undefined' && JUCHE_WEEK);
        reg['thai'] = byIndex(typeof THAI_SOLAR_WEEK !== 'undefined' && THAI_SOLAR_WEEK);
        reg['bengali'] = byIndex(typeof BENGALI_WEEKDAYS !== 'undefined' && BENGALI_WEEKDAYS);
        reg['armenian'] = byIndex(typeof ARMENIAN_SOLAR_WEEK !== 'undefined' && ARMENIAN_SOLAR_WEEK);
        reg['coptic'] = byIndex(typeof COPTIC_WEEK !== 'undefined' && COPTIC_WEEK);
        reg['geez'] = byIndex(typeof ETHIOPIAN_WEEK !== 'undefined' && ETHIOPIAN_WEEK);
        reg['tabot'] = byIndex(typeof TABOT_WEEK !== 'undefined' && TABOT_WEEK);
        reg['pataphysical'] = byIndex(typeof PATAPHYSICAL_WEEK !== 'undefined' && PATAPHYSICAL_WEEK);
        reg['solar-hijri'] = byIndex(typeof SOLAR_HIJRI_WEEK !== 'undefined' && truncateShanbehNames(SOLAR_HIJRI_WEEK));
        reg['qadimi'] = byIndex(typeof QADIMI_WEEK !== 'undefined' && truncateShanbehNames(QADIMI_WEEK));
        reg['mandaean'] = byIndex(typeof MANDAEAN_WEEK !== 'undefined' && MANDAEAN_WEEK);
        reg['saka-samvat'] = byIndex(typeof SAKA_SAMVAT_WEEK !== 'undefined' && SAKA_SAMVAT_WEEK);
        reg['icelandic'] = byIndex(typeof ICELANDIC_DAYS !== 'undefined' && ICELANDIC_DAYS);
        reg['hebrew'] = byIndex(typeof HEBREW_WEEKDAY_NAMES !== 'undefined' && HEBREW_WEEKDAY_NAMES);
        reg['umm-al-qura'] = byIndex(typeof HIJRI_WEEKDAY_NAMES !== 'undefined' && HIJRI_WEEKDAY_NAMES);
        reg['darian-mars'] = byIndex(typeof DARIAN_MARS_WEEKDAY_NAMES !== 'undefined' && DARIAN_MARS_WEEKDAY_NAMES);
        // Tamriel reuses the Gregorian calendar's structure under different names,
        // so its own week (Monday-first) indexes the same way as raw.dayOfWeek.
        reg['tamrielic'] = byIndex(typeof TAMRIELIC_WEEK !== 'undefined' && TAMRIELIC_WEEK);
        // Shire: raw.dayOfWeek is null on Mid-year's Day / Overlithe, which sit outside
        // the week cycle (drawn as full-width rows); byIndex's Number(null) === 0 would
        // wrongly place them on Sterday, so this needs its own null check first.
        if (typeof SHIRE_WEEKDAYS !== 'undefined') {
            reg['shire'] = {
                names: SHIRE_WEEKDAYS, len: 7,
                col: function (e) {
                    if (e.dayOfWeek == null) return null;
                    var d = Number(e.dayOfWeek);
                    return Number.isFinite(d) ? ((d % 7) + 7) % 7 : null;
                }
            };
        }

        // Bahá'í week starts on Jalál (Saturday); raw.dayOfWeek is Sunday-based (getBahaiCalendar's local list)
        var bahaiSundayFirst = ['Jamál', 'Kamál', 'Fiḍál', '‘Idál', 'Istijlál', 'Istiqlál', 'Jalál'];
        reg['bahai'] = {
            names: [bahaiSundayFirst[6]].concat(bahaiSundayFirst.slice(0, 6)), len: 7,
            col: function (e) { var d = Number(e.dayOfWeek); return Number.isFinite(d) ? (d + 1) % 7 : null; }
        };

        // 4-day izu; continuous cycle, does not reset at month start
        reg['igbo'] = byIndex(typeof IGBO_WEEK !== 'undefined' && IGBO_WEEK);

        // Décades restart each month; Sansculottides (month index 12) are festival days outside any décade
        if (typeof FRENCH_WEEK !== 'undefined') {
            reg['french-republican'] = {
                names: FRENCH_WEEK, len: 10,
                col: function (e) {
                    if (e.nativeMonth === 12) return null;
                    var d = Number(e.nativeDay);
                    return Number.isFinite(d) ? (d - 1) % 10 : null;
                }
            };
        }

        // 5-day week; St. Tib's Day sits outside it (identified by its output — raw fields mirror Chaos 59)
        if (typeof DISCORDIAN_WEEK !== 'undefined') {
            reg['discordian'] = {
                names: DISCORDIAN_WEEK, len: 5,
                col: function (e) {
                    if (String(e.display).indexOf("St. Tib's Day") === 0) return null;
                    var d = Number(e.dayOfWeek);
                    return Number.isFinite(d) ? ((d % 5) + 5) % 5 : null;
                }
            };
        }

        // Leap-week and positivist calendars: their weekday differs from Gregorian's.
        // Invariable/World/Positivist return the weekday as a name ('' on Year Day / Worldsday / festivals).
        if (globalWeekNames) {
            var colFromWeekdayName = function (shift) {
                return function (e) {
                    var i = globalWeekNames.indexOf(String(e.dayOfWeek == null ? '' : e.dayOfWeek).trim());
                    return i < 0 ? null : (i + shift) % 7;
                };
            };
            reg['invariable'] = { names: DAY_NAMES, len: 7, col: colFromWeekdayName(0) };
            reg['the-world-calendar'] = { names: DAY_NAMES, len: 7, col: colFromWeekdayName(0) };
            reg['positivist'] = { names: MON_FIRST, len: 7, col: colFromWeekdayName(6) };
        }
        // Symmetry454 months always start Monday (its numeric weekday matches the real one)
        reg['symmetry454'] = {
            names: MON_FIRST, len: 7,
            col: function (e) { var d = Number(e.dayOfWeek); return Number.isFinite(d) ? (d + 6) % 7 : null; }
        };

        // Yerm: 7-night weeks restart each month; the closing night of every month is 'Lastnight', outside them
        if (typeof YERM_LUNAR_WEEK_NAMES !== 'undefined') {
            reg['yerm'] = {
                names: YERM_LUNAR_WEEK_NAMES, len: 7,
                col: function (e) {
                    if (e.other && e.other.lunarWeek === 'Lastnight') return null;
                    var d = Number(e.nativeDay);
                    return Number.isFinite(d) ? (d - 1) % 7 : null;
                }
            };
        }

        // 8-day Galilean/Titan week; the circad's weekday only exists in the output's second line
        if (typeof GALILEAN_WEEKDAY_NAMES !== 'undefined') {
            var galileanSpec = {
                names: GALILEAN_WEEKDAY_NAMES, len: 8,
                col: function (e) {
                    var line2 = String(e.display).split('\n')[1] || '';
                    var i = GALILEAN_WEEKDAY_NAMES.indexOf(line2.trim().split(/\s+/).pop());
                    return i < 0 ? null : i;
                }
            };
            ['galilean-io', 'galilean-europa', 'galilean-ganymede', 'galilean-callisto',
             'darian-io', 'darian-europa', 'darian-ganymede', 'darian-callisto'].forEach(function (id) {
                reg[id] = galileanSpec;
            });
            reg['darian-titan'] = byName(GALILEAN_WEEKDAY_NAMES);
        }

        // No weekday cycle → blank headers. East Asian lunisolar months group into 10-day xún;
        // Egyptian months into 10-day decans; Haab days are 0-based (0 = seating).
        ['chinese', 'japanese', 'dai-lich', 'dangun', 'egyptian-civil'].forEach(function (id) { reg[id] = blankByDay(10); });
        ['babylonian', 'epirote', 'togys-esebi', 'nakaiy'].forEach(function (id) { reg[id] = blankByDay(7); });
        reg['haab'] = blankByDay(10, true);
        // tzolkin has no native view (see buildNativeCalendarHTML/nativeViewAvailable)

        _nativeWeekRegistry = {};
        Object.keys(reg).forEach(function (id) { if (reg[id]) _nativeWeekRegistry[id] = reg[id]; });
    }
    return _nativeWeekRegistry[nodeId] || {
        // Calendars sharing the Gregorian week: numeric weekday if provided (it is
        // computed in the calendar's own timezone), else the cell's Gregorian weekday
        names: DAY_NAMES, len: 7,
        col: function (entry) {
            var d = Number(entry.dayOfWeek);
            return (Number.isFinite(d) && d >= 0 && d <= 6) ? d : entry.gregWeekday;
        }
    };
}

/**
 * Month title shared by every day of the native month, derived from the day
 * outputs' first lines: the common prefix plus the common suffix is everything
 * except the part that varies per day (the day number/name).
 * E.g. "24 Messidor CCXXXIV RE" → "Messidor CCXXXIV RE".
 */
function deriveNativeMonthTitle(displays, fallback) {
    var lines = [];
    for (var i = 0; i < displays.length; i++) {
        var line = String(displays[i] || '').split('\n')[0].trim();
        if (line) lines.push(line);
    }
    if (!lines.length) return fallback;
    var prefix = lines[0];
    for (i = 1; i < lines.length && prefix; i++) {
        var n = 0;
        while (n < prefix.length && n < lines[i].length && prefix.charAt(n) === lines[i].charAt(n)) n++;
        prefix = prefix.slice(0, n);
    }
    // Suffix is computed on the remainders after the prefix so the two never overlap
    var suffix = lines[0].slice(prefix.length);
    for (i = 1; i < lines.length && suffix; i++) {
        var rest = lines[i].slice(prefix.length);
        var m = 0;
        while (m < suffix.length && m < rest.length && suffix.charAt(suffix.length - 1 - m) === rest.charAt(rest.length - 1 - m)) m++;
        suffix = suffix.slice(suffix.length - m);
    }
    var trimSep = function (s) {
        s = s.replace(/^[\s.,;:\-–—/]+|[\s.,;:\-–—/]+$/g, '');
        // A dangling opener at the end / closer at the start means the day number
        // sat inside brackets ("Funoas (12)" → prefix "Funoas ("); balanced pairs stay
        s = s.replace(/[([{«]+$/, '').replace(/^[)\]}»]+/, '');
        return s.replace(/^[\s.,;:\-–—/]+|[\s.,;:\-–—/]+$/g, '');
    };
    var parts = [];
    if (trimSep(prefix).length >= 2) parts.push(trimSep(prefix));
    if (trimSep(suffix).length >= 2) parts.push(trimSep(suffix));
    return parts.join(' ') || fallback;
}

/**
 * Finds every Gregorian day whose midnight falls in the same native month as
 * the anchor date. Returns ordered entries or null when the anchor date has no
 * month in this system.
 */
function scanNativeMonth(nodeId, getters, anchor) {
    var anchorVal = getNodeValueForDay(nodeId, anchor.year, anchor.month, anchor.day, getters);
    if (!anchorVal || !anchorVal.monthKey) return null;
    var key = anchorVal.monthKey;

    function toEntry(parts, val) {
        var dt = createAdjustedDateTime({ year: parts.year, month: parts.month, day: parts.day });
        var nativeDay = (typeof val.day === 'string') ? val.day.trim() : val.day;
        return {
            year: parts.year, month: parts.month, day: parts.day,
            nativeDay: nativeDay, nativeMonth: val.monthValue, dayOfWeek: val.dayOfWeek,
            other: val.other, display: val.display, gregWeekday: dt.getUTCDay()
        };
    }

    // Off-world days (sols, circads) can span two Gregorian midnights; keep one
    // cell per native day — the earliest Gregorian midnight inside it. Displays
    // must match too: St. Tib's Day shares Chaos 59's day number but not its output.
    function sameNativeDay(a, b) {
        return a.nativeDay != null && a.nativeDay !== '' &&
            String(a.nativeDay) === String(b.nativeDay) && a.display === b.display;
    }

    var entries = [toEntry(anchor, anchorVal)];
    var cur = anchor;
    for (var i = 0; i < CALENDAR_NATIVE_SCAN_LIMIT; i++) {
        var probe = shiftGregorianDayParts(cur, -1);
        var val = getNodeValueForDay(nodeId, probe.year, probe.month, probe.day, getters);
        if (!val || val.monthKey !== key) break;
        var entry = toEntry(probe, val);
        if (sameNativeDay(entry, entries[0])) {
            entries[0] = entry;
        } else {
            entries.unshift(entry);
        }
        cur = probe;
    }
    cur = anchor;
    for (i = 0; i < CALENDAR_NATIVE_SCAN_LIMIT; i++) {
        probe = shiftGregorianDayParts(cur, 1);
        val = getNodeValueForDay(nodeId, probe.year, probe.month, probe.day, getters);
        if (!val || val.monthKey !== key) break;
        entry = toEntry(probe, val);
        if (!sameNativeDay(entry, entries[entries.length - 1])) {
            entries.push(entry);
        }
        cur = probe;
    }
    return entries;
}

/*
 * Extraterrestrial calendars: sols/circads differ from Earth days, so sampling
 * Gregorian midnights duplicates some native days and skips others. All these
 * calendars floor a linear day count ((t − epoch) / dayLength), so the count
 * can be inverted to enumerate the month's actual sols/circads with exact
 * start instants instead.
 */
var _etDayCountRegistry = null;

/** Continuous (fractional) native-day count function for extraterrestrial nodes, or null. */
function getEtDayCount(nodeId) {
    if (!_etDayCountRegistry) {
        _etDayCountRegistry = {};
        if (typeof getJulianSolDate === 'function') {
            _etDayCountRegistry['darian-mars'] = function (dt) { return getJulianSolDate(dt); };
        }
        var linearCount = function (epochConfig, dayMs) {
            var epoch = createAdjustedDateTime(epochConfig).getTime();
            return function (dt) { return (dt.getTime() - epoch) / dayMs; };
        };
        if (typeof GALILEAN_EPOCHS !== 'undefined' && typeof GALILEAN_CIRCAD_HOURS !== 'undefined') {
            var moons = { 'io': 'Io', 'europa': 'Eu', 'ganymede': 'Gan', 'callisto': 'Cal' };
            Object.keys(moons).forEach(function (moon) {
                var body = moons[moon];
                var circadMs = GALILEAN_CIRCAD_HOURS[body] * 3600000;
                var galileanCount = linearCount(GALILEAN_EPOCHS[body], circadMs);
                _etDayCountRegistry['galilean-' + moon] = galileanCount;
                if (typeof DARIAN_GALILEAN_CIRCAD_OFFSETS !== 'undefined') {
                    var darianOffset = DARIAN_GALILEAN_CIRCAD_OFFSETS[body];
                    _etDayCountRegistry['darian-' + moon] = function (dt) { return galileanCount(dt) + darianOffset; };
                }
            });
        }
        if (typeof DARIAN_TITAN_EPOCH_CONFIG !== 'undefined' && typeof DARIAN_TITAN_CIRCAD_DAYS !== 'undefined') {
            _etDayCountRegistry['darian-titan'] = linearCount(DARIAN_TITAN_EPOCH_CONFIG, DARIAN_TITAN_CIRCAD_DAYS * 86400000);
        }
    }
    return _etDayCountRegistry[nodeId] || null;
}

/**
 * Native-month scan for extraterrestrial calendars: enumerates the month's
 * sols/circads directly via the continuous day count. Each entry additionally
 * carries start/end instants and startStr (picker-timezone datetime string).
 */
function scanNativeMonthByCount(nodeId, getters, anchor, countFn, tzOffset) {
    var t0 = instantForGregorianParts(anchor);
    if (!t0) return null;
    var c0 = countFn(t0);
    var slope = (countFn(new Date(t0.getTime() + 864000000)) - c0) / 864000000; // counts per ms over 10 days
    if (!(slope > 0) || !Number.isFinite(slope)) return null;
    function startOf(n) {
        var t = t0.getTime() + (n - c0) / slope;
        t += (n - countFn(new Date(t))) / slope; // one Newton step absorbs slight nonlinearity (ΔT)
        return t;
    }
    // Cell starts are exposed (data-time, tooltip, picker) at second precision, so
    // they must be whole seconds INSIDE day n: truncation would select the previous
    // sol/circad and roll clocks derived from it back to ~23:59:59
    var _boundaries = {};
    function boundaryOf(n) {
        if (!_boundaries[n]) {
            var sec = Math.ceil(startOf(n) / 1000) * 1000;
            if (Math.floor(countFn(new Date(sec))) < n) sec += 1000;
            _boundaries[n] = new Date(sec);
        }
        return _boundaries[n];
    }
    function pad(n) { return String(n).padStart(2, '0'); }
    function toEntry(n, val) {
        var start = boundaryOf(n);
        var local = createFauxUTCDate(start, tzOffset);
        var year = local.getUTCFullYear();
        var nativeDay = (typeof val.day === 'string') ? val.day.trim() : val.day;
        return {
            year: year, month: local.getUTCMonth() + 1, day: local.getUTCDate(),
            nativeDay: nativeDay, nativeMonth: val.monthValue, dayOfWeek: val.dayOfWeek,
            other: val.other, display: val.display, gregWeekday: local.getUTCDay(),
            start: start, end: boundaryOf(n + 1),
            startStr: year + '-' + pad(local.getUTCMonth() + 1) + '-' + pad(local.getUTCDate()) +
                ', ' + pad(local.getUTCHours()) + ':' + pad(local.getUTCMinutes()) + ':' + pad(local.getUTCSeconds())
        };
    }
    function valueAt(n) {
        // Mid-day instant: safely inside sol n regardless of boundary rounding
        return getNodeValueAtInstant(nodeId, new Date(Math.round(startOf(n + 0.5))), getters);
    }
    var n0 = Math.floor(c0);
    var anchorVal = valueAt(n0);
    if (!anchorVal || !anchorVal.monthKey) return null;
    var key = anchorVal.monthKey;
    var entries = [toEntry(n0, anchorVal)];
    for (var i = 1; i <= CALENDAR_NATIVE_SCAN_LIMIT; i++) {
        var val = valueAt(n0 - i);
        if (!val || val.monthKey !== key) break;
        entries.unshift(toEntry(n0 - i, val));
    }
    for (i = 1; i <= CALENDAR_NATIVE_SCAN_LIMIT; i++) {
        val = valueAt(n0 + i);
        if (!val || val.monthKey !== key) break;
        entries.push(toEntry(n0 + i, val));
    }
    return entries;
}

/**
 * Builds the native month grid. Returns { html, title, cols, first, prev, next }
 * or null when the view is unavailable for this node/anchor.
 */
function buildNativeCalendarHTML(selectedNodeData, anchor) {
    if (!selectedNodeData || !selectedNodeData.id || !anchor) return null;
    var nodeId = selectedNodeData.id;
    // Tzolk'in's raw.month is a day-glyph index, not a real month grouping;
    // no native month view makes sense for it.
    if (nodeId === 'tzolkin') return null;
    var systemLabel = selectedNodeData.name || nodeId;
    var tz = typeof getDatePickerTimezone === 'function' ? getDatePickerTimezone() : 'UTC+00:00';
    var tzOffset = typeof convertUTCOffsetToMinutes === 'function' ? convertUTCOffsetToMinutes(tz) : 0;
    var getters = buildNodeValueGetters(tzOffset);
    var etCount = getEtDayCount(nodeId);
    var entries = etCount ? scanNativeMonthByCount(nodeId, getters, anchor, etCount, tzOffset) : null;
    if (!entries) entries = scanNativeMonth(nodeId, getters, anchor);
    if (!entries) return null;

    var selected = getSelectedGregorianDateParts();
    // For sol/circad cells the highlight follows which native day contains the picker instant
    var selectedInstant = null;
    if (etCount && typeof getDatePickerTime === 'function' && typeof parseInputDate === 'function') {
        try {
            selectedInstant = parseInputDate(getDatePickerTime(), typeof getDatePickerTimezone === 'function' ? getDatePickerTimezone() : 'UTC+00:00');
        } catch (e) {}
    }
    var weekStructure = getNativeWeekStructure(nodeId);
    var cols = weekStructure.len;

    // Astronomical events per Gregorian month; a native month can span several
    var eventsCache = {};
    function eventsForDay(y, m, d) {
        var k = y + '-' + m;
        if (!(k in eventsCache)) {
            eventsCache[k] = (typeof getAstronomicalEventsForMonth === 'function') ? getAstronomicalEventsForMonth(y, m) : {};
        }
        return eventsCache[k][d] || [];
    }

    function renderDayCell(entry, intercalary) {
        var dayEvents;
        if (entry.start && entry.end) {
            // A sol/circad gets the events of every Gregorian day whose local noon it
            // contains — each day's events land on exactly one native day, no dupes
            dayEvents = [];
            var p = { year: entry.year, month: entry.month, day: entry.day };
            for (var s = 0; s < 3; s++) {
                var midnight = instantForGregorianParts(p);
                if (!midnight || midnight.getTime() >= entry.end.getTime()) break;
                var noon = midnight.getTime() + 43200000;
                if (noon >= entry.start.getTime() && noon < entry.end.getTime()) {
                    eventsForDay(p.year, p.month, p.day).forEach(function (k) {
                        if (dayEvents.indexOf(k) === -1) dayEvents.push(k);
                    });
                }
                p = shiftGregorianDayParts(p, 1);
            }
        } else {
            dayEvents = eventsForDay(entry.year, entry.month, entry.day);
        }
        var eventLabels = dayEvents.map(function (k) {
            return ASTRONOMICAL_ICONS[k] ? ASTRONOMICAL_ICONS[k].title : k;
        });
        var iconHtml = '';
        dayEvents.forEach(function (k) {
            if (ASTRONOMICAL_ICONS[k]) {
                iconHtml += '<span class="calendar-astronomy-icon">' + ASTRONOMICAL_ICONS[k].symbol + '</span>';
            }
        });
        var tooltip = formatDateTooltip(entry.year, entry.month, entry.day, eventLabels, systemLabel, entry.display, entry.start);
        var shadeStyle = '';
        if (!intercalary) {
            var shade = getShadeForMonthKey(String(entry.month - 1));
            if (shade) shadeStyle = ' style="background-color:' + shade + '"';
        }
        var isSelectedDay = entry.start
            ? (selectedInstant != null && selectedInstant >= entry.start && selectedInstant < entry.end)
            : (entry.year === selected.year && entry.month === selected.month && entry.day === selected.day);
        var classes = 'calendar-view-cell calendar-view-day' +
            (intercalary ? ' calendar-view-day-intercalary' : '') +
            (isSelectedDay ? ' calendar-view-day-today' : '');
        var gregLabel = entry.day + ' ' + MONTH_NAMES[entry.month - 1].slice(0, 3);
        if (entry.startStr) {
            gregLabel += ' ' + entry.startStr.split(', ')[1].slice(0, 5);
        }
        var nativeDayLabel = entry.nativeDay != null ? String(entry.nativeDay) : '';
        var valueText = intercalary
            ? String(entry.display || '').split('\n')[0] + '\n' + gregLabel
            : gregLabel;
        var yearAttr = entry.year < 0 ? '-' + Math.abs(entry.year) : String(entry.year);
        var timeAttr = entry.startStr ? ' data-time="' + escapeHtml(entry.startStr) + '"' : '';
        return '<div class="' + classes + '" data-year="' + yearAttr + '" data-month="' + entry.month + '" data-day="' + entry.day + '"' + timeAttr + ' data-tooltip="' + escapeHtml(tooltip) + '"' + shadeStyle + '>' +
            '<span class="calendar-view-day-num">' + escapeHtml(nativeDayLabel) + '</span>' +
            '<span class="calendar-view-system-value">' + escapeHtml(valueText) + '</span>' +
            (iconHtml ? '<div class="calendar-astronomy-icons">' + iconHtml + '</div>' : '') +
            '</div>';
    }

    var html = '<div class="calendar-view-header-row">';
    for (var h = 0; h < cols; h++) {
        var headerName = weekStructure.names ? String(weekStructure.names[h]) : '';
        html += '<div class="calendar-view-cell calendar-view-day-name"' +
            (headerName ? ' title="' + escapeHtml(headerName) + '"' : '') + '>' + escapeHtml(headerName) + '</div>';
    }
    html += '</div>';

    // Aligned days accumulate into week rows; a day outside the week cycle
    // (col == null) flushes them and takes a full-width intercalary row
    var pending = [];
    function flushPending() {
        if (!pending.length) return;
        while (pending.length % cols !== 0) pending.push(null);
        for (var i = 0; i < pending.length; i += cols) {
            html += '<div class="calendar-view-week-row">';
            for (var c = 0; c < cols; c++) {
                html += pending[i + c] ? renderDayCell(pending[i + c], false) : '<div class="calendar-view-cell calendar-view-empty"></div>';
            }
            html += '</div>';
        }
        pending = [];
    }
    entries.forEach(function (entry) {
        var col = weekStructure.flow ? (pending.length % cols) : weekStructure.col(entry);
        if (col == null) {
            flushPending();
            html += '<div class="calendar-view-week-row">' + renderDayCell(entry, true) + '</div>';
            return;
        }
        col = ((Math.floor(col) % cols) + cols) % cols;
        var guard = 0;
        while (pending.length % cols !== col && guard++ < cols) pending.push(null);
        pending.push(entry);
    });
    flushPending();

    var displays = entries.map(function (entry) { return entry.display; });
    var firstEntry = entries[0], lastEntry = entries[entries.length - 1];
    var first, prev, next;
    if (firstEntry.start) {
        // Anchors resolve through the local midnight of their date, so pick dates
        // whose midnights are safely inside this / the neighboring native months
        var partsAt = function (ms) {
            var local = createFauxUTCDate(new Date(ms), tzOffset);
            return { year: local.getUTCFullYear(), month: local.getUTCMonth() + 1, day: local.getUTCDate() };
        };
        var h36 = 36 * 3600000;
        first = partsAt(firstEntry.start.getTime() + h36);
        prev = partsAt(firstEntry.start.getTime() - h36);
        next = partsAt(lastEntry.end.getTime() + h36);
    } else {
        first = { year: firstEntry.year, month: firstEntry.month, day: firstEntry.day };
        prev = shiftGregorianDayParts(firstEntry, -1);
        next = shiftGregorianDayParts(lastEntry, 1);
    }
    return {
        html: html,
        title: deriveNativeMonthTitle(displays, systemLabel),
        cols: cols,
        first: first,
        prev: prev,
        next: next
    };
}

/** The native view exists whenever the node's value for the selected date carries a month. */
function nativeViewAvailable(selectedNodeData) {
    if (!selectedNodeData || !selectedNodeData.id) return false;
    if (selectedNodeData.id === 'tzolkin') return false;
    var tz = typeof getDatePickerTimezone === 'function' ? getDatePickerTimezone() : 'UTC+00:00';
    var tzOffset = typeof convertUTCOffsetToMinutes === 'function' ? convertUTCOffsetToMinutes(tz) : 0;
    var sel = getSelectedGregorianDateParts();
    var val = getNodeValueForDay(selectedNodeData.id, sel.year, sel.month, sel.day, buildNodeValueGetters(tzOffset));
    return !!(val && val.monthKey);
}

function updateNativeToggleButton(selectedNodeData) {
    var btn = document.getElementById('calendar-view-native-toggle');
    if (!btn) return;
    var available = _calendarViewNativeMode || nativeViewAvailable(selectedNodeData);
    btn.style.display = available ? '' : 'none';
    btn.setAttribute('aria-pressed', _calendarViewNativeMode ? 'true' : 'false');
    var label = selectedNodeData ? (selectedNodeData.name || selectedNodeData.id) : '';
    btn.title = _calendarViewNativeMode ? 'Show Gregorian months' : 'Show ' + label + ' months';
}

/**
 * Uniformly shrinks the weekday header font (to at most 60% of its CSS size)
 * until the widest unbreakable name fits its column. Runs after layout via
 * requestAnimationFrame so measurements see the opened modal's real widths.
 */
function fitCalendarViewHeaderFont(gridEl) {
    if (!gridEl || typeof gridEl.querySelectorAll !== 'function' || typeof requestAnimationFrame !== 'function' || typeof getComputedStyle !== 'function') {
        return;
    }
    requestAnimationFrame(function () {
        var cells = gridEl.querySelectorAll('.calendar-view-day-name');
        if (!cells.length || !cells[0].clientWidth) {
            return;
        }
        var worst = 1;
        for (var i = 0; i < cells.length; i++) {
            var ratio = cells[i].scrollWidth / cells[i].clientWidth;
            if (ratio > worst) worst = ratio;
        }
        if (worst <= 1) {
            return;
        }
        var base = parseFloat(getComputedStyle(cells[0]).fontSize);
        var size = Math.max(base * 0.6, (base * 0.95) / worst);
        for (i = 0; i < cells.length; i++) {
            cells[i].style.fontSize = size + 'px';
        }
    });
}

var _calendarTooltipsInitialized = false;

function renderCalendarView(year, month) {
    var titleEl = document.getElementById('calendar-view-title');
    var gridEl = document.getElementById('calendar-view-grid');
    if (!titleEl || !gridEl) return;
    var selectedData = getCalendarViewDisplayNodeData();
    if (!selectedData) {
        selectedData = tryResolveCalendarViewNodeDataFromSelectValue();
    }
    var native = null;
    if (_calendarViewNativeMode && selectedData) {
        if (!_calendarViewNativeAnchor) _calendarViewNativeAnchor = getSelectedGregorianDateParts();
        native = buildNativeCalendarHTML(selectedData, _calendarViewNativeAnchor);
    }
    if (native) {
        _calendarViewNativeAnchor = native.first;
        _calendarViewNativePrevDate = native.prev;
        _calendarViewNativeNextDate = native.next;
        // Keep the Gregorian month tracking the native one so toggling back lands nearby
        _calendarViewYear = native.first.year;
        _calendarViewMonth = native.first.month;
        titleEl.textContent = native.title;
        gridEl.style.setProperty('--calendar-cols', String(native.cols));
        gridEl.innerHTML = native.html;
    } else {
        _calendarViewNativeMode = false;
        titleEl.textContent = MONTH_NAMES[month - 1] + ' ' + year;
        gridEl.style.removeProperty('--calendar-cols');
        gridEl.innerHTML = buildCalendarHTML(year, month, selectedData);
    }
    fitCalendarViewHeaderFont(gridEl);
    updateNativeToggleButton(selectedData);
    if (!_calendarTooltipsInitialized) {
        setupCalendarTooltips();
        _calendarTooltipsInitialized = true;
    }
}

function setupCalendarTooltips() {
    var grid = document.getElementById('calendar-view-grid');
    var tooltipEl = document.getElementById('calendar-tooltip');
    if (!grid || !tooltipEl) return;

    grid.addEventListener('mouseover', function (e) {
        var cell = e.target.closest('.calendar-view-day');
        if (cell && cell.dataset.tooltip) {
            tooltipEl.textContent = cell.dataset.tooltip.replace(/&#10;/g, '\n');
            tooltipEl.classList.add('visible');
            var rect = cell.getBoundingClientRect();
            tooltipEl.style.left = rect.left + 'px';
            tooltipEl.style.top = (rect.top - 4) + 'px';
            tooltipEl.style.transform = 'translate(0, -100%)';
        }
    });

    grid.addEventListener('mouseout', function (e) {
        var related = e.relatedTarget ? e.relatedTarget.closest('.calendar-view-day') : null;
        if (!related) {
            tooltipEl.classList.remove('visible');
        }
    });

    grid.addEventListener('click', function (e) {
        if (!window.matchMedia('(min-width: 769px)').matches) return;
        var cell = e.target.closest('.calendar-view-day');
        if (!cell || !cell.dataset.year) return;
        var y = cell.dataset.year;
        var m = parseInt(cell.dataset.month, 10);
        var d = parseInt(cell.dataset.day, 10);
        if (Number.isNaN(m) || Number.isNaN(d)) return;
        var pad = function (n) { return String(n).padStart(2, '0'); };
        // Sol/circad cells carry their exact start instant; Earth-day cells use midnight
        var dateStr = cell.dataset.time || (y + '-' + pad(m) + '-' + pad(d) + ', 00:00:00');
        // When an input calendar is selected, the picker fields hold that
        // calendar's components: convert the clicked Gregorian date (and set
        // the leap flag) before applying it.
        var inputConfig = (typeof getInputCalendarConfig === 'function' && typeof getSelectedCalendarType === 'function')
            ? getInputCalendarConfig(getSelectedCalendarType()) : null;
        if (inputConfig && typeof parseGregorianDate === 'function') {
            try {
                var tz = typeof getDatePickerTimezone === 'function' ? getDatePickerTimezone() : 'UTC+00:00';
                var instant = parseGregorianDate(dateStr, tz);
                if (typeof _ensureSolsticeCacheNear === 'function') _ensureSolsticeCacheNear(instant);
                var native = inputConfig.forward(instant);
                if (typeof setInputLeapMonthFlag === 'function') setInputLeapMonthFlag(native.leap);
                var timePart = dateStr.split(', ')[1] || '00:00:00';
                dateStr = native.year + '-' + pad(native.month) + '-' + pad(native.day) + ', ' + timePart;
            } catch (err) {}
        }
        if (typeof setDatePickerTime === 'function') setDatePickerTime(dateStr);
        if (typeof changeDateTime === 'function') changeDateTime(dateStr);
        renderCalendarView(_calendarViewYear, _calendarViewMonth);
    });
}

var _calendarViewYear = new Date().getFullYear();
var _calendarViewMonth = new Date().getMonth() + 1;

function setCalendarViewMonth(year, month) {
    _calendarViewYear = year;
    _calendarViewMonth = month;
    renderCalendarView(_calendarViewYear, _calendarViewMonth);
}

function openCalendarView() {
    var mapModal = document.getElementById('map-view-modal');
    if (mapModal && mapModal.style.display === 'block') {
        mapModal.style.display = 'none';
        document.body.classList.remove('mobile-ui-map-open');
    }
    var selected = getSelectedGregorianDateParts();
    calendarViewBootstrapDisplayFromMainIfNeeded();
    if (_calendarViewNativeMode) {
        _calendarViewNativeAnchor = selected;
    }
    setCalendarViewMonth(selected.year, selected.month);
    syncCalendarViewNodeSelect();
    document.getElementById('calendar-view-modal').style.display = 'block';
    setMobileCalendarToolbarActive(true);
}

function setMobileCalendarToolbarActive(isOpen) {
    if (typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1024px)').matches) {
        document.body.classList.toggle('mobile-ui-calendar-open', isOpen);
    }
}

function goToPrevMonth() {
    if (_calendarViewNativeMode && _calendarViewNativePrevDate) {
        _calendarViewNativeAnchor = _calendarViewNativePrevDate;
        renderCalendarView(_calendarViewYear, _calendarViewMonth);
        return;
    }
    if (_calendarViewMonth === 1) {
        setCalendarViewMonth(_calendarViewYear - 1, 12);
    } else {
        setCalendarViewMonth(_calendarViewYear, _calendarViewMonth - 1);
    }
}

function goToNextMonth() {
    if (_calendarViewNativeMode && _calendarViewNativeNextDate) {
        _calendarViewNativeAnchor = _calendarViewNativeNextDate;
        renderCalendarView(_calendarViewYear, _calendarViewMonth);
        return;
    }
    if (_calendarViewMonth === 12) {
        setCalendarViewMonth(_calendarViewYear + 1, 1);
    } else {
        setCalendarViewMonth(_calendarViewYear, _calendarViewMonth + 1);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    var modal = document.getElementById('calendar-view-modal');
    var btn = document.getElementById('calendar-view-button');
    var headerCloseBtn = document.getElementById('calendar-view-modal-close');
    var prevBtn = document.getElementById('calendar-view-prev');
    var nextBtn = document.getElementById('calendar-view-next');
    var nodeSelect = document.getElementById('calendar-view-node-select');
    var nodeClearBtn = document.getElementById('calendar-view-node-clear');

    populateCalendarViewNodeSelect();
    if (nodeSelect) {
        nodeSelect.addEventListener('change', function () {
            if (nodeSelect.dataset.nodeSelectSuppressChange === '1') {
                return;
            }
            var interpreted;
            if (typeof siteNodeSelectInterpretChange === 'function') {
                interpreted = siteNodeSelectInterpretChange(nodeSelect);
            } else {
                var raw = nodeSelect.value;
                interpreted = !raw ? { action: 'empty' } : { action: 'node', nodeId: raw };
            }
            if (interpreted.action === 'navigate') {
                syncCalendarViewNodeSelectRowButtons();
                if (typeof syncMobileSiteNodePickerTrigger === 'function') {
                    syncMobileSiteNodePickerTrigger(nodeSelect);
                }
                return;
            }
            if (interpreted.action === 'empty') {
                _calendarViewDisplayNodeId = null;
                renderCalendarView(_calendarViewYear, _calendarViewMonth);
                syncCalendarViewNodeSelect();
                if (typeof syncMobileSiteNodePickerTrigger === 'function') {
                    syncMobileSiteNodePickerTrigger(nodeSelect);
                }
                return;
            }
            var normalizedNodeId = normalizeCalendarViewNodeId(interpreted.nodeId);
            var item = findCalendarNodeDataById(normalizedNodeId);
            if (!item) {
                renderCalendarView(_calendarViewYear, _calendarViewMonth);
                syncCalendarViewNodeSelect();
            } else {
                _calendarViewDisplayNodeId = normalizedNodeId;
                renderCalendarView(_calendarViewYear, _calendarViewMonth);
                syncCalendarViewNodeSelectRowButtons();
                if (typeof syncMobileSiteNodePickerTrigger === 'function') {
                    syncMobileSiteNodePickerTrigger(nodeSelect);
                }
            }
        });
    }
    var nodeSelectBtn = document.getElementById('calendar-view-node-select-btn');
    if (nodeSelectBtn) {
        nodeSelectBtn.addEventListener('click', function () {
            if (nodeSelectBtn.disabled) {
                return;
            }
            var id = _calendarViewDisplayNodeId;
            if (!id) {
                return;
            }
            var item = findCalendarNodeDataById(id);
            if (!item) {
                return;
            }
            var mainContent = document.getElementById(item.id + '-node');
            if (!mainContent) {
                return;
            }
            closeCalendarView();
            if (typeof window.populateNodeDescriptionAndSelection === 'function') {
                window.populateNodeDescriptionAndSelection(mainContent, item, { openMobileSheet: true });
            }
            if (typeof window.revealSelectedGridNode === 'function') {
                window.revealSelectedGridNode(mainContent);
            }
        });
    }
    var nativeToggleBtn = document.getElementById('calendar-view-native-toggle');
    if (nativeToggleBtn) {
        nativeToggleBtn.addEventListener('click', function () {
            _calendarViewNativeMode = !_calendarViewNativeMode;
            if (_calendarViewNativeMode) {
                // Anchor to the selected date when it is in view, else to the viewed month
                var sel = getSelectedGregorianDateParts();
                _calendarViewNativeAnchor = (sel.year === _calendarViewYear && sel.month === _calendarViewMonth)
                    ? sel
                    : { year: _calendarViewYear, month: _calendarViewMonth, day: 1 };
            }
            renderCalendarView(_calendarViewYear, _calendarViewMonth);
        });
    }
    if (nodeClearBtn && nodeSelect) {
        nodeClearBtn.addEventListener('click', function () {
            if (!nodeSelect.value) {
                return;
            }
            nodeSelect.value = '';
            nodeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
    }

    btn.addEventListener('click', openCalendarView);
    if (prevBtn) prevBtn.addEventListener('click', goToPrevMonth);
    if (nextBtn) nextBtn.addEventListener('click', goToNextMonth);

    function hideCalendarTooltip() {
        var tip = document.getElementById('calendar-tooltip');
        if (tip) tip.classList.remove('visible');
    }

    function closeCalendarView() {
        if (modal) {
            modal.style.display = 'none';
            hideCalendarTooltip();
        }
        setMobileCalendarToolbarActive(false);
    }

    if (headerCloseBtn) {
        headerCloseBtn.addEventListener('click', closeCalendarView);
    }

    modal.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeCalendarView();
        }
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeCalendarView();
        }
    });
});
