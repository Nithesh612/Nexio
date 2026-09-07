import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import {
  ArrowLeft,
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Sparkles,
  ExternalLink,
  Heart,
  Bookmark,
  Layers,
  Box,
  Palette,
  Type,
  LayoutGrid,
  Zap,
  Flame,
  ArrowUpRight,
  TrendingUp,
  Globe,
  Monitor,
  Smartphone,
  Terminal,
  Download,
  Share2,
  Check,
  ChevronRight,
  Send,
  Eye,
  BookOpen,
  Users,
  Newspaper,
  Headphones,
  Book,
  PenTool,
  Camera,
  Image as ImageIcon
} from 'lucide-react'

import { API_URL } from '../config/api'

// Category Filters Data matching user provided categories
const CATEGORIES = [
  { id: 'all', name: 'All Resources', icon: LayoutGrid, url: 'https://www.toools.design' },
  { id: 'ai', name: 'AI Tools', icon: Sparkles, url: 'https://www.toools.design/ai-design-tools' },
  { id: 'inspiration', name: 'Inspiration', icon: Flame, url: 'https://www.toools.design/ui-web-design-inspiration-websites' },
  { id: 'icons', name: 'Icons', icon: Layers, url: 'https://www.toools.design/free-open-source-icon-libraries' },
  { id: 'illustrations', name: 'Illustrations & SVG', icon: ImageIcon, url: 'https://www.toools.design/free-open-source-illustrations' },
  { id: 'stock', name: 'Stock Photos', icon: Camera, url: 'https://www.toools.design/free-stock-images-videos' },
  { id: 'learning', name: 'Learning', icon: BookOpen, url: 'https://www.toools.design/learn-ui-ux-design' },
  { id: 'community', name: 'Community', icon: Users, url: 'https://www.toools.design/design-communities' },
  { id: 'blogs', name: 'Blogs & Mags', icon: Newspaper, url: 'https://www.toools.design/best-design-blogs-and-magazines' },
  { id: 'books', name: 'Books', icon: Book, url: 'https://www.toools.design/books-for-designers' },
  { id: 'ux-tools', name: 'UX Tools', icon: Monitor, url: 'https://www.toools.design/best-ux-tools' },
  { id: 'colors', name: 'Color Tools', icon: Palette, url: 'https://www.toools.design/best-color-inspiration-tools' },
  { id: 'fonts', name: 'Typography', icon: Type, url: 'https://www.toools.design/font-library-and-inspiration' },
]

function matchCategory(link, catId) {
  if (!link) return false
  const cat = (link.category || '').toLowerCase()
  const collection = (link.collection || '').toLowerCase()
  const desc = (link.description || '').toLowerCase()
  const title = (link.title || '').toLowerCase()
  const url = (link.url || '').toLowerCase()
  const allText = `${cat} ${collection} ${desc} ${title} ${url}`

  if (catId === 'all') {
    const designKeywords = ['ai', 'inspiration', 'icon', 'illustration', 'svg', 'stock', 'learn', 'community', 'blog', 'book', 'ux', 'ui', 'color', 'font', 'design']
    return designKeywords.some(keyword => cat.includes(keyword) || allText.includes(keyword))
  }
  if (catId === 'ai') {
    return cat.includes('ai') || allText.includes('ai')
  }
  if (catId === 'inspiration') {
    return cat.includes('inspiration') || allText.includes('inspiration')
  }
  if (catId === 'icons') {
    return cat.includes('icon') || allText.includes('icon')
  }
  if (catId === 'illustrations') {
    return cat.includes('illustration') || allText.includes('illustration') || allText.includes('svg')
  }
  if (catId === 'stock') {
    return cat.includes('stock') || allText.includes('stock')
  }
  if (catId === 'learning') {
    return cat.includes('learn') || allText.includes('learn')
  }
  if (catId === 'community') {
    return cat.includes('community') || allText.includes('community')
  }
  if (catId === 'blogs') {
    return cat.includes('blog') || allText.includes('blog')
  }
  if (catId === 'books') {
    return cat.includes('book') || allText.includes('book')
  }
  if (catId === 'ux-tools') {
    return cat.includes('ux') || cat.includes('ui') || allText.includes('ux') || allText.includes('ui')
  }
  if (catId === 'colors') {
    return cat.includes('color') || allText.includes('color')
  }
  if (catId === 'fonts') {
    return cat.includes('font') || allText.includes('font')
  }
  return false
}

