import { YStack, XStack, Text, Input, Button, ScrollView, View } from 'tamagui';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react-native';
import { ValidationUtils } from '@/lib/validation';
import type { RegisterCredentials, ValidationError } from '@/types';

export default function RegisterScreen() {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const { registerWithEmail, isLoading, error, clearError } = useAuth();

  const handleRegister = async () => {
    clearError();
    
    // Validate inputs
    const errors = ValidationUtils.validateRegisterCredentials(credentials);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    
    try {
      await registerWithEmail(credentials);
      // Navigation is handled by the root layout
    } catch (error) {
      // Error is handled by the store
    }
  };

  const getFieldError = (field: string) => {
    return ValidationUtils.getErrorMessage(validationErrors, field);
  };

  const updateCredential = (field: keyof RegisterCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors(prev => prev.filter(error => error.field !== field));
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <YStack flex={1} paddingVertical={20}>
            {/* Header */}
            <YStack alignItems="center" marginBottom={32}>
              <Button
                chromeless
                position="absolute"
                left={0}
                top={0}
                padding={8}
                onPress={() => router.back()}
                icon={<ArrowLeft size={24} color="#374151" />}
              />
              <Text fontSize={28} fontWeight="800" color="$text" marginBottom={8} marginTop={32}>Create Account</Text>
              <Text fontSize={16} color="$secondary" textAlign="center" paddingHorizontal={20}>
                Join TeamSync and connect with your team
              </Text>
            </YStack>

            {/* Global Error */}
            {error && (
              <YStack backgroundColor="$red2" borderColor="$red6" borderWidth={1} borderRadius={8} padding={12} marginBottom={20}>
                <Text color="$red10" fontSize={14} textAlign="center">{error}</Text>
              </YStack>
            )}

            {/* Registration Form */}
            <YStack flex={1}>
              {/* Name Field */}
              <YStack marginBottom={20}>
                <Text fontSize={16} fontWeight="600" color="$text" marginBottom={8}>Full Name</Text>
                <XStack
                  alignItems="center"
                  borderWidth={1}
                  borderColor={getFieldError('name') ? "$red10" : "$border"}
                  borderRadius={12}
                  backgroundColor="$gray2"
                  paddingHorizontal={8}
                >
                  <User size={20} color="#6B7280" style={{ marginLeft: 8, marginRight: 8 }} />
                  <Input
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Enter your full name"
                    placeholderTextColor="#9CA3AF"
                    value={credentials.name}
                    onChangeText={(value) => updateCredential('name', value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </XStack>
                {getFieldError('name') && (
                  <Text color="$red10" fontSize={12} marginTop={4}>{getFieldError('name')}</Text>
                )}
              </YStack>

              {/* Email Field */}
              <YStack marginBottom={20}>
                <Text fontSize={16} fontWeight="600" color="$text" marginBottom={8}>Email Address</Text>
                <XStack
                  alignItems="center"
                  borderWidth={1}
                  borderColor={getFieldError('email') ? "$red10" : "$border"}
                  borderRadius={12}
                  backgroundColor="$gray2"
                  paddingHorizontal={8}
                >
                  <Mail size={20} color="#6B7280" style={{ marginLeft: 8, marginRight: 8 }} />
                  <Input
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={credentials.email}
                    onChangeText={(value) => updateCredential('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </XStack>
                {getFieldError('email') && (
                  <Text color="$red10" fontSize={12} marginTop={4}>{getFieldError('email')}</Text>
                )}
              </YStack>

              {/* Password Field */}
              <YStack marginBottom={20}>
                <Text fontSize={16} fontWeight="600" color="$text" marginBottom={8}>Password</Text>
                <XStack
                  alignItems="center"
                  borderWidth={1}
                  borderColor={getFieldError('password') ? "$red10" : "$border"}
                  borderRadius={12}
                  backgroundColor="$gray2"
                  paddingHorizontal={8}
                >
                  <Lock size={20} color="#6B7280" style={{ marginLeft: 8, marginRight: 8 }} />
                  <Input
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Create a strong password"
                    placeholderTextColor="#9CA3AF"
                    value={credentials.password}
                    onChangeText={(value) => updateCredential('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Button
                    chromeless
                    onPress={() => setShowPassword(!showPassword)}
                    padding={8}
                    icon={showPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                  />
                </XStack>
                {getFieldError('password') && (
                  <Text color="$red10" fontSize={12} marginTop={4}>{getFieldError('password')}</Text>
                )}
                <Text fontSize={12} color="$secondary" marginTop={4}>
                  Password must be at least 8 characters with uppercase, lowercase, and number
                </Text>
              </YStack>

              {/* Confirm Password Field */}
              <YStack marginBottom={20}>
                <Text fontSize={16} fontWeight="600" color="$text" marginBottom={8}>Confirm Password</Text>
                <XStack
                  alignItems="center"
                  borderWidth={1}
                  borderColor={getFieldError('confirmPassword') ? "$red10" : "$border"}
                  borderRadius={12}
                  backgroundColor="$gray2"
                  paddingHorizontal={8}
                >
                  <Lock size={20} color="#6B7280" style={{ marginLeft: 8, marginRight: 8 }} />
                  <Input
                    flex={1}
                    borderWidth={0}
                    backgroundColor="transparent"
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    value={credentials.confirmPassword}
                    onChangeText={(value) => updateCredential('confirmPassword', value)}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Button
                    chromeless
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    padding={8}
                    icon={showConfirmPassword ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
                  />
                </XStack>
                {getFieldError('confirmPassword') && (
                  <Text color="$red10" fontSize={12} marginTop={4}>{getFieldError('confirmPassword')}</Text>
                )}
              </YStack>

              {/* Register Button */}
              <Button
                backgroundColor="$primary"
                borderRadius={12}
                paddingVertical={16}
                alignItems="center"
                marginTop={8}
                disabled={isLoading}
                opacity={isLoading ? 0.6 : 1}
                onPress={handleRegister}
              >
                <Text color="$background" fontSize={16} fontWeight="700">
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Text>
              </Button>
            </YStack>

            {/* Terms */}
            <YStack marginVertical={20} paddingHorizontal={8}>
              <Text fontSize={12} color="$secondary" textAlign="center" lineHeight={18}>
                By creating an account, you agree to our{' '}
                <Text color="$primary" fontWeight="700">Terms of Service</Text>
                {' '}and{' '}
                <Text color="$primary" fontWeight="700">Privacy Policy</Text>
              </Text>
            </YStack>

            {/* Footer */}
            <XStack justifyContent="center" alignItems="center" paddingBottom={20}>
              <Text fontSize={16} color="$secondary">Already have an account? </Text>
              <Button chromeless onPress={() => router.back()}>
                <Text fontSize={16} color="$primary" fontWeight="700">Sign In</Text>
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </YStack>
  );
}
