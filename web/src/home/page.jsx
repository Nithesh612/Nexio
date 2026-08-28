import { useEffect, useMemo, useState } from 'react'

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

export default function Home() {
  const [view, setView] = useState('landing')
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All links')
  const [isAdding, setIsAdding] = useState(false)
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
      const res = await fetch(`/links`)
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.id || item._id,
            title: item.title,
            url: item.url,
            source: normalizeUrl(item.url).split('/')[0].replace(/^www\./, ''),
            type: item.category || 'UI/UX',
            collection: 'Inbox',
            description: item.description || `Saved link for ${item.title}`,
            tags: [item.category ? item.category.toLowerCase() : 'ui/ux'],
            color: '#def7ec',
            letter: item.title.charAt(0).toUpperCase(),
            saved: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
            favorite: false,
            readLater: true,
          }))
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

  function updateForm(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function saveLink(event) {
    event.preventDefault()

    const cleanUrl = normalizeUrl(form.url)
    if (!cleanUrl) return

    const derivedTitle = formatTitleFromUrl(cleanUrl)
    const selectedCategory = form.type || 'UI/UX'

    try {
      // Save directly into MongoDB
      const res = await fetch(`/save-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: derivedTitle,
          url: cleanUrl,
          category: selectedCategory,
          description: `Saved link for ${derivedTitle}.`,
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
        setSelected(newLink)
      } else {
        // Fallback local save
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
      }
    } catch (err) {
      console.error('Failed to save to database:', err)
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
    }

    setIsAdding(false)
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

  const selectedUrl = selected ? withProtocol(selected.url) : ''

  if (view === 'landing') {
    return (
      <main className="landing-page">
        <header className="landing-nav">
          <div className="brand">
            <div className="brand-mark">L</div>
            <div>
              <p>Link Vault</p>
              <span>Personal URL library</span>
            </div>
          </div>
          <nav aria-label="Landing navigation">
            <a href="#all-tools">All tools</a>
            <a href="#features">Features</a>
            <a href="#workflow">Workflow</a>
            <button type="button" onClick={() => setIsAdding(true)}>
              Add link
            </button>
            <button type="button" onClick={() => setView('app')}>
              Open workspace
            </button>
          </nav>
        </header>

        <section className="landing-hero">
          <div className="hero-copy">
            <span className="eyebrow">Save, analyze, organize</span>
            <h1>One clean home for every useful link you collect.</h1>
            <p>
              Store URLs with context, tags, collections, favorites, and notes. When you select a saved
              item, the original page opens in a focused side panel for quick review.
            </p>
            <div className="hero-actions">
              <button type="button" onClick={() => setIsAdding(true)}>
                Add URL
              </button>
              <a href="#features">See features</a>
            </div>
          </div>

          <div className="hero-product" aria-label="Link Vault preview">
            <div className="mini-window">
              <div className="window-bar">
                <span />
                <span />
                <span />
              </div>
              <div className="mini-layout">
                <div className="mini-list">
                  {initialLinks.slice(0, 3).map((item) => (
                    <div className="mini-row" key={item.id}>
                      <div style={{ backgroundColor: item.color }}>{item.letter}</div>
                      <section>
                        <strong>{item.title}</strong>
                        <small>{item.collection}</small>
                      </section>
                    </div>
                  ))}
                </div>
                <div className="mini-preview">
                  <span>Preview</span>
                  <h2>{initialLinks[0].source}</h2>
                  <p>{initialLinks[0].description}</p>
                  <button type="button" onClick={() => setView('app')}>
                    Open original URL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-tools" id="all-tools">
          <div className="section-heading">
            <span className="eyebrow">All tools and links</span>
            <h2>Browse the saved library before you open the workspace.</h2>
            <button className="section-add" type="button" onClick={() => setIsAdding(true)}>
              Add new
            </button>
          </div>
          <div className="tool-grid">
            {links.map((item) => (
              <a
                className="tool-card"
                key={item.id}
                href={withProtocol(item.url)}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Favicon url={item.url} letter={item.letter} color={item.color} className="tool-icon" />
                <h3>{item.title}</h3>
              </a>
            ))}
          </div>
        </section>

        <section className="landing-features" id="features">
          <article>
            <span>01</span>
            <h2>Capture details</h2>
            <p>Add URL, title, type, collection, tags, and notes so a link stays useful later.</p>
          </article>
          <article>
            <span>02</span>
            <h2>Find faster</h2>
            <p>Search across saved links and filter by inbox, favorites, read later, or collection.</p>
          </article>
          <article>
            <span>03</span>
            <h2>Preview in place</h2>
            <p>Click any item to open its original URL inside the side panel with a backup open button.</p>
          </article>
        </section>

        <section className="landing-workflow" id="workflow">
          <div>
            <span className="eyebrow">Simple workflow</span>
            <h2>Drop links in first. Organize them when you are ready.</h2>
          </div>
          <button type="button" onClick={() => setView('app')}>
            Go to dashboard
          </button>
        </section>

        {isAdding && (
          <div className="modal-backdrop" role="presentation" onClick={() => setIsAdding(false)}>
            <form className="link-modal" onSubmit={saveLink} onClick={(event) => event.stopPropagation()}>
              <div className="modal-title">
                <div>
                  <p>New item</p>
                  <h2>Save a useful link</h2>
                </div>
                <button type="button" title="Close" onClick={() => setIsAdding(false)}>
                  x
                </button>
              </div>

              <label>
                URL
                <input
                  required
                  type="url"
                  placeholder="https://example.com/article"
                  value={form.url}
                  onChange={(event) => updateForm('url', event.target.value)}
                />
              </label>

              {form.url.trim() && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
                  <Favicon url={form.url} letter={formatTitleFromUrl(form.url).charAt(0)} color="#def7ec" className="tool-icon" />
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#1e293b' }}>
                      {formatTitleFromUrl(form.url)}
                    </strong>
                    <small style={{ color: '#64748b', fontSize: '12px' }}>Auto-detected Title & Logo</small>
                  </div>
                </div>
              )}

              <label>
                Category
                <select
                  value={form.type}
                  onChange={(event) => updateForm('type', event.target.value)}
                >
                  {linkTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>

              <button className="submit-link" type="submit">
                Save link
              </button>
            </form>
          </div>
        )}
      </main>
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

      {isAdding && (
        <div className="modal-backdrop" role="presentation" onClick={() => setIsAdding(false)}>
          <form className="link-modal" onSubmit={saveLink} onClick={(event) => event.stopPropagation()}>
            <div className="modal-title">
              <div>
                <p>New item</p>
                <h2>Save a useful link</h2>
              </div>
              <button type="button" title="Close" onClick={() => setIsAdding(false)}>
                x
              </button>
            </div>

            <label>
              URL
              <input
                required
                type="url"
                placeholder="https://example.com/article"
                value={form.url}
                onChange={(event) => updateForm('url', event.target.value)}
              />
            </label>

            {form.url.trim() && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
                <Favicon url={form.url} letter={formatTitleFromUrl(form.url).charAt(0)} color="#def7ec" className="tool-icon" />
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#1e293b' }}>
                    {formatTitleFromUrl(form.url)}
                  </strong>
                  <small style={{ color: '#64748b', fontSize: '12px' }}>Auto-detected Title & Logo</small>
                </div>
              </div>
            )}

            <label>
              Category
              <select
                value={form.type}
                onChange={(event) => updateForm('type', event.target.value)}
              >
                {linkTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>

            <button className="submit-link" type="submit">
              Save link
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

