"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

// =========================================================
// HIGH-FIDELITY APP LOGOS / ICONS
// =========================================================

// 1. Figma (Official 5-color F)
const FigmaLogo = () => (
  <svg viewBox="0 0 38 57" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
    <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
    <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
    <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
    <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
  </svg>
);

// 2. GitHub (Official Octocat Mark)
const GitHubLogo = () => (
  <svg viewBox="0 0 98 96" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#181717">
    <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.215-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
  </svg>
);

// 3. OpenAI / ChatGPT (Official Teal Flower Vortex)
const OpenAILogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#10A37F">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.771-4.204 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.746-7.075zM12 15.34a3.34 3.34 0 1 1 3.34-3.34 3.344 3.344 0 0 1-3.34 3.34z" />
  </svg>
);

// 4. Claude / Anthropic (Official Terracotta Sparkle Star)
const ClaudeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#D97706">
    <path d="M12 2l2.4 6.8L21 12l-6.6 3.2L12 22l-2.4-6.8L3 12l6.6-3.2L12 2z" />
  </svg>
);

// 5. Vercel (Official Triangle)
const VercelLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#000000">
    <path d="M12 1L24 22H0L12 1Z" />
  </svg>
);

// 6. Supabase (Official Emerald Lightning)
const SupabaseLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#3ECF8E" d="M21.362 9.354H12V.3a.3.3 0 0 0-.528-.21L.638 12.355a.3.3 0 0 0 .21.519H12v9.054a.3.3 0 0 0 .528.21l10.834-12.266a.3.3 0 0 0-.21-.518z" />
  </svg>
);

// 7. Linear (Official Indigo Geometric Brand)
const LinearLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#5E6AD2">
    <path d="M3.056 12.78a8.945 8.945 0 0 1 8.164-9.724l9.724 8.164a8.945 8.945 0 0 1-8.164 9.724L3.056 12.78z" />
    <path fill="#FFF" opacity="0.8" d="M7.5 16.5l9-9" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 8. Notion (Official N Mark)
const NotionLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#000000">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l11.459-.7a1.06 1.06 0 0 1 1.074.42c.373.466.56.979.56 1.54v13.563c0 .84-.373 1.353-1.12 1.493l-12.72 .747c-.746.046-1.166-.187-1.54-.654-.373-.466-.466-1.12-.466-1.726V6.168c0-.98.373-1.493 1.325-1.96zm4.153 3.687c-.606 0-.84.28-.84.793v8.587c0 .466.234.793.793.793.513 0 .746-.28.746-.793V9.782l5.74 7.607c.327.42.7.653 1.213.606l1.354-.093c.606 0 .84-.28.84-.793V8.802c0-.466-.234-.793-.794-.793-.513 0-.746.28-.746.793v5.693l-5.694-7.42c-.373-.513-.746-.747-1.213-.654l-1.353.07z" />
  </svg>
);

// 9. Framer (Official Blue/Cyan Stacked F)
const FramerLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#0055FF">
    <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
  </svg>
);

// 10. Midjourney (Official Sailboat)
const MidjourneyLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#2D3748">
    <path d="M12.5 2.5c-.8 0-1.5.7-1.5 1.5v9.2l-6.8-5c-.7-.5-1.7 0-1.7.9v9.8c0 .6.4 1.1 1 1.1h13c.6 0 1-.5 1-1.1V4c0-.8-.7-1.5-1.5-1.5h-3.5zm-1.5 14.5H5.8l5.2-3.8v3.8zm2 0V5.5l5 6.2-5 5.3z" />
  </svg>
);

// 11. Hugging Face (Official 🤗 Emoji Vector)
const HuggingFaceLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <circle cx="12" cy="12" r="10" fill="#FFD21E" />
    <circle cx="8" cy="10" r="1.5" fill="#222" />
    <circle cx="16" cy="10" r="1.5" fill="#222" />
    <path d="M8 14.5c1.2 2 6.8 2 8 0" stroke="#222" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    <path d="M3 13c1.5 1 2.5 2.5 2 4s-2.5 1.5-3 0" fill="#FFA200" />
    <path d="M21 13c-1.5 1-2.5 2.5-2 4s2.5 1.5 3 0" fill="#FFA200" />
  </svg>
);

