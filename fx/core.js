// Gemeinsamer Kern: GSAP + ScrollTrigger + Lenis, ein einziger Takt (gsap.ticker) für alles.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import Lenis from 'lenis';
import { tier } from './quality.js';

gsap.registerPlugin(ScrollTrigger);

/** Bewegungssprache der ganzen Seite – überall diese Werte verwenden. */
export const motion = { ease: 'power3.out', easeInOut: 'power3.inOut', dur: 1.1, stagger: 0.04 };
gsap.defaults({ ease: motion.ease, duration: motion.dur });

let lenis = null;

/**
 * Weiches Scrollen. Nur auf "high" – auf Touch-Geräten ist natives Scrollen besser,
 * bei "Bewegung reduzieren" sowieso aus.
 */
export function initSmoothScroll({ lerp = 0.09 } = {}) {
  if (tier !== 'high') return null;
  lenis = new Lenis({ lerp, anchors: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add('lenis', 'lenis-smooth');
  return lenis;
}

export const getLenis = () => lenis;

/** Scroll stoppen/freigeben (z. B. während des Preloaders oder in Dialogen). */
export function lockScroll(locked) {
  document.documentElement.classList.toggle('fx-locked', locked);
  if (lenis) locked ? lenis.stop() : lenis.start();
}

/** Aktuelle Scroll-Geschwindigkeit (px/Frame, geglättet) – für Skew-/Shader-Effekte. */
export const velocity = { value: 0 };
let lastY = window.scrollY;
gsap.ticker.add(() => {
  const y = lenis ? lenis.scroll : window.scrollY;
  velocity.value += (y - lastY - velocity.value) * 0.2;
  lastY = y;
});

export { gsap, ScrollTrigger };
