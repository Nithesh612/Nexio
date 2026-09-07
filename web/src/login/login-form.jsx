import React, { useState } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'

import { API_BASE_URL } from '../config/api'

export function LoginForm({ onLoginSuccess, className, ...props }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const authData = {
          ...data.user,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 1 day in milliseconds
        }
        localStorage.setItem('nexio_auth', JSON.stringify(authData))
        setShowSuccess(true)
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(authData)
        }, 300)
      } else {
        setError(data.error || 'Invalid email or password.')
      }
    } catch {
      setError('Unable to connect to server. Please check your backend connection.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    setError('')
    setIsLoading(true)
    setTimeout(() => {
      const user = {
        email: `user@${provider.toLowerCase()}.com`,
        name: `${provider} User`,
        avatar: provider.charAt(0).toUpperCase(),
        loginTime: new Date().toISOString(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 1 day
      }
      localStorage.setItem('nexio_auth', JSON.stringify(user))
      setShowSuccess(true)
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(user)
      }, 300)
    }, 1000)
  }

  return (
    <div className={`flex flex-col gap-5 ${className || ''}`} {...props}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* Brand */}
        <div className="flex flex-col items-center gap-2.5 mb-7">
          <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center transition-transform hover:-rotate-3 hover:scale-105 cursor-pointer">
            <svg viewBox="0 0 32 32" fill="none" className="w-6 h-6">
              <path
                d="M9 23V9L23 23V9"
                stroke="#111827"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Welcome to Nexio</h1>
          <p className="text-sm text-gray-500 text-center">
            Don't have an account? <a href="#" className="text-indigo-500 font-medium no-underline hover:text-indigo-600 hover:underline transition-colors">Sign up</a>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-700 tracking-wide" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder-gray-400"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            autoFocus
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-gray-700 tracking-wide" htmlFor="login-password">Password</label>
          <div className="relative">
            <input
              id="login-password"
              className="w-full p-2.5 pr-11 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 placeholder-gray-400"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-400 cursor-pointer p-1 flex transition-colors hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          className="w-full py-3 px-5 bg-gray-900 border-none rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:bg-gray-800 shadow-none active:scale-[0.99] mt-1 flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : <span>Login</span>}
        </button>



      </form>


      {/* Success overlay */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex flex-col items-center gap-4 p-12 transition-transform duration-500 scale-100">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center">
              <Check size={30} strokeWidth={3} className="text-emerald-500" />
            </div>
            <div className="text-lg font-semibold text-gray-900">Welcome back!</div>
            <div className="text-[13px] text-gray-500">Redirecting to your dashboard…</div>
          </div>
        </div>
      )}
    </div>
  )
}
