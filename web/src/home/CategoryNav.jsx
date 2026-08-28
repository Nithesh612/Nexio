import React, { useState, useEffect } from 'react';
import LottieAnimation from './LottieAnimation';
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json';
import './CategoryNav.css';

const API_URL = 'http://localhost:5000/hub';

// Default links to show when DB is empty or loading
const defaultLinks = {
  all: [
    { title: 'Kimi AI', desc: 'Long-context AI assistant for research and analysis.', url: 'https://www.kimi.com/en', category: 'AI Agents' },
    { title: 'Figma', desc: 'Collaborative UI design and prototyping tool.', url: 'https://www.figma.com', category: 'UI/UX' },
    { title: 'Runway ML', desc: 'Generate video clips from a single prompt.', url: 'https://runwayml.com', category: 'AI Agents' },
    { title: 'Framer', desc: 'Design and publish production-ready websites.', url: 'https://www.framer.com', category: 'UI/UX' },
    { title: 'GitHub Copilot', desc: 'Write code faster with AI assistance.', url: 'https://github.com/features/copilot', category: 'Development' },
    { title: 'Descript', desc: 'Edit video as easily as editing a document.', url: 'https://www.descript.com', category: 'Resources' },
    { title: 'Notion AI', desc: 'Extract insights and organize your notes.', url: 'https://www.notion.so', category: 'AI Agents' },
    { title: 'Midjourney', desc: 'Generate stunning artwork from text prompts.', url: 'https://www.midjourney.com', category: 'AI Agents' },
    { title: 'Character.AI', desc: 'Chat with AI characters consistently.', url: 'https://character.ai', category: 'AI Agents' },
  ],
};

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

export default function CategoryNav({ refreshTrigger }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [dbLinks, setDbLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgErrors, setImgErrors] = useState({});

  const categories = [
    { id: 'all', label: 'All Links' },
    { id: 'uiux', label: 'UI/UX', isNew: true },
    { id: 'ai-agents', label: 'AI Agents', isNew: true },
    { id: 'development', label: 'Development' },
    { id: 'resources', label: 'Resources' },
    { id: 'inspiration', label: 'Inspiration' },
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

  // Merge DB links with defaults
  function getItemsForCategory(catId) {
    // Convert DB links to display format
    const fromDb = dbLinks.map((link) => ({
      title: link.title,
      desc: link.description || `Saved link for ${link.title}`,
      url: link.url,
      category: link.category || 'General',
      fromDb: true,
    }));

    // Get defaults
    const defaults = defaultLinks.all || [];

    // Combine: DB links first, then defaults
    const allItems = [...fromDb, ...defaults];

    if (catId === 'all') {
      return allItems;
    }

    // Filter by category
    return allItems.filter((item) => mapCategoryToId(item.category) === catId);
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
          Discover AI agents, UI tools, and dev resources — all in one place.
          {dbLinks.length > 0 && (
            <span className="db-count"> ({dbLinks.length} saved in database)</span>
          )}
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
              {cat.label}{' '}
              {cat.isNew && <span className="new-badge">New</span>}
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
            <LottieAnimation 
              animationData={emptyAnimation} 
              width={260} 
              height={260} 
            />
            <p>No links found in this category. Use "Add Link" to save one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
