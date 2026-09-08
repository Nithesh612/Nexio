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

// Smart automatic Google type detector
export function detectGoogleType(item) {
  if (!item) return 'Ecosystem Tools';
  if (item.subType && item.subType !== 'Google' && item.subType !== 'Other') return item.subType;

  const text = `${item.title || ''} ${item.desc || item.description || ''} ${item.url || ''} ${item.tag || ''} ${Array.isArray(item.tags) ? item.tags.join(' ') : (item.tags || '')} ${item.category || ''}`.toLowerCase();

  // AI & ML
  if (
    text.includes('gemini') ||
    text.includes('aistudio') ||
    text.includes('notebooklm') ||
    text.includes('colab') ||
    text.includes('vertex') ||
    text.includes('gemma') ||
    text.includes('deepmind') ||
    text.includes('machine learning') ||
    text.includes('ai model') ||
    text.includes('generative') ||
    text.includes('labs.google')
  ) {
    return 'AI & ML';
  }

  // Design & Fonts
  if (
    text.includes('font') ||
    text.includes('typography') ||
    text.includes('material') ||
    text.includes('m3') ||
    text.includes('icon') ||
    text.includes('symbol') ||
    text.includes('design') ||
    text.includes('color') ||
    text.includes('stitch') ||
    text.includes('vector')
  ) {
    return 'Design & Fonts';
  }

  // Developer & Cloud
  if (
    text.includes('firebase') ||
    text.includes('idx.google') ||
    text.includes('cloud.google') ||
    text.includes('gcp') ||
    text.includes('android') ||
    text.includes('flutter') ||
    text.includes('developer') ||
    text.includes('api') ||
    text.includes('sdk') ||
    text.includes('console.cloud') ||
    text.includes('devtools')
  ) {
    return 'Developer & Cloud';
  }

  // Productivity & Research
  if (
    text.includes('kaggle') ||
    text.includes('scholar') ||
    text.includes('keep') ||
    text.includes('drive') ||
    text.includes('docs') ||
    text.includes('sheets') ||
    text.includes('slides') ||
    text.includes('calendar') ||
    text.includes('translate') ||
    text.includes('maps') ||
    text.includes('search') ||
    text.includes('analytics') ||
    text.includes('research')
  ) {
    return 'Productivity & Research';
  }

  // If item has a custom clean category that's not general 'Google'
  if (item.category && !['google', 'tools', 'saved', 'all', 'other', 'inbox'].includes(item.category.toLowerCase().trim())) {
    return item.category.trim();
  }

  return 'Ecosystem Tools';
}

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

function GoogleLinkCard({ item }) {
  const [screenshotError, setScreenshotError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const cleanUrl = useMemo(() => {
    try {
      const u = (item.url || '').startsWith('http') ? item.url : `https://${item.url}`;
      return new URL(u).href;
    } catch {
      return item.url || '';
    }
  }, [item.url]);

  const hostname = useMemo(() => {
    try {
      return new URL(cleanUrl).hostname.replace(/^www\./, '');
    } catch {
      return '';
    }
  }, [cleanUrl]);

  // Live website screenshot banner with 3-tier fallback matching links.jsx
  const primaryScreenshot = item.bannerUrl || `https://image.thum.io/get/width/600/crop/400/${cleanUrl}`;
  const secondaryScreenshot = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  const tertiaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600&h=380`;
  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot);

  // Live Brand Logo
  const clearbitLogo = `https://logo.clearbit.com/${hostname}`;
  const googleFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  const logoSrc = item.logoUrl || (!logoError ? clearbitLogo : googleFavicon);

  return (
    <div
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
      {/* Top Banner with Rounded Inner Frame & Overlapping Logo Badge */}
      <div style={{ position: 'relative', width: '100%', marginBottom: '8px' }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '170px',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0f172a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!screenshotError ? (
            <img
              src={currentScreenshot}
              alt={item.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.95 }}
              loading="lazy"
              onError={() => {
                if (currentScreenshot === primaryScreenshot) {
                  setCurrentScreenshot(secondaryScreenshot);
                } else if (currentScreenshot === secondaryScreenshot) {
                  setCurrentScreenshot(tertiaryScreenshot);
                } else {
                  setScreenshotError(true);
                }
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #1e293b, #0f172a)'
            }}>
              <span style={{ fontSize: '38px', fontWeight: 800, color: 'rgba(255,255,255,0.85)' }}>
                {item.title?.charAt(0) || 'G'}
              </span>
            </div>
          )}

          {/* Subtle Google Color Stripe on top */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #4285F4 0%, #EA4335 30%, #FBBC05 65%, #34A853 100%)',
            zIndex: 3
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
            background: 'rgba(15, 23, 42, 0.78)',
            backdropFilter: 'blur(8px)',
            borderRadius: '999px',
            color: '#ffffff',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.2px',
            zIndex: 3
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
            textTransform: 'uppercase',
            zIndex: 3
          }}>
            {item.badge || item.pricing}
          </div>
        </div>

        {/* Circular Brand Badge with Live Brand Logo Overlapping Banner Bottom-Right */}
        <div style={{
          position: 'absolute',
          bottom: '-12px',
          right: '14px',
          width: '42px',
          height: '42px',
          borderRadius: '50%',
          background: '#ffffff',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.16)',
          border: '3px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 10
        }}>
          <img
            src={logoSrc}
            alt={`${item.title} logo`}
            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
            onError={() => {
              if (!logoError) setLogoError(true);
            }}
          />
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

          {/* Visit Link Button */}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '7px 14px',
              borderRadius: '999px',
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
  );
}

