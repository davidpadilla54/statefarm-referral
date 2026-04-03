import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { newReferralHtml }            from './templates/newReferral.js'
import { statusQuotedHtml }           from './templates/statusQuoted.js'
import { tierUpgradeHtml }            from './templates/tierUpgrade.js'
import { giftCardSentHtml }           from './templates/giftCardSent.js'
import { customerConfirmationHtml }   from './templates/customerConfirmation.js'
import { referralQuotedCustomerHtml } from './templates/referralQuotedCustomer.js'

const AGENT_EMAIL    = 'davidpadilla54@gmail.com'
const AGENT_SF_EMAIL = 'david.padilla.vaf43r@statefarm.com'
const FROM_NAME      = 'David Padilla – State Farm'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type, x-user-token',
}

// ── Send via Gmail SMTP using nodemailer ──────────────────────────────────────
async function sendMail(to: string[], subject: string, html: string, cc?: string[]) {
  const { default: nodemailer } = await import('npm:nodemailer@6')

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: Deno.env.get('GMAIL_USER'),
      pass: Deno.env.get('GMAIL_PASS'),
    },
  })

  const from = `${FROM_NAME} <${Deno.env.get('GMAIL_USER')}>`

  await transporter.sendMail({
    from,
    to: to.join(', '),
    cc: cc?.join(', '),
    subject,
    html,
  })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS })
  }

  try {
    const { type, payload } = await req.json()

    switch (type) {

      case 'new_referral': {
        const staffRecipients = [AGENT_EMAIL, AGENT_SF_EMAIL]
        if (payload.staffEmail && payload.staffEmail !== AGENT_EMAIL && payload.staffEmail !== AGENT_SF_EMAIL) {
          staffRecipients.push(payload.staffEmail)
        }
        await sendMail(staffRecipients, '📋 New Referral Submitted', newReferralHtml(payload))
        if (payload.customerEmail) {
          await sendMail([payload.customerEmail], '✅ We received your referral!', customerConfirmationHtml(payload), [AGENT_EMAIL, AGENT_SF_EMAIL])
        }
        break
      }

      case 'status_quoted': {
        await sendMail([AGENT_EMAIL, AGENT_SF_EMAIL], '✅ Referral Quoted — Gift Card Earned', statusQuotedHtml(payload))
        break
      }

      case 'referral_quoted_customer': {
        if (!payload.customerEmail) break
        await sendMail([payload.customerEmail], '🎁 Great news — your referral was quoted!', referralQuotedCustomerHtml(payload), [AGENT_EMAIL])
        break
      }

      case 'tier_upgrade': {
        await sendMail([AGENT_EMAIL, AGENT_SF_EMAIL], '🏆 Customer Tier Upgrade', tierUpgradeHtml(payload))
        break
      }

      case 'gift_card_sent': {
        const to = payload.customerEmail ?? AGENT_EMAIL
        const cc = to !== AGENT_EMAIL ? [AGENT_EMAIL, AGENT_SF_EMAIL] : [AGENT_SF_EMAIL]
        await sendMail([to], '🎁 Your Gift Card Has Been Sent!', giftCardSentHtml(payload), cc)
        break
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
        })
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    })
  }
})
