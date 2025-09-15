import { Platform, Linking } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

export const openMaps = async (
  location?: string,
  latitude?: number,
  longitude?: number
) => {
  let url = '';

  if (latitude && longitude) {
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(location || 'Location')}`;
    } else if (Platform.OS === 'android') {
      url = `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(location || 'Location')})`;
    } else {
      // Web
      url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    }
  } else if (location) {
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?q=${encodeURIComponent(location)}`;
    } else if (Platform.OS === 'android') {
      url = `geo:0,0?q=${encodeURIComponent(location)}`;
    } else {
      // Web
      url = `https://www.google.com/maps/search/${encodeURIComponent(location)}`;
    }
  } else {
    // Open maps without specific location
    if (Platform.OS === 'ios') {
      url = 'http://maps.apple.com/';
    } else if (Platform.OS === 'android') {
      url = 'geo:';
    } else {
      url = 'https://www.google.com/maps';
    }
  }

  try {
    if (Platform.OS === 'web') {
      await WebBrowser.openBrowserAsync(url);
    } else {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.error(`Don't know how to open this URL: ${url}`);
        // Fallback to browser
        await WebBrowser.openBrowserAsync(url);
      }
    }
  } catch (error) {
    console.error('Error opening maps:', error);
  }
};

export const openDirections = async (
  destination: string,
  latitude?: number,
  longitude?: number
) => {
  let url = '';

  if (latitude && longitude) {
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
    } else if (Platform.OS === 'android') {
      url = `google.navigation:q=${latitude},${longitude}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
  } else {
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?daddr=${encodeURIComponent(destination)}&dirflg=d`;
    } else if (Platform.OS === 'android') {
      url = `google.navigation:q=${encodeURIComponent(destination)}`;
    } else {
      url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    }
  }

  try {
    if (Platform.OS === 'web') {
      await WebBrowser.openBrowserAsync(url);
    } else {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        // Fallback for Android navigation
        const fallbackUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
        await WebBrowser.openBrowserAsync(fallbackUrl);
      }
    }
  } catch (error) {
    console.error('Error opening directions:', error);
  }
};