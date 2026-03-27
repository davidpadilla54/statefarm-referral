export function giftCardSentHtml({ customerName, referredName, amount, tier }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;max-width:560px;width:100%">
        <!-- Header -->
        <tr>
          <td style="background:#CC0000;padding:32px 32px 24px;text-align:center">
            <p style="color:#fff;font-size:13px;font-weight:600;letter-spacing:1px;margin:0 0 8px;text-transform:uppercase">David Padilla — State Farm</p>
            <h1 style="color:#fff;font-size:26px;font-weight:700;margin:0">🎁 Your Gift Card Is On Its Way!</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <p style="color:#111;font-size:16px;margin:0 0 16px">Hi <strong>${customerName}</strong>,</p>
            <p style="color:#444;font-size:15px;line-height:1.6;margin:0 0 24px">
              Great news — your referral for <strong>${referredName}</strong> has been quoted, and your <strong>${tier} tier</strong> gift card reward has been sent!
            </p>
            <!-- Reward box -->
            <div style="background:#f9f9f9;border:1px solid #eee;border-radius:8px;padding:20px;text-align:center;margin-bottom:24px">
              <p style="color:#888;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin:0 0 4px">Gift Card Amount</p>
              <p style="color:#16a34a;font-size:36px;font-weight:800;margin:0">$${amount}</p>
              <p style="color:#888;font-size:12px;margin:4px 0 0">${tier} Tier Reward</p>
            </div>
            <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 24px">
              Keep referring friends and family to earn even more! The more quotes completed, the higher your tier and the bigger your rewards.
            </p>
            <p style="color:#444;font-size:14px;margin:0">Questions? Don't hesitate to reach out.</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f5f5f5;padding:20px 32px;border-top:1px solid #eee">
            <p style="color:#999;font-size:12px;margin:0">David Padilla · State Farm Insurance Agent</p>
            <p style="color:#999;font-size:12px;margin:4px 0 0">📞 904-398-0401 · <a href="mailto:david.padilla.vaf43r@statefarm.com" style="color:#CC0000">david.padilla.vaf43r@statefarm.com</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
