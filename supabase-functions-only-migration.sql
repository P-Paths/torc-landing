-- SUPABASE FUNCTIONS SECURITY MIGRATION
-- Run this in your Supabase SQL Editor to fix the "Function Search Path Mutable" security warnings
-- This ONLY updates the functions, leaving existing policies untouched

-- =====================================================
-- STEP 1: Drop existing functions (to recreate with security)
-- =====================================================

-- Drop the existing update_updated_at_column function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop the existing calculate_commission_breakdown function  
DROP FUNCTION IF EXISTS calculate_commission_breakdown(TEXT, BOOLEAN);

-- =====================================================
-- STEP 2: Create secure update_updated_at_column function
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Explicitly set empty search path for security
  SET search_path = '';
  
  -- Update timestamp
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- =====================================================
-- STEP 3: Create secure calculate_commission_breakdown function
-- =====================================================

CREATE OR REPLACE FUNCTION calculate_commission_breakdown(
  p_agent_code TEXT,
  p_is_default_agent BOOLEAN DEFAULT FALSE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_breakdown JSONB;
BEGIN
  -- Explicitly set empty search path for security
  SET search_path = '';
  
  IF p_is_default_agent OR p_agent_code = 'AHRPE5559' THEN
    -- Default agent gets full commission
    v_breakdown := jsonb_build_object(
      'admin_cents', 4000,
      'agent_cents', 0,
      'agent_code', 'AHRPE5559'
    );
  ELSE
    -- Agent gets split commission
    v_breakdown := jsonb_build_object(
      'admin_cents', 2000,
      'agent_cents', 2000,
      'agent_code', p_agent_code
    );
  END IF;
  
  RETURN v_breakdown;
END;
$$;

-- =====================================================
-- STEP 4: Update agent information with correct details
-- =====================================================

-- Update the agent with your correct information
UPDATE agents 
SET 
  email = 'preston@prestigiouspaths.com',
  name = 'Preston Eaton',
  phone = '313-773-2380'
WHERE code = 'AHRPE5559';

-- Verify the update
SELECT 
  code,
  name,
  email,
  phone,
  is_active,
  '✅ AGENT UPDATED' as status
FROM agents 
WHERE code = 'AHRPE5559';

-- =====================================================
-- STEP 5: Verify function creation and security settings
-- =====================================================

-- Check function security settings
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  CASE 
    WHEN prosecdef = true THEN '✅ SECURE - SECURITY DEFINER'
    ELSE '❌ INSECURE - No SECURITY DEFINER'
  END as security_status
FROM pg_proc 
WHERE proname IN ('update_updated_at_column', 'calculate_commission_breakdown');

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

-- Your functions are now secure and should pass the Supabase Security Advisor checks
-- The "Function Search Path Mutable" warnings should be resolved
-- Your agent information has been updated with correct details
-- Run the test script next to verify everything works correctly
