import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { sendEmail } from '../../lib/resend'
import { getTierForCount } from '../../lib/tiers'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Toggle from '../ui/Toggle'
import Card from '../ui/Card'

const INTEREST_KEYS = ['Auto', 'Home', 'Life', 'Health', 'Business']

function launchConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const colors = ['#CC0000', '#FFD700', '#ffffff', '#28a745', '#17a2b8', '#fd7e14']
  const pieces = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * canvas.height * 0.3,
    w: 7 + Math.random() * 7,
    h: 4 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 2.5 + Math.random() * 3.5,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.15,
    drift: (Math.random() - 0.5) * 1.5,
    opacity: 1,
  }))

  let frame
  let tick = 0
  function animate() {
    tick++
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    let done = true
    pieces.forEach(p => {
      p.y += p.speed
      p.x += p.drift
      p.angle += p.spin
      if (tick > 80) p.opacity = Math.max(0, p.opacity - 0.02)
      if (p.y < canvas.height + 20) done = false
      ctx.save()
      ctx.globalAlpha = p.opacity
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
      ctx.restore()
    })
    if (!done && tick < 160) {
      frame = requestAnimationFrame(animate)
    } else {
      cancelAnimationFrame(frame)
      canvas.remove()
    }
  }
  animate()
}

export default function ReferralForm({ customer, quotedCount, staffId, tr, lang }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', email: '' })
  const [interests, setInterests] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function validate() {
    const e = {}
    if (!form.name.trim()) e.name = tr.errName
    if (!form.phone.trim()) e.phone = tr.errPhone
    if (!form.email.trim()) e.email = tr.errEmail
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = tr.errEmailInvalid
    return e
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

      sendEmail('new_referral', {
        referredBy: customer.name,
        referredName: form.name.trim(),
        referredPhone: form.phone.trim(),
        referredEmail: form.email.trim(),
        insuranceInterest: interests,
        currentTier: tier.name,
        tierAmount: tier.amount,
      }).catch(console.error)

      launchConfetti()
      navigate('/thank-you', { state: { firstName: customer.name.split(' ')[0], slug: customer.slug, lang } })
    } catch (err) {
      console.error(err)
      setErrors({ submit: tr.errSubmit })
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{tr.referFriend}</h2>
      <p className="text-sm text-gray-500 mb-5">{tr.referFriendSub}</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label={tr.friendName}
          placeholder="Jane Smith"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          error={errors.name}
        />
        <Input
          label={tr.friendPhone}
          type="tel"
          placeholder="(904) 555-0100"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          error={errors.phone}
        />
        <Input
          label={tr.friendEmail}
          type="email"
          placeholder="jane@example.com"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          error={errors.email}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            {tr.insuranceInterest} <span className="text-gray-400 font-normal">{tr.insuranceOptional}</span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {INTEREST_KEYS.map((key, i) => (
              <Toggle
                key={key}
                label={tr.insuranceOptions[i]}
                active={interests.includes(key)}
                onClick={() => setInterests(prev =>
                  prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
                )}
              />
            ))}
          </div>
        </div>

        {errors.submit && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errors.submit}
          </p>
        )}

        <Button type="submit" size="lg" disabled={submitting} className="w-full mt-2">
          {submitting ? tr.submittingBtn : tr.submitBtn}
        </Button>
      </form>
    </Card>
  )
}
