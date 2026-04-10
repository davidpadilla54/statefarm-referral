-- ============================================================
-- Migration: Soft-delete columns + staff cleanup
-- Run in Supabase SQL Editor before (or right after) deploying.
-- ============================================================

-- 1. Add soft-delete columns to referrals
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE referrals ADD COLUMN IF NOT EXISTS deleted_by text;

-- 2. Add soft-delete columns to customers
ALTER TABLE customers ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE customers ADD COLUMN IF NOT EXISTS deleted_by text;

-- 3. Add role column to staff (needed for useStaffRole hook)
ALTER TABLE staff ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'staff';

-- 4. Set David as agent
UPDATE staff SET role = 'agent' WHERE email = 'david.padilla.vaf43r@statefarm.com';

-- 5. Remove Shelby Fidler:
--    First unassign any referrals so FK constraint doesn't block the delete
UPDATE referrals
  SET assigned_to = NULL
  WHERE assigned_to = (SELECT id FROM staff WHERE name ILIKE '%Shelby%' OR name ILIKE '%Fidler%' LIMIT 1);

DELETE FROM staff WHERE name ILIKE '%Shelby%' OR name ILIKE '%Fidler%';
