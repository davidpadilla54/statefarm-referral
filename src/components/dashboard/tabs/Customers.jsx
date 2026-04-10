import { useState } from 'react'
import { useCustomers } from '../../../hooks/useCustomers'
import { useStaffRole } from '../../../hooks/useStaffRole'
import { useSortable } from '../../../hooks/useSortable'
import Avatar from '../../ui/Avatar'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
import Skeleton from '../../ui/Skeleton'
import SortableHeader from '../../ui/SortableHeader'
import { useToast } from '../../ui/ToastProvider'
import { ChevronDown, ChevronRight } from 'lucide-react'

const NUDGE_BUSINESS_DAYS = 5

function businessDaysSince(dateStr) {
  const d = new Date(dateStr)
  d.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  let count = 0
  while (d < now) {
    d.setDate(d.getDate() + 1)
    const day = d.getDay()
    if (day !== 0 && day !== 6) count++
  }
  return count
}

function needsNudge(customer) {
  const activeReferrals = (customer.referrals ?? []).filter(r => !r.deleted_at)
  return activeReferrals.length === 0 && businessDaysSince(customer.created_at) >= NUDGE_BUSINESS_DAYS
}

const siteUrl = import.meta.env.VITE_PROD_URL ?? import.meta.env.VITE_SITE_URL ?? window.location.origin

function referralLink(slug) {
  return `${siteUrl}/refer?c=${slug}`
}

function toSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

