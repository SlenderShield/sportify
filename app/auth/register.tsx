import React, { useState, useRef } from 'react';
import { YStack, XStack, Text, Input, Button, ScrollView, View, Animated } from 'tamagui';
import { KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, UserPlus, Shield } from 'lucide-react-native';
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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { isDark } = useTheme();
  const { registerWithEmail, isLoading, error, clearError } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Animate in on mount
  React.useEffect(() => {
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

  const ModernInputField = ({
    label,
    icon,
    value,
    placeholder,
    secure = false,
    showSecure = false,
    toggleSecure,
    field,
    keyboardType = 'default'
  }: any) => {
    const isFocused = focusedField === field;
    const hasError = !!getFieldError(field);
    
    return (
      <YStack gap="$2">
        <Text fontSize={14} fontWeight="600" color="$text">
          {label}
        </Text>
        <XStack
          alignItems="center"
          backgroundColor="$surface"
          borderWidth={2}
          borderColor={hasError ? '$error' : isFocused ? '$primary' : '$border'}
          borderRadius="$lg"
          paddingHorizontal="$4"
          paddingVertical="$3"
          shadowColor={isFocused ? '$primary' : 'transparent'}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          shadowRadius={4}
          elevation={isFocused ? 2 : 0}
        >
          <View marginRight="$3">
            {React.cloneElement(icon, {
              size: 20,
              color: hasError ? '$error' : isFocused ? '$primary' : '$textTertiary'
            })}
          </View>
          <Input
            flex={1}
            placeholder={placeholder}
            placeholderTextColor="$textMuted"
            value={value}
            secureTextEntry={secure && !showSecure}
            onChangeText={(text) => updateCredential(field, text)}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
            keyboardType={keyboardType}
            autoCapitalize="none"
            autoCorrect={false}
            fontSize={16}
            borderWidth={0}
            backgroundColor="transparent"
          />
          {secure && (
            <Pressable
              onPress={toggleSecure}
              style={{ padding: 4 }}
            >
              {showSecure ? (
                <EyeOff size={20} color="$textTertiary" />
              ) : (
                <Eye size={20} color="$textTertiary" />
              )}
            </Pressable>
          )}
        </XStack>
        {hasError && (
          <Text color="$error" fontSize={12}>
            {getFieldError(field)}
          </Text>
        )}
      </YStack>
    );
  };

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
              ? 'linear-gradient(180deg, rgba(167, 139, 250, 0.1) 0%, rgba(30, 41, 59, 0) 100%)'
              : 'linear-gradient(180deg, rgba(124, 58, 237, 0.05) 0%, rgba(248, 250, 252, 0) 100%)',
          }}
        />
        
        {/* Decorative Elements */}
        <View
          position="absolute"
          top={120}
          left={-40}
          width={120}
          height={120}
          borderRadius={60}
          backgroundColor="$glassSecondary"
          opacity={0.3}
        />
        <View
          position="absolute"
          top={280}
          right={-20}
          width={80}
          height={80}
          borderRadius={40}
          backgroundColor="$glassAccent"
          opacity={0.2}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              flex: 1,
              paddingHorizontal: 24,
              paddingTop: 60,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header */}
            <YStack alignItems="center" marginBottom="$8">
              {/* Back Button */}
              <XStack width="100%" justifyContent="flex-start" marginBottom="$4">
                <Pressable
                  onPress={() => router.back()}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: '$surface',
                    borderWidth: 1,
                    borderColor: '$border',
                  }}
                >
                  <ArrowLeft size={20} color="$text" />
                </Pressable>
              </XStack>
              
              {/* Icon */}
              <View
                backgroundColor="$secondary"
                borderRadius="$full"
                padding="$4"
                marginBottom="$5"
                shadowColor="$secondary"
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={0.25}
                shadowRadius={16}
                elevation={8}
              >
                <UserPlus size={32} color="$textInverse" />
              </View>
              
              <Text fontSize={36} fontWeight="800" color="$text" textAlign="center">
                Create Account
              </Text>
              <Text fontSize={16} color="$textSecondary" textAlign="center" marginTop="$2">
                Join SportSync and connect with your team
              </Text>
            </YStack>

            {/* Main Form Card */}
            <YStack
              backgroundColor="$backgroundElevated"
              borderRadius="$xxl"
              padding="$8"
              marginBottom="$6"
              borderWidth={1}
              borderColor="$borderSubtle"
              shadowColor="$secondary"
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

              <YStack gap="$5">
                <ModernInputField
                  label="Full Name"
                  icon={<User />}
                  value={credentials.name}
                  placeholder="Enter your full name"
                  field="name"
                />
                
                <ModernInputField
                  label="Email Address"
                  icon={<Mail />}
                  value={credentials.email}
                  placeholder="Enter your email"
                  field="email"
                  keyboardType="email-address"
                />
                
                <ModernInputField
                  label="Password"
                  icon={<Lock />}
                  value={credentials.password}
                  placeholder="Create a strong password"
                  field="password"
                  secure
                  showSecure={showPassword}
                  toggleSecure={() => setShowPassword(!showPassword)}
                />
                
                {/* Password Requirements */}
                <View
                  backgroundColor="$surface"
                  padding="$3"
                  borderRadius="$lg"
                  borderWidth={1}
                  borderColor="$border"
                >
                  <XStack alignItems="center" gap="$2" marginBottom="$1">
                    <Shield size={14} color="$textSecondary" />
                    <Text fontSize={12} color="$textSecondary" fontWeight="500">
                      Password Requirements:
                    </Text>
                  </XStack>
                  <Text fontSize={11} color="$textTertiary" lineHeight={16}>
                    • At least 8 characters long{"\n"}
                    • Include uppercase and lowercase letters{"\n"}
                    • Include at least one number
                  </Text>
                </View>
                
                <ModernInputField
                  label="Confirm Password"
                  icon={<Lock />}
                  value={credentials.confirmPassword}
                  placeholder="Confirm your password"
                  field="confirmPassword"
                  secure
                  showSecure={showConfirmPassword}
                  toggleSecure={() => setShowConfirmPassword(!showConfirmPassword)}
                />

                {/* Register Button */}
                <Pressable
                  onPress={handleRegister}
                  disabled={isLoading}
                  style={{
                    marginTop: 16,
                    borderRadius: 16,
                    overflow: 'hidden',
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  <View
                    backgroundColor="$secondary"
                    paddingVertical="$4"
                    alignItems="center"
                    justifyContent="center"
                    shadowColor="$secondary"
                    shadowOffset={{ width: 0, height: 4 }}
                    shadowOpacity={0.3}
                    shadowRadius={12}
                    elevation={8}
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
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              </YStack>
            </YStack>

            {/* Terms & Privacy */}
            <YStack alignItems="center" marginTop="$6" paddingHorizontal="$4">
              <Text fontSize={12} color="$textTertiary" textAlign="center" lineHeight={18}>
                By creating an account, you agree to our{' '}
                <Pressable onPress={() => console.log('Terms of Service')}>
                  <Text color="$secondary" fontWeight="600" fontSize={12}>
                    Terms of Service
                  </Text>
                </Pressable>
                {' '}and{' '}
                <Pressable onPress={() => console.log('Privacy Policy')}>
                  <Text color="$secondary" fontWeight="600" fontSize={12}>
                    Privacy Policy
                  </Text>
                </Pressable>
              </Text>
            </YStack>

            {/* Footer */}
            <YStack alignItems="center" marginTop="$6" paddingBottom="$8">
              <XStack alignItems="center" gap="$2">
                <Text color="$textSecondary" fontSize={14}>
                  Already have an account?
                </Text>
                <Pressable onPress={() => router.replace('/auth/login')}>
                  <Text color="$secondary" fontSize={14} fontWeight="600">
                    Sign In
                  </Text>
                </Pressable>
              </XStack>
              
              <XStack alignItems="center" gap="$3" marginTop="$4" opacity={0.7}>
                <Text color="$textTertiary" fontSize={12}>
                  Secure registration powered by Sportify
                </Text>
              </XStack>
            </YStack>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </YStack>
  );
}
