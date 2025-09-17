import React from 'react';
import { Button, Text, XStack } from 'tamagui';
import { Alert } from 'react-native';
// TODO: Import expo-auth-session when implementing
// import * as AuthSession from 'expo-auth-session';
// import * as WebBrowser from 'expo-web-browser';

interface GoogleAuthButtonProps {
  onResult: (result: any) => void;
  disabled?: boolean;
}

// TODO: Configure these values in app.json and replace with actual Google Client IDs
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID';
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID';

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  onResult, 
  disabled = false 
}) => {
  const handleGoogleLogin = async () => {
    // TODO: Implement Google authentication with expo-auth-session
    // For now, show placeholder
    Alert.alert(
      'Google Sign-In',
      'Google authentication will be available soon!\n\nTo implement:\n1. Configure OAuth in Google Console\n2. Add client IDs to app.json\n3. Implement AuthSession flow',
      [{ text: 'OK' }]
    );
    
    // Mock result for development
    const mockResult = {
      type: 'success',
      idToken: 'mock-google-id-token',
      accessToken: 'mock-google-access-token',
      user: {
        id: 'google-user-123',
        email: 'user@gmail.com',
        name: 'Google User',
        picture: 'https://lh3.googleusercontent.com/a/default-user=s96-c'
      }
    };
    
    onResult(mockResult);
  };

  return (
    <Button
      chromeless
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$border"
      borderRadius={12}
      paddingVertical={16}
      marginBottom={12}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      disabled={disabled}
      opacity={disabled ? 0.6 : 1}
      onPress={handleGoogleLogin}
    >
      {/* TODO: Add Google logo SVG */}
      <Text fontSize={16} fontWeight="600" color="$text">Continue with Google</Text>
    </Button>
  );
};

// ...existing code...