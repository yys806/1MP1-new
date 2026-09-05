// ============================================================
// interact.js — 磁吸元素 + 3D 倾斜卡片（含眩光）
// ============================================================

export function initMagnet() {
  if (window.matchMedia('(hover: none)').matches) return;
  const els = document.querySelectorAll('[data-magnet]');
  const cleanups = [];
  els.forEach((el) => {
    const strength = parseFloat(el.dataset.magnet) || 0.32;
    let raf = null;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    function loop() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05 || tx !== 0) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
        el.style.transform = '';
      }
    }
    function onMove(e) {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - (r.left + r.width / 2)) * strength;
      ty = (e.clientY - (r.top + r.height / 2)) * strength;
      if (!raf) raf = requestAnimationFrame(loop);
    }
    function onLeave() {
      tx = 0;
      ty = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    }
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    cleanups.push(() => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    });
  });
  return () => cleanups.forEach((fn) => fn());
}

export function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;
  const els = document.querySelectorAll('[data-tilt]');
  els.forEach((el) => {
    const inner = el.querySelector('[data-tilt-inner]') || el;
    const glare = el.querySelector('.portrait-glare, .tilt-glare');
    const max = parseFloat(el.dataset.tilt) || 7;
    let raf = null;
    let rx = 0;
    let ry = 0;
    let trx = 0;
    let try_ = 0;

    function loop() {
      rx += (trx - rx) * 0.12;
      ry += (try_ - ry) * 0.12;
      inner.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      if (Math.abs(trx - rx) > 0.02 || Math.abs(try_ - ry) > 0.02 || trx !== 0) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      try_ = (px - 0.5) * max * 2;
      trx = -(py - 0.5) * max * 2;
      if (glare) {
        glare.style.setProperty('--gx', px * 100 + '%');
        glare.style.setProperty('--gy', py * 100 + '%');
      }
      if (!raf) raf = requestAnimationFrame(loop);
    });
    el.addEventListener('pointerleave', () => {
      trx = 0;
      try_ = 0;
      if (!raf) raf = requestAnimationFrame(loop);
    });
  });
}
