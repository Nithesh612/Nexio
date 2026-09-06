import React, { useState } from 'react';
import LottieAnimation from './LottieAnimation';
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json';
import {
  Layers,
  Palette,
  Video,
  Sparkles,
  Bot,
  Folder,
  Image as ImageIcon,
  Camera,
  Server,
  Globe,
  FileText,
  FlaskConical,
  Wrench,
  Bookmark,
  Compass,
  LayoutGrid
} from 'lucide-react';
import './links.css';

// Category tab metadata
const tabMeta = {
  all:               { title: 'All Links',          description: 'Browse all your saved links across every category.' },
  saved:             { title: 'Saved',              description: 'Links you have saved for later.' },
  'ui/ux':           { title: 'UI/UX',              description: 'Design tools, UI kits, and resources for designers.' },
  'ai-image-video':  { title: 'AI Image & Video',   description: 'Cutting-edge AI image generators and video creation platforms.' },
  ai:                { title: 'AI',                 description: 'Powerful AI assistants, LLMs, and intelligent workflow tools.' },
  other:             { title: 'Other',              description: 'Miscellaneous links and general bookmarks.' },
  inspiration:       { title: 'Inspiration',        description: 'Visual inspiration and creative references for your next project.' },
  wallpaper:         { title: 'Wallpaper',          description: 'High resolution desktop and mobile wallpapers.' },
  stock:             { title: 'Stock',              description: 'Curated stock photos, vectors, 3D assets, and media.' },
  host:              { title: 'Host',               description: 'Hosting services, cloud providers, and deployment platforms.' },
  article:           { title: 'Article',            description: 'Interesting articles, tutorials, and long-form essays.' },
  research:          { title: 'Research',           description: 'Research papers, benchmarks, datasets, and case studies.' },
  tools:             { title: 'Tools',              description: 'Productivity utilities, web apps, and everyday tools.' },
};

// Gradient palette per category
const categoryColors = {
  'UI/UX':             ['#667eea', '#764ba2'],
  'AI Image & Video':  ['#f093fb', '#f5576c'],
  'AI':                ['#a855f7', '#6366f1'],
  'Other':             ['#64748b', '#475569'],
  'Inspiration':       ['#fa709a', '#fee140'],
  'Wallpaper':         ['#38ef7d', '#11998e'],
  'Stock':             ['#ff9a9e', '#fecfef'],
  'Host':              ['#2af598', '#009efd'],
  'Article':           ['#f6d365', '#fda085'],
  'Research':          ['#96fbc4', '#f9f586'],
  'Tools':             ['#c471ed', '#f64f59'],
  'default':           ['#a18cd1', '#fbc2eb'],
};

