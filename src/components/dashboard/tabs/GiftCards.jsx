import { useState } from 'react'
import { useGiftCards } from '../../../hooks/useGiftCards'
import { useSortable } from '../../../hooks/useSortable'
import { useStaffRole } from '../../../hooks/useStaffRole'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import Input from '../../ui/Input'
import Skeleton from '../../ui/Skeleton'
import SortableHeader from '../../ui/SortableHeader'
import Tooltip from '../../ui/Tooltip'
import { useToast } from '../../ui/ToastProvider'
import { sendEmail } from '../../../lib/resend'
import { TIERS } from '../../../lib/tiers'

const DAVID_EMAIL = 'davidpadilla54@gmail.com'

const GC_EMOJI = { Amazon: '📦', Starbucks: '☕', Target: '🎯', Walmart: '🛒', "Lowe's": '🔨' }

// ── Edit Gift Card Modal ─────────────────────────────────────────────────────
function EditGiftCardModal({ gc, onClose, onSave }) {
  const [tier, setTier]     = useState(gc.tier)
  const [amount, setAmount] = useState(String(gc.amount))
  const [status, setStatus] = useState(gc.status)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(gc.id, { tier, amount: Number(amount), status })
      toast('Gift card updated!', 'success')
      onClose()
    } catch (err) {
      toast(err?.message ?? 'Update failed', 'error')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">Edit Gift Card</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            <strong>{gc.customers?.name}</strong> → {gc.referrals?.referred_name}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Tier</label>
              <select
                value={tier}
                onChange={e => {
                  const t = TIERS.find(t => t.name === e.target.value)
                  setTier(e.target.value)
                  if (t) setAmount(String(t.amount))
                }}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                {TIERS.map(t => <option key={t.name} value={t.name}>{t.name} (${t.amount})</option>)}
              </select>
            </div>
            <Input
              label="Amount ($)"
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              >
                <option value="Pending">Pending</option>
                <option value="Sent">Sent</option>
              </select>
            </div>
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

export default function GiftCards() {
  const { giftCards, loading, markSent, deleteGiftCard, editGiftCard } = useGiftCards()
  const { role } = useStaffRole()
  const toast = useToast()
  const isAdmin = role === 'agent'

  const [editingGC, setEditingGC]       = useState(null)
  const [confirmDeleteGC, setConfirmDeleteGC] = useState(null)

  async function handleMarkSent(id) {
    const gc = giftCards.find(g => g.id === id)
    await markSent(id)
    toast('Gift card marked as sent!', 'success')
    if (gc?.customers?.email) {
      sendEmail('gift_card_sent', {
        customerName:  gc.customers.name ?? 'there',
        customerEmail: gc.customers.email,
        referredName:  gc.referrals?.referred_name ?? 'your referral',
        amount:        Number(gc.amount).toFixed(0),
        tier:          gc.tier,
        agentEmail:    DAVID_EMAIL,
      }).catch(console.error)
    }
  }

  async function handleDelete() {
    try {
      await deleteGiftCard(confirmDeleteGC.id)
      toast('Gift card deleted.', 'success')
    } catch (err) {
      toast(err?.message ?? 'Delete failed', 'error')
    } finally {
      setConfirmDeleteGC(null)
    }
  }

  const pending = giftCards.filter(g => g.status === 'Pending')
  const sent    = giftCards.filter(g => g.status === 'Sent')

  const flatForSort = giftCards.map(gc => ({
    ...gc,
    _customer:   gc.customers?.name ?? '',
    _referral:   gc.referrals?.referred_name ?? '',
    _preference: gc.referrals?.gift_card_preference ?? '',
    _date:       gc.earned_at ?? '',
  }))
  const { sorted: sortedGC, sortKey, sortDir, handleSort } = useSortable(flatForSort, '_date', 'desc')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <h2 className="text-xl font-bold text-gray-900">Gift Cards</h2>
          <Tooltip text="Gift cards are automatically created when a referral is marked Quoted or Won. Only David can mark them as sent or edit/delete them." position="right" />
        </div>
        <div className="flex gap-3 text-sm">
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-medium">
            {pending.length} Pending
          </span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
            {sent.length} Sent
          </span>
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
          Only David Padilla can mark gift cards as sent or make edits.
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-4 space-y-3">
            {[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : giftCards.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">🎁</div>
            <p className="font-medium">No gift cards yet</p>
            <p className="text-sm mt-1">They'll appear here when a referral is marked Quoted or Won.</p>
          </div>
        ) : (
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <SortableHeader label="Customer"    colKey="_customer"   activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Referral"    colKey="_referral"   activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Gift Card"   colKey="_preference" activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Tier"        colKey="tier"        activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Amount"      colKey="amount"      activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Date Earned" colKey="_date"       activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                <SortableHeader label="Status"      colKey="status"      activeSortKey={sortKey} dir={sortDir} onSort={handleSort} />
                {isAdmin && <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedGC.map(gc => (
                <tr key={gc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{gc.customers?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{gc.referrals?.referred_name ?? '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {gc.referrals?.gift_card_preference
                      ? <span className="inline-flex items-center gap-1">
                          <span>{GC_EMOJI[gc.referrals.gift_card_preference] ?? '🎁'}</span>
                          {gc.referrals.gift_card_preference}
                        </span>
                      : <span className="text-gray-400">—</span>
                    }
                  </td>
                  <td className="px-4 py-3"><Badge label={gc.tier} type="tier" /></td>
                  <td className="px-4 py-3 text-sm font-bold text-green-700">${Number(gc.amount).toFixed(0)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {new Date(gc.earned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3"><Badge label={gc.status} /></td>
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {gc.status === 'Pending' && (
                          <Button size="sm" variant="secondary" onClick={() => handleMarkSent(gc.id)}>
                            Mark Sent
                          </Button>
                        )}
                        <button
                          onClick={() => setEditingGC(gc)}
                          className="text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setConfirmDeleteGC(gc)}
                          className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingGC && (
        <EditGiftCardModal
          gc={editingGC}
          onClose={() => setEditingGC(null)}
          onSave={editGiftCard}
        />
      )}

      {/* Delete Confirm */}
      {confirmDeleteGC && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfirmDeleteGC(null)} />
          <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-base font-bold text-gray-900 mb-2">Delete Gift Card?</h3>
            <p className="text-sm text-gray-500 mb-5">
              This will permanently remove the <strong>${Number(confirmDeleteGC.amount).toFixed(0)}</strong> gift card for <strong>{confirmDeleteGC.customers?.name}</strong>. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteGC(null)}
                className="flex-1 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
