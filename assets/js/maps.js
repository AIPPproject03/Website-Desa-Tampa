document.addEventListener("DOMContentLoaded", function () {
  initializeMap();
});

function initializeMap() {
  const mapElement = document.getElementById("mapInteraktif");

  if (mapElement && typeof L !== "undefined") {
    // Convert Web Mercator (EPSG:3857) coordinates to WGS84 (EPSG:4326) for Leaflet
    function webMercatorToLatLng(mercX, mercY) {
      const earthRadius = 6378137;
      const lng = (mercX / earthRadius) * (180 / Math.PI);
      let lat = (mercY / earthRadius) * (180 / Math.PI);
      lat =
        (180 / Math.PI) *
        (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
      return [lat, lng];
    }

    // Convert all provided coordinates from QGIS
    const balaiDesa = webMercatorToLatLng(12815817.35, -214229.38);
    const kebunKokoa = webMercatorToLatLng(12816051.74, -214252.39);
    const gerejaBeto = webMercatorToLatLng(12815634.28, -214245.78);
    const pasarTradisional = webMercatorToLatLng(12815649.63, -214267.21);
    const pasarKamis = webMercatorToLatLng(12815141.42, -214595.3);
    const bendunganTampa = webMercatorToLatLng(12815941.45, -215326.64);
    const puskesmasPaku = webMercatorToLatLng(12816372.64, -213295.09);
    const kantorCamat = webMercatorToLatLng(12816419.97, -213214.15);
    const gerejaKatolik = webMercatorToLatLng(12817273.2, -212584.9);
    const masjidAnNoor = webMercatorToLatLng(12815008.29, -214694.92);

    // Set map center to Balai Desa
    const tampaCenterLat = balaiDesa[0];
    const tampaCenterLng = balaiDesa[1];
    const tampaZoomLevel = 15;

    // Create map with standard controls but initially disabled interactions
    const map = L.map("mapInteraktif", {
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      keyboard: false,
      boxZoom: false,
      tap: false,
    }).setView([tampaCenterLat, tampaCenterLng], tampaZoomLevel);

    // Add OpenStreetMap tile layer with better attribution
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Create custom markers using Font Awesome icons
    function createCustomMarker(icon, color) {
      return L.divIcon({
        html: `<div class="custom-marker" style="background-color:${color}"><i class="fas ${icon}"></i></div>`,
        className: "",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -28],
      });
    }

    // Define markers with Font Awesome icons
    const balaiIcon = createCustomMarker("fa-building", "#FF5252");
    const treeIcon = createCustomMarker("fa-tree", "#8D6E63");
    const worshipIcon = createCustomMarker("fa-place-of-worship", "#9C27B0");
    const marketIcon = createCustomMarker("fa-store", "#795548");
    const waterIcon = createCustomMarker("fa-water", "#03A9F4");
    const healthIcon = createCustomMarker("fa-hospital", "#2196F3");
    const governmentIcon = createCustomMarker("fa-landmark", "#673AB7");
    const churchIcon = createCustomMarker("fa-church", "#7B1FA2");
    const mosqueIcon = createCustomMarker("fa-mosque", "#4A148C");

    // Use the converted coordinates to place markers
    const locations = [
      {
        position: balaiDesa,
        icon: balaiIcon,
        title: "Balai Desa Tampa",
        description: "Pusat administrasi dan pelayanan Desa Tampa",
      },
      {
        position: kebunKokoa,
        icon: treeIcon,
        title: "Kebun Kokoa",
        description:
          "Perkebunan kokoa yang menjadi salah satu komoditas unggulan",
      },
      {
        position: gerejaBeto,
        icon: churchIcon,
        title: "Gereja Beto WAO",
        description: "Tempat ibadah utama di Desa Tampa",
      },
      {
        position: pasarTradisional,
        icon: marketIcon,
        title: "Pasar Tradisional",
        description: "Pasar mingguan depan Gereja Beto WAO (hari Minggu)",
      },
      {
        position: pasarKamis,
        icon: marketIcon,
        title: "Pasar Kamis",
        description: "Pasar desa yang beroperasi setiap hari Kamis",
      },
      {
        position: bendunganTampa,
        icon: waterIcon,
        title: "Bendungan Tampa",
        description: "Bendungan dan sumber air utama Desa Tampa",
      },
      {
        position: puskesmasPaku,
        icon: healthIcon,
        title: "Puskesmas Paku",
        description: "Pusat kesehatan masyarakat Kecamatan Paku",
      },
      {
        position: kantorCamat,
        icon: governmentIcon,
        title: "Kantor Camat Paku",
        description: "Kantor administrasi Kecamatan Paku",
      },
      {
        position: gerejaKatolik,
        icon: churchIcon,
        title: "Gereja Katolik Stasi Santo Yohanes Rasul",
        description: "Tempat ibadah umat Katolik di Tampa",
      },
      {
        position: masjidAnNoor,
        icon: mosqueIcon,
        title: "Masjid An Noor Tampa",
        description: "Tempat ibadah umat Muslim di Desa Tampa",
      },
    ];

    // Add all location markers to the map
    locations.forEach((location) => {
      L.marker(location.position, { icon: location.icon })
        .addTo(map)
        .bindPopup(
          `<div class="map-popup"><h4>${location.title}</h4><p>${location.description}</p></div>`
        );
    });

    // Create a polygon that encompasses all the points to create a village boundary
    // Use the coordinates to calculate an appropriate boundary
    const points = locations.map((loc) => loc.position);
    let minLat = Math.min(...points.map((p) => p[0]));
    let maxLat = Math.max(...points.map((p) => p[0]));
    let minLng = Math.min(...points.map((p) => p[1]));
    let maxLng = Math.max(...points.map((p) => p[1]));

    // Add a small buffer around the points
    const buffer = 0.001;
    minLat -= buffer;
    maxLat += buffer;
    minLng -= buffer;
    maxLng += buffer;

    // Create a more natural-looking polygon boundary based on the points
    const tampaVillageBoundary = L.polygon(
      [
        [minLat - buffer * 2, minLng + (maxLng - minLng) * 0.3], // Southwest extended
        [minLat + (maxLat - minLat) * 0.3, minLng - buffer], // West extended
        [minLat + (maxLat - minLat) * 0.7, minLng], // Northwest
        [maxLat, minLng + (maxLng - minLng) * 0.4], // North
        [maxLat + buffer, minLng + (maxLng - minLng) * 0.7], // Northeast
        [maxLat - (maxLat - minLat) * 0.1, maxLng + buffer], // East
        [minLat + (maxLat - minLat) * 0.4, maxLng], // Southeast
        [minLat, maxLng - (maxLng - minLng) * 0.3], // South
      ],
      {
        color: "#3388ff",
        fillColor: "#3388ff",
        fillOpacity: 0.1,
        weight: 2,
      }
    ).addTo(map);

    // Ensure the map zooms to show all markers
    map.fitBounds(tampaVillageBoundary.getBounds(), {
      padding: [50, 50],
    });

    // Add button to enable interactions
    const mapContainer = mapElement.parentNode;

    // Check if button already exists to avoid duplicates
    if (!mapContainer.querySelector(".enable-map-btn")) {
      const enableInteractionBtn = document.createElement("button");
      enableInteractionBtn.className = "enable-map-btn";
      enableInteractionBtn.innerHTML =
        '<i class="fas fa-mouse-pointer"></i> Aktifkan Peta Interaktif';
      mapContainer.appendChild(enableInteractionBtn);

      // Add event listener to enable interactions
      enableInteractionBtn.addEventListener("click", function () {
        // Enable all interactions
        map.dragging.enable();
        map.touchZoom.enable();
        map.doubleClickZoom.enable();
        map.scrollWheelZoom.enable();
        map.boxZoom.enable();
        map.keyboard.enable();
        map.zoomControl.addTo(map);
        map.tap && map.tap.enable();

        // Hide the button after enabling interactions
        this.classList.add("hidden");

        // Show a message that interactions are enabled
        const message = document.createElement("div");
        message.className = "map-message";
        message.innerHTML =
          '<i class="fas fa-check-circle"></i> Peta interaktif telah diaktifkan';
        mapContainer.appendChild(message);

        // Remove the message after 3 seconds
        setTimeout(() => {
          message.remove();
        }, 3000);
      });
    }

    // Add layer controls for toggling different map views
    const baseMaps = {
      OpenStreetMap: L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ),
      Satelit: L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        }
      ),
      Topo: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      }),
    };

    // Add base layer control (once map interactions are enabled)
    enableInteractionBtn.addEventListener(
      "click",
      function () {
        L.control.layers(baseMaps, null, { position: "topright" }).addTo(map);
      },
      { once: true }
    );

    // Add legend toggle button for mobile
    const legendToggleBtn = document.createElement("button");
    legendToggleBtn.className = "legend-toggle-btn";
    legendToggleBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
    legendToggleBtn.title = "Tampilkan/Sembunyikan Legenda";
    mapContainer.appendChild(legendToggleBtn);

    // Add event listener for legend toggle on mobile
    legendToggleBtn.addEventListener("click", function () {
      const legendElement = document.querySelector(".map-legend");
      if (legendElement) {
        legendElement.classList.toggle("active");
        this.classList.toggle("active");
      }
    });

    // Add fullscreen button
    const fullscreenBtn = document.createElement("button");
    fullscreenBtn.className = "fullscreen-map-btn";
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    fullscreenBtn.title = "Tampilan Penuh";
    mapContainer.appendChild(fullscreenBtn);

    // Add event listener for fullscreen
    fullscreenBtn.addEventListener("click", function () {
      if (!document.fullscreenElement) {
        if (mapContainer.requestFullscreen) {
          mapContainer.requestFullscreen();
        } else if (mapContainer.mozRequestFullScreen) {
          mapContainer.mozRequestFullScreen();
        } else if (mapContainer.webkitRequestFullscreen) {
          mapContainer.webkitRequestFullscreen();
        } else if (mapContainer.msRequestFullscreen) {
          mapContainer.msRequestFullscreen();
        }
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
      }
    });

    // Listen for fullscreen changes
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    function handleFullscreenChange() {
      if (
        !document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement
      ) {
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';

        // Fix map display after exiting fullscreen
        setTimeout(() => {
          map.invalidateSize();
        }, 200);
      }
    }

    // Fix map container issues when map is loaded or resized
    setTimeout(function () {
      map.invalidateSize();
    }, 100);

    // Add event listener to re-render map when the section becomes visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => map.invalidateSize(), 100);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(document.getElementById("peta"));
  }
}
