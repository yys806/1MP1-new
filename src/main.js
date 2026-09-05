// ============================================================
// main.js — SHEN-OS 主入口
// 双语渲染 / Lenis 平滑滚动 / GSAP 动效 / three.js 懒加载
// 命令面板 / 项目弹窗 / BibTeX 复制 / 更新日志
// ============================================================
import '@fontsource-variable/jetbrains-mono';
import '@fontsource-variable/space-grotesk';
import '@fontsource-variable/noto-sans-sc';
import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import {
  PROFILE,
  STATS,
  RESEARCH,
  PROJECTS,
  PROJECT_GROUPS,
  FEATURED_ORDER,
  TIMELINE,
  HONORS,
  CHANGELOG,
  SECTIONS,
  UI,
} from './data.js';
import { runBoot } from './anim/boot.js';
import { initCursor } from './anim/cursor.js';
import { initMagnet, initTilt } from './anim/interact.js';

gsap.registerPlugin(ScrollTrigger);

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STATIC_MODE = new URLSearchParams(location.search).has('static');
const LIGHT = REDUCED || STATIC_MODE;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ============================================================
   0. 语言状态
   ============================================================ */
let LANG = localStorage.getItem('shen-lang') || 'zh';
const t = (k) => (UI[k] ? UI[k][LANG] : k);
const pick = (obj, key) => {
  const v = LANG === 'en' && obj?.en?.[key] != null ? obj.en[key] : obj?.[key];
  return v == null ? '' : v;
};
const GROUP_EN_MAP = { web: 'WEB', course: 'COURSE', campus: 'CAMPUS', other: 'OTHER' };

/* ============================================================
   1. 渲染（随语言整体重建）
   ============================================================ */

let featured = [];
let sortedProjects = [];

