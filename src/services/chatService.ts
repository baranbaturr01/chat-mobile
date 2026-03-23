import api from './api';
import {
  ApiResponse,
  ChatRoom,
  CreateChatRoomPayload,
  PaginatedResponse,
} from '../types';

export const chatService = {
  /**
   * GET /api/chat-rooms
   * Returns the list of chat rooms for the authenticated user.
   */
  getChatRooms: async (
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<ChatRoom>> => {
    const response = await api.get<PaginatedResponse<ChatRoom>>(
      '/api/chat-rooms',
      {
        params: {page, limit},
      },
    );
    return response.data;
  },

  /**
   * GET /api/chat-rooms/:id
   * Returns a single chat room by id.
   */
  getChatRoom: async (id: string): Promise<ChatRoom> => {
    const response = await api.get<ApiResponse<ChatRoom>>(
      `/api/chat-rooms/${id}`,
    );
    return response.data.data;
  },

  /**
   * POST /api/chat-rooms
   * Creates a new chat room.
   */
  createChatRoom: async (
    payload: CreateChatRoomPayload,
  ): Promise<ChatRoom> => {
    const response = await api.post<ApiResponse<ChatRoom>>(
      '/api/chat-rooms',
      payload,
    );
    return response.data.data;
  },

  /**
   * DELETE /api/chat-rooms/:id
   * Deletes a chat room.
   */
  deleteChatRoom: async (id: string): Promise<void> => {
    await api.delete(`/api/chat-rooms/${id}`);
  },
};
