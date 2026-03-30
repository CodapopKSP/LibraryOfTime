/*
    |========================|
    |  Site node picker (UI) |
    |========================|

    Button + custom list for choosing nodes/categories. Stays open while drilling categories
    or using Back; closes only when a node is chosen, "None" is chosen, or the user dismisses
    (outside tap or Escape). Hidden <select> holds the committed value for existing sync/clear logic.

    Depends on siteNodeList.js (getSiteNodeCategoriesOrdered, getNodesInCategory, fill helpers).
*/

(function () {
    var NODE_SELECT_TYPE_PREFIX = 'category:';
    var NODE_SELECT_BACK = '__back__';
    var NODE_SELECT_ALL_TYPE = '__all__';

    var _activeClose = null;
    var _closeByRoot = new WeakMap();

    function closeAnyActiveSiteNodePicker() {
        if (_activeClose) {
            _activeClose();
            _activeClose = null;
        }
    }

    function syncTriggerLabel(trigger, hiddenSelect) {
        var v = hiddenSelect.value;
        var i;
        var opt;
        for (i = 0; i < hiddenSelect.options.length; i++) {
            opt = hiddenSelect.options[i];
            if (opt.value === v) {
                trigger.textContent = (opt.textContent || '').replace(/\u200b/g, '').trim() || '\u00a0';
                return;
            }
        }
        trigger.textContent = '\u00a0';
    }

    function renderCategories(dropdown) {
        dropdown.innerHTML = '';
        var cats = typeof getSiteNodeCategoriesOrdered === 'function' ? getSiteNodeCategoriesOrdered() : [];
        function addRow(value, label, extraClass) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'site-node-picker-row' + (extraClass ? ' ' + extraClass : '');
            btn.setAttribute('role', 'option');
            btn.dataset.value = value;
            btn.textContent = label;
            dropdown.appendChild(btn);
        }
        var noneBtn = document.createElement('button');
        noneBtn.type = 'button';
        noneBtn.className = 'site-node-picker-row site-node-picker-row-none';
        noneBtn.setAttribute('role', 'option');
        noneBtn.dataset.none = '1';
        noneBtn.textContent = 'None';
        dropdown.appendChild(noneBtn);
        addRow(NODE_SELECT_TYPE_PREFIX + NODE_SELECT_ALL_TYPE, 'All');
        for (var i = 0; i < cats.length; i++) {
            addRow(NODE_SELECT_TYPE_PREFIX + cats[i].type, cats[i].label, '');
        }
    }

    function renderNodes(dropdown, categoryType) {
        dropdown.innerHTML = '';
        var items = typeof getNodesInCategory === 'function' ? getNodesInCategory(categoryType) : [];
        var backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.className = 'site-node-picker-row site-node-picker-row-back';
        backBtn.setAttribute('role', 'option');
        backBtn.dataset.action = 'back';
        backBtn.textContent = '\u2190 Back';
        dropdown.appendChild(backBtn);
        for (var j = 0; j < items.length; j++) {
            var nb = document.createElement('button');
            nb.type = 'button';
            nb.className = 'site-node-picker-row';
            nb.setAttribute('role', 'option');
            nb.dataset.nodeId = items[j].id;
            nb.textContent = items[j].name || items[j].id;
            dropdown.appendChild(nb);
        }
    }

    /**
     * @param {HTMLElement} root - .site-node-picker
     * @param {{ getInitialBrowse: function(): { view: 'categories'|'nodes', categoryType: string|null } }} options
     */
    function initSiteNodePicker(root, options) {
        if (!root || !options || typeof options.getInitialBrowse !== 'function') {
            return;
        }
        if (root.dataset.siteNodePickerInit === '1') {
            return;
        }
        root.dataset.siteNodePickerInit = '1';
        var trigger = root.querySelector('.site-node-picker-trigger');
        var dropdown = root.querySelector('.site-node-picker-dropdown');
        var hiddenSelect = root.querySelector('.site-node-picker-value');
        if (!trigger || !dropdown || !hiddenSelect) {
            return;
        }

        var browseView = 'categories';
        var browseCategoryType = null;
        var isOpen = false;

        function positionDropdown() {
            var rect = trigger.getBoundingClientRect();
            dropdown.style.position = 'fixed';
            dropdown.style.left = rect.left + 'px';
            dropdown.style.top = rect.bottom + 'px';
            dropdown.style.minWidth = Math.max(rect.width, 160) + 'px';
            dropdown.style.zIndex = '10070';
        }

        function onReposition() {
            if (isOpen) {
                positionDropdown();
            }
        }

        function setOpen(open) {
            isOpen = open;
            trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
            dropdown.hidden = !open;
            if (open) {
                positionDropdown();
                _activeClose = close;
            } else if (_activeClose === close) {
                _activeClose = null;
            }
        }

        function close() {
            if (!isOpen) {
                return;
            }
            setOpen(false);
            document.removeEventListener('keydown', onDocKeydown);
            document.removeEventListener('pointerdown', onDocPointerDown, true);
            window.removeEventListener('scroll', onReposition, true);
            window.removeEventListener('resize', onReposition);
            syncTriggerLabel(trigger, hiddenSelect);
        }

        function onDocKeydown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        }

        function onDocPointerDown(e) {
            if (root.contains(e.target)) {
                return;
            }
            close();
        }

        function applyBrowse() {
            if (browseView === 'nodes' && browseCategoryType) {
                renderNodes(dropdown, browseCategoryType);
            } else {
                renderCategories(dropdown);
            }
        }

        function open() {
            closeAnyActiveSiteNodePicker();
            var init = options.getInitialBrowse();
            browseView = init.view === 'nodes' ? 'nodes' : 'categories';
            browseCategoryType = init.categoryType || null;
            if (browseView === 'nodes' && !browseCategoryType) {
                browseView = 'categories';
            }
            applyBrowse();
            setOpen(true);
            document.addEventListener('keydown', onDocKeydown);
            document.addEventListener('pointerdown', onDocPointerDown, true);
            window.addEventListener('scroll', onReposition, true);
            window.addEventListener('resize', onReposition);
        }

        function commitEmpty() {
            if (typeof fillNodeSelectCategoryList === 'function') {
                fillNodeSelectCategoryList(hiddenSelect);
            }
            hiddenSelect.value = '';
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
            close();
        }

        function commitNode(nodeId, categoryType) {
            var cat = categoryType || NODE_SELECT_ALL_TYPE;
            if (typeof fillNodeSelectNodesForCategory === 'function') {
                fillNodeSelectNodesForCategory(hiddenSelect, cat, nodeId);
            }
            hiddenSelect.value = nodeId;
            hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
            close();
        }

        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            if (isOpen) {
                close();
                return;
            }
            open();
        });

        dropdown.addEventListener('click', function (e) {
            var row = e.target.closest('.site-node-picker-row');
            if (!row || !dropdown.contains(row)) {
                return;
            }
            e.stopPropagation();
            if (row.dataset.action === 'back') {
                browseView = 'categories';
                browseCategoryType = null;
                applyBrowse();
                positionDropdown();
                return;
            }
            if (row.dataset.nodeId) {
                commitNode(row.dataset.nodeId, browseCategoryType || NODE_SELECT_ALL_TYPE);
                return;
            }
            if (row.dataset.none === '1') {
                commitEmpty();
                return;
            }
            var val = row.dataset.value;
            if (val && val.indexOf(NODE_SELECT_TYPE_PREFIX) === 0) {
                browseView = 'nodes';
                browseCategoryType = val.substring(NODE_SELECT_TYPE_PREFIX.length);
                applyBrowse();
                positionDropdown();
            }
        });

        syncTriggerLabel(trigger, hiddenSelect);

        function refreshFromHidden() {
            syncTriggerLabel(trigger, hiddenSelect);
        }

        root._siteNodePickerRefreshLabel = refreshFromHidden;
        root._siteNodePickerClose = close;
    }

    function closeSiteNodePickerForRoot(root) {
        if (!root) {
            return;
        }
        var fn = root._siteNodePickerClose;
        if (typeof fn === 'function') {
            fn();
        }
    }

    function refreshSiteNodePickerLabelForRoot(root) {
        if (!root || !root._siteNodePickerRefreshLabel) {
            return;
        }
        root._siteNodePickerRefreshLabel();
    }

    window.initSiteNodePicker = initSiteNodePicker;
    window.closeSiteNodePickerForRoot = closeSiteNodePickerForRoot;
    window.refreshSiteNodePickerLabelForRoot = refreshSiteNodePickerLabelForRoot;
})();
