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
        'juche': function (dt) { return typeof getJuche === 'function' ? getJuche(dt) : ''; },
        'coptic': function (dt) { return typeof getCopticDate === 'function' ? getCopticDate(dt) : ''; },
        'geez': function (dt) { return typeof getEthiopianDate === 'function' ? getEthiopianDate(dt) : ''; },
        'bahai': function (dt) { var seq = typeof getSolsticeEquinox === 'function' ? getSolsticeEquinox(dt, 'SPRING') : null; return typeof getBahaiCalendar === 'function' && seq ? getBahaiCalendar(dt, seq) : ''; },
        'pataphysical': function (dt) { return typeof getPataphysicalDate === 'function' ? getPataphysicalDate(dt, offset) : ''; },
        'discordian': function (dt) { return typeof getDiscordianDate === 'function' ? getDiscordianDate(dt, offset) : ''; },
        'solar-hijri': function (dt) { var seq = typeof getSolsticeEquinox === 'function' ? getSolsticeEquinox(dt, 'SPRING') : null; return typeof getSolarHijriDate === 'function' && seq ? getSolarHijriDate(dt, seq) : ''; },
        'qadimi': function (dt) { return typeof getQadimiDate === 'function' ? getQadimiDate(dt) : ''; },
        'mandaean': function (dt) { return typeof getMandaeanDate === 'function' ? getMandaeanDate(dt) : ''; },
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

/** Returns { display, monthKey } when a calendar is selected, or null. */
function getNodeValueForDay(nodeId, year, month, day, getters) {
    if (!nodeId || typeof parseInputDate !== 'function') return null;
    var dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0') + ', 00:00:00';
    var tz = typeof getDatePickerTimezone === 'function' ? getDatePickerTimezone() : 'UTC+00:00';
    var dt;
    try {
        dt = parseInputDate(dateStr, tz);
    } catch (e) {
        return null;
    }
    var getter = getters ? getters[nodeId] : null;
    if (!getter) return null;
    try {
        var raw = getter(dt);
        if (raw == null) return null;
        var display = typeof out === 'function' ? out(raw) : String(raw);
        var monthKey = '';
        if (raw && typeof raw === 'object' && raw.month != null) {
            var m = raw.month, y = raw.year;
            monthKey = (y != null && y !== '') ? String(y) + '-' + String(m) : String(m);
        }
        return { display: display, monthKey: monthKey };
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

function formatDateTooltip(year, month, day, eventLabels, systemLabel, systemValue) {
    var gregorianText = '—';
    if (typeof parseInputDate === 'function' && typeof getGregorianDateTime === 'function' && typeof getDatePickerTimezone === 'function' && typeof convertUTCOffsetToMinutes === 'function') {
        try {
            var dateStr = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0') + ', 00:00:00';
            var tz = getDatePickerTimezone();
            var dt = parseInputDate(dateStr, tz);
            var offset = convertUTCOffsetToMinutes(tz);
            var raw = getGregorianDateTime(dt, offset);
            gregorianText = (raw && raw.output != null) ? raw.output : '';
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
        var eclipseRef = createAdjustedDateTime({ year: year, month: month, day: 1 });
        for (var attempt = 0; attempt < 3; attempt++) {
            var solarStr = getNextSolarLunarEclipse(eclipseRef, attempt);
            if (solarStr) {
                var firstLine = solarStr.split('\n')[0];
                var eclipseDate = parseDateFromUTCStringLine(firstLine);
                if (eclipseDate && eclipseDate.getUTCFullYear() === year && eclipseDate.getUTCMonth() === month - 1) {
                    addEvent(eclipseDate.getUTCDate(), 'solar-eclipse');
                }
            }
            var lunarStr = getNextSolarLunarEclipse(eclipseRef, attempt + 0.5);
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
    var selectedYear, selectedMonth, selectedDay;
    var dateStr = typeof getDatePickerTime === 'function' ? getDatePickerTime() : '';
    if (dateStr) {
        var datePart = dateStr.split(', ')[0];
        var parts = datePart ? datePart.replace(/^-/, '').split('-') : [];
        selectedYear = parseInt(parts[0] || '0', 10);
        selectedMonth = parseInt(parts[1] || '1', 10);
        selectedDay = parseInt(parts[2] || '1', 10);
        if (datePart && datePart.startsWith('-')) selectedYear = -selectedYear;
    } else {
        var now = new Date();
        selectedYear = now.getFullYear();
        selectedMonth = now.getMonth() + 1;
        selectedDay = now.getDate();
    }
    if (Number.isNaN(selectedYear) || Number.isNaN(selectedMonth) || selectedMonth < 1 || selectedMonth > 12 || Number.isNaN(selectedDay) || selectedDay < 1) {
        var now = new Date();
        selectedYear = now.getFullYear();
        selectedMonth = now.getMonth() + 1;
        selectedDay = now.getDate();
    }
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

var _calendarTooltipsInitialized = false;

function renderCalendarView(year, month) {
    var titleEl = document.getElementById('calendar-view-title');
    var gridEl = document.getElementById('calendar-view-grid');
    if (!titleEl || !gridEl) return;
    var title = MONTH_NAMES[month - 1] + ' ' + year;
    titleEl.textContent = title;
    var selectedData = getCalendarViewDisplayNodeData();
    if (!selectedData) {
        selectedData = tryResolveCalendarViewNodeDataFromSelectValue();
    }
    gridEl.innerHTML = buildCalendarHTML(year, month, selectedData);
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
        var dateStr = y + '-' + pad(m) + '-' + pad(d) + ', 00:00:00';
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
    var dateStr = typeof getDatePickerTime === 'function' ? getDatePickerTime() : '';
    var year, month;
    if (dateStr) {
        var datePart = dateStr.split(', ')[0];
        var parts = datePart ? datePart.replace(/^-/, '').split('-') : [];
        year = parseInt(parts[0] || '0', 10);
        month = parseInt(parts[1] || '1', 10);
        if (datePart && datePart.startsWith('-')) {
            year = -year;
        }
    } else {
        var now = new Date();
        year = now.getFullYear();
        month = now.getMonth() + 1;
    }
    if (Number.isNaN(year)) year = new Date().getFullYear();
    if (Number.isNaN(month) || month < 1 || month > 12) month = new Date().getMonth() + 1;

    calendarViewBootstrapDisplayFromMainIfNeeded();
    setCalendarViewMonth(year, month);
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
    if (_calendarViewMonth === 1) {
        setCalendarViewMonth(_calendarViewYear - 1, 12);
    } else {
        setCalendarViewMonth(_calendarViewYear, _calendarViewMonth - 1);
    }
}

function goToNextMonth() {
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
            if (typeof window.populateNodeDescriptionAndSelection === 'function') {
                window.populateNodeDescriptionAndSelection(mainContent, item, { openMobileSheet: true });
            }
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
