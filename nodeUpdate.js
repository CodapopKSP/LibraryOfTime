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

    // Update once per day: regenerate the astronomical caches. The astronomical
    // display nodes themselves are refreshed by the quarter-hour block below.
    if ((getNeedsUpdate_PerDay() && (currentDateTime.getHours() < 5))||firstPass) {
        generateAllNewMoons(currentDateTime);
        generateAllSolsticesEquinoxes(currentDateTime);
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

// Cache of cloned-node lookups (floating panel + map view tooltips). Re-querying the
// document for every node on every tick is the single largest steady-state cost, so
// lookups are cached per type and cleared whenever elements are added or removed
// inside the clone containers. Text updates only touch Text nodes, so they don't
// invalidate the cache.
const _clonedNodeCache = new Map();
let _cloneObserverStarted = false;

function _clearClonedNodeCacheOnElementChange(mutations) {
    for (const mutation of mutations) {
        for (const added of mutation.addedNodes) {
            if (added.nodeType === Node.ELEMENT_NODE) {
                _clonedNodeCache.clear();
                return;
            }
        }
        for (const removed of mutation.removedNodes) {
            if (removed.nodeType === Node.ELEMENT_NODE) {
                _clonedNodeCache.clear();
                return;
            }
        }
    }
}

function _startCloneObserver() {
    _cloneObserverStarted = true;
    const observer = new MutationObserver(_clearClonedNodeCacheOnElementChange);
    for (const containerId of ['floating-box-node-container', 'map-view-node-tooltip', 'map-view-hover-tooltip']) {
        const container = document.getElementById(containerId);
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
        }
    }
}

function getClonedNodes(type) {
    if (!_cloneObserverStarted) {
        _startCloneObserver();
    }
    let clonedNodes = _clonedNodeCache.get(type);
    if (clonedNodes === undefined) {
        clonedNodes = document.querySelectorAll(
            `.grid-item .${type}, #map-view-node-tooltip .${type}, #map-view-hover-tooltip .${type}`
        );
        _clonedNodeCache.set(type, clonedNodes);
    }
    return clonedNodes;
}

// Last value written per node, so unchanged values skip all DOM work
const _lastSetValues = new Map();

// Main function for populating a node
function setTimeValue(type, value) {
    if (_lastSetValues.get(type) === value) {
        return;
    }
    _lastSetValues.set(type, value);

    // Update the original node
    const originalNode = document.getElementById(type);
    if (originalNode) {
        originalNode.textContent = value;
        const nodeName = originalNode.dataset.nodeName || '';
        if (nodeName) {
            originalNode.setAttribute('aria-label', nodeName + ': ' + value);
        } else {
            originalNode.setAttribute('aria-label', value);
        }
    }

    // Update cloned nodes (floating panel + map view tooltips), if any
    getClonedNodes(type).forEach(clonedNode => {
        clonedNode.textContent = value;
    });
}

function updateAstronomicalData(currentDateTime) {
    setTimeValue('northward-equinox-node', getSolsticeOrEquinox(currentDateTime, 'SPRING').toUTCString());
    setTimeValue('northern-solstice-node', getSolsticeOrEquinox(currentDateTime, 'SUMMER').toUTCString());
    setTimeValue('southward-equinox-node', getSolsticeOrEquinox(currentDateTime, 'AUTUMN').toUTCString());
    setTimeValue('southern-solstice-node', getSolsticeOrEquinox(currentDateTime, 'WINTER').toUTCString());
    setTimeValue('next-new-moon-node', getNextMoonPhase(currentDateTime, 0).toUTCString());
    setTimeValue('next-first-quarter-moon-node', getNextMoonPhase(currentDateTime, 0.25).toUTCString());
    setTimeValue('next-full-moon-node', getNextMoonPhase(currentDateTime, 0.5).toUTCString());
    setTimeValue('next-last-quarter-moon-node', getNextMoonPhase(currentDateTime, 0.75).toUTCString());
    setTimeValue('next-solar-eclipse-node', getNextSolarLunarEclipse(currentDateTime, 0));
    setTimeValue('next-lunar-eclipse-node', getNextSolarLunarEclipse(currentDateTime, 0.5));
}

