import React, { useState, useMemo, useEffect } from 'react'
import Header from '../components/Header'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import Pagination from '../components/Pagination'
import { API_URL, API_EDITING_URL } from '../config/api'
import {
  Scissors,
  Search,
  ExternalLink,
  Heart,
  LayoutGrid,
  Check,
  Plus,
  Video,
  Wand2,
  Palette,
  Mic,
  Film,
  Sparkles
} from 'lucide-react'

// Category Filter Tabs
const EDITING_CATEGORIES = [
  { id: 'all', name: 'All Links', icon: LayoutGrid },
  { id: 'video', name: 'Video Editors', icon: Video },
  { id: 'ai-vfx', name: 'AI & VFX', icon: Wand2 },
  { id: 'photo', name: 'Photo & Graphic', icon: Palette },
  { id: 'audio', name: 'Audio & Voice', icon: Mic },
  { id: 'motion', name: 'Motion & Captions', icon: Film },
  { id: 'favorites', name: 'Favorites', icon: Heart },
]

// Brand Presets with high-resolution screenshots for popular creative & editing tools
const BRAND_PRESETS = {
  blackmagicdesign: {
    title: 'Blackmagic Design',
    bannerUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=blackmagicdesign.com&sz=128',
  },
  davinci: {
    title: 'DaVinci Resolve',
    bannerUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=blackmagicdesign.com&sz=128',
  },
  capcut: {
    title: 'CapCut',
    bannerUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=capcut.com&sz=128',
  },
  runway: {
    title: 'Runway',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=128',
  },
  runwayml: {
    title: 'Runway',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=128',
  },
  descript: {
    title: 'Descript',
    bannerUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=descript.com&sz=128',
  },
  premiere: {
    title: 'Premiere Pro',
    bannerUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',
  },
  adobe: {
    title: 'Adobe',
    bannerUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=adobe.com&sz=128',
  },
  elevenlabs: {
    title: 'ElevenLabs',
    bannerUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128',
  },
  topaz: {
    title: 'Topaz Video AI',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=topazlabs.com&sz=128',
  },
  topazlabs: {
    title: 'Topaz Video AI',
    bannerUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=topazlabs.com&sz=128',
  },
  canva: {
    title: 'Canva',
    bannerUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128',
  },
  figma: {
    title: 'Figma',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
  },
  submagic: {
    title: 'Submagic',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=submagic.co&sz=128',
  },
  photopea: {
    title: 'Photopea',
    bannerUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=photopea.com&sz=128',
  },
  jitter: {
    title: 'Jitter',
    bannerUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    logoUrl: 'https://www.google.com/s2/favicons?domain=jitter.video&sz=128',
  },
};

