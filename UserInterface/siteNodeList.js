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
    'Decimal Time': 'Decimal Time',
    'Other Time': 'Other Time',
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
 * @param {string} categoryType nodeData `type` string (e.g. "Solar Calendar").
 */
function getNodesInCategory(categoryType) {
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
 * After the user picks a category or Back, reopen the native picker when supported so the new list
 * appears without an extra tap. Not used after rebuilding the list when a node is chosen (avoids
 * reopening right after selection).
 */
function tryReopenNodeSelectPicker(selectEl) {
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
 * Top level: placeholder + one option per site category.
 */
function fillNodeSelectCategoryList(selectEl) {
    selectEl.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'None';
    ph.dataset.placeholder = '1';
    selectEl.appendChild(ph);
    const cats = getSiteNodeCategoriesOrdered();
    for (let i = 0; i < cats.length; i++) {
        const opt = document.createElement('option');
        opt.value = NODE_SELECT_TYPE_PREFIX + cats[i].type;
        opt.textContent = cats[i].label;
        selectEl.appendChild(opt);
    }
}

/**
 * Second level: "← Back" first, then nodes (must not pre-select Back).
 * When drilling in without a chosen node, the first node in the list is selected so Back still fires
 * a change event when chosen; pick another node if you need a different one.
 * @param {string} [selectedNodeId] If set and in this category, that node is selected.
 */
function fillNodeSelectNodesForCategory(selectEl, categoryType, selectedNodeId) {
    selectEl.innerHTML = '';
    const items = getNodesInCategory(categoryType);
    const hasSelection = !!(selectedNodeId && items.some(function (n) { return n.id === selectedNodeId; }));

    const backOpt = document.createElement('option');
    backOpt.value = NODE_SELECT_BACK;
    backOpt.textContent = '\u2190 Back';
    selectEl.appendChild(backOpt);

    for (let i = 0; i < items.length; i++) {
        const opt = document.createElement('option');
        opt.value = items[i].id;
        opt.textContent = items[i].name;
        selectEl.appendChild(opt);
    }

    if (hasSelection) {
        selectEl.value = selectedNodeId;
    } else if (items.length) {
        selectEl.value = items[0].id;
    } else {
        selectEl.value = NODE_SELECT_BACK;
    }
}

/**
 * Handles one user change on a categorized node &lt;select&gt; (mutates options for drill-down).
 * @returns {{ action: 'navigate' }|{ action: 'empty' }|{ action: 'node', nodeId: string }}
 */
function siteNodeSelectInterpretChange(selectEl) {
    const v = selectEl.value;
    if (v === NODE_SELECT_BROWSE || v === NODE_SELECT_BACK) {
        fillNodeSelectCategoryList(selectEl);
        selectEl.value = '';
        tryReopenNodeSelectPicker(selectEl);
        return { action: 'navigate' };
    }
    if (v.indexOf(NODE_SELECT_TYPE_PREFIX) === 0) {
        const categoryType = v.substring(NODE_SELECT_TYPE_PREFIX.length);
        fillNodeSelectNodesForCategory(selectEl, categoryType, null);
        tryReopenNodeSelectPicker(selectEl);
        return { action: 'navigate' };
    }
    if (!v) {
        return { action: 'empty' };
    }
    return { action: 'node', nodeId: v };
}
