import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress && !rightElement}
    >
      <View style={styles.settingLeft}>
        {icon}
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (onPress && <ChevronRight size={20} color="#6B7280" />)}
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LogOut size={24} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    textTransform: 'uppercase',
  },
  sectionContent: {
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  logoutSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 20,
    paddingVertical: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 16,
  },
});