import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronRight } from 'lucide-react';

const ESSENTIAL_AI_TOOLS = [
  {
    id: 'lovable',
    name: 'Lovable',
    desc: 'Create apps and websites by chatting with AI.',
    tag: 'AI Engineer',
    pricing: 'FREE TRIAL',
    isPartner: true,
    url: 'https://lovablelabs.pxf.io/4aoVMo',
    bannerType: 'lovable',
    bannerUrl: 'https://cdn.prod.website-files.com/5ce10a4d0b5f0b560c22e756/673dc05e197d0263be45cb97_lovable-ai-thumb.webp'
  },
  {
    id: 'firefly',
    name: 'Adobe Firefly',
    desc: 'A suite of generative AI models and tools by Adobe.',
    tag: 'Graphic AI',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://www.adobe.com/products/firefly.html',
    bannerType: 'firefly'
  },
  {
    id: 'bolt',
    name: 'Bolt',
    desc: 'Create stunning apps and websites by chatting with AI.',
    tag: 'Fullstack AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://bolt.new/?ref=toools',
    bannerType: 'bolt'
  },
  {
    id: 'webflow-ai',
    name: 'Webflow AI',
    desc: "Build websites even faster with Webflow's new AI tools.",
    tag: 'Visual Dev',
    pricing: 'FREEMIUM',
    isPartner: true,
    url: 'https://try.webflow.com/via-toools',
    bannerType: 'webflow',
    bannerUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'figma-ai',
    name: 'Figma AI',
    desc: "Figma's built-in AI features for faster design workflows.",
    tag: 'UI Design',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://www.figma.com/ai/?via=toools',
    bannerType: 'figma',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'krea',
    name: 'Krea',
    desc: 'An easy way to generate images, video and sound with AI.',
    tag: 'Realtime AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.krea.ai/?via=toools',
    bannerType: 'krea'
  },
  {
    id: 'claude',
    name: 'Claude',
    desc: 'The AI for problem solvers.',
    tag: 'LLM Model',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://claude.ai/?via=toools',
    bannerType: 'claude'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    desc: 'Unlock multimodal creativity for the next generation of visual apps.',
    tag: 'Multimodal AI',
    pricing: 'FREE + PAID',
    isPartner: false,
    url: 'https://gemini.google.com/?via=toools',
    bannerType: 'gemini'
  },
  {
    id: 'spline-ai',
    name: 'Spline AI',
    desc: 'Generate objects, animations, and textures using prompts.',
    tag: '3D & Motion',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://spline.design/ai?via=toools',
    bannerType: 'spline',
    bannerUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'framer-ai',
    name: 'Framer AI',
    desc: 'Design websites faster with intelligent tools.',
    tag: 'Site Builder',
    pricing: 'FREEMIUM',
    isPartner: true,
    url: 'https://framer.link/toools',
    bannerType: 'framer',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    desc: 'Get answers, find inspiration and be more productive.',
    tag: 'AI Chatbot',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://chat.openai.com/?via=toools',
    bannerType: 'chatgpt'
  },
  {
    id: 'v0',
    name: 'v0',
    desc: 'Generative UI system powered by AI from Vercel.',
    tag: 'Frontend AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://v0.dev/?via=toools',
    bannerType: 'v0'
  },
  {
    id: 'cursor',
    name: 'Cursor',
    desc: 'AI-powered code editor built for extraordinary productivity.',
    tag: 'Code Editor',
    pricing: 'FREE TRIAL',
    isPartner: false,
    url: 'https://www.cursor.com/?via=toools',
    bannerType: 'cursor',
    bannerUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 'recraft',
    name: 'Recraft',
    desc: 'Generate consistent vectors, 3D graphics, and style palettes.',
    tag: 'Vector AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.recraft.ai/?via=toools',
    bannerType: 'recraft'
  },
  {
    id: 'relume',
    name: 'Relume',
    desc: 'Generate websites, sitemaps, and wireframes with AI in seconds.',
    tag: 'Wireframe AI',
    pricing: 'FREEMIUM',
    isPartner: false,
    url: 'https://www.relume.io/?via=toools',
    bannerType: 'relume'
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    desc: 'State of the art generative visual creation platform.',
    tag: 'Image AI',
    pricing: 'PAID',
    isPartner: false,
    url: 'https://www.midjourney.com/?via=toools',
    bannerType: 'midjourney',
    bannerUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop'
  }
];