function renderStaticCopy() {
  $$('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $$('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
}

function renderNav() {
  $('#nav-links').innerHTML = SECTIONS.map((s) => {
    const label = LANG === 'en' ? s.en : `${s.zh} · ${s.en}`;
    return `<a class="nav-link" href="#${s.id}"><i>${s.num}</i>${label}</a>`;
  }).join('');
  $('#footer-nav').innerHTML = SECTIONS.map(
    (s) => `<a href="#${s.id}">${s.num} / ${LANG === 'en' ? s.en : s.zh}</a>`
  ).join('');
  const mnav = $('.mnav');
  if (mnav) mnav.innerHTML = SECTIONS.map((s) => `<a href="#${s.id}"><i>${s.num}</i>${LANG === 'en' ? s.en : s.zh}</a>`).join('');
}

function renderAbout() {
  const whoami = LANG === 'en'
    ? [
        ['name', 'Yaoshen Yu · 禹尧珅'],
        ['school', 'AI undergrad @ Tongji University'],
        ['gpa', '4.80 / 5.0 · Rank 1/47'],
        ['focus', 'traffic-diffusion · VLM-eval · world-models'],
        ['status', 'PhD offer @ PKU · Signal & Information Processing'],
      ]
    : [
        ['name', '禹尧珅 · Yaoshen Yu'],
        ['school', 'AI undergrad @ Tongji University'],
        ['gpa', '4.80 / 5.0 · Rank 1/47'],
        ['focus', 'traffic-diffusion · VLM-eval · world-models'],
        ['status', 'PhD offer @ PKU · 信号与信息处理'],
      ];
  $('.whoami-body').innerHTML =
    `<span class="cmd">whoami</span>\n` +
    whoami.map(([k, v]) => `<span class="key">${k.padEnd(7, ' ')}</span><span class="val">→</span> ${v}`).join('\n');

  $('#about-bio').textContent = LANG === 'en' ? PROFILE.bioEn : PROFILE.bio;

  const facts = LANG === 'en'
    ? [
        ['EDUCATION', 'Tongji University', 'B.Eng. in AI · 2023—'],
        ['ACADEMICS', 'GPA 4.80 / 5.0', 'Rank 1 / 47'],
        ['INTERNSHIPS', 'PKU PCNI × Tsinghua SIGS', 'Research intern · 2026.03—'],
        ['RESEARCH', 'Traffic / VLM / World models', 'First-author paper @ IEEE TITS (under review)'],
        ['OFFER', 'PKU School of Electronics · PhD', 'Signal & Information Processing · 2026.07'],
        ['LOCATION', PROFILE.locationEn, 'UTC+8 · Shanghai'],
      ]
    : [
        ['EDUCATION', '同济大学', '人工智能 · 工学本科 · 2023—'],
        ['ACADEMICS', 'GPA 4.80 / 5.0', '专业排名 1 / 47'],
        ['INTERNSHIPS', '北大 PCNI × 清华 SIGS', '科研实习 · 2026.03—'],
        ['RESEARCH', '交通生成 / VLM / 世界模型', '一作论文在投 IEEE TITS'],
        ['OFFER', '北大电子学院 直博', '信号与信息处理 · 2026.07 夏令营'],
        ['LOCATION', PROFILE.location, 'UTC+8 · Shanghai'],
      ];
  $('#facts').innerHTML = facts
    .map(([k, v, s]) => `<li><span class="fk">${k}</span><span class="fv">${v}<small>${s}</small></span></li>`)
    .join('');

  $('#interests').innerHTML = (LANG === 'en' ? PROFILE.interestsEn : PROFILE.interests)
    .map((i) => `<span class="chip">${i}</span>`)
    .join('');

  $('#stats').innerHTML = STATS.map(
    (s) =>
      `<div class="stat"><div class="stat-num"><span data-target="${s.value}">0</span><i>+</i></div><div class="stat-label">${LANG === 'en' ? s.labelEn : s.label}</div><span class="stat-suffix">${s.suffix}</span></div>`
  ).join('');
}

function renderResearch() {
  $('#research-list').innerHTML = RESEARCH.map((r) => {
    const outputsLabel = t('research.outcomes');
    const citeLabel = t('research.cite');
    return `
  <article class="research-item" id="r-${r.id}">
    <div class="research-media">
      <span class="rm-tag">${pick(r, 'date')}</span>
      <figure><img src="${r.image}" alt="${r.imageAlt}" loading="lazy" data-lightbox="${r.title}" /></figure>
    </div>
    <div class="research-body">
      <div class="research-index">${r.index}</div>
      <h3 class="research-title">${r.title}</h3>
      <p class="research-sub">${pick(r, 'subtitle')}</p>
      <div class="research-meta">
        <span class="venue">${pick(r, 'venue')}</span>
        <span>${pick(r, 'advisor')}</span>
      </div>
      <p class="research-desc">${pick(r, 'desc')}</p>
      <div class="r-outputs mono">
        <span class="ro-label">${outputsLabel}</span>
        ${pick(r, 'outputs').map((o) => `<span class="ro-item"><i>▸</i>${o}</span>`).join('')}
      </div>
      <div class="rtags">${pick(r, 'tags').map((tg) => `<span class="rtag">${tg}</span>`).join('')}</div>
      <div class="rlinks">
        ${r.links.map((l) => `<a class="rlink" href="${l.url}" target="_blank" rel="noopener">${linkLabel(l)}</a>`).join('')}
        ${r.bibtex ? `<button class="rlink cite-btn" data-bibtex="${r.id}">⧉ ${citeLabel}</button>` : ''}
      </div>
    </div>
  </article>`;
  }).join('');
}

function gCard(p, i) {
  const num = String(i + 1).padStart(2, '0');
  const badges = `<div class="g-card-tags"><span class="g-card-tag">FEATURED</span>${p.copyright ? `<span class="g-card-tag cr">${LANG === 'en' ? '© COPYRIGHT' : '软著 · ©'}</span>` : ''}</div>`;
  const media = p.image
    ? `<div class="g-card-media">${badges}<span class="g-card-index">${num}</span><img src="${p.image}" alt="${p.title}" loading="lazy" draggable="false" data-lightbox="${p.title} ${p.date}" /></div>`
    : `<div class="g-card-media">${badges}<span class="g-card-index">${num}</span><div class="g-card-glyph">${p.title}<br /><span style="font-size:.32em;letter-spacing:.3em;">CODEX · SKILL</span></div></div>`;
  return `
    <article class="g-card${p.image ? '' : ' no-img'}" data-id="${p.id}">
      ${media}
      <div class="g-card-body">
        <div class="g-card-title-row">
          <h3 class="g-card-title">${p.title}<small>${LANG === 'en' ? (p.zh.match(/[a-zA-Z0-9' -]+/) ? p.zh : p.title) : p.zh}</small></h3>
          <span class="g-card-date">${p.date}</span>
        </div>
        <p class="g-card-excerpt">${pick(p, 'excerpt')}</p>
        <div class="g-card-foot">
          <div class="rtags" style="margin-top:0">${pick(p, 'tags').map((tg) => `<span class="rtag">${tg}</span>`).join('')}</div>
          <div class="g-card-links">
            <button class="g-link detail-btn" data-detail="${p.id}">${LANG === 'en' ? 'DETAIL +' : '详情 DETAIL +'}</button>
            ${p.links.map((l) => `<a class="g-link" href="${l.url}" target="_blank" rel="noopener">${linkLabel(l)} ↗</a>`).join('')}
          </div>
        </div>
      </div>
    </article>`;
}

function renderProjects() {
  featured = FEATURED_ORDER.map((id) => PROJECTS.find((p) => p.id === id)).filter(Boolean);
  $('#gallery-total').textContent = String(featured.length).padStart(2, '0');
  $('#gallery-track').innerHTML = featured.map((p, i) => gCard(p, i)).join('');

  const dateKey = (d) => {
    const [y, m] = d.split('.').map(Number);
    return y * 100 + (m || 0);
  };
  sortedProjects = [...PROJECTS].sort((a, b) => dateKey(b.date) - dateKey(a.date));
  $('#proj-total').textContent = String(PROJECTS.length).padStart(2, '0');
  $('#filters').innerHTML = PROJECT_GROUPS.map((g, i) => {
    const count = g.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.group === g.id).length;
    const label = LANG === 'en' ? g.en : g.zh;
    const sub = LANG === 'en' ? `·${count}` : `${g.en}·${count}`;
    return `<button class="filter${i === 0 ? ' active' : ''}" data-group="${g.id}">${label}<small>${sub}</small></button>`;
  }).join('');

  $('#projects-grid').innerHTML = sortedProjects
    .map((p) => {
      const media = p.image
        ? `<img src="${p.image}" alt="${p.title}" loading="lazy" />`
        : `<span class="p-glyph">${p.title}</span>`;
      return `
  <article class="p-card" data-group="${p.group}" data-id="${p.id}">
    <div class="p-media" data-tilt="5">${media}${p.copyright ? `<span class="p-copyright">${LANG === 'en' ? '© CR' : '软著 ©'}</span>` : ''}<span class="p-group">${GROUP_EN_MAP[p.group]}</span><div class="tilt-glare"></div><button class="p-open" data-detail="${p.id}" aria-label="${p.title} detail"></button></div>
    <div class="p-body">
      <div class="p-title-row">
        <h4 class="p-title">${p.title}<small>${p.zh}</small></h4>
        <span class="p-date">${p.date}</span>
      </div>
      <p class="p-excerpt">${pick(p, 'excerpt')}</p>
      <div class="p-tags">${pick(p, 'tags').map((tg) => `<span class="p-tag">${tg}</span>`).join('')}</div>
      <div class="p-links">${p.links
        .map((l) => `<a class="p-link" href="${l.url}" target="_blank" rel="noopener">${linkLabel(l)} ↗</a>`)
        .join('')}</div>
    </div>
  </article>`;
    })
    .join('');
}

