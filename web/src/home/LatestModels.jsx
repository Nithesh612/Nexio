import React, { useState } from 'react';
import './LatestModels.css';

// Authentic Official AI Model Logos
const OpenAILogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.771-4.2057 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7467-7.0731zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
  </svg>
);

const ClaudeLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M12 2a1.5 1.5 0 0 1 1.5 1.5v3.1a1.5 1.5 0 0 1-3 0V3.5A1.5 1.5 0 0 1 12 2zm6.36 4.64a1.5 1.5 0 0 1 2.12 2.12l-2.2 2.2a1.5 1.5 0 0 1-2.12-2.12l2.2-2.2zM22 12a1.5 1.5 0 0 1-1.5 1.5h-3.1a1.5 1.5 0 0 1 0-3h3.1A1.5 1.5 0 0 1 22 12zm-4.64 6.36a1.5 1.5 0 0 1-2.12 0l-2.2-2.2a1.5 1.5 0 0 1 2.12-2.12l2.2 2.2a1.5 1.5 0 0 1 0 2.12zM12 22a1.5 1.5 0 0 1-1.5-1.5v-3.1a1.5 1.5 0 0 1 3 0v3.1A1.5 1.5 0 0 1 12 22zm-6.36-4.64a1.5 1.5 0 0 1-2.12-2.12l2.2-2.2a1.5 1.5 0 0 1 2.12 2.12l-2.2 2.2zM2 12a1.5 1.5 0 0 1 1.5-1.5h3.1a1.5 1.5 0 0 1 0 3H3.5A1.5 1.5 0 0 1 2 12zm4.64-6.36a1.5 1.5 0 0 1 2.12 0l2.2 2.2a1.5 1.5 0 0 1-2.12 2.12l-2.2-2.2a1.5 1.5 0 0 1 0-2.12z" />
  </svg>
);

const GeminiLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M12 24C12 17.3726 6.62742 12 0 12C6.62742 12 12 6.62742 12 0C12 6.62742 17.3726 12 24 12C17.3726 12 12 17.3726 12 24Z" />
  </svg>
);

const MidjourneyLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M11.96 2.5a.75.75 0 0 0-.67.42L5.8 13.9a.75.75 0 0 0 .58 1.07l5.22.48v5.8a.75.75 0 0 0 1.41.34l5.2-10.4a.75.75 0 0 0-.67-1.09l-4.52.28V3.25a.75.75 0 0 0-.06-.75zm.9 3.2v4.86a.75.75 0 0 0 .8.7l3.15-.2-3.95 7.9v-4.63a.75.75 0 0 0-.82-.75l-3.87-.36 4.69-7.52z" />
  </svg>
);

const FluxLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zm-9 9h7v7H4v-7zm9 0h7v7h-7v-7z" fillOpacity="0.4" />
    <path d="M7 7h10v10H7V7z" />
  </svg>
);

const MistralLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M3 4h3.6v3.6H3V4zm14.4 0H21v3.6h-3.6V4zM3 7.6h7.2v3.6H3V7.6zm10.8 0H21v3.6h-7.2V7.6zm-10.8 3.6H21v3.6H3v-3.6zm3.6 3.6h10.8v3.6H6.6v-3.6zm3.6 3.6h3.6v3.6h-3.6v-3.6z" />
  </svg>
);

const MetaLlamaLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M16.5 6C13.5 6 12 8.5 12 8.5S10.5 6 7.5 6C4 6 1.5 9 1.5 12.5C1.5 16.5 4.5 19 7.5 19C10.5 19 12 16.5 12 16.5S13.5 19 16.5 19C19.5 19 22.5 16.5 22.5 12.5C22.5 9 20 6 16.5 6zm-9 10.5C5.5 16.5 3.5 14.8 3.5 12.5C3.5 10.2 5.5 8.5 7.5 8.5C9.5 8.5 11 10.8 11 12.5C11 14.2 9.5 16.5 7.5 16.5zm9 0c-2 0-3.5-2.3-3.5-4C13 10.8 14.5 8.5 16.5 8.5C18.5 8.5 20.5 10.2 20.5 12.5C20.5 14.8 18.5 16.5 16.5 16.5z" />
  </svg>
);

const RunwayLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M4 5h6.5a4.5 4.5 0 0 1 3.8 6.9L19.5 20H15l-4.5-7.2H7V20H4V5zm3 3v4.8h3.5a2.4 2.4 0 0 0 0-4.8H7z" />
  </svg>
);

const PerplexityLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm6 13.5l-6 3.75-6-3.75V8.5l6-3.75 6 3.75v7zM12 7.2L7.5 10v4l4.5 2.8 4.5-2.8v-4L12 7.2z" />
  </svg>
);

const ElevenLabsLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M8 4h3v16H8V4zm5 0h3v16h-3V4z" />
  </svg>
);

const StabilityLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="12" cy="12" r="5" fill="currentColor" />
  </svg>
);

const GrokLogo = () => (
  <svg viewBox="0 0 24 24" className="model-logo" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const models = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    logo: OpenAILogo,
    url: 'openai.com',
    targetUrl: 'https://chatgpt.com',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'claude-3-5',
    name: 'Claude 3.5 Sonnet',
    logo: ClaudeLogo,
    url: 'anthropic.com',
    targetUrl: 'https://claude.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'gemini-1-5',
    name: 'Gemini 1.5 Pro',
    logo: GeminiLogo,
    url: 'deepmind.google',
    targetUrl: 'https://gemini.google.com',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'midjourney-v6',
    name: 'Midjourney v6.1',
    logo: MidjourneyLogo,
    url: 'midjourney.com',
    targetUrl: 'https://www.midjourney.com',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'flux-1',
    name: 'FLUX.1 Pro',
    logo: FluxLogo,
    url: 'blackforestlabs.ai',
    targetUrl: 'https://blackforestlabs.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3',
    logo: RunwayLogo,
    url: 'runwayml.com',
    targetUrl: 'https://runwayml.com',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    logo: MistralLogo,
    url: 'mistral.ai',
    targetUrl: 'https://mistral.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'meta-llama-3',
    name: 'Llama 3.1 405B',
    logo: MetaLlamaLogo,
    url: 'meta.com',
    targetUrl: 'https://llama.meta.com',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity Pro',
    logo: PerplexityLogo,
    url: 'perplexity.ai',
    targetUrl: 'https://www.perplexity.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'elevenlabs-v2',
    name: 'ElevenLabs v2',
    logo: ElevenLabsLogo,
    url: 'elevenlabs.io',
    targetUrl: 'https://elevenlabs.io',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'stability-sd3',
    name: 'SD 3.5 Large',
    logo: StabilityLogo,
    url: 'stability.ai',
    targetUrl: 'https://stability.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'grok-2',
    name: 'xAI Grok 2',
    logo: GrokLogo,
    url: 'x.ai',
    targetUrl: 'https://x.ai',
    previewType: 'image',
    previewUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
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
