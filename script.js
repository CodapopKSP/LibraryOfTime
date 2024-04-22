//https://www.fourmilab.ch/documents/calendar/
//https://archive.org/details/astronomicalalgorithmsjeanmeeus1991/page/n7/mode/2up
//http://www.leapsecond.com/java/gpsclock.htm

const decimals = 10;
document.addEventListener('mousemove', updateTooltipPosition);

function updateDateAndTime() {
    //let currentDateTime = new Date();
    
    let currentDateTime = new Date(Date.UTC(622, 6, 19, 12, 0, 0));
    let currentTimeZone = currentDateTime.getTimezoneOffset();
    let fixedTimeZone = Math.floor(Math.abs(currentTimeZone/60));
    currentDateTime.setHours(currentDateTime.getUTCHours() + fixedTimeZone);
    
    //currentDateTime.setFullYear(2);

    // Get basic info about the date and time
    day = currentDateTime.getDate();
    month = currentDateTime.getMonth();
    year = currentDateTime.getFullYear();
    hour = currentDateTime.getHours();
    minute = currentDateTime.getMinutes();
    second = currentDateTime.getSeconds();
    let dateDisplayString = year + '-' + (month+1) + '-' + day;
    let timeDisplayString = hour + ':' + minute + ':' + second;

    // All fractional times
    let secondFraction = calculateSecond(currentDateTime);
    let minuteFraction = calculateMinute(currentDateTime);
    let hourFraction = calculateHour(currentDateTime);
    let dayFraction = calculateDay(currentDateTime);
    let monthFraction = calculateMonth(currentDateTime);
    let yearFraction = calculateYear(currentDateTime);
    let decadeFraction = calculateDecade(currentDateTime);
    let centuryFraction = calculateCentury(currentDateTime);
    let millenniumFraction = calculateMillennium(currentDateTime);
    setTimeValue('local-time-box', timeDisplayString)
    setTimeValue('utc-box', currentDateTime.toISOString().slice(0, -5));
    setTimeValue('day-box', dayFraction.toFixed(decimals));
    setTimeValue('month-box', monthFraction.toFixed(decimals));
    setTimeValue('year-box', yearFraction.toFixed(decimals));
    setTimeValue('hour-box', hourFraction.toFixed(decimals));
    setTimeValue('minute-box', minuteFraction.toFixed(decimals));
    setTimeValue('second-box', secondFraction.toFixed(decimals));
    setTimeValue('decade-box', decadeFraction.toFixed(decimals));
    setTimeValue('century-box', centuryFraction.toFixed(decimals));
    setTimeValue('millennium-box', millenniumFraction.toFixed(decimals));

    // Computing Times
    let currentUnixDateTime = getUnixTime(currentDateTime);
    let filetimeValue = getCurrentFiletime(currentDateTime);
    let iso8601Value = currentDateTime.toISOString();
    let gpsValue = getGPSTime(currentDateTime);
    let julianDay = getJulianDayNumber(currentDateTime)
    let rataDie = getRataDie(currentDateTime);
    let TAI = getTAI(currentDateTime).toISOString().slice(0, -5);
    let LORANC = getLORANC(currentDateTime).toISOString().slice(0, -5);
    let julianPeriod = getJulianPeriod(currentDateTime);
    let dynamicalTime = getDynamicalTimeForward(currentDateTime);
    setTimeValue('unix-box', currentUnixDateTime);
    setTimeValue('filetime-box', filetimeValue);
    setTimeValue('iso8601-box', iso8601Value);
    setTimeValue('gps-box', gpsValue);
    setTimeValue('julian-day-number-box', julianDay);
    setTimeValue('julian-period-box', julianPeriod);
    setTimeValue('rata-die-box', rataDie);
    setTimeValue('tai-box', TAI);
    setTimeValue('loran-c-box', LORANC);
    setTimeValue('dynamical-time-box', dynamicalTime);

    // Decimal Time
    let decimalTime = getRevolutionaryTime(dayFraction);
    let swatchBeats = convertToSwatchBeats(currentDateTime);
    let hexadecimalTime = getHexadecimalTime(dayFraction);
    let binaryTime = getBinaryTime(dayFraction);
    //const newHexColor = get6DigitHexadecimalTime(dayFraction);
    //const hexColorBox = document.querySelector('#hex-color-box');
    //const rgbaColor = hexToRGBA(newHexColor, 0.25);
    //hexColorBox.style.backgroundColor = rgbaColor
    setTimeValue('revolutionary-time-box', decimalTime);
    setTimeValue('beat-time-box', swatchBeats);
    setTimeValue('hexadecimal-box', hexadecimalTime);
    setTimeValue('binary-box', binaryTime);

    // Calendars
    let humanEra = getHumanEra(currentDateTime);
    let julianCalendar = getJulianDate(currentDateTime);
    let gregorianCalendar = dateDisplayString;
    let minguoJuche = getMinguoJuche(currentDateTime);
    let thaiSolar = getThaiSolar(currentDateTime);
    let eraFascista = getEraFascista(currentDateTime)
    let republicanCalendar = getRepublicanCalendar(currentDateTime);
    setTimeValue('gregorian-box', gregorianCalendar);
    setTimeValue('human-era-box', humanEra);
    setTimeValue('julian-box', julianCalendar);
    setTimeValue('french-republican-box', republicanCalendar);
    setTimeValue('era-fascista-box', eraFascista);
    setTimeValue('minguo-box', minguoJuche);
    setTimeValue('thai-solar-box', thaiSolar);
    setTimeValue('juche-box', minguoJuche);

    // Lunisolar Calendars
    let chineseZodiacYear = getChineseZodiacYear(year);
    let vietnameseZodiacYear = getVietnameseZodiacYear(year);
    setTimeValue('sexagenary-year-box', getSexagenaryYear(year));
    setTimeValue('chinese-zodiac-box', chineseZodiacYear);
    setTimeValue('vietnamese-zodiac-box', vietnameseZodiacYear);

    // Lunar Calendars
    let hijriCalendar = findCurrentHijriDate(currentDateTime);
    setTimeValue('hijri-box', hijriCalendar);

    // Astronomical Data
    let springEquinox = getCurrentSolsticeOrEquinoxJDE(currentDateTime, 'spring');
    let summerSolstice = getCurrentSolsticeOrEquinoxJDE(currentDateTime, 'summer');
    let autumnEquinox = getCurrentSolsticeOrEquinoxJDE(currentDateTime, 'autumn');
    let winterSolstice = getCurrentSolsticeOrEquinoxJDE(currentDateTime, 'winter');
    let sunLongitude = getLongitudeOfSun(currentDateTime);
    let nextNewMoon = getNewMoonThisMonth(currentDateTime);
    setTimeValue('spring-equinox-box', springEquinox);
    setTimeValue('summer-solstice-box', summerSolstice);
    setTimeValue('autumn-equinox-box', autumnEquinox);
    setTimeValue('winter-solstice-box', winterSolstice);
    setTimeValue('sun-longitude-box', sunLongitude);
    setTimeValue('this-new-moon-box', nextNewMoon);
}

