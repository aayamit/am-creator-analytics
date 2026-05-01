# Real-time WebSockets Plan

## 🚀 Overview
Add **WebSocket support** for real-time features:
- **Live notifications** (instant push)
- **Campaign updates** (real-time status changes)
- **Contract signing events** (instant alerts)
- **Payout notifications** (real-time balance updates)

**Enhancement**: Current SSE (Server-Sent Events) → WebSockets (bidirectional)

## 🚀 Quick Setup

### 1. Install WebSocket Library
```bash
npm install ws
npm install -D @types/ws
```

### 2. Create WebSocket Server
```typescript
// lib/websocket-server.ts
import { WebSocketServer, WebSocket } from 'ws';
import { parse } from 'url';

interface Client {
  ws: WebSocket;
  userId: string;
  tenantId: string;
}

const clients: Map<string, Client[]> = new Map();

export function setupWebSocket(server: any) {
  const wss = new WebSocketServer({ noServer: true });

  // Handle upgrade (HTTP → WebSocket)
  server.on('upgrade', (request: any, socket: any, head: any) => {
    const url = parse(request.url, true);
    const tenantId = url.query.tenantId as string;
    const userId = url.query.userId as string;

    if (!tenantId || !userId) {
      socket.destroy();
      return;
    }

    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request, { tenantId, userId });
    });
  });

  wss.on('connection', (ws: WebSocket, request: any, { tenantId, userId }: any) => {
    console.log(`🔌 WebSocket connected: ${userId}`);

    // Add to clients
    const client: Client = { ws, userId, tenantId };
    if (!clients.has(tenantId)) {
      clients.set(tenantId, []);
    }
    clients.get(tenantId)!.push(client);

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'WELCOME',
      message: 'Connected to real-time notifications',
    }));

    // Handle messages
    ws.on('message', (data: any) => {
      try {
        const message = JSON.parse(data);
        handleMessage(userId, message);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    // Handle disconnect
    ws.on('close', () => {
      console.log(`🔌 WebSocket disconnected: ${userId}`);
      const tenantClients = clients.get(tenantId);
      if (tenantClients) {
        const index = tenantClients.indexOf(client);
        if (index > -1) {
          tenantClients.splice(index, 1);
        }
      }
    });
  });
}

// Send to specific user
export function sendToUser(userId: string, message: any) {
  for (const [tenantId, tenantClients] of clients) {
    const client = tenantClients.find(c => c.userId === userId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
      return true;
    }
  }
  return false;
}

// Broadcast to all users in tenant
export function broadcastToTenant(tenantId: string, message: any, excludeUserId?: string) {
  const tenantClients = clients.get(tenantId);
  if (!tenantClients) return;

  tenantClients.forEach(client => {
    if (client.userId !== excludeUserId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(message));
    }
  });
}

// Handle incoming messages
function handleMessage(userId: string, message: any) {
  console.log(`📩 Message from ${userId}:`, message);

  switch (message.type) {
    case 'PING':
      sendToUser(userId, { type: 'PONG', timestamp: Date.now() });
      break;
    // Add more message handlers as needed
  }
}
```

### 3. Integrate with Next.js
```typescript
// server.ts (custom server)
import { createServer } from 'http';
import next from 'next';
import { parse } from 'url';
import { setupWebSocket } from './lib/websocket-server';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // Setup WebSocket
  setupWebSocket(server);

  server.listen(3000, () => {
    console.log('🚀 Server running on http://localhost:3000');
  });
});
```

### 4. Client-Side Hook
```typescript
// hooks/use-websocket.ts
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWebSocketOptions {
  url: string;
  onMessage: (data: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({ url, onMessage, onConnect, onDisconnect }: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('🔌 WebSocket connected');
      setIsConnected(true);
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

      // Auto-reconnect after 3 seconds
      setTimeout(connect, 3000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, [url, onMessage, onConnect, onDisconnect]);

  useEffect(() => {
    connect();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const send = useCallback((data: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  }, []);

  return { isConnected, send };
}
```

### 5. Use in NotificationBell
```typescript
// components/notifications/notification-bell.tsx
import { useWebSocket } from '@/hooks/use-websocket';

export default function NotificationBell({ userId, tenantId }: { userId: string; tenantId: string }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  const { isConnected } = useWebSocket({
    url: `ws://localhost:3000?userId=${userId}&tenantId=${tenantId}`,
    onMessage: (data) => {
      if (data.type === 'NOTIFICATION') {
        setNotifications(prev => [data.notification, ...prev]);
        // Show toast notification
      }
    },
  });

  return (
    <div>
      {isConnected && <span style={{ color: 'green' }}>🟢 Live</span>}
      {/* Rest of component */}
    </div>
  );
}
```

## 🚀 Build Order

1. **Install `ws`** (WebSocket library)
2. **Create `lib/websocket-server.ts`** (server-side)
3. **Create `hooks/use-websocket.ts`** (client-side hook)
4. **Update `server.ts`** (custom Next.js server)
5. **Integrate with NotificationBell** (real-time updates)
6. **Test with multiple clients** (verify real-time)

## 📊 Benefits

| Feature | SSE (Current) | WebSockets (New) |
|---------|---------------|-------------------|
| Bidirectional | ❌ | ✅ |
| Real-time | ✅ | ✅ |
| Overhead | Low | Low |
| Browser Support | Modern only | Universal |
| Use Case | Notifications | Notifications + Chat + Live Updates |

## 💰 Cost
- **ws library**: FREE (open-source)
- **Total**: **₹0** (fits your open-source preference!)

## 🎯 Why WebSockets?
1. **Bidirectional** (client can send messages too)
2. **Real-time chat** (future feature?)
3. **Live collaboration** (multiple users editing)
4. **Industry standard** (WhatsApp, Slack, Discord use it)

---

**Ready to add WebSockets? Say "websockets now" and I'll start!** 🚀
