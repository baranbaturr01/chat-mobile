export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  readBy?: string[];
}

export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  members: User[];
  lastMessage?: Message;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
  isGroup: boolean;
  createdBy: string;
}

export interface CreateChatRoomPayload {
  name: string;
  description?: string;
  memberIds: string[];
  isGroup?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
