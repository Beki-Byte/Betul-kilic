// Eigene Partikel-Formen für die Story: ein Blatt Papier und ein Papierflieger.
// Koordinaten im Raum von particle-morph.js (Kamera z=10, Sichthöhe ≈ 6.3 Einheiten).
const VIEW_H = 2 * 10 * Math.tan((17.5 * Math.PI) / 180);

function rotate(out, rx, ry, rz) {
  const [cx, sx, cy, sy, cz, sz] = [Math.cos(rx), Math.sin(rx), Math.cos(ry), Math.sin(ry), Math.cos(rz), Math.sin(rz)];
  for (let i = 0; i < out.length; i += 3) {
    let x = out[i], y = out[i + 1], z = out[i + 2];
    let y1 = y * cx - z * sx, z1 = y * sx + z * cx; y = y1; z = z1;          // X
    let x1 = x * cy + z * sy; z1 = -x * sy + z * cy; x = x1; z = z1;          // Y
    x1 = x * cz - y * sz; y1 = x * sz + y * cz; x = x1; y = y1;               // Z
    out[i] = x; out[i + 1] = y; out[i + 2] = z;
  }
  return out;
}

// Zufallspunkt auf Dreieck a-b-c
function triPoint(a, b, c) {
  let u = Math.random(), v = Math.random();
  if (u + v > 1) { u = 1 - u; v = 1 - v; }
  return [0, 1, 2].map((k) => a[k] + u * (b[k] - a[k]) + v * (c[k] - a[k]));
}
function edgePoint(a, b) {
  const t = Math.random(), j = () => (Math.random() - 0.5) * 0.02;
  return [a[0] + t * (b[0] - a[0]) + j(), a[1] + t * (b[1] - a[1]) + j(), a[2] + t * (b[2] - a[2]) + j()];
}

export function viewWidth(el) {
  const r = el.getBoundingClientRect();
  return VIEW_H * (r.width / Math.max(1, r.height));
}

/** Ein leicht gewölbtes Blatt (A4-Verhältnis), schräg im Raum. */
export function paperShape(count, w) {
  const pw = Math.min(2.5, w * 0.5), ph = pw * 1.414;
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x, y;
    if (Math.random() < 0.22) { // Kanten dichter -> klare Silhouette
      const s = Math.floor(Math.random() * 4), t = Math.random() - 0.5;
      x = s < 2 ? t * pw : (s === 2 ? -0.5 : 0.5) * pw;
      y = s < 2 ? (s === 0 ? -0.5 : 0.5) * ph : t * ph;
    } else { x = (Math.random() - 0.5) * pw; y = (Math.random() - 0.5) * ph; }
    const z = Math.sin((x / pw + 0.5) * Math.PI) * 0.18 + (Math.random() - 0.5) * 0.02;
    out.set([x, y, z], i * 3);
  }
  return rotate(out, -0.85, 0.35, -0.32);
}

/** Klassischer Papierflieger („Pfeil“): zwei Flügel + Kiel, im Steigflug nach rechts oben. */
export function planeShape(count, w) {
  const s = Math.min(1, (w * 0.78) / 4.6);
  const L = 4.4 * s, W = 1.55 * s;
  const N = [L / 2, 0, 0], Tl = [-L / 2, 0, 0];
  const WL = [-L / 2, 0.16 * s, -W], WR = [-L / 2, 0.16 * s, W];
  const K = [-L / 2 + 0.25 * s, -0.62 * s, 0];
  const faces = [[N, Tl, WL, 0.38], [N, Tl, WR, 0.38], [N, Tl, K, 0.24]];
  const edges = [[N, WL], [N, WR], [WL, Tl], [WR, Tl], [N, K], [K, Tl]];
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let p;
    if (Math.random() < 0.25) { const e = edges[(Math.random() * edges.length) | 0]; p = edgePoint(e[0], e[1]); }
    else {
      let r = Math.random(), f = faces[0];
      for (const face of faces) { if ((r -= face[3]) <= 0) { f = face; break; } f = face; }
      p = triPoint(f[0], f[1], f[2]);
    }
    out.set(p, i * 3);
  }
  rotate(out, 0.55, -0.55, 0.22);
  for (let i = 0; i < out.length; i += 3) out[i + 1] += 0.15; // etwas höher, über den Bildunterschriften
  return out;
}

/** Sternenhimmel: Milchstraßen-Band, verstreute Sterne und ein kleines Sternbild aus hellen Punkten. */
export function skyShape(count, w) {
  const h = VIEW_H, out = new Float32Array(count * 3);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  // Sternbild (Kassiopeia-ähnliches W), rechts oben
  const cons = [[0.10, 0.30], [0.20, 0.16], [0.29, 0.27], [0.38, 0.13], [0.47, 0.25]]
    .map(([x, y]) => [x * w - w * 0.02, y * h]);
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    let x, y, z = (Math.random() - 0.5) * 3;
    if (r < 0.5) { // Band
      const t = (Math.random() - 0.5) * w * 1.3;
      x = t; y = t * -0.32 + gauss() * h * 0.12 - h * 0.05; z = gauss() * 1.2;
    } else if (r < 0.88) { x = (Math.random() - 0.5) * w * 1.2; y = (Math.random() - 0.5) * h * 1.1; }
    else if (r < 0.95) { const c = cons[(Math.random() * cons.length) | 0]; x = c[0] + gauss() * 0.05; y = c[1] + gauss() * 0.05; z = 0; }
    else { // Linien des Sternbilds, ganz fein
      const k = (Math.random() * (cons.length - 1)) | 0, t = Math.random();
      x = cons[k][0] + (cons[k + 1][0] - cons[k][0]) * t; y = cons[k][1] + (cons[k + 1][1] - cons[k][1]) * t; z = 0;
    }
    out.set([x, y, z], i * 3);
  }
  return out;
}
