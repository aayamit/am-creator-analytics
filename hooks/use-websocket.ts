/**
 * useWebSocket Hook
 * Client-side WebSocket connection with auto-reconnect
 */

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketOptions {
  url: string;
  onMessage: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket({
  url,
  onMessage,
  onConnect,
  onDisconnect,
  onError,
}: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 3000; // 3 seconds

  const connect = useCallback(() => {
    // Clear any pending reconnect
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;
      onConnect?.();
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket parse error:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);
      onDisconnect?.();

      // Auto-reconnect
      if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current++;
        console.log(`🔌 Reconnecting (attempt ${reconnectAttempts.current})...`);
        reconnectTimeout.current = setTimeout(connect, RECONNECT_DELAY);
      } else {
        console.error('🔌 Max reconnect attempts reached');
      }
    };

    ws.current.onerror = (error) => {
      console.error('🔌 WebSocket error:', error);
      onError?.(error);
    };
  }, [url, onMessage, onConnect, onDisconnect, onError]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  return { isConnected, send, ws: ws.current };
}
