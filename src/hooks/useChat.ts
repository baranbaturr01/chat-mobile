import {useCallback, useRef} from 'react';
import {webSocketService} from '../services/websocket';
import {useChatStore} from '../store/chatStore';
import {Message, MessageType, SendMessagePayload} from '../types/chat';

interface UseChatReturn {
  messages: Message[];
  sendMessage: (content: string) => boolean;
  sendTyping: (isTyping: boolean) => void;
  clearMessages: () => void;
}

interface UseChatOptions {
  chatRoomId: string;
  currentUserId: string;
  currentUsername: string;
}

/**
 * Hook providing chat operations for a specific room.
 */
export function useChat(options: UseChatOptions): UseChatReturn {
  const {chatRoomId, currentUserId, currentUsername} = options;

  const messages = useChatStore(state => state.messages[chatRoomId] ?? []);
  const {addMessage, clearMessages: storeClear} = useChatStore();

  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sendMessage = useCallback(
    (content: string): boolean => {
      const trimmed = content.trim();
      if (!trimmed) {
        return false;
      }

      const payload: SendMessagePayload = {
        chatRoomId,
        content: trimmed,
        type: MessageType.TEXT,
      };

      const sent = webSocketService.send(
        `/app/chat/${chatRoomId}/send`,
        payload,
      );

      if (sent) {
        // Optimistic update
        const optimisticMessage: Message = {
          id: `optimistic-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
          chatRoomId,
          senderId: currentUserId,
          senderUsername: currentUsername,
          content: trimmed,
          type: MessageType.TEXT,
          createdAt: new Date().toISOString(),
          isRead: false,
        };
        addMessage(optimisticMessage);
      }

      return sent;
    },
    [chatRoomId, currentUserId, currentUsername, addMessage],
  );

  const sendTyping = useCallback(
    (isTyping: boolean): void => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }

      webSocketService.sendTyping(chatRoomId, currentUserId, isTyping);

      if (isTyping) {
        // Auto-stop typing after 3 seconds of inactivity
        typingTimerRef.current = setTimeout(() => {
          webSocketService.sendTyping(chatRoomId, currentUserId, false);
        }, 3000);
      }
    },
    [chatRoomId, currentUserId],
  );

  const clearMessages = useCallback(() => {
    storeClear(chatRoomId);
  }, [chatRoomId, storeClear]);

  return {
    messages,
    sendMessage,
    sendTyping,
    clearMessages,
  };
}
