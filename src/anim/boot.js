// ============================================================
// boot.js — SHEN-OS 启动序列（终端自检 + 进度条 + 揭幕）
// ============================================================

const LINES = [
  '<span class="dim">[</span> <b>OK</b> <span class="dim">]</span> mount /dev/yaoshen — 人格分区已加载',
  '<span class="dim">[</span> <b>OK</b> <span class="dim">]</span> research.kernel — 3 papers · 1 first-author <span class="dim">(arXiv:2606.16589)</span>',
  '<span class="dim">[</span> <b>OK</b> <span class="dim">]</span> projects.db — 24 records indexed',
  '<span class="dim">[</span> <b>OK</b> <span class="dim">]</span> honors.io — 12 awards · 2 software copyrights',
  '<span class="dim">[</span> <b>..</b> <span class="dim">]</span> rendering interface — three.js / gsap / lenis',
];

export function runBoot(gsap, skip = false) {
  const boot = document.getElementById('boot');

  if (skip) {
    boot.remove();
    document.dispatchEvent(new CustomEvent('boot:done'));
    return Promise.resolve();
  }

  document.documentElement.classList.add('is-booting');

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    boot.classList.add('done');
    document.documentElement.classList.remove('is-booting');
    document.dispatchEvent(new CustomEvent('boot:done'));
    return Promise.resolve();
  }

  const linesEl = document.getElementById('boot-lines');
  const barEl = document.getElementById('boot-bar-fill');
  const pctEl = document.getElementById('boot-pct');

  const DURATION = 2.5;
  let skipped = false;
  let finished = false;

  // 逐行打印
  LINES.forEach((html, i) => {
    const div = document.createElement('div');
    div.className = 'bl';
    div.innerHTML = html;
    div.style.animationDelay = `${0.25 + i * 0.38}s`;
    linesEl.appendChild(div);
  });

  const state = { v: 0 };
  const tween = gsap.to(state, {
    v: 100,
    duration: DURATION,
    ease: 'power2.inOut',
    onUpdate() {
      const v = Math.round(state.v);
      barEl.style.width = v + '%';
      pctEl.textContent = v + '%';
    },
    onComplete: () => finish(),
  });

  const fontsReady = Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 3200)),
  ]);

  boot.addEventListener('click', () => {
    skipped = true;
    tween.progress(1);
  });

  function finish() {
    if (finished) return;
    finished = true;
    fontsReady.then(() => {
      setTimeout(() => {
        boot.classList.add('done');
        document.documentElement.classList.remove('is-booting');
        document.dispatchEvent(new CustomEvent('boot:done'));
        setTimeout(() => boot.remove(), 1200);
      }, skipped ? 60 : 220);
    });
  }
}
