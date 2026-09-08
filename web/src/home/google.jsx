import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  ExternalLink,
  Layers,
  Bot,
  Palette,
  Terminal,
  Search,
  Plus,
  Compass,
  Zap,
  Star,
  CheckCircle2,
  Copy,
  Check,
  Bookmark,
  Heart,
  Globe
} from 'lucide-react';
import { API_URL } from '../config/api';

// Curated official Google Ecosystem presets
const GOOGLE_PRESETS = [
  {
    id: 'g-aistudio',
    title: 'Google AI Studio',
    url: 'https://aistudio.google.com/',
    type: 'AI & ML',
    category: 'Google',
    desc: 'The fastest way to build prototypes and production apps with Gemini 1.5 Pro & Flash models, multimodal prompts, and system instructions.',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    logoType: 'gemini',
    badge: 'Gemini 1.5 Pro',
    pricing: 'FREE TIER',
    tag: 'Multimodal AI',
    stars: '4.9',
    featured: true
  },
  {
    id: 'g-notebooklm',
    title: 'Google NotebookLM',
    url: 'https://notebooklm.google.com/',
    type: 'AI & ML',
    category: 'Google',
    desc: 'AI-first personalized research assistant that grounds its answers in your source notes, PDFs, and generates dual-host Audio Overview podcasts.',
    bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    logoType: 'notebooklm',
    badge: 'Audio Overviews',
    pricing: 'FREE',
    tag: 'Research AI',
    stars: '4.9',
    featured: true
  },
  {
    id: 'g-fonts',
    title: 'Google Fonts',
    url: 'https://fonts.google.com/',
    type: 'Design & Fonts',
    category: 'Google',
    desc: 'Making the web more beautiful and fast with 1,500+ open-source typography families, variable fonts, and Material Symbols for designers.',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    logoType: 'fonts',
    badge: 'Variable Typography',
    pricing: 'OPEN SOURCE',
    tag: 'Web Typography',
    stars: '5.0',
    featured: true
  },
  {
    id: 'g-material3',
    title: 'Material Design 3',
    url: 'https://m3.material.io/',
    type: 'Design & Fonts',
    category: 'Google',
    desc: 'Google’s open-source design system. Comprehensive guidelines, dynamic color algorithms, token architectures, and UI kits for Android & Web.',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop',
    logoType: 'material',
    badge: 'Design System',
    pricing: 'OPEN SOURCE',
    tag: 'Design System',
    stars: '4.9',
    featured: false
  },
  {
    id: 'g-idx',
    title: 'Project IDX',
    url: 'https://idx.google.com/',
    type: 'Developer & Cloud',
    category: 'Google',
    desc: 'An experimental AI-assisted cloud workspace by Google for full-stack, multiplatform app development with Codey, Nix environments, and Gemini.',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    logoType: 'idx',
    badge: 'Cloud IDE',
    pricing: 'FREE PREVIEW',
    tag: 'Fullstack IDE',
    stars: '4.8',
    featured: true
  },
  {
    id: 'g-firebase',
    title: 'Firebase',
    url: 'https://firebase.google.com/',
    type: 'Developer & Cloud',
    category: 'Google',
    desc: 'Complete app development platform by Google. Authentication, Firestore Realtime DB, Cloud Functions, and Hosting to build and scale apps.',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    logoType: 'firebase',
    badge: 'Backend as a Service',
    pricing: 'FREEMIUM',
    tag: 'Cloud Backend',
    stars: '4.8',
    featured: false
  },
  {
    id: 'g-colab',
    title: 'Google Colab',
    url: 'https://colab.research.google.com/',
    type: 'AI & ML',
    category: 'Google',
    desc: 'Hosted Jupyter notebook service requiring zero setup, providing free cloud GPU and TPU access for Python, machine learning, and data science.',
    bannerUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=600&auto=format&fit=crop',
    logoType: 'colab',
    badge: 'Free GPUs',
    pricing: 'FREE + PAID',
    tag: 'Notebook & ML',
    stars: '4.9',
    featured: false
  },
  {
    id: 'g-kaggle',
    title: 'Kaggle',
    url: 'https://www.kaggle.com/',
    type: 'Productivity & Research',
    category: 'Google',
    desc: 'The world’s largest data science and machine learning community with datasets, AI competitions, benchmarks, and community notebooks.',
    bannerUrl: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=600&auto=format&fit=crop',
    logoType: 'kaggle',
    badge: 'Datasets & Comps',
    pricing: 'FREE',
    tag: 'Data Science',
    stars: '4.9',
    featured: false
  },
  {
    id: 'g-gcloud',
    title: 'Google Cloud Platform',
    url: 'https://cloud.google.com/',
    type: 'Developer & Cloud',
    category: 'Google',
    desc: 'Enterprise-grade cloud infrastructure, BigQuery analytics, Vertex AI platform, Kubernetes (GKE), and secure scalable compute instances.',
    bannerUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    logoType: 'gcloud',
    badge: 'Vertex AI & GKE',
    pricing: 'FREE $300 TIER',
    tag: 'Cloud Infra',
    stars: '4.7',
    featured: false
  },
  {
    id: 'g-scholar',
    title: 'Google Scholar',
    url: 'https://scholar.google.com/',
    type: 'Productivity & Research',
    category: 'Google',
    desc: 'Freely search across academic papers, peer-reviewed journals, thesis papers, patents, and technical literature with citation indexes.',
    bannerUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    logoType: 'scholar',
    badge: 'Academic Research',
    pricing: 'FREE',
    tag: 'Literature Index',
    stars: '4.9',
    featured: false
  },
  {
    id: 'g-icons',
    title: 'Material Symbols & Icons',
    url: 'https://fonts.google.com/icons',
    type: 'Design & Fonts',
    category: 'Google',
    desc: 'Over 3,000+ modern SVG & font icons across Outlined, Rounded, and Sharp weights with variable optical size and grade settings.',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
    logoType: 'material',
    badge: '3,000+ Glyphs',
    pricing: 'OPEN SOURCE',
    tag: 'Vector Icons',
    stars: '4.9',
    featured: false
  },
  {
    id: 'g-labs',
    title: 'Google Labs',
    url: 'https://labs.google/',
    type: 'AI & ML',
    category: 'Google',
    desc: 'Groundbreaking technology experiments, early-stage AI incubations, music generation, and interactive generative AI prototypes.',
    bannerUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
    logoType: 'labs',
    badge: 'AI Experiments',
    pricing: 'FREE EXPERIMENTS',
    tag: 'Emerging Tech',
    stars: '4.8',
    featured: false
  }
];

