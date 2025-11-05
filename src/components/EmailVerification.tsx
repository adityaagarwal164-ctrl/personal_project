import { useState } from 'react'
import { sendOTP, verifyOTP, isEmailVerified } from '@/lib/storage'

interface EmailVerificationProps {
  onVerified: (email: string) => void
  title?: string
  description?: string
}

export default function EmailVerification({ onVerified, title, description }: EmailVerificationProps) {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSendOTP = () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }

    setError('')
    setLoading(true)

    // Check if already verified
    if (isEmailVerified(email)) {
      onVerified(email)
      return
    }

    try {
      sendOTP(email)
      setStep('otp')
      setLoading(false)
    } catch (err) {
      setError('Failed to send OTP. Please try again.')
      setLoading(false)
    }
  }

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit code')
      return
    }

    setError('')
    setLoading(true)

    const isValid = verifyOTP(email, otp)
    
    if (isValid) {
      onVerified(email)
    } else {
      setError('Invalid or expired code. Please try again.')
      setLoading(false)
    }
  }

  const handleResendOTP = () => {
    sendOTP(email)
    setOtp('')
    setError('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {title || 'Verify Your Email'}
        </h2>
        <p className="text-slate-600 text-sm">
          {description || 'We need to verify your email to prevent spam and ensure authenticity'}
        </p>
      </div>

      {step === 'email' ? (
        <>
          {/* Email Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
              placeholder="your@email.com"
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Verification Code'}
          </button>
        </>
      ) : (
        <>
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Enter 6-Digit Code
            </label>
            <div className="text-sm text-slate-600 mb-3">
              We sent a code to <span className="font-semibold text-slate-900">{email}</span>
              <button
                onClick={() => setStep('email')}
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Change
              </button>
            </div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
              placeholder="123456"
              maxLength={6}
              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-center text-2xl font-bold tracking-widest focus:border-blue-500 focus:outline-none transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.length !== 6}
            className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>

          <div className="text-center">
            <button
              onClick={handleResendOTP}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              Didn't receive the code? Resend
            </button>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
            <strong>Demo Mode:</strong> Check the browser alert or console for your OTP code.
            In production, this would be sent to your email.
          </div>
        </>
      )}

      <div className="text-xs text-slate-500 text-center pt-4 border-t border-slate-200">
        🔒 Your email will be verified and stored securely
      </div>
    </div>
  )
}
