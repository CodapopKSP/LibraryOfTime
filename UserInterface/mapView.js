/*
    |====================|
    |      Map View      |
    |====================|

    Overlay with the world map image (Content/WorldMap.webp) and calendar markers
    from UserInterface/calendarMapPlacements.js. Markers show a cloned grid node in
    a tooltip on hover/focus — they do not select the node or change the description.
*/

(function () {
    'use strict';

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
    var MAP_WHEEL_SENS = 0.0012;

    var _mapPanTx = 0;
    var _mapPanTy = 0;
    var _mapScale = 1;
    var _mapPanViewport = null;
    var _mapPanLayer = null;
    var _mapPointerDrag = null;
    var _mapPinchLastDist = 0;

    function applyMapPanZoomTransform() {
        if (!_mapPanLayer) {
            return;
        }
        _mapPanLayer.style.transform =
            'translate(' + _mapPanTx + 'px,' + _mapPanTy + 'px) scale(' + _mapScale + ')';
        updateMapMarkerPositions();
    }

    function getMapContentSize() {
        if (!_mapPanLayer) {
            return { w: 0, h: 0 };
        }
        var wrap = _mapPanLayer.querySelector('.map-view-map-wrap');
        if (!wrap) {
            return { w: 0, h: 0 };
        }
        var w = wrap.offsetWidth;
        var h = wrap.offsetHeight;
        var img = wrap.querySelector('.map-view-world-img');
        if ((w < 2 || h < 2) && img && img.naturalWidth > 0 && img.naturalHeight > 0) {
            w = img.naturalWidth;
            h = img.naturalHeight;
        }
        return { w: w, h: h };
    }

    /** Scale at which the full map (w×h) fits inside the viewport (one edge flush, no empty margin). */
    function getFitScale() {
        if (!_mapPanViewport) {
            return 1;
        }
        var sz = getMapContentSize();
        var w = sz.w;
        var h = sz.h;
        var vw = _mapPanViewport.clientWidth;
        var vh = _mapPanViewport.clientHeight;
        if (w < 1 || h < 1 || vw < 1 || vh < 1) {
            return 1;
        }
        return Math.min(vw / w, vh / h);
    }

    function syncScaleToViewportLimits() {
        var fit = getFitScale();
        var maxS = fit * MAP_MAX_ZOOM_MULT;
        if (_mapScale > maxS) {
            _mapScale = maxS;
        }
        if (_mapScale < fit) {
            _mapScale = fit;
        }
    }

    /**
     * Set map viewport height to the “fully zoomed out” fitted map height (min of width-fit and height-fit),
     * so the modal shrink-wraps instead of filling a tall empty column.
     */
    function sizeMapViewportHeightToFit() {
        if (!_mapPanViewport || !_mapPanLayer) {
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
        sizeMapViewportHeightToFit();
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
        var vw = _mapPanViewport.clientWidth;
        var vh = _mapPanViewport.clientHeight;
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

    function updateMapMarkerPositions() {
        var root = document.getElementById('map-view-markers');
        if (!root || !_mapPanViewport || !_mapPanLayer) {
            return;
        }
        var vw = _mapPanViewport.clientWidth;
        var vh = _mapPanViewport.clientHeight;
        if (vw < 1 || vh < 1) {
            return;
        }
        var sz = getMapContentSize();
        var w = sz.w;
        var h = sz.h;
        if (w < 1 || h < 1) {
            return;
        }
        var buttons = root.querySelectorAll('.map-view-marker-btn');
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            var nx = parseFloat(btn.getAttribute('data-map-norm-x'));
            var ny = parseFloat(btn.getAttribute('data-map-norm-y'));
            if (Number.isNaN(nx) || Number.isNaN(ny)) {
                continue;
            }
            var left = _mapPanTx + nx * w * _mapScale;
            var top = _mapPanTy + ny * h * _mapScale;
            btn.style.left = left + 'px';
            btn.style.top = top + 'px';
        }
    }

    function clampMapScale(s) {
        var fit = getFitScale();
        var maxS = fit * MAP_MAX_ZOOM_MULT;
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
        _mapPanTx = 0;
        _mapPanTy = 0;
        _mapPinchLastDist = 0;
        sizeMapViewportHeightToFit();
        _mapScale = getFitScale();
        clampMapPan();
    }

    function getViewportLocalCoords(clientX, clientY) {
        if (!_mapPanViewport) {
            return { vx: 0, vy: 0 };
        }
        var rect = _mapPanViewport.getBoundingClientRect();
        return {
            vx: clientX - rect.left,
            vy: clientY - rect.top
        };
    }

    function wireMapPanZoom() {
        _mapPanViewport = document.getElementById('map-view-pan-viewport');
        _mapPanLayer = document.getElementById('map-view-pan-layer');
        if (!_mapPanViewport || !_mapPanLayer) {
            return;
        }

        _mapPanViewport.addEventListener(
            'wheel',
            function (e) {
                e.preventDefault();
                var dy = e.deltaY;
                if (e.deltaMode === 1) {
                    dy *= 16;
                } else if (e.deltaMode === 2) {
                    dy *= 800;
                }
                var c = getViewportLocalCoords(e.clientX, e.clientY);
                var factor = Math.exp(-dy * MAP_WHEEL_SENS);
                mapZoomAtViewportPoint(c.vx, c.vy, _mapScale * factor);
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
            clampMapPan();
        });

        function endPointerDrag(e) {
            if (!_mapPointerDrag || e.pointerId !== _mapPointerDrag.pointerId) {
                return;
            }
            _mapPointerDrag = null;
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
                var mx = (t0.clientX + t1.clientX) / 2;
                var my = (t0.clientY + t1.clientY) / 2;
                var c = getViewportLocalCoords(mx, my);
                mapZoomAtViewportPoint(c.vx, c.vy, _mapScale * ratio);
                e.preventDefault();
            },
            { passive: false }
        );

        _mapPanViewport.addEventListener('touchend', function (e) {
            if (e.touches.length < 2) {
                _mapPinchLastDist = 0;
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
                onMapViewportOrContentChanged();
            });
            ro.observe(_mapPanViewport);
        }
    }

    function openMapView() {
        closeOtherOverlay();
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
        var tip = document.getElementById('map-view-node-tooltip');
        if (!tip) {
            return;
        }
        tip.classList.remove('visible');
        tip.setAttribute('aria-hidden', 'true');
        tip.textContent = '';
    }

    function closeMapView() {
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

    function showMapNodeTooltip(btn, item) {
        if (isMobileLayout()) {
            return;
        }
        var content = getGridContentForNodeId(item.id);
        var nodeEl = content && content.closest('.node');
        if (!nodeEl) {
            return;
        }
        var tip = document.getElementById('map-view-node-tooltip');
        if (!tip) {
            return;
        }

        var sectionEl = nodeEl.closest('.container');
        var wrap = document.createElement('div');
        if (sectionEl) {
            wrap.className = sectionEl.className;
        } else {
            wrap.className = 'container';
        }

        var clone = nodeEl.cloneNode(true);
        stripIdsFromSubtree(clone);
        wrap.appendChild(clone);
        tip.textContent = '';
        tip.appendChild(wrap);

        tip.setAttribute('aria-hidden', 'false');

        var rect = btn.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var top = rect.top;
        tip.style.left = cx + 'px';
        tip.style.top = top + 'px';
        tip.style.transform = 'translate(-50%, calc(-100% - 6px))';

        tip.classList.add('visible');
    }

    function wireMapMarkers() {
        var root = document.getElementById('map-view-markers');
        var placements = window.calendarMapPlacements;
        if (!root || !placements || typeof window.findNodeDataById !== 'function') {
            return;
        }

        root.textContent = '';

        Object.keys(placements).forEach(function (nodeId) {
            var pos = placements[nodeId];
            if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
                return;
            }
            var item = window.findNodeDataById(nodeId);
            if (!item) {
                return;
            }

            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'map-view-marker-btn';
            btn.setAttribute('data-map-norm-x', String(pos.x));
            btn.setAttribute('data-map-norm-y', String(pos.y));
            btn.setAttribute('aria-label', item.name + ' — preview on hover');

            var dot = document.createElement('span');
            dot.className = 'map-view-marker-dot';
            dot.setAttribute('aria-hidden', 'true');
            btn.appendChild(dot);

            btn.addEventListener('mouseenter', function () {
                showMapNodeTooltip(btn, item);
            });

            btn.addEventListener('mouseleave', function () {
                hideMapNodeTooltip();
            });

            btn.addEventListener('focus', function () {
                showMapNodeTooltip(btn, item);
            });

            btn.addEventListener('blur', function () {
                hideMapNodeTooltip();
            });

            root.appendChild(btn);
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
            });
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal && modal.style.display === 'block') {
                closeMapView();
            }
        });
    });
})();
