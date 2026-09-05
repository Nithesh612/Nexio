import React, { useState, useEffect } from 'react';
import {
  Palette,
  Video,
  Sparkles,
  Code,
  Image as ImageIcon,
  Camera,
  Globe,
  PenTool,
  FileText,
  FlaskConical,
  Wrench,
  Folder,
  Layers,
  Ellipsis,
  Bookmark
} from 'lucide-react';
import { analyzeLinkUrl } from '../utils/urlAnalyzer';
import './SaveLinkModal.css';

const PRIMARY_CATEGORIES = [
  { id: 'Saved', label: 'Saved', icon: Bookmark },
  { id: 'UI/UX', label: 'UI/UX', icon: Palette },
  { id: 'AI Image & Video', label: 'AI Image & Video', icon: Video },
  { id: 'AI', label: 'AI', icon: Sparkles },
  { id: 'Inspiration', label: 'Inspiration', icon: Layers },
  { id: 'Other', label: 'Other', icon: Folder },
];

const MORE_CATEGORIES = [
  { id: 'Wallpaper', label: 'Wallpaper', icon: ImageIcon },
  { id: 'Stock', label: 'Stock', icon: Camera },
  { id: 'Host', label: 'Host', icon: Globe },
  { id: 'Article', label: 'Article', icon: FileText },
  { id: 'Research', label: 'Research', icon: FlaskConical },
  { id: 'Tools', label: 'Tools', icon: Wrench },
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

export default function SaveLinkModal({ isOpen, onClose, onSave, saveError, onClearError, isSubmitting = false }) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customTitle, setCustomTitle] = useState(false);
  const [customDescription, setCustomDescription] = useState(false);
  const [detectedTag, setDetectedTag] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check how many extra categories are selected from "More"
  const selectedMoreCategories = MORE_CATEGORIES.filter(c => selectedCategories.includes(c.id));
  const isExtraCategorySelected = selectedMoreCategories.length > 0;

  // Toggle category on/off or single select based on isMultiSelectMode
  const handleCategoryClick = (catId) => {
    if (isMultiSelectMode) {
      setSelectedCategories(prev => {
        if (prev.includes(catId)) {
          if (prev.length === 1) return prev; // keep at least 1 selected
          return prev.filter(id => id !== catId);
        } else {
          return [...prev, catId];
        }
      });
    } else {
      // Single select mode
      setSelectedCategories([catId]);
      setIsDropdownOpen(false);
    }
  };

  // When multi-select mode is turned off, retain only the first selected category
  const toggleMultiSelectMode = (checked) => {
    setIsMultiSelectMode(checked);
    if (!checked && selectedCategories.length > 1) {
      setSelectedCategories([selectedCategories[0]]);
    }
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setTitle('');
      setDescription('');
      setCustomTitle(false);
      setCustomDescription(false);
      setDetectedTag(null);
      setSelectedCategories([]);
      setIsMultiSelectMode(false);
      setImgError(false);
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleDocumentClick = (e) => {
      if (!e.target.closest('.more-category-wrapper')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleDocumentClick);
    return () => document.removeEventListener('pointerdown', handleDocumentClick);
  }, [isDropdownOpen]);

  // Live intelligent URL analysis
  useEffect(() => {
    if (!url.trim()) {
      setDetectedTag(null);
      if (!customTitle) setTitle('');
      if (!customDescription) setDescription('');
      return;
    }

    const analysis = analyzeLinkUrl(url);
    if (analysis) {
      setDetectedTag(analysis.tag || analysis.category);
      if (!customTitle) {
        setTitle(analysis.title || formatTitle(url));
      }
      if (!customDescription) {
        setDescription(analysis.description || '');
      }
      if (selectedCategories.length === 0 && analysis.category) {
        setSelectedCategories([analysis.category]);
      }
    } else {
      setDetectedTag(null);
      if (!customTitle) {
        setTitle(formatTitle(url));
      }
    }
    setImgError(false);
  }, [url, customTitle, customDescription]);

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
    if (!selectedCategories.length) {
      return;
    }
    const categoryString = selectedCategories.join(', ');
    onSave({
      url: url.trim(),
      title: title.trim() || formatTitle(url),
      category: categoryString,
      categories: selectedCategories,
      description: description.trim(),
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
          <p>Add tools, articles, or color & design resources to your central hub.</p>
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
                autoComplete="off"
                spellCheck="false"
                placeholder="https://coolors.co or https://example.com"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (saveError && onClearError) onClearError();
                }}
                className="modern-modal-input"
              />
            </div>
          </div>

          {/* Smart Live Detection Badge */}
          {detectedTag && (
            <div className="smart-detection-badge">
              <span className="smart-tag-sparkle">✨</span>
              <span className="smart-tag-text">Auto-detected: <strong>{detectedTag}</strong></span>
            </div>
          )}

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

          {/* Description Input */}
          <div className="modal-input-group">
            <label htmlFor="modal-description" className="modal-field-label-sub">
              <span>Description / Notes</span>
              <span className="auto-suggest-hint">{detectedTag ? '✨ Smart suggestion' : '(Optional)'}</span>
            </label>
            <div className="modal-input-wrapper description-wrapper">
              <textarea
                id="modal-description"
                rows="2"
                placeholder="Describe this tool, color resource, or reference..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setCustomDescription(true);
                }}
                className="modern-modal-textarea"
              />
            </div>
          </div>

          {/* Category Chips Selector */}
          <div className="modal-input-group">
            <div className="category-section-header">
              <label className="category-label-left">
                <span>Select Category</span>
              </label>

              <div className="category-section-header-right">
                <div className="selected-category-badges-row">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map(catName => (
                      <span key={catName} className="selected-category-badge">
                        {catName}
                      </span>
                    ))
                  ) : (
                    <span className="selected-category-badge-empty">None</span>
                  )}
                </div>

                <label className="multi-select-checkbox-toggle" title="Enable multiple category selection">
                  <input
                    type="checkbox"
                    checked={isMultiSelectMode}
                    onChange={(e) => toggleMultiSelectMode(e.target.checked)}
                  />
                  <span className="checkbox-custom-box"></span>
                </label>
              </div>
            </div>

            <div className="category-chips-grid">
              {PRIMARY_CATEGORIES.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`category-chip ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleCategoryClick(cat.id)}
                  >
                    <span className="chip-icon">
                      <IconComponent size={15} />
                    </span>
                    <span className="chip-label">{cat.label}</span>
                    {isSelected && isMultiSelectMode && <span className="chip-check-mark">✓</span>}
                  </button>
                );
              })}

              {/* More Dropdown */}
              <div className="more-category-wrapper">
                <button
                  type="button"
                  className={`category-chip more-chip ${isExtraCategorySelected ? 'selected active-more' : ''} ${isDropdownOpen ? 'dropdown-active' : ''}`}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="chip-icon">
                    <Ellipsis size={15} />
                  </span>
                  <span className="chip-label">
                    {selectedMoreCategories.length > 0
                      ? isMultiSelectMode
                        ? `${selectedMoreCategories.length} More`
                        : selectedMoreCategories[0].label
                      : 'More'}
                  </span>
                  <svg className={`more-arrow ${isDropdownOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>

                <div className={`more-dropdown-menu ${isDropdownOpen ? 'show-dropdown' : ''}`}>
                  <div className="dropdown-menu-header">
                    {isMultiSelectMode ? 'More Categories (Multiple)' : 'More Categories'}
                  </div>
                  {MORE_CATEGORIES.map(extraCat => {
                    const ExtraIcon = extraCat.icon;
                    const isExtraSelected = selectedCategories.includes(extraCat.id);
                    return (
                      <button
                        key={extraCat.id}
                        type="button"
                        className={`dropdown-item ${isExtraSelected ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(extraCat.id)}
                      >
                        <span className="dropdown-item-icon">
                          <ExtraIcon size={15} />
                        </span>
                        <span className="dropdown-item-label">{extraCat.label}</span>
                        {isExtraSelected && (
                          <span className="dropdown-item-check">✓</span>
                        )}
                      </button>
                    );
                  })}
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
              disabled={isSubmitting || !url.trim() || selectedCategories.length === 0}
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
