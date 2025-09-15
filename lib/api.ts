import type { ApiResponse, User } from '@/types';

// TODO: Replace with actual API base URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  setAuthToken(token: string) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Auth endpoints - Email/Password
  async loginWithEmail(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // TODO: Implement actual API call
    // return this.request('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password }),
    // });
    
    // Mock response for development
    return new Promise(resolve => 
      setTimeout(() => {
        if (email === 'error@test.com') {
          resolve({
            success: false,
            error: 'Invalid email or password'
          });
          return;
        }
        
        const mockUser: User = {
          id: '1',
          email,
          name: 'John Doe',
          avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
          teamId: 'team-1',
          provider: 'email',
          token: 'mock-email-token-' + Date.now(),
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        resolve({
          success: true,
          data: { 
            user: mockUser,
            token: mockUser.token
          }
        });
      }, 1000)
    );
  }

  async registerWithEmail(email: string, password: string, name: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // TODO: Implement actual API call
    // return this.request('/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, password, name }),
    // });
    
    // Mock response for development
    return new Promise(resolve => 
      setTimeout(() => {
        if (email === 'taken@test.com') {
          resolve({
            success: false,
            error: 'Email already exists'
          });
          return;
        }
        
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name,
          avatar: 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
          provider: 'email',
          token: 'mock-email-token-' + Date.now(),
          emailVerified: false, // Typically false for new registrations
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        resolve({
          success: true,
          data: { 
            user: mockUser,
            token: mockUser.token
          }
        });
      }, 1000)
    );
  }

  // Auth endpoints - Mobile OTP
  async requestOTP(phone: string): Promise<ApiResponse<{ requestId: string }>> {
    // TODO: Implement actual API call with SMS provider (Twilio, Firebase, etc.)
    // return this.request('/auth/otp/request', {
    //   method: 'POST',
    //   body: JSON.stringify({ phone }),
    // });
    
    // Mock response for development
    return new Promise(resolve => 
      setTimeout(() => {
        if (phone === '+1234567890') {
          resolve({
            success: false,
            error: 'Invalid phone number format'
          });
          return;
        }
        
        const requestId = 'otp-request-' + Date.now();
        console.log(`[MOCK OTP] Sent OTP to ${phone}. RequestID: ${requestId}. Code: 123456`);
        
        resolve({
          success: true,
          data: { requestId }
        });
      }, 1500)
    );
  }

  async loginWithOTP(phone: string, otp: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // TODO: Implement actual API call with SMS provider verification
    // return this.request('/auth/otp/verify', {
    //   method: 'POST',
    //   body: JSON.stringify({ phone, otp }),
    // });
    
    // Mock response for development
    return new Promise(resolve => 
      setTimeout(() => {
        if (otp !== '123456') {
          resolve({
            success: false,
            error: 'Invalid OTP code'
          });
          return;
        }
        
        const mockUser: User = {
          id: phone.replace(/\D/g, ''), // Use phone digits as ID
          phone,
          name: 'User ' + phone.slice(-4),
          provider: 'phone',
          token: 'mock-phone-token-' + Date.now(),
          phoneVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        resolve({
          success: true,
          data: { 
            user: mockUser,
            token: mockUser.token
          }
        });
      }, 1000)
    );
  }

  // Auth endpoints - Google SSO
  async loginWithGoogle(idToken: string): Promise<ApiResponse<{ user: User; token: string }>> {
    // TODO: Implement actual API call with Google token verification
    // return this.request('/auth/google', {
    //   method: 'POST',
    //   body: JSON.stringify({ idToken }),
    // });
    
    // Mock response for development
    return new Promise(resolve => 
      setTimeout(() => {
        if (idToken === 'invalid_token') {
          resolve({
            success: false,
            error: 'Invalid Google token'
          });
          return;
        }
        
        const mockUser: User = {
          id: 'google-' + Date.now(),
          email: 'user@gmail.com',
          name: 'Google User',
          avatar: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          provider: 'google',
          token: 'mock-google-token-' + Date.now(),
          emailVerified: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        resolve({
          success: true,
          data: { 
            user: mockUser,
            token: mockUser.token
          }
        });
      }, 800)
    );
  }

  // Match endpoints
  async getMatches() {
    // TODO: Implement actual API call
    // return this.request('/matches');
    
    // Mock response for development
    return new Promise(resolve => 
      setTimeout(() => resolve([
        {
          id: '1',
          homeTeam: 'Lions FC',
          awayTeam: 'Eagles FC',
          date: new Date(Date.now() + 86400000 * 2).toISOString(),
          time: '15:00',
          venue: 'City Stadium',
          status: 'upcoming'
        }
      ]), 500)
    );
  }

  // Calendar endpoints
  async getEvents() {
    // TODO: Implement actual API call
    // return this.request('/events');
    
    // Mock response
    return new Promise(resolve => setTimeout(() => resolve([]), 500));
  }

  async createEvent(event: any) {
    // TODO: Implement actual API call
    // return this.request('/events', {
    //   method: 'POST',
    //   body: JSON.stringify(event),
    // });
    
    console.log('Would create event:', event);
    return Promise.resolve(event);
  }

  // Notification endpoints
  async updateNotificationSettings(settings: any) {
    // TODO: Implement actual API call
    // return this.request('/notifications/settings', {
    //   method: 'PUT',
    //   body: JSON.stringify(settings),
    // });
    
    console.log('Would update notification settings:', settings);
    return Promise.resolve(settings);
  }
}

export const api = new ApiClient(API_BASE_URL);

// Export auth functions for direct use
export const loginWithEmail = (email: string, password: string) => api.loginWithEmail(email, password);
export const registerWithEmail = (email: string, password: string, name: string) => api.registerWithEmail(email, password, name);
export const requestOTP = (phone: string) => api.requestOTP(phone);
export const loginWithOTP = (phone: string, otp: string) => api.loginWithOTP(phone, otp);
export const loginWithGoogle = (idToken: string) => api.loginWithGoogle(idToken);
