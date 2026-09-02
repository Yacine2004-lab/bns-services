import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Sparkles, Loader2, Check, X, CalendarRange, Percent, Tag } from 'lucide-react'
import { adminPromoApi } from '../../lib/api'

const formatPrice = (value) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    maximumFractionDigits: 0,
  }).format(value)

const initialForm = {
  code: '',
  description: '',
  type: 'percentage',
  value: 10,
  minOrder: 0,
  active: true,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  usageLimit: 100,
}

export default function AdminPromotions() {
  const [promos, setPromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(initialForm)

  const loadPromos = async () => {
    try {
      setLoading(true)
      const data = await adminPromoApi.getAll()
      setPromos(data.data || [])
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des promos.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPromos()
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(initialForm)
    setShowForm(true)
    setError('')
  }

  const openEdit = (promo) => {
    setEditingId(promo.id)
    setForm({
      code: promo.code,
      description: promo.description || '',
      type: promo.type,
      value: promo.value,
      minOrder: promo.minOrder,
      active: promo.active,
      startDate: promo.startDate ? promo.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      endDate: promo.endDate ? promo.endDate.slice(0, 10) : '',
      usageLimit: promo.usageLimit ?? 100,
    })
    setShowForm(true)
    setError('')
  }

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (editingId) {
        await adminPromoApi.update(editingId, form)
      } else {
        await adminPromoApi.create(form)
      }
      setShowForm(false)
      setForm(initialForm)
      await loadPromos()
    } catch (err) {
      setError(err.message || 'Erreur lors de l’enregistrement de la promo.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette promo ?')) return

    try {
      await adminPromoApi.delete(id)
      await loadPromos()
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Gestion des promotions</h2>
          <p className="text-sm text-slate-400 mt-1">Configurez les codes promos et les règles d’application.</p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-[#e87722] px-4 py-2.5 text-sm font-bold text-[#0f2557] shadow-lg shadow-[#e87722]/20 hover:brightness-110"
        >
          <Plus size={16} />
          Ajouter une promo
        </button>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-white">{editingId ? 'Modifier la promo' : 'Nouvelle promo'}</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-300"
            >
              Fermer
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-300">
              <span>Code promo</span>
              <input
                value={form.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#e87722]"
                placeholder="BNS10"
                required
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Type</span>
              <select
                value={form.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#e87722]"
              >
                <option value="percentage">Pourcentage</option>
                <option value="fixed">Montant fixe</option>
              </select>
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>{form.type === 'percentage' ? 'Pourcentage (%)' : 'Montant fixe (FCFA)'}</span>
              <input
                type="number"
                min="0"
                value={form.value}
                onChange={(e) => handleChange('value', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#e87722]"
                required
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Montant minimum (FCFA)</span>
              <input
                type="number"
                min="0"
                value={form.minOrder}
                onChange={(e) => handleChange('minOrder', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#e87722]"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
              <span>Description</span>
              <input
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#e87722]"
                placeholder="Réduction de 10% sur les achats de plus de 20000 FCFA"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Date de début</span>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#e87722]"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Date de fin</span>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#e87722]"
              />
            </label>

            <label className="space-y-2 text-sm text-slate-300">
              <span>Limite d’utilisation</span>
              <input
                type="number"
                min="1"
                value={form.usageLimit}
                onChange={(e) => handleChange('usageLimit', e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-[#e87722]"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-3 py-3 text-sm text-slate-300 md:col-span-2">
              <span>Promo active</span>
              <button
                type="button"
                onClick={() => handleChange('active', !form.active)}
                className={`relative h-7 w-12 rounded-full transition ${form.active ? 'bg-[#e87722]' : 'bg-slate-700'}`}
              >
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${form.active ? 'left-6' : 'left-1'}`} />
              </button>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm text-slate-300">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-[#e87722] px-4 py-2.5 text-sm font-bold text-[#0f2557] disabled:opacity-60">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              {saving ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Créer la promo'}
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="grid grid-cols-[1.5fr_1fr_1.2fr_1fr_1fr] gap-3 border-b border-slate-800 px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          <span>Code</span>
          <span>Type</span>
          <span>Conditions</span>
          <span>Statut</span>
          <span className="text-right">Actions</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 px-6 py-12 text-slate-400">
            <Loader2 size={18} className="animate-spin" />
            Chargement des promos...
          </div>
        ) : promos.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400">
            Aucune promo créée pour le moment.
          </div>
        ) : (
          promos.map((promo) => (
            <div key={promo.id} className="grid grid-cols-[1.5fr_1fr_1.2fr_1fr_1fr] items-center gap-3 border-b border-slate-800 px-5 py-4 text-sm text-slate-200 last:border-b-0">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e87722]/10 text-[#e87722]">
                  <Tag size={16} />
                </div>
                <div>
                  <p className="font-bold text-white">{promo.code}</p>
                  <p className="text-[11px] text-slate-400">{promo.description || 'Sans description'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                {promo.type === 'percentage' ? <Percent size={14} /> : <Sparkles size={14} />}
                {promo.type === 'percentage' ? `${promo.value}%` : formatPrice(Number(promo.value))}
              </div>

              <div className="text-slate-300 text-xs">
                <p>Min : {formatPrice(Number(promo.minOrder || 0))}</p>
                <p>Utilisations : {promo.usageLimit ?? '∞'}</p>
              </div>

              <div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${promo.active ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                  {promo.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button type="button" onClick={() => openEdit(promo)} className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-[#e87722] hover:text-[#e87722]">
                  <Pencil size={14} />
                </button>
                <button type="button" onClick={() => handleDelete(promo.id)} className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:border-red-500 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
