"use client";

import React, { useState } from "react";
import { Sparkles, Activity, ShieldCheck, Zap, RefreshCw, Cpu, Database, CheckCircle2 } from "lucide-react";

// =========================================================
// OFFICIAL PIXEL-PERFECT BRAND SVGs (Simple Icons & LobeHub)
// =========================================================

// 1. Figma (Official 5-color F)
const FigmaLogo = () => (
  <svg viewBox="0 0 38 57" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9">
    <path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
    <path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z" />
    <path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" />
    <path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
    <path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
  </svg>
);

// 2. GitHub (Official Octocat Vector)
const GitHubLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#181717">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

// 3. OpenAI (Official Hexagonal Vortex Vector)
const OpenAILogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#10A37F">
    <path d="M22.282 9.821a6 6 0 0 0-.516-4.91a6.05 6.05 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a6 6 0 0 0-3.998 2.9a6.05 6.05 0 0 0 .743 7.097a5.98 5.98 0 0 0 .51 4.911a6.05 6.05 0 0 0 6.515 2.9A6 6 0 0 0 13.26 24a6.06 6.06 0 0 0 5.772-4.206a6 6 0 0 0 3.997-2.9a6.06 6.06 0 0 0-.747-7.073M13.26 22.43a4.48 4.48 0 0 1-2.876-1.04l.141-.081l4.779-2.758a.8.8 0 0 0 .392-.681v-6.737l2.02 1.168a.07.07 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494M3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085l4.783 2.759a.77.77 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646M2.34 7.896a4.5 4.5 0 0 1 2.366-1.973V11.6a.77.77 0 0 0 .388.677l5.815 3.354l-2.02 1.168a.08.08 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.08.08 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667m2.01-3.023l-.141-.085l-4.774-2.782a.78.78 0 0 0-.785 0L9.409 9.23V6.897a.07.07 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.8.8 0 0 0-.393.681zm1.097-2.365l2.602-1.5l2.607 1.5v2.999l-2.597 1.5l-2.607-1.5Z" />
  </svg>
);

// 4. Claude (Official Anthropic Spark Starburst Vector)
const ClaudeLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#D97757">
    <path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z" />
  </svg>
);

// 5. Vercel (Official Triangle Vector)
const VercelLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#000000">
    <path d="m12 1.608 12 20.784H0Z" />
  </svg>
);

// 6. Supabase (Official Emerald Lightning Vector)
const SupabaseLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#3FCF8E">
    <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z" />
  </svg>
);

// 7. Linear (Official Geometric Compass Curve)
const LinearLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#5E6AD2">
    <path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z" />
  </svg>
);

// 8. Notion (Official N Vector)
const NotionLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#000000">
    <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z" />
  </svg>
);

// 9. Framer (Official Blue Stacked F)
const FramerLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#0055FF">
    <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
  </svg>
);

