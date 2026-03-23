import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  ListRenderItemInfo,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {useWebSocket} from '../../hooks/useWebSocket';
import {useChat} from '../../hooks/useChat';
import {useChatStore} from '../../store/chatStore';
import {Message} from '../../types/chat';
import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '../../constants/colors';
import {MessageBubble} from './components/MessageBubble';
import {TypingIndicator} from './components/TypingIndicator';
import {ConnectionStatusBar} from './components/ConnectionStatusBar';

interface ChatScreenProps {
  chatRoomId: string;
  chatRoomName: string;
  currentUserId: string;
  currentUsername: string;
  websocketUrl: string;
  authToken?: string;
  onBack?: () => void;
}

export function ChatScreen({
  chatRoomId,
  chatRoomName,
  currentUserId,
  currentUsername,
  websocketUrl,
  authToken,
  onBack,
}: ChatScreenProps) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef<FlatList<Message>>(null);
  const inputRef = useRef<TextInput>(null);

  const {connectionStatus, connect, disconnect, isConnected, reconnectAttempt} =
    useWebSocket({
      url: websocketUrl,
      chatRoomId,
      currentUserId,
      authToken,
      reconnectDelay: 1000,
      maxReconnectAttempts: 10,
    });

  const {messages, sendMessage, sendTyping} = useChat({
    chatRoomId,
    currentUserId,
    currentUsername,
  });

  const typingUsers = useChatStore(
    state =>
      (state.typingUsers[chatRoomId] ?? []).filter(
        t => t.userId !== currentUserId,
      ),
  );

  const connectRef = useRef(connect);
  const disconnectRef = useRef(disconnect);
  connectRef.current = connect;
  disconnectRef.current = disconnect;

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connectRef.current();
    return () => {
      disconnectRef.current();
    };
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({animated: true});
    }
  }, [messages.length]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !isConnected) {
      return;
    }

    setIsSending(true);
    setInputText('');
    sendTyping(false);

    const sent = sendMessage(text);
    if (!sent) {
      // Restore input if failed
      setInputText(text);
    }

    setIsSending(false);
  }, [inputText, isConnected, sendMessage, sendTyping]);

  const handleTextChange = useCallback(
    (text: string) => {
      setInputText(text);
      if (text.length > 0) {
        sendTyping(true);
      } else {
        sendTyping(false);
      }
    },
    [sendTyping],
  );

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<Message>) => {
      const isSent = item.senderId === currentUserId;
      return <MessageBubble message={item} isSent={isSent} />;
    },
    [currentUserId],
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {isConnected
            ? 'No messages yet. Start the conversation!'
            : 'Connecting…'}
        </Text>
      </View>
    ),
    [isConnected],
  );

  const canSend = inputText.trim().length > 0 && isConnected && !isSending;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        {onBack && (
          <Pressable
            style={styles.backButton}
            onPress={onBack}
            hitSlop={Spacing.sm}
            accessibilityLabel="Go back"
            accessibilityRole="button">
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chatRoomName}
          </Text>
          <Text style={styles.headerSubtitle}>
            {connectionStatus === 'connected' ? 'Online' : connectionStatus}
          </Text>
        </View>
      </View>

      {/* Connection status banner */}
      <ConnectionStatusBar
        status={connectionStatus}
        reconnectAttempt={reconnectAttempt}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}>
        {/* Message list */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={ListEmptyComponent}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: false})
          }
          onLayout={() => flatListRef.current?.scrollToEnd({animated: false})}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={20}
          windowSize={10}
        />

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <TypingIndicator typingUsers={typingUsers} />
        )}

        {/* Input area */}
        <View style={styles.inputRow}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={inputText}
            onChangeText={handleTextChange}
            placeholder={isConnected ? 'Type a message…' : 'Connecting…'}
            placeholderTextColor={Colors.textHint}
            multiline
            maxLength={4000}
            returnKeyType="default"
            editable={isConnected}
            accessibilityLabel="Message input"
          />
          <Pressable
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!canSend}
            accessibilityLabel="Send message"
            accessibilityRole="button">
            {isSending ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.sendIcon}>➤</Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  backButton: {
    marginRight: Spacing.sm,
    padding: Spacing.xs,
  },
  backIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 32,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 1,
    textTransform: 'capitalize',
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textHint,
    textAlign: 'center',
    paddingHorizontal: Spacing.xl,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
    gap: Spacing.xs,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: Colors.inputBackground,
    borderRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Spacing.sm : Spacing.xs,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.border,
  },
  sendIcon: {
    fontSize: FontSize.md,
    color: '#FFFFFF',
    marginLeft: 2,
  },
});
