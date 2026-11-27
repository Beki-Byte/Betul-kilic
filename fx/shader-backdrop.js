// Vollflächiger Shader-Hintergrund (reines WebGL, keine Bibliothek, ~4 KB).
// Reagiert auf Zeit, Maus und Scroll. Drei Looks:
//   'silk'    – fließende, verwirbelte Farbverläufe (Luxus, Kosmetik, Wellness)
//   'contour' – Höhenlinien/Schichten, die sich verschieben (Tiefe, Erde, Daten, Architektur)
//   'aurora'  – Lichtbänder, die über eine dunkle Fläche ziehen (Nacht, Tech, Musik, Events)
//
//   import { createShaderBackdrop } from './fx/shader-backdrop.js';
//   createShaderBackdrop(document.querySelector('.hero__bg'), {
//     look: 'silk', colors: ['#0b0a10', '#3b1d5e', '#e8a87c', '#f6e7d8'],
//     scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top' },
//   });
//
// Der Container braucht eine Größe (z. B. position:absolute; inset:0). Ohne WebGL oder bei
// "Bewegung reduzieren" wird ein einziges Standbild gerendert bzw. ein CSS-Verlauf gesetzt.
import { tier, webgl, dpr } from './quality.js';
import { gsap, ScrollTrigger } from './core.js';

const LOOKS = { silk: 0, contour: 1, aurora: 2 };

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uScroll;
uniform vec3 uC0; uniform vec3 uC1; uniform vec3 uC2; uniform vec3 uC3;
uniform float uLook; uniform float uGrain; uniform float uIntensity;

vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y); vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){ float f=0., a=.5; for(int i=0;i<4;i++){ f+=a*snoise(p); p*=2.02; a*=.5; } return f; }
float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)))*43758.5453); }

vec3 palette(float t){
  t=clamp(t,0.,1.);
  vec3 c=mix(uC0,uC1,smoothstep(0.,.38,t));
  c=mix(c,uC2,smoothstep(.33,.72,t));
  return mix(c,uC3,smoothstep(.68,1.,t));
}

