import { useEffect, useMemo, useState } from 'react'
import Hero from './hero'
import CategoryNav from './CategoryNav'
import LinksSection from './links'
import SaveLinkModal from './SaveLinkModal'
import DashboardPage from '../dashbord/page'
import AnimatedConnect01 from '../components/fonts/animation/animated-ai-saas-integrations-connect-flow'
import LatestModels from './LatestModels'
import { API_URL } from '../config/api'

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
  const [view, setView] = useState('landing')

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
      const res = await fetch(API_URL)
      if (res.ok) {
        const data = await res.json()
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
          setDbLinks(formatted)
          setLinks([...formatted, ...initialLinks])
          setSelected(formatted[0])
        } else {
          setLinks(initialLinks)
          setSelected(initialLinks[0])
        }
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
        (filter === 'Favorites' && item.favorite) ||
        (filter === 'Saved' && item.collection === 'Saved') ||
        
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

    // Check if link already exists in state
    const isAlreadySaved = links.some((l) => {
      const existingClean = normalizeUrl(l.url || '')
      return existingClean === cleanUrl || existingClean.replace(/^www\./i, '') === cleanUrl.replace(/^www\./i, '')
    })

    if (isAlreadySaved) {
      setSaveError('This link is already saved! You cannot add duplicate links.')
      setIsSubmitting(false)
      return
    }

    const derivedTitle = linkData?.title || form.title || formatTitleFromUrl(cleanUrl)
    const selectedCategory = linkData?.category || form.type || 'UI/UX'

    const categoryDescriptions = {
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

    try {
      // Save directly into MongoDB
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: derivedTitle,
          url: cleanUrl,
          category: selectedCategory.replace('Saved, ', '').replace(', Saved', '').replace('Saved', '') || 'General',
          description: smartDescription,
          collection: selectedCategory.includes('Saved') ? 'Inbox' : 'All Links',
        }),
      })

      if (res.ok) {
        const savedData = await res.json()
        const newLink = {
          id: savedData.id || savedData._id || Date.now(),
          title: savedData.title,
          url: savedData.url,
          source: normalizeUrl(savedData.url).split('/')[0].replace(/^www\./, ''),
          type: savedData.category,
          collection: savedData.collection || (selectedCategory.includes('Saved') ? 'Inbox' : 'All Links'),
          description: savedData.description || `Saved link for ${savedData.title}`,
          tags: [savedData.category ? savedData.category.toLowerCase() : 'ui/ux'],
          color: '#def7ec',
          letter: savedData.title.charAt(0).toUpperCase(),
          saved: 'Just now',
          favorite: false,
          readLater: true,
        }

        setLinks((current) => [newLink, ...current])
        setDbLinks((current) => [newLink, ...current])
        setSelected(newLink)

        setIsAdding(false)
        setRefreshTrigger((prev) => prev + 1)
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
      setSaveError('Could not reach the backend. Please ensure the server is running.')
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
    setView('app')
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
      {view === 'landing' ? (
        <>
          <Hero
            setIsAdding={setIsAdding}
            setView={setView}
            onImport={handleImportFile}
            onExport={handleExport}
          />
          <CategoryNav refreshTrigger={refreshTrigger} onAddLink={() => setIsAdding(true)} />
          <LinksSection savedLinks={dbLinks} onAddLink={() => setIsAdding(true)} />
          <LatestModels />
          <AnimatedConnect01 />
        </>
      ) : (
        <DashboardPage onBack={() => setView('landing')} onAddLink={() => setIsAdding(true)} />
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