function renderJourney() {
  const KIND_TXT = { edu: 'EDU', award: 'AWARD', work: 'WORK', research: 'RESEARCH', offer: 'OFFER' };
  $('#timeline').innerHTML = TIMELINE.map(
    (ti) => `
  <div class="t-item">
    <span class="t-dot"></span>
    <span class="t-year mono">${ti.year}</span><span class="t-kind ${ti.kind}">${KIND_TXT[ti.kind]}</span>
    <h3 class="t-title">${pick(ti, 'title')}</h3>
    <p class="t-org">${pick(ti, 'org')}</p>
    <p class="t-desc">${pick(ti, 'desc')}</p>
  </div>`
  ).join('');

  $('.honors-label').textContent = t('honors.label');
  $('#honors-list').innerHTML = HONORS.map(
    (h) =>
      `<li class="honor${h.hot ? ' hot' : ''}"><span class="h-year">${h.year}</span><span class="h-name">${pick(h, 'name')}</span><span class="h-level">${pick(h, 'level')}</span>${
        h.file ? `<a class="h-file" href="${h.file}" target="_blank" rel="noopener" title="certificate">${t('honors.file')}</a>` : ''
      }</li>`
  ).join('');
}

function renderChangelog() {
  $('#gitlog').innerHTML = CHANGELOG.map(
    (c) => `
  <div class="g-item">
    <div class="g-rail"><span class="g-node"></span></div>
    <div class="g-main">
      <div class="g-head">
        <span class="g-version">${c.version}</span>
        <span class="g-tag ${c.tag.toLowerCase()}">${c.tag}</span>
        <span class="g-hash mono">${c.hash}</span>
        <span class="g-date mono">${c.date}</span>
      </div>
      <ul class="g-items">${pick(c, 'items').map((it) => `<li>${it}</li>`).join('')}</ul>
    </div>
  </div>`
  ).join('');
}

const LINK_EN = { '官网 Website': 'Website', '详情 Details': 'Details', '论文 Paper': 'Paper', '代码 Code': 'Code' };
function linkLabel(l) {
  if (LANG !== 'en') return l.label;
  return LINK_EN[l.label] || l.label;
}
function renderContact() {
  $('#contact-links').innerHTML = [
    { label: 'GitHub ↗', url: PROFILE.github },
    { label: 'Blog ↗', url: PROFILE.blog },
    { label: 'Films ↗', url: PROFILE.films },
    { label: LANG === 'en' ? 'CV ↓' : 'CV ↓', url: PROFILE.cv },
  ]
    .map((l) => `<a class="btn btn-ghost" href="${l.url}" target="_blank" rel="noopener" data-magnet>${l.label}</a>`)
    .join('');
}

function renderMarquee() {
  const list = LANG === 'en' ? PROFILE.marqueeEn : PROFILE.marquee;
  const items = list.map((m) => `<span class="mq-item">${m}</span>`).join('');
  $('#marquee-track').innerHTML = items + items;
}

function renderAll() {
  renderStaticCopy();
  renderNav();
  renderAbout();
  renderResearch();
  renderProjects();
  renderJourney();
  renderChangelog();
  renderContact();
  renderMarquee();
  document.title = LANG === 'en' ? 'Yaoshen Yu · SHEN-OS — AI Researcher / Engineer' : '禹尧珅 · SHEN-OS — AI 研究者 / 工程师';
}

