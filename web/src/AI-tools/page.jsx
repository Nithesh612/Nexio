import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import Pagination from '../components/Pagination'
import { API_URL, API_BASE_URL } from '../config/api'

import {
  ArrowLeft,
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
  Filter,
  Wand2,
  Code2,
  Video,
  Bot,
  X
} from 'lucide-react'

// Category Filters Data
const AI_CATEGORIES = [
  { id: 'all', name: 'All AI Tools', icon: LayoutGrid, count: '60+' },
  { id: 'ui-web', name: 'UI & Web Builders', icon: Monitor, count: '14' },
  { id: 'art-images', name: 'Image & Art Generation', icon: Wand2, count: '16' },
  { id: 'copy-llm', name: 'AI Copy & LLMs', icon: Bot, count: '10' },
  { id: '3d-motion', name: '3D & Motion AI', icon: Box, count: '12' },
  { id: 'color-brand', name: 'Color & Typography AI', icon: Palette, count: '8' },
  { id: 'workflow', name: 'Design Systems & Workflow', icon: Terminal, count: '10' }
]

// Top Featured Spotlight Tools
const FEATURED_AI_HERO = [
  {
    id: 'hermes-agent',
    title: 'Hermes Agent',
    desc: 'Research-driven AI agent for focused reasoning, analysis, and task execution.',
    url: 'https://hermes-agent.nousresearch.com/',
    logoUrl: 'https://www.google.com/s2/favicons?domain=nousresearch.com&sz=128',
    category: 'copy-llm',
    tag: 'AI Agent',
    pricing: 'FREE',
    isPartner: false
  },
  {
    id: 'openclaw',
    title: 'OpenClaw',
    desc: 'Open and flexible AI agent framework for building autonomous workflows.',
    url: 'https://openclaw.ai/',
    logoUrl: 'https://www.google.com/s2/favicons?domain=openclaw.ai&sz=128',
    category: 'workflow',
    tag: 'AI Agent',
    pricing: 'FREE',
    isPartner: false
  },
  {
    id: 'claude',
    title: 'Claude',
    desc: 'AI assistant for writing, coding, research, and high-context reasoning.',
    url: 'https://claude.ai/',
    logoUrl: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128',
    category: 'copy-llm',
    tag: 'LLM',
    pricing: 'FREEMIUM',
    isPartner: false
  }
]

