import { useState } from 'react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import { sendEmail } from '../../../lib/resend'
import { useToast } from '../../ui/ToastProvider'

const ALERT_TYPES = [
  { key: 'new_referral',  label: 'New Referral Submitted',    desc: 'Fires when a customer submits a new referral.' },
  { key: 'status_quoted', label: 'Referral Status → Quoted',  desc: 'Fires when you mark a referral as Quoted.' },
  { key: 'tier_upgrade',  label: 'Customer Tier Upgrade',     desc: 'Fires when a customer moves to a higher tier.' },
]

const PREVIEW_SUBJECTS = {
  new_referral:  '📋 New Referral: Jane Smith referred by Sarah Johnson',
  status_quoted: '✅ Referral Quoted: Jane Smith — $20 gift card earned',
  tier_upgrade:  '🏆 Tier Upgrade: Sarah Johnson reached Silver!',
}

export default function AlertSettings() {
  const [enabled, setEnabled] = useState({ new_referral: true, status_quoted: true, tier_upgrade: true })
  const [preview, setPreview] = useState('new_referral')
  const [sending, setSending] = useState(false)
  const toast = useToast()

  function toggle(key) {
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function sendTest() {
    setSending(true)
    const testPayloads = {
      new_referral:  { referredBy: 'Sarah Johnson', referredName: 'Jane Smith', referredPhone: '(904) 555-0100', referredEmail: 'jane@example.com', insuranceInterest: ['Auto', 'Home'], currentTier: 'Bronze', tierAmount: 10 },
      status_quoted: { referredName: 'Jane Smith', referredBy: 'Sarah Johnson', tierName: 'Silver', amount: 20 },
      tier_upgrade:  { customerName: 'Sarah Johnson', previousTier: 'Bronze', newTier: 'Silver', newAmount: 20 },
    }
    await sendEmail(preview, testPayloads[preview])
    setSending(false)
    toast('Test email sent!', 'success')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900">Alert Settings</h2>

      <Card>
        <h3 className="font-semibold text-gray-800 mb-4">Email Alerts</h3>
        <p className="text-sm text-gray-500 mb-4">All alerts are sent to <strong>david.padilla.vaf43r@statefarm.com</strong></p>

        <div className="space-y-4">
          {ALERT_TYPES.map(a => (
            <div key={a.key} className="flex items-start gap-3">
              <button
                onClick={() => toggle(a.key)}
                className={`relative w-11 h-6 rounded-full transition-colors shrink-0 mt-0.5
                  ${enabled[a.key] ? 'bg-brand-red' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled[a.key] ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <div>
                <p className="text-sm font-medium text-gray-800">{a.label}</p>
                <p className="text-xs text-gray-500">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Live preview */}
      <Card>
        <h3 className="font-semibold text-gray-800 mb-3">Email Preview</h3>
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
