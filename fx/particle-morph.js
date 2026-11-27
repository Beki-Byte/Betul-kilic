// Partikelwolke (three.js), die sich zwischen Formen verwandelt: Wort/Name, Logo/Bild,
// Kugel, Ring, Galaxie, Welle, Streuung. Übergänge per Scroll oder per Code.
// Die Partikel weichen der Maus aus und "atmen" leicht. Additive Lichtpunkte, zwei Farben.
//
//   import { createParticleMorph } from './fx/particle-morph.js';
//   const pm = await createParticleMorph(document.querySelector('.hero__particles'), {
//     shapes: [
//       { type: 'scatter' },
//       { type: 'text', value: 'NOVA', font: '700 220px "Unbounded"' },
//       { type: 'sphere' },
//       { type: 'image', src: 'logo.png' },          // dunkle/deckende Pixel werden zu Partikeln
//     ],
//     colors: ['#ffd6a5', '#7b5cff'],
//     scrollTrigger: { trigger: '.story', start: 'top top', end: 'bottom bottom', scrub: 1 },
//   });
//   // ohne scrollTrigger: pm.to(1) wechselt animiert zur Form 1
//
// Container braucht eine Größe. Max. 4 Formen. Partikelzahl je Stufe automatisch
// (high 42k, mid 14k). Bei "low" oder ohne WebGL: nichts wird gerendert (Container bleibt leer –
// dahinter ein Bild/Verlauf als Fallback legen).
import * as THREE from 'three';
import { tier, webgl, dpr, pick } from './quality.js';
import { gsap, ScrollTrigger } from './core.js';

const VERT = /* glsl */ `
uniform float uProgress; uniform float uTime; uniform float uSize; uniform vec2 uMouse; uniform float uPixelRatio;
attribute vec3 aT0; attribute vec3 aT1; attribute vec3 aT2; attribute vec3 aT3; attribute float aRand;
varying float vRand; varying float vAlpha;
vec3 pickT(float i){ return i<.5?aT0:i<1.5?aT1:i<2.5?aT2:aT3; }
void main(){
  float i0=floor(uProgress); float f=uProgress-i0;
  // jede Partikel startet leicht versetzt -> organischer Übergang
  float d=clamp((f-aRand*.35)/.65,0.,1.); d=d*d*(3.-2.*d);
  vec3 a=pickT(i0); vec3 b=pickT(min(i0+1.,3.));
  vec3 pos=mix(a,b,d);
  float swirl=sin(d*3.14159);
  pos+=swirl*vec3(sin(aRand*40.+uTime), cos(aRand*31.+uTime*.8), sin(aRand*17.))*.9*aRand;
  pos+=vec3(sin(uTime*.6+aRand*20.),cos(uTime*.5+aRand*13.),0.)*.025;
  vec2 dm=pos.xy-uMouse; float md=length(dm);
  pos.xy+=normalize(dm+1e-4)*.55*exp(-md*md*3.);
  vec4 mv=modelViewMatrix*vec4(pos,1.);
  gl_Position=projectionMatrix*mv;
  gl_PointSize=uSize*uPixelRatio*(.55+aRand*.9)*(10./-mv.z);
  vRand=aRand; vAlpha=.75+.25*sin(uTime*1.5+aRand*50.);
}`;

const FRAG = /* glsl */ `
uniform vec3 uColA; uniform vec3 uColB; uniform float uOpacity;
varying float vRand; varying float vAlpha;
void main(){
  float d=length(gl_PointCoord-.5);
  float a=smoothstep(.5,.0,d); a=a*.6+pow(a,4.)*.9;
  gl_FragColor=vec4(mix(uColA,uColB,vRand),a*vAlpha*uOpacity);
}`;

