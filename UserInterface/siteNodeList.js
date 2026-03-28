/*
    |====================|
    |  Site node catalog |
    |====================|

    Shared helpers for UI that lists every node from the main grid (nodeData).
    Depends on Content/nodeData.js (nodeDataArrays).
*/

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
