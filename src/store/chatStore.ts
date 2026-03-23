import {create} from 'zustand';
import {Message, TypingEvent} from '../types/chat';
import {ConnectionStatus} from '../services/websocket/types';

interface ChatState {
  // Messages per chat room
  messages: Record<string, Message[]>;
  // Typing indicators per chat room
  typingUsers: Record<string, TypingEvent[]>;
  // Connection state
  connectionStatus: ConnectionStatus;
  // Current active chat room
  activeChatRoomId: string | null;
  // Error message
  error: string | null;

  // Actions
  addMessage: (message: Message) => void;
  addMessages: (chatRoomId: string, messages: Message[]) => void;
  setMessages: (chatRoomId: string, messages: Message[]) => void;
  setTyping: (event: TypingEvent) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setActiveChatRoom: (chatRoomId: string | null) => void;
  setError: (error: string | null) => void;
  clearMessages: (chatRoomId: string) => void;
  markMessagesRead: (chatRoomId: string) => void;
}

export const useChatStore = create<ChatState>(set => ({
  messages: {},
  typingUsers: {},
  connectionStatus: 'disconnected',
  activeChatRoomId: null,
  error: null,

  addMessage: (message: Message) =>
    set(state => {
      const roomMessages = state.messages[message.chatRoomId] ?? [];
      // Deduplicate by id
      const exists = roomMessages.some(m => m.id === message.id);
      if (exists) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [message.chatRoomId]: [...roomMessages, message],
        },
      };
    }),

  addMessages: (chatRoomId: string, messages: Message[]) =>
    set(state => {
      const existing = state.messages[chatRoomId] ?? [];
      const existingIds = new Set(existing.map(m => m.id));
      const newMessages = messages.filter(m => !existingIds.has(m.id));
      return {
        messages: {
          ...state.messages,
          [chatRoomId]: [...existing, ...newMessages],
        },
      };
    }),

  setMessages: (chatRoomId: string, messages: Message[]) =>
    set(state => ({
      messages: {
        ...state.messages,
        [chatRoomId]: messages,
      },
    })),

  setTyping: (event: TypingEvent) =>
    set(state => {
      const roomTyping = state.typingUsers[event.chatRoomId] ?? [];
      let updated: TypingEvent[];

      if (event.isTyping) {
        const exists = roomTyping.some(t => t.userId === event.userId);
        updated = exists
          ? roomTyping.map(t => (t.userId === event.userId ? event : t))
          : [...roomTyping, event];
      } else {
        updated = roomTyping.filter(t => t.userId !== event.userId);
      }

      return {
        typingUsers: {
          ...state.typingUsers,
          [event.chatRoomId]: updated,
        },
      };
    }),

  setConnectionStatus: (status: ConnectionStatus) =>
    set({connectionStatus: status}),

  setActiveChatRoom: (chatRoomId: string | null) =>
    set({activeChatRoomId: chatRoomId}),

  setError: (error: string | null) => set({error}),

  clearMessages: (chatRoomId: string) =>
    set(state => ({
      messages: {
        ...state.messages,
        [chatRoomId]: [],
      },
    })),

  markMessagesRead: (chatRoomId: string) =>
    set(state => {
      const roomMessages = state.messages[chatRoomId] ?? [];
      const hasUnread = roomMessages.some(m => !m.isRead);
      if (!hasUnread) {
        return state;
      }
      return {
        messages: {
          ...state.messages,
          [chatRoomId]: roomMessages.map(m =>
            m.isRead ? m : {...m, isRead: true},
          ),
        },
      };
    }),
}));
