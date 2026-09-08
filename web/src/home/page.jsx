import { useEffect, useMemo, useState } from 'react'
import Hero from './hero'
import CategoryNav from './CategoryNav'
import LinksSection from './links'
import GoogleSection from './google'
import SaveLinkModal from './SaveLinkModal'
import DashboardPage from '../dashbord/page'
import DesignPage from '../design/page'
import AIToolsPage from '../AI-tools/page'
import EditingPage from '../Editing/editing'
import LoginPage from '../login/page'
import AnimatedConnect01 from '../components/fonts/animation/animated-ai-saas-integrations-connect-flow'
import EssentialAITools from './EssentialAITools'
import FeaturedQuickAssets from './FeaturedQuickAssets'
import NewsletterSection from '../components/NewsletterSection'
import Footer from '../components/Footer'
import Header from '../components/Header'
import { API_URL, API_BASE_URL } from '../config/api'

const initialLinks = [
  {
    id: 1,
    title: 'The art of building a second brain',
    url: 'fortelabs.com/blog/basboverview',
    source: 'Forte Labs',
    type: 'Article',
    collection: 'Personal growth',
    description: 'A practical system for organizing ideas, notes, and your digital life.',
    tags: ['thinking', 'notes', 'productivity'],
    color: '#cdebdc',
    letter: 'F',
    saved: 'Today',
    favorite: true,
    readLater: true,
  },
  {
    id: 2,
    title: 'React documentation: hooks reference',
    url: 'react.dev/reference/react',
    source: 'React',
    type: 'Docs',
    collection: 'Development',
    description: 'Official React reference for hooks, components, and application APIs.',
    tags: ['react', 'frontend', 'docs'],
    color: '#d7e7ff',
    letter: 'R',
    saved: 'Yesterday',
    favorite: false,
    readLater: false,
  },
  {
    id: 3,
    title: 'CSS tricks guide to grid',
    url: 'css-tricks.com/snippets/css/complete-guide-grid',
    source: 'CSS-Tricks',
    type: 'Guide',
    collection: 'Design',
    description: 'A visual reference for CSS grid layout, placement, and responsive patterns.',
    tags: ['css', 'layout', 'design'],
    color: '#ffe4bd',
    letter: 'C',
    saved: '2 days ago',
    favorite: true,
    readLater: false,
  },
  {
    id: 4,
    title: 'Startup library: product market fit',
    url: 'www.ycombinator.com/library',
    source: 'Y Combinator',
    type: 'Research',
    collection: 'Business',
    description: 'Essays and talks about startup building, markets, and product strategy.',
    tags: ['startup', 'strategy', 'market'],
    color: '#ffd6cc',
    letter: 'Y',
    saved: 'Last week',
    favorite: false,
    readLater: true,
  },
  {
    id: 5,
    title: 'Local travel places shortlist',
    url: 'maps.google.com',
    source: 'Google Maps',
    type: 'Map',
    collection: 'Personal',
    description: 'Saved places and travel references for planning future trips.',
    tags: ['travel', 'places', 'personal'],
    color: '#d9d6ff',
    letter: 'M',
    saved: 'Aug 20',
    favorite: false,
    readLater: false,
  },
]

const sidebarFilters = ['All links', 'Saved', 'Favorites']
const collections = ['Development', 'Design', 'Research', 'Business', 'Personal growth']

function normalizeUrl(value) {
  return value.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

function withProtocol(url) {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

function formatTitleFromUrl(url) {
  try {
    const clean = normalizeUrl(url)
    const domain = clean.split('/')[0].replace(/^www\./i, '')
    const mainName = domain.split('.')[0]

    // Capitalize and format brand name cleanly (e.g. uxpilot -> Uxpilot, figma -> Figma)
    if (!mainName) return domain
    return mainName.charAt(0).toUpperCase() + mainName.slice(1)
  } catch {
    return url
  }
}

function getFaviconUrl(url) {
  try {
    const domain = normalizeUrl(url).split('/')[0]
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  } catch {
    return ''
  }
}

function Favicon({ url, letter, color, className = 'thumb' }) {
  const [error, setError] = useState(false)
  const favicon = getFaviconUrl(url)

  if (!favicon || error) {
    return (
      <div className={className} style={{ backgroundColor: color || '#e2e8f0' }}>
        {letter || '?'}
      </div>
    )
  }

  return (
    <div className={className} style={{ backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: '4px' }}>
      <img
        src={favicon}
        alt="Logo"
        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '4px' }}
        onError={() => setError(true)}
      />
    </div>
  )
}

