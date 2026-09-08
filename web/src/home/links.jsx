import React, { useState, useEffect } from 'react';
import LottieAnimation from './LottieAnimation';
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json';
import {
  Layers,
  Palette,
  Video,
  Sparkles,
  Bot,
  Folder,
  Image as ImageIcon,
  Camera,
  Server,
  Globe,
  FileText,
  FlaskConical,
  Wrench,
  Bookmark,
  Compass,
  LayoutGrid,
  Edit2,
  Trash2
} from 'lucide-react';
import { API_URL } from '../config/api';
import EditLinkModal from '../components/EditLinkModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import './links.css';

function GoogleIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

// Category tab metadata
const tabMeta = {
  all:               { title: 'All Links',          description: 'Browse all your saved links across every category.' },
  saved:             { title: 'Saved',              description: 'Links you have saved for later.' },
  'ui/ux':           { title: 'UI/UX',              description: 'Design tools, UI kits, and resources for designers.' },
  'ai-image-video':  { title: 'AI Image & Video',   description: 'Cutting-edge AI image generators and video creation platforms.' },
  ai:                { title: 'AI',                 description: 'Powerful AI assistants, LLMs, and intelligent workflow tools.' },
  other:             { title: 'Other',              description: 'Miscellaneous links and general bookmarks.' },
  inspiration:       { title: 'Inspiration',        description: 'Visual inspiration and creative references for your next project.' },
  wallpaper:         { title: 'Wallpaper',          description: 'High resolution desktop and mobile wallpapers.' },
  stock:             { title: 'Stock',              description: 'Curated stock photos, vectors, 3D assets, and media.' },
  google:            { title: 'Google',             description: 'Official developer tools, APIs, design systems, and AI models from Google.' },
  host:              { title: 'Host',               description: 'Hosting services, cloud providers, and deployment platforms.' },
  article:           { title: 'Article',            description: 'Interesting articles, tutorials, and long-form essays.' },
  research:          { title: 'Research',           description: 'Research papers, benchmarks, datasets, and case studies.' },
  tools:             { title: 'Google',             description: 'Official developer tools, APIs, design systems, and AI models from Google.' },
};

