// ============================================================
// SHEN-OS 内容数据层 —— 禹尧珅 · Yaoshen Yu
// 中英双语：zh 为主字段，en 为英文子对象；修改内容只改这里
// ============================================================

export const PROFILE = {
  nameZh: '禹尧珅',
  nameEn: 'YAOSHEN YU',
  handle: 'yys806',
  role: '同济大学 · 人工智能',
  tagline: '在混合自主交通、世界模型与多模态评测的交叉处，<br />造有用的东西。',
  taglineEn: 'At the intersection of mixed-autonomy traffic, world models,<br />and multimodal evaluation — building useful things.',
  bio: '我是禹尧珅，同济大学人工智能专业本科生。我的工作位于混合自主交通生成、视觉语言模型评测、网络状态世界模型、嵌入式系统与产品化软件工程的交叉地带——一半时间写论文，另一半时间把想法做成真的能用的产品。',
  bioEn:
    'I am Yaoshen Yu, an AI undergraduate at Tongji University. My work sits at the intersection of mixed-autonomy traffic generation, VLM evaluation, network-state world models, embedded systems, and product-oriented software — half my time writing papers, the other half turning ideas into products people actually use.',
  location: '上海 / 云南',
  locationEn: 'Shanghai / Yunnan',
  email: '2352396@tongji.edu.cn',
  github: 'https://github.com/yys806',
  blog: 'https://yys806.github.io/',
  films: 'https://shen806.de5.net/',
  avatar: 'assets/img/profile.webp',
  cv: 'assets/files/yaoshen-yu-cv.pdf',
  interests: ['魔方 Cubing', '跑步 Running', '电影 Films', '造小工具 Tiny Tools'],
  interestsEn: ['Cubing', 'Running', 'Films', 'Tiny Tools'],
  marquee: [
    '混合自主交通生成',
    'VLM EVALUATION',
    'WORLD MODELS',
    '扩散模型 DIFFUSION',
    '嵌入式系统 EMBEDDED',
    '产品工程 PRODUCT',
    '一作在投 IEEE TITS',
    '国家奖学金',
    'PYTHON / C++ / CUDA',
    'RISC-V / FPGA',
  ],
  marqueeEn: [
    'MIXED-AUTONOMY TRAFFIC',
    'VLM EVALUATION',
    'WORLD MODELS',
    'DIFFUSION MODELS',
    'EMBEDDED SYSTEMS',
    'PRODUCT ENGINEERING',
    '1ST AUTHOR @ IEEE TITS',
    'NATIONAL SCHOLARSHIP',
    'PYTHON / C++ / CUDA',
    'RISC-V / FPGA',
  ],
};

export const STATS = [
  { value: '3', label: '研究项目', labelEn: 'Research', suffix: 'RESEARCH' },
  { value: '24', label: '项目工程', labelEn: 'Projects', suffix: 'PROJECTS' },
  { value: '12', label: '奖项荣誉', labelEn: 'Awards', suffix: 'AWARDS' },
  { value: '2', label: '软件著作权', labelEn: 'Copyrights', suffix: 'COPYRIGHTS' },
];

// ---------------- 研究 RESEARCH ----------------

