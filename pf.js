/* ========================================================================
   GAURAV ARYA — PORTFOLIO INTERACTIONS
   ======================================================================== */

(function () {
  'use strict';

  // --- DOM References ---
  const scrollProgress = document.getElementById('scrollProgress');
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  const allNavLinks = document.querySelectorAll('.nav__link');

  // --- Scroll Progress Bar ---
  function updateScrollProgress() {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // --- Nav Scroll State ---
  function updateNavState() {
    if (document.documentElement.scrollTop > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  // --- Hamburger Menu ---
  function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    navOverlay.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
      document.body.style.overflow = 'hidden';
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      document.body.style.overflow = '';
    }
  }

  function closeMobileMenu() {
    navLinks.classList.remove('active');
    navOverlay.classList.remove('active');
    const icon = hamburger.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  navOverlay.addEventListener('click', closeMobileMenu);

  // Close menu when a nav link is clicked
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // --- Scroll Events ---
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavState();
        ticking = false;
      });
      ticking = true;
    }
  });

  // --- Intersection Observer: Scroll Reveal ---
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Trigger counter animation for lighthouse scores if visible
          if (entry.target.querySelector('.lighthouse')) {
            animateLighthouseScores(entry.target);
          }
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
    revealObserver.observe(el);
  });

  // --- Lighthouse Score Counter Animation ---
  function animateLighthouseScores(container) {
    var scores = container.querySelectorAll('.lighthouse__score');
    scores.forEach(function (scoreEl) {
      var target = parseInt(scoreEl.textContent, 10);
      if (isNaN(target)) return;
      var current = 0;
      var duration = 1200;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var elapsed = timestamp - startTime;
        var progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        var eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        scoreEl.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      }

      scoreEl.textContent = '0';
      requestAnimationFrame(step);
    });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        var navHeight = nav.offsetHeight;
        var targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Initialize ---
  updateScrollProgress();
  updateNavState();

})();
