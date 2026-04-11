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

  // =====================================================================
  // HERO PARTICLE CONSTELLATION
  // A floating network of glowing nodes connected by fading lines.
  // Nodes gently drift; lines appear when nodes are close to each other.
  // Mouse proximity causes nodes to subtly gravitate, adding interactivity.
  // =====================================================================
  (function initHeroCanvas() {
    var canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: -9999, y: -9999 };
    var PARTICLE_COUNT = 70;
    var CONNECTION_DIST = 150;
    var MOUSE_RADIUS = 200;
    var animId;

    // Neon palette matching the design system
    var colors = [
      { r: 0, g: 229, b: 255 },     // cyan --primary
      { r: 195, g: 244, b: 0 },      // lime --secondary
      { r: 172, g: 137, b: 255 },    // purple --tertiary
      { r: 0, g: 184, b: 212 },      // cyan dim
      { r: 130, g: 100, b: 255 },    // purple dim
    ];

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticle() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var color = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2.5 + 1,
        color: color,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseOffset: Math.random() * Math.PI * 2,
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticle(p, time) {
      var pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
      var currentAlpha = p.alpha * pulse;
      var currentRadius = p.radius * (0.8 + pulse * 0.4);

      // Outer glow
      ctx.beginPath();
      var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 4);
      gradient.addColorStop(0, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + (currentAlpha * 0.25) + ')');
      gradient.addColorStop(1, 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',0)');
      ctx.fillStyle = gradient;
      ctx.arc(p.x, p.y, currentRadius * 4, 0, Math.PI * 2);
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.fillStyle = 'rgba(' + p.color.r + ',' + p.color.g + ',' + p.color.b + ',' + currentAlpha + ')';
      ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawConnections() {
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            var alpha = (1 - dist / CONNECTION_DIST) * 0.15;
            // Blend the two particle colors
            var c1 = particles[i].color;
            var c2 = particles[j].color;
            var mr = Math.round((c1.r + c2.r) / 2);
            var mg = Math.round((c1.g + c2.g) / 2);
            var mb = Math.round((c1.b + c2.b) / 2);

            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + mr + ',' + mg + ',' + mb + ',' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function updateParticles() {
      var rect = canvas.parentElement.getBoundingClientRect();
      var w = rect.width;
      var h = rect.height;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        // Mouse interaction — gentle gravity
        var mdx = mouse.x - p.x;
        var mdy = mouse.y - p.y;
        var mDist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mDist < MOUSE_RADIUS && mDist > 0) {
          var force = (MOUSE_RADIUS - mDist) / MOUSE_RADIUS * 0.015;
          p.vx += (mdx / mDist) * force;
          p.vy += (mdy / mDist) * force;
        }

        // Damping
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;
      }
    }

    function animate(time) {
      var rect = canvas.parentElement.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      drawConnections();

      for (var i = 0; i < particles.length; i++) {
        drawParticle(particles[i], time);
      }

      updateParticles();
      animId = requestAnimationFrame(animate);
    }

    // Mouse tracking relative to canvas
    canvas.parentElement.addEventListener('mousemove', function (e) {
      var rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', function () {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    // Responsive resize
    var resizeTimeout;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        resize();
        // Re-distribute particles if canvas size changed significantly
        var rect = canvas.parentElement.getBoundingClientRect();
        for (var i = 0; i < particles.length; i++) {
          if (particles[i].x > rect.width || particles[i].y > rect.height) {
            particles[i].x = Math.random() * rect.width;
            particles[i].y = Math.random() * rect.height;
          }
        }
      }, 150);
    });

    init();
    animId = requestAnimationFrame(animate);
  })();

})();
