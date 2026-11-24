import { useEffect, useMemo, useState, useRef } from 'react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import Pagination from '../components/Pagination'
import {
  ArrowUpRight,
  Bell,
  BookmarkCheck,
  Bookmark,
  ChevronDown,
  Code2,
  Download,
  Edit2,
  FileText,
  FolderKanban,
  Heart,
  Inbox,
  Link2,
  LayoutGrid,
  List,
  Menu,
  Palette,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
  X,
  LogOut,
  Zap,
  Bot,
  Scissors,
  Video,
  Filter,
  Check,
  Sparkles,
} from 'lucide-react'
import LottieAnimation from '../home/LottieAnimation'
import GlobalSearchModal from './GlobalSearchModal'
import EditLinkModal from '../components/EditLinkModal'
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json'
import { API_BASE_URL, API_URL } from '../config/api'
import { FEATURED_QUICK_ASSETS } from '../config/featuredQuickAssets'
GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const navItems = [
  { label: 'All Links', icon: Link2 },
  { label: 'Dashboard', icon: FolderKanban },
  { label: 'Quick Assets', icon: Zap },
  { label: 'AI Tools', icon: Bot },
  { label: 'AI Image & Video', icon: Video },
  { label: 'Editing', icon: Scissors },
  { label: 'Saved', icon: Bookmark },
  { label: 'Favorites', icon: Heart },
]

const stats = [
  { label: 'Total Links', value: '128', delta: '+ 12%', accent: '#3b82f6', icon: Link2 },
  { label: 'Saved', value: '24', delta: '+ 8%', accent: '#f4c849', icon: Bookmark },
  { label: 'Categories', value: '0', delta: '+ 15%', accent: '#57c89d', icon: LayoutGrid },
  { label: 'Favorites', value: '0', delta: '+ 6%', accent: '#f43f5e', icon: Heart },
]

const PREDEFINED_CATEGORIES = [
  'Saved', 'Quick Assets', 'UI/UX', 'AI Image & Video', 'AI', 'Inspiration', 'Other',
  'Wallpaper', 'Stock', 'Host', 'Article', 'Editing', 'Research', 'Tools', 'Featured Quick Asset'
]

const recentLinks = [
  {
    id: 1,
    title: 'Figma — The Collaborative Interface Design Tool',
    url: 'https://www.figma.com/',
    description: 'Build better products as a team. Design, prototype, and gather feedback in one place.',
    meta: ['Design', 'UI/UX', 'Tool'],
    date: 'Today',
    accent: '#f26c5c',
    label: 'F',
    icon: Palette,
    category: 'UI/UX',
    favorite: true,
    readLater: true,
    collection: 'Inbox',
  },
  {
    id: 2,
    title: 'Behance — Creative portfolio inspiration',
    url: 'https://www.behance.net/',
    description: 'Explore digital art direction, branding systems, and modern visual storytelling.',
    meta: ['Portfolio', 'Branding', 'Inspiration'],
    date: 'Yesterday',
    accent: '#6d5df6',
    label: 'B',
    icon: Palette,
    category: 'Inspiration',
    favorite: true,
    readLater: false,
    collection: 'Favorites',
  },
  {
    id: 3,
    title: 'Dribbble — UI shots and product design',
    url: 'https://dribbble.com/',
    description: 'A curated source of product concepts, landing page ideas, and web design inspiration.',
    meta: ['UI', 'Product Design', 'Shots'],
    date: '2 days ago',
    accent: '#ff6b6b',
    label: 'D',
    icon: Palette,
    category: 'UI/UX',
    favorite: false,
    readLater: true,
    collection: 'Inbox',
  },
  {
    id: 4,
    title: 'Notion — The all-in-one workspace',
    url: 'https://www.notion.so/',
    description: 'Write, plan, collaborate, and get organized — all in one place.',
    meta: ['Productivity', 'Tool', 'Research'],
    date: '3 days ago',
    accent: '#efefef',
    label: 'N',
    icon: FileText,
    category: 'Resources',
    favorite: false,
    readLater: true,
    collection: 'Read Later',
  },
  {
    id: 5,
    title: 'Awwwards — Best digital design trends',
    url: 'https://www.awwwards.com/',
    description: 'Discover inspiration from award-winning interfaces, interactions, and product experiences.',
    meta: ['Trends', 'Interaction', 'Web'],
    date: '4 days ago',
    accent: '#f7b267',
    label: 'A',
    icon: Code2,
    category: 'Inspiration',
    favorite: true,
    readLater: false,
    collection: 'Favorites',
  },
]

// Category Gradient Palette matching Home page
const categoryColors = {
  'UI/UX': ['#667eea', '#764ba2'],
  'AI Image & Video': ['#f093fb', '#f5576c'],
  'AI': ['#a855f7', '#6366f1'],
  'Other': ['#64748b', '#475569'],
  'Inspiration': ['#fa709a', '#fee140'],
  'Wallpaper': ['#38ef7d', '#11998e'],
  'Stock': ['#ff9a9e', '#fecfef'],
  'Host': ['#2af598', '#009efd'],
  'Article': ['#f6d365', '#fda085'],
  'Editing': ['#96fbc4', '#f9f586'],
  'Research': ['#96fbc4', '#f9f586'],
  'Tools': ['#c471ed', '#f64f59'],
  'default': ['#a18cd1', '#fbc2eb'],
};

// Curated specific banners matching official design tools
const BRAND_PRESETS = {
  readymag: {
    title: 'Readymag',
    desc: 'Create all kinds of websites with flexibility and complete creative freedom.',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a85732e62373e8fdd649f78_readymag-website-builder.gif',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a857854796820f3bb34f62e_logo-readymag.svg',
    isPreset: true,
  },
  lovable: {
    title: 'Lovable',
    desc: 'Generate full-stack software, apps and tools with autonomous AI engineer.',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb97_lovable-ai-thumb.webp',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb98_lovable-logo.png',
    isPreset: true,
  },
  framer: {
    title: 'Framer',
    desc: 'Design and publish web sites at lightning speed with AI and no-code tools.',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    logoSvg: 'framer',
    isPreset: true,
  },
  figma: {
    title: 'Figma',
    desc: 'The leading collaborative interface design tool for modern product teams.',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    logoSvg: 'figma',
    isPreset: true,
  },
  webflow: {
    title: 'Webflow',
    desc: 'Build production-ready responsive websites visually with total code power.',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
    logoSvg: 'webflow',
    isPreset: true,
  }
};

function getSmartTag(item) {
  if (item.tag && !['saved', 'other', 'all', 'all links', 'inbox'].includes(item.tag.toLowerCase().trim())) {
    return item.tag;
  }

  const title = (item.title || '').toLowerCase();
  const desc = (item.desc || item.description || '').toLowerCase();
  const url = (item.url || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();

  if (url.includes('runway') || title.includes('runway')) return 'Video AI';
  if (url.includes('toools') || title.includes('toools')) return 'Design Vault';
  if (url.includes('readymag') || title.includes('readymag')) return 'Web Builder';
  if (url.includes('lovable') || title.includes('lovable')) return 'AI Engineer';
  if (url.includes('figma') || title.includes('figma')) return 'UI Design';
  if (url.includes('framer') || title.includes('framer')) return 'Site Builder';
  if (url.includes('webflow') || title.includes('webflow')) return 'Visual Dev';
  if (url.includes('midjourney') || title.includes('midjourney')) return 'Image AI';
  if (url.includes('cursor') || title.includes('cursor')) return 'Code Editor';
  if (url.includes('v0.dev') || title.includes('v0')) return 'Frontend AI';
  if (url.includes('spline') || title.includes('spline')) return '3D & Motion';
  if (url.includes('krea') || title.includes('krea')) return 'Realtime AI';
  if (url.includes('claude') || url.includes('anthropic')) return 'LLM Model';
  if (url.includes('chatgpt') || url.includes('openai')) return 'AI Chatbot';
  if (url.includes('gemini') || title.includes('gemini')) return 'Multimodal AI';
  if (url.includes('relume') || title.includes('relume')) return 'Wireframe AI';
  if (url.includes('recraft') || title.includes('recraft')) return 'Vector AI';
  if (url.includes('mobbin') || title.includes('mobbin')) return 'Mobile UX';
  if (url.includes('dribbble') || url.includes('behance')) return 'Inspiration';
  if (url.includes('luma') || url.includes('dream-machine')) return '3D Video AI';
  if (url.includes('flux') || url.includes('black-forest')) return 'Image AI';
  if (url.includes('pika') || title.includes('pika')) return 'Video AI';
  if (url.includes('suno') || url.includes('udio')) return 'Audio AI';
  if (url.includes('elevenlabs') || title.includes('elevenlabs')) return 'Voice AI';
  if (url.includes('bolt.new') || title.includes('bolt')) return 'Fullstack AI';
  if (url.includes('notion') || title.includes('notion')) return 'Productivity';
  if (url.includes('linear') || title.includes('linear')) return 'Issue Tracker';
  if (url.includes('github') || url.includes('gitlab')) return 'Code Repo';
  if (url.includes('unsplash') || url.includes('pexels')) return 'Stock Photos';
  if (url.includes('font') || url.includes('type')) return 'Typography';
  if (url.includes('icon') || url.includes('lucide')) return 'Icons';
  if (url.includes('shadcn') || url.includes('tailwind')) return 'UI Component';
  if (url.includes('vercel') || url.includes('netlify') || url.includes('supabase')) return 'Cloud Host';

  if (title.includes('video') || desc.includes('video') || desc.includes('motion')) return 'Video AI';
  if (title.includes('image') || desc.includes('image') || desc.includes('generat') || desc.includes('art')) return 'Graphic AI';
  if (title.includes('chat') || desc.includes('chat') || desc.includes('assistant') || desc.includes('llm')) return 'AI Chatbot';
  if (title.includes('code') || desc.includes('coding') || desc.includes('developer') || desc.includes('programming')) return 'Dev Tool';
  if (title.includes('icon') || desc.includes('icon') || desc.includes('vector')) return 'Icons';
  if (title.includes('font') || desc.includes('font') || desc.includes('type')) return 'Typography';
  if (title.includes('3d') || desc.includes('3d') || desc.includes('render')) return '3D Assets';
  if (title.includes('color') || desc.includes('color') || desc.includes('palette')) return 'Color Tool';
  if (title.includes('builder') || desc.includes('builder') || desc.includes('website') || desc.includes('no-code')) return 'Web Builder';
  if (title.includes('mockup') || desc.includes('mockup') || desc.includes('ui kit')) return 'UI Kit';
  if (title.includes('ux') || desc.includes('ux') || desc.includes('usability')) return 'UX Tool';
  if (title.includes('inspir') || desc.includes('inspiration')) return 'Inspiration';
  if (title.includes('learn') || desc.includes('course') || desc.includes('tutorial')) return 'Learning';
  if (title.includes('stock') || desc.includes('photo') || desc.includes('footage')) return 'Stock Media';
  if (title.includes('article') || desc.includes('article') || desc.includes('essay')) return 'Article';

  if (cat && !['saved', 'other', 'all', 'all links', 'inbox'].includes(cat)) {
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  }

  return 'Design Tool';
}

function getSmartPricing(item) {
  if (item.pricing) return item.pricing;
  const url = (item.url || '').toLowerCase();
  const desc = (item.desc || item.description || '').toLowerCase();

  if (url.includes('midjourney') || desc.includes('subscription only') || desc.includes('paid only')) return 'PAID';
  if (url.includes('runway') || url.includes('lovable') || url.includes('cursor')) return 'FREE TRIAL';
  if (url.includes('lucide') || url.includes('github') || url.includes('react') || desc.includes('open source') || desc.includes('free to use')) return 'FREE';
  if (url.includes('figma') || desc.includes('free plan')) return 'FREE + PAID';

  return 'FREEMIUM';
}

function getPricingClass(pricing = '') {
  const p = pricing.toUpperCase().trim();
  if (p.includes('TRIAL')) return 'pricing-free-trial';
  if (p.includes('FREE + PAID')) return 'pricing-free-paid';
  if (p.includes('FREEMIUM')) return 'pricing-freemium';
  if (p.includes('PAID')) return 'pricing-paid';
  if (p.includes('FREE')) return 'pricing-free';
  return 'pricing-freemium';
}

function getHostname(url) {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./i, '')
  } catch {
    return ''
  }
}

