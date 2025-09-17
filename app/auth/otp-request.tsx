import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Smartphone, ArrowLeft } from 'lucide-react-native';
import { ValidationUtils } from '@/lib/validation';
import type { OTPRequest, ValidationError } from '@/types';
import { YStack, XStack, Text, Input, Button, ScrollView } from 'tamagui';

export default function OtpRequestScreen() {
  const [phone, setPhone] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const { requestOTP, isLoading, error, clearError } = useAuth();

  const handleRequestOTP = async () => {
    clearError();
    
    // Format and validate phone number
    const formattedPhone = ValidationUtils.formatPhoneNumber(phone);
    const phoneError = ValidationUtils.validatePhone(formattedPhone);
    
    if (phoneError) {
      setValidationErrors([phoneError]);
      return;
    }
    
    setValidationErrors([]);
    
    try {
      const otpRequest: OTPRequest = { phone: formattedPhone };
      await requestOTP(otpRequest);
      
      // Navigate to OTP verification screen
      router.push({
        pathname: '/auth/otp-verify',
        params: { phone: formattedPhone }
      });
    } catch (error) {
      // Error is handled by the store
    }
  };

  const getFieldError = (field: string) => {
    return ValidationUtils.getErrorMessage(validationErrors, field);
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <StatusBar style="dark" />
      <YStack flex={1}>
        {/* Header */}
        <XStack flexDirection="row" alignItems="center" justifyContent="space-between" paddingHorizontal={20} paddingVertical={16} borderBottomWidth={1} borderBottomColor="#E5E7EB">
          <Button chromeless padding={8} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#374151" />
          </Button>
          <Text fontSize={18} fontWeight="600" color="$color">Phone Verification</Text>
          <YStack width={40} />
        </XStack>

        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
          <YStack flex={1} paddingHorizontal={20} paddingTop={40}>
            <YStack alignSelf="center" width={80} height={80} borderRadius={40} backgroundColor="#EBF4FF" alignItems="center" justifyContent="center" marginBottom={24}>
              <Smartphone size={48} color="#3B82F6" />
          </YStack>

            <Text fontSize={24} fontWeight="bold" color="$color" textAlign="center" marginBottom={8}>Enter your phone number</Text>
            <Text fontSize={16} color="$gray10" textAlign="center" lineHeight={24} marginBottom={32} paddingHorizontal={20}>
              We'll send you a verification code to confirm your phone number
            </Text>

            {/* Global Error */}
            {error && (
              <YStack backgroundColor="#FEF2F2" borderColor="#FECACA" borderWidth={1} borderRadius={8} padding={12} marginBottom={20}>
                <Text color="#DC2626" fontSize={14} textAlign="center">{error}</Text>
              </YStack>
            )}

            {/* Phone Input */}
            <YStack flex={1}>
              <YStack marginBottom={24}>
                <Text fontSize={16} fontWeight="500" color="$color" marginBottom={8}>Phone Number</Text>
                <XStack flexDirection="row" alignItems="center" borderWidth={1} borderColor={getFieldError('phone') ? '#DC2626' : '#D1D5DB'} borderRadius={12} backgroundColor="#F9FAFB" paddingHorizontal={16}>
                  <Text fontSize={16} color="$color" fontWeight="500" marginRight={4}>+</Text>
                  <Input
                    flex={1}
                    paddingVertical={16}
                    fontSize={16}
                    color="$color"
                    placeholder="1234567890"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                    borderWidth={0}
                  />
                </XStack>
                {getFieldError('phone') && (
                  <Text color="#DC2626" fontSize={12} marginTop={4}>{getFieldError('phone')}</Text>
                )}
                <Text fontSize={12} color="$gray10" marginTop={4}>
                  Enter your phone number with country code (e.g., 1234567890 for US)
                </Text>
              </YStack>

              <Button
                backgroundColor={isLoading || !phone.trim() ? '#9CA3AF' : '#3B82F6'}
                borderRadius={12}
                paddingVertical={16}
                alignItems="center"
                marginTop={16}
                onPress={handleRequestOTP}
                disabled={isLoading || !phone.trim()}
              >
                <Text color="#FFFFFF" fontSize={16} fontWeight="600">
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </Text>
              </Button>
            </YStack>

            {/* Footer */}
            <YStack paddingBottom={20}>
              <Text fontSize={12} color="$gray10" textAlign="center" lineHeight={18} marginBottom={16}>
                By continuing, you agree to receive SMS messages from TeamSync
              </Text>
              <Button chromeless alignItems="center" paddingVertical={12} onPress={() => router.back()}>
                <Text fontSize={16} color="#3B82F6" fontWeight="500">Back to Email Login</Text>
              </Button>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </YStack>
  );
} 