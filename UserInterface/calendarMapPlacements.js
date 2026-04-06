/*
    |==========================|
    |   Calendar map markers   |
    |==========================|

    Normalized positions (0–1) on the Map View world image, keyed by node id
    (same `id` as in generated node data, without the `-node` suffix).
    Maintained by hand — not part of Docs/nodeData.
*/

(function () {
    'use strict';

    /**
     * @type {Object<string, { x: number, y: number }>}
     * x,y are fractions of image width/height (0 = left/top, 1 = right/bottom).
     */
    window.calendarMapPlacements = {
        gregorian: { x: 0.5042, y: 0.243 }, // Rome
        julian: { x: 0.5042, y: 0.243 }, // Rome
        'french-republican': { x: 0.48, y: 0.2 }, // Paris
        'era-fascista': { x: 0.5042, y: 0.243 }, // Rome
        minguo: { x: 0.7965, y: 0.347 }, // Taipei
        coptic: { x: 0.55, y: 0.309 }, // Alexandria
        geez: { x: 0.58, y: 0.44 }, // Addis Ababa
        thai: { x: 0.7445, y: 0.4155 }, // Bangkok
        juche: { x: 0.793, y: 0.26 }, // Pyongyang
        byzantine: { x: 0.546, y: 0.248 }, // Constantinople
        florentine: { x: 0.501, y: 0.23105 }, // Florence
        pisan: { x: 0.499, y: 0.232 }, // Pisa
        venetian: { x: 0.5038, y: 0.2229 }, // Venice
        bahai: { x: 0.605, y: 0.28 }, // Tehran
        'solar-hijri': { x: 0.605, y: 0.28 }, // Tehran
        qadimi: { x: 0.615, y: 0.305 }, // Yazd
        'egyptian-civil': { x: 0.5545, y: 0.317 }, // Cairo
        mandaean: { x: 0.595, y: 0.31 }, // Nasiriyah
        haab: { x: 0.2315, y: 0.3735 }, // Chitzen Itza
        'anno-lucis': { x: 0.4745, y: 0.184 }, // London
        tabot: { x: 0.2615, y: 0.3895 }, // Kingston, Jamaica
        'icelandic': { x: 0.431, y: 0.1115 }, // Reykjavik
        'saka-samvat': { x: 0.678, y: 0.358 }, // Ujjain

        chinese: { x: 0.77, y: 0.252 }, // Beijing
        'dai-lich': { x: 0.7568, y: 0.369 }, // Hanoi
        'dangun': { x: 0.799, y: 0.269 }, // Seoul
        'babylonian': { x: 0.589, y: 0.305 }, // Babylon
        'hebrew': { x: 0.564, y: 0.305 }, // Jerusalem
        'epirote': { x: 0.526, y: 0.26 }, // Epirus

        'maya-long-count': { x: 0.2315, y: 0.3735 }, // Chitzen Itza
        'tzolkin': { x: 0.2315, y: 0.3735 }, // Chitzen Itza
        'lord-of-the-night-y': { x: 0.2315, y: 0.3735 }, // Chitzen Itza
        pawukon: { x: 0.7865, y: 0.552 }, // Bali
        'yuga-cycle': { x: 0.678, y: 0.358 }, // Ujjain
        'sothic-cycle': { x: 0.5545, y: 0.317 }, // Cairo
        'olympiad': { x: 0.534, y: 0.267 }, // Athens
        'sexagenary-year': { x: 0.77, y: 0.252 }, // Beijing

        'umm-al-qura': { x: 0.578, y: 0.369 }, // Mecca

        'togys-esebi': { x: 0.646, y: 0.187 }, // Astana

        'unix': { x: 0.285, y: 0.25 }, // Murray Hill, New Jersey
        'gps': { x: 0.2755, y: 0.265 }, // Washington D.C.
        'tai': { x: 0.48, y: 0.2 }, // Paris
        'utc': { x: 0.48, y: 0.2 }, // Paris
        'loran-c': { x: 0.2755, y: 0.265 }, // Washington D.C.
        'filetime': { x: 0.16, y: 0.27 }, // San Francisco
        'iso-8601': { x: 0.4885, y: 0.22 }, // Geneva
        'kali-ahargana': { x: 0.678, y: 0.358 }, // Ujjain
        'spreadsheet-now': { x: 0.295, y: 0.24 }, // Cambridge, Massachusetts
        'hebrew-lunation-number': { x: 0.564, y: 0.305 }, // Jerusalem
        'islamic-lunation-number': { x: 0.578, y: 0.369 }, // Mecca
        'thai-lunation-number': { x: 0.7445, y: 0.4155 }, // Bangkok
        'nabonassar-lunation-number': { x: 0.589, y: 0.305 }, // Babylon

        'french-revolutionary': { x: 0.48, y: 0.2 }, // Paris
        'beat': { x: 0.492, y: 0.215 }, // Biel/Bienne, Switzerland

        'stardate': { x: 0.16, y: 0.27 }, // San Francisco
        'shire': { x: 0.4745, y: 0.184 }, // London
    };
})();
