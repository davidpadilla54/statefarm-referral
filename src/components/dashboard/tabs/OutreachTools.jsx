import { useState, useEffect } from 'react'
import { Copy, MessageSquare, Mail, Link } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Tooltip from '../../ui/Tooltip'
import { useToast } from '../../ui/ToastProvider'
import { supabase } from '../../../lib/supabase'

function toSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function OutreachTools() {
  const [name, setName] = useState('')
  const [staffList, setStaffList] = useState([])
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const toast = useToast()
  const siteUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin

  useEffect(() => {
    supabase.from('staff').select('id, name').eq('active', true).order('name')
      .then(({ data }) => { if (data) setStaffList(data) })
  }, [])

  const slug = toSlug(name)
  const referralLink = slug && selectedStaffId
    ? `${siteUrl}/refer?c=${slug}`
    : ''

  const smsTemplate = referralLink
    ? `Hey ${name.split(' ')[0]}! It's [Your Name] from David Padilla – State Farm 🏠\n\nYou're enrolled in our Referral Rewards Program! Know anyone who could use auto, home, or life insurance? Use your personal link to enter their info and earn a gift card when they get a quote:\n\n${referralLink}\n\nIt only takes a minute — and there's no limit to how many you can refer! Questions? Just reply! 😊`
    : ''

  const emailSubject = name ? `${name} — Your Referral Rewards Link` : ''
  const emailBody = referralLink
    ? `Hi ${name.split(' ')[0]},\n\nThank you for being a valued client of David Padilla – State Farm!\n\nYou're enrolled in our Referral Rewards Program. Use your personal link below to submit a friend or family member's info and earn a gift card when they get a quote:\n\n${referralLink}\n\nThere's no limit — refer as many people as you'd like!\n\nQuestions? Call us at 904-398-0401.\n\nBest,\nDavid Padilla\nState Farm Agent\n904-398-0401`
    : ''

  function copy(text, label) {
    navigator.clipboard.writeText(text).then(() => toast(`${label} copied!`, 'success'))
  }

  const ready = referralLink !== ''

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-bold text-gray-900">Outreach Tools</h2>
        <Tooltip text="Generate ready-to-use referral links and message templates for any customer. Select your name and enter the customer's name, then copy the SMS or email template to reach out directly from your own phone or email app." position="right" />
      </div>

      {/* How to use */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800">
        <p className="font-semibold mb-1">How to use this tool:</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-700">
          <li>Select your name below</li>
          <li>Type the customer's name to generate their personal referral link</li>
          <li>Copy the SMS or email template and send it from your own device</li>
        </ol>
        <p className="mt-2 text-xs text-blue-600">Note: This generates copy-paste templates. Messages are sent from your own phone or email, not the system. For system-tracked sends, use the <strong>Send Link</strong> button in the Customers tab.</p>
      </div>

      <Card>
        {/* Staff selector */}
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Your Name
          <Tooltip text="Select your name so the generated link and templates are personalized correctly." />
        </label>
        <select
          value={selectedStaffId}
          onChange={e => setSelectedStaffId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red mb-4"
        >
          <option value="">Select your name…</option>
          {staffList.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <label className="text-sm font-medium text-gray-700 block mb-2">Customer Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Sarah Johnson"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red mb-4"
        />

        {!ready && (
          <p className="text-sm text-gray-400 text-center py-4">Select your name and enter a customer name to generate templates.</p>
        )}

        {ready && (
          <div className="space-y-4">
            {/* Referral Link */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Link size={14} className="text-gray-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referral Link</p>
              </div>
              <div className="flex gap-2">
                <input readOnly value={referralLink} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600" />
                <Button size="sm" onClick={() => copy(referralLink, 'Link')}><Copy size={13} className="mr-1" />Copy</Button>
              </div>
            </div>

            {/* SMS */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <MessageSquare size={14} className="text-gray-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SMS Template</p>
              </div>
              <div className="relative">
                <textarea readOnly value={smsTemplate} rows={5} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 resize-none" />
                <Button size="sm" onClick={() => copy(smsTemplate, 'SMS')} className="absolute top-2 right-2">
                  <Copy size={13} className="mr-1" />Copy
                </Button>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <Mail size={14} className="text-gray-500" />
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Template</p>
              </div>
              <div className="flex gap-2 mb-2">
                <input readOnly value={emailSubject} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600" />
                <Button size="sm" onClick={() => copy(emailSubject, 'Subject')}><Copy size={13} className="mr-1" />Copy</Button>
              </div>
              <div className="relative">
                <textarea readOnly value={emailBody} rows={8} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 resize-none font-mono" />
                <Button size="sm" onClick={() => copy(emailBody, 'Email body')} className="absolute top-2 right-2">
                  <Copy size={13} className="mr-1" />Copy
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
