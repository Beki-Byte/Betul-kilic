// Eigener Mauszeiger + magnetische Elemente. Nur auf "high" mit echter Maus.
//
//   initCursor();          Punkt + nachziehender Ring (mix-blend-mode: difference)
//   HTML-Hooks:
//     data-cursor="Ansehen"  -> Ring wird groß und zeigt den Text (für Bilder/Projekte)
//     data-cursor="-"        -> Ring verschwindet (z. B. über Canvas/Formularen)
//     a, button              -> Ring wächst leicht
//     data-magnetic          -> Element zieht sich zur Maus (Buttons, Icons); data-magnetic="0.5" = Stärke
//
// Touch-Geräte: nichts davon – stattdessen echte :active-Zustände im CSS gestalten.
import { tier, finePointer } from './quality.js';
import { gsap } from './core.js';

export function initCursor() {
  if (tier !== 'high' || !finePointer) return null;
  document.documentElement.classList.add('fx-has-cursor');
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  const label = document.createElement('span');
  dot.className = 'fx-cursor-dot';
  ring.className = 'fx-cursor-ring';
  label.className = 'fx-cursor-label';
  ring.appendChild(label);
  [dot, ring].forEach((n) => { n.setAttribute('aria-hidden', 'true'); document.body.appendChild(n); });

  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...pos };
  const setDot = { x: gsap.quickSetter(dot, 'x', 'px'), y: gsap.quickSetter(dot, 'y', 'px') };
  const setRing = { x: gsap.quickSetter(ring, 'x', 'px'), y: gsap.quickSetter(ring, 'y', 'px') };

  window.addEventListener('pointermove', (e) => {
    pos.x = e.clientX; pos.y = e.clientY;
    setDot.x(pos.x); setDot.y(pos.y);
  }, { passive: true });
  gsap.ticker.add(() => {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    setRing.x(ringPos.x); setRing.y(ringPos.y);
  });

  const state = (s, text = '') => { ring.dataset.state = s; label.textContent = text; };
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, [role="button"], input, textarea, select, label');
    if (!t) return state('');
    const c = t.getAttribute('data-cursor');
    if (c === '-') return state('hidden');
    if (c) return state('label', c);
    if (t.matches('input, textarea, select')) return state('hidden');
    state('hover');
  });
  document.addEventListener('pointerdown', () => ring.classList.add('is-down'));
  document.addEventListener('pointerup', () => ring.classList.remove('is-down'));
  document.addEventListener('mouseleave', () => state('hidden'));

  initMagnetic();
  return { dot, ring };
}

export function initMagnetic(selector = '[data-magnetic]') {
  if (tier !== 'high' || !finePointer) return;
  document.querySelectorAll(selector).forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic) || 0.35;
    const inner = el.querySelector('[data-magnetic-inner]');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const ixTo = inner && gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const iyTo = inner && gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength); yTo(dy * strength);
      if (inner) { ixTo(dx * strength * 0.5); iyTo(dy * strength * 0.5); }
    });
    el.addEventListener('pointerleave', () => { xTo(0); yTo(0); if (inner) { ixTo(0); iyTo(0); } });
  });
}
