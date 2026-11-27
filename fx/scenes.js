// Scroll-Szenen: die Bausteine, die aus einer Seite eine Geschichte machen.
//
//   diveThrough('.dive')              Gepinnt: man fliegt durch Ebenen hindurch in die Tiefe
//                                     (Fenster, Portal, Erdschichten, Wolken, Rahmen-in-Rahmen)
//   horizontalScroll('.work', '.work__track')   Gepinnt: Inhalte fahren horizontal durch
//   stackSections('.stack > section') Sektionen schieben sich übereinander, die alte sinkt zurück
//   revealImages('[data-img-reveal]') Bild öffnet sich wie ein Vorhang + Zoom + Parallax
//   parallax('[data-speed]')          Ebenen mit unterschiedlichem Tempo (data-speed="-0.3" .. "0.3")
//   colorShift('[data-theme-bg]')     Seitenfarben wechseln weich je Sektion (data-theme-bg / data-theme-fg)
//   velocitySkew('.skew')             Elemente neigen sich mit der Scroll-Geschwindigkeit
//
// Auf "low" fällt alles auf ruhige, sofort lesbare Darstellung zurück.
import { tier } from './quality.js';
import { gsap, ScrollTrigger, velocity } from './core.js';

const $$ = (s) => (typeof s === 'string' ? [...document.querySelectorAll(s)] : s instanceof Element ? [s] : [...s]);
const $ = (s, root = document) => (typeof s === 'string' ? root.querySelector(s) : s);

/**
 * Tauchfahrt. HTML:
 * <section class="dive">                       (wird gepinnt, Höhe = 100vh)
 *   <div class="dive__layer" data-depth="0">…vorderste Ebene (z. B. Fensterrahmen, Text)…</div>
 *   <div class="dive__layer" data-depth="1">…</div>
 *   <div class="dive__layer" data-depth="2">…hinterste Ebene / Ziel…</div>
 * </section>
 * Jede Ebene wächst nacheinander auf, wird durchflogen und blendet aus; die letzte bleibt stehen.
 */
export function diveThrough(section, { length = 3, scrub = 1 } = {}) {
  const el = $(section);
  if (!el) return;
  const layers = [...el.querySelectorAll('[data-depth]')].sort((a, b) => a.dataset.depth - b.dataset.depth);
  el.classList.add('fx-dive');
  if (tier === 'low') { el.classList.add('fx-static'); return; }
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: el, start: 'top top', end: `+=${length * 100}%`, pin: true, scrub, anticipatePin: 1 },
  });
  layers.forEach((layer, i) => {
    const d = +layer.dataset.depth;
    gsap.set(layer, { scale: d === 0 ? 1 : Math.pow(0.45, d), opacity: d === 0 ? 1 : 0.0, zIndex: layers.length - i });
  });
  layers.forEach((layer, i) => {
    const last = i === layers.length - 1;
    // die aktuelle Ebene fliegt am Betrachter vorbei …
    if (!last) tl.to(layer, { scale: 4.5, opacity: 0, duration: 1, ease: 'power2.in' }, i);
    // … während die nächste aus der Tiefe nachrückt
    layers.slice(i + 1).forEach((next, k) => {
      tl.to(next, { scale: Math.pow(0.45, k), opacity: k === 0 ? 1 : 0, duration: 1, ease: 'power1.inOut' }, i);
    });
  });
  return tl;
}

export function horizontalScroll(section, track, { scrub = 1 } = {}) {
  const el = $(section), tr = $(track, el);
  if (!el || !tr) return;
  if (tier === 'low') { el.classList.add('fx-static'); return; }
  const dist = () => tr.scrollWidth - el.clientWidth;
  return gsap.to(tr, {
    x: () => -dist(), ease: 'none',
    scrollTrigger: { trigger: el, start: 'top top', end: () => '+=' + dist(), pin: true, scrub, invalidateOnRefresh: true, anticipatePin: 1 },
  });
}

export function stackSections(targets) {
  if (tier === 'low') return;
  const els = $$(targets);
  els.forEach((el, i) => {
    if (i === els.length - 1) return;
    gsap.to(el, {
      scale: 0.9, opacity: 0.35, borderRadius: 24, ease: 'none',
      scrollTrigger: { trigger: els[i + 1], start: 'top bottom', end: 'top top', scrub: true },
    });
    ScrollTrigger.create({ trigger: el, start: () => (el.offsetHeight < innerHeight ? 'top top' : 'bottom bottom'), pin: true, pinSpacing: false });
  });
}

/** <figure data-img-reveal><img …></figure>  – optional data-img-reveal="left|up|circle" */
export function revealImages(targets) {
  $$(targets).forEach((fig) => {
    const img = fig.querySelector('img, video, canvas, picture');
    fig.classList.add('fx-img');
    if (tier === 'low') return;
    const mode = fig.dataset.imgReveal || 'up';
    const from = { up: 'inset(100% 0% 0% 0%)', left: 'inset(0% 100% 0% 0%)', circle: 'circle(0% at 50% 50%)' }[mode];
    const to = mode === 'circle' ? 'circle(75% at 50% 50%)' : 'inset(0% 0% 0% 0%)';
    gsap.fromTo(fig, { clipPath: from }, { clipPath: to, duration: 1.4, ease: 'power4.inOut',
      scrollTrigger: { trigger: fig, start: 'top 85%', once: true } });
    if (img) {
      gsap.fromTo(img, { scale: 1.35 }, { scale: 1.12, duration: 1.8, ease: 'power3.out',
        scrollTrigger: { trigger: fig, start: 'top 85%', once: true } });
      gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  });
}

export function parallax(targets = '[data-speed]') {
  if (tier === 'low') return;
  $$(targets).forEach((el) => {
    const s = parseFloat(el.dataset.speed) || 0.2;
    gsap.fromTo(el, { yPercent: -s * 100 }, { yPercent: s * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
}

/** Setzt --page-bg / --page-fg auf <html>, sobald eine Sektion die Bildschirmmitte erreicht. */
export function colorShift(targets = '[data-theme-bg]') {
  const root = document.documentElement;
  $$(targets).forEach((sec) => {
    const apply = () => gsap.to(root, {
      '--page-bg': sec.dataset.themeBg, '--page-fg': sec.dataset.themeFg || getComputedStyle(root).getPropertyValue('--page-fg'),
      duration: tier === 'low' ? 0 : 0.9, ease: 'power2.out', overwrite: true,
    });
    ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onEnter: apply, onEnterBack: apply });
  });
}

export function velocitySkew(targets, { max = 6 } = {}) {
  if (tier === 'low') return;
  const els = $$(targets);
  const setters = els.map((el) => gsap.quickTo(el, 'skewY', { duration: 0.5, ease: 'power3.out' }));
  gsap.ticker.add(() => {
    const v = gsap.utils.clamp(-max, max, velocity.value * 0.18);
    setters.forEach((s) => s(v));
  });
}
