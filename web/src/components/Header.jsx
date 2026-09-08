import React, { useState, useEffect } from 'react'
import { Plus, LogIn, LogOut, User } from 'lucide-react'
import '../home/hero.css'

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
