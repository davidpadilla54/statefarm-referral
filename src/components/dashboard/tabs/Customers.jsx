import { useState } from 'react'
import { useCustomers } from '../../../hooks/useCustomers'
import { useSortable } from '../../../hooks/useSortable'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
import Skeleton from '../../ui/Skeleton'
import SortableHeader from '../../ui/SortableHeader'
import { useToast } from '../../ui/ToastProvider'

const siteUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin

function referralLink(slug) {
  return `${siteUrl}/refer?c=${slug}`
}

function toSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ── Add Customer Modal ─────────────────────────────────────────────────────────
function AddCustomerModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  const previewSlug = toSlug(form.name)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSaving(true)
    try {
      const slug = await onAdd(form)
      toast(`Customer added! Link: ${referralLink(slug)}`, 'success')
      onClose()
    } catch (err) {
      if (err?.message?.includes('duplicate') || err?.code === '23505') {
        setErrors({ name: 'A customer with this name already exists. Try adding a middle initial.' })
      } else {
        setErrors({ name: err?.message ?? 'Something went wrong' })
      }
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Add New Customer</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Full Name *"
              placeholder="Sarah Johnson"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              error={errors.name}
            />

            {previewSlug && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500 mb-0.5">Referral link preview</p>
                <p className="text-xs text-brand-red font-mono truncate">{referralLink(previewSlug)}</p>
              </div>
            )}

            <Input
              label="Phone"
              type="tel"
              placeholder="(904) 555-0100"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
            <Input
              label="Email *"
              type="email"
              placeholder="sarah@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              error={errors.email}
            />

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Adding…' : 'Add Customer'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

// ── Edit Customer Modal ────────────────────────────────────────────────────────
function EditCustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState({ name: customer.name, phone: customer.phone ?? '', email: customer.email ?? '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(customer.id, { name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim() })
      toast('Customer updated!', 'success')
      onClose()
    } catch (err) {
      setError(err?.message ?? 'Something went wrong')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Edit Customer</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={saving} className="flex-1">{saving ? 'Saving…' : 'Save Changes'}</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Customers() {
  const { customers, loading, addCustomer, updateCustomer } = useCustomers()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const toast = useToast()

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.includes(search.toLowerCase())
  )

  const flatForSort = filtered.map(c => ({
    ...c,
    _joined: c.created_at ?? '',
  }))
  const { sorted: sortedCustomers, sortKey, sortDir, handleSort } = useSortable(flatForSort, '_joined', 'desc')

  function copyLink(slug) {
    navigator.clipboard.writeText(referralLink(slug))
      .then(() => toast('Referral link copied!', 'success'))
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Customers</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            type="search"
            placeholder="Search name, email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red w-52"
          />
          <Button onClick={() => setShowAdd(true)}>+ Add Customer</Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-3">👥</div>
            <p className="font-medium">{search ? 'No matching customers' : 'No customers yet'}</p>
            {!search && (
              <p className="text-sm mt-1">
                <button onClick={() => setShowAdd(true)} className="text-brand-red hover:underline font-medium">
                  Add your first customer
                </button>{' '}to generate their referral link.
              </p>
            )}
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <SortableHeader label="Name"         colKey="name"    activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Contact"      colKey="email"   activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Tier"         colKey="tier"    activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referral Link</th>
                <SortableHeader label="Joined"       colKey="_joined" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedCustomers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{c.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{c.phone || '—'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{c.email || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={c.tier ?? 'Bronze'} type="tier" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono truncate max-w-[160px]">
                        /refer?c={c.slug}
                      </span>
                      <button
                        onClick={() => copyLink(c.slug)}
                        className="text-brand-red hover:text-brand-red-dark text-xs font-semibold whitespace-nowrap transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditing(c)}
                      className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-gray-400">{filtered.length} customer{filtered.length !== 1 ? 's' : ''}</p>

      {/* Modals */}
      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onAdd={addCustomer}
        />
      )}
      {editing && (
        <EditCustomerModal
          customer={editing}
          onClose={() => setEditing(null)}
          onSave={updateCustomer}
        />
      )}
    </div>
  )
}
