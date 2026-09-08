import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Sparkles,
  Bot,
  Lightbulb,
  Archive,
  Monitor,
  Camera,
  Server,
  Search,
  PenTool,
  Bookmark,
  Zap,
  Edit2,
  X
} from 'lucide-react';
import '../home/SaveLinkModal.css';

export const CATEGORIES = [
  { id: 'Saved', label: 'Saved', icon: Bookmark },
  { id: 'Quick Assets', label: 'Quick Assets', icon: Zap },
  { id: 'UI/UX', label: 'UI/UX', icon: LayoutGrid },
  { id: 'AI Image & Video', label: 'AI Image & Video', icon: Sparkles },
  { id: 'AI Tools', label: 'AI Tools', icon: Bot },
  { id: 'Inspiration', label: 'Inspiration', icon: Lightbulb },
  { id: 'Other', label: 'Other', icon: Archive },
  { id: 'Wallpaper', label: 'Wallpaper', icon: Monitor },
  { id: 'Stock', label: 'Stock', icon: Camera },
  { id: 'Host', label: 'Host', icon: Server },
  { id: 'Research', label: 'Research', icon: Search },
  { id: 'Tools', label: 'Tools', icon: PenTool },
];

export default function EditLinkModal({
  isOpen,
  item,
  onClose,
  onSave,
  isSubmitting = false
}) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState(['Saved']);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [badge, setBadge] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [error, setError] = useState('');

  // Populate form when modal opens or item changes
  useEffect(() => {
    if (isOpen && item) {
      setTitle(item.title || item.name || '');
      setUrl(item.url || '');
      setDescription(item.description || item.desc || '');
      setBadge(item.badge || '');
      setBannerUrl(item.bannerUrl || '');
      setError('');

      // Parse existing categories
      let initialCats = [];
      const rawCat = item.category || item.type || '';
      if (rawCat) {
        initialCats = rawCat
          .split(',')
          .map(c => c.trim())
          .filter(Boolean);
      }
      if (item.collection === 'Quick Assets' && !initialCats.some(c => c.toLowerCase().includes('quick'))) {
        initialCats.push('Quick Assets');
      }
      if (initialCats.length === 0) {
        initialCats = ['Saved'];
      }

      setSelectedCategories(initialCats);
      setIsMultiSelectMode(initialCats.length > 1);
    }
  }, [isOpen, item]);

  // Handle category chip click
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
      setSelectedCategories([catId]);
    }
  };

  // Toggle multi-select mode checkbox
  const toggleMultiSelectMode = (checked) => {
    setIsMultiSelectMode(checked);
    if (!checked && selectedCategories.length > 1) {
      setSelectedCategories([selectedCategories[0]]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) {
      setError('Title and Website URL are required.');
      return;
    }

    const cats = selectedCategories.length ? selectedCategories : ['Saved'];
    const categoryString = cats.join(', ');
    const isQuick = cats.includes('Quick Assets') || cats.some(c => String(c).toLowerCase().includes('quick')) || item.collection === 'Quick Assets';

    onSave({
      ...item,
      title: title.trim(),
      url: url.trim(),
      category: categoryString,
      categories: cats,
      description: description.trim(),
      collection: isQuick ? 'Quick Assets' : (item.collection || 'All Links'),
      badge: badge.trim(),
      bannerUrl: bannerUrl.trim(),
      favorite: item.favorite,
      readLater: item.readLater
    });
  };

  return (
    <div className="save-modal-backdrop" onClick={() => !isSubmitting && onClose()} role="presentation">
      <div className="save-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="save-modal-header">
          <div className="save-modal-badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
            <Edit2 size={12} style={{ marginRight: '4px' }} />
            <span>EDIT LINK</span>
          </div>
          <button
            type="button"
            className="save-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isSubmitting}
          >
            <X size={16} />
          </button>
        </div>

        <div className="save-modal-headings">
          <h2>Edit Bookmark</h2>
          <p>Update title, URL, categories, and description for this resource.</p>
        </div>

        <form onSubmit={handleSubmit} className="save-modal-form">
          {/* Title Input */}
          <div className="modal-input-group">
            <label htmlFor="edit-title">
              Title <span className="required-star">*</span>
            </label>
            <div className="modal-input-wrapper">
              <input
                id="edit-title"
                required
                type="text"
                placeholder="Link Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="modern-modal-input"
                style={{ paddingLeft: '14px' }}
              />
            </div>
          </div>

          {/* URL Input */}
          <div className="modal-input-group">
            <label htmlFor="edit-url">
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
                id="edit-url"
                required
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="modern-modal-input"
              />
            </div>
          </div>

          {/* Description Input */}
          <div className="modal-input-group">
            <label htmlFor="edit-description">
              <span>Description / Notes</span>
            </label>
            <div className="modal-input-wrapper description-wrapper">
              <textarea
                id="edit-description"
                rows="2"
                placeholder="Describe this tool or reference..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="modern-modal-textarea"
              />
            </div>
          </div>

          {/* Multi-Category Selector */}
          <div className="modal-input-group">
            <div className="category-section-header">
              <label className="category-label-left">
                <span>Categories</span>
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
              {CATEGORIES.map((cat) => {
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
            </div>
          </div>

          {/* Optional Badge / Banner URL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="modal-input-group">
              <label htmlFor="edit-badge">Badge (Optional)</label>
              <input
                id="edit-badge"
                type="text"
                placeholder="e.g. Free, Pro, New"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="modern-modal-input"
                style={{ paddingLeft: '14px', height: '40px', fontSize: '13px' }}
              />
            </div>
            <div className="modal-input-group">
              <label htmlFor="edit-banner">Banner URL (Optional)</label>
              <input
                id="edit-banner"
                type="url"
                placeholder="https://..."
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="modern-modal-input"
                style={{ paddingLeft: '14px', height: '40px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="modal-error-banner" style={{ color: '#ef4444', fontSize: '0.85rem' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="save-modal-actions" style={{ marginTop: '10px' }}>
            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title.trim() || !url.trim() || selectedCategories.length === 0}
              className="modal-submit-btn"
            >
              {isSubmitting ? (
                <span>Saving Changes...</span>
              ) : (
                <>
                  <span>Save Changes</span>
                  <Edit2 size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
