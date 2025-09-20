import { TamaguiProvider } from 'tamagui';
import { Provider } from 'react-redux';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { store } from '@/store';
import tamaguiConfig from '@/utils/tamagui.config';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <TamaguiProvider config={tamaguiConfig}>
            <StatusBar style='auto' />
            <Slot />
          </TamaguiProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
