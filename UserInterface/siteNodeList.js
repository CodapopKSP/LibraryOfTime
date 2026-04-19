/*
    |====================|
    |  Site node catalog |
    |====================|

    Shared helpers for UI that lists every node from the main grid (nodeData).
    Depends on Content/nodeData.js (nodeDataArrays).
*/

/**
 * Maps node `type` (from nodeData) to the same labels used in the main grid section headers (index.html).
 */
const SITE_NODE_CATEGORY_LABELS = {
    'Solar Calendar': 'Solar Calendars',
    'Computing Time': 'Computing Time',
    'Standard Time': 'Standard Time',
    'Alternative Time': 'Alternative Time',
    'Extraterrestrial Time': 'Extraterrestrial Time',
    'Extraterrestrial Calendar': 'Extraterrestrial Calendars',
    'Lunisolar Calendar': 'Lunisolar Calendars',
    'Lunar Calendar': 'Lunar Calendars',
    'Solilunar Calendar': 'Solilunar Calendars',
    'Proposed Calendar': 'Proposed Calendars',
    'Other Calendar': 'Other Calendars',
    'Astronomical Data': 'Astronomical Data',
    'Pop Culture': 'Pop Culture',
    'Politics': 'Political Cycles'
};

/** Prefix for category rows in native &lt;select&gt; values (followed by nodeData `type`). */
const NODE_SELECT_TYPE_PREFIX = 'category:';

/** Navigate back to the category list from a per-category node list. */
const NODE_SELECT_BACK = '__back__';

/** From a filled slot, open the category browser without removing the current node yet. */
const NODE_SELECT_BROWSE = '__browse__';

/** Virtual category: every node on the site (same set as getAllSiteNodeDataItems). */
const NODE_SELECT_ALL_TYPE = '__all__';

/**
 * Hidden option value used as the default selection after drilling into a category without picking a
 * node yet. If &quot;← Back&quot; were selected by default, clicking Back again would not fire
 * a change event (same value), so the native menu would close without navigating.
 */
const NODE_SELECT_DRILL = '__drill__';

/**
 * When the user drills into a category (node list) but has not committed a node yet, we store the
 * category type here. If sync or the browser resets the &lt;select&gt; back to the category list
 * before the next open, ensureNodeSelectDrillBeforeOpen rebuilds the node list on the next
 * tap/focus (common on mobile when the native sheet closes awkwardly).
 */
const _nodeSelectDrillDraft = new WeakMap();

function setNodeSelectDrillDraft(selectEl, categoryType) {
    _nodeSelectDrillDraft.set(selectEl, categoryType);
}

function clearNodeSelectDrillDraft(selectEl) {
    _nodeSelectDrillDraft.delete(selectEl);
}

function getNodeSelectDrillDraft(selectEl) {
    return _nodeSelectDrillDraft.get(selectEl);
}

function isNodeSelectShowingNodeList(selectEl) {
    const opts = selectEl.options;
    return opts.length > 0 && opts[0].value === NODE_SELECT_BACK;
}

/**
 * Always keep a single-line &lt;select&gt; (size 1) so desktop uses the native dropdown/sheet popup.
 * A larger size renders an inline listbox that steals layout space and is not the previous UX.
 * Mobile sheet / coarse-pointer paths also rely on size 1.
 */
function applyNodeSelectListSize(selectEl) {
    if (!selectEl) {
        return;
    }
    selectEl.size = 1;
}

function prefersCoarsePointer() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
}

/**
 * While replacing &lt;select&gt; options, some UAs fire a synchronous &quot;change&quot; when the
 * previous value no longer exists, before the new value is applied — that can commit the first
 * real node. Change listeners should ignore events while dataset.nodeSelectSuppressChange is &quot;1&quot;.
 */
function suppressNodeSelectChange(selectEl, fn) {
    if (!selectEl || typeof fn !== 'function') {
        return;
    }
    selectEl.dataset.nodeSelectSuppressChange = '1';
    try {
        fn();
    } finally {
        delete selectEl.dataset.nodeSelectSuppressChange;
    }
}

/**
 * Call on pointerdown/focus before the native picker opens. If we have a drill draft but the
 * options were replaced with the category list (e.g. sync), rebuild the node list so the second
 * tap shows the right sheet.
 */
function ensureNodeSelectDrillBeforeOpen(selectEl) {
    if (!selectEl) {
        return;
    }
    const draft = getNodeSelectDrillDraft(selectEl);
    if (draft === undefined) {
        return;
    }
    if (isNodeSelectShowingNodeList(selectEl)) {
        return;
    }
    fillNodeSelectNodesForCategory(selectEl, draft, null);
}

