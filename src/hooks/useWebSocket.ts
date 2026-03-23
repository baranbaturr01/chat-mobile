import {useCallback, useEffect, useRef, useState} from 'react';
import {webSocketService} from '../services/websocket';
import {WebSocketConfig, ConnectionStatus} from '../services/websocket/types';
import {useChatStore} from '../store/chatStore';
import {Message, TypingEvent} from '../types/chat';

interface UseWebSocketOptions extends WebSocketConfig {
  chatRoomId?: string;
  currentUserId?: string;
}

interface UseWebSocketReturn {
  connectionStatus: ConnectionStatus;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (destination: string, payload: unknown) => boolean;
  isConnected: boolean;
  reconnectAttempt: number;
}

/**
 * Hook to manage WebSocket connection lifecycle.
 * Subscribes to messages and typing events for the active chat room.
 */
export function useWebSocket(
  options: UseWebSocketOptions,
): UseWebSocketReturn {
  const {
    url,
    chatRoomId,
    authToken,
    reconnectDelay,
    maxReconnectAttempts,
    heartbeatInterval,
  } = options;

  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('disconnected');
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const {
    addMessage,
    setTyping,
    setConnectionStatus: storeSetStatus,
    setError,
  } = useChatStore();

  const unsubscribeRef = useRef<(() => void) | null>(null);
  const typingUnsubRef = useRef<(() => void) | null>(null);

  const updateStatus = useCallback(
    (status: ConnectionStatus) => {
      setConnectionStatus(status);
      storeSetStatus(status);
    },
    [storeSetStatus],
  );

  const connect = useCallback(() => {
    webSocketService.connect({
      url,
      authToken,
      reconnectDelay,
      maxReconnectAttempts,
      heartbeatInterval,
    });
  }, [url, authToken, reconnectDelay, maxReconnectAttempts, heartbeatInterval]);

  const disconnect = useCallback(() => {
    webSocketService.disconnect();
  }, []);

  const sendMessage = useCallback(
    (destination: string, payload: unknown): boolean => {
      return webSocketService.send(destination, payload);
    },
    [],
  );

  // Subscribe to connection lifecycle events
  useEffect(() => {
    const offConnect = webSocketService.on('connect', () => {
      updateStatus('connected');
      setError(null);
      setReconnectAttempt(0);
    });

    const offDisconnect = webSocketService.on('disconnect', () => {
      updateStatus('disconnected');
    });

    const offError = webSocketService.on('error', (data: unknown) => {
      updateStatus('error');
      const msg =
        data instanceof Error ? data.message : 'WebSocket connection error';
      setError(msg);
    });

    const offReconnecting = webSocketService.on(
      'reconnecting',
      (data: unknown) => {
        updateStatus('reconnecting');
        const payload = data as {attempt: number};
        setReconnectAttempt(payload?.attempt ?? 0);
      },
    );

    return () => {
      offConnect();
      offDisconnect();
      offError();
      offReconnecting();
    };
  }, [updateStatus, setError]);

  // Subscribe to chat room events when chatRoomId changes
  useEffect(() => {
    if (!chatRoomId) {
      return;
    }

    // Unsubscribe from previous room
    unsubscribeRef.current?.();
    typingUnsubRef.current?.();

    const messageDest = `/topic/chat/${chatRoomId}/messages`;
    const typingDest = `/topic/chat/${chatRoomId}/typing`;

    unsubscribeRef.current = webSocketService.subscribe(
      messageDest,
      (data: unknown) => {
        const message = data as Message;
        if (message && message.id && message.chatRoomId) {
          addMessage(message);
        }
      },
    );

    typingUnsubRef.current = webSocketService.subscribe(
      typingDest,
      (data: unknown) => {
        const event = data as TypingEvent;
        if (event && event.chatRoomId && event.userId) {
          setTyping(event);
        }
      },
    );

    return () => {
      unsubscribeRef.current?.();
      typingUnsubRef.current?.();
      unsubscribeRef.current = null;
      typingUnsubRef.current = null;
    };
  }, [chatRoomId, addMessage, setTyping]);

  return {
    connectionStatus,
    connect,
    disconnect,
    sendMessage,
    isConnected: connectionStatus === 'connected',
    reconnectAttempt,
  };
}