function LinkCard({ item }) {
  const [screenshotError, setScreenshotError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const cleanUrl = (() => {
    try {
      const u = item.url.startsWith('http') ? item.url : `https://${item.url}`;
      return new URL(u).href;
    } catch {
      return item.url;
    }
  })();

  const hostname = (() => {
    try {
      return new URL(cleanUrl).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();

  // Live website screenshot banner (Thum.io live website capture with Microlink & mshots fallbacks)
  const primaryScreenshot = `https://image.thum.io/get/width/600/crop/400/${cleanUrl}`;
  const secondaryScreenshot = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  const tertiaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600&h=380`;
  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot);

  const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  const colors = categoryColors[item.category] || categoryColors['default'];

  return (
    <a href={cleanUrl} target="_blank" rel="noopener noreferrer" className="link-card">
      {/* Live Website Screenshot Banner */}
      <div
        className="link-card-banner"
        style={{
          background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
        }}
      >
        {!screenshotError ? (
          <img
            src={currentScreenshot}
            alt={`${item.title} live preview`}
            className="link-card-screenshot"
            loading="lazy"
            onError={() => {
              if (currentScreenshot === primaryScreenshot) {
                setCurrentScreenshot(secondaryScreenshot);
              } else if (currentScreenshot === secondaryScreenshot) {
                setCurrentScreenshot(tertiaryScreenshot);
              } else {
                setScreenshotError(true);
              }
            }}
          />
        ) : (
          <div className="link-banner-brand-container">
            <img
              src={`https://logo.clearbit.com/${hostname}`}
              alt={item.title}
              className="link-banner-brand-logo"
              onError={(e) => {
                e.currentTarget.src = faviconUrl;
              }}
            />
          </div>
        )}

        {item.category && (
          <span className="link-category-pill">{item.category}</span>
        )}
      </div>

      {/* Card Body */}
      <div className="link-card-body">
        <div className="link-card-top">
          {!faviconError && (
            <img
              src={faviconUrl}
              alt=""
              className="link-body-favicon"
              onError={() => setFaviconError(true)}
            />
          )}
          <h3 className="link-card-name">{item.title}</h3>
        </div>
        <p className="link-card-desc">{item.desc}</p>
        <span className="link-url">{hostname}</span>
      </div>
    </a>
  );
}

export default function LinksSection({ savedLinks = [], onAddLink }) {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4 columns × 3 rows = 12 items per page

  const tabs = [
    { id: 'all',              label: 'All Links',         icon: Layers,       categoryVal: 'all' },
    { id: 'saved',            label: 'Saved',             icon: Bookmark,     categoryVal: 'saved' },
    { id: 'ui/ux',            label: 'UI/UX',             icon: LayoutGrid,   categoryVal: 'UI/UX' },
    { id: 'ai-image-video',   label: 'AI Image & Video',  icon: Video,        categoryVal: 'AI Image & Video' },
    { id: 'ai',               label: 'AI',                icon: Bot,          categoryVal: 'AI' },
    { id: 'other',            label: 'Other',             icon: Folder,       categoryVal: 'Other' },
    { id: 'inspiration',      label: 'Inspiration',       icon: Compass,      categoryVal: 'Inspiration' },
    { id: 'wallpaper',        label: 'Wallpaper',         icon: ImageIcon,    categoryVal: 'Wallpaper' },
    { id: 'stock',            label: 'Stock',             icon: Camera,       categoryVal: 'Stock' },
    { id: 'host',             label: 'Host',              icon: Server,       categoryVal: 'Host' },
    { id: 'article',          label: 'Article',           icon: FileText,     categoryVal: 'Article' },
    { id: 'research',         label: 'Research',          icon: FlaskConical, categoryVal: 'Research' },
    { id: 'tools',            label: 'Tools',             icon: Wrench,       categoryVal: 'Tools' },
  ];

  const meta = tabMeta[activeTab] || tabMeta.all;

  // Map DB links to LinkCard format
  const mappedLinks = savedLinks.map(link => ({
    id: link.id || link._id,
    title: link.title,
    desc: link.description || '',
    url: link.url,
    category: link.type || link.category || 'Other',
    collection: link.collection || 'All Links',
  }));

  // Selected tab configuration
  const currentTabConfig = tabs.find(t => t.id === activeTab);

  // Filter by active tab (supports single category or multiple comma-separated categories)
  const filteredItems = activeTab === 'all'
    ? mappedLinks
    : activeTab === 'saved'
      ? mappedLinks.filter(link => {
          const cat = (link.category || '').toLowerCase().trim();
          const col = (link.collection || '').toLowerCase().trim();
          return cat === 'saved' || col === 'saved';
        })
      : mappedLinks.filter((link) => {
          if (!currentTabConfig) return true;
          const targetCategory = currentTabConfig.categoryVal.toLowerCase();
          const linkCat = (link.category || '').toLowerCase().trim();
          
          // Match exact or inside comma-separated list
          const categoriesList = linkCat.split(',').map(c => c.trim());
          return categoriesList.includes(targetCategory) || linkCat === targetCategory;
        });

  // Pagination for 3 rows x 4 columns (12 items per page)
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  return (
    <section className="links-section" id="use-cases">
      <div className="links-container">

        {/* Left Sidebar */}
        <div className="links-sidebar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="links-content">
          <div className="links-header">
            <h2>{meta.title}</h2>
            <p>{meta.description}</p>
          </div>

          <div className="links-grid">
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((item) => (
                <LinkCard key={item.id} item={item} />
              ))
            ) : (
              <div className="empty-links-state">
                <div className="empty-links-lottie">
                  <img
                    src="/assets/empty/pixeltrue-website-ranking-improvement-by-collaborative-seo-strategy.svg"
                    alt="No links saved"
                    style={{ width: '220px', height: '170px', objectFit: 'contain' }}
                  />
                </div>
                <h3 className="empty-links-title">No links saved in {meta.title}</h3>
                <p className="empty-links-subtitle">
                  Keep your favorite articles, tools, and inspirations organized in one place.
                </p>
                {onAddLink && (
                  <button type="button" className="empty-links-add-btn" onClick={onAddLink}>
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

          {/* Pagination — 4 columns x 3 rows = 12 items per page */}
          {totalPages > 1 && (
            <div className="links-pagination">
              {/* Prev */}
              <button
                type="button"
                className="links-nav-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                <span>Prev</span>
              </button>

              {/* Page Numbers */}
              <div className="links-page-numbers">
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    type="button"
                    className={`links-page-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                type="button"
                className="links-nav-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                <span>Next</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
