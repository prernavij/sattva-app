import { useState } from 'react'
import { supabase } from '../lib/supabase'
import DiyaLogo from '../components/DiyaLogo'

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handle = async () => {
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      setMessage('Check your email to confirm your account, then sign in.')
      setMode('signin')
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { setError(error.message); setLoading(false); return }
      onAuth(data.user)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-12" style={{ background: '#EFF0EB' }}>
      <DiyaLogo size={48} className="mb-4" />
      <h1 className="font-serif text-3xl text-green-primary mb-1">Sattva</h1>
      <p className="text-sm text-stone-400 mb-10">
        {mode === 'signin' ? 'Sign in to sync your wellness data' : 'Create an account to get started'}
      </p>

      <div className="w-full max-w-xs flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base bg-white focus:border-green-primary"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-base bg-white focus:border-green-primary"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handle()}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {error && <p className="text-xs text-red-500">{error}</p>}
        {message && <p className="text-xs text-green-primary">{message}</p>}

        <button
          onClick={handle}
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white mt-1 disabled:opacity-60"
          style={{ background: '#3D5240' }}
        >
          {loading ? '…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        <button
          onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setMessage('') }}
          className="text-sm text-stone-400 text-center mt-1"
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
