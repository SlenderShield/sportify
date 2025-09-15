import { View, Text, YStack, XStack, ScrollView, Button } from 'tamagui';
import { FlatList, TouchableOpacity, Alert } from 'react-native';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationItem } from '@/components/NotificationItem';
import { CheckCheck, Trash2, Settings } from 'lucide-react-native';
import type { NotificationItem as NotificationItemType } from '@/types';

export default function NotificationsScreen() {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification,
    clearAll 
  } = useNotifications();

  const handleNotificationPress = (notification: NotificationItemType) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // TODO: Navigate based on notification type
    switch (notification.type) {
      case 'match':
        // Navigate to match details
        console.log('Navigate to match:', notification.actionData?.matchId);
        break;
      case 'chat':
        // Navigate to chat
        console.log('Navigate to chat:', notification.actionData?.chatId);
        break;
      case 'reminder':
        // Handle reminder action
        console.log('Handle reminder:', notification.actionData);
        break;
      default:
        console.log('General notification pressed');
    }
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => removeNotification(notificationId),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: clearAll,
        },
      ]
    );
  };

  const renderNotification = ({ item }: { item: NotificationItemType }) => (
    <NotificationItem
      notification={item}
      onPress={() => handleNotificationPress(item)}
      onDelete={() => handleDeleteNotification(item.id)}
    />
  );

  const renderHeader = () => (
  <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$4" paddingVertical="$4" backgroundColor="$background" borderWidth={1} borderColor="$border">
    <YStack>
      <Text fontSize="$7" fontWeight="600" color="$text">Notifications</Text>
      {unreadCount > 0 && (
        <Text fontSize="$4" color="$secondary" marginTop="$1">{unreadCount} unread</Text>
      )}
    </YStack>
    <XStack alignItems="center" gap="$2">
      {unreadCount > 0 && (
        <Button chromeless onPress={markAllAsRead} padding={8} marginLeft={4}>
          <CheckCheck size={20} color="#3B82F6" />
        </Button>
      )}
      {notifications.length > 0 && (
        <Button chromeless onPress={handleClearAll} padding={8} marginLeft={4}>
          <Trash2 size={20} color="#EF4444" />
        </Button>
      )}
      <Button chromeless onPress={() => { console.log('Open notification settings'); }} padding={8} marginLeft={4}>
        <Settings size={20} color="#6B7280" />
      </Button>
    </XStack>
  </XStack>
  );

  const renderEmpty = () => (
    <YStack alignItems="center" paddingHorizontal={20}>
      <Text fontSize={20} fontWeight="600" color="$text" marginBottom={8}>No Notifications</Text>
      <Text fontSize={16} color="$secondary" textAlign="center" lineHeight={22}>
        You're all caught up! New notifications will appear here.
      </Text>
    </YStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      {renderHeader()}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        style={{ flex: 1 }}
        contentContainerStyle={notifications.length === 0 ? { flexGrow: 1, justifyContent: 'center' } : undefined}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
}

// Styles removed: now using Tamagui tokens and primitives for layout and spacing