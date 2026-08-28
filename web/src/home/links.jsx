import React, { useState } from 'react';
import LottieAnimation from './LottieAnimation';
import emptyAnimation from '../assets/svg/Man and robot with computers sitting together in workplace.json';
import './links.css';

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
}

const linksData = {
  all: {
    title: 'All Links',
    description: 'Browse all curated links across every category.',
    items: [
      { id: 1, title: 'Framer', desc: 'Design and publish production-ready websites with zero code.', url: 'https://www.framer.com', category: 'UI/UX' },
      { id: 2, title: 'Figma', desc: 'Collaborative interface design tool built for teams.', url: 'https://www.figma.com', category: 'UI/UX' },
      { id: 3, title: 'GitHub Copilot', desc: 'AI-powered code assistant inside your editor.', url: 'https://github.com/features/copilot', category: 'Development' },
      { id: 4, title: 'Vercel', desc: 'Deploy and scale your web projects instantly.', url: 'https://vercel.com', category: 'Development' },
      { id: 5, title: 'Notion', desc: 'All-in-one workspace for notes, docs and projects.', url: 'https://www.notion.so', category: 'Resources' },
      { id: 6, title: 'Runway ML', desc: 'Generate and edit video clips from a single prompt.', url: 'https://runwayml.com', category: 'AI Agents' },
      { id: 7, title: 'Midjourney', desc: 'Generate stunning artwork from text prompts.', url: 'https://www.midjourney.com', category: 'AI Agents' },
      { id: 8, title: 'Dribbble', desc: 'Discover the world\'s top designers and creatives.', url: 'https://dribbble.com', category: 'Inspiration' },
      { id: 9, title: 'Awwwards', desc: 'The awards for design, creativity and innovation.', url: 'https://www.awwwards.com', category: 'Inspiration' },
    ],
  },
  uiux: {
    title: 'UI/UX',
    description: 'Design tools, inspiration and resources for UI/UX designers.',
    items: [
      { id: 10, title: 'Framer', desc: 'Design and publish production-ready websites with zero code.', url: 'https://www.framer.com', category: 'UI/UX' },
      { id: 11, title: 'Figma', desc: 'Collaborative interface design tool built for teams.', url: 'https://www.figma.com', category: 'UI/UX' },
      { id: 12, title: 'Mobbin', desc: 'The world\'s largest mobile & web design reference library.', url: 'https://mobbin.com', category: 'UI/UX' },
      { id: 13, title: 'Spline', desc: 'Design and publish 3D web experiences in the browser.', url: 'https://spline.design', category: 'UI/UX' },
      { id: 14, title: 'Lottiefiles', desc: 'Lightweight animations for your apps and websites.', url: 'https://lottiefiles.com', category: 'UI/UX' },
      { id: 15, title: 'UI Verse', desc: 'Open-source UI elements made with HTML & CSS.', url: 'https://uiverse.io', category: 'UI/UX' },
    ],
  },
  'ai-agents': {
    title: 'AI Agents',
    description: 'Powerful AI agent tools and platforms to automate your workflow.',
    items: [
      { id: 20, title: 'Runway ML', desc: 'Generate and edit video clips from a single prompt.', url: 'https://runwayml.com', category: 'AI Agents' },
      { id: 21, title: 'Midjourney', desc: 'Generate stunning artwork from text prompts.', url: 'https://www.midjourney.com', category: 'AI Agents' },
      { id: 22, title: 'Character.AI', desc: 'Chat and create with AI characters consistently.', url: 'https://character.ai', category: 'AI Agents' },
      { id: 23, title: 'Claude', desc: 'AI assistant by Anthropic, built for complex tasks.', url: 'https://claude.ai', category: 'AI Agents' },
      { id: 24, title: 'Perplexity', desc: 'AI-powered search engine with sourced answers.', url: 'https://www.perplexity.ai', category: 'AI Agents' },
      { id: 25, title: 'Pika Labs', desc: 'Create and edit videos using simple text prompts.', url: 'https://pika.art', category: 'AI Agents' },
    ],
  },
  development: {
    title: 'Development',
    description: 'Developer tools, libraries and resources to build faster.',
    items: [
      { id: 30, title: 'GitHub Copilot', desc: 'AI-powered code assistant inside your editor.', url: 'https://github.com/features/copilot', category: 'Development' },
      { id: 31, title: 'Vercel', desc: 'Deploy and scale your web projects with ease.', url: 'https://vercel.com', category: 'Development' },
      { id: 32, title: 'Supabase', desc: 'Open source Firebase alternative with Postgres.', url: 'https://supabase.com', category: 'Development' },
      { id: 33, title: 'Tauri', desc: 'Build smaller, faster desktop apps with web tech.', url: 'https://tauri.app', category: 'Development' },
      { id: 34, title: 'Railway', desc: 'Deploy your apps and databases in seconds.', url: 'https://railway.app', category: 'Development' },
      { id: 35, title: 'Vite', desc: 'Next generation frontend tooling for faster builds.', url: 'https://vitejs.dev', category: 'Development' },
    ],
  },
  resources: {
    title: 'Resources',
    description: 'Curated resources for learning, productivity, and creativity.',
    items: [
      { id: 40, title: 'Notion', desc: 'All-in-one workspace for notes, docs and projects.', url: 'https://www.notion.so', category: 'Resources' },
      { id: 41, title: 'Descript', desc: 'Edit video and audio as easily as a document.', url: 'https://www.descript.com', category: 'Resources' },
      { id: 42, title: 'Readwise', desc: 'Resurface your best highlights from books and articles.', url: 'https://readwise.io', category: 'Resources' },
      { id: 43, title: 'Obsidian', desc: 'Powerful knowledge base that works on local Markdown files.', url: 'https://obsidian.md', category: 'Resources' },
      { id: 44, title: 'Excalidraw', desc: 'Virtual whiteboard for sketching hand-drawn diagrams.', url: 'https://excalidraw.com', category: 'Resources' },
    ],
  },
  inspiration: {
    title: 'Inspiration',
    description: 'Visual inspiration and creative references for your next project.',
    items: [
      { id: 50, title: 'Dribbble', desc: 'Discover the world\'s top designers and creatives.', url: 'https://dribbble.com', category: 'Inspiration' },
      { id: 51, title: 'Awwwards', desc: 'The awards for design, creativity and innovation.', url: 'https://www.awwwards.com', category: 'Inspiration' },
      { id: 52, title: 'Behance', desc: 'Showcase and discover creative work from top artists.', url: 'https://www.behance.net', category: 'Inspiration' },
      { id: 53, title: 'Godly', desc: 'The best web design inspiration in the world.', url: 'https://godly.website', category: 'Inspiration' },
      { id: 54, title: 'Landingfolio', desc: 'The best landing page design inspiration and templates.', url: 'https://www.landingfolio.com', category: 'Inspiration' },
    ],
  },
};

// Palette for card banner gradient fallbacks per category
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

export default function LinksSection() {
  const [activeTab, setActiveTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'All Links' },
    { id: 'uiux', label: 'UI/UX' },
    { id: 'ai-agents', label: 'AI Agents' },
    { id: 'development', label: 'Development' },
    { id: 'resources', label: 'Resources' },
    { id: 'inspiration', label: 'Inspiration' },
  ];

  const currentData = linksData[activeTab];

  return (
    <section className="links-section">
      <div className="links-container">

        {/* Left Sidebar */}
        <div className="links-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`sidebar-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Content Area */}
        <div className="links-content">
          <div className="links-header">
            <h2>{currentData.title}</h2>
            <p>{currentData.description}</p>
          </div>

          <div className="links-grid">
            {currentData.items && currentData.items.length > 0 ? (
              currentData.items.map((item) => (
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
        </div>

      </div>
    </section>
  );
}
