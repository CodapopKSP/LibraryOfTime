//|----------------------------|
//|     Proposed Calendars     |
//|----------------------------|

// A set of functions for calculating dates in the Proposed Calendars category.

function getHumanEra(currentDateTime_, timezoneOffset) {
    let currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    let day = currentDateTime.getUTCDate();
    let month = currentDateTime.getUTCMonth();
    let year = currentDateTime.getUTCFullYear() + 10000;
    const dayOfWeek = currentDateTime.getUTCDay();
    return day + ' ' + monthNames[month] + ' ' + year + ' ' + 'HE\n' + weekNames[dayOfWeek];
}

function getInvariableCalendarDate(currentDateTime_, timezoneOffset) {
    let currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = createAdjustedDateTime({year: year, month: 1, day: 1});
    const endOfYear = addYear(startOfYear, 1, true);
    const daysSinceStartOfYear = Math.trunc(differenceInDays(currentDateTime, startOfYear))+1;
    let daysRemaining = daysSinceStartOfYear;

    // Need two lists for each for Leap Years and non Leap Years
    const monthDaysLeapYear = [1, 30, 30, 31, 30, 30, 31, 1, 30, 30, 31, 30, 30, 31];
    const monthDays = [1, 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];
    const monthNamesLeapYear = ['New Years Day', 'January', 'February', 'March', 'April', 'May', 'June', 'Leap Day', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNames = ['New Years Day', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Designate a leap year if the year is 366 days
    let leapYear = false;
    if ((endOfYear-startOfYear) > 365*1000*60*60*24) {
        leapYear = true;
    }
    let invariableMonth = '';
    let invariableDate = '';
    let invariableWeek = '\n';

    // Iterate through month days to find the current month if a Leap Year
    if (leapYear===true) {
        for (let i = 0; i < monthDaysLeapYear.length; i++) {
            // Find the last month before daysRemaining turns negative
            daysRemaining -= monthDaysLeapYear[i];
            if (daysRemaining <= 0) {
                invariableMonth = monthNamesLeapYear[i];
                // Add a space after for formatting
                invariableDate = (daysRemaining + monthDaysLeapYear[i]) + ' ';
                break;
            }
        }

        // Skip day of week if Leap Day or New Years Day, start on Monday
        if (daysSinceStartOfYear >= 184) {
            invariableWeek += weekNames[(daysSinceStartOfYear-2) % 7];
        } else {
            invariableWeek += weekNames[(daysSinceStartOfYear-1) % 7];
        }
    }

    // Iterate through month days to find the current month if not a Leap Year
    if (leapYear===false) {
        for (let i = 0; i < monthDays.length; i++) {
            // Find the last month before daysRemaining turns negative
            daysRemaining -= monthDays[i];
            if (daysRemaining <= 0) {
                invariableMonth = monthNames[i];
                // Add a space after for formatting
                invariableDate = (daysRemaining + monthDays[i]) + ' ';
                break;
            }
        }

        // Skip day of week if New Years Day, start on Monday
        invariableWeek += weekNames[(daysSinceStartOfYear-1) % 7];
    }

    // Remove the date and week strings if using a named day
    if ((invariableMonth==='New Years Day') || (invariableMonth==='Leap Day')) {
        invariableDate = '';
        invariableWeek = '';
    }

    return invariableDate + invariableMonth + ' ' + year + ' CE' + invariableWeek;
}

function getWorldCalendarDate(currentDateTime_, timezoneOffset) {
    let currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = createAdjustedDateTime({year: year, month: 1, day: 1});
    const endOfYear = addYear(startOfYear, 1, true);
    const daysSinceStartOfYear = Math.trunc(differenceInDays(currentDateTime, startOfYear))+1;
    let daysRemaining = daysSinceStartOfYear;

    // Need two lists for each for Leap Years and non Leap Years
    const monthDaysLeapYear = [1, 31, 30, 30, 31, 30, 30, 1, 31, 30, 30, 31, 30, 30];
    const monthDays = [1, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30];
    const monthNamesLeapYear = ['World\'s Day', 'January', 'February', 'March', 'April', 'May', 'June', 'Leapyear Day', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthNames = ['World\'s Day', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Designate a leap year if the year is 366 days
    let leapYear = false;
    if ((endOfYear-startOfYear) > 365*1000*60*60*24) {
        leapYear = true;
    }
    let invariableMonth = '';
    let invariableDate = '';
    let invariableWeek = '\n';

    // Iterate through month days to find the current month if a Leap Year
    if (leapYear===true) {
        for (let i = 0; i < monthDaysLeapYear.length; i++) {
            // Find the last month before daysRemaining turns negative
            daysRemaining -= monthDaysLeapYear[i];
            if (daysRemaining <= 0) {
                invariableMonth = monthNamesLeapYear[i];
                // Add a space after for formatting
                invariableDate = (daysRemaining + monthDaysLeapYear[i]) + ' ';
                break;
            }
        }

        // Skip day of week if Leap Day or New Years Day, start on Sunday
        if (daysSinceStartOfYear >= 184) {
            invariableWeek += weekNames[(daysSinceStartOfYear-3) % 7];
        } else {
            invariableWeek += weekNames[(daysSinceStartOfYear-2) % 7];
        }
    }

    // Iterate through month days to find the current month if not a Leap Year
    if (leapYear===false) {
        for (let i = 0; i < monthDays.length; i++) {
            // Find the last month before daysRemaining turns negative
            daysRemaining -= monthDays[i];
            if (daysRemaining <= 0) {
                invariableMonth = monthNames[i];
                // Add a space after for formatting
                invariableDate = (daysRemaining + monthDays[i]) + ' ';
                break;
            }
        }

        // Skip day of week if New Years Day, start on Sunday
        invariableWeek += weekNames[(daysSinceStartOfYear-2) % 7];
    }

    // Remove the date string if using a named day
    if ((invariableMonth==='World\'s Day') || (invariableMonth==='Leapyear Day')) {
        invariableDate = '';
        invariableWeek = '';
    }

    return invariableDate + invariableMonth + ' ' + year + ' CE' + invariableWeek;
}

function getSymmetry454Date(currentDateTime_, timezoneOffset) {
    let currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    let monthDays = [28, 35, 28, 28, 35, 28, 28, 35, 28, 28, 35, 28];
    
    // Choose a date that has the same January 1st in both calendars
    const knownJan1st = createAdjustedDateTime({year: 2001, month: 1, day: 1});
    let daysSinceKnownJan1st = Math.floor(differenceInDays(currentDateTime, knownJan1st))+1;

    // Iterate through years and subtract days based on if leap year or normal year
    let symmetryYear = 2001;
    let isLeapYear = false;
    if (daysSinceKnownJan1st > 0) {
        while (daysSinceKnownJan1st > (isLeapYear ? 371 : 364)) {
            daysSinceKnownJan1st -= (isLeapYear ? 371 : 364);
            symmetryYear++;
            const nextYearRemainder = ((52 * symmetryYear) + 146) % 293;
            isLeapYear = (nextYearRemainder < 52);
        }
    } else {
        while (daysSinceKnownJan1st <= 0) {
            symmetryYear--;
            const previousYearRemainder = ((52 * symmetryYear) + 146) % 293;
            isLeapYear = (previousYearRemainder < 52);
            daysSinceKnownJan1st += (isLeapYear ? 371 : 364);
        }
    }
    
    // Set month days based on leap year
    const yearRemainder = ((52*symmetryYear)+146)%293;
    const thisYearIsLeapYear = (yearRemainder < 52);
    if (thisYearIsLeapYear) {
        monthDays = [28, 35, 28, 28, 35, 28, 28, 35, 28, 28, 35, 35];
    }

    // Calculate the Symmetry454 month and day
    let symmetryMonth = 0;
    while (daysSinceKnownJan1st > monthDays[symmetryMonth]) {
        daysSinceKnownJan1st -= monthDays[symmetryMonth];
        symmetryMonth++;
    }

    const dayOfWeek = daysSinceKnownJan1st % 7;

    return daysSinceKnownJan1st + ' ' + monthNames[symmetryMonth] + ' ' + symmetryYear + ' CE\n' + weekNames[dayOfWeek];
}

function getSymmetry010Date(currentDateTime_, timezoneOffset) {
    let currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const monthDays = [30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 7];
    const epoch = createAdjustedDateTime({year: 1, month: 1, day: 1});

    let daysSinceEpoch = Math.floor(differenceInDays(currentDateTime, epoch));
    
    // Step through monthDays and subtract from daysSinceEpoch
    let symmetryYear = 1; // Start from year 1
    let isLeapYear = false;
    
    if (daysSinceEpoch > 0) {
        // Forward from epoch
        while (daysSinceEpoch > (isLeapYear ? 371 : 364)) {
            daysSinceEpoch -= (isLeapYear ? 371 : 364);
            symmetryYear++;
            const nextYearRemainder = ((52 * symmetryYear) + 146) % 293;
            isLeapYear = (nextYearRemainder < 52);
        }
    } else if (daysSinceEpoch < 0) {
        // Backward from epoch
        symmetryYear = 0; // Start at year 0 for negative dates
        let yearLength = 364; // Default year length
        while (daysSinceEpoch < 0) {
            const previousYearRemainder = ((52 * symmetryYear) + 146) % 293;
            isLeapYear = (previousYearRemainder < 52);
            yearLength = isLeapYear ? 371 : 364;
            daysSinceEpoch += yearLength;
            symmetryYear--;
        }
        // Adjust for the fact that we went one year too far back
        if (daysSinceEpoch >= yearLength) {
            daysSinceEpoch -= yearLength;
            symmetryYear++;
        }
    }
    
    // Now find the month and day within the current year
    let symmetryMonth = 0;
    let symmetryMonthString = '';
    while (daysSinceEpoch >= monthDays[symmetryMonth]) {
        daysSinceEpoch -= monthDays[symmetryMonth];
        symmetryMonth++;
        //console.log(daysSinceEpoch, symmetryMonth);
    }
    if (symmetryMonth === 12) {
        if (isLeapYear) {
            symmetryMonthString = 'Irv';
        } else {
            symmetryMonthString = 'January';
            symmetryYear++;
        }
    } else {
        symmetryMonthString = monthNames[symmetryMonth];
    }
    
    const symmetryDay = daysSinceEpoch + 1; // Convert to 1-based day
    
    
    // Handle year display (negative years should show as BCE)
    const yearDisplay = symmetryYear <= 0 ? Math.abs(symmetryYear) + ' BCE' : symmetryYear + ' CE';
    
    let dayOfWeek = currentDateTime.getUTCDay();
    
    return symmetryDay + ' ' + symmetryMonthString + ' ' + yearDisplay + '\n' + weekNames[dayOfWeek];
}

function getPositivistDate(currentDateTime_, timezoneOffset) {

    const positivistMonths = [
        'Moses',
        'Homer',
        'Aristotle',
        'Archimedes',
        'Caesar',
        'Saint Paul',
        'Charlemagne',
        'Dante',
        'Gutenberg',
        'Shakespeare',
        'Descartes',
        'Frederick',
        'Bichat',
    ]

    const mosesDays = [
        'Prometheus', 'Hercules', 'Orpheus', 'Ulysses', 'Lycurgus', 'Romulus', 'Numa', 'Belus', 'Sesostris', 'Menu',
        'Cyrus', 'Zoroaster', 'The Druids', 'Buddha', 'Fo-Hi', 'Lao-Tzu', 'Meng-Tzu', 'The Priests of Tibet', 'The Priests of Japan', 'Manco Capac',
        'Confucius', 'Abraham', 'Joseph', 'Samuel', 'Solomon', 'Isaac', 'St. John the Baptist', 'Muhammad'
    ];
    const homerDays = [
        'Hesiod', 'Tyrtaeus', 'Anacreon', 'Pindar', 'Sophocles', 'Theocritus', 'Aeschylus', 'Scopas', 'Zeuxis', 'Ictinus',
        'Praxiteles', 'Lysippus', 'Apelles', 'Phidias', 'Aesop', 'Aristophanes', 'Terence', 'Phaedrus', 'Juvenal', 'Lucian',
        'Plautus', 'Ennius', 'Lucretius', 'Horace', 'Tibullus', 'Ovid', 'Lucan', 'Virgil'
    ];
    const aristotleDays = [
        'Anaximander', 'Anaximenes', 'Heraclitus', 'Anaxagoras', 'Democritus', 'Herodotus', 'Thales', 'Solon', 'Xenophanes', 'Empodocles',
        'Thucydides', 'Archytas', 'Apollonius of Tyrana', 'Pythagoras', 'Aristippus', 'Antisthenes', 'Zeno', 'Cicero', 'Epictetus', 'Tacitus',
        'Socrates', 'Xenocrates', 'Philo of Alexandria', 'St. John the Evangelist', 'St. Justin', 'St. Clement of Alexandria', 'Origen', 'Plato'
    ];
    const archimedesDays = [
        'Theophrastus', 'Herophilus', 'Eristratus', 'Celsus', 'Galen', 'Avicenna', 'Hippocrates', 'Euclid', 'Aristarchus', 'Theodosius of Bithynia',
        'Hero', 'Pappus', 'Diophantus', 'Apollonius', 'Eudoxus', 'Pytheas', 'Aristarchus', 'Eratosthenes', 'Ptolemy', 'Albategnius',
        'Hipparchus', 'Varro', 'Columella', 'Vitruvius', 'Strabo', 'Frontinus', 'Plutarch', 'Pliny the Elder'
    ];
    const caesarDays = [
        'Militiades', 'Leonides', 'Aristides', 'Cimon', 'Xenophon', 'Phocion', 'Themistocles', 'Pericles', 'Philip (of Macedon)', 'Demosthenes',
        'Ptolemy Lagus', 'Philipoemen', 'Polybus', 'Alexander (the Great)', 'Junius Brutus', 'Camillus', 'Fabricius', 'Hannibal', 'Paulus Aemilius', 'Marius',
        'Scipio', 'Augustus', 'Vespasian', 'Adrian', 'Antony', 'Papinian', 'Alexander Severus', 'Trajan'
    ];
    const saintPaulDays = [
        'St. Luke', 'St. Cyprian', 'St. Athanasius', 'St. Jerome', 'St. Ambrose', 'St. Monica', 'St. Augustine', 'Constantine', 'Theodosius', 'St. Chrysostom',
        'St. Pulcheria', 'St. Genevieve of Paris', 'St. Gregory the Great', 'Hildebrand', 'St. Benedict', 'St. Boniface', 'St. Isidore of Seville', 'St. Lanfranc', 'St. Heloise', 'The Architects of the Middle Ages',
        'St. Bernard', 'St. Francis Xavier', 'St. Charles Borromeo', 'St. Theresa', 'St. Vincent de Paul', 'Bordalue', 'William Penn', 'Bossuet'
    ];
    const charlemagneDays = [
        'Theodoric the Great', 'Pelayo', 'Otho the Great', 'St. Henry', 'Villiers', 'Don Juan de Austria', 'Alfred (the Great)', 'Charles Martel', 'El Cid', 'Richard I',
        'Joan of Arc', 'Albuquerque', 'Bayard', 'Godfrey', 'St. Leo the Great', 'Gerbert', 'Peter the Hermit', 'Suger', 'Alexander III', 'St. Francis of Assisi',
        'Innocent III', 'St. Clothilda', 'St. Bathilde', 'St. Stephen of Hungary', 'St. Elizabeth of Hungary', 'Blanche of Castille', 'St. Ferdinand III', 'St. Louis'
    ];
    const danteDays = [
        'The Troubadours', 'Bocaccio', 'Cervantes', 'Rabelais', 'La Fontaine', 'de Foe', 'Ariosto', 'Leonardo da Vinci', 'Michelangelo', 'Holbein',
        'Poussin', 'Murillo', 'Teniers', 'Raphael', 'Froissart', 'Camões', 'The Spanish Romantics', 'Chateaubriand', 'Sir Walter Scott', 'Manzoni',
        'Tasse', 'Petrarch', 'Thomas à Kempis', 'Madame de Lafayette', 'Fénelon', 'Klopstock', 'Byron', 'Milton'
    ];
    const gutenbergDays = [
        'Marco Polo', 'Jacques Coeur', 'da Gama', 'Napier', 'Lacaille', 'Cook', 'Columbus', 'Benvenuto Cellini', 'Amontons',
        'Harrison', 'Dolland', 'Arkwright', 'Conté', 'Vaucanson', 'Stevin', 'Mariotte', 'Papin', 'Black', 'Jouffroy',
        'Dalton', 'Watt', 'Bernard de Palissy', 'Guglielmini', 'Duhamel', 'Saussure', 'Coulomb', 'Carnot', 'Montgolfier'
    ];
    const shakespeareDays = [
        'Lope de Vega', 'Moreto', 'Rojas', 'Otway', 'Lessing', 'Goëthe', 'Calderón', 'Tirso', 'Vondel', 'Racine',
        'Voltaire', 'Alfieri', 'Schiller', 'Corneille', 'Alarcón', 'Madame de Motteville', 'Madame de Sévigné', 'Lesage', 'Madame de Staal', 'Fielding',
        'Molière', 'Pergolesi', 'Sacchini', 'Gluck', 'Beethoven', 'Rossini', 'Bellini', 'Mozart'
    ];
    const descartesDays = [
        'Albert the Great', 'Roger Bacon', 'St. Bonaventure', 'Ramus', 'Montaigne', 'Campanella', 'Thomas Aquinas', 'Thomas Hobbes', 'Pascal', 'Locke',
        'Vauvernargues', 'Diderot', 'Cabanis', 'Bacon', 'Grotius', 'Fontenelle', 'Vico', 'Fréret', 'Montesquieu', 'Buffon',
        'Leibnitz', 'Adam Smith', 'Kant', 'Condorcet', 'Fichte', 'Joseph de Maistre', 'Hegel', 'Hume'
    ];
    const frederickDays = [
        'Marie de Molina', 'Cosimo de Medici', 'Philippe de Comines', 'Isabella of Castille', 'Charles V', 'Henry IV', 'Louis XI', 'Coligny', 'Barneveldt', 'Gustavus Adolphus',
        'de Witt', 'Ruyter', 'William III', 'William the Silent', 'Ximénez', 'Sully', 'Colbert', 'Walpole', 'D\'Aranda', 'Turgot',
        'Richelieu', 'Sidney', 'Franklin', 'Washington', 'Jefferson', 'Bolívar', 'Francia', 'Cromwell'
    ];
    const bichatDays = [
        'Copernicus', 'Kepler', 'Huygens', 'Jacques Bernoulli', 'Bradley', 'Volta', 'Galileo', 'Viète', 'Wallis', 'Clairaut',
        'Euler', 'D\'Alembert', 'Lagrange', 'Newton', 'Bergmann', 'Priestley', 'Cavendish', 'Guyton Morveau', 'Berthollet', 'Berzelius',
        'Lavoisier', 'Harvey', 'Boerhaave', 'Linnaeus', 'Haller', 'Lamarck', 'Broussais', 'Gall'
    ];

    // Create an array of all the days
    const positivistDaysArray = [
        ...mosesDays,
        ...homerDays,
        ...aristotleDays,
        ...archimedesDays,
        ...caesarDays,
        ...saintPaulDays,
        ...charlemagneDays,
        ...danteDays,
        ...gutenbergDays,
        ...shakespeareDays,
        ...descartesDays,
        ...frederickDays,
        ...bichatDays,
        'The Festival of All the Dead',
        'The Festival of Holy Women',
    ];

    // Calculate the year
    let currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    let year = currentDateTime.getUTCFullYear()-1788;

    // Calculate the days since the start of the year
    const thisYearEpoch = createAdjustedDateTime({currentDateTime: currentDateTime, month: 1, day: 1});
    let daysSinceThisYearEpoch = Math.floor(differenceInDays(currentDateTime, thisYearEpoch));

    // Calculate the positivist named day and day of week
    let positivistDay = positivistDaysArray[daysSinceThisYearEpoch];
    let dayOfWeek = '\n' + weekNames[(daysSinceThisYearEpoch+1) % 7];

    // Calculate the month and day
    let month = 0;
    while (daysSinceThisYearEpoch >= 28) {
        daysSinceThisYearEpoch -= 28;
        month++;
    }
    let day = daysSinceThisYearEpoch+1;

    // Calculate the month and day string. Remove the day of week, day of month, and month if the named day is a festival.
    let dayMonthString = '';
    if ((positivistDay === 'The Festival of All the Dead') || (positivistDay === 'The Festival of Holy Women')) {
        dayMonthString = positivistDay;
        positivistDay = '';
        dayOfWeek = '';
    } else {
        dayMonthString = day + ' ' + positivistMonths[month];
        positivistDay = '\n' + positivistDay;
    }

    return dayMonthString + '\n' + year + ' of the Great Crisis' + dayOfWeek + positivistDay;
}
