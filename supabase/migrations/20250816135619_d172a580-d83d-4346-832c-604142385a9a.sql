-- Add notification settings columns to user_settings table
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS push_notifications BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS chat_notifications BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS security_alerts BOOLEAN DEFAULT true;