// ── SMS Composer Modal ──────────────────────────────────────────────────────
function SmsModal({ customer, onClose }) {
  const fullLink = referralLink(customer.slug)
  const staffFirstName = customer.created_by
    ? customer.created_by.split(' ')[0]
    : 'the team'
  const customerFirstName = customer.name.split(' ')[0]

  const defaultScript =
`Hey ${customerFirstName}! It's ${staffFirstName} from David Padilla – State Farm 🏠

You're enrolled in our Referral Rewards Program! 🎁 Know anyone who could use auto, home, or life insurance? Use your personal link to enter their info and earn a gift card when they get a quote:

${fullLink}

It only takes a minute — and there's no limit to how many you can refer! Questions? Just reply! 😊`

  const [message, setMessage] = useState(defaultScript)
  const toast = useToast()

  const phone = (customer.phone ?? '').replace(/\D/g, '')
  const smsHref = phone
    ? `sms:+1${phone}?body=${encodeURIComponent(message)}`
    : `sms:?body=${encodeURIComponent(message)}`

  function copyMessage() {
    navigator.clipboard.writeText(message)
      .then(() => toast('Message copied!', 'success'))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg">
        <Card>
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-red flex items-center justify-center text-white text-sm font-bold shrink-0">
                📱
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Send Referral Link</h2>
                <p className="text-xs text-gray-400">{customer.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          {/* Phone */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">To</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono">
              {customer.phone || <span className="text-gray-400 italic">No phone on file</span>}
            </div>
          </div>

          {/* Referral link preview */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">Referral Link</label>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-xs text-brand-red font-mono truncate flex-1">{fullLink}</span>
            </div>
          </div>

          {/* Message */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</label>
              <span className="text-xs text-gray-400">Editable before sending</span>
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={8}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-red resize-none text-gray-700 leading-relaxed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={copyMessage}
              className="flex-1 px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Copy Message
            </button>
            <a
              href={smsHref}
              className="flex-1 px-4 py-2.5 text-sm font-bold bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors text-center"
              onClick={onClose}
            >
              📱 Open in Messages
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center mt-2">
            Opens your native SMS app with this message pre-filled
          </p>
        </Card>
      </div>
    </div>
  )
}

// ── Nudge Modal ─────────────────────────────────────────────────────────────
function NudgeModal({ customer, onClose }) {
  const fullLink = referralLink(customer.slug)
  const staffFirstName = customer.created_by ? customer.created_by.split(' ')[0] : 'the team'
  const customerFirstName = customer.name.split(' ')[0]

  const defaultScript =
`Hey ${customerFirstName}! It's ${staffFirstName} from David Padilla – State Farm 🏠

Just a friendly reminder — your Referral Rewards link is still active! 🎁

If you know anyone who could use auto, home, or life insurance, just use your personal link to enter their info. You'll earn a gift card once they complete a quote — it only takes a minute!

${fullLink}

No rush at all, just wanted to make sure you didn't miss out! Questions? Just reply 😊`

  const [message, setMessage] = useState(defaultScript)
  const toast = useToast()

  const phone = (customer.phone ?? '').replace(/\D/g, '')
  const smsHref = phone
    ? `sms:+1${phone}?body=${encodeURIComponent(message)}`
    : `sms:?body=${encodeURIComponent(message)}`

  function copyMessage() {
    navigator.clipboard.writeText(message).then(() => toast('Message copied!', 'success'))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0">🔔</div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Send Friendly Nudge</h2>
                <p className="text-xs text-gray-400">{customer.name} · No referrals yet</p>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>

          <div className="mb-3">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">To</label>
            <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 font-mono">
              {customer.phone || <span className="text-gray-400 italic">No phone on file</span>}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Message</label>
              <span className="text-xs text-gray-400">Editable before sending</span>
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={9}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none text-gray-700 leading-relaxed"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={copyMessage}
              className="flex-1 px-4 py-2.5 text-sm font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Copy Message
            </button>
            <a
              href={smsHref}
              className="flex-1 px-4 py-2.5 text-sm font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors text-center"
              onClick={onClose}
            >
              📱 Open in Messages
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center mt-2">
            Opens your native SMS app with this message pre-filled
          </p>
        </Card>
      </div>
    </div>
  )
}

// ── Add Customer Modal ──────────────────────────────────────────────────────
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

// ── Edit Customer Modal ─────────────────────────────────────────────────────
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

// ── Main Component ──────────────────────────────────────────────────────────
export default function Customers() {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers()
  const { name: staffName } = useStaffRole()
  const [showAdd, setShowAdd] = useState(false)
  const [editing, setEditing] = useState(null)
  const [smsCustomer, setSmsCustomer] = useState(null)
  const [nudgeCustomer, setNudgeCustomer] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [search, setSearch] = useState('')
  const [nudgeOpen, setNudgeOpen] = useState(true)
  const toast = useToast()

  async function handleDeleteCustomer() {
    try {
      await deleteCustomer(confirmDelete.id, staffName)
      toast(`${confirmDelete.name} moved to Deleted.`, 'success')
    } catch (err) {
      toast(err?.message ?? 'Delete failed', 'error')
    } finally {
      setConfirmDelete(null)
    }
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.includes(search.toLowerCase())
  )

  const nudgeList  = filtered.filter(needsNudge)
  const activeList = filtered.filter(c => !needsNudge(c))

  const toFlat = list => list.map(c => ({ ...c, _joined: c.created_at ?? '' }))
  const { sorted: sortedCustomers, sortKey, sortDir, handleSort } = useSortable(toFlat(activeList), '_joined', 'desc')
  const { sorted: sortedNudge } = useSortable(toFlat(nudgeList), '_joined', 'asc')

  function copyLink(slug) {
    navigator.clipboard.writeText(referralLink(slug))
      .then(() => toast('Referral link copied!', 'success'))
  }

  // Wrap addCustomer to inject the logged-in staff member's name
  async function handleAddCustomer(form) {
    return addCustomer({ ...form, createdBy: staffName || null })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Current Customers</h2>
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

      {/* Needs Nudge collapsible — shown first so it's never buried */}
      {nudgeList.length > 0 && (
      <div className="rounded-xl border border-amber-200 overflow-hidden">
        <button
          onClick={() => setNudgeOpen(o => !o)}
          className="w-full flex items-center justify-between px-4 py-3 bg-amber-50 hover:bg-amber-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            {nudgeOpen ? <ChevronDown size={16} className="text-amber-600" /> : <ChevronRight size={16} className="text-amber-600" />}
            <span className="text-sm font-bold text-amber-800">🔔 Needs a Nudge</span>
            <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-semibold">{nudgeList.length}</span>
            <span className="text-xs text-amber-600 font-normal">· invited {NUDGE_BUSINESS_DAYS}+ business days ago, no referrals yet</span>
          </div>
          <span className="text-xs text-amber-600">{nudgeOpen ? 'Collapse' : 'Expand'}</span>
        </button>

        {nudgeOpen && (
          <div className="overflow-x-auto bg-white">
            {nudgeList.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Everyone's active — no nudges needed right now 🎉</p>
            ) : (
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-amber-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Added By</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Days Since Invited</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sortedNudge.map(c => (
                    <tr key={c.id} className="hover:bg-amber-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={c.name} colorName={c.created_by} size="sm" />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                              <span className="text-base" title="Needs a nudge">🔔</span>
                            </div>
                            <p className="text-xs text-gray-400 font-mono">{c.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{c.phone || '—'}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[160px]">{c.email || '—'}</p>
                      </td>
                      <td className="px-4 py-3">
                        {c.created_by ? (
                          <div className="flex items-center gap-1.5">
                            <Avatar name={c.created_by} size="xs" />
                            <span className="text-xs text-gray-600">{c.created_by.split(' ')[0]}</span>
                          </div>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-amber-700">{businessDaysSince(c.created_at)} business days</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setNudgeCustomer(c)}
                            className="text-xs font-semibold px-2.5 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap"
                          >
                            🔔 Nudge
                          </button>
                          <button
                            onClick={() => setSmsCustomer(c)}
                            className="text-xs font-semibold px-2.5 py-1.5 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors whitespace-nowrap"
                          >
                            📱 Send Link
                          </button>
                          <button
                            onClick={() => setConfirmDelete(c)}
                            className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
      )}

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
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <SortableHeader label="Name"    colKey="name"    activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Contact" colKey="email"   activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Tier"    colKey="tier"    activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Added By</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Referral Link</th>
                <SortableHeader label="Joined"  colKey="_joined" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedCustomers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={c.name} colorName={c.created_by} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{c.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-600">{c.phone || '—'}</p>
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">{c.email || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge label={c.tier ?? 'Bronze'} type="tier" />
                  </td>
                  <td className="px-4 py-3">
                    {c.created_by ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar name={c.created_by} size="xs" />
                        <span className="text-xs text-gray-600">{c.created_by.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 font-mono truncate max-w-[140px]">
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSmsCustomer(c)}
                        className="text-xs font-semibold px-2.5 py-1.5 bg-brand-red text-white rounded-lg hover:bg-brand-red-dark transition-colors whitespace-nowrap"
                      >
                        📱 Send Link
                      </button>
                      {needsNudge(c) && (
                        <button
                          onClick={() => setNudgeCustomer(c)}
                          className="text-xs font-semibold px-2.5 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors whitespace-nowrap"
                          title="Send a friendly reminder"
                        >
                          🔔 Nudge
                        </button>
                      )}
                      <button
                        onClick={() => setEditing(c)}
                        className="text-sm text-gray-500 hover:text-gray-800 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDelete(c)}
                        className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs font-medium text-gray-700">{activeList.length} customer{activeList.length !== 1 ? 's' : ''}</p>

      {/* Modals */}
      {showAdd && (
        <AddCustomerModal
          onClose={() => setShowAdd(false)}
          onAdd={handleAddCustomer}
        />
      )}
      {editing && (
        <EditCustomerModal
          customer={editing}
          onClose={() => setEditing(null)}
          onSave={updateCustomer}
        />
      )}
      {smsCustomer && (
        <SmsModal customer={smsCustomer} onClose={() => setSmsCustomer(null)} />
      )}
      {nudgeCustomer && (
        <NudgeModal customer={nudgeCustomer} onClose={() => setNudgeCustomer(null)} />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDelete(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete Customer?</h3>
            <p className="text-sm text-gray-500 mb-5">
              <strong>{confirmDelete.name}</strong> will be moved to the Deleted tab. You can restore them at any time.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="flex-1 px-4 py-2 text-sm font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