const linkTypes = ['UI/UX', 'AI Tools', 'Development', 'Design', 'Article', 'Research', 'Tools', 'Other']

function parseCsv(text) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"'
      i += 1
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim())
      cell = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i += 1
      row.push(cell.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }

  row.push(cell.trim())
  if (row.some(Boolean)) rows.push(row)
  if (rows.length === 0) return []

  const headers = rows[0].map((header) => header.toLowerCase())
  return rows.slice(1).map((values) =>
    headers.reduce((item, header, index) => ({
      ...item,
      [header]: values[index] || '',
    }), {}),
  )
}

function parseImportText(text, fileName) {
  if (fileName.toLowerCase().endsWith('.csv')) {
    return parseCsv(text)
  }

  const data = JSON.parse(text)
  if (Array.isArray(data)) return data
  if (Array.isArray(data.links)) return data.links
  return []
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

export default function Home() {
  // ── Auth state ──
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('nexio_auth')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem('nexio_auth')
          return null
        }
        return parsed
      }
      return null
    } catch {
      return null
    }
  })

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    window.dispatchEvent(new CustomEvent('nexio_auth_updated'))
    handleSetView('app') // Go to dashboard after login
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('nexio_auth')
    window.dispatchEvent(new CustomEvent('nexio_auth_updated'))
    handleSetView('landing')
  }

  useEffect(() => {
    if (!user || !user.expiresAt) return

    const timeRemaining = user.expiresAt - Date.now()
    if (timeRemaining <= 0) {
      handleLogout()
      return
    }

    // Set a timeout to auto logout. Use max 32-bit integer for setTimeout limit, though 1 day fits.
    // 24 hours = 86400000 ms, which is < 2147483647 ms
    const timer = setTimeout(() => {
      handleLogout()
    }, timeRemaining)

    return () => clearTimeout(timer)
  }, [user])

  const [view, setView] = useState(() => {
    try {
      const stored = localStorage.getItem('nexio_auth');
      let currentUser = null;
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.expiresAt || Date.now() <= parsed.expiresAt) {
          currentUser = parsed;
        }
      }
      const hash = window.location.hash.toLowerCase();
      if (hash === '#dashboard' || hash === '#app') return currentUser ? 'app' : 'login';
      if (hash === '#design') return currentUser ? 'design' : 'login';
      if (hash === '#ai-tools' || hash === '#ai' || hash === '#ai-design-tools') return 'ai-tools';
      if (hash === '#editing') return 'editing';
      if (hash === '#login') return 'login';
      const saved = localStorage.getItem('nexio_current_view');
      if (saved === 'app') return currentUser ? 'app' : 'login';
      if (saved === 'design') return currentUser ? 'design' : 'login';
      if (saved === 'ai-tools') return 'ai-tools';
      if (saved === 'editing') return 'editing';
    } catch {
      // fallback
    }
    return 'landing';
  });

  const handleSetView = (newView) => {
    if ((newView === 'app' || newView === 'design') && !user) {
      setView('login');
      window.history.pushState(null, '', '#login');
      return;
    }
    setView(newView);
    try {
      localStorage.setItem('nexio_current_view', newView === 'login' ? 'landing' : newView);
      if (newView === 'app') {
        if (window.location.hash !== '#dashboard') {
          window.history.pushState(null, '', '#dashboard');
        }
      } else if (newView === 'design') {
        if (window.location.hash !== '#design') {
          window.history.pushState(null, '', '#design');
        }
      } else if (newView === 'ai-tools') {
        if (window.location.hash !== '#ai-tools') {
          window.history.pushState(null, '', '#ai-tools');
        }
      } else if (newView === 'editing') {
        if (window.location.hash !== '#editing') {
          window.history.pushState(null, '', '#editing');
        }
      } else if (newView === 'login') {
        window.history.pushState(null, '', '#login');
      } else {
        if (window.location.hash === '#dashboard' || window.location.hash === '#app' || window.location.hash === '#design' || window.location.hash === '#ai-tools' || window.location.hash === '#ai' || window.location.hash === '#editing' || window.location.hash === '#login') {
          window.history.pushState(null, '', window.location.pathname + window.location.search);
        }
      }
    } catch {
      // fallback
    }
  };

  const handleAddLink = () => {
    if (!user) {
      handleSetView('login');
    } else {
      setIsAdding(true);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#dashboard' || hash === '#app') {
        if (!user) {
          setView('login');
          window.history.pushState(null, '', '#login');
        } else {
          setView('app');
          localStorage.setItem('nexio_current_view', 'app');
        }
      } else if (hash === '#design') {
        if (!user) {
          setView('login');
          window.history.pushState(null, '', '#login');
        } else {
          setView('design');
          localStorage.setItem('nexio_current_view', 'design');
        }
      } else if (hash === '#ai-tools' || hash === '#ai' || hash === '#ai-design-tools') {
        setView('ai-tools');
        localStorage.setItem('nexio_current_view', 'ai-tools');
      } else if (hash === '#editing') {
        setView('editing');
        localStorage.setItem('nexio_current_view', 'editing');
      } else if (hash === '#login') {
        setView('login');
      } else if (!hash || hash === '#features' || hash === '#use-cases' || hash === '#extensions' || hash === '#integrations') {
        setView('landing');
        localStorage.setItem('nexio_current_view', 'landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [user]);

  const [links, setLinks] = useState([])
  const [dbLinks, setDbLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All links')
  const [isAdding, setIsAdding] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [importStatus, setImportStatus] = useState('')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [form, setForm] = useState({
    title: '',
    url: '',
    type: 'UI/UX',
    collection: 'Saved',
    tags: '',
    description: '',
  })

  // Fetch all links from MongoDB
  const fetchLinks = async () => {
    try {
      setLoading(true)
      const [res, aiRes] = await Promise.all([
        fetch(API_URL).catch(() => ({ ok: false })),
        fetch(`${API_BASE_URL}/api/ai-tools`).catch(() => ({ ok: false }))
      ])
      
      let allLinks = []
      
      if (res.ok) {
        const data = await res.json().catch(() => [])
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item) => {
            // Smart description from URL keywords
            const urlLower = (item.url || '').toLowerCase()
            const titleLower = (item.title || '').toLowerCase()
            let smartDesc = item.description
            if (!smartDesc || smartDesc.startsWith('Saved link for')) {
              if (urlLower.includes('block') || urlLower.includes('component') || titleLower.includes('block')) {
                smartDesc = 'Animated UI component blocks for modern web interfaces.'
              } else if (urlLower.includes('animated') || titleLower.includes('animated')) {
                smartDesc = 'Interactive animated elements and motion design resources.'
              } else if (urlLower.includes('design') || titleLower.includes('design')) {
                smartDesc = 'Design tools and creative resources for modern interfaces.'
              } else if (urlLower.includes('ai') || titleLower.includes('ai')) {
                smartDesc = 'AI-powered tools and intelligent automation resources.'
              } else if (urlLower.includes('docs') || urlLower.includes('guide')) {
                smartDesc = 'Documentation and comprehensive developer guides.'
              } else {
                const cat = item.category || 'UI/UX'
                const catMap = {
                  'UI/UX': 'Design and interface inspiration.',
                  'AI Agents': 'AI tools and autonomous agents.',
                  'Development': 'Coding resources and developer tools.',
                  'Resources': 'Useful materials and guides.',
                  'Inspiration': 'Creative ideas and references.',
                }
                smartDesc = catMap[cat] || 'Saved bookmark for future reference.'
              }
            }
            return {
              id: item.id || item._id,
              title: item.title,
              url: item.url,
              source: normalizeUrl(item.url).split('/')[0].replace(/^www\./, ''),
              type: item.category || 'UI/UX',
              category: item.category || 'UI/UX',
              collection: item.collection || 'All Links',
              description: smartDesc,
              tags: [item.category ? item.category.toLowerCase() : 'ui/ux'],
              color: '#def7ec',
              letter: item.title.charAt(0).toUpperCase(),
              saved: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
              favorite: Boolean(item.favorite),
              readLater: Boolean(item.readLater),
            }
          })
          allLinks = [...allLinks, ...formatted]
        }
      }

      if (aiRes.ok) {
        const aiData = await aiRes.json().catch(() => [])
        const toolsArr = Array.isArray(aiData) ? aiData : (Array.isArray(aiData?.tools) ? aiData.tools : [])
        if (toolsArr.length > 0) {
          const formattedAi = toolsArr.map(item => ({
            id: item._id || item.toolId,
            title: item.name,
            url: item.url,
            source: normalizeUrl(item.url).split('/')[0].replace(/^www\./, ''),
            type: 'AI Tools',
            category: 'AI Tools',
            collection: 'AI Tools',
            description: item.desc || item.name,
            tags: ['ai tools'],
            color: '#def7ec',
            letter: item.name.charAt(0).toUpperCase(),
            saved: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
            favorite: false,
            readLater: false,
            bannerUrl: item.bannerUrl || '',
            logoUrl: '' 
          }))
          allLinks = [...allLinks, ...formattedAi]
        }
      }
      
      if (allLinks.length > 0) {
        setDbLinks(allLinks)
        setLinks([...allLinks, ...initialLinks])
        setSelected(allLinks[0])
      } else {
        setLinks(initialLinks)
        setSelected(initialLinks[0])
      }
    } catch (err) {
      console.error('Error fetching links:', err)
      setLinks(initialLinks)
      setSelected(initialLinks[0])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()

    const handleUpdate = () => {
      fetchLinks()
    }

    window.addEventListener('nexio_ai_tools_updated', handleUpdate)
    return () => {
      window.removeEventListener('nexio_ai_tools_updated', handleUpdate)
    }
  }, [])

  const displayedLinks = useMemo(() => {
    const cleanQuery = query.toLowerCase().trim()

    return links.filter((item) => {
      const haystack = [
        item.title,
        item.url,
        item.source,
        item.type,
        item.collection,
        item.description,
        ...item.tags,
      ]
        .join(' ')
        .toLowerCase()

      const matchesQuery = !cleanQuery || haystack.includes(cleanQuery)
      const matchesFilter =
        filter === 'All links' ||
        (filter === 'Favorites' && item.favorite && item.collection !== 'Quick Assets' && item.category !== 'Featured Quick Asset' && item.category !== 'Quick Assets' && item.kind !== 'quick-asset' && !(item.category && item.category.toLowerCase().includes('quick'))) ||
        (filter === 'Saved' && (item.collection === 'Saved' || item.category === 'Saved' || item.type === 'Saved')) ||
        filter === item.collection ||
        filter === item.type

      return matchesQuery && matchesFilter
    })
  }, [links, query, filter])

  const [isSubmitting, setIsSubmitting] = useState(false)

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function handleSaveLinkModal(linkData) {
    setSaveError('')
    setIsSubmitting(true)

    const rawUrl = linkData?.url || form.url
    const cleanUrl = normalizeUrl(rawUrl)
    if (!cleanUrl) {
      setIsSubmitting(false)
      return
    }

    // Prevent saving duplicate links
    const isDuplicate = links.some((link) => normalizeUrl(link.url) === cleanUrl)
    if (isDuplicate) {
      setSaveError('This link has already been saved.')
      setIsSubmitting(false)
      return
    }

    const derivedTitle = linkData?.title || form.title || formatTitleFromUrl(cleanUrl)
    const selectedCategory = linkData?.category || form.type || 'UI/UX'

    const categoryDescriptions = {
      'Quick Assets': 'Lightweight utility, plugin, or vector asset.',
      'UI/UX': 'Design and interface inspiration.',
      'AI Image & Video': 'AI image generators, video synthesis, and visual creation tools.',
      'AI': 'Artificial intelligence models, chatbots, and autonomous agents.',
      'AI Agents': 'AI tools and autonomous agents.',
      'Development': 'Coding resources and developer tools.',
      'Resources': 'Useful materials, tools, and guides.',
      'Inspiration': 'Creative ideas and references.',
      'Wallpaper': 'High-resolution wallpapers, backgrounds, and aesthetic visuals.',
      'Stock': 'Free and premium stock photos, illustrations, and assets.',
      'Host': 'Hosting providers, cloud infrastructure, and deployment platforms.',
      'Design': 'Design tools and creative assets.',
      'Other': 'Saved bookmark for future reference.'
    }
    const smartDescription = linkData?.description || categoryDescriptions[selectedCategory] || `Saved bookmark from ${derivedTitle}.`

    const isQuick = String(selectedCategory || '').toLowerCase().includes('quick') || linkData?.collection === 'Quick Assets'
    const isSaved = String(selectedCategory || '').toLowerCase().includes('saved')
    const isAITool = String(selectedCategory || '').toLowerCase().includes('ai tool') || (linkData?.categories || []).includes('AI Tools')

    try {
      if (isAITool) {
        // Automatically add to global AI Tools directory as well
        const baseId = derivedTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'ai-tool'
        const toolId = `${baseId}-${Date.now().toString().slice(-4)}`
        
        try {
          const aiRes = await fetch(`${API_BASE_URL}/api/ai-tools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              toolId,
              name: derivedTitle,
              url: cleanUrl,
              desc: smartDescription,
              category: 'ai-tools',
              tag: 'AI Tool',
              pricing: 'FREEMIUM',
              bannerType: 'image',
              bannerUrl: linkData?.bannerUrl || '',
              isPartner: false,
              showInEssential: false
            })
          })
          
          if (!aiRes.ok) {
            const errData = await aiRes.text();
            console.error('AI Tools Sync Error:', errData);
          } else {
            // Tell AIToolsManager to refresh
            window.dispatchEvent(new CustomEvent('nexio_ai_tools_updated'));
          }
        } catch (err) {
          console.error('Failed to sync with global AI Tools directory:', err)
        }
      }

      // Save directly into MongoDB
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: derivedTitle,
          url: cleanUrl,
          category: selectedCategory || (isQuick ? 'Featured Quick Asset' : 'Saved'),
          description: smartDescription,
          collection: isQuick ? 'Quick Assets' : (isSaved ? 'Inbox' : 'All Links'),
          badge: isQuick ? (linkData?.badge || 'Free') : '',
          logoUrl: linkData?.logoUrl || '',
          bannerUrl: linkData?.bannerUrl || '',
          favorite: false,
          readLater: isSaved,
        }),
      })

      if (res.ok) {
        const savedData = await res.json()
        const newLink = {
          id: savedData.id || savedData._id || Date.now(),
          title: savedData.title,
          url: savedData.url,
          source: normalizeUrl(savedData.url).split('/')[0].replace(/^www\./, ''),
          type: savedData.category || selectedCategory || 'Saved',
          category: savedData.category || selectedCategory || 'Saved',
          collection: savedData.collection || (isQuick ? 'Quick Assets' : (isSaved ? 'Inbox' : 'All Links')),
          description: savedData.description || `Saved link for ${savedData.title}`,
          tags: [(savedData.category || selectedCategory || 'saved').toLowerCase()],
          color: '#def7ec',
          letter: savedData.title.charAt(0).toUpperCase(),
          saved: 'Just now',
          favorite: Boolean(savedData.favorite),
          readLater: Boolean(savedData.readLater) || isSaved,
          kind: isQuick ? 'quick-asset' : 'regular'
        }

        setLinks((current) => [newLink, ...current])
        setDbLinks((current) => [newLink, ...current])
        setSelected(newLink)

        setIsAdding(false)
        setRefreshTrigger((prev) => prev + 1)
        window.dispatchEvent(new CustomEvent('nexio_quick_assets_updated'))
        window.dispatchEvent(new CustomEvent('nexio_links_updated'))
        window.dispatchEvent(new CustomEvent('nexio_link_saved', { detail: newLink }))
        setFilter('All links')
        setForm({
          title: '',
          url: '',
          collection: 'Inbox',
          type: 'UI/UX',
          tags: '',
          description: '',
        })
      } else {
        const errorData = await res.json().catch(() => ({}))
        setSaveError(errorData.error || 'Could not save the link. Please check the backend.')
      }
    } catch (err) {
      console.error('Failed to save to database:', err)
      setSaveError(`Could not reach backend (${API_URL}). Please verify your connection.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  function toggleFavorite(linkId) {
    setLinks((current) =>
      current.map((item) =>
        item.id === linkId ? { ...item, favorite: !item.favorite } : item,
      ),
    )
    setSelected((current) =>
      current?.id === linkId ? { ...current, favorite: !current.favorite } : current,
    )
  }

  function openFromLanding(item) {
    setSelected(item)
    setFilter('All links')
    handleSetView('app')
  }

  async function handleImportFile(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    try {
      setImportStatus('Importing...')
      const text = await file.text()
      const parsedLinks = parseImportText(text, file.name)

      if (!parsedLinks.length) {
        setImportStatus('No links found. Use JSON or CSV with a url column.')
        return
      }

      const res = await fetch(`${API_URL}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: parsedLinks }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        setImportStatus(data.error || 'Import failed.')
        return
      }

      await fetchLinks()
      setRefreshTrigger((prev) => prev + 1)
      setFilter('All links')
      setImportStatus(`Imported ${data.imported || 0} links. Skipped ${data.skipped || 0} duplicates.`)
    } catch (error) {
      console.error('Import failed:', error)
      setImportStatus('Import failed. Check the file format.')
    }
  }

  async function handleExport(format) {
    try {
      setImportStatus(`Exporting ${format.toUpperCase()}...`)
      const res = await fetch(`${API_URL}/export?format=${format}`)

      if (!res.ok) {
        setImportStatus('Export failed. Please check the backend.')
        return
      }

      const blob = await res.blob()
      const date = new Date().toISOString().slice(0, 10)
      downloadBlob(blob, `nexio-links-${date}.${format}`)
      setImportStatus(`Exported ${format.toUpperCase()} file.`)
    } catch (error) {
      console.error('Export failed:', error)
      setImportStatus('Export failed. Please check the backend.')
    }
  }

  const selectedUrl = selected ? withProtocol(selected.url) : ''

  return (
    <>
      {view === 'login' ? (
        <LoginPage
          onBack={() => handleSetView('landing')}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : view === 'landing' ? (
        <>
          <Header
            currentView="landing"
            onNavigate={(target) => {
              if (target === 'landing') window.scrollTo({ top: 0, behavior: 'smooth' })
              else if (target === 'design') handleSetView('design')
              else if (target === 'ai-tools') handleSetView('ai-tools')
              else if (target === 'editing') handleSetView('editing')
              else if (target === 'app') handleSetView('app')
            }}
            onAddLink={handleAddLink}
            user={user}
            onLogin={() => handleSetView('login')}
            onLogout={handleLogout}
          />
          
          <Hero onNavigate={handleSetView} onAddLink={handleAddLink} />
          <CategoryNav refreshTrigger={refreshTrigger} onAddLink={handleAddLink} onNavigateToAITools={() => handleSetView('ai-tools')} />
          <FeaturedQuickAssets />
          <EssentialAITools onNavigateToDesign={() => handleSetView('ai-tools')} />
          <LinksSection savedLinks={dbLinks} onAddLink={handleAddLink} />
          <GoogleSection savedLinks={dbLinks} onAddLink={handleAddLink} />
          <AnimatedConnect01 />
          <NewsletterSection />
          <Footer onNavigate={handleSetView} />
        </>
      ) : view === 'app' ? (
        <DashboardPage
          onBack={() => handleSetView('landing')}
          onAddLink={handleAddLink}
          onLogout={handleLogout}
          onNavigateToEditing={() => handleSetView('editing')}
        />
      ) : view === 'ai-tools' ? (
        <AIToolsPage 
          onBackToHome={() => handleSetView('landing')} 
          onNavigateToDesign={() => handleSetView('design')}
          onNavigateToDashboard={() => handleSetView('app')}
          onAddLink={handleAddLink}
          user={user}
          onLogin={() => handleSetView('login')}
          onLogout={handleLogout}
        />
      ) : view === 'editing' ? (
        <EditingPage
          onBack={() => handleSetView('landing')}
          onNavigateToDesign={() => handleSetView('design')}
          onNavigateToAITools={() => handleSetView('ai-tools')}
          onNavigateToDashboard={() => handleSetView('app')}
          onAddLink={handleAddLink}
          user={user}
          onLogin={() => handleSetView('login')}
          onLogout={handleLogout}
        />
      ) : (
        <DesignPage 
          onBack={() => handleSetView('landing')} 
          onNavigateToAITools={() => handleSetView('ai-tools')}
          onNavigateToDashboard={() => handleSetView('app')}
          onAddLink={handleAddLink}
          user={user}
          onLogin={() => handleSetView('login')}
          onLogout={handleLogout}
        />
      )}

      <SaveLinkModal
        isOpen={isAdding}
        onClose={() => {
          setIsAdding(false)
          setSaveError('')
        }}
        onSave={handleSaveLinkModal}
        saveError={saveError}
        onClearError={() => setSaveError('')}
        isSubmitting={isSubmitting}
      />
    </>
  )
}