/* ============================================================
   2. three.js 按需加载（进入视口才 import + 初始化）
   ============================================================ */
let heroScene = null;
let contactScene = null;
const sceneState = { heroRequested: false, contactRequested: false };

async function ensureHeroScene() {
  if (sceneState.heroRequested || REDUCED) return;
  sceneState.heroRequested = true;
  const { createHeroScene } = await import('./three/heroScene.js');
  heroScene = createHeroScene($('#hero-canvas'));
  window.__shen = window.__shen || {};
  window.__shen.heroScene = heroScene;
  onScrollUpdate(window.scrollY, window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
  new IntersectionObserver(
    (entries) => entries.forEach((en) => heroScene?.setActive(en.isIntersecting)),
    { threshold: 0 }
  ).observe($('#hero-canvas'));
  bindSceneTicker();
}

async function ensureContactScene() {
  if (sceneState.contactRequested || REDUCED) return;
  sceneState.contactRequested = true;
  const { createContactScene } = await import('./three/contactScene.js');
  contactScene = createContactScene($('#contact-canvas'));
  window.__shen = window.__shen || {};
  window.__shen.contactScene = contactScene;
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 90%',
    end: 'top 10%',
    scrub: true,
    onUpdate: (self) => contactScene.setAppear(self.progress),
  });
  new IntersectionObserver(
    (entries) => entries.forEach((en) => contactScene?.setActive(en.isIntersecting)),
    { threshold: 0 }
  ).observe($('#contact-canvas'));
  bindSceneTicker();
}

let sceneTickerBound = false;
function bindSceneTicker() {
  if (sceneTickerBound) return;
  sceneTickerBound = true;
  gsap.ticker.add(() => {
    heroScene?.tick();
    contactScene?.tick();
  });
}

/* ============================================================
   3. 平滑滚动 + 全局交互
   ============================================================ */
const lenis = LIGHT ? null : new Lenis({ lerp: 0.09, wheelMultiplier: 1 });
let lenisStarted = false;

const nav = $('#nav');
let lastY = 0;
function onScrollUpdate(y, progress) {
  nav.classList.toggle('scrolled', y > 40);
  if (y < window.innerHeight * 0.4) $$('.nav-link').forEach((l) => l.classList.remove('active'));
  if (y > 480 && y > lastY + 2) nav.classList.add('hidden');
  else if (y < lastY - 2) nav.classList.remove('hidden');
  lastY = y;
  $('#scroll-progress').style.transform = `scaleX(${progress || 0})`;
  heroScene?.setProgress(Math.min(1, y / window.innerHeight));
}

if (lenis) {
  lenis.stop();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((tms) => lenis.raf(tms * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.on('scroll', (e) => onScrollUpdate(e.scroll, e.progress));
} else {
  lenisStarted = true;
  const doc = document.documentElement;
  window.addEventListener(
    'scroll',
    () => onScrollUpdate(window.scrollY, window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight)),
    { passive: true }
  );
}

// 锚点滚动
function scrollToHash(id) {
  const target = $(id);
  if (!target) return;
  if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4 });
  else target.scrollIntoView({ behavior: 'smooth' });
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href');
  if (id.length < 2) return;
  if (!$(id)) return;
  e.preventDefault();
  closeMenu();
  scrollToHash(id);
});

// 时钟
function tickClock() {
  $('#nav-clock').textContent = new Date().toLocaleTimeString(LANG === 'en' ? 'en-US' : 'zh-CN', { hour12: false });
}
setInterval(tickClock, 1000);

// 移动端菜单
function closeMenu() {
  setMenu(false);
}

// 筛选（委托到 grid 容器，语言切换后依然有效）
function bindFilters() {
  $('#filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn || btn.classList.contains('active')) return;
    $$('.filter').forEach((f) => f.classList.remove('active'));
    btn.classList.add('active');
    const g = btn.dataset.group;
    $$('.p-card').forEach((card) => {
      const show = g === 'all' || card.dataset.group === g;
      if (show) {
        card.style.display = '';
        requestAnimationFrame(() => requestAnimationFrame(() => card.classList.remove('filtered')));
      } else {
        card.classList.add('filtered');
        setTimeout(() => {
          if (card.classList.contains('filtered')) card.style.display = 'none';
        }, 380);
      }
    });
    setTimeout(() => ScrollTrigger.refresh(), 450);
  });
}

/* ============================================================
   4. 画廊原生拖动
   ============================================================ */
