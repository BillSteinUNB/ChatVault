-- Test Suite for Supabase Database Schema
-- This file contains SQL tests to verify the database schema is correct
-- Run these tests in the Supabase SQL Editor

-- Test 1: Verify subscriptions table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'subscriptions'
  ) THEN
    RAISE NOTICE '✓ Test 1 PASSED: subscriptions table exists';
  ELSE
    RAISE EXCEPTION '✗ Test 1 FAILED: subscriptions table does not exist';
  END IF;
END $$;

-- Test 2: Verify subscriptions table has all required columns
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscriptions'
    AND column_name IN ('id', 'user_id', 'stripe_customer_id', 'stripe_subscription_id', 'tier', 'status', 'current_period_end', 'created_at', 'updated_at')
    GROUP BY table_name
    HAVING COUNT(DISTINCT column_name) = 9
  ) THEN
    RAISE NOTICE '✓ Test 2 PASSED: subscriptions table has all required columns';
  ELSE
    RAISE EXCEPTION '✗ Test 2 FAILED: subscriptions table is missing required columns';
  END IF;
END $$;

-- Test 3: Verify subscriptions table has correct constraints
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
      AND tc.table_name = kcu.table_name
    WHERE tc.table_schema = 'public'
    AND tc.table_name = 'subscriptions'
    AND tc.constraint_type = 'PRIMARY KEY'
    AND kcu.column_name = 'id'
  ) THEN
    RAISE NOTICE '✓ Test 3 PASSED: subscriptions.id is primary key';
  ELSE
    RAISE EXCEPTION '✗ Test 3 FAILED: subscriptions.id is not a primary key';
  END IF;
END $$;

-- Test 4: Verify user_id has foreign key constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
      AND tc.table_name = kcu.table_name
    WHERE tc.table_schema = 'public'
    AND tc.table_name = 'subscriptions'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'user_id'
  ) THEN
    RAISE NOTICE '✓ Test 4 PASSED: subscriptions.user_id has foreign key to auth.users';
  ELSE
    RAISE EXCEPTION '✗ Test 4 FAILED: subscriptions.user_id does not have foreign key constraint';
  END IF;
END $$;

-- Test 5: Verify user_id has UNIQUE constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
      AND tc.table_name = kcu.table_name
    WHERE tc.table_schema = 'public'
    AND tc.table_name = 'subscriptions'
    AND tc.constraint_type = 'UNIQUE'
    AND kcu.column_name = 'user_id'
  ) THEN
    RAISE NOTICE '✓ Test 5 PASSED: subscriptions.user_id has UNIQUE constraint';
  ELSE
    RAISE EXCEPTION '✗ Test 5 FAILED: subscriptions.user_id does not have UNIQUE constraint';
  END IF;
END $$;

-- Test 6: Verify tier column has CHECK constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu
      ON cc.constraint_name = ccu.constraint_name
    WHERE ccu.table_schema = 'public'
    AND ccu.table_name = 'subscriptions'
    AND ccu.column_name = 'tier'
    AND cc.check_clause LIKE '%hobbyist%'
    AND cc.check_clause LIKE '%power_user%'
    AND cc.check_clause LIKE '%team%'
  ) THEN
    RAISE NOTICE '✓ Test 6 PASSED: subscriptions.tier has correct CHECK constraint';
  ELSE
    RAISE EXCEPTION '✗ Test 6 FAILED: subscriptions.tier does not have correct CHECK constraint';
  END IF;
END $$;

-- Test 7: Verify status column has CHECK constraint
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.check_constraints cc
    JOIN information_schema.constraint_column_usage ccu
      ON cc.constraint_name = ccu.constraint_name
    WHERE ccu.table_schema = 'public'
    AND ccu.table_name = 'subscriptions'
    AND ccu.column_name = 'status'
    AND cc.check_clause LIKE '%active%'
    AND cc.check_clause LIKE '%past_due%'
    AND cc.check_clause LIKE '%canceled%'
    AND cc.check_clause LIKE '%unpaid%'
  ) THEN
    RAISE NOTICE '✓ Test 7 PASSED: subscriptions.status has correct CHECK constraint';
  ELSE
    RAISE EXCEPTION '✗ Test 7 FAILED: subscriptions.status does not have correct CHECK constraint';
  END IF;
