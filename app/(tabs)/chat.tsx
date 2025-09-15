import React, { useState, useCallback, useMemo } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { Hash, MessageCircle, Search, Users } from 'lucide-react-native';
import {
  YStack,
  XStack,
  Button,
  Input,
  Spinner,
  Text,
  Sheet,
  Separator,
} from 'tamagui';
import { ChatBubble } from '../../components/ChatBubble';
import { ChatMessage } from '@/types';
import {
  useChatStore,
  useCurrentUser,
  useActiveConversation,
  useConversationMessages,
  useUnreadTotal,
} from '../../lib/stores/chatStore';
import type { Conversation, Message, GiftedChatMessage, User } from '../../lib/types/chat';

type SidebarProps = {
  showSidebar: boolean;
  setShowSidebar: (v: boolean) => void;
  showDmModal: boolean;
  setShowDmModal: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  teamChannels: Conversation[];
  directMessages: Conversation[];
  searchResults: Message[];
  activeConversationId: string | null;
  setActiveConversation: (id: string) => void;
  conversations: Conversation[];
  users: Record<string, User>;
  currentUser: User;
};

const Sidebar = ({
  showSidebar,
  setShowSidebar,
  showDmModal,
  setShowDmModal,
  searchQuery,
  setSearchQuery,
  teamChannels,
  directMessages,
  searchResults,
  activeConversationId,
  setActiveConversation,
  conversations,
  users,
  currentUser,
}: SidebarProps) => (
  <Sheet modal open={showSidebar} onOpenChange={setShowSidebar} snapPoints={[80]}>
    <YStack backgroundColor="$background" flex={1}>
      {/* Header */}
      <XStack
        paddingHorizontal={20}
        paddingVertical={12}
        alignItems="center"
        justifyContent="space-between"
      >
        <Text fontSize={18} fontWeight="600" color="$gray12">
          Conversations
        </Text>
        <Button size="$2" chromeless marginRight={16} onPress={() => setShowDmModal(true)}>
          <Text fontWeight="600" color="$gray12">New DM</Text>
        </Button>
        <Button size="$2" chromeless onPress={() => setShowSidebar(false)}>
          <Text fontWeight="600" color="$blue10">Done</Text>
        </Button>
      </XStack>

      {/* Search */}
      <XStack
        marginHorizontal={16}
        marginBottom={8}
        paddingHorizontal={12}
        borderWidth={1}
        borderColor="$gray5"
        borderRadius={12}
        alignItems="center"
      >
        <Search size={16} color="#6B7280" />
        <Input
          flex={1}
          height={40}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </XStack>

      {/* Content */}
      <YStack flex={1}>
        {searchQuery.trim().length >= 2 ? (
          <>
            <Text
              fontSize={12}
              color="$gray8"
              fontWeight="600"
              textTransform="uppercase"
              paddingHorizontal={16}
              paddingVertical={8}
            >
              Search Results
            </Text>
            {searchResults.map(item => {
              const conv = conversations.find(c => c.id === item.conversationId);
              return (
                <Button
                  key={item.id}
                  chromeless
                  paddingHorizontal={16}
                  paddingVertical={12}
                  onPress={() => {
                    setActiveConversation(item.conversationId);
                    setShowSidebar(false);
                  }}
                >
                  <YStack>
                    <Text fontWeight="600" color="$gray12" marginBottom={2}>
                      {conv?.name || 'Conversation'}
                    </Text>
                    <Text color="$gray10" numberOfLines={1}>
                      {item.text}
                    </Text>
                  </YStack>
                </Button>
              );
            })}
            <Separator marginLeft={16} />
          </>
        ) : (
          <>
            <Text
              fontSize={12}
              color="$gray8"
              fontWeight="600"
              textTransform="uppercase"
              paddingHorizontal={16}
              paddingVertical={8}
            >
              Team Channels
            </Text>
            {teamChannels.map(item => (
              <Button
                key={item.id}
                chromeless
                paddingHorizontal={16}
                paddingVertical={12}
                onPress={() => {
                  setActiveConversation(item.id);
                  setShowSidebar(false);
                }}
              >
                <Text fontWeight="600" color="$gray12">{item.name}</Text>
              </Button>
            ))}
            <Separator marginLeft={16} />

            <Text
              fontSize={12}
              color="$gray8"
              fontWeight="600"
              textTransform="uppercase"
              paddingHorizontal={16}
              paddingVertical={8}
            >
              Direct Messages
            </Text>
            {directMessages.map(item => (
              <Button
                key={item.id}
                chromeless
                paddingHorizontal={16}
                paddingVertical={12}
                onPress={() => {
                  setActiveConversation(item.id);
                  setShowSidebar(false);
                }}
              >
                <Text fontWeight="600" color="$gray12">{item.name}</Text>
              </Button>
            ))}
            <Separator marginLeft={16} />
          </>
        )}
      </YStack>

      {/* New DM Modal */}
      <Sheet modal open={showDmModal} onOpenChange={setShowDmModal} snapPoints={[60]}>
        <YStack backgroundColor="$background" flex={1}>
          <XStack
            paddingHorizontal={20}
            paddingVertical={12}
            alignItems="center"
            justifyContent="space-between"
          >
            <Text fontSize={18} fontWeight="600" color="$gray12">
              Start a Direct Message
            </Text>
            <Button size="$2" chromeless onPress={() => setShowDmModal(false)}>
              <Text fontWeight="600" color="$blue10">Close</Text>
            </Button>
          </XStack>
          {Object.values(users)
            .filter(u => u.id !== currentUser.id)
            .map(user => (
              <Button
                key={user.id}
                chromeless
                paddingHorizontal={16}
                paddingVertical={12}
                onPress={() => {
                  const existing = conversations.find(
                    c =>
                      c.type === 'dm' &&
                      c.memberIds.includes(user.id) &&
                      c.memberIds.includes(currentUser.id)
                  );
                  const id = existing
                    ? existing.id
                    : useChatStore
                      .getState()
                      .createConversation({
                        name: user.name,
                        type: 'dm',
                        memberIds: [currentUser.id, user.id],
                        unreadCount: 0,
                        avatar: '👤',
                      });
                  setActiveConversation(id);
                  setShowDmModal(false);
                  setShowSidebar(false);
                }}
              >
                <XStack justifyContent="space-between" alignItems="center">
                  <Text color="$gray12" fontWeight="500">{user.name}</Text>
                  <Text color="$gray8">{user.isOnline ? 'Online' : 'Offline'}</Text>
                </XStack>
              </Button>
            ))}
        </YStack>
      </Sheet>
    </YStack>
  </Sheet>
);

