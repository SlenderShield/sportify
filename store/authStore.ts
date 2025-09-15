import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthState, User, LoginCredentials, RegisterCredentials, OTPRequest, OTPVerification, GoogleAuthResponse } from '@/types';

interface AuthStore extends AuthState {
  hasCompletedOnboarding: boolean;
  
  // Auth methods
  loginWithEmail: (credentials: LoginCredentials) => Promise<void>;
  registerWithEmail: (credentials: RegisterCredentials) => Promise<void>;
  requestOTP: (request: OTPRequest) => Promise<void>;
  verifyOTP: (verification: OTPVerification) => Promise<void>;
  loginWithGoogle: (response: GoogleAuthResponse) => Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<void>;
  
  // User management
  updateUser: (userData: Partial<User>) => void;
  
  // Onboarding
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  startResendTimer: () => void;
  stopResendTimer: () => void;
  
  // Debug methods
  clearAll: () => void;
}

export const useAuthStore = create<AuthStore>()(persist(
  (set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    otpRequestId: null,
    resendTimer: 0,
    hasCompletedOnboarding: false,

  loginWithEmail: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      const { loginWithEmail } = await import('@/lib/api');
      const response = await loginWithEmail(credentials.email, credentials.password);
      
      if (response.success && response.data?.user) {
        const user = response.data.user;
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  registerWithEmail: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      const { registerWithEmail } = await import('@/lib/api');
      const response = await registerWithEmail(credentials.email, credentials.password, credentials.name);
      
      if (response.success && response.data?.user) {
        const user = response.data.user;
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const message = error instanceof Error ? error.message : 'Registration failed';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  requestOTP: async (request: OTPRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      const { requestOTP } = await import('@/lib/api');
      const response = await requestOTP(request.phone);
      
      if (response.success && response.data?.requestId) {
        set({ 
          otpRequestId: response.data.requestId,
          isLoading: false,
          error: null
        });
        get().startResendTimer();
      } else {
        throw new Error(response.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  verifyOTP: async (verification: OTPVerification) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      const { loginWithOTP } = await import('@/lib/api');
      const response = await loginWithOTP(verification.phone, verification.otp);
      
      if (response.success && response.data?.user) {
        const user = response.data.user;
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null,
          otpRequestId: null
        });
        get().stopResendTimer();
      } else {
        throw new Error(response.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const message = error instanceof Error ? error.message : 'Invalid OTP';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  loginWithGoogle: async (googleResponse: GoogleAuthResponse) => {
    set({ isLoading: true, error: null });
    
    try {
      // TODO: Replace with actual API call
      const { loginWithGoogle } = await import('@/lib/api');
      const response = await loginWithGoogle(googleResponse.idToken);
      
      if (response.success && response.data?.user) {
        const user = response.data.user;
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          error: null
        });
      } else {
        throw new Error(response.error || 'Google sign-in failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      const message = error instanceof Error ? error.message : 'Google sign-in failed';
      set({ isLoading: false, error: message });
      throw error;
    }
  },

  restoreSession: async () => {
    set({ isLoading: true });
    
    try {
      // Session is automatically restored by zustand persist
      // If user exists, validate the token
      const { user } = get();
      if (user && user.token) {
        // TODO: Validate token with backend
        // For now, assume valid if exists
        set({ isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Session restore error:', error);
      set({ isLoading: false, user: null, isAuthenticated: false });
    }
  },

  logout: () => {
    // TODO: Clear auth tokens, disconnect sockets, etc.
    get().stopResendTimer();
    set({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false,
      error: null,
      otpRequestId: null,
      resendTimer: 0
    });
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ 
        user: { ...currentUser, ...userData } 
      });
    }
  },

  completeOnboarding: () => {
    set({ hasCompletedOnboarding: true });
  },

  resetOnboarding: () => {
    set({ hasCompletedOnboarding: false });
  },

  // Utility methods
  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  startResendTimer: () => {
    set({ resendTimer: 60 }); // 60 seconds
    const timer = setInterval(() => {
      const currentTimer = get().resendTimer;
      if (currentTimer <= 1) {
        clearInterval(timer);
        set({ resendTimer: 0 });
      } else {
        set({ resendTimer: currentTimer - 1 });
      }
    }, 1000);
  },

  stopResendTimer: () => {
    set({ resendTimer: 0 });
  },

  // Debug method to clear all auth state
  clearAll: () => {
    get().stopResendTimer();
    set({ 
      user: null, 
      isAuthenticated: false, 
      hasCompletedOnboarding: false,
      isLoading: false,
      error: null,
      otpRequestId: null,
      resendTimer: 0
    });
  }
}),
{
  name: 'auth-storage',
  storage: createJSONStorage(() => AsyncStorage),
  // Only persist these specific fields
  partialize: (state) => ({ 
    user: state.user, 
    isAuthenticated: state.isAuthenticated,
    hasCompletedOnboarding: state.hasCompletedOnboarding
  }),
}
));
