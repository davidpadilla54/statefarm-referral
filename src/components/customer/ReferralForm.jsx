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
const MAX_PERSONS = 3
const emptyPerson = () => ({ name: '', phone: '', email: '' })

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

// ── Single person slot ──────────────────────────────────────────────────────
function PersonSlot({ index, person, onChange, errors, tr, isCollapsed, onExpand }) {
  const label = tr.personLabel(index + 1)
  const isOptional = index > 0

  if (isCollapsed) {
    return (
      <button
        type="button"
        onClick={onExpand}
        className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-brand-red hover:text-brand-red transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-400">
            {index + 1}
          </span>
          <div className="text-left">
            <p className="text-sm font-semibold">{index === 1 ? tr.addSecondPerson : tr.addThirdPerson}</p>
            <p className="text-xs">{tr.optionalReferral}</p>
          </div>
        </div>
        <span className="w-8 h-8 rounded-full border-2 border-current flex items-center justify-center text-lg font-light">+</span>
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
      {/* Slot header */}
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full bg-brand-red flex items-center justify-center text-xs font-bold text-white shrink-0">
          {index + 1}
        </span>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        {isOptional && <span className="text-xs text-gray-400 ml-auto">{tr.optionalReferral}</span>}
      </div>

      <Input
        label={tr.friendName}
        placeholder="Jane Smith"
        value={person.name}
        onChange={e => onChange(index, 'name', e.target.value)}
        error={errors?.[`name_${index}`]}
      />
      <Input
        label={tr.friendPhone}
        type="tel"
        placeholder="(904) 555-0100"
        value={person.phone}
        onChange={e => onChange(index, 'phone', e.target.value)}
        error={errors?.[`phone_${index}`]}
      />
      <Input
        label={tr.friendEmail}
        type="email"
        placeholder="jane@example.com"
        value={person.email}
        onChange={e => onChange(index, 'email', e.target.value)}
        error={errors?.[`email_${index}`]}
      />
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────
export default function ReferralForm({ customer, quotedCount, staffId, tr, lang }) {
  const navigate = useNavigate()
  const [persons, setPersons] = useState([emptyPerson()])
  const [interests, setInterests] = useState([])
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  // How many slots are visible (1–3)
  const visibleCount = persons.length

  function updatePerson(i, field, val) {
    setPersons(prev => prev.map((p, idx) => idx === i ? { ...p, [field]: val } : p))
  }

  function addPerson() {
    if (persons.length < MAX_PERSONS) {
      setPersons(prev => [...prev, emptyPerson()])
    }
  }

  // Persons that actually count: have name + phone
  const validPersons = persons.filter(p => p.name.trim() && p.phone.trim())

  function validate() {
    const e = {}
    persons.forEach((p, i) => {
      const hasAnyData = p.name.trim() || p.phone.trim() || p.email.trim()
      // Person 0 is always required; others only if they have data
      if (i === 0 || hasAnyData) {
        if (!p.name.trim()) e[`name_${i}`] = tr.errName
        if (!p.phone.trim()) e[`phone_${i}`] = tr.errPhone
        if (p.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
          e[`email_${i}`] = tr.errEmailInvalid
        }
      }
    })
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSubmitting(true)
    setErrors({})

    try {
      // Insert each valid person as a separate referral row
      const toInsert = persons
        .filter(p => p.name.trim() && p.phone.trim())
        .map(p => ({
          customer_id: customer.id,
          referred_name: p.name.trim(),
          referred_phone: p.phone.trim(),
          referred_email: p.email.trim() || null,
          insurance_interest: interests,
          assigned_to: staffId ?? null,
          status: 'New',
        }))

      const { error } = await supabase.from('referrals').insert(toInsert)
      if (error) throw error

      const tier = getTierForCount(quotedCount)

      // Send one email per referral to agent
      toInsert.forEach(ref => {
        sendEmail('new_referral', {
          referredBy: customer.name,
          referredName: ref.referred_name,
          referredPhone: ref.referred_phone,
          referredEmail: ref.referred_email ?? '',
          insuranceInterest: interests,
          currentTier: tier.name,
          tierAmount: tier.amount,
        }).catch(console.error)
      })

      launchConfetti()
      navigate('/thank-you', {
        state: { firstName: customer.name.split(' ')[0], slug: customer.slug, lang, count: toInsert.length },
      })
    } catch (err) {
      console.error(err)
      setErrors({ submit: tr.errSubmit })
      setSubmitting(false)
    }
  }

  const submitLabel = submitting
    ? tr.submittingBtn
    : typeof tr.submitBtn === 'function'
      ? tr.submitBtn(validPersons.length || 1)
      : tr.submitBtn

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-1">{tr.referFriend}</h2>
      <p className="text-sm text-gray-500 mb-5">{tr.referFriendSub}</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-3">
        {/* Person slots */}
        {Array.from({ length: MAX_PERSONS }).map((_, i) => {
          if (i < visibleCount) {
            return (
              <PersonSlot
                key={i}
                index={i}
                person={persons[i]}
                onChange={updatePerson}
                errors={errors}
                tr={tr}
                isCollapsed={false}
              />
            )
          }
          // Show collapsed "add" button for next available slot only
          if (i === visibleCount) {
            return (
              <PersonSlot
                key={i}
                index={i}
                person={emptyPerson()}
                onChange={() => {}}
                errors={{}}
                tr={tr}
                isCollapsed={true}
                onExpand={addPerson}
              />
            )
          }
          return null
        })}

        {/* Insurance interest — shared */}
        <div className="pt-1">
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
          {submitLabel}
        </Button>

        <p className="text-xs text-gray-400 text-center pt-1">
          Gift cards are awarded only when a referred contact is reachable and completes a quote with our office.
        </p>
      </form>
    </Card>
  )
}
