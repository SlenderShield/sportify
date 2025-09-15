# 🔐 Authentication Module Documentation

## Overview
This document describes the comprehensive authentication system implemented for the TeamSync Sports App. The system supports multiple authentication methods including email/password, phone OTP, and Google SSO.

## 🏗️ Architecture

### Core Components
- **Auth Store** (`store/authStore.ts`) - Zustand store with persistent state
- **API Layer** (`lib/api.ts`) - Mock implementations with backend integration points
- **Validation** (`lib/validation.ts`) - Client-side input validation
- **Auth Screens** (`app/auth/`) - Login, register, OTP request/verify screens
- **Route Protection** (`app/_layout.tsx`) - AuthGate component for route security

### Tech Stack
- **State Management**: Zustand with persistence middleware
- **Storage**: AsyncStorage for secure session persistence  
- **Navigation**: Expo Router with protected routes
- **Validation**: Custom TypeScript validation utilities
- **UI**: React Native with Lucide icons

## 🔑 Authentication Methods

### 1. Email/Password Authentication

**Screens**: `LoginScreen`, `RegisterScreen`

**Features**:
- Comprehensive password validation (8+ chars, uppercase, lowercase, numbers)
- Email format validation
- Password visibility toggle
- Account creation with terms acceptance

**Example Usage**:
```typescript
const { loginWithEmail, registerWithEmail } = useAuth();

// Login
await loginWithEmail({ email: 'user@example.com', password: 'SecurePass123' });

// Register
await registerWithEmail({
  name: 'John Doe',
  email: 'user@example.com', 
  password: 'SecurePass123',
  confirmPassword: 'SecurePass123'
});
```

### 2. Phone OTP Authentication

**Screens**: `OtpRequestScreen`, `OtpVerifyScreen`

**Features**:
- International phone number support with auto-formatting
- 6-digit OTP verification
- Resend functionality with 60-second cooldown timer
- Auto-focus and auto-submit OTP inputs

**Flow**:
1. User enters phone number (+1234567890 format)
2. OTP sent via SMS (mock: always use `123456`)
3. User enters 6-digit code
4. Automatic verification and login

**Example Usage**:
```typescript
const { requestOTP, verifyOTP } = useAuth();

// Step 1: Request OTP
await requestOTP({ phone: '+1234567890' });

// Step 2: Verify OTP  
await verifyOTP({
  phone: '+1234567890',
  otp: '123456',
  requestId: 'request-id'
});
```

### 3. Google SSO (Placeholder)

**Component**: `GoogleAuthButton`

**Current State**: Placeholder implementation with setup instructions

**Future Implementation**:
- OAuth 2.0 flow with `expo-auth-session`
- Google OpenID Connect integration
- Profile information retrieval

## 📱 User Interface

### Login Screen
- Email/password form with validation
- Google sign-in button
- Phone sign-in option
- Link to registration

### Registration Screen  
- Full name, email, password, confirm password
- Real-time validation feedback
- Password strength requirements
- Terms of service acceptance

### OTP Screens
- Phone number input with formatting
- 6-digit OTP input with auto-focus
- Resend timer with cooldown
- Clear visual feedback

## 🔒 Security Features

### Input Validation
- Email format validation with regex
- Phone number E.164 format validation
- Password strength requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter  
  - At least one number

### Session Management
- Secure token storage with AsyncStorage
- Automatic session restoration on app launch
- Token validation (placeholder for backend integration)
- Secure logout with cleanup

### Route Protection
- AuthGate component intercepts all navigation
- Automatic redirection based on auth state:
  - Unauthenticated → Login screen
  - Authenticated + first time → Onboarding
  - Authenticated + returning → Dashboard

## 📊 State Management

### Auth Store Schema
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpRequestId: string | null;
  resendTimer: number;
  hasCompletedOnboarding: boolean;
}
```

### User Model
```typescript
interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatar?: string;
  teamId?: string;
  provider: 'email' | 'phone' | 'google';
  token: string;
  refreshToken?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## 🔄 API Integration

### Current Implementation
All API calls are currently **mocked** for development. Each method includes:
- Realistic response delays (0.8-1.5 seconds)
- Success/error scenarios for testing
- Proper TypeScript return types
- Console logging for debugging

### Backend Integration Points

#### Email/Password Endpoints
```typescript
// POST /auth/login
loginWithEmail(email: string, password: string): Promise<ApiResponse<{user: User, token: string}>>

// POST /auth/register  
registerWithEmail(email: string, password: string, name: string): Promise<ApiResponse<{user: User, token: string}>>
```

#### OTP Endpoints  
```typescript
// POST /auth/otp/request
requestOTP(phone: string): Promise<ApiResponse<{requestId: string}>>

// POST /auth/otp/verify
loginWithOTP(phone: string, otp: string): Promise<ApiResponse<{user: User, token: string}>>
```

#### Google SSO Endpoint
```typescript
// POST /auth/google
loginWithGoogle(idToken: string): Promise<ApiResponse<{user: User, token: string}>>
```

## 🚀 Google SSO Setup Guide

### Prerequisites
1. Google Cloud Console project
2. OAuth 2.0 credentials configured
3. Authorized redirect URIs added

