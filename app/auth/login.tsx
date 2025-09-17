import { useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail, Lock, Smartphone, Chrome } from 'lucide-react-native';
import { YStack, XStack, Text, Button, Input, Separator, ScrollView } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
import { Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
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

  const { loginWithEmail, isLoading, error, clearError } = useAuth();

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
    <YStack flex={1} background="$background" padding="$4" justifyContent="center">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        {/* Header */}
        <YStack marginBottom="$8" alignItems="center">
          <Text fontSize={32} fontWeight="700" color="$gray12">
            Welcome Back
          </Text>
          <Text color="$gray10" marginTop="$2" fontSize={16}>
            Sign in to your TeamSync account
          </Text>
        </YStack>

        {/* Card Container */}
        <YStack
          background="$background"
          borderRadius="$6"
          shadowColor="#000"
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.05}
          shadowRadius={6}
          padding="$5"
          marginBottom="$8"
        >
          {/* Global Error */}
          {error && (
            <YStack
              background="$red3"
              padding="$3"
              marginBottom="$5"
              borderRadius="$5"
              alignItems="center"
            >
              <Text color="$red11">{error}</Text>
            </YStack>
          )}

          {/* Email Login Form */}
          <YStack space="$4">
            <Text fontSize={18} fontWeight="600">
              Sign in with Email
            </Text>

            {/* Email Field */}
            <YStack space="$2">
              <XStack
                alignItems="center"
                borderWidth={1}
                borderColor={getFieldError('email') ? '$red10' : isEmailFocused ? '$blue10' : '$gray6'}
                borderRadius="$5"
                paddingHorizontal="$3"
                paddingVertical="$2"
                background="$background"
              >
                <Mail size={20} color={isEmailFocused ? '#2563EB' : '#6B7280'} />
                <Input
                  flex={1}
                  marginLeft="$2"
                  placeholder="Email"
                  value={credentials.email}
                  onChangeText={(email) => setCredentials((prev) => ({ ...prev, email }))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </XStack>
              {getFieldError('email') && (
                <Text color="$red10" fontSize={14}>
                  {getFieldError('email')}
                </Text>
              )}
            </YStack>

            {/* Password Field */}
            <YStack space="$2">
              <XStack
                alignItems="center"
                borderWidth={1}
                borderColor={getFieldError('password') ? '$red10' : isPasswordFocused ? '$blue10' : '$gray6'}
                borderRadius="$5"
                paddingHorizontal="$3"
                paddingVertical="$2"
                background="$background"
              >
                <Lock size={20} color={isPasswordFocused ? '#2563EB' : '#6B7280'} />
                <Input
                  flex={1}
                  marginLeft="$2"
                  placeholder="Password"
                  value={credentials.password}
                  secureTextEntry={!showPassword}
                  onChangeText={(password) => setCredentials((prev) => ({ ...prev, password }))}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <Button
                  unstyled
                  onPress={() => setShowPassword((p) => !p)}
                  pressStyle={{ opacity: 0.7 }}
                >
                  {showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                </Button>
              </XStack>
              {getFieldError('password') && (
                <Text color="$red10" fontSize={14}>
                  {getFieldError('password')}
                </Text>
              )}
            </YStack>

            {/* Primary Login Button */}
            <LinearGradient
              colors={isLoading ? ['$gray6', '$gray6'] : ['$primary', '$secondary']}
              style={{ borderRadius: 12, overflow: 'hidden', marginTop: 16 }}
            >
              <Button
                unstyled
                paddingVertical={16}
                alignItems="center"
                onPress={handleEmailLogin}
                disabled={isLoading}
                animation="quick"
              >
                <Text color="$white" fontWeight="600">
                  {isLoading ? 'Signing In…' : 'Sign In'}
                </Text>
              </Button>
            </LinearGradient>

            {/* Forgot Password */}
            <Button
              variant="outlined"
              marginTop="$2"
              onPress={() => Alert.alert('Forgot Password', 'Feature coming soon.')}
            >
              <Text color="$blue10">Forgot Password?</Text>
            </Button>
          </YStack>

          {/* Divider */}
          <XStack alignItems="center" marginVertical="$5">
            <Separator flex={1} />
            <Text marginHorizontal="$3" color="$gray8" fontWeight="500">
              OR
            </Text>
            <Separator flex={1} />
          </XStack>

          {/* Alternative Login Methods */}
          <YStack space="$3">
            {/* Google */}
            <Button
              size="$4"
              variant="outlined"
              borderColor="#4285F4"
              onPress={handleGoogleLogin}
              disabled={isLoading}
            >
              <XStack alignItems="center" space="$2">
                <Chrome size={20} color="#4285F4" />
                <Text color="#4285F4">Continue with Google</Text>
              </XStack>
            </Button>

            {/* Phone */}
            <Button
              size="$4"
              variant="outlined"
              borderColor="#10B981"
              onPress={handlePhoneLogin}
              disabled={isLoading}
            >
              <XStack alignItems="center" space="$2">
                <Smartphone size={20} color="#10B981" />
                <Text color="#10B981">Sign in with Phone</Text>
              </XStack>
            </Button>
          </YStack>
        </YStack>

        {/* Footer */}
        <XStack justifyContent="center" space="$2" marginTop="$6">
          <Text color="$gray10">Don't have an account?</Text>
          <Button unstyled onPress={() => router.push('/auth/register')}>
            <Text color="$blue10" fontWeight="600">
              Sign Up
            </Text>
          </Button>
        </XStack>
      </ScrollView>
    </YStack>
  );
}
