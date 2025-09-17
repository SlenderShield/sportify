import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Smartphone, ArrowLeft } from 'lucide-react-native';
import { ValidationUtils } from '@/lib/validation';
import type { OTPRequest, ValidationError } from '@/types';
import { YStack, XStack, Text, Input, Button, ScrollView } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';
export default function OtpRequestScreen() {
  const [phone, setPhone] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isFocused, setFocused] = useState(false);

  const { requestOTP, isLoading, error, clearError } = useAuth();

  const handleRequestOTP = async () => {
    clearError();

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

      router.push({
        pathname: '/auth/otp-verify',
        params: { phone: formattedPhone },
      });
    } catch {
      // Handled by store
    }
  };

  const getFieldError = (field: string) =>
    ValidationUtils.getErrorMessage(validationErrors, field);

  return (
    <YStack flex={1} background="$background">
      <StatusBar style="dark" />
      {/* Header */}
      <XStack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal={20}
        paddingVertical={16}
        borderBottomWidth={1}
        borderBottomColor="#E5E7EB"
      >
        <Button chromeless padding={8} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#374151" />
        </Button>
        <Text fontSize={18} fontWeight="600" color="$color">
          Phone Verification
        </Text>
        <YStack width={40} />
      </XStack>

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <YStack flex={1} paddingHorizontal={20} paddingVertical={40}>
          {/* Icon */}
          <YStack
            alignSelf="center"
            width={80}
            height={80}
            borderRadius={40}
            backgroundColor="#EBF4FF"
            alignItems="center"
            justifyContent="center"
            marginBottom={24}
          >
            <Smartphone size={48} color="#3B82F6" />
          </YStack>

          {/* Title */}
          <Text
            fontSize={24}
            fontWeight="bold"
            color="$color"
            textAlign="center"
            marginBottom={8}
          >
            Enter your phone number
          </Text>
          <Text
            fontSize={16}
            color="$gray10"
            textAlign="center"
            lineHeight={24}
            marginBottom={32}
          >
            We'll send you a verification code to confirm your phone number
          </Text>

          {/* Global Error */}
          {error && (
            <YStack
              backgroundColor="#FEF2F2"
              borderColor="#FECACA"
              borderWidth={1}
              borderRadius={12}
              padding={12}
              marginBottom={20}
            >
              <Text color="#DC2626" fontSize={14} textAlign="center">
                {error}
              </Text>
            </YStack>
          )}

          {/* Phone Input Card */}
          <YStack
            backgroundColor="$background"
            borderRadius="$6"
            shadowColor="#000"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.05}
            shadowRadius={6}
            padding="$5"
          >
            <Text fontSize={16} fontWeight="500" color="$color" marginBottom={8}>
              Phone Number
            </Text>
            <XStack
              flexDirection="row"
              alignItems="center"
              borderWidth={1}
              borderColor={getFieldError('phone') ? '#DC2626' : isFocused ? '#3B82F6' : '#D1D5DB'}
              borderRadius="$5"
              backgroundColor="#F9FAFB"
              paddingHorizontal={16}
            >
              <Text fontSize={16} color="$color" fontWeight="500" marginRight={4}>
                +
              </Text>
              <Input
                flex={1}
                paddingVertical={16}
                fontSize={16}
                color="$color"
                placeholder="1234567890"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (validationErrors.length > 0) setValidationErrors([]);
                }}
                keyboardType="phone-pad"
                autoCorrect={false}
                borderWidth={0}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </XStack>
            {getFieldError('phone') && (
              <Text color="#DC2626" fontSize={12} marginTop={4}>
                {getFieldError('phone')}
              </Text>
            )}
            <Text fontSize={12} color="$gray10" marginTop={4}>
              Enter your phone number without country code (e.g., 1234567890 for US)
            </Text>

            {/* Send OTP Button */}
            <LinearGradient
              colors={phone.trim() && !isLoading ? ['$primary', '$secondary'] : ['$gray6', '$gray6']}
              style={{ borderRadius: 12, overflow: 'hidden', marginTop: 16 }}
            >
              <Button
                unstyled
                paddingVertical={16}
                alignItems="center"
                onPress={handleRequestOTP}
                disabled={!phone.trim() || isLoading}
                animation="quick"
              >
                <Text color="$white" fontSize={16} fontWeight="600">
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </Text>
              </Button>
            </LinearGradient>
          </YStack>

          {/* Footer */}
          <YStack paddingTop={32} paddingBottom={20}>
            <Text
              fontSize={12}
              color="$gray10"
              textAlign="center"
              lineHeight={18}
              marginBottom={16}
            >
              By continuing, you agree to receive SMS messages from TeamSync
            </Text>
            <Button chromeless alignItems="center" paddingVertical={12} onPress={() => router.back()}>
              <Text fontSize={16} color="#3B82F6" fontWeight="500">
                Back to Email Login
              </Text>
            </Button>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
