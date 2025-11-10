import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }: { onLogin?: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // validation regex for Vanguard emails
  const emailRegex = /^[A-Za-z0-9._%+-]+@vanguard\.com$/i
  const isValid = emailRegex.test(String(email ?? '').trim()) && String(password ?? '').length > 0

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = String(email ?? '').trim()
    const pwd = String(password ?? '')

    if (!trimmed || !pwd) {
      setError('Please enter email and password')
      return
    }

    // require vanguard.com emails only
    const emailRegex = /^[A-Za-z0-9._%+-]+@vanguard\.com$/i
    if (!emailRegex.test(trimmed)) {
      setError('Email must be a Vanguard address (something@vanguard.com)')
      return
    }
    // Very small fake auth: accept anything
    try {
      localStorage.setItem('vg_logged_in', 'true')
      onLogin?.()
      // navigate to the home/dashboard after login
      navigate('/home')
    } catch (err) {
      setError('Unable to sign in')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
      <form
        onSubmit={submit}
        style={{
          width: 520,
          maxWidth: '92%',
          border: '1px solid #bbb',
          padding: 42,
          borderRadius: 2,
          boxShadow: 'none',
          background: '#fff',
        }}
      >
        <h2 style={{ textAlign: 'center', margin: '0 0 28px 0', fontWeight: 700 }}>Login</h2>

        <div style={{ width: '60%', margin: '0 auto 8px auto' }}>
          <input
            aria-label="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 2, border: '1px solid #cfcfcf', outline: 'none' }}
          />
        </div>

        <div style={{ width: '60%', margin: '12px auto 18px auto' }}>
          <input
            aria-label="password"
            placeholder="Create password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 2, border: '1px solid #cfcfcf', outline: 'none' }}
          />
        </div>

        {error && <div style={{ color: '#b00020', marginBottom: 12, textAlign: 'center' }}>{error}</div>}

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="submit"
            disabled={!isValid}
            style={{
              background: '#1da1ff',
              color: '#fff',
              border: 'none',
              padding: '8px 28px',
              borderRadius: 6,
              cursor: isValid ? 'pointer' : 'default',
              opacity: isValid ? 1 : 0.55,
            }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  )
}
