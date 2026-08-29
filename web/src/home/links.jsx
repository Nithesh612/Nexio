import React, { useState } from 'react';
import LottieAnimation from './LottieAnimation';
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json';
import { Layers, PenTool, Bot, Code, BookOpen, Lightbulb } from 'lucide-react';
import './links.css';

// Category tab metadata (no items — all from DB)
const tabMeta = {
  all:         { title: 'All Links',    description: 'Browse all your saved links across every category.' },
  uiux:        { title: 'UI/UX',        description: 'Design tools, inspiration and resources for UI/UX designers.' },
  'ai-agents': { title: 'AI Agents',    description: 'Powerful AI agent tools and platforms to automate your workflow.' },
  development: { title: 'Development',  description: 'Developer tools, libraries and resources to build faster.' },
  resources:   { title: 'Resources',    description: 'Curated resources for learning, productivity, and creativity.' },
  inspiration: { title: 'Inspiration',  description: 'Visual inspiration and creative references for your next project.' },
};

// Gradient palette per category
const categoryColors = {
  'UI/UX':       ['#667eea', '#764ba2'],
  'AI Agents':   ['#f093fb', '#f5576c'],
  'Development': ['#4facfe', '#00f2fe'],
  'Resources':   ['#43e97b', '#38f9d7'],
  'Inspiration': ['#fa709a', '#fee140'],
  'default':     ['#a18cd1', '#fbc2eb'],
};

function LinkCard({ item }) {
  const [screenshotError, setScreenshotError] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(item.url)}&screenshot=true&meta=false&embed=screenshot.url`;
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${(() => { try { return new URL(item.url).hostname; } catch { return ''; } })()}&sz=64`;
  const hostname = (() => { try { return new URL(item.url).hostname.replace('www.', ''); } catch { return ''; } })();
  const colors = categoryColors[item.category] || categoryColors['default'];

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-card">
      {/* Screenshot / Preview Banner */}
      <div className="link-card-banner">
        {!screenshotError ? (
          <img
            src={screenshotUrl}
            alt={item.title}
            className="link-screenshot"
            onError={() => setScreenshotError(true)}
          />
        ) : (
          <div
            className="link-banner-fallback"
            style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
          >
            {!faviconError ? (
              <img
                src={faviconUrl}
                alt={item.title}
                className="link-banner-favicon"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <span className="link-banner-letter">{item.title.charAt(0)}</span>
            )}
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

export default function LinksSection({ savedLinks = [] }) {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // 3 columns × 3 rows

  const tabs = [
    { id: 'all',         label: 'All Links',   icon: Layers },
    { id: 'uiux',        label: 'UI/UX',       icon: PenTool },
    { id: 'ai-agents',   label: 'AI Agents',   icon: Bot },
    { id: 'development', label: 'Development', icon: Code },
    { id: 'resources',   label: 'Resources',   icon: BookOpen },
    { id: 'inspiration', label: 'Inspiration', icon: Lightbulb },
  ];

  const meta = tabMeta[activeTab] || tabMeta.all;

  // Map DB links to LinkCard format
  const mappedLinks = savedLinks.map(link => ({
    id: link.id || link._id,
    title: link.title,
    desc: link.description || '',
    url: link.url,
    category: link.type || link.category || 'Other',
  }));

  // Filter by active tab
  const filteredItems = activeTab === 'all'
    ? mappedLinks
    : mappedLinks.filter(
        link => link.category.toLowerCase().replace(/[\/\s-]/g, '') === activeTab.replace(/[\/\s-]/g, '')
      );

  // Pagination only for All Links
  const isPaginated = activeTab === 'all';
  const totalPages = isPaginated ? Math.ceil(filteredItems.length / itemsPerPage) : 1;
  const currentItems = isPaginated
    ? filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : filteredItems;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  return (
    <section className="links-section">
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
              <div className="empty-links">
                <LottieAnimation
                  animationData={emptyAnimation}
                  width={260}
                  height={260}
                />
                <p>No links found in this category. Use "Add Link" to save one!</p>
              </div>
            )}
          </div>

          {/* Pagination — only for All Links tab */}
          {isPaginated && totalPages > 1 && (
            <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:'12px', marginTop:'40px', paddingTop:'24px', borderTop:'1px solid #f1f5f9'}}>
              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '999px',
                  border: '1.5px solid', fontSize: '13px', fontWeight: 600,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  background: currentPage === 1 ? '#f8fafc' : '#0f172a',
                  borderColor: currentPage === 1 ? '#e2e8f0' : '#0f172a',
                  color: currentPage === 1 ? '#cbd5e1' : '#ffffff',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Prev
              </button>

              {/* Page Numbers */}
              <div style={{display:'flex', alignItems:'center', gap:'6px'}}>
                {Array.from({length: totalPages}, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      border: '1.5px solid', fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer', transition: 'all 0.2s',
                      background: currentPage === page ? '#0f172a' : 'transparent',
                      borderColor: currentPage === page ? '#0f172a' : '#e2e8f0',
                      color: currentPage === page ? '#ffffff' : '#64748b',
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 18px', borderRadius: '999px',
                  border: '1.5px solid', fontSize: '13px', fontWeight: 600,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  background: currentPage === totalPages ? '#f8fafc' : '#0f172a',
                  borderColor: currentPage === totalPages ? '#e2e8f0' : '#0f172a',
                  color: currentPage === totalPages ? '#cbd5e1' : '#ffffff',
                }}
              >
                Next
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
