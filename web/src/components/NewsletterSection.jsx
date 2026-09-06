import React, { useState } from 'react'
import { Check, Mail } from 'lucide-react'

export default function NewsletterSection({ className = '' }) {
  const [emailInput, setEmailInput] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setSubscribed(true)
      setEmailInput('')
    }
  }

  return (
    <section className={`w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 my-16 ${className}`}>
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-r from-[#eef2ff] via-[#f5f3ff] to-[#faf5ff] border border-indigo-100/80 p-8 sm:p-14 text-center shadow-[0_10px_35px_rgba(79,70,229,0.06)]">
        <div className="max-w-2xl mx-auto relative z-10">
          {/* Badge */}
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-widest bg-white px-3.5 py-1.5 rounded-full border border-indigo-200/60 inline-block mb-4 shadow-2xs">
            Weekly Resource Dispatch
          </span>

          {/* Headline */}
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-3.5 leading-snug">
            Join 5,000+ designers getting the latest tools, assets, and news in their inbox.
          </h2>

          {/* Description */}
          <p className="text-sm sm:text-base text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
            No spam, ever. Only the best curated Figma files, 3D icons, fonts and frontend components sent every Tuesday.
          </p>

          {/* Form / Subscribed state */}
          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-full text-sm shadow-md transition-all">
              <Check size={18} strokeWidth={3} />
              <span>You're in! Check your inbox for the starter asset kit.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-lg mx-auto">
              <div className="relative w-full">
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your work email..."
                  className="w-full pl-5 pr-10 py-3.5 bg-white rounded-full text-sm border border-gray-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none shadow-xs text-gray-900 placeholder:text-gray-400 transition-all"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#0f172a] hover:bg-black text-white font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0 cursor-pointer"
              >
                Join Free
              </button>
            </form>
          )}

          <p className="text-xs text-gray-500 mt-4 font-normal">
            Free forever. Unsubscribe with 1-click anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
