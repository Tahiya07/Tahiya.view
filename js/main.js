console.log("JS loaded on this page!");

document.addEventListener('DOMContentLoaded', () => {

  // ===== THEME TOGGLE =====
  const root = document.documentElement;
  const toggle = document.getElementById('themeToggle');
  const dot = document.getElementById('themeDot');
  const HAMB = document.getElementById('hamb');

  function getStoredTheme() {
    return localStorage.getItem('site-theme');
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(t) {
    if (t === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (toggle) toggle.setAttribute('aria-pressed', 'true');
      if (dot) {
        dot.textContent = '🌙';
        dot.style.transform = 'translateX(20px)';
      }
    } else {
      root.removeAttribute('data-theme');
      if (toggle) toggle.setAttribute('aria-pressed', 'false');
      if (dot) {
        dot.textContent = '🌈';
        dot.style.transform = 'translateX(0)';
      }
    }
  }

  const stored = getStoredTheme();
  applyTheme(stored ? stored : (systemPrefersDark() ? 'dark' : 'light'));

  if (toggle) {
    toggle.addEventListener('click', () => {
      const active = root.getAttribute('data-theme') === 'dark';
      const next = active ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('site-theme', next);
    });
  }

  if (HAMB) {
    HAMB.addEventListener('click', () => {
      const nav = document.querySelector('nav');
      if (nav) nav.style.display = nav.style.display === 'flex' ? '' : 'flex';
    });
  }

  // ===== FADE-IN ELEMENTS =====
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('show');
        if (e.isIntersecting && e.target.classList.contains('skill-bar')) {
          const span = e.target.querySelector('span');
          if (span) span.style.width = span.dataset.level;
        }
      });
    }, {threshold: 0.12});
    fadeElements.forEach(el => io.observe(el));
  }

  // ===== PROJECT CARDS =====
  const projectCards = document.querySelectorAll('.project');
  if (projectCards.length) {
    projectCards.forEach(card => {
      card.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          openProject(card.dataset.project);
        }
      });
      card.addEventListener('click', () => openProject(card.dataset.project));
    });
  }

  function openProject(id) {
    alert('Open project: ' + id + '\n(Replace with modal or page navigation)');
  }

  // ===== AUTONOMOUS & INTERACTIVE BLOBS =====
  const blobContainer = document.querySelector('.blobs');
  if (blobContainer) {
    const NUM_BLOBS = 12;
    const blobs = [];
    const blobData = [];
    const mouse = {x: -1000, y: -1000};

    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    for (let i = 0; i < NUM_BLOBS; i++) {
      const b = document.createElement('div');
      b.classList.add('blob');
      const size = 80 + Math.random() * 180;
      b.style.width = `${size}px`;
      b.style.height = `${size}px`;
      blobContainer.appendChild(b);
      blobs.push(b);
      blobData.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: Math.random() * 0.3 - 0.15,
        vy: Math.random() * 0.3 - 0.15,
        hue: Math.random() * 360,
        size,
        scale: 0.8 + Math.random() * 0.6,
        offsetX: Math.random() * 1000,
        offsetY: Math.random() * 1000
      });
    }

    let t = 0;

    function animateBlobs() {
      t += 0.01;
      blobs.forEach((b, i) => {
        const data = blobData[i];
        const wiggleX = Math.sin(t * (0.5 + i * 0.2) + data.offsetX) * 6;
        const wiggleY = Math.cos(t * (0.4 + i * 0.3) + data.offsetY) * 6;
        data.x += data.vx;
        data.y += data.vy;
        if (data.x < 0 || data.x > window.innerWidth - data.size) data.vx *= -1;
        if (data.y < 0 || data.y > window.innerHeight - data.size) data.vy *= -1;

        // Cursor repulsion
        const dx = data.x + data.size / 2 - mouse.x;
        const dy = data.y + data.size / 2 - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250) {
          const force = (250 - dist) / 250 * 0.5;
          data.vx += dx / dist * force;
          data.vy += dy / dist * force;
        }
        data.vx *= 0.85;
        data.vy *= 0.85;
        data.x += data.vx;
        data.y += data.vy;

        data.hue += 0.3;
        if (data.hue > 360) data.hue -= 360;
        const bg = root.getAttribute('data-theme') === 'dark' ?
            `radial-gradient(circle at 30% 30%, hsl(${data.hue},100%,60%), transparent 40%)` :
            `radial-gradient(circle at 30% 30%, hsl(${data.hue},100%,50%), transparent 40%)`;
        b.style.background = bg;

        const speed = Math.sqrt(data.vx * data.vx + data.vy * data.vy);
        const stretch = 1 + speed * 0.15;
        b.style.transform = `translate3d(${data.x + wiggleX}px, ${data.y + wiggleY}px, 0) scale(${data.scale * stretch},${data.scale / stretch})`;
        b.style.opacity = 0.45 + Math.sin(t * (0.5 + i * 0.3)) * 0.12;
      });
      requestAnimationFrame(animateBlobs);
    }

    animateBlobs();

    window.addEventListener('resize', () => {
      blobs.forEach((b, i) => {
        blobData[i].x = Math.random() * window.innerWidth;
        blobData[i].y = Math.random() * window.innerHeight;
      });
    });
  }

  // ===== HERO IMAGE BURST =====
  const heroRight = document.querySelector('.hero-right');
  if (heroRight) {
    const img = heroRight.querySelector('img');
    const burstContainer = heroRight.querySelector('.burst-container');
    if (img && burstContainer) {
      heroRight.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.15)';
        const colors = ['#00FFFF', '#B497FF', '#FFDAB9', '#98FF98', '#CFFF00', '#FFF44F', '#FF9A00', '#AA00FF'];
        for (let i = 0; i < 16; i++) {
          const particle = document.createElement('div');
          particle.classList.add('burst-particle');
          particle.style.background = colors[Math.floor(Math.random() * colors.length)];
          const size = 10 + Math.random() * 12;
          particle.style.width = size + 'px';
          particle.style.height = size + 'px';
          const distance = 80 + Math.random() * 120;
          const angle = Math.random() * 2 * Math.PI;
          const x = Math.cos(angle) * distance + 'px';
          const y = Math.sin(angle) * distance + 'px';
          particle.style.transform = 'translate(-50%, -50%) scale(0)';
          burstContainer.appendChild(particle);

          setTimeout(() => {
            particle.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out';
            particle.style.transform = `translate(${x},${y}) scale(1)`;
            particle.style.opacity = 0;
          }, 50);
          setTimeout(() => particle.remove(), 650);
        }
        setTimeout(() => img.style.transform = 'scale(1)', 600);
      });
    }
  }

  // ===== CURSOR SPLASH =====
