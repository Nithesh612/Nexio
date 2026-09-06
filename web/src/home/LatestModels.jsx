import React, { useState } from 'react';
import './LatestModels.css';

// SVG Brand Logos matching the clean minimalist AI models row
const OpenAILogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.771-4.2057 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7467-7.0731zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
  </svg>
);

const GoogleGLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const XLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const MidjourneyLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M12 2L4 9v6l8 7 8-7V9l-8-7zm0 2.8l5.8 5.1-5.8 5.1-5.8-5.1L12 4.8zM6 10.2l5 4.4v4.6l-5-4.4v-4.6zm12 0v4.6l-5 4.4v-4.6l5-4.4z" />
  </svg>
);

const KreaLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <text x="3" y="17" fontSize="13" fontWeight="900" fontFamily="sans-serif">K²</text>
  </svg>
);

const SeedreamLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M4 18h3v-6H4v6zm6 0h3V6h-3v12zm6 0h3v-9h-3v9z" />
  </svg>
);

const models = [
  {
    id: 'gpt',
    name: 'GPT 2',
    logo: OpenAILogo,
    url: 'openai.com',
    targetUrl: 'https://chatgpt.com',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'nano',
    name: 'Nano Banana 2',
    logo: GoogleGLogo,
    url: 'deepmind.google',
    targetUrl: 'https://deepmind.google',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'grok',
    name: 'Grok Imagine',
    logo: XLogo,
    url: 'x.ai',
    targetUrl: 'https://x.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'midjourney',
    name: 'Midjourney v6',
    logo: MidjourneyLogo,
    url: 'midjourney.com',
    targetUrl: 'https://www.midjourney.com',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'krea',
    name: 'Krea 2',
    logo: KreaLogo,
    url: 'krea.ai',
    targetUrl: 'https://www.krea.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'veo',
    name: 'Veo 3',
    logo: GoogleGLogo,
    url: 'google.com',
    targetUrl: 'https://deepmind.google/technologies/veo/',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'seedream',
    name: 'Seedream 5',
    logo: SeedreamLogo,
    url: 'stability.ai',
    targetUrl: 'https://stability.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
];

export default function LatestModels() {
  const [hoveredId, setHoveredId] = useState(null);

  // Duplicate items for infinite seamless scroll marquee
  const marqueeModels = [...models, ...models, ...models];

  return (
    <section className="latest-models-section" id="extensions">
      <div className="latest-models-header">
        <h2 className="latest-models-title">With all the latest models</h2>
        <p className="latest-models-subtitle">
          Get access to the world's leading AI companies so you never have to choose between the best models and the easiest workflow.
        </p>
      </div>

      <div className="models-marquee-wrapper">
        <div className={`models-marquee-track ${hoveredId ? 'paused' : ''}`}>
          {marqueeModels.map((item, index) => {
            const Icon = item.logo;
            const uniqueKey = `${item.id}-${index}`;
            const isHovered = hoveredId === uniqueKey;
            const liveFavicon = `https://www.google.com/s2/favicons?domain=${item.url}&sz=64`;

            return (
              <a
                key={uniqueKey}
                href={item.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`model-card ${isHovered ? 'is-hovered' : ''}`}
                onMouseEnter={() => setHoveredId(uniqueKey)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Background Media on Hover */}
                {item.previewUrl && (
                  <div className="model-media-bg">
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="model-media-img"
                      loading="lazy"
                    />
                    <div className="model-media-overlay" />
                  </div>
                )}

                {/* Default Clean Center Content (Icon + Name) */}
                <div className="model-default-content">
                  <div className="model-icon-box">
                    <Icon />
                  </div>
                  <span className="model-name">{item.name}</span>
                </div>

                {/* Hover Reveal Floating Center Logo and Bottom Title */}
                <div className="model-hover-content">
                  <div className="model-live-favicon-wrapper">
                    <img
                      src={liveFavicon}
                      alt={item.name}
                      className="model-live-favicon"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="model-hover-name">{item.name}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