function EditingLiveBanner({ tool }) {
  const [screenshotError, setScreenshotError] = useState(false)

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
  const preset = BRAND_PRESETS[domainSlug] || (tool.name ? BRAND_PRESETS[tool.name.toLowerCase().replace(/[^a-z0-9]/g, '')] : null)

  // Primary: Custom tool banner or Brand Preset or Microlink Live Chromium Screenshot
  const primaryScreenshot = (tool.bannerUrl && !tool.bannerUrl.includes('mshots') && !tool.bannerUrl.includes('thum.io'))
    ? tool.bannerUrl
    : (preset?.bannerUrl || `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`)
  
  const secondaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=800&h=500`

  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot)

  useEffect(() => {
    setCurrentScreenshot(primaryScreenshot)
    setScreenshotError(false)
  }, [primaryScreenshot])

  const clearbitLogo = `https://logo.clearbit.com/${hostname}`
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  const logoSrc = tool.logoUrl || preset?.logoUrl || googleFavicon

  return (
    <div className="relative h-32 sm:h-[142px] w-full rounded-[16px] sm:rounded-[20px] overflow-hidden bg-gradient-to-br from-slate-900 via-zinc-900 to-stone-900 border border-gray-100 flex items-center justify-center group/banner">
      {!screenshotError ? (
        <img
          src={currentScreenshot}
          alt={`${tool.name} preview`}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={() => {
            if (currentScreenshot === primaryScreenshot && primaryScreenshot !== secondaryScreenshot) {
              setCurrentScreenshot(secondaryScreenshot)
            } else {
              setScreenshotError(true)
            }
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full p-4 bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 text-white select-none">
          <Scissors size={28} className="text-violet-400 mb-2 opacity-80" />
          <span className="text-[12px] font-bold text-white/80 truncate max-w-[90%]">
            {tool.name}
          </span>
        </div>
      )}

      {/* Floating Category Tag */}
      <span className="absolute top-2.5 left-2.5 text-[8.5px] font-extrabold tracking-wider uppercase text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10 select-none">
        {tool.tag || 'Editing'}
      </span>

      {/* Overlapping Logo Badge (Bottom Right) */}
      <div className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center p-1 z-10 overflow-hidden">
        <img
          src={logoSrc}
          alt=""
          className="w-full h-full object-contain rounded-full"
          onError={(e) => {
            if (e.target.src !== googleFavicon) {
              e.target.src = googleFavicon
            } else {
              e.target.style.display = 'none'
            }
          }}
        />
      </div>
    </div>
  )
}

export default function EditingPage({
  onBack,
  onNavigateToDesign,
  onNavigateToAITools,
  onNavigateToSkills,
  onNavigateToDashboard,
  onAddLink,
  user,
  onLogin,
  onLogout,
}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dbLinks, setDbLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12 // 3 rows of 4 items = 12 items per page

  // Bookmarks state with localStorage persistence
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('nexio_editing_favorites')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem('nexio_editing_favorites', JSON.stringify(next))
      } catch (err) {
        console.error(err)
      }
      return next
    })
  }

  // Fetch editing tools directly from MongoDB database
  const fetchEditingLinks = async () => {
    try {
      setLoading(true)
      // First try dedicated editing endpoint, then fallback to /hub
      const res = await fetch(API_EDITING_URL).catch(() => null)
      if (res && res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const editingItems = data.map(item => ({
            id: item.id || item._id,
            name: item.title || 'Untitled Link',
            desc: item.description || '',
            url: item.url,
            category: item.category || 'Editing',
            tag: item.badge || item.category || 'Editing',
            pricing: item.badge || 'PRO',
            bannerUrl: item.bannerUrl || '',
            logoUrl: item.logoUrl || '',
            isSaved: true,
            favorite: Boolean(item.favorite),
          }))
          setDbLinks(editingItems)
          return
        }
      }

      // Fallback to /hub if dedicated endpoint returns empty
      const hubRes = await fetch(API_URL).catch(() => null)
      if (hubRes && hubRes.ok) {
        const data = await hubRes.json()
        const editingItems = (data || []).filter(item => {
          if (!item.category) return false
          const cats = item.category.toLowerCase()
          return cats.includes('editing') || cats.includes('research')
        }).map(item => ({
          id: item.id || item._id,
          name: item.title || 'Untitled Link',
          desc: item.description || '',
          url: item.url,
          category: item.category || 'Editing',
          tag: item.category ? item.category.split(',')[0].trim() : 'Editing',
          pricing: item.badge || 'SAVED',
          bannerUrl: item.bannerUrl || '',
          logoUrl: item.logoUrl || '',
          isSaved: true,
          favorite: Boolean(item.favorite),
        }))
        setDbLinks(editingItems)
      }
    } catch (err) {
      console.error('Error fetching editing links:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEditingLinks()
    const handleUpdate = () => fetchEditingLinks()
    window.addEventListener('nexio_links_updated', handleUpdate)
    return () => window.removeEventListener('nexio_links_updated', handleUpdate)
  }, [])

  // Dynamic counts for each category tab based on DB data
  const categoryCounts = useMemo(() => {
    const counts = { all: dbLinks.length }
    counts['favorites'] = dbLinks.filter(l => favorites[l.id] || l.favorite).length
    counts['video'] = dbLinks.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(video|edit|cut|premiere|resolve|film|davinci|capcut)/)).length
    counts['ai-vfx'] = dbLinks.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(ai|vfx|gen|runway|luma|kling|pika|topaz)/)).length
    counts['photo'] = dbLinks.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(photo|image|design|canvas|graphic|figma|ps|photopea)/)).length
    counts['audio'] = dbLinks.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(audio|voice|sound|speech|eleven|music|descript)/)).length
    counts['motion'] = dbLinks.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(motion|caption|subtitle|submagic|jitter|animat)/)).length
    return counts
  }, [dbLinks, favorites])

  // Filter tools by category and search query ONLY from database
  const filteredTools = useMemo(() => {
    let list = dbLinks

    if (selectedCategory === 'favorites') {
      list = list.filter(tool => favorites[tool.id] || tool.favorite)
    } else if (selectedCategory === 'video') {
      list = list.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(video|edit|cut|premiere|resolve|film|davinci|capcut)/))
    } else if (selectedCategory === 'ai-vfx') {
      list = list.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(ai|vfx|gen|runway|luma|kling|pika|topaz)/))
    } else if (selectedCategory === 'photo') {
      list = list.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(photo|image|design|canvas|graphic|figma|ps|photopea)/))
    } else if (selectedCategory === 'audio') {
      list = list.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(audio|voice|sound|speech|eleven|music|descript)/))
    } else if (selectedCategory === 'motion') {
      list = list.filter(l => (l.name + ' ' + l.desc + ' ' + l.tag + ' ' + l.url).toLowerCase().match(/(motion|caption|subtitle|submagic|jitter|animat)/))
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      list = list.filter(tool =>
        tool.name?.toLowerCase().includes(q) ||
        tool.desc?.toLowerCase().includes(q) ||
        tool.tag?.toLowerCase().includes(q) ||
        tool.url?.toLowerCase().includes(q)
      )
    }

    return list
  }, [dbLinks, selectedCategory, searchQuery, favorites])

  // Reset pagination on category or search filter change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, searchQuery])

  // 3-row pagination calculations
  const totalPages = Math.ceil(filteredTools.length / itemsPerPage) || 1
  const paginatedTools = filteredTools.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleCopyLink = (tool) => {
    navigator.clipboard.writeText(tool.url)
    setCopiedId(tool.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-gray-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentView="editing"
        onNavigate={(target) => {
          if (target === 'landing') onBack?.()
          else if (target === 'design') onNavigateToDesign?.()
          else if (target === 'ai-tools') onNavigateToAITools?.()
          else if (target === 'skills') onNavigateToSkills?.()
          else if (target === 'editing') window.scrollTo({ top: 0, behavior: 'smooth' })
          else if (target === 'app') onNavigateToDashboard?.()
        }}
        onAddLink={onAddLink}
        user={user}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* Search and Action Bar */}
        <section className="py-2 mb-6 max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search editing tools in database..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-900 placeholder:text-gray-400 shadow-xs focus:outline-hidden focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              />
            </div>
            {onAddLink && (
              <button
                type="button"
                onClick={onAddLink}
                className="w-full sm:w-auto px-5 py-3 bg-gray-950 hover:bg-gray-800 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus size={16} />
                <span>Save Link</span>
              </button>
            )}
          </div>
        </section>

        {/* CATEGORY FILTER PILLS GRID (Matching Design Page) */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Browse by Category</h2>
            <span className="text-xs text-gray-400">Showing {filteredTools.length} database tools</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-2.5">
            {EDITING_CATEGORIES.map(cat => {
              const IconComp = cat.icon
              const isActive = selectedCategory === cat.id
              const liveCount = categoryCounts[cat.id] !== undefined ? categoryCounts[cat.id] : 0
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

        {/* Database Editing Tools Display (3 rows per page) */}
        <section>
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-3 text-xs text-gray-500 font-medium">Loading database links...</p>
            </div>
          ) : filteredTools.length === 0 ? (
            <div className="w-full bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-16 text-center border border-gray-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
              <img
                src={searchQuery || selectedCategory !== 'all' ? "/assets/empty/no-results.svg" : "/assets/empty/no-creators.svg"}
                alt="No editing links found"
                className="w-36 h-36 sm:w-44 sm:h-44 mx-auto mb-5 object-contain"
              />
              <h3 className="text-base sm:text-lg font-extrabold text-gray-900 mb-1.5">
                {searchQuery || selectedCategory !== 'all' ? 'No matching editing links found' : 'No editing links saved yet'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
                {searchQuery || selectedCategory !== 'all'
                  ? 'No database links matched the current filter. Try resetting filters or searching with a different keyword.'
                  : 'Save links under the Editing category to see them appear here directly from your database.'}
              </p>
              <div className="flex items-center justify-center gap-3">
                {(searchQuery || selectedCategory !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('all')
                    }}
                    className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
                {onAddLink && (
                  <button
                    type="button"
                    onClick={onAddLink}
                    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={15} />
                    <span>Save an Editing Link</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* 4 columns x 3 rows grid = 12 items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginatedTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="group bg-white rounded-[22px] border border-gray-200/80 p-3.5 flex flex-col justify-between hover:shadow-lg hover:border-violet-200 transition-all duration-300"
                  >
                    <div>
                      {/* Live Screenshot Banner */}
                      <EditingLiveBanner tool={tool} />

                      {/* Header row: Title & Link */}
                      <div className="mt-3.5 flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-extrabold text-[14px] sm:text-[15px] text-gray-950 truncate group-hover:text-violet-700 transition-colors">
                              {tool.name}
                            </h3>
                            {tool.pricing && tool.pricing !== 'SAVED' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-violet-50 text-violet-700 rounded-md">
                                {tool.pricing}
                              </span>
                            )}
                          </div>
                          {tool.desc && (
                            <p className="text-[12px] text-gray-500 font-medium line-clamp-2 mt-1 leading-snug">
                              {tool.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => toggleFavorite(tool.id)}
                          className={`p-1.5 rounded-lg border text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer ${
                            favorites[tool.id] ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-gray-200/80'
                          }`}
                          title="Favorite tool"
                        >
                          <Heart size={14} className={favorites[tool.id] ? 'fill-rose-500 text-rose-500' : ''} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(tool)}
                          className="p-1.5 rounded-lg border border-gray-200/80 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors cursor-pointer text-[11px] font-semibold"
                          title="Copy Link"
                        >
                          {copiedId === tool.id ? <Check size={14} className="text-emerald-600" /> : <ExternalLink size={14} />}
                        </button>
                      </div>

                      <a
                        href={tool.url.startsWith('http') ? tool.url : `https://${tool.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-gray-900 hover:bg-violet-700 text-white font-bold text-[11px] sm:text-[12px] rounded-xl flex items-center gap-1 transition-all"
                      >
                        <span>Visit</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Unified Pagination: Remainder links beyond 3 rows (12 items) */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                scrollToTop={true}
              />
            </>
          )}
        </section>

        {/* Newsletter Section */}
        <NewsletterSection />
      </main>

      {/* Global Footer */}
      <Footer
        onNavigate={(target) => {
          if (target === 'landing') onBack?.()
          else if (target === 'design') onNavigateToDesign?.()
          else if (target === 'ai-tools') onNavigateToAITools?.()
          else if (target === 'skills') onNavigateToSkills?.()
          else if (target === 'editing') window.scrollTo({ top: 0, behavior: 'smooth' })
          else if (target === 'app') onNavigateToDashboard?.()
        }}
      />
    </div>
  )
}
