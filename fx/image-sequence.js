// Bildsequenz, die beim Scrollen wie ein Video abläuft (Apple-Produktseiten-Effekt).
// Quelle: Einzelbilder (z. B. aus einem Video mit ffmpeg erzeugt – siehe references/effects.md).
//
//   createImageSequence(document.querySelector('.seq'), {
//     frames: 120, src: (i) => `frames/f${String(i + 1).padStart(3, '0')}.webp`,
//     scrollTrigger: { trigger: '.seq', start: 'top top', end: '+=250%', pin: true, scrub: 0.5 },
//   });
//
// Lädt zuerst jedes 8. Bild (schnell grob abspielbar), dann den Rest. Zeichnet immer das nächste
// bereits geladene Bild – es ruckelt nie auf ein leeres Canvas. "low": nur ein Standbild (poster).
import { tier } from './quality.js';
import { ScrollTrigger } from './core.js';

export function createImageSequence(container, { frames, src, scrollTrigger, fit = 'cover', poster } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const imgs = new Array(frames);
  let current = 0;

  const draw = (i) => {
    let k = i, img = null;
    for (let d = 0; d < frames && !img; d++) { // nächstes geladenes Bild suchen
      if (imgs[i - d]?.complete && imgs[i - d].naturalWidth) img = imgs[(k = i - d)];
      else if (imgs[i + d]?.complete && imgs[i + d].naturalWidth) img = imgs[(k = i + d)];
    }
    if (!img) return;
    const cw = canvas.width, ch = canvas.height;
    const s = (fit === 'cover' ? Math.max : Math.min)(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  };
  const resize = () => {
    const r = container.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d);
    draw(current);
  };
  new ResizeObserver(resize).observe(container);

  const load = (i) => new Promise((res) => {
    if (imgs[i]) return res();
    const im = new Image();
    im.decoding = 'async';
    im.onload = im.onerror = () => { if (i === current || Math.abs(i - current) < 4) draw(current); res(); };
    im.src = src(i);
    imgs[i] = im;
  });

  if (tier === 'low') {
    const i = poster ?? frames - 1;
    load(i).then(() => { current = i; draw(i); });
    return { canvas };
  }

  // Ladereihenfolge: 0, dann grob (jedes 8.), dann alles
  (async () => {
    await load(0); draw(0);
    const order = [];
    for (let i = 8; i < frames; i += 8) order.push(i);
    for (let i = 1; i < frames; i++) if (i % 8) order.push(i);
    const conc = tier === 'high' ? 6 : 3;
    for (let k = 0; k < order.length; k += conc) await Promise.all(order.slice(k, k + conc).map(load));
  })();

  const st = scrollTrigger && ScrollTrigger.create({
    trigger: container, ...scrollTrigger,
    onUpdate: (s) => {
      const i = Math.min(frames - 1, Math.round(s.progress * (frames - 1)));
      if (i !== current) { current = i; draw(i); }
    },
  });
  return { canvas, st, setFrame: (i) => { current = i; draw(i); } };
}
