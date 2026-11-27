// Preloader: großer Zähler 0–100 an echtem Ladefortschritt (Schriften, Bilder, eigene Promises),
// dann öffnet sich ein Vorhang in zwei Hälften und gibt den Hero frei.
//
//   import { runPreloader } from './fx/preloader.js';
//   await runPreloader({ word: 'NOVA', wait: [particlesReady] });
//   revealText('.hero h1', { by: 'chars', immediate: true });   // Hero-Auftritt direkt danach
//
// Zeigt sich höchstens ~1x pro Sitzung lang (danach Kurzversion), damit Wiederkehrer nicht warten.
// "low": kein Preloader.
import { tier } from './quality.js';
import { gsap, lockScroll } from './core.js';

export async function runPreloader({ word = '', wait = [], minTime = 1.6, color, bg } = {}) {
  if (tier === 'low') return;
  let seen = false;
  try { seen = sessionStorage.getItem('fx-preloaded') === '1'; sessionStorage.setItem('fx-preloaded', '1'); } catch {}

  const el = document.createElement('div');
  el.className = 'fx-preloader';
  if (bg) el.style.setProperty('--pl-bg', bg);
  if (color) el.style.setProperty('--pl-fg', color);
  el.innerHTML = `<div class="fx-preloader__half fx-preloader__half--top"></div>
    <div class="fx-preloader__half fx-preloader__half--bottom"></div>
    <div class="fx-preloader__inner"><span class="fx-preloader__word"></span>
    <span class="fx-preloader__count" aria-live="off">0</span></div>`;
  el.querySelector('.fx-preloader__word').textContent = word;
  el.setAttribute('aria-hidden', 'true');
  document.body.appendChild(el);
  lockScroll(true);

  const count = el.querySelector('.fx-preloader__count');
  const imgs = [...document.images].filter((i) => !i.complete && i.loading !== 'lazy');
  const tasks = [document.fonts?.ready, ...imgs.map((i) => i.decode().catch(() => {})), ...wait].filter(Boolean);
  let done = 0;
  const shown = { v: 0 };
  const real = () => (tasks.length ? done / tasks.length : 1);
  tasks.forEach((p) => Promise.resolve(p).finally(() => done++));

  const min = seen ? 0.4 : minTime;
  const t0 = performance.now();
  await new Promise((resolve) => {
    const tick = () => {
      const time = Math.min(1, (performance.now() - t0) / 1000 / min);
      const target = Math.min(real(), time) * 100;
      shown.v += (target - shown.v) * 0.12;
      count.textContent = Math.round(shown.v);
      if (shown.v > 99.5) { count.textContent = '100'; gsap.ticker.remove(tick); resolve(); }
    };
    gsap.ticker.add(tick);
    setTimeout(() => { shown.v = 100; }, 8000); // Notbremse: nie länger als 8 s
  });

  const tl = gsap.timeline();
  tl.to(el.querySelector('.fx-preloader__inner'), { yPercent: -30, opacity: 0, duration: 0.6, ease: 'power3.in' })
    .to(el.querySelector('.fx-preloader__half--top'), { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, '-=0.1')
    .to(el.querySelector('.fx-preloader__half--bottom'), { yPercent: 100, duration: 1.1, ease: 'power4.inOut' }, '<');
  // Hero darf schon während der Vorhang aufgeht starten:
  await new Promise((r) => tl.call(r, [], '-=0.75'));
  tl.eventCallback('onComplete', () => { el.remove(); lockScroll(false); });
}