// Gradient palette per category
const categoryColors = {
  'UI/UX':             ['#667eea', '#764ba2'],
  'AI Image & Video':  ['#f093fb', '#f5576c'],
  'AI':                ['#a855f7', '#6366f1'],
  'Other':             ['#64748b', '#475569'],
  'Inspiration':       ['#fa709a', '#fee140'],
  'Wallpaper':         ['#38ef7d', '#11998e'],
  'Stock':             ['#ff9a9e', '#fecfef'],
  'Google':            ['#4285F4', '#34A853'],
  'Host':              ['#2af598', '#009efd'],
  'Article':           ['#f6d365', '#fda085'],
  'Research':          ['#96fbc4', '#f9f586'],
  'Tools':             ['#4285F4', '#34A853'],
  'default':           ['#a18cd1', '#fbc2eb'],
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

function LinkCard({ item, onEdit, onDelete }) {
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

  // Live website screenshot banner
  const primaryScreenshot = item.bannerUrl || (preset ? preset.bannerUrl : `https://image.thum.io/get/width/600/crop/400/${cleanUrl}`);
  const secondaryScreenshot = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  const tertiaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600&h=380`;
  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot);

  // Logos: Preset logo, Clearbit, or Google Favicon
  const clearbitLogo = `https://logo.clearbit.com/${hostname}`;
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  const logoSrc = item.logoUrl || preset?.logoUrl || (!logoError ? clearbitLogo : googleFavicon);

  // Fallback banner colors
  const colors = categoryColors[item.category] || categoryColors['default'];

  // Readymag special banner fallback if image fails
  const isReadymag = domainSlug === 'readymag' || item.title?.toLowerCase().includes('readymag');

  const handleCardClick = (e) => {
    if (e.target.closest('button')) return;
    window.open(cleanUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div onClick={handleCardClick} className="link-card group relative cursor-pointer">
      {/* Top Banner with Rounded Inner Frame */}
      <div className="link-card-banner-wrapper">
        <div
          className="link-card-banner"
          style={{
            background: isReadymag 
              ? '#ff69b4' 
              : `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          }}
        >
          {isReadymag ? (
            <div className="readymag-custom-banner">
              <svg viewBox="0 0 400 240" className="readymag-hand-svg" fill="none" preserveAspectRatio="xMidYMid meet">
                <path
                  d="M190 240 C170 210, 150 170, 145 130 C140 95, 155 75, 168 80 C180 85, 185 110, 192 135 C195 90, 205 60, 220 62 C235 64, 235 95, 235 125 C242 85, 255 70, 270 75 C285 80, 280 115, 275 145 C285 120, 305 115, 318 128 C332 142, 315 180, 285 215 C260 240, 220 240, 190 240 Z"
                  fill="rgba(255, 255, 255, 0.9)"
                />
              </svg>
              <div className="readymag-banner-text">
                Design powered<br />by humans.
              </div>
            </div>
          ) : !screenshotError ? (
            <img
              src={currentScreenshot}
              alt={`${item.title} live banner`}
              className="link-card-screenshot"
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
            <div className="link-banner-fallback-graphic">
              <span className="link-banner-fallback-letter">
                {item.title?.charAt(0) || '✦'}
              </span>
            </div>
          )}

          {/* Category Pill Tag */}
          <span className="link-category-pill">{getSmartTag(item)}</span>
        </div>

        {/* Circular Live Logo Badge Overlapping Bottom Right */}
        <div className="link-card-logo-badge">
          {isReadymag ? (
            <div className="readymag-logo-circle">
              <span className="rm-r">R</span>
              <span className="rm-slash">/</span>
              <span className="rm-m">m</span>
            </div>
          ) : preset?.logoSvg === 'framer' ? (
            <div className="preset-logo-black">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
              </svg>
            </div>
          ) : preset?.logoSvg === 'figma' ? (
            <div className="preset-logo-white">
              <svg viewBox="0 0 38 57" className="w-5 h-7">
                <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
                <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
                <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
                <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
                <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
              </svg>
            </div>
          ) : preset?.logoSvg === 'webflow' ? (
            <div className="preset-logo-black">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
              </svg>
            </div>
          ) : (
            <img
              src={logoSrc}
              alt={`${item.title} logo`}
              className="link-badge-img"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
      </div>

      {/* Card Body matching the screenshot layout */}
      <div className="link-card-body">
        <h3 className="link-card-name">{item.title}</h3>
        <p className="link-card-desc">
          {item.desc || `Curated ${item.category || 'design'} tool and resource for creators.`}
        </p>

        {/* Bottom Tag & Pricing Pill Row */}
        <div className="link-card-footer">
          <span className="link-tag-pill">
            {getSmartTag(item)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`link-pricing-pill ${getPricingClass(getSmartPricing(item))}`}>
              {getSmartPricing(item)}
            </span>
            {onEdit && onDelete && (
              <div className="link-card-actions" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  title="Edit link"
                  aria-label={`Edit ${item.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#eff6ff',
                    color: '#2563eb',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Edit2 size={12} />
                </button>
                <button
                  type="button"
                  title="Delete link"
                  aria-label={`Delete ${item.title}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(item);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px 6px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#fef2f2',
                    color: '#ef4444',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Smart Tag Analyzer: Converts domain, title, and description into accurate 1-2 word tags (Never generic 'Saved' or 'Other')
function getSmartTag(item) {
  if (item.tag && !['saved', 'other', 'all', 'all links', 'inbox'].includes(item.tag.toLowerCase().trim())) {
    return item.tag;
  }

  const title = (item.title || '').toLowerCase();
  const desc = (item.desc || item.description || '').toLowerCase();
  const url = (item.url || '').toLowerCase();
  const cat = (item.category || '').toLowerCase();

  // 1. Direct domain and brand mapping
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

  // 2. Content & Keyword semantics
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
  if (title.includes('podcast') || desc.includes('podcast')) return 'Podcast';
  if (title.includes('book') || desc.includes('reading')) return 'Book';
  if (title.includes('article') || desc.includes('article') || desc.includes('essay')) return 'Article';

  // 3. Fallback on clean category if not generic
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

// Pricing style class helper matching user uploaded screenshots
function getPricingClass(pricing = '') {
  const p = pricing.toUpperCase().trim();
  if (p.includes('TRIAL')) return 'pricing-free-trial';
  if (p.includes('FREE + PAID') || p.includes('FREE+PAID')) return 'pricing-free-paid';
  if (p === 'PAID') return 'pricing-paid';
  if (p === 'FREE') return 'pricing-free';
  return 'pricing-freemium';
}

const CURATED_DEFAULT_LINKS = [
  {
    id: 'curated-readymag',
    title: 'Readymag',
    desc: 'Create all kinds of websites with flexibility and complete creative freedom.',
    url: 'https://readymag.com/?utm_source=toools&utm_medium=partnership_website&utm_campaign=main',
    category: 'UI/UX',
    collection: 'All Links',
    tag: 'Web Builder',
    pricing: 'FREEMIUM',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a85732e62373e8fdd649f78_readymag-website-builder.gif',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a857854796820f3bb34f62e_logo-readymag.svg'
  },
  {
    id: 'curated-lovable',
    title: 'Lovable',
    desc: 'Generate full-stack software, web apps and tools with autonomous AI engineer.',
    url: 'https://lovable.dev',
    category: 'AI',
    collection: 'All Links',
    tag: 'Graphic AI',
    pricing: 'FREE TRIAL',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb97_lovable-ai-thumb.webp',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb98_lovable-logo.png'
  },
  {
    id: 'curated-framer',
    title: 'Framer',
    desc: 'Design and publish web sites at lightning speed with AI and no-code tools.',
    url: 'https://framer.com',
    category: 'UI/UX',
    collection: 'All Links',
    tag: 'Site Builder',
    pricing: 'FREEMIUM',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'curated-figma',
    title: 'Figma',
    desc: 'The leading collaborative interface design tool for modern product teams.',
    url: 'https://figma.com',
    category: 'UI/UX',
    collection: 'All Links',
    tag: 'UI/UX Design',
    pricing: 'FREE + PAID',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'curated-webflow',
    title: 'Webflow',
    desc: 'Build production-ready responsive websites visually with total code power.',
    url: 'https://webflow.com',
    category: 'UI/UX',
    collection: 'All Links',
    tag: 'Visual Dev',
    pricing: 'FREEMIUM',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'curated-midjourney',
    title: 'Midjourney',
    desc: 'Generative artificial intelligence program generating stunning visuals from prompts.',
    url: 'https://midjourney.com',
    category: 'AI Image & Video',
    collection: 'All Links',
    tag: 'Graphic AI',
    pricing: 'PAID',
    bannerUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'curated-cursor',
    title: 'Cursor AI',
    desc: 'Built to make you extraordinarily productive, Cursor is the AI-first Code Editor.',
    url: 'https://cursor.com',
    category: 'Tools',
    collection: 'All Links',
    tag: 'Code Editor',
    pricing: 'FREE TRIAL',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'curated-spline',
    title: 'Spline 3D',
    desc: 'Design and collaborate on 3D interactive web experiences in real time.',
    url: 'https://spline.design',
    category: 'Inspiration',
    collection: 'All Links',
    tag: '3D & Motion',
    pricing: 'FREEMIUM',
    bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop'
  }
];

export default function LinksSection({ savedLinks = [], onAddLink }) {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4 columns × 3 rows = 12 items per page

  const tabs = [
    { id: 'all',              label: 'All Links',         icon: Layers,       categoryVal: 'all' },
    { id: 'ai',               label: 'AI Tools',          icon: Bot,          categoryVal: 'AI Tools' },
    { id: 'saved',            label: 'Saved',             icon: Bookmark,     categoryVal: 'saved' },
    { id: 'ui/ux',            label: 'UI/UX',             icon: LayoutGrid,   categoryVal: 'UI/UX' },
    { id: 'ai-image-video',   label: 'AI Image & Video',  icon: Video,        categoryVal: 'AI Image & Video' },
    { id: 'inspiration',      label: 'Inspiration',       icon: Compass,      categoryVal: 'Inspiration' },
    { id: 'wallpaper',        label: 'Wallpaper',         icon: ImageIcon,    categoryVal: 'Wallpaper' },
    { id: 'stock',            label: 'Stock',             icon: Camera,       categoryVal: 'Stock' },
    { id: 'google',           label: 'Google',            icon: GoogleIcon,   categoryVal: 'Google' },
    { id: 'research',         label: 'Research',          icon: FlaskConical, categoryVal: 'Research' },
    { id: 'other',            label: 'Other',             icon: Folder,       categoryVal: 'Other' },
  ];

  const meta = tabMeta[activeTab] || tabMeta.all;

  const [localLinks, setLocalLinks] = useState(savedLinks);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setLocalLinks(savedLinks);
  }, [savedLinks]);

  // Combine DB links with curated default links
  const userMappedLinks = (localLinks && localLinks.length > 0 ? localLinks : savedLinks).map(link => ({
    id: link.id || link._id,
    title: link.title,
    desc: link.description || link.desc || '',
    url: link.url,
    category: link.type || link.category || 'Other',
    collection: link.collection || 'All Links',
    bannerUrl: link.bannerUrl,
    logoUrl: link.logoUrl,
    badge: link.badge || '',
    favorite: Boolean(link.favorite),
    readLater: Boolean(link.readLater)
  }));

  const mappedLinks = userMappedLinks.length > 0 ? userMappedLinks : CURATED_DEFAULT_LINKS;

  // Selected tab configuration
  const currentTabConfig = tabs.find(t => t.id === activeTab);

  // Filter by active tab (supports single category or multiple comma-separated categories)
  const filteredItems = activeTab === 'all'
    ? mappedLinks
    : activeTab === 'saved'
      ? mappedLinks.filter(link => {
          const cat = (link.category || '').toLowerCase().trim();
          const col = (link.collection || '').toLowerCase().trim();
          return cat === 'saved' || col === 'saved';
        })
      : activeTab === 'google'
        ? mappedLinks.filter(link => {
            const cat = (link.category || '').toLowerCase().trim();
            const url = (link.url || '').toLowerCase().trim();
            const title = (link.title || '').toLowerCase().trim();
            return cat.includes('google') || url.includes('google.com') || url.includes('firebase') || url.includes('kaggle') || url.includes('material.io') || title.includes('google');
          })
        : mappedLinks.filter((link) => {
            if (!currentTabConfig) return true;
            const targetCategory = currentTabConfig.categoryVal.toLowerCase();
            const linkCat = (link.category || '').toLowerCase().trim();
            
            // Match exact or inside comma-separated list
            const categoriesList = linkCat.split(',').map(c => c.trim());
            return categoriesList.includes(targetCategory) || linkCat === targetCategory;
          });

  // Pagination for 3 rows x 4 columns (12 items per page)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handleSaveEdit = async (updatedItem) => {
    setIsSubmitting(true);
    try {
      const editId = updatedItem.id || updatedItem._id;
      const isFallbackId = !editId || String(editId).startsWith('ct') || String(editId).startsWith('preset-') || String(editId).startsWith('live-');

      const payload = {
        title: updatedItem.title.trim(),
        url: updatedItem.url.trim(),
        category: updatedItem.category?.trim() || 'General',
        description: (updatedItem.description || '').trim(),
        collection: updatedItem.collection || 'All Links',
        badge: updatedItem.badge || '',
        bannerUrl: updatedItem.bannerUrl || '',
        logoUrl: updatedItem.logoUrl || '',
        favorite: Boolean(updatedItem.favorite),
        readLater: Boolean(updatedItem.readLater)
      };

      if (!isFallbackId) {
        await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      setLocalLinks((prev) =>
        prev.map((item) =>
          (item.id === editId || item._id === editId || item.url === updatedItem.url)
            ? { ...item, ...payload }
            : item
        )
      );

      setItemToEdit(null);
      window.dispatchEvent(new CustomEvent('nexio_quick_assets_updated'));
    } catch (err) {
      console.error('Failed to edit link:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const deleteId = itemToDelete.id || itemToDelete._id;
      const deleteUrl = itemToDelete.url;
      const isFallbackId = !deleteId || String(deleteId).startsWith('ct') || String(deleteId).startsWith('preset-') || String(deleteId).startsWith('live-');

      if (!isFallbackId) {
        await fetch(`${API_URL}/${deleteId}`, { method: 'DELETE' });
      }

      try {
        const raw = localStorage.getItem('nexio_deleted_quick_assets');
        const list = raw ? JSON.parse(raw) : [];
        if (deleteId && !list.includes(String(deleteId))) list.push(String(deleteId));
        if (deleteUrl && !list.includes(String(deleteUrl))) list.push(String(deleteUrl));
        localStorage.setItem('nexio_deleted_quick_assets', JSON.stringify(list));
      } catch {}

      setLocalLinks((prev) => prev.filter((item) => (item.id || item._id) !== deleteId && item.url !== deleteUrl));
      setItemToDelete(null);
      window.dispatchEvent(new CustomEvent('nexio_quick_assets_updated'));
    } catch (err) {
      console.error('Failed to delete link:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="links-section" id="use-cases">
      <div className="links-container">

        {/* Left Sidebar */}
        <div className="links-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="links-content">
          <div className="links-header">
            <h2>{meta.title}</h2>
            <p>{meta.description}</p>
          </div>

          <div className="links-grid">
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((item) => (
                <LinkCard
                  key={item.id}
                  item={item}
                  onEdit={(it) => setItemToEdit(it)}
                  onDelete={(it) => setItemToDelete(it)}
                />
              ))
            ) : (
              <div className="empty-links-state">
                <div className="empty-links-lottie">
                  <img
                    src="/assets/empty/pixeltrue-website-ranking-improvement-by-collaborative-seo-strategy.svg"
                    alt="No links saved"
                    style={{ width: '220px', height: '170px', objectFit: 'contain' }}
                  />
                </div>
                <h3 className="empty-links-title">No links saved in {meta.title}</h3>
                <p className="empty-links-subtitle">
                  Keep your favorite articles, tools, and inspirations organized in one place.
                </p>
                {onAddLink && (
                  <button type="button" className="empty-links-add-btn" onClick={onAddLink}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span>Add Link</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Pagination — 4 columns x 3 rows = 12 items per page */}
          {totalPages > 1 && (
            <div className="links-pagination">
              {/* Prev */}
              <button
                type="button"
                className="links-nav-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                <span>Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="links-page-numbers">
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    className={`links-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                type="button"
                className="links-nav-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Edit Link Modal with Multi-Category Support */}
      <EditLinkModal
        isOpen={Boolean(itemToEdit)}
        item={itemToEdit}
        onClose={() => setItemToEdit(null)}
        onSave={handleSaveEdit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(itemToDelete)}
        title="Delete Link"
        itemName={itemToDelete?.title}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </section>
  );
}