// ---------- Form-Generatoren: liefern Float32Array(count*3) im Bereich ca. [-w/2..w/2] x [-h/2..h/2]
function sampleCanvas(draw, cw, ch, count, w, h, test) {
  const c = document.createElement('canvas');
  c.width = cw; c.height = ch;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  draw(ctx, cw, ch);
  const data = ctx.getImageData(0, 0, cw, ch).data;
  const pts = [];
  for (let y = 0; y < ch; y += 2) for (let x = 0; x < cw; x += 2) {
    const i = (y * cw + x) * 4;
    if (test(data[i], data[i + 1], data[i + 2], data[i + 3])) pts.push(x, y);
  }
  const out = new Float32Array(count * 3);
  if (!pts.length) return out;
  // Seitenverhältnis erhalten, in Zielbox einpassen
  const s = Math.min(w / cw, h / ch);
  for (let k = 0; k < count; k++) {
    const j = (Math.random() * (pts.length / 2)) | 0;
    out[k * 3] = (pts[j * 2] - cw / 2 + Math.random() * 2) * s;
    out[k * 3 + 1] = -(pts[j * 2 + 1] - ch / 2 + Math.random() * 2) * s;
    out[k * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }
  return out;
}

async function buildShape(shape, count, w, h) {
  const out = new Float32Array(count * 3);
  const R = Math.min(w, h) * 0.42;
  const rnd = Math.random;
  switch (shape.type) {
    case 'text': {
      const font = shape.font || '800 200px sans-serif';
      try { await document.fonts.load(font, shape.value); } catch {}
      const lines = String(shape.value).split('\n');
      const size = parseInt(font.match(/(\d+)px/)?.[1] || 200, 10);
      const meas = document.createElement('canvas').getContext('2d');
      meas.font = font;
      const tw = Math.max(...lines.map((l) => meas.measureText(l).width));
      const cw = Math.ceil(tw + size * 0.4), ch = Math.ceil(size * 1.15 * lines.length + size * 0.3);
      return sampleCanvas((ctx) => {
        ctx.font = font; ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        lines.forEach((l, i) => ctx.fillText(l, cw / 2, ch / 2 + (i - (lines.length - 1) / 2) * size * 1.1));
      }, cw, ch, count, w * (shape.fit ?? 0.86), h * (shape.fit ?? 0.86), (r, g, b, a) => a > 128);
    }
    case 'image': {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = shape.src;
      await img.decode();
      const sc = Math.min(1, 600 / Math.max(img.width, img.height));
      const cw = Math.round(img.width * sc), ch = Math.round(img.height * sc);
      const dark = shape.mode !== 'light';
      return sampleCanvas((ctx) => ctx.drawImage(img, 0, 0, cw, ch), cw, ch, count,
        w * (shape.fit ?? 0.8), h * (shape.fit ?? 0.8),
        (r, g, b, a) => a > 128 && (dark ? r + g + b < 600 : r + g + b > 200));
    }
    case 'sphere':
      for (let i = 0; i < count; i++) {
        const u = rnd() * 2 - 1, t = rnd() * Math.PI * 2, rr = R * (0.96 + rnd() * 0.08);
        const s = Math.sqrt(1 - u * u);
        out.set([rr * s * Math.cos(t), rr * u, rr * s * Math.sin(t)], i * 3);
      }
      return out;
    case 'ring':
      for (let i = 0; i < count; i++) {
        const t = rnd() * Math.PI * 2, rr = R * (0.8 + Math.pow(rnd(), 2) * 0.35);
        out.set([rr * Math.cos(t), rr * Math.sin(t) * 0.38, (rnd() - 0.5) * 0.25], i * 3);
      }
      return out;
    case 'galaxy':
      for (let i = 0; i < count; i++) {
        const arm = i % 3, rr = Math.pow(rnd(), 1.6) * R * 1.35;
        const t = arm * (Math.PI * 2 / 3) + rr * 1.9 + (rnd() - 0.5) * 0.5;
        out.set([rr * Math.cos(t), (rnd() - 0.5) * 0.25 * (1.4 - rr / R), rr * Math.sin(t)], i * 3);
      }
      return out;
    case 'wave': {
      const side = Math.ceil(Math.sqrt(count));
      for (let i = 0; i < count; i++) {
        const x = ((i % side) / side - 0.5) * w * 1.1, z = (Math.floor(i / side) / side - 0.5) * h * 1.6;
        out.set([x, Math.sin(x * 1.3) * 0.25 + Math.cos(z * 1.1) * 0.25 - h * 0.15, z], i * 3);
      }
      return out;
    }
    case 'points': // eigene Positionen: shape.positions (Float32Array, Länge count*3 oder kürzer -> wiederholt)
      for (let i = 0; i < count * 3; i++) out[i] = shape.positions[i % shape.positions.length];
      return out;
    case 'scatter':
    default:
      for (let i = 0; i < count; i++) out.set([(rnd() - 0.5) * w * 1.6, (rnd() - 0.5) * h * 1.6, (rnd() - 0.5) * 6], i * 3);
      return out;
  }
}

const hex = (c) => new THREE.Color(c);

export async function createParticleMorph(container, opts = {}) {
  const {
    shapes = [{ type: 'scatter' }, { type: 'sphere' }],
    colors = ['#ffffff', '#88aaff'],
    count = pick({ high: 42000, mid: 14000, low: 0 }),
    size = 3,
    rotate = 0.08, // Eigenrotation (rad/s) für 3D-Formen
    scrollTrigger = null,
    blending = 'additive', // auf hellem Hintergrund 'normal' nehmen
  } = opts;

  const noop = { to() {}, setProgress() {}, destroy() {}, progress: 0 };
  if (!webgl || tier === 'low' || !count) return noop;

  const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.domElement.className = 'fx-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 10;
  const viewH = 2 * 10 * Math.tan(THREE.MathUtils.degToRad(17.5));

  const rect = container.getBoundingClientRect();
  const aspect = rect.width / Math.max(1, rect.height);
  const w = viewH * aspect, h = viewH;

  const geo = new THREE.BufferGeometry();
  const list = shapes.slice(0, 4);
  const built = await Promise.all(list.map((s) => buildShape(s, count, w, h)));
  while (built.length < 4) built.push(built[built.length - 1]);
  geo.setAttribute('position', new THREE.BufferAttribute(built[0].slice(), 3));
  built.forEach((b, i) => geo.setAttribute('aT' + i, new THREE.BufferAttribute(b, 3)));
  const rand = new Float32Array(count);
  for (let i = 0; i < count; i++) rand[i] = Math.random();
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 100); // kein Frustum-Culling

  const uniforms = {
    uProgress: { value: 0 }, uTime: { value: 0 }, uSize: { value: size },
    uMouse: { value: new THREE.Vector2(99, 99) }, uPixelRatio: { value: dpr },
    uColA: { value: hex(colors[0]) }, uColB: { value: hex(colors[1] ?? colors[0]) }, uOpacity: { value: 1 },
  };
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false,
    blending: blending === 'additive' ? THREE.AdditiveBlending : THREE.NormalBlending,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const resize = () => {
    const r = container.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const target = new THREE.Vector2(99, 99);
  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    target.set(((e.clientX - r.left) / r.width - 0.5) * viewH * camera.aspect, -((e.clientY - r.top) / r.height - 0.5) * viewH);
  };
  if (tier === 'high') window.addEventListener('pointermove', onMove, { passive: true });

  const maxP = list.length - 1;
  const api = {
    progress: 0,
    setProgress(p) { api.progress = gsap.utils.clamp(0, maxP, p); },
    to(i, d = 2.2) { return gsap.to(api, { progress: gsap.utils.clamp(0, maxP, i), duration: d, ease: 'power2.inOut' }); },
    destroy() {
      gsap.ticker.remove(tick); ro.disconnect(); io.disconnect(); st?.kill();
      window.removeEventListener('pointermove', onMove);
      geo.dispose(); mat.dispose(); renderer.dispose(); renderer.domElement.remove();
    },
  };

  let st = null;
  if (scrollTrigger) {
    st = ScrollTrigger.create({ ...scrollTrigger, onUpdate: (s) => api.setProgress(s.progress * maxP) });
  }

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(container);
  let t0 = performance.now();
  const tick = () => {
    if (!visible || document.hidden) return;
    const t = (performance.now() - t0) / 1000;
    uniforms.uTime.value = t;
    uniforms.uProgress.value += (api.progress - uniforms.uProgress.value) * 0.08;
    uniforms.uMouse.value.lerp(target, 0.1);
    points.rotation.y = Math.sin(t * rotate) * 0.35;
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);
  return api;
}
