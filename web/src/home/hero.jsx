import { useEffect, useState } from 'react';
import './hero.css';

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Handle Escape key for mobile menu
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    
    // Handle resize to close mobile menu if screen gets big
    const handleResize = () => {
      if (window.innerWidth > 720 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    
    if (menuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      document.body.classList.remove('menu-open');
    };
  }, [menuOpen]);



  return (
    <div className="hero-landing-wrapper">
      <div className="bg">
        <video className="bg-video" autoPlay muted loop playsInline>
          <source
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Mobile Overlay */}
      <div 
        className="mobile-overlay" 
        onClick={() => setMenuOpen(false)}
      ></div>

      {/* Page Content */}
      <div className="page">
        
        {/* Header */}
        <header className="header anim" style={{ '--d': '0s' }}>
          {/* Logo */}
          <a href="#" className="logo-btn" aria-label="Home">
            <div className="logo-inner" style={{ fontSize: '24px', fontWeight: 'bold', color: 'black' }}>
              W
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            <a href="#" className="nav-link active">Home</a>
            <a href="#" className="nav-link">Product</a>
            <a href="#" className="nav-link">Case Studies</a>
            <a href="#" className="nav-link">Contact</a>
          </nav>

          {/* Desktop Sign In */}
          <a href="#" className="sign-in-btn">Sign in</a>

          {/* Mobile Burger */}
          <button 
            className="burger-btn" 
            aria-expanded={menuOpen} 
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="burger-bars">
              <span className="bar top"></span>
              <span className="bar mid"></span>
              <span className="bar bot"></span>
            </div>
          </button>
        </header>

        {/* Mobile Menu Sheet */}
        <div className="mobile-menu" hidden={!menuOpen}>
          <nav className="mobile-nav">
            <a href="#" className="nav-link active" style={{ '--ld': '0.1s' }} onClick={() => setMenuOpen(false)}>Home</a>
            <a href="#" className="nav-link" style={{ '--ld': '0.15s' }} onClick={() => setMenuOpen(false)}>Product</a>
            <a href="#" className="nav-link" style={{ '--ld': '0.2s' }} onClick={() => setMenuOpen(false)}>Case Studies</a>
            <a href="#" className="nav-link" style={{ '--ld': '0.25s' }} onClick={() => setMenuOpen(false)}>Contact</a>
            <a href="#" className="sign-in-btn full-width" style={{ '--ld': '0.3s' }} onClick={() => setMenuOpen(false)}>Sign in</a>
          </nav>
        </div>

        {/* Hero */}
        <main className="hero">
          
          {/* Trust Row */}
          <div className="trust-row anim" style={{ '--d': '0.05s' }}>
            <div className="trust-avatars">
              <div className="trust-avatar a1"><div className="avatar-inner"><i className="fa-brands fa-microsoft"></i></div></div>
              <div className="trust-avatar a2"><div className="avatar-inner"><i className="fa-brands fa-amazon"></i></div></div>
              <div className="trust-avatar a3"><div className="avatar-inner"><i className="fa-brands fa-google"></i></div></div>
            </div>
            <div className="trust-pill">Trusted by 2000+ Enterprises</div>
          </div>

          {/* Headline */}
          <h1 className="headline anim">
            <span className="line line1">Save Everything.</span>
            <span className="line line2">Find Anything.</span>
          </h1>

          {/* Subhead */}
          <p className="subhead anim" style={{ '--d': '0.28s' }}>
            Your personal AI-powered library for saving, organizing, and<br/>discovering useful tools, websites, resources, and inspiration.
          </p>

          {/* Search Bar */}
          <div className="hero-search-container anim" style={{ '--d': '0.4s' }}>
            <svg className="hero-search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input 
              type="text" 
              className="hero-search-input" 
              placeholder="Search 10,000+ AI tools, websites, resources..." 
            />
          </div>

        </main>
      </div>
    </div>
  );
}