export const RESEARCH = [
  {
    id: 'drift',
    index: '01',
    title: 'DRIFT',
    subtitle: '面向混合自主交通生成的风险约束扩散模型',
    venue: '在投 IEEE TITS · arXiv:2606.16589 · 第一作者',
    date: '2025.11 — 至今',
    advisor: '指导：李王明卉 教授（同济大学）',
    tags: ['第一作者论文', '扩散模型', '混合自主交通', '模仿学习', '代码开源'],
    desc: '研究人类驾驶与自动驾驶车辆混行系统中的轨迹生成问题。与把生成当作离线采样不同，DRIFT 将生成、筛选、选择与验证统一进可执行交通动力学的闭环：异质性感知条件编码 + 条件扩散轨迹生成 + 模仿先验 + 带风险感知长尾反馈的渐进式对抗对齐。评估覆盖安全性、效率与闭环稳定性。',
    outputs: [
      '论文在投 IEEE TITS（IEEE Trans. on Intelligent Transportation Systems，审稿中）',
      'arXiv 预印本已发布：2606.16589',
      '论文工程与实验代码开源（drift-paper-code）',
    ],
    image: 'assets/img/research/drift-framework.webp',
    imageAlt: 'DRIFT 整体框架图',
    links: [
      { label: '论文 Paper', url: 'http://arxiv.org/abs/2606.16589' },
      { label: '代码 Code', url: 'https://github.com/yys806/drift-paper-code' },
    ],
    bibtex: `@article{yu2026drift,
  title   = {DRIFT: Risk-Constrained Diffusion with Imitation Priors for Mixed-Autonomy Traffic Generation},
  author  = {Yu, Yaoshen and Liwang, Minghui and Zhu, Wenbo and Yi, Xinlei and Hong, Yiguang and Su, Yuhan and Hosseinalipour, Seyyedali},
  journal = {arXiv preprint arXiv:2606.16589},
  year    = {2026},
  note    = {Under review at IEEE TITS}
}`,
    en: {
      subtitle: 'Risk-constrained diffusion for mixed-autonomy traffic generation',
      venue: 'Under review at IEEE TITS · arXiv:2606.16589 · First author',
      date: '2025.11 — Present',
      advisor: 'Advisor: Prof. Minghui Liwang (Tongji University)',
      tags: ['First-author Paper', 'Diffusion Model', 'Mixed-Autonomy Traffic', 'Imitation Learning', 'Open Source'],
      desc: 'I study trajectory generation for mixed-autonomy traffic, where human-driven and autonomous vehicles interact under uncertainty, heterogeneity, and safety-critical coupling. Instead of treating generation as offline sampling, DRIFT unifies generation, filtering, selection, and validation inside a closed loop of executable traffic dynamics: heterogeneity-aware conditional encoding, conditional diffusion with imitation priors, and progressive adversarial alignment with risk-aware long-tail feedback. Evaluation covers safety, efficiency, and closed-loop stability.',
      outputs: [
        'Paper under review at IEEE TITS (IEEE Trans. on Intelligent Transportation Systems)',
        'arXiv preprint released: 2606.16589',
        'Paper & experiment code open-sourced (drift-paper-code)',
      ],
    },
  },
  {
    id: 'traffic-vlm',
    index: '02',
    title: 'Traffic VLM Evaluation',
    subtitle: '交通场景视觉语言模型评测与偏差诊断',
    venue: '清华大学深圳国际研究生院 · 科研实习',
    date: '2026.03 — 至今',
    advisor: '指导：陈鑫磊 教授课题组',
    tags: ['科研实习', 'VLM 评测', '视觉定位', '反事实诊断', '代码开源'],
    desc: '研究视觉语言模型如何理解交通场景：从驾驶与航拍数据构建 VQA 评测样例，在受控视觉变化下评估模型回答，对比反事实编辑前后的归因与显著性信号——判断模型的答案究竟由目标车辆支撑，还是被背景、上下文捷径等伪相关视觉证据带偏。',
    outputs: [
      '构建交通场景 VQA 评测流水线（驾驶 / 航拍双视角数据）',
      '验证反事实编辑下的视觉证据偏移，形成偏差诊断方法',
      '评测与诊断代码开源（traffic-vlm-eval-bias-analysis）',
    ],
    image: 'assets/img/research/traffic-vlm-attention.webp',
    imageAlt: '交通 VLM 反事实编辑前后显著性对比',
    links: [{ label: '代码 Code', url: 'https://github.com/yys806/traffic-vlm-eval-bias-analysis' }],
    bibtex: `@misc{yu2026trafficvlm,
  title        = {Traffic-Scene VLM Evaluation and Bias Diagnostics},
  author       = {Yu, Yaoshen},
  year         = {2026},
  howpublished = {\\url{https://github.com/yys806/traffic-vlm-eval-bias-analysis}},
  note         = {Research internship at Tsinghua SIGS}
}`,
    en: {
      subtitle: 'VLM evaluation & bias diagnostics for traffic scenes',
      venue: 'Research internship · Tsinghua SIGS',
      date: '2026.03 — Present',
      advisor: "Advisor: Prof. Xinlei Chen's group",
      tags: ['Research Internship', 'VLM Evaluation', 'Visual Grounding', 'Counterfactual Diagnostics', 'Open Source'],
      desc: 'How do vision-language models understand traffic scenes? I build VQA evaluation cases from driving and aerial-view datasets, evaluate model answers under controlled visual changes, and compare attribution and saliency signals before and after counterfactual editing — diagnosing whether an answer is truly supported by the queried vehicle or driven by background context and spurious shortcuts.',
      outputs: [
        'Built a traffic-scene VQA evaluation pipeline (driving + aerial views)',
        'Validated counterfactual evidence-shift diagnostics for VLM bias',
        'Evaluation code open-sourced (traffic-vlm-eval-bias-analysis)',
      ],
    },
  },
  {
    id: 'world-model',
    index: '03',
    title: 'Network-State World Model',
    subtitle: '网络状态动力学的世界模型学习',
    venue: '北京大学电子学院 PCNI 课题组 · 科研实习',
    date: '2026.03 — 至今',
    advisor: '指导：张嘉楠 教授',
    tags: ['科研实习', '世界模型', '动作条件预测', '图网络', '代码开源'],
    desc: '基于 AirFogSim 风格的网络轨迹，建模边缘动作、任务状态与链路状态随时间演化的过程。对比基线预测器、结构化双分支模型与图 rollout 变体，用预测精度、跨种子稳定性、鲁棒性与运行时开销作为评估信号，探索世界模型信号在训练中的价值。',
    outputs: [
      '建立基线 / 双分支 / 图 rollout 三类模型对比体系',
      '完成动作条件预测实验：精度、跨种子稳定性与鲁棒性评估',
      '训练与评估代码开源（network-state-world-model）',
    ],
    image: 'assets/img/research/network-world-model-prediction.webp',
    imageAlt: '动作条件链路速率预测曲线',
    links: [{ label: '代码 Code', url: 'https://github.com/yys806/network-state-world-model' }],
    bibtex: `@misc{yu2026networkwm,
  title        = {World-Model Learning for Network-State Dynamics},
  author       = {Yu, Yaoshen},
  year         = {2026},
  howpublished = {\\url{https://github.com/yys806/network-state-world-model}},
  note         = {Research internship at PKU PCNI Group}
}`,
    en: {
      subtitle: 'World-model learning for network-state dynamics',
      venue: 'Research internship · PKU PCNI Group',
      date: '2026.03 — Present',
      advisor: 'Advisor: Prof. Jianan Zhang',
      tags: ['Research Internship', 'World Models', 'Action-conditioned Prediction', 'Graph Networks', 'Open Source'],
      desc: 'Based on AirFogSim-style network trajectories, I model how edge actions, task states, and link conditions evolve over time. The project compares baseline predictors, structured dual-branch models, and graph-rollout variants, using prediction accuracy, cross-seed stability, robustness, and runtime as evaluation signals for world-model learning.',
      outputs: [
        'Established a three-way comparison: baselines vs dual-branch vs graph rollout',
        'Completed action-conditioned prediction experiments (accuracy, stability, robustness)',
        'Training & evaluation code open-sourced (network-state-world-model)',
      ],
    },
  },
];

// ---------------- 项目 PROJECTS ----------------
// FEATURED_ORDER: 精选画廊顺序；group: web|course|campus|other
// copyright: 有软著；details: 详情（弹窗）；en: { excerpt, details }

export const FEATURED_ORDER = ['mirror-room', 'luxiaoji', 'shen-ppt', 'shenyu', 'mathsnap', 'cyber-oracle'];

