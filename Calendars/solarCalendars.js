//|-------------------------|
//|     Solar Calendars     |
//|-------------------------|

// A set of functions for calculating dates in the Solar Calendars category.

// Returns an unformatted Julian date object, useful for calculating many calendars
function getJulianDate(currentDateTime) {
  let year = currentDateTime.getFullYear();
  let daysAhead = Math.trunc(year / 100) - Math.trunc(year / 400) - 2;
  let julianDate = new Date(currentDateTime);
  julianDate.setDate(julianDate.getDate() - daysAhead);
  return julianDate;
}

// Converts a number to Roman numerals
function toRomanNumerals(num) {
  if (num === 0) {
    return "O";
  }
  if (num < 0) {
    return "-" + toRomanNumerals(-num);
  }

  const romanNumerals = [
    { value: 1000, symbol: "M" },
    { value: 900, symbol: "CM" },
    { value: 500, symbol: "D" },
    { value: 400, symbol: "CD" },
    { value: 100, symbol: "C" },
    { value: 90, symbol: "XC" },
    { value: 50, symbol: "L" },
    { value: 40, symbol: "XL" },
    { value: 10, symbol: "X" },
    { value: 9, symbol: "IX" },
    { value: 5, symbol: "V" },
    { value: 4, symbol: "IV" },
    { value: 1, symbol: "I" },
  ];

  let result = "";
  for (let i = 0; i < romanNumerals.length; i++) {
    while (num >= romanNumerals[i].value) {
      result += romanNumerals[i].symbol;
      num -= romanNumerals[i].value;
    }
  }
  return result;
}

// Returns a formatted Gregorian calendar local date and time
function getGregorianDateTime(currentDateTime) {
  let day = currentDateTime.getDate().toString();
  let month = currentDateTime.getMonth();
  let year = currentDateTime.getFullYear();
  let hour = currentDateTime.getHours().toString().padStart(2, "0");
  let minute = currentDateTime.getMinutes().toString().padStart(2, "0");
  let second = currentDateTime.getSeconds().toString().padStart(2, "0");
  const dayOfWeek = currentDateTime.getDay();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let yearSuffix = "CE";
  if (year < 1) {
    yearSuffix = "BCE";
  }
  let dateDisplayString = day + " " + monthNames[month] + " " + year + " " +
    yearSuffix;
  let timeDisplayString = dayNames[dayOfWeek] + " " + hour + ":" + minute +
    ":" + second;
  return { date: dateDisplayString, time: timeDisplayString };
}

// Returns a formatted Julian calendar local date
function getJulianCalendar(currentDateTime) {
  const julianDate = getJulianDate(currentDateTime);
  // Extract year, month, and day components
  let yearString = julianDate.getFullYear();
  let monthIndex = julianDate.getMonth(); // Month is zero-based
  let monthString = monthNames[monthIndex];
  let dayString = julianDate.getDate();

  let yearSuffix = "AD";
  if (yearString < 1) {
    yearSuffix = "BC";
  }

  let dateString = dayString + " " + monthString + " " + yearString + " " +
    yearSuffix;
  return dateString;
}

// Returns a formatted Minguo local date
function getMinguo(currentDateTime) {
  let day = currentDateTime.getDate();
  let month = currentDateTime.getMonth() + 1; // Month is zero-based, so add 1
  let year = currentDateTime.getFullYear() - 1911;

  return "民國 " + year + "年 " + month + "月 " + day + "日";
}

// Returns a formatted Juche local date
function getJuche(currentDateTime) {
  let day = currentDateTime.getDate();
  let month = currentDateTime.getMonth() + 1; // Month is zero-based, so add 1
  let year = currentDateTime.getFullYear() - 1911;

  // Add leading zeros if necessary
  let monthString = (month < 10) ? "0" + month : month;
  return "Juche " + year + "." + monthString + "." + day;
}

// Returns a formatted Thai solar local date
function getThaiSolar(currentDateTime) {
  const thaiSolarMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  let day = currentDateTime.getDate();
  let month = currentDateTime.getMonth();
  let year = currentDateTime.getFullYear() + 543;
  return day + " " + thaiSolarMonths[month] + " B.E. " + year;
}

