export type WebSocketEventType =
  | 'message'
  | 'typing'
  | 'connect'
  | 'disconnect'
  | 'error'
  | 'reconnecting';

export type WebSocketEventHandler = (data: unknown) => void;

export interface WebSocketConfig {
  url: string;
  /** Reconnect delay in ms (default: 1000) */
  reconnectDelay?: number;
  /** Maximum reconnect attempts (default: 10) */
  maxReconnectAttempts?: number;
  /** Heartbeat interval in ms (default: 25000) */
  heartbeatInterval?: number;
  /** Auth token to include in connection headers */
  authToken?: string;
}

export type ConnectionStatus =
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'reconnecting';

/** Outbound frame sent from client to server. */
export interface WebSocketMessage {
  /** Frame type: MESSAGE | SUBSCRIBE | UNSUBSCRIBE */
  type: 'MESSAGE' | 'SUBSCRIBE' | 'UNSUBSCRIBE';
  /** Topic/destination path */
  destination: string;
  /** Message payload (only present for MESSAGE frames) */
  payload?: unknown;
}
