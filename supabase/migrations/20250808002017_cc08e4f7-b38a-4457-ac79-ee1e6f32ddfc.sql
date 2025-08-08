-- Add email uniqueness constraint and trigger for auth.users
CREATE OR REPLACE FUNCTION public.check_duplicate_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Create trigger to prevent duplicate emails on user creation
DROP TRIGGER IF EXISTS check_duplicate_email_trigger ON auth.users;
CREATE TRIGGER check_duplicate_email_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_duplicate_email();