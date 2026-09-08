import React, { useState, useEffect } from 'react';
import { Edit2, X, Plus } from 'lucide-react';
import '../home/SaveLinkModal.css';

const AI_CATEGORIES = [
  { id: 'ui-web', label: 'UI & Web' },
  { id: 'art-images', label: 'Image & Art' },
  { id: 'copy-llm', label: 'Chat & LLMs' },
  { id: '3d-motion', label: '3D & Motion' },
  { id: 'code-dev', label: 'Dev & Code' },
  { id: 'color-brand', label: 'Color & Brand' },
  { id: 'workflow', label: 'Workflow' },
];

export default function EditAIToolModal({
  isOpen,
  tool,
  onClose,
  onSave,
  isSubmitting = false
}) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [tag, setTag] = useState('');
  const [category, setCategory] = useState('ui-web');
  const [pricing, setPricing] = useState('FREEMIUM');
  const [bannerUrl, setBannerUrl] = useState('');
  const [showInEssential, setShowInEssential] = useState(false);
  const [isPartner, setIsPartner] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && tool) {
      setName(tool.name || tool.title || '');
      setUrl(tool.url || '');
      setDesc(tool.desc || tool.description || '');
      setTag(tool.tag || '');
      setCategory(tool.category || 'ui-web');
      setPricing(tool.pricing || 'FREEMIUM');
      setBannerUrl(tool.bannerUrl || '');
      setShowInEssential(Boolean(tool.showInEssential));
      setIsPartner(Boolean(tool.isPartner));
      setError('');
    }
  }, [isOpen, tool]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSubmitting) onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen || !tool) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError('Tool name and Website URL are required.');
      return;
    }

    onSave({
      ...tool,
      name: name.trim(),
      url: url.trim(),
      desc: desc.trim(),
      tag: tag.trim() || 'AI Tool',
      category,
      pricing,
      bannerUrl: bannerUrl.trim(),
      showInEssential,
      isPartner,
      bannerType: tool.bannerType || 'dynamic-db'
    });
  };

  return (
    <div className="save-modal-backdrop" onClick={() => !isSubmitting && onClose()} role="presentation">
      <div className="save-modal-card" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
        <div className="save-modal-header">
          <div className="save-modal-badge" style={{ backgroundColor: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
            <Edit2 size={12} style={{ marginRight: '4px' }} />
            <span>EDIT AI TOOL</span>
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
          <h2>Edit AI Tool</h2>
          <p>Update AI tool name, category, pricing, and home features.</p>
        </div>

        <form onSubmit={handleSubmit} className="save-modal-form">
          <div className="modal-input-group">
            <label htmlFor="ai-edit-name">Tool Name <span className="required-star">*</span></label>
            <input
              id="ai-edit-name"
              required
              type="text"
              placeholder="e.g. Midjourney, Cursor, Claude"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="modern-modal-input"
              style={{ paddingLeft: '14px' }}
            />
          </div>

          <div className="modal-input-group">
            <label htmlFor="ai-edit-url">Website URL <span className="required-star">*</span></label>
            <input
              id="ai-edit-url"
              required
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="modern-modal-input"
              style={{ paddingLeft: '14px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="modal-input-group">
              <label htmlFor="ai-edit-tag">Tag / Role <span className="required-star">*</span></label>
              <input
                id="ai-edit-tag"
                type="text"
                placeholder="e.g. Graphic AI, Code Editor"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="modern-modal-input"
                style={{ paddingLeft: '14px' }}
              />
            </div>
            <div className="modal-input-group">
              <label htmlFor="ai-edit-pricing">Pricing</label>
              <select
                id="ai-edit-pricing"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                className="modern-modal-input"
                style={{ paddingLeft: '14px', height: '46px' }}
              >
                <option value="FREEMIUM">FREEMIUM</option>
                <option value="FREE">FREE</option>
                <option value="PAID">PAID</option>
                <option value="FREE + PAID">FREE + PAID</option>
                <option value="FREE TRIAL">FREE TRIAL</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="modal-input-group">
              <label htmlFor="ai-edit-cat">Category</label>
              <select
                id="ai-edit-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="modern-modal-input"
                style={{ paddingLeft: '14px', height: '46px' }}
              >
                {AI_CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="modal-input-group">
              <label htmlFor="ai-edit-banner">Banner Image URL</label>
              <input
                id="ai-edit-banner"
                type="url"
                placeholder="Optional banner image URL"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="modern-modal-input"
                style={{ paddingLeft: '14px' }}
              />
            </div>
          </div>

          <div className="modal-input-group">
            <label htmlFor="ai-edit-desc">Description <span className="required-star">*</span></label>
            <textarea
              id="ai-edit-desc"
              rows="3"
              required
              placeholder="Describe what this AI tool does..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="modern-modal-textarea"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '4px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={showInEssential}
                onChange={(e) => setShowInEssential(e.target.checked)}
              />
              <strong>Feature in Essential AI Tools on Home Page</strong>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isPartner}
                onChange={(e) => setIsPartner(e.target.checked)}
              />
              <span>Mark as Partner Tool</span>
            </label>
          </div>

          {error && (
            <div className="modal-error-banner" style={{ color: '#ef4444', fontSize: '0.85rem' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="save-modal-actions" style={{ marginTop: '14px' }}>
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
              disabled={isSubmitting || !name.trim() || !url.trim()}
              className="modal-submit-btn"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
