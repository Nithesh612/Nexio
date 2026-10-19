import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Zap,
  ExternalLink,
  Plus,
  LayoutGrid,
  Sparkles,
  Palette,
  Edit3,
  X,
  Command,
  ArrowRight
} from 'lucide-react';

export default function CommandPalette({
  isOpen,
  onClose,
  items = [],
  onNavigate,
  onAddLink,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Actions menu
  const actions = [
    {
      id: 'action-add',
      title: 'Add New Bookmark / Asset',
      desc: 'Save a new URL or creative tool to your library',
      category: 'Actions',
      icon: Plus,
      action: () => {
        onClose();
        onAddLink?.();
      },
    },
    {
      id: 'action-ai',
      title: 'Explore AI Tools Hub',
      desc: 'Discover cutting-edge LLMs, video generators, and agents',
      category: 'Navigation',
      icon: Sparkles,
      action: () => {
        onClose();
        onNavigate?.('ai-tools');
      },
    },
    {
      id: 'action-design',
      title: 'Open Design Vault',
      desc: 'Browse UI components, palettes, and typography',
      category: 'Navigation',
      icon: Palette,
      action: () => {
        onClose();
        onNavigate?.('design');
      },
    },
    {
      id: 'action-editing',
      title: 'Launch Editing Studio',
      desc: 'Creative workspace for video, audio, and asset editing',
      category: 'Navigation',
      icon: Edit3,
      action: () => {
        onClose();
        onNavigate?.('editing');
      },
    },
    {
      id: 'action-dashboard',
      title: 'Open Personal Dashboard',
      desc: 'Organize and manage your private link collections',
      category: 'Navigation',
      icon: LayoutGrid,
      action: () => {
        onClose();
        onNavigate?.('app');
      },
    },
  ];

  // Filter links & actions
  const cleanQuery = query.toLowerCase().trim();

  const filteredLinks = items
    .filter((item) => {
      if (!cleanQuery) return true;
      const title = (item.title || item.name || '').toLowerCase();
      const url = (item.url || '').toLowerCase();
      const desc = (item.description || item.desc || '').toLowerCase();
      const category = (item.category || item.type || '').toLowerCase();
      return (
        title.includes(cleanQuery) ||
        url.includes(cleanQuery) ||
        desc.includes(cleanQuery) ||
        category.includes(cleanQuery)
      );
    })
    .slice(0, 10);

  const filteredActions = actions.filter((act) => {
    if (!cleanQuery) return true;
    return (
      act.title.toLowerCase().includes(cleanQuery) ||
      act.desc.toLowerCase().includes(cleanQuery)
    );
  });

  const combinedResults = [...filteredActions, ...filteredLinks];

  // Handle arrow key navigation & Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedResults.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + combinedResults.length) % Math.max(1, combinedResults.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = combinedResults[selectedIndex];
        if (activeItem) {
          if (activeItem.action) {
            activeItem.action();
          } else if (activeItem.url) {
            const target = activeItem.url.startsWith('http') ? activeItem.url : `https://${activeItem.url}`;
            window.open(target, '_blank', 'noopener,noreferrer');
            onClose();
          }
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, combinedResults, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9990] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Quick Search and Command Palette"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -16 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-[#0d121f] border border-white/10 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.65)] overflow-hidden flex flex-col text-slate-100"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10 bg-white/[0.02]">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search tools, bookmarks, or jump to actions... (Esc to close)"
              className="w-full bg-transparent text-sm placeholder:text-slate-500 text-slate-100 focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                <Command size={11} />
                <span>K</span>
              </div>
            )}
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/[0.04]">
            {combinedResults.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No matching results found for "{query}".
              </div>
            ) : (
              <div className="flex flex-col gap-1 py-1">
                {combinedResults.map((item, idx) => {
                  const isSelected = idx === selectedIndex;
                  const isAction = Boolean(item.action);

                  return (
                    <div
                      key={item.id || item._id || idx}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={() => {
                        if (isAction) {
                          item.action();
                        } else if (item.url) {
                          const target = item.url.startsWith('http') ? item.url : `https://${item.url}`;
                          window.open(target, '_blank', 'noopener,noreferrer');
                          onClose();
                        }
                      }}
                      className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-rose-500/15 border border-rose-500/30 text-white'
                          : 'hover:bg-white/[0.04] text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-white/5 border border-white/10 text-slate-400'
                          }`}
                        >
                          {isAction ? (
                            <item.icon size={16} />
                          ) : (
                            <Zap size={15} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold truncate group-hover:text-white">
                              {item.title || item.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/10 text-slate-300 shrink-0">
                              {item.category || item.type || 'Link'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {item.desc || item.description || item.url}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isAction ? (
                          <ArrowRight
                            size={14}
                            className={`transition-transform ${isSelected ? 'translate-x-0.5 text-rose-400' : 'text-slate-500'}`}
                          />
                        ) : (
                          <ExternalLink
                            size={13}
                            className={`transition-colors ${isSelected ? 'text-rose-400' : 'text-slate-500'}`}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span>↑↓ to navigate</span>
              <span>↵ to select</span>
              <span>esc to dismiss</span>
            </div>
            <span className="text-rose-400/80 font-medium">Nexio Fast Spotlight</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
