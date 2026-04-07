-- Login Activity Tracking
-- Run in Supabase SQL Editor to enable the Login Activity tab in the staff dashboard.

CREATE TABLE IF NOT EXISTS login_activity (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_email    text        NOT NULL,
  staff_name     text,
  logged_in_at   timestamptz DEFAULT now()
);

ALTER TABLE login_activity ENABLE ROW LEVEL SECURITY;

-- Staff can record their own logins
CREATE POLICY "insert_own_login" ON login_activity
  FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = staff_email);

-- Any authenticated user can read all login activity
CREATE POLICY "read_all_logins" ON login_activity
  FOR SELECT USING (auth.role() = 'authenticated');