// 10. Midjourney (Official Sailboat Contour Vector)
const MidjourneyLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#181717">
    <path fillRule="evenodd" clipRule="evenodd" d="M22.369 17.676c-1.387 1.259-3.17 2.378-5.332 3.417.044.03.086.057.13.083l.018.01.019.012c.216.123.42.184.641.184.222 0 .426-.061.642-.184l.018-.011.019-.011c.14-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.304-.174.612-.266.949-.266.337 0 .645.092.949.266l.023.014c.188.109.334.219.602.442l.178.148c.221.184.346.278.483.36l.028.017.018.01c.21.12.407.181.62.185h.022a.31.31 0 110 .618c-.337 0-.645-.092-.95-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.02-.014a5.356 5.356 0 01-.49-.377l-.159-.132a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.641.184l-.02.011-.018.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.95.266c-.337 0-.644-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.026-.017a4.881 4.881 0 01-.425-.325.308.308 0 01-.12-.1l-.098-.081a3.836 3.836 0 00-.483-.36l-.027-.017-.019-.01a1.256 1.256 0 00-.641-.185c-.222 0-.426.061-.642.184l-.018.011-.019.011c-.14.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.51.39l-.023.014-.022.014-.09.054A1.868 1.868 0 0112 22c-.337 0-.645-.092-.949-.266a3.137 3.137 0 01-.09-.054l-.022-.014-.022-.013-.021-.014a5.356 5.356 0 01-.49-.377l-.158-.132a3.836 3.836 0 00-.483-.36l-.028-.017-.018-.01a1.256 1.256 0 00-.642-.185c-.221 0-.425.061-.641.184l-.019.011-.018.011c-.141.084-.266.178-.492.366l-.158.132a5.125 5.125 0 01-.511.39l-.022.014-.022.014-.09.054a1.868 1.868 0 01-.986.264c-.746-.09-1.319-.38-1.89-.866l-.035-.03c-.047-.041-.118-.106-.192-.174l-.196-.181-.107-.1-.011-.01a1.531 1.531 0 00-.336-.253.313.313 0 00-.095-.03h-.005c-.119.022-.238.059-.361.11a.308.308 0 01-.077.061l-.008.005a.309.309 0 01-.126.034 5.66 5.66 0 00-.774.518l-.416.324-.055.043a6.542 6.542 0 01-.324.236c-.305.207-.552.315-.8.315a.31.31 0 01-.01-.618h.01c.09 0 .235-.062.438-.198l.04-.027c.077-.054.163-.117.27-.199l.385-.301.06-.047c.268-.206.506-.373.73-.505l-.633-1.21a.309.309 0 01.254-.451l20.287-1.305a.309.309 0 01.228.537zm-1.118.14L2.369 19.03l.423.809c.128-.045.256-.078.388-.1a.31.31 0 01.052-.005c.132 0 .26.032.386.093.153.073.294.179.483.35l.016.015.092.086.144.134.097.089c.065.06.125.114.16.144.485.418.948.658 1.554.736h.011a1.25 1.25 0 00.6-.172l.021-.011.019-.011.018-.011c.141-.084.266-.178.492-.366l.178-.148c.279-.232.426-.342.625-.456.305-.174.612-.266.95-.266.336 0 .644.092.948.266l.023.014c.188.109.335.219.603.442l.177.148c.222.184.346.278.484.36l.027.017.019.01c.215.124.42.185.641.185.222 0 .426-.061.641-.184l.019-.011.018-.011c.141-.084.267-.178.493-.366l.177-.148c.28-.232.427-.342.626-.456.304-.174.612-.266.949-.266.337 0 .644.092.949.266l.025.015c.187.109.334.22.603.443 1.867-.878 3.448-1.811 4.73-2.832l.02-.016zM3.653 2.026C6.073 3.06 8.69 4.941 10.8 7.258c2.46 2.7 4.109 5.828 4.637 9.149a.31.31 0 01-.421.335c-2.348-.945-4.54-1.258-6.59-1.02-1.739.2-3.337.792-4.816 1.703-.294.182-.62-.182-.405-.454 1.856-2.355 2.581-4.99 2.343-7.794-.195-2.292-1.031-4.61-2.284-6.709a.31.31 0 01.388-.442zM10.04 4.45c1.778.543 3.892 2.102 5.782 4.243 1.984 2.248 3.552 4.934 4.347 7.582a.31.31 0 01-.401.38l-.022-.01-.386-.154a10.594 10.594 0 00-.291-.112l-.016-.006c-.68-.247-1.199-.291-1.944-.101a.31.31 0 01-.375-.218C15.378 11.123 13.073 7.276 9.775 5c-.291-.201-.072-.653.266-.55zM4.273 2.996l.008.015c1.028 1.94 1.708 4.031 1.885 6.113.213 2.513-.31 4.906-1.673 7.092l-.02.031.003-.001c1.198-.581 2.47-.969 3.825-1.132l.055-.006c1.981-.23 4.083.029 6.309.837l.066.025-.007-.039c-.593-2.95-2.108-5.737-4.31-8.179l-.07-.078c-1.785-1.96-3.944-3.6-6.014-4.65l-.057-.028zm7.92 3.238l.048.048c2.237 2.295 3.885 5.431 4.974 9.191l.038.132.022-.004c.71-.133 1.284-.063 1.963.18l.027.01.066.024.046.018-.025-.073c-.811-2.307-2.208-4.62-3.936-6.594l-.058-.065c-1.02-1.155-2.103-2.132-3.15-2.856l-.015-.011z" />
  </svg>
);