export const PROJECTS = [
  {
    id: 'luxiaoji',
    title: '噜小记',
    zh: '双人情侣生活小程序',
    group: 'web',
    featured: true,
    date: '2026.08',
    excerpt: '只供两人使用的微信小程序：双向点单与噜币体系、恋爱空间（日记/相册/日历/爱心分）、双人游戏空间，Fastify + PostgreSQL 自有后端。',
    details:
      '噜小记从点单与噜币工具成长为完整的双向情侣生活应用：噜噜与噜妹两个对等身份，各自管理提供给对方的商品、任务、订单与奖励，币种、流水、券包和等级按账户隔离；恋爱空间由双方共享——日记、相册、小事、留言、恋爱日历、爱心分都保留作者身份与审计信息；游戏空间内置五子棋、你画我猜、翻牌记忆、噜噜方块等双人在线游戏与挑战排行榜。数据由自有 Fastify/PostgreSQL 服务持久化，前端 158 项、后端 171 项自动化测试保障。',
    tags: ['微信小程序', '全栈', '双人系统', '游戏空间'],
    image: 'assets/img/projects-unified/噜小记微信小程序.webp',
    links: [{ label: 'GitHub', url: 'https://github.com/yys806/lulu' }],
    en: {
      excerpt: 'A two-person WeChat mini-program: bilateral points & orders, shared love space (diary/album/calendar), and an online game room.',
      details:
        'LuXiaoJi grew from an ordering & points tool into a complete two-person life app: two equal identities (LuLu & LuMei), each managing products, tasks, orders, and rewards for the other, with per-account currencies, ledgers, vouchers, and levels. The shared love space covers diary, album, events, messages, calendar, and heart-score with author identity and audit trails. The game room ships Gomoku, Draw & Guess, memory flip, and Tetris with online play and leaderboards. Powered by a self-hosted Fastify/PostgreSQL backend; 158 frontend + 171 backend automated tests.',
      tags: ['WeChat Mini-Program', 'Full-stack', 'Two-person System', 'Game Room']
    },
  },
  {
    id: 'mathsnap',
    title: 'MathSnap',
    zh: '学术文献精读平台',
    group: 'web',
    featured: true,
    copyright: true,
    date: '2026.02',
    excerpt: '基于多模态大模型的学术文献精读与深度分析平台：论文精读、结构化笔记、截图识别公式。已登记软件著作权。',
    details:
      'MathSnap 把“读论文”变成一条流水线：上传或截图即进入精读模式，多模态大模型完成公式识别、结构化笔记、段落级深读与追问式对话；识别结果可导出为可编辑笔记，形成“摄入—理解—沉淀”的闭环。系统已登记软件著作权，服务个人与组内的文献精读场景。',
    tags: ['多模态 LLM', '全栈应用', '软著'],
    image: 'assets/img/projects-unified/Mathsnap.webp',
    links: [
      { label: 'Website', url: 'https://2352396.de5.net' },
      { label: 'GitHub', url: 'https://github.com/yys806/research-helper' },
    ],
    en: {
      excerpt: 'A multimodal paper-reading platform: close reading, structured notes, and formula recognition from screenshots.',
      details:
        'MathSnap turns paper reading into a pipeline: upload or screenshot to enter close-reading mode, where multimodal LLMs handle formula recognition, structured notes, section-level deep reading, and follow-up Q&A. Results export as editable notes, closing the loop of capture–understand–retain. Registered software copyright.',
      tags: ['Multimodal LLM', 'Full-stack', '© Registered']
    },
  },
  {
    id: 'nexus-terminal',
    title: 'Nexus Terminal',
    zh: 'Jarvis 式 AI 终端',
    group: 'web',
    date: '2025.12',
    excerpt: '一个类似 Jarvis 的沉浸式网页终端，用控制台界面承载 AI 交互。',
    details:
      '以“贾维斯控制台”为蓝本的 Web 终端：沉浸式界面承载 AI 对话、任务提醒与系统状态面板，支持自定义命令与快捷指令，把日常 AI 交互收进一块屏幕。',
    tags: ['AI 交互', 'Web 终端', '沉浸式 UI'],
    image: 'assets/img/projects-unified/Nexus.webp',
    links: [
      { label: 'Website', url: 'https://shen-play.de5.net' },
      { label: 'GitHub', url: 'https://github.com/yys806/shenge-gpt' },
    ],
    en: {
      excerpt: 'A Jarvis-like immersive web terminal for AI interaction.',
      details:
        'A web terminal modeled after the Jarvis console: an immersive interface hosting AI conversation, task reminders, and a system status panel, with custom commands and shortcuts.',
      tags: ['AI Interaction', 'Web Terminal', 'Immersive UI']
    },
  },
  {
    id: 'cyber-oracle',
    title: 'Cyber AI Divination',
    zh: '赛博智能推演',
    group: 'web',
    featured: true,
    copyright: true,
    date: '2026.01',
    excerpt: '智能化运势模拟与心理咨询辅助应用，承载小六壬、八字、运势、解梦等互动式 AI 分析场景。已登记软件著作权 CYBERORACLE。',
    details:
      '把传统玄学做成交互式 AI 体验：小六壬、八字、运势、解梦等场景由大模型驱动，前端 TypeScript/React + Serverless Functions，包含记录与回溯功能。已登记软件著作权 CYBERORACLE。',
    tags: ['TypeScript/React', 'Serverless', '软著'],
    image: 'assets/img/projects-unified/cyber算命.webp',
    links: [
      { label: 'Website', url: 'https://fpga.de5.net' },
      { label: 'GitHub', url: 'https://github.com/yys806/Divination' },
    ],
    en: {
      excerpt: 'AI fortune simulation & counseling assistant across interactive divination scenarios.',
      details:
        'Traditional divination reimagined as interactive AI experiences: Xiao-Liu-Ren, BaZi, fortune and dream readings powered by LLMs. TypeScript/React front end with serverless functions and history/recall. Registered software copyright CYBERORACLE.',
      tags: ['TypeScript/React', 'Serverless', '© Registered']
    },
  },
  {
    id: 'fortress',
    title: 'Fortress',
    zh: '金匮 · 私人数据金库',
    group: 'web',
    date: '2026.03',
    excerpt: '面向 Web 与移动端的私有数据金库：Supabase 数据结构 + Capacitor 跨端配置，让重要数据的存储与恢复更可控。',
    details:
      '金匮是一套私人数据金库方案：Web 应用 + Capacitor 跨端打包，Supabase 管理数据表结构与初始化 SQL，覆盖重要资料的加密存储、分类归档与恢复流程，强调“数据自己掌控”。',
    tags: ['Supabase', 'Capacitor', '数据安全'],
    image: 'assets/img/projects-unified/金匮.webp',
    links: [
      { label: 'Website', url: 'https://shentv.dpdns.org' },
      { label: 'GitHub', url: 'https://github.com/yys806/Fortress' },
    ],
    en: {
      excerpt: 'A private data vault for web & mobile with structured storage and recovery.',
      details:
        'Fortress is a personal data vault: a web app packaged with Capacitor, Supabase schema and init SQL, covering encrypted storage, categorized archiving, and recovery of important records.',
      tags: ['Supabase', 'Capacitor', 'Data Security']
    },
  },
  {
    id: 'shenyu',
    title: '珅玉定制',
    zh: 'AI 玉石定制应用',
    group: 'web',
    featured: true,
    date: '2026.04',
    excerpt: 'AI 玉石定制应用：图片生成、玉石图库、额度审批、公告管理等完整前后端流程。',
    details:
      '面向玉石爱好者的 AI 定制应用：上传需求生成设计图，图库管理、额度审批与公告发布构成完整运营流。前后端分离，生成链路接入多模态模型。',
    tags: ['AI 生图', '全栈', '工作流'],
    image: 'assets/img/projects-unified/珅玉定制.webp',
    links: [
      { label: 'Website', url: 'https://shen806.us.ci' },
      { label: 'GitHub', url: 'https://github.com/yys806/yushi2' },
    ],
    en: {
      excerpt: 'AI-powered jade customization with gallery, approvals, and announcements.',
      details:
        'An AI customization app for jade enthusiasts: requirement-driven design generation, gallery management, quota approvals, and announcements form a complete operation loop.',
      tags: ['AI Image Gen', 'Full-stack', 'Workflow']
    },
  },
  {
    id: 'shen-ppt',
    title: 'Shen-PPT',
    zh: '可编辑学术 PPT 生成引擎',
    group: 'other',
    featured: true,
    date: '2026.06',
    excerpt: '一个 Codex skill：读取报告、代码、截图与实验结果，生成真正可编辑的 .pptx——含大纲审批、模板锁定、样张审批、QA 修复与答辩问答文档的完整生产管线。',
    details:
      '一条把“材料”变成“可编辑 PPT”的固定生产管线：读取报告、代码、截图与实验结果，经大纲审批、模板锁定、四页样张审批、全量生成、QA 修复，产出真正可编辑的 .pptx，并附讲稿与答辩问答文档。',
    tags: ['Codex Skill', '自动化管线', '工程化'],
    image: 'assets/img/projects-unified/Shen-PPT.webp',
    links: [{ label: 'GitHub', url: 'https://github.com/yys806/Shen-PPT' }],
    en: {
      excerpt: 'A Codex skill producing truly editable academic PPT decks via a fixed pipeline.',
      details:
        'A fixed production pipeline turning raw materials into editable decks: reads reports, code, screenshots, and experiment results; runs outline approval, template locking, 4-page sample approval, full-deck generation, and QA repair — output is a real editable .pptx with speaker scripts and defense Q&A docs.',
      tags: ['Codex Skill', 'Automation Pipeline', 'Engineering']
    },
  },
  {
    id: 'mirror-room',
    title: 'Mirror Room',
    zh: '镜室 · 人格对话站',
    group: 'web',
    featured: true,
    date: '2026.05',
    excerpt: '基于 skill 的人格对话网站，可直接选择不同人格或功能型 skill 进行对话。',
    details:
      '镜室把人格与知识封装为可直接调用的 skill：进入房间、选择人格即可开始对话，支持多视角切换、修订与反馈闭环，适合人格设定试验与轻量心理陪伴。',
    tags: ['AI 对话', 'Persona'],
    image: 'assets/img/projects-unified/镜室.webp',
    links: [
      { label: 'Website', url: 'https://yly113.de5.net' },
      { label: 'GitHub', url: 'https://github.com/yys806/shen.skill' },
    ],
    en: {
      excerpt: 'A skill-based persona chatroom: switch perspectives, chat, refine.',
      details:
        'Mirror Room packages personas and knowledge as directly invocable skills: enter a room, pick a persona, start talking — with multi-perspective switching and a refine-and-feedback loop.',
      tags: ['AI Chat', 'Persona']
    },
  },
  {
    id: 'shen-tools',
    title: "Shen's Tools",
    zh: '个人工具合集',
    group: 'web',
    date: '2026.01',
    excerpt: '个人工具合集网站，把学习和生活中常用的小工具集中到一个入口。',
    details: '把日常高频的小需求做成网页工具集中收纳：格式转换、文本处理、学习辅助等，按场景组织，即开即用。',
    tags: ['工具箱', '效率'],
    image: 'assets/img/projects-unified/Shens-tool.webp',
    links: [
      { label: 'Website', url: 'https://riscv.de5.net' },
      { label: 'GitHub', url: 'https://github.com/yys806/AI-tool' },
    ],
    en: {
      excerpt: 'A personal toolbox site collecting daily study & life utilities.',
      details: 'Daily micro-needs as web tools in one place: format conversion, text processing, study aids — organized by scenario, zero setup.',
      tags: ['Toolbox', 'Productivity']
    },
  },
  {
    id: 'qr-tool',
    title: 'QR Tool',
    zh: '有个性的二维码生成器',
    group: 'web',
    date: '2026.04',
    excerpt: '生成有辨识度二维码的 Web 工具，面向日常分享、活动物料与个人链接管理。',
    details: '生成“有辨识度”的二维码：支持自定义颜色、logo 与纠错等级，面向活动物料与个人链接分享场景。',
    tags: ['Web 工具', '二维码'],
    image: 'assets/img/projects-unified/二维码生成器.webp',
    links: [
      { label: 'Website', url: 'https://428806.xyz' },
      { label: 'GitHub', url: 'https://github.com/yys806/QR-tool' },
    ],
    en: {
      excerpt: 'A web tool for generating distinctive QR codes.',
      details: 'Generate QR codes with character: custom colors, logos, and error-correction levels, for event materials and personal links.',
      tags: ['Web Tool', 'QR Code']
    },
  },
  {
    id: 'homepage',
    title: 'Homepage',
    zh: '个人导航主页',
    group: 'web',
    date: '2026.01',
    excerpt: 'TypeScript 个人主页项目：集中整理个人链接、图片资源、近期计划与轻量导航。',
    details: 'TypeScript 写的轻量导航主页：聚合个人链接、图片资源与近期计划，作为所有个人站点的统一入口。',
    tags: ['TypeScript', '导航'],
    image: 'assets/img/projects-unified/Homepage.webp',
    links: [
      { label: 'Website', url: 'https://shen806.dpdns.org' },
      { label: 'GitHub', url: 'https://github.com/yys806/Homepage' },
    ],
    en: {
      excerpt: 'A lightweight TypeScript personal homepage for links & plans.',
      details: 'A lightweight TypeScript homepage aggregating personal links, images, and recent plans — the single entry to all my sites.',
      tags: ['TypeScript', 'Navigation']
    },
  },
  {
    id: 'image-removal',
    title: 'Image Removal Tool',
    zh: '图片去黑边工具',
    group: 'web',
    date: '2025.12',
    excerpt: 'TypeScript 图片处理工具，专注快速清理图片黑边的分享前工作流。',
    details: '纯前端图片清理工具：自动检测并裁除黑边，支持批量处理与压缩导出，分享截图前一步到位。',
    tags: ['图像处理', 'TypeScript'],
    image: 'assets/img/projects-unified/image-romoval-tool.webp',
    links: [
      { label: 'Website', url: 'https://shen-photo.de5.net' },
      { label: 'GitHub', url: 'https://github.com/yys806/Picture-process' },
    ],
    en: {
      excerpt: 'A TypeScript tool to auto-crop black borders from images.',
      details: 'A client-side image cleaner: auto-detects and crops black borders, with batch processing and compressed export.',
      tags: ['Image Processing', 'TypeScript']
    },
  },
  {
    id: 'discord-bot',
    title: 'Discord Bot System',
    zh: '私有双机器人系统',
    group: 'web',
    date: '2026.05',
    excerpt: 'shen-test（长期记忆 / 画像 / 自我进化 / ASR-TTS / 联网搜索）+ shen-play（娱乐互动）双机器人，附统一 Web 管理后台与 systemd 部署工具链。',
    details:
      '双机器人体系：shen-test 负责长期对话（mem0 记忆、用户画像、自我进化、ASR/TTS、联网搜索），shen-play 负责娱乐互动；web-admin 后台统一管理配置、密钥、日志与重启，systemd 脚本一键部署。',
    tags: ['Bot 系统', 'mem0 记忆', '运维工具链'],
    image: 'assets/img/projects-unified/Discord机器人.webp',
    links: [{ label: 'GitHub', url: 'https://github.com/yys806/discord-bot' }],
    en: {
      excerpt: 'A private dual Discord-bot system with a unified web admin console.',
      details:
        'A dual-bot system: shen-test for long-term chat (mem0 memory, user profiling, self-evolution, ASR/TTS, web search), shen-play for fun; a web-admin console manages config, keys, logs, and restarts.',
      tags: ['Bot System', 'mem0 Memory', 'DevOps Toolchain']
    },
  },
  {
    id: 'gemini-history',
    title: 'Gemini History Query',
    zh: '对话历史查询插件',
    group: 'web',
    date: '2025.10',
    excerpt: '查询和整理 Gemini 对话历史的插件式项目，解决记录分散、难以回溯的问题。',
    details: '解决 Gemini 对话记录分散难查的问题：批量导入、关键词检索与按项目整理，让历史对话重新可用。',
    tags: ['插件', '信息管理'],
    image: 'assets/img/projects-unified/gemini对话历史查询插件.webp',
    links: [{ label: '网盘 Pan', url: 'https://pan.baidu.com/s/1Qe9SzUnthsM5x78hzk5QBQ?pwd=8qie' }],
    en: {
      excerpt: 'A plugin to query and organize scattered Gemini chat history.',
      details: 'Fixes scattered Gemini history: bulk import, keyword search, and per-project organization make past conversations usable again.',
      tags: ['Plugin', 'Info Management']
    },
  },
  {
    id: 'tongji-agent',
    title: '质管办智能体',
    zh: '同济大学质量管理办公室',
    group: 'campus',
    date: '2026.05',
    excerpt: '面向同济大学质量管理办公室的智能体工作流：质量数据管理、文档辅助与分析支持。',
    details:
      '为同济质管办搭建的智能体工作流：质量数据录入、文档辅助与分析报告生成，把重复事务交给 agent，效率显著提升并已实际投用。',
    tags: ['Agent 工作流', '校内系统'],
    image: 'assets/img/projects-unified/质量管理办公室智能体.webp',
    links: [{ label: 'Project', url: 'https://agent.tongji.edu.cn/product/llm/chat/d4ksjeglmqe6v2jvltfg' }],
    en: {
      excerpt: 'An agent workflow for quality-data management at Tongji University.',
      details:
        'An agent workflow for the Quality Management Office: quality-data entry, document assistance, and analysis-report generation — deployed in real use.',
      tags: ['Agent Workflow', 'Campus System']
    },
  },
  {
    id: 'subway-sitp',
    title: '地铁客流感知与车厢分配优化',
    zh: '上海市大创项目',
    group: 'campus',
    date: '2025.06',
    excerpt: '上海市大学生创新创业训练计划项目：用客流感知与优化方法改善地铁车厢分配。',
    details: '上海市大创项目：用客流感知数据驱动车厢分配优化模型，缓解高峰期车厢拥挤不均，完成结题并获结题证书。',
    tags: ['感知与优化', '大创 SITP'],
    image: 'assets/img/projects-unified/地铁项目.webp',
    links: [{ label: '结题证书 Certificate', url: 'https://pub-fae7c18af59f40679cbe76ee23a170c8.r2.dev/%E8%8E%B7%E5%A5%96/2024-2025/SITP%E7%BB%93%E9%A2%98%E8%AF%81%E4%B9%A6.pdf' }],
    en: {
      excerpt: 'SITP project: sensing-driven subway carriage allocation optimization.',
      details: 'A Shanghai innovation project: passenger-flow sensing data drives a carriage-allocation optimization model; concluded with certificate.',
      tags: ['Sensing & Optimization', 'SITP Project']
    },
  },
  {
    id: 'orangepi-gimbal',
    title: 'OrangePi 双轴云台跟踪',
    zh: '视觉 + 舵机控制',
    group: 'course',
    date: '2026.06',
    excerpt: '结合 OrangePi、视觉检测与舵机控制，实现双自由度云台目标跟踪系统。',
    details: 'OrangePi 上跑视觉检测，舵机驱动双自由度云台实时追踪目标：覆盖检测、解算、PID 控制与串口通信全链路。',
    tags: ['嵌入式', '计算机视觉'],
    image: 'assets/img/projects-unified/OrangePi.webp',
    links: [{ label: 'GitHub', url: 'https://github.com/yys806/zb_tracker_project' }],
    en: {
      excerpt: 'Dual-axis gimbal target tracking with OrangePi vision + servos.',
      details: 'Vision detection on OrangePi drives a 2-DOF servo gimbal for real-time target tracking: detection, solve, PID control, and UART comms.',
      tags: ['Embedded', 'Computer Vision']
    },
  },
  {
    id: 'distributed-computing',
    title: '分布式并行计算系统',
    zh: '算法设计与分析大作业',
    group: 'course',
    date: '2026.01',
    excerpt: '与吴凯合作的并行计算实验：C++ / CUDA / CMake，保留 Base/CPU/GPU 与 Single/Double 多套实现与性能对比。',
    details: '算法课大作业：同一问题的 Base/CPU/GPU 与 Single/Double 多套 C++/CUDA 实现，系统对比并行优化收益，附完整实验报告。',
    tags: ['CUDA', 'C++', '并行计算'],
    image: 'assets/img/projects-unified/分布式并行计算系统.webp',
    links: [{ label: 'GitHub', url: 'https://github.com/yys806/shen-kai' }],
    en: {
      excerpt: 'C++/CUDA parallel-computing coursework with multi-version comparison.',
      details: 'Algorithm course final: Base/CPU/GPU and Single/Double implementations in C++/CUDA, systematically benchmarking parallel gains.',
      tags: ['CUDA', 'C++', 'Parallel Computing']
    },
  },
  {
    id: 'e203-fpga',
    title: 'e203 HTMI FPGA 字符终端',
    zh: '蜂鸟 RISC-V 平台',
    group: 'course',
    date: '2025.12',
    excerpt: '蜂鸟 e203 RISC-V 平台上的 FPGA 字符终端课程项目。',
    details: '在蜂鸟 e203 RISC-V SoC 上实现字符终端：FPGA 综合、总线对接与显示驱动，让“Hello RISC-V”出现在屏幕上。',
    tags: ['RISC-V', 'FPGA'],
    image: 'assets/img/projects-unified/E203字符终端.webp',
    links: [{ label: 'GitHub', url: 'https://github.com/yys806/e203-htmi-fpga' }],
    en: {
      excerpt: 'FPGA character terminal on the Hummingbird e203 RISC-V SoC.',
      details: 'A character terminal on the e203 RISC-V SoC: FPGA synthesis, bus integration, and display drivers.',
      tags: ['RISC-V', 'FPGA']
    },
  },
  {
    id: 'e203-counter',
    title: 'e203 RISC-V 计数器',
    zh: '设计与验证',
    group: 'course',
    date: '2025.12',
    excerpt: '蜂鸟 e203 平台上的 RISC-V 计数器实现与验证课程项目。',
    details: 'e203 平台上的计数器外设设计与验证：RTL 实现、testbench 仿真与板上验证全流程。',
    tags: ['RISC-V', '数字设计'],
    image: 'assets/img/projects-unified/RISCV计数器.webp',
    links: [{ label: 'GitHub', url: 'https://github.com/yys806/e203-RISCV-counter' }],
    en: {
      excerpt: 'Design & verification of a RISC-V counter peripheral on e203.',
      details: 'Counter peripheral design & verification on e203: RTL implementation, testbench simulation, and on-board validation.',
      tags: ['RISC-V', 'Digital Design']
    },
  },
  {
    id: 'stm32-text',
    title: 'STM32G0 文字识别器',
    zh: '红外传感 + 识别逻辑',
    group: 'course',
    date: '2025.06',
    excerpt: '嵌入式课程项目：结合 STM32G0、红外传感器与识别逻辑实现文字识别器。',
    details: 'STM32G0 + 红外阵列的嵌入式文字识别器：采样、特征提取与匹配逻辑全部跑在单片机上，附设计报告。',
    tags: ['STM32', '嵌入式'],
    image: 'assets/img/projects-unified/手写数字识别器.webp',
    links: [{ label: '设计报告 Report', url: 'https://pub-fae7c18af59f40679cbe76ee23a170c8.r2.dev/%E9%A1%B9%E7%9B%AE/2352396-%E7%A6%B9%E5%B0%A7%E7%8F%85-%E6%96%87%E5%AD%97%E8%AF%86%E5%88%AB%E5%99%A8-%E8%AE%BE%E8%AE%A1%E6%8A%A5%E5%91%8A.pdf' }],
    en: {
      excerpt: 'Embedded text recognizer on STM32G0 with infrared sensing.',
      details: 'An embedded text recognizer on STM32G0 with an infrared array: sampling, feature extraction, and matching all on-MCU.',
      tags: ['STM32', 'Embedded']
    },
  },
  {
    id: 'voice-lights',
    title: '语音控制灯',
    zh: 'ASRpro + 天问 Block',
    group: 'other',
    date: '2025.07',
    excerpt: '使用 ASRpro 开发板和天问 Block 实现语音开关灯的硬件实践。',
    details: 'ASRpro 离线语音识别 + 天问 Block 图形化编程，实现语音开关灯的完整小系统，B 站有演示视频。',
    tags: ['硬件', '语音交互'],
    image: 'assets/img/projects-unified/语音开关灯装置.webp',
    links: [{ label: 'Bilibili', url: 'https://www.bilibili.com/video/BV1ADmbYEEGp/' }],
    en: {
      excerpt: 'Voice-controlled lights with ASRpro + TianWen Block.',
      details: 'Offline voice recognition on ASRpro with TianWen Block visual programming — a complete voice-controlled lighting demo.',
      tags: ['Hardware', 'Voice Interaction']
    },
  },
  {
    id: 'robot-dog',
    title: '小汪机器狗 v1.0',
    zh: 'PCB / 焊接 / 舵机 / 结构',
    group: 'other',
    date: '2025.08',
    excerpt: '机器狗硬件复刻与改造项目，覆盖 PCB、焊接、舵机控制和结构装配。',
    details: '复刻并改造“天机小汪”机器狗：PCB 绘制与焊接、12 路舵机控制、结构装配与步态调试，一次点亮。',
    tags: ['机器人', '硬件'],
    image: 'assets/img/projects-unified/机器狗.webp',
    links: [{ label: '详情 Details', url: 'https://oshwhub.com/hanbing666/tian-ji-xiao-wang-wang-xing-xing-da-lao-zhuan-shu-ban' }],
    en: {
      excerpt: 'A robot-dog build: PCB, soldering, servo control, and assembly.',
      details: 'Replicated and customized the TianJi XiaoWang robot dog: PCB design & soldering, 12-channel servo control, assembly, and gait debugging.',
      tags: ['Robotics', 'Hardware']
    },
  },
  {
    id: 'xiaozhi',
    title: '小智 AI 聊天机器人',
    zh: 'MCP + ESP32',
    group: 'other',
    date: '2026.06',
    excerpt: '软硬件结合的 AI 对话项目：嵌入式硬件、语音交互与大模型能力。',
    details: '基于小智 ESP32 方案搭建的 AI 语音伙伴：MCP 协议接入大模型，支持连续对话与角色设定，软硬一体。',
    tags: ['ESP32', 'MCP', '语音'],
    image: 'assets/img/projects-unified/小智AI聊天机器人.webp',
    links: [{ label: '官网 Website', url: 'https://xiaozhi.me' }],
    en: {
      excerpt: 'An MCP-based AI voice companion on ESP32.',
      details: 'An AI voice companion built on the XiaoZhi ESP32 stack: LLM access over MCP, continuous conversation, and persona settings.',
      tags: ['ESP32', 'MCP', 'Voice']
    },
  },
];

