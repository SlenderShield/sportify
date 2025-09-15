import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { NotificationItem as NotificationItemType } from '@/types';
import { Bell, MessageCircle, Calendar, Info, Trash2 } from 'lucide-react-native';

interface NotificationItemProps {
  notification: NotificationItemType;
  onPress: () => void;
  onDelete: () => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onPress,
  onDelete
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'match':
        return <Calendar size={20} color="#3B82F6" />;
      case 'chat':
        return <MessageCircle size={20} color="#10B981" />;
      case 'reminder':
        return <Bell size={20} color="#F59E0B" />;
      default:
        return <Info size={20} color="#6B7280" />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.read && styles.unreadContainer
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[
            styles.title,
            !notification.read && styles.unreadTitle
          ]}>
            {notification.title}
          </Text>
          <Text style={styles.timestamp}>
            {formatTime(notification.timestamp)}
          </Text>
        </View>
        
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
        
        {!notification.read && <View style={styles.unreadDot} />}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Trash2 size={16} color="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unreadContainer: {
    backgroundColor: '#FEF3F2',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  message: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: -8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
});