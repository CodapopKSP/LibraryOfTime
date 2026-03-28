# Review: unstaged working-tree changes

Generated for manual review. Scope: modified tracked files plus untracked `UserInterface/siteNodeList.js` (included in `index.html`).

---

## Likely issues (worth fixing or deciding on)

### 1. Dead code / behavior change: `setFloatingPanelAddSelectsEnabled`

Previously, `nodeDraw.js` called `setFloatingPanelAddSelectsEnabled(false)` when a node was selected and `(..., !selectedNodeData)` when clearing selection. Those calls were removed and replaced with `refreshCalendarViewIfOpen`.

A repo-wide search shows **no remaining call sites** for `setFloatingPanelAddSelectsEnabled` except its definition and `window` export in `userPanel.js`. So either:

- The old behavior (disable floating-panel “add node” `<select>`s while a grid node is selected) was intentionally dropped, in which case the function is **dead code** and could be removed or left for a future use; or  
- It was an accidental omission and the UI should still disable those controls when appropriate.

This is the strongest “something to verify” item in the diff.

### 2. `formatDateTooltip` early exit drops Gregorian when no system is selected

When `systemLabel` is falsy, the function returns only astronomical-event text or `''`. It no longer includes the **Gregorian** block in that case. If a day has both an astronomical event and no selected calendar, users see events only—no Gregorian line. Confirm that matches the intended UX (it is a real behavior change, not just refactoring).

### 3. Pre-existing bug still in `formatDateTooltip` (unchanged by this diff, but visible while reading)

Around the Gregorian branch, the code uses `typeof out === 'function'` and `out(raw)`, but `out` is not defined in that scope (likely should be `getGregorianDateTime` or a formatter returned by it). Worth fixing separately; not introduced by the current unstaged edits.

---

## Redundancy / overlap (low severity)

### 4. `calendarNodeOptionsVersion === '4'`

A dataset version gate for repopulating the calendar `<select>`. Works, but the magic number will need a bump whenever options change; easy to forget. Not wrong—just a maintenance footgun.

### 5. `getEffectiveCalendarNodeData`

Thin wrapper: returns `selectedNodeData` when it has an `id`, else `null`. Slightly redundant with inline checks but keeps `renderCalendarView` / `syncCalendarViewNodeSelect` aligned. Reasonable if you expect more rules later; optional to inline.

### 6. CSS duplication for `.calendar-view-node-select`

Shared styling is merged with `.add-node-select` in `floatingPanel.css`; `calendarView.css` adds layout-specific rules and another `.mac-chrome-only .calendar-view-node-select` block. Some overlap (e.g. Mac Chrome tweaks split across files) is intentional layering but can make future edits harder—document or consolidate if it grows.

### 7. `window` exports scattered

`refreshCalendarViewIfOpen`, `populateNodeDescriptionAndSelection`, `getAllSiteNodeDataItems`, and `setFloatingPanelAddSelectsEnabled` are assigned on `window` at definition sites or nearby instead of a single init block. Consistent with existing patterns but noisier than one registry.

---

## “Vibe” / consistency notes (subjective)

### 8. JSDoc + `const` in `nodeDraw.js`

`populateNodeDescriptionAndSelection` adds a full JSDoc block and uses `const`/object destructuring style while much of the same file uses `function` + `var`/`let` elsewhere. Not wrong—just a **style shift** that can read like a different author than the surrounding file.

### 9. `selectedNode = content || ''`

Using `''` when there is no `.content` element matches `clearSelectedNode` using `''`, but it is a bit opaque compared to `null`. Works if the rest of the code treats falsy string consistently.

---

## What looks solid (not slop)

- **Extracting `getAllSiteNodeDataItems` to `siteNodeList.js`** after `nodeData.js` in `index.html` is a clear split: calendar UI can list nodes without growing `userPanel.js` further.  
- **Refactor** `handleNodeClick` → `populateNodeDescriptionAndSelection` + thin wrapper reduces duplication and supports the calendar dropdown calling the same path.  
- **`refreshCalendarViewIfOpen`** avoids stale calendar cells when selection changes from outside the grid.  
- **Z-index adjustments** in `responsive.css` and `descriptionPanel.css` with a short comment suggest intentional stacking (floating panel vs calendar modal vs tooltips).  
- **Responsive calendar modal** rules (`100dvh`, safe-area padding) look like purposeful mobile layout, not random tweaks.

---

## Untracked file

`UserInterface/siteNodeList.js` is new and unstaged; it is part of the feature (re-export of `getAllSiteNodeDataItems`). Remember to `git add` it when you commit.

---

## Summary

The main substantive risks are **(1)** possible regression or dead code around `setFloatingPanelAddSelectsEnabled`, and **(2)** tooltip content when no calendar is selected but astronomical events exist. Everything else is minor redundancy, style drift, or acceptable layering.
