# Setup Guide — State Farm Referral Rewards

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name it `statefarm-referral`
3. Save your database password
4. Copy your **Project URL** and **anon public key** from Settings → API

## Step 2: Update .env.local

Edit `.env.local` and replace the placeholders:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SITE_URL=http://localhost:5173
```

## Step 3: Run Database SQL

Go to Supabase → SQL Editor → paste and run this entire block:

```sql
-- Tables
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  phone text,
  email text,
  tier text not null default 'Bronze' check (tier in ('Bronze','Silver','Gold','Platinum')),
  created_at timestamptz not null default now()
);

create table staff (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  active boolean not null default true,
  rotation_index integer not null default 0
);

create table referrals (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  referred_name text not null,
  referred_phone text,
  referred_email text,
  insurance_interest text[] not null default '{}',
  assigned_to uuid references staff(id),
  status text not null default 'New' check (status in ('New','Contacted','Quoted','Won','Lost')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table gift_cards (
  id uuid primary key default gen_random_uuid(),
  referral_id uuid not null references referrals(id) on delete cascade,
  customer_id uuid not null references customers(id) on delete cascade,
  tier text not null,
  amount numeric(6,2) not null,
  status text not null default 'Pending' check (status in ('Pending','Sent')),
  earned_at timestamptz not null default now(),
  sent_at timestamptz
);

-- Auto-update updated_at trigger
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger referrals_updated_at
  before update on referrals
  for each row execute function set_updated_at();

-- Round-robin staff assignment
create or replace function get_next_staff()
returns uuid language plpgsql as $$
declare
  staff_id uuid;
begin
  select id into staff_id
  from staff
  where active = true
  order by rotation_index asc, id asc
  limit 1;

  update staff set rotation_index = rotation_index + 1 where id = staff_id;
  return staff_id;
end $$;

-- RLS
alter table customers enable row level security;
alter table referrals enable row level security;
alter table staff enable row level security;
alter table gift_cards enable row level security;

create policy "public read customers"
  on customers for select using (true);

create policy "public insert referrals"
  on referrals for insert with check (true);

create policy "auth read referrals"
  on referrals for select using (auth.role() = 'authenticated');

create policy "auth update referrals"
  on referrals for update using (auth.role() = 'authenticated');

create policy "auth all gift_cards"
  on gift_cards for all using (auth.role() = 'authenticated');

create policy "auth all staff"
  on staff for all using (auth.role() = 'authenticated');

-- Seed: Add a test customer
insert into customers (name, slug, phone, email) values
  ('David Padilla', 'david-padilla', '904-398-0401', 'david.padilla.vaf43r@statefarm.com');

-- Seed: Add yourself as staff
insert into staff (name, email) values
  ('David Padilla', 'david.padilla.vaf43r@statefarm.com');
```

### Login Activity Table (added for Login Activity tab)

Run this separately (or append to the block above):

```sql
CREATE TABLE IF NOT EXISTS login_activity (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_email    text        NOT NULL,
  staff_name     text,
  logged_in_at   timestamptz DEFAULT now()
);

ALTER TABLE login_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_own_login" ON login_activity
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = staff_email);

CREATE POLICY "read_all_logins" ON login_activity
  FOR SELECT USING (auth.role() = 'authenticated');
```

## Step 4: Enable Realtime

Supabase → Database → Replication → toggle ON for the `referrals` table.

## Step 5: Create Dashboard Login

Supabase → Authentication → Users → Add User:
- Email: `david.padilla.vaf43r@statefarm.com`
- Password: (choose a strong password)
- Confirm email manually if needed

Also add to Authentication → URL Configuration:
- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**`

## Step 6: Start Dev Server

```bash
cd projects/statefarm-referral
npm run dev
```

Then visit:
- Customer page: http://localhost:5173/refer?c=david-padilla
- Staff login: http://localhost:5173/login

## Step 7: Email Alerts (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Install Supabase CLI: `brew install supabase/tap/supabase`
4. Deploy edge function:
   ```bash
   supabase login
   supabase functions deploy send-email --project-ref YOUR_PROJECT_REF
   supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxx --project-ref YOUR_PROJECT_REF
   ```
5. For production emails: verify `davidinsuresflorida.com` as sender domain in Resend

## Step 8: Deploy to Vercel

1. Push to a GitHub repo
2. vercel.com → New Project → import from GitHub
3. Framework: Vite
4. Add environment variables (same as .env.local)
5. Deploy

Update `.env.local` `VITE_SITE_URL` to your Vercel URL after deployment.