// Featured Design Tools (Live Screen Banners & Live Logos)
const FEATURED_DESIGN_TOOLS = [
  {
    id: 'readymag',
    title: 'Readymag',
    desc: 'Create all kinds of websites with flexibility and complete creative freedom.',
    url: 'https://readymag.com/?utm_source=toools&utm_medium=partnership_website&utm_campaign=main',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a85732e62373e8fdd649f78_readymag-website-builder.gif',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a857854796820f3bb34f62e_logo-readymag.svg',
    type: 'readymag'
  },
  {
    id: 'designlab',
    title: 'AI Product Design Certification',
    desc: 'A new AI certification from Designlab where you learn from practitioners at VP and Principal level.',
    url: 'https://designlab.com/advanced/ai-product-design-certification?discount=AI$200&irclickid=SZRzXDWvcxyZRytSIpXgH18mUkr2Q2yYO3u2zE0&irgwc=1&afsrc=1&utm_content=3704448&utm_campaign=%22Affiliates%22&utm_source=impact&utm_medium=affiliate',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a7df979a29a8d282393119e_ai-product-design-course-designlab-a.gif',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a7df5c45121ae9788dc3bea_logo-designlab.svg',
    type: 'designlab'
  },
  {
    id: 'mobbin-mcp',
    title: 'Mobbin MCP',
    desc: 'Mobbin MCP connects your AI agents to 600,000+ real product screens.',
    url: 'https://mobbin.com/mcp?via=toools',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a38fe7685c2bc351f24dc21_mobbin-mcp-connectors.webp',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a38fd1bfbf903a6ea1b8fae_icon-mobbin.svg',
    type: 'mobbin'
  }
]

// Curated specific brand presets for live banners & logos
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
  },
  codepen: {
    title: 'CodePen',
    bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop',
    logoUrl: 'https://logo.clearbit.com/codepen.io',
  },
  mobbin: {
    title: 'Mobbin',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a38fe7685c2bc351f24dc21_mobbin-mcp-connectors.webp',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/636e1c6def41c92663fe8ea1_icon-mobbin.svg',
  }
};

