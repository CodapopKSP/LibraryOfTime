//https://www.fourmilab.ch/documents/calendar/

const decimals = 10;

function updateDateAndTime() {
    let currentDateTime = new Date();
    //let currentDateTime = new Date(inputDate);
    //currentDateTime.setFullYear(-9999);

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
    setTimeValue('unix-box', currentUnixDateTime);
    setTimeValue('filetime-box', filetimeValue);
    setTimeValue('iso8601-box', iso8601Value);
    setTimeValue('gps-box', gpsValue);
    setTimeValue('julian-day-number-box', julianDay);
    setTimeValue('julian-period-box', julianPeriod);
    setTimeValue('rata-die-box', rataDie);
    setTimeValue('tai-box', TAI);
    setTimeValue('loran-c-box', LORANC);

    // Decimal Time
    let decimalTime = getRevolutionaryTime(dayFraction);
    let swatchBeats = convertToSwatchBeats(currentDateTime);
    let hexadecimalTime = getHexadecimalTime(dayFraction);
    let binaryTime = getBinaryTime(dayFraction);
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
}

// Function to create box elements
function createBox(item) {
    const standardTime = document.querySelector('.standard-time');
    const computingTime = document.querySelector('.computing-time');
    const decimalTime = document.querySelector('.decimal-time');
    const solarCalendars = document.querySelector('.solar-calendars');
    const lunisolarCalendars = document.querySelector('.lunisolar-calendars');
    const lunarCalendars = document.querySelector('.lunar-calendars');

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
    description.textContent = item.description;
    description.classList.add('tooltip');

    // Append the label and content to the box
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

function getChineseZodiacYear(year_) {
    let zodiacAnimals = ['鼠 (Rat)', '牛 (Ox)', '虎 (Tiger)', '兔 (Rabbit)', '龍 (Dragon)', '蛇 (Snake)', '馬 (Horse)', '羊 (Goat)', '猴 (Monkey)', '雞 (Rooster)', '狗 (Dog)', '豬 (Pig)'];
    // Adjusting for the start of the Chinese zodiac cycle, handling negative years
    let index = year_ >= 4 ? (year_ - 4) % 12 : ((Math.abs(year_) + 8) % 12 === 0 ? 0 : 12 - ((Math.abs(year_) + 8) % 12));
    if (year_ < 0) {
        index++;
    }
    return zodiacAnimals[index];
}

function getVietnameseZodiacYear(year_) {
    let zodiacAnimals = ['𤝞 (Rat)', '𤛠 (Water Buffalo)', '𧲫 (Tiger)', '猫 (Cat)', '龍 (Dragon)', '𧋻 (Snake)', '馭 (Horse)', '羝 (Goat)', '𤠳 (Monkey)', '𪂮 (Rooster)', '㹥 (Dog)', '㺧 (Pig)'];
    // Adjusting for the start of the Chinese zodiac cycle, handling negative years
    let index = year_ >= 4 ? (year_ - 4) % 12 : ((Math.abs(year_) + 8) % 12 === 0 ? 0 : 12 - ((Math.abs(year_) + 8) % 12));
    if (year_ < 0) {
        index++;
    }
    return zodiacAnimals[index];
}

function getSexagenaryYear(year_) {
    let heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    let earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    let heavenlyStemsEnglish = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
    let earthlyBranchesEnglish = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
    
    // Ensure year_ is positive before calculating indices
    let positiveYear = year_ < 0 ? 60 + (year_ % 60) : year_;

    let heavenlyStemIndex = (positiveYear - 4) % 10; // Adjusting for the start of the sexagenary cycle
    let earthlyBranchIndex = (positiveYear - 4) % 12; // Adjusting for the start of the sexagenary cycle

    if (year_ < 0) {
        heavenlyStemIndex++;
        earthlyBranchIndex++;
    }
    
    let heavenlyStem = heavenlyStems[heavenlyStemIndex];
    let earthlyBranch = earthlyBranches[earthlyBranchIndex];
    let heavenlyStemEnglish = heavenlyStemsEnglish[heavenlyStemIndex];
    let earthlyBrancheEnglish = earthlyBranchesEnglish[earthlyBranchIndex];
    
    return heavenlyStem + earthlyBranch + ' (' + heavenlyStemEnglish + earthlyBrancheEnglish + ')';
}