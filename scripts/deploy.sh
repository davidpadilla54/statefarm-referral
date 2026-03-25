#!/bin/bash
# =============================================================================
# State Farm Referral — Supabase Deploy Script
# Run this once after creating your Supabase project.
# Usage: ./scripts/deploy.sh YOUR_PROJECT_REF YOUR_RESEND_API_KEY
# Example: ./scripts/deploy.sh abcdefghijklmnop re_xxxxxxxxxxxxxxxxxxxx
# =============================================================================

set -e

PROJECT_REF=${1:?"Usage: ./scripts/deploy.sh <PROJECT_REF> <RESEND_API_KEY>"}
RESEND_API_KEY=${2:?"Usage: ./scripts/deploy.sh <PROJECT_REF> <RESEND_API_KEY>"}

echo "🚀 Deploying to Supabase project: $PROJECT_REF"
echo ""

# ── 1. Check Supabase CLI is installed ────────────────────────────────────────
if ! command -v supabase &> /dev/null; then
  echo "❌ Supabase CLI not found. Install it first:"
  echo "   brew install supabase/tap/supabase"
  exit 1
fi

# ── 2. Login check ────────────────────────────────────────────────────────────
echo "🔐 Checking Supabase login..."
supabase projects list > /dev/null 2>&1 || {
  echo "   Not logged in. Running: supabase login"
  supabase login
}

# ── 3. Set Resend API key as secret ───────────────────────────────────────────
echo "🔑 Setting RESEND_API_KEY secret..."
supabase secrets set RESEND_API_KEY="$RESEND_API_KEY" --project-ref "$PROJECT_REF"
echo "   ✅ Secret set"

# ── 4. Deploy send-email edge function ────────────────────────────────────────
echo "📧 Deploying send-email edge function..."
supabase functions deploy send-email --project-ref "$PROJECT_REF" --no-verify-jwt
echo "   ✅ Edge function deployed"

# ── 5. Print next steps ───────────────────────────────────────────────────────
echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "  1. Update .env.local with your Supabase URL + anon key"
echo "  2. Run the SQL in SETUP.md via Supabase SQL Editor"
echo "  3. Create your auth user in Supabase → Authentication → Users"
echo "  4. npm run dev"
echo ""
echo "Edge function URL:"
echo "  https://$PROJECT_REF.supabase.co/functions/v1/send-email"
