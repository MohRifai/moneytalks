"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DebtsPage() {
  const [user, setUser] = useState<any>(null)
  const [debts, setDebts] = useState<any[]>([])
  
  // Form states
  const [type, setType] = useState('debt') // debt = hutang, receivable = piutang
  const [personName, setPersonName] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  
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
      fetchDebts(session.user.id)
    }
    checkUserAndFetch()
  }, [router])

  const fetchDebts = async (userId: string) => {
    const { data } = await supabase
      .from('debts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setDebts(data)
  }

  const handleAddDebt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!personName || !amount) return
    setLoading(true)

    try {
      const { error } = await supabase
        .from('debts')
        .insert([{
          user_id: user.id,
          type,
          person_name: personName.trim(),
          amount: parseFloat(amount),
          due_date: dueDate || null,
          status: 'unpaid'
        }])
      
      if (error) throw error

      setPersonName('')
      setAmount('')
      setDueDate('')
      
      fetchDebts(user.id)
      alert("Catatan berhasil disimpan!")
    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'paid' ? 'unpaid' : 'paid'
    const { error } = await supabase.from('debts').update({ status: newStatus }).eq('id', id)
    if (error) alert("Gagal update: " + error.message)
    else fetchDebts(user!.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus rincian ini?')) return
    const { error } = await supabase.from('debts').delete().eq('id', id)
    if (error) alert("Gagal menghapus: " + error.message)
    else fetchDebts(user!.id)
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', maxWidth: '800px' }}>
      <header className="flex items-center" style={{ justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ color: 'var(--color-primary)' }}>Hutang & Piutang</h1>
          <p style={{ color: 'var(--color-text-muted)' }}>Pantau tanggungan dan tagihan Anda</p>
        </div>
        <Link href="/" className="btn btn-secondary">← Kembali ke Dashboard</Link>
      </header>

      <div className="card glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>+ Catat Baru</h2>
        <form onSubmit={handleAddDebt} className="flex-col">
          <div className="flex gap-4" style={{ marginBottom: '1rem' }}>
             <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
               <label className="input-label">Jenis</label>
               <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
                 <option value="debt">Hutang (Saya berhutang)</option>
                 <option value="receivable">Piutang (Orang berhutang ke saya)</option>
               </select>
             </div>
             <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
               <label className="input-label">Nama Orang / Pihak</label>
               <input type="text" className="input-field" placeholder="Contoh: Pak Budi..." value={personName} onChange={(e) => setPersonName(e.target.value)} required />
             </div>
          </div>
          
          <div className="flex gap-4" style={{ marginBottom: '1rem' }}>
             <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
               <label className="input-label">Nominal (Rp)</label>
               <input type="number" min="0" className="input-field" placeholder="50000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
             </div>
             <div className="input-group" style={{ flex: 1, marginBottom: 0 }}>
               <label className="input-label">Tenggat Waktu / Due Date (Opsional)</label>
               <input type="date" className="input-field" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
             </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? 'Menyimpan...' : 'Simpan Catatan'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Daftar Tagihan & Tanggungan</h3>
        {debts.length === 0 ? (
           <p style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Belum ada data hutang/piutang.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {debts.map((d) => (
               <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                 <div>
                   <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     {d.person_name}
                     <span className={`badge ${d.status === 'paid' ? 'badge-paid' : 'badge-unpaid'}`}>
                       {d.status === 'paid' ? 'LUNAS' : 'BELUM LUNAS'}
                     </span>
                   </div>
                   <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                      {d.type === 'debt' ? 'Anda berhutang kepadanya' : 'Berhutang kepada Anda'} 
                      {d.due_date && ` • Tenggat: ${d.due_date}`}
                   </div>
                 </div>
                 <div className="flex items-center gap-2">
                   <div style={{ fontWeight: 700, marginRight: '1rem', color: d.type === 'receivable' ? 'var(--color-primary)' : 'var(--color-danger)' }}>
                      Rp {parseFloat(d.amount).toLocaleString('id-ID')}
                   </div>
                   <button onClick={() => handleToggleStatus(d.id, d.status)} style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '0.35rem 0.75rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500, color: 'var(--color-text)' }}>
                     {d.status === 'paid' ? 'Batal Lunas' : 'Tandai Lunas'}
                   </button>
                   <button onClick={() => handleDelete(d.id)} style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '0.35rem', fontFamily: 'inherit' }}>
                     Hapus
                   </button>
                 </div>
               </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
