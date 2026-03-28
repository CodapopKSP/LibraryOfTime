/*
 * Cross-module UI entry points (scripts call each other via window.*).
 * Single registry; implementations stay in their own files.
 */
(function () {
    function expose(name, fn) {
        if (typeof fn === 'function') {
            window[name] = fn;
        }
    }
    expose('refreshCalendarViewIfOpen', refreshCalendarViewIfOpen);
    expose('populateNodeDescriptionAndSelection', populateNodeDescriptionAndSelection);
    expose('hasSelectedDescriptionNode', hasSelectedDescriptionNode);
    expose('ensureDescriptionShowsSelectedNode', ensureDescriptionShowsSelectedNode);
    expose('getAllSiteNodeDataItems', getAllSiteNodeDataItems);
    expose('setFloatingPanelAddSelectsEnabled', setFloatingPanelAddSelectsEnabled);
    expose('toggleFloatingPanelVisibility', toggleFloatingPanelVisibility);
    expose('setFloatingPanelOpen', setFloatingPanelOpen);
    expose('findNodeDataById', findNodeDataById);
    expose('syncFloatingPanelAddSelectForSection', syncFloatingPanelAddSelectForSection);
})();
