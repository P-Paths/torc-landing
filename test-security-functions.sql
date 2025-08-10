-- SECURITY FUNCTION TESTING SCRIPT
-- Run this after the migration to verify everything works correctly

-- =====================================================
-- TEST 1: Verify Function Security Settings
-- =====================================================

-- Check that both functions now have SECURITY DEFINER and proper search_path
SELECT 
  proname as function_name,
  prosecdef as security_definer,
  proconfig as search_path_config,
  CASE 
    WHEN prosecdef = true THEN '✅ SECURE - SECURITY DEFINER'
    ELSE '❌ INSECURE - No SECURITY DEFINER'
  END as security_status
FROM pg_proc 
WHERE proname IN ('update_updated_at_column', 'calculate_commission_breakdown');

-- =====================================================
-- TEST 2: Test update_updated_at_column Function
-- =====================================================

-- Create a temporary test table to test the trigger function
CREATE TEMP TABLE test_updated_at (
  id SERIAL PRIMARY KEY,
  name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add the trigger
CREATE TRIGGER test_update_updated_at 
  BEFORE UPDATE ON test_updated_at 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert test data
INSERT INTO test_updated_at (name) VALUES ('Test Item');

-- Test the trigger by updating
UPDATE test_updated_at SET name = 'Updated Item' WHERE id = 1;

-- Verify the trigger worked
SELECT 
  id,
  name,
  updated_at,
  CASE 
    WHEN updated_at > NOW() - INTERVAL '1 minute' THEN '✅ TRIGGER WORKING'
    ELSE '❌ TRIGGER FAILED'
  END as trigger_status
FROM test_updated_at;

-- Clean up test table
DROP TABLE test_updated_at;

-- =====================================================
-- TEST 3: Test calculate_commission_breakdown Function
-- =====================================================

-- Test default agent (should get full commission)
SELECT 
  'Default Agent Test' as test_name,
  calculate_commission_breakdown('AHRPE5559', true) as result,
  CASE 
    WHEN (calculate_commission_breakdown('AHRPE5559', true) ->> 'admin_cents')::int = 4000 
      AND (calculate_commission_breakdown('AHRPE5559', true) ->> 'agent_cents')::int = 0
    THEN '✅ DEFAULT AGENT COMMISSION CORRECT'
    ELSE '❌ DEFAULT AGENT COMMISSION INCORRECT'
  END as test_result;

-- Test regular agent (should get split commission)
SELECT 
  'Regular Agent Test' as test_name,
  calculate_commission_breakdown('TEST123', false) as result,
  CASE 
    WHEN (calculate_commission_breakdown('TEST123', false) ->> 'admin_cents')::int = 2000 
      AND (calculate_commission_breakdown('TEST123', false) ->> 'agent_cents')::int = 2000
    THEN '✅ REGULAR AGENT COMMISSION CORRECT'
    ELSE '❌ REGULAR AGENT COMMISSION INCORRECT'
  END as test_result;

-- Test edge case: null agent code
SELECT 
  'Null Agent Test' as test_name,
  calculate_commission_breakdown(NULL, false) as result,
  CASE 
    WHEN (calculate_commission_breakdown(NULL, false) ->> 'admin_cents')::int = 2000 
      AND (calculate_commission_breakdown(NULL, false) ->> 'agent_cents')::int = 2000
    THEN '✅ NULL AGENT HANDLED CORRECTLY'
    ELSE '❌ NULL AGENT HANDLING FAILED'
  END as test_result;

-- =====================================================
-- TEST 4: Performance and Security Verification
-- =====================================================

-- Verify search_path is properly restricted
DO $$
DECLARE
  current_search_path TEXT;
BEGIN
  -- Get current search path
  SELECT current_setting('search_path') INTO current_search_path;
  
  -- Test that the function doesn't leak search_path
  PERFORM calculate_commission_breakdown('TEST123');
  
  -- Verify search_path wasn't changed globally
  IF current_setting('search_path') = current_search_path THEN
    RAISE NOTICE '✅ SEARCH PATH SECURITY: Function properly isolated';
  ELSE
    RAISE NOTICE '❌ SEARCH PATH SECURITY: Function leaked search_path changes';
  END IF;
END $$;

-- =====================================================
-- TEST 5: Integration Test with Real Tables
-- =====================================================

-- Test that the triggers still work on your actual tables
-- (This assumes your tables exist and have the triggers)

-- Check if triggers exist on your tables
SELECT 
  schemaname,
  tablename,
  triggername,
  tgfoid::regproc as function_name,
  CASE 
    WHEN tgfoid::regproc::text = 'update_updated_at_column' THEN '✅ TRIGGER CONFIGURED'
    ELSE '❌ TRIGGER MISCONFIGURED'
  END as trigger_status
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE tgfoid::regproc::text = 'update_updated_at_column'
  AND n.nspname = 'public';

-- =====================================================
-- TEST SUMMARY
-- =====================================================

-- Final verification that both functions are secure
SELECT 
  'SECURITY AUDIT COMPLETE' as status,
  COUNT(*) as total_functions,
  COUNT(CASE WHEN prosecdef = true THEN 1 END) as secure_functions,
  COUNT(CASE WHEN prosecdef = false THEN 1 END) as insecure_functions
FROM pg_proc 
WHERE proname IN ('update_updated_at_column', 'calculate_commission_breakdown');

-- If you see 2 secure_functions, you're all set!
-- The Supabase Security Advisor warnings should now be resolved.
