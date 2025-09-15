import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Shield, ArrowLeft, RefreshCw } from 'lucide-react-native';
import { ValidationUtils } from '@/lib/validation';
import type { OTPVerification, ValidationError } from '@/types';

export default function OtpVerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
  const { 
    verifyOTP, 
    requestOTP, 
    isLoading, 
    error, 
    clearError, 
    otpRequestId,
    resendTimer 
  } = useAuth();

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5 && newOtp.every(digit => digit !== '')) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (otpCode?: string) => {
    clearError();
    
    const code = otpCode || otp.join('');
    
    // Validate OTP
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
      const verification: OTPVerification = {
        phone,
        otp: code,
        requestId: otpRequestId || 'default'
      };
      
      await verifyOTP(verification);
      // Navigation is handled by the root layout
    } catch (error) {
      // Error is handled by the store
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (!phone || resendTimer > 0) return;
    
    try {
      await requestOTP({ phone });
      Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
    } catch (error) {
      // Error is handled by the store
    }
  };

  const getFieldError = (field: string) => {
    return ValidationUtils.getErrorMessage(validationErrors, field);
  };

  const formatPhoneNumber = (phoneNumber: string) => {
    // Format phone number for display (e.g., +1 234-567-8890)
    if (phoneNumber.startsWith('+1') && phoneNumber.length === 12) {
      return `+1 ${phoneNumber.slice(2, 5)}-${phoneNumber.slice(5, 8)}-${phoneNumber.slice(8)}`;
    }
    return phoneNumber;
  };

  const clearOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setValidationErrors([]);
    inputRefs.current[0]?.focus();
  };

  if (!phone) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorScreen}>
          <Text style={styles.errorText}>Phone number is missing</Text>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify Code</Text>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearOtp}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.body}>
            <View style={styles.iconContainer}>
              <Shield size={48} color="#3B82F6" />
            </View>

            <Text style={styles.title}>Enter verification code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.phoneNumber}>{formatPhoneNumber(phone)}</Text>
            </Text>

            {/* Global Error */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              <View style={styles.otpInputs}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => inputRefs.current[index] = ref}
                    style={[
                      styles.otpInput,
                      digit && styles.otpInputFilled,
                      getFieldError('otp') && styles.otpInputError
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>
              {getFieldError('otp') && (
                <Text style={styles.fieldError}>{getFieldError('otp')}</Text>
              )}
            </View>

            {/* Resend Code */}
            <View style={styles.resendContainer}>
              {resendTimer > 0 ? (
                <Text style={styles.timerText}>
                  Resend code in {resendTimer}s
                </Text>
              ) : (
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendOTP}
                  disabled={isLoading}
                >
                  <RefreshCw size={16} color="#3B82F6" style={styles.resendIcon} />
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={[
                styles.verifyButton, 
                (isLoading || otp.some(digit => !digit)) && styles.disabledButton
              ]}
              onPress={() => handleVerifyOTP()}
              disabled={isLoading || otp.some(digit => !digit)}
            >
              <Text style={styles.verifyButtonText}>
                {isLoading ? 'Verifying...' : 'Verify Code'}
              </Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Didn't receive the code? Check your SMS or try again
              </Text>
              <TouchableOpacity
                style={styles.changeNumberButton}
                onPress={() => router.back()}
              >
                <Text style={styles.changeNumberText}>Change phone number</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  iconContainer: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  phoneNumber: {
    fontWeight: '600',
    color: '#111827',
  },
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    textAlign: 'center',
  },
  errorScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },
  otpContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  otpInputFilled: {
    borderColor: '#3B82F6',
    backgroundColor: '#EBF4FF',
  },
  otpInputError: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  fieldError: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 14,
    color: '#6B7280',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendIcon: {
    marginRight: 6,
  },
  resendText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  verifyButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  changeNumberButton: {
    paddingVertical: 8,
  },
  changeNumberText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
});