function initGalleryDrag() {
  const scroller = $('#gallery-scroller');
  const track = $('#gallery-track');
  if (!scroller) return;

  const update = () => {
    const max = scroller.scrollWidth - scroller.clientWidth;
    const p = max > 0 ? scroller.scrollLeft / max : 0;
    $('.gallery-progress span').style.setProperty('--gp', p.toFixed(4));
    $('#gallery-cur').textContent = String(Math.min(featured.length, Math.round(p * (featured.length - 1)) + 1)).padStart(2, '0');
  };
  scroller.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  let dragging = null;
  let suppressClick = false;
  let inertiaId = 0;
  scroller.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') return;
    cancelAnimationFrame(inertiaId);
    dragging = { x: e.clientX, left: scroller.scrollLeft, moved: 0, v: 0, t: performance.now(), px: e.clientX };
    scroller.classList.add('dragging');
  });
  window.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const now = performance.now();
    const dt = Math.max(8, now - dragging.t);
    const dx = e.clientX - dragging.x;
    dragging.v = dragging.v * 0.7 + ((e.clientX - dragging.px) / dt) * 1000 * 0.3;
    dragging.px = e.clientX;
    dragging.t = now;
    dragging.moved = Math.max(dragging.moved, Math.abs(dx));
    scroller.scrollLeft = dragging.left - dx;
  });
  window.addEventListener('pointerup', () => {
    if (!dragging) return;
    const v = -dragging.v;
    suppressClick = dragging.moved > 8;
    scroller.classList.remove('dragging');
    dragging = null;
    if (Math.abs(v) > 120) {
      let vel = v;
      const step = () => {
        vel *= 0.94;
        scroller.scrollLeft += vel / 60;
        if (Math.abs(vel) > 4) inertiaId = requestAnimationFrame(step);
      };
      inertiaId = requestAnimationFrame(step);
    }
  });
  track.addEventListener(
    'click',
    (e) => {
      if (suppressClick) {
        suppressClick = false;
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
}

/* ============================================================
   5. 滚动动效
   ============================================================ */
let dynamicCleanup = null;
function bindDynamic() {
  dynamicCleanup?.();
  dynamicCleanup = null;
  initTilt();
  dynamicCleanup = initMagnet() || null;
  bindFiltersOnce();
}
let filtersBound = false;
function bindFiltersOnce() {
  if (filtersBound) return;
  filtersBound = true;
  bindFilters();
}

/* ============================================================
   5. 滚动动效
   ============================================================ */
let fxBound = false;
function initScrollFX() {
  if (REDUCED) {
    $$('.stat-num span').forEach((el) => (el.textContent = el.dataset.target));
    initGalleryDrag();
    initNavActive();
    return;
  }

  if (fxBound) {
    ScrollTrigger.refresh();
    return;
  }
  fxBound = true;

  $$('.section-head').forEach((head) => {
    gsap.fromTo(
      head.children,
      { y: 46, opacity: 0, filter: 'blur(8px)' },
      {
        y: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: head, start: 'top 82%', once: true },
      }
    );
  });

  gsap.fromTo('#about-left', { x: -56, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#about', start: 'top 70%', once: true } });

  $$('.research-item').forEach((item) => {
    gsap.fromTo(
      item.querySelector('.research-media'),
      { clipPath: 'inset(10% 8% 10% 8% round 20px)', opacity: 0.4 },
      { clipPath: 'inset(0% 0% 0% 0% round 20px)', opacity: 1, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 72%', once: true } }
    );
  });

  ScrollTrigger.batch('.research-item .research-body > *, .g-item, .t-item, .honor, .stat, .p-card', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(batch, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.06, ease: 'power3.out', overwrite: true }),
  });

  $$('.research-item .research-media img').forEach((img) => {
    gsap.fromTo(
      img,
      { yPercent: -4, scale: 1.08 },
      { yPercent: 4, scale: 1.02, ease: 'none', scrollTrigger: { trigger: img.closest('.research-item'), start: 'top bottom', end: 'bottom top', scrub: 1 } }
    );
  });

  initGalleryDrag();

  gsap.fromTo('.contact-cta > *', { y: 44, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.contact-cta', start: 'top 78%', once: true } });

  initNavActive();

  // three.js 懒加载触发点
  ScrollTrigger.create({ trigger: '#hero', start: 'top bottom', once: true, onEnter: ensureHeroScene });
  ScrollTrigger.create({ trigger: '#contact', start: 'top bottom', once: true, onEnter: ensureContactScene });
}

function initNavActive() {
  SECTIONS.forEach((s) => {
    ScrollTrigger.create({
      trigger: `#${s.id}`,
      start: 'top 45%',
      end: 'bottom 45%',
      onToggle(self) {
        if (self.isActive) {
          $$('.nav-link').forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${s.id}`));
        }
      },
    });
  });
}

/* ============================================================
   6. 统计数字动画（renderAbout 后按需触发）
   ============================================================ */
function animateStats() {
  if (REDUCED) {
    $$('.stat-num span').forEach((el) => (el.textContent = el.dataset.target));
    return;
  }
  $$('.stat-num span').forEach((el) => {
    const target = +el.dataset.target;
    const obj = { v: 0 };
    gsap.to(obj, {
      v: target, duration: 1.8, ease: 'power2.out', snap: { v: 1 },
      onUpdate: () => (el.textContent = obj.v),
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/* ============================================================
   7. Hero 入场
   ============================================================ */
function heroIntro() {
  const typedEl = $('#hero-typed');
  const chars = $$('.hn-char');
  if (LIGHT) {
    gsap.set(['.hero-prompt', '.hn-char', '.hero-name-en span', '.hero-tagline', '.hero-cta .btn', '.hero-meta', '.hero-scroll', '.hero-frame'], { opacity: 1 });
    typedEl.textContent = 'whoami';
    return;
  }
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.fromTo('.hero-prompt', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0.05)
    .fromTo(chars, { yPercent: 60, opacity: 0, filter: 'blur(14px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.15, stagger: 0.1 }, 0.15)
    .fromTo('.hero-name-en span', { opacity: 0, letterSpacing: '0.6em' }, { opacity: 1, letterSpacing: '0.22em', duration: 1.6, ease: 'power2.out' }, 0.35)
    .fromTo('.hero-tagline', { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.9 }, 0.75)
    .fromTo('.hero-cta .btn', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.9)
    .fromTo(['.hero-meta', '.hero-scroll', '.hero-frame'], { opacity: 0 }, { opacity: 1, duration: 1.1, stagger: 0.08 }, 1.05);

  let i = 0;
  const text = 'whoami';
  setTimeout(function type() {
    if (i <= text.length) {
      typedEl.textContent = text.slice(0, i++);
      setTimeout(type, 92);
    }
  }, 420);
}

if (!LIGHT) {
  gsap.set(['.hero-prompt', '.hn-char', '.hero-name-en span', '.hero-tagline', '.hero-cta .btn', '.hero-meta', '.hero-scroll', '.hero-frame'], { opacity: 0 });
}

/* ============================================================
   8. Toast
   ============================================================ */
function toast(msg) {
  const root = $('#toast-root');
  const el = document.createElement('div');
  el.className = 'toast mono';
  el.textContent = msg;
  root.appendChild(el);
  gsap.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
  setTimeout(() => {
    gsap.to(el, { y: 16, opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: () => el.remove() });
  }, 2400);
}

/* ============================================================
   9. BibTeX 复制
   ============================================================ */
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-bibtex]');
  if (!btn) return;
  const r = RESEARCH.find((x) => x.id === btn.dataset.bibtex);
  if (!r?.bibtex) return;
  try {
    await navigator.clipboard.writeText(r.bibtex);
    toast(t('toast.copied'));
  } catch {
    // 剪贴板 API 不可用时降级
    const ta = document.createElement('textarea');
    ta.value = r.bibtex;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      toast(t('toast.copied'));
    } catch {
      toast(t('toast.copyFail'));
    }
    ta.remove();
  }
});

/* ============================================================
   10. 项目详情弹窗
   ============================================================ */
let modalClosing = false;
function openProjectModal(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;
  // 若上一次关闭动画未完成，先同步清场，避免其 onComplete 吞掉新弹窗
  gsap.killTweensOf('.modal');
  const root = $('#modal-root');
  root.innerHTML = '';
  modalClosing = false;
  document.body.classList.add('overlay-open');
  const media = p.image
    ? `<div class="pm-media"><img src="${p.image}" alt="${p.title}" data-lightbox="${p.title}" /></div>`
    : `<div class="pm-media pm-noimg"><span class="p-glyph">${p.title}</span></div>`;
  root.innerHTML = `
  <div class="modal-backdrop" data-close></div>
  <div class="modal" role="dialog" aria-modal="true" aria-label="${p.title}">
    <button class="modal-close mono" data-close aria-label="close">✕ ESC</button>
    ${media}
    <div class="pm-body">
      <div class="pm-tags">
        <span class="rtag">${GROUP_EN_MAP[p.group]}</span>
        ${p.copyright ? `<span class="rtag cr">ⓒ ${t('modal.copyright')}</span>` : ''}
        <span class="rtag">${t('modal.updated')} ${p.date}</span>
      </div>
      <h3 class="pm-title">${p.title}<small>${p.zh}</small></h3>
      <p class="pm-details">${pick(p, 'details')}</p>
      <div class="rtags">${pick(p, 'tags').map((tg) => `<span class="rtag">${tg}</span>`).join('')}</div>
      <div class="rlinks">${p.links.map((l) => `<a class="rlink" href="${l.url}" target="_blank" rel="noopener">${linkLabel(l)}</a>`).join('')}</div>
    </div>
  </div>`;
  document.body.style.overflow = 'hidden';
  lenis?.stop();
  gsap.fromTo('.modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.3 });
  gsap.fromTo('.modal', { opacity: 0, scale: 0.965 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out', clearProps: 'transform' });
  // 焦点管理：记录触发元素 → focus 关闭钮 → Tab 循环限制在弹窗内
  modalReturnFocus = document.activeElement;
  setTimeout(() => $('.modal-close')?.focus(), 80);
}
let modalReturnFocus = null;
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || !$('#modal-root').firstChild) return;
  const focusables = $$('#modal-root .modal a[href], #modal-root .modal button, #modal-root .modal [tabindex]');
  if (!focusables.length) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});
function closeModal() {
  const root = $('#modal-root');
  if (!root.firstChild || modalClosing) return;
  modalClosing = true;
  gsap.to('.modal', {
    opacity: 0, scale: 0.97, duration: 0.24, ease: 'power2.in',
    onComplete: () => {
      if (modalClosing) {
        root.innerHTML = '';
        document.body.style.overflow = '';
        document.body.classList.remove('overlay-open');
        lenis?.start();
        modalReturnFocus?.focus?.();
        modalReturnFocus = null;
      }
      modalClosing = false;
    },
  });
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-detail]')) openProjectModal(e.target.closest('[data-detail]').dataset.detail);
  if (e.target.closest('[data-close]')) closeModal();
});

// ---------- 图片放大预览（研究图 / 弹窗大图 / 画廊大图） ----------
function openLightbox(src, caption) {
  const root = $('#modal-root');
  root.innerHTML = `
  <div class="modal-backdrop" data-close></div>
  <figure class="lightbox" role="dialog" aria-modal="true" aria-label="${caption || 'image preview'}">
    <img src="${src}" alt="${caption || ''}" />
    ${caption ? `<figcaption class="mono">${caption} · <span data-close style="cursor:pointer">CLOSE ✕</span></figcaption>` : ''}
  </figure>`;
  document.body.classList.add('overlay-open');
  lenis?.stop();
  gsap.fromTo('.modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.3 });
  gsap.fromTo('.lightbox', { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out', clearProps: 'transform' });
  modalReturnFocus = document.activeElement;
}
document.addEventListener('click', (e) => {
  const img = e.target.closest('img[data-lightbox]');
  if (img && !e.target.closest('.lightbox')) {
    e.preventDefault();
    openLightbox(img.getAttribute('src'), img.dataset.lightbox);
  }
});
// 弹窗/面板打开时：滚轮只作用于浮层内部，不透传给页面（Lenis 已 stop，防触摸板“卡住”）
window.addEventListener(
  'wheel',
  (e) => {
    if (!document.body.classList.contains('overlay-open')) return;
    const scroller = e.target.closest?.('.modal, .palette-list');
    if (scroller) {
      e.preventDefault();
      scroller.scrollTop += e.deltaY;
    } else {
      e.preventDefault();
    }
  },
  { passive: false }
);
// 触屏：touchmove 同理只允许浮层内部滚动
window.addEventListener(
  'touchmove',
  (e) => {
    const overlay = document.body.classList.contains('overlay-open');
    const menu = document.body.classList.contains('menu-open');
    if (!overlay && !menu) return;
    if (!e.target.closest?.('.modal, .palette-list')) e.preventDefault();
  },
  { passive: false }
);
window.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  // 层级退出：一次 ESC 只关最上层（palette > modal > menu）
  if (palette.open) {
    closePalette();
  } else if ($('#modal-root').firstChild) {
    closeModal();
  } else if (document.body.classList.contains('menu-open')) {
    setMenu(false);
  }
});

/* ============================================================
   11. Ctrl+K 命令面板
   ============================================================ */
const palette = {
  open: false,
  idx: 0,
  items: [],
};

function buildPaletteItems() {
  const [gNav, gProj, gRes, gAct] = t('palette.groups').split('|');
  const items = [];
  SECTIONS.forEach((s) =>
    items.push({ group: gNav, icon: '▸', label: LANG === 'en' ? s.en : `${s.zh} — ${s.en}`, run: () => scrollToHash(`#${s.id}`) })
  );
  PROJECTS.forEach((p) =>
    items.push({
      group: gProj,
      icon: '⬡',
      label: `${p.title} · ${p.zh}`,
      hint: p.date,
      run: () => openProjectModal(p.id),
    })
  );
  RESEARCH.forEach((r) =>
    items.push({
      group: gRes,
      icon: '✦',
      label: r.title,
      hint: LANG === 'en' ? r.en.venue : r.venue,
      run: () => scrollToHash(`#r-${r.id}`),
    })
  );
  items.push(
    { group: gAct, icon: '✉', label: LANG === 'en' ? 'Copy email' : '复制邮箱', hint: PROFILE.email, run: () => navigator.clipboard.writeText(PROFILE.email).then(() => toast(LANG === 'en' ? 'Email copied ✓' : '邮箱已复制 ✓')) },
    { group: gAct, icon: '⤓', label: LANG === 'en' ? 'Download CV' : '下载 CV', run: () => window.open(PROFILE.cv, '_blank') },
    { group: gAct, icon: '⌐', label: LANG === 'en' ? 'View GitHub' : '打开 GitHub', run: () => window.open(PROFILE.github, '_blank') },
    { group: gAct, icon: '文', label: LANG === 'en' ? '切换到中文' : 'Switch to English', run: () => setLang(LANG === 'en' ? 'zh' : 'en') }
  );
  return items;
}

function renderPaletteList(q = '') {
  const listEl = $('#palette-list');
  const query = q.trim().toLowerCase();
  palette.items = buildPaletteItems().filter((it) => !query || it.label.toLowerCase().includes(query));
  palette.idx = 0;
  if (!palette.items.length) {
    listEl.innerHTML = `<p class="pl-empty mono">${LANG === 'en' ? '// no results — try another keyword' : '// 无结果 — 换个关键词试试'}</p>`;
    return;
  }
  let lastGroup = '';
  listEl.innerHTML = palette.items
    .map((it, i) => {
      const groupHeader = it.group !== lastGroup ? `<p class="pl-group mono">${it.group}</p>` : '';
      lastGroup = it.group;
      return `${groupHeader}<button class="pl-item${i === 0 ? ' active' : ''}" data-idx="${i}"><span class="pli-icon">${it.icon}</span><span class="pli-label">${it.label}</span>${it.hint ? `<span class="pli-hint mono">${it.hint}</span>` : ''}</button>`;
    })
    .join('');
}

function openPalette() {
  if (palette.open) return;
  palette.open = true;
  document.body.classList.add('overlay-open');
  const root = $('#palette-root');
  root.innerHTML = `
  <div class="palette-backdrop" data-pclose></div>
  <div class="palette mono" role="dialog" aria-modal="true">
    <div class="palette-input-row"><span class="pl-prompt">❯</span><input id="palette-input" type="text" placeholder="${t('palette.placeholder')}" autocomplete="off" spellcheck="false" /></div>
    <div id="palette-list" class="palette-list"></div>
    <p class="palette-hint">${t('palette.hint')}</p>
  </div>`;
  gsap.fromTo('.palette-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.25 });
  gsap.fromTo('.palette', { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out', clearProps: 'transform' });
  renderPaletteList();
  const input = $('#palette-input');
  input.addEventListener('input', () => renderPaletteList(input.value));
  input.addEventListener('keydown', (e) => {
    const btns = $$('.pl-item');
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      palette.idx = (palette.idx + (e.key === 'ArrowDown' ? 1 : -1) + btns.length) % btns.length;
      btns.forEach((b, i) => b.classList.toggle('active', i === palette.idx));
      btns[palette.idx]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      const it = palette.items[palette.idx];
      if (it) closePalette();
      it?.run();
    }
  });
  setTimeout(() => input.focus(), 50);
}
function closePalette() {
  if (!palette.open) return;
  palette.open = false;
  $('#palette-root').innerHTML = '';
  if (!$('#modal-root').firstChild) document.body.classList.remove('overlay-open');
}
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-pclose]')) closePalette();
  const item = e.target.closest('.pl-item');
  if (item) {
    const it = palette.items[+item.dataset.idx];
    closePalette();
    it?.run();
  }
});
window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    palette.open ? closePalette() : openPalette();
  }
});

/* ============================================================
   12. 语言切换
   ============================================================ */
function setLang(lang) {
  if (LANG === lang) return;
  LANG = lang;
  localStorage.setItem('shen-lang', lang);
  document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
  renderAll();
  bindDynamic();
  animateStats();
  initScrollFX();
  tickClock();
  $('.lt-zh').classList.toggle('on', lang === 'zh');
  $('.lt-en').classList.toggle('on', lang === 'en');
}

/* ============================================================
   13. 启动
   ============================================================ */
// 初始渲染
renderAll();
bindDynamic();
initCursor();
initScrollFX();
animateStats();
tickClock();
$('.lt-zh').classList.toggle('on', LANG === 'zh');
$('.lt-en').classList.toggle('on', LANG === 'en');
$('#lang-toggle').addEventListener('click', () => setLang(LANG === 'zh' ? 'en' : 'zh'));

// 汉堡菜单
const mnav = document.createElement('nav');
mnav.className = 'mnav';
document.body.appendChild(mnav);
renderNav();
const burger = document.createElement('button');
burger.className = 'burger';
burger.setAttribute('aria-label', '菜单');
burger.innerHTML = '<span></span><span></span><span></span>';
$('.nav').appendChild(burger);
function setMenu(open) {
  mnav.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  if (open) {
    lenis?.stop();
    document.body.style.overflow = 'hidden';
  } else if (!$('#modal-root').firstChild && !palette.open) {
    lenis?.start();
    document.body.style.overflow = '';
  }
}
burger.addEventListener('click', () => setMenu(!mnav.classList.contains('open')));
mnav.addEventListener('click', (e) => {
  if (e.target === mnav) setMenu(false); // 点空白关闭
});

document.addEventListener('boot:done', () => {
  lenisStarted = true;
  lenis?.start();
  heroIntro();
  ScrollTrigger.refresh();
  ensureHeroScene();
});

runBoot(gsap, STATIC_MODE);

// PWA：生产环境注册 Service Worker
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}

console.log(
  '%c SHEN-OS v2.7.0 %c 禹尧珅 · Yaoshen Yu \n%c> 你好，同是极客的朋友。Ctrl+K 打开命令面板。\n> 源码与更多工程 → https://github.com/yys806',
  'background:#3dff88;color:#04120a;padding:4px 8px;border-radius:4px 0 0 4px;font-weight:bold',
  'background:#0a0a0f;color:#3dff88;padding:4px 8px;border-radius:0 4px 4px 0',
  'color:#3dff88;padding:6px 0;line-height:1.8'
);