export const PROJECT_GROUPS = [
  { id: 'all', zh: '全部', en: 'ALL' },
  { id: 'web', zh: '网页应用', en: 'WEB' },
  { id: 'course', zh: '课程项目', en: 'COURSE' },
  { id: 'campus', zh: '校内项目', en: 'CAMPUS' },
  { id: 'other', zh: '硬件与其他', en: 'OTHER' },
];

// ---------------- 经历 TIMELINE ----------------

export const TIMELINE = [
  {
    year: '2023',
    title: '入学同济大学',
    org: 'Tongji University',
    desc: '人工智能专业本科，开始写第一行真正意义上的代码。',
    kind: 'edu',
    en: { title: 'Started at Tongji University', org: 'Tongji University', desc: 'B.Eng. in Artificial Intelligence — wrote my first real line of code.' },
  },
  {
    year: '2024',
    title: '国家奖学金',
    org: '教育部 · ¥10,000',
    desc: '本科阶段最高荣誉。同年获全国大学生英语翻译竞赛三等奖、同济新生结构赛三等奖。',
    kind: 'award',
    en: { title: 'National Scholarship', org: 'Ministry of Education · ¥10,000', desc: 'The highest undergraduate honor. Also 3rd prizes in the National English Translation Competition and Tongji Freshman Structure Competition.' },
  },
  {
    year: '2025.07',
    title: '质管办开发工作',
    org: '同济大学质量管理办公室',
    desc: '构建面向质量数据管理与分析的智能体辅助工作流，第一次把 AI 系统推进真实业务。',
    kind: 'work',
    en: { title: 'Developer, Quality Management Office', org: 'Tongji University', desc: 'Built agent-assisted workflows for quality-data management — first time pushing an AI system into real business.' },
  },
  {
    year: '2025.11',
    title: 'DRIFT · 第一作者',
    org: '同济大学 · 李王明卉教授指导',
    desc: '开始混合自主交通生成研究，论文发布于 arXiv:2606.16589，现于 IEEE TITS 审稿中。同年获全球校园 AI 算法精英大赛国家一等奖、华数杯国家三等奖。',
    kind: 'research',
    en: { title: 'DRIFT · First author', org: 'Tongji University · advised by Prof. Minghui Liwang', desc: 'Started mixed-autonomy traffic generation research; paper on arXiv:2606.16589, now under review at IEEE TITS. Also won a National First Prize at the Global Campus AI Algorithm Competition.' },
  },
  {
    year: '2026.03',
    title: '北大 PCNI × 清华 SIGS 双线科研',
    org: 'Peking University · Tsinghua SIGS',
    desc: '北大电子学院 PCNI 课题组研究网络状态世界模型；清华深研院陈鑫磊课题组研究交通场景 VLM 评测与偏差诊断。',
    kind: 'research',
    en: { title: 'Dual research lines: PKU PCNI × Tsinghua SIGS', org: 'Peking University · Tsinghua SIGS', desc: 'Network-state world models at PKU PCNI; traffic-scene VLM evaluation & bias diagnostics at Tsinghua SIGS (Prof. Xinlei Chen).' },
  },
  {
    year: '2026',
    title: '两件软件著作权',
    org: 'MathSnap · CYBERORACLE',
    desc: '研究与工程双线并进：论文之外，产品也获得正式登记。同年获全国大学生数学建模竞赛上海市二等奖。',
    kind: 'award',
    en: { title: 'Two software copyrights', org: 'MathSnap · CYBERORACLE', desc: 'Research and engineering in parallel — both products formally registered. Also Shanghai 2nd prize in the national math-modeling contest.' },
  },
  {
    year: '2026.07',
    title: '北大电子学院夏令营 · 直博 Offer',
    org: 'Peking University · 信号与信息处理',
    desc: '参加北京大学电子学院优秀大学生夏令营，获得信号与信息处理专业直博资格。',
    kind: 'offer',
    en: { title: 'PKU SEE Summer Camp · PhD Offer', org: 'Peking University · Signal & Information Processing', desc: 'Attended the PKU School of Electronics summer camp and received a direct-PhD offer in Signal & Information Processing.' },
  },
];