// Comprehensive AI Tools Directory Database
const AI_TOOLS_DIRECTORY = [
  // UI & Web Builders
  {
    id: 'lovable',
    name: 'Lovable',
    desc: 'Create apps and websites by chatting with AI.',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: true,
    url: 'https://lovablelabs.pxf.io/4aoVMo',
    bannerType: 'lovable'
  },
  {
    id: 'bolt',
    name: 'Bolt',
    desc: 'Create stunning apps and websites by chatting with AI.',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://bolt.new/?ref=toools',
    bannerType: 'bolt'
  },
  {
    id: 'webflow-ai',
    name: 'Webflow AI',
    desc: "Build websites even faster with Webflow's new AI tools.",
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: true,
    url: 'https://try.webflow.com/via-toools',
    bannerType: 'webflow'
  },
  {
    id: 'framer-ai',
    name: 'Framer AI',
    desc: 'Design websites faster with intelligent tools.',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: true,
    url: 'https://framer.link/toools',
    bannerType: 'framer'
  },
  {
    id: 'v0',
    name: 'v0',
    desc: 'Generative UI system powered by AI from Vercel.',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://v0.dev/?via=toools',
    bannerType: 'v0'
  },
  {
    id: 'relume',
    name: 'Relume',
    desc: 'Generate sitemaps and wireframes with AI in seconds.',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://library.relume.io/?via=toools',
    bannerType: 'relume'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    desc: 'AI-powered code editor built for extraordinary productivity.',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.cursor.com/?via=toools',
    bannerType: 'cursor'
  },
  {
    id: 'figma-ai',
    name: 'Figma AI',
    desc: "Figma's built-in AI features for faster design workflows.",
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.figma.com/ai/?via=toools',
    bannerType: 'figma'
  },
  {
    id: 'uizard',
    name: 'Uizard',
    desc: 'Design wireframes, mockups, and prototypes in minutes with AI.',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://uizard.io/?via=toools',
    bannerType: 'uizard'
  },
  {
    id: 'dora-ai',
    name: 'Dora AI',
    desc: 'Generate 3D animated websites using one single prompt.',
    category: 'ui-web',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.dora.run/ai?via=toools',
    bannerType: 'dora'
  },

  // Image & Art Generation
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    desc: 'A suite of generative AI models and tools by Adobe.',
    category: 'art-images',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://www.adobe.com/products/firefly.html',
    bannerType: 'firefly'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    desc: 'AI-powered platform for creating stunning digital art.',
    category: 'art-images',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://www.midjourney.com/?via=toools',
    bannerType: 'midjourney'
  },
  {
    id: 'krea',
    name: 'Krea',
    desc: 'An easy way to generate images, video and sound with AI.',
    category: 'art-images',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.krea.ai/?via=toools',
    bannerType: 'krea'
  },
  {
    id: 'recraft',
    name: 'Recraft',
    desc: 'Generate consistent vector art, 3D and illustrations.',
    category: 'art-images',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.recraft.ai/?via=toools',
    bannerType: 'recraft'
  },
  {
    id: 'flux',
    name: 'Flux.1',
    desc: 'State-of-the-art open weights image generation model by Black Forest Labs.',
    category: 'art-images',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://blackforestlabs.ai/?via=toools',
    bannerType: 'flux'
  },
  {
    id: 'leonardo',
    name: 'Leonardo.ai',
    desc: 'Create production-quality visual assets for your creative projects.',
    category: 'art-images',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://leonardo.ai/?via=toools',
    bannerType: 'leonardo'
  },
  {
    id: 'ideogram',
    name: 'Ideogram',
    desc: 'Generative AI model with state of the art typography rendering.',
    category: 'art-images',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://ideogram.ai/?via=toools',
    bannerType: 'ideogram'
  },
  {
    id: 'magnific',
    name: 'Magnific AI',
    desc: 'The most advanced AI upscaler and enhancer in the world.',
    category: 'art-images',
    pricing: 'PAID',
    isPartner: false,
    url: 'https://magnific.ai/?via=toools',
    bannerType: 'magnific'
  },
  {
    id: 'photoroom',
    name: 'Photoroom',
    desc: 'Create studio-quality product pictures in seconds.',
    category: 'art-images',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.photoroom.com/?via=toools',
    bannerType: 'photoroom'
  },

  // AI Copy & LLMs
  {
    id: 'claude',
    name: 'Claude',
    desc: 'The AI for problem solvers.',
    category: 'copy-llm',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://claude.ai/?via=toools',
    bannerType: 'claude'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    desc: 'Get answers, find inspiration and be more productive.',
    category: 'copy-llm',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://chat.openai.com/?via=toools',
    bannerType: 'chatgpt'
  },
  {
    id: 'gemini',
    name: 'Gemini (Nano Banana)',
    desc: 'Unlock multimodal creativity for the next generation of visual apps.',
    category: 'copy-llm',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://gemini.google.com/?via=toools',
    bannerType: 'gemini'
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    desc: 'Where knowledge begins. An interactive conversational answer engine.',
    category: 'copy-llm',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.perplexity.ai/?via=toools',
    bannerType: 'perplexity'
  },
  {
    id: 'notion-ai',
    name: 'Notion AI',
    desc: 'Integrated AI assistant inside your workspace docs & notes.',
    category: 'copy-llm',
    pricing: 'PAID',
    isPartner: false,
    url: 'https://www.notion.so/product/ai?via=toools',
    bannerType: 'notion'
  },
  {
    id: 'jasper',
    name: 'Jasper',
    desc: 'AI copilot for enterprise marketing teams to produce on-brand content.',
    category: 'copy-llm',
    pricing: 'PAID',
    isPartner: false,
    url: 'https://www.jasper.ai/?via=toools',
    bannerType: 'jasper'
  },

  // 3D & Motion AI
  {
    id: 'spline-ai',
    name: 'Spline AI',
    desc: 'Generate objects, animations, and textures using prompts.',
    category: '3d-motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://spline.design/ai?via=toools',
    bannerType: 'spline'
  },
  {
    id: 'runway',
    name: 'Runway',
    desc: 'Advancing creativity with artificial intelligence (Gen-3 Alpha).',
    category: '3d-motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://runwayml.com/?via=toools',
    bannerType: 'runway'
  },
  {
    id: 'luma-dream',
    name: 'Luma Dream Machine',
    desc: 'A next-generation video model for creating realistic shots.',
    category: '3d-motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://lumalabs.ai/dream-machine?via=toools',
    bannerType: 'luma'
  },
  {
    id: 'pika',
    name: 'Pika',
    desc: 'An idea-to-video platform that sets your creativity in motion.',
    category: '3d-motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://pika.art/?via=toools',
    bannerType: 'pika'
  },
  {
    id: 'meshy',
    name: 'Meshy 3D',
    desc: 'Create 3D models from text prompts and images with AI in minutes.',
    category: '3d-motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.meshy.ai/?via=toools',
    bannerType: 'meshy'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    desc: 'Generative AI voice generator and realistic text to speech.',
    category: '3d-motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://elevenlabs.io/?via=toools',
    bannerType: 'elevenlabs'
  },

  // Color & Brand AI
  {
    id: 'khroma',
    name: 'Khroma',
    desc: 'The AI color tool for designers to discover & save infinite palettes.',
    category: 'color-brand',
    pricing: 'FREE',
    isPartner: false,
    url: 'https://www.khroma.co/?via=toools',
    bannerType: 'khroma'
  },
  {
    id: 'huemint',
    name: 'Huemint',
    desc: 'AI color palette generator for graphic design, UI and illustrations.',
    category: 'color-brand',
    pricing: 'FREE',
    isPartner: false,
    url: 'https://huemint.com/?via=toools',
    bannerType: 'huemint'
  },
  {
    id: 'fontjoy',
    name: 'Fontjoy',
    desc: 'Generate font combinations using deep learning algorithms.',
    category: 'color-brand',
    pricing: 'FREE',
    isPartner: false,
    url: 'https://fontjoy.com/?via=toools',
    bannerType: 'fontjoy'
  },
  {
    id: 'looka',
    name: 'Looka',
    desc: 'Design a logo and build a brand identity you love with AI.',
    category: 'color-brand',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://looka.com/?via=toools',
    bannerType: 'looka'
  },

  // Design Systems & Workflow
  {
    id: 'musho',
    name: 'Musho AI',
    desc: 'Figma plugin that turns your prompts into beautiful web designs.',
    category: 'workflow',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://musho.ai/?via=toools',
    bannerType: 'musho'
  },
  {
    id: 'visual-electric',
    name: 'Visual Electric',
    desc: 'An AI image generator designed specifically for creative artists.',
    category: 'workflow',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://visualelectric.com/?via=toools',
    bannerType: 'visualelectric'
  }
]

