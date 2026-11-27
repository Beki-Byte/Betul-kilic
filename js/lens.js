// Code-Lupe: Wo die Maus (oder der Finger) über dem Foto ist, wird das Bild zu Zeichen.
// Hommage an die erste Version der Seite („betul.jpg decoded“).
import { tier } from '../fx/quality.js';
import { gsap } from '../fx/core.js';

const CHARS = '01{}<>/=;:()[]#*+.betul'.split('');

export function initLens(wrap) {
  if (!wrap || tier === 'low') return;
  const img = wrap.querySelector('img');
  const canvas = wrap.querySelector('.lens__canvas');
  const ctx = canvas.getContext('2d');
  const src = document.createElement('canvas');
  const sctx = src.getContext('2d', { willReadFrequently: true });
  let data = null, sw = 0, sh = 0;

  const prepare = () => {
    sw = 140; sh = Math.round(sw * img.naturalHeight / img.naturalWidth);
    src.width = sw; src.height = sh;
    sctx.drawImage(img, 0, 0, sw, sh);
    data = sctx.getImageData(0, 0, sw, sh).data;
  };
  if (img.complete && img.naturalWidth) prepare(); else img.addEventListener('load', prepare, { once: true });

  const dpr = Math.min(devicePixelRatio || 1, 2);
  const size = () => {
    const r = wrap.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
  };
  new ResizeObserver(size).observe(wrap);
  size();

  const st = { x: 0, y: 0, r: 0, tx: 0, ty: 0, tr: 0, active: false };
  const radius = () => Math.max(70, wrap.clientWidth * 0.2);
  const move = (e) => {
    const r = wrap.getBoundingClientRect();
    st.tx = e.clientX - r.left; st.ty = e.clientY - r.top;
    if (!st.active) { st.x = st.tx; st.y = st.ty; }
    st.active = true; st.tr = radius();
  };
  const leave = () => { st.active = false; st.tr = 0; };
  wrap.addEventListener('pointerenter', move);
  wrap.addEventListener('pointermove', move);
  wrap.addEventListener('pointerdown', move);
  wrap.addEventListener('pointerleave', leave);
  wrap.addEventListener('pointercancel', leave);
  wrap.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') leave(); });

  let frame = 0;
  gsap.ticker.add(() => {
    st.x += (st.tx - st.x) * 0.22; st.y += (st.ty - st.y) * 0.22; st.r += (st.tr - st.r) * 0.16;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (st.r < 1 || !data) return;
    frame++;
    ctx.scale(dpr, dpr);
    const wr = wrap.getBoundingClientRect(), ir = img.getBoundingClientRect();
    const cell = Math.max(9, Math.round(wr.width / 52));
    ctx.save();
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = '#070d1a'; ctx.fillRect(st.x - st.r, st.y - st.r, st.r * 2, st.r * 2);
    ctx.font = `600 ${cell}px ui-monospace, Menlo, Consolas, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const x0 = Math.floor((st.x - st.r) / cell) * cell, y0 = Math.floor((st.y - st.r) / cell) * cell;
    for (let y = y0; y < st.y + st.r; y += cell) for (let x = x0; x < st.x + st.r; x += cell) {
      const u = (x + cell / 2 + wr.left - ir.left) / ir.width, v = (y + cell / 2 + wr.top - ir.top) / ir.height;
      if (u < 0 || u > 1 || v < 0 || v > 1) continue;
      const i = ((Math.min(sh - 1, (v * sh) | 0) * sw) + Math.min(sw - 1, (u * sw) | 0)) * 4;
      const R = data[i], G = data[i + 1], B = data[i + 2];
      const lum = (R * 0.3 + G * 0.59 + B * 0.11) / 255;
      const k = (((x / cell) | 0) * 7 + ((y / cell) | 0) * 13 + ((frame / 6) | 0)) % CHARS.length;
      ctx.fillStyle = `rgb(${Math.min(255, R * 1.25 + 20)},${Math.min(255, G * 1.25 + 20)},${Math.min(255, B * 1.2 + 25)})`;
      ctx.globalAlpha = 0.35 + lum * 0.65;
      ctx.fillText(CHARS[k], x + cell / 2, y + cell / 2);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(224,144,106,.9)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2); ctx.stroke();
  });
}
