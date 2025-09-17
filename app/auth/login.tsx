import { useState, useRef,useEffect } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail, Lock, Smartphone, Chrome, LogIn, Sparkles } from 'lucide-react-native';
import { YStack, XStack, Text, Button, Input, Separator, ScrollView, View } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Alert, Pressable,Animated } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { ValidationUtils } from '@/lib/validation';
import type { LoginCredentials, ValidationError } from '@/types';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isEmailFocused, setEmailFocused] = useState(false);
  const [isPasswordFocused, setPasswordFocused] = useState(false);
  
  const { isDark } = useTheme();
  const { loginWithEmail, isLoading, error, clearError } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Animate in on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleEmailLogin = async () => {
    clearError();
    const errors = ValidationUtils.validateLoginCredentials(credentials);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    try {
      await loginWithEmail(credentials);
    } catch {
      // Error handled in store
    }
  };

  const handlePhoneLogin = () => router.push('/auth/otp-request');

  const handleGoogleLogin = () =>
    Alert.alert('Google Sign-In', 'Google authentication will be available soon!');

  const getFieldError = (field: string) =>
    ValidationUtils.getErrorMessage(validationErrors, field);

  return (
    <YStack flex={1} backgroundColor="$background">
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Background Elements */}
      <View position="absolute" top={0} left={0} right={0} bottom={0}>
        {/* Gradient Overlay */}
        <View
          position="absolute"
          top={0}
          left={0}
          right={0}
          height={300}
          style={{
            background: isDark 
              ? 'linear-gradient(180deg, rgba(96, 165, 250, 0.1) 0%, rgba(30, 41, 59, 0) 100%)'
              : 'linear-gradient(180deg, rgba(37, 99, 235, 0.05) 0%, rgba(248, 250, 252, 0) 100%)',
          }}
        />
        
        {/* Decorative Elements */}
        <View
          position="absolute"
          top={100}
          right={-50}
          width={150}
          height={150}
          borderRadius={75}
          backgroundColor="$glassAccent"
          opacity={0.3}
        />
        <View
          position="absolute"
          top={250}
          left={-30}
          width={100}
          height={100}
          borderRadius={50}
          backgroundColor="$glassSecondary"
          opacity={0.2}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 80,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Header */}
          <YStack alignItems="center" marginBottom="$10">
            <View
              backgroundColor="$primary"
              borderRadius="$full"
              padding="$4"
              marginBottom="$5"
              shadowColor="$primary"
              shadowOffset={{ width: 0, height: 8 }}
              shadowOpacity={0.25}
              shadowRadius={16}
            >
              <LogIn size={32} color="$textInverse" />
            </View>
            
            <Text fontSize={36} fontWeight="800" color="$text" textAlign="center">
              Welcome Back
            </Text>
            <Text color="$textSecondary" marginTop="$2" fontSize={16} textAlign="center">
              Sign in to continue to SportSync
            </Text>
          </YStack>

          {/* Main Card */}
          <YStack
            backgroundColor="$backgroundElevated"
            borderRadius="$xxl"
            padding="$8"
            marginBottom="$6"
            borderWidth={1}
            borderColor="$borderSubtle"
            shadowColor="$primary"
            shadowOffset={{ width: 0, height: 12 }}
            shadowOpacity={0.08}
            shadowRadius={24}
            elevation={12}
            style={{
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Global Error */}
            {error && (
              <YStack
                backgroundColor="$errorSubtle"
                borderColor="$error"
                borderWidth={1}
                padding="$4"
                marginBottom="$6"
                borderRadius="$lg"
                alignItems="center"
              >
                <Text color="$error" fontSize={14} fontWeight="500" textAlign="center">
                  {error}
                </Text>
              </YStack>
            )}

            {/* Form Header */}
            <YStack marginBottom="$6">
              <Text fontSize={20} fontWeight="700" color="$text" textAlign="center">
                Sign in with Email
              </Text>
              <Text fontSize={14} color="$textTertiary" textAlign="center" marginTop="$2">
                Enter your credentials to continue
              </Text>
            </YStack>

            <YStack gap="$5">
              {/* Email Field */}
              <YStack gap="$2">
                <Text fontSize={14} fontWeight="600" color="$text">
                  Email Address
                </Text>
                <XStack
                  alignItems="center"
                  backgroundColor="$surface"
                  borderWidth={2}
                  borderColor={getFieldError('email') ? '$error' : isEmailFocused ? '$primary' : '$border'}
                  borderRadius="$lg"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  shadowColor={isEmailFocused ? '$primary' : 'transparent'}
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.1}
                  shadowRadius={4}
                  elevation={isEmailFocused ? 2 : 0}
                >
                  <Mail 
                    size={20} 
                    color={getFieldError('email') ? '$error' : isEmailFocused ? '$primary' : '$textTertiary'} 
                  />
                  <Input
                    flex={1}
                    marginLeft="$3"
                    placeholder="Enter your email"
                    placeholderTextColor="$textMuted"
                    value={credentials.email}
                    onChangeText={(email) => setCredentials((prev) => ({ ...prev, email }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    fontSize={16}
                    borderWidth={0}
                    backgroundColor="transparent"
                  />
                </XStack>
                {getFieldError('email') && (
                  <Text color="$error" fontSize={12} marginTop="$1">
                    {getFieldError('email')}
                  </Text>
                )}
              </YStack>

              {/* Password Field */}
              <YStack gap="$2">
                <Text fontSize={14} fontWeight="600" color="$text">
                  Password
                </Text>
                <XStack
                  alignItems="center"
                  backgroundColor="$surface"
                  borderWidth={2}
                  borderColor={getFieldError('password') ? '$error' : isPasswordFocused ? '$primary' : '$border'}
                  borderRadius="$lg"
                  paddingHorizontal="$4"
                  paddingVertical="$3"
                  shadowColor={isPasswordFocused ? '$primary' : 'transparent'}
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.1}
                  shadowRadius={4}
                  elevation={isPasswordFocused ? 2 : 0}
                >
                  <Lock 
                    size={20} 
                    color={getFieldError('password') ? '$error' : isPasswordFocused ? '$primary' : '$textTertiary'} 
                  />
                  <Input
                    flex={1}
                    marginLeft="$3"
                    placeholder="Enter your password"
                    placeholderTextColor="$textMuted"
                    value={credentials.password}
                    secureTextEntry={!showPassword}
                    onChangeText={(password) => setCredentials((prev) => ({ ...prev, password }))}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    fontSize={16}
                    borderWidth={0}
                    backgroundColor="transparent"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Pressable
                    onPress={() => setShowPassword((p) => !p)}
                    style={{ padding: 4 }}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="$textTertiary" />
                    ) : (
                      <Eye size={20} color="$textTertiary" />
                    )}
                  </Pressable>
                </XStack>
                {getFieldError('password') && (
                  <Text color="$error" fontSize={12} marginTop="$1">
                    {getFieldError('password')}
                  </Text>
                )}
              </YStack>

              {/* Forgot Password Link */}
              <XStack justifyContent="flex-end" marginTop="$2">
                <Pressable
                  onPress={() => Alert.alert('Forgot Password', 'Feature coming soon.')}
                  style={{ padding: 8 }}
                >
                  <Text color="$primary" fontSize={14} fontWeight="500">
                    Forgot password?
                  </Text>
                </Pressable>
              </XStack>

              {/* Primary Login Button */}
              <Pressable
                onPress={handleEmailLogin}
                disabled={isLoading}
                style={{
                  marginTop: 24,
                  borderRadius: 16,
                  overflow: 'hidden',
                  opacity: isLoading ? 0.7 : 1,
                }}
              >
                <View
                  backgroundColor="$primary"
                  paddingVertical="$4"
                  alignItems="center"
                  justifyContent="center"
                  shadowColor="$primary"
                  shadowOffset={{ width: 0, height: 4 }}
                  shadowOpacity={0.3}
                  shadowRadius={12}
                >
                  <XStack alignItems="center" gap="$2">
                    {isLoading && (
                      <View
                        width={20}
                        height={20}
                        borderRadius={10}
                        borderWidth={2}
                        borderColor="$textInverse"
                        borderTopColor="transparent"
                        animation="spin"
                      />
                    )}
                    <Text color="$textInverse" fontSize={16} fontWeight="700">
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            </YStack>

            {/* Divider */}
            <XStack alignItems="center" marginVertical="$8">
              <View flex={1} height={1} backgroundColor="$border" />
              <Text 
                marginHorizontal="$4" 
                color="$textTertiary" 
                fontSize={14} 
                fontWeight="500"
                backgroundColor="$backgroundElevated"
                paddingHorizontal="$2"
              >
                OR CONTINUE WITH
              </Text>
              <View flex={1} height={1} backgroundColor="$border" />
            </XStack>

            {/* Alternative Login Methods */}
            <YStack gap="$4">
              {/* Google */}
              <Pressable
                onPress={handleGoogleLogin}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.5 : 1 }}
              >
                <XStack
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="$surface"
                  borderWidth={2}
                  borderColor="$border"
                  borderRadius="$lg"
                  paddingVertical="$4"
                  gap="$3"
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.05}
                  shadowRadius={4}
                  elevation={2}
                >
                  <Chrome size={20} color="#4285F4" />
                  <Text color="$text" fontSize={16} fontWeight="600">
                    Continue with Google
                  </Text>
                </XStack>
              </Pressable>

              {/* Phone */}
              <Pressable
                onPress={handlePhoneLogin}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.5 : 1 }}
              >
                <XStack
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="$surface"
                  borderWidth={2}
                  borderColor="$border"
                  borderRadius="$lg"
                  paddingVertical="$4"
                  gap="$3"
                  shadowColor="#000"
                  shadowOffset={{ width: 0, height: 2 }}
                  shadowOpacity={0.05}
                  shadowRadius={4}
                  elevation={2}
                >
                  <Smartphone size={20} color="$secondary" />
                  <Text color="$text" fontSize={16} fontWeight="600">
                    Sign in with Phone
                  </Text>
                </XStack>
              </Pressable>
            </YStack>
          </YStack>

          {/* Footer */}
          <XStack 
            justifyContent="center" 
            alignItems="center" 
            marginTop="$8" 
            marginBottom="$6" 
            gap="$2"
          >
            <Text color="$textSecondary" fontSize={16}>
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push('/auth/register')}>
              <Text color="$primary" fontSize={16} fontWeight="700">
                Sign Up
              </Text>
            </Pressable>
          </XStack>
          
          {/* Extra spacing for keyboard */}
          <View height={50} />
        </Animated.View>
      </ScrollView>
    </YStack>
  );
}
