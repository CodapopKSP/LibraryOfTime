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
        gregorian: { x: 0.5, y: 0.5 }
    };
})();