// Comprehensive Brand Presets & Logos for popular tools
const BRAND_PRESETS = {
  readymag: {
    title: 'Readymag',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a85732e62373e8fdd649f78_readymag-website-builder.gif',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a857854796820f3bb34f62e_logo-readymag.svg',
  },
  lovable: {
    title: 'Lovable',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb97_lovable-ai-thumb.webp',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb98_lovable-logo.png',
  },
  framer: {
    title: 'Framer',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    logoSvg: 'framer',
  },
  figma: {
    title: 'Figma',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    logoSvg: 'figma',
  },
  webflow: {
    title: 'Webflow',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
    logoSvg: 'webflow',
  },
  midjourney: {
    title: 'Midjourney',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128',
  },
  cursor: {
    title: 'Cursor',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128',
  },
  bolt: {
    title: 'Bolt',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=bolt.new&sz=128',
  }
};

function AIToolLiveBanner({ tool }) {
  const [screenshotError, setScreenshotError] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const cleanUrl = useMemo(() => {
    try {
      const raw = tool.url || ''
      const u = raw.startsWith('http') ? raw : `https://${raw}`
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
  const preset = BRAND_PRESETS[domainSlug] || null

  const primaryScreenshot = tool.bannerUrl || preset?.bannerUrl || `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`
  const secondaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600&h=380`
  const tertiaryScreenshot = `https://image.thum.io/get/width/600/crop/400/${cleanUrl}`

  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot)

  useEffect(() => {
    setCurrentScreenshot(primaryScreenshot)
    setScreenshotError(false)
  }, [primaryScreenshot])

  const clearbitLogo = `https://logo.clearbit.com/${hostname}`
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  const iconHorse = `https://icon.horse/icon/${hostname}`
  const logoSrc = tool.logoUrl || preset?.logoUrl || (!logoError ? clearbitLogo : googleFavicon)

  return (
    <div className="relative h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-gray-100 flex items-center justify-center group/banner">
      {!screenshotError ? (
        <img
          src={currentScreenshot}
          alt={`${tool.name} live screen`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
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
        <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white select-none">
          <span className="text-3xl sm:text-4xl font-black tracking-tight mb-1 text-white/90">
            {tool.name?.charAt(0) || '✦'}
          </span>
          <span className="text-[11px] font-semibold text-white/60 truncate max-w-[90%]">
            {hostname || tool.name}
          </span>
        </div>
      )}

      {/* Floating Partner / Tag Badge */}
      {tool.isPartner && (
        <span className="absolute top-2.5 left-2.5 text-[8px] sm:text-[8.5px] font-extrabold tracking-wider uppercase text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10 select-none">
          PARTNER
        </span>
      )}

      {/* Overlapping Logo Badge (Bottom Right) */}
      <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center p-1 z-10 overflow-hidden">
        {preset?.logoSvg === 'framer' ? (
          <div className="w-full h-full bg-black flex items-center justify-center rounded-full">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
              <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
            </svg>
          </div>
        ) : preset?.logoSvg === 'figma' ? (
          <div className="w-full h-full bg-white flex items-center justify-center rounded-full">
            <svg viewBox="0 0 38 57" className="w-3.5 h-5">
              <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
              <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
              <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
              <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
              <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
            </svg>
          </div>
        ) : (
          <img
            src={logoSrc}
            alt={`${tool.name} logo`}
            className="w-full h-full object-contain rounded-full"
            loading="lazy"
            onError={(e) => {
              if (logoSrc !== googleFavicon) {
                setLogoError(true)
              } else {
                e.currentTarget.src = iconHorse
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

function FeaturedHeroBanner({ item }) {
  const [screenshotError, setScreenshotError] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const cleanUrl = useMemo(() => {
    try {
      const raw = item.url || ''
      const u = raw.startsWith('http') ? raw : `https://${raw}`
      return new URL(u).href
    } catch {
      return item.url || ''
    }
  }, [item.url])

  const hostname = useMemo(() => {
    try {
      return new URL(cleanUrl).hostname.replace(/^www\./, '')
    } catch {
      return ''
    }
  }, [cleanUrl])

  const domainSlug = hostname.split('.')[0]?.toLowerCase()
  const preset = BRAND_PRESETS[domainSlug] || null

  const primaryScreenshot = (item.bannerUrl && !item.bannerUrl.includes('unsplash.com'))
    ? item.bannerUrl
    : (preset?.bannerUrl || `https://image.thum.io/get/width/800/crop/500/${cleanUrl}`)
  const secondaryScreenshot = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`
  const tertiaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=800&h=500`

  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot)

  useEffect(() => {
    setCurrentScreenshot(primaryScreenshot)
    setScreenshotError(false)
  }, [primaryScreenshot])

  const clearbitLogo = `https://logo.clearbit.com/${hostname}`
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  const logoSrc = item.logoUrl || preset?.logoUrl || (!logoError ? clearbitLogo : googleFavicon)

  return (
    <div className="relative h-44 sm:h-52 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 mb-3 sm:mb-4 border border-gray-100 flex items-center justify-center group/hero">
      {!screenshotError ? (
        <img
          src={currentScreenshot}
          alt={item.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
        <div className="flex flex-col items-center justify-center w-full h-full p-4 text-white select-none">
          <span className="text-4xl font-black mb-1">{item.title?.charAt(0) || '✦'}</span>
          <span className="text-xs font-semibold text-white/60">{item.title}</span>
        </div>
      )}

      {item.isPartner && (
        <span className="absolute bottom-2 sm:bottom-2.5 right-2.5 sm:right-3 text-[8.5px] sm:text-[9px] font-extrabold tracking-wider uppercase text-white/90 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
          PARTNER*
        </span>
      )}
    </div>
  )
}

export default function AIToolsPage({ onBackToHome, onNavigateToDesign, onNavigateToSkills, onNavigateToEditing, onNavigateToDashboard, onAddLink, user, onLogin, onLogout }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPricing, setSelectedPricing] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12 // 3 rows on lg screens (4 columns)
  const [dbLinks, setDbLinks] = useState([])
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('nexio_ai_favorites')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // Fetch live bookmarks from backend
  const fetchDbLinks = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai-tools`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setDbLinks(data)
        }
      }
    } catch (err) {
      console.error('Failed to fetch live AI tools:', err)
    }
  }

  useEffect(() => {
    fetchDbLinks()

    const handleUpdate = () => {
      fetchDbLinks()
    }

    window.addEventListener('nexio_ai_tools_updated', handleUpdate)
    return () => {
      window.removeEventListener('nexio_ai_tools_updated', handleUpdate)
    }
  }, [])

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem('nexio_ai_favorites', JSON.stringify(next))
      } catch { }
      return next
    })
  }

  // The AI Tools page is backed by the API collection or fallback directory.
  const combinedTools = useMemo(() => {
    const list = dbLinks && dbLinks.length > 0 ? dbLinks : AI_TOOLS_DIRECTORY
    return list.map(tool => ({
      ...tool,
      category: tool.category || 'ui-web', // Default category if not present
      id: tool.toolId || tool._id || tool.id
    }))
  }, [dbLinks])

  // Filter tools based on search, category and pricing
  const filteredTools = useMemo(() => {
    return combinedTools.filter(tool => {
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
      const matchesPricing = selectedPricing === 'all' || tool.pricing.toLowerCase().includes(selectedPricing.toLowerCase())
      const matchesSearch = !searchQuery.trim() ||
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.desc.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesPricing && matchesSearch
    })
  }, [combinedTools, selectedCategory, selectedPricing, searchQuery])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, selectedPricing, searchQuery])

  // Paginate tools
  const paginatedTools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredTools.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredTools, currentPage])

  const totalPages = Math.ceil(filteredTools.length / itemsPerPage)

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#111827] font-sans antialiased flex flex-col justify-between">

      {/* Universal Common Header */}
      <Header
        currentView="ai-tools"
        onNavigate={(target) => {
          if (target === 'landing') onBackToHome()
          else if (target === 'design') onNavigateToDesign()
          else if (target === 'skills') {
            if (onNavigateToSkills) onNavigateToSkills()
            else window.location.hash = '#skills'
          }
          else if (target === 'editing') {
            if (onNavigateToEditing) onNavigateToEditing()
            else window.location.hash = '#editing'
          }
          else if (target === 'ai-tools') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else if (target === 'app') {
            if (onNavigateToDashboard) onNavigateToDashboard()
            else window.location.hash = '#dashboard'
          }
        }}
        onAddLink={onAddLink}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      {/* Main Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-16 sm:pb-20 flex-1 w-full">

        {/* Featured Live Screen Banners Showcase */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="mb-10 sm:mb-14">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-sm sm:text-base font-black text-blue-600 tracking-tight flex items-center gap-2">
                <Flame className="text-orange-500" size={18} />
                <span>Featured AI Tools</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {FEATURED_AI_HERO.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-gray-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group block no-underline text-inherit"
                >
                  <div>
                    <FeaturedHeroBanner item={item} />

                    <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden p-0.5 flex-shrink-0 shadow-xs">
                        <img
                          src={item.logoUrl || `https://www.google.com/s2/favicons?domain=${(() => {
                            try { return new URL(item.url).hostname } catch { return '' }
                          })()}&sz=128`}
                          alt={item.title}
                          className="w-full h-full object-contain rounded-md"
                          loading="lazy"
                          onError={(e) => {
                            try {
                              const host = new URL(item.url).hostname;
                              e.currentTarget.src = `https://www.google.com/s2/favicons?domain=${host}&sz=128`;
                            } catch {}
                          }}
                        />
                      </div>
                      <h3 className="font-extrabold text-base sm:text-lg text-gray-950 group-hover:text-indigo-600 transition-colors truncate">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-[13.5px] text-gray-500 font-normal leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-5 pt-3 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#fef9c3] text-[#854d0e] rounded-md tracking-wider uppercase">
                      {item.pricing}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Visit Tool <ArrowUpRight size={13} />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Sleek Search & Filter Toolbar */}
        <section className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Modern Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-3.5 text-gray-400 pointer-events-none" size={16} />
              <input
                type="text"
                placeholder={`Search ${combinedTools.length}+ AI tools by name, tag, or description...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 sm:h-11 pl-10 pr-9 bg-white border border-gray-200/80 rounded-full text-xs sm:text-[13px] text-gray-900 placeholder:text-gray-400 shadow-[0_2px_8px_rgba(0,0,0,0.02)] focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Sleek Segmented Pricing Pill Control */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="inline-flex items-center p-1 bg-gray-100/90 rounded-full border border-gray-200/60 shadow-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'freemium', label: 'Freemium' },
                { id: 'free', label: 'Free' },
                { id: 'paid', label: 'Paid' },
              ].map((p) => {
                const isActive = selectedPricing === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPricing(p.id)}
                    className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-[11.5px] font-semibold tracking-wide transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white text-gray-950 shadow-xs scale-[1.02]'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {p.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* CATEGORY FILTER PILLS GRID (Matching Design Page) */}
        <section className="mb-10 sm:mb-12">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Browse by Category</h2>
            <span className="text-xs text-gray-400">Showing {filteredTools.length} curated AI tools</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
            {AI_CATEGORIES.map((cat) => {
              const IconComp = cat.icon
              const isActive = selectedCategory === cat.id
              const liveCount = cat.id === 'all'
                ? combinedTools.length
                : combinedTools.filter(t => t.category === cat.id).length

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center justify-between px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-md shadow-gray-900/10 scale-[1.02]'
                      : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-200/80 hover:border-gray-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate min-w-0">
                    <IconComp size={15} className={`shrink-0 ${isActive ? 'text-rose-400' : 'text-gray-500'}`} />
                    <span className="truncate text-[11px] sm:text-xs font-semibold">{cat.name}</span>
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-mono px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                    isActive ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {liveCount}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* All Tools Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-gray-950 tracking-tight">
              {selectedCategory === 'all' ? 'AI Tools' : AI_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-xs font-semibold text-gray-500">
              Showing {filteredTools.length} tools
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-xs">
              <img src="/assets/empty/no-results.svg" alt="No tools found" className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-4" />
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">No AI tools found</h3>
              <p className="text-xs sm:text-sm text-gray-500">Try adjusting your search keywords or clear filters.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedPricing('all'); }}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
                {paginatedTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={(e) => {
                      if (e.target.closest('button')) return;
                      const targetUrl = tool.url.startsWith('http') ? tool.url : `https://${tool.url}`;
                      window.open(targetUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between block no-underline text-inherit group relative cursor-pointer"
                  >
                    <div>
                      {/* Live Graphic Banner */}
                      <div className="mb-3 sm:mb-4">
                        <AIToolLiveBanner tool={tool} />
                      </div>

                      {/* Title & Description */}
                      <div className="mb-1">
                        <h3 className="font-bold text-base sm:text-[17px] text-gray-950 truncate group-hover:text-indigo-600 transition-colors">
                          {tool.name}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-[13px] text-gray-500 font-normal leading-relaxed line-clamp-2">
                        {tool.desc}
                      </p>
                    </div>

                    {/* Pricing Tag & Bookmark */}
                    <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-gray-50 flex items-center justify-between">
                      <button
                        onClick={(e) => toggleFavorite(tool.id, e)}
                        className={`p-1.5 rounded-full transition-colors cursor-pointer ${favorites[tool.id] ? 'text-rose-500 bg-rose-50' : 'text-gray-400 hover:text-rose-500 hover:bg-gray-50'
                          }`}
                        aria-label="Bookmark"
                      >
                        <Heart size={15} className={favorites[tool.id] ? 'fill-rose-500' : ''} />
                      </button>

                      <span className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 bg-[#fef9c3] text-[#854d0e] rounded-md tracking-wider uppercase">
                        {tool.pricing}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unified Pagination Controls */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                scrollToTop={true}
              />
            </>
          )}
        </section>

        {/* Weekly Newsletter Dispatch */}
        <NewsletterSection />

      </main>

      {/* Common Dark Footer */}
      <Footer
        onNavigate={(target) => {
          if (target === 'landing') onBackToHome()
          else if (target === 'design') onNavigateToDesign()
          else if (target === 'skills') {
            if (onNavigateToSkills) onNavigateToSkills()
            else window.location.hash = '#skills'
          }
          else if (target === 'editing') {
            if (onNavigateToEditing) onNavigateToEditing()
            else window.location.hash = '#editing'
          }
          else if (target === 'app') onNavigateToDashboard()
          else window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

    </div>
  )
}
