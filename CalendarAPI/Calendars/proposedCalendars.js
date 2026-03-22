//|----------------------------|
//|     Proposed Calendars     |
//|----------------------------|

// A set of functions for calculating dates in the Proposed Calendars category.

function getHumanEra(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const day = currentDateTime.getUTCDate();
    const month = currentDateTime.getUTCMonth();
    const year = currentDateTime.getUTCFullYear() + 10000;
    const dayOfWeek = currentDateTime.getUTCDay();
    const output = `${day} ${monthNames[month]} ${year} HE\n${weekNames[dayOfWeek]}`;
    return { output, day, month, year, dayOfWeek };
}

// --- Invariable Calendar ---
const INVARIABLE_MONTH_DAYS_LEAP = [1, 30, 30, 31, 30, 30, 31, 1, 30, 30, 31, 30, 30, 31];
const INVARIABLE_MONTH_DAYS = [1, 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31];
const INVARIABLE_MONTH_NAMES_LEAP = ['New Years Day', 'January', 'February', 'March', 'April', 'May', 'June', 'Leap Day', 'July', 'August', 'September', 'October', 'November', 'December'];
const INVARIABLE_MONTH_NAMES = ['New Years Day', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getInvariableCalendarDate(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = createAdjustedDateTime({ year, month: 1, day: 1 });
    const endOfYear = addYear(startOfYear, 1, true);
    const daysSinceStartOfYear = Math.trunc(differenceInDays(currentDateTime, startOfYear)) + 1;
    let daysRemaining = daysSinceStartOfYear;

    const leapYear = (endOfYear - startOfYear) > 365 * 86400000;

    let invariableMonth = '';
    let invariableDate = '';
    let invariableWeek = '\n';

    const monthDaysArr = leapYear ? INVARIABLE_MONTH_DAYS_LEAP : INVARIABLE_MONTH_DAYS;
    const monthNamesArr = leapYear ? INVARIABLE_MONTH_NAMES_LEAP : INVARIABLE_MONTH_NAMES;

    for (let i = 0; i < monthDaysArr.length; i++) {
        daysRemaining -= monthDaysArr[i];
        if (daysRemaining <= 0) {
            invariableMonth = monthNamesArr[i];
            invariableDate = (daysRemaining + monthDaysArr[i]) + ' ';
            break;
        }
    }

    if (leapYear) {
        invariableWeek += weekNames[(daysSinceStartOfYear >= 184 ? daysSinceStartOfYear - 2 : daysSinceStartOfYear - 1) % 7];
    } else {
        invariableWeek += weekNames[(daysSinceStartOfYear - 1) % 7];
    }

    if (invariableMonth === 'New Years Day' || invariableMonth === 'Leap Day') {
        invariableDate = '';
        invariableWeek = '';
    }

    const output = `${invariableDate}${invariableMonth} ${year} CE${invariableWeek}`;
    return { output, day: invariableDate, month: invariableMonth, year, dayOfWeek: invariableWeek };
}

// --- World Calendar ---
const WORLD_MONTH_DAYS_LEAP = [1, 31, 30, 30, 31, 30, 30, 1, 31, 30, 30, 31, 30, 30];
const WORLD_MONTH_DAYS = [1, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 30];
const WORLD_MONTH_NAMES_LEAP = ['World\'s Day', 'January', 'February', 'March', 'April', 'May', 'June', 'Leapyear Day', 'July', 'August', 'September', 'October', 'November', 'December'];
const WORLD_MONTH_NAMES = ['World\'s Day', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getWorldCalendarDate(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear();
    const startOfYear = createAdjustedDateTime({ year, month: 1, day: 1 });
    const endOfYear = addYear(startOfYear, 1, true);
    const daysSinceStartOfYear = Math.trunc(differenceInDays(currentDateTime, startOfYear)) + 1;
    let daysRemaining = daysSinceStartOfYear;

    const leapYear = (endOfYear - startOfYear) > 365 * 86400000;

    let invariableMonth = '';
    let invariableDate = '';
    let invariableWeek = '\n';

    const monthDaysArr = leapYear ? WORLD_MONTH_DAYS_LEAP : WORLD_MONTH_DAYS;
    const monthNamesArr = leapYear ? WORLD_MONTH_NAMES_LEAP : WORLD_MONTH_NAMES;

    for (let i = 0; i < monthDaysArr.length; i++) {
        daysRemaining -= monthDaysArr[i];
        if (daysRemaining <= 0) {
            invariableMonth = monthNamesArr[i];
            invariableDate = (daysRemaining + monthDaysArr[i]) + ' ';
            break;
        }
    }

    if (leapYear) {
        invariableWeek += weekNames[(daysSinceStartOfYear >= 184 ? daysSinceStartOfYear - 3 : daysSinceStartOfYear - 2) % 7];
    } else {
        invariableWeek += weekNames[(daysSinceStartOfYear - 2) % 7];
    }

    if (invariableMonth === 'World\'s Day' || invariableMonth === 'Leapyear Day') {
        invariableDate = '';
        invariableWeek = '';
    }

    const output = `${invariableDate}${invariableMonth} ${year} CE${invariableWeek}`;
    return { output, day: invariableDate, month: invariableMonth, year, dayOfWeek: invariableWeek };
}

// --- Symmetry454 / Symmetry010 ---
const SYMMETRY454_EPOCH_YEAR = 2001;
const SYMMETRY454_MONTH_DAYS = [28, 35, 28, 28, 35, 28, 28, 35, 28, 28, 35, 28];
const SYMMETRY454_MONTH_DAYS_LEAP = [28, 35, 28, 28, 35, 28, 28, 35, 28, 28, 35, 35];
const SYMMETRY010_MONTH_DAYS = [30, 31, 30, 30, 31, 30, 30, 31, 30, 30, 31, 30, 7];
const SYMMETRY_DAYS_PER_YEAR = 364;
const SYMMETRY_DAYS_PER_LEAP_YEAR = 371;

function isSymmetryLeapYear(year) {
    return ((52 * year) + 146) % 293 < 52;
}

function getSymmetry454Date(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const knownJan1st = createAdjustedDateTime({ year: SYMMETRY454_EPOCH_YEAR, month: 1, day: 1 });
    let daysSinceKnownJan1st = Math.floor(differenceInDays(currentDateTime, knownJan1st)) + 1;

    let symmetryYear = SYMMETRY454_EPOCH_YEAR;
    let isLeapYear = false;

    if (daysSinceKnownJan1st > 0) {
        while (daysSinceKnownJan1st > (isLeapYear ? SYMMETRY_DAYS_PER_LEAP_YEAR : SYMMETRY_DAYS_PER_YEAR)) {
            daysSinceKnownJan1st -= (isLeapYear ? SYMMETRY_DAYS_PER_LEAP_YEAR : SYMMETRY_DAYS_PER_YEAR);
            symmetryYear++;
            isLeapYear = isSymmetryLeapYear(symmetryYear);
        }
    } else {
        while (daysSinceKnownJan1st <= 0) {
            symmetryYear--;
            isLeapYear = isSymmetryLeapYear(symmetryYear);
            daysSinceKnownJan1st += (isLeapYear ? SYMMETRY_DAYS_PER_LEAP_YEAR : SYMMETRY_DAYS_PER_YEAR);
        }
    }

    const thisYearIsLeapYear = isSymmetryLeapYear(symmetryYear);
    const monthDays = thisYearIsLeapYear ? SYMMETRY454_MONTH_DAYS_LEAP : SYMMETRY454_MONTH_DAYS;

    let symmetryMonth = 0;
    while (daysSinceKnownJan1st > monthDays[symmetryMonth]) {
        daysSinceKnownJan1st -= monthDays[symmetryMonth];
        symmetryMonth++;
    }

    const dayOfWeek = daysSinceKnownJan1st % 7;
    const output = `${daysSinceKnownJan1st} ${monthNames[symmetryMonth]} ${symmetryYear} CE\n${weekNames[dayOfWeek]}`;
    return { output, day: daysSinceKnownJan1st, month: symmetryMonth, year: symmetryYear, dayOfWeek };
}

function getSymmetry010Date(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const epoch = createAdjustedDateTime({ year: 1, month: 1, day: 1 });

    let daysSinceEpoch = Math.floor(differenceInDays(currentDateTime, epoch));
    let symmetryYear = 1;
    let isLeapYear = false;

    if (daysSinceEpoch > 0) {
        while (daysSinceEpoch > (isLeapYear ? SYMMETRY_DAYS_PER_LEAP_YEAR : SYMMETRY_DAYS_PER_YEAR)) {
            daysSinceEpoch -= (isLeapYear ? SYMMETRY_DAYS_PER_LEAP_YEAR : SYMMETRY_DAYS_PER_YEAR);
            symmetryYear++;
            isLeapYear = isSymmetryLeapYear(symmetryYear);
        }
    } else if (daysSinceEpoch < 0) {
        symmetryYear = 0;
        let yearLength = SYMMETRY_DAYS_PER_YEAR;
        while (daysSinceEpoch < 0) {
            isLeapYear = isSymmetryLeapYear(symmetryYear);
            yearLength = isLeapYear ? SYMMETRY_DAYS_PER_LEAP_YEAR : SYMMETRY_DAYS_PER_YEAR;
            daysSinceEpoch += yearLength;
            symmetryYear--;
        }
        if (daysSinceEpoch >= yearLength) {
            daysSinceEpoch -= yearLength;
            symmetryYear++;
        }
    }

    let symmetryMonth = 0;
    while (daysSinceEpoch >= SYMMETRY010_MONTH_DAYS[symmetryMonth]) {
        daysSinceEpoch -= SYMMETRY010_MONTH_DAYS[symmetryMonth];
        symmetryMonth++;
    }

    let symmetryMonthString;
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

    const symmetryDay = daysSinceEpoch + 1;
    const yearDisplay = symmetryYear <= 0 ? `${Math.abs(symmetryYear)} BCE` : `${symmetryYear} CE`;
    const dayOfWeek = currentDateTime.getUTCDay();
    const output = `${symmetryDay} ${symmetryMonthString} ${yearDisplay}\n${weekNames[dayOfWeek]}`;
    return { output, day: symmetryDay, month: symmetryMonth, year: symmetryYear, dayOfWeek };
}

// --- Positivist calendar ---
const POSITIVIST_MONTH_NAMES = [
    'Moses', 'Homer', 'Aristotle', 'Archimedes', 'Caesar', 'Saint Paul',
    'Charlemagne', 'Dante', 'Gutenberg', 'Shakespeare', 'Descartes', 'Frederick', 'Bichat',
];
const POSITIVIST_MOSES_DAYS = [
    'Prometheus', 'Hercules', 'Orpheus', 'Ulysses', 'Lycurgus', 'Romulus', 'Numa', 'Belus', 'Sesostris', 'Menu',
    'Cyrus', 'Zoroaster', 'The Druids', 'Buddha', 'Fo-Hi', 'Lao-Tzu', 'Meng-Tzu', 'The Priests of Tibet', 'The Priests of Japan', 'Manco Capac',
    'Confucius', 'Abraham', 'Joseph', 'Samuel', 'Solomon', 'Isaac', 'St. John the Baptist', 'Muhammad'
];
const POSITIVIST_HOMER_DAYS = [
    'Hesiod', 'Tyrtaeus', 'Anacreon', 'Pindar', 'Sophocles', 'Theocritus', 'Aeschylus', 'Scopas', 'Zeuxis', 'Ictinus',
    'Praxiteles', 'Lysippus', 'Apelles', 'Phidias', 'Aesop', 'Aristophanes', 'Terence', 'Phaedrus', 'Juvenal', 'Lucian',
    'Plautus', 'Ennius', 'Lucretius', 'Horace', 'Tibullus', 'Ovid', 'Lucan', 'Virgil'
];
const POSITIVIST_ARISTOTLE_DAYS = [
    'Anaximander', 'Anaximenes', 'Heraclitus', 'Anaxagoras', 'Democritus', 'Herodotus', 'Thales', 'Solon', 'Xenophanes', 'Empodocles',
    'Thucydides', 'Archytas', 'Apollonius of Tyrana', 'Pythagoras', 'Aristippus', 'Antisthenes', 'Zeno', 'Cicero', 'Epictetus', 'Tacitus',
    'Socrates', 'Xenocrates', 'Philo of Alexandria', 'St. John the Evangelist', 'St. Justin', 'St. Clement of Alexandria', 'Origen', 'Plato'
];
const POSITIVIST_ARCHIMEDES_DAYS = [
    'Theophrastus', 'Herophilus', 'Eristratus', 'Celsus', 'Galen', 'Avicenna', 'Hippocrates', 'Euclid', 'Aristarchus', 'Theodosius of Bithynia',
    'Hero', 'Pappus', 'Diophantus', 'Apollonius', 'Eudoxus', 'Pytheas', 'Aristarchus', 'Eratosthenes', 'Ptolemy', 'Albategnius',
    'Hipparchus', 'Varro', 'Columella', 'Vitruvius', 'Strabo', 'Frontinus', 'Plutarch', 'Pliny the Elder'
];
const POSITIVIST_CAESAR_DAYS = [
    'Militiades', 'Leonides', 'Aristides', 'Cimon', 'Xenophon', 'Phocion', 'Themistocles', 'Pericles', 'Philip (of Macedon)', 'Demosthenes',
    'Ptolemy Lagus', 'Philipoemen', 'Polybus', 'Alexander (the Great)', 'Junius Brutus', 'Camillus', 'Fabricius', 'Hannibal', 'Paulus Aemilius', 'Marius',
    'Scipio', 'Augustus', 'Vespasian', 'Adrian', 'Antony', 'Papinian', 'Alexander Severus', 'Trajan'
];
const POSITIVIST_SAINT_PAUL_DAYS = [
    'St. Luke', 'St. Cyprian', 'St. Athanasius', 'St. Jerome', 'St. Ambrose', 'St. Monica', 'St. Augustine', 'Constantine', 'Theodosius', 'St. Chrysostom',
    'St. Pulcheria', 'St. Genevieve of Paris', 'St. Gregory the Great', 'Hildebrand', 'St. Benedict', 'St. Boniface', 'St. Isidore of Seville', 'St. Lanfranc', 'St. Heloise', 'The Architects of the Middle Ages',
    'St. Bernard', 'St. Francis Xavier', 'St. Charles Borromeo', 'St. Theresa', 'St. Vincent de Paul', 'Bordalue', 'William Penn', 'Bossuet'
];
const POSITIVIST_CHARLEMAGNE_DAYS = [
    'Theodoric the Great', 'Pelayo', 'Otho the Great', 'St. Henry', 'Villiers', 'Don Juan de Austria', 'Alfred (the Great)', 'Charles Martel', 'El Cid', 'Richard I',
    'Joan of Arc', 'Albuquerque', 'Bayard', 'Godfrey', 'St. Leo the Great', 'Gerbert', 'Peter the Hermit', 'Suger', 'Alexander III', 'St. Francis of Assisi',
    'Innocent III', 'St. Clothilda', 'St. Bathilde', 'St. Stephen of Hungary', 'St. Elizabeth of Hungary', 'Blanche of Castille', 'St. Ferdinand III', 'St. Louis'
];
const POSITIVIST_DANTE_DAYS = [
    'The Troubadours', 'Bocaccio', 'Cervantes', 'Rabelais', 'La Fontaine', 'de Foe', 'Ariosto', 'Leonardo da Vinci', 'Michelangelo', 'Holbein',
    'Poussin', 'Murillo', 'Teniers', 'Raphael', 'Froissart', 'Camões', 'The Spanish Romantics', 'Chateaubriand', 'Sir Walter Scott', 'Manzoni',
    'Tasse', 'Petrarch', 'Thomas à Kempis', 'Madame de Lafayette', 'Fénelon', 'Klopstock', 'Byron', 'Milton'
];
const POSITIVIST_GUTENBERG_DAYS = [
    'Marco Polo', 'Jacques Coeur', 'da Gama', 'Napier', 'Lacaille', 'Cook', 'Columbus', 'Benvenuto Cellini', 'Amontons',
    'Harrison', 'Dolland', 'Arkwright', 'Conté', 'Vaucanson', 'Stevin', 'Mariotte', 'Papin', 'Black', 'Jouffroy',
    'Dalton', 'Watt', 'Bernard de Palissy', 'Guglielmini', 'Duhamel', 'Saussure', 'Coulomb', 'Carnot', 'Montgolfier'
];
const POSITIVIST_SHAKESPEARE_DAYS = [
    'Lope de Vega', 'Moreto', 'Rojas', 'Otway', 'Lessing', 'Goëthe', 'Calderón', 'Tirso', 'Vondel', 'Racine',
    'Voltaire', 'Alfieri', 'Schiller', 'Corneille', 'Alarcón', 'Madame de Motteville', 'Madame de Sévigné', 'Lesage', 'Madame de Staal', 'Fielding',
    'Molière', 'Pergolesi', 'Sacchini', 'Gluck', 'Beethoven', 'Rossini', 'Bellini', 'Mozart'
];
const POSITIVIST_DESCARTES_DAYS = [
    'Albert the Great', 'Roger Bacon', 'St. Bonaventure', 'Ramus', 'Montaigne', 'Campanella', 'Thomas Aquinas', 'Thomas Hobbes', 'Pascal', 'Locke',
    'Vauvernargues', 'Diderot', 'Cabanis', 'Bacon', 'Grotius', 'Fontenelle', 'Vico', 'Fréret', 'Montesquieu', 'Buffon',
    'Leibnitz', 'Adam Smith', 'Kant', 'Condorcet', 'Fichte', 'Joseph de Maistre', 'Hegel', 'Hume'
];
const POSITIVIST_FREDERICK_DAYS = [
    'Marie de Molina', 'Cosimo de Medici', 'Philippe de Comines', 'Isabella of Castille', 'Charles V', 'Henry IV', 'Louis XI', 'Coligny', 'Barneveldt', 'Gustavus Adolphus',
    'de Witt', 'Ruyter', 'William III', 'William the Silent', 'Ximénez', 'Sully', 'Colbert', 'Walpole', 'D\'Aranda', 'Turgot',
    'Richelieu', 'Sidney', 'Franklin', 'Washington', 'Jefferson', 'Bolívar', 'Francia', 'Cromwell'
];
const POSITIVIST_BICHAT_DAYS = [
    'Copernicus', 'Kepler', 'Huygens', 'Jacques Bernoulli', 'Bradley', 'Volta', 'Galileo', 'Viète', 'Wallis', 'Clairaut',
    'Euler', 'D\'Alembert', 'Lagrange', 'Newton', 'Bergmann', 'Priestley', 'Cavendish', 'Guyton Morveau', 'Berthollet', 'Berzelius',
    'Lavoisier', 'Harvey', 'Boerhaave', 'Linnaeus', 'Haller', 'Lamarck', 'Broussais', 'Gall'
];
const POSITIVIST_DAYS_ARRAY = [
    ...POSITIVIST_MOSES_DAYS, ...POSITIVIST_HOMER_DAYS, ...POSITIVIST_ARISTOTLE_DAYS,
    ...POSITIVIST_ARCHIMEDES_DAYS, ...POSITIVIST_CAESAR_DAYS, ...POSITIVIST_SAINT_PAUL_DAYS,
    ...POSITIVIST_CHARLEMAGNE_DAYS, ...POSITIVIST_DANTE_DAYS, ...POSITIVIST_GUTENBERG_DAYS,
    ...POSITIVIST_SHAKESPEARE_DAYS, ...POSITIVIST_DESCARTES_DAYS, ...POSITIVIST_FREDERICK_DAYS,
    ...POSITIVIST_BICHAT_DAYS,
    'The Festival of All the Dead',
    'The Festival of Holy Women',
];

function getPositivistDate(currentDateTime_, timezoneOffset) {
    const currentDateTime = createFauxUTCDate(currentDateTime_, timezoneOffset);
    const year = currentDateTime.getUTCFullYear() - 1788;
    const thisYearEpoch = createAdjustedDateTime({ currentDateTime, month: 1, day: 1 });
    let daysSinceThisYearEpoch = Math.floor(differenceInDays(currentDateTime, thisYearEpoch));

    let positivistDay = POSITIVIST_DAYS_ARRAY[daysSinceThisYearEpoch];
    let dayOfWeek = `\n${weekNames[(daysSinceThisYearEpoch + 1) % 7]}`;

    let month = 0;
    while (daysSinceThisYearEpoch >= 28) {
        daysSinceThisYearEpoch -= 28;
        month++;
    }
    const day = daysSinceThisYearEpoch + 1;

    let dayMonthString;
    if (positivistDay === 'The Festival of All the Dead' || positivistDay === 'The Festival of Holy Women') {
        dayMonthString = positivistDay;
        positivistDay = '';
        dayOfWeek = '';
    } else {
        dayMonthString = `${day} ${POSITIVIST_MONTH_NAMES[month]}`;
        positivistDay = '\n' + positivistDay;
    }

    const output = `${dayMonthString}\n${year} of the Great Crisis${dayOfWeek}${positivistDay}`;
    return { output, day, month, year, dayOfWeek, other: { positivistDay } };
}
