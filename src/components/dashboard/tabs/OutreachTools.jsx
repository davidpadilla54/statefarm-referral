import { useState } from 'react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import { useToast } from '../../ui/ToastProvider'

function toSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function OutreachTools() {
  const [name, setName] = useState('')
  const toast = useToast()
  const siteUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin

  const slug = toSlug(name)
  const referralLink = slug ? `${siteUrl}/refer?c=${slug}` : ''

  const smsTemplate = slug
    ? `Hi [Friend's Name]! I've been working with David Padilla at State Farm and they're great. I just referred you for a free quote — check it out: ${referralLink} 🏠`
    : ''

  const emailSubject = name ? `${name} referred you for a free insurance quote!` : ''
  const emailBody = slug
    ? `Hi there,\n\nYour friend ${name} referred you to David Padilla's State Farm agency for a free insurance quote.\n\nClick the link below to learn more and share your info:\n${referralLink}\n\nQuestions? Call David directly at 904-398-0401.\n\nBest,\nDavid Padilla\nState Farm Agent\n904-398-0401 | www.davidinsuresflorida.com`
    : ''

  function copy(text, label) {
    navigator.clipboard.writeText(text).then(() => toast(`${label} copied!`, 'success'))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-xl font-bold text-gray-900">Outreach Tools</h2>

      <Card>
        <label className="text-sm font-medium text-gray-700 block mb-2">Customer Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Sarah Johnson"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red mb-4"
        />

        {/* Referral Link */}
        <div className="space-y-1 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Referral Link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={referralLink}
              placeholder="Enter customer name above…"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600"
            />
            <Button size="sm" disabled={!referralLink} onClick={() => copy(referralLink, 'Link')}>
              Copy
            </Button>
          </div>
        </div>

        {/* SMS */}
        <div className="space-y-1 mb-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SMS Template</p>
          <div className="relative">
            <textarea
              readOnly
              value={smsTemplate}
              rows={3}
              placeholder="Enter customer name above…"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 resize-none"
            />
            <Button
              size="sm"
              disabled={!smsTemplate}
              onClick={() => copy(smsTemplate, 'SMS')}
              className="absolute top-2 right-2"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Template</p>
          <div className="flex gap-2 mb-2">
            <input
              readOnly
              value={emailSubject}
              placeholder="Subject line…"
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600"
            />
            <Button size="sm" disabled={!emailSubject} onClick={() => copy(emailSubject, 'Subject')}>
              Copy
            </Button>
          </div>
          <div className="relative">
            <textarea
              readOnly
              value={emailBody}
              rows={7}
              placeholder="Enter customer name above…"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600 resize-none font-mono"
            />
            <Button
              size="sm"
              disabled={!emailBody}
              onClick={() => copy(emailBody, 'Email body')}
              className="absolute top-2 right-2"
            >
              Copy
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