// 12. Perplexity AI (Official Turquoise Asterism)
const PerplexityLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#20B2AA">
    <path d="M12 2a1 1 0 0 1 1 1v4.07a7 7 0 0 1 4.95 2.88l2.88-2.88a1 1 0 1 1 1.41 1.41l-2.88 2.88A7 7 0 0 1 22 16.3V21a1 1 0 0 1-2 0v-3.7a5 5 0 0 0-4.08-4.92L13 14.18V21a1 1 0 0 1-2 0v-6.82l-2.92-1.8A5 5 0 0 0 4 17.3V21a1 1 0 0 1-2 0v-4.7a7 7 0 0 1 2.64-5.46L1.76 7.96a1 1 0 1 1 1.41-1.41l2.88 2.88A7 7 0 0 1 11 6.55V3a1 1 0 0 1 1-1z" />
  </svg>
);

// 13. Raycast (Official Ruby Hex Geometric)
const RaycastLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#FF6363">
    <path d="M12 2L2 7.5v9L12 22l10-5.5v-9L12 2zm0 3.8l6.5 3.6-6.5 3.6L5.5 9.4 12 5.8zm-7 5.8l6 3.3v5.8l-6-3.3v-5.8zm8 9.1v-5.8l6-3.3v5.8l-6 3.3z" />
  </svg>
);

// 14. Slack (Official 4-Color Octothorpe)
const SlackLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#E01E5A" d="M13 29a4 4 0 11-4-4h4v4zm0-9a4 4 0 114 4h-4v-4z" />
    <path fill="#36C5F0" d="M19 13a4 4 0 114-4v4h-4zm9 0a4 4 0 11-4 4V13h4z" />
    <path fill="#2EB67D" d="M35 19a4 4 0 114 4h-4v-4zm0 9a4 4 0 11-4-4v4h4z" />
    <path fill="#ECB22E" d="M29 35a4 4 0 11-4 4v-4h4zm-9 0a4 4 0 114-4v4h-4z" />
  </svg>
);

// 15. Discord (Official Blurple Controller)
const DiscordLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9" fill="#5865F2">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

// =========================================================
// REAL DATABASE & AI VECTOR STACK SVGs
// =========================================================

const PineconeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-600" fill="currentColor">
    <path d="M12 2l3.5 6h-7L12 2zm0 4.5l5 8.5H7l5-8.5zm0 5l6.5 10H5.5L12 11.5z" />
  </svg>
);

const PostgresElephantLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#336791]" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13.5c-.8.8-1.9 1.2-3.5 1.2-2.3 0-3.8-1.5-3.8-3.8V9.5c0-1.2.9-2.2 2.2-2.2h3.2c2.1 0 3.6 1.4 3.6 3.4 0 1.2-.6 2.1-1.5 2.7.9.6 1.4 1.5 1.4 2.7 0 .5-.1 1-.4 1.4zM10.2 9.2v2h2.8c.8 0 1.3-.5 1.3-1s-.5-1-1.3-1h-2.8zm0 3.8v2.2h3.1c.8 0 1.4-.5 1.4-1.1s-.6-1.1-1.4-1.1h-3.1z" />
  </svg>
);

const RedisLayersLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#DC382D]" fill="currentColor">
    <path d="M12 2L3 6.5l9 4.5 9-4.5L12 2zm0 6L6.5 5.2 12 3.8l5.5 1.4L12 8zM3 9.5l9 4.5 9-4.5v3l-9 4.5-9-4.5v-3zm0 6l9 4.5 9-4.5v3L12 23l-9-4.5v-3z" />
  </svg>
);

const MongoLeafLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-500" fill="currentColor">
    <path d="M12 2s-6 6.5-6 11c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4.5-6-11-6-11zm0 15c-1.7 0-3-1.3-3-3 0-2.3 3-6.5 3-6.5s3 4.2 3 6.5c0 1.7-1.3 3-3 3z" />
  </svg>
);

const ChromaDBLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="8" y1="4" x2="6" y2="20" strokeLinecap="round" />
    <line x1="16" y1="4" x2="14" y2="20" strokeLinecap="round" />
  </svg>
);

