import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { sendEmail } from '../../lib/resend'
import { getTierForCount } from '../../lib/tiers'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Toggle from '../ui/Toggle'
import Card from '../ui/Card'

const INSURANCE_OPTIONS = ['Auto', 'Home', 'Life']

export default function ReferralForm({ customer, quotedCount, staffId }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [interests, setInterests] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    if (!form.email.trim()) e.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    return e
  }

  function toggleInterest(interest) {
    setInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    setErrors({})

    try {
      const { error } = await supabase.from('referrals').insert({
        customer_id: customer.id,
        referred_name: form.name.trim(),
        referred_phone: form.phone.trim(),
        referred_email: form.email.trim(),
        insurance_interest: interests,
        assigned_to: staffId ?? null,
        status: 'New',
      })

      if (error) throw error

      const tier = getTierForCount(quotedCount)

      // Fire email alert (non-blocking)
      sendEmail('new_referral', {
        referredBy: customer.name,
        referredName: form.name.trim(),
        referredPhone: form.phone.trim(),
        referredEmail: form.email.trim(),
        insuranceInterest: interests,
        currentTier: tier.name,
        tierAmount: tier.amount,
      }).catch(console.error)

      navigate('/thank-you', { state: { firstName: customer.name.split(' ')[0] } })
    } catch (err) {
      console.error(err)
      setErrors({ submit: 'Something went wrong. Please try again.' })
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-1">Refer a Friend</h2>
      <p className="text-sm text-gray-500 mb-5">Fill in their details and we'll take it from there.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Friend's Full Name *"
          placeholder="Jane Smith"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          error={errors.name}
        />
        <Input
          label="Friend's Phone Number *"
          type="tel"
          placeholder="(904) 555-0100"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          error={errors.phone}
        />
        <Input
          label="Friend's Email Address *"
          type="email"
          placeholder="jane@example.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          error={errors.email}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Insurance Interest <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {INSURANCE_OPTIONS.map(opt => (
              <Toggle
                key={opt}
                label={opt}
                active={interests.includes(opt)}
                onClick={() => toggleInterest(opt)}
              />
            ))}
          </div>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.submit}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="w-full mt-2"
        >
          {submitting ? 'Submitting…' : 'Submit Referral'}
        </Button>
      </form>
    </Card>
  )
}
