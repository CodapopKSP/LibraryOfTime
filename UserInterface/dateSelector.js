/*
    |=======================|
    |    Date Selector      |
    |=======================|

*/

// Keeps track of date picker timezone selection
let _datePickerTimezone = '';
function getDatePickerTimezone() {
    // If null, return current datetime
    if (_datePickerTimezone == "") {
        return `UTC+00:00`;
    }
    return _datePickerTimezone;
}
function setDatePickerTimezone(newTimezone) {
    document.getElementById('timezone').value = newTimezone;
    _datePickerTimezone = newTimezone;
}

function getDateInputDateEl() {
    return typeof document !== 'undefined' ? document.getElementById('date-input-date') : null;
}

function getDateInputTimeEl() {
    return typeof document !== 'undefined' ? document.getElementById('date-input-time') : null;
}

/**
 * Same canonical string as the former single field: "yyyy-mm-dd, hh:mm:ss"
 * (BCE years keep a leading "-" on the date part only).
 */
function getCombinedDateInputValue() {
    const dateEl = getDateInputDateEl();
    const timeEl = getDateInputTimeEl();
    if (!dateEl || !timeEl) {
        return '';
    }
    const datePart = dateEl.value.trim();
    const timePart = timeEl.value.trim();
    if (!datePart && !timePart) {
        return '';
    }
    if (!datePart) {
        return '';
    }
    const t = timePart || '00:00:00';
    return `${datePart}, ${t}`;
}

// Keeps track of date picker time selection
let _datePickerTime = '';
function getDatePickerTime() {
    // If null, return current datetime
    if (_datePickerTime == "") {
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}, ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    }
    return _datePickerTime;
}

function setDatePickerTime(newTime) {
    const dateEl = getDateInputDateEl();
    const timeEl = getDateInputTimeEl();
    if (!dateEl || !timeEl) {
        return;
    }
    if (!newTime) {
        dateEl.value = '';
        timeEl.value = '';
        _datePickerTime = '';
        return;
    }
    const commaIdx = newTime.indexOf(', ');
    if (commaIdx === -1) {
        dateEl.value = newTime.trim();
        timeEl.value = '00:00:00';
    } else {
        dateEl.value = newTime.slice(0, commaIdx).trim();
        timeEl.value = newTime.slice(commaIdx + 2).trim() || '00:00:00';
    }
    _datePickerTime = newTime;
}

// Add event listeners to the date selector buttons
if (typeof document !== 'undefined') {
    document.getElementById('change-date-button')?.addEventListener('click', () => changeDateTime());
}

function syncInputStepPanelAria() {
    const wrap = document.querySelector('.input-box-wrapper[data-ui="date-selector"]');
    const panel = document.getElementById('input-step-controls');
    const btn = document.getElementById('date-input-lead-button');
    if (!wrap || !panel || !btn || typeof window === 'undefined') {
        return;
    }
    const mobile = window.matchMedia('(max-width: 1024px)').matches;
    if (mobile) {
        const open = wrap.classList.contains('input-step-panel-open');
        panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.setAttribute('aria-label', open ? 'Hide date increment controls' : 'Show date increment controls');
    } else {
        panel.removeAttribute('aria-hidden');
        btn.removeAttribute('aria-expanded');
        btn.setAttribute('aria-label', 'Focus date field');
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('date-input-lead-button')?.addEventListener('click', () => {
        if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1024px)').matches) {
            const wrap = document.querySelector('.input-box-wrapper[data-ui="date-selector"]');
            const panel = document.getElementById('input-step-controls');
            if (!wrap || !panel) {
                return;
            }
            if (wrap.classList.contains('input-step-panel-closing')) {
                return;
            }
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

            /** Same @keyframes may not restart on class re-add; clear inline animation then let CSS apply again. */
            function restartPanelAnimation() {
                if (reducedMotion) {
                    return;
                }
                panel.style.animation = 'none';
                void panel.offsetWidth;
                panel.style.animation = '';
            }

            if (wrap.classList.contains('input-step-panel-open')) {
                if (reducedMotion) {
                    wrap.classList.remove('input-step-panel-open', 'input-step-panel-closing');
                    syncInputStepPanelAria();
                } else {
                    wrap.classList.add('input-step-panel-closing');
                    restartPanelAnimation();
                    panel.addEventListener(
                        'animationend',
                        function onInputStepPanelClose(e) {
                            if (e.target !== panel || e.animationName !== 'inputStepPanelReveal') {
                                return;
                            }
                            panel.removeEventListener('animationend', onInputStepPanelClose);
                            wrap.classList.remove('input-step-panel-open', 'input-step-panel-closing');
                            syncInputStepPanelAria();
                        },
                        { once: true }
                    );
                }
            } else {
                wrap.classList.remove('input-step-panel-closing');
                restartPanelAnimation();
                wrap.classList.add('input-step-panel-open');
                syncInputStepPanelAria();
            }
        } else {
            getDateInputDateEl()?.focus();
        }
    });
    function initInputStepPanelAria() {
        syncInputStepPanelAria();
    }
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', syncInputStepPanelAria);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initInputStepPanelAria);
    } else {
        initInputStepPanelAria();
    }
}