// Grid definition
interface AppItem {
  id: string;
  name: string;
  logo: React.ComponentType;
  colIndex: number;
}

const apps: AppItem[] = [
  // Col 0 - Core Design & UI
  { id: "figma", name: "Figma", logo: FigmaLogo, colIndex: 0 },
  { id: "framer", name: "Framer", logo: FramerLogo, colIndex: 0 },
  { id: "midjourney", name: "Midjourney", logo: MidjourneyLogo, colIndex: 0 },

  // Col 1 - Leading AI Models
  { id: "openai", name: "OpenAI ChatGPT", logo: OpenAILogo, colIndex: 1 },
  { id: "claude", name: "Claude AI", logo: ClaudeLogo, colIndex: 1 },
  { id: "perplexity", name: "Perplexity AI", logo: PerplexityLogo, colIndex: 1 },

  // Col 2 - Developer Platforms
  { id: "github", name: "GitHub", logo: GitHubLogo, colIndex: 2 },
  { id: "vercel", name: "Vercel", logo: VercelLogo, colIndex: 2 },
  { id: "supabase", name: "Supabase", logo: SupabaseLogo, colIndex: 2 },

  // Col 3 - Productivity & Workspaces
  { id: "notion", name: "Notion", logo: NotionLogo, colIndex: 3 },
  { id: "linear", name: "Linear", logo: LinearLogo, colIndex: 3 },
  { id: "raycast", name: "Raycast", logo: RaycastLogo, colIndex: 3 },

  // Col 4 - Community & Open Source
  { id: "huggingface", name: "Hugging Face", logo: HuggingFaceLogo, colIndex: 4 },
  { id: "slack", name: "Slack", logo: SlackLogo, colIndex: 4 },
  { id: "discord", name: "Discord", logo: DiscordLogo, colIndex: 4 },
];