// 11. Hugging Face (Official Multi-Color 🤗 Vector)
const HuggingFaceLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9">
    <path d="M2.25 11.535c0-3.407 1.847-6.554 4.844-8.258a9.822 9.822 0 019.687 0c2.997 1.704 4.844 4.851 4.844 8.258 0 5.266-4.337 9.535-9.687 9.535S2.25 16.8 2.25 11.535z" fill="#FF9D0B" />
    <path d="M11.938 20.086c4.797 0 8.687-3.829 8.687-8.551 0-4.722-3.89-8.55-8.687-8.55-4.798 0-8.688 3.828-8.688 8.55 0 4.722 3.89 8.55 8.688 8.55z" fill="#FFD21E" />
    <path d="M11.875 15.113c2.457 0 3.25-2.156 3.25-3.263 0-.576-.393-.394-1.023-.089-.582.283-1.365.675-2.224.675-1.798 0-3.25-1.693-3.25-.586 0 1.107.79 3.263 3.25 3.263h-.003z" fill="#FF323D" />
    <path d="M14.76 9.21c.32.108.445.753.767.585.447-.233.707-.708.659-1.204a1.235 1.235 0 00-.879-1.059 1.262 1.262 0 00-1.33.394c-.322.384-.377.92-.14 1.36.153.283.638-.177.925-.079l-.002.003zm-5.887 0c-.32.108-.448.753-.768.585a1.226 1.226 0 01-.658-1.204c.048-.495.395-.913.878-1.059a1.262 1.262 0 011.33.394c.322.384.377.92.14 1.36-.152.283-.64-.177-.925-.079l.003.003z" fill="#3A3B45" />
    <path d="M9.993 14.553a2.166 2.166 0 011.325-1.106c.07-.02.144.06.219.171l.192.306c.069.1.139.175.209.175.074 0 .15-.074.223-.172l.205-.302c.08-.11.157-.188.234-.165.537.168.986.536 1.25 1.026.932-.724 1.275-1.905 1.275-2.633 0-.508-.306-.426-.81-.19l-.616.296c-.52.24-1.148.48-1.824.48-.676 0-1.302-.24-1.823-.48l-.589-.283c-.52-.248-.838-.342-.838.177 0 .703.32 1.831 1.187 2.56l.18.14z" fill="#3A3B45" />
    <path d="M17.812 10.366a.806.806 0 00.813-.8c0-.441-.364-.8-.813-.8a.806.806 0 00-.812.8c0 .442.364.8.812.8zm-11.624 0a.806.806 0 00.812-.8c0-.441-.364-.8-.812-.8a.806.806 0 00-.813.8c0 .442.364.8.813.8z" fill="#3A3B45" />
    <path d="M4.515 13.073c-.405 0-.765.162-1.017.46a1.455 1.455 0 00-.333.925 1.801 1.801 0 00-.485-.074c-.387 0-.737.146-.985.409a1.41 1.41 0 00-.2 1.722 1.302 1.302 0 00-.447.694c-.06.222-.12.69.2 1.166a1.267 1.267 0 00-.093 1.236c.238.533.81.958 1.89 1.405l.24.096c.768.3 1.473.492 1.478.494.89.243 1.808.375 2.732.394 1.465 0 2.513-.443 3.115-1.314.93-1.342.842-2.575-.274-3.763l-.151-.154c-.692-.684-1.155-1.69-1.25-1.912-.195-.655-.71-1.383-1.562-1.383-.46.007-.889.233-1.15.605-.25-.31-.495-.553-.715-.694a1.87 1.87 0 00-.993-.312zm14.97 0c.405 0 .767.162 1.017.46.216.262.333.588.333.925.158-.047.322-.071.487-.074.388 0 .738.146.985.409a1.41 1.41 0 01.2 1.722c.22.178.377.422.445.694.06.222.12.69-.2 1.166.244.37.279.836.093 1.236-.238.533-.81.958-1.889 1.405l-.239.096c-.77.3-1.475.492-1.48.494-.89.243-1.808.375-2.732.394-1.465 0-2.513-.443-3.115-1.314-.93-1.342-.842-2.575.274-3.763l.151-.154c.695-.684 1.157-1.69 1.252-1.912.195-.655.708-1.383 1.56-1.383.46.007.889.233 1.15.605.25-.31.495-.553.718-.694.244-.162.523-.265.814-.3l.176-.012z" fill="#FF9D0B" />
    <path d="M9.785 20.132c.688-.994.638-1.74-.305-2.667-.945-.928-1.495-2.288-1.495-2.288s-.205-.788-.672-.714c-.468.074-.81 1.25.17 1.971.977.721-.195 1.21-.573.534-.375-.677-1.405-2.416-1.94-2.751-.532-.332-.907-.148-.782.541.125.687 2.357 2.35 2.14 2.707-.218.362-.983-.42-.983-.42S2.953 14.9 2.43 15.46c-.52.558.398 1.026 1.7 1.803 1.308.778 1.41.985 1.225 1.28-.187.295-3.07-2.1-3.34-1.083-.27 1.011 2.943 1.304 2.745 2.006-.2.7-2.265-1.324-2.685-.537-.425.79 2.913 1.718 2.94 1.725 1.075.276 3.813.859 4.77-.522zm4.432 0c-.687-.994-.64-1.74.305-2.667.943-.928 1.493-2.288 1.493-2.288s.205-.788.675-.714c.465.074.807 1.25-.17 1.971-.98.721.195 1.21.57.534.377-.677 1.407-2.416 1.94-2.751.532-.332.91-.148.782.541-.125.687-2.355 2.35-2.137 2.707.215.362.98-.42.98-.42S21.05 14.9 21.57 15.46c.52.558-.395 1.026-1.7 1.803-1.308.778-1.408.985-1.225 1.28.187.295 3.07-2.1 3.34-1.083.27 1.011-2.94 1.304-2.743 2.006.2.7 2.263-1.324 2.685-.537.423.79-2.912 1.718-2.94 1.725-1.077.276-3.815.859-4.77-.522z" fill="#FFD21E" />
  </svg>
);