if (typeof document !== 'undefined') {
    document.getElementById('reset-date-button')?.addEventListener('click', () => {
        setDatePickerTime('');
        document.getElementById('timezone').value = "UTC+08:00";
        setDatePickerTimezone(getLocalTimezoneOffset());
        setDatePickerTime("");
        restartLiveDateTimeTicker();
    });
}

// Adjust the date picker value by a given unit and step, then apply it
function adjustDatePickerField(unit, step) {
    const combined = getCombinedDateInputValue();

    // If the user has a parseable date in the fields, treat that as the canonical picker time
    if (combined) {
        setDatePickerTime(combined);
    }

    // Always operate on the stored picker time so state stays consistent
    let currentValue = getDatePickerTime();
    if (!currentValue) {
        return;
    }

    // Expect format "yyyy-mm-dd, hh:mm:ss" or "-yyyy-mm-dd, hh:mm:ss" for BCE
    let [datePart, timePart] = currentValue.split(', ');
    if (!datePart) {
        return;
    }

    const pad = (n) => n.toString().padStart(2, '0');

    // Handle possible leading '-' for BCE years
    let bce = false;
    if (datePart.startsWith('-')) {
        bce = true;
        datePart = datePart.substring(1);
    }

    const [rawYearString, monthString, dayString] = datePart.split('-');
    const yearString = rawYearString || '0';
    const [hourString = '0', minuteString = '0', secondString = '0'] = (timePart || '').split(':');

    let year = parseInt(yearString, 10);
    if (bce) {
        year = -year;
    }
    const month = parseInt(monthString || '1', 10);
    const day = parseInt(dayString || '1', 10);
    const hour = parseInt(hourString || '0', 10);
    const minute = parseInt(minuteString || '0', 10);
    const second = parseInt(secondString || '0', 10);

    if (Number.isNaN(year)) {
        return;
    }

    // Work in UTC so we treat the fields as a simple civil date/time
    const workingDate = createAdjustedDateTime({year, month, day, hour, minute, second});

    switch (unit) {
        case 'year':
            workingDate.setUTCFullYear(workingDate.getUTCFullYear() + step);
            break;
        case 'month':
            workingDate.setUTCMonth(workingDate.getUTCMonth() + step);
            break;
        case 'day':
            workingDate.setUTCDate(workingDate.getUTCDate() + step);
            break;
        case 'hour':
            workingDate.setUTCHours(workingDate.getUTCHours() + step);
            break;
        case 'minute':
            workingDate.setUTCMinutes(workingDate.getUTCMinutes() + step);
            break;
        case 'second':
            workingDate.setUTCSeconds(workingDate.getUTCSeconds() + step);
            break;
        default:
            return;
    }

    const newYear = workingDate.getUTCFullYear();
    const newMonth = workingDate.getUTCMonth() + 1;
    const newDay = workingDate.getUTCDate();
    const newHour = workingDate.getUTCHours();
    const newMinute = workingDate.getUTCMinutes();
    const newSecond = workingDate.getUTCSeconds();

    const newValue = `${newYear}-${pad(newMonth)}-${pad(newDay)}, ${pad(newHour)}:${pad(newMinute)}:${pad(newSecond)}`;
    setDatePickerTime(newValue);
    changeDateTime(newValue);
}

// Wire up desktop-only step buttons
if (typeof document !== 'undefined') {
    const stepButtons = document.querySelectorAll('.step-button');
    stepButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const unit = button.getAttribute('data-unit');
            const step = parseInt(button.getAttribute('data-step') || '0', 10);
            if (!unit || !step) {
                return;
            }
            adjustDatePickerField(unit, step);
        });
    });
}

// Manages the calendar that the user can choose to frame the calculator
let _calendarType = 'GREGORIAN';
function getCalendarType() {
    return _calendarType;
}
function setCalendarType(newCalendarType) {
    _calendarType = newCalendarType;
}

// Return a formatted dateTime based on the user's date from the input field
function parseInputDate(dateInput_, timezoneOffset) {
    let dateInput = dateInput_;

    if (dateInput==="") {
        dateInput = getDatePickerTime(); // If null, return current datetime
    }
    let [inputDate, inputTime] = dateInput.split(', ');
    let BCE = false;

    // Check if the year is BCE and remove the leading '-' if present
    if (inputDate.startsWith('-')) {
        BCE = true;
        inputDate = inputDate.substring(1); // Remove the '-' from the year part
    }

    // Parse date and time components
    let [inputYear, inputMonth, inputDay] = inputDate ? inputDate.split('-').map(Number) : [0, 1, 1];
    let [inputHour, inputMinute, inputSecond] = inputTime ? inputTime.split(':').map(Number) : [0, 0, 0];

    // Convert timezone offset string (e.g., "+08:00") to minutes
    const offsetInMinutes = convertUTCOffsetToMinutes(timezoneOffset);

    // Construct UTC time in milliseconds
    let utcMillis = createAdjustedDateTime({year: inputYear, month: inputMonth, day: inputDay, hour: inputHour, minute: inputMinute, second: inputSecond});

    // Apply BCE year handling
    let dateTime = new Date(utcMillis);
    if (BCE) {
        dateTime.setUTCFullYear(inputYear * -1);
    } else {
        dateTime.setUTCFullYear(inputYear);
    }

    // Subtract the timezone offset from the UTC date to get the raw UTC datetime
    dateTime = new Date(dateTime.getTime() - offsetInMinutes * 60 * 1000);

    return dateTime;
}

