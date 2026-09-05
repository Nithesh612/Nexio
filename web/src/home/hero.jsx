import { useEffect, useRef, useState } from 'react'
import './hero.css'
import heroPoster from '../assets/hero.png'

const NAV_LINKS = ['Features', 'Use Cases', 'Extensions', 'Pricing']



export default function Hero({ setIsAdding, setView, onImport, onExport }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [videoState, setVideoState] = useState('loading')
  const videoRef = useRef(null)
  const motionRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.src = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4'
    video.load()
    video.play().catch(() => setVideoState('error'))
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
          ref={videoRef}
          className="v-background"
          muted
          loop
          playsInline
          poster={heroPoster}
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          onCanPlay={() => setVideoState('ready')}
          onPlaying={() => setVideoState('ready')}
          onWaiting={() => setVideoState('buffering')}
          onError={() => setVideoState('error')}
        />
        {videoState === 'buffering' && (
          <span className="v-video-status" role="status" aria-label="Video buffering" />
        )}

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

          {/* Add Link button + Dashboard button */}
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

            <button
              className="v-primary-cta"
              type="button"
              onClick={() => setView('app')}
            >
              Dashboard
            </button>
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
                <span className="v-line-reveal">Organize Your</span>
              </span>
              <span className="v-line line-two">
                <span className="v-line-reveal">Links, Effortlessly.</span>
              </span>
            </h1>

            <p className="v-hero-copy">
              Keep all your important links in one place. Save, organize,
              <br />
              and access everything you need with Nexio's intuitive
              <br />
              link management platform.
            </p>

            <button
              className="v-primary-cta"
              type="button"
              onClick={() => setIsAdding(true)}
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

            {/* Search bar in hero section */}
            <div className="v-search-bar">
              <svg className="v-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="v-search-input"
                type="search"
                placeholder="Search your links..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search links"
              />
            </div>
          </div>

          {/* Demo card — bottom right */}
          <article className="v-demo-card" ref={cardRef}>
            <div className="v-demo-visual">
              <img
                src={heroPoster}
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
