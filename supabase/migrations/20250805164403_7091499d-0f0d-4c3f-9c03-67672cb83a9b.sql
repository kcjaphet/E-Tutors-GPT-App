-- Fix the search path security warning
CREATE OR REPLACE FUNCTION public.check_duplicate_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if email already exists in auth.users
  IF EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = NEW.email 
    AND id != NEW.id
  ) THEN
    RAISE EXCEPTION 'An account with this email already exists';
  END IF;
  
  RETURN NEW;
END;
$$;