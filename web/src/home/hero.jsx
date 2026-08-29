import { useEffect, useRef, useState } from 'react'
import './hero.css'

const NAV_LINKS = ['Home', 'About', 'Services', 'Contact']



export default function Hero({ setIsAdding, setView, onImport, onExport }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const motionRef = useRef(null)
  const cardRef = useRef(null)

  /* ── Entrance motion ── */
  useEffect(() => {
    document.documentElement.classList.add('motion-pending')
    motionRef.current = setTimeout(
      () => document.documentElement.classList.remove('motion-pending'),
      3500,
    )
    const card = cardRef.current
    if (!card) return
    const done = () => {
      document.documentElement.classList.remove('motion-pending')
      clearTimeout(motionRef.current)
    }
    card.addEventListener('animationend', done, { once: true })
    return () => {
      card.removeEventListener('animationend', done)
      clearTimeout(motionRef.current)
    }
  }, [])

  /* ── Close mobile menu on outside click ── */
  useEffect(() => {
    if (!menuOpen) return
    const close = (e) => {
      if (!e.target.closest('.header')) setMenuOpen(false)
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
    <main className="v-viewport">
      <section className="v-screen" id="screen">
        {/* ── Background video ── */}
        <video
          className="v-background"
          autoPlay
          muted
          loop
          playsInline
          disablePictureInPicture
          aria-hidden="true"
        >
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4"
            type="video/mp4"
          />
        </video>

        {/* ── Header ── */}
        <header className={`v-header${menuOpen ? ' menu-open' : ''}`}>
          {/* Brand */}
          <a className="v-brand" href="#" aria-label="Vantage home">
            <svg width="25" height="25" viewBox="0 0 25 25" aria-hidden="true">
              <defs>
                <clipPath id="vbrand-clip">
                  <circle cx="12.5" cy="12.5" r="12.5" />
                </clipPath>
              </defs>
              <g clipPath="url(#vbrand-clip)">
                <rect width="25" height="25" fill="#ededed" />
                <path d="M12.5 4 L20 19 L5 19 Z" fill="#050606" />
                <path d="M12.5 4 L20 19 L12.5 13 Z" fill="#737778" />
                <path d="M12.5 13 L20 19 L5 19 Z" fill="#fafafa" />
                <path d="M5 19 L12.5 13 L12.5 22 Z" fill="#0a0b0b" />
              </g>
            </svg>
          </a>

          {/* Desktop nav + time + sign-up */}
          <div
            className={`v-header-actions${menuOpen ? ' open' : ''}`}
            id="tablet-navigation"
          >
            <nav className="v-nav" aria-label="Primary">
              {NAV_LINKS.map((label, i) => (
                <a
                  key={label}
                  href="#"
                  className={`v-nav-link${i === 0 ? ' active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    setMenuOpen(false)
                    if (label === 'Services') setView('app')
                  }}
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          {/* Add Link button + Search bar */}
          <div className="v-header-right">
            <button
              className="v-add-link-btn"
              type="button"
              onClick={() => setIsAdding(true)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Link
            </button>

            <label className="v-icon-action" title="Import links">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 16V4" />
                <path d="m7 9 5-5 5 5" />
                <path d="M5 20h14" />
              </svg>
              <span className="sr-only">Import links</span>
              <input
                type="file"
                accept=".json,.csv,application/json,text/csv"
                onChange={onImport}
              />
            </label>

            <button
              className="v-icon-action"
              type="button"
              title="Export links as JSON"
              aria-label="Export links as JSON"
              onClick={() => onExport('json')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 4v12" />
                <path d="m17 11-5 5-5-5" />
                <path d="M5 20h14" />
              </svg>
            </button>

          {/* Search bar */}
          <div className="v-search-bar">
            <svg className="v-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="v-search-input"
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search"
            />
          </div>
          </div>

          {/* Hamburger toggle */}
          <button
            className="v-menu-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true">
              <line
                x1="0"
                y1="1"
                x2="18"
                y2="1"
                stroke="#fff"
                strokeWidth="1.5"
                className="bar top"
              />
              <line
                x1="0"
                y1="7"
                x2="18"
                y2="7"
                stroke="#fff"
                strokeWidth="1.5"
                className="bar mid"
              />
              <line
                x1="0"
                y1="13"
                x2="18"
                y2="13"
                stroke="#fff"
                strokeWidth="1.5"
                className="bar bot"
              />
            </svg>
          </button>
        </header>

        {/* ── Hero section ── */}
        <section className="v-hero">
          {/* Left hero content */}
          <div className="v-hero-content">
            <h1 className="v-hero-title">
              <span className="v-line line-one">
                <span className="v-line-reveal">Stop Digging</span>
              </span>
              <span className="v-line line-two">
                <span className="v-line-reveal">Through Dashboards.</span>
              </span>
            </h1>

            <p className="v-hero-copy">
              Your metrics are scattered across a dozen dashboards.
              <br />
              Vantage bring them into one clear signal, so every
              <br />
              decision is backed by data you actually trust.
            </p>

            <button
              className="v-primary-cta"
              type="button"
              onClick={() => setView('app')}
            >
              <span className="v-cta-label">Get Started</span>
              <span className="v-arrow-box" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M3 7h8M7 3l4 4-4 4"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>

          {/* Demo card — bottom right */}
          <article className="v-demo-card" ref={cardRef}>
            <div className="v-demo-visual">
              <img
                src="/src/assets/hero.png"
                alt="Abstract cinematic background"
                className="v-demo-thumb"
              />
              <button
                className="v-play-btn"
                type="button"
                aria-label="Play demo"
              >
                <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
                  <path d="M2 1.5l12 7-12 7V1.5z" fill="#fff" />
                </svg>
              </button>
            </div>
            <button className="v-watch-btn" type="button">
              Watch Demo
            </button>
          </article>
        </section>
      </section>
    </main>
  )
}
