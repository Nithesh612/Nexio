import React, { useState, useEffect } from 'react';
import {
  Link2,
  LayoutGrid,
  Bot,
  BookOpen,
  Sparkles,
  Plus,
  Palette,
  Compass,
  Folder
} from 'lucide-react';
import LottieAnimation from './LottieAnimation';
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json';
import { API_URL } from '../config/api';
import './CategoryNav.css';

const categoryMap = {
  all: 'All Links',
  uiux: 'UI/UX',
  'ai-agents': 'AI Agents',
  'editing': 'Editing',
  design: 'Design',
  inspiration: 'Inspiration',
};

function getFaviconUrl(url) {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
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
  if (lower === 'editing') return 'editing';
  if (lower === 'inspiration' || lower === 'design') return 'inspiration';
  return 'all';
}

function getCategoryFallbackIcon(category) {
  const lower = (category || '').toLowerCase();
  if (lower.includes('ui') || lower.includes('ux') || lower.includes('design')) return <Palette size={18} />;
  if (lower.includes('ai') || lower.includes('agent') || lower.includes('bot')) return <Bot size={18} />;
  if (lower.includes('resource') || lower.includes('doc') || lower.includes('tool')) return <BookOpen size={18} />;
  if (lower.includes('inspire') || lower.includes('art')) return <Compass size={18} />;
  return <Link2 size={18} />;
}

export default function CategoryNav({ refreshTrigger, onAddLink }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbLinks, setDbLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 columns x 3 rows = 9 items

  const categories = [
    { id: 'all', label: 'All Links', icon: <Link2 size={15} /> },
    { id: 'uiux', label: 'UI/UX', icon: <LayoutGrid size={15} /> },
    { id: 'ai-agents', label: 'AI Agents', icon: <Bot size={15} /> },
    { id: 'editing', label: 'Editing', icon: <BookOpen size={15} /> },
    { id: 'inspiration', label: 'Inspiration', icon: <Sparkles size={15} /> },
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
    <div className="category-section" id="features">
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
          <div className="features-grid">
            {Array.from({ length: 9 }).map((_, idx) => (
              <div key={idx} className="feature-item skeleton-feature-item">
                <div className="feature-icon skeleton-box skeleton-icon-box" />
                <div className="feature-text skeleton-text-col">
                  <div className="skeleton-box skeleton-title-line" />
                  <div className="skeleton-box skeleton-desc-line" />
                  <div className="skeleton-box skeleton-desc-line skeleton-desc-line-short" />
                </div>
              </div>
            ))}
          </div>
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
                        {getCategoryFallbackIcon(item.category)}
                      </span>
                    )}
                  </div>
                  <div className="feature-text">
                    <div className="feature-title-row">
                      <h3>{item.title}</h3>
                      {((item.collection || '').toLowerCase() === 'saved' || (item.category || '').toLowerCase() === 'saved') && (
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
                src="/assets/empty/pixeltrue-website-ranking-improvement-by-collaborative-seo-strategy.svg"
                alt="No links in category"
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
