/*
    |====================|
    |      Map View      |
    |====================|

    Overlay with the world map image (Content/WorldMap.webp).
*/

(function () {
    'use strict';

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

    function openMapView() {
        closeOtherOverlay();
        var modal = document.getElementById('map-view-modal');
        if (modal) {
            modal.style.display = 'block';
        }
        setMobileMapToolbarActive(true);
    }

    function closeMapView() {
        var modal = document.getElementById('map-view-modal');
        if (modal) {
            modal.style.display = 'none';
        }
        setMobileMapToolbarActive(false);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var modal = document.getElementById('map-view-modal');
        var btn = document.getElementById('map-view-button');
        var headerCloseBtn = document.getElementById('map-view-modal-close');

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
