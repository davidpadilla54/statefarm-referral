import { useState } from 'react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Tooltip from '../../ui/Tooltip'
import { sendEmail } from '../../../lib/resend'
import { useToast } from '../../ui/ToastProvider'

const ALERT_TYPES = [
  {
    key: 'new_referral',
    label: 'New Referral Submitted',
    desc: 'You and the submitting staff member both get an email + the customer gets a confirmation when a referral is submitted.',
  },
  {
    key: 'status_quoted',
    label: 'Referral Marked Quoted',
    desc: 'You get notified and the customer who submitted the referral gets an email letting them know their referral was quoted and a gift card is on the way.',
  },
  {
    key: 'gift_card_sent',
    label: 'Gift Card Sent',
    desc: 'The customer receives an email confirmation when you mark their gift card as sent.',
  },
  {
    key: 'tier_upgrade',
    label: 'Customer Tier Upgrade',
    desc: 'You get notified when a customer moves to a higher reward tier.',
  },
]

const PREVIEW_SUBJECTS = {
  new_referral:  '📋 New Referral Submitted — Jane Smith referred by Sarah Johnson',
  status_quoted: '✅ Referral Quoted — Jane Smith | Gift Card Earned',
  gift_card_sent:'🎁 Your Gift Card Has Been Sent!',
  tier_upgrade:  '🏆 Customer Tier Upgrade — Sarah Johnson reached Silver!',
}

export default function AlertSettings() {
  const [enabled, setEnabled] = useState({ new_referral: true, status_quoted: true, gift_card_sent: true, tier_upgrade: true })
  const [preview, setPreview] = useState('new_referral')
  const [sending, setSending] = useState(false)
  const toast = useToast()

  function toggle(key) {
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function sendTest() {
    setSending(true)
    const testPayloads = {
      new_referral: {
        referredBy: 'Sarah Johnson', referredName: 'Jane Smith',
        referredPhone: '(904) 555-0100', referredEmail: 'jane@example.com',
        insuranceInterest: ['Auto', 'Home'], currentTier: 'Bronze', tierAmount: 10,
      },
      status_quoted: { referredName: 'Jane Smith', referredBy: 'Sarah Johnson', tierName: 'Silver', amount: 20 },
      gift_card_sent: {
        customerName: 'Sarah Johnson', customerEmail: 'david.padilla.vaf43r@statefarm.com',
        referredName: 'Jane Smith', amount: '20', tier: 'Silver',
      },
      tier_upgrade: { customerName: 'Sarah Johnson', previousTier: 'Bronze', newTier: 'Silver', newAmount: 20 },
    }
    await sendEmail(preview, testPayloads[preview])
    setSending(false)
    toast('Test email sent to david.padilla.vaf43r@statefarm.com!', 'success')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-bold text-gray-900">Alert Settings</h2>
        <Tooltip text="Control which automated email notifications are active. All alerts go to your State Farm email. Customers receive their own confirmation emails separately." position="right" />
      </div>

      {/* Explanation */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800">
        <p className="font-semibold mb-1">How alerts work:</p>
        <p className="text-blue-700">This system sends automatic emails at key moments in the referral process — when a referral is submitted, when it's quoted, and when a gift card is sent. All alerts go to <strong>david.padilla.vaf43r@statefarm.com</strong> and the relevant customer/staff member where applicable.</p>
        <p className="mt-2 text-xs text-blue-600">Use the toggles below to enable/disable each type. Use "Send Test Email" to preview what each alert looks like before it goes live.</p>
      </div>

      <Card>
        <h3 className="font-semibold text-gray-800 mb-1">Email Alerts</h3>
        <p className="text-xs text-gray-400 mb-4">All alerts CC: <strong>david.padilla.vaf43r@statefarm.com</strong></p>

        <div className="space-y-5">
          {ALERT_TYPES.map(a => (
            <div key={a.key} className="flex items-start gap-3">
              <button
                onClick={() => toggle(a.key)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5
                  ${enabled[a.key] ? 'bg-brand-red' : 'bg-gray-200'}`}
                aria-label={`Toggle ${a.label}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled[a.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <div>
                <p className="text-sm font-medium text-gray-800">{a.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Live preview */}
      <Card>
        <div className="flex items-center gap-1 mb-3">
          <h3 className="font-semibold text-gray-800">Email Preview</h3>
          <Tooltip text="Select an alert type and click Send Test Email to receive a sample in your inbox. Great for verifying emails look correct before going live." />
        </div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {ALERT_TYPES.map(a => (
            <button
              key={a.key}
              onClick={() => setPreview(a.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                ${preview === a.key ? 'bg-brand-red text-white border-brand-red' : 'border-gray-200 text-gray-600 hover:border-brand-red'}`}
            >
              {a.label}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-1">Subject:</p>
          <p className="text-sm font-semibold text-gray-800 mb-3">{PREVIEW_SUBJECTS[preview]}</p>
          <p className="text-xs text-gray-400 mb-1">To: david.padilla.vaf43r@statefarm.com</p>
          <div className="border-t border-gray-200 mt-3 pt-3 text-xs text-gray-500 italic">
            Full HTML email with referral details, branding, and call-to-action.
          </div>
        </div>

        <div className="mt-4">
          <Button onClick={sendTest} disabled={sending} variant="secondary">
            {sending ? 'Sending…' : 'Send Test Email'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
