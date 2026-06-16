/* ============================================================
   MAKE MARIA COSMÉTICOS — home.js
   Animações: partículas, scroll reveal, carrossel, menu drawer
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. PARTÍCULAS FLUTUANTES
  ───────────────────────────────────────── */
  const particlesContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 18;
  const COLORS = [
    'rgba(232,160,176,0.5)',
    'rgba(126,200,227,0.4)',
    'rgba(255,255,255,0.6)',
    'rgba(192,96,112,0.3)',
    'rgba(74,154,184,0.3)',
  ];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size = Math.random() * 8 + 3;
    const x = Math.random() * 100;
    const dur = Math.random() * 12 + 8;
    const del = Math.random() * 12;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      background: ${color};
      animation-duration: ${dur}s;
      animation-delay: ${del}s;
    `;

    particlesContainer.appendChild(p);
  }

  /* ─────────────────────────────────────────
     2. SCROLL REVEAL
  ───────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  const heroReveal = document.querySelectorAll('.hero .reveal');
  setTimeout(() => {
    heroReveal.forEach(el => el.classList.add('visible'));
  }, 100);

  /* ─────────────────────────────────────────
     3. MENU DRAWER
  ───────────────────────────────────────── */
  const menuBtn = document.getElementById('menuBtn');
  const navDrawer = document.getElementById('navDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');

  function openDrawer() {
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('show');
    document.body.style.overflow = '';

    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }

  menuBtn.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  navDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ─────────────────────────────────────────
     4. CARROSSEL DE PRODUTOS
     Funciona para: Dia dos Namorados + Produtos Mais Vendidos
  ───────────────────────────────────────── */
  function initCarousel(config) {
    const carousel = document.getElementById(config.carouselId);
    const dotsWrap = document.getElementById(config.dotsId);
    const prevBtn = document.getElementById(config.prevBtnId);
    const nextBtn = document.getElementById(config.nextBtnId);

    if (!carousel || !dotsWrap || !prevBtn || !nextBtn) return;

    const cards = carousel.querySelectorAll('.perfume-card');
    const CARD_COUNT = cards.length;

    if (CARD_COUNT === 0) return;

    let currentIndex = 0;
    let autoPlay;

    dotsWrap.innerHTML = '';

    for (let i = 0; i < CARD_COUNT; i++) {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      dot.setAttribute('aria-label', `Produto ${i + 1}`);

      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => {
        clearInterval(autoPlay);
        goTo(i);
      });

      dotsWrap.appendChild(dot);
    }

    function updateDots(idx) {
      dotsWrap.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === idx);
      });
    }

    function updateActiveCard(idx) {
      cards.forEach((card, i) => {
        card.classList.toggle('active-card', i === idx);
      });
    }

    function goTo(idx) {
      currentIndex = Math.max(0, Math.min(idx, CARD_COUNT - 1));

      const cardWidth = cards[0].offsetWidth;
      const gap = 16;
      const scrollTo = currentIndex * (cardWidth + gap);

      carousel.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });

      updateDots(currentIndex);
      updateActiveCard(currentIndex);
    }

    prevBtn.addEventListener('click', () => {
      clearInterval(autoPlay);
      goTo(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
      clearInterval(autoPlay);
      goTo(currentIndex + 1);
    });

    let scrollTimeout;

    carousel.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const cardWidth = cards[0].offsetWidth + 16;
        const idx = Math.round(carousel.scrollLeft / cardWidth);

        if (idx !== currentIndex) {
          currentIndex = Math.max(0, Math.min(idx, CARD_COUNT - 1));
          updateDots(currentIndex);
          updateActiveCard(currentIndex);
        }
      }, 80);
    });

    let isDragging = false;
    let startX = 0;
    let scrollStart = 0;

    carousel.addEventListener('mousedown', e => {
      isDragging = true;
      startX = e.pageX;
      scrollStart = carousel.scrollLeft;
      carousel.classList.add('grabbing');
    });

    carousel.addEventListener('mousemove', e => {
      if (!isDragging) return;
      carousel.scrollLeft = scrollStart - (e.pageX - startX);
    });

    carousel.addEventListener('mouseup', stopDrag);
    carousel.addEventListener('mouseleave', stopDrag);

    function stopDrag() {
      if (!isDragging) return;

      isDragging = false;
      carousel.classList.remove('grabbing');

      const cardWidth = cards[0].offsetWidth + 16;
      const idx = Math.round(carousel.scrollLeft / cardWidth);

      goTo(idx);
    }

    autoPlay = setInterval(() => {
      const next = (currentIndex + 1) % CARD_COUNT;
      goTo(next);
    }, 3500);

    carousel.addEventListener('touchstart', () => {
      clearInterval(autoPlay);
    }, { passive: true });

    carousel.addEventListener('mousedown', () => {
      clearInterval(autoPlay);
    });

    updateActiveCard(0);
  }

  initCarousel({
  carouselId: 'carouselCopa',
  dotsId: 'carouselDotsCopa',
  prevBtnId: 'prevBtnCopa',
  nextBtnId: 'nextBtnCopa'
});

  initCarousel({
    carouselId: 'carousel',
    dotsId: 'carouselDots',
    prevBtnId: 'prevBtn',
    nextBtnId: 'nextBtn'
  });

  /* ─────────────────────────────────────────
     5. EFEITO PARALLAX SUAVE NO HERO
  ───────────────────────────────────────── */
  const heroBg = document.querySelector('.hero-bg-blur');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (heroBg) {
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });

  /* ─────────────────────────────────────────
     6. RIPPLE NOS BOTÕES
  ───────────────────────────────────────── */
  function addRipple(el) {
    el.style.position = 'relative';
    el.style.overflow = 'hidden';

    el.addEventListener('click', function(e) {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const ripple = document.createElement('span');

      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple-anim 0.5s ease-out forwards;
        pointer-events: none;
      `;

      el.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  const style = document.createElement('style');
  style.textContent = `@keyframes ripple-anim { to { transform: scale(1); opacity: 0; } }`;
  document.head.appendChild(style);

  document.querySelectorAll('.btn-primary, .btn-whatsapp, .card-btn').forEach(addRipple);

  /* ─────────────────────────────────────────
     7. ANIMAÇÃO NO ÍCONE DA BORBOLETA
  ───────────────────────────────────────── */
  const butterfly = document.querySelector('.butterfly');

  if (butterfly) {
    butterfly.addEventListener('click', () => {
      butterfly.style.animation = 'none';
      butterfly.style.transform = 'scale(1.3) rotate(15deg)';
      butterfly.style.transition = 'transform 0.3s';

      setTimeout(() => {
        butterfly.style.transform = '';
        butterfly.style.transition = '';
        butterfly.style.animation = '';
      }, 400);
    });
  }

  /* ─────────────────────────────────────────
     8. HIGHLIGHT ATIVO NA NAVBAR AO ROLAR
  ───────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-drawer a');

  const navObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${entry.target.id}`
              ? 'var(--rose-deep)'
              : '';
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => navObserver.observe(s));

  /* ─────────────────────────────────────────
     9. LOADING ANIMADO
  ───────────────────────────────────────── */
  const splashStyle = document.createElement('style');

  splashStyle.textContent = `
    #splash {
      position: fixed; inset: 0; background: #fdf8f6;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      z-index: 9999; transition: opacity 0.6s, transform 0.6s;
    }
    .splash-butterfly {
      animation: splash-land 2.4s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    @keyframes splash-land {
      0%   { transform: translateY(-180px) rotate(-12deg); opacity: 0; }
      65%  { transform: translateY(8px) rotate(2deg); opacity: 1; }
      83%  { transform: translateY(-4px) rotate(-1deg); }
      100% { transform: translateY(0) rotate(0deg); opacity: 1; }
    }
    .splash-wing-left {
      transform-box: fill-box;
      transform-origin: right center;
      animation: splash-flap-left 2s ease-in-out infinite;
    }
    .splash-wing-right {
      transform-box: fill-box;
      transform-origin: left center;
      animation: splash-flap-right 2s ease-in-out infinite;
    }
    @keyframes splash-flap-left {
      0%,100% { transform: scaleX(1); }
      50% { transform: scaleX(0.25); }
    }
    @keyframes splash-flap-right {
      0%,100% { transform: scaleX(1); }
      50% { transform: scaleX(0.25); }
    }
    .splash-brand {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 28px;
      color: #1a1a2e;
      letter-spacing: 2px;
      margin-top: 18px;
      opacity: 0;
      animation: splash-fadein 0.7s 2.2s forwards;
    }
    .splash-sub {
      font-family: 'DM Sans', sans-serif;
      font-size: 11px;
      letter-spacing: 4px;
      color: #7EC8E3;
      margin-top: 5px;
      opacity: 0;
      animation: splash-fadein 0.7s 2.5s forwards;
    }
    @keyframes splash-fadein {
      to { opacity: 1; }
    }
  `;

  document.head.appendChild(splashStyle);

  const splash = document.createElement('div');
  splash.id = 'splash';

  splash.innerHTML = `
    <div class="splash-butterfly">
      <svg width="160" height="130" viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg">
        <g class="splash-wing-left">
          <path d="M72,52 C68,44 58,28 42,18 C30,10 14,10 8,20 C2,30 10,44 24,50 C38,56 60,54 72,52Z"
                fill="none" stroke="#1a1a2e" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M72,52 C60,44 36,30 16,26" fill="none" stroke="#1a1a2e" stroke-width="0.5" stroke-linecap="round" opacity="0.4"/>
          <path d="M72,52 C58,48 40,42 24,46" fill="none" stroke="#1a1a2e" stroke-width="0.5" stroke-linecap="round" opacity="0.3"/>
        </g>
        <g class="splash-wing-right">
          <path d="M88,52 C92,44 102,28 118,18 C130,10 146,10 152,20 C158,30 150,44 136,50 C122,56 100,54 88,52Z"
                fill="none" stroke="#1a1a2e" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M88,52 C100,44 124,30 144,26" fill="none" stroke="#1a1a2e" stroke-width="0.5" stroke-linecap="round" opacity="0.4"/>
          <path d="M88,52 C102,48 120,42 136,46" fill="none" stroke="#1a1a2e" stroke-width="0.5" stroke-linecap="round" opacity="0.3"/>
        </g>
        <g class="splash-wing-left">
          <path d="M72,58 C66,66 50,82 32,82 C18,82 10,72 16,62 C22,54 46,54 72,58Z"
                fill="none" stroke="#1a1a2e" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M72,58 C58,64 38,72 24,70" fill="none" stroke="#1a1a2e" stroke-width="0.5" stroke-linecap="round" opacity="0.3"/>
        </g>
        <g class="splash-wing-right">
          <path d="M88,58 C94,66 110,82 128,82 C142,82 150,72 144,62 C138,54 114,54 88,58Z"
                fill="none" stroke="#1a1a2e" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M88,58 C102,64 122,72 136,70" fill="none" stroke="#1a1a2e" stroke-width="0.5" stroke-linecap="round" opacity="0.3"/>
        </g>
        <path d="M80,30 C78,40 77,50 78,68 C78.5,74 80,78 80,78 C80,78 81.5,74 82,68 C83,50 82,40 80,30Z" fill="#1a1a2e"/>
        <circle cx="80" cy="28" r="3.5" fill="#1a1a2e"/>
        <path d="M79,25 C75,17 66,10 62,6" stroke="#1a1a2e" stroke-width="0.9" fill="none" stroke-linecap="round"/>
        <circle cx="62" cy="6" r="1.8" fill="#1a1a2e"/>
        <path d="M81,25 C85,17 94,10 98,6" stroke="#1a1a2e" stroke-width="0.9" fill="none" stroke-linecap="round"/>
        <circle cx="98" cy="6" r="1.8" fill="#1a1a2e"/>
      </svg>
    </div>
    <span class="splash-brand">Make Maria</span>
    <span class="splash-sub">COSMÉTICOS</span>
  `;

  document.body.prepend(splash);

  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.transform = 'scale(1.05)';

      setTimeout(() => splash.remove(), 600);
    }, 3800);
  });

});

document.querySelector('.btn-reviews')?.addEventListener('click', function(e) {
  const btn = this;
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');

  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);

  // preenche o botão
  btn.style.background = 'var(--blue)';
  btn.style.borderColor = 'var(--blue)';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.style.background = '';
    btn.style.borderColor = '';
    btn.style.color = '';
  }, 600);
});