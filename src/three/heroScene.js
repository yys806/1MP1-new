// ============================================================
// heroScene.js — Hero 主视觉：神经星链球体（粒子 + 连线 + 星野）
// ============================================================
import * as THREE from 'three';

const VERT = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (36.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.06, d) * uOpacity;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

function makeDotTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

// 斐波那契球面均匀布点
function fibSphere(n, radius) {
  const pts = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius));
  }
  return pts;
}

export function createHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 4.75);

  const group = new THREE.Group();
  scene.add(group);

  // ---- 粒子顶点 ----
  const N = 1500;
  const R = 1.62;
  const positions = fibSphere(N, R);
  const sizes = new Float32Array(N);
  const colors = new Float32Array(N * 3);
  const cWhite = new THREE.Color('#eafff2');
  const cGreen = new THREE.Color('#3dff88');
  const cBlue = new THREE.Color('#6ab8ff');
  const tmp = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const jitter = 1 + (Math.random() - 0.5) * 0.045;
    positions[i].multiplyScalar(jitter);
    const r = Math.random();
    tmp.copy(r < 0.62 ? cWhite : r < 0.92 ? cGreen : cBlue);
    tmp.multiplyScalar(0.6 + Math.random() * 0.25);
    colors.set([tmp.r, tmp.g, tmp.b], i * 3);
    sizes[i] = (r < 0.92 ? 0.95 : 2.1) + Math.random() * 0.6;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions.flatMap((v) => [v.x, v.y, v.z]), 3));
  pGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
  pGeo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uOpacity: { value: 1 } },
  });
  const points = new THREE.Points(pGeo, pMat);
  group.add(points);

  // ---- 星链连线 ----
  const TH = 0.3;
  const MAX = 5200;
  const linePos = [];
  const lineCol = [];
  outer: for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const d = positions[i].distanceTo(positions[j]);
      if (d < TH) {
        const a = (1 - d / TH) * 0.24;
        linePos.push(positions[i].x, positions[i].y, positions[i].z, positions[j].x, positions[j].y, positions[j].z);
        lineCol.push(0.24 * a + 0.02, 1 * a, 0.53 * a + 0.015, 0.24 * a + 0.02, 1 * a, 0.53 * a + 0.015);
        if (linePos.length / 6 > MAX) break outer;
      }
    }
  }
  const lGeo = new THREE.BufferGeometry();
  lGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3));
  lGeo.setAttribute('color', new THREE.Float32BufferAttribute(lineCol, 3));
  const lMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const lines = new THREE.LineSegments(lGeo, lMat);
  group.add(lines);

  // ---- 内核光晕 ----
  const coreMat = new THREE.SpriteMaterial({
    map: makeDotTexture(),
    color: new THREE.Color('#2fff7f'),
    transparent: true,
    opacity: 0.32,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const core = new THREE.Sprite(coreMat);
  core.scale.setScalar(2.6);
  group.add(core);

  // ---- 背景星野 ----
  const SN = 420;
  const starPos = [];
  for (let i = 0; i < SN; i++) {
    const r = 5 + Math.random() * 9;
    const t = Math.random() * Math.PI * 2;
    const p = Math.acos(2 * Math.random() - 1);
    starPos.push(r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p));
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  const sMat = new THREE.PointsMaterial({
    size: 0.035,
    map: makeDotTexture(),
    color: 0x9fb8aa,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const stars = new THREE.Points(sGeo, sMat);
  scene.add(stars);

  // ---- 状态 ----
  const state = {
    mouse: { x: 0, y: 0 },
    smooth: { x: 0, y: 0 },
    progress: 0, // 0 → 1 随首屏滚动
    active: true,
    clock: new THREE.Clock(),
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.clientWidth || window.innerWidth;
    const h = rect.height || canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < 700 ? 55 : 42;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(resize).observe(canvas);
  }

  function onMouse(e) {
    state.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    state.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener('pointermove', onMouse, { passive: true });

  function tick() {
    if (!state.active) return;
    const t = state.clock.getElapsedTime();
    const p = state.progress;

    state.smooth.x += (state.mouse.x - state.smooth.x) * 0.045;
    state.smooth.y += (state.mouse.y - state.smooth.y) * 0.045;

    group.rotation.y = t * 0.07 + state.smooth.x * 0.38;
    group.rotation.x = Math.sin(t * 0.1) * 0.06 - state.smooth.y * 0.22;
    group.position.y = -0.12 + p * 1.35;
    const s = 1 - p * 0.42;
    group.scale.setScalar(s);

    // 滚动淡出
    const fade = Math.max(0, 1 - p * 1.35);
    pMat.uniforms.uOpacity.value = fade;
    lMat.opacity = 0.62 * fade;
    coreMat.opacity = 0.26 * fade * (1 + Math.sin(t * 1.4) * 0.14);
    core.scale.setScalar((2.3 + Math.sin(t * 1.4) * 0.2) * s);
    stars.rotation.y = -t * 0.008 + state.smooth.x * 0.05;
    sMat.opacity = 0.55 * fade;

    camera.position.x = state.smooth.x * 0.22;
    camera.position.y = -state.smooth.y * 0.16;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  return {
    tick,
    setProgress(v) {
      state.progress = v;
    },
    setActive(v) {
      state.active = v;
    },
    dispose() {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMouse);
      renderer.dispose();
    },
  };
}
