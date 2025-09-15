import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SectionList,
  Pressable,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, Send, Bubble, MessageText, Time } from 'react-native-gifted-chat';
import { Hash, MessageCircle, Search, Users, Plus, Smile } from 'lucide-react-native';

// Import our store and types
import {
  useChatStore,
  useCurrentUser,
  useActiveConversation,
  useConversationMessages,
  useTypingUsers,
  useUnreadTotal,
  setupChatSocket,
} from '../../lib/stores/chatStore';
import type { Conversation, Message, GiftedChatMessage } from '../../lib/types/chat';

const { width: screenWidth } = Dimensions.get('window');

interface ConversationItemProps {
  conversation: Conversation;
  isActive: boolean;
  onPress: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation, isActive, onPress }) => {
  const users = useChatStore(state => state.users);
  
  const formatTime = (timestamp?: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const getOnlineMembers = () => {
    return conversation.memberIds.filter(id => users[id]?.isOnline).length;
  };

  return (
    <TouchableOpacity
      style={[styles.conversationItem, isActive && styles.conversationItemActive]}
      onPress={onPress}
    >
      <View style={styles.conversationLeft}>
        <View style={[styles.conversationAvatar, conversation.type === 'team' && styles.teamAvatar]}>
          <Text style={styles.conversationAvatarText}>
            {conversation.avatar || (conversation.type === 'team' ? '#' : '👤')}
          </Text>
        </View>
        <View style={styles.conversationInfo}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.conversationName, isActive && styles.conversationNameActive]}>
              {conversation.name}
            </Text>
            <Text style={styles.conversationTime}>
              {formatTime(conversation.lastMessageTime)}
            </Text>
          </View>
          <View style={styles.conversationFooter}>
            <Text style={styles.conversationLastMessage} numberOfLines={1}>
              {conversation.lastMessage || 'No messages yet'}
            </Text>
            {conversation.type === 'team' && (
              <Text style={styles.conversationOnlineCount}>
                {getOnlineMembers()}/{conversation.memberIds.length}
              </Text>
            )}
          </View>
        </View>
      </View>
      {conversation.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>
            {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface TypingIndicatorProps {
  conversationId: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ conversationId }) => {
  const typingUsers = useTypingUsers(conversationId);
  
  if (typingUsers.length === 0) return null;
  
  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${typingUsers[0].userName} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${typingUsers[0].userName} and ${typingUsers[1].userName} are typing...`;
    } else {
      return `${typingUsers.length} people are typing...`;
    }
  };

  return (
    <View style={styles.typingIndicator}>
      <View style={styles.typingDots}>
        <ActivityIndicator size="small" color="#6B7280" />
      </View>
      <Text style={styles.typingText}>{getTypingText()}</Text>
    </View>
  );
};

export default function ChatScreen() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showDmModal, setShowDmModal] = useState(false);
  const [reactionPicker, setReactionPicker] = useState<{ visible: boolean; messageId?: string }>({ visible: false });
  
  // Store state
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    sendMessage,
    initializeMockData,
    users,
    addReaction,
  } = useChatStore();
  
  const currentUser = useCurrentUser();
  const activeConversation = useActiveConversation();
  const messages = useConversationMessages(activeConversationId || undefined);
  const unreadTotal = useUnreadTotal();

  // Initialize data and socket connection
  useEffect(() => {
    initializeMockData();
    setupChatSocket();
  }, []);

  // Auto-select first conversation
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversation(conversations[0].id);
    }
  }, [conversations.length, activeConversationId, setActiveConversation]);

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const teamChannels = filteredConversations.filter(conv => conv.type === 'team');
  const directMessages = filteredConversations.filter(conv => conv.type === 'dm');
  const searchResults = useChatStore(state => state.searchMessages(searchQuery));

  const handleSend = useCallback((messagesToSend: IMessage[]) => {
    if (!activeConversationId || messagesToSend.length === 0) return;
    
    const message = messagesToSend[0];
    sendMessage(activeConversationId, message.text);
  }, [activeConversationId, sendMessage]);

  const handleInputTextChanged = useCallback((text: string) => {
    if (!activeConversationId || !currentUser) return;
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Only send typing indicator if there's text
    if (text.trim()) {
      const chatSocket = require('../../lib/socket').ChatSocketManager.getInstance();
      chatSocket.startTyping(activeConversationId, currentUser.id, currentUser.name);
      
      // Stop typing after 3 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        chatSocket.stopTyping(activeConversationId, currentUser.id);
      }, 3000);
    }
  }, [activeConversationId, currentUser]);

  const renderBubble = (props: any) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#3B82F6',
          },
          left: {
            backgroundColor: '#F3F4F6',
          },
        }}
        textStyle={{
          right: {
            color: '#FFFFFF',
          },
          left: {
            color: '#1F2937',
          },
        }}
      />
    );
  };

  const renderMessageText = (props: any) => {
    return (
      <MessageText
        {...props}
        textStyle={{
          right: { color: '#FFFFFF' },
          left: { color: '#1F2937' },
        }}
      />
    );
  };

  const renderTime = (props: any) => {
    return (
      <Time
        {...props}
        timeTextStyle={
          props.position === 'right'
            ? { right: { color: '#E5E7EB' } }
            : { left: { color: '#9CA3AF' } }
        }
      />
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View style={styles.sendButton}>
          <Text style={styles.headerButtonText}>Send</Text>
        </View>
      </Send>
    );
  };

  const renderSidebar = () => (
    <Modal visible={showSidebar} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Conversations</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setShowDmModal(true)} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>New DM</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowSidebar(false)}>
              <Text style={styles.sidebarClose}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={16} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {searchQuery.trim().length >= 2 ? (
          <SectionList
            sections={[{ title: 'Search Results', data: searchResults }]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const conv = conversations.find(c => c.id === item.conversationId);
              return (
                <TouchableOpacity
                  style={styles.searchResultItem}
                  onPress={() => {
                    setActiveConversation(item.conversationId);
                    setShowSidebar(false);
                  }}
                >
                  <Text style={styles.searchResultTitle}>{conv?.name || 'Conversation'}</Text>
                  <Text style={styles.searchResultText} numberOfLines={1}>{item.text}</Text>
                </TouchableOpacity>
              );
            }}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <SectionList
            sections={[
              { title: 'Team Channels', data: teamChannels },
              { title: 'Direct Messages', data: directMessages },
            ]}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <ConversationItem
                conversation={item}
                isActive={item.id === activeConversationId}
                onPress={() => {
                  setActiveConversation(item.id);
                  setShowSidebar(false);
                }}
              />
            )}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}

        <Modal visible={showDmModal} animationType="slide" onRequestClose={() => setShowDmModal(false)}>
          <SafeAreaView style={styles.dmModalContainer}>
            <View style={styles.dmModalHeader}>
              <Text style={styles.dmModalTitle}>Start a Direct Message</Text>
              <TouchableOpacity onPress={() => setShowDmModal(false)}>
                <Text style={styles.sidebarClose}>Close</Text>
              </TouchableOpacity>
            </View>
            <SectionList
              sections={[{ title: 'Users', data: Object.values(users).filter(u => u.id !== currentUser?.id) }]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dmUserItem}
                  onPress={() => {
                    const existing = conversations.find(c => c.type === 'dm' && c.memberIds.includes(item.id) && c.memberIds.includes(currentUser!.id));
                    if (existing) {
                      setActiveConversation(existing.id);
                    } else {
                      const id = useChatStore.getState().createConversation({
                        name: item.name,
                        type: 'dm',
                        memberIds: [currentUser!.id, item.id],
                        unreadCount: 0,
                        avatar: '👤',
                      });
                      setActiveConversation(id);
                    }
                    setShowDmModal(false);
                    setShowSidebar(false);
                  }}
                >
                  <Text style={styles.dmUserName}>{item.name}</Text>
                  <Text style={styles.dmUserPresence}>{item.isOnline ? 'Online' : 'Offline'}</Text>
                </TouchableOpacity>
              )}
              renderSectionHeader={({ section }) => (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>{section.title}</Text>
                </View>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Modal>
  );

  const renderChatHeader = () => (
    <View style={styles.chatHeader}>
      <TouchableOpacity
        style={styles.sidebarToggle}
        onPress={() => setShowSidebar(true)}
      >
        <Hash size={20} color="#3B82F6" />
        {unreadTotal > 0 && (
          <View style={styles.headerUnreadBadge}>
            <Text style={styles.headerUnreadBadgeText}>
              {unreadTotal > 99 ? '99+' : unreadTotal}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      <View style={styles.chatHeaderInfo}>
        <Text style={styles.chatHeaderTitle}>
          {activeConversation?.name || 'Select a conversation'}
        </Text>
        {activeConversation?.type === 'team' && (
          <View style={styles.memberCount}>
            <Users size={12} color="#6B7280" />
            <Text style={styles.memberCountText}>
              {activeConversation.memberIds.filter(id => users[id]?.isOnline).length}/
              {activeConversation.memberIds.length} online
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  if (!currentUser) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderChatHeader()}
      
      {activeConversationId ? (
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            onSend={handleSend}
            onLongPress={(context: any, message: any) => {
              setReactionPicker({ visible: true, messageId: message?._id });
            }}
            onInputTextChanged={handleInputTextChanged}
            user={{
              _id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
            }}
            renderBubble={renderBubble}
            renderMessageText={renderMessageText}
            renderTime={renderTime}
            renderSend={renderSend}
            placeholder="Type a message..."
            showUserAvatar
            alwaysShowSend
            keyboardShouldPersistTaps="never"
          />
          <TypingIndicator conversationId={activeConversationId} />
          {reactionPicker.visible && (
            <View style={styles.reactionBarContainer}>
              {['👍','❤️','😂','🎉','😮','😢'].map(emoji => (
                <Pressable
                  key={emoji}
                  style={styles.reactionButton}
                  onPress={() => {
                    if (reactionPicker.messageId && currentUser) {
                      addReaction(reactionPicker.messageId, emoji, currentUser.id);
                    }
                    setReactionPicker({ visible: false, messageId: undefined });
                  }}
                >
                  <Text style={styles.reactionText}>{emoji}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setReactionPicker({ visible: false })} style={styles.reactionCancel}>
                <Text style={styles.reactionCancelText}>Cancel</Text>
              </Pressable>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <MessageCircle size={64} color="#D1D5DB" />
          <Text style={styles.emptyStateText}>Select a conversation to start chatting</Text>
          <TouchableOpacity
            style={styles.selectConversationButton}
            onPress={() => setShowSidebar(true)}
          >
            <Text style={styles.selectConversationButtonText}>Browse Conversations</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {renderSidebar()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  conversationItemActive: {
    backgroundColor: '#F3F4F6',
  },
  conversationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  conversationAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamAvatar: {
    backgroundColor: '#DBEAFE',
  },
  conversationAvatarText: {
    fontWeight: '700',
    color: '#1F2937',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  conversationName: {
    fontWeight: '600',
    color: '#111827',
  },
  conversationNameActive: {
    color: '#1D4ED8',
  },
  conversationTime: {
    color: '#6B7280',
    fontSize: 12,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationLastMessage: {
    color: '#4B5563',
    flex: 1,
    marginRight: 8,
  },
  conversationOnlineCount: {
    color: '#6B7280',
    fontSize: 12,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  sidebarClose: {
    color: '#3B82F6',
    fontWeight: '600',
    fontSize: 16,
  },
  headerButton: {
    marginRight: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
  },
  headerButtonText: {
    color: '#111827',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  sectionHeaderText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 16,
  },
  searchResultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchResultTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  searchResultText: {
    color: '#4B5563',
  },
  dmModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dmModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dmModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  dmUserItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dmUserName: {
    color: '#111827',
    fontWeight: '500',
  },
  dmUserPresence: {
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 12,
  },
  usersIcon: {
    marginRight: 4,
  },
  activeUsersText: {
    fontSize: 12,
    color: '#6B7280',
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  sidebarToggle: {
    marginRight: 12,
  },
  headerUnreadBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  headerUnreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  memberCountText: {
    marginLeft: 4,
    color: '#6B7280',
    fontSize: 12,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typingDots: {
    marginRight: 8,
  },
  typingText: {
    color: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 12,
    color: '#6B7280',
  },
  selectConversationButton: {
    marginTop: 16,
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  selectConversationButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 24,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reactionBarContainer: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reactionButton: {
    marginHorizontal: 6,
  },
  reactionText: {
    fontSize: 20,
  },
  reactionCancel: {
    marginLeft: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  reactionCancelText: {
    color: '#111827',
    fontWeight: '600',
  },
});