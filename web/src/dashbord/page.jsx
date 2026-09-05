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
  List,
  Palette,
  Plus,
  Search,
  Star,
  Trash2,
  Upload,
} from 'lucide-react'
import LottieAnimation from '../home/LottieAnimation'
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json'
import { API_URL } from '../config/api'
GlobalWorkerOptions.workerSrc = pdfWorkerUrl

const stats = [
  { label: 'Total Links', value: '128', delta: '+ 12%', accent: '#3b82f6', icon: Link2 },
  { label: 'Saved', value: '24', delta: '+ 8%', accent: '#f4c849', icon: Bookmark },
  { label: 'Type', value: '0', delta: '+ 15%', accent: '#57c89d', icon: LayoutGrid },
  { label: 'Favorites', value: '0', delta: '+ 6%', accent: '#f4c849', icon: Star },
]

const PREDEFINED_CATEGORIES = [
  'Saved', 'UI/UX', 'AI Image & Video', 'AI', 'Inspiration', 'Other',
  'Wallpaper', 'Stock', 'Host', 'Article', 'Research', 'Tools'
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

function getScreenshotUrl(url) {
  try {
    const clean = url.startsWith('http') ? url : `https://${url}`;
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(clean)}?w=800&h=500`;
  } catch {
    return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=800&h=500`;
  }
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
  const safeLinks = Array.isArray(links) ? links : []
  const totalPages = Math.max(1, Math.ceil(safeLinks.length / 10))

  const columns = [
    { label: 'TITLE', x: 68, width: 140, key: 'title' },
    { label: 'CATEGORY', x: 215, width: 110, key: 'category' },
    { label: 'LINK', x: 330, width: 310, key: 'url' },
    { label: 'DESCRIPTION', x: 645, width: 135, key: 'description' },
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

  // Generate stream commands for each page
  const pageStreams = []
  for (let p = 0; p < totalPages; p++) {
    const pageLinks = safeLinks.slice(p * 10, (p + 1) * 10)
    const pageNumber = p + 1

    const commands = [
      'BT',
      '/F1 20 Tf',
      '68 550 Td',
      `(${escapePdfText('Nexio Links Export')}${totalPages > 1 ? ` - Page ${pageNumber} of ${totalPages}` : ''}) Tj`,
      '/F1 10 Tf',
      '0.42 0.46 0.54 rg',
      '0 -18 Td',
      '(Your saved links, organized by title and category.) Tj',
      'ET',
      'q',
      '0.94 0.95 0.97 rg',
      '56 475 730 30 re f',
      'Q',
      'BT',
      '/F1 9 Tf',
      '0.38 0.42 0.49 rg',
      ...columns.map((column) => `1 0 0 1 ${column.x} 486 Tm (${column.label}) Tj`),
      'ET',
    ]

    pageLinks.forEach((item, rowIndex) => {
      const y = 450 - rowIndex * 40
      commands.push('q', '0.88 0.89 0.92 RG', '0.6 w', `56 ${y - 26} 730 40 re S`, 'Q')
      commands.push('BT', '/F1 9 Tf')
      columns.forEach((column) => {
        commands.push(column.key === 'url' ? '0.25 0.25 0.85 rg' : '0.12 0.16 0.22 rg')
        wrapText(item[column.key], Math.floor(column.width / 6)).forEach((line, lineIndex) => {
          commands.push(`1 0 0 1 ${column.x} ${y - lineIndex * 12} Tm (${escapePdfText(line)}) Tj`)
        })
      })
      commands.push('ET')
    })

    commands.push(
      'BT',
      '/F1 9 Tf',
      '0.55 0.58 0.64 rg',
      `1 0 0 1 68 25 Tm (Page ${pageNumber} of ${totalPages}  |  Total: ${safeLinks.length} saved link${safeLinks.length === 1 ? '' : 's'}) Tj`,
      'ET'
    )

    pageStreams.push(commands.join('\n'))
  }

  // Multi-page PDF Object hierarchy
  const kids = []
  for (let p = 0; p < totalPages; p++) {
    kids.push(`${4 + p * 2} 0 R`)
  }

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    `<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${totalPages} >>`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  for (let p = 0; p < totalPages; p++) {
    const stream = pageStreams[p]
    const pageObj = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 842 595] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5 + p * 2} 0 R >>`
    const streamObj = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`
    objects.push(pageObj)
    objects.push(streamObj)
  }

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