// ---------------- 荣誉 HONORS ----------------
// file: 证书公网链接（R2 对象存储）

const AWARD = 'https://pub-fae7c18af59f40679cbe76ee23a170c8.r2.dev/%E8%8E%B7%E5%A5%96';

export const HONORS = [
  { year: '2025.12', name: '全球校园人工智能算法精英大赛', level: '国家一等奖', hot: true, file: `${AWARD}/2025-2026/AIC-%E5%9B%BD%E4%B8%80.pdf`, en: { name: 'Global Campus AI Algorithm Elite Competition', level: 'National First Prize' } },
  { year: '2024', name: '国家奖学金', level: 'Top 0.2% · ¥10,000', hot: true, file: `${AWARD}/2023-2024/%E5%9B%BD%E5%A5%96.jpg`, en: { name: 'National Scholarship', level: 'Top 0.2% · ¥10,000' } },
  { year: '2025', name: '全国大学生数学建模竞赛', level: '上海市二等奖', file: `${AWARD}/2025-2026/%E6%95%B0%E6%A8%A1%E5%9B%BD%E8%B5%9B%E7%9C%81%E4%BA%8C.jpg`, en: { name: 'China National Mathematical Modeling Contest', level: 'Shanghai 2nd Prize' } },
  { year: '2025.08', name: '第六届华数杯数学建模竞赛', level: '国家三等奖', file: `${AWARD}/2024-2025/2025%E5%8D%8E%E6%95%B0%E6%9D%AF.pdf`, en: { name: '6th Huashu Cup Mathematical Modeling', level: 'National 3rd Prize' } },
  { year: '2026', name: 'MathSnap 软件著作权', level: '登记号在册', file: `${AWARD}/%E8%BD%AF%E8%91%97/mathsnap.pdf`, en: { name: 'MathSnap Software Copyright', level: 'Registered' } },
  { year: '2026', name: 'CYBERORACLE 软件著作权', level: '登记号在册', file: `${AWARD}/%E8%BD%AF%E8%91%97/CYBERORACLE.pdf`, en: { name: 'CYBERORACLE Software Copyright', level: 'Registered' } },
  { year: '2025.07', name: '第九届集成电路创新创业大赛 JYD 杯', level: '华东赛区三等奖', file: `${AWARD}/2024-2025/2025%E9%9B%86%E5%88%9B%E8%B5%9B.jpg`, en: { name: '9th IC Innovation Challenge (JYD Cup)', level: 'East China 3rd Prize' } },
  { year: '2025.04', name: 'MothorCup 数学建模竞赛', level: '上海市三等奖', file: `${AWARD}/2024-2025/2025%20%E5%A6%88%E5%A6%88%E6%9D%AF.jpg`, en: { name: 'MothorCup Mathematical Modeling', level: 'Shanghai 3rd Prize' } },
  { year: '2025.01', name: '美国大学生数学建模竞赛 MCM', level: 'Successful Participant', file: `${AWARD}/2024-2025/2025%E6%95%B0%E6%A8%A1%E7%BE%8E%E8%B5%9B.pdf`, en: { name: 'Mathematical Contest in Modeling (MCM)', level: 'Successful Participant' } },
  { year: '2024.11', name: '全国大学生英语翻译竞赛', level: '三等奖', file: `${AWARD}/2023-2024/%E5%A4%A7%E8%8B%B1%E7%BF%BB%E8%AF%91.jpg`, en: { name: 'National College English Translation Competition', level: '3rd Prize' } },
  { year: '2024.09', name: '全国大学生数学建模竞赛', level: '上海市三等奖', file: `${AWARD}/2024-2025/2024%E6%95%B0%E6%A8%A1%E5%9B%BD%E8%B5%9B.jpg`, en: { name: 'China National Mathematical Modeling Contest', level: 'Shanghai 3rd Prize' } },
  { year: '2023.12', name: '同济大学新生结构竞赛', level: '三等奖', file: `${AWARD}/2023-2024/%E6%96%B0%E7%94%9F%E7%BB%93%E6%9E%84%E8%B5%9B.jpg`, en: { name: 'Tongji Freshman Structure Competition', level: '3rd Prize' } },
];

