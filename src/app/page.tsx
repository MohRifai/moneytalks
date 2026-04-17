"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  
  // Data states
  const [transactions, setTransactions] = useState<any[]>([])
  const [debts, setDebts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      
      setUser(session.user)
      
      // Ambil data profil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()
        
      if (profileData) setProfile(profileData)

      // Fetch semua transaksi dan hutang piutang untuk user ini
      const [txRes, debtsRes] = await Promise.all([
        supabase.from('transactions').select('*, categories(name)').order('created_at', { ascending: false }),
        supabase.from('debts').select('*').order('created_at', { ascending: false })
      ])

      if (txRes.data) setTransactions(txRes.data)
      if (debtsRes.data) setDebts(debtsRes.data)

      setLoading(false)
    }

    checkUserAndFetch()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) return (
    <div className="flex items-center justify-center animate-fade-in" style={{ minHeight: '100vh' }}>
      <p style={{ color: 'var(--color-primary)', fontWeight: 500, fontSize: '1.25rem' }}>Memuat Dashboard...</p>
    </div>
  )

  // Kalkulasi Saldo
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount), 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount), 0)
  const balance = totalIncome - totalExpense

  // 3 transaksi terakhir
  const recentTransactions = transactions.slice(0, 3)

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '1000px' }}>
      <header className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)', fontSize: '2rem', marginBottom: '0.25rem' }}>MoneyTalks</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem' }}>
            Halo, <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>{user?.email}</span>
            {profile?.role === 'admin' && (
              <span className="badge badge-income" style={{ marginLeft: '0.5rem' }}>Admin</span>
            )}
          </p>
        </div>
        <button onClick={handleLogout} className="btn btn-secondary">Keluar</button>
      </header>

      <main className="flex flex-col gap-4">
        {/* Laporan Saldo Utama */}
        <div className="card glass-panel" style={{ padding: '2rem' }}>
          <h2>Ringkasan Saldo Anda</h2>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
            Pantau arus kas masuk dan keluar Anda.
          </p>
          <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
             <div style={{ flex: '1 1 200px', padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Pemasukan</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-primary)' }}>Rp {totalIncome.toLocaleString('id-ID')}</div>
             </div>
             <div style={{ flex: '1 1 200px', padding: '1.5rem', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>Total Pengeluaran</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--color-danger)' }}>Rp {totalExpense.toLocaleString('id-ID')}</div>
             </div>
             <div style={{ flex: '1 1 200px', padding: '1.5rem', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))', color: 'white', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-glow)' }}>
                <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Sisa Saldo</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>Rp {balance.toLocaleString('id-ID')}</div>
             </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="flex gap-4" style={{ marginTop: '1rem', flexWrap: 'wrap' }}>
          
          <div className="card" style={{ flex: '1 1 300px' }}>
            <div className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Transaksi Terbaru</h3>
            </div>
            
            {recentTransactions.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                Belum ada transaksi di bulan ini.
              </div>
            ) : (
              <div className="flex flex-col gap-2" style={{ marginBottom: '1.5rem' }}>
                {recentTransactions.map(t => (
                  <div key={t.id} className="flex items-center" style={{ justifyContent: 'space-between', padding: '0.75rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.categories?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{t.date}</div>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: t.type === 'income' ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                      {t.type === 'income' ? '+' : '-'} Rp {parseFloat(t.amount).toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <Link href="/transactions" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>
              Kelola Transaksi
            </Link>
          </div>
          
          <div className="card" style={{ flex: '1 1 300px' }}>
            <div className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3>Tagihan & Hutang</h3>
            </div>
            
            <div className="flex flex-col gap-2" style={{ marginBottom: '1.5rem' }}>
               <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: 'var(--color-text-muted)' }}>Hutang Anda</span>
                 <span style={{ fontWeight: 600, color: 'var(--color-danger)' }}>
                   Rp {debts.filter(d => d.type === 'debt' && d.status === 'unpaid').reduce((s, d) => s + parseFloat(d.amount), 0).toLocaleString('id-ID')}
                 </span>
               </div>
               <div style={{ padding: '1rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between' }}>
                 <span style={{ color: 'var(--color-text-muted)' }}>Piutang (Hak Anda)</span>
                 <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                   Rp {debts.filter(d => d.type === 'receivable' && d.status === 'unpaid').reduce((s, d) => s + parseFloat(d.amount), 0).toLocaleString('id-ID')}
                 </span>
               </div>
            </div>
            
            <Link href="/debts" className="btn btn-secondary" style={{ width: '100%', borderColor: 'var(--color-accent)', textDecoration: 'none' }}>
              Kelola Hutang Piutang
            </Link>
          </div>

        </div>
      </main>
    </div>
  )
}
