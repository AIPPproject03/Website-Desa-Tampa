// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");
  const navMenu = document.querySelector(".nav-menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", function () {
      menu.classList.toggle("active");
      navMenu.classList.toggle("active");
      menuToggle.classList.toggle("active");

      // Prevent body scroll when menu is open
      if (menu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close menu when clicking overlay
    document.addEventListener("click", function (e) {
      if (
        navMenu.classList.contains("active") &&
        !menu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        menu.classList.remove("active");
        navMenu.classList.remove("active");
        menuToggle.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  // Close menu when clicking a menu item
  const menuItems = document.querySelectorAll(".menu a");
  menuItems.forEach((item) => {
    item.addEventListener("click", function () {
      menu.classList.remove("active");
      navMenu.classList.remove("active");
      menuToggle.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Header scroll effect
  const header = document.querySelector(".header");
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.style.padding = "10px 0";
      header.style.backgroundColor = "rgba(255, 255, 255, 0.98)";
    } else {
      header.style.padding = "15px 0";
      header.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    }
  });

  // Wisata Slider
  const slides = document.querySelectorAll(".wisata-slide");
  const prevBtn = document.querySelector(".prev-btn");
  const nextBtn = document.querySelector(".next-btn");
  let currentSlide = 0;

  if (slides.length > 0) {
    // Hide all slides initially except the first one
    slides.forEach((slide, index) => {
      if (index !== 0) {
        slide.style.display = "none";
      }
    });

    // Function to show slide based on index
    function showSlide(n) {
      // Hide all slides
      slides.forEach((slide) => {
        slide.style.display = "none";
      });

      // Show the current slide with fade-in effect
      slides[n].style.display = "block";
      slides[n].classList.add("fade");

      // Remove fade class after animation
      setTimeout(() => {
        slides[n].classList.remove("fade");
      }, 500);
    }

    // Next slide function
    function nextSlide() {
      currentSlide++;
      if (currentSlide >= slides.length) {
        currentSlide = 0;
      }
      showSlide(currentSlide);
    }

    // Previous slide function
    function prevSlide() {
      currentSlide--;
      if (currentSlide < 0) {
        currentSlide = slides.length - 1;
      }
      showSlide(currentSlide);
    }

    // Event listeners for slider buttons
    if (nextBtn && prevBtn) {
      nextBtn.addEventListener("click", nextSlide);
      prevBtn.addEventListener("click", prevSlide);

      // Auto slide every 5 seconds
      setInterval(nextSlide, 5000);
    }
  }

  // Initialize Leaflet map for interactive map section
  const mapElement = document.getElementById("mapInteraktif");

  if (mapElement && typeof L !== "undefined") {
    // Create map centered on Tampa Village with restricted interactions
    // Coordinates for Desa Tampa from the Google Maps link you provided
    const tampaCenterLat = -1.9720352;
    const tampaCenterLng = 115.1219646;
    const tampaZoomLevel = 14;

    const map = L.map("mapInteraktif", {
      zoomControl: false, // Disable zoom controls initially
      scrollWheelZoom: false, // Disable scroll wheel zoom
      dragging: false, // Disable dragging
      touchZoom: false, // Disable touch zoom
      doubleClickZoom: false, // Disable double click zoom
      keyboard: false, // Disable keyboard navigation
      boxZoom: false, // Disable box zoom
      tap: false, // Disable tap handler
    }).setView([tampaCenterLat, tampaCenterLng], tampaZoomLevel);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add a button to enable interactions
    const enableInteractionBtn = document.createElement("button");
    enableInteractionBtn.className = "enable-map-btn";
    enableInteractionBtn.innerHTML =
      '<i class="fas fa-mouse-pointer"></i> Aktifkan Interaksi';
    mapElement.parentNode.appendChild(enableInteractionBtn);

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
      this.style.display = "none";

      // Show a message that interactions are enabled
      const message = document.createElement("div");
      message.className = "map-message";
      message.textContent = "Interaksi peta telah diaktifkan";
      mapElement.parentNode.appendChild(message);

      // Remove the message after 3 seconds
      setTimeout(() => {
        message.remove();
      }, 3000);
    });

    // Create custom markers using Font Awesome icons (already loaded in the page)
    function createCustomMarker(icon, color) {
      return L.divIcon({
        html: `<i class="fa ${icon}" style="color: ${color};"></i>`,
        className: "custom-div-icon",
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
      });
    }

    // Define markers with Font Awesome icons
    const balaiIcon = createCustomMarker("fa-building", "#FF5252");
    const schoolIcon = createCustomMarker("fa-school", "#4CAF50");
    const healthIcon = createCustomMarker("fa-hospital", "#2196F3");
    const worshipIcon = createCustomMarker("fa-place-of-worship", "#9C27B0");
    const touristIcon = createCustomMarker("fa-mountain", "#FF9800");

    // Add markers based on approximate locations within Desa Tampa
    // Balai Desa (center as reference point)
    L.marker([tampaCenterLat, tampaCenterLng], { icon: balaiIcon })
      .addTo(map)
      .bindPopup("<b>Balai Desa Tampa</b><br>Pusat administrasi Desa Tampa");

    // Sekolah (slight offset)
    L.marker([tampaCenterLat + 0.002, tampaCenterLng + 0.003], {
      icon: schoolIcon,
    })
      .addTo(map)
      .bindPopup("<b>SDN Tampa</b><br>Sekolah Dasar Negeri Tampa");

    // Puskesmas (slight offset)
    L.marker([tampaCenterLat - 0.001, tampaCenterLng - 0.002], {
      icon: healthIcon,
    })
      .addTo(map)
      .bindPopup("<b>Puskesmas Tampa</b><br>Pusat kesehatan masyarakat");

    // Tempat ibadah (slight offset)
    L.marker([tampaCenterLat + 0.001, tampaCenterLng - 0.001], {
      icon: worshipIcon,
    })
      .addTo(map)
      .bindPopup("<b>Masjid Al-Ikhlas</b><br>Tempat ibadah umat Muslim");

    // Wisata (slight offset)
    L.marker([tampaCenterLat - 0.003, tampaCenterLng + 0.002], {
      icon: touristIcon,
    })
      .addTo(map)
      .bindPopup("<b>Wisata Alam Tampa</b><br>Destinasi wisata alam");

    // Fix map container issues when map is loaded or resized
    setTimeout(function () {
      map.invalidateSize();
    }, 100);
  }

  // Add smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        // Offset for fixed header
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Hero section animations
  const heroSection = document.querySelector(".hero");
  const heroHeading = document.querySelector(".hero-text h1");

  if (heroSection && heroHeading) {
    // Add 'show' class to hero heading when page loads
    setTimeout(() => {
      heroHeading.classList.add("show");
    }, 500);
  }

  // Enhanced Animation for elements when they come into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");

          // For elements with fade-in-sequence class, animate children one by one
          if (entry.target.classList.contains("fade-in-sequence")) {
            const children = entry.target.children;
            Array.from(children).forEach((child, index) => {
              setTimeout(() => {
                child.classList.add("show");
              }, 300 * index);
            });
          }
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  // Observe all section titles, cards, and other key elements
  document
    .querySelectorAll(
      ".section-title, .card, .profil-img, .profil-text, .map-wrapper, .gallery-item, .contact-item, .hero-content"
    )
    .forEach((item) => {
      observer.observe(item);
    });

  // Enhanced video handling for all pages
  document.addEventListener("DOMContentLoaded", function () {
    // Video background handling for both main page and potensi pages
    const videos = document.querySelectorAll(".hero-video");

    videos.forEach((video) => {
      if (video) {
        // Always try to play video, regardless of device
        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Video started playing successfully
              console.log("Video is playing");

              // Hide play button if it exists
              const heroSection = video.closest(".hero, .potensi-hero");
              const playBtn = heroSection.querySelector(".video-play-btn");
              if (playBtn) {
                playBtn.style.display = "none";
              }
            })
            .catch((error) => {
              console.log("Video autoplay was prevented: ", error);

              // Show play button for user interaction
              const heroSection = video.closest(".hero, .potensi-hero");
              let playBtn = heroSection.querySelector(".video-play-btn");

              if (!playBtn) {
                // Create play button if it doesn't exist
                playBtn = document.createElement("button");
                playBtn.className = "video-play-btn";
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                heroSection.appendChild(playBtn);
              }

              playBtn.style.display = "flex";

              playBtn.addEventListener("click", function () {
                video
                  .play()
                  .then(() => {
                    this.style.display = "none";
                  })
                  .catch((err) => {
                    console.log("Failed to play video:", err);
                    // If video still fails, show fallback
                    video.style.display = "none";
                    const fallback =
                      heroSection.querySelector(".hero-bg-fallback");
                    if (fallback) {
                      fallback.style.zIndex = "0";
                    }
                  });
              });
            });
        }

        // Handle video loading states
        video.addEventListener("loadstart", function () {
          this.style.opacity = "0.7";
        });

        video.addEventListener("canplay", function () {
          this.style.opacity = "1";
        });

        // Handle video errors
        video.addEventListener("error", function (e) {
          console.log("Video error occurred: ", e);
          this.style.display = "none";

          const heroSection = this.closest(".hero, .potensi-hero");
          const fallback = heroSection.querySelector(".hero-bg-fallback");
          if (fallback) {
            fallback.style.zIndex = "0";
          }

          // Hide play button if video fails
          const playBtn = heroSection.querySelector(".video-play-btn");
          if (playBtn) {
            playBtn.style.display = "none";
          }
        });

        // Handle slow connections differently - reduce quality instead of hiding
        if (navigator.connection) {
          const connectionType = navigator.connection.effectiveType;

          if (connectionType === "slow-2g" || connectionType === "2g") {
            // For very slow connections, still try to play but with lower priority
            video.preload = "metadata";
            video.addEventListener("loadedmetadata", function () {
              // Only play if user explicitly wants to
              const heroSection = this.closest(".hero, .potensi-hero");
              let playBtn = heroSection.querySelector(".video-play-btn");

              if (!playBtn) {
                playBtn = document.createElement("button");
                playBtn.className = "video-play-btn";
                playBtn.innerHTML = '<i class="fas fa-play"></i>';
                heroSection.appendChild(playBtn);
              }

              playBtn.style.display = "flex";
              playBtn.innerHTML = '<i class="fas fa-wifi"></i>';
              playBtn.title = "Koneksi lambat - klik untuk memutar video";
            });
          }
        }
      }
    });

    // Enhanced animation handling for potensi pages
    const potentialHeroElements = document.querySelectorAll(
      ".potensi-hero .hero-icon, .potensi-hero h1, .potensi-hero p"
    );

    if (potentialHeroElements.length > 0) {
      // Trigger animations after page load
      setTimeout(() => {
        potentialHeroElements.forEach((element, index) => {
          setTimeout(() => {
            element.classList.add("show");
          }, 200 * index);
        });
      }, 300);
    }
  });

  // Enhanced video handling for wisata section
  const wisataVideos = document.querySelectorAll(".wisata-video");

  wisataVideos.forEach((video) => {
    if (video) {
      // Handle video loading and playback
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video started playing successfully
            console.log("Wisata video is playing");
          })
          .catch((error) => {
            console.log("Wisata video autoplay was prevented: ", error);

            // Create and show play button for user interaction
            const videoContainer = video.closest(".wisata-video-container");
            let playBtn = videoContainer.querySelector(
              ".wisata-video-play-btn"
            );

            if (!playBtn) {
              playBtn = document.createElement("button");
              playBtn.className = "wisata-video-play-btn";
              playBtn.innerHTML = '<i class="fas fa-play"></i>';
              videoContainer.appendChild(playBtn);
            }

            playBtn.style.display = "flex";

            playBtn.addEventListener("click", function () {
              video
                .play()
                .then(() => {
                  this.style.display = "none";
                })
                .catch((err) => {
                  console.log("Failed to play wisata video:", err);
                });
            });
          });
      }

      // Handle video loading states
      video.addEventListener("loadstart", function () {
        this.style.opacity = "0.8";
      });

      video.addEventListener("canplay", function () {
        this.style.opacity = "1";
      });

      // Error handling - show fallback image
      video.addEventListener("error", function () {
        console.log("Wisata video failed to load, using fallback image");
        this.style.display = "none";

        const fallback = this.closest(".wisata-video-container").querySelector(
          ".wisata-video-fallback"
        );
        if (fallback) {
          fallback.style.zIndex = "1";
        }
      });

      // Pause video when not in viewport (performance optimization)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(console.log);
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(video);
    }
  });
});
