// ============================================================
// cursor.js — 自定义光标（延迟跟随环 + 悬停态）
// ============================================================

export function initCursor() {
  if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  document.documentElement.classList.add('has-cursor');
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const ringPos = { ...pos };
  let visible = false;

  window.addEventListener(
    'pointermove',
    (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = 1;
        ring.style.opacity = 1;
      }
    },
    { passive: true }
  );

  window.addEventListener('pointerdown', () => ring.classList.add('is-down'));
  window.addEventListener('pointerup', () => ring.classList.remove('is-down'));

  const HOVER_SEL = 'a, button, [data-magnet], [data-tilt], .filter, .honor, .g-card, .p-card, .rlink, .pl-item, .modal, .gallery-scroller';
  // 捕获阶段挂 window：弹窗/面板等任何层级的元素都能触发，不会被局部容器吞掉
  window.addEventListener(
    'pointerover',
    (e) => {
      if (e.target.closest?.(HOVER_SEL)) ring.classList.add('is-hover');
    },
    true
  );
  window.addEventListener(
    'pointerout',
    (e) => {
      if (e.target.closest?.(HOVER_SEL)) ring.classList.remove('is-hover');
    },
    true
  );
  // 弹窗打开/关闭时同步光标状态（body 上的标记由 main.js 维护）
  const mo = new MutationObserver(() => {
    ring.classList.toggle('modal-open', !!document.querySelector('.modal, .palette'));
  });
  mo.observe(document.body, { childList: true, subtree: false });

  let raf;
  function loop() {
    ringPos.x += (pos.x - ringPos.x) * 0.16;
    ringPos.y += (pos.y - ringPos.y) * 0.16;
    dot.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
    raf = requestAnimationFrame(loop);
  }
  dot.style.opacity = 0;
  ring.style.opacity = 0;
  loop();

  return {
    destroy() {
      cancelAnimationFrame(raf);
    },
  };
}
