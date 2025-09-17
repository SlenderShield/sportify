import { YStack, XStack, Text, Input, Button, ScrollView, View } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
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
    const errors = ValidationUtils.validateRegisterCredentials(credentials);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    try {
      await registerWithEmail(credentials);
    } catch (err) {
      // Error handled in store
    }
  };

  const getFieldError = (field: string) => ValidationUtils.getErrorMessage(validationErrors, field);

  const updateCredential = (field: keyof RegisterCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    if (validationErrors.length > 0) {
      setValidationErrors(prev => prev.filter(e => e.field !== field));
    }
  };

  const InputField = ({
    label,
    icon,
    value,
    placeholder,
    secure = false,
    showSecure = false,
    toggleSecure,
    field,
    keyboardType = 'default'
  }: any) => (
    <YStack marginBottom={20}>
      <Text fontSize={16} fontWeight="600" color="$text" marginBottom={6}>{label}</Text>
      <XStack
        alignItems="center"
        borderWidth={1}
        borderColor={getFieldError(field) ? "$red10" : "$border"}
        borderRadius={12}
        backgroundColor="$gray2"
        paddingHorizontal={10}
        height={48}
        shadowColor="$gray8"
        elevation={1}
      >
        {icon}
        <Input
          flex={1}
          borderWidth={0}
          backgroundColor="transparent"
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          secureTextEntry={secure && !showSecure}
          onChangeText={(text) => updateCredential(field, text)}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {secure && (
          <Button
            chromeless
            onPress={toggleSecure}
            padding={8}
            icon={showSecure ? <EyeOff size={20} color="#6B7280" /> : <Eye size={20} color="#6B7280" />}
          />
        )}
      </XStack>
      {getFieldError(field) && (
        <Text color="$red10" fontSize={12} marginTop={4}>{getFieldError(field)}</Text>
      )}
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingVertical: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <YStack flex={1}>

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

            {/* Form Fields */}
            <YStack flex={1}>
              <InputField
                label="Full Name"
                icon={<User size={20} color="#6B7280" style={{ marginRight: 8 }} />}
                value={credentials.name}
                placeholder="Enter your full name"
                field="name"
              />
              <InputField
                label="Email Address"
                icon={<Mail size={20} color="#6B7280" style={{ marginRight: 8 }} />}
                value={credentials.email}
                placeholder="Enter your email"
                field="email"
                keyboardType="email-address"
              />
              <InputField
                label="Password"
                icon={<Lock size={20} color="#6B7280" style={{ marginRight: 8 }} />}
                value={credentials.password}
                placeholder="Create a strong password"
                field="password"
                secure
                showSecure={showPassword}
                toggleSecure={() => setShowPassword(!showPassword)}
              />
              <Text fontSize={12} color="$secondary" marginBottom={12}>
                Password must be at least 8 characters with uppercase, lowercase, and number
              </Text>
              <InputField
                label="Confirm Password"
                icon={<Lock size={20} color="#6B7280" style={{ marginRight: 8 }} />}
                value={credentials.confirmPassword}
                placeholder="Confirm your password"
                field="confirmPassword"
                secure
                showSecure={showConfirmPassword}
                toggleSecure={() => setShowConfirmPassword(!showConfirmPassword)}
              />

              {/* Register Button */}
              <LinearGradient
                colors={isLoading ? ['$gray6', '$gray6'] : ['$primary', '$secondary']}
                style={{ borderRadius: 12, overflow: 'hidden', marginTop: 8 }}
              >
                <Button
                  unstyled
                  paddingVertical={16}
                  alignItems="center"
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  <Text color="$white" fontSize={16} fontWeight="700">
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Text>
                </Button>
              </LinearGradient>
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
