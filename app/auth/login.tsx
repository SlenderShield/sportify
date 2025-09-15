import { useState } from 'react';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail, Lock, Smartphone } from 'lucide-react-native';
import { YStack, XStack, Text, Button, Input, Separator, ScrollView } from 'tamagui';
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
      // Navigation handled by root layout
    } catch {
      // error handled in store
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
        <YStack marginBottom="$6" alignItems="center">
          <Text fontSize={28} fontWeight="700" color="$gray12">
            Welcome Back
          </Text>
          <Text color="$gray10" marginTop="$2">
            Sign in to your TeamSync account
          </Text>
        </YStack>

        {/* Global Error */}
        {error && (
          <YStack
            background="$red3"
            padding="$3"
            marginBottom="$4"
            borderRadius="$4"
            alignItems="center"
          >
            <Text color="$red11">{error}</Text>
          </YStack>
        )}

        {/* Email Login Form */}
        <YStack space="$4" marginBottom="$6">
          <Text fontSize={18} fontWeight="600">
            Sign in with Email
          </Text>

          {/* Email Field */}
          <YStack space="$2">
            <XStack
              alignItems="center"
              borderWidth={1}
              borderColor={getFieldError('email') ? '$red10' : '$gray6'}
              borderRadius="$4"
              paddingHorizontal="$3"
              paddingVertical="$2"
              background="$background"
            >
              <Mail size={20} color="#6B7280" />
              <Input
                flex={1}
                marginLeft="$2"
                placeholder="Email"
                value={credentials.email}
                onChangeText={(email) =>
                  setCredentials((prev) => ({ ...prev, email }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
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
              borderColor={getFieldError('password') ? '$red10' : '$gray6'}
              borderRadius="$4"
              paddingHorizontal="$3"
              paddingVertical="$2"
              background="$background"
            >
              <Lock size={20} color="#6B7280" />
              <Input
                flex={1}
                marginLeft="$2"
                placeholder="Password"
                value={credentials.password}
                secureTextEntry={!showPassword}
                onChangeText={(password) =>
                  setCredentials((prev) => ({ ...prev, password }))
                }
              />
              <Button
                unstyled
                onPress={() => setShowPassword((p) => !p)}
                pressStyle={{ opacity: 0.7 }}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </Button>
            </XStack>
            {getFieldError('password') && (
              <Text color="$red10" fontSize={14}>
                {getFieldError('password')}
              </Text>
            )}
          </YStack>

          <Button
            marginTop="$4"
            size="$4"
            backgroundColor="$blue10"
            disabled={isLoading}
            onPress={handleEmailLogin}
          >
            <Text color="$white" fontWeight="600">
              {isLoading ? 'Signing In…' : 'Sign In with Email'}
            </Text>
          </Button>

          <Button
            variant="outlined"
            marginTop="$2"
            onPress={() =>
              Alert.alert('Forgot Password', 'Feature coming soon.')
            }
          >
            <Text color="$blue10">Forgot Password?</Text>
          </Button>
        </YStack>

        {/* Divider */}
        <XStack alignItems="center" marginVertical="$4">
          <Separator flex={1} />
          <Text marginHorizontal="$3" color="$gray8">
            OR
          </Text>
          <Separator flex={1} />
        </XStack>

        {/* Alternative Login Methods */}
        <YStack space="$3" marginBottom="$6">
          <Button
            size="$4"
            variant="outlined"
            borderColor="$gray6"
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <Text>Continue with Google</Text>
          </Button>

          <Button
            size="$4"
            variant="outlined"
            borderColor="$green9"
            onPress={handlePhoneLogin}
            disabled={isLoading}
          >
            <XStack alignItems="center" space="$2">
              <Smartphone size={20} color="#10B981" />
              <Text color="$green11">Sign in with Phone</Text>
            </XStack>
          </Button>
        </YStack>

        {/* Footer */}
        <XStack justifyContent="center" space="$2">
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
