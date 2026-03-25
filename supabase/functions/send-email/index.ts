import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
// @deno-types="npm:@types/node"
import { newReferralHtml } from './templates/newReferral.js'
import { statusQuotedHtml } from './templates/statusQuoted.js'
import { tierUpgradeHtml } from './templates/tierUpgrade.js'

const AGENT_EMAIL = 'david.padilla.vaf43r@statefarm.com'
const FROM = 'David Padilla State Farm <noreply@davidinsuresflorida.com>'
const RESEND_URL = 'https://api.resend.com/emails'

const SUBJECTS: Record<string, string> = {
  new_referral:  '📋 New Referral Submitted',
  status_quoted: '✅ Referral Quoted — Gift Card Earned',
  tier_upgrade:  '🏆 Customer Tier Upgrade',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type, x-user-token',
      },
    })
  }

  try {
    const { type, payload } = await req.json()
    const apiKey = Deno.env.get('RESEND_API_KEY')

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let html: string
    switch (type) {
      case 'new_referral':  html = newReferralHtml(payload); break
      case 'status_quoted': html = statusQuotedHtml(payload); break
      case 'tier_upgrade':  html = tierUpgradeHtml(payload);  break
      default:
        return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), { status: 400 })
    }

    const res = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [AGENT_EMAIL],
        subject: SUBJECTS[type],
        html,
      }),
    })

    const result = await res.json()

    return new Response(JSON.stringify(result), {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
