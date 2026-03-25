export function statusQuotedHtml({ referredName, referredBy, tierName, amount }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
        <tr><td style="background:#CC0000;padding:24px 32px;text-align:center;">
          <p style="margin:0;color:#fca5a5;font-size:12px;text-transform:uppercase;letter-spacing:1px;">David Padilla — State Farm</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">Referral Quoted ✅</h1>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="color:#374151;font-size:15px;margin:0 0 20px;">A referral has been marked as <strong>Quoted</strong>. A gift card has been automatically created.</p>
          <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:20px;margin-bottom:20px;text-align:center;">
            <p style="margin:0;color:#166534;font-size:13px;font-weight:600;">Gift Card Earned</p>
            <p style="margin:8px 0 0;color:#15803d;font-size:36px;font-weight:800;">$${amount}</p>
            <p style="margin:4px 0 0;color:#16a34a;font-size:13px;">${tierName} tier · Referral: ${referredName}</p>
          </div>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:20px;">
            ${row('Referral Name', referredName)}
            ${row('Referred By', referredBy)}
            ${row('Tier at Time of Quote', tierName)}
            ${row('Gift Card Amount', `$${amount}`, true)}
          </table>
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;font-size:13px;color:#92400e;">
            <strong>Reminder:</strong> Don't forget to send ${referredBy}'s gift card! Mark it as "Sent" in the dashboard once delivered.
          </div>
        </td></tr>
        ${footer()}
      </table>
    </td></tr>
  </table>
</body></html>`
}

function row(label, value, highlight = false) {
  const bg = highlight ? '#f0fdf4' : '#fff'
  return `<tr style="background:${bg};">
    <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#6b7280;border-bottom:1px solid #f3f4f6;width:40%;">${label}</td>
    <td style="padding:10px 16px;font-size:13px;color:#111827;border-bottom:1px solid #f3f4f6;">${value}</td>
  </tr>`
}

function footer() {
  return `<tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
    <p style="margin:0;color:#9ca3af;font-size:12px;">David Padilla · State Farm · 904-398-0401 · david.padilla.vaf43r@statefarm.com</p>
  </td></tr>`
}
