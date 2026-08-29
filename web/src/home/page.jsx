import { useEffect, useMemo, useState } from 'react'
import Hero from './hero'
import CategoryNav from './CategoryNav'
import LinksSection from './links'
import SaveLinkModal from './SaveLinkModal'

const API_URL = 'http://localhost:5000/hub'

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

const sidebarFilters = ['All links', 'Inbox', 'Favorites', 'Read later']
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
    collection: 'Inbox',
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
              collection: 'Inbox',
              description: smartDesc,
              tags: [item.category ? item.category.toLowerCase() : 'ui/ux'],
              color: '#def7ec',
              letter: item.title.charAt(0).toUpperCase(),
              saved: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
              favorite: false,
              readLater: true,
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
        (filter === 'Inbox' && item.collection === 'Inbox') ||
        (filter === 'Read later' && item.readLater) ||
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

    const derivedTitle = linkData?.title || form.title || formatTitleFromUrl(cleanUrl)
    const selectedCategory = linkData?.category || form.type || 'UI/UX'

    const categoryDescriptions = {
      'UI/UX': 'Design and interface inspiration.',
      'AI Agents': 'AI tools and autonomous agents.',
      'Development': 'Coding resources and developer tools.',
      'Resources': 'Useful materials and guides.',
      'Inspiration': 'Creative ideas and references.',
      'Other': 'Saved bookmark for future reference.'
    }
    const smartDescription = categoryDescriptions[selectedCategory] || `Saved bookmark from ${derivedTitle}.`

    try {
      // Save directly into MongoDB
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: derivedTitle,
          url: cleanUrl,
          category: selectedCategory,
          description: smartDescription,
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
          collection: 'Inbox',
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

        if (savedData.docSaved === false) {
          setSaveError(`Saved in app, but Google Doc failed: ${savedData.docError || 'Unknown error'}`)
          return
        }
      } else {
        const errorData = await res.json().catch(() => ({}))
        setSaveError(errorData.error || 'Could not save the link. Please check the backend.')
        // Fallback local save
        const fallbackLink = {
          id: Date.now(),
          title: derivedTitle,
          url: cleanUrl,
          source: cleanUrl.split('/')[0].replace(/^www\./, ''),
          type: selectedCategory,
          collection: 'Inbox',
          description: smartDescription,
          tags: [selectedCategory.toLowerCase()],
          color: '#def7ec',
          letter: derivedTitle.charAt(0).toUpperCase(),
          saved: 'Just now',
          favorite: false,
          readLater: true,
        }
        setLinks((current) => [fallbackLink, ...current])
        setSelected(fallbackLink)
      }
    } catch (err) {
      console.error('Failed to save to database:', err)
      setSaveError('Could not reach the backend. Link is shown locally only.')
      const fallbackLink = {
        id: Date.now(),
        title: derivedTitle,
        url: cleanUrl,
        source: cleanUrl.split('/')[0].replace(/^www\./, ''),
        type: selectedCategory,
        collection: 'Inbox',
        description: `Saved link for ${derivedTitle}.`,
        tags: [selectedCategory.toLowerCase()],
        color: '#def7ec',
        letter: derivedTitle.charAt(0).toUpperCase(),
        saved: 'Just now',
        favorite: false,
        readLater: true,
      }
      setLinks((current) => [fallbackLink, ...current])
      setSelected(fallbackLink)
    } finally {
      setIsSubmitting(false)
    }

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

  if (view === 'landing') {
    return (
      <>
        <Hero
          setIsAdding={setIsAdding}
          setView={setView}
          onImport={handleImportFile}
          onExport={handleExport}
        />
        <CategoryNav refreshTrigger={refreshTrigger} onAddLink={() => setIsAdding(true)} />
        <LinksSection savedLinks={dbLinks} />

        <SaveLinkModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          onSave={handleSaveLinkModal}
          saveError={saveError}
          isSubmitting={isSubmitting}
        />
      </>
    )
  }

  return (
    <main className="link-app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">L</div>
          <div>
            <p>Link Vault</p>
            <span>{links.length} saved links</span>
          </div>
        </div>

        <button className="save-button" type="button" onClick={() => setIsAdding(true)}>
          <span>+</span>
          Save new link
        </button>

        <nav className="nav-block" aria-label="Library filters">
          <p>Library</p>
          {sidebarFilters.map((item) => (
            <button
              className={filter === item ? 'nav-item active' : 'nav-item'}
              key={item}
              type="button"
              onClick={() => setFilter(item)}
            >
              <span>{item === 'All links' ? '#' : item.charAt(0)}</span>
              {item}
            </button>
          ))}
        </nav>

        <div className="nav-block">
          <p>Collections</p>
          {collections.map((item) => (
            <button
              className={filter === item ? 'nav-item active' : 'nav-item'}
              key={item}
              type="button"
              onClick={() => setFilter(item)}
            >
              <i />
              {item}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="avatar">N</div>
          <div>
            <strong>Workspace</strong>
            <span>Personal library</span>
          </div>
          <div className="backup-actions">
            <label className="backup-button">
              Import
              <input
                type="file"
                accept=".json,.csv,application/json,text/csv"
                onChange={handleImportFile}
              />
            </label>
            <button type="button" className="backup-button" onClick={() => handleExport('json')}>
              JSON
            </button>
            <button type="button" className="backup-button" onClick={() => handleExport('csv')}>
              CSV
            </button>
            {importStatus && <p className="backup-status">{importStatus}</p>}
          </div>
        </div>
      </aside>

      <section className="library-panel">
        <header className="topbar">
          <div>
            <p>Saved knowledge</p>
            <h1>Organize every useful URL in one calm place.</h1>
          </div>
          <div className="topbar-actions">
            <button type="button" title="Compact view">=</button>
            <button type="button" title="Grid view">::</button>
          </div>
        </header>

        <div className="toolbar">
          <label className="search-box">
            <span>Search</span>
            <input
              type="search"
              placeholder="Search links, tags, notes..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            {[...sidebarFilters, ...collections].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="quick-stats">
          <article>
            <strong>{links.length}</strong>
            <span>Total links</span>
          </article>
          <article>
            <strong>{links.filter((item) => item.favorite).length}</strong>
            <span>Favorites</span>
          </article>
          <article>
            <strong>{new Set(links.flatMap((item) => item.tags)).size}</strong>
            <span>Tags</span>
          </article>
        </div>

        <div className="list-header">
          <span>{displayedLinks.length} items</span>
          <span>Click any row to preview the original URL</span>
        </div>

        <div className="link-list">
          {displayedLinks.map((item) => (
            <article
              className={selected?.id === item.id ? 'link-row selected' : 'link-row'}
              key={item.id}
              onClick={() => setSelected(item)}
            >
              <Favicon url={item.url} letter={item.letter} color={item.color} className="thumb" />
              <div className="link-content">
                <div className="link-title-row">
                  <h2>{item.title}</h2>
                  <span>{item.saved}</span>
                </div>
                <p>{item.description}</p>
                <div className="metadata">
                  <span>{item.type}</span>
                  <span>{item.collection}</span>
                  <span>{item.url}</span>
                </div>
                <div className="tag-row">
                  {item.tags.map((tag) => (
                    <small key={tag}>#{tag}</small>
                  ))}
                </div>
              </div>
              <button
                className={item.favorite ? 'favorite active' : 'favorite'}
                type="button"
                title="Favorite"
                onClick={(event) => {
                  event.stopPropagation()
                  toggleFavorite(item.id)
                }}
              >
                *
              </button>
            </article>
          ))}

          {displayedLinks.length === 0 && (
            <div className="empty-state">
              <h2>No links found</h2>
              <p>Try a different search or save a fresh link to this collection.</p>
            </div>
          )}
        </div>
      </section>

      <aside className="preview-panel">
        {selected ? (
          <>
            <div className="preview-header">
              <Favicon url={selected.url} letter={selected.letter} color={selected.color} className="preview-thumb" />
              <button type="button" title="Close preview" onClick={() => setSelected(null)}>
                x
              </button>
            </div>

            <div className="preview-copy">
              <span>{selected.type}</span>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>

            <div className="preview-meta">
              <div>
                <small>Source</small>
                <strong>{selected.source}</strong>
              </div>
              <div>
                <small>Collection</small>
                <strong>{selected.collection}</strong>
              </div>
              <div>
                <small>Saved</small>
                <strong>{selected.saved}</strong>
              </div>
            </div>

            <div className="preview-tags">
              {selected.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <a className="open-link" href={selectedUrl} target="_blank" rel="noreferrer">
              Open original URL
            </a>

            <div className="browser-frame">
              <img src={`https://image.thum.io/get/width/800/crop/800/${selectedUrl}`} alt={selected.title} style={{ width: "100%", height: "100%", objectFit: "cover", border: "none" }} />
            </div>
          </>
        ) : (
          <div className="empty-preview">
            <h2>Select a link</h2>
            <p>The saved URL will open here in the side panel when the site allows embedding.</p>
          </div>
        )}
      </aside>

      <SaveLinkModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        onSave={handleSaveLinkModal}
        saveError={saveError}
        isSubmitting={isSubmitting}
      />
    </main>
  )
}

