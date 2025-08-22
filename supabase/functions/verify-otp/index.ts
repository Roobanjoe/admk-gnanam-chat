import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerifyOTPRequest {
  phone_number: string;
  otp_code: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const { phone_number, otp_code }: VerifyOTPRequest = await req.json();

    if (!phone_number || !otp_code) {
      return new Response(JSON.stringify({ error: 'Phone number and OTP code are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Initialize Supabase clients
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Clean up expired OTPs first
    await supabaseAdmin.rpc('cleanup_expired_otps');

    // Find valid OTP
    const { data: otpData, error: otpError } = await supabaseAdmin
      .from('phone_otps')
      .select('*')
      .eq('phone_number', phone_number)
      .eq('otp_code', otp_code)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError) {
      console.error('OTP query error:', otpError);
      throw new Error('Failed to verify OTP');
    }

    if (!otpData) {
      // Increment failed attempts for all recent OTPs for this phone
      await supabaseAdmin
        .from('phone_otps')
        .update({ attempts: supabaseAdmin.rpc('attempts', []) })
        .eq('phone_number', phone_number)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString());

      return new Response(JSON.stringify({ 
        error: 'Invalid or expired OTP code' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Check attempt limits (max 5 attempts per OTP)
    if (otpData.attempts >= 5) {
      return new Response(JSON.stringify({ 
        error: 'Too many failed attempts. Please request a new OTP.' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    // Mark OTP as verified
    const { error: updateError } = await supabaseAdmin
      .from('phone_otps')
      .update({ verified: true })
      .eq('id', otpData.id);

    if (updateError) {
      console.error('OTP update error:', updateError);
      throw new Error('Failed to verify OTP');
    }

    // Check if user exists with this phone number
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('user_id')
      .eq('phone_number', phone_number)
      .maybeSingle();

    let userId: string;

    if (existingProfile) {
      // User exists, update verification status
      userId = existingProfile.user_id;
      await supabaseAdmin
        .from('profiles')
        .update({ 
          phone_verified: true,
          phone_verification_attempts: 0 
        })
        .eq('user_id', userId);
    } else {
      // Create new user account using phone as identifier
      // Since Supabase Auth requires email, we'll create a dummy email
      const dummyEmail = `${phone_number.replace(/[^0-9]/g, '')}@phone.local`;
      const randomPassword = crypto.randomUUID();

      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: dummyEmail,
        password: randomPassword,
        email_confirm: true,
        user_metadata: {
          phone_number: phone_number,
          phone_verified: true,
          auth_method: 'phone'
        }
      });

      if (authError) {
        console.error('User creation error:', authError);
        throw new Error('Failed to create user account');
      }

      userId = authData.user.id;

      // Update the profile with phone number
      await supabaseAdmin
        .from('profiles')
        .update({ 
          phone_number,
          phone_verified: true,
          phone_verification_attempts: 0 
        })
        .eq('user_id', userId);
    }

    // Generate session token for the user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: `${phone_number.replace(/[^0-9]/g, '')}@phone.local`,
      options: {
        redirectTo: `${req.headers.get('origin') || 'http://localhost:5173'}/`
      }
    });

    if (sessionError) {
      console.error('Session generation error:', sessionError);
      throw new Error('Failed to create session');
    }

    console.log(`OTP verified successfully for ${phone_number}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'OTP verified successfully',
      auth_url: sessionData.properties?.action_link,
      user_id: userId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Error in verify-otp function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
};

serve(handler);