/**
 * Smart URL Analyzer & Auto-Categorizer for Nexio
 * Detects domain semantics, color tools, AI platforms, UI/UX libraries, dev tools, and generates rich descriptions.
 */

export function analyzeLinkUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string' || !rawUrl.trim()) return null;

  let hostname = '';
  let pathname = '';
  let fullSearch = '';

  try {
    const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`);
    hostname = parsed.hostname.toLowerCase().replace(/^www\./, '');
    pathname = parsed.pathname.toLowerCase();
    fullSearch = `${hostname} ${pathname}`.toLowerCase();
  } catch {
    return null;
  }

  // 1. High-precision curated domain knowledge base
  const knowledgeBase = [
    // Color & Palette Tools
    {
      match: ['coolors.co', 'coolors'],
      title: 'Coolors',
      category: 'UI/UX',
      description: 'Super fast color palettes generator, contrast checker, and color tools for designers and developers.',
      tag: '🎨 Color Palette Generator',
    },
    {
      match: ['colorhunt.co', 'colorhunt'],
      title: 'Color Hunt',
      category: 'UI/UX',
      description: 'Curated collection of trending color palettes with hex codes for designers and artists.',
      tag: '🎨 Color Palettes',
    },
    {
      match: ['colorsandfonts.com', 'realtimecolors.com', 'khroma.co', 'colormind.io', 'paletton.com', 'flatuicolors.com', 'mycolor.space', 'colorcode.io', 'hypercolor.dev'],
      title: 'Color & Gradient Tool',
      category: 'UI/UX',
      description: 'Color palette generator, CSS gradients, and contrast accessibility tools.',
      tag: '🎨 Color & Design Tool',
    },

    // UI/UX & Design Systems
    {
      match: ['figma.com'],
      title: 'Figma',
      category: 'UI/UX',
      description: 'Collaborative interface design, prototyping, and design systems platform.',
      tag: '📐 UI/UX Design Tool',
    },
    {
      match: ['uiverse.io', '21st.dev', 'shadcn', 'ui.shadcn.com', 'tailwindcss.com', 'heroicons.com', 'lucide.dev', 'tabler.io', 'feathericons.com'],
      title: 'UI Components',
      category: 'UI/UX',
      description: 'Open-source UI component library, animations, and design system elements.',
      tag: '🧩 UI Components & Icons',
    },
    {
      match: ['spline.design', 'rive.app', 'lottiefiles.com'],
      title: 'Interactive 3D & Animation',
      category: 'UI/UX',
      description: '3D design, interactive vector animations, and WebGL experiences.',
      tag: '✨ 3D & Animations',
    },

    // Inspiration
    {
      match: ['dribbble.com'],
      title: 'Dribbble',
      category: 'Inspiration',
      description: 'Creative design inspiration, product UI shots, and designer portfolio showcase.',
      tag: '✨ Design Inspiration',
    },
    {
      match: ['behance.net'],
      title: 'Behance',
      category: 'Inspiration',
      description: 'World-leading creative portfolio and visual design showcase network by Adobe.',
      tag: '✨ Creative Showcase',
    },
    {
      match: ['awwwards.com', 'godly.website', 'mobbin.com', 'lapa.ninja', 'land-book.com', 'curated.design', 'siteinspire.com', 'pagecollective.com'],
      title: 'Web Inspiration',
      category: 'Inspiration',
      description: 'Curated web design showcases, mobile UI inspiration, and award-winning websites.',
      tag: '🏆 Web Inspiration',
    },

    // AI & Machine Learning
    {
      match: ['openai.com', 'chatgpt.com', 'claude.ai', 'anthropic.com', 'perplexity.ai', 'v0.dev', 'cursor.com', 'deepseek.com', 'gemini.google.com'],
      title: 'AI Intelligence',
      category: 'AI',
      description: 'Advanced generative AI, reasoning models, and autonomous agent platform.',
      tag: '🤖 AI & LLM Platform',
    },
    {
      match: ['midjourney.com', 'runwayml.com', 'elevenlabs.io', 'pika.art', 'suno.ai', 'klingai.com', 'luma.ai', 'magnific.ai', 'leonardo.ai'],
      title: 'AI Media Studio',
      category: 'AI Image & Video',
      description: 'Generative AI image creation, video synthesis, and audio production suite.',
      tag: '🎬 AI Video & Image Generator',
    },

    // Stock & Photography
    {
      match: ['unsplash.com', 'pexels.com', 'freepik.com', 'pixabay.com', 'iconfinder.com'],
      title: 'Stock Visuals',
      category: 'Stock',
      description: 'High-resolution royalty-free stock photos, illustrations, and media assets.',
      tag: '📸 Stock Assets & Media',
    },

    // Wallpaper
    {
      match: ['wallhaven.cc', 'wallpapercave.com', 'alphacoders.com'],
      title: 'Wallpapers',
      category: 'Wallpaper',
      description: 'High definition desktop and mobile wallpapers and aesthetic backgrounds.',
      tag: '🖼️ HD Wallpapers',
    },

    // Developer & Coding Tools
    {
      match: ['github.com', 'gitlab.com', 'stackoverflow.com', 'npmjs.com', 'developer.mozilla.org', 'w3schools.com', 'codesandbox.io', 'codepen.io'],
      title: 'Dev Resources',
      category: 'Tools',
      description: 'Developer code repositories, open-source software, and programming documentation.',
      tag: '💻 Code & Dev Tools',
    },

    // Cloud Hosting & Infrastructure
    {
      match: ['vercel.com', 'netlify.com', 'render.com', 'railway.app', 'supabase.com', 'firebase.google.com', 'aws.amazon.com', 'digitalocean.com', 'cloudflare.com'],
      title: 'Cloud Infrastructure',
      category: 'Host',
      description: 'Cloud deployment, backend infrastructure, databases, and serverless hosting.',
      tag: '☁️ Cloud & Hosting',
    },

    // Tech Articles & Knowledge
    {
      match: ['medium.com', 'dev.to', 'hashnode.dev', 'substack.com', 'fortelabs.com', 'smashingmagazine.com'],
      title: 'Tech Article',
      category: 'Article',
      description: 'In-depth engineering articles, tutorials, and thoughtful design essays.',
      tag: '📖 Article & Publication',
    },

    // Academic & Scientific Research
    {
      match: ['arxiv.org', 'paperswithcode.com', 'sciencedirect.com', 'nature.com', 'researchgate.net'],
      title: 'Research Paper',
      category: 'Research',
      description: 'Scientific research papers, academic studies, and machine learning publications.',
      tag: '🔬 Research & Science',
    },
  ];

  // Check exact/partial domain matches
  for (const item of knowledgeBase) {
    if (item.match.some((m) => hostname.includes(m) || fullSearch.includes(m))) {
      const rawDomain = hostname.split('.')[0] || '';
      const cleanTitle = rawDomain ? rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1) : item.title;
      return {
        title: cleanTitle,
        category: item.category,
        description: item.description,
        tag: item.tag,
      };
    }
  }

  // 2. Keyword-based heuristics for unlisted domains
  if (/(color|palette|gradient|hex|theme|tint|shade|pigment|swatch|hue)/i.test(fullSearch)) {
    const rawName = hostname.split('.')[0] || 'Color Tool';
    return {
      title: rawName.charAt(0).toUpperCase() + rawName.slice(1),
      category: 'UI/UX',
      description: 'Color palette generator, hex color codes, and UI color schemes.',
      tag: '🎨 Color & Palette Tool',
    };
  }

  if (/(font|typography|typeface|glyph|serif|sans)/i.test(fullSearch)) {
    const rawName = hostname.split('.')[0] || 'Typography';
    return {
      title: rawName.charAt(0).toUpperCase() + rawName.slice(1),
      category: 'UI/UX',
      description: 'Typography resources, font pairings, and web type tools.',
      tag: '🔤 Typography Resource',
    };
  }

  if (/(icon|svg|illustration|vector|graphic|logo|canvas|sketch)/i.test(fullSearch)) {
    const rawName = hostname.split('.')[0] || 'Design Asset';
    return {
      title: rawName.charAt(0).toUpperCase() + rawName.slice(1),
      category: 'UI/UX',
      description: 'Icons, vector illustrations, and visual design assets for UI designers.',
      tag: '📐 UI & Design Asset',
    };
  }

  if (/(ai|agent|gpt|llm|neural|bot|machine-learning|prompt|model)/i.test(fullSearch)) {
    const rawName = hostname.split('.')[0] || 'AI Tool';
    return {
      title: rawName.charAt(0).toUpperCase() + rawName.slice(1),
      category: 'AI',
      description: 'Artificial intelligence platform, smart agents, and automation tools.',
      tag: '🤖 AI Tool',
    };
  }

  return null;
}