function DesignResourceCard({ item, isBookmarked, onToggleBookmark }) {
  const [screenshotError, setScreenshotError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const cleanUrl = useMemo(() => {
    try {
      const u = item.url.startsWith('http') ? item.url : `https://${item.url}`;
      return new URL(u).href;
    } catch {
      return item.url;
    }
  }, [item.url]);

  const hostname = useMemo(() => {
    try {
      return new URL(cleanUrl).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }, [cleanUrl]);

  const domainSlug = hostname.split('.')[0]?.toLowerCase();
  const preset = BRAND_PRESETS[domainSlug] || (item.title?.toLowerCase().includes('readymag') ? BRAND_PRESETS.readymag : null);

  const primaryScreenshot = item.bannerUrl || (preset ? preset.bannerUrl : `https://image.thum.io/get/width/600/crop/400/${cleanUrl}`);
  const secondaryScreenshot = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  const tertiaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600&h=380`;
  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot);

  useEffect(() => {
    setCurrentScreenshot(primaryScreenshot);
    setScreenshotError(false);
  }, [primaryScreenshot]);

  const clearbitLogo = `https://logo.clearbit.com/${hostname}`;
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  const logoSrc = item.logoUrl || preset?.logoUrl || (!logoError ? clearbitLogo : googleFavicon);

  const isReadymag = domainSlug === 'readymag' || item.title?.toLowerCase().includes('readymag');

  const categoryTag = item.tag && !['saved', 'other', 'all', 'all links', 'inbox'].includes(item.tag.toLowerCase().trim())
    ? item.tag
    : (item.category && item.category !== 'General' ? item.category.split(',')[0].trim() : 'Design');

  return (
    <a
      href={cleanUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 hover:border-indigo-300 p-3 sm:p-3.5 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between block no-underline text-inherit cursor-pointer"
    >
      <div>
        {/* Live Website Screen Banner Box */}
        <div className="relative w-full mb-3 sm:mb-3.5">
          <div className="relative w-full h-36 sm:h-44 rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-100 flex items-center justify-center shadow-inner">
            {isReadymag ? (
              <div className="w-full h-full bg-[#ff6ebb] relative overflow-hidden flex items-end p-3 sm:p-4">
                <svg viewBox="0 0 400 240" className="absolute -right-3 -top-2 w-44 sm:w-52 h-36 sm:h-44 pointer-events-none" fill="none" preserveAspectRatio="xMidYMid meet">
                  <path
                    d="M190 240 C170 210, 150 170, 145 130 C140 95, 155 75, 168 80 C180 85, 185 110, 192 135 C195 90, 205 60, 220 62 C235 64, 235 95, 235 125 C242 85, 255 70, 270 75 C285 80, 280 115, 275 145 C285 120, 305 115, 318 128 C332 142, 315 180, 285 215 C260 240, 220 240, 190 240 Z"
                    fill="rgba(255, 255, 255, 0.9)"
                  />
                </svg>
                <div className="relative z-10 text-lg sm:text-xl font-extrabold text-[#3b0532] leading-tight">
                  Design powered<br />by humans.
                </div>
              </div>
            ) : !screenshotError ? (
              <img
                src={currentScreenshot}
                alt={`${item.title} live banner`}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
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
              <div className="w-full h-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/15 to-rose-500/20 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-400/80">
                  {item.title?.charAt(0) || '✦'}
                </span>
              </div>
            )}

            {/* Top-Left Category Tag Pill */}
            <span className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-10 text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20 shadow-xs tracking-wide">
              {categoryTag}
            </span>
          </div>

          {/* Overlapping Circular Live Logo Badge */}
          <div className="absolute -bottom-2 sm:-bottom-2.5 right-2.5 sm:right-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border-2 border-white shadow-md flex items-center justify-center z-10 overflow-hidden group-hover:scale-105 transition-transform">
            {isReadymag ? (
              <div className="w-full h-full bg-black text-white flex items-center justify-center font-bold text-[10px] sm:text-xs">
                <span>R/m</span>
              </div>
            ) : preset?.logoSvg === 'framer' ? (
              <div className="w-full h-full bg-black flex items-center justify-center p-1.5 sm:p-2">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                  <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
                </svg>
              </div>
            ) : preset?.logoSvg === 'figma' ? (
              <div className="w-full h-full bg-white flex items-center justify-center p-1 sm:p-1.5">
                <svg viewBox="0 0 38 57" className="w-3.5 h-5 sm:w-4 sm:h-6">
                  <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
                  <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
                  <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
                  <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
                  <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
                </svg>
              </div>
            ) : preset?.logoSvg === 'webflow' ? (
              <div className="w-full h-full bg-black flex items-center justify-center p-1.5 sm:p-2">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
            ) : (
              <img
                src={logoSrc}
                alt={`${item.title} logo`}
                className="w-full h-full object-contain p-1 sm:p-1.5 bg-white"
                onError={() => setLogoError(true)}
                loading="lazy"
              />
            )}
          </div>
        </div>

        {/* Card Title & Verified Badge */}
        <div className="flex items-center justify-between mb-1 mt-1">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors truncate">
            {item.title}
          </h4>
          <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200/50 shrink-0 ml-1.5">
            {item.badge}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2.5 sm:mb-3">
          {item.desc}
        </p>
      </div>

      {/* Footer: Heart Favorite Button, Tag & Pricing */}
      <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t border-gray-100 text-xs mt-1">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleBookmark(item.id);
            }}
            aria-label={isBookmarked ? 'Remove favorite' : 'Add favorite'}
            className={`p-1.5 rounded-full transition-all cursor-pointer ${
              isBookmarked
                ? 'text-rose-500 bg-rose-50'
                : 'text-gray-400 hover:text-rose-500 hover:bg-gray-50'
            }`}
          >
            <Heart size={15} className={isBookmarked ? 'fill-rose-500' : ''} />
          </button>
          <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md truncate max-w-[90px] sm:max-w-none">
            {item.tag || categoryTag}
          </span>
        </div>
        <span className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#fef9c3] text-[#854d0e] rounded-md tracking-wider uppercase shrink-0">
          {item.pricing || 'FREEMIUM'}
        </span>
      </div>
    </a>
  );
}

// Latest 16 Grid Resources (With Live Official Assets)
const LATEST_RESOURCES = [
  {
    id: 'lr1',
    title: 'Runway',
    desc: 'Building AI systems to simulate the world, generation and video VFX.',
    category: 'ai',
    tag: 'Video AI',
    badge: 'Popular',
    pricing: 'Freemium',
    url: 'https://runwayml.com/?ref=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6435236315d33e570b259f92_runway.svg'
  },
  {
    id: 'lr2',
    title: 'Bolt.new',
    desc: 'Create, run, and deploy fullstack web apps directly by chatting with AI.',
    category: 'ai',
    tag: 'Vibe Coding',
    badge: 'Hot',
    pricing: 'Freemium',
    url: 'https://bolt.new/?ref=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/698e25b6387c035197d89fba_bolt-vibe-coding-platform.svg'
  },
  {
    id: 'lr3',
    title: 'Lovable',
    desc: 'Create real software and fullstack applications with AI prompt engineering.',
    category: 'ai',
    tag: 'AI Builder',
    badge: 'Top Pick',
    pricing: 'Freemium',
    url: 'https://lovablelabs.pxf.io/4aoVMo',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/686524b3517396c273cd8dc7_lovable-vibe-coding-apps-websites.svg'
  },
  {
    id: 'lr4',
    title: 'Framer',
    desc: 'Design and publish your dream website. Zero code, maximum interactive speed.',
    category: 'uikits',
    tag: 'Site Builder',
    badge: 'Essential',
    pricing: 'Freemium',
    url: 'https://framer.link/toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/64db3cb22868255d11d72f28_framer.jpg'
  },
  {
    id: 'lr5',
    title: 'Uxcel',
    desc: 'Learn UX design, Product Management & AI skills with interactive courses.',
    category: 'systems',
    tag: 'UX Training',
    badge: 'Top Rated',
    pricing: 'Paid',
    url: 'https://uxcel.com?ref=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/672c87800ab23c6f289dc7dd_uxcel-learn-ux-design-courses.svg'
  },
  {
    id: 'lr6',
    title: 'SaaSFrame',
    desc: 'Create product interfaces faster than ever with this large UI & paywall library.',
    category: 'uikits',
    tag: 'UI Library',
    badge: 'Curated',
    pricing: 'Free + Paid',
    url: 'https://www.saasframe.io/?aff=kzPjR',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/660c2871697203da0f1b8bef_saasframe-bw.gif'
  },
  {
    id: 'lr7',
    title: 'Lummi',
    desc: 'Free stock photos powered by creative digital humans and AI everywhere.',
    category: 'inspiration',
    tag: 'Stock Photos',
    badge: 'Free Pro',
    pricing: 'Free + Paid',
    url: 'https://www.lummi.ai/?ref=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/65f94febff5661997c384581_lummi.svg'
  },
  {
    id: 'lr8',
    title: 'Shape of AI',
    desc: 'Exploring how user experience and design paradigms evolve with AI.',
    category: 'ai',
    tag: 'UX Archive',
    badge: 'Free',
    pricing: 'Free',
    url: 'https://www.shapeof.ai/?ref=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6741ee93dee4595f114bb091_shapeofai.jpg'
  },
  {
    id: 'lr9',
    title: 'Design Spells',
    desc: 'Design details, spring transitions, and micro-interactions that feel like magic.',
    category: 'inspiration',
    tag: 'Micro UX',
    badge: 'Loved',
    pricing: 'Free',
    url: 'https://www.designspells.com/?ref=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/64d1fe87154f466480d9d767_design-spells.svg'
  },
  {
    id: 'lr10',
    title: 'Mobbin',
    desc: 'Save hours of UI & UX research with a library of 600,000+ searchable screens.',
    category: 'inspiration',
    tag: 'Mobile Flow',
    badge: 'Essential',
    pricing: 'Free + Paid',
    url: 'https://mobbin.com/?via=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/636e1c6def41c92663fe8ea1_mobbin.svg'
  },
  {
    id: 'lr11',
    title: 'Laws of UX',
    desc: 'A collection of best practices and psychological rules for UI/UX designers.',
    category: 'systems',
    tag: 'Psychology',
    badge: 'Official',
    pricing: 'Free',
    url: 'https://lawsofux.com/?ref=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6018765000c4c25e817e53b5_laws-of-ux.gif'
  },
  {
    id: 'lr12',
    title: 'Design Principles',
    desc: 'An open-source collection of design principles and design systems.',
    category: 'systems',
    tag: 'Design System',
    badge: 'Open Source',
    pricing: 'Free',
    url: 'https://principles.design/?ref=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/5f84bc7b415f1148a28de880_design-principles.svg'
  },
  {
    id: 'lr13',
    title: 'Kittl',
    desc: 'AI design platform for graphics, vector logos, and custom typography.',
    category: 'ai',
    tag: 'Graphic AI',
    badge: 'Trending',
    pricing: 'Freemium',
    url: 'https://kittl.pxf.io/4GJg09',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/678d35e407aa363b4cd95071_kittl-ai-tools.svg'
  },
  {
    id: 'lr14',
    title: 'Gamma',
    desc: 'Effortless AI design for interactive presentations, documents, and websites.',
    category: 'ai',
    tag: 'Presentations',
    badge: 'Popular',
    pricing: 'Freemium',
    url: 'https://try.gamma.app/via-toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6914625bd3afc65128282d67_gamma-ai-presentations.svg'
  },
  {
    id: 'lr15',
    title: 'OpenArt',
    desc: 'Turns imagination into visual art and character storyboards with precision.',
    category: 'ai',
    tag: 'Art Editor',
    badge: 'Updated',
    pricing: 'Free Trial',
    url: 'https://openart.ai/home/?via=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69345f6c0dd086d5fb823708_openart-ai-art-generator-and-editor.svg'
  },
  {
    id: 'lr16',
    title: 'Descript',
    desc: 'An AI-powered, fully featured, end-to-end video and podcast editor.',
    category: 'ai',
    tag: 'Video Editor',
    badge: 'Top Pick',
    pricing: 'Freemium',
    url: 'https://get.descript.com/os9eucsjt4dv',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69a4a86e9708efc279d9f06c_descript-ai-video-editor.svg'
  }
]

// Essential AI Tools (Dark Banner Grid with Live SVG / WebP Assets)
const AI_TOOLS = [
  {
    id: 'ai1',
    name: 'Banani',
    desc: 'Design stunning product UI screens and complete mockups with AI in minutes.',
    tag: 'UI Synthesizer',
    badge: 'Hot',
    url: 'https://getbanani.link/toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69a53c78b9f2cc6576220557_banani-ai-ui-design-generator.webp',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69121485b4b3f85b96e3cc19_brain-ai.svg'
  },
  {
    id: 'ai2',
    name: 'AdCreative.ai',
    desc: '#1 most used AI tool for advertising, conversion banners, and social posts.',
    tag: 'Ad Generator',
    badge: 'Top Pick',
    url: 'https://free-trial.adcreative.ai/toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/672c8b3ca559c45b7037adf4_adcreative-ai-best-advertising-tool.svg',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69b29e19627f64f7edb80594_megaphone.svg'
  },
  {
    id: 'ai3',
    name: 'Fliki',
    desc: 'Turn scripts and text prompts into engaging videos with professional AI voices.',
    tag: 'Video AI',
    badge: 'Fast',
    url: 'https://fliki.ai/?via=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6655cf7d94f65fff919124a8_fliki-ai-videos.svg',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/691215396e6cc06bef3a16f9_lightning.svg'
  },
  {
    id: 'ai4',
    name: 'Dorik AI',
    desc: 'Create beautiful, production-ready responsive websites directly from a prompt.',
    tag: 'Site Builder',
    badge: 'AI v2',
    url: 'https://dorik.com?via=toools',
    imgUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6662e8f9ec58cddd3d44fcff_dorik-ai-website-generator.svg',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/691214901662725b01b9908a_browser-pointer.svg'
  }
]

// Featured Quick Assets (Compact 4x3 Grid with Live Brand Icons)
const COMPACT_TOOLS = [
  { id: 'ct1', name: 'Fabric', category: 'Smart organizer for notes & links', badge: 'Free', url: 'https://fabric.so/?via=toools', logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/678cd7ab0827ce6d17abe72e_fabric-bookmarking-notetaking-tool.svg' },
  { id: 'ct2', name: 'Chronicle', category: 'A modern format of storytelling', badge: 'Free', url: 'https://chr.so/toools', logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6419a8603e72984af76cd290_chronicle.svg' },
  { id: 'ct3', name: 'Holo', category: 'AI marketing content generation', badge: 'Paid', url: 'https://hololtuab.sjv.io/Bng6JJ', logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/68ecb78dab0a9e25ee5ed065_holo-marketing-content-ai-generation.webp' },
  { id: 'ct4', name: 'LiveSurface', category: 'Hyper real 3D packaging mockups', badge: 'App', url: 'https://www.livesurface.com/', logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6512d8dc282ac6b8193ed1a2_deal-icon-live-surface.svg' },
  { id: 'ct5', name: 'Framify', category: '1k+ Framer UI components', badge: 'Framer', url: 'https://framify.design/?aff=kzPjR', logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/691c70f79b18baff442bf92e_deal-icon-framify.svg' },
  { id: 'ct6', name: 'Squarespace', category: 'Website builder & hosting platform', badge: 'Trial', url: 'https://squarespace.syuh.net/Zd7ELk', logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/63ebfe215b31067c0f2f3b0e_deal-icon-squarespace.svg' },
  { id: 'ct7', name: 'Figma', category: 'Industry standard interface design', badge: 'Essential', url: 'https://www.figma.com/?via=toools', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
  { id: 'ct8', name: 'Notion', category: 'Connected workspace for wiki & docs', badge: 'Daily', url: 'https://www.notion.so', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg' },
  { id: 'ct9', name: 'Canva', category: 'Graphic design & social layouts', badge: 'Free', url: 'https://www.canva.com', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
  { id: 'ct10', name: 'Blender', category: 'Open source 3D creation suite', badge: 'Open Source', url: 'https://www.blender.org', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg' },
  { id: 'ct11', name: 'Recraft AI', category: 'Generative vector art & icons', badge: 'Free', url: 'https://www.recraft.ai/?via=toools', logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69121485b4b3f85b96e3cc19_brain-ai.svg' },
  { id: 'ct12', name: 'Jitter', category: 'UI animation tool in the browser', badge: 'Plugin', url: 'https://jitter.video/?via=toools', logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/691215396e6cc06bef3a16f9_lightning.svg' },
]

// Trending Design Articles (Live WebP Thumbnails)
const TRENDING_POSTS = [
  {
    id: 'post1',
    title: 'Best MCP Servers for Designers: Connect Figma, Mobbin & Adobe to Claude',
    desc: 'Comprehensive breakdown on using Model Context Protocol to bridge design systems with AI.',
    readTime: '6 min read',
    author: 'Pascal Strasche',
    authorRole: 'Founder & Designer',
    image: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a4a20eed56fec789151d894_best-mcp-connectors-for-designers-s.webp',
    category: 'Artificial Intelligence',
    url: 'https://www.toools.design/blog-posts/best-mcp-servers-for-designers'
  },
  {
    id: 'post2',
    title: 'Best AI Courses for UI and UX Designers: Boost Your Career in 2026',
    desc: 'Master AI workflows, generative systems, and prompt engineering tailored for UX professionals.',
    readTime: '8 min read',
    author: 'Designlab Faculty',
    authorRole: 'Product Leadership',
    image: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/668eb6adecca65c8750f6753_best-ai-online-courses-for-ui-ux-designers-boost-your-career-thumb-small.webp',
    category: 'Knowledge',
    url: 'https://www.toools.design/blog-posts/ai-courses-ui-ux-designers'
  },
  {
    id: 'post3',
    title: '9 Best AI Tools for UI+UX Designers in 2026: Deep Dive Comparison',
    desc: 'Comparing the top generative engines for interface design, wireframing, and code export.',
    readTime: '7 min read',
    author: 'Elena Rostova',
    authorRole: 'Design Engineer',
    image: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a03bec196d35f05b3e1d952_best-ai-tools-ui-ux-designers-2026-thumb-small.webp',
    category: 'Artificial Intelligence',
    url: 'https://www.toools.design/blog-posts/best-ai-tools-ui-ux-designers-2026'
  }
]

// Curated Collections (Designer Toolkits with Live SVG Icons)
const COLLECTIONS = [
  { id: 'c1', title: 'UI Designers', items: '480+ tools', iconUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69cb98882f29095bf247f070_icon-ui-designers.svg', desc: 'Interface creation, components & vectors', url: 'https://www.toools.design/for/ui-designers' },
  { id: 'c2', title: 'UX Designers', items: '320+ tools', iconUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69cb98a81518c4384dbb46fc_icon-ux-designers.svg', desc: 'Wireframing, user flows & usability', url: 'https://www.toools.design/for/ux-designers' },
  { id: 'c3', title: 'Product Designers', items: '290+ tools', iconUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69cb988f5b2cab1a4a5e8f6c_icon-product-designers.svg', desc: 'Design systems, prototyping & metrics', url: 'https://www.toools.design/for/product-designers' },
  { id: 'c4', title: 'Web Designers', items: '410+ tools', iconUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/69cb98a148308217c3684e8f_icon-web-designers.svg', desc: 'No-code builders, responsive grids & tokens', url: 'https://www.toools.design/for/web-designers' },
]

export default function DesignPage({ onBack, onNavigateToAITools, onNavigateToDashboard, onAddLink }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set(['lr1', 'lr6', 'ai1']))
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [dbLinks, setDbLinks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const resourcesPerPage = 12

  // Fetch live links directly from MongoDB Database
  const fetchLiveLinks = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(API_URL)
      if (!res.ok) return
      const data = await res.json()
      if (Array.isArray(data)) {
        setDbLinks(data)
      }
    } catch (err) {
      console.error('Failed to fetch links for Design page:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveLinks()

    const handleUpdate = () => {
      fetchLiveLinks()
    }
    window.addEventListener('nexio_quick_assets_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)
    return () => {
      window.removeEventListener('nexio_quick_assets_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  // Calculate real-time live counts per category from MongoDB
  const categoryCounts = useMemo(() => {
    const counts = {}
    counts['all'] = dbLinks.length > 0 
      ? dbLinks.filter(item => matchCategory(item, 'all')).length 
      : LATEST_RESOURCES.filter(item => matchCategory(item, 'all')).length

    CATEGORIES.forEach(cat => {
      if (cat.id === 'all') return
      const matchingCount = dbLinks.filter(item => matchCategory(item, cat.id)).length
      counts[cat.id] = matchingCount
    })
    counts.saved = bookmarkedIds.size

    return counts
  }, [dbLinks, bookmarkedIds])

  // Combine live DB links with curated design resources
  const allResources = useMemo(() => {
    if (dbLinks.length === 0) return LATEST_RESOURCES

    const mappedDb = dbLinks.map((item, idx) => {
      const hostname = (() => {
        try {
          return new URL(item.url.startsWith('http') ? item.url : `https://${item.url}`).hostname.replace(/^www\./, '')
        } catch {
          return ''
        }
      })()

      const getFavicon = (url) => {
        try {
          const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname
          return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        } catch {
          return ''
        }
      }

      return {
        id: item.id || item._id || `db-${idx}`,
        title: item.title || hostname || 'Resource',
        desc: item.description || `Curated resource from ${hostname}`,
        category: item.category || 'General',
        rawItem: item,
        tag: item.category ? item.category.split(',')[0].trim() : 'Design',
        badge: item.badge || (item.favorite ? 'Favorited' : 'Verified'),
        pricing: item.badge || 'Free',
        url: item.url,
        logoUrl: item.logoUrl || '',
        bannerUrl: item.bannerUrl || '',
        imgUrl: item.logoUrl || item.bannerUrl || getFavicon(item.url),
      }
    })

    return mappedDb
  }, [dbLinks])

  // Filter resources based on active category & search query
  const filteredResources = useMemo(() => {
    return allResources.filter(item => {
      const isSaved = bookmarkedIds.has(item.id) || Boolean(item.rawItem?.favorite)
      const matchesCategory = selectedCategory === 'saved'
        ? isSaved
        : selectedCategory === 'all' ||
        matchCategory(item.rawItem || { category: item.category, title: item.title, description: item.desc, url: item.url }, selectedCategory)

      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.tag && item.tag.toLowerCase().includes(q)) ||
        (item.url && item.url.toLowerCase().includes(q))

      return matchesCategory && matchesSearch
    })
  }, [allResources, bookmarkedIds, selectedCategory, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [bookmarkedIds, selectedCategory, searchQuery])

  const totalPages = Math.ceil(filteredResources.length / resourcesPerPage)
  const paginatedResources = filteredResources.slice(
    (currentPage - 1) * resourcesPerPage,
    currentPage * resourcesPerPage
  )

  const toggleBookmark = (id) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setSubscribed(true)
      setEmailInput('')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#111827] font-sans antialiased">

      {/* Universal Common Header */}
      <Header
        currentView="design"
        onNavigate={(target) => {
          if (target === 'landing') onBack()
          else if (target === 'design') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else if (target === 'ai-tools') {
            if (onNavigateToAITools) onNavigateToAITools()
            else window.location.hash = '#ai-tools'
          } else if (target === 'app') {
            if (onNavigateToDashboard) onNavigateToDashboard()
            else window.location.hash = '#dashboard'
          }
        }}
        onAddLink={onAddLink}
      />

      {/* Background radial glow decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-purple-200/40 via-blue-100/30 to-transparent blur-3xl rounded-full" />
        <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-l from-rose-100/30 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-r from-teal-100/30 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28">

        <div className="flex flex-col">
          {/* CATEGORY FILTER PILLS GRID */}
          <div className="order-2 mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Browse by Category</h2>
              <span className="text-xs text-gray-400">Showing {filteredResources.length} curated tools</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
              {CATEGORIES.map(cat => {
                const IconComp = cat.icon
                const isActive = selectedCategory === cat.id
                const liveCount = categoryCounts[cat.id] !== undefined ? categoryCounts[cat.id] : 0
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center justify-between px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                      ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10 scale-[1.02]'
                      : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200/80 hover:border-gray-300 shadow-2xs'
                      }`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
                      <IconComp size={15} className={`shrink-0 ${isActive ? 'text-rose-400' : 'text-gray-500'}`} />
                      <span className="truncate text-[11px] sm:text-xs font-semibold">{cat.name}</span>
                    </div>
                    <span className={`text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${isActive ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'
                      }`}>
                      {liveCount}
                    </span>
                  </button>
                )
              })}

              <button
                type="button"
                onClick={() => setSelectedCategory('saved')}
                className={`flex items-center justify-between px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${selectedCategory === 'saved'
                  ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10 scale-[1.02]'
                  : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200/80 hover:border-gray-300 shadow-2xs'
                  }`}
              >
                <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
                  <Heart size={15} className={`shrink-0 ${selectedCategory === 'saved' ? 'text-rose-400 fill-rose-400' : 'text-gray-500'}`} />
                  <span className="truncate text-[11px] sm:text-xs font-semibold">Favorites</span>
                </div>
                <span className={`text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${selectedCategory === 'saved' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'
                  }`}>
                  {categoryCounts.saved || 0}
                </span>
              </button>
            </div>
          </div>

          {/* SECTION 1: FEATURED DESIGN TOOLS (Live Screen Banners & Live Logos) */}
          <div className="order-1 mb-10 sm:mb-14">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">Featured Design Tools</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {FEATURED_DESIGN_TOOLS.map(tool => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between block no-underline text-inherit"
                >
                  <div>
                    {/* Live Screen Banner */}
                    <div className="relative h-44 sm:h-[210px] w-full bg-gray-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-inner">
                      <img
                        src={tool.bannerUrl}
                        alt={tool.title}
                        className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
                        loading="eager"
                      />

                      {/* Live Circular Logo Badge */}
                      <div className="absolute -bottom-2 -right-2 translate-x-[-10px] translate-y-[-10px] sm:translate-x-[-14px] sm:translate-y-[-14px] w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg ring-3 sm:ring-4 ring-white z-20 flex items-center justify-center p-1.5 sm:p-2 overflow-hidden">
                        <img
                          src={tool.logoUrl}
                          alt={`${tool.title} Logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="pt-4 sm:pt-5 pb-1">
                      <h4 className="font-bold text-base sm:text-lg text-gray-950 mb-1 sm:mb-1.5 group-hover:text-indigo-600 transition-colors">
                        {tool.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-500 font-normal leading-relaxed line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: LATEST DESIGN RESOURCES (4x4 16 Cards Grid with Live Image Headers) */}
        <div className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Latest Design Resources</h2>
              <p className="text-xs text-gray-500">Regularly updated software, packs, plugins, and repositories</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">Filter:</span>
              <span className="text-xs font-bold bg-gray-900 text-white px-2.5 py-1 rounded-lg">
                {selectedCategory.toUpperCase()}
              </span>
            </div>
          </div>

          {filteredResources.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <p className="text-gray-500 font-medium text-sm">No resources found matching your search.</p>
              <button
                onClick={() => { setSelectedCategory('all'); setSearchQuery('') }}
                className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedResources.map(item => (
                <DesignResourceCard
                  key={item.id}
                  item={item}
                  isBookmarked={bookmarkedIds.has(item.id) || Boolean(item.rawItem?.favorite)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="flex items-center justify-center gap-1.5 mt-6" aria-label="Latest design resources pagination">
              <button
                type="button"
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-gray-300 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${currentPage === page
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="w-9 h-9 rounded-lg border border-gray-200 bg-white text-gray-600 flex items-center justify-center hover:border-gray-300 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </div>


        {/* SECTION 6: TRENDING ARTICLES & GUIDES (Live WebP Thumbnails) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Trending Reads & Guides</h2>
              <p className="text-xs text-gray-500">Insights from world-class product design leaders</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TRENDING_POSTS.map(post => (
              <a
                key={post.id}
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between block no-underline text-inherit"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-black/60 text-white text-[11px] font-semibold rounded-full backdrop-blur-sm">
                    {post.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium block mb-1">{post.readTime}</span>
                    <h3 className="font-bold text-gray-950 text-sm leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {post.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-xs">
                    <div>
                      <strong className="block text-gray-800 font-semibold">{post.author}</strong>
                      <span className="text-[11px] text-gray-400">{post.authorRole}</span>
                    </div>
                    <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                      Read <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* SECTION 8: CURATED COLLECTIONS (Live SVG Designer Toolkits) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Curated Collections</h2>
              <p className="text-xs text-gray-500">Role-specific toolkit directories</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLLECTIONS.map(col => (
              <a
                key={col.id}
                href={col.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 bg-white rounded-2xl border border-gray-200/80 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all group block no-underline text-inherit"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-2 mb-3 shadow-2xs">
                  <img src={col.iconUrl} alt={col.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors mb-0.5">
                  {col.title}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{col.desc}</p>
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {col.items}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* SECTION 9: NEWSLETTER CTA PILL */}
        <div className="mb-16 relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 border border-indigo-200/60 p-8 sm:p-12 text-center shadow-lg">
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider bg-white/80 px-3 py-1 rounded-full border border-indigo-200/60 inline-block mb-3">
              Weekly Resource Dispatch
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
              Join 5,000+ designers getting the latest tools, assets, and news in their inbox.
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              No spam, ever. Only the best curated Figma files, 3D icons, fonts and frontend components sent every Tuesday.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-full text-sm shadow-md animate-bounce">
                <Check size={18} />
                <span>You're in! Check your inbox for the starter asset kit.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your work email..."
                  className="w-full px-4 py-3 bg-white rounded-full text-sm border border-gray-300 focus:border-indigo-600 outline-none shadow-xs text-gray-900"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-black text-white font-bold text-sm rounded-full shadow-md transition-transform active:scale-95 shrink-0 cursor-pointer"
                >
                  Join Free
                </button>
              </form>
            )}
            <p className="text-[11px] text-gray-500 mt-3">Free forever. Unsubscribe with 1-click anytime.</p>
          </div>
        </div>

      </div>

      {/* SECTION 10: DARK RICH FOOTER */}
      <footer className="bg-[#0b0f19] text-gray-400 pt-14 pb-8 border-t border-gray-800">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">

            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 text-white font-extrabold text-xl mb-3 tracking-tight">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                  N
                </span>
                <span>NEXIO DESIGN</span>
              </div>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed mb-4">
                The modern directory for UI/UX designers, frontend engineers, and creative builders. Curated with precision.
              </p>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors cursor-pointer text-xs">𝕏</span>
                <span className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors cursor-pointer text-xs">GH</span>
                <span className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors cursor-pointer text-xs">DC</span>
                <span className="w-8 h-8 rounded-full bg-gray-800/80 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors cursor-pointer text-xs">IN</span>
              </div>
            </div>

            {/* Links Columns */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Categories</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#all" onClick={(e) => { e.preventDefault(); setSelectedCategory('3d') }} className="hover:text-white transition-colors">3D Illustrations</a></li>
                <li><a href="#all" onClick={(e) => { e.preventDefault(); setSelectedCategory('icons') }} className="hover:text-white transition-colors">Vector Icons</a></li>
                <li><a href="#all" onClick={(e) => { e.preventDefault(); setSelectedCategory('fonts') }} className="hover:text-white transition-colors">Typography</a></li>
                <li><a href="#all" onClick={(e) => { e.preventDefault(); setSelectedCategory('ai') }} className="hover:text-white transition-colors">AI Generative</a></li>
                <li><a href="#all" onClick={(e) => { e.preventDefault(); setSelectedCategory('uikits') }} className="hover:text-white transition-colors">Figma UI Kits</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Resources</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">Submit a Tool</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Advertise With Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Weekly Newsletter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API & Feed</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Company</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-white transition-colors">About Nexio</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Brand Guidelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Support</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
            <p>© {new Date().getFullYear()} Nexio Design Inc. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
              <span className="hover:text-gray-400 cursor-pointer">Terms</span>
              <span className="hover:text-gray-400 cursor-pointer">Security</span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="hover:text-white text-gray-400 cursor-pointer"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
