-- Fix security configurations for commercial deployment

-- 1. Set shorter OTP expiry time (1 hour instead of default 24 hours)
UPDATE auth.config 
SET 
  otp_exp = 3600,  -- 1 hour in seconds
  password_min_length = 8,
  password_require_lowercase = true,
  password_require_uppercase = true,
  password_require_numbers = true,
  password_require_symbols = true
WHERE true;

-- 2. Enable leaked password protection
UPDATE auth.config 
SET password_breach_protection = true
WHERE true;