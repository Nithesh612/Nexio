const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Comprehensive Agent Skills Catalog representing d:\Nexio\Skills
const SKILLS_CATALOG = [
  // ─── Design Intelligence ───
  {
    id: 'ui-ux-pro-max',
    name: 'UI UX Pro Max',
    category: 'Design Intelligence',
    badge: '194 Rules',
    featured: true,
    description: 'Design intelligence engine packed with 194 reasoning rules and 80 searchable styles across web and mobile.',
    command: 'npx ui-ux-pro-max-cli',
    author: 'NextLevelBuilder',
    folder: 'Skills/Design/ui-ux-pro-max-skill',
    tags: ['UI/UX', 'Design Rules', 'Style Systems', 'Figma', 'React'],
    features: [
      '194 reasoning design rules for layouts, hierarchy, and micro-interactions',
      '80 searchable UI visual styles (Brutalist, Editorial, Neumorphism, Minimal)',
      'Multi-platform guidelines across React, Vue, Next.js, and Mobile',
      'Automated design QA for accessibility and typographic rhythm'
    ]
  },
  {
    id: 'unslop',
    name: 'Unslop Sanitizer',
    category: 'Design Intelligence',
    badge: 'Anti-Slop',
    featured: true,
    description: 'Audits and eliminates AI slop (overused purple glows, repetitive badges, emoji clutter, and uneven spacing).',
    command: 'claude plugin install unslop --marketplace heydamir/unslop',
    author: 'Damir Sokolovsky (@heydamir)',
    folder: 'Skills/Design/unslop',
    tags: ['Design Audit', 'Clean UI', 'Typography', 'Aesthetics'],
    features: [
      'Eliminates neon candy gradients and generic AI card clutter',
      'Establishes bespoke editorial typography and authentic micro-borders',
      'Runs redline design audits pass-by-pass before code changes',
      'Supports React, Tailwind, Next.js, Svelte, and plain HTML'
    ]
  },
  {
    id: 'inspo',
    name: 'Inspo Real-Site MCP',
    category: 'Design Intelligence',
    badge: '2,320 Sites',
    featured: true,
    description: 'Archive of 2,320 production websites, live typography tokens, extracted color palettes, and 68 macro-components.',
    command: 'npx -y inspo-mcp install',
    author: 'Together AI & Nutlope',
    folder: 'Skills/Design/inspo',
    tags: ['Design Tokens', 'MCP Server', 'Site Autopsies', 'Palettes', 'Typography'],
    features: [
      '2,320 production websites analyzed across desktop and mobile',
      'Extracted DESIGN.md tokens: semantic palette roles, type ramp, CSS variables',
      '68 canonical reference UI components (heroes, nav, pricing, footer)',
      'Queryable via Model Context Protocol (MCP) in Claude & Antigravity'
    ]
  },
  {
    id: 'bencium-marketplace',
    name: 'Bencium Cognitive UX',
    category: 'Design Intelligence',
    badge: 'Cognitive',
    featured: false,
    description: 'Advanced design intelligence suite covering cognitive UX, algorithmic AEO, European AI Act compliance, and emotion statuslines.',
    command: '/bencium:audit',
    author: 'Bencium Lab',
    folder: 'Skills/Design/bencium-marketplace',
    tags: ['Cognitive UX', 'AI Act', 'AEO', 'Audits'],
    features: [
      'Cognitive architecture and human-architect mindset frameworks',
      'EU AI Act regulatory compliance verification',
      'Answer Engine Optimization (AEO) and structured communication',
      'Deep architectural and design review workflows'
    ]
  },

  // ─── Animation & Motion (GSAP) ───
  {
    id: 'gsap-core',
    name: 'GSAP Core Tweening',
    category: 'Animation & Motion',
    badge: 'Official GSAP',
    featured: true,
    description: 'GreenSock core animation engine for high-performance tweens, easing equations, staggers, and responsive motion.',
    command: 'npm install gsap',
    author: 'GreenSock',
    folder: 'Skills/animation/gsap-core',
    tags: ['GSAP', 'Animation', 'Tweens', 'Stagger', 'Easing'],
    features: [
      'Hardware-accelerated transforms and sub-pixel accuracy',
      'gsap.to(), gsap.from(), and gsap.fromTo() core primitives',
      'Advanced stagger effects and custom bezier easing curves',
      'Reduced motion accessibility support with gsap.matchMedia()'
    ]
  },
  {
    id: 'gsap-react',
    name: 'GSAP React (useGSAP)',
    category: 'Animation & Motion',
    badge: 'React 19 Ready',
    featured: true,
    description: 'Official React hook (@gsap/react) for safe GSAP animation lifecycles, automatic context cleanup, and scoped selectors.',
    command: 'npm install @gsap/react gsap',
    author: 'GreenSock',
    folder: 'Skills/animation/gsap-react',
    tags: ['React', 'useGSAP', 'Hooks', 'Cleanup', 'Vite'],
    features: [
      'Automatic animation cleanup on unmount preventing memory leaks',
      'Scoped DOM selector querying within ref containers',
      'Works seamlessly with React 19 StrictMode and Fast Refresh',
      'Dependency tracking similar to useEffect for state-driven motion'
    ]
  },
  {
    id: 'gsap-scrolltrigger',
    name: 'GSAP ScrollTrigger',
    category: 'Animation & Motion',
    badge: 'Scroll Motion',
    featured: true,
    description: 'Industry-standard scroll-driven animations, element pinning, scrub timelines, and smooth parallax effects.',
    command: 'import { ScrollTrigger } from "gsap/ScrollTrigger"',
    author: 'GreenSock',
    folder: 'Skills/animation/gsap-scrolltrigger',
    tags: ['ScrollTrigger', 'Pinning', 'Scrub', 'Parallax'],
    features: [
      'Lock sections in place with rock-solid viewport pinning',
      'Scrubbed timelines tied smoothly to page scroll position',
      'Responsive triggers adapting to mobile and window resize',
      'Zero layout thrashing with optimized tick batching'
    ]
  },
  {
    id: 'gsap-timeline',
    name: 'GSAP Timelines',
    category: 'Animation & Motion',
    badge: 'Sequencing',
    featured: false,
    description: 'Choreograph complex sequences, nested animations, relative position offsets, and master playback controls.',
    command: 'gsap.timeline()',
    author: 'GreenSock',
    folder: 'Skills/animation/gsap-timeline',
    tags: ['Timeline', 'Sequencing', 'Keyframes', 'Choreography'],
    features: [
      'Choreograph hundreds of animations with millisecond timing control',
      'Position parameter for relative ("<", ">", "-=0.2") offsets',
      'Complete playback controls: pause(), reverse(), seek(), timeScale()',
      'Nest sub-timelines into master sequences for complex UI flows'
    ]
  },
  {
    id: 'gsap-performance',
    name: 'GSAP 60fps Optimization',
    category: 'Animation & Motion',
    badge: 'Performance',
    featured: false,
    description: 'Best practices for 60fps jank-free animation: transform preference, will-change budgeting, and layout thrashing prevention.',
    command: 'gsap.quickTo()',
    author: 'GreenSock',
    folder: 'Skills/animation/gsap-performance',
    tags: ['60fps', 'GPU', 'Performance', 'Layout Thrash'],
    features: [
      'Transforms (x, y, scale, rotation) for GPU composition',
      'gsap.quickTo() for high-frequency pointer and physics updates',
      'Batching techniques to eliminate layout recalculation overhead',
      'will-change management to avoid excessive memory usage'
    ]
  },

  // ─── Video & Automation ───
  {
    id: 'into-video-brag',
    name: 'Brag Video Engine',
    category: 'Video & Media',
    badge: 'Automated Video',
    featured: true,
    description: 'Turns any project URL or codebase into a 20-second launch teaser video complete with soundtrack, motion, and copy.',
    command: 'npx skills add https://github.com/latent-spaces/brag --skill brag',
    author: 'Latent Spaces',
    folder: 'Skills/into-video/brag-main',
    tags: ['Video Generator', 'Launch Teaser', 'Hyperframes', 'Motion', 'Social'],
    features: [
      'One-command automated 20-second project video generation',
      'Includes custom motion choreography and generated share copy',
      'Supports /brag-slim for lightweight rendering without heavy asset packs',
      'Ideal for instant social media demos on X and LinkedIn'
    ]
  },
  {
    id: 'app-store-screenshots',
    name: 'App Store Screenshots',
    category: 'Video & Media',
    badge: 'Multi-Device',
    featured: false,
    description: 'Automated multi-device screenshot generator producing App Store & Google Play visuals with custom device bezels.',
    command: 'npm run screenshot:generate',
    author: 'Open Source',
    folder: 'Skills/Design/app-store-screenshots',
    tags: ['Screenshots', 'App Store', 'Mockup', 'Devices', 'Export'],
    features: [
      'Pre-configured templates for latest iPhone, iPad, and Android dimensions',
      'Crisp device bezels, custom gradients, and callout typography',
      'Batch automated rendering from live web app URLs',
      'Direct asset export ready for App Store Connect submission'
    ]
  },

  // ─── Engineering & QA ───
  {
    id: 'gstack',
    name: 'gstack Software Factory',
    category: 'Engineering & QA',
    badge: 'YC / Garry Tan',
    featured: true,
    description: 'A complete virtual engineering team: CEO product rethink, architecture lock, design reviewer, browser QA, and release engineer.',
    command: 'git clone https://github.com/garrytan/gstack.git ~/.claude/skills/gstack',
    author: 'Garry Tan (CEO, Y Combinator)',
    folder: 'Skills/Design/gstack',
    tags: ['Virtual Team', 'QA Testing', 'Architecture', 'Security', 'Release'],
    features: [
      '/office-hours: Pushes back on product framing and writes design docs',
      '/review: Catches subtle bugs that pass CI before they break production',
      '/qa: Launches real headless browser to reproduce, verify, and fix UI bugs',
      '/cso: Comprehensive OWASP and STRIDE security audit suite'
    ]
  },
  {
    id: 'modern-web-guidance',
    name: 'Modern Web Guidance',
    category: 'Modern Platform',
    badge: 'Chrome & MDN',
    featured: true,
    description: 'Official web platform standards stewarded by Google Chrome, Microsoft Edge, and MDN teams for native web APIs.',
    command: 'npx modern-web-guidance@latest install',
    author: 'Google Chrome & Mozilla MDN',
    folder: 'Skills/Design/modern-web-guidance',
    tags: ['Chrome', 'WebGPU', 'View Transitions', 'Subgrid', 'Modern Web'],
    features: [
      'Native View Transitions API for seamless SPA page navigations',
      'Modern CSS layout: container queries, subgrid, oklch color spaces',
      'WebGL and WebGPU shader guides and wasm cpp integration',
      'Agentic forms and WebMCP tools for modern web applications'
    ]
  },
  {
    id: 'developer-portfolios',
    name: 'Developer Portfolios Framework',
    category: 'Portfolio & Brand',
    badge: 'Showcase',
    featured: false,
    description: 'Curated architectural framework and evaluation guides for building world-class developer portfolios and resume sites.',
    command: '/portfolio:audit',
    author: 'Emma Bostian inspired',
    folder: 'Skills/developer-portfolios',
    tags: ['Portfolios', 'Resume', 'Showcase', 'Personal Brand'],
    features: [
      'Structural blueprints for high-converting engineering portfolios',
      'Project showcase card patterns with live interactive demos',
      'Performance and SEO scoring checklists for personal websites',
      'Typographic pairings and theme presets for technical personal brands'
    ]
  }
];

// GET /skills - List all skills with optional query filters
router.get('/', (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let results = [...SKILLS_CATALOG];

    if (category && category !== 'All' && category !== 'all') {
      const catLower = category.toLowerCase();
      results = results.filter(s => s.category.toLowerCase() === catLower);
    }

    if (featured === 'true') {
      results = results.filter(s => s.featured);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.tags && s.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    res.json(results);
  } catch (error) {
    console.error('GET /skills error:', error);
    res.status(500).json({ error: 'Failed to retrieve skills catalog' });
  }
});

// GET /skills/categories - List available skill categories
router.get('/categories', (req, res) => {
  try {
    const categories = ['All', ...new Set(SKILLS_CATALOG.map(s => s.category))];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories' });
  }
});

// GET /skills/:id - Get specific skill details
router.get('/:id', (req, res) => {
  try {
    const skill = SKILLS_CATALOG.find(s => s.id === req.params.id);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve skill' });
  }
});

module.exports = router;
