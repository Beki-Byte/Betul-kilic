// 3D-Modell-Bühne (three.js): lädt ein .glb (eigenes der Kundin oder frei lizenziert, siehe
// references/assets.md), zentriert und skaliert es automatisch, beleuchtet es studio-artig und
// lässt es per Scroll drehen/kippen/heranfahren. Maus neigt es leicht, es schwebt sanft.
//
//   import { createModelStage } from './fx/model-stage.js';
//   createModelStage(document.querySelector('.product__stage'), {
//     src: 'models/flasche.glb',
//     poster: 'img/flasche-poster.webp',        // Standbild für low / ohne WebGL / während des Ladens
//     scrollTrigger: { trigger: '.product', start: 'top top', end: '+=200%', pin: true, scrub: 1 },
//     turns: 1,                                  // volle Drehungen über die Scroll-Strecke
//     tint: '#e8a87c',                           // Farbe des Bodenlichts
//   });
//
// Container braucht eine Größe. Modell vorher komprimieren (meist 90 % kleiner):
//   npx -y @gltf-transform/cli@4.1.1 optimize in.glb out.glb --texture-compress webp --texture-size 1024
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { tier, webgl, dpr } from './quality.js';
import { gsap, ScrollTrigger } from './core.js';

export async function createModelStage(container, opts = {}) {
  const {
    src, poster, scrollTrigger = null, turns = 1, tilt = 0.35, zoom = 0.25,
    fill = 0.62, tint = '#ffffff', exposure = 1, float = true, onLoad,
  } = opts;

  const showPoster = () => {
    if (!poster) return;
    const img = document.createElement('img');
    img.src = poster; img.alt = ''; img.className = 'fx-model-poster';
    container.appendChild(img);
    return img;
  };
  if (!webgl || tier === 'low') { showPoster(); return { destroy() {} }; }
  const posterEl = showPoster();

  const renderer = new THREE.WebGLRenderer({ antialias: tier === 'high', alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'fx-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  const key = new THREE.DirectionalLight(0xffffff, 1.2);
  key.position.set(3, 5, 4);
  scene.add(key);

  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 100);
  camera.position.set(0, 0, 6);

  // weiches Bodenlicht statt teurer Schatten
  const glowTex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: glowTex, color: new THREE.Color(tint), transparent: true, depthWrite: false }));
  glow.rotation.x = -Math.PI / 2;
  scene.add(glow);

  const pivot = new THREE.Group();
  scene.add(pivot);

  const gltf = await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).loadAsync(src);
  const model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3()), center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  const viewH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  const s = (viewH * fill) / Math.max(size.y, size.x * 0.8, size.z * 0.8);
  pivot.scale.setScalar(s);
  pivot.add(model);
  glow.position.y = -(size.y * s) / 2 - 0.02;
  glow.scale.setScalar(Math.max(size.x, size.z) * s * 2.2);
  if (posterEl) gsap.to(posterEl, { opacity: 0, duration: 0.8, onComplete: () => posterEl.remove() });
  onLoad?.(model);

  const resize = () => {
    const r = container.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  const state = { p: 0, mx: 0, my: 0, tx: 0, ty: 0 };
  const onMove = (e) => { state.tx = (e.clientX / innerWidth - 0.5) * 2; state.ty = (e.clientY / innerHeight - 0.5) * 2; };
  if (tier === 'high') window.addEventListener('pointermove', onMove, { passive: true });
  const st = scrollTrigger && ScrollTrigger.create({ trigger: container, ...scrollTrigger, onUpdate: (x) => (state.p = x.progress) });

  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
  io.observe(container);
  const t0 = performance.now();
  const tick = () => {
    if (!visible || document.hidden) return;
    const t = (performance.now() - t0) / 1000;
    state.mx += (state.tx - state.mx) * 0.05; state.my += (state.ty - state.my) * 0.05;
    pivot.rotation.y = state.p * Math.PI * 2 * turns + state.mx * 0.25 + (scrollTrigger ? 0 : t * 0.25);
    pivot.rotation.x = Math.sin(state.p * Math.PI) * tilt + state.my * 0.12;
    pivot.position.y = float ? Math.sin(t * 1.1) * 0.06 : 0;
    camera.position.z = 6 * (1 - zoom * Math.sin(state.p * Math.PI));
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  return {
    model, scene, camera,
    destroy() {
      gsap.ticker.remove(tick); ro.disconnect(); io.disconnect(); st?.kill();
      window.removeEventListener('pointermove', onMove); renderer.dispose(); renderer.domElement.remove();
    },
  };
}
