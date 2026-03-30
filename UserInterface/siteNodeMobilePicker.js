/*
 * Coarse-pointer (touch) UI for site node <select> drill-down.
 * Native mobile <select> cannot guarantee "each tap reopens or commits"; this uses a button +
 * full-screen sheet with option rows so navigation never fights the OS picker.
 *
 * Depends on siteNodeList.js (SiteNodeListConstants, fill helpers invoked via change dispatch).
 */

(function () {
    'use strict';

    const _uiBySelect = new WeakMap();
    let _sheetLayerCount = 0;

    /** Touch UIs only; wide viewports keep native &lt;select&gt; (matches responsive.css mobile breakpoint). */
    function shouldUseMobileSiteNodePicker() {
        if (typeof window.matchMedia !== 'function') {
            return false;
        }
        if (!window.matchMedia('(pointer: coarse)').matches) {
            return false;
        }
        if (!window.matchMedia('(max-width: 1024px)').matches) {
            return false;
        }
        return true;
    }

    function getC() {
        return window.SiteNodeListConstants || {};
    }

    /**
     * @param {string} value
     * @returns {'empty'|'back'|'browse'|'category'|'drill'|'node'}
     */
    function rowKindForValue(value) {
        const C = getC();
        if (!value) {
            return 'empty';
        }
        if (value === C.BACK) {
            return 'back';
        }
        if (value === C.BROWSE) {
            return 'browse';
        }
        if (C.DRILL && value === C.DRILL) {
            return 'drill';
        }
        if (typeof value === 'string' && C.TYPE_PREFIX && value.indexOf(C.TYPE_PREFIX) === 0) {
            return 'category';
        }
        return 'node';
    }

    function setTriggerLabel(selectEl, triggerBtn) {
        var opt = selectEl.selectedOptions && selectEl.selectedOptions[0];
        if (!opt) {
            triggerBtn.textContent = 'Choose…';
            return;
        }
        if (opt.dataset && opt.dataset.placeholder === '1') {
            triggerBtn.textContent = 'Choose…';
            return;
        }
        if (opt.dataset && opt.dataset.drillPlaceholder === '1') {
            triggerBtn.textContent = 'Choose…';
            return;
        }
        triggerBtn.textContent = opt.textContent || 'Choose…';
    }

    function bumpSheetLayers(delta) {
        _sheetLayerCount += delta;
        if (_sheetLayerCount < 0) {
            _sheetLayerCount = 0;
        }
        document.body.classList.toggle('site-node-mobile-sheet-active', _sheetLayerCount > 0);
    }

    function ensureEscapeCloser() {
        if (ensureEscapeCloser._bound) {
            return;
        }
        ensureEscapeCloser._bound = true;
        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') {
                return;
            }
            var sheets = document.querySelectorAll('.site-node-mobile-sheet:not([hidden])');
            if (!sheets.length) {
                return;
            }
            var top = sheets[sheets.length - 1];
            if (typeof top.__siteNodeCloseSheet === 'function') {
                top.__siteNodeCloseSheet();
            }
        });
    }

    /**
     * @param {HTMLSelectElement} selectEl
     */
    function mountMobileSiteNodePicker(selectEl) {
        if (!selectEl || !shouldUseMobileSiteNodePicker()) {
            return;
        }
        if (selectEl.dataset.mobileSitePicker === '1') {
            return;
        }
        selectEl.dataset.mobileSitePicker = '1';

        var wrap = document.createElement('div');
        wrap.className = 'site-node-mobile-picker-wrap';
        selectEl.parentNode.insertBefore(wrap, selectEl);
        wrap.appendChild(selectEl);

        var trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'site-node-mobile-picker-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        wrap.insertBefore(trigger, selectEl);

        selectEl.classList.add('site-node-mobile-picker-hidden');
        selectEl.setAttribute('aria-hidden', 'true');
        selectEl.tabIndex = -1;

        var sheet = document.createElement('div');
        sheet.className = 'site-node-mobile-sheet';
        sheet.setAttribute('hidden', '');
        sheet.setAttribute('aria-hidden', 'true');
        sheet.innerHTML =
            '<div class="site-node-mobile-sheet-backdrop" tabindex="-1"></div>' +
            '<div class="site-node-mobile-sheet-panel" role="dialog" aria-modal="true">' +
            '<div class="site-node-mobile-sheet-back-slot"></div>' +
            '<div class="site-node-mobile-sheet-list-wrap">' +
            '<div class="site-node-mobile-sheet-scroll-hint site-node-mobile-sheet-scroll-hint--top" aria-hidden="true"></div>' +
            '<div class="site-node-mobile-sheet-list" role="listbox"></div>' +
            '<div class="site-node-mobile-sheet-scroll-hint site-node-mobile-sheet-scroll-hint--bottom" aria-hidden="true"></div>' +
            '</div>' +
            '</div>';
        document.body.appendChild(sheet);

        var backdrop = sheet.querySelector('.site-node-mobile-sheet-backdrop');
        var backSlotEl = sheet.querySelector('.site-node-mobile-sheet-back-slot');
        var listEl = sheet.querySelector('.site-node-mobile-sheet-list');
        var scrollHintTop = sheet.querySelector('.site-node-mobile-sheet-scroll-hint--top');
        var scrollHintBottom = sheet.querySelector('.site-node-mobile-sheet-scroll-hint--bottom');

        function updateScrollHints() {
            if (!listEl || !scrollHintTop || !scrollHintBottom) {
                return;
            }
            var el = listEl;
            var eps = 2;
            var overflow = el.scrollHeight > el.clientHeight + eps;
            if (!overflow) {
                scrollHintTop.classList.add('site-node-mobile-sheet-scroll-hint--inactive');
                scrollHintBottom.classList.add('site-node-mobile-sheet-scroll-hint--inactive');
                return;
            }
            scrollHintTop.classList.toggle('site-node-mobile-sheet-scroll-hint--inactive', el.scrollTop <= eps);
            scrollHintBottom.classList.toggle(
                'site-node-mobile-sheet-scroll-hint--inactive',
                el.scrollTop + el.clientHeight >= el.scrollHeight - eps
            );
        }

        var scrollHintRaf = 0;
        function scheduleScrollHints() {
            if (scrollHintRaf) {
                return;
            }
            scrollHintRaf = requestAnimationFrame(function () {
                scrollHintRaf = 0;
                updateScrollHints();
            });
        }

        function scheduleScrollHintsAfterLayout() {
            requestAnimationFrame(function () {
                requestAnimationFrame(updateScrollHints);
            });
        }

        listEl.addEventListener('scroll', scheduleScrollHints);
        if (typeof ResizeObserver !== 'undefined') {
            new ResizeObserver(scheduleScrollHints).observe(listEl);
        }

        function closeSheet() {
            sheet.setAttribute('hidden', '');
            sheet.setAttribute('aria-hidden', 'true');
            trigger.setAttribute('aria-expanded', 'false');
            bumpSheetLayers(-1);
        }

        function openSheet() {
            sheet.removeAttribute('hidden');
            sheet.setAttribute('aria-hidden', 'false');
            trigger.setAttribute('aria-expanded', 'true');
            bumpSheetLayers(1);
            rebuildList();
            scheduleScrollHintsAfterLayout();
            ensureEscapeCloser();
        }

        function wireRowClick(row, opt) {
            row.addEventListener('click', function () {
                var value = opt.value;
                var kind = rowKindForValue(value);
                selectEl.value = value;
                selectEl.dispatchEvent(new Event('change', { bubbles: true }));
                setTriggerLabel(selectEl, trigger);
                if (kind === 'node' || kind === 'empty') {
                    closeSheet();
                } else {
                    rebuildList();
                    scheduleScrollHintsAfterLayout();
                }
            });
        }

        function appendOptionRow(opt, parentEl) {
            var parent = parentEl || listEl;
            var row = document.createElement('button');
            row.type = 'button';
            var C = getC();
            var rowClass = 'site-node-mobile-sheet-row';
            if (C.BACK && opt.value === C.BACK) {
                rowClass += ' site-node-mobile-sheet-row--back';
            }
            row.className = rowClass;
            if (parent === backSlotEl) {
                row.setAttribute('role', 'button');
            } else {
                row.setAttribute('role', 'option');
            }
            row.textContent = opt.textContent;
            row.dataset.value = opt.value;
            wireRowClick(row, opt);
            parent.appendChild(row);
        }

        function rebuildList() {
            listEl.innerHTML = '';
            if (backSlotEl) {
                backSlotEl.innerHTML = '';
            }
            var opts = selectEl.options;
            var n = opts.length;
            var i;
            var C = getC();
            var isNodeList = n > 0 && opts[0].value === C.BACK;

            if (isNodeList) {
                appendOptionRow(opts[0], backSlotEl);
                for (i = 1; i < n; i++) {
                    if (opts[i].hidden) {
                        continue;
                    }
                    appendOptionRow(opts[i], listEl);
                }
            } else {
                for (i = 0; i < n; i++) {
                    appendOptionRow(opts[i], listEl);
                }
            }
            scheduleScrollHintsAfterLayout();
        }

        sheet.__siteNodeCloseSheet = function () {
            closeSheet();
        };

        trigger.addEventListener('click', function () {
            if (sheet.hasAttribute('hidden')) {
                openSheet();
            }
        });

        backdrop.addEventListener('click', function () {
            closeSheet();
        });

        selectEl.addEventListener('change', function () {
            if (selectEl.dataset.nodeSelectSuppressChange === '1') {
                return;
            }
            setTriggerLabel(selectEl, trigger);
        });

        setTriggerLabel(selectEl, trigger);

        _uiBySelect.set(selectEl, { trigger: trigger, sheet: sheet });
    }

    /**
     * Call after programmatic option fills (e.g. sync) when change may not fire.
     * @param {HTMLSelectElement} selectEl
     */
    function syncMobileSiteNodePickerTrigger(selectEl) {
        var ui = _uiBySelect.get(selectEl);
        if (!ui || !ui.trigger) {
            return;
        }
        setTriggerLabel(selectEl, ui.trigger);
    }

    window.mountMobileSiteNodePicker = mountMobileSiteNodePicker;
    window.syncMobileSiteNodePickerTrigger = syncMobileSiteNodePickerTrigger;
})();
