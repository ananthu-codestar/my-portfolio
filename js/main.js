document.addEventListener('DOMContentLoaded', () => {
  // Kinetic Dual Custom Cursor
  initCustomCursor();

  // Dynamic Particle Canvas with Scroll Velocity Acceleration
  initParticleCanvas();

  // Scroll Progress Bar & Active Navigation Tracker
  initScrollTracker();

  // Kinetic Scroll Reveal Animations
  initScrollReveals();

  // 3D Perspective Card Tilt
  initCardTilt();

  // Typing Effect
  initTypewriter();

  // Live Kerala Clock Widget
  initKeralaClock();

  // Skills Filtering & Progress Animation
  initSkillsFilter();

  // Stat Counter Animation
  initStatCounters();

  // Mobile Navigation Toggle
  initMobileNav();

  // Navbar Scroll effect
  initNavbarScroll();

  // Contact Form Submission
  initContactForm();
});

/* Kinetic Magnetic Dual Custom Cursor */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const follower = document.getElementById('cursor-follower');
  if (!dot || !follower || window.innerWidth < 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let posX = mouseX;
  let posY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    posX += (mouseX - posX) * 0.15;
    posY += (mouseY - posY) * 0.15;
    follower.style.left = `${posX}px`;
    follower.style.top = `${posY}px`;
    requestAnimationFrame(renderCursor);
  }

  renderCursor();

  // Interactive Hover Magnets
  const hoverTargets = document.querySelectorAll('a, button, .skill-card, .project-card, .highlight-card, .timeline-content, .radar-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-active'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-active'));
  });
}

/* Particle Canvas with Scroll Velocity Physics */
function initParticleCanvas() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.floor(width < 768 ? 30 : 65);
  let scrollSpeed = 0;
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    scrollSpeed = Math.min(delta * 0.1, 8);
    lastScrollY = window.scrollY;
  });

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2.2 + 1,
      color: i % 3 === 0 ? 'rgba(56, 189, 248, ' : (i % 3 === 1 ? 'rgba(139, 92, 246, ' : 'rgba(6, 182, 212, '),
      alpha: Math.random() * 0.45 + 0.15
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Friction to slow down particle acceleration after scrolling stops
    scrollSpeed *= 0.94;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx * (1 + scrollSpeed);
      p.y += p.vy * (1 + scrollSpeed);

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius + (scrollSpeed * 0.2), 0, Math.PI * 2);
      ctx.fillStyle = p.color + (p.alpha + Math.min(0.3, scrollSpeed * 0.05)) + ')';
      ctx.fill();

      // Connect close particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.55;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  render();
}

/* Scroll Progress Bar & Active Section Link Tracker */
function initScrollTracker() {
  const progressBar = document.querySelector('.scroll-progress-bar');
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (progressBar) {
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }

    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 130;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/* Kinetic Scroll Reveal Observer & Immediate Fallback */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-left, .reveal-right, .reveal-zoom');

  function triggerReveal(el) {
    el.classList.add('revealed');
  }

  // 1. Intersection Observer with zero threshold and generous rootMargin
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        triggerReveal(entry.target);
        revealObserver.unobserve(entry.target); // keep revealed once animated
      }
    });
  }, {
    root: null,
    threshold: 0.01,
    rootMargin: '50px 0px 50px 0px' // Trigger early before entering viewport
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 2. Direct Fallback Check function for scroll & initial page load
  function checkScrollReveals() {
    const windowHeight = window.innerHeight;
    revealElements.forEach(el => {
      if (!el.classList.contains('revealed')) {
        const rect = el.getBoundingClientRect();
        if (rect.top < windowHeight + 80 && rect.bottom > -50) {
          triggerReveal(el);
        }
      }
    });
  }

  // Run fallback check immediately on load and on scroll
  checkScrollReveals();
  window.addEventListener('scroll', checkScrollReveals, { passive: true });
}

/* 3D Tilt Effect on Cards */
function initCardTilt() {
  const tiltCards = document.querySelectorAll('.project-card, .portrait-frame, .radar-card, .glass-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 22;
      const rotateY = (centerX - x) / 22;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
    });
  });
}

/* Typewriter Effect */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    "ASP.NET Core Specialist",
    "Offshore Team Lead",
    "Founder & CEO @ April IT Solutions",
    "DevOps & Observability Lead",
    "Passenger Control & Seaplane Tech"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      el.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 35 : 75;

    if (!isDeleting && charIdx === currentRole.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      speed = 400;
    }

    setTimeout(type, speed);
  }

  type();
}

/* Live Kerala Clock (IST GMT+5:30) */
function initKeralaClock() {
  const clockEl = document.getElementById('kerala-clock');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now) + ' IST';
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* Skills Filter Interactivity */
function initSkillsFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.skill-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px) scale(0.95)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* Stat Counter Animation */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const target = parseInt(stat.dataset.count);
          const suffix = stat.dataset.suffix || '';
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 40));

          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              stat.textContent = target + suffix;
              clearInterval(timer);
            } else {
              stat.textContent = current + suffix;
            }
          }, 35);
        });
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) observer.observe(heroStats);
}

/* Mobile Navbar Toggle */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }
}

/* Navbar Scroll Effect */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

/* Contact Form handling */
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Transmitting...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fa-solid fa-check"></i> Message Sent!`;
        form.reset();

        showToast("Thank you for reaching out! I will respond promptly.");

        setTimeout(() => {
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1200);
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(16, 185, 129, 0.95);
      color: #fff;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      z-index: 9999;
      font-weight: 600;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      transform: translateY(100px);
      opacity: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${message}`;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 4000);
}
