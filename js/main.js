(() => {
  'use strict';

  const WHATSAPP_NUMBER = '5594974002743';

  const MESSAGES = {
    hero: 'Olá! Conheci a VitaBem pelo site e gostaria de saber mais sobre os atendimentos.',
    atendimentos: 'Olá! Gostaria de saber qual atendimento da VitaBem pode ser mais adequado para mim.',
    comoFunciona: 'Olá! Gostaria de agendar minha avaliação com a VitaBem.',
    local: 'Olá! Gostaria de consultar disponibilidade de atendimento da VitaBem.',
    final: 'Olá! Gostaria de falar com a equipe VitaBem sobre avaliações e protocolos.',
    header: 'Olá! Gostaria de agendar um atendimento com a VitaBem.',
    floating: 'Olá! Tenho uma dúvida sobre os atendimentos da VitaBem.'
  };

  function waLink(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function setWaLinks() {
    const map = [
      ['ctaHeader', MESSAGES.header],
      ['ctaHeroPrimary', MESSAGES.hero],
      ['ctaAtendimentos', MESSAGES.atendimentos],
      ['ctaComoFunciona', MESSAGES.comoFunciona],
      ['ctaLocal1', MESSAGES.local],
      ['ctaLocal2', MESSAGES.local],
      ['ctaFinal', MESSAGES.final],
      ['floatingWhatsapp', MESSAGES.floating],
      ['discreetCta', MESSAGES.floating]
    ];
    map.forEach(([id, msg]) => {
      const el = document.getElementById(id);
      if (el) el.href = waLink(msg);
    });
  }

  // ---------- Header scroll state ----------
  function initHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ---------- Mobile menu ----------
  function initMenu() {
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('mainNav');
    if (!toggle || !nav) return;

    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // ---------- Scroll reveal ----------
  function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || items.length === 0) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    items.forEach((el, i) => {
      el.style.setProperty('--i', i % 8);
      observer.observe(el);
    });
  }

  // ---------- FAQ accordion ----------
  function initAccordion() {
    const accordion = document.getElementById('accordion');
    if (!accordion) return;
    const triggers = accordion.querySelectorAll('.acc-trigger');

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const panel = trigger.nextElementSibling;
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        triggers.forEach((t) => {
          if (t !== trigger) {
            t.setAttribute('aria-expanded', 'false');
            t.nextElementSibling.style.maxHeight = null;
          }
        });

        trigger.setAttribute('aria-expanded', String(!isOpen));
        panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
      });
    });
  }

  // ---------- Discreet WhatsApp prompt ----------
  function initDiscreetPrompt() {
    const prompt = document.getElementById('discreetPrompt');
    const closeBtn = document.getElementById('discreetClose');
    if (!prompt) return;

    let shown = false;
    let dismissed = false;

    const maybeShow = () => {
      if (shown || dismissed) return;
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? scrolled / max : 0;
      if (pct >= 0.35) {
        shown = true;
        prompt.classList.add('is-visible');
      }
    };

    window.addEventListener('scroll', maybeShow, { passive: true });

    closeBtn?.addEventListener('click', () => {
      dismissed = true;
      prompt.classList.remove('is-visible');
    });
  }

  // ---------- Subtle hero parallax ----------
  function initHeroParallax() {
    const frame = document.getElementById('heroFrame');
    if (!frame) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || window.matchMedia('(max-width: 979px)').matches) return;

    let raf = null;
    window.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        frame.style.transform = `translate(${x}px, ${y}px)`;
        raf = null;
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setWaLinks();
    initHeader();
    initMenu();
    initReveal();
    initAccordion();
    initDiscreetPrompt();
    initHeroParallax();
  });
})();
