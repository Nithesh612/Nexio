import React, { useState, useEffect, useMemo } from 'react'
import Header from '../components/Header'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import {
  ArrowLeft,
  Search,
  Sparkles,
  Terminal,
  Code2,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Zap,
  Play,
  Film,
  FolderOpen,
  Info,
  X,
  Compass,
  Cpu,
  Palette,
  Eye,
  SlidersHorizontal
} from 'lucide-react'
import { API_BASE_URL, API_SKILLS_URL } from '../config/api'

// Fallback catalog in case backend is offline or starting up
const FALLBACK_SKILLS = [
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
]

const CATEGORIES = [
  'All',
  'Design Intelligence',
  'Animation & Motion',
  'Video & Media',
  'Engineering & QA',
  'Modern Platform',
  'Portfolio & Brand'
]

export default function SkillsPage({
  onBackToHome,
  onNavigateToDesign,
  onNavigateToAITools,
  onNavigateToEditing,
  onNavigateToDashboard,
  onAddLink,
  user,
  onLogin,
  onLogout
}) {
  const [skills, setSkills] = useState(FALLBACK_SKILLS)
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [loading, setLoading] = useState(false)

  // Fetch live skills from API
  useEffect(() => {
    let isMounted = true
    const fetchSkills = async () => {
      try {
        setLoading(true)
        const res = await fetch(API_SKILLS_URL || `${API_BASE_URL}/skills`)
        if (res.ok) {
          const data = await res.json()
          if (isMounted && Array.isArray(data) && data.length > 0) {
            setSkills(data)
          }
        }
      } catch (err) {
        console.warn('API skills endpoint offline, using local catalog.', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchSkills()
    return () => { isMounted = false }
  }, [])

  const handleCopy = (id, command) => {
    navigator.clipboard.writeText(command)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchCat = activeCategory === 'All' || skill.category === activeCategory
      const matchSearch =
        !searchQuery.trim() ||
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (skill.tags && skill.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
      return matchCat && matchSearch
    })
  }, [skills, activeCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#0f172a] font-sans flex flex-col">
      {/* Top Header */}
      <Header
        currentView="skills"
        onNavigate={(target) => {
          if (target === 'landing') onBackToHome?.()
          else if (target === 'design') onNavigateToDesign?.()
          else if (target === 'ai-tools') onNavigateToAITools?.()
          else if (target === 'editing') onNavigateToEditing?.()
          else if (target === 'app') onNavigateToDashboard?.()
        }}
        onAddLink={onAddLink}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      {/* Hero Banner (Unslopped) */}
      <section className="relative w-full bg-[#0a0f1d] text-white py-16 px-6 overflow-hidden">
        {/* Subtle Ambient Light Wash */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[280px] pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          {/* Back button */}
          <div className="w-full flex items-center justify-start mb-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-all"
            >
              <ArrowLeft size={14} />
              <span>Back to Hub</span>
            </button>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/60 text-[11px] font-semibold tracking-wide text-indigo-300 uppercase mb-4">
            <Sparkles size={12} className="text-indigo-400" />
            <span>Workspace Capabilities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Agent Skills & Intelligence
          </h1>
          <p className="max-w-2xl text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            Extend your coding agents with GSAP animation engines, UI/UX Pro Max design intelligence,
            unslop design sanitizers, and automated video generation.
          </p>

          {/* Search bar */}
          <div className="w-full max-w-xl relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill name, framework, or capability (e.g. GSAP, video, unslop)..."
              className="w-full pl-11 pr-10 py-3 rounded-full bg-slate-900/90 border border-slate-700/70 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 w-full max-w-4xl text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium">Installed Skills</div>
              <div className="text-xl font-bold text-white mt-0.5">{skills.length} Engines</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium">Design Rules</div>
              <div className="text-xl font-bold text-indigo-400 mt-0.5">194 Rules</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium">Production Sites</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">2,320 Sites</div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm">
              <div className="text-xs text-slate-400 font-medium">Motion Engine</div>
              <div className="text-xl font-bold text-amber-400 mt-0.5">GSAP 3.15</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 w-full flex-1">
        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8 border-b border-slate-200/80">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-semibold text-slate-700">
            Showing <span className="text-slate-950 font-bold">{filteredSkills.length}</span> skills
            {activeCategory !== 'All' && <span> in <span className="text-indigo-600">{activeCategory}</span></span>}
          </div>
        </div>

        {/* Skills Cards Grid */}
        {filteredSkills.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200/70 p-8">
            <Compass size={40} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">No matching skills found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Try adjusting your search keywords or clear the category filter to view all capabilities.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All') }}
              className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col justify-between bg-white border border-slate-200/80 hover:border-slate-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-wide uppercase bg-slate-100 text-slate-700 border border-slate-200/60">
                      {skill.category}
                    </span>
                    {skill.badge && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {skill.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Author */}
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-0.5">
                    {skill.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-medium mb-2.5">
                    by {skill.author || 'Open Source'} • <span className="text-slate-500">{skill.folder}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {skill.description}
                  </p>

                  {/* Feature Highlights */}
                  {skill.features && skill.features.length > 0 && (
                    <div className="mb-4 space-y-1.5 pt-3 border-t border-slate-100">
                      {skill.features.slice(0, 2).map((feat, i) => (
                        <div key={i} className="flex items-start gap-2 text-[11px] text-slate-600">
                          <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(skill.tags || []).slice(0, 3).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-50 text-slate-500 border border-slate-100">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions & CLI Command */}
                <div className="pt-3 border-t border-slate-100">
                  {/* Command box */}
                  <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] mb-3 overflow-hidden">
                    <span className="truncate select-all">{skill.command || 'No command needed'}</span>
                    <button
                      onClick={() => handleCopy(skill.id, skill.command)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
                      title="Copy CLI command"
                    >
                      {copiedId === skill.id ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSkill(skill)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                    >
                      <Info size={13} />
                      <span>Details & Docs</span>
                    </button>
                    <button
                      onClick={() => handleCopy(skill.id, skill.command)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all"
                    >
                      {copiedId === skill.id ? <span>Copied!</span> : <span>Install</span>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Skill Detail Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                {selectedSkill.category}
              </span>
              {selectedSkill.badge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedSkill.badge}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {selectedSkill.name}
            </h2>
            <div className="text-xs text-slate-400 font-medium mb-4">
              Authored by <span className="text-slate-700 font-semibold">{selectedSkill.author}</span> • Location: <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded text-slate-700">{selectedSkill.folder}</code>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              {selectedSkill.description}
            </p>

            {/* Core Capabilities */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Core Capabilities & Workflow
              </h4>
              <ul className="space-y-2">
                {(selectedSkill.features || []).map((feat, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Terminal Command */}
            <div className="mb-5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                CLI Command / Activation
              </h4>
              <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                <span className="select-all">{selectedSkill.command}</span>
                <button
                  onClick={() => handleCopy(selectedSkill.id, selectedSkill.command)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 shrink-0 flex items-center gap-1 transition-colors"
                >
                  {copiedId === selectedSkill.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  <span>{copiedId === selectedSkill.id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {(selectedSkill.tags || []).map((tag, i) => (
                <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => setSelectedSkill(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Newsletter & Footer */}
      <NewsletterSection />
      <Footer />
    </div>
  )
}