END $$;

-- Test 8: Verify RLS is enabled on subscriptions table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_tables
    WHERE schemaname = 'public'
    AND tablename = 'subscriptions'
    AND rowsecurity = true
  ) THEN
    RAISE NOTICE '✓ Test 8 PASSED: RLS is enabled on subscriptions table';
  ELSE
    RAISE EXCEPTION '✗ Test 8 FAILED: RLS is not enabled on subscriptions table';
  END IF;
END $$;

-- Test 9: Verify RLS policies exist for subscriptions
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  AND tablename = 'subscriptions';

  IF policy_count >= 3 THEN
    RAISE NOTICE '✓ Test 9 PASSED: subscriptions table has RLS policies (found % policies)', policy_count;
  ELSE
    RAISE EXCEPTION '✗ Test 9 FAILED: subscriptions table does not have enough RLS policies (found % policies)', policy_count;
  END IF;
END $$;

-- Test 10: Verify indexes exist on subscriptions table
DO $$
DECLARE
  index_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'subscriptions'
    AND indexname LIKE 'subscriptions_%_idx';

  IF index_count >= 3 THEN
    RAISE NOTICE '✓ Test 10 PASSED: subscriptions table has indexes (found % indexes)', index_count;
  ELSE
    RAISE EXCEPTION '✗ Test 10 FAILED: subscriptions table does not have enough indexes (found % indexes)', index_count;
  END IF;
END $$;

-- Test 11: Verify trigger exists for updated_at
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.triggers
    WHERE event_object_schema = 'public'
    AND event_object_table = 'subscriptions'
    AND trigger_name = 'update_subscriptions_updated_at'
  ) THEN
    RAISE NOTICE '✓ Test 11 PASSED: update_subscriptions_updated_at trigger exists';
  ELSE
    RAISE EXCEPTION '✗ Test 11 FAILED: update_subscriptions_updated_at trigger does not exist';
  END IF;
END $$;

-- Test 12: Verify trigger exists for automatic subscription creation
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.triggers
    WHERE event_object_schema = 'auth'
    AND event_object_table = 'users'
    AND trigger_name = 'on_auth_user_created_subscription'
  ) THEN
    RAISE NOTICE '✓ Test 12 PASSED: on_auth_user_created_subscription trigger exists';
  ELSE
    RAISE EXCEPTION '✗ Test 12 FAILED: on_auth_user_created_subscription trigger does not exist';
  END IF;
END $$;

-- Test 13: Verify update_updated_at_column function exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'update_updated_at_column'
    AND pronamespace = 'public'::regnamespace
  ) THEN
    RAISE NOTICE '✓ Test 13 PASSED: update_updated_at_column function exists';
  ELSE
    RAISE EXCEPTION '✗ Test 13 FAILED: update_updated_at_column function does not exist';
  END IF;
END $$;

-- Test 14: Verify handle_new_user_subscription function exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'handle_new_user_subscription'
    AND pronamespace = 'public'::regnamespace
  ) THEN
    RAISE NOTICE '✓ Test 14 PASSED: handle_new_user_subscription function exists';
  ELSE
    RAISE EXCEPTION '✗ Test 14 FAILED: handle_new_user_subscription function does not exist';
  END IF;
END $$;

-- Test 15: Verify default values are correct
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subscriptions'
    AND column_name = 'tier'
    AND column_default LIKE '%hobbyist%'
  ) AND EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'subscriptions'
    AND column_name = 'status'
    AND column_default LIKE '%active%'
  ) THEN
    RAISE NOTICE '✓ Test 15 PASSED: subscriptions table has correct default values';
  ELSE
    RAISE EXCEPTION '✗ Test 15 FAILED: subscriptions table does not have correct default values';
  END IF;
END $$;

RAISE NOTICE '';
RAISE NOTICE '========================================';
RAISE NOTICE 'All database schema tests completed!';
RAISE NOTICE '========================================';
