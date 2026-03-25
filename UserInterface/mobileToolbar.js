/*
    |====================|
    |    Mobile toolbar  |
    |====================|

    Bottom navigation and bottom sheets for narrow viewports (see responsive.css).
*/

(function () {
    "use strict";

    const MOBILE_QUERY = "(max-width: 1024px)";

    function isMobileLayout() {
        return window.matchMedia(MOBILE_QUERY).matches;
    }

    function relayoutNodes() {
        if (typeof relayoutMasonry === "function") {
            relayoutMasonry();
        } else if (window.msnry && typeof window.msnry.layout === "function") {
            window.msnry.layout();
        }
    }

    function getElements() {
        return {
            pageWrapper: document.querySelector(".page-wrapper"),
            descriptionWrapper: document.querySelector(".description-wrapper"),
            backdrop: document.getElementById("mobile-sheet-backdrop"),
            infoSheet: document.getElementById("mobile-info-sheet"),
        };
    }

    function setDescriptionToolbarActive(isActive) {
        document.body.classList.toggle("mobile-ui-description-open", isActive);
    }

    function setInfoToolbarActive(isActive) {
        document.body.classList.toggle("mobile-ui-info-open", isActive);
    }

    function closeMobileToolSheets() {
        const { pageWrapper, descriptionWrapper, backdrop } = getElements();
        if (pageWrapper) {
            pageWrapper.classList.remove("mobile-sheet-open", "mobile-sheet-description");
        }
        setDescriptionToolbarActive(false);
        if (descriptionWrapper) {
            descriptionWrapper.classList.add("collapsed");
        }
        if (backdrop) {
            backdrop.hidden = true;
        }
        document.body.style.overflow = "";
        setTimeout(relayoutNodes, 50);
    }

    function closeInfoSheet() {
        const { infoSheet, backdrop } = getElements();
        if (infoSheet) {
            infoSheet.hidden = true;
        }
        if (backdrop) {
            backdrop.hidden = true;
        }
        setInfoToolbarActive(false);
        document.body.style.overflow = "";
    }

    function openDescriptionSheetInternal() {
        const { pageWrapper, descriptionWrapper, backdrop } = getElements();
        if (!pageWrapper || !backdrop) {
            return;
        }
        closeInfoSheet();
        pageWrapper.classList.add("mobile-sheet-open", "mobile-sheet-description");
        if (descriptionWrapper) {
            descriptionWrapper.classList.remove("collapsed");
        }
        setDescriptionToolbarActive(true);
        backdrop.hidden = false;
        document.body.style.overflow = "hidden";
        setTimeout(relayoutNodes, 50);
    }

    function openInfoSheet() {
        const { infoSheet, backdrop } = getElements();
        closeMobileToolSheets();
        if (infoSheet) {
            infoSheet.hidden = false;
        }
        if (backdrop) {
            backdrop.hidden = false;
        }
        setInfoToolbarActive(true);
        document.body.style.overflow = "hidden";
    }

    function wireToolbar() {
        const descBtn = document.getElementById("mobile-tool-description");
        const calBtn = document.getElementById("mobile-tool-calendar");
        const panelBtn = document.getElementById("mobile-tool-panel");
        const infoBtn = document.getElementById("mobile-tool-info");
        const { backdrop } = getElements();

        if (descBtn) {
            descBtn.addEventListener("click", function () {
                if (!isMobileLayout()) {
                    return;
                }
                const pw = document.querySelector(".page-wrapper");
                if (pw && pw.classList.contains("mobile-sheet-description") && pw.classList.contains("mobile-sheet-open")) {
                    closeMobileToolSheets();
                } else {
                    openDescriptionSheetInternal();
                }
            });
        }

        if (calBtn) {
            calBtn.addEventListener("click", function () {
                if (!isMobileLayout()) {
                    return;
                }
                closeMobileToolSheets();
                closeInfoSheet();
                const mainBtn = document.getElementById("calendar-view-button");
                if (mainBtn) {
                    mainBtn.click();
                }
            });
        }

        if (panelBtn) {
            panelBtn.addEventListener("click", function () {
                if (!isMobileLayout()) {
                    return;
                }
                closeMobileToolSheets();
                closeInfoSheet();
                if (typeof window.toggleFloatingPanelVisibility === "function") {
                    window.toggleFloatingPanelVisibility();
                }
            });
        }

        if (infoBtn) {
            infoBtn.addEventListener("click", function () {
                if (!isMobileLayout()) {
                    return;
                }
                openInfoSheet();
            });
        }

        if (backdrop) {
            backdrop.addEventListener("click", function () {
                closeInfoSheet();
                closeMobileToolSheets();
            });
        }

        const glossaryBtn = document.getElementById("mobile-info-glossary");
        const makingBtn = document.getElementById("mobile-info-making");
        const infoClose = document.getElementById("mobile-info-close");

        if (glossaryBtn) {
            glossaryBtn.addEventListener("click", function () {
                closeInfoSheet();
                closeMobileToolSheets();
                const g = document.getElementById("glossary-button");
                if (g) {
                    g.click();
                }
            });
        }

        if (makingBtn) {
            makingBtn.addEventListener("click", function () {
                closeInfoSheet();
                closeMobileToolSheets();
                const m = document.getElementById("on-making-LoT-button");
                if (m) {
                    m.click();
                }
            });
        }

        if (infoClose) {
            infoClose.addEventListener("click", function () {
                closeInfoSheet();
            });
        }

        document.addEventListener("keydown", function (ev) {
            if (ev.key !== "Escape") {
                return;
            }
            if (!isMobileLayout()) {
                return;
            }
            const { infoSheet } = getElements();
            if (infoSheet && !infoSheet.hidden) {
                closeInfoSheet();
                return;
            }
            const pw = document.querySelector(".page-wrapper");
            if (pw && pw.classList.contains("mobile-sheet-open")) {
                closeMobileToolSheets();
            }
        });

        const mql = window.matchMedia(MOBILE_QUERY);
        function onViewportChange(e) {
            if (!e.matches) {
                closeMobileToolSheets();
                closeInfoSheet();
                document.body.classList.remove(
                    "mobile-ui-description-open",
                    "mobile-ui-info-open",
                    "mobile-ui-calendar-open"
                );
            } else {
                setTimeout(relayoutNodes, 100);
            }
        }
        if (typeof mql.addEventListener === "function") {
            mql.addEventListener("change", onViewportChange);
        } else if (typeof mql.addListener === "function") {
            mql.addListener(onViewportChange);
        }

        window.openMobileDescriptionSheet = function () {
            if (!isMobileLayout()) {
                return;
            }
            openDescriptionSheetInternal();
        };

        window.closeMobileDescriptionSheet = function () {
            if (!isMobileLayout()) {
                return;
            }
            closeMobileToolSheets();
        };
    }

    function initMobileUi() {
        wireToolbar();
        if (isMobileLayout()) {
            openDescriptionSheetInternal();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initMobileUi);
    } else {
        initMobileUi();
    }
})();