const SUB_TYPES = [
  { id: 'all', label: 'All Google', icon: Layers },
  { id: 'AI & ML', label: 'AI & ML', icon: Bot },
  { id: 'Design & Fonts', label: 'Design & Fonts', icon: Palette },
  { id: 'Developer & Cloud', label: 'Dev & Cloud', icon: Terminal },
  { id: 'Productivity & Research', label: 'Productivity & Research', icon: Compass },
];

function GoogleIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

export default function GoogleSection({ savedLinks = [], onAddLink }) {
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Extract saved Google links from user database
  const userGoogleLinks = useMemo(() => {
    return (savedLinks || []).filter(item => {
      if (!item) return false;
      const cat = (item.category || item.type || '').toLowerCase();
      const col = (item.collection || '').toLowerCase();
      const url = (item.url || '').toLowerCase();
      const title = (item.title || '').toLowerCase();
      const tags = Array.isArray(item.tags) ? item.tags.join(' ').toLowerCase() : (item.tags || '').toLowerCase();

      return (
        cat.includes('google') ||
        col.includes('google') ||
        tags.includes('google') ||
        url.includes('google.com') ||
        url.includes('firebase') ||
        url.includes('kaggle.com') ||
        url.includes('idx.google') ||
        url.includes('material.io') ||
        title.includes('google')
      );
    }).map(item => ({
      id: item.id || item._id || item.url,
      title: item.title,
      url: item.url,
      desc: item.description || item.desc || 'Google ecosystem tool saved to your workspace.',
      type: item.subType || item.type || (item.category?.includes('AI') ? 'AI & ML' : item.category?.includes('Design') ? 'Design & Fonts' : 'Developer & Cloud'),
      category: 'Google',
      bannerUrl: item.bannerUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
      badge: item.badge || 'Saved Link',
      pricing: item.pricing || 'FREE',
      tag: item.tag || 'Google Service',
      stars: '5.0',
      isUserSaved: true
    }));
  }, [savedLinks]);

  // Merge user-saved links with presets (user-saved first, avoid duplicate URLs)
  const allGoogleItems = useMemo(() => {
    const userUrls = new Set(userGoogleLinks.map(l => l.url.replace(/https?:\/\//, '').replace(/\/$/, '').toLowerCase()));
    const filteredPresets = GOOGLE_PRESETS.filter(p => !userUrls.has(p.url.replace(/https?:\/\//, '').replace(/\/$/, '').toLowerCase()));
    return [...userGoogleLinks, ...filteredPresets];
  }, [userGoogleLinks]);

  // Apply Sub-type tab and search filters
  const filteredItems = useMemo(() => {
    let list = allGoogleItems;

    if (activeType !== 'all') {
      list = list.filter(item => {
        const itemType = (item.type || '').toLowerCase();
        const targetType = activeType.toLowerCase();
        return itemType === targetType || itemType.includes(targetType.split(' ')[0]);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.url && item.url.toLowerCase().includes(q)) ||
        (item.tag && item.tag.toLowerCase().includes(q)) ||
        (item.badge && item.badge.toLowerCase().includes(q))
      );
    }

    return list;
  }, [allGoogleItems, activeType, searchQuery]);

  const handleCopy = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <section className="google-section-root" id="google-ecosystem" style={{ padding: '64px 20px 80px', maxWidth: '1380px', margin: '0 auto' }}>
      {/* Header Container */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(66, 133, 244, 0.08)',
          border: '1px solid rgba(66, 133, 244, 0.2)',
          borderRadius: '999px',
          color: '#1a73e8',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.2px',
          marginBottom: '16px'
        }}>
          <GoogleIcon size={16} />
          <span>Google Ecosystem & Intelligence</span>
        </div>

        <h2 style={{
          fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
          fontWeight: 800,
          letterSpacing: '-0.04em',
          color: '#0f172a',
          margin: '0 0 12px',
          lineHeight: 1.2
        }}>
          Curated Tools & APIs from <span style={{
            background: 'linear-gradient(90deg, #4285F4 0%, #EA4335 30%, #FBBC05 65%, #34A853 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Google</span>
        </h2>

        <p style={{
          fontSize: '15.5px',
          color: '#64748b',
          maxWidth: '680px',
          lineHeight: 1.6,
          margin: 0
        }}>
          Explore groundbreaking foundation models, developer cloud infrastructure, design systems, and productivity research platforms built by Google.
        </p>
      </div>

      {/* Sub-Category Filter Tabs & Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '32px',
        padding: '12px 16px',
        background: '#ffffff',
        borderRadius: '20px',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.04)'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {SUB_TYPES.map(({ id, label, icon: Icon }) => {
            const isActive = activeType === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActiveType(id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '13.5px',
                  fontWeight: isActive ? 700 : 550,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid #1a73e8' : '1px solid transparent',
                  background: isActive ? 'rgba(26, 115, 232, 0.1)' : '#f8fafc',
                  color: isActive ? '#1a73e8' : '#475569'
                }}
              >
                {id === 'all' ? <GoogleIcon size={14} /> : <Icon size={14} />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input & Add Link Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 260px', maxWidth: '420px' }}>
          <div style={{
            position: 'relative',
            flex: 1,
            display: 'flex',
            alignItems: 'center'
          }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', color: '#94a3b8', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search Google tools, APIs, models..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '13.5px',
                color: '#0f172a',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1a73e8'; e.target.style.background = '#ffffff'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
            />
          </div>

          {typeof onAddLink === 'function' && (
            <button
              type="button"
              onClick={onAddLink}
              title="Save custom Google link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '12px',
                background: '#0f172a',
                color: '#ffffff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 650,
                cursor: 'pointer',
                flexShrink: 0,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#0f172a'}
            >
              <Plus size={15} />
              <span>Add Link</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Google Tool Cards */}
      {filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1.5px dashed #e2e8f0'
        }}>
          <GoogleIcon size={40} style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
            No Google tools found matching "{searchQuery}"
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px' }}>
            Try searching with another keyword or change your category filter.
          </p>
          <button
            type="button"
            onClick={() => { setActiveType('all'); setSearchQuery(''); }}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              background: '#1a73e8',
              color: '#ffffff',
              border: 'none',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '24px'
        }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                position: 'relative',
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.04)',
                transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 16px 32px -6px rgba(66, 133, 244, 0.14), 0 4px 12px -2px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(66, 133, 244, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(0, 0, 0, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(15, 23, 42, 0.08)';
              }}
            >
              {/* Card Banner Preview */}
              <div style={{ position: 'relative', height: '148px', overflow: 'hidden', background: '#0f172a' }}>
                <img
                  src={item.bannerUrl}
                  alt={item.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }}
                  loading="lazy"
                />
                
                {/* Subtle Google Color Stripe on top */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #4285F4 0%, #EA4335 30%, #FBBC05 65%, #34A853 100%)'
                }} />

                {/* Sub-type Tag Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '999px',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.2px'
                }}>
                  <GoogleIcon size={12} />
                  <span>{item.type}</span>
                </div>

                {/* Pricing / Badge */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  padding: '4px 9px',
                  background: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '999px',
                  color: '#0f172a',
                  fontSize: '10.5px',
                  fontWeight: 800,
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase'
                }}>
                  {item.badge || item.pricing}
                </div>

                {/* Circular Brand Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '-12px',
                  right: '16px',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
                  border: '3px solid #ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2
                }}>
                  <GoogleIcon size={22} />
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '16px 18px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16.5px',
                    fontWeight: 800,
                    color: '#0f172a',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3
                  }}>
                    {item.title}
                  </h3>
                </div>

                <p style={{
                  margin: '0 0 16px',
                  fontSize: '13px',
                  color: '#64748b',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  flex: 1
                }}>
                  {item.desc}
                </p>

                {/* Footer Actions */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid #f1f5f9',
                  marginTop: 'auto'
                }}>
                  {/* Tag pill */}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 650,
                    color: '#475569',
                    background: '#f1f5f9',
                    padding: '3px 8px',
                    borderRadius: '6px'
                  }}>
                    {item.tag}
                  </span>

                  {/* Buttons (Copy URL + Visit Link) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={(e) => handleCopy(e, item)}
                      title="Copy URL"
                      style={{
                        padding: '6px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        background: copiedId === item.id ? '#dcfce7' : '#ffffff',
                        color: copiedId === item.id ? '#166534' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#1a73e8',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '12.5px',
                        fontWeight: 700,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#1557b0'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#1a73e8'}
                    >
                      <span>Open</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
