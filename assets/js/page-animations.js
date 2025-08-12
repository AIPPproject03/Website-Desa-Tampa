// Animation Controller for Subpages
document.addEventListener("DOMContentLoaded", function () {
  // Add fade-in to section headers
  document.querySelectorAll(".content-header").forEach((el) => {
    el.classList.add("fade-in");
  });

  // Add slide-in to content paragraphs
  document.querySelectorAll(".content-body p").forEach((el, index) => {
    el.classList.add("fade-in");
    el.style.transitionDelay = `${index * 0.1}s`;
  });

  // Add animations to potensi hero
  const heroIcon = document.querySelector(".hero-icon");
  const heroTitle = document.querySelector(".potensi-hero h1");
  const heroDesc = document.querySelector(".potensi-hero p");

  if (heroIcon) heroIcon.classList.add("scale-in");
  if (heroTitle) heroTitle.classList.add("slide-in-left");
  if (heroDesc) heroDesc.classList.add("slide-in-right");

  // Initialize animation observer
  const animateOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Apply observer to all animated elements
  document
    .querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .scale-in")
    .forEach((el) => {
      animateOnScroll.observe(el);
    });

  // Parallax effect for hero background
  window.addEventListener("scroll", function () {
    const scrolled = window.scrollY;
    const heroSection = document.querySelector(".potensi-hero");

    if (heroSection && window.innerWidth > 768) {
      const video = heroSection.querySelector(".hero-video");
      if (video) {
        // Create subtle parallax effect on video
        video.style.transform = `translate(-50%, -${50 + scrolled * 0.05}%)`;
      }
    }
  });

  // Add depth effect to sidebar items
  document
    .querySelectorAll(".related-item, .sidebar-widget")
    .forEach((item) => {
      item.classList.add("depth-effect");
    });

  // Add staggered animation to commodity items
  document.querySelectorAll(".commodity-item").forEach((item, index) => {
    item.classList.add("stagger-item");
    item.style.transitionDelay = `${index * 0.15}s`;
    animateOnScroll.observe(item);
  });
});
