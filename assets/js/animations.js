// Animation Controller for Desa Tampa Website
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Intersection Observer for scroll animations
  const animateOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    {
      root: null,
      threshold: 0.15, // When 15% of the element is visible
      rootMargin: "0px 0px -100px 0px", // Trigger a bit earlier
    }
  );

  // Apply animation classes to elements
  const setupAnimations = () => {
    // Section titles
    document.querySelectorAll(".section-title").forEach((el) => {
      el.classList.add("fade-in");
      animateOnScroll.observe(el);
    });

    // Section subtitles
    document.querySelectorAll(".section-subtitle").forEach((el) => {
      el.classList.add("fade-in");
      animateOnScroll.observe(el);
    });

    // Profil content
    const profilImg = document.querySelector(".profil-img-container");
    const profilText = document.querySelector(".profil-text");
    if (profilImg && profilText) {
      profilImg.classList.add("slide-in-left");
      profilText.classList.add("slide-in-right");
      animateOnScroll.observe(profilImg);
      animateOnScroll.observe(profilText);
    }

    // Potensi cards with staggered effect
    document.querySelectorAll(".card").forEach((card, index) => {
      card.classList.add("scale-in");
      card.style.transitionDelay = `${index * 0.15}s`;
      animateOnScroll.observe(card);
    });

    // Wisata cards
    document.querySelectorAll(".wisata-card").forEach((card, index) => {
      card.classList.add("fade-in");
      card.style.transitionDelay = `${index * 0.2}s`;
      animateOnScroll.observe(card);
    });

    // Stat cards with staggered effect
    document.querySelectorAll(".stats-card").forEach((card, index) => {
      card.classList.add("fade-in");
      card.style.transitionDelay = `${index * 0.1}s`;
      animateOnScroll.observe(card);
    });

    // Gallery images
    document.querySelectorAll(".gallery-item").forEach((item, index) => {
      item.classList.add("stagger-item", "zoom-effect");
      item.style.transitionDelay = `${index * 0.1}s`;
      animateOnScroll.observe(item);
    });

    // Contact items
    document.querySelectorAll(".contact-item").forEach((item, index) => {
      item.classList.add("slide-in-left");
      item.style.transitionDelay = `${index * 0.15}s`;
      animateOnScroll.observe(item);
    });

    // Infrastructure tiles with floating effect
    document.querySelectorAll(".infra-tile").forEach((tile, index) => {
      tile.classList.add("depth-effect");
      animateOnScroll.observe(tile);
    });

    // Add floating icons to selected elements
    document.querySelectorAll(".card-icon").forEach((icon) => {
      icon.classList.add("float-animation");
    });

    document.querySelectorAll(".wisata-icon").forEach((icon) => {
      icon.classList.add("float-animation");
    });

    // Add depth effect to sectors
    document
      .querySelectorAll(".sector-item, .infra-item, .tech-item")
      .forEach((item) => {
        item.classList.add("depth-effect");
      });
  };

  // Initialize animations
  setupAnimations();

  // Parallax effect for hero section
  const heroSection = document.querySelector(".hero");
  const parallaxHandler = () => {
    if (window.innerWidth > 768) {
      // Only on desktop
      const scrolled = window.scrollY;
      const heroElements = document.querySelectorAll(
        ".hero-content, .hero-video-container"
      );

      heroElements.forEach((el) => {
        if (el.classList.contains("hero-content")) {
          // Move content slightly slower than scroll for a parallax effect
          el.style.transform = `translateY(${scrolled * 0.3}px)`;
        } else if (el.classList.contains("hero-video-container")) {
          // Subtle scale effect on video as you scroll
          const scale = 1 + scrolled * 0.0005;
          el.style.transform = `scale(${Math.min(scale, 1.1)})`;
        }
      });
    }
  };

  // Subtle parallax for section backgrounds
  const sectionParallax = () => {
    if (window.innerWidth > 768) {
      // Only on desktop
      const scrolled = window.scrollY;

      // Add parallax to specific sections
      const parallaxSections = document.querySelectorAll(
        "#profil, #wisata, #statistik, #peta"
      );
      parallaxSections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const distanceFromTop = scrolled - sectionTop;

        // Only apply effect when section is in view
        if (
          distanceFromTop > -sectionHeight &&
          distanceFromTop < sectionHeight
        ) {
          // Calculate parallax amount based on scroll position
          const parallaxAmount = distanceFromTop * 0.2;

          // Apply subtle background movement
          section.style.backgroundPositionY = `${parallaxAmount}px`;
        }
      });
    }
  };

  // Scroll event listener for parallax effects
  window.addEventListener("scroll", function () {
    // Debounce scroll events for better performance
    if (!window.requestAnimationFrame) {
      // Fallback for browsers that don't support requestAnimationFrame
      setTimeout(function () {
        heroParallax();
        sectionParallax();
      }, 66);
    } else {
      requestAnimationFrame(function () {
        parallaxHandler();
        sectionParallax();
      });
    }
  });

  // Staggered entrance for stat numbers
  const animateStats = () => {
    const statElements = document.querySelectorAll(
      ".big-number, .gender-count, .household-count, .geo-value, .product-stat .stat-value"
    );

    statElements.forEach((el, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add number counting animation
              setTimeout(() => {
                const finalValue = el.textContent;

                // Check if content is a number or includes a number
                if (!isNaN(parseFloat(finalValue))) {
                  countUp(el, parseFloat(finalValue));
                } else if (finalValue.match(/\d+/)) {
                  // For mixed content like "5.000 Ha"
                  const numericPart = finalValue.match(/\d+/)[0];
                  const prefix = finalValue.split(numericPart)[0];
                  const suffix = finalValue.split(numericPart)[1];

                  countUp(el, parseInt(numericPart), prefix, suffix);
                }

                observer.unobserve(entry.target);
              }, index * 100); // Stagger effect
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(el);
    });
  };

  // Number counter animation
  function countUp(element, finalValue, prefix = "", suffix = "") {
    let startValue = 0;
    let duration = 1500;
    let startTime = null;

    // For percentages or large numbers, adjust start value and duration
    if (finalValue > 100) {
      startValue = Math.floor(finalValue * 0.5);
      duration = 1200;
    }

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const currentValue = Math.floor(
        startValue + (finalValue - startValue) * easedProgress
      );

      element.textContent = `${prefix}${currentValue}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = `${prefix}${finalValue}${suffix}`;
      }
    }

    requestAnimationFrame(animate);
  }

  // Initialize stat animations
  animateStats();

  // Apply zoom effect to gallery items
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.classList.add("zoom-effect");
  });

  // Add smooth progress bar animations
  document.querySelectorAll(".progress-fill").forEach((bar) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Get the original width from inline style
          const targetWidth = bar.style.width;
          // Reset width to 0
          bar.style.width = "0";
          // Trigger animation by setting a timeout
          setTimeout(() => {
            bar.style.transition =
              "width 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            bar.style.width = targetWidth;
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    });

    observer.observe(bar);
  });
});