function updateSolarCalendars(currentDateTime, timezoneOffset) {
    const springEquinox = getSolsticeEquinox(currentDateTime, 'SPRING');
    setTimeValue('gregorian-node', out(getGregorianDateTime(currentDateTime, timezoneOffset)));
    setTimeValue('julian-node', out(getJulianCalendar(currentDateTime)));
    setTimeValue('astronomical-node', out(getAstronomicalDate(currentDateTime)));
    setTimeValue('byzantine-node', out(getByzantineCalendar(currentDateTime)));
    setTimeValue('florentine-node', out(getFlorentineCalendar(currentDateTime)));
    setTimeValue('pisan-node', out(getPisanCalendar(currentDateTime)));
    setTimeValue('venetian-node', out(getVenetianCalendar(currentDateTime)));
    setTimeValue('french-republican-node', out(getRepublicanCalendar(currentDateTime)));
    setTimeValue('era-fascista-node', out(getEraFascista(currentDateTime)));
    setTimeValue('minguo-node', out(getMinguo(currentDateTime)));
    setTimeValue('thai-node', out(getThaiSolar(currentDateTime)));
    setTimeValue('bengali-node', out(getBengaliSolarDate(currentDateTime, timezoneOffset)));
    setTimeValue('juche-node', out(getJuche(currentDateTime)));
    setTimeValue('armenian-node', out(getArmenianSolarDate(currentDateTime, timezoneOffset)));
    setTimeValue('coptic-node', out(getCopticDate(currentDateTime)));
    setTimeValue('geez-node', out(getEthiopianDate(currentDateTime)));
    setTimeValue('bahai-node', out(getBahaiCalendar(currentDateTime, springEquinox)));
    setTimeValue('pataphysical-node', out(getPataphysicalDate(currentDateTime, timezoneOffset)));
    setTimeValue('discordian-node', out(getDiscordianDate(currentDateTime, timezoneOffset)));
    setTimeValue('solar-hijri-node', out(getSolarHijriDate(currentDateTime, springEquinox)));
    setTimeValue('qadimi-node', out(getQadimiDate(currentDateTime)));
    setTimeValue('egyptian-civil-node', out(getEgyptianDate(currentDateTime)));
    setTimeValue('mandaean-node', out(getMandaeanDate(currentDateTime)));
    setTimeValue('nakaiy-node', out(getNakaiyDate(currentDateTime)));
    setTimeValue('igbo-node', out(getIgboDate(currentDateTime, timezoneOffset)));
    setTimeValue('iso-week-date-node', out(getISOWeekDate(currentDateTime, timezoneOffset)));
    setTimeValue('haab-node', out(getHaabDate(currentDateTime)));
    setTimeValue('anno-lucis-node', out(getAnnoLucisDate(currentDateTime, timezoneOffset)));
    setTimeValue('tabot-node', out(getTabotDate(currentDateTime)));
    setTimeValue('icelandic-node', out(getIcelandicDate(currentDateTime)));
    setTimeValue('saka-samvat-node', out(getSakaSamvatDate(currentDateTime)));
    setTimeValue('sca-node', out(getSocietyForCreativeAnachronismDate(currentDateTime, timezoneOffset)));
    setTimeValue('chinese-solar-term-node', out(getSolarTermCalendar(currentDateTime)));
    setTimeValue('japanese-solar-term-node', out(getJapaneseSolarTermCalendar(currentDateTime)));
}

function updateLunisolarCalendars(currentDateTime) {
    setTimeValue('chinese-node', out(getChineseLunisolarCalendarDate(currentDateTime, 'CHINA')));
    setTimeValue('dai-lich-node', out(getChineseLunisolarCalendarDate(currentDateTime, 'VIETNAM')));
    setTimeValue('dangun-node', out(getChineseLunisolarCalendarDate(currentDateTime, 'KOREA')));
    setTimeValue('babylonian-node', out(getBabylonianLunisolarCalendar(currentDateTime)));
    setTimeValue('umm-al-qura-node', out(getUmmalQuraDate(currentDateTime)));
    setTimeValue('hebrew-node', out(calculateHebrewCalendar(currentDateTime)));
    setTimeValue('epirote-node', out(getEpiroteCalendar(currentDateTime)));
}

function updateOtherCalendars(currentDateTime) {
    setTimeValue('japanese-node', out(getJapaneseLunisolarCalendarDate(currentDateTime)));
    setTimeValue('maya-long-count-node', out(getCurrentMayaLongCount(currentDateTime)));
    setTimeValue('tzolkin-node', out(getTzolkinDate(currentDateTime)));
    setTimeValue('lord-of-the-night-y-node', out(getLordOfTheNight(currentDateTime)));
    setTimeValue('darian-mars-node', out(getDarianMarsDate(getJulianSolDate(currentDateTime))));
    setTimeValue('galilean-io-node', out(getGalileanDate(currentDateTime, 'Io')));
    setTimeValue('galilean-europa-node', out(getGalileanDate(currentDateTime, 'Eu')));
    setTimeValue('galilean-ganymede-node', out(getGalileanDate(currentDateTime, 'Gan')));
    setTimeValue('galilean-callisto-node', out(getGalileanDate(currentDateTime, 'Cal')));
    setTimeValue('darian-io-node', out(getDarianGalileanDate(currentDateTime, 'Io')));
    setTimeValue('darian-europa-node', out(getDarianGalileanDate(currentDateTime, 'Eu')));
    setTimeValue('darian-ganymede-node', out(getDarianGalileanDate(currentDateTime, 'Gan')));
    setTimeValue('darian-callisto-node', out(getDarianGalileanDate(currentDateTime, 'Cal')));
    setTimeValue('darian-titan-node', out(getDarianTitanDate(currentDateTime)));
    setTimeValue('yuga-cycle-node', out(getYugaCycle(currentDateTime)));
    setTimeValue('sothic-cycle-node', out(getSothicCycle(currentDateTime)));
    setTimeValue('olympiad-node', out(getOlympiad(currentDateTime)));
    setTimeValue('pawukon-node', out(getPawukonCalendarDate(currentDateTime)));
    setTimeValue('galactic-tick-node', out(getGalacticTickDay(currentDateTime)));
    setTimeValue('togys-esebi-node', out(getTogysDate(currentDateTime)));
    setTimeValue('sexagenary-year-node', out(getSexagenaryYear(currentDateTime)));
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
    setTimeValue('nabonassar-lunation-number-node', getNabonassarLunationNumber(lunationNumber));
}

