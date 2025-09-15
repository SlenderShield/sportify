import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, Text } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';

function AuthGate() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { 
    isAuthenticated, 
    hasCompletedOnboarding, 
    isLoading, 
    user,
    restoreSession 
  } = useAuth();
  const frameworkReady = useFrameworkReady();

  useEffect(() => {
    if (!frameworkReady) return;
    
    // Initialize session restoration
    const initializeAuth = async () => {
      try {
        await restoreSession();
      } catch (error) {
        console.error('Session restoration failed:', error);
      } finally {
        // Small delay to ensure smooth transition
        setTimeout(() => {
          setIsInitialized(true);
        }, 500);
      }
    };

    initializeAuth();
  }, [frameworkReady, restoreSession]);

  useEffect(() => {
    if (!isInitialized || isLoading) return;

    // Determine which screen to show based on auth state
    if (!isAuthenticated) {
      // Not logged in - show login screen
      router.replace('/auth/login');
    } else if (!hasCompletedOnboarding) {
      // Logged in but first time - show onboarding
      router.replace('/onboarding');
    } else {
      // Logged in and onboarded - show main app
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, hasCompletedOnboarding, isInitialized, isLoading]);

  // Show loading spinner while determining initial route
  if (!isInitialized || isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#FFFFFF' 
      }}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={{
          marginTop: 16,
          fontSize: 16,
          color: '#6B7280',
          textAlign: 'center'
        }}>
          {!frameworkReady ? 'Starting TeamSync...' : 
           !isInitialized ? 'Initializing...' : 
           'Loading your account...'}
        </Text>
        {user && (
          <Text style={{
            marginTop: 8,
            fontSize: 14,
            color: '#9CA3AF',
            textAlign: 'center'
          }}>
            Welcome back, {user.name}!
          </Text>
        )}
      </View>
    );
  }

  return null;
}

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Authentication Routes */}
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth/otp-request" />
        <Stack.Screen name="auth/otp-verify" />
        
        {/* Onboarding Route */}
        <Stack.Screen name="onboarding" />
        
        {/* Main App Routes */}
        <Stack.Screen name="(tabs)" />
        
        {/* Error Routes */}
        <Stack.Screen name="+not-found" />
      </Stack>
      
      <AuthGate />
      <StatusBar style="auto" />
    </>
  );
}
