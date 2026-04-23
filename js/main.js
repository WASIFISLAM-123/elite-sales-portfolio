  // ─── NAV SCROLL ───
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ─── MOBILE MENU ───
  function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('open');
  }

  // ─── SCROLL REVEAL ───
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children in grids
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ─── COUNTER ANIMATION ───
  function animateCount(el) {
    const target = parseInt(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(eased * target);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  const resultsSection = document.getElementById('results');
  if (resultsSection) counterObserver.observe(resultsSection);

  // ─── FORM ───
  function submitForm(e) {
    e.preventDefault();
    const btn = e.target.closest('button') || e.target;
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
    }, 1400);
  }

  // ─── HERO STATS ANIMATE ON LOAD ───
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
    }, 600);
  });