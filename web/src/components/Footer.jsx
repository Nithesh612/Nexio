import React from 'react'

export default function Footer({ onNavigate }) {
  const handleCategoryClick = (category) => {
    if (onNavigate) {
      if (category === 'ai') onNavigate('ai-tools')
      else onNavigate('design')
    } else {
      window.location.hash = category === 'ai' ? '#ai-tools' : '#design'
    }
  }

  return (
    <footer className="w-full bg-[#0b0f19] text-gray-400 pt-16 pb-10 border-t border-gray-800/80 font-sans">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 sm:gap-8 mb-14">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div 
              className="flex items-center gap-2.5 text-white font-black text-xl mb-3.5 tracking-tight cursor-pointer select-none"
              onClick={() => onNavigate && onNavigate('landing')}
            >
              <div className="w-8 h-8 rounded-lg bg-[#3b82f6] flex items-center justify-center text-white text-sm font-black shadow-xs">
                N
              </div>
              <span className="font-extrabold tracking-tight">NEXIO DESIGN</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
              The modern directory for UI/UX designers, frontend engineers, and creative builders. Curated with precision.
            </p>
            <div className="flex items-center gap-2.5">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors text-xs font-bold no-underline">
                𝕏
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors text-xs font-bold no-underline">
                GH
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors text-xs font-bold no-underline">
                DC
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors text-xs font-bold no-underline">
                IN
              </a>
            </div>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm list-none p-0 m-0">
              <li>
                <button type="button" onClick={() => handleCategoryClick('3d')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-gray-400">
                  3D Illustrations
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick('icons')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-gray-400">
                  Vector Icons
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick('fonts')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-gray-400">
                  Typography
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick('ai')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-gray-400">
                  AI Generative
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleCategoryClick('uikits')} className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-gray-400">
                  Figma UI Kits
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm list-none p-0 m-0">
              <li>
                <a href="#submit" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('design') }} className="hover:text-white transition-colors text-gray-400 no-underline">
                  Submit a Tool
                </a>
              </li>
              <li>
                <a href="#advertise" className="hover:text-white transition-colors text-gray-400 no-underline">
                  Advertise With Us
                </a>
              </li>
              <li>
                <a href="#newsletter" className="hover:text-white transition-colors text-gray-400 no-underline">
                  Weekly Newsletter
                </a>
              </li>
              <li>
                <a href="#changelog" className="hover:text-white transition-colors text-gray-400 no-underline">
                  Changelog
                </a>
              </li>
              <li>
                <a href="#api" className="hover:text-white transition-colors text-gray-400 no-underline">
                  API & Feed
                </a>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm list-none p-0 m-0">
              <li>
                <a href="#about" className="hover:text-white transition-colors text-gray-400 no-underline">
                  About Nexio
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors text-gray-400 no-underline">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors text-gray-400 no-underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#brand" className="hover:text-white transition-colors text-gray-400 no-underline">
                  Brand Guidelines
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors text-gray-400 no-underline">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright and legal links */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p className="m-0">© {new Date().getFullYear()} Nexio Design Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms</span>
            <span className="hover:text-gray-400 cursor-pointer">Security</span>
            <button 
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-white text-gray-400 cursor-pointer bg-transparent border-none p-0"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
