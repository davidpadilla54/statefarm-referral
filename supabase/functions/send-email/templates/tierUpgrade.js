export function tierUpgradeHtml({ customerName, previousTier, newTier, newAmount }) {
  const tierEmoji = { Bronze: '🥉', Silver: '🥈', Gold: '🥇', Platinum: '💎' }

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
        <tr><td style="background:#CC0000;padding:24px 32px;text-align:center;">
          <p style="margin:0;color:#fca5a5;font-size:12px;text-transform:uppercase;letter-spacing:1px;">David Padilla — State Farm</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">Customer Tier Upgrade 🏆</h1>
        </td></tr>
        <tr><td style="padding:28px 32px;text-align:center;">
          <p style="color:#374151;font-size:15px;margin:0 0 24px;text-align:left;"><strong>${customerName}</strong> just reached a new reward tier!</p>
          <div style="display:flex;justify-content:center;gap:24px;margin-bottom:24px;">
            <div style="text-align:center;">
              <p style="font-size:32px;margin:0;">${tierEmoji[previousTier] ?? '⭐'}</p>
              <p style="margin:4px 0 0;font-size:13px;color:#6b7280;">${previousTier}</p>
            </div>
            <div style="font-size:28px;color:#CC0000;align-self:center;">→</div>
            <div style="text-align:center;">
              <p style="font-size:32px;margin:0;">${tierEmoji[newTier] ?? '⭐'}</p>
              <p style="margin:4px 0 0;font-size:13px;font-weight:700;color:#CC0000;">${newTier}</p>
            </div>
          </div>
          <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin-bottom:20px;">
            <p style="margin:0;color:#991b1b;font-size:15px;font-weight:700;">New earn rate: $${newAmount} per referral</p>
          </div>
          <p style="color:#374151;font-size:13px;text-align:left;margin:0 0 8px;">This is a great opportunity to reach out personally to ${customerName} to congratulate them and encourage more referrals at their new earn rate.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #f3f4f6;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">David Padilla · State Farm · 904-398-0401 · david.padilla.vaf43r@statefarm.com</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
