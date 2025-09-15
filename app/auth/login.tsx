import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail, Lock, Smartphone } from 'lucide-react-native';
import { ValidationUtils } from '@/lib/validation';
import type { LoginCredentials, ValidationError } from '@/types';
export default function LoginScreen() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  
  const { loginWithEmail, isLoading, error, clearError } = useAuth();

  const handleEmailLogin = async () => {
    clearError();
    
    // Validate inputs
    const errors = ValidationUtils.validateLoginCredentials(credentials);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setValidationErrors([]);
    
    try {
      await loginWithEmail(credentials);
      // Navigation is handled by the root layout
    } catch (error) {
      // Error is handled by the store
    }
  };

  const handlePhoneLogin = () => {
    router.push('/auth/otp-request');
  };

  const handleGoogleLogin = () => {
    // This will be implemented later
    Alert.alert('Google Sign-In', 'Google authentication will be available soon!');
  };

  const getFieldError = (field: string) => {
    return ValidationUtils.getErrorMessage(validationErrors, field);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to your TeamSync account</Text>
            </View>

            {/* Global Error */}
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Email Login Form */}
            <View style={styles.form}>
              <Text style={styles.sectionTitle}>Sign in with Email</Text>
              
              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputContainer,
                  getFieldError('email') && styles.inputError
                ]}>
                  <Mail size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    value={credentials.email}
                    onChangeText={(email) => setCredentials(prev => ({ ...prev, email }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>
                {getFieldError('email') && (
                  <Text style={styles.fieldError}>{getFieldError('email')}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputContainer,
                  getFieldError('password') && styles.inputError
                ]}>
                  <Lock size={20} color="#6B7280" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#9CA3AF"
                    value={credentials.password}
                    onChangeText={(password) => setCredentials(prev => ({ ...prev, password }))}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color="#6B7280" />
                    ) : (
                      <Eye size={20} color="#6B7280" />
                    )}
                  </TouchableOpacity>
                </View>
                {getFieldError('password') && (
                  <Text style={styles.fieldError}>{getFieldError('password')}</Text>
                )}
              </View>

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.disabledButton]}
                onPress={handleEmailLogin}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In with Email'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => {
                  Alert.alert('Forgot Password', 'This feature will be implemented soon.');
                }}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Alternative Login Methods */}
            <View style={styles.altMethods}>
              {/* Google Login */}
              <TouchableOpacity
                style={[styles.altButton, styles.googleButton]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <Text style={[styles.altButtonText, styles.googleButtonText]}>
                  Continue with Google
                </Text>
              </TouchableOpacity>
              
              {/* Phone Login */}
              <TouchableOpacity
                style={[styles.altButton, styles.phoneButton]}
                onPress={handlePhoneLogin}
                disabled={isLoading}
              >
                <Smartphone size={20} color="#10B981" style={styles.altButtonIcon} />
                <Text style={[styles.altButtonText, styles.phoneButtonText]}>
                  Sign in with Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
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
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  eyeIcon: {
    padding: 16,
  },
  fieldError: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  altMethods: {
    marginBottom: 32,
  },
  altButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  phoneButton: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  altButtonIcon: {
    marginRight: 8,
  },
  altButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  googleButtonText: {
    color: '#374151',
  },
  phoneButtonText: {
    color: '#10B981',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
  },
  signUpText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
});