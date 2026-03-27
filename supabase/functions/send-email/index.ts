import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { newReferralHtml } from './templates/newReferral.js'
import { statusQuotedHtml } from './templates/statusQuoted.js'
import { tierUpgradeHtml } from './templates/tierUpgrade.js'
import { giftCardSentHtml } from './templates/giftCardSent.js'

const AGENT_EMAIL = 'david.padilla.vaf43r@statefarm.com'
const FROM = 'David Padilla State Farm <onboarding@resend.dev>'
const RESEND_URL = 'https://api.resend.com/emails'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-user-token',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  try {
    const { type, payload } = await req.json()
    const apiKey = Deno.env.get('RESEND_API_KEY')

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
      })
    }

    let html: string
    let toEmail: string = AGENT_EMAIL
    let subject: string

    switch (type) {
      case 'new_referral':
        html = newReferralHtml(payload)
        subject = '📋 New Referral Submitted'
        toEmail = AGENT_EMAIL
        break
      case 'status_quoted':
        html = statusQuotedHtml(payload)
        subject = '✅ Referral Quoted — Gift Card Earned'
        toEmail = AGENT_EMAIL
        break
      case 'tier_upgrade':
        html = tierUpgradeHtml(payload)
        subject = '🏆 Customer Tier Upgrade'
        toEmail = AGENT_EMAIL
        break
      case 'gift_card_sent':
        html = giftCardSentHtml(payload)
        subject = '🎁 Your Gift Card Has Been Sent!'
        toEmail = payload.customerEmail ?? AGENT_EMAIL
        break
      default:
        return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        })
    }

    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: [toEmail], subject, html }),
    })

    const result = await res.json()

    return new Response(JSON.stringify(result), {
      status: res.status,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
})