// Calculate display date for user's calendar choice
function adjustCalendarType(currentDateTime) {
    setGregJulianDifference(calculateGregorianJulianDifference(currentDateTime));
    const gregJulDifference = getGregJulianDifference();
    let calendarType = getCalendarType();
    switch (calendarType) {
        case 'JULIAN':
            currentDateTime = adjustForJulianLiturgical(currentDateTime, gregJulDifference);
            break;
        case 'ASTRONOMICAL':
            currentDateTime = adjustForAstronomical(currentDateTime, gregJulDifference);
            break;
    }
    return currentDateTime;
}

// Calculate display date if user chooses Julian (Liturtgical)
function adjustForJulianLiturgical(currentDateTime, gregJulDifference) {
    // No Year 0 exists, so add 1 to negative years
    if (currentDateTime.getFullYear() < 0) {
        addYear(currentDateTime, 1);
    
    // No Year 0 exists, so return current date as fallback
    } else if (currentDateTime.getFullYear()===0) {
        currentDateTime = new Date();
    }
    addDay(currentDateTime, gregJulDifference);
    return currentDateTime;
}

// Calculate display date if user chooses Astronomical
function adjustForAstronomical(currentDateTime, gregJulDifference) {
    const startOfGregorian = createAdjustedDateTime({year: 1582, month: 10, day: 15});
    if (currentDateTime < startOfGregorian) {
        addDay(currentDateTime, gregJulDifference);
    }
    return currentDateTime;
}

let _inputDateTooltipHideTimer = null;

function showInputDateRequiredTooltip() {
    const tip = document.getElementById('input-date-tooltip');
    const anchor = document.getElementById('change-date-button');
    if (!tip || !anchor) {
        return;
    }
    tip.textContent = 'Input a date to calculate';
    tip.setAttribute('aria-hidden', 'false');
    tip.classList.add('visible');
    const rect = anchor.getBoundingClientRect();
    tip.style.left = rect.left + rect.width / 2 + 'px';
    tip.style.top = rect.top - 4 + 'px';
    tip.style.transform = 'translate(-50%, -0%)';
    if (_inputDateTooltipHideTimer) {
        clearTimeout(_inputDateTooltipHideTimer);
    }
    _inputDateTooltipHideTimer = setTimeout(() => {
        tip.classList.remove('visible');
        tip.setAttribute('aria-hidden', 'true');
        _inputDateTooltipHideTimer = null;
    }, 1500);
}

/** Clears URL params and restores the live-updating clock (used by Reset). */
function restartLiveDateTimeTicker() {
    clearInterval(getCurrentUpdateInterval());
    setCalendarType(document.getElementById('calendar-type').value);
    const currentUrl = new URL(window.location.href);
    currentUrl.search = '';
    window.history.replaceState(null, '', currentUrl);
    updateAllNodes(0, getLocalTimezoneOffset(), true);
    if (typeof relayoutMasonry === 'function') {
        relayoutMasonry();
    }
    setTimeout(() => {
        setCurrentUpdateInterval(setInterval(updateAllNodes, updateMilliseconds));
    }, 1);
}

// Read the input box and set the date or restart the current time ticker
function changeDateTime(newDateString = '', timezonePassthrough = '') {
    // If newDateString isn't provided, use the input box value
    if (newDateString === '') {
        newDateString = getCombinedDateInputValue();
    }
    if (newDateString === '') {
        showInputDateRequiredTooltip();
        return;
    }

    clearInterval(getCurrentUpdateInterval());

    setCalendarType(document.getElementById('calendar-type').value);
    let timezoneChoice = getDatePickerTimezone();
    if (timezonePassthrough) {
        timezoneChoice = timezonePassthrough;
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('datetime', formatDateTimeForURL(newDateString));
    currentUrl.searchParams.set('timezone', formatTimezoneForURL(timezoneChoice));
    currentUrl.searchParams.set('type', getCalendarType());
    window.history.replaceState(null, '', currentUrl);
    setDatePickerTime(newDateString);
    updateAllNodes(newDateString, timezoneChoice, true);
    if (typeof relayoutMasonry === 'function') {
        relayoutMasonry();
    }
}

// Get local timezone for dropdown menu default option
function getLocalTimezoneOffset() {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const offsetMinutes = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset > 0 ? "-" : "+";
    return `UTC${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;
}