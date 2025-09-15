import type { ValidationError, LoginCredentials, RegisterCredentials } from '@/types';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic E.164 format
export const passwordMinLength = 8;

export class ValidationUtils {
  static validateEmail(email: string): ValidationError | null {
    if (!email) {
      return { field: 'email', message: 'Email is required' };
    }
    if (!emailRegex.test(email)) {
      return { field: 'email', message: 'Please enter a valid email address' };
    }
    return null;
  }

  static validatePassword(password: string): ValidationError | null {
    if (!password) {
      return { field: 'password', message: 'Password is required' };
    }
    if (password.length < passwordMinLength) {
      return { field: 'password', message: `Password must be at least ${passwordMinLength} characters` };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one lowercase letter' };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one uppercase letter' };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { field: 'password', message: 'Password must contain at least one number' };
    }
    return null;
  }

  static validateName(name: string): ValidationError | null {
    if (!name) {
      return { field: 'name', message: 'Name is required' };
    }
    if (name.length < 2) {
      return { field: 'name', message: 'Name must be at least 2 characters' };
    }
    if (name.length > 50) {
      return { field: 'name', message: 'Name must be less than 50 characters' };
    }
    return null;
  }

  static validatePhone(phone: string): ValidationError | null {
    if (!phone) {
      return { field: 'phone', message: 'Phone number is required' };
    }
    
    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return { field: 'phone', message: 'Please enter a valid phone number (e.g., +1234567890)' };
    }
    return null;
  }

  static validateOTP(otp: string): ValidationError | null {
    if (!otp) {
      return { field: 'otp', message: 'OTP is required' };
    }
    if (!/^\d{6}$/.test(otp)) {
      return { field: 'otp', message: 'OTP must be 6 digits' };
    }
    return null;
  }

  static validateLoginCredentials(credentials: LoginCredentials): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const emailError = this.validateEmail(credentials.email);
    if (emailError) errors.push(emailError);
    
    if (!credentials.password) {
      errors.push({ field: 'password', message: 'Password is required' });
    }
    
    return errors;
  }

  static validateRegisterCredentials(credentials: RegisterCredentials): ValidationError[] {
    const errors: ValidationError[] = [];
    
    const nameError = this.validateName(credentials.name);
    if (nameError) errors.push(nameError);
    
    const emailError = this.validateEmail(credentials.email);
    if (emailError) errors.push(emailError);
    
    const passwordError = this.validatePassword(credentials.password);
    if (passwordError) errors.push(passwordError);
    
    if (!credentials.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
    } else if (credentials.password !== credentials.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
    }
    
    return errors;
  }

  static formatPhoneNumber(phone: string): string {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with + and has digits, return as is
    if (cleaned.startsWith('+')) {
      return cleaned;
    }
    
    // If it's a US number without country code, add +1
    if (cleaned.length === 10 && !cleaned.startsWith('1')) {
      return '+1' + cleaned;
    }
    
    // If it's 11 digits and starts with 1, add +
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return '+' + cleaned;
    }
    
    // For other cases, just add + if it doesn't have it
    return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
  }

  static getErrorMessage(errors: ValidationError[], field: string): string | null {
    const error = errors.find(e => e.field === field);
    return error ? error.message : null;
  }
}

export default ValidationUtils;