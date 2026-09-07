import React from 'react'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from './login-form'
import './login.css'

export default function LoginPage({ onBack, onLoginSuccess }) {
  return (
    <div className="login-viewport">
      {/* Back button */}
      <button className="login-back-btn" type="button" onClick={onBack}>
        <ArrowLeft size={16} />
        Back to Home
      </button>

      {/* Login card */}
      <div className="login-card">
        <LoginForm onLoginSuccess={onLoginSuccess} />
      </div>
    </div>
  )
}