function updateProposedCalendars(currentDateTime, timezoneOffset) {
    setTimeValue('human-era-node', out(getHumanEra(currentDateTime, timezoneOffset)));
    setTimeValue('mpslc-node', out(getMPSLCDate(currentDateTime, timezoneOffset)));
    setTimeValue('invariable-node', out(getInvariableCalendarDate(currentDateTime, timezoneOffset)));
    setTimeValue('the-world-calendar-node', out(getWorldCalendarDate(currentDateTime, timezoneOffset)));
    setTimeValue('symmetry454-node', out(getSymmetry454Date(currentDateTime, timezoneOffset)));
    setTimeValue('symmetry010-node', out(getSymmetry010Date(currentDateTime, timezoneOffset)));
    setTimeValue('positivist-node', out(getPositivistDate(currentDateTime, timezoneOffset)));
    setTimeValue('yerm-node', out(getYermDate(currentDateTime, timezoneOffset)));
}

function updatePopCultureCalendars(currentDateTime, timezoneOffset) {
    setTimeValue('tamrielic-node', out(getTamrielicDate(currentDateTime, timezoneOffset)));
    setTimeValue('imperial-dating-system-node', getImperialDatingSystem(currentDateTime, timezoneOffset));
    setTimeValue('shire-node', out(getShireDate(currentDateTime, timezoneOffset)));
}

// Update clocks that change every millisecond
function updateClocks_Fast(currentDateTime, timezoneOffset, dateInput) {

    // Alternative Time
    setTimeValue('french-revolutionary-node', getRevolutionaryTime(currentDateTime, timezoneOffset));
    setTimeValue('beat-node', convertToSwatchBeats(currentDateTime));
    setTimeValue('hexadecimal-node', getHexadecimalTime(currentDateTime, timezoneOffset));
    setTimeValue('binary-16-bit-node', getBinaryTime(currentDateTime, timezoneOffset));
    setTimeValue('babylonian-time-node', getBabylonianTime(currentDateTime, timezoneOffset));
    setTimeValue('helek-node', getHelek(currentDateTime, timezoneOffset));
    setTimeValue('thai-time-node', getThaiTime(currentDateTime, timezoneOffset));
    setTimeValue('zoroastrian-node', getZoroastrianGahTime(currentDateTime, timezoneOffset));

    // Extraterrestrial Time
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
    const iso8601 = currentDateTime.toISOString();
    setTimeValue('iso-8601-node', iso8601.replace('T', '\nT'));
    setTimeValue('mars-sol-date-node', getMarsSolDate(currentDateTime).toFixed(5));
    setTimeValue('filetime-node', getCurrentFiletime(currentDateTime));
    setTimeValue('chromewebkit-node', getChromeTimestampMicroseconds(currentDateTime));
    setTimeValue('net-datetime-ticks-node', getDotNetDateTimeTicks(currentDateTime));

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
    setTimeValue('longitude-of-the-sun-node', getLongitudeOfSun(currentDateTime) + '°');
}

// Update clocks that change every second
function updateClocks_Slow(currentDateTime, timezoneOffset) {
    setTimeValue('local-time-node', (getGregorianDateTime(currentDateTime, timezoneOffset).time || ''));
    setTimeValue('utc-node', currentDateTime.toISOString().slice(0, -5));
    setTimeValue('millennium-node', calculateMillennium(currentDateTime, timezoneOffset).toFixed(decimals));

    // Computing Times
    setTimeValue('unix-node', getUnixTime(currentDateTime));
    setTimeValue('unix-hex-node', getUnixTimeHex(currentDateTime));
    
    
    setTimeValue('cocoa-core-data-node', getCocoaCoreDataSeconds(currentDateTime));
    setTimeValue('mac-hfs-node', getMacHfsPlusSeconds(currentDateTime));
    setTimeValue('ntp-node', getNtpTimestampSeconds(currentDateTime));
    setTimeValue('dos-fatfat32-node', getDosFatTimestamp(currentDateTime, timezoneOffset));
    setTimeValue('sas-4gl-node', getSas4glDatetime(currentDateTime));
    setTimeValue('gps-node', getGPSTime(currentDateTime));
    setTimeValue('gps-week-number-node', getGpsWeekNumberAndSecondsOfWeek(currentDateTime));
    setTimeValue('tai-node', getTAI(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('tt-node', getTT(currentDateTime).toISOString().slice(0, -5));
    setTimeValue('loran-c-node', getLORANC(currentDateTime).toISOString().slice(0, -5));
}