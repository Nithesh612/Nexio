import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Sparkles, Compass, Zap, ExternalLink } from "lucide-react";

// Safe classnames merger without requiring clsx/tailwind-merge
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const STAGGER = 0.035;

export const TextRoll = ({ children, className = "", center = false }) => {
  const text = typeof children === "string" ? children : String(children || "");

  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden select-none cursor-pointer", className)}
      style={{
        lineHeight: 0.85,
      }}
    >
      <div>
        {text.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (text.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1],
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {text.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (text.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1],
                delay,
              }}
              className="inline-block text-rose-500"
              key={i}
            >
              {l === " " ? "\u00A0" : l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};

export const Skiper58 = ({ onNavigate, onAddLink }) => {
  const navigationItems = [
    {
      name: "Dashboard",
      action: () => onNavigate?.("app"),
      tag: "LINK ARCHITECTURE [01]",
      desc: "Manage and categorize all your personal bookmarks."
    },
    {
      name: "AI Tools",
      action: () => onNavigate?.("ai-tools"),
      tag: "INTELLIGENCE [02]",
      desc: "Discover LLMs, video generators, and AI agents."
    },
    {
      name: "Design Vault",
      action: () => onNavigate?.("design"),
      tag: "CREATIVE [03]",
      desc: "Typography, UI kits, design systems, and animations."
    },
    {
      name: "Quick Assets",
      action: () => {
        const el = document.getElementById("quick-assets") || document.getElementById("featured-quick-assets");
        el?.scrollIntoView({ behavior: "smooth" });
      },
      tag: "CURATED [04]",
      desc: "Plugins, SVG vectors, mockup templates, and components."
    },
    {
      name: "Google Hub",
      action: () => {
        const el = document.getElementById("google-ecosystem");
        el?.scrollIntoView({ behavior: "smooth" });
      },
      tag: "ECOSYSTEM [05]",
      desc: "Gemini models, Firebase cloud, and Material 3 design."
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-8 md:py-12 flex flex-col items-center justify-center bg-gradient-to-b from-[#090d16] via-[#0f172a] to-[#090d16] text-white">
      {/* Glow Effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[260px] bg-gradient-to-tr from-rose-500/20 via-indigo-500/20 to-cyan-400/20 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-semibold tracking-wider text-rose-300 uppercase mb-5 shadow-inner">
          <Sparkles size={13} className="text-rose-400 animate-pulse" />
          <span>Next-Gen Link Architecture</span>
        </div>

        {/* Skiper58 Interactive Typography Menu */}
        <div className="w-full my-1 flex flex-col items-center justify-center">
          <ul className="flex w-full flex-col items-center justify-center gap-2.5 md:gap-3.5 py-2">
            {navigationItems.map((item, index) => (
              <li
                key={index}
                onClick={item.action}
                className="group relative flex cursor-pointer flex-col items-center justify-center transition-transform hover:scale-[1.025] active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <TextRoll
                    center
                    className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-slate-100 group-hover:text-rose-400 transition-colors"
                  >
                    {item.name}
                  </TextRoll>
                  <span className="hidden sm:inline-block opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-rose-400 -translate-x-2 group-hover:translate-x-0">
                    <ArrowRight size={24} />
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                  <span className="text-[10.5px] font-bold tracking-widest text-rose-400/90 uppercase">{item.tag}</span>
                  <span className="text-xs text-slate-400 hidden md:inline">— {item.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom CTA Row */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5 z-20">
          <button
            type="button"
            onClick={onAddLink}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-[0_0_24px_rgba(244,63,94,0.35)] transition-all hover:scale-105 active:scale-95"
          >
            <span>Save Link Now</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("use-cases");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold text-xs backdrop-blur-md transition-all"
          >
            <span>Explore All Links</span>
            <Compass size={15} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default function Hero({ onNavigate, onAddLink }) {
  return <Skiper58 onNavigate={onNavigate} onAddLink={onAddLink} />;
}