export default function AnimatedConnect01() {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);

  const cols = [0, 1, 2, 3, 4].map((colIdx) =>
    apps.filter((app) => app.colIndex === colIdx)
  );

  return (
    <div id="integrations" className="w-full min-h-[520px] sm:min-h-[640px] bg-[#fbfbfa] py-14 sm:py-20 px-3 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* Header Badge */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4f4f3] border border-[#e8e8e6] text-[#222] text-xs font-semibold mb-4 sm:mb-5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#555]" />
          <span>Animated Integration Pipeline</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111] mb-3 leading-tight">
          Unify 15+ SaaS Tools into Your AI
        </h2>
        <p className="text-xs sm:text-base text-[#666] leading-relaxed max-w-xl mx-auto">
          Seamlessly sync documents, messages, and files from your daily stack directly into vector embeddings for live RAG pipelines.
        </p>
      </div>

      {/* Main Flow Container */}
      <div className="w-full max-w-3xl flex flex-col items-center relative pb-6 px-1 sm:px-4">
        
        {/* SVG Connecting Flow Lines */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet" fill="none">
            <defs>
              <linearGradient id="flowBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
              </linearGradient>

              <style>{`
                @keyframes dashMove {
                  to { stroke-dashoffset: -40; }
                }
                @keyframes pulseMove0 {
                  0% { offset-distance: 0%; opacity: 0; }
                  20% { opacity: 1; }
                  80% { opacity: 1; }
                  100% { offset-distance: 100%; opacity: 0; }
                }
                .flow-dash-line {
                  animation: dashMove 2.5s linear infinite;
                }
                .flow-dot-0 {
                  offset-path: path('M 60 40 L 60 250 C 60 310, 300 300, 300 355');
                  animation: pulseMove0 3.2s ease-in-out infinite;
                }
                .flow-dot-1 {
                  offset-path: path('M 180 40 L 180 250 C 180 310, 300 310, 300 355');
                  animation: pulseMove0 2.8s ease-in-out infinite 0.4s;
                }
                .flow-dot-2 {
                  offset-path: path('M 300 40 L 300 355');
                  animation: pulseMove0 2.4s ease-in-out infinite 0.8s;
                }
                .flow-dot-3 {
                  offset-path: path('M 420 40 L 420 250 C 420 310, 300 310, 300 355');
                  animation: pulseMove0 2.9s ease-in-out infinite 0.2s;
                }
                .flow-dot-4 {
                  offset-path: path('M 540 40 L 540 250 C 540 310, 300 300, 300 355');
                  animation: pulseMove0 3.3s ease-in-out infinite 0.6s;
                }
              `}</style>
            </defs>

            {[
              { id: 0, d: "M 60 40 L 60 250 C 60 310, 300 300, 300 355", dotClass: "flow-dot-0" },
              { id: 1, d: "M 180 40 L 180 250 C 180 310, 300 310, 300 355", dotClass: "flow-dot-1" },
              { id: 2, d: "M 300 40 L 300 355", dotClass: "flow-dot-2" },
              { id: 3, d: "M 420 40 L 420 250 C 420 310, 300 310, 300 355", dotClass: "flow-dot-3" },
              { id: 4, d: "M 540 40 L 540 250 C 540 310, 300 300, 300 355", dotClass: "flow-dot-4" },
            ].map((pathItem) => {
              const isColHovered = hoveredApp
                ? apps.find((a) => a.id === hoveredApp)?.colIndex === pathItem.id
                : false;

              return (
                <g key={pathItem.id}>
                  {/* Subtle Background Guide */}
                  <path
                    d={pathItem.d}
                    stroke="#e8eaed"
                    strokeWidth="2"
                    fill="none"
                  />

                  {/* Blue Dashed Animated Line */}
                  <path
                    d={pathItem.d}
                    stroke="#60a5fa"
                    strokeWidth={isColHovered ? "2.5" : "1.8"}
                    strokeDasharray="6 8"
                    strokeLinecap="round"
                    fill="none"
                    className="flow-dash-line"
                  />

                  {/* Floating Pulsing Particles */}
                  <circle
                    r={isColHovered ? "4" : "3"}
                    fill="#6366f1"
                    className={pathItem.dotClass}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Top 5x3 App Grid with Clean Light Cards */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3.5 md:gap-5 w-full z-10 justify-items-center mb-10 sm:mb-14">
          {cols.map((colApps, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-2 sm:gap-3.5 md:gap-5 items-center">
              {colApps.map((app) => {
                const IconComponent = app.logo;
                const isHovered = hoveredApp === app.id;
                return (
                  <div
                    key={app.id}
                    onMouseEnter={() => setHoveredApp(app.id)}
                    onMouseLeave={() => setHoveredApp(null)}
                    style={{
                      transform: isHovered ? 'translateY(-3px) scale(1.04)' : 'none',
                      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    className={`w-[52px] h-[52px] sm:w-[74px] sm:h-[74px] md:w-[88px] md:h-[88px] rounded-[16px] sm:rounded-[24px] md:rounded-[28px] border flex items-center justify-center p-1.5 sm:p-3 cursor-pointer shadow-xs ${
                      isHovered
                        ? "bg-white border-[#cbd5e1] shadow-lg"
                        : "bg-[#f8f8f7]/95 border-[#e8e8e6] hover:border-[#cbd5e1] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <IconComponent />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom DB and Tech Stack Pill */}
        <div className="w-full max-w-sm z-10 flex flex-col items-center pt-2 sm:pt-4">
          <div className="flex items-center justify-center gap-4 sm:gap-6 px-5 sm:px-7 py-2.5 sm:py-3 rounded-2xl bg-white border border-[#e2e8f0] shadow-md scale-95 sm:scale-100">
            <div title="Pinecone Vector DB" className="hover:scale-110 transition-transform cursor-pointer"><PineconeLogo /></div>
            <div title="PostgreSQL" className="hover:scale-110 transition-transform cursor-pointer"><PostgresElephantLogo /></div>
            <div title="Redis Cache" className="hover:scale-110 transition-transform cursor-pointer"><RedisLayersLogo /></div>
            <div title="MongoDB" className="hover:scale-110 transition-transform cursor-pointer"><MongoLeafLogo /></div>
            <div title="Chroma Vector DB" className="hover:scale-110 transition-transform cursor-pointer"><ChromaDBLogo /></div>
          </div>
        </div>

      </div>

    </div>
  );
}

