import React, { useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  title = 'Delete Item',
  itemName = '',
  itemType = 'item',
  message,
  onClose,
  onConfirm,
  isDeleting = false
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (isDeleting) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        onConfirm();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="delete-modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        animation: 'modalFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      onClick={() => !isDeleting && onClose()}
      role="presentation"
    >
      <div
        className="delete-modal-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          borderRadius: '20px',
          padding: '26px 28px',
          boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          animation: 'modalScaleUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
          textAlign: 'left'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            backgroundColor: '#fee2e2',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px'
          }}
        >
          <Trash2 size={22} color="#ef4444" />
        </div>

        <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
          {title}
        </h3>

        <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
          {message || (
            <>
              Are you sure you want to delete <strong>{itemName || `this ${itemType}`}</strong>? This action cannot be undone.
            </>
          )}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              color: '#475569',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            autoFocus
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
