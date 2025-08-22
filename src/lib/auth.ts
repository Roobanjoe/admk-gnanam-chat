import { 
  signInWithPhoneNumber, 
  RecaptchaVerifier, 
  ConfirmationResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

export const initializeRecaptcha = (elementId: string = 'recaptcha-container'): RecaptchaVerifier => {
  try {
    console.log('Initializing reCAPTCHA with element ID:', elementId);
    
    if (recaptchaVerifier) {
      console.log('Clearing existing reCAPTCHA verifier');
      recaptchaVerifier.clear();
    }
    
    // Check if the container element exists
    const container = document.getElementById(elementId);
    if (!container) {
      console.error('reCAPTCHA container element not found:', elementId);
      throw new Error(`reCAPTCHA container element '${elementId}' not found`);
    }
    
    recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: (response: any) => {
        console.log('reCAPTCHA solved successfully:', response);
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired, user needs to solve again');
      }
    });
    
    console.log('reCAPTCHA verifier created successfully');
    return recaptchaVerifier;
  } catch (error) {
    console.error('Error initializing reCAPTCHA:', error);
    throw error;
  }
};

export const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Starting OTP send process for phone:', phoneNumber);
    
    if (!recaptchaVerifier) {
      console.log('Initializing reCAPTCHA...');
      initializeRecaptcha();
    }
    
    if (!recaptchaVerifier) {
      console.error('Failed to initialize reCAPTCHA');
      throw new Error('Failed to initialize reCAPTCHA');
    }

    console.log('Attempting to send OTP via Firebase...');
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    console.log('OTP sent successfully via Firebase');
    return { success: true };
  } catch (error: any) {
    console.error('Error sending OTP:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Clear the recaptcha verifier on error
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    
    let errorMessage = 'Failed to send OTP';
    
    if (error.code === 'auth/invalid-phone-number') {
      errorMessage = 'Invalid phone number format';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many requests. Please try again later.';
    } else if (error.code === 'auth/quota-exceeded') {
      errorMessage = 'SMS quota exceeded. Please try again later.';
    } else if (error.code === 'auth/captcha-check-failed') {
      errorMessage = 'reCAPTCHA verification failed. Please try again.';
    } else if (error.code === 'auth/invalid-app-credential') {
      errorMessage = 'Invalid Firebase configuration. Please check your setup.';
    } else if (error.code === 'auth/app-not-authorized') {
      errorMessage = 'App not authorized for this Firebase project.';
    } else if (error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
      errorMessage = 'Firebase API key is invalid or not configured properly. Please check Firebase Console settings.';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const verifyOTP = async (otp: string): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    if (!confirmationResult) {
      throw new Error('No OTP verification in progress');
    }
    
    const result = await confirmationResult.confirm(otp);
    return { success: true, user: result.user };
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    
    let errorMessage = 'Invalid OTP';
    
    if (error.code === 'auth/invalid-verification-code') {
      errorMessage = 'Invalid OTP. Please check and try again.';
    } else if (error.code === 'auth/code-expired') {
      errorMessage = 'OTP has expired. Please request a new one.';
    }
    
    return { success: false, error: errorMessage };
  }
};

export const signOut = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    await firebaseSignOut(auth);
    
    // Clear recaptcha verifier
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      recaptchaVerifier = null;
    }
    
    // Clear confirmation result
    confirmationResult = null;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error signing out:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Cleanup function
export const cleanup = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  confirmationResult = null;
};