// 12. Perplexity (Official Teal Asterism Vector)
const PerplexityLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#1FB8CD">
    <path d="M22.3977 7.0896h-2.3106V.0676l-7.5094 6.3542V.1577h-1.1554v6.1966L4.4904 0v7.0896H1.6023v10.3976h2.8882V24l6.932-6.3591v6.2005h1.1554v-6.0469l6.9318 6.1807v-6.4879h2.8882V7.0896zm-3.4657-4.531v4.531h-5.355l5.355-4.531zm-13.2862.0676 4.8691 4.4634H5.6458V2.6262zM2.7576 16.332V8.245h7.8476l-6.1149 6.1147v1.9723H2.7576zm2.8882 5.0404v-3.8852h.0001v-2.6488l5.7763-5.7764v7.0111l-5.7764 5.2993zm12.7086.0248-5.7766-5.1509V9.0618l5.7766 5.7766v6.5588zm2.8882-5.0652h-1.733v-1.9723L13.3948 8.245h7.8478v8.087z" />
  </svg>
);

// 13. Raycast (Official Ruby Hex Geometric Vector)
const RaycastLogo = () => (
  <svg viewBox="0 0 28 28" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 18.079V21L0 14L1.46 12.54L7 18.081V18.079ZM9.921 21H7L14 28L15.46 26.54L9.921 21ZM26.535 15.462L27.996 14L13.996 0L12.538 1.466L18.077 7.004H14.73L10.864 3.146L9.404 4.606L11.809 7.01H10.129V17.876H20.994V16.196L23.399 18.6L24.859 17.14L20.994 13.274V9.927L26.535 15.462ZM7.73 6.276L6.265 7.738L7.833 9.304L9.294 7.844L7.73 6.276ZM20.162 18.708L18.702 20.17L20.268 21.738L21.73 20.276L20.162 18.708ZM4.596 9.41L3.134 10.872L7 14.738V11.815L4.596 9.41ZM16.192 21.006H13.268L17.134 24.872L18.596 23.41L16.192 21.006Z"
      fill="#FF6363"
    />
  </svg>
);