function createElements() {
    standardTimeData.forEach(item => {
        createBox(item);
    });
    computingTimeData.forEach(item => {
        createBox(item);
    });
    decimalTimeData.forEach(item => {
        createBox(item);
    });
    solarCalendarsData.forEach(item => {
        createBox(item);
    });
    lunisolarCalendarsData.forEach(item => {
        createBox(item);
    });
    lunarCalendarsData.forEach(item => {
        createBox(item);
    });
    astronomicalData.forEach(item => {
        createBox(item);
    });
}

// Function to create box elements
function createBox(item) {
    const standardTime = document.querySelector('.standard-time');
    const computingTime = document.querySelector('.computing-time');
    const decimalTime = document.querySelector('.decimal-time');
    const solarCalendars = document.querySelector('.solar-calendars');
    const lunisolarCalendars = document.querySelector('.lunisolar-calendars');
    const lunarCalendars = document.querySelector('.lunar-calendars');
    const astronomicalData = document.querySelector('.astronomical-data');

    // Create a div element for the box
    const box = document.createElement('div');
    box.classList.add('box');

    // Create a label element for the box
    const label = document.createElement('label');
    label.textContent = item.name;

    // Create a div element for the content
    const content = document.createElement('div');
    content.id = item.id + '-box';
    content.classList.add('content');

    // Create a popup tooltip for the description
    const description = document.createElement('div');
    description.id = item.id + '-tooltip';
    description.classList.add('tooltip');

    // Add tooltip elements
    const titleElement = document.createElement('div');
    titleElement.textContent = `${item.name}`;
    titleElement.classList.add('tooltip-title');
    description.appendChild(titleElement);

    const epochElement = document.createElement('div');
    epochElement.textContent = `Epoch: ${item.epoch}`;
    epochElement.classList.add('tooltip-epoch');
    description.appendChild(epochElement);

    const confidenceElement = document.createElement('div');
    confidenceElement.textContent = `Confidence: ${item.confidence}`;
    confidenceElement.classList.add('tooltip-confidence');
    description.appendChild(confidenceElement);

    const descriptionElement = document.createElement('div');
    descriptionElement.textContent = `${item.description}`;
    descriptionElement.classList.add('tooltip-description');
    description.appendChild(descriptionElement);

    // Append the label, content, and description to the box
    box.appendChild(label);
    box.appendChild(content);
    box.appendChild(description);

    if (item.type === 'Solar Calendar') {
        solarCalendars.appendChild(box);
    } else if (item.type === 'Computing Time') {
        computingTime.appendChild(box);
    } else if (item.type === 'Standard Time') {
        standardTime.appendChild(box);
    } else if (item.type === 'Decimal Time') {
        decimalTime.appendChild(box);
    } else if (item.type === 'Lunisolar Calendar') {
        lunisolarCalendars.appendChild(box);
    } else if (item.type === 'Lunar Calendar') {
        lunarCalendars.appendChild(box);
    } else if (item.type === 'Astronomical Data') {
        astronomicalData.appendChild(box);
    }
}

// Draw elements in HTML
createElements();

// Update the date and time every millisecond
setInterval(updateDateAndTime, 1);

// Initial update
updateDateAndTime();

function setTimeValue(type, value) {
    document.getElementById(type).textContent = value;
}

function updateTooltipPosition(event) {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const tooltips = document.querySelectorAll('.tooltip');

    tooltips.forEach(tooltip => {
        if (mouseX > screenWidth / 2) {
            tooltip.style.left = '-100%';
        } else {
            tooltip.style.left = '50%';
        }
        if (mouseY < screenHeight / 2) {
            tooltip.style.top = '25%';
        } else {
            tooltip.style.top = '-200%';
        }
    });
}