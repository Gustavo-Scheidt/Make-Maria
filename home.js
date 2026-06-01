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
    const x    = Math.random() * 100;
    const dur  = Math.random() * 12 + 8;
    const del  = Math.random() * 12;
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

  // Revelar itens do hero imediatamente
  const heroReveal = document.querySelectorAll('.hero .reveal');
  setTimeout(() => {
    heroReveal.forEach(el => el.classList.add('visible'));
  }, 100);

  /* ─────────────────────────────────────────
     3. MENU DRAWER
  ───────────────────────────────────────── */
  const menuBtn        = document.getElementById('menuBtn');
  const navDrawer      = document.getElementById('navDrawer');
  const drawerClose    = document.getElementById('drawerClose');
  const drawerOverlay  = document.getElementById('drawerOverlay');

  function openDrawer() {
    navDrawer.classList.add('open');
    drawerOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Animar linhas do hambúrguer
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  }

  function closeDrawer() {
    navDrawer.classList.remove('open');
    drawerOverlay.classList.remove('show');
    document.body.style.overflow = '';
    const spans = menuBtn.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  menuBtn.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Fechar ao clicar em link do menu
  navDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* ─────────────────────────────────────────
     4. CARROSSEL DE PERFUMES
  ───────────────────────────────────────── */
  const carousel   = document.getElementById('carousel');
  const dotsWrap   = document.getElementById('carouselDots');
  const prevBtn    = document.getElementById('prevBtn');
  const nextBtn    = document.getElementById('nextBtn');
  const cards      = carousel.querySelectorAll('.perfume-card');
  const CARD_COUNT = cards.length;
  let currentIndex = 0;

  // Criar dots
  for (let i = 0; i < CARD_COUNT; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    dot.setAttribute('aria-label', `Perfume ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }

  function updateDots(idx) {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function updateActiveCard(idx) {
    cards.forEach((c, i) => {
      c.classList.toggle('active-card', i === idx);
    });
  }

  function goTo(idx) {
    currentIndex = Math.max(0, Math.min(idx, CARD_COUNT - 1));
    const cardWidth  = cards[0].offsetWidth;
    const gap        = 16;
    const paddingL   = 28;
    const scrollTo   = currentIndex * (cardWidth + gap);
    carousel.scrollTo({ left: scrollTo, behavior: 'smooth' });
    updateDots(currentIndex);
    updateActiveCard(currentIndex);
  }

  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // Detectar scroll manual e atualizar dots
  let scrollTimeout;
  carousel.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const cardWidth = cards[0].offsetWidth + 16;
      const idx = Math.round(carousel.scrollLeft / cardWidth);
      if (idx !== currentIndex) {
        currentIndex = idx;
        updateDots(currentIndex);
        updateActiveCard(currentIndex);
      }
    }, 80);
  });

  // Drag/swipe no desktop
  let isDragging = false, startX = 0, scrollStart = 0;

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

  carousel.addEventListener('mouseup', () => stopDrag());
  carousel.addEventListener('mouseleave', () => stopDrag());

  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;
    carousel.classList.remove('grabbing');
    // Snap ao card mais próximo
    const cardWidth = cards[0].offsetWidth + 16;
    const idx = Math.round(carousel.scrollLeft / cardWidth);
    goTo(idx);
  }

  // Auto-play do carrossel
  let autoPlay = setInterval(() => {
    const next = (currentIndex + 1) % CARD_COUNT;
    goTo(next);
  }, 3500);

  // Pausar auto-play ao interagir
  carousel.addEventListener('touchstart', () => clearInterval(autoPlay), { passive: true });
  carousel.addEventListener('mousedown', () => clearInterval(autoPlay));
  prevBtn.addEventListener('click', () => { clearInterval(autoPlay); });
  nextBtn.addEventListener('click', () => { clearInterval(autoPlay); });

  // Inicializar
  updateActiveCard(0);

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
      const rect   = el.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 2;
      const x      = e.clientX - rect.left - size / 2;
      const y      = e.clientY - rect.top  - size / 2;

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

  // Adicionar estilo de ripple globalmente
  const style = document.createElement('style');
  style.textContent = `@keyframes ripple-anim { to { transform: scale(1); opacity: 0; } }`;
  document.head.appendChild(style);

  document.querySelectorAll('.btn-primary, .btn-whatsapp, .card-btn').forEach(addRipple);

  /* ─────────────────────────────────────────
     7. ANIMAÇÃO NO ÍCONE DA BORBOLETA (navbar)
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
        butterfly.style.animation  = '';
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
     9. LOADING ANIMADO (splash screen)
  ───────────────────────────────────────── */
  const splash = document.createElement('div');
  splash.id = 'splash';
  splash.style.cssText = `
    position: fixed; inset: 0; background: #fdf8f6;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    z-index: 9999; transition: opacity 0.6s, transform 0.6s;
  `;
  // ✏️ MODIFICADO: logo no splash screen — troque "imagens/logo.png" pela sua imagem
  splash.innerHTML = `
    <img src="img/logo.png" style="width:330px; margin-bottom:16px;" alt="Logo Make Maria" />
    <span style="font-family:'Cormorant Garamond',serif; font-size:28px; color:#1a1a2e;">Make Maria</span>
    <span style="font-family:'DM Sans',sans-serif; font-size:11px; letter-spacing:3px; color:#7EC8E3; margin-top:4px;">COSMÉTICOS </span>
  `;
  document.body.prepend(splash);

  window.addEventListener('load', () => {
    setTimeout(() => {
      splash.style.opacity = '0';
      splash.style.transform = 'scale(1.05)';
      setTimeout(() => splash.remove(), 600);
    }, 800);
  });

});