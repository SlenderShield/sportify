import React from 'react';
import { Redirect } from 'expo-router';

// TODO: Replace with auth state logic
const isAuthenticated = true;

export default function Index() {
  return <Redirect href={isAuthenticated ? '/dashboard' : '/auth/login'} />;
}
