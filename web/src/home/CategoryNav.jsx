import React, { useState, useEffect } from 'react';
import LottieAnimation from './LottieAnimation';
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json';
import './CategoryNav.css';

const API_URL = typeof window !== 'undefined' ? `http://${window.location.hostname}:5000/hub` : 'http://localhost:5000/hub';

const categoryMap = {
  all: 'All Links',
  uiux: 'UI/UX',
  'ai-agents': 'AI Agents',
  resources: 'Resources',
  design: 'Design',
  inspiration: 'Inspiration',
};

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
}

function mapCategoryToId(category) {
  if (!category) return 'all';
  const lower = category.toLowerCase();
  if (lower === 'ui/ux' || lower === 'uiux') return 'uiux';
  if (lower === 'ai agents' || lower === 'ai-agents' || lower === 'ai image & video' || lower === 'ai') return 'ai-agents';
  if (lower === 'resources') return 'resources';
  if (lower === 'inspiration' || lower === 'design') return 'inspiration';
  return 'all';
}

export default function CategoryNav({ refreshTrigger, onAddLink }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbLinks, setDbLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 columns x 3 rows = 9 items

  const categories = [
    {
      id: 'all', label: 'All Links',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    },
    {
      id: 'uiux', label: 'UI/UX',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    },
    {
      id: 'ai-agents', label: 'AI Agents',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
    },
    {
      id: 'resources', label: 'Resources',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/><path d="M6 14h6"/></svg>
    },
    {
      id: 'inspiration', label: 'Inspiration',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>
    },
  ];

  // Fetch links from DB
  useEffect(() => {
    fetchLinks();
  }, [refreshTrigger]);

  async function fetchLinks() {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setDbLinks(data);
      }
    } catch (err) {
      console.error('Failed to fetch DB links:', err);
    } finally {
      setLoading(false);
    }
  }

  // Only DB links — no defaults
  function getItemsForCategory(catId) {
    const fromDb = dbLinks.map((link) => ({
      title: link.title,
      desc: link.description || '',
      url: link.url,
      category: link.category || 'General',
      collection: link.collection || 'All Links',
      fromDb: true,
    }));

    if (catId === 'all') return fromDb;
    return fromDb.filter((item) => {
      const catList = (item.category || '').toLowerCase().split(',').map(s => s.trim());
      return catList.some(c => mapCategoryToId(c) === catId) || mapCategoryToId(item.category) === catId;
    });
  }

  const handleCategoryClick = (e, id) => {
    e.preventDefault();
    setActiveCategory(id);
  };

  const allCategoryItems = getItemsForCategory(activeCategory);
  // Show only first 9 items (3 rows x 3 columns)
  const currentItems = allCategoryItems.slice(0, 9);

  // Get counts per category
  const getCategoryCount = (catId) => {
    return getItemsForCategory(catId).length;
  };

  return (
    <div className="category-section">
      <div className="category-pill-container">
        <div className="category-pill">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={(e) => handleCategoryClick(e, cat.id)}
            >
              {cat.icon && <span className="cat-icon">{cat.icon}</span>}
              {cat.label}
            </a>
          ))}
        </div>
      </div>

      <div className="category-content-card">
        {loading ? (
          <div className="empty-state">Loading links...</div>
        ) : currentItems.length > 0 ? (
          <div className="features-grid">
            {currentItems.map((item, idx) => {
              const faviconUrl = getFaviconUrl(item.url);
              const hasError = imgErrors[`${activeCategory}-${idx}`];
              return (
                <a
                  key={idx}
                  className="feature-item"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="feature-icon favicon-icon">
                    {faviconUrl && !hasError ? (
                      <img
                        src={faviconUrl}
                        alt={item.title}
                        onError={() =>
                          setImgErrors((prev) => ({
                            ...prev,
                            [`${activeCategory}-${idx}`]: true,
                          }))
                        }
                      />
                    ) : (
                      <span className="favicon-fallback">
                        {item.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="feature-text">
                    <div className="feature-title-row">
                      <h3>{item.title}</h3>
                      {(item.collection === 'Inbox' || item.collection === 'Saved') && (
                        <span className="saved-badge">SAVED</span>
                      )}
                    </div>
                    <p>{item.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration">
              <img
                src={
                  activeCategory === 'inspiration'
                    ? '/assets/empty/no-results.svg'
                    : activeCategory === 'resources'
                      ? '/assets/empty/checklist.svg'
                      : activeCategory === 'uiux'
                        ? '/assets/empty/no-data.svg'
                        : activeCategory === 'ai-agents'
                          ? '/assets/empty/online-business.svg'
                          : '/assets/empty/no-data.svg'
                }
                alt="No links"
                className="empty-state-svg"
              />
            </div>
            <h3 className="empty-title">No links saved in {categoryMap[activeCategory] || 'this category'}</h3>
            <p className="empty-subtitle">
              Save your favorite tools, articles, and references to keep them easily accessible.
            </p>
            {onAddLink && (
              <button type="button" className="empty-add-btn" onClick={onAddLink}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add Link</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
