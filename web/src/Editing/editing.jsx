import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function EditingPage({
  onBack,
  onNavigateToDesign,
  onNavigateToAITools,
  onNavigateToDashboard,
  onAddLink,
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f4] text-slate-900">
      <Header
        currentView="editing"
        onNavigate={(target) => {
          if (target === 'landing') onBack?.()
          else if (target === 'design') onNavigateToDesign?.()
          else if (target === 'ai-tools') onNavigateToAITools?.()
          else if (target === 'editing') return
          else if (target === 'app') onNavigateToDashboard?.()
        }}
        onAddLink={onAddLink}
        user={null}
        onLogin={() => onNavigateToDashboard?.()}
        onLogout={() => onBack?.()}
      />

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
          <div className="mb-6 inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-700">
            Editing Studio
          </div>

          <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Editing
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            This is the Editing page. You can customize it with your editing tools, workflow,
            content actions, and media management sections.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              onClick={onBack}
            >
              Back to Home
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              onClick={onNavigateToDesign}
            >
              Open Design
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              onClick={onNavigateToAITools}
            >
              Open AI Tools
            </button>
          </div>
        </div>
      </main>

      <Footer onNavigate={(view) => {
        if (view === 'landing') onBack?.()
        else if (view === 'design') onNavigateToDesign?.()
        else if (view === 'ai-tools') onNavigateToAITools?.()
        else if (view === 'app') onNavigateToDashboard?.()
      }} />
    </div>
  )
}
