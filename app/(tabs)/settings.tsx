import { YStack, XStack, Text, Button, ScrollView } from 'tamagui';
import { Switch, Alert } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { router } from 'expo-router';
import { User, Bell, Lock, Info, LogOut, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const { user, logout, resetOnboarding, clearAll } = useAuth();
  const { settings, updateSettings } = useNotifications();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  const handleNotificationToggle = (setting: keyof typeof settings) => {
    updateSettings({ [setting]: !settings[setting] });
  };

  const renderSettingItem = (
    icon: any,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightElement?: React.ReactNode
  ) => (
    <Button chromeless onPress={onPress} disabled={!onPress && !rightElement} width="100%" padding={0}>
      <XStack alignItems="center" justifyContent="space-between" paddingHorizontal="$4" paddingVertical="$4" borderBottomWidth={1} borderBottomColor="$border">
        <XStack alignItems="center" flex={1}>
          {icon}
          <YStack marginLeft="$3" flex={1}>
            <Text fontSize="$5" fontWeight="500" color="$gray12">{title}</Text>
            {subtitle && <Text fontSize="$4" color="$gray10" marginTop={2}>{subtitle}</Text>}
          </YStack>
        </XStack>
        {rightElement || (onPress && <ChevronRight size={20} color="#6B7280" />)}
      </XStack>
    </Button>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <YStack backgroundColor="$background" marginBottom="$2">
      <Text fontSize="$4" fontWeight="600" color="$gray10" paddingHorizontal="$4" paddingTop="$4" paddingBottom="$2" textTransform="uppercase">{title}</Text>
      <YStack paddingBottom="$2">
        {children}
      </YStack>
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack paddingHorizontal="$4" paddingVertical="$4" backgroundColor="$white" borderBottomWidth={1} borderBottomColor="$border">
        <Text fontSize="$7" fontWeight="600" color="$gray12">Settings</Text>
      </YStack>
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        {renderSection('Profile', (
          <>
            {renderSettingItem(
              <User size={24} color="#3B82F6" />,
              user?.name || 'User',
              user?.email,
              () => {
                // TODO: Navigate to profile edit screen
                console.log('Edit profile');
              }
            )}
          </>
        ))}

        {/* Notifications Section */}
        {renderSection('Notifications', (
          <>
            {renderSettingItem(
              <Bell size={24} color="#10B981" />,
              'Match Reminders',
              'Get notified about upcoming matches',
              undefined,
              <Switch
                value={settings.matchReminders}
                onValueChange={() => handleNotificationToggle('matchReminders')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            )}
            {renderSettingItem(
              <Bell size={24} color="#10B981" />,
              'Chat Notifications',
              'Receive notifications for new messages',
              undefined,
              <Switch
                value={settings.chatNotifications}
                onValueChange={() => handleNotificationToggle('chatNotifications')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            )}
            {renderSettingItem(
              <Bell size={24} color="#10B981" />,
              'General Updates',
              'News and announcements from the team',
              undefined,
              <Switch
                value={settings.generalUpdates}
                onValueChange={() => handleNotificationToggle('generalUpdates')}
                trackColor={{ false: '#D1D5DB', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            )}
          </>
        ))}

        {/* Security Section */}
        {renderSection('Security', (
          <>
            {renderSettingItem(
              <Lock size={24} color="#F59E0B" />,
              'Change Password',
              'Update your account password',
              () => {
                // TODO: Navigate to change password screen
                console.log('Change password');
              }
            )}
          </>
        ))}

        {/* About Section */}
        {renderSection('About', (
          <>
            {renderSettingItem(
              <Info size={24} color="#6B7280" />,
              'About',
              'Version 1.0.0',
              () => {
                // TODO: Show about screen
                Alert.alert('About', 'Sports App v1.0.0\n\nBuilt with Expo and React Native');
              }
            )}
          </>
        ))}

        {/* Debug Section - For Development */}
        {__DEV__ && renderSection('Debug (Development Only)', (
          <>
            {renderSettingItem(
              <Info size={24} color="#8B5CF6" />,
              'Reset Onboarding',
              'Show onboarding screen on next login',
              () => {
                resetOnboarding();
                Alert.alert('Success', 'Onboarding reset! You will see the onboarding flow after next login.');
              }
            )}
            {renderSettingItem(
              <Lock size={24} color="#DC2626" />,
              'Clear All Auth Data',
              'Reset authentication state completely',
              () => {
                Alert.alert(
                  'Clear All Data',
                  'This will clear all authentication data and log you out. Continue?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Clear',
                      style: 'destructive',
                      onPress: () => {
                        clearAll();
                        router.replace('/auth/login');
                      }
                    }
                  ]
                );
              }
            )}
          </>
        ))}

        {/* Logout Section */}
        <YStack backgroundColor="$white" marginTop="$4" paddingVertical="$2">
          <Button chromeless onPress={handleLogout} flexDirection="row" alignItems="center" paddingHorizontal="$4" paddingVertical="$4">
            <LogOut size={24} color="#EF4444" />
            <Text fontSize="$5" fontWeight="500" color="$red10" marginLeft="$3">Logout</Text>
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