// Returns a formatted French Republican local date
function getRepublicanCalendar(currentDateTime, vernalEquinox) {
  const FrenchRevolutionaryMonths = {
    1: "Vendémiaire",
    2: "Brumaire",
    3: "Frimaire",
    4: "Nivôse",
    5: "Pluviôse",
    6: "Ventôse",
    7: "Germinal",
    8: "Floréal",
    9: "Prairial",
    10: "Messidor",
    11: "Thermidor",
    12: "Fructidor",
    13: "Sansculottides",
  };

  // Get starting and ending equinoxes, Paris Time (CET)
  let startingEquinox = "";
  let endingEquinox = "";
  let thisYearEquinox = new Date(vernalEquinox);
  thisYearEquinox.setUTCHours(1);
  thisYearEquinox.setMinutes(0);
  thisYearEquinox.setMilliseconds(0);
  if (currentDateTime < thisYearEquinox) {
    let lastYear = new Date(currentDateTime);
    lastYear.setFullYear(currentDateTime.getFullYear() - 1);
    lastYear.setMonth(10);
    startingEquinox = getCurrentSolsticeOrEquinox(lastYear, "autumn");
    endingEquinox = thisYearEquinox;
  } else {
    let nextYear = new Date(currentDateTime);
    nextYear.setFullYear(currentDateTime.getFullYear() + 1);
    nextYear.setMonth(10);
    startingEquinox = thisYearEquinox;
    endingEquinox = getCurrentSolsticeOrEquinox(nextYear, "autumn");
  }

  // Get start of year, Paris Time (CET)
  let startOfRepublicanYear = new Date(startingEquinox);
  startOfRepublicanYear.setUTCHours(1);
  startOfRepublicanYear.setMinutes(0);
  startOfRepublicanYear.setMilliseconds(0);

  // Calculate the number of years since 1792
  let yearsSince1792 = (startOfRepublicanYear.getFullYear() - 1792) + 1;

  // Increment up by 1 to account for no 0 day
  let daysSinceSeptember22 = Math.trunc(
    (currentDateTime - startOfRepublicanYear) / (1000 * 60 * 60 * 24),
  );

  let month = Math.trunc(daysSinceSeptember22 / 30) + 1;
  if (month > 13) {
    month = 0;
  }
  let day = Math.trunc(daysSinceSeptember22 % 30) + 1;
  return day + " " + FrenchRevolutionaryMonths[month] + " " +
    toRomanNumerals(yearsSince1792) + " RE";
}

// Returns a formatted EF local date
function getEraFascista(currentDateTime) {
  // Only update the year if past October 29th, otherwise it is the previous year.
  let october22 = new Date(currentDateTime.getFullYear(), 9, 29);
  october22.setFullYear(currentDateTime.getFullYear());
  if (currentDateTime < october22) {
    october22.setFullYear(october22.getFullYear() - 1);
  }
  let yearsSince1922 = october22.getFullYear() - 1921;
  return `Anno ${toRomanNumerals(yearsSince1922)}`;
}

// Returns a formatted Coptic UTC date based on the Julian Day (not Julian date)
function julianDayToCoptic(julianDay) {
  const copticMonths = [
    "Thout",
    "Paopi",
    "Hathor",
    "Koiak",
    "Tobi",
    "Meshir",
    "Paremhat",
    "Parmouti",
    "Pashons",
    "Paoni",
    "Epip",
    "Mesori",
    "Pi Kogi Enavot",
  ];

  const JD_epoch = 1824665.5; // Julian Day of the start of the Coptic calendar
  const Coptic_monthDays = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 5]; // Number of days in each Coptic month

  // Add 0.5 to JD to make it happen with UTC
  const daysSinceEpoch = Math.trunc(julianDay + 0.5) - JD_epoch;
  const yearsSinceEpoch = Math.trunc((4 * daysSinceEpoch + 3) / 1461);
  const CopticYear = yearsSinceEpoch;

  let remainingDays = daysSinceEpoch -
    (365 * yearsSinceEpoch + Math.trunc(yearsSinceEpoch / 4));
  let CopticMonth = 1;
  while (remainingDays >= Coptic_monthDays[CopticMonth - 1]) {
    remainingDays -= Coptic_monthDays[CopticMonth - 1];
    CopticMonth++;
  }

  // Add 2 days for some reason but it keeps it in sync with Wiki
  const CopticDay = Math.trunc(remainingDays + 2);

  return CopticDay + " " + copticMonths[CopticMonth - 1] + " " + CopticYear +
    " AM";
}

// Returns a formatted Ethiopian UTC date based on the Julian Day (not Julian date)
function julianDayToEthiopian(julianDay) {
  const ethiopianMonths = [
    "Mäskäräm",
    "Ṭəqəmt",
    "Ḫədar",
    "Taḫśaś",
    "Ṭərr",
    "Yäkatit",
    "Mägabit",
    "Miyazya",
    "Gənbo",
    "Säne",
    "Ḥamle",
    "Nähase",
    "Ṗagume",
  ];

  const JD_epoch = 1724221.5; // Julian Day of the start of the Coptic calendar
  const Ethiopian_monthDays = [
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    5,
  ]; // Number of days in each Coptic month

  // Add 0.5 to JD to make it happen with UTC
  const daysSinceEpoch_ = Math.trunc(julianDay + 0.5) - JD_epoch;
  const yearsSinceEpoch_ = Math.trunc((4 * daysSinceEpoch_ + 3) / 1461);
  const EthiopianYear = yearsSinceEpoch_ + 2;

  let remainingDays_ = daysSinceEpoch_ -
    (365 * yearsSinceEpoch_ + Math.trunc(yearsSinceEpoch_ / 4));
  let EthiopianMonth = 1;
  while (remainingDays_ >= Ethiopian_monthDays[EthiopianMonth - 1]) {
    remainingDays_ -= Ethiopian_monthDays[EthiopianMonth - 1];
    EthiopianMonth++;
  }

  // Add 21 day for some reason but it keeps it in sync with Wiki
  const CopticDay = Math.trunc(remainingDays_ + 1);

  return CopticDay + " " + ethiopianMonths[EthiopianMonth - 1] + " ዓ.ም." +
    EthiopianYear;
}