export default function DashboardPage({ onBack, onAddLink }) {
  const [activeNav, setActiveNav] = useState('All Links')
  const [currentPage, setCurrentPage] = useState(1)
  const [status, setStatus] = useState('')
  const [liveLinks, setLiveLinks] = useState([])
  const [isLoadingLinks, setIsLoadingLinks] = useState(true)
  const [linksError, setLinksError] = useState('')
  const [savePulseId, setSavePulseId] = useState(null)
  const [favoritePulseId, setFavoritePulseId] = useState(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [activeFilter, setActiveFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [itemToDelete, setItemToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [itemToEdit, setItemToEdit] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', url: '', category: '' })
  const [isEditing, setIsEditing] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
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

  const availableCategories = useMemo(() => {
    const cats = new Set()
    liveLinks.forEach((l) => {
      if (l.category) {
        l.category.split(',').forEach(c => cats.add(c.trim()))
      }
    })
    return ['All', ...Array.from(cats)]
  }, [liveLinks])

  const filteredLinks = useMemo(() => {
    let base = liveLinks

    if (activeNav === 'Favorites') {
      base = base.filter((item) => item.favorite)
    } else if (activeNav === 'Saved') {
      base = base.filter((item) => 
        (item.category && item.category.toLowerCase().includes('saved')) ||
        item.collection === 'Inbox' ||
        item.readLater === true ||
        (item.meta && item.meta.some(m => m && m.toLowerCase().includes('saved')))
      )
    }

    if (activeFilter !== 'All') {
      base = base.filter((item) => {
        if (!item.category) return false
        const itemCats = item.category.split(',').map(c => c.trim())
        return itemCats.includes(activeFilter)
      })
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      base = base.filter((item) =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.url && item.url.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q))
      )
    }

    return base
  }, [activeNav, activeFilter, searchQuery, liveLinks])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeNav, activeFilter, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredLinks.length / cardsPerPage))
  const visibleLinks = filteredLinks.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage,
  )
  const isDashboardView = activeNav === 'Dashboard'

  const liveStats = useMemo(() => {
    const savedCount = liveLinks.filter((item) => 
      (item.category && item.category.toLowerCase().includes('saved')) ||
      item.collection === 'Inbox' ||
      item.readLater === true ||
      (item.meta && item.meta.some(m => m && m.toLowerCase().includes('saved')))
    ).length
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

  const handleEditService = (item) => {
    setItemToEdit(item)
    setEditForm({ 
      title: item.title || '', 
      description: item.description || '',
      url: item.url || '',
      category: item.category || ''
    })
  }

  const confirmEdit = async (e) => {
    e.preventDefault()
    if (!itemToEdit || !editForm.title.trim()) return
    setIsEditing(true)
    try {
      const response = await fetch(`${API_URL}/${itemToEdit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editForm.title.trim(),
          url: editForm.url.trim(),
          category: editForm.category.trim(),
          description: editForm.description.trim(),
          collection: itemToEdit.collection,
          favorite: itemToEdit.favorite,
          readLater: itemToEdit.readLater,
        }),
      })
      if (!response.ok) throw new Error('Edit failed')

      setLiveLinks((current) => current.map((link) => (
        link.id === itemToEdit.id ? { 
          ...link, 
          title: editForm.title.trim(), 
          description: editForm.description.trim(),
          url: editForm.url.trim(),
          category: editForm.category.trim()
        } : link
      )))
      setStatus('Link updated successfully.')
    } catch {
      setStatus('Could not update this link in MongoDB.')
    } finally {
      setIsEditing(false)
      setItemToEdit(null)
    }
  }

  const handleDeleteService = (item) => {
    setItemToDelete(item)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return
    setIsDeleting(true)
    try {
      const response = await fetch(`${API_URL}/${itemToDelete.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Delete failed')
      setLiveLinks((current) => current.filter((link) => link.id !== itemToDelete.id))
      setStatus('Link deleted successfully.')
    } catch {
      setStatus('Could not delete this link from MongoDB.')
    } finally {
      setIsDeleting(false)
      setItemToDelete(null)
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
          background: linear-gradient(135deg, #2563eb, #60a5fa);
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
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          font-weight: 700;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.22);
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
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.1);
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
          background: rgba(37, 99, 235, 0.12);
          color: #1e3a8a;
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
          color: #2563eb;
        }
        .top-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .search-input-wrap {
          width: 340px;
          display: flex;
          align-items: center;
          gap: 10px;
          background: #ffffff;
          border: 1px solid rgba(15,23,42,0.06);
          border-radius: 999px;
          padding: 10px 18px;
          color: #64748b;
          box-shadow: 0 2px 8px rgba(15,23,42,0.02);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .search-input-wrap:focus-within {
          box-shadow: 0 4px 14px rgba(37,99,235,0.08);
          border-color: rgba(37,99,235,0.3);
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
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
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
          background: #ffffff;
          border: 1px solid rgba(15,23,42,0.06);
          color: #475569;
          border-radius: 999px;
          padding: 9px 20px;
          font-size: 0.9rem;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(15,23,42,0.02);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        .ghost-btn:hover {
          color: #0f172a;
          border-color: rgba(15,23,42,0.12);
          box-shadow: 0 4px 12px rgba(15,23,42,0.05);
          transform: translateY(-1px);
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
          color: #2563eb;
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
          color: var(--icon-color, #2563eb);
          background: rgba(37, 99, 235, 0.09);
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
          gap: 12px;
          margin: 0 0 24px;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          border: 1px solid rgba(15,23,42,0.06);
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(8px);
          color: #475569;
          border-radius: 999px;
          padding: 8px 18px;
          font-size: 0.9rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px -2px rgba(15, 23, 42, 0.04);
        }
        .chip:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 14px -3px rgba(15, 23, 42, 0.08);
          background: #ffffff;
          color: #0f172a;
          border-color: rgba(37, 99, 235, 0.2);
        }
        .chip.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
          border-color: transparent;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.28);
          transform: translateY(-2px);
        }
        .chip.active:hover {
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
          transform: translateY(-3px);
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
        .view-toggle {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(15,23,42,0.04);
          padding: 4px;
          border-radius: 8px;
        }
        .view-toggle button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .view-toggle button:hover {
          color: #0f172a;
        }
        .view-toggle button.active {
          background: white;
          color: #2563eb;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .list-view-linear {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          padding: 0 14px 14px;
        }
        .list-view-linear .service-card {
          display: grid;
          grid-template-columns: 260px 1fr 180px;
          grid-template-rows: auto auto auto 1fr;
          grid-template-areas: 
            "preview top footer"
            "preview title footer"
            "preview desc footer"
            "preview meta footer";
          height: auto;
        }
        .list-view-linear .service-preview { grid-area: preview; height: 100%; border-right: 1px solid #e5e7eb; }
        .list-view-linear .service-card-top { grid-area: top; padding: 16px 20px 8px; }
        .list-view-linear .link-title { grid-area: title; margin: 0 20px 8px; }
        .list-view-linear .link-description { grid-area: desc; margin: 0 20px 12px; }
        .list-view-linear .meta-tags { grid-area: meta; margin: 0 20px 16px; align-self: start; }
        .list-view-linear .date { display: none; }
        .list-view-linear .service-footer { 
          grid-area: footer; 
          border-top: none; 
          border-left: 1px solid #f1f5f9;
          flex-direction: column;
          justify-content: center;
          gap: 16px;
          padding: 0 24px;
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
          background: linear-gradient(135deg, var(--dot-color, #3b82f6), #f8fafc);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .service-preview .link-banner-brand-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 58px;
          height: 58px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06);
          padding: 8px;
          transition: transform 0.25s ease;
        }
        .service-card:hover .link-banner-brand-container {
          transform: scale(1.08);
        }
        .service-preview .link-banner-brand-logo {
          width: 36px;
          height: 36px;
          object-fit: contain;
          border-radius: 8px;
        }
        .service-preview-fallback {
          display: none;
          width: 100%;
          height: 100%;
          place-items: center;
          background: linear-gradient(135deg, var(--dot-color), #f8fafc);
          color: #ffffff;
        }
        .dashboard-empty-container {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
          text-align: center;
          background: #ffffff;
          border-radius: 18px;
          border: 1.5px dashed #e2e8f0;
          margin: 12px;
        }
        .dashboard-empty-animation {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .dashboard-empty-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 6px;
        }
        .dashboard-empty-subtitle {
          font-size: 14px;
          color: #64748b;
          max-width: 380px;
          margin: 0 0 20px;
          line-height: 1.5;
        }
        .dashboard-empty-add-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #0f172a;
          color: #ffffff;
          border: none;
          border-radius: 999px;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
        }
        .dashboard-empty-add-btn:hover {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.2);
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
        .favorite-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .favorite-action:hover {
          background: #f1f5f9;
          color: #64748b;
        }
        .favorite-action.active {
          background: #eef8f2;
          color: #eab308;
        }
        .favorite-action.active:hover {
          background: #e1f1e7;
        }
        .save-action.vibrate, .favorite-action.vibrate {
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
          color: #2563eb;
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
          color: #2563eb;
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
        .edit-action { color: #2563eb; }
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
          background: #2563eb;
          border-color: #2563eb;
          color: white;
        }
        .page-btn:disabled {
          cursor: not-allowed;
          opacity: 0.45;
        }
        @media (max-width: 1100px) {
          .dashboard-shell { flex-direction: column; }
          .sidebar { width: 100%; border-right: none; border-bottom: 1px solid rgba(15,23,42,0.08); padding: 16px; }
          .nav-list { flex-direction: row; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 4px; }
          .nav-list::-webkit-scrollbar { display: none; }
          .nav-item { width: auto; white-space: nowrap; padding: 10px 16px; }
          .new-link-btn { width: max-content; padding: 10px 16px; margin-bottom: 16px; display: inline-flex; }
          .upgrade-card { display: none; }
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
        .delete-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: modalFadeIn 0.2s ease-out;
        }
        .delete-modal-card {
          background: white;
          width: 90%;
          max-width: 400px;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          text-align: center;
          animation: modalScaleUp 0.2s ease-out;
        }
        .delete-modal-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .delete-modal-card h3 {
          margin: 0 0 8px;
          color: #111827;
          font-size: 1.25rem;
          font-weight: 700;
        }
        .delete-modal-card p {
          margin: 0 0 24px;
          color: #6b7280;
          font-size: 0.95rem;
          line-height: 1.5;
        }
        .delete-modal-actions {
          display: flex;
          gap: 12px;
        }
        .delete-modal-actions button {
          flex: 1;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        .delete-modal-actions .cancel-btn {
          background: #f3f4f6;
          color: #374151;
        }
        .delete-modal-actions .cancel-btn:hover {
          background: #e5e7eb;
        }
        .delete-modal-actions .delete-btn {
          background: #ef4444;
          color: white;
        }
        .delete-modal-actions .delete-btn:hover {
          background: #dc2626;
        }
        .delete-modal-actions button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalScaleUp {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .edit-modal-form {
          text-align: left;
        }
        .edit-modal-form .form-group {
          margin-bottom: 16px;
        }
        .edit-modal-form label {
          display: block;
          font-size: 0.85rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 6px;
        }
        .edit-modal-form input,
        .edit-modal-form textarea,
        .edit-modal-form select {
          width: 100%;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          background: #f9fafb;
          font-size: 0.95rem;
          color: #111827;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .edit-modal-form input:focus,
        .edit-modal-form textarea:focus,
        .edit-modal-form select:focus {
          border-color: #2563eb;
          background: #ffffff;
        }
        .edit-modal-form textarea {
          resize: vertical;
          min-height: 80px;
        }
        .edit-modal-card h3 {
          margin: 0 0 16px;
          color: #111827;
          font-size: 1.25rem;
          font-weight: 800;
          text-align: left;
        }
        .edit-modal-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: rgba(37, 99, 235, 0.1);
          color: #2563eb;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .delete-modal-actions .save-btn {
          background: #2563eb;
          color: white;
        }
        .delete-modal-actions .save-btn:hover {
          background: #1d4ed8;
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


          <button className="new-link-btn" type="button" onClick={onAddLink}>
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
              <input
                placeholder="Search links, tags, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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


          <div className="chip-row">
            {availableCategories.map((item) => (
              <button
                type="button"
                className={`chip ${item === activeFilter ? 'active' : ''}`}
                key={item}
                onClick={() => setActiveFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <section className="panel">
            <div className="panel-header">
              <span aria-hidden="true"></span>
              <div className="right">
                <div className="view-toggle">
                  <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}><LayoutGrid size={16} /></button>
                  <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}><List size={16} /></button>
                </div>
              </div>
            </div>

            <div className={viewMode === 'list' ? 'list-view-linear' : 'list-view'}>
              {isLoadingLinks ? (
                <div className="service-card empty-state" style={{ gridColumn: '1 / -1' }}>
                  Loading links from MongoDB...
                </div>
              ) : linksError ? (
                <div className="service-card empty-state" style={{ gridColumn: '1 / -1', color: '#b45309' }}>
                  {linksError}
                </div>
              ) : filteredLinks.length === 0 ? (
                <div className="dashboard-empty-container">
                  <div className="dashboard-empty-animation">
                    <img
                      src={
                        activeNav === 'Favorites'
                          ? '/assets/empty/no-favorites.svg'
                          : activeNav === 'Saved'
                            ? '/assets/empty/checklist.svg'
                            : activeNav === 'Read Later'
                              ? '/assets/empty/announcement.svg'
                              : '/assets/empty/no-data.svg'
                      }
                      alt="Empty state"
                      style={{ width: '180px', height: '140px', objectFit: 'contain' }}
                    />
                  </div>
                  <h3 className="dashboard-empty-title">
                    {activeNav === 'Favorites'
                      ? 'No favorite links saved yet'
                      : activeNav === 'Read Later'
                        ? 'No links marked for read later'
                        : `No ${activeNav.toLowerCase()} links found`}
                  </h3>
                  <p className="dashboard-empty-subtitle">
                    Keep your favorite websites, tools, and research documents organized in your Nexio workspace.
                  </p>
                  <button
                    type="button"
                    className="dashboard-empty-add-btn"
                    onClick={onAddLink}
                  >
                    <Plus size={16} />
                    <span>Add New Link</span>
                  </button>
                </div>
              ) : visibleLinks.map((item) => (
                <article key={item.id} className="service-card">
                  <div className="service-preview" style={{ '--dot-color': item.accent }}>
                    <img
                      src={`https://api.microlink.io?url=${encodeURIComponent(item.url.startsWith('http') ? item.url : 'https://' + item.url)}&screenshot=true&meta=false&embed=screenshot.url`}
                      alt="preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
                      onError={(e) => {
                        const target = e.currentTarget;
                        const url = item.url.startsWith('http') ? item.url : 'https://' + item.url;
                        if (!target.dataset.triedSecondary) {
                          target.dataset.triedSecondary = 'true';
                          target.src = `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=600&h=380`;
                        } else {
                          target.style.display = 'none';
                          if (target.nextElementSibling) target.nextElementSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="link-banner-brand-container" style={{ display: 'none', zIndex: 1 }}>
                      <img
                        src={`https://logo.clearbit.com/${getHostname(item.url)}`}
                        alt={`${item.title} logo`}
                        className="link-banner-brand-logo"
                        onError={(event) => {
                          const target = event.currentTarget;
                          const fallbackUrl = getFaviconUrl(item.url);
                          if (!target.dataset.triedFallback && fallbackUrl) {
                            target.dataset.triedFallback = 'true';
                            target.src = fallbackUrl;
                          } else {
                            target.style.display = 'none';
                            if (target.nextElementSibling) {
                              target.nextElementSibling.style.display = 'flex';
                            }
                          }
                        }}
                      />
                      <span className="link-banner-letter" style={{ display: 'none' }}>
                        {item.title ? item.title.charAt(0).toUpperCase() : '🔗'}
                      </span>
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
                        className={`favorite-action ${item.favorite ? 'active' : ''} ${favoritePulseId === item.id ? 'vibrate' : ''}`}
                        aria-label={item.favorite ? `Remove ${item.title} from Favorites` : `Add ${item.title} to Favorites`}
                        title={item.favorite ? 'Favorited' : 'Add to Favorites'}
                        onClick={() => handleToggleFavorite(item.id)}
                      >
                        <Star size={18} fill={item.favorite ? 'currentColor' : 'none'} strokeWidth={item.favorite ? 0 : 2.5} />
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

            {filteredLinks.length > 0 && totalPages > 1 && (
              <div className="pagination" aria-label="Services pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * cardsPerPage + 1}-{Math.min(currentPage * cardsPerPage, filteredLinks.length)} of {filteredLinks.length} services
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
            )}
          </section>
        </main>
      </div>

      {itemToDelete && (
        <div className="delete-modal-backdrop" onClick={() => !isDeleting && setItemToDelete(null)}>
          <div className="delete-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
              <Trash2 size={24} color="#ef4444" />
            </div>
            <h3>Delete Link</h3>
            <p>Are you sure you want to delete <strong>{itemToDelete.title}</strong>? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button 
                type="button" 
                className="cancel-btn" 
                onClick={() => setItemToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="delete-btn" 
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {itemToEdit && (
        <div className="delete-modal-backdrop" onClick={() => !isEditing && setItemToEdit(null)}>
          <div className="delete-modal-card edit-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-icon">
              <Edit2 size={20} />
            </div>
            <h3>Edit Link</h3>
            <form className="edit-modal-form" onSubmit={confirmEdit}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Link Title"
                />
              </div>
              <div className="form-group">
                <label>URL</label>
                <input 
                  type="url" 
                  value={editForm.url}
                  onChange={(e) => setEditForm(prev => ({ ...prev, url: e.target.value }))}
                  required
                  placeholder="https://example.com"
                />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select 
                  value={editForm.category}
                  onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">Select a category</option>
                  {Array.from(new Set([...PREDEFINED_CATEGORIES, ...availableCategories.filter(c => c !== 'All')])).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  {editForm.category && !PREDEFINED_CATEGORIES.includes(editForm.category) && !availableCategories.includes(editForm.category) && editForm.category.includes(',') && (
                    <option value={editForm.category}>{editForm.category}</option>
                  )}
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add a description..."
                />
              </div>
              <div className="delete-modal-actions" style={{ marginTop: '24px' }}>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setItemToEdit(null)}
                  disabled={isEditing}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-btn" 
                  disabled={isEditing || !editForm.title.trim()}
                >
                  {isEditing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
