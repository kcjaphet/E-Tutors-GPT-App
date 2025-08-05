-- Add unique constraint on email in profiles table
ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Create function to check for duplicate emails before signup
CREATE OR REPLACE FUNCTION public.check_duplicate_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create trigger to prevent duplicate email signups
DROP TRIGGER IF EXISTS check_duplicate_email_trigger ON auth.users;
CREATE TRIGGER check_duplicate_email_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_duplicate_email();