const ToolBanner = ({ tool, renderGraphic }) => {
  const [screenshotError, setScreenshotError] = useState(false);
  const cleanUrl = tool.url.startsWith('http') ? tool.url : `https://${tool.url}`;
  
  const primaryScreenshot = tool.bannerUrl || `https://image.thum.io/get/width/600/crop/400/${cleanUrl}`;
  const secondaryScreenshot = `https://api.microlink.io?url=${encodeURIComponent(cleanUrl)}&screenshot=true&meta=false&embed=screenshot.url`;
  const tertiaryScreenshot = `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=600&h=380`;
  
  const [currentScreenshot, setCurrentScreenshot] = useState(primaryScreenshot);

  if (screenshotError) {
    return renderGraphic(tool);
  }

  return (
    <div className="h-[142px] w-full rounded-[20px] overflow-hidden relative border border-gray-100 bg-gray-50">
      <img
        src={currentScreenshot}
        alt={`${tool.name} banner`}
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
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
      {tool.isPartner && (
        <span className="absolute bottom-2.5 right-3 text-[8.5px] font-bold tracking-wider uppercase text-white/90 drop-shadow-md select-none bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
          PARTNER*
        </span>
      )}
    </div>
  );
};

export default function EssentialAITools({ onNavigateToDesign }) {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 300;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  const renderLogoBadge = (tool) => {
    switch (tool.bannerType) {
      case 'lovable':
        return (
          <svg viewBox="0 0 100 100" className="w-5 h-5">
            <defs>
              <linearGradient id="badgeLovableGrad" x1="40%" y1="0%" x2="60%" y2="100%">
                <stop offset="0%" stopColor="#ff7043" />
                <stop offset="55%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#93c5fd" />
              </linearGradient>
            </defs>
            <path
              d="M33 76 L33 38 C33 22 57 22 57 38 L57 48 C57 54 61 56 68 56 C80 56 80 76 68 76 L33 76 Z"
              fill="url(#badgeLovableGrad)"
            />
          </svg>
        );

      case 'firefly':
        return (
          <div className="w-6 h-6 rounded-full bg-[#300615] flex items-center justify-center text-white font-bold text-[10px]">
            Fi✦
          </div>
        );

      case 'bolt':
        return (
          <span className="font-serif italic font-black text-xs text-black">b</span>
        );

      case 'webflow':
        return (
          <div className="w-6 h-6 rounded-full bg-[#146ef5] flex items-center justify-center text-white text-[11px] font-bold">
            W
          </div>
        );

      case 'figma':
        return (
          <svg viewBox="0 0 38 57" className="w-3.5 h-5">
            <path fill="#1abcfe" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/>
            <path fill="#0acf83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/>
            <path fill="#ff7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/>
            <path fill="#f24e1e" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/>
            <path fill="#a259ff" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/>
          </svg>
        );

      case 'claude':
        return (
          <div className="w-6 h-6 rounded-full bg-[#faf8f5] flex items-center justify-center text-[#c75d36] font-bold text-xs">
            ✦
          </div>
        );

      case 'gemini':
        return (
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-500 font-bold text-xs">
            ✦
          </div>
        );

      case 'framer':
        return (
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center text-white font-black text-xs">
            F
          </div>
        );

      default:
        return (
          <span className="font-extrabold text-xs text-gray-900">{tool.name?.charAt(0)}</span>
        );
    }
  };

  const renderBannerGraphic = (tool) => {
    switch (tool.bannerType) {
      case 'lovable':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-16 h-16 transform group-hover:scale-110 transition-transform duration-300">
              <defs>
                <linearGradient id="lovableOfficialGrad" x1="40%" y1="0%" x2="60%" y2="100%">
                  <stop offset="0%" stopColor="#ff7043" />
                  <stop offset="25%" stopColor="#ff8a65" />
                  <stop offset="55%" stopColor="#f472b6" />
                  <stop offset="80%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </linearGradient>
              </defs>
              <path
                d="M33 76 L33 38 C33 22 57 22 57 38 L57 48 C57 54 61 56 68 56 C80 56 80 76 68 76 L33 76 Z"
                fill="url(#lovableOfficialGrad)"
              />
            </svg>
          </div>
        );

      case 'firefly':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-gradient-to-r from-[#d81159] via-[#e51d5c] to-[#a80838] flex items-center justify-center relative overflow-hidden shadow-inner">
            <div className="w-14 h-14 rounded-2xl bg-[#280412]/80 backdrop-blur-xs border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <div className="relative flex items-center justify-center">
                <span className="text-white font-black text-2xl tracking-tighter select-none font-sans">Fi</span>
                <span className="absolute -top-1 -right-2 text-white text-[10px] select-none">✦</span>
              </div>
            </div>
          </div>
        );

      case 'bolt':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#1a1a1e] flex items-center justify-center relative overflow-hidden">
            <span className="text-white font-black text-6xl italic font-serif tracking-tighter transform -rotate-6 group-hover:scale-110 transition-transform duration-300 select-none">
              b
            </span>
          </div>
        );

      case 'webflow':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#070a16] flex items-center justify-center relative overflow-hidden">
            <div className="relative flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600/35 to-blue-500/25 blur-md absolute" />
              <div className="w-14 h-14 rounded-full border-2 border-purple-400/80 flex items-center justify-center shadow-[0_0_16px_rgba(168,85,247,0.6)] group-hover:scale-110 transition-transform duration-300">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-white">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              </div>
            </div>
          </div>
        );

      case 'figma':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#bca7df] flex items-center justify-center relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-white/95 shadow-md p-2 grid grid-cols-2 gap-1.5 group-hover:scale-105 transition-transform duration-300">
              <div className="rounded-tl-md bg-[#f24e1e] flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">✦</span>
              </div>
              <div className="rounded-tr-md bg-[#a259ff] flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">●</span>
              </div>
              <div className="rounded-bl-md bg-[#0acf83] flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">▲</span>
              </div>
              <div className="rounded-br-md bg-[#1abcfe] flex items-center justify-center">
                <span className="text-[9px] text-white font-bold">✦</span>
              </div>
            </div>
          </div>
        );

      case 'krea':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#fbfbfb] border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 text-black transform group-hover:scale-110 transition-transform duration-300" fill="currentColor">
              <rect x="30" y="24" width="14" height="52" rx="7" />
              <path d="M44 38 C44 30 52 24 60 24 C68 24 74 30 74 38 C74 46 68 52 60 52 C54 52 48 48 44 44 Z" />
              <path d="M44 56 C48 52 54 48 60 48 C68 48 74 54 74 62 C74 70 68 76 60 76 C52 76 44 70 44 62 Z" />
            </svg>
          </div>
        );

      case 'claude':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#faf8f5] border border-[#f0ebe1] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 text-[#c75d36] transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="currentColor">
              <path d="M50 16 L53 38 L68 23 L59 43 L80 37 L63 50 L80 63 L59 57 L68 77 L53 62 L50 84 L47 62 L32 77 L41 57 L20 63 L37 50 L20 37 L41 43 L32 23 L47 38 Z" />
            </svg>
          </div>
        );

      case 'gemini':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 transform group-hover:rotate-45 transition-transform duration-500">
              <defs>
                <linearGradient id="geminiGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ea4335" />
                  <stop offset="35%" stopColor="#4285f4" />
                  <stop offset="65%" stopColor="#34a853" />
                  <stop offset="100%" stopColor="#fbbc05" />
                </linearGradient>
              </defs>
              <path d="M50 14 C50 34 34 50 14 50 C34 50 50 66 50 86 C50 66 66 50 86 50 C66 50 50 34 50 14 Z" fill="url(#geminiGradMain)" />
            </svg>
          </div>
        );

      case 'spline':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#0c0d14] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-16 h-16 transform group-hover:scale-110 transition-transform duration-300">
              <defs>
                <linearGradient id="splineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#d946ef" />
                  <stop offset="100%" stopColor="#ff007a" />
                </linearGradient>
                <filter id="splineGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <circle cx="42" cy="55" r="16" fill="url(#splineGradient)" filter="url(#splineGlow)" />
              <path d="M68 28 L70 20 L72 28 L80 30 L72 32 L70 40 L68 32 L60 30 Z" fill="#93c5fd" opacity="0.95" />
              <path d="M78 48 L79 43 L80 48 L85 49 L80 50 L79 55 L78 50 L73 49 Z" fill="#e0e7ff" opacity="0.85" />
            </svg>
          </div>
        );

      case 'framer':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-black flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 24 24" className="w-10 h-14 transform group-hover:scale-110 transition-transform duration-300">
              <path d="M0 0h24v8H12z" fill="#FFFFFF" />
              <path d="M0 8h12l12 8H0z" fill="#0099FF" />
              <path d="M0 16h12L0 24z" fill="#0055FF" />
            </svg>
          </div>
        );

      case 'chatgpt':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 text-black transform group-hover:rotate-45 transition-transform duration-500" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M48.5 24 C45 22 40 23 37 26 C33 30 33 36 36 40 L36 43 L29 47 C24 50 22 56 25 61 C28 66 34 68 39 65 L43 63 L43 71 C43 77 47 81 53 81 C59 81 63 77 63 71 L63 67 L70 63 C75 60 77 54 74 49 C71 44 65 42 60 45 L56 47 L56 39 C56 33 52 29 46 29 Z" />
              <circle cx="50" cy="50" r="10" />
            </svg>
          </div>
        );

      case 'v0':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-16 h-12 transform group-hover:scale-110 transition-transform duration-300">
              <path d="M22 36 L36 64 L48 36" fill="none" stroke="#000000" strokeWidth="8" strokeLinecap="square" strokeLinejoin="miter" />
              <rect x="56" y="36" width="22" height="28" rx="4" fill="none" stroke="#000000" strokeWidth="8" />
              <line x1="56" y1="64" x2="78" y2="36" stroke="#000000" strokeWidth="6" />
            </svg>
          </div>
        );

      case 'cursor':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#f6f5f0] border border-[#ebe6dc] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-16 h-16 transform group-hover:scale-110 transition-transform duration-300">
              <polygon points="50,22 76,37 50,52 24,37" fill="#2d2d30" />
              <polygon points="24,37 50,52 50,82 24,67" fill="#18181b" />
              <polygon points="50,52 76,37 76,67 50,82" fill="#09090b" />
              <polygon points="50,52 76,37 76,52 50,67" fill="#ffffff" opacity="0.95" />
            </svg>
          </div>
        );

      case 'recraft':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#000000] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 transform group-hover:scale-110 transition-transform duration-300">
              <path
                d="M32 26 C32 26 54 26 62 26 C72 26 76 32 76 40 C76 48 70 52 60 54 C70 58 74 68 74 74 L60 74 C60 68 56 62 46 62 L44 62 L44 74 L32 74 Z M44 38 L44 50 L58 50 C62 50 64 48 64 44 C64 40 62 38 58 38 Z"
                fill="none"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );

      case 'relume':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-[#000000] flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-14 h-14 transform group-hover:scale-110 transition-transform duration-300">
              <path d="M46 24 C34 24 28 32 28 46 C28 60 34 68 46 68 Z" fill="#ffffff" />
              <path d="M48 48 L68 48 L74 76 L52 76 Z" fill="#ffffff" />
            </svg>
          </div>
        );

      case 'midjourney':
        return (
          <div className="h-[142px] w-full rounded-[20px] bg-white border border-gray-100 flex items-center justify-center relative overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-16 h-16 text-black transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M49 18 C49 18 63 38 65 66 L49 66 Z" />
              <path d="M43 30 C43 30 29 46 27 66 L43 66 Z" />
              <line x1="46" y1="14" x2="46" y2="68" />
              <path d="M22 72 C36 80 64 80 78 72 L72 80 C54 84 40 84 26 80 Z" />
              <path d="M18 86 Q24 82 30 86 T42 86 T54 86 T66 86 T78 86 T88 86" strokeWidth="1.8" />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto select-none" id="essential-ai-tools">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
          Essential AI Tools
        </h2>
        
        <button 
          onClick={onNavigateToDesign}
          className="group flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer"
        >
          <span>More AI Tools</span>
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto pb-4 pt-1 scroll-smooth snap-x snap-mandatory no-scrollbar scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ESSENTIAL_AI_TOOLS.map((tool) => (
          <a
            key={tool.id}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[280px] sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)] shrink-0 snap-start bg-white rounded-3xl p-4 border border-gray-100/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between block no-underline text-inherit group"
          >
            <div>
              <div className="relative mb-5">
                <ToolBanner tool={tool} renderGraphic={renderBannerGraphic} />
                <div className="absolute -bottom-2 -right-1 w-10 h-10 rounded-full bg-white shadow-md border-2 border-white flex items-center justify-center p-1 z-10">
                  {renderLogoBadge(tool)}
                </div>
              </div>

              <h3 className="font-extrabold text-[17px] text-gray-950 mb-1 group-hover:text-indigo-600 transition-colors">
                {tool.name}
              </h3>
              <p className="text-[13px] text-gray-500 font-normal leading-relaxed line-clamp-2">
                {tool.desc}
              </p>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-between">
              <span className="text-[11.5px] font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full">
                {tool.tag || 'AI Tool'}
              </span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                tool.pricing?.includes('TRIAL') 
                  ? 'bg-[#ffedd5] text-[#9a3412]' 
                  : tool.pricing?.includes('PAID') 
                    ? 'bg-[#fee2e2] text-[#991b1b]' 
                    : 'bg-[#fef9c3] text-[#854d0e]'
              }`}>
                {tool.pricing || 'FREEMIUM'}
              </span>
            </div>
          </a>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2.5 mt-4">
        <button
          onClick={() => scroll('left')}
          className="w-10 h-10 rounded-full bg-indigo-50/80 hover:bg-indigo-100 text-gray-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
          aria-label="Previous tools"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          onClick={() => scroll('right')}
          className="w-10 h-10 rounded-full bg-indigo-50/80 hover:bg-indigo-100 text-gray-700 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
          aria-label="Next tools"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
