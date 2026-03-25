import { supabase } from './supabase'

/**
 * Sends an email by calling the Supabase Edge Function proxy.
 * The Resend API key lives only in the edge function environment.
 *
 * @param {'new_referral'|'status_quoted'|'tier_upgrade'} type
 * @param {object} payload
 */
export async function sendEmail(type, payload) {
  const { data: { session } } = await supabase.auth.getSession()

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        ...(session?.access_token ? { 'x-user-token': session.access_token } : {}),
      },
      body: JSON.stringify({ type, payload }),
    }
  )

  if (!res.ok) {
    const text = await res.text()
    console.error('Email send failed:', text)
  }
}