void main(){
  vec2 uv=gl_FragCoord.xy/uRes; float asp=uRes.x/uRes.y;
  vec2 p=(uv-.5)*vec2(asp,1.);
  vec2 m=(uMouse-.5)*vec2(asp,1.);
  float md=length(p-m);
  float t=uTime*.06;
  vec3 col;

  if(uLook<.5){
    // SILK – doppelt verwirbeltes Rauschen (domain warping)
    vec2 pp=p*.62+vec2(0.,uScroll*.45);
    pp+= (p-m)*.12*exp(-md*2.2);
    vec2 q=vec2(fbm(vec3(pp,t)), fbm(vec3(pp+5.2,t)));
    vec2 r=vec2(fbm(vec3(pp+1.6*q+vec2(1.7,9.2),t*1.2)), fbm(vec3(pp+1.6*q+vec2(8.3,2.8),t*1.2)));
    float f=fbm(vec3(pp+1.3*r,t*.8));
    float v=.48+.62*f+.18*length(q)*uIntensity;
    col=palette(v);
    // weiche Glanzbahn wie Licht auf Seide
    float sheen=smoothstep(.15,.0,abs(f-.08+.06*sin(t*3.)))*.22*uIntensity;
    col+=sheen*uC3;
  } else if(uLook<1.5){
    // CONTOUR – Höhenlinien, die beim Scrollen "tiefer" wandern
    vec2 pp=p*1.4;
    pp+= (p-m)*.25*exp(-md*3.);
    float h=fbm(vec3(pp*.9,t*.7))*.9+uScroll*1.4;
    float bands=10.;
    float fh=fract(h*bands);
    float w=fwidth(h*bands);
    float line=1.-smoothstep(0.,w*1.6+.015,min(fh,1.-fh));
    float layer=floor(h*bands)/bands;
    col=palette(.18+.7*fract(layer*.83+.1));
    col=mix(col,uC3,line*.55*uIntensity);
  } else {
    // AURORA – Lichtbänder über dunklem Grund
    vec2 pp=p; pp.y+=uScroll*.5;
    float n=fbm(vec3(pp.x*1.2,pp.y*.35,t*1.4));
    float band=exp(-pow((pp.y-.12*sin(pp.x*1.7+t*6.)-n*.55)*3.2,2.));
    float band2=exp(-pow((pp.y+.28-.1*sin(pp.x*2.3-t*5.)-n*.4)*4.5,2.));
    col=uC0;
    col+=palette(.45+.4*n)*band*1.1*uIntensity;
    col+=uC2*band2*.55*uIntensity;
    col+=uC3*.25*exp(-md*4.)*uIntensity; // Licht folgt der Maus
  }

  // Vignette + Filmkorn
  col*=1.-.35*smoothstep(.45,1.25,length((uv-.5)*vec2(asp*.8,1.)));
  col+=(hash(gl_FragCoord.xy+fract(uTime))-.5)*uGrain;
  gl_FragColor=vec4(col,1.);
}`;

const hexToVec = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export function createShaderBackdrop(container, opts = {}) {
  const {
    look = 'silk',
    colors = ['#0d0b14', '#2a1f4a', '#d98e6a', '#f7e6d4'],
    speed = 1,
    grain = 0.045,
    intensity = 1,
    mouse = true,
    scrollTrigger = null, // { trigger, start, end } -> uScroll 0..1
  } = opts;

  const fallback = () => {
    container.style.background = `radial-gradient(120% 90% at 30% 20%, ${colors[2]} 0%, transparent 55%),
      radial-gradient(90% 80% at 80% 70%, ${colors[1]} 0%, transparent 60%), ${colors[0]}`;
    return { destroy() {}, set() {} };
  };
  if (!webgl) return fallback();

  const canvas = document.createElement('canvas');
  canvas.className = 'fx-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) { canvas.remove(); return fallback(); }
  gl.getExtension('OES_standard_derivatives');

  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ['uRes', 'uTime', 'uMouse', 'uScroll', 'uC0', 'uC1', 'uC2', 'uC3', 'uLook', 'uGrain', 'uIntensity']
    .forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));
  const setColors = (cs) => cs.forEach((c, i) => gl.uniform3fv(U['uC' + i], hexToVec(c)));
  setColors(colors);
  gl.uniform1f(U.uLook, LOOKS[look] ?? 0);
  gl.uniform1f(U.uGrain, grain);
  gl.uniform1f(U.uIntensity, intensity);

  // Shader auf "mid" mit kleinerer Auflösung rendern – bei weichen Verläufen unsichtbar, spart viel GPU.
  const scale = tier === 'high' ? dpr : Math.min(dpr, 1) * 0.75;
  const resize = () => {
    const r = container.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * scale));
    canvas.height = Math.max(1, Math.round(r.height * scale));
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    if (tier === 'low') draw(12);
  };

  const state = { mx: 0.5, my: 0.5, tx: 0.5, ty: 0.5, scroll: 0 };
  const draw = (time) => {
    state.mx += (state.tx - state.mx) * 0.05;
    state.my += (state.ty - state.my) * 0.05;
    gl.uniform1f(U.uTime, time * speed);
    gl.uniform2f(U.uMouse, state.mx, state.my);
    gl.uniform1f(U.uScroll, state.scroll);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const ro = new ResizeObserver(resize);
  ro.observe(container);
  resize();

  if (tier === 'low') return { destroy() { ro.disconnect(); canvas.remove(); }, set() {} };

  const onMove = (e) => {
    const r = container.getBoundingClientRect();
    state.tx = (e.clientX - r.left) / r.width;
    state.ty = 1 - (e.clientY - r.top) / r.height;
  };
  if (mouse) window.addEventListener('pointermove', onMove, { passive: true });

  let st = null;
  if (scrollTrigger) {
    st = ScrollTrigger.create({ ...scrollTrigger, onUpdate: (s) => (state.scroll = s.progress) });
  }

  // Nur rendern, wenn sichtbar und Tab aktiv.
  let visible = true;
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { rootMargin: '100px' });
  io.observe(container);
  const tick = (t) => { if (visible && !document.hidden) draw(t); };
  gsap.ticker.add(tick);

  return {
    set({ colors: cs, intensity: i } = {}) {
      if (cs) setColors(cs);
      if (i != null) gl.uniform1f(U.uIntensity, i);
    },
    destroy() {
      gsap.ticker.remove(tick); io.disconnect(); ro.disconnect(); st?.kill();
      window.removeEventListener('pointermove', onMove); canvas.remove();
    },
  };
}
