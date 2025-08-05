-- First, remove any existing trigger if it exists
DROP TRIGGER IF EXISTS check_duplicate_email_trigger ON auth.users;

-- Create a trigger to prevent duplicate emails during user creation
CREATE TRIGGER check_duplicate_email_trigger
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.check_duplicate_email();