export default function GoogleSection({ savedLinks = [], onAddLink }) {
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Extract and automatically categorize saved Google links from user database
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
        url.includes('flutter.dev') ||
        url.includes('android.com') ||
        title.includes('google')
      );
    }).map(item => {
      const autoType = detectGoogleType(item);
      return {
        id: item.id || item._id || item.url,
        title: item.title,
        url: item.url,
        desc: item.description || item.desc || `Google resource in ${autoType}.`,
        type: autoType,
        category: 'Google',
        bannerUrl: item.bannerUrl || null,
        badge: item.badge || 'Saved Link',
        pricing: item.pricing || 'FREE',
        tag: item.tag || autoType,
        stars: '5.0',
        isUserSaved: true
      };
    });
  }, [savedLinks]);

  // Only show links that the user has added/stored in their workspace
  const allGoogleItems = useMemo(() => {
    return userGoogleLinks;
  }, [userGoogleLinks]);

  // Dynamically compute all sub-type categories with real-time item counts
  const dynamicSubTypes = useMemo(() => {
    const typeCountMap = { all: allGoogleItems.length };
    allGoogleItems.forEach((item) => {
      const t = item.type || 'Ecosystem Tools';
      typeCountMap[t] = (typeCountMap[t] || 0) + 1;
    });

    const knownIconMap = {
      'AI & ML': Bot,
      'Design & Fonts': Palette,
      'Developer & Cloud': Terminal,
      'Productivity & Research': Compass,
      'Ecosystem Tools': Layers,
      'Mobile & Web': Globe,
    };

    const coreOrder = ['AI & ML', 'Design & Fonts', 'Developer & Cloud', 'Productivity & Research'];
    const uniqueTypes = Array.from(new Set(allGoogleItems.map(i => i.type || 'Ecosystem Tools')));

    // Sort: coreOrder first, then alphabetically for newly created types
    uniqueTypes.sort((a, b) => {
      const idxA = coreOrder.indexOf(a);
      const idxB = coreOrder.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return [
      { id: 'all', label: 'All Google', count: typeCountMap.all, icon: Layers },
      ...uniqueTypes.map(t => ({
        id: t,
        label: t,
        count: typeCountMap[t] || 0,
        icon: knownIconMap[t] || Zap
      }))
    ];
  }, [allGoogleItems]);

  // Apply Sub-type tab and search filters
  const filteredItems = useMemo(() => {
    let list = allGoogleItems;

    if (activeType !== 'all') {
      list = list.filter(item => {
        const itemType = (item.type || '').toLowerCase().trim();
        const targetType = activeType.toLowerCase().trim();
        return itemType === targetType || itemType.includes(targetType);
      });
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item =>
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (item.url && item.url.toLowerCase().includes(q)) ||
        (item.tag && item.tag.toLowerCase().includes(q)) ||
        (item.type && item.type.toLowerCase().includes(q)) ||
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
        {/* Dynamic Category Pills with Automatic Counts */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {dynamicSubTypes.map(({ id, label, count, icon: Icon }) => {
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
                  padding: '8px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 550,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: isActive ? '1px solid #1a73e8' : '1px solid #e2e8f0',
                  background: isActive ? '#1a73e8' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  boxShadow: isActive ? '0 4px 12px rgba(26, 115, 232, 0.25)' : 'none'
                }}
              >
                {id === 'all' ? (
                  <span style={{ display: 'inline-flex', filter: isActive ? 'brightness(10)' : 'none' }}>
                    <GoogleIcon size={14} />
                  </span>
                ) : (
                  <Icon size={14} color={isActive ? '#ffffff' : '#64748b'} />
                )}
                <span>{label}</span>
                <span style={{
                  padding: '2px 7px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b',
                  transition: 'all 0.2s'
                }}>
                  {count}
                </span>
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
      {allGoogleItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '64px 24px',
          background: '#ffffff',
          borderRadius: '24px',
          border: '1.5px dashed #cbd5e1',
          boxShadow: '0 4px 20px -4px rgba(0, 0, 0, 0.03)'
        }}>
          <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(66, 133, 244, 0.08)', marginBottom: '16px' }}>
            <GoogleIcon size={36} />
          </div>
          <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            No Google Tools Saved Yet
          </h3>
          <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            Save Google AI models (Gemini, NotebookLM), Cloud services, Material Design systems, or Developer APIs to automatically organize them here.
          </p>
          {typeof onAddLink === 'function' && (
            <button
              type="button"
              onClick={onAddLink}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 22px',
                borderRadius: '12px',
                background: '#1a73e8',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '13.5px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(26, 115, 232, 0.28)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1557b0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#1a73e8'}
            >
              <Plus size={16} />
              <span>Save Your First Google Link</span>
            </button>
          )}
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#ffffff',
          borderRadius: '20px',
          border: '1.5px dashed #e2e8f0'
        }}>
          <GoogleIcon size={36} style={{ marginBottom: '16px', opacity: 0.8 }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
            No Google tools found matching "{searchQuery || activeType}"
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
            <GoogleLinkCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