// 14. Slack (Official 4-Color Hash Vector)
const SlackLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9">
    <path fill="#36C5F0" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" />
    <path fill="#36C5F0" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
    <path fill="#2EB67D" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.527 2.527 0 0 1 2.521 2.522v2.52H8.834z" />
    <path fill="#2EB67D" d="M8.834 6.313a2.527 2.527 0 0 1 2.521 2.521 2.527 2.527 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
    <path fill="#ECB22E" d="M18.958 8.834a2.528 2.528 0 0 1 2.52-2.521A2.528 2.528 0 0 1 24 8.834a2.527 2.527 0 0 1-2.522 2.521h-2.52V8.834z" />
    <path fill="#ECB22E" d="M17.687 8.834a2.527 2.527 0 0 1-2.521 2.521 2.527 2.527 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.166 0a2.528 2.528 0 0 1 2.521 2.522v6.312z" />
    <path fill="#E01E5A" d="M15.166 18.958a2.528 2.528 0 0 1 2.521 2.52A2.528 2.528 0 0 1 15.166 24a2.527 2.527 0 0 1-2.521-2.522v-2.52h2.521z" />
    <path fill="#E01E5A" d="M15.166 17.687a2.527 2.527 0 0 1-2.521-2.521 2.527 2.527 0 0 1 2.521-2.521h6.312A2.528 2.528 0 0 1 24 15.166a2.528 2.528 0 0 1-2.522 2.521h-6.312z" />
  </svg>
);

// 15. Discord (Official Blurple Controller Vector)
const DiscordLogo = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9" fill="#5865F2">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
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

// =========================================================
// DATA CONFIGURATION
// =========================================================

interface AppItem {
  id: string;
  name: string;
  tag: string;
  glow: string;
  logo: React.ComponentType;
  colIndex: number;
}

const apps: AppItem[] = [
  // Col 0 - Core Design & Creative
  { id: "figma", name: "Figma", tag: "Vector & UI Design", glow: "rgba(242, 78, 30, 0.25)", logo: FigmaLogo, colIndex: 0 },
  { id: "framer", name: "Framer", tag: "Interactive Production", glow: "rgba(0, 85, 255, 0.25)", logo: FramerLogo, colIndex: 0 },
  { id: "midjourney", name: "Midjourney", tag: "Generative Media", glow: "rgba(45, 55, 72, 0.25)", logo: MidjourneyLogo, colIndex: 0 },

  // Col 1 - Leading AI Models
  { id: "openai", name: "OpenAI GPT-4o", tag: "Reasoning & Vision", glow: "rgba(16, 163, 127, 0.25)", logo: OpenAILogo, colIndex: 1 },
  { id: "claude", name: "Claude 3.7", tag: "Artifacts & Long Context", glow: "rgba(217, 119, 6, 0.25)", logo: ClaudeLogo, colIndex: 1 },
  { id: "perplexity", name: "Perplexity", tag: "Real-time Web Search", glow: "rgba(32, 178, 170, 0.25)", logo: PerplexityLogo, colIndex: 1 },

  // Col 2 - Developer Infrastructure
  { id: "github", name: "GitHub", tag: "Code Repos & Actions", glow: "rgba(24, 23, 23, 0.25)", logo: GitHubLogo, colIndex: 2 },
  { id: "vercel", name: "Vercel", tag: "Edge Cloud Compute", glow: "rgba(0, 0, 0, 0.25)", logo: VercelLogo, colIndex: 2 },
  { id: "supabase", name: "Supabase", tag: "Postgres & Auth", glow: "rgba(62, 207, 142, 0.25)", logo: SupabaseLogo, colIndex: 2 },

  // Col 3 - Productivity & Ops
  { id: "notion", name: "Notion", tag: "Workspace & Wiki", glow: "rgba(0, 0, 0, 0.25)", logo: NotionLogo, colIndex: 3 },
  { id: "linear", name: "Linear", tag: "High-Speed Issue Sync", glow: "rgba(94, 106, 210, 0.25)", logo: LinearLogo, colIndex: 3 },
  { id: "raycast", name: "Raycast", tag: "Command Bar Extensions", glow: "rgba(255, 99, 99, 0.25)", logo: RaycastLogo, colIndex: 3 },

  // Col 4 - Community & Open AI
  { id: "huggingface", name: "Hugging Face", tag: "Open Source Weights", glow: "rgba(255, 162, 0, 0.25)", logo: HuggingFaceLogo, colIndex: 4 },
  { id: "slack", name: "Slack", tag: "Team Notifications", glow: "rgba(224, 30, 90, 0.25)", logo: SlackLogo, colIndex: 4 },
  { id: "discord", name: "Discord", tag: "Developer Community", glow: "rgba(88, 101, 242, 0.25)", logo: DiscordLogo, colIndex: 4 },
];

