// Regie: „Ein Blatt Papier lernt fliegen“. Reihenfolge = Reihenfolge auf der Seite.
import { tier, webgl, pick } from './fx/quality.js';
import { gsap, ScrollTrigger, initSmoothScroll } from './fx/core.js';
import { createShaderBackdrop } from './fx/shader-backdrop.js';
import { createParticleMorph } from './fx/particle-morph.js';
import { revealText, scrubHighlight, scrollMarquee, countUp } from './fx/text.js';
import { revealImages, colorShift, parallax } from './fx/scenes.js';
import { initCursor } from './fx/cursor.js';
import { runPreloader } from './fx/preloader.js';
import { paperShape, planeShape, skyShape, viewWidth } from './js/shapes.js';
import { initLens } from './js/lens.js';
import { initChat } from './js/chat.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const NIGHT = '#070d1a', CREAM = '#f1eadc';

// Sprache merken (nur lokal im Browser)
$$('[data-lang]').forEach((a) => a.addEventListener('click', () => { try { localStorage.setItem('bk-lang', a.dataset.lang); } catch {} }));

initSmoothScroll();
initCursor();

// 1 · HERO — Meer bei Tag: Seide in Himmelblau, Meerblau und Creme
createShaderBackdrop($('.hero__bg'), {
  look: 'silk', colors: ['#5f87ab', '#9dbad3', '#d9e3e6', '#f1eadc'], intensity: 0.85, grain: 0.05,
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top' },
});
if (tier !== 'low') {
  gsap.to('.hero__title', { yPercent: 28, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__line--it', { xPercent: -6, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
}

// 3 · STORY — Papier → Flieger → Sterne → Code
const stage = $('.story__particles');
const count = pick({ high: 36000, mid: 14000, low: 0 });
let particlesReady = Promise.resolve();
if (count && webgl) {
  const w = viewWidth(stage);
  particlesReady = createParticleMorph(stage, {
    count,
    size: tier === 'high' ? 2.6 : 3.2,
    shapes: [
      { type: 'points', positions: paperShape(count, w) },
      { type: 'points', positions: planeShape(count, w) },
      { type: 'points', positions: skyShape(count, w) },
      { type: 'text', value: '</>', font: 'italic 400 300px Display', fit: 0.62 },
    ],
    colors: [CREAM, '#9dbad3'],
    rotate: 0.12,
    scrollTrigger: { trigger: '.story', start: 'top top', end: 'bottom bottom' },
  });
}
if (tier !== 'low' && webgl) {
  const caps = $$('.story__captions li');
  const num = $('.story__count b');
  const bar = $('.story__bar i');
  let last = 0;
  ScrollTrigger.create({
    trigger: '.story', start: 'top top', end: 'bottom bottom',
    onUpdate: (s) => {
      gsap.set(bar, { scaleX: s.progress });
      const i = Math.min(caps.length - 1, Math.round(s.progress * (caps.length - 1)));
      if (i === last) return;
      last = i;
      num.textContent = String(i + 1).padStart(2, '0');
      caps.forEach((c, k) => gsap.to(c, { opacity: k === i ? 1 : 0, yPercent: k === i ? 0 : k < i ? -40 : 40, duration: 0.7, overwrite: true }));
    },
  });
}

// 2, 4 · Texte und Bilder
scrollMarquee('.marquee', { speed: 45 });
scrubHighlight('.manifest__q', { from: 0.12 });
scrubHighlight('.about__text', { from: 0.18 });
revealText('[data-reveal]');
revealImages('[data-img-reveal]');
parallax('[data-speed]');
countUp('[data-count]');
initLens($('.lens'));

// 5 · INTERESSEN — Lichtbänder am Nachthimmel
createShaderBackdrop($('.interests__bg'), {
  look: 'aurora', colors: [NIGHT, '#10233f', '#3d6f96', '#9dbad3'], intensity: 0.7,
  scrollTrigger: { trigger: '.interests', start: 'top bottom', end: 'bottom top' },
});
if (tier !== 'low') {
  $$('.int__row').forEach((row) => {
    gsap.from(row.children, { yPercent: 60, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out',
      scrollTrigger: { trigger: row, start: 'top 88%', once: true } });
  });
}

// 6 · WEG — die Level-Zahlen füllen sich beim Scrollen mit Meerblau
if (tier !== 'low') {
  $$('.jr__row').forEach((row) => {
    gsap.fromTo(row.querySelector('.jr__num'), { '--fill': '0%' }, { '--fill': '100%', ease: 'none',
      scrollTrigger: { trigger: row, start: 'top 80%', end: 'center 45%', scrub: true } });
    gsap.from(row.querySelector('.jr__body').children, { yPercent: 40, opacity: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out',
      scrollTrigger: { trigger: row, start: 'top 75%', once: true } });
  });
}

// 7 · Projektliste — Vorschau folgt der Maus (nur Desktop)
if (tier === 'high') {
  $$('.pl__row').forEach((row) => {
    const prev = row.querySelector('.pl__prev');
    const x = gsap.quickTo(prev, 'left', { duration: 0.5, ease: 'power3.out' });
    const y = gsap.quickTo(prev, 'top', { duration: 0.5, ease: 'power3.out' });
    row.addEventListener('pointerenter', (e) => { gsap.set(prev, { left: e.clientX + 180, top: e.clientY }); row.classList.add('is-hover'); });
    row.addEventListener('pointermove', (e) => { x(e.clientX + 180); y(e.clientY); });
    row.addEventListener('pointerleave', () => row.classList.remove('is-hover'));
  });
}

// 8 · Demo-Chat
initChat($('.chat'));

// 9 · KONTAKT — Höhenlinien, Nacht
createShaderBackdrop($('.contact__bg'), {
  look: 'contour', colors: [NIGHT, '#0c1a30', '#1f4566', '#9dbad3'], intensity: 0.6,
  scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top' },
});
if (tier !== 'low') {
  gsap.fromTo('.footer__giant', { yPercent: 60 }, { yPercent: 0, ease: 'none',
    scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
}

// Kapitel: Tag → Nacht → Morgen → Nacht
colorShift('[data-theme-bg]');

// Auftritt
if (tier !== 'low') gsap.set('.hero__horizon', { scaleX: 0 });
await runPreloader({ word: 'Betül Kılıç — 2026', wait: [particlesReady], bg: NIGHT, color: CREAM });
revealText('.hero__line', { by: 'chars', immediate: true, stagger: 0.05 });
revealText('.hero__lead', { immediate: true, delay: 0.45 });
if (tier !== 'low') {
  gsap.to('.hero__horizon', { scaleX: 1, duration: 1.8, ease: 'power3.inOut', delay: 0.2 });
  gsap.from(['.hero__top > span:not(.hero__horizon)', '.hero__tag', '.hero__scroll'], { opacity: 0, y: 14, duration: 1, stagger: 0.08, delay: 0.5 });
  gsap.from('.nav', { opacity: 0, duration: 1, delay: 0.6 });
}
ScrollTrigger.refresh();