const cursorSplash = document.querySelector('.cursor-splash');
const colors = [
  '#00FFFF',  // cyan
  '#B497FF',  // lavender
  '#FFDAB9',  // peach
  '#98FF98',  // mint
  '#CFFF00',  // lime
  '#FFF44F',  // yellow
  '#FF9A00',  // orange
  '#AA00FF'   // purple
];

function createSplash(x, y) {
  const particle = document.createElement('div');
  particle.classList.add('splash-particle');

  const size = Math.random() * 12 + 8;
  const color = colors[Math.floor(Math.random() * colors.length)];

  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.background = color;
  particle.style.left = `${x - size / 2}px`;
  particle.style.top = `${y - size / 2}px`;

  cursorSplash.appendChild(particle);

  setTimeout(() => particle.remove(), 800);
}

// ===== Desktop mouse trail =====
document.addEventListener('mousemove', (e) => {
  createSplash(e.clientX, e.clientY);
});

// ===== Mobile finger trail =====
let lastTouch = { x: null, y: null };

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];
  createSplash(touch.clientX, touch.clientY);
  lastTouch.x = touch.clientX;
  lastTouch.y = touch.clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  const x = touch.clientX;
  const y = touch.clientY;

  // Create multiple splashes between last and current point for smooth trail
  if (lastTouch.x !== null && lastTouch.y !== null) {
    const dx = x - lastTouch.x;
    const dy = y - lastTouch.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(dist / 5));

    for (let i = 0; i < steps; i++) {
      const ix = lastTouch.x + (dx * i) / steps;
      const iy = lastTouch.y + (dy * i) / steps;
      createSplash(ix, iy);
    }
  }

  lastTouch.x = x;
  lastTouch.y = y;
}, { passive: true });

document.addEventListener('touchend', () => {
  lastTouch.x = null;
  lastTouch.y = null;
});
});

