import React, { useState } from 'react'
import { Eye, EyeOff, Check } from 'lucide-react'

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
      await new Promise((resolve) => setTimeout(resolve, 1200))

      if (email.includes('@') && password.length >= 4) {
        const user = {
          email: email.trim(),
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          avatar: email.trim().charAt(0).toUpperCase(),
          loginTime: new Date().toISOString(),
        }
        localStorage.setItem('nexio_auth', JSON.stringify(user))
        setShowSuccess(true)
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user)
        }, 1500)
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch {
      setError('Authentication failed. Please try again.')
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
      }
      localStorage.setItem('nexio_auth', JSON.stringify(user))
      setShowSuccess(true)
      setTimeout(() => {
        if (onLoginSuccess) onLoginSuccess(user)
      }, 1500)
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
          className="w-full py-3 px-5 bg-gray-900 border-none rounded-lg text-white text-sm font-semibold cursor-pointer transition-all hover:bg-gray-800 hover:shadow-md active:scale-[0.99] mt-1 flex justify-center items-center disabled:opacity-60 disabled:cursor-not-allowed" 
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

        {/* Divider */}
        <div className="flex items-center gap-3.5 my-1">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs text-gray-400 uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Social buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button 
            type="button" 
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 text-[13px] font-medium cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900" 
            onClick={() => handleSocialLogin('Apple')}
          >
            <svg className="w-[18px] h-[18px] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                fill="currentColor"
              />
            </svg>
            Apple
          </button>
          <button 
            type="button" 
            className="flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 rounded-lg text-gray-700 text-[13px] font-medium cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-400 hover:text-gray-900" 
            onClick={() => handleSocialLogin('Google')}
          >
            <svg className="w-[18px] h-[18px] flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Google
          </button>
        </div>
      </form>

      {/* Terms */}
      <p className="text-center text-[11.5px] text-gray-400 mt-1 leading-relaxed">
        By clicking continue, you agree to our <a href="#" className="text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-900">Terms of Service</a>{' '}
        and <a href="#" className="text-gray-500 underline underline-offset-2 transition-colors hover:text-gray-900">Privacy Policy</a>.
      </p>

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
