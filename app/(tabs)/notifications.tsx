import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
    <View style={styles.header}>
      <View>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <Text style={styles.unreadCount}>{unreadCount} unread</Text>
        )}
      </View>
      <View style={styles.headerActions}>
        {unreadCount > 0 && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={markAllAsRead}
          >
            <CheckCheck size={20} color="#3B82F6" />
          </TouchableOpacity>
        )}
        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleClearAll}
          >
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            // TODO: Navigate to notification settings
            console.log('Open notification settings');
          }}
        >
          <Settings size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        style={styles.list}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  unreadCount: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 4,
  },
  list: {
    flex: 1,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});