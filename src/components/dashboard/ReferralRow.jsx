import { supabase } from '../../lib/supabase'
import { sendEmail } from '../../lib/resend'
import { getTierForCount } from '../../lib/tiers'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { useToast } from '../ui/ToastProvider'

const STATUSES = ['New', 'Attempted Contact', 'Quoted', 'Won', 'Lost']

export default function ReferralRow({ referral, isNew, onUpdated, onDelete }) {
  const toast = useToast()

  async function handleStatusChange(e) {
    const newStatus = e.target.value
    const oldStatus = referral.status

    await supabase.from('referrals').update({ status: newStatus }).eq('id', referral.id)

    // Auto-create gift card when moved to Quoted or Won (but not if already in a closed state)
    const closedStatuses = ['Quoted', 'Won']
    if (closedStatuses.includes(newStatus) && !closedStatuses.includes(oldStatus)) {
      const { data: refCount } = await supabase
        .from('referrals')
        .select('id', { count: 'exact' })
        .eq('customer_id', referral.customer_id)
        .in('status', ['Quoted', 'Won'])

      const quotedCount = (refCount?.length ?? 0)
      const tier = getTierForCount(quotedCount)

      await supabase.from('gift_cards').insert({
        referral_id: referral.id,
        customer_id: referral.customer_id,
        tier: tier.name,
        amount: tier.amount,
        status: 'Pending',
      })

      // Check for tier upgrade
      const { data: customer } = await supabase
        .from('customers')
        .select('tier, name, email')
        .eq('id', referral.customer_id)
        .single()

      if (customer && customer.tier !== tier.name) {
        await supabase.from('customers').update({ tier: tier.name }).eq('id', referral.customer_id)
        sendEmail('tier_upgrade', {
          customerName: customer.name,
          previousTier: customer.tier,
          newTier: tier.name,
          newAmount: tier.amount,
        }).catch(console.error)
      }

      // Notify agent (David)
      sendEmail('status_quoted', {
        referredName: referral.referred_name,
        referredBy: referral.customers?.name,
        tierName: tier.name,
        amount: tier.amount,
      }).catch(console.error)

      // Notify the customer who submitted the referral
      if (referral.customers?.email) {
        sendEmail('referral_quoted_customer', {
          customerName: referral.customers.name,
          customerEmail: referral.customers.email,
          referredName: referral.referred_name,
          amount: tier.amount,
          tierName: tier.name,
        }).catch(console.error)
      }

      toast(`Gift card created! (${newStatus})`, 'success')
    }

    onUpdated?.()
  }

  async function handleAssign(e) {
    await supabase.from('referrals').update({ assigned_to: e.target.value || null }).eq('id', referral.id)
    onUpdated?.()
  }

  const rowClass = `transition-colors duration-300 ${isNew ? 'animate-highlight' : ''}`
  const sentBy = referral.customers?.created_by ?? '—'

  return (
    <tr className={rowClass}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <Avatar name={referral.referred_name} colorName={sentBy} size="sm" />
          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{referral.referred_name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-500">{referral.referred_phone}</td>
      <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-[160px]">{referral.referred_email}</td>
      <td className="px-4 py-3 text-sm text-gray-700">{referral.customers?.name ?? '—'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5">
          <Avatar name={sentBy} size="sm" />
          <span className="text-sm text-gray-600">{sentBy}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        {referral.customers?.tier && <Badge label={referral.customers.tier} type="tier" />}
      </td>
      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
        {new Date(referral.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </td>
      <td className="px-4 py-3">
        <select
          defaultValue={referral.status}
          onChange={handleStatusChange}
          className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-brand-red"
        >
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onDelete}
          className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}
