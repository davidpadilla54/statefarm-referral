import { useState, useEffect } from 'react'
import { Copy, MessageSquare, Mail, Link, UserPlus, CheckCircle } from 'lucide-react'
import Card from '../../ui/Card'
import Button from '../../ui/Button'
import Tooltip from '../../ui/Tooltip'
import { useToast } from '../../ui/ToastProvider'
import { supabase } from '../../../lib/supabase'

function toSlug(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export default function OutreachTools() {
  const [name, setName]               = useState('')
  const [phone, setPhone]             = useState('')
  const [email, setEmail]             = useState('')
  const [staffList, setStaffList]     = useState([])
  const [selectedStaffId, setSelectedStaffId] = useState('')
  const [creating, setCreating]       = useState(false)
  const [createError, setCreateError] = useState(null)
  const [createdSlug, setCreatedSlug] = useState(null)   // set after DB insert
  const toast = useToast()
  const siteUrl = import.meta.env.VITE_SITE_URL ?? window.location.origin

  useEffect(() => {
    supabase.from('staff').select('id, name').eq('active', true).order('name')
      .then(({ data }) => { if (data) setStaffList(data) })
  }, [])

  // Reset created state whenever name or staff changes
  function handleNameChange(val) {
    setName(val)
    setCreatedSlug(null)
    setCreateError(null)
  }
  function handleStaffChange(val) {
    setSelectedStaffId(val)
    setCreatedSlug(null)
    setCreateError(null)
  }

  const slug         = toSlug(name)
  const referralLink = createdSlug ? `${siteUrl}/refer?c=${createdSlug}` : ''
  const canCreate    = slug && selectedStaffId && !createdSlug

  async function handleCreate() {
    setCreating(true)
    setCreateError(null)
    try {
      const staffMember = staffList.find(s => s.id === selectedStaffId)
      const { error } = await supabase.from('customers').insert({
        name:       name.trim(),
        slug,
        phone:      phone.trim() || null,
        email:      email.trim() || null,
        created_by: staffMember?.name ?? null,
      })
      if (error) {
        if (error.code === '23505') {
          setCreateError('A customer with this name already exists. Try adding a middle initial.')
        } else {
          setCreateError(error.message)
        }
        return
      }
      setCreatedSlug(slug)
      toast(`${name.trim()} added! Link is ready.`, 'success')
    } finally {
      setCreating(false)
    }
  }

  const firstName = name.split(' ')[0]

  const smsTemplate = referralLink
    ? `Hey ${firstName}! It's [Your Name] from David Padilla – State Farm 🏠\n\nYou're enrolled in our Referral Rewards Program! Know anyone who could use auto, home, or life insurance? Use your personal link to enter their info and earn a gift card when they get a quote:\n\n${referralLink}\n\nIt only takes a minute — and there's no limit to how many you can refer! Questions? Just reply! 😊`
    : ''

  const emailSubject = name ? `${name} — Your Referral Rewards Link` : ''
  const emailBody    = referralLink
    ? `Hi ${firstName},\n\nThank you for being a valued client of David Padilla – State Farm!\n\nYou're enrolled in our Referral Rewards Program. Use your personal link below to submit a friend or family member's info and earn a gift card when they get a quote:\n\n${referralLink}\n\nThere's no limit — refer as many people as you'd like!\n\nQuestions? Call us at 904-398-0401.\n\nBest,\nDavid Padilla\nState Farm Agent\n904-398-0401`
    : ''

  function copy(text, label) {
    navigator.clipboard.writeText(text).then(() => toast(`${label} copied!`, 'success'))
  }

  function resetForm() {
    setName('')
    setPhone('')
    setEmail('')
    setSelectedStaffId('')
    setCreatedSlug(null)
    setCreateError(null)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-1">
        <h2 className="text-xl font-bold text-gray-900">Outreach Tools</h2>
        <Tooltip text="Add a customer and generate a referral link + ready-to-send templates. Select your name, fill in the customer details, then click Create Customer to register them and unlock the templates." position="right" />
      </div>

      {/* How to use */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800">
        <p className="font-semibold mb-1">How to use this tool:</p>
        <ol className="list-decimal list-inside space-y-1 text-blue-700">
          <li>Select your name below</li>
          <li>Enter the customer's name and contact info</li>
          <li>Click <strong>Create Customer</strong> — this adds them to the system</li>
          <li>Copy the SMS or email template and send it from your own device</li>
        </ol>
        <p className="mt-2 text-xs text-blue-600">Note: The customer must be created in the system before their referral link works. For customers already in the system, use the <strong>Send Link</strong> button in the Customers tab.</p>
      </div>

      <Card>
        {/* Staff selector */}
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Your Name
          <Tooltip text="Select your name so the customer is assigned to you." />
        </label>
        <select
          value={selectedStaffId}
          onChange={e => handleStaffChange(e.target.value)}
          disabled={!!createdSlug}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red mb-4 disabled:opacity-50 disabled:bg-gray-50"
        >
          <option value="">Select your name…</option>
          {staffList.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {/* Customer Name */}
        <label className="text-sm font-medium text-gray-700 block mb-2">Customer Name *</label>
        <input
          value={name}
          onChange={e => handleNameChange(e.target.value)}
          placeholder="e.g. Sarah Johnson"
          disabled={!!createdSlug}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red mb-3 disabled:opacity-50 disabled:bg-gray-50"
        />

        {/* Phone */}
        <label className="text-sm font-medium text-gray-700 block mb-2">Phone</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="(904) 555-0100"
          type="tel"
          disabled={!!createdSlug}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red mb-3 disabled:opacity-50 disabled:bg-gray-50"
        />

        {/* Email */}
        <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="sarah@example.com"
          type="email"
          disabled={!!createdSlug}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-red mb-4 disabled:opacity-50 disabled:bg-gray-50"
        />

        {/* Error */}
        {createError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">
            {createError}
          </p>
        )}

        {/* Create button or success banner */}
        {!createdSlug ? (
          <Button
            onClick={handleCreate}
            disabled={!canCreate || creating}
            className="w-full"
          >
            <UserPlus size={15} className="mr-2" />
            {creating ? 'Creating…' : 'Create Customer & Generate Link'}
          </Button>
        ) : (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle size={18} />
              <span className="text-sm font-semibold">{name} added to the system!</span>
            </div>
            <button onClick={resetForm} className="text-xs text-green-600 hover:text-green-800 underline font-medium">
              Add another
            </button>
          </div>
        )}

        {/* Templates — shown only after customer is created */}
        {createdSlug && (
          <div className="space-y-4 mt-4">
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
