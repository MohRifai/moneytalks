"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        alert('Registrasi berhasil! Silakan langsung masuk.')
        setIsLogin(true)
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center animate-fade-in" style={{ minHeight: '100vh', padding: '1.5rem' }}>
      <div className="card glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.75rem', color: 'var(--color-primary)' }}>
          MoneyTalks
        </h2>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--color-text-muted)' }}>
          {isLogin ? 'Masuk ke akun Anda' : 'Buat akun Anda secara gratis'}
        </p>
        
        {error && (
          <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: 'var(--color-danger-light)', color: 'white', borderRadius: 'var(--radius-md)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="flex flex-col">
          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="nama@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              minLength={6}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}
          </span>
          <button 
            type="button" 
            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 600, marginLeft: '0.5rem', cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Daftar sekarang' : 'Masuk di sini'}
          </button>
        </div>
      </div>
    </div>
  )
}
