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
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Smartphone, ArrowLeft } from 'lucide-react-native';
import { ValidationUtils } from '@/lib/validation';
import type { OTPRequest, ValidationError } from '@/types';

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
            <Text style={styles.headerTitle}>Phone Verification</Text>
            <View style={styles.headerPlaceholder} />
          </View>

          <View style={styles.body}>
            <View style={styles.iconContainer}>
              <Smartphone size={48} color="#3B82F6" />
            </View>

            <Text style={styles.title}>Enter your phone number</Text>
            <Text style={styles.subtitle}>
              We'll send you a verification code to confirm your phone number
            </Text>

            {/* Global Error */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Phone Input */}
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={[
                  styles.inputContainer,
                  getFieldError('phone') && styles.inputError
                ]}>
                  <Text style={styles.countryCode}>+</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234567890"
                    placeholderTextColor="#9CA3AF"
                    value={phone}
                    onChangeText={handlePhoneChange}
                    keyboardType="phone-pad"
                    autoCorrect={false}
                  />
                </View>
                {getFieldError('phone') && (
                  <Text style={styles.fieldError}>{getFieldError('phone')}</Text>
                )}
                <Text style={styles.inputHint}>
                  Enter your phone number with country code (e.g., 1234567890 for US)
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.sendButton, isLoading && styles.disabledButton]}
                onPress={handleRequestOTP}
                disabled={isLoading || !phone.trim()}
              >
                <Text style={styles.sendButtonText}>
                  {isLoading ? 'Sending...' : 'Send Verification Code'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                By continuing, you agree to receive SMS messages from TeamSync
              </Text>
              <TouchableOpacity
                style={styles.backToEmailButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backToEmailText}>Back to Email Login</Text>
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
  headerPlaceholder: {
    width: 40,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
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
    paddingHorizontal: 20,
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
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  countryCode: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginRight: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  fieldError: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  inputHint: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  backToEmailButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backToEmailText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
});