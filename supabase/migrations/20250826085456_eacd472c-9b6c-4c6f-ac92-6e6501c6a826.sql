-- Drop the existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a more secure version with additional safety checks
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path TO 'public'
AS $$
DECLARE
    _user_id uuid;
BEGIN
    -- Validate that this is actually a new user creation
    IF TG_OP != 'INSERT' THEN
        RAISE EXCEPTION 'This function can only be used for INSERT operations';
    END IF;
    
    -- Validate that we have a valid user ID
    IF NEW.id IS NULL THEN
        RAISE EXCEPTION 'User ID cannot be null';
    END IF;
    
    _user_id := NEW.id;
    
    -- Insert user settings with explicit user_id
    INSERT INTO public.user_settings (user_id, default_language, theme)
    VALUES (_user_id, 'en', 'dark')
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Insert profile with explicit user_id  
    INSERT INTO public.profiles (user_id)
    VALUES (_user_id)
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
    
EXCEPTION
    WHEN OTHERS THEN
        -- Log the error but don't prevent user creation
        RAISE WARNING 'Failed to create user settings/profile for user %: %', _user_id, SQLERRM;
        RETURN NEW;
END;
$$;