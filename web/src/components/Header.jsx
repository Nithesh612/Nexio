import React, { useState, useEffect } from 'react'
import { Plus, LogIn, LogOut, User } from 'lucide-react'
import './Header.css'

const NAV_LINKS = [
  { label: 'Home', targetView: 'landing', hash: '#home' },
  { label: 'Design', targetView: 'design', hash: '#design' },
  { label: 'AI Tools', targetView: 'ai-tools', hash: '#ai-tools' },
  { label: 'Editing', targetView: 'editing', hash: '#editing' },
]

export default function Header({ currentView = 'landing', onNavigate, onAddLink, user, onLogin, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem('nexio_auth')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
          localStorage.removeItem('nexio_auth')
          return null
        }
        return parsed
      }
    } catch {
      return null
    }
    return null
  }

  const [currentUser, setCurrentUser] = useState(() => {
    if (user !== undefined && user !== null) return user
    return getStoredUser()
  })

  useEffect(() => {
    if (user !== undefined) {
      setCurrentUser(user)
    } else {
      setCurrentUser(getStoredUser())
    }
  }, [user])

  useEffect(() => {
    const handleAuthSync = () => {
      setCurrentUser(getStoredUser())
    }

    window.addEventListener('storage', handleAuthSync)
    window.addEventListener('nexio_auth_updated', handleAuthSync)
    return () => {
      window.removeEventListener('storage', handleAuthSync)
      window.removeEventListener('nexio_auth_updated', handleAuthSync)
    }
  }, [])

  const handleNavClick = (e, targetView, hash) => {
    e.preventDefault()
    setMenuOpen(false)
    if (onNavigate) {
      if (targetView === 'landing' || targetView === 'design' || targetView === 'ai-tools' || targetView === 'editing') {
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

  const handleLoginClick = () => {
    if (onLogin) {
      onLogin()
    } else if (onNavigate) {
      onNavigate('login')
    } else {
      window.location.hash = '#login'
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
        {/* Brand: Nexio-Hub */}
        <a
          className="v-brand cursor-pointer"
          href="#"
          onClick={(e) => {
            e.preventDefault()
            if (onNavigate) onNavigate('landing')
            else window.location.hash = '#home'
          }}
          aria-label="Nexio-Hub Home"
        >
          <div className="v-brand-icon-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 19V5L12 13V5L20 13V19L12 11V19L4 19Z"
                fill="none"
              />
              <path
                d="M5 19L5 5L12 13.5L19 5V19"
                stroke="#f43f5e"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="5" cy="5" r="2" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
              <circle cx="12" cy="13.5" r="2.2" fill="#f43f5e" />
              <circle cx="19" cy="5" r="2" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
              <circle cx="19" cy="19" r="2" fill="#f43f5e" />
              <circle cx="5" cy="19" r="2" fill="#f43f5e" />
            </svg>
          </div>
          <div className="v-brand-text">
            <span className="v-brand-name">Nexio</span>
            <span className="v-brand-hub-badge">HUB</span>
          </div>
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
          {currentUser ? (
            /* ── Logged-in: show Add Link + Dashboard + user avatar ── */
            <>
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
          ) : (
            /* ── Not logged in: show Login only ── */
            <>
              <button
                className="v-primary-cta cursor-pointer"
                type="button"
                onClick={handleLoginClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: 'none',
                }}
              >
                <LogIn size={15} strokeWidth={2.5} />
                Login
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
