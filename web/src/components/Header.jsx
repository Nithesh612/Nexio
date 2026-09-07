import React, { useState, useEffect } from 'react'
import { Plus, LogIn, LogOut, User } from 'lucide-react'
import '../home/hero.css'

const NAV_LINKS = [
  { label: 'Home', targetView: 'landing', hash: '#home' },
  { label: 'Design', targetView: 'design', hash: '#design' },
  { label: 'AI Tools', targetView: 'ai-tools', hash: '#ai-tools' },
  { label: 'Blog', targetView: 'blog', hash: '#blog' },
]

export default function Header({ currentView = 'landing', onNavigate, onAddLink, user, onLogin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleNavClick = (e, targetView, hash) => {
    e.preventDefault()
    setMenuOpen(false)
    if (onNavigate) {
      if (targetView === 'landing' || targetView === 'design' || targetView === 'ai-tools') {
        onNavigate(targetView)
        return
      }
    }
    const el = document.getElementById(hash.replace('#', ''))
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.location.hash = hash
    }
  }

  /* Close mobile menu on outside click */
  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => {
      if (!e.target.closest('.v-header')) setMenuOpen(false)
    }
    document.addEventListener('pointerdown', close)
    const esc = (e) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [menuOpen])

  return (
    <header className={`v-header${menuOpen ? ' menu-open' : ''}`}>
      <div className="v-header-container">
        {/* Brand */}
        <a
          className="v-brand cursor-pointer"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            if (onNavigate) onNavigate('landing')
            else window.location.hash = '#home'
          }}
          aria-label="Nexio home"
        >
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="rgba(0,0,0,0.06)" />
            <path d="M9 23V9L23 23V9" stroke="#111111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Desktop nav */}
        <div
          className={`v-header-actions${menuOpen ? ' open' : ''}`}
          id="tablet-navigation"
        >
          <nav className="v-nav" aria-label="Primary">
            {NAV_LINKS.map(({ label, targetView, hash }) => {
              const isActive = currentView === targetView
              return (
                <a
                  key={label}
                  href={hash}
                  className={`v-nav-link cursor-pointer ${isActive ? 'active text-black font-bold' : ''}`}
                  onClick={(e) => handleNavClick(e, targetView, hash)}
                >
                  {label}
                </a>
              )
            })}
          </nav>
        </div>

        {/* Right side buttons */}
        <div className="v-header-right">
          {onAddLink && (
            <button
              className="v-add-link-btn cursor-pointer"
              type="button"
              onClick={onAddLink}
            >
              <Plus size={15} strokeWidth={2.5} />
              Add Link
            </button>
          )}

          {user ? (
            /* ── Logged-in: show user avatar + Dashboard + Logout ── */
            <>
              <button
                className="v-primary-cta cursor-pointer"
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('app')
                  else window.location.hash = '#dashboard'
                }}
              >
                Dashboard
              </button>

              <div className="v-user-menu" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginLeft: '4px',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: '700',
                  flexShrink: 0,
                  border: '2px solid rgba(99, 102, 241, 0.3)',
                }}>
                  {user.avatar || user.name?.charAt(0) || 'U'}
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Logout"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.15)',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#f87171',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)'
                    e.currentTarget.style.color = '#ef4444'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)'
                    e.currentTarget.style.color = '#f87171'
                  }}
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            /* ── Not logged in: show Login + Dashboard ── */
            <>
              <button
                className="v-add-link-btn cursor-pointer"
                type="button"
                onClick={onLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <LogIn size={15} strokeWidth={2.5} />
                Login
              </button>

              <button
                className="v-primary-cta cursor-pointer"
                type="button"
                onClick={() => {
                  if (onNavigate) onNavigate('app')
                  else window.location.hash = '#dashboard'
                }}
              >
                Dashboard
              </button>
            </>
          )}
        </div>

        {/* Hamburger toggle */}
        <button
          className="v-menu-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
