/* ============================================================
   AI IN CONSUMER BANKING — INTERACTIVE SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHeroCanvas();
  initProductTabs();
  initAccordions();
  initCounters();
  initScrollAnimations();
  initProgressBar();
  initBarAnimations();
  initMatrixBarAnimations();
  initSmoothScroll();
});

/* ── Utility ───────────────────────────────────────────────── */
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 80;
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}
window.scrollToSection = scrollToSection;

/* ============================================================
   NAVIGATION
   ============================================================ */
function initNav() {
  const nav = document.getElementById('main-nav');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Sticky nav: add class on scroll
  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    updateActiveNavLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });

  // Active link based on scroll position
  function updateActiveNavLink() {
    const sections = ['executive-summary', 'products', 'comparison', 'recommendations'];
    const scrollMid = window.scrollY + window.innerHeight / 3;

    let current = '';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.offsetTop <= scrollMid) {
        current = id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href')?.replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }
}

/* ============================================================
   HERO CANVAS — Neural Network Particle Animation
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, particles, animFrame;

  function resize() {
    w = canvas.width  = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }

  function spawnParticles() {
    const count = Math.min(Math.floor((w * h) / 12000), 80);
    particles = Array.from({ length: count }, () => ({
      x:  Math.random() * w,
      y:  Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r:  Math.random() * 1.5 + 0.5,
    }));
  }

  // Colour helpers
  const TEAL   = '0, 180, 216';
  const PURPLE = '108, 92, 231';

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.25;
          // Blend between teal and purple based on x position
          const blend = (p.x + q.x) / (2 * w);
          const r = Math.round(0 + (108 - 0) * blend);
          const g = Math.round(180 + (92 - 180) * blend);
          const b = Math.round(216 + (231 - 216) * blend);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // Node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const blend = p.x / w;
      const alpha = 0.5 + Math.sin(Date.now() * 0.001 + i) * 0.15;
      ctx.fillStyle = blend < 0.5
        ? `rgba(${TEAL}, ${alpha})`
        : `rgba(${PURPLE}, ${alpha})`;
      ctx.fill();

      // Move
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;
    }

    animFrame = requestAnimationFrame(draw);
  }

  // Mouse interaction: nudge nearby particles
  let mouse = { x: -1000, y: -1000 };
  canvas.parentElement.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        const force = (80 - dist) / 80 * 0.4;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
        // Dampen velocity
        p.vx *= 0.95;
        p.vy *= 0.95;
      }
    });
  });

  window.addEventListener('resize', () => {
    resize();
    spawnParticles();
  });

  resize();
  spawnParticles();
  draw();

  // Pause animation when tab not visible (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrame);
    } else {
      draw();
    }
  });
}

/* ============================================================
   PRODUCT TABS
   ============================================================ */
function initProductTabs() {
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const panels   = document.querySelectorAll('.product-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      // Update buttons
      tabBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === target);
        b.setAttribute('aria-selected', b.dataset.tab === target);
      });

      // Update panels
      panels.forEach(panel => {
        const isActive = panel.id === `panel-${target}`;
        panel.classList.toggle('active', isActive);
        // Trigger bar animations when panel becomes visible
        if (isActive) {
          setTimeout(() => animateBarsInPanel(panel), 50);
        }
      });
    });
  });
}

/* ============================================================
   ACCORDIONS (Analysis Blocks)
   ============================================================ */
function initAccordions() {
  // All blocks start open; clicking collapses / expands them
}

// Called from inline onclick in HTML
function toggleBlock(headerEl) {
  const body = headerEl.nextElementSibling;
  if (!body) return;
  const isCollapsed = body.classList.contains('collapsed');
  body.classList.toggle('collapsed', !isCollapsed);
  headerEl.classList.toggle('collapsed', !isCollapsed);
}
window.toggleBlock = toggleBlock;

/* ============================================================
   ANIMATED KPI COUNTERS
   ============================================================ */
function initCounters() {
  const cards = document.querySelectorAll('.kpi-card');

  cards.forEach(card => {
    const target = parseFloat(card.dataset.target);
    const suffix = card.dataset.suffix || '';
    const prefix = card.dataset.prefix || '';
    const label  = card.dataset.label  || '';

    // Build inner HTML
    card.innerHTML = `
      <div class="kpi-value" data-target="${target}" data-suffix="${suffix}" data-prefix="${prefix}">
        ${prefix}<span class="kpi-num">0</span>${suffix}
      </div>
      <div class="kpi-label">${label}</div>
    `;
  });

  // Observe when cards enter viewport
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const numEl = card.querySelector('.kpi-num');
      if (!numEl || card.dataset.animated) return;

      card.dataset.animated = 'true';
      const target = parseFloat(card.dataset.target);
      animateCount(numEl, 0, target, 1400);
      observer.unobserve(card);
    });
  }, { threshold: 0.4 });

  cards.forEach(card => observer.observe(card));
}

function animateCount(el, start, end, duration) {
  const startTime = performance.now();
  const isDecimal = (end % 1 !== 0);

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;
    el.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ============================================================
   SCROLL-TRIGGERED ANIMATIONS (Intersection Observer)
   ============================================================ */
function initScrollAnimations() {
  // Add reveal class to key elements
  const targets = document.querySelectorAll(
    '.exec-stats, .exec-thesis, .takeaway-chip, .analysis-block, ' +
    '.econ-card, .force-card, .rec-item, .tlcard, .matrix-row'
  );

  targets.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings within the same parent
    const siblings = el.parentElement.querySelectorAll('.reveal');
    const sibIndex = Array.from(siblings).indexOf(el);
    if (sibIndex > 0 && sibIndex <= 4) {
      el.classList.add(`reveal-delay-${sibIndex}`);
    }
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* ============================================================
   PROGRESS BAR
   ============================================================ */
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const pct          = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width    = pct + '%';
  }, { passive: true });
}

/* ============================================================
   BAR ANIMATIONS (metric bar fills)
   ============================================================ */
function initBarAnimations() {
  // Animate bars in the active (first) panel on load
  const activePanel = document.querySelector('.product-panel.active');
  if (activePanel) animateBarsInPanel(activePanel);
}

function animateBarsInPanel(panel) {
  const bars = panel.querySelectorAll('.bar-fill');
  bars.forEach(bar => {
    bar.classList.remove('animated');
    // Force reflow
    void bar.offsetWidth;
    bar.classList.add('animated');
  });
}

/* ============================================================
   COMPARISON MATRIX BAR ANIMATIONS
   ============================================================ */
function initMatrixBarAnimations() {
  const fills = document.querySelectorAll('.csb-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.animated) return;
      el.dataset.animated = 'true';
      el.classList.add('animated');
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
}

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href')?.slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      scrollToSection(id);
    });
  });
}

/* ============================================================
   MATRIX ROW HOVER — reveal insight text on desktop
   (CSS handles this; JS adds keyboard accessibility)
   ============================================================ */
document.querySelectorAll('.matrix-row').forEach(row => {
  row.setAttribute('tabindex', '0');
  row.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      row.classList.toggle('hover-locked');
    }
  });
});
