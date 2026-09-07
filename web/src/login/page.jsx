import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from './login-form'

export default function LoginPage({ onBack, onLoginSuccess }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans relative overflow-hidden">
      {/* Subtle background pattern - using inline style for radial gradient */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99, 102, 241, 0.06), transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 90%, rgba(168, 85, 247, 0.04), transparent 50%)
          `
        }}
      />

      {/* Back button */}
      <button 
        className="absolute top-7 left-8 z-10 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-500 text-sm cursor-pointer transition-all hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 hover:-translate-x-0.5 shadow-sm"
        type="button" 
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      {/* Login card */}
      <div className="relative z-0 w-full max-w-[420px] p-10 bg-white border border-gray-200 rounded-2xl shadow-lg transition-all duration-500 translate-y-0 opacity-100">
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  )
}
