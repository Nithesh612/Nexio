import { useEffect, useRef, useState } from 'react'
import { Plus, Search, Play, ArrowRight } from 'lucide-react'
import './hero.css'
import heroPoster from '../assets/hero.png'

const NAV_LINKS = [
  { label: 'Features', targetId: 'features' },
  { label: 'Directory', targetId: 'use-cases' },
  { label: 'Models', targetId: 'extensions' },
  { label: 'Integrations', targetId: 'integrations' },
]

export default function Hero({ setIsAdding, setView, onImport, onExport }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [videoState, setVideoState] = useState('loading')
  const videoRef = useRef(null)
  const motionRef = useRef(null)
  const cardRef = useRef(null)

  const handleNavClick = (e, targetId) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.getElementById(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

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
          <a className="v-brand" href="#" aria-label="Nexio home">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.08)" />
              <path d="M9 23V9L23 23V9" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          {/* Desktop nav + time + sign-up */}
          <div
            className={`v-header-actions${menuOpen ? ' open' : ''}`}
            id="tablet-navigation"
          >
            <nav className="v-nav" aria-label="Primary">
              {NAV_LINKS.map(({ label, targetId }, i) => (
                <a
                  key={label}
                  href={`#${targetId}`}
                  className={`v-nav-link${i === 0 ? ' active' : ''}`}
                  onClick={(e) => handleNavClick(e, targetId)}
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
              <Plus size={15} strokeWidth={2.5} />
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
                <ArrowRight size={14} strokeWidth={2} />
              </span>
            </button>

            {/* Search bar in hero section */}
            <div className="v-search-bar">
              <Search className="v-search-icon" size={16} strokeWidth={2} aria-hidden="true" />
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
                <Play size={16} fill="#fff" strokeWidth={0} />
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