// ---------------- 更新日志 CHANGELOG ----------------
// git-log 风格的人生版本号

export const CHANGELOG = [
  {
    version: 'v2.7.0',
    date: '2026.08',
    hash: 'c8f21a4',
    tag: 'RELEASE',
    items: ['获得北京大学电子学院夏令营直博 offer（信号与信息处理）', '论文 DRIFT 投稿 IEEE TITS，进入审稿流程'],
    en: { items: ['Direct-PhD offer from the PKU School of Electronics summer camp (Signal & Information Processing)', 'DRIFT paper submitted to IEEE TITS — now under review'] },
  },
  {
    version: 'v2.6.2',
    date: '2026.06',
    hash: 'b31e0d9',
    tag: 'FEATURE',
    items: ['Shen-PPT · 小智 AI 伙伴 · OrangePi 云台三个新工程上线', '两件软件著作权登记完成（MathSnap · CYBERORACLE）'],
    en: { items: ['Three new projects shipped: Shen-PPT, XiaoZhi AI companion, OrangePi gimbal', 'Both software copyrights formally registered (MathSnap · CYBERORACLE)'] },
  },
  {
    version: 'v2.6.0',
    date: '2026.03',
    hash: 'a7d94e2',
    tag: 'FEATURE',
    items: ['北大 PCNI × 清华 SIGS 双线科研同时启动'],
    en: { items: ['Dual research lines started: PKU PCNI × Tsinghua SIGS'] },
  },
  {
    version: 'v2.5.1',
    date: '2025.12',
    hash: '9c02bb7',
    tag: 'RELEASE',
    items: ['DRIFT 论文发布 arXiv:2606.16589', '全球校园 AI 算法精英大赛 国家一等奖'],
    en: { items: ['DRIFT released on arXiv:2606.16589', 'National First Prize — Global Campus AI Algorithm Competition'] },
  },
  {
    version: 'v2.5.0',
    date: '2025.11',
    hash: 'e45c8f0',
    tag: 'FEATURE',
    items: ['启动混合自主交通生成研究（一作）'],
    en: { items: ['Started mixed-autonomy traffic research (first author)'] },
  },
  {
    version: 'v2.4.0',
    date: '2025.07',
    hash: 'd2a67c3',
    tag: 'FEATURE',
    items: ['质管办智能体工作流投入实际使用', '小汪机器狗 v1.0 点亮'],
    en: { items: ['Agent workflow deployed at the Quality Management Office', 'Robot dog v1.0 powered on'] },
  },
  {
    version: 'v2.3.0',
    date: '2024.10',
    hash: 'f0e31ab',
    tag: 'RELEASE',
    items: ['国家奖学金（Top 0.2%）'],
    en: { items: ['National Scholarship (Top 0.2%)'] },
  },
  {
    version: 'v2.0.0',
    date: '2023.09',
    hash: 'a1c90de',
    tag: 'INIT',
    items: ['初始化：入学同济大学人工智能专业'],
    en: { items: ['init: enrolled at Tongji University, Artificial Intelligence'] },
  },
];