/**
 * Idempotent: wires focus once per select; pointerdown only on fine pointers.
 * On touch, mutating options during pointerdown races the native picker and dismisses the sheet
 * on every tap; focus still restores the node list when sync reset the options before open.
 */
function wireNodeSelectDrillRestore(selectEl) {
    if (!selectEl || selectEl.dataset.nodeSelectDrillRestoreWired === '1') {
        return;
    }
    if (selectEl.dataset.mobileSitePicker === '1') {
        return;
    }
    selectEl.dataset.nodeSelectDrillRestoreWired = '1';
    function onRestore() {
        ensureNodeSelectDrillBeforeOpen(selectEl);
    }
    if (!prefersCoarsePointer()) {
        selectEl.addEventListener('pointerdown', onRestore);
    }
    selectEl.addEventListener('focus', onRestore);
}

/**
 * Every node on the main grid (same set as nodeData), sorted by display name.
 * @returns {Array<{ id: string, name?: string, type?: string }>}
 */
function getAllSiteNodeDataItems() {
    const out = [];
    for (let i = 0; i < nodeDataArrays.length; i++) {
        const arr = nodeDataArrays[i];
        for (let j = 0; j < arr.length; j++) {
            out.push(arr[j]);
        }
    }
    out.sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
    });
    return out;
}

/**
 * Categories in main-grid order (nodeDataArrays), with UI labels for the dropdown.
 * @returns {Array<{ type: string, label: string }>}
 */
function getSiteNodeCategoriesOrdered() {
    const result = [];
    for (let i = 0; i < nodeDataArrays.length; i++) {
        const arr = nodeDataArrays[i];
        if (!arr.length) {
            continue;
        }
        const type = arr[0].type;
        if (!type) {
            continue;
        }
        result.push({
            type: type,
            label: SITE_NODE_CATEGORY_LABELS[type] || type
        });
    }
    return result;
}

/**
 * Nodes in one category, sorted by display name.
 * @param {string} categoryType nodeData `type` string (e.g. "Solar Calendar"), or {@link NODE_SELECT_ALL_TYPE} for every node.
 */
function getNodesInCategory(categoryType) {
    if (categoryType === NODE_SELECT_ALL_TYPE) {
        return getAllSiteNodeDataItems();
    }
    const out = [];
    for (let i = 0; i < nodeDataArrays.length; i++) {
        const arr = nodeDataArrays[i];
        for (let j = 0; j < arr.length; j++) {
            if (arr[j].type === categoryType) {
                out.push(arr[j]);
            }
        }
    }
    out.sort(function (a, b) {
        return (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });
    });
    return out;
}

/**
 * Reopen the native picker after any drill step that does not commit a node (see
 * siteNodeSelectInterpretChange: navigate only). Not called after a real node pick.
 *
 * Call showPicker synchronously first while still inside the user gesture that fired change;
 * if the browser rejects it, fall back to focus + showPicker on the next frame.
 */
function tryNodeSelectShowPickerNow(selectEl) {
    if (typeof selectEl.showPicker !== 'function') {
        return false;
    }
    try {
        selectEl.showPicker();
        return true;
    } catch (e) {
        return false;
    }
}

function tryReopenNodeSelectPicker(selectEl) {
    if (prefersCoarsePointer()) {
        return;
    }
    if (tryNodeSelectShowPickerNow(selectEl)) {
        return;
    }
    if (typeof selectEl.showPicker !== 'function') {
        return;
    }
    requestAnimationFrame(function () {
        try {
            selectEl.focus();
            selectEl.showPicker();
        } catch (e) {
            // Not allowed in this context; user can open again manually.
        }
    });
}

/**
 * After &quot;← Back&quot;, do not call showPicker in the same turn as change: many UAs report success
 * without throwing while the native sheet is still dismissing, so we would skip the real reopen.
 * Always wait for paint + a short delay on touch so the sheet can finish; then focus + showPicker,
 * with click() fallback when showPicker is missing or throws.
 */
function tryReopenNodeSelectPickerAfterBack(selectEl) {
    if (prefersCoarsePointer()) {
        return;
    }
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            setTimeout(function () {
                try {
                    selectEl.focus();
                    if (typeof selectEl.showPicker === 'function') {
                        selectEl.showPicker();
                    } else {
                        selectEl.click();
                    }
                } catch (e) {
                    try {
                        selectEl.click();
                    } catch (e2) {
                        // User can open again manually.
                    }
                }
            }, 0);
        });
    });
}

/**
 * Top level: placeholder + one option per site category.
 */
