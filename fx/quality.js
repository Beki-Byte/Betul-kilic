// Geräte-Stufe einmal bestimmen und überall verwenden.
//   high = Computer mit Maus, genug Kerne  -> alles
//   mid  = Touch / schwächere Geräte       -> weniger Partikel, kein Cursor, natives Scrollen
//   low  = "Bewegung reduzieren"           -> keine Scroll-Animationen, statische Bilder
// Zum Testen per URL erzwingen: ?tier=low | ?tier=mid | ?tier=high
const q = new URLSearchParams(location.search).get('tier');

export const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const coarsePointer = matchMedia('(pointer: coarse)').matches;
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

const cores = navigator.hardwareConcurrency ?? 4;
const memory = navigator.deviceMemory ?? 8;

export const tier =
  q === 'low' || q === 'mid' || q === 'high'
    ? q
    : reducedMotion
      ? 'low'
      : coarsePointer || cores <= 4 || memory <= 4
        ? 'mid'
        : 'high';

export const webgl = (() => {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
})();

/** Pixel-Ratio-Deckel je Stufe (Shader-Kosten wachsen quadratisch mit der DPR). */
export const maxDpr = tier === 'high' ? 1.75 : tier === 'mid' ? 1.25 : 1;
export const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);

/** Wert je Stufe wählen: pick({ high: 40000, mid: 12000, low: 0 }) */
export const pick = (o) => o[tier];

document.documentElement.dataset.tier = tier;
document.documentElement.classList.toggle('no-webgl', !webgl);
