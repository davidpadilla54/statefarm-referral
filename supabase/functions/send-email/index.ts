import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { newReferralHtml }           from './templates/newReferral.js'
import { statusQuotedHtml }          from './templates/statusQuoted.js'
import { tierUpgradeHtml }           from './templates/tierUpgrade.js'
import { giftCardSentHtml }          from './templates/giftCardSent.js'
import { customerConfirmationHtml }  from './templates/customerConfirmation.js'
import { referralQuotedCustomerHtml } from './templates/referralQuotedCustomer.js'

const AGENT_EMAIL = 'david.padilla.vaf43r@statefarm.com'
const FROM        = 'David Padilla State Farm <onboarding@resend.dev>'
const RESEND_URL  = 'https://api.resend.com/emails'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-user-token',
}

async function sendOne(apiKey: string, to: string[], subject: string, html: string, cc?: string[]) {
  const body: Record<string, unknown> = { from: FROM, to, subject, html }
  if (cc && cc.length) body.cc = cc
  const res = await fetch(RESEND_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res
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

    let res

    switch (type) {

      // ── New Referral: notify agent + staff, confirm to customer ──
      case 'new_referral': {
        const staffRecipients = [AGENT_EMAIL]
        if (payload.staffEmail && payload.staffEmail !== AGENT_EMAIL) {
          staffRecipients.push(payload.staffEmail)
        }
        // Notification to staff/agent
        res = await sendOne(apiKey, staffRecipients, '📋 New Referral Submitted', newReferralHtml(payload))
        // Confirmation to customer (if email provided)
        if (payload.customerEmail) {
          await sendOne(apiKey, [payload.customerEmail], '✅ We received your referral!', customerConfirmationHtml(payload), [AGENT_EMAIL])
        }
        break
      }

      // ── Referral Quoted: notify agent, notify customer ──
      case 'status_quoted': {
        res = await sendOne(apiKey, [AGENT_EMAIL], '✅ Referral Quoted — Gift Card Earned', statusQuotedHtml(payload))
        break
      }

      // ── Referral Quoted — customer notification ──
      case 'referral_quoted_customer': {
        if (!payload.customerEmail) {
          return new Response(JSON.stringify({ error: 'customerEmail required' }), {
            status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
          })
        }
        res = await sendOne(
          apiKey,
          [payload.customerEmail],
          '🎁 Great news — your referral was quoted!',
          referralQuotedCustomerHtml(payload),
          [AGENT_EMAIL],
        )
        break
      }

      // ── Tier Upgrade ──
      case 'tier_upgrade': {
        res = await sendOne(apiKey, [AGENT_EMAIL], '🏆 Customer Tier Upgrade', tierUpgradeHtml(payload))
        break
      }

      // ── Gift Card Sent: email customer, CC agent ──
      case 'gift_card_sent': {
        const toEmail = payload.customerEmail ?? AGENT_EMAIL
        res = await sendOne(
          apiKey,
          [toEmail],
          '🎁 Your Gift Card Has Been Sent!',
          giftCardSentHtml(payload),
          toEmail !== AGENT_EMAIL ? [AGENT_EMAIL] : undefined,
        )
        break
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown email type: ${type}` }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        })
    }

    const result = await res!.json()
    return new Response(JSON.stringify(result), {
      status: res!.status,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
})
