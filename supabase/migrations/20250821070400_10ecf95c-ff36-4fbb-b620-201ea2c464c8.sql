-- Fix critical security vulnerability: Restrict profile access to owners only
-- Remove the public read policy that exposes phone numbers

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a safe public view for non-sensitive profile data (for features like user directories)
-- This excludes phone numbers and other sensitive information
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
    user_id,
    display_name,
    avatar_url,
    bio,
    created_at
FROM public.profiles
WHERE display_name IS NOT NULL;