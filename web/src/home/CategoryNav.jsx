import React, { useState, useEffect } from 'react';
import LottieAnimation from './LottieAnimation';
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json';
import './CategoryNav.css';

const API_URL = 'http://localhost:5000/hub';

const categoryMap = {
  all: 'All Links',
  uiux: 'UI/UX',
  'ai-agents': 'AI Agents',
  development: 'Development',
  resources: 'Resources',
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
  if (lower === 'ai agents' || lower === 'ai-agents') return 'ai-agents';
  if (lower === 'development' || lower === 'dev') return 'development';
  if (lower === 'resources') return 'resources';
  if (lower === 'inspiration') return 'inspiration';
  return 'all';
}

export default function CategoryNav({ refreshTrigger, onAddLink }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbLinks, setDbLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});

  const categories = [
    {
      id: 'all', label: 'All Links',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
    },
    {
      id: 'uiux', label: 'UI/UX',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
    },
    {
      id: 'ai-agents', label: 'AI Agents',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M9 17h6"/></svg>
    },
    {
      id: 'development', label: 'Development',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    },
    {
      id: 'resources', label: 'Resources',
      icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
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
      const res = await fetch(API_URL);
      if (res.ok) {
        const data = await res.json();
        setDbLinks(data);
      }
    } catch (err) {
      console.error('Failed to fetch links:', err);
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
      fromDb: true,
    }));

    if (catId === 'all') return fromDb;
    return fromDb.filter((item) => mapCategoryToId(item.category) === catId);
  }

  const handleCategoryClick = (e, id) => {
    e.preventDefault();
    setActiveCategory(id);
  };

  const currentItems = getItemsForCategory(activeCategory);

  // Get counts per category
  const getCategoryCount = (catId) => {
    return getItemsForCategory(catId).length;
  };

  return (
    <div className="category-section">
      <div className="section-title-wrapper">
        <h2 className="section-main-title">Category</h2>
        <p className="section-sub-title">
          Save and organize your favourite links — tools, articles, and resources all in one place.
        </p>
      </div>

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
                  className={`feature-item${item.fromDb ? ' from-db' : ''}`}
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
                    <h3>
                      {item.title}
                      {item.fromDb && <span className="db-badge">Saved</span>}
                    </h3>
                    <p>{item.desc}</p>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-illustration">
              <LottieAnimation
                animationData={emptyAnimation}
                width={220}
                height={220}
              />
            </div>
            <h3 className="empty-title">No links saved yet</h3>
            <p className="empty-subtitle">
              This category is empty. Save useful links, tools, and resources<br />
              to keep everything organized in one place.
            </p>
            {onAddLink && (
              <button className="empty-add-btn" onClick={onAddLink}>
                + Add Link
              </button>
            )}
            <p className="empty-hint">Start building your collection ↗</p>
          </div>
        )}
      </div>
    </div>
  );
}
