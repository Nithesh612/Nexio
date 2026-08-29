import React, { useState, useEffect } from 'react';
import './SaveLinkModal.css';

const CATEGORIES = [
  { id: 'UI/UX', label: 'UI/UX', icon: '🎨' },
  { id: 'AI Agents', label: 'AI Agents', icon: '🤖' },
  { id: 'Development', label: 'Development', icon: '⚡' },
  { id: 'Resources', label: 'Resources', icon: '📚' },
  { id: 'Inspiration', label: 'Inspiration', icon: '✨' },
  { id: 'Other', label: 'Other', icon: '📁' },
];

function getFavicon(url) {
  try {
    const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
}

function formatTitle(url) {
  try {
    const clean = url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const name = clean.split('.')[0];
    return name ? name.charAt(0).toUpperCase() + name.slice(1) : 'New Link';
  } catch {
    return 'New Link';
  }
}

export default function SaveLinkModal({ isOpen, onClose, onSave, saveError, isSubmitting = false }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [customTitle, setCustomTitle] = useState(false);
  const [category, setCategory] = useState('UI/UX');
  const [imgError, setImgError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (url.trim() && !customTitle) {
      setTitle(formatTitle(url));
    }
    setImgError(false);
  }, [url, customTitle]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    onSave({
      url: url.trim(),
      title: title.trim() || formatTitle(url),
      category: category || 'UI/UX',
    });
  };

  const faviconUrl = getFavicon(url);
  const hostname = (() => {
    try {
      return new URL(url.startsWith('http') ? url : `https://${url}`).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  })();

  return (
    <div className="save-modal-backdrop" onClick={onClose} role="presentation">
      <div className="save-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="save-modal-header">
          <div className="save-modal-badge">
            <span className="badge-sparkle">✦</span>
            <span>NEW BOOKMARK</span>
          </div>
          <button
            type="button"
            className="save-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="save-modal-headings">
          <h2>Save a useful link</h2>
          <p>Add tools, articles, or resources to your central link hub.</p>
        </div>

        <form onSubmit={handleSubmit} className="save-modal-form">
          {/* URL Input */}
          <div className="modal-input-group">
            <label htmlFor="modal-url">
              Website URL <span className="required-star">*</span>
            </label>
            <div className="modal-input-wrapper">
              <span className="input-prefix-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
              </span>
              <input
                id="modal-url"
                required
                type="text"
                autoFocus
                placeholder="https://example.com/article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="modern-modal-input"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          {url.trim() && (
            <div className="modal-preview-box">
              <div className="modal-preview-icon">
                {faviconUrl && !imgError ? (
                  <img
                    src={faviconUrl}
                    alt=""
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="modal-preview-fallback">
                    {title ? title.charAt(0).toUpperCase() : '🔗'}
                  </div>
                )}
              </div>
              <div className="modal-preview-info">
                <div className="modal-preview-title-row">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setCustomTitle(true);
                    }}
                    placeholder="Link Title"
                    className="modal-preview-title-input"
                  />
                  <span className="preview-auto-badge">Auto Title</span>
                </div>
                {hostname && <span className="modal-preview-url">{hostname}</span>}
              </div>
            </div>
          )}

          {/* Category Chips Selector */}
          <div className="modal-input-group">
            <label>Select Category</label>
            <div className="category-chips-grid">
              {CATEGORIES.slice(0, 5).map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => setCategory(cat.id)}
                  >
                    <span className="chip-icon">{cat.icon}</span>
                    <span className="chip-label">{cat.label}</span>
                  </button>
                );
              })}
              
              {/* More Dropdown */}
              <div className="more-category-wrapper">
                <button
                  type="button"
                  className={`category-chip more-chip ${!CATEGORIES.slice(0, 5).some(c => c.id === category) ? 'selected' : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="chip-icon">⋯</span>
                  <span className="chip-label">More</span>
                </button>
                
                <div className={`more-dropdown-menu ${isDropdownOpen ? 'show-dropdown' : ''}`}>
                  {['Design', 'Article', 'Research', 'Tools', 'Other'].map(extraCat => (
                    <button
                      key={extraCat}
                      type="button"
                      className={`dropdown-item ${category === extraCat ? 'active' : ''}`}
                      onClick={() => {
                        setCategory(extraCat);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {extraCat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {saveError && (
            <div className="modal-error-banner">
              <span>⚠️</span>
              <span>{saveError}</span>
            </div>
          )}

          {/* Actions */}
          <div className="save-modal-actions">
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !url.trim()}
              className="modal-submit-btn"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <span>Save link</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
