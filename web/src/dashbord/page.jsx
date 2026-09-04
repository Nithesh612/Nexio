import { useEffect, useMemo, useState } from 'react'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
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
  Inbox,
  Link2,
  LayoutGrid,
  Palette,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
} from 'lucide-react'

GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const API_URL = 'http://localhost:5000/hub'

const stats = [
  { label: 'Total Links', value: '128', delta: '+ 12%', accent: '#7d4ae8', icon: LinkIcon },
  { label: 'Saved', value: '24', delta: '+ 8%', accent: '#f4c849', icon: StarIcon },
  { label: 'Type', value: '0', delta: '+ 15%', accent: '#57c89d', icon: TagIcon },
  { label: 'Favorites', value: '0', delta: '+ 6%', accent: '#f4c849', icon: StarIcon },
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

function getHostname(url) {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./i, '')
  } catch {
    return ''
  }
}

function getFaviconUrl(url) {
  const hostname = getHostname(url)
  return hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=128` : ''
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
  const columns = [
    { label: 'TITLE', x: 68, width: 150, key: 'title' },
    { label: 'CATEGORY', x: 205, width: 120, key: 'category' },
    { label: 'LINK', x: 330, width: 320, key: 'url' },
    { label: 'DESCRIPTION', x: 655, width: 125, key: 'description' },
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

  const commands = [
    'BT',
    '/F1 24 Tf',
    '68 548 Td',
    '(Nexio Links Export) Tj',
    '/F1 11 Tf',
    '0.42 0.46 0.54 rg',
    '0 -22 Td',
    '(Your saved links, organized by title and category.) Tj',
    'ET',
    'q',
    '0.94 0.95 0.97 rg',
    '56 465 730 34 re f',
    'Q',
    'BT',
    '/F1 9 Tf',
    '0.38 0.42 0.49 rg',
    ...columns.map((column) => `1 0 0 1 ${column.x} 478 Tm (${column.label}) Tj`),
    'ET',
  ]

  links.slice(0, 10).forEach((item, rowIndex) => {
    const y = 445 - rowIndex * 42
    commands.push('q', '0.88 0.89 0.92 RG', '0.6 w', `56 ${y - 28} 730 42 re S`, 'Q')
    commands.push('BT', '/F1 9 Tf')
    columns.forEach((column) => {
      commands.push(column.key === 'url' ? '0.35 0.31 0.95 rg' : '0.12 0.16 0.22 rg')
      wrapText(item[column.key], Math.floor(column.width / 6)).forEach((line, lineIndex) => {
        commands.push(`1 0 0 1 ${column.x} ${y - lineIndex * 12} Tm (${escapePdfText(line)}) Tj`)
      })
    })
    commands.push('ET')
  })

  commands.push('BT', '/F1 10 Tf', '0.55 0.58 0.64 rg', `1 0 0 1 68 ${Math.max(40, 420 - links.slice(0, 10).length * 42)} Tm (${links.length} saved link${links.length === 1 ? '' : 's'}) Tj`, 'ET')

  const stream = commands.join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]
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
    description: getLiveDescription(item, title, category),
    meta: [category],
    date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
    accent: category.toLowerCase().includes('design') ? '#f26c5c' : '#6d5df6',
    label: title.charAt(0).toUpperCase(),
    icon,
    category,
    favorite: Boolean(item.favorite),
    readLater: Boolean(item.readLater),
    collection: item.collection || 'All Links',
  }
}

function LinkIcon({ className }) {
  return <div className={className}><Link2 size={18} /></div>
}

function StarIcon({ className }) {
  return <div className={className}><Star size={18} fill="none" strokeWidth={2.5} /></div>
}

function TagIcon({ className }) {
  return <div className={className}><BookmarkCheck size={18} /></div>
}

function InboxIcon({ className }) {
  return <div className={className}><Inbox size={18} /></div>
}

const navItems = [
  { label: 'All Links', icon: LayoutGrid },
  { label: 'Dashboard', icon: FolderKanban },
  { label: 'Saved', icon: Inbox },
  { label: 'Favorites', icon: Star },
]

export default function DashboardPage({ onBack }) {
  const [activeNav, setActiveNav] = useState('All Links')
  const [currentPage, setCurrentPage] = useState(1)
  const [status, setStatus] = useState('')
  const [liveLinks, setLiveLinks] = useState([])
  const [isLoadingLinks, setIsLoadingLinks] = useState(true)
  const [linksError, setLinksError] = useState('')
  const [savePulseId, setSavePulseId] = useState(null)
  const [favoritePulseId, setFavoritePulseId] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const cardsPerPage = 8

  useEffect(() => {
    let isActive = true

    async function loadLiveLinks() {
      try {
        setIsLoadingLinks(true)
        setLinksError('')
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Unable to fetch links')
        const data = await response.json()
        if (isActive) setLiveLinks(Array.isArray(data) ? data.map(mapLiveLink) : [])
      } catch (error) {
        if (isActive) setLinksError('Could not load live links from MongoDB.')
      } finally {
        if (isActive) setIsLoadingLinks(false)
      }
    }

    loadLiveLinks()
    return () => { isActive = false }
  }, [])

  const filteredLinks = useMemo(() => {
    if (activeNav === 'All Links' || activeNav === 'Dashboard') {
      return liveLinks
    }

    if (activeNav === 'Favorites') {
      return liveLinks.filter((item) => item.favorite)
    }

    if (activeNav === 'Saved') {
      return liveLinks.filter((item) => item.collection === 'Inbox')
    }

    return liveLinks
  }, [activeNav, liveLinks])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeNav])

  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / cardsPerPage))
  const visibleLinks = filteredLinks.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  )
  const isDashboardView = activeNav === 'Dashboard'

  const liveStats = useMemo(() => {
    const savedCount = liveLinks.filter((item) => item.collection === 'Inbox').length
    const favoriteCount = liveLinks.filter((item) => item.favorite).length
    const totalCount = liveLinks.length
    const typeCount = new Set(liveLinks.map((item) => item.category).filter(Boolean)).size

    return stats.map((stat, index) => ({
      ...stat,
      value: String(index === 0 ? totalCount : index === 1 ? savedCount : index === 2 ? typeCount : favoriteCount),
    }))
  }, [liveLinks])

  const handleToggleSaved = async (linkId) => {
    const selectedLink = liveLinks.find((item) => item.id === linkId)
    if (!selectedLink) return

    const isSaved = selectedLink.collection === 'Inbox'
    const nextCollection = isSaved ? 'All Links' : 'Inbox'
    setSavePulseId(linkId)
    window.setTimeout(() => setSavePulseId(null), 450)
    setLiveLinks((current) => current.map((item) => (
      item.id === linkId
        ? { ...item, collection: nextCollection }
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
          readLater: selectedLink.readLater,
        }),
      })

      if (!response.ok) throw new Error('Save update failed')
      setStatus(isSaved ? `${selectedLink.title} removed from Saved.` : `${selectedLink.title} added to Saved.`)
    } catch {
      setLiveLinks((current) => current.map((item) => (
        item.id === linkId ? { ...item, collection: selectedLink.collection } : item
      )))
      setStatus('Could not update Saved in MongoDB.')
    }
  }

  const handleToggleFavorite = async (linkId) => {
    const selectedLink = liveLinks.find((item) => item.id === linkId)
    if (!selectedLink) return

    const nextFavorite = !selectedLink.favorite
    setFavoritePulseId(linkId)
    window.setTimeout(() => setFavoritePulseId(null), 450)
    setLiveLinks((current) => current.map((item) => (
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
      setStatus(nextFavorite ? `${selectedLink.title} added to Favorites.` : `${selectedLink.title} removed from Favorites.`)
    } catch {
      setLiveLinks((current) => current.map((item) => (
        item.id === linkId ? { ...item, favorite: selectedLink.favorite } : item
      )))
      setStatus('Could not update Favorites in MongoDB.')
    }
  }

  const handleOpenService = (url) => {
    const targetUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  const handleEditService = async (item) => {
    const title = window.prompt('Edit title', item.title)
    if (title === null || !title.trim()) return

    const description = window.prompt('Edit description', item.description)
    if (description === null) return

    try {
      const response = await fetch(`${API_URL}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          url: item.url,
          category: item.category,
          description: description.trim(),
          collection: item.collection,
          favorite: item.favorite,
          readLater: item.readLater,
        }),
      })
      if (!response.ok) throw new Error('Edit failed')

      setLiveLinks((current) => current.map((link) => (
        link.id === item.id ? { ...link, title: title.trim(), description: description.trim() } : link
      )))
      setStatus('Link updated successfully.')
    } catch {
      setStatus('Could not update this link in MongoDB.')
    }
  }

  const handleDeleteService = async (item) => {
    if (!window.confirm(`Delete ${item.title}?`)) return

    try {
      const response = await fetch(`${API_URL}/${item.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      setLiveLinks((current) => current.filter((link) => link.id !== item.id))
      setStatus('Link deleted successfully.')
    } catch {
      setStatus('Could not delete this link from MongoDB.')
    }
  }

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
        }
        .sidebar {
          width: 250px;
          background: #ffffff;
          border-right: 1px solid rgba(15,23,42,0.08);
          padding: 22px 16px 18px;
          display: flex;
          flex-direction: column;
          gap: 16px;
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
          background: linear-gradient(135deg, #7a3ae8, #b76ef7);
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
        .new-link-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #7b45ea, #8a5ae3);
          color: white;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(123, 69, 234, 0.22);
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
          gap: 8px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          border-radius: 999px;
          color: #1f2925;
          font-size: 1rem;
          font-weight: 700;
          background: transparent;
          border: none;
          text-align: left;
          width: 100%;
        }
        .nav-item.active {
          background: #17211c;
          color: #ffffff;
        }
        .nav-item .counter {
          margin-left: auto;
          background: rgba(148, 163, 184, 0.18);
          color: #667085;
          padding: 3px 7px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .upgrade-card {
          margin-top: auto;
          border-radius: 16px;
          padding: 18px 16px 16px;
          background: rgba(132, 104, 241, 0.12);
          border: 1px solid rgba(132, 104, 241, 0.1);
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
          background: rgba(123, 69, 234, 0.12);
          color: #4b3f97;
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
          color: #7d4ae8;
        }
        .top-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .search-input-wrap {
          width: 300px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(15,23,42,0.08);
          border-radius: 12px;
          padding: 9px 12px;
          color: #6b7280;
        }
        .search-input-wrap input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          color: #111827;
        }
        .mini-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #7a5cf6);
          color: white;
          display: grid;
          place-items: center;
          font-weight: 700;
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
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(15,23,42,0.08);
          color: #374151;
          border-radius: 10px;
          padding: 9px 16px;
          font-weight: 600;
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
          color: #5d41d9;
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
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          color: var(--icon-color, #7d4ae8);
          background: rgba(125, 74, 232, 0.09);
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
        .chip-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin: 0 0 18px;
        }
        .chip {
          border: 1px solid rgba(15,23,42,0.08);
          background: rgba(255,255,255,0.45);
          color: #4b5563;
          border-radius: 8px;
          padding: 7px 12px;
          font-weight: 600;
        }
        .chip.active {
          background: #5d41d9;
          color: white;
          border-color: transparent;
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
        .list-view {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          justify-content: start;
          gap: 14px;
          padding: 0 14px 14px;
        }
        .service-card {
          display: flex;
          flex-direction: column;
          min-width: 0;
          width: 100%;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          border-radius: 18px;
          box-shadow: 0 2px 5px rgba(15, 23, 42, 0.03);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .service-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
        }
        .service-preview {
          position: relative;
          height: 140px;
          overflow: hidden;
          background: #f1f5f9;
          flex-shrink: 0;
        }
        .service-preview img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
        }
        .service-preview-fallback {
          display: none;
          width: 100%;
          height: 100%;
          place-items: center;
          background: linear-gradient(135deg, var(--dot-color), #f8fafc);
          color: #ffffff;
        }
        .service-category {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 4px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          color: #374151;
          font-size: 0.68rem;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .service-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 16px 0;
        }
        .service-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          color: #64748b;
          font-weight: 800;
          background: #ffffff;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
          flex-shrink: 0;
        }
        .service-icon.light {
          color: #202124;
        }
        .service-icon img {
          width: 22px;
          height: 22px;
          object-fit: contain;
          border-radius: 4px;
        }
        .service-icon-fallback {
          display: grid;
          place-items: center;
        }
        .service-card-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .save-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #16a34a;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .save-action:hover {
          background: rgba(22, 163, 74, 0.1);
        }
        .save-action.saved {
          color: #16a34a;
          background: rgba(22, 163, 74, 0.1);
        }
        .save-action.vibrate {
          animation: save-vibrate 450ms ease-in-out;
        }
        @keyframes save-vibrate {
          0%, 100% { transform: rotate(0) scale(1); }
          20% { transform: rotate(-12deg) scale(1.12); }
          40% { transform: rotate(12deg) scale(1.12); }
          60% { transform: rotate(-8deg) scale(1.08); }
          80% { transform: rotate(6deg) scale(1.04); }
        }
        .link-title {
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 10px 16px 4px;
          color: #111827;
          line-height: 1.3;
        }
        .link-description {
          color: #6b7280;
          font-size: 0.84rem;
          line-height: 1.45;
          margin: 0 16px 8px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          overflow: hidden;
        }
        .meta-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 16px;
        }
        .meta-tag {
          display: inline-flex;
          align-items: center;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(148, 163, 184, 0.14);
          color: #6b7280;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .date {
          color: #6366f1;
          font-weight: 600;
          font-size: 0.76rem;
          margin: 0 16px;
          text-decoration: none;
        }
        .service-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: auto;
          padding: 12px 16px;
          border-top: 1px solid #f1f5f9;
        }
        .service-open {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: none;
          background: transparent;
          color: #6366f1;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          transition: color 0.15s ease;
        }
        .service-open:hover {
          color: #4f46e5;
        }
        .card-actions-group {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .card-action {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 6px;
          border: none;
          border-radius: 6px;
          background: transparent;
          font-size: 0.76rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.15s ease, background-color 0.15s ease;
        }
        .card-action:hover {
          background: #f3f4f6;
        }
        .edit-action { color: #6366f1; }
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
          background: #5d41d9;
          border-color: #5d41d9;
          color: white;
        }
        .page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }
        @media (max-width: 1100px) {
          .dashboard-shell { flex-direction: column; }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid rgba(15,23,42,0.08); }
          .stats-grid { grid-template-columns: repeat(2, minmax(160px, 1fr)); }
          .topbar { flex-direction: column; align-items: flex-start; }
          .top-actions { width: 100%; justify-content: space-between; }
          .search-input-wrap { flex: 1; }
        }
        @media (max-width: 700px) {
          .main-content { padding: 20px 16px 24px; }
          .greeting { font-size: 1.7rem; }
          .stats-grid { grid-template-columns: 1fr; }
          .tool-row { flex-direction: column; align-items: stretch; }
          .selector { min-width: 0; }
          .list-view { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 480px) {
          .list-view { grid-template-columns: 1fr; }
          .pagination { align-items: flex-start; flex-direction: column; }
        }
      `}</style>

      <div className="dashboard-shell">
        <aside className="sidebar">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              style={{
                alignSelf: 'flex-start',
                marginBottom: '8px',
                border: '1px solid rgba(15,23,42,0.08)',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '10px',
                padding: '8px 12px',
                color: '#374151',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ← Back to home
            </button>
          )}
         

          <button className="new-link-btn" type="button">
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
                  onClick={() => setActiveNav(label)}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

        
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div className="search-input-wrap">
              <Search size={16} />
              <input placeholder="Search links, tags, notes..." />
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
              <button className="ghost-btn" type="button">
                <Bell size={16} />
              </button>
              <div className="mini-avatar">N</div>
            </div>
          </header>

          {status && (
            <div style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#1f8f5f', fontWeight: 700 }}>
              {status}
            </div>
          )}

          <div className="stats-grid">
            {liveStats.map(({ label, value, delta, accent, icon: Icon }) => (
              <div className="stat-card" key={label}>
                <div className="stat-icon" style={{ '--icon-color': accent }}>
                  <Icon className="" />
                </div>
                <div className="stat-main">
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                  <div className="stat-delta">↑ {delta}</div>
                </div>
              </div>
            ))}
          </div>
 

          {/* <div className="chip-row">
            {['All', 'Websites', 'Articles', 'Videos', 'Documents', 'Tools', 'Others'].map((item, index) => (
              <button type="button" className={`chip ${index === 0 ? 'active' : ''}`} key={item}>{item}</button>
            ))}
          </div> */}

          <section className="panel">
            <div className="panel-header">
              <span aria-hidden="true"></span>
            </div>

            <div className="list-view">
              {isLoadingLinks ? (
                <div className="service-card empty-state" style={{ gridColumn: '1 / -1' }}>
                  Loading links from MongoDB...
                </div>
              ) : linksError ? (
                <div className="service-card empty-state" style={{ gridColumn: '1 / -1', color: '#b45309' }}>
                  {linksError}
                </div>
              ) : filteredLinks.length === 0 ? (
                <div className="service-card empty-state" style={{ gridColumn: '1 / -1' }}>
                  <img src="/assets/empty/checklist.svg" alt="Empty favorites" />
                  <span>
                    {activeNav === 'Favorites'
                      ? 'No favorites links found.'
                      : activeNav === 'All Links' || activeNav === 'Dashboard'
                        ? 'No links saved in MongoDB yet.'
                        : `No ${activeNav.toLowerCase()} links found.`}
                  </span>
                </div>
              ) : visibleLinks.map((item) => (
                <article key={item.id} className="service-card">
                  <div className="service-preview" style={{ '--dot-color': item.accent }}>
                    <img
                      src={`https://api.microlink.io/?url=${encodeURIComponent(item.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                      alt={`${item.title} preview`}
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                        event.currentTarget.nextElementSibling.style.display = 'grid'
                      }}
                    />
                    <div className="service-preview-fallback">
                      <item.icon size={34} />
                    </div>
                    <span className="service-category">{item.category}</span>
                  </div>

                  <div className="service-card-top">
                    <div className={`service-icon ${item.accent === '#efefef' ? 'light' : ''}`} style={{ '--dot-color': item.accent }}>
                      <img
                        src={getFaviconUrl(item.url)}
                        alt={`${item.title} logo`}
                        onError={(event) => {
                          event.currentTarget.style.display = 'none'
                          event.currentTarget.nextElementSibling.style.display = 'grid'
                        }}
                      />
                      <span className="service-icon-fallback" style={{ display: 'none' }}>
                        <item.icon size={21} />
                      </span>
                    </div>
                    <div className="service-card-actions">
                      <button
                        type="button"
                        className={`save-action ${item.collection === 'Inbox' ? 'saved' : ''} ${savePulseId === item.id ? 'vibrate' : ''}`}
                        aria-label={item.collection === 'Inbox' ? `Remove ${item.title} from Saved` : `Save ${item.title}`}
                        title={item.collection === 'Inbox' ? 'Saved' : 'Save link'}
                        onClick={() => handleToggleSaved(item.id)}
                      >
                        <Bookmark size={17} fill={item.collection === 'Inbox' ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>

                  <div className="link-title">{item.title}</div>
                  <div className="link-description">{item.description}</div>
                  <div className="date">{new URL(item.url).hostname.replace('www.', '')}</div>
                  <div className="service-footer">
                    <button type="button" className="service-open" onClick={() => handleOpenService(item.url)}>
                      Open service <ArrowUpRight size={15} />
                    </button>
                    {isDashboardView && (
                      <div className="card-actions-group">
                        <button type="button" className="card-action edit-action" onClick={() => handleEditService(item)}>
                          <Edit2 size={13} /> Edit
                        </button>
                        <button type="button" className="card-action delete-action" onClick={() => handleDeleteService(item)}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="pagination" aria-label="Services pagination">
              <span className="pagination-info">
                Showing {filteredLinks.length === 0 ? 0 : (currentPage - 1) * cardsPerPage + 1}-{Math.min(currentPage * cardsPerPage, filteredLinks.length)} of {filteredLinks.length} services
              </span>
              <div className="pagination-actions">
                <button
                  type="button"
                  className="page-btn"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    type="button"
                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-label={`Go to page ${page}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  className="page-btn"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
