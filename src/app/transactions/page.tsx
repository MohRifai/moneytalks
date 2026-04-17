"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function TransactionsPage() {
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  
  // Form states
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkUserAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)
      fetchTransactions(session.user.id)
    }
    checkUserAndFetch()
  }, [router])

  const fetchTransactions = async (userId: string) => {
    const { data } = await supabase
      .from('transactions')
      .select('*, categories(name)')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (data) setTransactions(data)
  }

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !categoryName || !date) return
    setLoading(true)

    try {
      // 1. Cari atau buat Kategori
      let categoryId = null

      const { data: existingCategories } = await supabase
        .from('categories')
        .select('id')
        .eq('name', categoryName.trim())
        .eq('type', type)
        .eq('user_id', user.id)

      if (existingCategories && existingCategories.length > 0) {
        categoryId = existingCategories[0].id
      } else {
        const { data: newCategory, error: catError } = await supabase
          .from('categories')
          .insert([{ name: categoryName.trim(), type, user_id: user.id }])
          .select()
        
        if (catError) throw catError
        if (newCategory) categoryId = newCategory[0].id
      }

      // 2. Insert Transaksi
      const { error: txtError } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          type,
          amount: parseFloat(amount),
          category_id: categoryId,
          date,
          description: description.trim()
        }])
      
      if (txtError) throw txtError

      setAmount('')
      setCategoryName('')
      setDescription('')
      
      fetchTransactions(user.id)
      alert("Transaksi berhasil dicatat!")
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus transaksi ini?')) return
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) alert("Gagal menghapus: " + error.message)
    else fetchTransactions(user!.id)
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <header className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Kelola Transaksi</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Catat Pemasukan dan Pengeluaran Anda</p>
        </div>
        <Link href="/" className="btn btn-secondary">← Kembali ke Dashboard</Link>
      </header>

      <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>+ Catat Baru</h2>
        <form onSubmit={handleAddTransaction} className="flex-col">
          <div className="flex gap-4" style={{ marginBottom: '1rem' }}>
             <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
               <label className="input-label">Jenis</label>
               <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
                 <option value="expense">Pengeluaran</option>
                 <option value="income">Pemasukan</option>
               </select>
             </div>
             <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
               <label className="input-label">Tanggal</label>
               <input type="date" className="input-field" value={date} onChange={(e) => setDate(e.target.value)} required />
             </div>
          </div>
          
          <div className="flex gap-4" style={{ marginBottom: '1rem' }}>
             <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
               <label className="input-label">Nominal (Rp)</label>
               <input type="number" min="0" className="input-field" placeholder="150000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
             </div>
             <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
               <label className="input-label">Kategori</label>
               <input type="text" className="input-field" placeholder="Contoh: Makanan, Gaji..." value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
             </div>
          </div>

          <div className="input-group">
             <label className="input-label">Deskripsi / Keterangan (Opsional)</label>
             <input type="text" className="input-field" placeholder="Keterangan transaksi..." value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Riwayat Transaksi</h3>
        {transactions.length === 0 ? (
           <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada data transaksi.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {transactions.map((t) => (
               <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                 <div>
                   <div style={{ fontWeight: 600 }}>{t.categories?.name}</div>
                   <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{t.date} • {t.description || 'Tidak ada deskripsi'}</div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div style={{ fontWeight: 700, color: t.type === 'income' ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                      {t.type === 'income' ? '+' : '-'} Rp {parseFloat(t.amount).toLocaleString('id-ID')}
                   </div>
                   <button onClick={() => handleDelete(t.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', fontFamily: 'inherit' }}>Hapus</button>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
