// Typografie-Effekte. Ohne Plugins (eigene, barrierefreie Zerlegung: Screenreader lesen den
// Originaltext über aria-label, die Teile sind aria-hidden).
//
//   revealText('[data-reveal]')            Wörter/Buchstaben steigen aus einer Maske (beim Reinscrollen)
//   revealText('.hero h1', { by: 'chars', delay: .3, immediate: true })   sofort, z. B. nach Preloader
//   scrubHighlight('.manifest p')          Text färbt sich Wort für Wort beim Lesen ein (scrub)
//   scrollMarquee('.marquee', { speed })   riesige Zeile, läuft horizontal, Richtung folgt dem Scroll
//   scaleOnScroll('.giant')                Riesen-Headline wächst/verschiebt sich beim Scrollen
//   countUp('[data-count]')                Zahlen zählen hoch (data-count="1240" data-suffix="+")
//
// Auf Stufe "low" passiert nichts – der Text steht einfach da.
import { tier } from './quality.js';
import { gsap, ScrollTrigger, motion, velocity } from './core.js';

const $$ = (s) => (typeof s === 'string' ? [...document.querySelectorAll(s)] : s instanceof Element ? [s] : [...s]);

/** Zerlegt Text eines Elements in Wörter (und optional Buchstaben) mit Masken. Inline-Tags (em, strong, br, a) bleiben erhalten. */
export function split(el, by = 'words') {
  if (el.dataset.fxSplit) return [...el.querySelectorAll('.fx-unit')];
  el.dataset.fxSplit = by;
  if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.trim().replace(/\s+/g, ' '));
  const units = [];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
          const mask = document.createElement('span');
          mask.className = 'fx-mask';
          mask.setAttribute('aria-hidden', 'true');
          if (by === 'chars') {
            [...part].forEach((ch) => {
              const u = document.createElement('span');
              u.className = 'fx-unit'; u.textContent = ch; mask.appendChild(u); units.push(u);
            });
          } else {
            const u = document.createElement('span');
            u.className = 'fx-unit'; u.textContent = part; mask.appendChild(u); units.push(u);
          }
          frag.appendChild(mask);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
  return units;
}

export function revealText(targets, { by = 'words', delay = 0, stagger, immediate = false, start = 'top 85%' } = {}) {
  if (tier === 'low') return;
  $$(targets).forEach((el) => {
    const units = split(el, by);
    const tween = gsap.fromTo(units,
      { yPercent: 115, rotate: by === 'chars' ? 0 : 3 },
      { yPercent: 0, rotate: 0, duration: motion.dur * (by === 'chars' ? 0.9 : 1.05), ease: 'power4.out',
        stagger: stagger ?? (by === 'chars' ? 0.022 : motion.stagger), delay, paused: !immediate });
    if (!immediate) ScrollTrigger.create({ trigger: el, start, once: true, onEnter: () => tween.play() });
  });
}

export function scrubHighlight(targets, { from = 0.14, start = 'top 80%', end = 'bottom 45%' } = {}) {
  if (tier === 'low') return;
  $$(targets).forEach((el) => {
    const units = split(el, 'words');
    el.classList.add('fx-highlight');
    gsap.fromTo(units, { opacity: from }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start, end, scrub: true },
    });
  });
}

export function scrollMarquee(targets, { speed = 60, skew = true } = {}) {
  $$(targets).forEach((el) => {
    const track = el.firstElementChild;
    if (!track) return;
    // Inhalt verdoppeln für nahtlose Schleife
    track.append(...[...track.children].map((c) => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); return k; }));
    if (tier === 'low') return;
    let x = 0, dir = -1;
    gsap.ticker.add((t, dt) => {
      const v = velocity.value;
      if (Math.abs(v) > 0.3) dir = v > 0 ? -1 : 1;
      const half = track.scrollWidth / 2;
      x += dir * (speed + Math.min(Math.abs(v) * 8, 600)) * (dt / 1000);
      x = ((x % half) - half) % half;
      gsap.set(track, { x, skewX: skew ? gsap.utils.clamp(-8, 8, -v * 0.25) : 0 });
    });
  });
}

export function scaleOnScroll(targets, { from = 0.6, to = 1, xPercent = 0, start = 'top bottom', end = 'bottom top' } = {}) {
  if (tier === 'low') return;
  $$(targets).forEach((el) => {
    gsap.fromTo(el, { scale: from, xPercent: -xPercent }, {
      scale: to, xPercent, ease: 'none', scrollTrigger: { trigger: el, start, end, scrub: 1 },
    });
  });
}

export function countUp(targets, { duration = 2 } = {}) {
  $$(targets).forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const dec = (el.dataset.count.split('.')[1] || '').length;
    const fmt = (v) => v.toLocaleString(document.documentElement.lang || 'de', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (el.dataset.suffix || '');
    if (tier === 'low') { el.textContent = fmt(end); return; }
    const o = { v: 0 };
    el.textContent = fmt(0);
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: end, duration, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) }) });
  });
}
