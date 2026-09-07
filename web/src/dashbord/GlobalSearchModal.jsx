import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Link2 } from 'lucide-react';

function getHostname(url) {
  try {
    return new URL(/^https?:\/\//i.test(url) ? url : `https://${url}`).hostname.replace(/^www\./i, '');
  } catch {
    return '';
  }
}

function getFaviconUrl(url) {
  const hostname = getHostname(url);
  return hostname ? `https://www.google.com/s2/favicons?domain=${hostname}&sz=128` : '';
}

// Clean live logo without extra outer box/border
function ResultFavicon({ item }) {
  const [imgFailed, setImgFailed] = useState(false);
  const faviconUrl = item.url ? getFaviconUrl(item.url) : '';
  const Icon = item.icon || Link2;

  return (
    <div className="result-avatar-clean">
      {faviconUrl && !imgFailed ? (
        <img
          src={faviconUrl}
          alt=""
          onError={() => setImgFailed(true)}
          className="result-live-logo"
          loading="lazy"
        />
      ) : (
        <div className="result-fallback-icon" style={{ '--item-accent': item.accent || '#3b82f6' }}>
          <Icon size={16} />
        </div>
      )}
    </div>
  );
}

export default function GlobalSearchModal({ isOpen, onClose, links, onOpenLink }) {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(''); // Empty by default
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const tabs = ['Saved', 'Quick Assets', 'UI/UX'];

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveTab(''); // Start empty on open
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  const filteredResults = useMemo(() => {
    if (!links) return [];

    const hasQuery = query.trim().length > 0;

    // If no search query and no tab clicked, keep empty
    if (!hasQuery && !activeTab) {
      return [];
    }

    let result = links;

    // If no search query but a tab is clicked, filter by that tab
    if (!hasQuery && activeTab) {
      if (activeTab === 'Saved') {
        result = result.filter(l => l.collection === 'Inbox' || l.category === 'Saved' || l.collection === 'Saved');
      } else if (activeTab === 'Quick Assets') {
        result = result.filter(l => l.kind === 'quick-asset' || l.collection === 'Quick Assets' || l.category === 'Featured Quick Asset');
      } else if (activeTab === 'UI/UX') {
        result = result.filter(l => l.category && l.category.toLowerCase().includes('ui/ux'));
      }
    } else if (hasQuery) {
      const q = query.toLowerCase().trim();

      // Synonym & category mappings for rich searches (e.g. icon, illustration, font, ai, wallpaper, tool, etc.)
      const isIconQuery = q.includes('icon');
      const isIllustrationQuery = q.includes('illustrat') || q.includes('svg') || q.includes('vector') || q.includes('draw');
      const isUiUxQuery = q.includes('ui') || q.includes('ux') || q.includes('design') || q.includes('figma');
      const isAiQuery = q.includes('ai') || q.includes('gpt') || q.includes('bot') || q.includes('art');
      const isFontQuery = q.includes('font') || q.includes('type') || q.includes('typography');
      const isStockQuery = q.includes('stock') || q.includes('photo') || q.includes('image') || q.includes('wallpaper');
      const isToolQuery = q.includes('tool') || q.includes('util') || q.includes('code') || q.includes('dev');

      result = result.filter(item => {
        const title = (item.title || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const url = (item.url || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        const kind = (item.kind || '').toLowerCase();
        const metaStr = Array.isArray(item.meta) ? item.meta.join(' ').toLowerCase() : '';
        const tagsStr = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : '';
        const allText = `${title} ${desc} ${url} ${cat} ${kind} ${metaStr} ${tagsStr}`;

        // Direct substring match
        if (allText.includes(q)) return true;

        // Contextual synonym matches
        if (isIconQuery && (allText.includes('icon') || cat.includes('icon') || url.includes('icon') || title.includes('lucide') || title.includes('tabler') || title.includes('feather') || title.includes('phosphor') || title.includes('hugeicons') || title.includes('remix'))) {
          return true;
        }
        if (isIllustrationQuery && (allText.includes('illustrat') || allText.includes('svg') || allText.includes('vector') || cat.includes('ui/ux') && (title.includes('peep') || title.includes('undraw') || title.includes('draw') || title.includes('storyset') || title.includes('craftwork') || title.includes('streamline')))) {
          return true;
        }
        if (isUiUxQuery && (cat.includes('ui/ux') || cat.includes('design') || allText.includes('figma') || allText.includes('dribbble') || allText.includes('behance') || allText.includes('awwwards') || allText.includes('component') || allText.includes('palette') || allText.includes('color'))) {
          return true;
        }
        if (isAiQuery && (cat.includes('ai') || allText.includes('artificial') || allText.includes('gpt') || allText.includes('openai') || allText.includes('claude') || allText.includes('gemini') || allText.includes('midjourney'))) {
          return true;
        }
        if (isFontQuery && (cat.includes('font') || allText.includes('font') || allText.includes('typeface') || allText.includes('google fonts') || allText.includes('fontshare') || allText.includes('dafont'))) {
          return true;
        }
        if (isStockQuery && (cat.includes('stock') || cat.includes('wallpaper') || allText.includes('unsplash') || allText.includes('pexels') || allText.includes('pixabay') || allText.includes('freepik') || allText.includes('wallpaper'))) {
          return true;
        }
        if (isToolQuery && (cat.includes('tool') || cat.includes('develop') || kind.includes('quick-asset') || allText.includes('generator') || allText.includes('converter') || allText.includes('builder') || allText.includes('codepen') || allText.includes('github'))) {
          return true;
        }

        return false;
      });
    }

    return result.slice(0, 60);
  }, [links, query, activeTab]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResults[selectedIndex]) {
          onOpenLink(filteredResults[selectedIndex].url);
          onClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, onOpenLink, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeTab]);

  useEffect(() => {
    if (listRef.current && listRef.current.children[selectedIndex]) {
      listRef.current.children[selectedIndex].scrollIntoView({
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .global-search-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 10000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 10vh;
          animation: modalFadeIn 0.18s ease-out;
        }

        .global-search-modal {
          width: 100%;
          max-width: 660px;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.18), 0 0 1px 1px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          max-height: 80vh;
          animation: modalSlideIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideIn {
          from { opacity: 0; transform: translateY(-12px) scale(0.985); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Search Header */
        .search-modal-header {
          display: flex;
          align-items: center;
          padding: 0 18px;
          height: 56px;
          border-bottom: 1px solid #f1f5f9;
          gap: 12px;
        }

        .search-icon {
          color: #2563eb;
          flex-shrink: 0;
        }

        .search-modal-header input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 0.92rem;
          color: #0f172a;
          font-weight: 500;
          height: 100%;
        }

        .search-modal-header input::placeholder {
          color: #94a3b8;
          font-size: 0.88rem;
          font-weight: 400;
        }

        .search-hints {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .search-hints .hint {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #64748b;
          font-size: 0.78rem;
          font-weight: 500;
        }

        .search-hints kbd {
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          padding: 2px 5px;
          font-family: inherit;
          font-size: 0.72rem;
          color: #475569;
          font-weight: 600;
        }

        .mobile-close-btn {
          display: none;
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
        }

        .mobile-close-btn:hover {
          background: #f1f5f9;
          color: #0f172a;
        }

        /* Tabs */
        .search-modal-tabs {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-bottom: 1px solid #f1f5f9;
          background: #ffffff;
          overflow-x: auto;
        }

        .search-modal-tabs::-webkit-scrollbar {
          display: none;
        }

        .search-tab {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          color: #64748b;
          padding: 5px 14px;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s ease;
        }

        .search-tab:hover {
          background: #f1f5f9;
          color: #0f172a;
          border-color: #cbd5e1;
        }

        .search-tab.active {
          background: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
          box-shadow: 0 1px 3px rgba(37, 99, 235, 0.2);
        }

        /* Results List */
        .search-modal-results {
          flex: 1;
          overflow-y: auto;
          padding: 8px 10px;
          min-height: 250px;
          max-height: 480px;
        }

        .search-modal-results::-webkit-scrollbar {
          width: 5px;
        }
        .search-modal-results::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .search-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px 20px;
          text-align: center;
          color: #64748b;
        }

        .empty-illustration-img {
          width: 140px;
          height: auto;
          max-height: 110px;
          object-fit: contain;
          margin-bottom: 14px;
          user-select: none;
          pointer-events: none;
        }

        .search-empty-state h4 {
          margin: 0 0 4px 0;
          font-size: 0.92rem;
          font-weight: 600;
          color: #0f172a;
        }

        .search-empty-state p {
          margin: 0;
          font-size: 0.82rem;
          color: #64748b;
          max-width: 320px;
        }

        /* Result Row */
        .search-result-item {
          display: grid;
          grid-template-columns: 28px 1fr auto 72px;
          align-items: center;
          column-gap: 12px;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.12s ease, border-color 0.12s ease;
          border: 1px solid transparent;
          margin-bottom: 2px;
          min-height: 50px;
          box-sizing: border-box;
        }

        .search-result-item:hover,
        .search-result-item.selected {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .result-avatar-clean {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background: transparent;
        }

        .result-live-logo {
          width: 24px;
          height: 24px;
          object-fit: contain;
          border-radius: 4px;
          display: block;
        }

        .result-fallback-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: var(--item-accent, #3b82f6);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-content {
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .result-title {
          font-weight: 600;
          color: #0f172a;
          font-size: 0.9rem;
          line-height: 1.25;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .result-url {
          font-size: 0.76rem;
          color: #64748b;
          line-line: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .result-category {
          padding: 3px 8px;
          border-radius: 5px;
          background: #f1f5f9;
          color: #475569;
          font-size: 0.72rem;
          font-weight: 600;
          white-space: nowrap;
          justify-self: end;
        }

        /* Action Column - Fixed 72px slot prevents shifting */
        .result-action-slot {
          width: 72px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
        }

        .result-action-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 3px 8px;
          border-radius: 5px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
          opacity: 0;
          transform: translateX(4px);
          transition: all 0.12s ease;
        }

        .search-result-item.selected .result-action-btn,
        .search-result-item:hover .result-action-btn {
          opacity: 1;
          transform: translateX(0);
        }

        .result-action-btn span {
          font-size: 0.75rem;
          color: #475569;
          font-weight: 500;
        }

        .result-action-btn kbd {
          font-family: inherit;
          font-size: 0.75rem;
          color: #2563eb;
          font-weight: 600;
        }

        @media (max-width: 640px) {
          .global-search-backdrop {
            padding-top: 0;
          }
          
          .global-search-modal {
            max-height: 100vh;
            height: 100vh;
            border-radius: 0;
          }
          
          .search-hints.desktop-only {
            display: none;
          }
          
          .mobile-close-btn {
            display: block;
          }

          .search-result-item {
            grid-template-columns: 28px 1fr auto;
          }
          
          .result-action-slot {
            display: none;
          }
        }
      `}</style>

      <div className="global-search-backdrop" onClick={onClose}>
        <div className="global-search-modal" onClick={e => e.stopPropagation()}>
          
          {/* Search Header */}
          <div className="search-modal-header">
            <Search className="search-icon" size={17} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search links, website, tags..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value.trim() && activeTab) {
                  setActiveTab(''); // Switch to global search when typing
                }
              }}
            />
            <div className="search-hints desktop-only">
              <span className="hint">Navigate <kbd>↑</kbd> <kbd>↓</kbd></span>
              <span className="hint">Close <kbd>esc</kbd></span>
            </div>
            <button className="mobile-close-btn" onClick={onClose}><X size={17} /></button>
          </div>

          {/* Tabs */}
          {!query.trim() && (
            <div className="search-modal-tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`search-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(prev => prev === tab ? '' : tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="search-modal-results" ref={listRef}>
            {filteredResults.length === 0 ? (
              <div className="search-empty-state">
                <img
                  src="/assets/empty/pixeltrue-website-ranking-improvement-by-collaborative-seo-strategy.svg"
                  alt="Search Illustration"
                  className="empty-illustration-img"
                />
                <h4>{query.trim() ? 'No results found' : 'Search anything'}</h4>
                <p>
                  {query.trim()
                    ? `No matches found for "${query}". Try searching other keywords.`
                    : 'Type a keyword or select a category tab to explore links.'}
                </p>
              </div>
            ) : (
              filteredResults.map((item, index) => {
                return (
                  <div
                    key={item.id || index}
                    className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onClick={() => {
                      onOpenLink(item.url);
                      onClose();
                    }}
                  >
                    <ResultFavicon item={item} />
                    <div className="result-content">
                      <div className="result-title">{item.title}</div>
                      <div className="result-url">{getHostname(item.url)}</div>
                    </div>
                    <div className="result-category">
                      {item.category || 'General'}
                    </div>
                    <div className="result-action-slot">
                      <div className="result-action-btn">
                        <span>Open</span>
                        <kbd>↵</kbd>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
