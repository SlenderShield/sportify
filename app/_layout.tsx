import { useEffect, useState } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { YStack, Text, Spinner } from 'tamagui';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { TamaguiProvider } from 'tamagui';
import { tamaguiConfig } from '../tamagui/config';

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
      <YStack flex={1} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text marginTop={16} fontSize={16} color="$gray8" textAlign="center">
          {!frameworkReady ? 'Starting TeamSync...' :
            !isInitialized ? 'Initializing...' :
              'Loading your account...'}
        </Text>
        {user && (
          <Text marginTop={8} fontSize={14} color="$gray6" textAlign="center">
            Welcome back, {user.name}!
          </Text>
        )}
      </YStack>
    );
  }

  return null;
}

export default function RootLayout() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
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
    </TamaguiProvider>
  );
}
