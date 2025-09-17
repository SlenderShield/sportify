import { useEffect, useState, useRef } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import { YStack, Text, Spinner } from 'tamagui';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import { useColorScheme } from 'react-native';

function AuthGate() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, hasCompletedOnboarding, isLoading, user, restoreSession } = useAuth();
  const frameworkReady = useFrameworkReady();
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fade-in effect

  // Initialize session
  useEffect(() => {
    if (!frameworkReady) return;

    (async () => {
      try {
        await restoreSession();
      } catch (error) {
        console.error('Session restoration failed:', error);
      } finally {
        setTimeout(() => setIsInitialized(true), 500);
      }
    })();
  }, [frameworkReady, restoreSession]);

  // Handle routing after initialization
  useEffect(() => {
    if (!isInitialized || isLoading) return;

    if (!isAuthenticated) router.replace('/auth/login');
    else if (!hasCompletedOnboarding) router.replace('/onboarding');
    else router.replace('/(tabs)');
  }, [isAuthenticated, hasCompletedOnboarding, isInitialized, isLoading]);

  // Fade-in animation when ready
  useEffect(() => {
    if (isInitialized && !isLoading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [isInitialized, isLoading, fadeAnim]);

  if (!isInitialized || isLoading) {
    return (
      <YStack position="absolute" top={0} right={0} bottom={0} left={0} justifyContent="center" alignItems="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text marginTop={16} fontSize={16} color="$gray10" textAlign="center">
          {!frameworkReady
            ? 'Starting TeamSync...'
            : !isInitialized
            ? 'Initializing...'
            : 'Loading your account...'}
        </Text>
        {user && (
          <Text marginTop={8} fontSize={14} color="$gray7" textAlign="center">
            Welcome back, {user.name}!
          </Text>
        )}
      </YStack>
    );
  }

  return null;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      // defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}
      defaultTheme="light"
    >
      <YStack flex={1}>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Authentication Routes */}
          <Stack.Screen name="auth/login" />
          <Stack.Screen name="auth/register" />
          <Stack.Screen name="auth/otp-request" />
          <Stack.Screen name="auth/otp-verify" />

          {/* Onboarding */}
          <Stack.Screen name="onboarding" />

          {/* Main App */}
          <Stack.Screen name="(tabs)" />

          {/* Error */}
          <Stack.Screen name="+not-found" />
        </Stack>

        {/* AuthGate handles initial session, loading, and routing */}
        <AuthGate />

        <StatusBar style="auto" />
      </YStack>
    </TamaguiProvider>
  );
}
