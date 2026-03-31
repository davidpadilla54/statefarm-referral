export function referralQuotedCustomerHtml({ customerName, referredName, amount, tierName }) {
  const first = (customerName ?? 'there').split(' ')[0]
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
        <tr><td style="background:#CC0000;padding:24px 32px;text-align:center;">
          <p style="margin:0;color:#fca5a5;font-size:12px;text-transform:uppercase;letter-spacing:1px;">David Padilla — State Farm</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">Great News, ${first}! 🎁</h1>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">Your referral <strong>${referredName}</strong> just completed an insurance quote with our office!</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center;">
            <p style="margin:0;color:#166534;font-size:13px;font-weight:600;">Gift Card Earned</p>
            <p style="margin:8px 0 0;color:#15803d;font-size:36px;font-weight:800;">$${amount}</p>
            <p style="margin:4px 0 0;color:#16a34a;font-size:13px;">${tierName} tier reward</p>
          </div>
          <p style="color:#374151;font-size:14px;margin:0 0 12px;">Your gift card will be sent to you shortly. We'll send you another email once it's on the way.</p>
          <p style="color:#6b7280;font-size:13px;margin:0;">Keep referring — there's no limit to how many you can earn! Questions? Call us at <strong>904-398-0401</strong>.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">David Padilla · State Farm · 904-398-0401 · david.padilla.vaf43r@statefarm.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