const categories = [
  { id: "all", label: "All Connectors" },
  { id: "col-0", label: "Design & UI", colIndex: 0 },
  { id: "col-1", label: "Frontier AI", colIndex: 1 },
  { id: "col-2", label: "Dev & Cloud", colIndex: 2 },
  { id: "col-3", label: "Workspaces", colIndex: 3 },
  { id: "col-4", label: "Community", colIndex: 4 },
];

export default function AnimatedConnect01() {
  const [hoveredApp, setHoveredApp] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const activeApp = apps.find((a) => a.id === hoveredApp);

  const cols = [0, 1, 2, 3, 4].map((colIdx) =>
    apps.filter((app) => app.colIndex === colIdx)
  );

  return (
    <section id="integrations" className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 my-16 font-sans">
      
      {/* Outer Card with Glassmorphic Texture & Glow */}
      <div className="relative rounded-[32px] sm:rounded-[36px] overflow-hidden bg-gradient-to-b from-white via-[#fafbfe] to-[#f4f6fb] border border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.06)] p-6 sm:p-12 md:p-16 flex flex-col items-center">
        
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[550px] h-[280px] bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        {/* Subtle Dot Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-4 sm:mb-5 shadow-2xs backdrop-blur-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="tracking-wide uppercase text-[11px] font-bold">Nexio Creative & AI Pipeline</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3.5 leading-tight">
            Connect 15+ Modern Tools into Your Live Knowledge Flow
          </h2>

          <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Seamlessly route design tokens, Claude prompts, GitHub commits, and Notion databases directly into real-time vector embeddings and smart search indexes.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-6">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/70"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Flow Container */}
        <div className="w-full max-w-3xl flex flex-col items-center relative pb-2 px-1 sm:px-4 z-10">
          
          {/* SVG Connecting Flow Lines with Glowing Gradients */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 600 390"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
            >
              <defs>
                <linearGradient id="beamGradient0" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="beamGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="beamGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="beamGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ec4899" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
                </linearGradient>

                <linearGradient id="beamGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="1" />
                </linearGradient>

                {/* Glow Filters */}
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                <style>{`
                  @keyframes dashMove {
                    to { stroke-dashoffset: -48; }
                  }
                  @keyframes pulseMove {
                    0% { offset-distance: 0%; opacity: 0; transform: scale(0.6); }
                    15% { opacity: 1; transform: scale(1.1); }
                    85% { opacity: 1; transform: scale(1); }
                    100% { offset-distance: 100%; opacity: 0; transform: scale(0.6); }
                  }
                  .flow-beam-dash {
                    animation: dashMove 2.2s linear infinite;
                  }
                  .pulse-node-0 {
                    offset-path: path('M 60 40 L 60 230 C 60 290, 300 290, 300 340');
                    animation: pulseMove 3s ease-in-out infinite;
                  }
                  .pulse-node-1 {
                    offset-path: path('M 180 40 L 180 230 C 180 295, 300 295, 300 340');
                    animation: pulseMove 2.6s ease-in-out infinite 0.4s;
                  }
                  .pulse-node-2 {
                    offset-path: path('M 300 40 L 300 340');
                    animation: pulseMove 2.2s ease-in-out infinite 0.8s;
                  }
                  .pulse-node-3 {
                    offset-path: path('M 420 40 L 420 230 C 420 295, 300 295, 300 340');
                    animation: pulseMove 2.7s ease-in-out infinite 0.2s;
                  }
                  .pulse-node-4 {
                    offset-path: path('M 540 40 L 540 230 C 540 290, 300 290, 300 340');
                    animation: pulseMove 3.1s ease-in-out infinite 0.6s;
                  }
                `}</style>
              </defs>

              {[
                { id: 0, d: "M 60 40 L 60 230 C 60 290, 300 290, 300 340", grad: "url(#beamGradient0)", pulseClass: "pulse-node-0", color: "#f43f5e" },
                { id: 1, d: "M 180 40 L 180 230 C 180 295, 300 295, 300 340", grad: "url(#beamGradient1)", pulseClass: "pulse-node-1", color: "#10b981" },
                { id: 2, d: "M 300 40 L 300 340", grad: "url(#beamGradient2)", pulseClass: "pulse-node-2", color: "#3b82f6" },
                { id: 3, d: "M 420 40 L 420 230 C 420 295, 300 295, 300 340", grad: "url(#beamGradient3)", pulseClass: "pulse-node-3", color: "#a855f7" },
                { id: 4, d: "M 540 40 L 540 230 C 540 290, 300 290, 300 340", grad: "url(#beamGradient4)", pulseClass: "pulse-node-4", color: "#f59e0b" },
              ].map((pathItem) => {
                const isHovered = hoveredApp
                  ? apps.find((a) => a.id === hoveredApp)?.colIndex === pathItem.id
                  : false;
                
                const isCatMatched = activeCategory === "all" || activeCategory === `col-${pathItem.id}`;

                return (
                  <g key={pathItem.id} opacity={isCatMatched ? 1 : 0.25} style={{ transition: "opacity 0.3s ease" }}>
                    {/* Base Guide Track */}
                    <path
                      d={pathItem.d}
                      stroke="#e2e8f0"
                      strokeWidth={isHovered ? "2.5" : "1.5"}
                      strokeLinecap="round"
                      fill="none"
                    />

                    {/* Gradient Active Beam with Moving Dashes */}
                    <path
                      d={pathItem.d}
                      stroke={pathItem.grad}
                      strokeWidth={isHovered ? "3.5" : "2"}
                      strokeDasharray="8 12"
                      strokeLinecap="round"
                      fill="none"
                      className="flow-beam-dash"
                      filter={isHovered ? "url(#glowEffect)" : undefined}
                    />

                    {/* Pulsing Light Energy Particle */}
                    <circle
                      r={isHovered ? "5" : "3.5"}
                      fill={pathItem.color}
                      className={pathItem.pulseClass}
                      style={{ filter: `drop-shadow(0 0 6px ${pathItem.color})` }}
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Top 5x3 Interactive App Cards Grid */}
          <div className="grid grid-cols-5 gap-2.5 sm:gap-4 md:gap-5 w-full z-10 justify-items-center mb-8 sm:mb-12">
            {cols.map((colApps, colIdx) => {
              const isColActive = activeCategory === "all" || activeCategory === `col-${colIdx}`;
              return (
                <div
                  key={colIdx}
                  className={`flex flex-col gap-2.5 sm:gap-4 md:gap-5 items-center transition-opacity duration-300 ${
                    isColActive ? "opacity-100" : "opacity-35"
                  }`}
                >
                  {colApps.map((app) => {
                    const IconComponent = app.logo;
                    const isHovered = hoveredApp === app.id;

                    return (
                      <div
                        key={app.id}
                        onMouseEnter={() => setHoveredApp(app.id)}
                        onMouseLeave={() => setHoveredApp(null)}
                        style={{
                          transform: isHovered ? "translateY(-4px) scale(1.06)" : "none",
                          boxShadow: isHovered
                            ? `0 14px 28px -6px ${app.glow}, 0 0 0 2px rgba(99, 102, 241, 0.4)`
                            : "0 2px 8px rgba(0,0,0,0.04)",
                          transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        }}
                        className={`group relative w-[54px] h-[54px] sm:w-[76px] sm:h-[76px] md:w-[86px] md:h-[86px] rounded-[18px] sm:rounded-[24px] md:rounded-[26px] border flex items-center justify-center p-2 sm:p-3 cursor-pointer select-none ${
                          isHovered
                            ? "bg-white border-indigo-300"
                            : "bg-white/95 border-slate-200/90 hover:bg-white hover:border-slate-300"
                        }`}
                      >
                        {/* Icon */}
                        <div className="flex items-center justify-center w-full h-full transition-transform duration-200 group-hover:scale-105">
                          <IconComponent />
                        </div>

                        {/* Floating Micro Tooltip on Hover */}
                        {isHovered && (
                          <div className="absolute -top-10 sm:-top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-900 text-white text-[11px] font-medium rounded-lg shadow-lg whitespace-nowrap z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150 flex items-center gap-1.5 border border-slate-800">
                            <span className="font-bold text-white">{app.name}</span>
                            <span className="text-slate-400 text-[10px]">• {app.tag}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Central Active App Feedback Pill (when hovered) */}
          <div className="h-6 mb-2 flex items-center justify-center">
            {activeApp ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold animate-in fade-in duration-150">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                Pipeline Active: <strong className="text-slate-900">{activeApp.name}</strong> ({activeApp.tag}) streaming to vectors
              </span>
            ) : (
              <span className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-wide">
                Hover any tool above to inspect live pipeline route
              </span>
            )}
          </div>

          {/* Bottom Destination Hub: "Nexio Neural Vector Engine" */}
          <div className="w-full max-w-xl z-10 flex flex-col items-center pt-2">
            
            {/* The Main Hub Console Box */}
            <div className="w-full rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-[0_12px_32px_rgba(15,23,42,0.08)] p-3.5 sm:p-5 flex flex-col items-center relative overflow-hidden">
              
              {/* Subtle accent line on top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

              {/* Engine Status Top Bar */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-slate-100 text-[11px] sm:text-xs mb-3.5 px-1">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-slate-800">Nexio Vector & Retrieval Hub</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                    Live Syncing • 99.98%
                  </span>
                </div>
              </div>

              {/* Destination DB Node Pills */}
              <div className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                
                {/* Pinecone */}
                <div
                  title="Pinecone Serverless Vector Database"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
                >
                  <PineconeLogo />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-900">Pinecone</span>
                  <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">1536-dim</span>
                </div>

                {/* PostgreSQL */}
                <div
                  title="PostgreSQL with pgvector extension"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200/80 hover:border-blue-300 transition-all cursor-pointer group shadow-2xs"
                >
                  <PostgresElephantLogo />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-blue-900">PostgreSQL</span>
                  <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">pgvector</span>
                </div>

                {/* Redis */}
                <div
                  title="Redis In-Memory Semantic Cache"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-rose-50/70 border border-slate-200/80 hover:border-rose-300 transition-all cursor-pointer group shadow-2xs"
                >
                  <RedisLayersLogo />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-rose-900">Redis</span>
                  <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">Cache</span>
                </div>

                {/* MongoDB */}
                <div
                  title="MongoDB Atlas Vector Search"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 transition-all cursor-pointer group shadow-2xs"
                >
                  <MongoLeafLogo />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-900">MongoDB</span>
                  <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">Atlas</span>
                </div>

                {/* ChromaDB */}
                <div
                  title="ChromaDB Local Open Source Embeddings"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-300 transition-all cursor-pointer group shadow-2xs"
                >
                  <ChromaDBLogo />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-900">ChromaDB</span>
                  <span className="hidden sm:inline-block text-[10px] text-slate-400 font-mono">Edge</span>
                </div>

              </div>

              {/* Bottom Feature Badges */}
              <div className="w-full flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Sub-10ms RAG Retrieval</span>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
                  <span>AES-256 E2E Encryption</span>
                </div>
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Real-time Webhook Sync</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
