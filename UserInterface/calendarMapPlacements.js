/*
    |==========================|
    |   Calendar map markers   |
    |==========================|

    Map positions are derived from a shared list of city/region coordinates
    (normalized 0–1 on the Map View world image) and a per-node reference to
    one of those keys. Node ids match generated node data (without `-node`).

    Each city has a `label` for map tooltips. Coordinates are maintained here only.
*/

(function () {
    'use strict';

    /**
     * Canonical map anchor points. Keys are stable ids; use only [a-z0-9-].
     * x,y are fractions of image width/height (0 = left/top, 1 = right/bottom).
     * @type {Object<string, { x: number, y: number, label: string }>}
     */
    window.calendarMapCityCoordinates = {
        rome: { x: 0.5042, y: 0.243, label: 'Rome, Italy' },
        paris: { x: 0.48, y: 0.2, label: 'Paris, France' },
        taipei: { x: 0.7965, y: 0.347, label: 'Taipei, Taiwan' },
        alexandria: { x: 0.55, y: 0.309, label: 'Alexandria, Egypt' },
        'addis-ababa': { x: 0.58, y: 0.44, label: 'Addis Ababa, Ethiopia' },
        bangkok: { x: 0.7445, y: 0.4155, label: 'Bangkok, Thailand' },
        pyongyang: { x: 0.793, y: 0.26, label: 'Pyongyang, North Korea' },
        constantinople: { x: 0.546, y: 0.248, label: 'Istanbul, Turkey' },
        florence: { x: 0.501, y: 0.23105, label: 'Florence, Italy' },
        pisa: { x: 0.499, y: 0.232, label: 'Pisa, Italy' },
        venice: { x: 0.5038, y: 0.2229, label: 'Venice, Italy' },
        tehran: { x: 0.605, y: 0.28, label: 'Tehran, Iran' },
        yazd: { x: 0.615, y: 0.305, label: 'Yazd, Iran' },
        cairo: { x: 0.5545, y: 0.317, label: 'Cairo, Egypt' },
        nasiriyah: { x: 0.595, y: 0.31, label: 'Nasiriyah, Iraq' },
        'chichen-itza': { x: 0.2315, y: 0.3735, label: 'Chichén Itzá, Mexico' },
        london: { x: 0.4745, y: 0.184, label: 'London, United Kingdom' },
        'kingston-jamaica': { x: 0.2615, y: 0.3895, label: 'Kingston, Jamaica' },
        reykjavik: { x: 0.431, y: 0.1115, label: 'Reykjavik, Iceland' },
        ujjain: { x: 0.678, y: 0.358, label: 'Ujjain, India' },
        beijing: { x: 0.77, y: 0.252, label: 'Beijing, China' },
        hanoi: { x: 0.7568, y: 0.369, label: 'Hanoi, Vietnam' },
        seoul: { x: 0.799, y: 0.269, label: 'Seoul, South Korea' },
        babylon: { x: 0.589, y: 0.305, label: 'Babylon, Iraq' },
        jerusalem: { x: 0.564, y: 0.305, label: 'Jerusalem, Israel' },
        epirus: { x: 0.526, y: 0.26, label: 'Epirus, Greece' },
        bali: { x: 0.7865, y: 0.552, label: 'Bali, Indonesia' },
        athens: { x: 0.534, y: 0.267, label: 'Athens, Greece' },
        mecca: { x: 0.578, y: 0.369, label: 'Mecca, Saudi Arabia' },
        astana: { x: 0.646, y: 0.187, label: 'Astana, Kazakhstan' },
        'murray-hill-nj': { x: 0.285, y: 0.25, label: 'Murray Hill, NJ, USA' },
        'washington-dc': { x: 0.2755, y: 0.265, label: 'Washington, D.C., USA' },
        'newark-de': { x: 0.28, y: 0.258, label: 'Newark, DE, USA' },
        'cary-nc': { x: 0.269, y: 0.279, label: 'Cary, NC, USA' },
        'san-francisco': { x: 0.1585, y: 0.2685, label: 'San Francisco, CA, USA' },
        'cupertino-ca': { x: 0.1586, y: 0.271, label: 'Cupertino, CA, USA' },
        'redmond-wa': { x: 0.178, y: 0.21, label: 'Redmond, WA, USA' },
        geneva: { x: 0.4885, y: 0.22, label: 'Geneva, Switzerland' },
        'cambridge-ma': { x: 0.295, y: 0.24, label: 'Cambridge, MA, USA' },
        'biel-bienne': { x: 0.492, y: 0.215, label: 'Biel/Bienne, Switzerland' },
        onitsha: { x: 0.489, y: 0.465, label: 'Onitsha, Nigeria' },
    };

    /**
     * Node id → city key from `calendarMapCityCoordinates`.
     * @type {Object<string, string>}
     */
    window.calendarMapNodeCity = {
        gregorian: 'rome',
        julian: 'rome',
        'french-republican': 'paris',
        'era-fascista': 'rome',
        minguo: 'taipei',
        coptic: 'alexandria',
        geez: 'addis-ababa',
        thai: 'bangkok',
        juche: 'pyongyang',
        byzantine: 'constantinople',
        florentine: 'florence',
        pisan: 'pisa',
        venetian: 'venice',
        bahai: 'tehran',
        'solar-hijri': 'tehran',
        qadimi: 'yazd',
        'egyptian-civil': 'cairo',
        mandaean: 'nasiriyah',
        igbo: 'onitsha',
        haab: 'chichen-itza',
        'anno-lucis': 'london',
        tabot: 'kingston-jamaica',
        icelandic: 'reykjavik',
        'saka-samvat': 'ujjain',

        chinese: 'beijing',
        'dai-lich': 'hanoi',
        dangun: 'seoul',
        babylonian: 'babylon',
        hebrew: 'jerusalem',
        epirote: 'epirus',

        'maya-long-count': 'chichen-itza',
        tzolkin: 'chichen-itza',
        'lord-of-the-night-y': 'chichen-itza',
        pawukon: 'bali',
        'yuga-cycle': 'ujjain',
        'sothic-cycle': 'cairo',
        olympiad: 'athens',
        'sexagenary-year': 'beijing',

        'umm-al-qura': 'mecca',

        'togys-esebi': 'astana',

        unix: 'murray-hill-nj',
        gps: 'washington-dc',
        'gps-week-number': 'washington-dc',
        tai: 'paris',
        utc: 'paris',
        'loran-c': 'washington-dc',
        filetime: 'redmond-wa',
        'net-datetime-ticks': 'redmond-wa',
        chrome: 'redmond-wa',
        'unix-hex': 'murray-hill-nj',
        'cocoa-core-data': 'cupertino-ca',
        'mac-hfs': 'cupertino-ca',
        ntp: 'newark-de',
        'dos-fatfat32': 'redmond-wa',
        'sas-4gl': 'cary-nc',
        'iso-8601': 'geneva',
        'kali-ahargana': 'ujjain',
        'spreadsheet-now': 'redmond-wa',
        'hebrew-lunation-number': 'jerusalem',
        'islamic-lunation-number': 'mecca',
        'thai-lunation-number': 'bangkok',
        'nabonassar-lunation-number': 'babylon',

        'french-revolutionary': 'paris',
        beat: 'biel-bienne',

        stardate: 'san-francisco',
        shire: 'london',
    };

    /** @type {Object<string, { x: number, y: number }>} */
    var resolved = {};
    var cities = window.calendarMapCityCoordinates;
    var nodeCity = window.calendarMapNodeCity;
    Object.keys(nodeCity).forEach(function (id) {
        var key = nodeCity[id];
        var c = cities[key];
        if (c && typeof c.x === 'number' && typeof c.y === 'number') {
            resolved[id] = { x: c.x, y: c.y };
        }
    });
    window.calendarMapPlacements = resolved;
})();
