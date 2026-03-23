export interface Message {
  id: string;
  chatRoomId: string;
  senderId: string;
  senderUsername: string;
  content: string;
  type: MessageType;
  createdAt: string;
  isRead: boolean;
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  participants: string[];
  lastMessage?: Message;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export interface TypingEvent {
  chatRoomId: string;
  userId: string;
  username: string;
  isTyping: boolean;
}

export interface SendMessagePayload {
  chatRoomId: string;
  content: string;
  type: MessageType;
}