// Returns a formatted Byzantine local date
function getByzantineCalendar(currentDateTime) {
  const julianDate = getJulianDate(currentDateTime);
  // Extract year, month, and day components
  let yearString = julianDate.getFullYear() + 5509 - 1; // Year 1 being 5509
  let monthIndex = julianDate.getMonth(); // Month is zero-based
  let monthString = monthNames[monthIndex];
  let dayString = julianDate.getDate();

  if (monthIndex > 7) {
    yearString += 1;
  }

  let dateString = dayString + " " + monthString + " " + yearString + " AM";
  return dateString;
}

// Returns a formatted Florentine CET date
function getFlorentineCalendar(currentDateTime) {
  let florentineDate = getJulianDate(currentDateTime);

  // Get March 25 of the Florentine calendar (sunset on the 24th UTC+1)
  let march25ThisYear = new Date(florentineDate);
  march25ThisYear.setMonth(2);
  march25ThisYear.setUTCDate(24);
  march25ThisYear.setUTCHours(19);
  march25ThisYear.setMinutes(0);
  march25ThisYear.setSeconds(0);
  march25ThisYear.setMilliseconds(0);

  if (florentineDate.getUTCHours() >= 19) {
    florentineDate.setUTCDate(florentineDate.getUTCDate() + 2);
  } else {
    florentineDate.setUTCDate(florentineDate.getUTCDate() + 1);
  }

  if (florentineDate > march25ThisYear) {
    florentineDate.setUTCFullYear(florentineDate.getUTCFullYear() + 1);
  }

  // Extract year, month, and day components
  let yearString = florentineDate.getUTCFullYear();
  let monthIndex = florentineDate.getUTCMonth(); // Month is zero-based
  let monthString = monthNames[monthIndex];
  let dayString = florentineDate.getUTCDate();

  let yearSuffix = "AD";
  if (yearString < 1) {
    yearSuffix = "BC";
  }

  let dateString = dayString + " " + monthString + " " + yearString + " " +
    yearSuffix;
  return dateString;
}

