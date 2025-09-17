import { useState, useEffect, useRef } from 'react';
import { KeyboardAvoidingView, Platform, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/hooks/useAuth';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { ValidationUtils } from '@/lib/validation';
import type { OTPVerification, ValidationError } from '@/types';
import { YStack, XStack, Text, Button, Input, Separator } from 'tamagui';
import { LinearGradient } from 'tamagui/linear-gradient';

export default function OtpVerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const { verifyOTP, requestOTP, isLoading, error, clearError, otpRequestId, resendTimer } = useAuth();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (validationErrors.length > 0) setValidationErrors([]);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (value && index === 5 && newOtp.every(d => d !== '')) handleVerifyOTP(newOtp.join(''));
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    clearError();
    const code = otpCode || otp.join('');
    const otpError = ValidationUtils.validateOTP(code);
    if (otpError) {
      setValidationErrors([otpError]);
      return;
    }
    if (!phone) {
      Alert.alert('Error', 'Phone number is missing. Please go back and try again.');
      return;
    }
    setValidationErrors([]);
    try {
      await verifyOTP({ phone, otp: code, requestId: otpRequestId || 'default' } as OTPVerification);
    } catch {
      setOtp(Array(6).fill(''));
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!phone || resendTimer > 0) return;
    try {
      await requestOTP({ phone });
      Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
    } catch { }
  };

  const clearOtp = () => {
    setOtp(Array(6).fill(''));
    setValidationErrors([]);
    inputRefs.current[0]?.focus();
  };

  const getFieldError = (field: string) => ValidationUtils.getErrorMessage(validationErrors, field);

  const formatPhoneNumber = (num: string) =>
    num.startsWith('+1') && num.length === 12 ? `+1 ${num.slice(2, 5)}-${num.slice(5, 8)}-${num.slice(8)}` : num;

  if (!phone) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
          <Text color="$red10" fontSize="$6" fontWeight="600">Phone number is missing</Text>
          <Button onPress={() => router.back()}>Go Back</Button>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <YStack flex={1} paddingHorizontal="$4" paddingTop="$4" backgroundColor="$background">
          {/* Header */}
          <XStack alignItems="center" justifyContent="space-between" marginBottom="$4">
            <Button chromeless onPress={() => router.back()} icon={<ArrowLeft size={24} color="$color" />} />
            <Text fontSize="$7" fontWeight="700">Verify Code</Text>
            <Button chromeless onPress={clearOtp}><Text color="$blue10">Clear</Text></Button>
          </XStack>

          <YStack alignItems="center" gap="$3" marginTop="$2">
            <Shield size={48} color="#3B82F6" />
            <Text fontSize="$6" fontWeight="600">Enter verification code</Text>
            <Text textAlign="center" color="$gray11">
              {`We’ve sent a 6-digit code to\n`}
              <Text color="$blue10" fontWeight="600">{formatPhoneNumber(phone)}</Text>
            </Text>

            {error && <Text color="$red10" marginTop="$2">{error}</Text>}

            {/* OTP Inputs */}
            <XStack gap="$3" marginTop="$3">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  ref={ref => { inputRefs.current[idx] = ref; }}
                  value={digit}
                  onChangeText={v => handleOtpChange(v, idx)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
                  keyboardType="numeric"
                  maxLength={1}
                  size="$6"
                  textAlign="center"
                  width={50}
                  height={60}
                  fontSize="$6"
                  borderColor={getFieldError('otp') ? '$red10' : digit ? '$blue10' : '$gray6'}
                  borderWidth={2}
                  borderRadius="$4"
                />
              ))}
            </XStack>
            {getFieldError('otp') && <Text color="$red10" fontSize="$3">{getFieldError('otp')}</Text>}

            {/* Resend */}
            <YStack marginTop="$4" alignItems="center">
              {resendTimer > 0 ? (
                <Text color="$gray10">Resend code in {resendTimer}s</Text>
              ) : (
                <Button
                  variant="outlined"
                  borderColor="$blue10"
                  color="$blue10"
                  icon={<RefreshCw size={16} color="#3B82F6" />}
                  onPress={handleResendOTP}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
              )}
            </YStack>

            {/* Verify */}
            <LinearGradient
              colors={otp.some(d => !d) || isLoading ? ['$gray6', '$gray6'] : ['$primary', '$secondary']}
              style={{ borderRadius: 12, overflow: 'hidden', marginTop: 20 }}
            >
              <Button
                unstyled
                paddingVertical={16}
                alignItems="center"
                onPress={() => handleVerifyOTP()}
                disabled={isLoading || otp.some(d => !d)}
              >
                <Text color="$white" fontSize={16} fontWeight="600">
                  {isLoading ? 'Verifying...' : 'Verify Code'}
                </Text>
              </Button>
            </LinearGradient>

            <Separator marginVertical="$5" />

            <YStack alignItems="center" gap="$2">
              <Text color="$gray10">Didn’t receive the code? Check your SMS or try again</Text>
              <Button chromeless onPress={() => router.back()}>
                <Text color="$blue10">Change phone number</Text>
              </Button>
            </YStack>
          </YStack>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
