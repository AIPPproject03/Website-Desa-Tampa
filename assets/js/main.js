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

  // Animasi pada statistik dan infrastruktur
  document.addEventListener("DOMContentLoaded", function () {
    const animateOnScroll = () => {
      // Progress bars for infrastructure
      document.querySelectorAll(".progress-fill").forEach((bar) => {
        const rect = bar.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setTimeout(() => {
            bar.style.width = bar.style.width;
          }, 300);
        }
      });

      // Product stats animation
      document.querySelectorAll(".product-stat").forEach((stat, index) => {
        const rect = stat.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          setTimeout(() => {
            stat.classList.add("animate");
          }, index * 100);
        }
      });
    };

    // Run once on page load
    animateOnScroll();

    // Run on scroll
    window.addEventListener("scroll", animateOnScroll);

    // Add hover effects for sector items
    document
      .querySelectorAll(".sector-item, .infra-item, .tech-item")
      .forEach((item) => {
        item.addEventListener("mouseenter", function () {
          this.style.transform = "translateY(-5px)";
          this.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
        });

        item.addEventListener("mouseleave", function () {
          this.style.transform = "";
          this.style.boxShadow = "";
        });
      });
  });

  // Statistik animations
  document.addEventListener("DOMContentLoaded", function () {
    // Function to check if element is in viewport
    function isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    }

    // Function to animate charts when they come into view
    function animateChartsOnScroll() {
      const statsSection = document.getElementById("statistik");
      if (!statsSection) return;

      // If stats section is in viewport
      if (isInViewport(statsSection)) {
        // Animate bars
        const chartBars = document.querySelectorAll(".chart-bar");
        chartBars.forEach((bar) => {
          setTimeout(() => {
            bar.style.height = bar.style.height;
          }, 300);
        });

        // Only run once
        window.removeEventListener("scroll", animateChartsOnScroll);
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", animateChartsOnScroll);

    // Initial check
    animateChartsOnScroll();
  });

  // Enhanced mobile navigation with smooth animations
  document.addEventListener("DOMContentLoaded", function () {
    // Select mobile navigation elements
    const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
    const menuToggleBottom = document.querySelector(".menu-toggle-bottom");
    const menuModal = document.getElementById("menuModal");
    const menuModalClose = document.getElementById("menuModalClose");
    const menuModalItems = document.querySelectorAll(".menu-modal-item");
    const mobileNav = document.querySelector(".mobile-nav");

    // Track scroll position for smart navigation
    let lastScrollTop = 0;
    let scrollTimer = null;

    // Add ripple effect to mobile nav items
    function createRipple(event) {
      const button = event.currentTarget;

      // Remove any existing ripples
      const existingRipple = button.querySelector(".ripple");
      if (existingRipple) {
        existingRipple.remove();
      }

      // Create ripple element
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      // Set ripple position
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      ripple.style.width = ripple.style.height = `${diameter}px`;
      ripple.style.left = `${event.offsetX - radius}px`;
      ripple.style.top = `${event.offsetY - radius}px`;

      // Add ripple to button
      button.appendChild(ripple);

      // Remove ripple after animation
      setTimeout(() => {
        if (ripple && ripple.parentNode === button) {
          button.removeChild(ripple);
        }
      }, 600);
    }

    // Add ripple effect to all mobile nav items
    mobileNavItems.forEach((item) => {
      item.addEventListener("click", createRipple);
    });

    // Handle mobile nav item clicks with smooth transitions
    mobileNavItems.forEach((item) => {
      if (!item.classList.contains("menu-toggle-bottom")) {
        item.addEventListener("click", function (e) {
          e.preventDefault();

          // Remove active class from all items and add to clicked item
          mobileNavItems.forEach((navItem) => {
            navItem.classList.remove("active");
          });
          this.classList.add("active");

          // Add tactile feedback with subtle animation
          this.querySelector("i").classList.add("pulse");
          setTimeout(() => {
            this.querySelector("i").classList.remove("pulse");
          }, 400);

          // Get target section and scroll to it
          const targetId = this.getAttribute("href");
          const targetSection = document.querySelector(targetId);

          if (targetSection) {
            // Add smooth scrolling with optimal speed based on distance
            const distance = Math.abs(
              targetSection.getBoundingClientRect().top
            );
            const scrollDuration = Math.min(Math.max(300, distance / 2), 800);

            smoothScrollTo(targetSection, scrollDuration);
          }
        });
      }
    });

    // Enhanced smooth scrolling function
    function smoothScrollTo(targetElement, duration) {
      const targetPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;
      const startPosition = window.pageYOffset;
      const headerHeight = document.querySelector(".header").offsetHeight;
      const distance = targetPosition - headerHeight - startPosition;
      let startTime = null;

      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const scrollY = easeInOutQuad(
          timeElapsed,
          startPosition,
          distance,
          duration
        );
        window.scrollTo(0, scrollY);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }

      // Easing function for smoother animation
      function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
      }

      requestAnimationFrame(animation);
    }

    // Enhanced menu modal interactions
    if (menuToggleBottom && menuModal) {
      // Open modal with animation
      menuToggleBottom.addEventListener("click", function (e) {
        e.preventDefault();

        // Add ripple effect
        createRipple(e);

        // Open modal with animation
        menuModal.style.display = "flex";
        menuModal.offsetHeight; // Force reflow
        menuModal.classList.add("active");
        document.body.classList.add("no-scroll");

        // Add entrance animation to modal content
        const modalContent = menuModal.querySelector(".menu-modal-content");
        modalContent.style.transform = "translateY(0)";
      });

      // Close modal with animation
      menuModalClose.addEventListener("click", closeMenuModal);

      // Close modal when clicking outside
      menuModal.addEventListener("click", function (e) {
        if (e.target === menuModal) {
          closeMenuModal();
        }
      });

      // Function to close modal with animation
      function closeMenuModal() {
        const modalContent = menuModal.querySelector(".menu-modal-content");
        modalContent.style.transform = "translateY(100%)";

        setTimeout(() => {
          menuModal.classList.remove("active");
          document.body.classList.remove("no-scroll");

          // After animation completes, hide the modal
          setTimeout(() => {
            menuModal.style.display = "none";
          }, 100);
        }, 250);
      }

      // Handle menu modal item clicks
      menuModalItems.forEach((item) => {
        item.addEventListener("click", function (e) {
          e.preventDefault();

          // Get target section
          const targetId = this.getAttribute("href");
          const targetSection = document.querySelector(targetId);

          // Close modal first
          closeMenuModal();

          // Then scroll to target after modal closing animation
          setTimeout(() => {
            if (targetSection) {
              smoothScrollTo(targetSection, 500);

              // Update active nav item
              mobileNavItems.forEach((navItem) => {
                navItem.classList.remove("active");
                if (navItem.getAttribute("href") === targetId) {
                  navItem.classList.add("active");
                }
              });
            }
          }, 350);
        });
      });
    }

    // Show/hide navigation bar on scroll
    window.addEventListener("scroll", function () {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      // Always show navbar at the top of the page
      if (scrollTop <= 100) {
        mobileNav.classList.remove("hide");
        return;
      }

      // Hide when scrolling down, show when scrolling up
      if (scrollTop > lastScrollTop + 10) {
        mobileNav.classList.add("hide");
      } else if (scrollTop < lastScrollTop - 10) {
        mobileNav.classList.remove("hide");
      }

      lastScrollTop = scrollTop;

      // Always show the navigation after scrolling stops
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        mobileNav.classList.remove("hide");
      }, 1500);
    });

    // Update active state based on scroll position with enhanced animation
    function updateActiveNavWithAnimation() {
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const sections = document.querySelectorAll("section[id]");

      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        // Check if section is in viewport and takes up significant portion
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          // Only update if not already active
          const currentActive = document.querySelector(
            ".mobile-nav-item.active"
          );
          const targetItem = document.querySelector(
            `.mobile-nav-item[href="#${sectionId}"]`
          );

          if (targetItem && currentActive !== targetItem) {
            // Remove active class from all items
            mobileNavItems.forEach((navItem) => {
              navItem.classList.remove("active");
            });

            // Add active class to current section nav item
            targetItem.classList.add("active");

            // Add subtle animation to icon
            const icon = targetItem.querySelector("i");
            icon.style.animation = "none"; // Reset animation
            void icon.offsetWidth; // Trigger reflow
            icon.style.animation = "pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
          }
        }
      });
    }

    // Add animation for pop effect
    const style = document.createElement("style");
    style.innerHTML = `
    @keyframes pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    .ripple {
      position: absolute;
      background-color: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);

    // Update active state on scroll with throttling for performance
    let isScrolling = false;
    window.addEventListener("scroll", function () {
      if (!isScrolling) {
        window.requestAnimationFrame(function () {
          updateActiveNavWithAnimation();
          isScrolling = false;
        });
        isScrolling = true;
      }
    });

    // Initial call to set active state
    updateActiveNavWithAnimation();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu modal toggle
  const menuToggleBottom = document.querySelector(".menu-toggle-bottom");
  const menuModal = document.getElementById("menuModal");
  const menuModalClose = document.getElementById("menuModalClose");

  if (menuToggleBottom && menuModal) {
    menuToggleBottom.addEventListener("click", function (e) {
      e.preventDefault();
      menuModal.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    });

    menuModalClose.addEventListener("click", function () {
      menuModal.classList.remove("active");
      document.body.style.overflow = ""; // Re-enable scrolling
    });

    // Close modal when clicking outside of content
    menuModal.addEventListener("click", function (e) {
      if (e.target === menuModal) {
        menuModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Handle menu modal item clicks
    document.querySelectorAll(".menu-modal-item").forEach((item) => {
      item.addEventListener("click", function () {
        menuModal.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // Update active state for mobile nav based on scroll position
  function updateActiveState() {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll("section[id]");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        document.querySelectorAll(".mobile-nav-item").forEach((item) => {
          item.classList.remove("active");
          if (item.getAttribute("href") === `#${sectionId}`) {
            item.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveState);
  updateActiveState(); // Initial call
});
