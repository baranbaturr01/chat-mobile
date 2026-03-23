import {useCallback, useEffect} from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {chatService} from '../services/chatService';
import {useChatStore} from '../store/chatStore';
import {ChatRoom, CreateChatRoomPayload} from '../types';

const CHAT_ROOMS_QUERY_KEY = ['chatRooms'] as const;

export const useChats = () => {
  const queryClient = useQueryClient();
  const {setRooms, addRoom} = useChatStore();

  // Fetch chat rooms
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: CHAT_ROOMS_QUERY_KEY,
    queryFn: () => chatService.getChatRooms(),
    select: (result): ChatRoom[] => result.data,
  });

  // Sync fetched rooms into Zustand store
  useEffect(() => {
    if (data) {
      setRooms(data);
    }
  }, [data, setRooms]);

  // Create chat room mutation
  const createChatMutation = useMutation({
    mutationFn: (payload: CreateChatRoomPayload) =>
      chatService.createChatRoom(payload),
    onSuccess: newRoom => {
      addRoom(newRoom);
      queryClient.invalidateQueries({queryKey: CHAT_ROOMS_QUERY_KEY});
    },
  });

  const createChatRoom = useCallback(
    async (payload: CreateChatRoomPayload) => {
      return createChatMutation.mutateAsync(payload);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [createChatMutation.mutateAsync],
  );

  const refreshChatRooms = useCallback(() => {
    refetch();
  }, [refetch]);

  const chatRooms: ChatRoom[] = data ?? [];

  return {
    chatRooms,
    isLoading,
    isError,
    error,
    isRefreshing: isRefetching,
    createChatRoom,
    isCreating: createChatMutation.isPending,
    createError: createChatMutation.error,
    refreshChatRooms,
  };
};
