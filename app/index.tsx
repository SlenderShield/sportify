import React from 'react';
import { Redirect } from 'expo-router';

// TODO: Replace with auth state logic
const isAuthenticated = false;

export default function Index() {
  return <Redirect href={isAuthenticated ? '/(main)/home' : '/auth/login'} />;
}
