import {
  ConnectionStatus,
  WebSocketConfig,
  WebSocketEventHandler,
  WebSocketEventType,
  WebSocketMessage,
} from './types';

const DEFAULT_RECONNECT_DELAY = 1000;
const DEFAULT_MAX_RECONNECT_ATTEMPTS = 10;
const DEFAULT_HEARTBEAT_INTERVAL = 25000;

/**
 * WebSocket service with automatic reconnect and event subscription.
 * Supports STOMP-like message framing over native WebSocket.
 */
class WebSocketService {
  private ws: WebSocket | null = null;
  private config: Required<WebSocketConfig> | null = null;
  private listeners: Map<WebSocketEventType, Set<WebSocketEventHandler>> =
    new Map();
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private isManualDisconnect = false;
  private status: ConnectionStatus = 'disconnected';
  private subscriptions: Map<string, Set<WebSocketEventHandler>> = new Map();

  /**
   * Connect to WebSocket server.
   */
  connect(config: WebSocketConfig): void {
    this.config = {
      url: config.url,
      reconnectDelay: config.reconnectDelay ?? DEFAULT_RECONNECT_DELAY,
      maxReconnectAttempts:
        config.maxReconnectAttempts ?? DEFAULT_MAX_RECONNECT_ATTEMPTS,
      heartbeatInterval:
        config.heartbeatInterval ?? DEFAULT_HEARTBEAT_INTERVAL,
      authToken: config.authToken ?? '',
    };

    this.isManualDisconnect = false;
    this.reconnectAttempts = 0;
    this.doConnect();
  }

  private doConnect(): void {
    if (!this.config) {
      return;
    }

    this.setStatus('connecting');

    try {
      const url = this.config.authToken
        ? `${this.config.url}?token=${encodeURIComponent(this.config.authToken)}`
        : this.config.url;

      this.ws = new WebSocket(url);

      this.ws.onopen = this.handleOpen;
      this.ws.onmessage = this.handleMessage;
      this.ws.onerror = this.handleError;
      this.ws.onclose = this.handleClose;
    } catch (error) {
      this.setStatus('error');
      this.emit('error', error);
      this.scheduleReconnect();
    }
  }

  private handleOpen = (): void => {
    this.reconnectAttempts = 0;
    this.setStatus('connected');
    this.emit('connect', null);
    this.startHeartbeat();
  };

  private handleMessage = (event: WebSocketMessageEvent): void => {
    try {
      // Inbound server frames: {type, destination, payload}
      const data = JSON.parse(event.data as string) as {
        type?: string;
        destination?: string;
        payload?: unknown;
      };

      // Route to topic subscribers
      if (data.destination && this.subscriptions.has(data.destination)) {
        this.subscriptions
          .get(data.destination)
          ?.forEach(handler => handler(data.payload));
      }

      // Also emit generic message event
      this.emit('message', data);
    } catch {
      // Ignore unparseable frames (e.g., heartbeat pings)
    }
  };

  private handleError = (event: Event): void => {
    this.setStatus('error');
    this.emit('error', event);
  };

  private handleClose = (event: WebSocketCloseEvent): void => {
    this.stopHeartbeat();

    if (this.isManualDisconnect) {
      this.setStatus('disconnected');
      this.emit('disconnect', {code: event.code, reason: event.reason});
      return;
    }

    this.emit('disconnect', {code: event.code, reason: event.reason});
    this.scheduleReconnect();
  };

  private scheduleReconnect(): void {
    if (!this.config) {
      return;
    }

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.setStatus('error');
      this.emit('error', new Error('Max reconnect attempts reached'));
      return;
    }

    this.reconnectAttempts += 1;
    const delay =
      this.config.reconnectDelay *
      Math.min(Math.pow(2, this.reconnectAttempts - 1), 32);

    this.setStatus('reconnecting');
    this.emit('reconnecting', {attempt: this.reconnectAttempts, delay});

    this.reconnectTimer = setTimeout(() => {
      this.doConnect();
    }, delay);
  }

  private startHeartbeat(): void {
    if (!this.config) {
      return;
    }

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send('ping');
      }
    }, this.config.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Disconnect from WebSocket server.
   */
  disconnect(): void {
    this.isManualDisconnect = true;

    if (this.reconnectTimer !== null) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.stopHeartbeat();

    if (this.ws) {
      this.ws.close(1000, 'Manual disconnect');
      this.ws = null;
    }

    this.setStatus('disconnected');
  }

  /**
   * Send a message to the server.
   */
  send(destination: string, payload: unknown): boolean {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      return false;
    }

    const message: WebSocketMessage = {
      type: 'MESSAGE',
      destination,
      payload,
    };

    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Send a typing indicator event.
   */
  sendTyping(chatRoomId: string, userId: string, isTyping: boolean): boolean {
    return this.send(`/app/chat/${chatRoomId}/typing`, {
      chatRoomId,
      userId,
      isTyping,
    });
  }

  /**
   * Subscribe to a topic/destination.
   * Returns an unsubscribe function.
   */
  subscribe(destination: string, handler: WebSocketEventHandler): () => void {
    if (!this.subscriptions.has(destination)) {
      this.subscriptions.set(destination, new Set());
    }
    this.subscriptions.get(destination)!.add(handler);

    // Send subscription request to server
    if (this.ws?.readyState === WebSocket.OPEN) {
      const frame: WebSocketMessage = {type: 'SUBSCRIBE', destination};
      this.ws.send(JSON.stringify(frame));
    }

    return () => {
      this.subscriptions.get(destination)?.delete(handler);
      if (this.subscriptions.get(destination)?.size === 0) {
        this.subscriptions.delete(destination);
        if (this.ws?.readyState === WebSocket.OPEN) {
          const frame: WebSocketMessage = {type: 'UNSUBSCRIBE', destination};
          this.ws.send(JSON.stringify(frame));
        }
      }
    };
  }

  /**
   * Add an event listener.
   * Returns a cleanup function.
   */
  on(event: WebSocketEventType, handler: WebSocketEventHandler): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(handler);

    return () => {
      this.listeners.get(event)?.delete(handler);
    };
  }

  private emit(event: WebSocketEventType, data: unknown): void {
    this.listeners.get(event)?.forEach(handler => handler(data));
  }

  private setStatus(status: ConnectionStatus): void {
    this.status = status;
  }

  getStatus(): ConnectionStatus {
    return this.status;
  }

  isConnected(): boolean {
    return this.status === 'connected' && this.ws?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const webSocketService = new WebSocketService();
export default webSocketService;
