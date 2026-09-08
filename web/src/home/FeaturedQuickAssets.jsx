import React, { useEffect, useState } from 'react'
import { API_URL } from '../config/api'

function QuickAssetItem({ tool }) {
  const [imgError, setImgError] = useState(false)

  const getFavicon = (url) => {
    try {
      const hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./i, '')
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
    } catch {
      return ''
    }
  }

  const displayName = tool.title || tool.name || 'Quick Asset'
  const displayCategory = tool.description || tool.category || 'Useful utility'
  const displayBadge = tool.badge || 'Free'

  const handleCardClick = () => {
    const targetUrl = tool.url.startsWith('http') ? tool.url : `https://${tool.url}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      onClick={handleCardClick}
      className="p-3.5 bg-white rounded-2xl border border-gray-200/80 hover:border-gray-300 shadow-2xs hover:shadow-md transition-all flex items-center justify-between gap-3 group relative cursor-pointer hover:-translate-y-0.5 duration-200"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center p-1.5 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
          {!imgError && tool.logoUrl ? (
            <img
              src={tool.logoUrl}
              alt={displayName}
              onError={() => setImgError(true)}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          ) : (
            <img
              src={getFavicon(tool.url)}
              alt={displayName}
              className="w-5 h-5 object-contain"
              loading="lazy"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
            {displayName}
          </h4>
          <p className="text-[11px] text-gray-500 truncate">{displayCategory}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md shrink-0">
          {displayBadge}
        </span>
      </div>
    </div>
  )
}

export default function FeaturedQuickAssets() {
  const [assets, setAssets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLiveQuickAssets = async () => {
    try {
      setIsLoading(true)
      const res = await fetch(API_URL)
      if (!res.ok) {
        setAssets([])
        return
      }
      const data = await res.json()
      if (Array.isArray(data)) {
        const deletedRaw = localStorage.getItem('nexio_deleted_quick_assets')
        const deletedList = deletedRaw ? JSON.parse(deletedRaw) : []
        const quick = data.filter(
          (item) =>
            (item.collection === 'Quick Assets' || item.category === 'Featured Quick Asset' || item.category === 'Quick Assets' || item.kind === 'quick-asset') &&
            item.favorite === true &&
            !deletedList.includes(String(item.id)) &&
            !deletedList.includes(String(item._id)) &&
            !deletedList.includes(String(item.url))
        )
        setAssets(quick)
      } else {
        setAssets([])
      }
    } catch {
      setAssets([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveQuickAssets()

    const handleUpdate = () => {
      fetchLiveQuickAssets()
    }

    window.addEventListener('nexio_quick_assets_updated', handleUpdate)
    window.addEventListener('storage', handleUpdate)

    return () => {
      window.removeEventListener('nexio_quick_assets_updated', handleUpdate)
      window.removeEventListener('storage', handleUpdate)
    }
  }, [])

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Quick Assets</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Lightweight utilities, plugins, and vector sets</p>
        </div>
      </div>

      {assets.length === 0 ? (
        <div className="bg-white/80 rounded-3xl border border-gray-200/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-2xs">
          <img
            src="/assets/empty/no-messages.svg"
            alt="No Quick Assets"
            style={{ width: '180px', height: '140px', objectFit: 'contain' }}
            className="mb-4"
          />
          <h3 className="text-base font-bold text-gray-900 mb-1">No Quick Assets</h3>
          <p className="text-xs text-gray-500 max-w-sm">
            Keep your essential quick assets, lightweight utilities, and vector sets handy here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {assets.map((tool) => (
            <QuickAssetItem
              key={tool.id || tool._id || tool.url}
              tool={tool}
            />
          ))}
        </div>
      )}
    </section>
  )
}
