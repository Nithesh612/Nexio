"use client";

import React, { useState } from "react";
import { Sparkles } from "lucide-react";

// =========================================================
// HIGH-FIDELITY APP LOGOS / ICONS
// =========================================================

const ZoomLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <rect width="48" height="48" rx="14" fill="#2D8CFF" />
    <path fill="#FFF" d="M12 17.5h15a3 3 0 013 3v10a3 3 0 01-3 3H12a3 3 0 01-3-3v-10a3 3 0 013-3z" />
    <path fill="#FFF" d="M31 22l8-5v14l-8-5v-4z" />
  </svg>
);

const GmailLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#4285F4" d="M40 12L24 24 8 12V35a2 2 0 002 2h28a2 2 0 002-2V12z" />
    <path fill="#34A853" d="M8 35V12l16 12L8 35z" />
    <path fill="#EA4335" d="M40 11a2 2 0 00-2-2H10a2 2 0 00-2 2v1.5l16 12 16-12V11z" />
    <path fill="#FBBC04" d="M40 12v23h-5V15.7l5-3.7z" />
  </svg>
);

const OutlookLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <rect width="48" height="48" rx="14" fill="#0078D4" />
    <path fill="#FFF" d="M14 16h20v16H14z" opacity="0.9" />
    <circle cx="24" cy="24" r="5" fill="#0078D4" />
  </svg>
);

const SlackLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#E01E5A" d="M13 29a4 4 0 11-4-4h4v4zm0-9a4 4 0 114 4h-4v-4z" />
    <path fill="#36C5F0" d="M19 13a4 4 0 114-4v4h-4zm9 0a4 4 0 11-4 4V13h4z" />
    <path fill="#2EB67D" d="M35 19a4 4 0 114 4h-4v-4zm0 9a4 4 0 11-4-4v4h4z" />
    <path fill="#ECB22E" d="M29 35a4 4 0 11-4 4v-4h4zm-9 0a4 4 0 114-4v4h-4z" />
  </svg>
);

const GoogleDriveLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#FFC107" d="M18 10h12l10 17h-12L18 10z" />
    <path fill="#0066DA" d="M7 28l6-11 13 23h-12L7 28z" />
    <path fill="#00AC47" d="M18 10l6 11h17l-6-11H18z" />
  </svg>
);

const SharePointLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <circle cx="21" cy="18" r="9" fill="#00756A" />
    <circle cx="29" cy="23" r="8" fill="#008272" opacity="0.9" />
    <circle cx="19" cy="28" r="7.5" fill="#00A496" />
    <circle cx="27" cy="31" r="6" fill="#038387" />
  </svg>
);

const ConfluenceLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#0052CC" d="M7.8 33.2c-.7-1-1-2.1-1-3.3 0-1.6.6-3.1 1.8-4.2l9.8-9.7c1.1-1.1 2.6-1.8 4.2-1.8 1.6 0 3.1.6 4.2 1.8l3 3-13.8 14.2H12c-1.7 0-3.2-.8-4.2-2z" />
    <path fill="#2684FF" d="M40.2 14.8c.7 1 1 2.1 1 3.3 0 1.6-.6 3.1-1.8 4.2l-9.8 9.7c-1.1 1.1-2.6 1.8-4.2 1.8-1.6 0-3.1-.6-4.2-1.8l-3-3 13.8-14.2H36c1.7 0 3.2.8 4.2 2z" />
  </svg>
);

const NotionLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <rect width="48" height="48" rx="12" fill="#000" />
    <path fill="#FFF" d="M14 14h20a2 2 0 012 2v16a2 2 0 01-2 2H14a2 2 0 01-2-2V16a2 2 0 012-2zm4 5v10h4v-6l6 6h4V19h-4v6l-6-6h-4z" />
  </svg>
);

const GoogleDocsLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <rect width="48" height="48" rx="14" fill="#4285F4" />
    <path fill="#FFF" d="M17 17h14v2H17zm0 5h14v2H17zm0 5h10v2H17z" />
  </svg>
);

const JiraLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#2684FF" d="M23.8 4.2L12.5 15.5c-1.6 1.6-1.6 4.1 0 5.7l11.3 11.3c1.6 1.6 4.1 1.6 5.7 0l5.7-5.7-11.3-11.3 11.3-11.3-5.7-5.7c-1.6-1.6-4.1-1.6-5.7 0z" />
    <path fill="#0052CC" d="M23.8 15.5l-5.7 5.7c-1.6 1.6-1.6 4.1 0 5.7l11.3 11.3c1.6 1.6 4.1 1.6 5.7 0l5.7-5.7-11.3-11.3 5.7-5.7-5.7-5.7-5.7 5.7z" />
  </svg>
);

const ZendeskLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <rect width="48" height="48" rx="12" fill="#03363D" />
    <path fill="#00A656" d="M15 15h9c0 5-4 9-9 9v-9z" />
    <circle cx="30" cy="19.5" r="4.5" fill="#FFF" />
    <circle cx="19.5" cy="30" r="4.5" fill="#FFF" />
    <path fill="#00A656" d="M33 33h-9c0-5 4-9 9-9v9z" />
  </svg>
);

const GrammarlyLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <circle cx="24" cy="24" r="19" fill="#15C39A" />
    <path fill="#FFF" d="M24 16a8 8 0 107 4l-2.5 1.5A5 5 0 1124 19c1.5 0 2.8.6 3.6 1.5h-4v2.5H33V14h-2.5v2.5A8 8 0 0024 16z" />
  </svg>
);

const OneDriveLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#0078D4" d="M30 18a9 9 0 00-8.5 6 7 7 0 00-6.5 4.5A6 6 0 0016 40h17a8 8 0 008-8 8 8 0 00-11-14z" />
    <path fill="#28A8EA" d="M22 24a9 9 0 018-6c.7 0 1.4.1 2 .3A7 7 0 0021 16a7 7 0 00-6.8 5.5A7 7 0 0015 28.5c1.1-2.7 3.8-4.5 7-4.5z" />
  </svg>
);

const DropboxLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <path fill="#0061FF" d="M14 13.5l10 6.5-10 6.5-10-6.5 10-6.5zm20 0l10 6.5-10 6.5-10-6.5 10-6.5zM4 26.5l10 6.5 10-6.5-10-6.5-10 6.5zm40 0l-10-6.5-10 6.5 10 6.5 10-6.5zM24 34.5l-10-6.5-4 2.6 14 9.4 14-9.4-4-2.6-10 6.5z" />
  </svg>
);

const TeamsLogo = () => (
  <svg viewBox="0 0 48 48" className="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9">
    <rect width="48" height="48" rx="14" fill="#5059C9" />
    <path fill="#FFF" d="M20 18h12v13H20z" />
    <circle cx="30" cy="15" r="3" fill="#FFF" />
    <circle cx="18" cy="20" r="4" fill="#FFF" />
    <path fill="#FFF" d="M13 25h10v8H13z" />
  </svg>
);

// Database Stack SVGs
const CubeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
  </svg>
);

const PostgresLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#336791]" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 13.5c-.8.8-1.9 1.2-3.5 1.2-2.3 0-3.8-1.5-3.8-3.8V9.5c0-1.2.9-2.2 2.2-2.2h3.2c2.1 0 3.6 1.4 3.6 3.4 0 1.2-.6 2.1-1.5 2.7.9.6 1.4 1.5 1.4 2.7 0 .5-.1 1-.4 1.4zM10.2 9.2v2h2.8c.8 0 1.3-.5 1.3-1s-.5-1-1.3-1h-2.8zm0 3.8v2.2h3.1c.8 0 1.4-.5 1.4-1.1s-.6-1.1-1.4-1.1h-3.1z" />
  </svg>
);

const LayersLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#DC382D]" fill="currentColor">
    <path d="M12 2L3 6.5l9 4.5 9-4.5L12 2zm0 6L6.5 5.2 12 3.8l5.5 1.4L12 8zM3 9.5l9 4.5 9-4.5v3l-9 4.5-9-4.5v-3zm0 6l9 4.5 9-4.5v3L12 23l-9-4.5v-3z" />
  </svg>
);

const MongoLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-500" fill="currentColor">
    <path d="M12 2s-6 6.5-6 11c0 3.3 2.7 6 6 6s6-2.7 6-6c0-4.5-6-11-6-11zm0 15c-1.7 0-3-1.3-3-3 0-2.3 3-6.5 3-6.5s3 4.2 3 6.5c0 1.7-1.3 3-3 3z" />
  </svg>
);

const DoubleSlashLogo = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="3">
    <line x1="8" y1="4" x2="6" y2="20" />
    <line x1="16" y1="4" x2="14" y2="20" />
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
  // Col 0
  { id: "zoom", name: "Zoom", logo: ZoomLogo, colIndex: 0 },
  { id: "sharepoint", name: "SharePoint", logo: SharePointLogo, colIndex: 0 },
  { id: "zendesk", name: "Zendesk", logo: ZendeskLogo, colIndex: 0 },

  // Col 1
  { id: "gmail", name: "Gmail", logo: GmailLogo, colIndex: 1 },
  { id: "confluence", name: "Confluence", logo: ConfluenceLogo, colIndex: 1 },
  { id: "grammarly", name: "Grammarly", logo: GrammarlyLogo, colIndex: 1 },

  // Col 2
  { id: "outlook", name: "Outlook", logo: OutlookLogo, colIndex: 2 },
  { id: "notion", name: "Notion", logo: NotionLogo, colIndex: 2 },
  { id: "onedrive", name: "OneDrive", logo: OneDriveLogo, colIndex: 2 },

  // Col 3
  { id: "slack", name: "Slack", logo: SlackLogo, colIndex: 3 },
  { id: "gdocs", name: "Google Docs", logo: GoogleDocsLogo, colIndex: 3 },
  { id: "dropbox", name: "Dropbox", logo: DropboxLogo, colIndex: 3 },

  // Col 4
  { id: "gdrive", name: "Google Drive", logo: GoogleDriveLogo, colIndex: 4 },
  { id: "jira", name: "Jira", logo: JiraLogo, colIndex: 4 },
  { id: "teams", name: "MS Teams", logo: TeamsLogo, colIndex: 4 },
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
            <div title="Vector Stack" className="hover:scale-110 transition-transform cursor-pointer"><CubeLogo /></div>
            <div title="PostgreSQL" className="hover:scale-110 transition-transform cursor-pointer"><PostgresLogo /></div>
            <div title="Redis" className="hover:scale-110 transition-transform cursor-pointer"><LayersLogo /></div>
            <div title="MongoDB" className="hover:scale-110 transition-transform cursor-pointer"><MongoLogo /></div>
            <div title="Integrations" className="hover:scale-110 transition-transform cursor-pointer"><DoubleSlashLogo /></div>
          </div>
        </div>

      </div>

    </div>
  );
}