// Returns a formatted Baha'i IRST date
function getBahaiCalendar(currentDateTime, vernalEquinox) {
  // Calculate if the New Year should start later or earlier based on sunset in Tehran (UTC+3:30)
  function figureOutEquinoxBeforeAfterSunset(equinox) {
    let equinoxDaySunset = new Date(equinox);
    equinoxDaySunset.setUTCHours(12);
    equinoxDaySunset.setMinutes(30);
    equinoxDaySunset.setMilliseconds(0);
    if (equinox < equinoxDaySunset) {
      equinox.setDate(equinox.getDate() - 1);
    }
    equinox.setUTCHours(12);
    equinox.setMinutes(30);
    equinox.setMilliseconds(0);
    return equinox;
  }

  // Figure out if the beginning of Bahai year was last Gregorian year or this year based on equinox
  let startingEquinox = "";
  let endingEquinox = "";
  if (currentDateTime < vernalEquinox) {
    let lastYear = new Date(currentDateTime);
    lastYear.setFullYear(currentDateTime.getFullYear() - 1);
    lastYear.setMonth(10);
    startingEquinox = getCurrentSolsticeOrEquinox(lastYear, "spring");
    endingEquinox = vernalEquinox;
  } else {
    let nextYear = new Date(currentDateTime);
    nextYear.setFullYear(currentDateTime.getFullYear() + 1);
    nextYear.setMonth(10);
    startingEquinox = vernalEquinox;
    endingEquinox = getCurrentSolsticeOrEquinox(nextYear, "spring");
  }

  // Calculate if the New Year should start later or earlier based on sunset in Tehran (UTC+3:30)
  startingEquinox = figureOutEquinoxBeforeAfterSunset(startingEquinox);
  endingEquinox = figureOutEquinoxBeforeAfterSunset(endingEquinox);

  // Calculate when today started based on sunset in Tehran (UTC+3:30)
  currentDayOfYear = Math.trunc(
    (currentDateTime - startingEquinox) / 1000 / 24 / 60 / 60,
  );
  let todaySunsetInTehran = new Date(currentDateTime);
  todaySunsetInTehran.setUTCHours(12);
  todaySunsetInTehran.setMinutes(30);
  todaySunsetInTehran.setMilliseconds(0);

  const BahaMonths = [
    "Bahá",
    "Jalál",
    "Jamál",
    "‘Aẓamat",
    "Núr",
    "Raḥmat",
    "Kalimát",
    "Kamál",
    "Asmá’",
    "‘Izzat",
    "Mashíyyat",
    "‘Ilm",
    "Qudrat",
    "Qawl",
    "Masá’il",
    "Sharaf",
    "Sulṭán",
    "Mulk",
    "Ayyám-i-Há",
    "‘Alá’",
  ];

  // Iterate through months from start until Mulk, find intercalary days, then iterate backwards for Ala
  let monthIndex = 0;
  while (currentDayOfYear >= 19) {
    if (monthIndex < 17) {
      currentDayOfYear -= 19;
      monthIndex++;
    } else {
      let firstDayOfFinalMonth = new Date(endingEquinox);
      firstDayOfFinalMonth.setDate(endingEquinox.getDate() - 19);
      if (((currentDateTime - endingEquinox) / 1000 / 24 / 60 / 60) < -19) {
        currentDayOfYear -= 19;
        monthIndex = 18;
      } else {
        currentDayOfYear = Math.trunc(
          (currentDateTime - firstDayOfFinalMonth) / 1000 / 24 / 60 / 60,
        );
        monthIndex = 19;
      }
    }
  }

  // Correct for 0 indexing
  let day = currentDayOfYear + 1;

  // If after February but less than Month 17 in Bahai, it's past the Bahai New Year
  let year = currentDateTime.getUTCFullYear() - 1844;
  if ((currentDateTime.getMonth() > 1) && (monthIndex < 16)) {
    year++;
  }
  return day + " " + BahaMonths[monthIndex] + " " + year + " BE";
}

function getPataphysicalDate(currentDateTime) {
  let mostRecentSept8 = new Date(currentDateTime.getFullYear(), 8, 8);
  if (currentDateTime < mostRecentSept8) {
    mostRecentSept8.setFullYear(currentDateTime.getFullYear() - 1);
  }

  // Get days since last September, add 1 because days are 0 based
  let remainingDays = Math.floor(
    differenceInDays(currentDateTime, mostRecentSept8),
  );

  const months = [
    "Absolu",
    "Haha",
    "As",
    "Sable",
    "Décervelage",
    "Gueules",
    "Pédale",
    "Clinamen",
    "Palotin",
    "Merdre",
    "Gidouille",
    "Tatane",
    "Phalle",
  ];

  // Last mont doesn't really have 30 days, but it's necessary
  let daysOfMonths = [28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 28, 29];
  let nextSept8 = new Date(mostRecentSept8);
  nextSept8.setFullYear(mostRecentSept8.getFullYear() + 1);
  const daysInYear = differenceInDays(nextSept8, mostRecentSept8);

  if (daysInYear === 366) {
    daysOfMonths = [28, 28, 28, 28, 28, 29, 28, 28, 28, 28, 29, 28, 28];
  }

  // Iterate through days of months and subtract from remaining days
  let monthIndex = 0;
  for (; monthIndex < daysOfMonths.length; monthIndex++) {
    if (remainingDays < daysOfMonths[monthIndex]) {
      break;
    }
    remainingDays -= daysOfMonths[monthIndex];
  }

  const day = remainingDays + 1;
  const month = months[monthIndex];
  let year = mostRecentSept8.getFullYear() - 1872; // Get epoch

  return day + " " + month + " " + year;
}

function getDiscordianDate(currentDateTime) {
  const startOfYear = new Date(currentDateTime.getFullYear(), 0, 1);
  const endOfYear = new Date(currentDateTime.getFullYear() + 1, 0, 1);
  let remainingDays = Math.floor(
    differenceInDays(currentDateTime, startOfYear) + 1,
  );
  const leapYear = differenceInDays(endOfYear, startOfYear) === 366;

  const months = [
    "Chaos",
    "Discord",
    "Confusion",
    "Bureaucracy",
    "The Aftermath",
  ];

  if (leapYear && (remainingDays >= 60)) {
    console.log(remainingDays);
    if (remainingDays === 60) {
      return `St. Tib's Day`;
    }
    remainingDays--;
  }

  const daysPerMonth = 73;
  let month = Math.floor(remainingDays / daysPerMonth);
  let day = Math.floor(remainingDays % daysPerMonth);
  let year = currentDateTime.getFullYear() + 1166;

  return day + " " + months[month] + " " + year + " YOLD";
}
