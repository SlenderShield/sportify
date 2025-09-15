import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    otpRequestId,
    resendTimer,
    hasCompletedOnboarding,
    
    // Auth methods
    loginWithEmail,
    registerWithEmail,
    requestOTP,
    verifyOTP,
    loginWithGoogle,
    logout,
    restoreSession,
    
    // User management
    updateUser,
    
    // Onboarding
    completeOnboarding,
    resetOnboarding,
    
    // Utility
    clearError,
    setLoading,
    startResendTimer,
    stopResendTimer,
    
    // Debug
    clearAll
  } = useAuthStore();

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    otpRequestId,
    resendTimer,
    hasCompletedOnboarding,
    
    // Auth methods
    loginWithEmail,
    registerWithEmail,
    requestOTP,
    verifyOTP,
    loginWithGoogle,
    logout,
    restoreSession,
    
    // User management
    updateUser,
    
    // Onboarding
    completeOnboarding,
    resetOnboarding,
    
    // Utility
    clearError,
    setLoading,
    startResendTimer,
    stopResendTimer,
    
    // Debug
    clearAll
  };
};