const ChatScreen = () => {
  const currentUser = useCurrentUser() as User | null;
  const activeConversationId = useActiveConversation()?.id ?? null;
  const conversations = useChatStore(s => s.conversations);
  const messages = useConversationMessages(activeConversationId ?? undefined);
  const storeUsers = useChatStore(s => s.users) as Record<string, User>;
  const unreadTotal = useUnreadTotal();

  const teamChannels = useMemo(
    () => conversations.filter(c => c.type === 'team'),
    [conversations]
  );
  const directMessages = useMemo(
    () => conversations.filter(c => c.type === 'dm'),
    [conversations]
  );

  const [showSidebar, setShowSidebar] = useState(false);
  const [showDmModal, setShowDmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reactionPicker, setReactionPicker] =
    useState<{ visible: boolean; messageId?: string }>({
      visible: false,
    });

  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return [];
    const lower = searchQuery.toLowerCase();
    return messages.filter(m => m.text.toLowerCase().includes(lower));
  }, [searchQuery, messages]);

  const handleSend = useCallback(
    (newMessages: GiftedChatMessage[] = []) => {
      if (!activeConversationId || !currentUser) return;
      useChatStore
        .getState()
        .sendMessage(activeConversationId, newMessages[0].text, currentUser.id);
    },
    [activeConversationId, currentUser]
  );

  const addReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (currentUser)
        useChatStore.getState().addReaction(messageId, emoji, currentUser.id);
    },
    [currentUser]
  );

  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeConversationId) || null,
    [activeConversationId, conversations]
  );

  if (!currentUser) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <Spinner size="large" color="$blue10" />
        <Text marginTop="$3" color="$gray8">
          Loading chat...
        </Text>
      </YStack>
    );
  }

  const renderChatHeader = () => (
    <XStack
      alignItems="center"
      paddingHorizontal={16}
      paddingVertical={12}
      borderBottomWidth={1}
      borderBottomColor="$gray5"
      backgroundColor="$background"
    >
      <Button chromeless marginRight={12} onPress={() => setShowSidebar(true)}>
        <Hash size={20} color="#3B82F6" />
        {unreadTotal > 0 && (
          <YStack
            position="absolute"
            top={-6}
            right={-10}
            backgroundColor="$red10"
            borderRadius={8}
            paddingHorizontal={5}
            paddingVertical={1}
          >
            <Text color="$color" fontSize={10} fontWeight="700">
              {unreadTotal > 99 ? '99+' : unreadTotal}
            </Text>
          </YStack>
        )}
      </Button>
      <YStack flex={1}>
        <Text fontSize={16} fontWeight="700" color="$gray12">
          {activeConversation?.name || 'Select a conversation'}
        </Text>
        {activeConversation?.type === 'team' && (
          <XStack alignItems="center" marginTop={2}>
            <Users size={12} color="#6B7280" />
            <Text marginLeft={4} color="$gray8" fontSize={12}>
              {
                activeConversation.memberIds.filter(
                  id => storeUsers[id]?.isOnline
                ).length
              }
              /{activeConversation.memberIds.length} online
            </Text>
          </XStack>
        )}
      </YStack>
    </XStack>
  );

  return (
    <YStack flex={1} backgroundColor="$background">
      {renderChatHeader()}

      {activeConversationId ? (
        <YStack flex={1}>
          <GiftedChat
            messages={messages}
            onSend={handleSend}
            onLongPress={(_, message) =>
              setReactionPicker({ visible: true, messageId: message?._id })
            }
            user={{
              _id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
            }}
            renderBubble={props => {
              const giftedMsg = props.currentMessage;
              if (!giftedMsg) return null;

              const chatMsg: ChatMessage = {
                id: giftedMsg._id,
                userId: giftedMsg.user._id,
                username: giftedMsg.user.name,
                message: giftedMsg.text,
                timestamp: giftedMsg.createdAt,
              };

              return (
                <ChatBubble
                  {...props}
                  message={chatMsg}
                  isCurrentUser={giftedMsg.user._id === currentUser.id}
                />
              );
            }}
            renderMessageText={props => <Text>{props.currentMessage.text}</Text>}
            renderTime={props => (
              <Text fontSize={10} color="$gray8">
                {new Date(props.currentMessage.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            )}
            renderSend={props => (
              <Button
                onPress={() =>
                  props.onSend && props.onSend({ text: props.text }, true)
                }
              >
                <Text>Send</Text>
              </Button>
            )}
            placeholder="Type a message..."
            showUserAvatar
            alwaysShowSend
            keyboardShouldPersistTaps="never"
          />

          {reactionPicker.visible && (
            <XStack
              position="absolute"
              bottom={16}
              alignSelf="center"
              backgroundColor="$background"
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius={24}
              alignItems="center"
              elevation={3}
              shadowColor="$shadowColor"
              shadowOpacity={0.1}
              shadowRadius={8}
            >
              {['👍', '❤️', '😂', '🎉', '😮', '😢'].map(emoji => (
                <Button
                  key={emoji}
                  size="$3"
                  chromeless
                  onPress={() => {
                    if (reactionPicker.messageId)
                      addReaction(reactionPicker.messageId, emoji);
                    setReactionPicker({ visible: false });
                  }}
                >
                  <Text fontSize={20}>{emoji}</Text>
                </Button>
              ))}
              <Button
                size="$2"
                chromeless
                marginLeft="$2"
                onPress={() => setReactionPicker({ visible: false })}
              >
                <Text fontWeight="600" color="$gray12">
                  Cancel
                </Text>
              </Button>
            </XStack>
          )}
        </YStack>
      ) : (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <MessageCircle size={64} color="$gray5" />
          <Text marginTop="$3" color="$gray8">
            Select a conversation to start chatting
          </Text>
          <Button
            marginTop="$4"
            backgroundColor="$blue10"
            borderRadius={20}
            paddingHorizontal="$4"
            paddingVertical="$3"
            onPress={() => setShowSidebar(true)}
          >
            <Text color="$color" fontWeight="700">
              Browse Conversations
            </Text>
          </Button>
        </YStack>
      )}

      <Sidebar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        showDmModal={showDmModal}
        setShowDmModal={setShowDmModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        teamChannels={teamChannels}
        directMessages={directMessages}
        searchResults={searchResults}
        activeConversationId={activeConversationId}
        setActiveConversation={id =>
          useChatStore.getState().setActiveConversation(id)
        }
        conversations={conversations}
        users={storeUsers}
        currentUser={currentUser}
      />
    </YStack>
  );
};

export default ChatScreen;