function fillNodeSelectCategoryList(selectEl) {
    suppressNodeSelectChange(selectEl, function () {
        selectEl.innerHTML = '';
        const ph = document.createElement('option');
        ph.value = '';
        ph.textContent = 'None';
        ph.dataset.placeholder = '1';
        selectEl.appendChild(ph);
        const allOpt = document.createElement('option');
        allOpt.value = NODE_SELECT_TYPE_PREFIX + NODE_SELECT_ALL_TYPE;
        allOpt.textContent = 'All';
        selectEl.appendChild(allOpt);
        const cats = getSiteNodeCategoriesOrdered();
        for (let i = 0; i < cats.length; i++) {
            const opt = document.createElement('option');
            opt.value = NODE_SELECT_TYPE_PREFIX + cats[i].type;
            opt.textContent = cats[i].label;
            selectEl.appendChild(opt);
        }
        applyNodeSelectListSize(selectEl);
    });
}

/**
 * Second level: "← Back" first, then nodes in that category.
 * When drilling without a chosen node, a hidden placeholder is selected (not Back) so Back can
 * still fire a change event when chosen; the first real node is never auto-committed.
 * @param {string} [selectedNodeId] If set and in this category, that node is selected.
 */
function fillNodeSelectNodesForCategory(selectEl, categoryType, selectedNodeId) {
    suppressNodeSelectChange(selectEl, function () {
        selectEl.innerHTML = '';
        const items = getNodesInCategory(categoryType);
        const hasSelection = !!(selectedNodeId && items.some(function (n) { return n.id === selectedNodeId; }));

        const backOpt = document.createElement('option');
        backOpt.value = NODE_SELECT_BACK;
        backOpt.textContent = '\u2190 Back';
        selectEl.appendChild(backOpt);

        if (!hasSelection && items.length) {
            const drillOpt = document.createElement('option');
            drillOpt.value = NODE_SELECT_DRILL;
            drillOpt.hidden = true;
            drillOpt.textContent = '\u200b';
            drillOpt.dataset.drillPlaceholder = '1';
            selectEl.appendChild(drillOpt);
        }

        for (let i = 0; i < items.length; i++) {
            const opt = document.createElement('option');
            opt.value = items[i].id;
            opt.textContent = items[i].name;
            selectEl.appendChild(opt);
        }

        if (hasSelection) {
            selectEl.value = selectedNodeId;
        } else if (items.length) {
            selectEl.value = NODE_SELECT_DRILL;
        } else {
            selectEl.selectedIndex = 0;
        }
        applyNodeSelectListSize(selectEl);
    });
}

/**
 * Handles one user change on a categorized node &lt;select&gt; (mutates options for drill-down).
 * Navigation choices (category, Back, browse) rebuild options and may reopen the native picker.
 * A committed node id or empty &quot;None&quot; does not reopen.
 * @returns {{ action: 'navigate' }|{ action: 'empty' }|{ action: 'node', nodeId: string }}
 */
function siteNodeSelectInterpretChange(selectEl) {
    const v = selectEl.value;
    if (v === NODE_SELECT_BACK) {
        clearNodeSelectDrillDraft(selectEl);
        fillNodeSelectCategoryList(selectEl);
        selectEl.value = '';
        tryReopenNodeSelectPickerAfterBack(selectEl);
        return { action: 'navigate' };
    }
    if (v === NODE_SELECT_BROWSE) {
        clearNodeSelectDrillDraft(selectEl);
        fillNodeSelectCategoryList(selectEl);
        selectEl.value = '';
        setTimeout(function () {
            tryReopenNodeSelectPicker(selectEl);
        }, 0);
        return { action: 'navigate' };
    }
    if (v.indexOf(NODE_SELECT_TYPE_PREFIX) === 0) {
        const categoryType = v.substring(NODE_SELECT_TYPE_PREFIX.length);
        fillNodeSelectNodesForCategory(selectEl, categoryType, null);
        setNodeSelectDrillDraft(selectEl, categoryType);
        setTimeout(function () {
            tryReopenNodeSelectPicker(selectEl);
        }, 0);
        return { action: 'navigate' };
    }
    if (v === NODE_SELECT_DRILL) {
        return { action: 'navigate' };
    }
    if (!v) {
        clearNodeSelectDrillDraft(selectEl);
        return { action: 'empty' };
    }
    clearNodeSelectDrillDraft(selectEl);
    return { action: 'node', nodeId: v };
}

/** Used by {@link UserInterface/siteNodeMobilePicker.js} (same file scope cannot share const across scripts). */
window.SiteNodeListConstants = {
    TYPE_PREFIX: NODE_SELECT_TYPE_PREFIX,
    BACK: NODE_SELECT_BACK,
    BROWSE: NODE_SELECT_BROWSE,
    ALL_TYPE: NODE_SELECT_ALL_TYPE,
    DRILL: NODE_SELECT_DRILL
};