// Dashboard Link Card Matching Home Page LinkCard design with Admin controls
function DashboardLinkCard({ item, isDashboardView, onOpen, onEdit, onDelete, onToggleFavorite, favoritePulseId }) {
  const [screenshotError, setScreenshotError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const cleanUrl = (() => {
    try {
      const u = item.url.startsWith('http') ? item.url : `https://${item.url}`;
      return new URL(u).href;
    } catch {
      return item.url;
    }
  })();

  const hostname = (() => {
    try {
      return new URL(cleanUrl).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();

  const domainSlug = hostname.split('.')[0]?.toLowerCase();
  const preset = BRAND_PRESETS[domainSlug] || (item.title?.toLowerCase().includes('readymag') ? BRAND_PRESETS.readymag : null);

  const primaryScreenshot = item.bannerUrl || (preset ? preset.bannerUrl : `https://image.thum.io/get/width/600/crop/400/${cleanUrl}`);
  const secondaryScreenshot = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  const tertiaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600&h=380`;
  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot);

  const clearbitLogo = `https://logo.clearbit.com/${hostname}`;
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  const logoSrc = item.logoUrl || preset?.logoUrl || (!logoError ? clearbitLogo : googleFavicon);

  const colors = categoryColors[item.category] || categoryColors['default'];
  const isReadymag = domainSlug === 'readymag' || item.title?.toLowerCase().includes('readymag');

  return (
    <article className="dash-link-card">
      {/* Top Banner Wrapper */}
      <div className="dash-card-banner-wrap">
        <div
          className="dash-card-banner"
          style={{
            background: isReadymag
              ? '#ff69b4'
              : `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          }}
        >
          {!screenshotError ? (
            <img
              src={currentScreenshot}
              alt={`${item.title} live banner`}
              className="dash-card-screenshot"
              loading="lazy"
              onError={() => {
                if (currentScreenshot === primaryScreenshot) {
                  setCurrentScreenshot(secondaryScreenshot);
                } else if (currentScreenshot === secondaryScreenshot) {
                  setCurrentScreenshot(tertiaryScreenshot);
                } else {
                  setScreenshotError(true);
                }
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>
                {item.title?.charAt(0) || '✦'}
              </span>
            </div>
          )}

          {/* Category Pill Tag */}
          <span className="dash-category-pill">{getSmartTag(item)}</span>

          {/* Favorite / Feature Button on top right */}
          <button
            type="button"
            className={`dash-fav-btn ${item.favorite ? 'active' : ''} ${favoritePulseId === item.id ? 'vibrate' : ''}`}
            aria-label={(() => {
              const isQuick = item.collection === 'Quick Assets' || item.category === 'Quick Assets' || item.category === 'Featured Quick Asset' || item.kind === 'quick-asset' || (item.category && item.category.toLowerCase().includes('quick'))
              if (isQuick) return item.favorite ? `Remove ${item.title} from Home Quick Assets` : `Feature ${item.title} in Home Quick Assets`
              return item.favorite ? `Remove ${item.title} from Favorites` : `Add ${item.title} to Favorites`
            })()}
            title={(() => {
              const isQuick = item.collection === 'Quick Assets' || item.category === 'Quick Assets' || item.category === 'Featured Quick Asset' || item.kind === 'quick-asset' || (item.category && item.category.toLowerCase().includes('quick'))
              if (isQuick) return item.favorite ? 'Featured in Home Quick Assets' : 'Feature in Home Quick Assets'
              return item.favorite ? 'Favorited' : 'Add to Favorites'
            })()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite(item.id);
            }}
          >
            <Heart size={15} fill={item.favorite ? 'currentColor' : 'none'} strokeWidth={item.favorite ? 0 : 2.5} />
          </button>
        </div>

        {/* Circular Live Logo Badge Overlapping Bottom Right */}
        <div className="dash-card-logo-badge">
          {preset?.logoSvg === 'framer' ? (
            <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#fff' }}>
                <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
              </svg>
            </div>
          ) : preset?.logoSvg === 'figma' ? (
            <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 38 57" style={{ width: '16px', height: '24px' }}>
                <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
                <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
                <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
                <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
                <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
              </svg>
            </div>
          ) : (
            <img
              src={logoSrc}
              alt={`${item.title} logo`}
              className="dash-badge-img"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="dash-card-body">
        <h3 className="dash-card-title">{item.title}</h3>
        <p className="dash-card-desc">
          {item.desc || item.description || `Curated ${item.category || 'design'} tool and resource.`}
        </p>

        {/* Smart Tag & Pricing Row */}
        <div className="dash-card-footer">
          <span className="dash-tag-pill">{getSmartTag(item)}</span>
          <span className={`dash-pricing-pill ${getPricingClass(getSmartPricing(item))}`}>
            {getSmartPricing(item)}
          </span>
        </div>

        {/* Admin Action Row */}
        <div className="dash-admin-actions">
          <button type="button" className="dash-open-btn" onClick={() => onOpen(item.url)}>
            Open service <ArrowUpRight size={13} />
          </button>
          {isDashboardView && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button type="button" className="dash-edit-btn" onClick={() => onEdit(item)}>
                <Edit2 size={12} /> Edit
              </button>
              <button type="button" className="dash-delete-btn" onClick={() => onDelete(item)}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function getFaviconUrl(url) {
  const hostname = getHostname(url)
  return hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=128` : ''
}

function getScreenshotUrl(url) {
  try {
    const clean = url.startsWith('http') ? url : `https://${url}`;
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(clean)}?w=800&h=500`;
  } catch {
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=500`;
  }
}

function getLiveDescription(item, title, category) {
  const source = `${item.url || ''} ${title} ${category}`.toLowerCase()

  if (source.includes('lightswind') || source.includes('animated') || source.includes('block')) {
    return 'Animated UI component blocks and integration sections for modern web interfaces.'
  }
  if (source.includes('figma')) {
    return 'Collaborative interface design, prototyping, and product feedback tools for teams.'
  }
  if (source.includes('behance')) {
    return 'Creative portfolio inspiration, visual projects, and design work from the community.'
  }
  if (source.includes('dribbble')) {
    return 'Product design shots, interface ideas, and creative inspiration for digital teams.'
  }
  if (source.includes('notion')) {
    return 'Workspace for notes, documents, planning, collaboration, and organized projects.'
  }
  if (source.includes('design') || source.includes('ui/ux')) {
    return 'Design resources and interface inspiration for creating modern digital experiences.'
  }
  if (source.includes('develop') || source.includes('code')) {
    return 'Developer resources, tools, and references for building web applications faster.'
  }

  return `${category} resources and useful content from ${getHostname(item.url) || 'this website'}.`
}

function downloadFile(content, fileName, type) {
  const blob = content instanceof Blob ? content : new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function escapePdfText(value) {
  return String(value ?? '')
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/([\\()])/g, '\\$1')
}

function createPdf(links) {
  const safeLinks = Array.isArray(links) ? links : []
  const totalPages = Math.max(1, Math.ceil(safeLinks.length / 10))

  const columns = [
    { label: 'TITLE', x: 68, width: 140, key: 'title' },
    { label: 'CATEGORY', x: 215, width: 110, key: 'category' },
    { label: 'LINK', x: 330, width: 310, key: 'url' },
    { label: 'DESCRIPTION', x: 645, width: 135, key: 'description' },
  ]

  const wrapText = (value, length) => {
    const text = String(value || '-')
    const words = text.split(/\s+/)
    const lines = []
    let current = ''
    words.forEach((word) => {
      if ((current + ' ' + word).trim().length > length && current) {
        lines.push(current)
        current = word
      } else {
        current = `${current} ${word}`.trim()
      }
    })
    if (current) lines.push(current)
    return lines.slice(0, 2)
  }

  // Generate stream commands for each page
  const pageStreams = []
  for (let p = 0; p < totalPages; p++) {
    const pageLinks = safeLinks.slice(p * 10, (p + 1) * 10)
    const pageNumber = p + 1

    const commands = [
      'BT',
      '/F1 20 Tf',
      '68 550 Td',
      `(${escapePdfText('Nexio Links Export')}${totalPages > 1 ? ` - Page ${pageNumber} of ${totalPages}` : ''}) Tj`,
      '/F1 10 Tf',
      '0.42 0.46 0.54 rg',
      '0 -18 Td',
      '(Your saved links, organized by title and category.) Tj',
      'ET',
      'q',
      '0.94 0.95 0.97 rg',
      '56 475 730 30 re f',
      'Q',
      'BT',
      '/F1 9 Tf',
      '0.38 0.42 0.49 rg',
      ...columns.map((column) => `1 0 0 1 ${column.x} 486 Tm (${column.label}) Tj`),
      'ET',
    ]

    pageLinks.forEach((item, rowIndex) => {
      const y = 450 - rowIndex * 40
      commands.push('q', '0.88 0.89 0.92 RG', '0.6 w', `56 ${y - 26} 730 40 re S`, 'Q')
      commands.push('BT', '/F1 9 Tf')
      columns.forEach((column) => {
        commands.push(column.key === 'url' ? '0.25 0.25 0.85 rg' : '0.12 0.16 0.22 rg')
        wrapText(item[column.key], Math.floor(column.width / 6)).forEach((line, lineIndex) => {
          commands.push(`1 0 0 1 ${column.x} ${y - lineIndex * 12} Tm (${escapePdfText(line)}) Tj`)
        })
      })
      commands.push('ET')
    })

    commands.push(
      'BT',
      '/F1 9 Tf',
      '0.55 0.58 0.64 rg',
      `1 0 0 1 68 25 Tm (Page ${pageNumber} of ${totalPages}  |  Total: ${safeLinks.length} saved link${safeLinks.length === 1 ? '' : 's'}) Tj`,
      'ET'
    )

    pageStreams.push(commands.join('\n'))
  }

  // Multi-page PDF Object hierarchy
  const kids = []
  for (let p = 0; p < totalPages; p++) {
    kids.push(`${4 + p * 2} 0 R`)
  }

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${totalPages} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  for (let p = 0; p < totalPages; p++) {
    const stream = pageStreams[p]
    const pageObj = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + p * 2} 0 R >>`
    const streamObj = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    objects.push(pageObj)
    objects.push(streamObj)
  }

  let pdf = '%PDF-1.4\n'
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return pdf
}

async function parseImportFile(file) {
  const fileName = file.name.toLowerCase()

  if (fileName.endsWith('.pdf')) {
    const pdf = await getDocument({ data: await file.arrayBuffer() }).promise
    const textItems = []
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber)
      const content = await page.getTextContent()
      textItems.push(...content.items
        .filter((item) => item.str?.trim())
        .map((item) => ({
          text: item.str.trim(),
          x: item.transform[4],
          y: item.transform[5],
        })))
    }

    return textItems
      .filter((item) => /^https?:\/\//i.test(item.text))
      .map((urlItem) => {
        const nearby = textItems.filter((item) => Math.abs(item.y - urlItem.y) < 35)
        const nearest = (items, fallback) => items
          .sort((first, second) => Math.abs(first.y - urlItem.y) - Math.abs(second.y - urlItem.y))[0]?.text || fallback

        return {
          title: nearest(nearby.filter((item) => item.x >= 55 && item.x < 200), getHostname(urlItem.text)),
          category: nearest(nearby.filter((item) => item.x >= 195 && item.x < 325), 'Imported'),
          url: urlItem.text,
          description: nearest(nearby.filter((item) => item.x >= 645), ''),
        }
      })
  }

  const text = await file.text()
  if (!fileName.endsWith('.csv')) {
    const data = JSON.parse(text)
    return Array.isArray(data) ? data : Array.isArray(data.links) ? data.links : []
  }

  const rows = text.trim().split(/\r?\n/).filter(Boolean).map((row) => row.split(',').map((value) => value.trim().replace(/^"|"$/g, '')))
  if (rows.length < 2) return []

  const headers = rows[0].map((header) => header.toLowerCase())
  return rows.slice(1).map((values) => headers.reduce((item, header, index) => ({
    ...item,
    [header]: values[index] || '',
  }), {}))
}

function mapLiveLink(item, index) {
  const category = item.category || item.type || 'Resources'
  const hostname = getHostname(item.url)
  const genericTitles = ['Imported', 'General', 'AI Agents', 'UI/UX', 'Development', 'Resources', 'Inspiration']
  const title = item.title && !genericTitles.includes(item.title.trim())
    ? item.title
    : hostname
      ? hostname.split('.')[0].charAt(0).toUpperCase() + hostname.split('.')[0].slice(1)
      : 'Saved link'
  const icon = category.toLowerCase().includes('design') || category.toLowerCase().includes('ui')
    ? Palette
    : category.toLowerCase().includes('develop')
      ? Code2
      : FileText

  return {
    id: item.id || item._id || `live-${index}`,
    title,
    url: item.url,
    description: item.description || getLiveDescription(item, title, category),
    meta: [category],
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
    accent: category.toLowerCase().includes('design') ? '#f26c5c' : '#6d5df6',
    label: title.charAt(0).toUpperCase(),
    icon,
    category,
    favorite: Boolean(item.favorite),
    readLater: Boolean(item.readLater),
    collection: item.collection || 'All Links',
    badge: item.badge || '',
    logoUrl: item.logoUrl || '',
    bannerUrl: item.bannerUrl || '',
    kind: (item.collection === 'Quick Assets' || item.category === 'Featured Quick Asset') ? 'quick-asset' : (item.kind || 'regular'),
  }
}

function LinkIcon({ className }) {
  return <div className={className}><Link2 size={18} /></div>
}

function StarIcon({ className }) {
  return <div className={className}><Heart size={18} fill="none" strokeWidth={2.5} /></div>
}

function TagIcon({ className }) {
  return <div className={className}><BookmarkCheck size={18} /></div>
}

function InboxIcon({ className }) {
  return <div className={className}><Inbox size={18} /></div>
}

function AIToolCard({ tool, onOpen, onEdit, onDelete, onToggleEssential }) {
  const [screenshotError, setScreenshotError] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const cleanUrl = useMemo(() => {
    try {
      const u = tool.url.startsWith('http') ? tool.url : `https://${tool.url}`
      return new URL(u).href
    } catch {
      return tool.url || ''
    }
  }, [tool.url])

  const hostname = useMemo(() => {
    try {
      return new URL(cleanUrl).hostname.replace(/^www\./, '')
    } catch {
      return ''
    }
  }, [cleanUrl])

  const domainSlug = hostname.split('.')[0]?.toLowerCase()
  const preset = BRAND_PRESETS[domainSlug] || (tool.name?.toLowerCase().includes('readymag') ? BRAND_PRESETS.readymag : null)

  const primaryScreenshot = tool.bannerUrl || (preset ? preset.bannerUrl : `https://image.thum.io/get/width/600/crop/400/${cleanUrl}`)
  const secondaryScreenshot = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`
  const tertiaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600&h=380`

  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot)

  useEffect(() => {
    setCurrentScreenshot(primaryScreenshot)
    setScreenshotError(false)
  }, [primaryScreenshot])

  const clearbitLogo = `https://logo.clearbit.com/${hostname}`
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  const logoSrc = tool.logoUrl || preset?.logoUrl || (!logoError ? clearbitLogo : googleFavicon)

  const isReadymag = domainSlug === 'readymag' || tool.name?.toLowerCase().includes('readymag')
  const tagLabel = tool.tag || (tool.category && tool.category !== 'ui-web' ? tool.category : 'AI Tool')
  const pricingLabel = tool.pricing || 'FREEMIUM'

  return (
    <article className="dash-link-card">
      {/* Top Banner Wrapper */}
      <div className="dash-card-banner-wrap">
        <div
          className="dash-card-banner"
          style={{
            background: isReadymag
              ? '#ff69b4'
              : 'linear-gradient(135deg, #1e1b4b, #312e81)',
          }}
        >
          {!screenshotError ? (
            <img
              src={currentScreenshot}
              alt={`${tool.name} live banner`}
              className="dash-card-screenshot"
              loading="lazy"
              onError={() => {
                if (currentScreenshot === primaryScreenshot) {
                  setCurrentScreenshot(secondaryScreenshot)
                } else if (currentScreenshot === secondaryScreenshot) {
                  setCurrentScreenshot(tertiaryScreenshot)
                } else {
                  setScreenshotError(true)
                }
              }}
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <span style={{ fontSize: '36px', fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>
                {tool.name?.charAt(0) || '⚡'}
              </span>
            </div>
          )}

          {/* Category Pill Tag */}
          <span className="dash-category-pill">{tagLabel}</span>

          {/* Essential / Favorite Heart Button on top right */}
          <button
            type="button"
            className={`dash-fav-btn ${tool.showInEssential ? 'active' : ''}`}
            aria-label={tool.showInEssential ? `Remove ${tool.name} from Home Essentials` : `Feature ${tool.name} on Home Essentials`}
            title={tool.showInEssential ? 'Featured on Home Essentials' : 'Add to Home Essentials'}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleEssential(tool)
            }}
          >
            <Heart size={15} fill={tool.showInEssential ? 'currentColor' : 'none'} strokeWidth={tool.showInEssential ? 0 : 2.5} />
          </button>
        </div>

        {/* Circular Live Logo Badge Overlapping Bottom Right */}
        <div className="dash-card-logo-badge">
          {preset?.logoSvg === 'framer' ? (
            <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 24 24" style={{ width: '18px', height: '18px', fill: '#fff' }}>
                <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
              </svg>
            </div>
          ) : preset?.logoSvg === 'figma' ? (
            <div style={{ width: '100%', height: '100%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 38 57" style={{ width: '16px', height: '24px' }}>
                <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
                <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
                <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
                <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
                <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
              </svg>
            </div>
          ) : (
            <img
              src={logoSrc}
              alt={`${tool.name} logo`}
              className="dash-badge-img"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="dash-card-body">
        <h3 className="dash-card-title">{tool.name}</h3>
        <p className="dash-card-desc">
          {tool.desc || `Curated artificial intelligence tool for modern designers & developers.`}
        </p>

        {/* Smart Tag & Pricing Row */}
        <div className="dash-card-footer">
          <span className="dash-tag-pill">{tagLabel}</span>
          <span className={`dash-pricing-pill ${getPricingClass(pricingLabel)}`}>
            {pricingLabel}
          </span>
        </div>

        {/* Admin Action Row */}
        <div className="dash-admin-actions">
          <button type="button" className="dash-open-btn" onClick={() => onOpen(tool.url)}>
            Open service <ArrowUpRight size={13} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button type="button" className="dash-edit-btn" onClick={() => onEdit(tool)}>
              <Edit2 size={12} /> Edit
            </button>
            <button type="button" className="dash-delete-btn" onClick={() => onDelete(tool)}>
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

function AIToolsManager() {
  const emptyForm = {
    toolId: '',
    name: '',
    desc: '',
    tag: '',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    url: '',
    bannerType: 'dynamic-db',
    bannerUrl: '',
    isPartner: false,
    showInEssential: false,
  }

  const [tools, setTools] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [categorySearchQuery, setCategorySearchQuery] = useState('')
  const categoryDropdownRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [form, setForm] = useState(emptyForm)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')
  const cardsPerPage = 9

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const categories = useMemo(() => [
    { id: 'all', label: 'All AI Tools' },
    { id: 'essential', label: 'Home Essentials' },
    { id: 'ui-web', label: 'UI & Web' },
    { id: 'art-images', label: 'Image & Art' },
    { id: 'copy-llm', label: 'Chat & LLMs' },
    { id: '3d-motion', label: '3D & Motion' },
    { id: 'code-dev', label: 'Dev & Code' },
    { id: 'color-brand', label: 'Color & Brand' },
    { id: 'workflow', label: 'Workflow' },
  ], [])

  const categoryCounts = useMemo(() => {
    const counts = { all: tools.length, essential: 0 }
    categories.forEach(cat => { counts[cat.id] = 0 })
    counts['all'] = tools.length

    tools.forEach((tool) => {
      if (tool.showInEssential) counts['essential'] = (counts['essential'] || 0) + 1
      const toolCat = (tool.category || '').toLowerCase()
      const toolTag = (tool.tag || '').toLowerCase()

      if (toolCat === 'art-images' || toolCat.includes('image') || toolCat.includes('video') || toolTag.includes('image') || toolTag.includes('video')) {
        counts['art-images'] = (counts['art-images'] || 0) + 1
      }
      if (toolCat === 'copy-llm' || toolCat.includes('chat') || toolCat.includes('llm') || toolTag.includes('chat') || toolTag.includes('llm')) {
        counts['copy-llm'] = (counts['copy-llm'] || 0) + 1
      }
      if (toolCat === 'ui-web' || toolTag.includes('ui') || toolTag.includes('web')) {
        counts['ui-web'] = (counts['ui-web'] || 0) + 1
      }
      if (toolCat === '3d-motion' || toolTag.includes('3d') || toolTag.includes('motion')) {
        counts['3d-motion'] = (counts['3d-motion'] || 0) + 1
      }
      if (toolCat === 'code-dev' || toolTag.includes('code') || toolTag.includes('dev')) {
        counts['code-dev'] = (counts['code-dev'] || 0) + 1
      }
      if (toolCat === 'color-brand' || toolTag.includes('color') || toolTag.includes('brand')) {
        counts['color-brand'] = (counts['color-brand'] || 0) + 1
      }
      if (toolCat === 'workflow' || toolTag.includes('workflow')) {
        counts['workflow'] = (counts['workflow'] || 0) + 1
      }
    })
    return counts
  }, [tools, categories])

  const filteredDropdownCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return categories
    const q = categorySearchQuery.toLowerCase().trim()
    return categories.filter((cat) => cat.label.toLowerCase().includes(q))
  }, [categories, categorySearchQuery])

  const activeCategoryObj = useMemo(() => {
    return categories.find((c) => c.id === activeCategory) || categories[0]
  }, [categories, activeCategory])

  const fetchTools = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-tools`)
      const data = await response.json().catch(() => [])
      if (!response.ok) throw new Error(data.message || data.error || 'Could not load AI tools.')
      let loadedTools = Array.isArray(data) ? data : Array.isArray(data?.tools) ? data.tools : []

      // Also pull AI tools saved in the Hub links collection
      try {
        const hubRes = await fetch(API_URL)
        if (hubRes.ok) {
          const hubData = await hubRes.json().catch(() => [])
          if (Array.isArray(hubData)) {
            const existingUrls = new Set(loadedTools.map(t => (t.url || '').toLowerCase().replace(/^https?:\/\//i, '').replace(/\/$/, '')))
            const aiHubLinks = hubData.filter(item => {
              const cat = (item.category || '').toLowerCase()
              const col = (item.collection || '').toLowerCase()
              const cleanU = (item.url || '').toLowerCase().replace(/^https?:\/\//i, '').replace(/\/$/, '')
              return (cat.includes('ai') || col.includes('ai')) && !existingUrls.has(cleanU)
            }).map(item => ({
              _id: item.id || item._id,
              toolId: item.id || item._id,
              name: item.title,
              url: item.url,
              desc: item.description,
              category: (item.category || '').toLowerCase().includes('image') || (item.category || '').toLowerCase().includes('video') ? 'art-images' : 'ui-web',
              tag: item.category || 'AI Tool',
              pricing: 'FREEMIUM',
              bannerUrl: item.bannerUrl || '',
              bannerType: 'image',
              showInEssential: Boolean(item.favorite),
              isPartner: false
            }))
            loadedTools = [...loadedTools, ...aiHubLinks]
          }
        }
      } catch {
        // silent fallback
      }

      setTools(loadedTools)
    } catch (loadError) {
      setError(loadError.message || 'Could not load AI tools.')
      setTools([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTools()

    const handleUpdate = () => {
      fetchTools()
    }

    window.addEventListener('nexio_ai_tools_updated', handleUpdate)
    window.addEventListener('nexio_links_updated', handleUpdate)
    window.addEventListener('nexio_link_saved', handleUpdate)
    return () => {
      window.removeEventListener('nexio_ai_tools_updated', handleUpdate)
      window.removeEventListener('nexio_links_updated', handleUpdate)
      window.removeEventListener('nexio_link_saved', handleUpdate)
    }
  }, [])

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const toolCat = (tool.category || '').toLowerCase()
      const toolTag = (tool.tag || '').toLowerCase()
      const matchesCategory =
        activeCategory === 'all'
          ? true
          : activeCategory === 'essential'
            ? Boolean(tool.showInEssential)
            : activeCategory === 'art-images'
              ? (toolCat === 'art-images' || toolCat.includes('image') || toolCat.includes('video') || toolTag.includes('image') || toolTag.includes('video'))
              : activeCategory === 'copy-llm'
                ? (toolCat === 'copy-llm' || toolCat.includes('chat') || toolCat.includes('llm') || toolTag.includes('chat') || toolTag.includes('llm'))
                : (toolCat === activeCategory.toLowerCase() || toolTag.includes(activeCategory.toLowerCase()))

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !q ||
        (tool.name && tool.name.toLowerCase().includes(q)) ||
        (tool.desc && tool.desc.toLowerCase().includes(q)) ||
        (tool.tag && tool.tag.toLowerCase().includes(q)) ||
        (tool.url && tool.url.toLowerCase().includes(q)) ||
        (tool.pricing && tool.pricing.toLowerCase().includes(q))

      return matchesCategory && matchesSearch
    })
  }, [tools, activeCategory, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeCategory, searchQuery])

  const totalPages = Math.ceil(filteredTools.length / cardsPerPage)
  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * cardsPerPage
    return filteredTools.slice(startIndex, startIndex + cardsPerPage)
  }, [filteredTools, currentPage])

  const updateForm = (event) => {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  const openAddModal = () => {
    setItemToEdit(null)
    setForm(emptyForm)
    setError('')
    setIsAddModalOpen(true)
  }

  const openEditModal = (tool) => {
    setItemToEdit(tool)
    setForm({
      toolId: tool.toolId || '',
      name: tool.name || '',
      desc: tool.desc || '',
      tag: tool.tag || '',
      category: tool.category || 'ui-web',
      pricing: tool.pricing || 'FREEMIUM',
      url: tool.url || '',
      bannerType: tool.bannerType || 'dynamic-db',
      bannerUrl: tool.bannerUrl || '',
      isPartner: Boolean(tool.isPartner),
      showInEssential: Boolean(tool.showInEssential),
    })
    setError('')
    setIsAddModalOpen(false)
  }

  const closeFormModal = () => {
    setIsAddModalOpen(false)
    setItemToEdit(null)
    setForm(emptyForm)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    const payload = {
      ...form,
      toolId: form.toolId.trim() || form.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      bannerType: form.bannerType || 'dynamic-db',
    }

    const editId = itemToEdit ? itemToEdit._id || itemToEdit.id : null

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/ai-tools${editId ? `/${editId}` : ''}`,
        {
          method: editId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || data.error || 'Could not save AI tool.')

      closeFormModal()
      await fetchTools()
      window.dispatchEvent(new Event('nexio_ai_tools_updated'))
      if (!editId) {
        window.dispatchEvent(new CustomEvent('nexio_link_saved', {
          detail: {
            title: payload.name || 'AI Tool',
            category: 'AI Tools',
            url: payload.url,
          }
        }))
      }
    } catch (saveError) {
      setError(saveError.message || 'Could not save AI tool.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (tool) => {
    setItemToDelete(tool)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    const id = itemToDelete._id || itemToDelete.id
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-tools/${id}`, { method: 'DELETE' })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || data.error || 'Could not delete AI tool.')

      const deletedTitle = itemToDelete.name || 'AI Tool'
      setItemToDelete(null)
      await fetchTools()
      window.dispatchEvent(new Event('nexio_ai_tools_updated'))
      window.dispatchEvent(new CustomEvent('nexio_link_deleted', {
        detail: {
          title: deletedTitle,
          category: 'AI Tools',
        }
      }))
    } catch (deleteError) {
      alert(deleteError.message || 'Could not delete AI tool.')
    } finally {
      setIsDeleting(false)
    }
  }

  const toggleEssential = async (tool) => {
    const nextValue = !tool.showInEssential
    setTools((current) =>
      current.map((item) =>
        (item._id === tool._id || item.id === tool.id) ? { ...item, showInEssential: nextValue } : item
      )
    )
    try {
      const id = tool._id || tool.id
      const response = await fetch(`${API_BASE_URL}/api/ai-tools/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...tool, showInEssential: nextValue }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || data.error || 'Could not update home visibility.')
      window.dispatchEvent(new Event('nexio_ai_tools_updated'))
    } catch (toggleError) {
      setTools((current) =>
        current.map((item) =>
          (item._id === tool._id || item.id === tool.id) ? { ...item, showInEssential: !nextValue } : item
        )
      )
    }
  }

  const handleOpenTool = (url) => {
    if (!url) return
    const targetUrl = url.startsWith('http') ? url : `https://${url}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Category Filter and Search Bar Container */}
      <div className="chip-row-container">
        <div className="filter-group">
          <button
            type="button"
            className={`chip ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory('all')
              setCategoryDropdownOpen(false)
            }}
          >
            All AI Tools
            <span className="category-count-badge" style={{ marginLeft: '6px' }}>
              {tools.length}
            </span>
          </button>

          <div className="filter-dropdown-wrap" ref={categoryDropdownRef}>
            <button
              type="button"
              className={`category-dropdown-btn ${activeCategory !== 'all' ? 'active-filter' : ''}`}
              onClick={() => setCategoryDropdownOpen((prev) => !prev)}
              aria-expanded={categoryDropdownOpen}
            >
              <Filter size={15} className="category-btn-icon" />
              <span>
                {activeCategory === 'all' ? 'Select Category' : activeCategoryObj.label}
              </span>
              {activeCategory !== 'all' && (
                <>
                  <span className="category-count-badge">
                    {categoryCounts[activeCategory] || 0}
                  </span>
                  <span
                    className="category-clear-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveCategory('all')
                      setCategoryDropdownOpen(false)
                    }}
                    title="Reset to All"
                    role="button"
                    tabIndex={0}
                  >
                    <X size={11} />
                  </span>
                </>
              )}
              <ChevronDown
                size={14}
                className="category-chevron"
                style={{
                  transform: categoryDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                  marginLeft: '2px',
                }}
              />
            </button>

            {categoryDropdownOpen && (
              <div className="category-dropdown-menu">
                {categories.length > 5 && (
                  <div className="category-dropdown-search">
                    <Search size={14} color="#94a3b8" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      autoFocus
                    />
                    {categorySearchQuery && (
                      <button
                        type="button"
                        className="chip-search-clear"
                        onClick={() => setCategorySearchQuery('')}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                )}
                <div className="category-dropdown-list">
                  {filteredDropdownCategories.map((cat) => {
                    const isSelected = activeCategory === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        className={`category-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => {
                          setActiveCategory(cat.id)
                          setCategoryDropdownOpen(false)
                          setCategorySearchQuery('')
                        }}
                      >
                        <span>{cat.label}</span>
                        <div className="category-item-right">
                          <span className="category-count-badge">
                            {categoryCounts[cat.id] || 0}
                          </span>
                          {isSelected && <Check size={14} color="#2563eb" />}
                        </div>
                      </button>
                    )
                  })}
                  {filteredDropdownCategories.length === 0 && (
                    <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                      No categories found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="chip-search-bar">
          <Search size={16} className="chip-search-icon" />
          <input
            type="text"
            placeholder="Search AI tools by name, tag, or desc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="chip-search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <section className="panel" aria-label="AI Tools management">
        <div className="panel-header" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>AI Tools Directory</h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
              Manage, edit, and feature curated AI tools on the Home page.
            </p>
          </div>
          <button
            type="button"
            className="dashboard-empty-add-btn"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            onClick={openAddModal}
          >
            <Plus size={16} />
            <span>Add AI Tool</span>
          </button>
        </div>

        {error && <p className="ai-tools-error" role="alert" style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '12px' }}>{error}</p>}

        <div className="list-view">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <article key={idx} className="service-card skeleton-service-card">
                <div className="skeleton-preview" />
                <div className="service-card-top" style={{ padding: '14px 16px 0' }}>
                  <div className="skeleton-avatar" />
                  <div className="skeleton-badge" />
                </div>
                <div className="skeleton-body">
                  <div className="skeleton-line skeleton-card-title" />
                  <div className="skeleton-line skeleton-card-desc" />
                  <div className="skeleton-line skeleton-card-desc-short" />
                </div>
                <div className="skeleton-footer">
                  <div className="skeleton-line skeleton-url" />
                </div>
              </article>
            ))
          ) : filteredTools.length === 0 ? (
            <div className="dashboard-empty-container">
              <div className="dashboard-empty-animation">
                <img
                  src="/assets/empty/no-data.svg"
                  alt="No AI tools found"
                  style={{ width: '180px', height: '140px', objectFit: 'contain' }}
                />
              </div>
              <h3 className="dashboard-empty-title">
                {searchQuery || activeCategory !== 'all' ? 'No matching AI tools found' : 'No AI tools found in database'}
              </h3>
              <p className="dashboard-empty-subtitle">
                {searchQuery || activeCategory !== 'all'
                  ? 'Try clearing your search filters or browse other categories.'
                  : 'Add AI tools to organize your workflows, generative AI models, and design tools.'}
              </p>
              <button
                type="button"
                className="dashboard-empty-add-btn"
                onClick={openAddModal}
              >
                <Plus size={16} />
                <span>Add AI Tool</span>
              </button>
            </div>
          ) : (
            paginatedTools.map((tool) => (
              <AIToolCard
                key={tool._id || tool.id || tool.toolId}
                tool={tool}
                onOpen={handleOpenTool}
                onEdit={openEditModal}
                onDelete={handleDeleteClick}
                onToggleEssential={toggleEssential}
              />
            ))
          )}
        </div>

        {filteredTools.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            scrollToTop={false}
          />
        )}
      </section>

      {/* Edit / Add Modal */}
      {(isAddModalOpen || itemToEdit) && (
        <div className="ai-modal-overlay" onClick={() => !isSubmitting && closeFormModal()}>
          <div className="ai-modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ai-modal-header">
              <div className="ai-modal-header-left">
                <div className="ai-modal-badge">
                  {itemToEdit ? <Edit2 size={20} /> : <Sparkles size={20} />}
                </div>
                <div>
                  <h3 className="ai-modal-title">{itemToEdit ? 'Edit AI Tool' : 'Add New AI Tool'}</h3>
                  <p className="ai-modal-subtitle">
                    {itemToEdit ? 'Update details, tags, and homepage visibility.' : 'Fill in the details below to add a new tool to your collection.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="ai-modal-close-btn"
                onClick={closeFormModal}
                disabled={isSubmitting}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form & Body */}
            <form className="ai-modal-form" onSubmit={handleSubmit}>
              <div className="ai-modal-body">
                <div className="ai-field-group">
                  <label className="ai-field-label">Tool Name *</label>
                  <input
                    type="text"
                    name="name"
                    className="ai-field-input"
                    value={form.name}
                    onChange={updateForm}
                    required
                    placeholder="e.g. Midjourney, Lovable, Claude"
                  />
                </div>

                <div className="ai-field-group">
                  <label className="ai-field-label">Website URL *</label>
                  <input
                    type="url"
                    name="url"
                    className="ai-field-input"
                    value={form.url}
                    onChange={updateForm}
                    required
                    placeholder="https://example.com"
                  />
                </div>

                <div className="ai-modal-grid-2">
                  <div className="ai-field-group">
                    <label className="ai-field-label">Tag / Role *</label>
                    <input
                      type="text"
                      name="tag"
                      className="ai-field-input"
                      value={form.tag}
                      onChange={updateForm}
                      required
                      placeholder="e.g. Graphic AI, UI Design"
                    />
                  </div>
                  <div className="ai-field-group">
                    <label className="ai-field-label">Pricing *</label>
                    <select
                      name="pricing"
                      className="ai-field-select"
                      value={form.pricing}
                      onChange={updateForm}
                      required
                    >
                      <option value="FREEMIUM">FREEMIUM</option>
                      <option value="FREE">FREE</option>
                      <option value="PAID">PAID</option>
                      <option value="FREE + PAID">FREE + PAID</option>
                      <option value="FREE TRIAL">FREE TRIAL</option>
                    </select>
                  </div>
                </div>

                <div className="ai-modal-grid-2">
                  <div className="ai-field-group">
                    <label className="ai-field-label">Category</label>
                    <select
                      name="category"
                      className="ai-field-select"
                      value={form.category}
                      onChange={updateForm}
                    >
                      <option value="ui-web">UI & Web</option>
                      <option value="art-images">Image & Art</option>
                      <option value="copy-llm">Chat & LLM</option>
                      <option value="3d-motion">3D & Motion</option>
                      <option value="code-dev">Dev & Code</option>
                      <option value="color-brand">Color & Brand</option>
                      <option value="workflow">Workflow</option>
                    </select>
                  </div>
                  <div className="ai-field-group">
                    <label className="ai-field-label">Banner Image URL</label>
                    <input
                      type="url"
                      name="bannerUrl"
                      className="ai-field-input"
                      value={form.bannerUrl}
                      onChange={updateForm}
                      placeholder="Optional banner image URL"
                    />
                  </div>
                </div>

                <div className="ai-field-group">
                  <label className="ai-field-label">Description *</label>
                  <textarea
                    name="desc"
                    className="ai-field-textarea"
                    value={form.desc}
                    onChange={updateForm}
                    required
                    placeholder="Describe what this AI tool does and its key features..."
                    rows={3}
                  />
                </div>

                {/* Interactive Feature Cards */}
                <div className="ai-toggle-cards">
                  <label className={`ai-toggle-card ${form.showInEssential ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      name="showInEssential"
                      checked={form.showInEssential}
                      onChange={updateForm}
                    />
                    <div className="ai-toggle-info">
                      <div className="ai-toggle-title">Feature in Essential AI Tools</div>
                      <div className="ai-toggle-desc">Showcase on homepage Essential section</div>
                    </div>
                  </label>

                  <label className={`ai-toggle-card ${form.isPartner ? 'active' : ''}`}>
                    <input
                      type="checkbox"
                      name="isPartner"
                      checked={form.isPartner}
                      onChange={updateForm}
                    />
                    <div className="ai-toggle-info">
                      <div className="ai-toggle-title">Mark as Partner Tool</div>
                      <div className="ai-toggle-desc">Display partner badge on card</div>
                    </div>
                  </label>
                </div>

                {error && <p className="ai-tools-error" role="alert">{error}</p>}
              </div>

              {/* Sticky Footer */}
              <div className="ai-modal-footer">
                <button
                  type="button"
                  className="ai-btn-cancel"
                  onClick={closeFormModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ai-btn-submit"
                  disabled={isSubmitting || !form.name.trim() || !form.url.trim()}
                >
                  {isSubmitting ? 'Saving...' : itemToEdit ? 'Save Changes' : 'Add Tool'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="delete-modal-backdrop" onClick={() => !isDeleting && setItemToDelete(null)}>
          <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <Trash2 size={24} color="#ef4444" />
            </div>
            <h3>Delete AI Tool</h3>
            <p>
              Are you sure you want to delete <strong>{itemToDelete.name}</strong>? This action will remove it from the AI Tools collection and Home page.
            </p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={confirmDelete}
                disabled={isDeleting}
                autoFocus
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function getDeletedQuickAssets() {
  try {
    const raw = localStorage.getItem('nexio_deleted_quick_assets')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function addDeletedQuickAsset(id, url) {
  try {
    const list = getDeletedQuickAssets()
    if (id && !list.includes(String(id))) list.push(String(id))
    if (url && !list.includes(String(url))) list.push(String(url))
    localStorage.setItem('nexio_deleted_quick_assets', JSON.stringify(list))
  } catch {
    // Ignore localStorage write error
  }
}

export default function DashboardPage({ onBack, onAddLink, onLogout, onNavigateToEditing }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('All Links')
  const [currentPage, setCurrentPage] = useState(1)
  const [status, setStatus] = useState('')
  const [liveLinks, setLiveLinks] = useState([])
  const [walletTotalCount, setWalletTotalCount] = useState(null)
  const [isLoadingLinks, setIsLoadingLinks] = useState(true)
  const [linksError, setLinksError] = useState('')
  const [quickAssets, setQuickAssets] = useState([])
  const [savePulseId, setSavePulseId] = useState(null)
  const [favoritePulseId, setFavoritePulseId] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  const [categorySearchQuery, setCategorySearchQuery] = useState('')
  const categoryDropdownRef = useRef(null)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const notificationRef = useRef(null)
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('nexio_notifications_log')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Close dropdown on click outside
  useEffect(() => {
    const handleNotifClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false)
      }
    }
    document.addEventListener('mousedown', handleNotifClickOutside)
    return () => document.removeEventListener('mousedown', handleNotifClickOutside)
  }, [])

  // Listen specifically to link saved & link deleted events ONLY
  useEffect(() => {
    const handleNewLinkSaved = (e) => {
      const title = e?.detail?.title || e?.detail?.name || 'New Resource'
      const category = e?.detail?.category || e?.detail?.collection || 'Saved Links'
      const newNotif = {
        id: `saved-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        action: 'saved',
        title: `Link Stored: ${title}`,
        message: `"${title}" has been saved to ${category}.`,
        category,
        time: 'Just now',
        read: false,
        url: e?.detail?.url,
      }
      setNotifications((prev) => {
        const updated = [newNotif, ...prev].slice(0, 50)
        try {
          localStorage.setItem('nexio_notifications_log', JSON.stringify(updated))
        } catch { }
        return updated
      })
    }

    const handleLinkDeleted = (e) => {
      const title = e?.detail?.title || e?.detail?.name || 'Resource'
      const category = e?.detail?.category || e?.detail?.collection || 'Workspace'
      const newNotif = {
        id: `deleted-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        action: 'deleted',
        title: `Link Deleted: ${title}`,
        message: `"${title}" was deleted from ${category}.`,
        category,
        time: 'Just now',
        read: false,
      }
      setNotifications((prev) => {
        const updated = [newNotif, ...prev].slice(0, 50)
        try {
          localStorage.setItem('nexio_notifications_log', JSON.stringify(updated))
        } catch { }
        return updated
      })
    }

    window.addEventListener('nexio_link_saved', handleNewLinkSaved)
    window.addEventListener('nexio_link_deleted', handleLinkDeleted)
    return () => {
      window.removeEventListener('nexio_link_saved', handleNewLinkSaved)
      window.removeEventListener('nexio_link_deleted', handleLinkDeleted)
    }
  }, [])

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length
  }, [notifications])

  const markAllNotificationsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }))
      try {
        localStorage.setItem('nexio_notifications_log', JSON.stringify(updated))
      } catch { }
      return updated
    })
  }

  const clearAllNotifications = () => {
    setNotifications([])
    try {
      localStorage.removeItem('nexio_notifications_log')
    } catch { }
  }

  const markNotificationRead = (id) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      try {
        localStorage.setItem('nexio_notifications_log', JSON.stringify(updated))
      } catch { }
      return updated
    })
  }
  const [searchQuery, setSearchQuery] = useState('')
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', url: '', category: '' })
  const [isEditing, setIsEditing] = useState(false)

  const filteredQuickAssets = useMemo(() => {
    let list = quickAssets
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter((item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.url && item.url.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      )
    }
    return list
  }, [quickAssets, searchQuery])

  const [viewMode, setViewMode] = useState('grid')
  const cardsPerPage = 9

  const isSavedLink = (item) => {
    if (!item) return false
    const col = (item.collection || '').toLowerCase().trim()
    const catList = (item.category || '').toLowerCase().split(',').map(c => c.trim())
    return item.readLater === true ||
      item.saved === true ||
      col === 'inbox' ||
      col === 'saved' ||
      col === 'read later' ||
      catList.includes('saved') ||
      catList.includes('read later')
  }

  const isFavoriteLink = (item) => {
    if (!item) return false
    const isQuickAsset = item.collection === 'Quick Assets' ||
      item.category === 'Quick Assets' ||
      item.category === 'Featured Quick Asset' ||
      item.kind === 'quick-asset' ||
      (item.category && item.category.toLowerCase().includes('quick'))
    return Boolean(item.favorite) && !isQuickAsset
  }

  const loadLiveLinks = async () => {
    try {
      setIsLoadingLinks(true)
      setLinksError('')
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Unable to fetch links')
      const data = await response.json()
      const deletedList = getDeletedQuickAssets()

      const [aiToolsResult, editingResult] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/ai-tools`).then((result) => result.ok ? result.json() : []),
        fetch(`${API_BASE_URL}/api/editing`).then((result) => result.ok ? result.json() : []),
      ])
      const aiTools = aiToolsResult.status === 'fulfilled' && Array.isArray(aiToolsResult.value)
        ? aiToolsResult.value
        : []
      const editingItems = editingResult.status === 'fulfilled' && Array.isArray(editingResult.value)
        ? editingResult.value
        : []

      let loadedLinks = Array.isArray(data) ? data.map(mapLiveLink) : []

      if (Array.isArray(aiTools) && aiTools.length > 0) {
        const existingUrls = new Set(loadedLinks.map(l => (l.url || '').toLowerCase().replace(/^https?:\/\//i, '').replace(/\/$/, '')))
        const formattedAi = aiTools
          .filter(t => !existingUrls.has((t.url || '').toLowerCase().replace(/^https?:\/\//i, '').replace(/\/$/, '')))
          .map((item, idx) => ({
            id: item._id || item.toolId || `ai-${idx}`,
            title: item.name,
            url: item.url,
            description: item.desc || item.name,
            category: item.tag || (item.category === 'art-images' ? 'AI Image & Video' : 'AI'),
            collection: 'AI Tools',
            meta: [item.tag || 'AI'],
            date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
            accent: '#a855f7',
            label: (item.name || 'A').charAt(0).toUpperCase(),
            favorite: Boolean(item.showInEssential),
            readLater: false,
            badge: item.pricing || 'FREEMIUM',
            bannerUrl: item.bannerUrl || '',
            logoUrl: '',
            kind: 'ai-tool'
          }))
        loadedLinks = [...loadedLinks, ...formattedAi]
      }

      setWalletTotalCount(loadedLinks.length + editingItems.length)

      // Filter out any locally deleted fallback assets (by id / _id)
      loadedLinks = loadedLinks.filter(
        (link) => !deletedList.includes(String(link.id)) && !deletedList.includes(String(link._id))
      )

      setLiveLinks(loadedLinks)
    } catch (error) {
      setLinksError('Could not load live links from MongoDB.')
      setLiveLinks([])
    } finally {
      setIsLoadingLinks(false)
    }
  }

  const loadQuickAssets = async () => {
    try {
      const response = await fetch(`${API_URL}/quickassets`)
      if (!response.ok) throw new Error('Unable to fetch quick assets')
      const data = await response.json()
      let assets = Array.isArray(data) ? data : []

      // Older deployments expose quick assets through the combined hub endpoint.
      if (assets.length === 0) {
        const fallbackResponse = await fetch(API_URL)
        const fallbackData = await fallbackResponse.json()
        assets = Array.isArray(fallbackData)
          ? fallbackData.filter((item) => (
            item.collection === 'Quick Assets' ||
            item.category === 'Quick Assets' ||
            item.category === 'Featured Quick Asset' ||
            item.kind === 'quick-asset'
          ))
          : []
      }

      setQuickAssets(assets.map(mapLiveLink))
    } catch {
      try {
        const fallbackResponse = await fetch(API_URL)
        const fallbackData = await fallbackResponse.json()
        const assets = Array.isArray(fallbackData)
          ? fallbackData.filter((item) => item.collection === 'Quick Assets' || item.category === 'Quick Assets' || item.category === 'Featured Quick Asset' || item.kind === 'quick-asset')
          : []
        setQuickAssets(assets.map(mapLiveLink))
      } catch {
        setQuickAssets([])
      }
    }
  }

  useEffect(() => {
    loadLiveLinks()
    loadQuickAssets()

    const handleLinksUpdate = () => {
      loadLiveLinks()
      loadQuickAssets()
    }

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'nexio_deleted_quick_assets') {
        loadLiveLinks()
        loadQuickAssets()
      }
    }

    window.addEventListener('nexio_links_updated', handleLinksUpdate)
    window.addEventListener('nexio_link_saved', handleLinksUpdate)
    window.addEventListener('nexio_quick_assets_updated', handleLinksUpdate)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('nexio_links_updated', handleLinksUpdate)
      window.removeEventListener('nexio_link_saved', handleLinksUpdate)
      window.removeEventListener('nexio_quick_assets_updated', handleLinksUpdate)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) {
        setCategoryDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const availableCategories = useMemo(() => {
    const cats = new Set()
    liveLinks.forEach((l) => {
      if (l.category) {
        l.category.split(',').forEach(c => cats.add(c.trim()))
      }
    })
    return ['All', ...Array.from(cats)]
  }, [liveLinks])

  const categoryCounts = useMemo(() => {
    const counts = { All: liveLinks.length }
    liveLinks.forEach((l) => {
      if (l.category) {
        l.category.split(',').forEach((c) => {
          const trimmed = c.trim()
          counts[trimmed] = (counts[trimmed] || 0) + 1
        })
      }
    })
    return counts
  }, [liveLinks])

  const filteredDropdownCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return availableCategories
    const q = categorySearchQuery.toLowerCase().trim()
    return availableCategories.filter((cat) => cat.toLowerCase().includes(q))
  }, [availableCategories, categorySearchQuery])

  const filteredLinks = useMemo(() => {
    let base = liveLinks

    if (activeNav === 'Favorites') {
      base = base.filter(isFavoriteLink)
    } else if (activeNav === 'Saved') {
      base = base.filter(isSavedLink)
    } else if (activeNav === 'Editing') {
      base = base.filter((item) => {
        if (!item.category) return false
        const c = item.category.toLowerCase()
        return c.includes('editing') || c.includes('research')
      })
    } else if (activeNav === 'AI Image & Video') {
      base = base.filter((item) => {
        if (!item.category && !item.tag) return false
        const c = (item.category || '').toLowerCase()
        const t = (item.tag || '').toLowerCase()
        return c.includes('image') || c.includes('video') || t.includes('image') || t.includes('video')
      })
    }

    if (activeFilter !== 'All') {
      base = base.filter((item) => {
        if (!item.category) return false
        const itemCats = item.category.split(',').map(c => c.trim().toLowerCase())
        return itemCats.includes(activeFilter.toLowerCase())
      })
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      base = base.filter((item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.url && item.url.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      )
    }

    return base
  }, [activeNav, activeFilter, searchQuery, liveLinks])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeNav, activeFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / cardsPerPage))
  const visibleLinks = filteredLinks.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  )
  const isDashboardView = true
  const isQuickAssetsView = activeNav === 'Quick Assets'

  const liveStats = useMemo(() => {
    const savedCount = liveLinks.filter(isSavedLink).length
    const favoriteCount = liveLinks.filter(isFavoriteLink).length
    const totalCount = walletTotalCount ?? liveLinks.length
    const typeCount = new Set(liveLinks.map((item) => item.category).filter(Boolean)).size

    return stats.map((stat, index) => ({
      ...stat,
      value: String(index === 0 ? totalCount : index === 1 ? savedCount : index === 2 ? typeCount : favoriteCount),
    }))
  }, [liveLinks, walletTotalCount])

  const handleToggleSaved = async (linkId) => {
    const selectedLink = liveLinks.find((item) => item.id === linkId)
    if (!selectedLink) return

    const isCurrentlySaved = isSavedLink(selectedLink)
    const nextCollection = isCurrentlySaved ? 'All Links' : 'Inbox'
    const nextReadLater = !isCurrentlySaved
    setSavePulseId(linkId)
    window.setTimeout(() => setSavePulseId(null), 450)
    setLiveLinks((current) => current.map((item) => (
      item.id === linkId
        ? { ...item, collection: nextCollection, readLater: nextReadLater }
        : item
    )))

    try {
      const response = await fetch(`${API_URL}/${linkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedLink.title,
          url: selectedLink.url,
          category: selectedLink.category,
          description: selectedLink.description,
          collection: nextCollection,
          favorite: selectedLink.favorite,
          readLater: nextReadLater,
        }),
      })

      if (!response.ok) throw new Error('Save update failed')
      window.dispatchEvent(new CustomEvent('nexio_links_updated'))
      setStatus(isCurrentlySaved ? `${selectedLink.title} removed from Saved.` : `${selectedLink.title} added to Saved.`)
    } catch {
      setLiveLinks((current) => current.map((item) => (
        item.id === linkId ? { ...item, collection: selectedLink.collection, readLater: selectedLink.readLater } : item
      )))
      setStatus('Could not update Saved in MongoDB.')
    }
  }

  const handleToggleFavorite = async (linkId) => {
    const selectedLink = liveLinks.find((item) => item.id === linkId) || quickAssets.find((item) => item.id === linkId)
    if (!selectedLink) return

    const isQuickAsset = selectedLink.collection === 'Quick Assets' ||
      selectedLink.category === 'Quick Assets' ||
      selectedLink.category === 'Featured Quick Asset' ||
      selectedLink.kind === 'quick-asset' ||
      (selectedLink.category && selectedLink.category.toLowerCase().includes('quick'))

    const nextFavorite = !selectedLink.favorite
    setFavoritePulseId(linkId)
    window.setTimeout(() => setFavoritePulseId(null), 450)
    setLiveLinks((current) => current.map((item) => (
      item.id === linkId ? { ...item, favorite: nextFavorite } : item
    )))
    setQuickAssets((current) => current.map((item) => (
      item.id === linkId ? { ...item, favorite: nextFavorite } : item
    )))

    try {
      const response = await fetch(`${API_URL}/${linkId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedLink.title,
          url: selectedLink.url,
          category: selectedLink.category,
          description: selectedLink.description,
          collection: selectedLink.collection,
          favorite: nextFavorite,
          readLater: selectedLink.readLater,
        }),
      })

      if (!response.ok) throw new Error('Favorite update failed')
      if (isQuickAsset && typeof window !== 'undefined') {
        window.dispatchEvent(new Event('nexio_quick_assets_updated'))
      }
      setStatus(isQuickAsset
        ? (nextFavorite ? `${selectedLink.title} featured on Home Quick Assets.` : `${selectedLink.title} unfeatured from Home Quick Assets.`)
        : (nextFavorite ? `${selectedLink.title} added to Favorites.` : `${selectedLink.title} removed from Favorites.`)
      )
    } catch {
      setLiveLinks((current) => current.map((item) => (
        item.id === linkId ? { ...item, favorite: selectedLink.favorite } : item
      )))
      setQuickAssets((current) => current.map((item) => (
        item.id === linkId ? { ...item, favorite: selectedLink.favorite } : item
      )))
      setStatus(isQuickAsset ? 'Could not update Home page featured state in MongoDB.' : 'Could not update Favorites in MongoDB.')
    }
  }

  const handleOpenService = (url) => {
    const targetUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  const handleEditService = (item) => {
    setItemToEdit(item)
  }

  const confirmEdit = async (updatedItem) => {
    const item = updatedItem || itemToEdit
    if (!item || !item.title?.trim()) return
    setIsEditing(true)
    try {
      const isQuick = item.kind === 'quick-asset' || item.collection === 'Quick Assets' || item.category === 'Featured Quick Asset' || (item.category && item.category.toLowerCase().includes('quick'))

      const payload = {
        title: item.title.trim(),
        url: item.url.trim(),
        category: item.category?.trim() || (isQuick ? 'Featured Quick Asset' : 'General'),
        description: (item.description || '').trim(),
        collection: item.collection || (isQuick ? 'Quick Assets' : 'All Links'),
        favorite: Boolean(item.favorite),
        readLater: Boolean(item.readLater),
        badge: item.badge || '',
        logoUrl: item.logoUrl || '',
        bannerUrl: item.bannerUrl || '',
      }

      let savedData = null
      const editId = item.id || item._id
      const isFallbackId = !editId || String(editId).startsWith('ct') || String(editId).startsWith('preset-') || String(editId).startsWith('live-')

      if (!isFallbackId) {
        const response = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (response.ok) {
          savedData = await response.json()
        }
      }

      if (!savedData && !isFallbackId) {
        const postRes = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (postRes.ok) {
          savedData = await postRes.json()
        }
      }

      if (savedData) {
        const mapped = mapLiveLink(savedData)
        setLiveLinks((current) => {
          const exists = current.some((l) => l.id === editId || l.url === payload.url)
          if (exists) {
            return current.map((l) => (l.id === editId || l.url === payload.url ? mapped : l))
          }
          return [mapped, ...current]
        })
        setQuickAssets((current) => {
          const exists = current.some((l) => l.id === editId || l.url === payload.url)
          if (exists) {
            return current.map((l) => (l.id === editId || l.url === payload.url ? mapped : l))
          }
          return isQuick ? [mapped, ...current] : current.filter(l => l.id !== editId && l.url !== payload.url)
        })
      } else {
        setLiveLinks((current) => current.map((link) => (
          (link.id === editId || link.url === item.url) ? {
            ...link,
            title: payload.title,
            description: payload.description,
            url: payload.url,
            category: payload.category,
            collection: payload.collection,
            badge: payload.badge,
            bannerUrl: payload.bannerUrl
          } : link
        )))
        setQuickAssets((current) => current.map((link) => (
          (link.id === editId || link.url === item.url) ? {
            ...link,
            title: payload.title,
            description: payload.description,
            url: payload.url,
            category: payload.category,
            collection: payload.collection,
            badge: payload.badge,
            bannerUrl: payload.bannerUrl
          } : link
        )))
      }

      window.dispatchEvent(new CustomEvent('nexio_quick_assets_updated'))
      window.dispatchEvent(new CustomEvent('nexio_links_updated'))
      if (!editId) {
        window.dispatchEvent(new CustomEvent('nexio_link_saved', {
          detail: {
            title: payload.title || 'Saved Link',
            category: payload.collection || payload.category || 'Workspace',
            url: payload.url,
          }
        }))
      }
      setStatus(isQuick ? 'Quick asset saved successfully.' : 'Link updated successfully.')
    } catch {
      setStatus('Could not update this link.')
    } finally {
      setIsEditing(false)
      setItemToEdit(null)
    }
  }

  const handleDeleteService = (item) => {
    setItemToDelete(item)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    const deleteId = itemToDelete.id || itemToDelete._id
    const deleteUrl = itemToDelete.url
    const isFallbackId = !deleteId || String(deleteId).startsWith('ct') || String(deleteId).startsWith('preset-') || String(deleteId).startsWith('live-')
    try {
      if (!isFallbackId) {
        // Has a real MongoDB ObjectId — delete from DB
        const res = await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE' })
        if (!res.ok && res.status !== 404) throw new Error('Delete failed')
      }

      // Track in localStorage so it stays deleted even across refreshes / fallbacks
      addDeletedQuickAsset(deleteId, deleteUrl)

      // Remove from local state immediately regardless
      setLiveLinks((current) => current.filter((link) => {
        if (deleteId && (link.id === deleteId || link._id === deleteId || String(link.id) === String(deleteId))) return false
        if (deleteUrl && link.url === deleteUrl) return false
        return true
      }))

      const deletedTitle = itemToDelete.title || itemToDelete.name || 'Saved Resource'
      const deletedCategory = itemToDelete.collection || itemToDelete.category || 'Workspace'
      window.dispatchEvent(new CustomEvent('nexio_quick_assets_updated'))
      window.dispatchEvent(new CustomEvent('nexio_links_updated'))
      window.dispatchEvent(new CustomEvent('nexio_link_deleted', {
        detail: {
          title: deletedTitle,
          category: deletedCategory,
        }
      }))
      setStatus('Deleted successfully.')
    } catch {
      setStatus('Could not delete this item from MongoDB.')
    } finally {
      setIsDeleting(false)
      setItemToDelete(null)
    }
  }

  // Keyboard navigation for Delete modal (Enter / Delete key to confirm, Escape to cancel)
  useEffect(() => {
    if (!itemToDelete) return

    const handleKeyDown = (e) => {
      if (isDeleting) return
      if (e.key === 'Enter' || e.key === 'Delete') {
        e.preventDefault()
        confirmDelete()
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setItemToDelete(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [itemToDelete, isDeleting])

  // Keyboard navigation for Edit modal (Escape to cancel)
  useEffect(() => {
    if (!itemToEdit) return

    const handleKeyDown = (e) => {
      if (isEditing) return
      if (e.key === 'Escape') {
        e.preventDefault()
        setItemToEdit(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [itemToEdit, isEditing])

  const handleExport = (format) => {
    const date = new Date().toISOString().slice(0, 10)
    const rows = filteredLinks.map((item) => ({
      title: item.title,
      url: item.url,
      category: item.category,
      description: item.description,
    }))

    if (format === 'json') {
      downloadFile(JSON.stringify(rows, null, 2), `nexio-links-${date}.json`, 'application/json')
    } else if (format === 'pdf') {
      downloadFile(createPdf(filteredLinks), `nexio-links-${date}.pdf`, 'application/pdf')
    } else if (format === 'doc') {
      const body = rows.map((item) => `<h2>${item.title}</h2><p>${item.description}</p><p>${item.url}</p>`).join('')
      downloadFile(`<html><body><h1>Nexio Links Export</h1>${body}</body></html>`, `nexio-links-${date}.doc`, 'application/msword')
    } else if (format === 'excel') {
      const headers = ['Title', 'URL', 'Category', 'Description']
      const escapeCell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
      const csv = [headers, ...rows.map((item) => [item.title, item.url, item.category, item.description])]
        .map((row) => row.map(escapeCell).join(','))
        .join('\n')
      downloadFile(csv, `nexio-links-${date}.xls`, 'application/vnd.ms-excel')
    }

    setStatus(`Exported ${format.toUpperCase()} file.`)
    setExportOpen(false)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,.csv,.pdf'
    input.onchange = async (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      try {
        const links = await parseImportFile(file)
        if (!links.length) {
          setStatus('No valid links found in the file.')
          return
        }

        const response = await fetch(`${API_URL}/import`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ links }),
        })
        const result = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(result.error || 'Import failed')

        const refreshed = await fetch(API_URL)
        const refreshedLinks = await refreshed.json()
        setLiveLinks(Array.isArray(refreshedLinks) ? refreshedLinks.map(mapLiveLink) : [])
        setStatus('Links imported successfully.')
      } catch (error) {
        setStatus(error.message || 'Import failed. Please use a valid JSON or CSV file.')
      }
    }
    input.click()
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        html, body, #root { margin: 0; min-height: 100%; height: 100%; }
        body {
          background: #f3f1ee;
          font-family: Inter, 'Segoe UI', sans-serif;
          color: #111827;
        }
        button, input { font: inherit; }
        .dashboard-shell {
          min-height: 100vh;
          display: flex;
          background: #f3f1ee;
          zoom: 1;
          position: relative;
        }
        .mobile-menu-btn {
          display: none;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(15,23,42,0.12);
          background: #ffffff;
          color: #1e293b;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: all 0.2s ease;
        }
        .mobile-menu-btn:hover {
          background: #f8fafc;
          border-color: rgba(15,23,42,0.2);
        }
        .sidebar-backdrop {
          display: none;
        }
        .sidebar-mobile-header {
          display: none;
        }
        .sidebar {
          width: 268px;
          background: #ffffff;
          border-right: 1px solid rgba(15,23,42,0.08);
          padding: 22px 14px 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100dvh;
          max-height: 100vh;
          overflow-y: auto;
          scrollbar-width: none;
          flex-shrink: 0;
          box-sizing: border-box;
        }
        .sidebar::-webkit-scrollbar {
          display: none;
        }
        .brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 6px 12px;
        }
        .brand-mark {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          display: grid;
          place-items: center;
          color: white;
          font-weight: 800;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.3);
        }
        .brand-name {
          font-size: 1.08rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #2f2a3c;
        }
        .sidebar-bottom-action {
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }
        .back-home-btn {
          width: 100%;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          border-radius: 12px;
          padding: 11px 16px;
          color: #1e3a8a;
          font-weight: 700;
          font-size: 0.92rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }
        .back-home-btn:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          color: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.06);
          transform: translateY(-1px);
        }
        .new-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.22);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .new-link-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.28);
        }
        .side-section-label {
          display: none;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8c8c8c;
          font-weight: 700;
        }
        .nav-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 11px 14px;
          border-radius: 999px;
          color: #1f2925;
          font-size: 0.92rem;
          font-weight: 700;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: background-color 0.18s ease, color 0.18s ease;
          white-space: nowrap;
        }
        .nav-item:hover {
          background: rgba(15, 23, 42, 0.05);
        }
        .nav-item svg {
          flex-shrink: 0;
        }
        .nav-item .nav-label {
          flex: 1;
          display: inline-block;
          font-size: 0.92rem;
          font-weight: 700;
          color: inherit;
          background: transparent;
          width: auto;
          height: auto;
          line-height: normal;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .nav-item.active {
          background: #17211c;
          color: #ffffff;
        }
        .nav-item.active .counter {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }
        .nav-item .counter {
          margin-left: auto;
          flex-shrink: 0;
          background: rgba(148, 163, 184, 0.18);
          color: #667085;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
        }
        .upgrade-card {
          margin-top: auto;
          border-radius: 16px;
          padding: 18px 16px 16px;
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.1);
        }
        .upgrade-card h4 {
          margin: 0 0 8px;
          color: #312e54;
          font-size: 1rem;
        }
        .upgrade-card p {
          margin: 0 0 14px;
          color: #5a5870;
          font-size: 0.83rem;
          line-height: 1.5;
        }
        .upgrade-btn {
          width: 100%;
          border: none;
          border-radius: 10px;
          background: rgba(37, 99, 235, 0.12);
          color: #1e3a8a;
          font-weight: 700;
          padding: 10px 12px;
        }
        .main-content {
          flex: 1;
          padding: 22px 26px 20px 26px;
        }
        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 16px;
          padding: 2px 4px;
        }
        .greeting {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #1f2937;
          font-size: 2rem;
          line-height: 1.1;
          font-weight: 800;
          letter-spacing: -0.06em;
        }
        .greeting .wave {
          font-size: 1.5rem;
        }
        .greeting .highlight {
          color: #2563eb;
        }
        .top-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .search-input-wrap {
          width: 340px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid rgba(15,23,42,0.06);
          border-radius: 999px;
          padding: 10px 18px;
          color: #64748b;
          box-shadow: 0 2px 8px rgba(15,23,42,0.02);
          transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
          cursor: pointer;
        }
        .search-input-wrap:hover {
          box-shadow: 0 4px 14px rgba(37,99,235,0.08);
          border-color: rgba(37,99,235,0.3);
          background: #f8fafc;
        }
        .search-input-wrap span.placeholder {
          color: #9ca3af;
          font-size: 0.95rem;
          flex: 1;
          text-align: left;
        }
        .mini-avatar {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: white;
          display: grid;
          place-items: center;
          font-weight: 700;
          font-size: 0.95rem;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
          cursor: pointer;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .mini-avatar:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
        }
        .topbar-divider {
          width: 1px;
          height: 24px;
          background: rgba(15, 23, 42, 0.12);
          margin: 0 2px;
        }
        .icon-circle-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #ffffff;
          color: #475569;
          display: grid;
          place-items: center;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
          flex-shrink: 0;
        }
        .icon-circle-btn:hover,
        .icon-circle-btn.active {
          background: #ffffff;
          border-color: rgba(37, 99, 235, 0.3);
          color: #2563eb;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
          transform: translateY(-1px);
        }
        .notification-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: #ef4444;
          color: #ffffff;
          font-size: 0.65rem;
          font-weight: 800;
          min-width: 16px;
          height: 16px;
          padding: 0 4px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          border: 2px solid #ffffff;
          line-height: 1;
          box-shadow: 0 2px 4px rgba(239, 68, 68, 0.35);
        }
        .notification-wrap {
          position: relative;
        }
        .notification-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: -40px;
          width: 340px;
          max-width: 90vw;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 18px;
          box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.02);
          z-index: 100;
          overflow: hidden;
          animation: dropdownFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (min-width: 640px) {
          .notification-dropdown {
            right: 0;
          }
        }
        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
        }
        .notification-header-title {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .notification-header-title h4 {
          margin: 0;
          font-size: 0.95rem;
          font-weight: 800;
          color: #0f172a;
        }
        .notification-count-pill {
          padding: 2px 7px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .mark-all-read-btn {
          border: none;
          background: transparent;
          color: #64748b;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          transition: all 0.15s ease;
        }
        .mark-all-read-btn:hover {
          background: #f1f5f9;
          color: #2563eb;
        }
        .notification-list {
          max-height: 290px;
          overflow-y: auto;
          scrollbar-width: thin;
          padding: 4px;
        }
        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .notification-item:hover {
          background: #f8fafc;
        }
        .notification-item.unread {
          background: rgba(37, 99, 235, 0.03);
        }
        .notification-item.unread:hover {
          background: rgba(37, 99, 235, 0.07);
        }
        .notif-dot-wrap {
          padding-top: 4px;
          flex-shrink: 0;
        }
        .notif-status-dot {
          display: block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #cbd5e1;
        }
        .notif-status-dot.active {
          background: #2563eb;
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
        }
        .notif-content {
          flex: 1;
          min-width: 0;
        }
        .notif-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 2px;
        }
        .notif-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .notif-time {
          font-size: 0.72rem;
          color: #94a3b8;
          flex-shrink: 0;
        }
        .notif-message {
          margin: 0;
          font-size: 0.78rem;
          color: #64748b;
          line-height: 1.35;
        }
        .notif-meta-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 5px;
        }
        .notif-category-pill {
          display: inline-flex;
          align-items: center;
          padding: 1px 7px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #475569;
          font-size: 0.68rem;
          font-weight: 600;
        }
        .notif-open-link {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 0.7rem;
          font-weight: 700;
          color: #2563eb;
          margin-left: auto;
          transition: transform 0.15s ease;
        }
        .notification-item:hover .notif-open-link {
          transform: translateX(2px);
        }
        .notif-status-dot.saved.active {
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
        }
        .notif-status-dot.deleted.active {
          background: #ef4444;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
        }
        .notif-action-tag {
          font-size: 0.65rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        .notif-action-tag.saved {
          background: #ecfdf5;
          color: #059669;
          border: 1px solid #a7f3d0;
        }
        .notif-action-tag.deleted {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }
        .notification-item.deleted:hover {
          background: rgba(239, 68, 68, 0.04);
        }
        .notification-empty {
          padding: 28px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .notification-empty-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f0fdf4;
          display: grid;
          place-items: center;
          margin-bottom: 8px;
        }
        .notification-empty h5 {
          margin: 0 0 4px;
          font-size: 0.88rem;
          font-weight: 700;
          color: #1e293b;
        }
        .notification-empty p {
          margin: 0;
          font-size: 0.78rem;
          color: #94a3b8;
        }
        .notification-footer {
          padding: 10px 16px;
          border-top: 1px solid #f1f5f9;
          background: #fcfdfe;
          text-align: center;
        }
        .clear-all-notif-btn {
          border: none;
          background: transparent;
          color: #94a3b8;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.15s ease;
        }
        .clear-all-notif-btn:hover {
          color: #ef4444;
        }
        .action-row {
          display: flex;
          justify-content: flex-end;
          margin: 14px 0 18px;
        }
        .action-buttons {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .ghost-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid rgba(15,23,42,0.06);
          color: #475569;
          border-radius: 999px;
          padding: 9px 20px;
          font-size: 0.9rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(15,23,42,0.02);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .ghost-btn:hover {
          color: #0f172a;
          border-color: rgba(15,23,42,0.12);
          box-shadow: 0 4px 12px rgba(15,23,42,0.05);
          transform: translateY(-1px);
        }
        .export-menu-wrap {
          position: relative;
        }
        .export-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          z-index: 10;
          width: 190px;
          padding: 6px;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.14);
        }
        .export-option {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 10px;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #374151;
          font-size: 0.86rem;
          font-weight: 700;
          text-align: left;
        }
        .export-option:hover {
          background: #f3f1ee;
          color: #2563eb;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(140px, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }
        .stat-card {
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 16px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          color: var(--icon-color, #2563eb);
          background: color-mix(in srgb, var(--icon-color, #2563eb) 12%, transparent);
        }
        .stat-value {
          font-size: 1.85rem;
          font-weight: 800;
          letter-spacing: -0.06em;
          line-height: 1;
        }
        .stat-label {
          color: #64748b;
          font-size: 0.92rem;
          margin-top: 4px;
        }
        .stat-delta {
          color: #16a34a;
          font-size: 0.76rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .stat-main {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .tool-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 8px 0 18px;
        }
        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 12px;
          padding: 12px 14px;
        }
        .search-box input {
          border: none;
          outline: none;
          background: transparent;
          width: 100%;
          color: #111827;
          font-size: 0.95rem;
        }
        .selector {
          min-width: 180px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(15,23,42,0.08);
          color: #374151;
          font-weight: 600;
        }
        .chip-row-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin: 0 0 20px;
          flex-wrap: wrap;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .filter-dropdown-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
        }
        .category-dropdown-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid rgba(15, 23, 42, 0.1);
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          color: #334155;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
          white-space: nowrap;
        }
        .category-dropdown-btn:hover {
          background: #ffffff;
          border-color: rgba(37, 99, 235, 0.3);
          color: #0f172a;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
          transform: translateY(-1px);
        }
        .category-dropdown-btn.active-filter {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          border-color: transparent;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
        }
        .category-dropdown-btn.active-filter .category-btn-icon,
        .category-dropdown-btn.active-filter .category-chevron {
          color: #ffffff;
        }
        .category-dropdown-btn.active-filter .category-count-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
        .category-btn-icon {
          color: #64748b;
          flex-shrink: 0;
        }
        .category-chevron {
          color: #64748b;
          flex-shrink: 0;
        }
        .category-count-badge {
          padding: 2px 7px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.06);
          color: #64748b;
          font-size: 0.75rem;
          font-weight: 700;
          line-height: 1;
          display: inline-flex;
          align-items: center;
        }
        .category-clear-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
          border: none;
          cursor: pointer;
          margin-left: 2px;
          transition: background 0.15s ease;
        }
        .category-clear-btn:hover {
          background: rgba(255, 255, 255, 0.4);
        }
        .category-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          min-width: 260px;
          max-width: 320px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.1);
          border-radius: 16px;
          box-shadow: 0 20px 35px -10px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.02);
          padding: 8px;
          z-index: 100;
          animation: dropdownFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .category-dropdown-search {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          margin-bottom: 6px;
        }
        .category-dropdown-search input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.84rem;
          color: #0f172a;
          width: 100%;
        }
        .category-dropdown-search input::placeholder {
          color: #94a3b8;
        }
        .category-dropdown-list {
          max-height: 240px;
          overflow-y: auto;
          scrollbar-width: thin;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .category-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #334155;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .category-item:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .category-item.selected {
          background: #eff6ff;
          color: #2563eb;
          font-weight: 700;
        }
        .category-item-right {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .chip-search-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          border-radius: 999px;
          padding: 7px 16px;
          width: 260px;
          box-shadow: 0 2px 8px rgba(15, 23, 42, 0.03);
          transition: all 0.2s ease;
        }
        .chip-search-bar:focus-within {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12), 0 2px 8px rgba(37, 99, 235, 0.08);
          width: 290px;
        }
        .chip-search-icon {
          color: #94a3b8;
          flex-shrink: 0;
        }
        .chip-search-bar input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.88rem;
          color: #0f172a;
          font-weight: 500;
          width: 100%;
        }
        .chip-search-bar input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }
        .chip-search-clear {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .chip-search-clear:hover {
          color: #0f172a;
          background: #f1f5f9;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(15,23,42,0.06);
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          color: #475569;
          border-radius: 999px;
          padding: 8px 18px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
          white-space: nowrap;
        }
        .chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px -3px rgba(15, 23, 42, 0.08);
          background: #ffffff;
          color: #0f172a;
          border-color: rgba(37, 99, 235, 0.2);
        }
        .chip.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
          transform: translateY(-2px);
        }
        .chip.active .category-count-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
        .chip.active:hover {
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
          transform: translateY(-3px);
        }
        .panel {
          background: rgba(255,255,255,0.46);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 14px;
          overflow: hidden;
        }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 16px 18px 12px;
          color: #111827;
          font-weight: 800;
          font-size: 1.05rem;
        }
        .panel-header .right {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #4b5563;
          font-size: 0.86rem;
          font-weight: 700;
        }
        .panel-header h2 {
          margin: 0;
          font-size: 1.15rem;
        }
        .panel-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 0.82rem;
          font-weight: 500;
        }
        .primary-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 0;
          border-radius: 8px;
          padding: 9px 13px;
          background: #2563eb;
          color: #fff;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
        }
        .primary-btn:hover { background: #1d4ed8; }
        .ai-tools-form {
          margin: 0 18px 18px;
          padding: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          background: #fff;
        }
        .ai-tools-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .ai-tools-form-grid label {
          display: flex;
          flex-direction: column;
          gap: 5px;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .ai-tools-form-grid label.wide { grid-column: 1 / -1; }
        .ai-tools-form-grid input {
          min-width: 0;
          border: 1px solid #cbd5e1;
          border-radius: 7px;
          padding: 9px 10px;
          color: #0f172a;
          background: #fff;
          outline: none;
        }
        .ai-tools-form-grid input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.12); }
        .ai-tools-checkbox {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          color: #475569;
          font-size: 0.82rem;
          font-weight: 600;
        }
        .ai-tools-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 8px;
          margin-top: 16px;
        }
        .ai-tools-error {
          margin: 12px 18px;
          color: #b91c1c;
          font-size: 0.82rem;
          font-weight: 600;
        }
        .modern-ai-tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        .modern-ai-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .modern-ai-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .modern-ai-card .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }
        .modern-ai-card h3 {
          margin: 0 0 4px 0;
          font-size: 1.1rem;
          color: #0f172a;
        }
        .modern-ai-card .tool-tag {
          font-size: 0.75rem;
          background: #f1f5f9;
          color: #475569;
          padding: 2px 8px;
          border-radius: 12px;
          display: inline-block;
        }
        .modern-ai-card .card-desc {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.4;
          margin: 0;
          flex-grow: 1;
        }
        .modern-ai-card .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid #f1f5f9;
        }
        .modern-ai-card .pricing-badge {
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #10b981;
        }
        .modern-ai-card .visit-link {
          font-size: 0.8rem;
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
        }
        .modern-ai-card .visit-link:hover {
          text-decoration: underline;
        }
        .loading-state, .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          color: #64748b;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px dashed #cbd5e1;
        }
        .ai-tools-actions { display: flex; gap: 6px; }
        .icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: 1px solid #dbeafe;
          border-radius: 7px;
          background: #eff6ff;
          color: #2563eb;
          cursor: pointer;
        }
        .icon-btn.danger { border-color: #fee2e2; background: #fef2f2; color: #dc2626; }
        .icon-btn.saved { border-color: #fef3c7; background: #fffbeb; color: #d97706; }
        @media (max-width: 680px) {
          .ai-tools-form-grid { grid-template-columns: 1fr; }
          .ai-tools-form-grid label.wide { grid-column: auto; }
          .panel-header { align-items: flex-start; flex-direction: column; }
        }
        .list-view {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          justify-content: start;
          gap: 20px;
          padding: 16px;
        }
        @media (max-width: 1200px) {
          .list-view {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 16px;
          }
        }
        @media (max-width: 680px) {
          .list-view {
            grid-template-columns: 1fr;
            gap: 14px;
            padding: 10px;
          }
        }
        .view-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(15,23,42,0.04);
          padding: 4px;
          border-radius: 8px;
        }
        .view-toggle button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .view-toggle button:hover {
          color: #0f172a;
        }
        .view-toggle button.active {
          background: white;
          color: #2563eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        /* Dashboard Cards Matching Home Page Style */
        .dash-link-card {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          border: 1px solid #edf0f5;
          border-radius: 24px;
          padding: 12px;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 4px 18px rgba(0, 0, 0, 0.02);
          transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
          position: relative;
        }
        .dash-link-card:hover {
          border-color: #e2e8f0;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.07);
          transform: translateY(-3px);
        }

        /* Banner Wrapper */
        .dash-card-banner-wrap {
          position: relative;
          width: 100%;
          margin-bottom: 8px;
        }
        .dash-card-banner {
          position: relative;
          width: 100%;
          height: 165px;
          background: #f1f3f8;
          border-radius: 18px;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dash-card-screenshot {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.4s ease;
          display: block;
        }
        .dash-link-card:hover .dash-card-screenshot {
          transform: scale(1.04);
        }
        .dash-category-pill {
          position: absolute;
          top: 10px;
          left: 10px;
          background: rgba(255, 255, 255, 0.94);
          backdrop-filter: blur(8px);
          color: #64748b;
          font-size: 10px;
          font-weight: 600;
          padding: 3px 9px;
          border-radius: 999px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
          border: 1px solid rgba(226, 232, 240, 0.8);
          z-index: 3;
        }
        
        /* Top Right Favorite Button over Banner */
        .dash-fav-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(8px);
          border: none;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
          transition: all 0.2s ease;
        }
        .dash-fav-btn:hover {
          background: #ffffff;
          color: #f43f5e;
          transform: scale(1.1);
        }
        .dash-fav-btn.active {
          color: #f43f5e;
          background: #ffffff;
        }

        /* Circular Logo Badge Overlapping Bottom Right */
        .dash-card-logo-badge {
          position: absolute;
          bottom: -10px;
          right: 12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #000000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.14);
          border: 3px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          overflow: hidden;
          transition: transform 0.25s ease;
        }
        .dash-link-card:hover .dash-card-logo-badge {
          transform: scale(1.08);
        }
        .dash-badge-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          padding: 5px;
          background: #ffffff;
        }

        /* Card Body */
        .dash-card-body {
          padding: 8px 6px 4px 6px;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .dash-card-title {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          color: #090e1a;
          letter-spacing: -0.3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dash-card-desc {
          margin: 0;
          font-size: 13px;
          color: #64748b;
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          font-weight: 400;
        }

        /* Footer Row with Smart Tag & Pricing */
        .dash-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
        }
        .dash-tag-pill {
          font-size: 11px;
          font-weight: 600;
          color: #475569;
          background: #f1f5f9;
          padding: 2.5px 9px;
          border-radius: 999px;
          letter-spacing: 0.1px;
        }
        .dash-pricing-pill {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.4px;
          text-transform: uppercase;
          padding: 3px 9px;
          border-radius: 999px;
          user-select: none;
        }
        .pricing-free-trial { background: #ffedd5; color: #9a3412; }
        .pricing-freemium   { background: #fef9c3; color: #854d0e; }
        .pricing-free-paid  { background: #fef9c3; color: #854d0e; }
        .pricing-paid       { background: #fee2e2; color: #991b1b; }
        .pricing-free       { background: #dcfce7; color: #166534; }

        /* Admin Actions Row (Open Service, Edit, Delete) */
        .dash-admin-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #f1f5f9;
        }
        .dash-open-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border: none;
          background: transparent;
          color: #2563eb;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }
        .dash-open-btn:hover {
          color: #1d4ed8;
        }
        .dash-edit-btn, .dash-delete-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 3px 7px;
          border: none;
          border-radius: 6px;
          background: #f8fafc;
          font-size: 0.74rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .dash-edit-btn { color: #2563eb; }
        .dash-edit-btn:hover { background: #eff6ff; }
        .dash-delete-btn { color: #ef4444; }
        .dash-delete-btn:hover { background: #fef2f2; }

        .dashboard-empty-container {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          text-align: center;
          background: #ffffff;
          border-radius: 18px;
          border: 1.5px dashed #e2e8f0;
          margin: 12px;
        }
        .dashboard-empty-animation {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dashboard-empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
        }
        .dashboard-empty-subtitle {
          font-size: 14px;
          color: #64748b;
          max-width: 380px;
          margin: 0 0 20px;
          line-height: 1.5;
        }
        .dashboard-empty-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
        .dashboard-empty-add-btn:hover {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.2);
        }
          transition: opacity 0.15s ease, background-color 0.15s ease;
        }
        .card-action:hover {
          background: #f3f4f6;
        }
        .edit-action { color: #2563eb; }
        .delete-action { color: #ef4444; }
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 6px;
          height: 248px;
          min-height: 248px;
          background: #fbfbfc;
          border: 1px dashed #e2e5eb;
          border-radius: 14px;
          box-shadow: none;
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 650;
          text-align: center;
        }
        .empty-state img {
          width: 128px;
          height: 100px;
          object-fit: contain;
          opacity: 0.86;
        }
        /* ============================================================
           DASHBOARD SKELETON SHIMMER LOADING
           ============================================================ */
        .skeleton-service-card {
          pointer-events: none;
          cursor: default;
          overflow: hidden;
        }
        .skeleton-preview {
          width: 100%;
          height: 154px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .skeleton-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .skeleton-badge {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .skeleton-body {
          padding: 12px 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .skeleton-line {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          border-radius: 4px;
        }
        .skeleton-card-title {
          height: 15px;
          width: 75%;
          margin-bottom: 2px;
        }
        .skeleton-card-desc {
          height: 11px;
          width: 95%;
        }
        .skeleton-card-desc-short {
          height: 11px;
          width: 65%;
        }
        .skeleton-tags {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }
        .skeleton-tag {
          width: 48px;
          height: 18px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .skeleton-footer {
          margin-top: auto;
          padding: 12px 16px;
          border-top: 1px solid #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .skeleton-url {
          height: 12px;
          width: 35%;
        }
        .skeleton-action-icons {
          display: flex;
          gap: 6px;
        }
        .skeleton-circle {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* Responsive Linear Skeleton */
        .list-view-linear .skeleton-service-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 104px;
        }
        .list-view-linear .skeleton-preview {
          width: 140px;
          height: 100%;
          flex-shrink: 0;
        }
        .list-view-linear .skeleton-body {
          flex: 1;
          padding: 10px 16px;
        }
        .list-view-linear .skeleton-footer {
          margin-top: 0;
          border-top: none;
          border-left: 1px solid #f1f5f9;
          height: 100%;
          padding: 0 16px;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }
        @keyframes skeletonShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .pagination {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 2px 14px 16px;
        }
        .pagination-info {
          color: #737985;
          font-size: 0.78rem;
          font-weight: 700;
        }
        .pagination-actions {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .page-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 32px;
          height: 32px;
          padding: 0 10px;
          border: 1px solid rgba(15,23,42,0.1);
          border-radius: 8px;
          background: rgba(255,255,255,0.72);
          color: #4b5563;
          font-size: 0.78rem;
          font-weight: 800;
        }
        .page-btn.active {
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }
        .page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }
        @media (max-width: 1200px) {
          .list-view { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 1024px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-menu-btn {
            display: inline-flex;
          }
          .sidebar-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.48);
            backdrop-filter: blur(4px);
            z-index: 998;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
          }
          .sidebar-backdrop.open {
            opacity: 1;
            pointer-events: auto;
          }
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            max-width: 85vw;
            background: #ffffff;
            z-index: 999;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 6px 0 28px rgba(0, 0, 0, 0.16);
            overflow-y: auto;
            overscroll-behavior: contain;
            -webkit-overflow-scrolling: touch;
            display: flex;
            flex-direction: column;
            gap: 16px;
            padding: 20px 16px;
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .sidebar-mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 4px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(15,23,42,0.08);
          }
          .sidebar-close-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            border: 1px solid rgba(15,23,42,0.1);
            background: #f8fafc;
            color: #475569;
            cursor: pointer;
            transition: all 0.2s;
          }
          .sidebar-close-btn:hover {
            background: #f1f5f9;
            color: #0f172a;
          }
          .main-content {
            width: 100%;
            min-width: 0;
            padding: 16px 16px 24px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }
          .list-view {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .topbar {
            gap: 12px;
          }
        }
        @media (max-width: 768px) {
          .main-content { padding: 14px 12px 24px; }
          .greeting { font-size: 1.5rem; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .stat-card { padding: 12px 14px; }
          .stat-value { font-size: 1.4rem; }
          .stat-icon { width: 28px; height: 28px; }
          .tool-row { flex-direction: column; align-items: stretch; gap: 10px; }
          .selector { min-width: 0; width: 100%; }
          .chip-row { flex-wrap: nowrap; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 8px; margin-bottom: 16px; -ms-overflow-style: none; scrollbar-width: none; }
          .chip-row::-webkit-scrollbar { display: none; }
          .chip { white-space: nowrap; padding: 6px 14px; font-size: 0.85rem; }
          .action-row { justify-content: stretch; margin: 10px 0 14px; }
          .action-buttons { flex-wrap: wrap; gap: 8px; }
          .ghost-btn { padding: 8px 10px; font-size: 0.82rem; }
          .list-view-linear .service-card {
            display: flex;
            flex-direction: column;
            height: auto;
          }
          .list-view-linear .service-preview {
            height: 140px;
            border-right: none;
            border-bottom: 1px solid #e5e7eb;
          }
          .list-view-linear .service-card-top { padding: 14px 16px 0; }
          .list-view-linear .link-title { margin: 10px 16px 4px; }
          .list-view-linear .link-description { margin: 0 16px 8px; }
          .list-view-linear .meta-tags { margin: 0 16px; }
          .list-view-linear .service-footer {
            border-left: none;
            border-top: 1px solid #f1f5f9;
            flex-direction: row;
            justify-content: space-between;
            padding: 12px 16px;
          }
        }
        @media (max-width: 640px) {
          .list-view { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .top-actions { width: 100%; justify-content: space-between; }
          .pagination { align-items: center; justify-content: center; flex-wrap: wrap; gap: 8px; }
          .pagination-actions { flex-wrap: wrap; justify-content: center; }
        }
        @media (max-width: 480px) {
          .topbar { flex-direction: column; align-items: stretch; gap: 10px; }
          .topbar-main-row { display: flex; align-items: center; gap: 10px; width: 100%; }
          .topbar-main-row .search-input-wrap { flex: 1; min-width: 0; }
          .top-actions { width: 100%; justify-content: space-between; }
        }
        .delete-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          animation: modalFadeIn 0.2s ease-out;
        }
        .delete-modal-card {
          background: white;
          width: min(400px, 100%);
          max-height: calc(100vh - 32px);
          max-height: calc(100dvh - 32px);
          overflow-y: auto;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          text-align: center;
          animation: modalScaleUp 0.2s ease-out;
        }
        .edit-modal-card {
          background: white;
          width: min(460px, 100%);
          max-height: calc(100vh - 32px);
          max-height: calc(100dvh - 32px);
          overflow-y: auto;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: modalScaleUp 0.2s ease-out;
        }
        .delete-modal-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .delete-modal-card h3 {
          margin: 0 0 8px;
          color: #111827;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .delete-modal-card p {
          margin: 0 0 24px;
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .delete-modal-actions {
          display: flex;
          gap: 12px;
        }
        .delete-modal-actions button {
          flex: 1;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .delete-modal-actions .cancel-btn {
          background: #f3f4f6;
          color: #374151;
        }
        .delete-modal-actions .cancel-btn:hover {
          background: #e5e7eb;
        }
        .delete-modal-actions .delete-btn {
          background: #ef4444;
          color: white;
        }
        .delete-modal-actions .delete-btn:hover {
          background: #dc2626;
        }
        .delete-modal-actions button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .edit-modal-form {
          text-align: left;
        }
        .edit-modal-form .form-group {
          margin-bottom: 16px;
        }
        .edit-modal-form label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 6px;
        }
        .edit-modal-form input,
        .edit-modal-form textarea,
        .edit-modal-form select {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          font-size: 0.95rem;
          color: #111827;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .edit-modal-form input:focus,
        .edit-modal-form textarea:focus,
        .edit-modal-form select:focus {
          border-color: #2563eb;
          background: #ffffff;
        }
        .edit-modal-form textarea {
          resize: vertical;
          min-height: 80px;
        }
        .edit-modal-card h3 {
          margin: 0 0 16px;
          color: #111827;
          font-size: 1.25rem;
          font-weight: 800;
          text-align: left;
        }
        .edit-modal-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .delete-modal-actions .save-btn {
          background: #2563eb;
          color: white;
        }
        .delete-modal-actions .save-btn:hover {
          background: #1d4ed8;
        }

        /* Premium AI Tool Modal */
        .ai-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px 16px;
          animation: modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ai-modal-dialog {
          background: #ffffff;
          width: min(580px, 100%);
          max-height: min(88vh, 800px);
          max-height: min(88dvh, 800px);
          border-radius: 20px;
          box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalScaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .ai-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
          flex-shrink: 0;
        }
        .ai-modal-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .ai-modal-badge {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: #ffffff;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
        }
        .ai-modal-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.02em;
          margin: 0 0 2px;
          line-height: 1.2;
        }
        .ai-modal-subtitle {
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
          margin: 0;
          line-height: 1.4;
        }
        .ai-modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          color: #64748b;
          display: grid;
          place-items: center;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .ai-modal-close-btn:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #ef4444;
          transform: rotate(90deg);
        }
        .ai-modal-form {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }
        .ai-modal-body {
          padding: 20px 24px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
        }
        .ai-modal-body::-webkit-scrollbar {
          width: 6px;
        }
        .ai-modal-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 999px;
        }
        .ai-modal-grid-2 {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .ai-field-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ai-field-label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ai-field-input,
        .ai-field-select,
        .ai-field-textarea {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          font-size: 0.92rem;
          color: #0f172a;
          font-weight: 500;
          outline: none;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }
        .ai-field-input:focus,
        .ai-field-select:focus,
        .ai-field-textarea:focus {
          border-color: #2563eb;
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }
        .ai-field-input::placeholder,
        .ai-field-textarea::placeholder {
          color: #94a3b8;
        }
        .ai-field-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
          appearance: none;
        }
        .ai-field-textarea {
          resize: vertical;
          min-height: 72px;
          max-height: 140px;
          line-height: 1.5;
        }
        .ai-toggle-cards {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 2px;
        }
        .ai-toggle-card {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .ai-toggle-card:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        .ai-toggle-card.active {
          background: #eff6ff;
          border-color: #3b82f6;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
        }
        .ai-toggle-card input[type="checkbox"] {
          margin-top: 2px;
          width: 16px;
          height: 16px;
          accent-color: #2563eb;
          cursor: pointer;
          flex-shrink: 0;
        }
        .ai-toggle-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }
        .ai-toggle-title {
          font-size: 0.84rem;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.3;
        }
        .ai-toggle-desc {
          font-size: 0.74rem;
          color: #64748b;
          line-height: 1.3;
        }
        .ai-tools-error {
          padding: 8px 12px;
          border-radius: 8px;
          background: #fef2f2;
          border: 1px solid #fee2e2;
          color: #ef4444;
          font-size: 0.82rem;
          font-weight: 600;
          margin: 0;
        }
        .ai-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          padding: 14px 24px;
          border-top: 1px solid #f1f5f9;
          background: #fcfdfe;
          flex-shrink: 0;
        }
        .ai-btn-cancel {
          padding: 10px 18px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #475569;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .ai-btn-cancel:hover {
          background: #f1f5f9;
          color: #0f172a;
        }
        .ai-btn-submit {
          padding: 10px 22px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.28);
          transition: all 0.15s ease;
        }
        .ai-btn-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(37, 99, 235, 0.38);
        }
        .ai-btn-submit:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        @media (max-width: 520px) {
          .ai-modal-grid-2 {
            grid-template-columns: 1fr;
          }
          .ai-toggle-cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-shell">
        <div
          className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden={!sidebarOpen}
        />

        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-mobile-header">
            <div className="brand-row" style={{ padding: 0 }}>
              <div className="brand-mark">N</div>
              <div className="brand-name">Nexio</div>
            </div>
            <button
              type="button"
              className="sidebar-close-btn"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          </div>

          <div className="brand-row desktop-only" style={{ padding: '0 0 4px' }}>
            <div className="brand-mark">N</div>
            <div className="brand-name">Nexio</div>
          </div>

          <button
            className="new-link-btn"
            type="button"
            onClick={() => {
              setSidebarOpen(false)
              if (typeof onAddLink === 'function') onAddLink()
            }}
          >
            <Plus size={18} />
            Save new link
          </button>

          <div>
            <div className="nav-list">
              {navItems.map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  className={`nav-item ${activeNav === label ? 'active' : ''}`}
                  onClick={() => {
                    setActiveNav(label)
                    setActiveFilter('All')
                    setCurrentPage(1)
                    setSidebarOpen(false)
                  }}
                >
                  <Icon size={18} />
                  <span className="nav-label">{label}</span>
                  {label === 'All Links' && <span className="counter">{walletTotalCount ?? liveLinks.length}</span>}
                  {label === 'Favorites' && <span className="counter">{liveStats[3]?.value || 0}</span>}
                  {label === 'Saved' && <span className="counter">{liveStats[1]?.value || 0}</span>}
                  {label === 'Editing' && (
                    <span className="counter">
                      {liveLinks.filter(item => item.category && (item.category.toLowerCase().includes('editing') || item.category.toLowerCase().includes('research'))).length}
                    </span>
                  )}
                  {label === 'AI Image & Video' && (
                    <span className="counter">
                      {liveLinks.filter(item => {
                        const c = (item.category || '').toLowerCase()
                        const t = (item.tag || '').toLowerCase()
                        return c.includes('image') || c.includes('video') || t.includes('image') || t.includes('video')
                      }).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {onBack && (
            <div className="sidebar-bottom-action">
              {onLogout && (
                <button
                  type="button"
                  className="back-home-btn"
                  onClick={() => {
                    setSidebarOpen(false)
                    if (typeof onLogout === 'function') onLogout()
                  }}
                  style={{ marginBottom: '8px', color: '#ef4444', borderColor: '#fee2e2', backgroundColor: '#fef2f2' }}
                >
                  <LogOut size={16} style={{ marginRight: '8px' }} />
                  Logout
                </button>
              )}
              <button
                type="button"
                className="back-home-btn"
                onClick={() => {
                  setSidebarOpen(false)
                  if (typeof onBack === 'function') onBack()
                }}
              >
                Back to home
              </button>
            </div>
          )}
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div className="topbar-main-row">
              <button
                type="button"
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar menu"
              >
                <Menu size={20} />
              </button>
              <button
                type="button"
                className="search-input-wrap"
                onClick={() => setIsSearchModalOpen(true)}
              >
                <Search size={16} />
                <span className="placeholder">Search links, tags, notes...</span>
              </button>
            </div>

            <div className="top-actions">
              <div className="action-buttons">
                <button className="ghost-btn" type="button" onClick={handleImport}><Upload size={16} /> Import</button>
                <div className="export-menu-wrap">
                  <button className="ghost-btn" type="button" onClick={() => setExportOpen((open) => !open)} aria-expanded={exportOpen}>
                    <Download size={16} /> Export
                  </button>
                  {exportOpen && (
                    <div className="export-menu" role="menu">
                      {[
                        ['json', 'JSON'],
                        ['pdf', 'PDF'],
                        ['doc', 'DOC'],
                        ['excel', 'Excel'],
                      ].map(([format, label]) => (
                        <button key={format} type="button" className="export-option" onClick={() => handleExport(format)}>
                          <FileText size={16} />
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="topbar-divider" />

              {/* Notification Center */}
              <div className="notification-wrap" ref={notificationRef}>
                <button
                  className={`icon-circle-btn ${isNotificationOpen ? 'active' : ''}`}
                  type="button"
                  onClick={() => setIsNotificationOpen((prev) => !prev)}
                  title="Notifications"
                  aria-expanded={isNotificationOpen}
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="notification-dropdown" role="dialog" aria-label="Notifications">
                    <div className="notification-header">
                      <div className="notification-header-title">
                        <h4>Notifications</h4>
                        {unreadCount > 0 && (
                          <span className="notification-count-pill">{unreadCount} new</span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          type="button"
                          className="mark-all-read-btn"
                          onClick={markAllNotificationsRead}
                          title="Mark all as read"
                        >
                          <Check size={13} />
                          <span>Mark all read</span>
                        </button>
                      )}
                    </div>

                    <div className="notification-list">
                      {notifications.length === 0 ? (
                        <div className="notification-empty">
                          <div className="notification-empty-icon">
                            <Bell size={20} color="#94a3b8" />
                          </div>
                          <h5>No notifications yet</h5>
                          <p>Notifications will appear here when links are stored or deleted.</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`notification-item ${!notif.read ? 'unread' : ''} ${notif.action || 'saved'}`}
                            onClick={() => {
                              markNotificationRead(notif.id)
                              if (notif.url && notif.action !== 'deleted') {
                                const targetUrl = notif.url.startsWith('http') ? notif.url : `https://${notif.url}`
                                window.open(targetUrl, '_blank', 'noopener,noreferrer')
                              }
                            }}
                          >
                            <div className="notif-dot-wrap">
                              <span className={`notif-status-dot ${notif.action === 'deleted' ? 'deleted' : 'saved'} ${!notif.read ? 'active' : ''}`} />
                            </div>
                            <div className="notif-content">
                              <div className="notif-title-row">
                                <span className="notif-title">{notif.title}</span>
                                <span className="notif-time">{notif.time}</span>
                              </div>
                              <p className="notif-message">{notif.message}</p>
                              <div className="notif-meta-row">
                                <span className={`notif-action-tag ${notif.action === 'deleted' ? 'deleted' : 'saved'}`}>
                                  {notif.action === 'deleted' ? 'Deleted' : 'Stored'}
                                </span>
                                {notif.category && (
                                  <span className="notif-category-pill">{notif.category}</span>
                                )}
                                {notif.url && notif.action !== 'deleted' && (
                                  <span className="notif-open-link">
                                    Open <ArrowUpRight size={11} />
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {notifications.length > 0 && (
                      <div className="notification-footer">
                        <button
                          type="button"
                          className="clear-all-notif-btn"
                          onClick={clearAllNotifications}
                        >
                          Clear all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="mini-avatar" title="Nexio Workspace">N</div>
            </div>
          </header>

          {status && (
            <div style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#1f8f5f', fontWeight: 700 }}>
              {status}
            </div>
          )}

          {activeNav === 'AI Tools' ? <AIToolsManager /> : <>
            <div className="stats-grid">
              {liveStats.map(({ label, value, delta, accent, icon: Icon }) => (
                <div className="stat-card" key={label}>
                  <div className="stat-icon" style={{ '--icon-color': accent }}>
                    <Icon size={16} strokeWidth={2.2} />
                  </div>
                  <div className="stat-main">
                    <div className="stat-value">{value}</div>
                    <div className="stat-label">{label}</div>
                    <div className="stat-delta">↑ {delta}</div>
                  </div>
                </div>
              ))}
            </div>


            <div className="chip-row-container">
              <div className="filter-group">
                <button
                  type="button"
                  className={`chip ${activeFilter === 'All' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveFilter('All')
                    setCategoryDropdownOpen(false)
                  }}
                >
                  All
                  <span className="category-count-badge" style={{ marginLeft: '6px' }}>
                    {categoryCounts['All'] || 0}
                  </span>
                </button>

                <div className="filter-dropdown-wrap" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    className={`category-dropdown-btn ${activeFilter !== 'All' ? 'active-filter' : ''}`}
                    onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                    aria-expanded={categoryDropdownOpen}
                  >
                    <Filter size={15} className="category-btn-icon" />
                    <span>
                      {activeFilter === 'All' ? 'Select Category' : activeFilter}
                    </span>
                    {activeFilter !== 'All' && (
                      <>
                        <span className="category-count-badge">
                          {categoryCounts[activeFilter] || 0}
                        </span>
                        <span
                          className="category-clear-btn"
                          onClick={(e) => {
                            e.stopPropagation()
                            setActiveFilter('All')
                            setCategoryDropdownOpen(false)
                          }}
                          title="Reset to All"
                          role="button"
                          tabIndex={0}
                        >
                          <X size={11} />
                        </span>
                      </>
                    )}
                    <ChevronDown
                      size={14}
                      className="category-chevron"
                      style={{
                        transform: categoryDropdownOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                        marginLeft: '2px',
                      }}
                    />
                  </button>

                  {categoryDropdownOpen && (
                    <div className="category-dropdown-menu">
                      {availableCategories.length > 5 && (
                        <div className="category-dropdown-search">
                          <Search size={14} color="#94a3b8" />
                          <input
                            type="text"
                            placeholder="Search categories..."
                            value={categorySearchQuery}
                            onChange={(e) => setCategorySearchQuery(e.target.value)}
                            autoFocus
                          />
                          {categorySearchQuery && (
                            <button
                              type="button"
                              className="chip-search-clear"
                              onClick={() => setCategorySearchQuery('')}
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      )}
                      <div className="category-dropdown-list">
                        {filteredDropdownCategories.map((cat) => {
                          const isSelected = activeFilter === cat
                          return (
                            <button
                              key={cat}
                              type="button"
                              className={`category-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => {
                                setActiveFilter(cat)
                                setCategoryDropdownOpen(false)
                                setCategorySearchQuery('')
                              }}
                            >
                              <span>{cat === 'All' ? 'All Categories' : cat}</span>
                              <div className="category-item-right">
                                <span className="category-count-badge">
                                  {categoryCounts[cat] || 0}
                                </span>
                                {isSelected && <Check size={14} color="#2563eb" />}
                              </div>
                            </button>
                          )
                        })}
                        {filteredDropdownCategories.length === 0 && (
                          <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem' }}>
                            No categories found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="chip-search-bar">
                <Search size={16} className="chip-search-icon" />
                <input
                  type="text"
                  placeholder="Filter by title, URL or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="chip-search-clear"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <section className="panel">
              <div className="list-view">
                {isQuickAssetsView ? (
                  filteredQuickAssets.length === 0 ? (
                    <div className="dashboard-empty-container" style={{ gridColumn: '1 / -1' }}>
                      <div className="dashboard-empty-animation">
                        <img
                          src="/assets/empty/no-messages.svg"
                          alt="No quick assets"
                          style={{ width: '180px', height: '140px', objectFit: 'contain' }}
                        />
                      </div>
                      <h3 className="dashboard-empty-title">No quick assets available</h3>
                      <p className="dashboard-empty-subtitle">
                        Add lightweight utilities, plugins, and vector sets to your Quick Assets workspace.
                      </p>
                      <button
                        type="button"
                        className="dashboard-empty-add-btn"
                        onClick={onAddLink}
                      >
                        <Plus size={16} />
                        <span>Add Quick Asset</span>
                      </button>
                    </div>
                  ) : filteredQuickAssets.map((item) => (
                    <DashboardLinkCard
                      key={item.id}
                      item={item}
                      isDashboardView={isDashboardView}
                      onOpen={handleOpenService}
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                      onToggleFavorite={handleToggleFavorite}
                      favoritePulseId={favoritePulseId}
                    />
                  ))
                ) : isLoadingLinks ? (
                  Array.from({ length: 8 }).map((_, idx) => (
                    <article key={idx} className="service-card skeleton-service-card">
                      <div className="skeleton-preview" />
                      <div className="service-card-top" style={{ padding: '14px 16px 0' }}>
                        <div className="skeleton-avatar" />
                        <div className="skeleton-badge" />
                      </div>
                      <div className="skeleton-body">
                        <div className="skeleton-line skeleton-card-title" />
                        <div className="skeleton-line skeleton-card-desc" />
                        <div className="skeleton-line skeleton-card-desc-short" />
                        <div className="skeleton-tags">
                          <div className="skeleton-tag" />
                          <div className="skeleton-tag" />
                        </div>
                      </div>
                      <div className="skeleton-footer">
                        <div className="skeleton-line skeleton-url" />
                        <div className="skeleton-action-icons">
                          <div className="skeleton-circle" />
                          <div className="skeleton-circle" />
                        </div>
                      </div>
                    </article>
                  ))
                ) : linksError ? (
                  <div className="service-card empty-state" style={{ gridColumn: '1 / -1', color: '#b45309' }}>
                    {linksError}
                  </div>
                ) : filteredLinks.length === 0 ? (
                  <div className="dashboard-empty-container">
                    <div className="dashboard-empty-animation">
                      <img
                        src={
                          activeNav === 'Favorites'
                            ? '/assets/empty/no-favorites.svg'
                            : activeNav === 'Saved'
                              ? '/assets/empty/checklist.svg'
                              : activeNav === 'Read Later'
                                ? '/assets/empty/announcement.svg'
                                : '/assets/empty/no-data.svg'
                        }
                        alt="Empty state"
                        style={{ width: '180px', height: '140px', objectFit: 'contain' }}
                      />
                    </div>
                    <h3 className="dashboard-empty-title">
                      {activeNav === 'Favorites'
                        ? 'No favorite links saved yet'
                        : activeNav === 'Read Later'
                          ? 'No links marked for read later'
                          : `No ${activeNav.toLowerCase()} links found`}
                    </h3>
                    <p className="dashboard-empty-subtitle">
                      Keep your favorite websites, tools, and research documents organized in your Nexio workspace.
                    </p>
                    <button
                      type="button"
                      className="dashboard-empty-add-btn"
                      onClick={onAddLink}
                    >
                      <Plus size={16} />
                      <span>Add New Link</span>
                    </button>
                  </div>
                ) : visibleLinks.map((item) => (
                  <DashboardLinkCard
                    key={item.id || item._id}
                    item={item}
                    isDashboardView={isDashboardView}
                    onOpen={handleOpenService}
                    onEdit={handleEditService}
                    onDelete={handleDeleteService}
                    onToggleFavorite={handleToggleFavorite}
                    favoritePulseId={favoritePulseId}
                  />
                ))}
              </div>

              {filteredLinks.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  scrollToTop={false}
                />
              )}
            </section>
          </>}
        </main>
      </div>

      {itemToDelete && (
        <div className="delete-modal-backdrop" onClick={() => !isDeleting && setItemToDelete(null)}>
          <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <Trash2 size={24} color="#ef4444" />
            </div>
            <h3>Delete Link</h3>
            <p>Are you sure you want to delete <strong>{itemToDelete.title}</strong>? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={confirmDelete}
                disabled={isDeleting}
                autoFocus
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <EditLinkModal
        isOpen={Boolean(itemToEdit)}
        item={itemToEdit}
        onClose={() => setItemToEdit(null)}
        onSave={confirmEdit}
        isSubmitting={isEditing}
      />

      <GlobalSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        links={liveLinks}
        onOpenLink={handleOpenService}
      />
    </>
  )
}
