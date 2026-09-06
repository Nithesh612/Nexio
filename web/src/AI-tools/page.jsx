import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import { API_URL } from '../config/api'

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
  Bot
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
    id: 'readymag',
    title: 'Readymag',
    desc: 'Create all kinds of websites with flexibility and complete creative freedom.',
    url: 'https://readymag.com/?utm_source=toools&utm_medium=partnership_website&utm_campaign=main',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a85732e62373e8fdd649f78_readymag-website-builder.gif',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a857854796820f3bb34f62e_logo-readymag.svg',
    category: 'ui-web',
    tag: 'Web Builder',
    pricing: 'Freemium',
    isPartner: true
  },
  {
    id: 'designlab',
    title: 'AI Product Design Certification',
    desc: 'A new AI certification from Designlab where you learn from practitioners at VP and Principal level.',
    url: 'https://designlab.com/advanced/ai-product-design-certification?discount=AI$200&irclickid=SZRzXDWvcxyZRytSIpXgH18mUkr2Q2yYO3u2zE0&irgwc=1&afsrc=1&utm_content=3704448&utm_campaign=%22Affiliates%22&utm_source=impact&utm_medium=affiliate',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a7df979a29a8d282393119e_ai-product-design-course-designlab-a.gif',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a7df5c45121ae9788dc3bea_logo-designlab.svg',
    category: 'workflow',
    tag: 'Learning',
    pricing: 'Paid',
    isPartner: true
  },
  {
    id: 'mobbin-mcp',
    title: 'Mobbin MCP',
    desc: 'Mobbin MCP connects your AI agents to 600,000+ real product screens.',
    url: 'https://mobbin.com/mcp?via=toools',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a38fe7685c2bc351f24dc21_mobbin-mcp-connectors.webp',
    logoUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/6a38fd1bfbf903a6ea1b8fae_icon-mobbin.svg',
    category: 'workflow',
    tag: 'AI Tools',
    pricing: 'Paid',
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

export default function AIToolsPage({ onBackToHome, onNavigateToDesign, onNavigateToDashboard, onAddLink }) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPricing, setSelectedPricing] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
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
  useEffect(() => {
    const fetchDbLinks = async () => {
      try {
        const res = await fetch(API_URL)
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
    fetchDbLinks()
  }, [])

  const toggleFavorite = (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem('nexio_ai_favorites', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  // Combine live database AI bookmarks with static directory
  const combinedTools = useMemo(() => {
    const aiDbItems = dbLinks
      .filter(item => {
        const cat = (item.category || '').toLowerCase()
        const col = (item.collection || '').toLowerCase()
        const title = (item.title || '').toLowerCase()
        return cat.includes('ai') || col.includes('ai') || title.includes('ai') || cat.includes('bot') || cat.includes('model')
      })
      .map((item, idx) => ({
        id: item.id || item._id || `db-ai-${idx}`,
        name: item.title,
        desc: item.description || `AI-powered creative tool and intelligent model.`,
        category: (item.category || '').toLowerCase().includes('image') || (item.category || '').toLowerCase().includes('video')
          ? 'art-images'
          : (item.category || '').toLowerCase().includes('copy') || (item.category || '').toLowerCase().includes('llm')
          ? 'copy-llm'
          : (item.category || '').toLowerCase().includes('3d') || (item.category || '').toLowerCase().includes('motion')
          ? '3d-motion'
          : 'ui-web',
        pricing: item.badge ? String(item.badge).toUpperCase() : 'FREEMIUM',
        isPartner: false,
        url: item.url,
        logoUrl: item.logoUrl,
        bannerUrl: item.bannerUrl,
        bannerType: 'dynamic-db'
      }))

    const staticUrls = new Set(AI_TOOLS_DIRECTORY.map(t => (t.url || '').toLowerCase()))
    const uniqueDbItems = aiDbItems.filter(item => item.url && !staticUrls.has(item.url.toLowerCase()))

    return [...uniqueDbItems, ...AI_TOOLS_DIRECTORY]
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

  // Render Exact Vector Logo Banner
  const renderBannerGraphic = (tool) => {
    switch (tool.bannerType) {
      case 'dynamic-db':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-gradient-to-br from-indigo-900/10 via-purple-900/10 to-transparent border border-gray-100 flex items-center justify-center relative overflow-hidden">
            {tool.bannerUrl ? (
              <img src={tool.bannerUrl} alt={tool.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" loading="lazy" />
            ) : (
              <img
                src={`https://image.thum.io/get/width/600/crop/400/${tool.url}`}
                alt={tool.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            )}
            <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center p-1 z-10">
              <img
                src={tool.logoUrl || `https://www.google.com/s2/favicons?domain=${(() => {
                  try { return new URL(tool.url.startsWith('http') ? tool.url : `https://${tool.url}`).hostname } catch { return '' }
                })()}&sz=128`}
                alt={tool.name}
                className="w-5 h-5 object-contain"
                loading="lazy"
              />
            </div>
          </div>
        );

      case 'lovable':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 transform group-hover:scale-110 transition-transform duration-300">
              <defs>
                <linearGradient id="aiLovableGrad" x1="40%" y1="0%" x2="60%" y2="100%">
                  <stop offset="0%" stopColor="#ff7043" />
                  <stop offset="25%" stopColor="#ff8a65" />
                  <stop offset="55%" stopColor="#f472b6" />
                  <stop offset="80%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
              </defs>
              <path
                d="M33 76 L33 38 C33 22 57 22 57 38 L57 48 C57 54 61 56 68 56 C80 56 80 76 68 76 L33 76 Z"
                fill="url(#aiLovableGrad)"
              />
            </svg>
            {tool.isPartner && (
              <span className="absolute bottom-2 sm:bottom-2.5 right-2.5 sm:right-3 text-[8px] sm:text-[8.5px] font-bold tracking-wider uppercase text-gray-400 select-none">
                PARTNER*
              </span>
            )}
          </div>
        );

      case 'firefly':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-gradient-to-r from-[#d81159] via-[#e51d5c] to-[#a80838] flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#280412]/80 backdrop-blur-xs border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="relative flex items-center justify-center">
                <span className="text-white font-black text-xl sm:text-2xl tracking-tighter select-none font-sans">Fi</span>
                <span className="absolute -top-1 -right-2 text-white text-[10px] select-none">✦</span>
              </div>
            </div>
          </div>
        );

      case 'bolt':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#1a1a1e] flex items-center justify-center relative overflow-hidden">
            <span className="text-white font-black text-5xl sm:text-6xl italic font-serif tracking-tighter transform -rotate-6 group-hover:scale-110 transition-transform duration-300 select-none">
              b
            </span>
          </div>
        );

      case 'webflow':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#070a16] flex items-center justify-center relative overflow-hidden">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-purple-600/35 to-blue-500/25 blur-md absolute" />
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-purple-400/80 flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
            </div>
            {tool.isPartner && (
              <span className="absolute bottom-2 sm:bottom-2.5 right-2.5 sm:right-3 text-[8px] sm:text-[8.5px] font-bold tracking-wider uppercase text-gray-500 select-none">
                PARTNER*
              </span>
            )}
          </div>
        );

      case 'figma':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#bca7df] flex items-center justify-center relative overflow-hidden">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/95 shadow-md p-1.5 sm:p-2 grid grid-cols-2 gap-1 sm:gap-1.5 group-hover:scale-105 transition-transform duration-300">
              <div className="rounded-tl-md bg-[#f24e1e] flex items-center justify-center">
                <span className="text-[8px] sm:text-[9px] text-white font-bold">✦</span>
              </div>
              <div className="rounded-tr-md bg-[#a259ff] flex items-center justify-center">
                <span className="text-[8px] sm:text-[9px] text-white font-bold">●</span>
              </div>
              <div className="rounded-bl-md bg-[#0acf83] flex items-center justify-center">
                <span className="text-[8px] sm:text-[9px] text-white font-bold">▲</span>
              </div>
              <div className="rounded-br-md bg-[#1abcfe] flex items-center justify-center">
                <span className="text-[8px] sm:text-[9px] text-white font-bold">✦</span>
              </div>
            </div>
          </div>
        );

      case 'krea':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#fbfbfb] border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 text-black transform group-hover:scale-110 transition-transform duration-300" fill="currentColor">
              <rect x="30" y="24" width="14" height="52" rx="7" />
              <path d="M44 38 C44 30 52 24 60 24 C68 24 74 30 74 38 C74 46 68 52 60 52 C54 52 48 48 44 44 Z" />
              <path d="M44 56 C48 52 54 48 60 48 C68 48 74 54 74 62 C74 70 68 76 60 76 C52 76 44 70 44 62 Z" />
            </svg>
          </div>
        );

      case 'claude':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#faf8f5] border border-[#f0ebe1] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 text-[#c75d36] transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="currentColor">
              <path d="M50 16 L53 38 L68 23 L59 43 L80 37 L63 50 L80 63 L59 57 L68 77 L53 62 L50 84 L47 62 L32 77 L41 57 L20 63 L37 50 L20 37 L41 43 L32 23 L47 38 Z" />
            </svg>
          </div>
        );

      case 'gemini':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 transform group-hover:rotate-45 transition-transform duration-500">
              <defs>
                <linearGradient id="aiGeminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ea4335" />
                  <stop offset="35%" stopColor="#4285f4" />
                  <stop offset="65%" stopColor="#34a853" />
                  <stop offset="100%" stopColor="#fbbc05" />
                </linearGradient>
              </defs>
              <path d="M50 14 C50 34 34 50 14 50 C34 50 50 66 50 86 C50 66 66 50 86 50 C66 50 50 34 50 14 Z" fill="url(#aiGeminiGrad)" />
            </svg>
          </div>
        );

      case 'spline':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#0c0d14] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 transform group-hover:scale-110 transition-transform duration-300">
              <defs>
                <linearGradient id="aiSplineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#ff007a" />
                </linearGradient>
                <filter id="aiSplineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle cx="42" cy="55" r="16" fill="url(#aiSplineGrad)" filter="url(#aiSplineGlow)" />
              <path d="M68 28 L70 20 L72 28 L80 30 L72 32 L70 40 L68 32 L60 30 Z" fill="#93c5fd" opacity="0.95" />
              <path d="M78 48 L79 43 L80 48 L85 49 L80 50 L79 55 L78 50 L73 49 Z" fill="#e0e7ff" opacity="0.85" />
            </svg>
          </div>
        );

      case 'framer':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-black flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 24 24" className="w-9 h-12 sm:w-10 sm:h-14 transform group-hover:scale-110 transition-transform duration-300">
              <path d="M0 0h24v8H12z" fill="#FFFFFF" />
              <path d="M0 8h12l12 8H0z" fill="#0099FF" />
              <path d="M0 16h12L0 24z" fill="#0055FF" />
            </svg>
            {tool.isPartner && (
              <span className="absolute bottom-2 sm:bottom-2.5 right-2.5 sm:right-3 text-[8px] sm:text-[8.5px] font-bold tracking-wider uppercase text-gray-500 select-none">
                PARTNER*
              </span>
            )}
          </div>
        );

      case 'chatgpt':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 text-black transform group-hover:rotate-45 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M48.5 24 C45 22 40 23 37 26 C33 30 33 36 36 40 L36 43 L29 47 C24 50 22 56 25 61 C28 66 34 68 39 65 L43 63 L43 71 C43 77 47 81 53 81 C59 81 63 77 63 71 L63 67 L70 63 C75 60 77 54 74 49 C71 44 65 42 60 45 L56 47 L56 39 C56 33 52 29 46 29 Z" />
              <circle cx="50" cy="50" r="10" />
            </svg>
          </div>
        );

      case 'v0':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-10 sm:w-16 sm:h-12 transform group-hover:scale-110 transition-transform duration-300">
              <path d="M22 36 L36 64 L48 36" fill="none" stroke="#000000" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter" />
              <rect x="56" y="36" width="22" height="28" rx="4" fill="none" stroke="#000000" strokeWidth="8" />
              <line x1="56" y1="64" x2="78" y2="36" stroke="#000000" strokeWidth="6" />
            </svg>
          </div>
        );

      case 'cursor':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#f6f5f0] border border-[#ebe6dc] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 transform group-hover:scale-110 transition-transform duration-300">
              <polygon points="50,22 76,37 50,52 24,37" fill="#2d2d30" />
              <polygon points="24,37 50,52 50,82 24,67" fill="#18181b" />
              <polygon points="50,52 76,37 76,67 50,82" fill="#09090b" />
              <polygon points="50,52 76,37 76,52 50,67" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>
        );

      case 'recraft':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#000000] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 transform group-hover:scale-110 transition-transform duration-300">
              <path
                d="M32 26 C32 26 54 26 62 26 C72 26 76 32 76 40 C76 48 70 52 60 54 C70 58 74 68 74 74 L60 74 C60 68 56 62 46 62 L44 62 L44 74 L32 74 Z M44 38 L44 50 L58 50 C62 50 64 48 64 44 C64 40 62 38 58 38 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );

      case 'relume':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#000000] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-12 h-12 sm:w-14 sm:h-14 transform group-hover:scale-110 transition-transform duration-300">
              <path d="M46 24 C34 24 28 32 28 46 C28 60 34 68 46 68 Z" fill="#ffffff" />
              <path d="M48 48 L68 48 L74 76 L52 76 Z" fill="#ffffff" />
            </svg>
          </div>
        );

      case 'midjourney':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-16 sm:h-16 text-black transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M49 18 C49 18 63 38 65 66 L49 66 Z" />
              <path d="M43 30 C43 30 29 46 27 66 L43 66 Z" />
              <line x1="46" y1="14" x2="46" y2="68" />
              <path d="M22 72 C36 80 64 80 78 72 L72 80 C54 84 40 84 26 80 Z" />
              <path d="M18 86 Q24 82 30 86 T42 86 T54 86 T66 86 T78 86 T88 86" strokeWidth="1.8" />
            </svg>
          </div>
        );

      case 'runway':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#111] flex items-center justify-center relative overflow-hidden">
            <span className="text-white font-black text-3xl sm:text-4xl tracking-widest font-sans uppercase group-hover:scale-110 transition-transform">
              R/
            </span>
          </div>
        );

      case 'perplexity':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#1d2730] flex items-center justify-center relative overflow-hidden">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-teal-400/80 flex items-center justify-center shadow-lg group-hover:rotate-45 transition-transform duration-500">
              <span className="text-teal-300 font-black text-lg sm:text-xl">P</span>
            </div>
          </div>
        );

      case 'luma':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-gradient-to-tr from-[#1e1b4b] to-[#4338ca] flex items-center justify-center relative overflow-hidden">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-200" />
            </div>
          </div>
        );

      case 'flux':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-[#000] flex items-center justify-center relative overflow-hidden">
            <span className="text-white font-black text-2xl sm:text-3xl italic tracking-tighter uppercase font-serif">
              FLUX
            </span>
          </div>
        );

      case 'khroma':
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center relative overflow-hidden">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-purple-700" />
            </div>
          </div>
        );

      default:
        return (
          <div className="h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] bg-gray-50 border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400 group-hover:scale-110 transition-transform" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] text-[#111827] font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900 pb-20">
      
      {/* Universal Common Header */}
      <Header
        currentView="ai-tools"
        onNavigate={(target) => {
          if (target === 'landing') onBackToHome()
          else if (target === 'design') onNavigateToDesign()
          else if (target === 'ai-tools') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
          } else if (target === 'app') {
            if (onNavigateToDashboard) onNavigateToDashboard()
            else window.location.hash = '#dashboard'
          }
        }}
        onAddLink={onAddLink}
      />

      {/* Main Container */}
      <main className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28">

        {/* Hero Section */}
        <section className="mb-8 sm:mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-3 sm:mb-4 uppercase tracking-wider">
            <Sparkles size={13} className="text-indigo-600 animate-pulse" />
            <span>AI Design Directory • {combinedTools.length}+ Best Tools</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight mb-3 sm:mb-4">
            Best AI Design Tools
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 font-normal max-w-3xl leading-relaxed">
            A growing curated collection of the best AI tools for creating UI designs, generating generative images, 3D assets, copywriting, animations, and automating design workflows. Updated weekly.
          </p>
        </section>

        {/* Search & Filter Bar */}
        <section className="mb-8 sm:mb-10 bg-white rounded-2xl p-3.5 sm:p-5 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center justify-between">

          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
            <input
              type="text"
              placeholder={`Search ${combinedTools.length}+ AI tools by name or description...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50/80 border border-gray-200 rounded-xl pl-10 pr-4 py-2 sm:py-2.5 text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* Pricing Badges Filter */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-start md:justify-end">
            <span className="text-xs font-semibold text-gray-500 mr-1 flex items-center gap-1">
              <Filter size={13} /> Pricing:
            </span>
            {['all', 'freemium', 'free', 'paid'].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPricing(p)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${selectedPricing === p
                    ? 'bg-black text-white shadow-xs'
                    : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/80'
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </section>

        {/* Category Pills Slider */}
        <section className="mb-10 sm:mb-12 overflow-x-auto pb-2 scrollbar-none no-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="flex gap-2 sm:gap-2.5 min-w-max">
            {AI_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive = selectedCategory === cat.id
              const liveCount = cat.id === 'all'
                ? `${combinedTools.length}+`
                : combinedTools.filter(t => t.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer ${isActive
                      ? 'bg-indigo-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)] scale-[1.02]'
                      : 'bg-white text-gray-700 border border-gray-200/80 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <Icon size={14} className={isActive ? 'text-white' : 'text-gray-500'} />
                  <span>{cat.name}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-md ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-gray-100 text-gray-500'}`}>
                    {liveCount}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Featured Live Screen Banners Showcase (Top 3) */}
        {selectedCategory === 'all' && !searchQuery && (
          <section className="mb-10 sm:mb-14">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-lg sm:text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2">
                <Flame className="text-orange-500" size={20} />
                <span>Featured Live AI Screen Previews</span>
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
                    {/* Live Preview Screen Banner */}
                    <div className="relative h-44 sm:h-52 w-full rounded-xl sm:rounded-2xl overflow-hidden bg-gray-100 mb-3 sm:mb-4 border border-gray-100">
                      <img
                        src={item.bannerUrl}
                        alt={item.title}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {item.isPartner && (
                        <span className="absolute bottom-2 sm:bottom-2.5 right-2.5 sm:right-3 text-[8.5px] sm:text-[9px] font-extrabold tracking-wider uppercase text-white/90 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
                          PARTNER*
                        </span>
                      )}
                    </div>

                    {/* Logo & Name */}
                    <div className="flex items-center gap-2.5 sm:gap-3 mb-1.5 sm:mb-2">
                      <img
                        src={item.logoUrl}
                        alt={item.title}
                        className="w-6 h-6 sm:w-7 sm:h-7 object-contain rounded-md"
                        loading="lazy"
                      />
                      <h3 className="font-extrabold text-base sm:text-lg text-gray-950 group-hover:text-indigo-600 transition-colors truncate">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-[13.5px] text-gray-500 font-normal leading-relaxed line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  {/* Badge & Visit CTA */}
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

        {/* All Tools Grid */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-2xl font-black text-gray-950 tracking-tight">
              {selectedCategory === 'all' ? 'All AI Tools & Resources' : AI_CATEGORIES.find(c => c.id === selectedCategory)?.name}
            </h2>
            <span className="text-xs font-semibold text-gray-500">
              Showing {filteredTools.length} tools
            </span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center border border-gray-100 shadow-xs">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {filteredTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between block no-underline text-inherit group relative"
                >
                  <div>
                    {/* Live Graphic Banner */}
                    <div className="mb-3 sm:mb-4">
                      {renderBannerGraphic(tool)}
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-bold text-base sm:text-[17px] text-gray-950 mb-1 group-hover:text-indigo-600 transition-colors truncate">
                      {tool.name}
                    </h3>
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
                </a>
              ))}
            </div>
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
          else if (target === 'app') onNavigateToDashboard()
          else window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

    </div>
  )
}