### Step 1: Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 Client IDs for:
   - **Android**: Package name + SHA-1 certificate fingerprint
   - **iOS**: Bundle ID
   - **Web**: Authorized redirect URIs

### Step 2: Configure app.json

Add the client IDs to your Expo configuration:

```json
{
  "expo": {
    "extra": {
      "googleClientId": {
        "android": "YOUR_ANDROID_CLIENT_ID",
        "ios": "YOUR_IOS_CLIENT_ID", 
        "web": "YOUR_WEB_CLIENT_ID"
      }
    }
  }
}
```

### Step 3: Implement AuthSession Flow

Replace the placeholder in `GoogleAuthButton.tsx`:

```typescript
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

// Configure WebBrowser for AuthSession
WebBrowser.maybeCompleteAuthSession();

const handleGoogleLogin = async () => {
  const clientId = Constants.expoConfig?.extra?.googleClientId;
  
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'teamsync'
  });

  const request = new AuthSession.AuthRequest({
    clientId: clientId.ios, // or android/web based on platform
    scopes: ['openid', 'profile', 'email'],
    responseType: AuthSession.ResponseType.IdToken,
    redirectUri,
  });

  const result = await request.promptAsync({
    authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
  });

  if (result.type === 'success') {
    // Handle successful authentication
    onResult(result);
  }
};
```

### Step 4: Backend Verification

Your backend should verify the Google ID token:

```javascript
// Node.js example
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verifyGoogleToken(idToken) {
  const ticket = await client.verifyIdToken({
    idToken: idToken,
    audience: CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
  };
}
```

## 🧪 Testing Guide

### Mock Data
The system includes realistic mock data for testing:

**Email Authentication**:
- Use any email except `error@test.com` (triggers error)
- Use `taken@test.com` for registration to test duplicate email error
- Any password works in development

**Phone Authentication**:  
- Use any phone number except `+1234567890` (triggers error)
- OTP code is always `123456` in development
- Resend timer works with 60-second countdown

**Error Testing**:
- Invalid email formats
- Weak passwords  
- Mismatched password confirmation
- Invalid phone numbers
- Wrong OTP codes

### Debug Features
Development-only features in Settings screen:
- **Reset Onboarding**: Clear onboarding completion flag
- **Clear All Auth Data**: Complete authentication reset

## 📂 File Structure

```
app/
├── auth/
│   ├── login.tsx              # Email/password + alternative methods
│   ├── register.tsx           # Account creation with validation
│   ├── otp-request.tsx        # Phone number input
│   └── otp-verify.tsx         # OTP verification with resend
├── onboarding.tsx             # First-time user onboarding
├── (tabs)/                    # Protected main app screens
└── _layout.tsx                # AuthGate + route protection

store/
└── authStore.ts               # Zustand store with persistence

lib/
├── api.ts                     # Mock API with backend integration points
└── validation.ts              # Input validation utilities

hooks/
└── useAuth.ts                 # Auth hook with all methods

components/
└── GoogleAuthButton.tsx       # Google SSO component (placeholder)

types/
└── index.ts                   # TypeScript interfaces
```

## 🔄 User Flows

### New User Registration
1. Land on login screen
2. Tap "Sign Up" → Register screen
3. Fill form with validation
4. Create account → Auto login
5. First login → Onboarding screens
6. Complete onboarding → Dashboard

### Returning User Login  
1. App launch → Session restoration
2. Valid token → Direct to dashboard
3. Invalid/missing token → Login screen
4. Successful login → Dashboard

### Phone Authentication
1. Login screen → "Sign in with Phone"
2. Enter phone number → OTP request screen
3. Receive SMS → OTP verify screen  
4. Enter code → Auto verify → Dashboard

### Password Recovery (Future)
1. Login screen → "Forgot Password"
2. Enter email → Reset email sent
3. Click link → Reset password screen
4. New password → Auto login

## 🚧 Future Enhancements

### Security
- [ ] Biometric authentication (Face ID/Touch ID)
- [ ] Two-factor authentication setup
- [ ] Password recovery via email/SMS
- [ ] Account lockout after failed attempts
- [ ] Token refresh mechanism

### Social Authentication
- [ ] Apple Sign-In
- [ ] Facebook Login  
- [ ] Twitter OAuth
- [ ] Microsoft/LinkedIn SSO

### User Experience
- [ ] Remember me functionality
- [ ] Social profile import
- [ ] Account linking (email + phone)
- [ ] Progressive onboarding
- [ ] Personalized welcome experience

### Developer Experience  
- [ ] Automated testing suite
- [ ] Error tracking integration
- [ ] Analytics for auth flows
- [ ] A/B testing framework
- [ ] Performance monitoring

## 📞 Support

For technical questions or implementation help:

1. **Mock Data**: Check console logs for development credentials
2. **Validation Errors**: See `lib/validation.ts` for requirements  
3. **State Issues**: Use debug controls in Settings screen
4. **Route Problems**: Check AuthGate logic in `_layout.tsx`

## 📄 License & Legal

- **Terms of Service**: Links included in registration flow
- **Privacy Policy**: User data handling documentation
- **GDPR Compliance**: User data management and deletion
- **Security Audit**: Regular security review recommendations

---

**Last Updated**: September 12, 2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready (with backend integration)