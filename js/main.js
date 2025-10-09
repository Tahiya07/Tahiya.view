// THEME TOGGLE
const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const dot = document.getElementById('themeDot');
const HAMB = document.getElementById('hamb');

function getStoredTheme(){ return localStorage.getItem('site-theme'); }
function systemPrefersDark(){ return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; }

function applyTheme(t){
  if(t === 'dark'){
    root.setAttribute('data-theme','dark');
    toggle.setAttribute('aria-pressed','true');
    dot.textContent = '🌙';
    dot.style.transform = 'translateX(20px)';
  } else {
    root.removeAttribute('data-theme');
    toggle.setAttribute('aria-pressed','false');
    dot.textContent = '🌈';
    dot.style.transform = 'translateX(0)';
  }
}

// Initialize theme
(function initTheme(){
  const stored = getStoredTheme();
  if(stored) applyTheme(stored);
  else applyTheme(systemPrefersDark() ? 'dark' : 'light');
})();

toggle.addEventListener('click', ()=>{
  const active = root.getAttribute('data-theme') === 'dark';
  const next = active ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('site-theme', next);
});

// Hamburger toggle
HAMB.addEventListener('click', ()=>{
  const nav = document.querySelector('nav');
  nav.style.display = nav.style.display === 'flex' ? '' : 'flex';
});

// Intersection Observer for fade-in
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting) e.target.classList.add('show');
    if(e.isIntersecting && e.target.classList.contains('skill-bar')){
      e.target.querySelector('span').style.width = e.target.querySelector('span').dataset.level;
    }
  });
},{threshold:0.12});
document.querySelectorAll('.fade-in').forEach(el=>io.observe(el));

// Project cards keyboard + click
document.querySelectorAll('.project').forEach(card=>{
  card.addEventListener('keydown', (ev)=>{
    if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); openProject(card.dataset.project);}
  });
  card.addEventListener('click', ()=>openProject(card.dataset.project));
});

function openProject(id){ alert('Open project: ' + id + '\n(Replace with modal or page navigation)'); }
// ========== AUTONOMOUS & INTERACTIVE BLOBS ==========
const blobContainer = document.querySelector('.blobs');
const NUM_BLOBS = 12;
const blobs = [];
const blobData = [];

// Track mouse
const mouse = { x: -1000, y: -1000 };
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

// Create blobs
for (let i = 0; i < NUM_BLOBS; i++) {
  const b = document.createElement('div');
  b.classList.add('blob');

  const size = 80 + Math.random() * 180;  // random size
  b.style.width = `${size}px`;
  b.style.height = `${size}px`;
  b.style.position = 'absolute';
  b.style.borderRadius = '50%';
  b.style.pointerEvents = 'none';
  b.style.mixBlendMode = 'screen';
  b.style.filter = 'blur(40px)';

  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;

  blobContainer.appendChild(b);
  blobs.push(b);

  blobData.push({
    x, y,
    vx: (Math.random() * 0.3 - 0.15),
    vy: (Math.random() * 0.3 - 0.15),
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

    // Autonomous wiggle
    const wiggleX = Math.sin(t * (0.5 + i * 0.2) + data.offsetX) * 6;
    const wiggleY = Math.cos(t * (0.4 + i * 0.3) + data.offsetY) * 6;

    // Autonomous drift
    data.x += data.vx;
    data.y += data.vy;

    // Bounce edges
    if (data.x < 0 || data.x > window.innerWidth - data.size) data.vx *= -1;
    if (data.y < 0 || data.y > window.innerHeight - data.size) data.vy *= -1;

    // Cursor liquid repulsion
    const dx = data.x + data.size / 2 - mouse.x;
    const dy = data.y + data.size / 2 - mouse.y;
    const dist = Math.sqrt(dx*dx + dy*dy);
    if (dist < 250) {
      const force = (250 - dist) / 250 * 0.5;
      data.vx += (dx / dist) * force;
      data.vy += (dy / dist) * force;
    }

    // Apply friction
    data.vx *= 0.85;
    data.vy *= 0.85;
    data.x += data.vx;
    data.y += data.vy;

    // Hue shift for color animation
    data.hue += 0.3;
    if (data.hue > 360) data.hue -= 360;

   // Color by theme
if(document.documentElement.getAttribute('data-theme') === 'dark') {
  // Dark theme: slightly dimmer
  b.style.background = `radial-gradient(circle at 30% 30%, hsl(${data.hue}, 100%, 60%), transparent 40%)`;
} else {
  // Light theme: brighter and more saturated
  b.style.background = `radial-gradient(circle at 30% 30%, hsl(${data.hue}, 100%, 50%), transparent 40%)`;
}


    // Liquid stretching
    const speed = Math.sqrt(data.vx*data.vx + data.vy*data.vy);
    const stretch = 1 + speed * 0.15;
    b.style.transform = `translate3d(${data.x + wiggleX}px, ${data.y + wiggleY}px, 0) scale(${data.scale * stretch}, ${data.scale / stretch})`;

    // Subtle pulse
    b.style.opacity = 0.45 + Math.sin(t*(0.5 + i*0.3)) * 0.12;
  });

  requestAnimationFrame(animateBlobs);
}

animateBlobs();

// Reposition blobs on resize
window.addEventListener('resize', () => {
  blobs.forEach((b, i) => {
    blobData[i].x = Math.random() * window.innerWidth;
    blobData[i].y = Math.random() * window.innerHeight;
  });
});


const heroImg = document.querySelector('.hero-right img');

toggle.addEventListener('click', () => {
  const darkActive = document.documentElement.getAttribute('data-theme') === 'dark';
  heroImg.src = darkActive ? 'assets/img/dp2.png' : 'assets/img/dp3.png';
});
