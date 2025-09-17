import { useEffect, useState, useRef } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Animated } from 'react-native';
import { YStack, Text, Spinner } from 'tamagui';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';

function AuthGate() {
  const [isInitialized, setIsInitialized] = useState(false);
  const { isAuthenticated, hasCompletedOnboarding, isLoading, user, restoreSession } = useAuth();
  const { isDark } = useTheme();
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
      <YStack 
        position="absolute" 
        top={0} 
        right={0} 
        bottom={0} 
        left={0} 
        justifyContent="center" 
        alignItems="center" 
        backgroundColor="$background"
      >
        <YStack 
          alignItems="center" 
          backgroundColor="$backgroundElevated" 
          padding="$8" 
          borderRadius="$xxxl" 
          shadowColor="$primary" 
          shadowOffset={{ width: 0, height: 8 }} 
          shadowOpacity={0.1} 
          shadowRadius={24}
          elevation={8}
        >
          <Spinner size="large" color="$primary" />
          <Text 
            marginTop="$6" 
            fontSize={18} 
            fontWeight="600" 
            color="$text" 
            textAlign="center"
          >
            {!frameworkReady
              ? 'Starting TeamSync...'
              : !isInitialized
              ? 'Initializing...'
              : 'Loading your account...'}
          </Text>
          {user && (
            <Text 
              marginTop="$3" 
              fontSize={16} 
              color="$textSecondary" 
              textAlign="center"
            >
              Welcome back, {user.name}!
            </Text>
          )}
        </YStack>
      </YStack>
    );
  }

  return null;
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <TamaguiProvider
      config={tamaguiConfig}
      defaultTheme={isDark ? 'dark' : 'light'}
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

        <StatusBar style={isDark ? 'light' : 'dark'} />
      </YStack>
    </TamaguiProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
