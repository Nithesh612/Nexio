import React, { useState } from 'react'
import { Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'
import './login.css'

export default function LoginPage({ onBack, onLoginSuccess }) {
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

    // Simulate authentication (replace with real API call)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Demo credentials check — replace with real backend auth
      if (email.includes('@') && password.length >= 4) {
        const user = {
          email: email.trim(),
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          avatar: email.trim().charAt(0).toUpperCase(),
          loginTime: new Date().toISOString(),
        }

        // Store auth in localStorage
        localStorage.setItem('nexio_auth', JSON.stringify(user))

        // Show success animation
        setShowSuccess(true)

        // Navigate to dashboard after success animation
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(user)
        }, 1500)
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch (err) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider) => {
    setError('')
    setIsLoading(true)

    // Simulate social login
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
    <div className="login-viewport">
      {/* Back button */}
      <button
        className="login-back-btn"
        type="button"
        onClick={onBack}
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      {/* Login card */}
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <div className="login-logo">
            <svg viewBox="0 0 32 32" fill="none">
              <path
                d="M9 23V9L23 23V9"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1 className="login-title">Welcome to Nexio</h1>
          <p className="login-subtitle">
            Sign in to access your dashboard and manage your links
          </p>
        </div>

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Error */}
          {error && <div className="login-error">{error}</div>}

          {/* Email */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="login-field">
            <label className="login-label" htmlFor="login-password">
              Password
            </label>
            <div className="login-password-wrap">
              <input
                id="login-password"
                className="login-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <a href="#" className="login-forgot">
            Forgot password?
          </a>

          {/* Submit */}
          <button
            className="login-submit"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="login-spinner" />
            ) : (
              <span>Sign In</span>
            )}
          </button>

          {/* Divider */}
          <div className="login-divider">
            <span>or continue with</span>
          </div>

          {/* Social login */}
          <div className="login-socials">
            <button
              type="button"
              className="login-social-btn"
              onClick={() => handleSocialLogin('Google')}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="login-social-btn"
              onClick={() => handleSocialLogin('Apple')}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                  fill="currentColor"
                />
              </svg>
              Apple
            </button>
          </div>
        </form>

        {/* Terms */}
        <p className="login-terms">
          By continuing, you agree to Nexio's{' '}
          <a href="#">Terms of Service</a> and{' '}
          <a href="#">Privacy Policy</a>.
        </p>
      </div>

      {/* Success overlay */}
      {showSuccess && (
        <div className="login-success-overlay">
          <div className="login-success-card">
            <div className="login-success-check">
              <Check size={30} strokeWidth={3} />
            </div>
            <div className="login-success-text">Welcome back!</div>
            <div className="login-success-sub">Redirecting to your dashboard…</div>
          </div>
        </div>
      )}
    </div>
  )
}
