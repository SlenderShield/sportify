import React from 'react';
import { Stack } from 'expo-router';
import { GlobalStylesProvider } from './src/theme/NativeWindProvider';
import { Provider } from 'react-redux';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <GlobalStylesProvider>
        <Stack />
      </GlobalStylesProvider>
    </Provider>
  );
}
