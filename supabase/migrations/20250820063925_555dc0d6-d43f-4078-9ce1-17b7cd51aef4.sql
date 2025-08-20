-- Add phone number support to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone_number TEXT,
ADD COLUMN phone_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN phone_verification_attempts INTEGER DEFAULT 0,
ADD COLUMN last_otp_sent TIMESTAMP WITH TIME ZONE;

-- Create unique index on phone_number to prevent duplicates
CREATE UNIQUE INDEX idx_profiles_phone_number ON public.profiles(phone_number) WHERE phone_number IS NOT NULL;

-- Create OTP tracking table
CREATE TABLE public.phone_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '5 minutes'),
  attempts INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on phone_otps table
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;

-- Create policies for phone_otps (only service role can manage OTPs for security)
CREATE POLICY "Service role can manage phone OTPs" 
ON public.phone_otps 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create index for cleanup and queries
CREATE INDEX idx_phone_otps_phone ON public.phone_otps(phone_number);
CREATE INDEX idx_phone_otps_expires ON public.phone_otps(expires_at);

-- Create function to cleanup expired OTPs
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.phone_otps 
  WHERE expires_at < now() AND verified = FALSE;
END;
$$;

-- Create trigger to automatically cleanup expired OTPs periodically
-- (This would typically be done with a scheduled job, but we'll handle it in the edge functions)