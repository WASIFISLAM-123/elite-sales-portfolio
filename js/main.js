  // ══════════════════════════════════════════
  //  1. SCROLL PROGRESS BAR
  // ══════════════════════════════════════════
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = Math.round((scrollTop / docHeight) * 100) + '%';
  }, { passive: true });

  // ══════════════════════════════════════════
  //  2. NAV SCROLL
  // ══════════════════════════════════════════
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  // ══════════════════════════════════════════
  //  3. CUSTOM CURSOR
  // ══════════════════════════════════════════
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });
  function animCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
  document.querySelectorAll('a, button, .service-card, .testi-card, .result-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // ══════════════════════════════════════════
  //  4. PARTICLE CANVAS
  // ══════════════════════════════════════════
  (function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -9999, y: -9999 };
    const GOLD = 'rgba(201,168,76,';
    const N = 80;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function rand(a, b) { return a + Math.random() * (b - a); }

    class Particle {
      constructor() { this.reset(true); }
      reset(init) {
        this.x = rand(0, W);
        this.y = init ? rand(0, H) : H + 10;
        this.r = rand(0.5, 1.8);
        this.vx = rand(-0.3, 0.3);
        this.vy = rand(-0.4, -0.15);
        this.alpha = rand(0.2, 0.7);
        this.da = rand(-0.002, 0.002);
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha += this.da;
        if (this.alpha < 0.05 || this.alpha > 0.75) this.da *= -1;
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 80) {
          this.x += dx / dist * 1.2;
          this.y += dy / dist * 1.2;
        }
        if (this.y < -10) this.reset(false);
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = GOLD + this.alpha + ')';
        ctx.fill();
      }
    }

    for (let i = 0; i < N; i++) particles.push(new Particle());

    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx*dx + dy*dy);
          if (d < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = GOLD + (0.08 * (1 - d/100)) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      requestAnimationFrame(loop);
    }
    loop();
  })();

  // ══════════════════════════════════════════
  //  5. TYPEWRITER / WORD CYCLE
  // ══════════════════════════════════════════
  const twEl = document.getElementById('typewriterEl');
  const words = ['Close More Deals', 'Generate More Revenue', 'Scale Your Business', 'Convert More Leads', 'Dominate Your Market'];
  let wi = 0, ci = 0, deleting = false, twTimeout;

  function typeLoop() {
    const word = words[wi];
    if (!deleting) {
      twEl.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; twTimeout = setTimeout(typeLoop, 2200); return; }
    } else {
      twEl.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; twTimeout = setTimeout(typeLoop, 300); return; }
    }
    twTimeout = setTimeout(typeLoop, deleting ? 45 : 80);
  }
  typeLoop();

  // ══════════════════════════════════════════
  //  6. TEXT SCRAMBLE (section titles on hover)
  // ══════════════════════════════════════════
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
  function scrambleText(el) {
    const original = el.dataset.original || el.textContent;
    el.dataset.original = original;
    let iter = 0;
    const totalFrames = original.length * 3;
    const id = setInterval(() => {
      el.textContent = original.split('').map((ch, i) => {
        if (ch === ' ') return ' ';
        if (i < iter / 3) return original[i];
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      }).join('');
      if (iter++ >= totalFrames) { el.textContent = original; clearInterval(id); }
    }, 28);
  }
  document.querySelectorAll('.section-label').forEach(el => {
    el.addEventListener('mouseenter', () => scrambleText(el));
  });

  // ══════════════════════════════════════════
  //  7. MOBILE MENU
  // ══════════════════════════════════════════
  function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
  }

  // ══════════════════════════════════════════
  //  8. SCROLL REVEAL (staggered)
  // ══════════════════════════════════════════
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  // ══════════════════════════════════════════
  //  9. COUNTER ANIMATION + PROGRESS BARS
  // ══════════════════════════════════════════
  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur = 1900;
    const start = performance.now();
    function upd(now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = prefix + Math.round(e * target) + suffix;
      if (p < 1) requestAnimationFrame(upd);
    }
    requestAnimationFrame(upd);
  }

  const resultsSection = document.getElementById('results');
  let barsAnimated = false;
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !barsAnimated) {
        barsAnimated = true;
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        setTimeout(() => {
          entry.target.querySelectorAll('.result-bar').forEach(bar => {
            bar.style.width = bar.dataset.width || '80%';
          });
        }, 300);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  if (resultsSection) counterObs.observe(resultsSection);

  // ══════════════════════════════════════════
  //  10. TILT CARD EFFECT (3D)
  // ══════════════════════════════════════════
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      const rotX = (y - 0.5) * -10;
      const rotY = (x - 0.5) * 10;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      card.style.setProperty('--mx', (x * 100) + '%');
      card.style.setProperty('--my', (y * 100) + '%');
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  // ══════════════════════════════════════════
  //  11. MAGNETIC BUTTON EFFECT
  // ══════════════════════════════════════════
  document.querySelectorAll('.magnetic-wrap').forEach(wrap => {
    const btn = wrap.querySelector('a, button');
    if (!btn) return;
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.35;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0,0)';
    });
  });

  // ══════════════════════════════════════════
  //  12. HERO STATS ANIMATE ON LOAD
  // ══════════════════════════════════════════
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.querySelectorAll('.hero-stat-num').forEach(el => {
        const orig = el.textContent;
        const num = parseInt(orig.replace(/[^0-9]/g, ''));
        if (isNaN(num)) return;
        const prefix = orig.replace(/[0-9]+.*/, '');
        const suffix = orig.replace(/^[^0-9]*[0-9]+/, '');
        const dur = 1600;
        const start = performance.now();
        function up(now) {
          const p = Math.min((now - start) / dur, 1);
          const e = 1 - Math.pow(1-p, 3);
          el.textContent = prefix + Math.round(e * num) + suffix;
          if (p < 1) requestAnimationFrame(up);
        }
        requestAnimationFrame(up);
      });
    }, 700);
  });

  // ══════════════════════════════════════════
  //  13. FORM SUBMIT
  // ══════════════════════════════════════════
  function submitForm(e) {
    e.preventDefault();
    const btn = e.target;
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
    }, 1400);
  }

  // ══════════════════════════════════════════
  //  14. ACTIVE NAV LINK HIGHLIGHTING
  // ══════════════════════════════════════════
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + current ? 'var(--gold)' : '';
    });
  }, { passive: true });

  // ══════════════════════════════════════════
  //  15. PROCESS STEPS — staggered cascade + connector lines
  // ══════════════════════════════════════════
  const stepObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const steps = entry.target.querySelectorAll('.process-step');
        steps.forEach((step, i) => {
          setTimeout(() => step.classList.add('step-visible'), i * 180);
        });
        stepObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  const processSection = document.querySelector('.process-steps');
  if (processSection) stepObs.observe(processSection);
