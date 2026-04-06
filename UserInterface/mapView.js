/*
    |====================|
    |      Map View      |
    |====================|

    Overlay with the world map image (Content/WorldMap.webp) and calendar markers
    from UserInterface/calendarMapPlacements.js. Markers show cloned grid nodes in
    pinned and hover tooltips (desktop: hover uses a second layer above the clicked pin; narrow: tap to pin, tap elsewhere to dismiss).
    They do not select the node or change the description.
    Markers at the same normalized position (within a tiny float epsilon) share one dot
    and combined tooltip; nearby but distinct positions each get their own dot. Each
    distinct node category shows a small type icon in that category’s container font color.
*/

(function () {
    'use strict';

    /** Set true only for local debugging — opens Map View automatically on load. */
    var DEV_AUTO_OPEN_MAP_VIEW = false;

    function isMobileLayout() {
        return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1024px)').matches;
    }

    function setMobileMapToolbarActive(isOpen) {
        if (typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 1024px)').matches) {
            document.body.classList.toggle('mobile-ui-map-open', isOpen);
        }
    }

    function closeOtherOverlay() {
        var cal = document.getElementById('calendar-view-modal');
        if (cal && cal.style.display === 'block') {
            cal.style.display = 'none';
            document.body.classList.remove('mobile-ui-calendar-open');
        }
    }

    /** Maximum zoom relative to “fit entire map in view” (min zoom = fit scale). */
    var MAP_MAX_ZOOM_MULT = 6;
    /** Narrow/mobile layout: higher cap so pinch-zoom can inspect regions more closely. */
    var MAP_MAX_ZOOM_MULT_MOBILE = 10;

    function getMapMaxZoomMult() {
        return isMobileLayout() ? MAP_MAX_ZOOM_MULT_MOBILE : MAP_MAX_ZOOM_MULT;
    }
    /**
     * Wheel zoom sensitivity (exp mapping). Chrome often emits many pixel-mode events with tiny
     * deltaY per tick (smooth scroll / trackpad); Firefox tends toward larger steps — see normalizeWheelDeltaY.
     */
    var MAP_WHEEL_SENS = 0.0012;
    /** Accumulate wheel deltas and apply once per animation frame. */
    var _mapWheelPendingDy = 0;
    var _mapWheelPendingClientX = 0;
    var _mapWheelPendingClientY = 0;
    var _mapWheelRaf = 0;
    /** rAF-coalesce ResizeObserver (Chrome can deliver many callbacks per pinch/resize). */
    var _mapResizeObserverRaf = 0;
    /**
     * Max distance in normalized map coordinates (0–1) for two markers to count as the
     * same point and share one dot + combined tooltip. Intentionally tiny so calendars
     * placed slightly apart (same region, different y) remain separate visible markers.
     */
    var MAP_MARKER_SAME_POINT_EPS = 1e-6;

    /**
     * nodeData `type` → grid section class suffix (see index.html `.container` and styles/containers.css).
     */
    var NODE_TYPE_TO_SECTION_CLASS = {
        'Solar Calendar': 'solar-calendars',
        'Computing Time': 'computing-time',
        'Standard Time': 'standard-time',
        'Decimal Time': 'decimal-time',
        'Other Time': 'other-time',
        'Lunisolar Calendar': 'lunisolar-calendars',
        'Lunar Calendar': 'lunar-calendars',
        'Solilunar Calendar': 'solilunar-calendars',
        'Proposed Calendar': 'proposed-calendars',
        'Other Calendar': 'other-calendars',
        'Astronomical Data': 'astronomical-data',
        'Pop Culture': 'pop-culture',
        'Politics': 'politics'
    };

    /** Crescent moon only — Lunar, Lunisolar, and Solilunar map markers share this glyph (section color differs via CSS). */
    var MAP_MOON_CRESCENT_PATH =
        '<path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/>';

    /** Raster size for inline map icons (viewBox stays 0 0 24 24). ~50% larger than original 12px. */
    var MAP_ICON_RENDER_SIZE_PX = 16;

    /** Filled dot — Standard / Computing / Decimal / Other Time share this shape; section color differs via CSS. */
    var MAP_TIME_DOT_SVG = '<circle cx="12" cy="12" r="6.5" fill="currentColor"/>';

    /**
     * Inline SVG inner markup (viewBox 0 0 24 24). Filled shapes read clearly on the map; color from CSS
     * (container text). Outline color matches node card borders via mapView.css (stroke + --map-node-border).
     */
    var MAP_ICON_SVG_INNER_BY_TYPE = {
        'Solar Calendar':
            '<circle cx="12" cy="12" r="4" fill="currentColor"/>' +
            '<path fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" d="M12 2.8v2.85M12 18.35v2.85M3.95 12h2.65M17.4 12h2.65M6.05 6.05l1.9 1.9M16.05 16.05l1.9 1.9M6.05 17.95l1.9-1.9M16.05 7.95l1.9-1.9"/>',
        'Lunisolar Calendar': MAP_MOON_CRESCENT_PATH,
        'Lunar Calendar': MAP_MOON_CRESCENT_PATH,
        'Solilunar Calendar': MAP_MOON_CRESCENT_PATH,
        'Proposed Calendar':
            '<rect x="6.5" y="5" width="11" height="14" rx="1.2" fill="currentColor" fill-opacity="0.38" stroke="currentColor" stroke-width="1.5"/>' +
            '<path fill="none" stroke="currentColor" stroke-width="1.45" d="M6.5 9h11M11 5V3M15 5V3"/>',
        'Other Calendar':
            '<path fill="currentColor" d="M12 5.5L19 12l-7 6.5-7-6.5z"/>',
        'Standard Time': MAP_TIME_DOT_SVG,
        'Computing Time': MAP_TIME_DOT_SVG,
        'Decimal Time': MAP_TIME_DOT_SVG,
        'Other Time': MAP_TIME_DOT_SVG,
        'Astronomical Data':
            '<path fill="currentColor" d="M12 3l1.2 3.6L17 8l-3.6 1.2L12 13l-1.2-3.6L7 8l3.6-1.2L12 3z"/>' +
            '<circle cx="12" cy="17" r="2.8" fill="currentColor" fill-opacity="0.55" stroke="currentColor" stroke-width="1.2"/>',
        'Pop Culture': '<rect x="6" y="6" width="12" height="12" fill="currentColor"/>',
        'Politics':
            '<path fill="currentColor" fill-opacity="0.52" stroke="currentColor" stroke-width="1.35" d="M6 20V10l6-3 6 3v10"/>' +
            '<path stroke="currentColor" stroke-width="1.3" d="M9 20v-6M15 20v-6M12 7V4"/>'
    };

    function getMapIconClassForNodeType(nodeType) {
        var section = NODE_TYPE_TO_SECTION_CLASS[nodeType];
        return section ? 'map-view-type-icon--' + section : 'map-view-type-icon--unknown';
    }

    function getMapIconSvgInnerForNodeType(nodeType) {
        if (MAP_ICON_SVG_INNER_BY_TYPE[nodeType]) {
            return MAP_ICON_SVG_INNER_BY_TYPE[nodeType];
        }
        return (
            '<rect x="7.5" y="6" width="9" height="12" rx="0.8" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="1.45"/>' +
            '<path stroke="currentColor" stroke-width="1.35" d="M7.5 10h9M12 6V4"/>'
        );
    }

    /**
     * Mark shapes that should get the map outline stroke. We cannot rely on CSS [fill="currentColor"]
     * on SVG from innerHTML — browsers often normalize the attribute (e.g. currentcolor), so those
     * selectors never matched and stroke rules had no effect.
     */
    function tagMapIconOutlineTargets(svg) {
        var nodes = svg.querySelectorAll('circle, path, rect');
        var i;
        var el;
        var fill;
        var tag;
        for (i = 0; i < nodes.length; i++) {
            el = nodes[i];
            fill = el.getAttribute('fill');
            tag = el.tagName.toLowerCase();
            if (fill === 'none' || (fill && fill.toLowerCase() === 'none')) {
                continue;
            }
            if (tag === 'circle') {
                el.classList.add('map-view-marker-icon-outline');
                continue;
            }
            if (fill && fill.toLowerCase() === 'currentcolor') {
                el.classList.add('map-view-marker-icon-outline');
            }
        }
    }

    function appendMapTypeIcon(btn, nodeType) {
        var wrap = document.createElement('span');
        wrap.className = 'map-view-type-icon ' + getMapIconClassForNodeType(nodeType);
        wrap.setAttribute('aria-hidden', 'true');
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'map-view-type-icon-svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', String(MAP_ICON_RENDER_SIZE_PX));
        svg.setAttribute('height', String(MAP_ICON_RENDER_SIZE_PX));
        svg.setAttribute('focusable', 'false');
        svg.innerHTML = getMapIconSvgInnerForNodeType(nodeType);
        tagMapIconOutlineTargets(svg);
        wrap.appendChild(svg);
        btn.appendChild(wrap);
    }

    var _mapPanTx = 0;
    var _mapPanTy = 0;
    var _mapScale = 1;
    var _mapPanViewport = null;
    var _mapPanLayer = null;
    /** Single transform for map + markers (see .map-view-zoom-root). */
    var _mapZoomRoot = null;
    var _mapMarkersSizer = null;
    /** Cached map bitmap layout size (px); refresh only when layout/image changes — not every pan/zoom frame. */
    var _mapCachedContentW = 0;
    var _mapCachedContentH = 0;
    var _mapWrapCached = null;
    /** Cached viewport geometry for clamp/zoom-point math (no getBoundingClientRect/layout per frame). */
    var _mapViewportClientW = 0;
    var _mapViewportClientH = 0;
    var _mapViewportRectLeft = 0;
    var _mapViewportRectTop = 0;
    var _mapPointerDrag = null;
    /** Coalesce pointer-driven pan to one clampMapPan per animation frame (Chrome sends many moves/sec). */
    var _mapDragPanRaf = 0;
    var _mapPinchLastDist = 0;
    var _mapPinchPendingRatio = 1;
    var _mapPinchRaf = 0;
    var _mapPinchPendingMx = 0;
    var _mapPinchPendingMy = 0;
    /** True after marker click: pinned tooltip stays until outside click or hideMapNodeTooltip. */
    var _mapTooltipPinned = false;
    /** Button element last used for pinned tooltip (desktop: skip duplicate hover layer on same marker). */
    var _mapPinnedMarkerBtn = null;

    function applyMapPanZoomTransform() {
        var t = 'translate(' + _mapPanTx + 'px,' + _mapPanTy + 'px) scale(' + _mapScale + ')';
        if (_mapZoomRoot) {
            _mapZoomRoot.style.transform = t;
        } else if (_mapPanLayer) {
            _mapPanLayer.style.transform = t;
        }
        if (_mapMarkersSizer) {
            _mapMarkersSizer.style.setProperty('--map-inv-scale', String(1 / _mapScale));
        }
    }

    /**
     * Read map dimensions from layout (offsetWidth / naturalWidth). Call only when layout or image may have changed.
     */
    function refreshMapContentDimensions() {
        if (!_mapPanLayer) {
            _mapCachedContentW = 0;
            _mapCachedContentH = 0;
            return;
        }
        if (!_mapWrapCached) {
            _mapWrapCached = _mapPanLayer.querySelector('.map-view-map-wrap');
        }
        var wrap = _mapWrapCached;
        if (!wrap) {
            _mapCachedContentW = 0;
            _mapCachedContentH = 0;
            return;
        }
        var w = wrap.offsetWidth;
        var h = wrap.offsetHeight;
        var img = wrap.querySelector('.map-view-world-img');
        if ((w < 2 || h < 2) && img && img.naturalWidth > 0 && img.naturalHeight > 0) {
            w = img.naturalWidth;
            h = img.naturalHeight;
        }
        _mapCachedContentW = w;
        _mapCachedContentH = h;
    }

    function getMapContentSize() {
        return { w: _mapCachedContentW, h: _mapCachedContentH };
    }

    /** Cache viewport client size + bounding rect for zoom anchoring (avoid getBoundingClientRect every wheel tick). */
    function refreshViewportInteractionGeometry() {
        if (!_mapPanViewport) {
            return;
        }
        var r = _mapPanViewport.getBoundingClientRect();
        _mapViewportRectLeft = r.left;
        _mapViewportRectTop = r.top;
        _mapViewportClientW = _mapPanViewport.clientWidth;
        _mapViewportClientH = _mapPanViewport.clientHeight;
    }

    /** Wrap pan-layer + markers in #map-view-zoom-root if missing (older saved HTML). */
    function ensureMapZoomRoot() {
        var vp = document.getElementById('map-view-pan-viewport');
        if (!vp) {
            return;
        }
        var root = document.getElementById('map-view-zoom-root');
        if (root) {
            _mapZoomRoot = root;
            return;
        }
        var layer = document.getElementById('map-view-pan-layer');
        var markers = document.getElementById('map-view-markers');
        if (!layer || !markers) {
            return;
        }
        root = document.createElement('div');
        root.id = 'map-view-zoom-root';
        root.className = 'map-view-zoom-root';
        vp.insertBefore(root, layer);
        root.appendChild(layer);
        root.appendChild(markers);
        _mapZoomRoot = root;
    }

    function ensureMapMarkerLayerRefs() {
        var wrap = document.getElementById('map-view-markers');
        if (!wrap) {
            return;
        }
        _mapMarkersSizer = document.getElementById('map-view-markers-sizer');
        var legacyPan = document.getElementById('map-view-markers-pan');
        if (legacyPan && _mapMarkersSizer && _mapMarkersSizer.parentNode === legacyPan) {
            wrap.insertBefore(_mapMarkersSizer, legacyPan);
            legacyPan.parentNode.removeChild(legacyPan);
        }
        if (!_mapMarkersSizer) {
            _mapMarkersSizer = document.createElement('div');
            _mapMarkersSizer.id = 'map-view-markers-sizer';
            _mapMarkersSizer.className = 'map-view-markers-sizer';
            wrap.appendChild(_mapMarkersSizer);
        }
    }

    /** Match marker coordinate space (0–1 in %) to unscaled map pixel width/height. */
    function syncMarkerSizerToMapContent() {
        ensureMapMarkerLayerRefs();
        if (!_mapMarkersSizer) {
            return;
        }
        if (_mapCachedContentW < 1 || _mapCachedContentH < 1) {
            return;
        }
        _mapMarkersSizer.style.width = _mapCachedContentW + 'px';
        _mapMarkersSizer.style.height = _mapCachedContentH + 'px';
    }

    /** Scale at which the full map (w×h) fits inside the viewport (one edge flush, no empty margin). */
    function getFitScale() {
        var sz = getMapContentSize();
        var w = sz.w;
        var h = sz.h;
        var vw = _mapViewportClientW;
        var vh = _mapViewportClientH;
        if (w < 1 || h < 1 || vw < 1 || vh < 1) {
            return 1;
        }
        return Math.min(vw / w, vh / h);
    }

    function syncScaleToViewportLimits() {
        var fit = getFitScale();
        var maxS = fit * getMapMaxZoomMult();
        if (_mapScale > maxS) {
            _mapScale = maxS;
        }
        if (_mapScale < fit) {
            _mapScale = fit;
        }
    }

    /**
     * Set map viewport height. Desktop: shrink-wrap to the fitted map so the panel stays compact.
     * Mobile (≤1024px): leave height to CSS (50dvh) so the map can letterbox with dead space above/below
     * at min zoom until the user zooms in.
     */
    function sizeMapViewportHeightToFit() {
        if (!_mapPanViewport || !_mapPanLayer) {
            return;
        }
        if (isMobileLayout()) {
            _mapPanViewport.style.height = '';
            _mapPanViewport.style.minHeight = '';
            return;
        }
        var sz = getMapContentSize();
        var w = sz.w;
        var h = sz.h;
        if (w < 1 || h < 1) {
            return;
        }
        var W = _mapPanViewport.clientWidth;
        if (W < 1) {
            return;
        }
        var panel = document.querySelector('#map-view-modal .map-view-panel');
        var topBar = panel && panel.querySelector('.map-view-top-bar');
        var topH = topBar ? topBar.offsetHeight : 40;
        var winH = typeof window.innerHeight === 'number' ? window.innerHeight : 800;
        var margin = Math.max(16, winH * 0.03);
        var Hmax = winH - topH - margin * 2;
        if (panel) {
            var pr = panel.getBoundingClientRect();
            var roomBelow = winH - pr.top - topH - margin;
            Hmax = Math.min(Hmax, Math.max(100, roomBelow));
            var panelMaxCss = Math.min(winH * 0.92, winH - 32);
            var mapCap = Math.max(60, panelMaxCss - topH - 4);
            Hmax = Math.min(Hmax, mapCap);
        }
        Hmax = Math.max(80, Hmax);
        var fit = Math.min(W / w, Hmax / h);
        var vhPx = Math.round(h * fit);
        _mapPanViewport.style.height = vhPx + 'px';
    }

    function onMapViewportOrContentChanged() {
        refreshMapContentDimensions();
        refreshViewportInteractionGeometry();
        sizeMapViewportHeightToFit();
        /* Desktop shrink-wrap changes viewport height; refresh cached client rect/size. */
        refreshViewportInteractionGeometry();
        syncMarkerSizerToMapContent();
        syncScaleToViewportLimits();
        clampMapPan();
    }

    /**
     * Keep pan so the scaled map never leaves a gap: tx/ty clamped to [vw - sw, 0] when map larger than viewport,
     * centered when smaller.
     */
    function clampMapPan() {
        if (!_mapPanViewport || !_mapPanLayer) {
            return;
        }
        var vw = _mapViewportClientW;
        var vh = _mapViewportClientH;
        var sz = getMapContentSize();
        var w = sz.w;
        var h = sz.h;
        if (w < 1 || h < 1 || vw < 1 || vh < 1) {
            applyMapPanZoomTransform();
            return;
        }
        var sw = w * _mapScale;
        var sh = h * _mapScale;

        if (sw <= vw) {
            _mapPanTx = (vw - sw) / 2;
        } else {
            _mapPanTx = Math.max(vw - sw, Math.min(0, _mapPanTx));
        }
        if (sh <= vh) {
            _mapPanTy = (vh - sh) / 2;
        } else {
            _mapPanTy = Math.max(vh - sh, Math.min(0, _mapPanTy));
        }
        applyMapPanZoomTransform();
    }

    function clampMapScale(s) {
        var fit = getFitScale();
        var maxS = fit * getMapMaxZoomMult();
        if (s < fit) {
            return fit;
        }
        if (s > maxS) {
            return maxS;
        }
        return s;
    }

    /**
     * Zoom so the content point under viewport (vx, vy) stays fixed (transform-origin 0 0).
     */
    function mapZoomAtViewportPoint(vx, vy, newScale) {
        newScale = clampMapScale(newScale);
        var lx = (vx - _mapPanTx) / _mapScale;
        var ly = (vy - _mapPanTy) / _mapScale;
        _mapPanTx = vx - lx * newScale;
        _mapPanTy = vy - ly * newScale;
        _mapScale = newScale;
        clampMapPan();
    }

    function resetMapPanZoom() {
        cancelPendingMapWheel();
        cancelPendingMapDragPan();
        if (_mapPinchRaf) {
            cancelAnimationFrame(_mapPinchRaf);
            _mapPinchRaf = 0;
        }
        _mapPinchPendingRatio = 1;
        _mapPanTx = 0;
        _mapPanTy = 0;
        _mapPinchLastDist = 0;
        refreshMapContentDimensions();
        refreshViewportInteractionGeometry();
        sizeMapViewportHeightToFit();
        refreshViewportInteractionGeometry();
        syncMarkerSizerToMapContent();
        _mapScale = getFitScale();
        clampMapPan();
    }

    function getViewportLocalCoords(clientX, clientY) {
        return {
            vx: clientX - _mapViewportRectLeft,
            vy: clientY - _mapViewportRectTop
        };
    }

    /**
     * Normalize WheelEvent deltaY so zoom feels similar across browsers. Chrome/Chromium often uses
     * deltaMode 0 with many small deltas per gesture; Firefox often reports larger pixel steps.
     * Trackpad pinch-zoom on Chromium is typically ctrlKey + small pixel deltaY.
     */
    function normalizeWheelDeltaY(e) {
        var raw = e.deltaY;
        var dy = raw;
        if (e.deltaMode === 1) {
            dy *= 16;
        } else if (e.deltaMode === 2) {
            dy *= 800;
        } else if (e.deltaMode === 0) {
            var ar = Math.abs(raw);
            if (ar > 0 && ar < 34) {
                dy = raw * 3.2;
            }
            if (e.ctrlKey && ar > 0 && ar < 72) {
                dy *= 1.9;
            }
        }
        return dy;
    }

    function flushMapWheelZoom() {
        _mapWheelRaf = 0;
        if (!_mapPanViewport) {
            _mapWheelPendingDy = 0;
            return;
        }
        var dy = _mapWheelPendingDy;
        _mapWheelPendingDy = 0;
        if (dy === 0) {
            return;
        }
        refreshViewportInteractionGeometry();
        var c = getViewportLocalCoords(_mapWheelPendingClientX, _mapWheelPendingClientY);
        var factor = Math.exp(-dy * MAP_WHEEL_SENS);
        mapZoomAtViewportPoint(c.vx, c.vy, _mapScale * factor);
    }

    function cancelPendingMapWheel() {
        if (_mapWheelRaf) {
            cancelAnimationFrame(_mapWheelRaf);
            _mapWheelRaf = 0;
        }
        _mapWheelPendingDy = 0;
    }

    function cancelPendingMapDragPan() {
        if (_mapDragPanRaf) {
            cancelAnimationFrame(_mapDragPanRaf);
            _mapDragPanRaf = 0;
        }
    }

    function flushMapPinchZoom() {
        _mapPinchRaf = 0;
        if (_mapPinchPendingRatio === 1) {
            return;
        }
        refreshViewportInteractionGeometry();
        var c = getViewportLocalCoords(_mapPinchPendingMx, _mapPinchPendingMy);
        var r = _mapPinchPendingRatio;
        _mapPinchPendingRatio = 1;
        mapZoomAtViewportPoint(c.vx, c.vy, _mapScale * r);
    }

    function wireMapPanZoom() {
        _mapPanViewport = document.getElementById('map-view-pan-viewport');
        _mapPanLayer = document.getElementById('map-view-pan-layer');
        if (!_mapPanViewport || !_mapPanLayer) {
            return;
        }
        ensureMapZoomRoot();
        ensureMapMarkerLayerRefs();

        _mapPanViewport.addEventListener(
            'wheel',
            function (e) {
                e.preventDefault();
                _mapWheelPendingDy += normalizeWheelDeltaY(e);
                _mapWheelPendingClientX = e.clientX;
                _mapWheelPendingClientY = e.clientY;
                if (!_mapWheelRaf) {
                    _mapWheelRaf = requestAnimationFrame(flushMapWheelZoom);
                }
            },
            { passive: false }
        );

        _mapPanViewport.addEventListener('pointerdown', function (e) {
            if (e.target.closest && e.target.closest('.map-view-marker-btn')) {
                return;
            }
            if (e.button !== 0) {
                return;
            }
            e.preventDefault();
            _mapPointerDrag = {
                pointerId: e.pointerId,
                startX: e.clientX,
                startY: e.clientY,
                startTx: _mapPanTx,
                startTy: _mapPanTy
            };
            try {
                _mapPanViewport.setPointerCapture(e.pointerId);
            } catch (err) {
                /* ignore */
            }
            _mapPanViewport.classList.add('map-view-pan-viewport--dragging');
        });

        _mapPanViewport.addEventListener('pointermove', function (e) {
            if (!_mapPointerDrag || e.pointerId !== _mapPointerDrag.pointerId) {
                return;
            }
            _mapPanTx = _mapPointerDrag.startTx + (e.clientX - _mapPointerDrag.startX);
            _mapPanTy = _mapPointerDrag.startTy + (e.clientY - _mapPointerDrag.startY);
            if (!_mapDragPanRaf) {
                _mapDragPanRaf = requestAnimationFrame(function () {
                    _mapDragPanRaf = 0;
                    clampMapPan();
                });
            }
        });

        function endPointerDrag(e) {
            if (!_mapPointerDrag || e.pointerId !== _mapPointerDrag.pointerId) {
                return;
            }
            _mapPointerDrag = null;
            cancelPendingMapDragPan();
            clampMapPan();
            try {
                _mapPanViewport.releasePointerCapture(e.pointerId);
            } catch (err2) {
                /* ignore */
            }
            _mapPanViewport.classList.remove('map-view-pan-viewport--dragging');
        }

        _mapPanViewport.addEventListener('pointerup', endPointerDrag);
        _mapPanViewport.addEventListener('pointercancel', endPointerDrag);

        /* Two-finger pinch zoom (touch) */
        _mapPanViewport.addEventListener(
            'touchstart',
            function (e) {
                if (e.touches.length >= 2) {
                    _mapPointerDrag = null;
                    _mapPanViewport.classList.remove('map-view-pan-viewport--dragging');
                }
                if (e.touches.length === 2) {
                    var t0 = e.touches[0];
                    var t1 = e.touches[1];
                    _mapPinchLastDist = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
                    if (_mapPinchLastDist < 1) {
                        _mapPinchLastDist = 1;
                    }
                    e.preventDefault();
                }
            },
            { passive: false }
        );

        _mapPanViewport.addEventListener(
            'touchmove',
            function (e) {
                if (e.touches.length !== 2 || !_mapPinchLastDist) {
                    return;
                }
                var t0 = e.touches[0];
                var t1 = e.touches[1];
                var d = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
                if (d < 1) {
                    return;
                }
                var ratio = d / _mapPinchLastDist;
                _mapPinchLastDist = d;
                /* Touch often emits many moves with ratio barely above 1; exaggerate slightly. */
                var t = ratio - 1;
                if (Math.abs(t) < 0.14) {
                    ratio = 1 + t * 1.65;
                }
                _mapPinchPendingRatio *= ratio;
                _mapPinchPendingMx = (t0.clientX + t1.clientX) / 2;
                _mapPinchPendingMy = (t0.clientY + t1.clientY) / 2;
                if (!_mapPinchRaf) {
                    _mapPinchRaf = requestAnimationFrame(flushMapPinchZoom);
                }
                e.preventDefault();
            },
            { passive: false }
        );

        _mapPanViewport.addEventListener('touchend', function (e) {
            if (e.touches.length < 2) {
                _mapPinchLastDist = 0;
                if (_mapPinchRaf) {
                    cancelAnimationFrame(_mapPinchRaf);
                    _mapPinchRaf = 0;
                }
                _mapPinchPendingRatio = 1;
            }
        });

        var mapImg = _mapPanLayer.querySelector('.map-view-world-img');
        if (mapImg) {
            mapImg.addEventListener('load', function () {
                onMapViewportOrContentChanged();
            });
            if (mapImg.complete && mapImg.naturalWidth > 0) {
                requestAnimationFrame(function () {
                    onMapViewportOrContentChanged();
                });
            }
        }

        if (typeof ResizeObserver !== 'undefined') {
            var ro = new ResizeObserver(function () {
                if (_mapResizeObserverRaf) {
                    return;
                }
                _mapResizeObserverRaf = requestAnimationFrame(function () {
                    _mapResizeObserverRaf = 0;
                    onMapViewportOrContentChanged();
                });
            });
            ro.observe(_mapPanViewport);
        }
    }

    function openMapView() {
        closeOtherOverlay();
        hideMapNodeTooltip();
        var modal = document.getElementById('map-view-modal');
        if (modal) {
            modal.style.display = 'block';
        }
        resetMapPanZoom();
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                onMapViewportOrContentChanged();
            });
        });
        setMobileMapToolbarActive(true);
    }

    function hideMapNodeTooltip() {
        _mapTooltipPinned = false;
        _mapPinnedMarkerBtn = null;
        hidePinnedMapTooltip();
        hideHoverMapTooltip();
    }

    function closeMapView() {
        cancelPendingMapWheel();
        cancelPendingMapDragPan();
        if (_mapPinchRaf) {
            cancelAnimationFrame(_mapPinchRaf);
            _mapPinchRaf = 0;
        }
        _mapPinchPendingRatio = 1;
        var modal = document.getElementById('map-view-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        hideMapNodeTooltip();
        setMobileMapToolbarActive(false);
    }

    function getGridContentForNodeId(nodeId) {
        return document.getElementById(nodeId + '-node');
    }

    function stripIdsFromSubtree(root) {
        if (!root) {
            return;
        }
        root.removeAttribute('id');
        var withIds = root.querySelectorAll('[id]');
        for (var i = 0; i < withIds.length; i++) {
            withIds[i].removeAttribute('id');
        }
    }

    function normDist2D(ax, ay, bx, by) {
        var dx = ax - bx;
        var dy = ay - by;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Group placement entries at the same normalized position (union–find for transitive chains).
     */
    function clusterMapMarkerEntries(entries) {
        var n = entries.length;
        if (n === 0) {
            return [];
        }
        var parent = [];
        var i;
        var j;
        for (i = 0; i < n; i++) {
            parent.push(i);
        }
        function find(x) {
            if (parent[x] !== x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }
        function union(a, b) {
            var ra = find(a);
            var rb = find(b);
            if (ra !== rb) {
                parent[rb] = ra;
            }
        }
        for (i = 0; i < n; i++) {
            for (j = i + 1; j < n; j++) {
                if (
                    normDist2D(entries[i].pos.x, entries[i].pos.y, entries[j].pos.x, entries[j].pos.y) <=
                    MAP_MARKER_SAME_POINT_EPS
                ) {
                    union(i, j);
                }
            }
        }
        var buckets = {};
        for (i = 0; i < n; i++) {
            var r = find(i);
            if (!buckets[r]) {
                buckets[r] = [];
            }
            buckets[r].push(entries[i]);
        }
        var clusters = [];
        for (j in buckets) {
            if (Object.prototype.hasOwnProperty.call(buckets, j)) {
                clusters.push(buckets[j]);
            }
        }
        return clusters;
    }

    function fillMapTooltipFromItems(tip, items) {
        if (!tip || !items || !items.length) {
            return 0;
        }
        tip.textContent = '';
        var k;
        var added = 0;
        for (k = 0; k < items.length; k++) {
            var item = items[k];
            var content = getGridContentForNodeId(item.id);
            var nodeEl = content && content.closest('.node');
            if (!nodeEl) {
                continue;
            }
            var sectionEl = nodeEl.closest('.container');
            var wrap = document.createElement('div');
            wrap.className = sectionEl ? sectionEl.className : 'container';

            var clone = nodeEl.cloneNode(true);
            stripIdsFromSubtree(clone);
            wrap.appendChild(clone);
            tip.appendChild(wrap);
            added++;
        }
        return added;
    }

    function positionTooltipNearMarkerButton(tip, btn) {
        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        tip.style.left = cx + 'px';
        tip.style.top = rect.bottom + 6 + 'px';
        tip.style.transform = 'translateX(-50%)';
    }

    function showPinnedMapTooltip(btn, items) {
        var tip = document.getElementById('map-view-node-tooltip');
        if (!tip) {
            return;
        }
        var added = fillMapTooltipFromItems(tip, items);
        if (added === 0) {
            return;
        }
        tip.setAttribute('aria-hidden', 'false');
        positionTooltipNearMarkerButton(tip, btn);
        tip.classList.add('visible');
    }

    function showHoverMapTooltip(btn, items) {
        var tip = document.getElementById('map-view-hover-tooltip');
        if (!tip) {
            return;
        }
        var added = fillMapTooltipFromItems(tip, items);
        if (added === 0) {
            return;
        }
        tip.setAttribute('aria-hidden', 'false');
        positionTooltipNearMarkerButton(tip, btn);
        tip.classList.add('visible');
    }

    function hideHoverMapTooltip() {
        var tip = document.getElementById('map-view-hover-tooltip');
        if (!tip) {
            return;
        }
        tip.classList.remove('visible');
        tip.setAttribute('aria-hidden', 'true');
        tip.textContent = '';
    }

    function hidePinnedMapTooltip() {
        var tip = document.getElementById('map-view-node-tooltip');
        if (!tip) {
            return;
        }
        tip.classList.remove('visible');
        tip.setAttribute('aria-hidden', 'true');
        tip.textContent = '';
    }

    function wireMapMarkers() {
        ensureMapMarkerLayerRefs();
        var sizer = _mapMarkersSizer;
        var placements = window.calendarMapPlacements;
        if (!sizer || !placements || typeof window.findNodeDataById !== 'function') {
            return;
        }

        sizer.textContent = '';

        var entries = [];
        Object.keys(placements).forEach(function (nodeId) {
            var pos = placements[nodeId];
            if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
                return;
            }
            var item = window.findNodeDataById(nodeId);
            if (!item) {
                return;
            }
            entries.push({ nodeId: nodeId, pos: pos, item: item });
        });

        entries.sort(function (a, b) {
            return a.nodeId < b.nodeId ? -1 : a.nodeId > b.nodeId ? 1 : 0;
        });

        var clusters = clusterMapMarkerEntries(entries);

        clusters.forEach(function (cluster) {
            cluster.sort(function (a, b) {
                var na = a.item.name || a.nodeId;
                var nb = b.item.name || b.nodeId;
                return na < nb ? -1 : na > nb ? 1 : 0;
            });

            var items = [];
            var sumX = 0;
            var sumY = 0;
            var c;
            for (c = 0; c < cluster.length; c++) {
                items.push(cluster[c].item);
                sumX += cluster[c].pos.x;
                sumY += cluster[c].pos.y;
            }
            var cx = sumX / cluster.length;
            var cy = sumY / cluster.length;

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'map-view-marker-btn';
            btn.setAttribute('data-map-norm-x', String(cx));
            btn.setAttribute('data-map-norm-y', String(cy));
            btn.style.left = cx * 100 + '%';
            btn.style.top = cy * 100 + '%';

            var labelNames = [];
            for (c = 0; c < items.length; c++) {
                labelNames.push(items[c].name || items[c].id);
            }
            var ariaLabel = labelNames.join(', ') + ' — preview';
            btn.setAttribute('aria-label', ariaLabel);

            var seenTypes = {};
            var typesOrdered = [];
            for (c = 0; c < cluster.length; c++) {
                var nt = cluster[c].item.type;
                if (!nt || seenTypes[nt]) {
                    continue;
                }
                seenTypes[nt] = true;
                typesOrdered.push(nt);
            }
            if (typesOrdered.length === 0) {
                appendMapTypeIcon(btn, '');
            } else {
                for (var ti = 0; ti < typesOrdered.length; ti++) {
                    appendMapTypeIcon(btn, typesOrdered[ti]);
                }
            }

            btn.addEventListener('mouseenter', function () {
                if (!isMobileLayout()) {
                    if (_mapTooltipPinned && _mapPinnedMarkerBtn === btn) {
                        return;
                    }
                    showHoverMapTooltip(btn, items);
                }
            });

            btn.addEventListener('mouseleave', function () {
                if (!isMobileLayout()) {
                    hideHoverMapTooltip();
                }
            });

            btn.addEventListener('focus', function () {
                if (!isMobileLayout()) {
                    if (_mapTooltipPinned && _mapPinnedMarkerBtn === btn) {
                        return;
                    }
                    showHoverMapTooltip(btn, items);
                }
            });

            btn.addEventListener('blur', function () {
                if (!isMobileLayout()) {
                    hideHoverMapTooltip();
                }
            });

            btn.addEventListener('click', function () {
                hideHoverMapTooltip();
                _mapTooltipPinned = true;
                _mapPinnedMarkerBtn = btn;
                showPinnedMapTooltip(btn, items);
            });

            sizer.appendChild(btn);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var modal = document.getElementById('map-view-modal');
        var btn = document.getElementById('map-view-button');
        var headerCloseBtn = document.getElementById('map-view-modal-close');

        wireMapPanZoom();
        wireMapMarkers();

        var resetBtn = document.getElementById('map-view-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetMapPanZoom();
            });
        }

        if (btn) {
            btn.addEventListener('click', openMapView);
        }

        if (headerCloseBtn) {
            headerCloseBtn.addEventListener('click', closeMapView);
        }

        if (modal) {
            modal.addEventListener('click', function (event) {
                if (event.target === modal) {
                    closeMapView();
                }
                if (event.target && event.target.closest) {
                    if (
                        !event.target.closest('.map-view-marker-btn') &&
                        !event.target.closest('#map-view-node-tooltip') &&
                        !event.target.closest('#map-view-hover-tooltip')
                    ) {
                        hideMapNodeTooltip();
                    }
                }
            });
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal && modal.style.display === 'block') {
                closeMapView();
            }
        });

        if (DEV_AUTO_OPEN_MAP_VIEW) {
            requestAnimationFrame(function () {
                openMapView();
            });
        }
    });
})();
