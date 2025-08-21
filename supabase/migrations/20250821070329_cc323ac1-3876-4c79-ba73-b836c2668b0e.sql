-- Fix security vulnerability: Restrict profile access to owners only
-- Remove the public read policy and replace with owner-only access

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create new policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- If we need public profile data (display names, avatars) for features like user directories,
-- we can create a separate view with only non-sensitive data
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
    user_id,
    display_name,
    avatar_url,
    bio,
    created_at
FROM public.profiles
WHERE display_name IS NOT NULL;

-- Enable RLS on the view (views inherit RLS from underlying tables by default)
-- Anyone can read the public view, but it excludes phone numbers and other sensitive data
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.public_profiles 
FOR SELECT 
USING (true);