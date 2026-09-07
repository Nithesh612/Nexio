import { useEffect, useRef, useState } from 'react'
import { Search, Play, ArrowRight } from 'lucide-react'
import './hero.css'
import heroPoster from '../assets/hero.png'
import Header from '../components/Header'

export default function Hero({ setIsAdding, setView, onImport, onExport, onAddLink }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [videoState, setVideoState] = useState('loading')
  const videoRef = useRef(null)
  const cardRef = useRef(null)

  const handleAdd = () => {
    if (onAddLink) onAddLink()
    else if (setIsAdding) setIsAdding(true)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.src = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260808_064556_051587f1-74a1-4336-8c05-4dde3594ed05.mp4'
    video.load()
    video.play().catch(() => setVideoState('error'))
  }, [])

  return (
    <main className="v-viewport">
      {/* ── Common Header ── */}
      <Header
        currentView="landing"
        onNavigate={setView}
        onAddLink={handleAdd}
      />

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
