// ============================================================
// contactScene.js — 联络/页脚背景：旋转线框晶格体
// ============================================================
import * as THREE from 'three';

export function createContactScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 60);
  camera.position.set(0, 0, 5.2);

  const group = new THREE.Group();
  scene.add(group);

  // 外层线框
  const outerGeo = new THREE.IcosahedronGeometry(1.9, 1);
  const outerEdges = new THREE.EdgesGeometry(outerGeo);
  const outerMat = new THREE.LineBasicMaterial({
    color: 0x3dff88,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const outer = new THREE.LineSegments(outerEdges, outerMat);
  group.add(outer);

  // 内层线框（反向旋转）
  const innerGeo = new THREE.IcosahedronGeometry(1.15, 0);
  const innerEdges = new THREE.EdgesGeometry(innerGeo);
  const innerMat = new THREE.LineBasicMaterial({
    color: 0xbfffe0,
    transparent: true,
    opacity: 0.22,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const inner = new THREE.LineSegments(innerEdges, innerMat);
  group.add(inner);

  // 顶点粒子
  const vPos = outerGeo.getAttribute('position');
  const vGeo = new THREE.BufferGeometry();
  vGeo.setAttribute('position', vPos.clone());
  const dotTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  })();
  const vMat = new THREE.PointsMaterial({
    size: 0.085,
    map: dotTex,
    color: 0x7dffae,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const verts = new THREE.Points(vGeo, vMat);
  group.add(verts);

  // 内核辉光
  const coreMat = new THREE.SpriteMaterial({
    map: dotTex,
    color: 0x2fff7f,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const core = new THREE.Sprite(coreMat);
  core.scale.setScalar(2.4);
  group.add(core);

  const state = {
    mouse: { x: 0, y: 0 },
    smooth: { x: 0, y: 0 },
    active: false,
    appear: 0,
    clock: new THREE.Clock(),
  };

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.clientWidth || window.innerWidth;
    const h = rect.height || canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const mobile = w < 860;
    group.position.x = mobile ? 0 : 0.9;
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
    state.smooth.x += (state.mouse.x - state.smooth.x) * 0.04;
    state.smooth.y += (state.mouse.y - state.smooth.y) * 0.04;

    outer.rotation.y = t * 0.12 + state.smooth.x * 0.3;
    outer.rotation.x = 0.32 + state.smooth.y * 0.2;
    inner.rotation.y = -t * 0.2;
    inner.rotation.z = t * 0.1;
    verts.rotation.copy(outer.rotation);
    core.material.opacity = 0.13 + Math.sin(t * 1.2) * 0.05;

    renderer.render(scene, camera);
  }

  return {
    tick,
    setActive(v) {
      state.active = v;
    },
    setAppear(v) {
      // 进入视口时整体淡入
      group.scale.setScalar(0.7 + 0.3 * v);
      outerMat.opacity = 0.3 * v;
      innerMat.opacity = 0.22 * v;
      vMat.opacity = 0.9 * v;
    },
    dispose() {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMouse);
      renderer.dispose();
    },
  };
}