// ---------------- 页面结构 ----------------

export const SECTIONS = [
  { id: 'about', num: '01', zh: '关于', en: 'ABOUT' },
  { id: 'research', num: '02', zh: '研究', en: 'RESEARCH' },
  { id: 'projects', num: '03', zh: '项目', en: 'PROJECTS' },
  { id: 'journey', num: '04', zh: '轨迹', en: 'JOURNEY' },
  { id: 'changelog', num: '05', zh: '日志', en: 'CHANGELOG' },
  { id: 'contact', num: '06', zh: '联络', en: 'CONTACT' },
];

// ---------------- UI 文案词典 ----------------

export const UI = {
  'hero.tagline': { zh: '在混合自主交通、世界模型与多模态评测的交叉处，<br />造有用的东西。', en: 'At the intersection of mixed-autonomy traffic, world models,<br />and multimodal evaluation — building useful things.' },
  'hero.cta1': { zh: '进入内核', en: 'ENTER KERNEL' },
  'hero.cta2': { zh: '下载 CV', en: 'DOWNLOAD CV' },
  'hero.m1': { zh: 'LOC · 上海 / 云南', en: 'LOC · Shanghai / Yunnan' },
  'hero.m2': { zh: 'ROLE · AI RESEARCHER', en: 'ROLE · AI RESEARCHER' },
  'hero.m3': { zh: 'STATUS · <b class="green">UNDERGRAD@TONGJI</b>', en: 'STATUS · <b class="green">PHD-OFFER@PKU</b>' },
  'gallery.hint': { zh: '// 左右拖动浏览精选 · 滚轮可直接下滑 FEATURED', en: '// DRAG TO BROWSE FEATURED · SCROLL PASSES THROUGH' },
  'projects.label': { zh: '// 完整索引 FULL INDEX — <span id="proj-total">24</span> RECORDS', en: '// FULL INDEX — <span id="proj-total">24</span> RECORDS' },
  'research.outcomes': { zh: '// OUTCOMES · 成果', en: '// OUTCOMES' },
  'research.cite': { zh: '引用 BibTeX', en: 'Cite BibTeX' },
  'honors.label': { zh: '// HONORS.LOG — 荣誉与奖项', en: '// HONORS.LOG — honors & awards' },
  'honors.file': { zh: '证书 ↗', en: 'CERT ↗' },
  'modal.updated': { zh: '更新于', en: 'UPDATED' },
  'modal.copyright': { zh: '已登记软件著作权', en: 'Registered software copyright' },
  'palette.placeholder': { zh: '搜索：项目 / 论文 / 操作…', en: 'Search: projects / papers / actions…' },
  'palette.hint': { zh: '↑↓ 选择 · ↵ 执行 · esc 关闭', en: '↑↓ select · ↵ run · esc close' },
  'palette.groups': { zh: '跳转|项目|研究|操作', en: 'NAVIGATE|PROJECTS|RESEARCH|ACTIONS' },
  'toast.copied': { zh: 'BibTeX 已复制到剪贴板 ✓', en: 'BibTeX copied to clipboard ✓' },
  'toast.copyFail': { zh: '复制失败，请手动复制', en: 'Copy failed — please copy manually' },
  'about.title': { zh: '关于', en: 'ABOUT' },
  'about.sub': { zh: '关于我的一切，皆可 build。', en: 'Everything about me is buildable.' },
  'research.title': { zh: '研究', en: 'RESEARCH' },
  'research.sub': { zh: '把未知拆成可计算的问题。', en: 'Decomposing the unknown into computable problems.' },
  'projects.title': { zh: '项目', en: 'PROJECTS' },
  'projects.sub': { zh: '24 个工程——从论文代码到机器狗。', en: '24 projects — from paper code to a robot dog.' },
  'journey.title': { zh: '轨迹', en: 'JOURNEY' },
  'journey.sub': { zh: '一条仍在编译的时间线。', en: 'A timeline that is still compiling.' },
  'changelog.title': { zh: '更新日志', en: 'CHANGELOG' },
  'changelog.sub': { zh: 'git log --oneline --life · 最新在上', en: 'git log --oneline --life · newest first' },
  'contact.title': { zh: '建立连接', en: 'ESTABLISH LINK' },
  'contact.sub': { zh: '欢迎交流研究、合作或闲聊。', en: 'Research, collaboration, or just saying hi.' },
};
