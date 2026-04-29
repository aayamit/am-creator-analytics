/**
 * WebSocket Server for Real-time Features
 * Handles live notifications, campaign updates, contract events
 */

import { WebSocketServer, WebSocket } from 'ws';
import { parse } from 'url';
import { prisma } from '@/lib/prisma';

interface Client {
  ws: WebSocket;
  userId: string;
  tenantId: string;
  isAlive: boolean;
}

const clients: Map<string, Client[]> = new Map();
let wss: WebSocketServer;

// Heartbeat to detect dead connections
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

export function setupWebSocket(server: any) {
  wss = new WebSocketServer({ noServer: true });

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

  // Handle connections
  wss.on('connection', (ws: WebSocket, request: any, { tenantId, userId }: any) => {
    console.log(`🔌 WebSocket connected: ${userId} (${tenantId})`);

    // Add to clients
    const client: Client = { ws, userId, tenantId, isAlive: true };
    
    if (!clients.has(tenantId)) {
      clients.set(tenantId, []);
    }
    clients.get(tenantId)!.push(client);

    // Send welcome message
    sendToClient(client, {
      type: 'WELCOME',
      message: 'Connected to real-time notifications',
      timestamp: new Date().toISOString(),
    });

    // Handle pong (heartbeat response)
    ws.on('pong', () => {
      const client = findClient(ws);
      if (client) {
        client.isAlive = true;
      }
    });

    // Handle messages
    ws.on('message', (data: any) => {
      try {
        const message = JSON.parse(data.toString());
        handleMessage(userId, message);
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    // Handle disconnect
    ws.on('close', () => {
      console.log(`🔌 WebSocket disconnected: ${userId}`);
      removeClient(ws);
    });

    // Handle errors
    ws.on('error', (error) => {
      console.error(`WebSocket error for ${userId}:`, error);
      removeClient(ws);
    });
  });

  // Heartbeat: ping all clients every 30s
  setInterval(() => {
    wss.clients.forEach((ws) => {
      const client = findClient(ws);
      if (!client) return;

      if (!client.isAlive) {
        console.log(`💀 Terminating dead connection: ${client.userId}`);
        removeClient(ws);
        ws.terminate();
        return;
      }

      client.isAlive = false;
      ws.ping();
    });
  }, HEARTBEAT_INTERVAL);

  console.log('🔌 WebSocket server ready');
}

// Send to specific user
export function sendToUser(userId: string, message: any): boolean {
  for (const [tenantId, tenantClients] of clients) {
    const client = tenantClients.find(c => c.userId === userId && c.ws.readyState === WebSocket.OPEN);
    if (client) {
      sendToClient(client, message);
      return true;
    }
  }
  return false;
}

// Broadcast to all users in tenant
export function broadcastToTenant(
  tenantId: string,
  message: any,
  excludeUserId?: string
): number {
  const tenantClients = clients.get(tenantId);
  if (!tenantClients) return 0;

  let sentCount = 0;
  tenantClients.forEach(client => {
    if (client.userId !== excludeUserId && client.ws.readyState === WebSocket.OPEN) {
      sendToClient(client, message);
      sentCount++;
    }
  });

  return sentCount;
}

// Send to specific client
function sendToClient(client: Client, message: any) {
  if (client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
  }
}

// Find client by WebSocket instance
function findClient(ws: WebSocket): Client | undefined {
  for (const tenantClients of clients.values()) {
    const client = tenantClients.find(c => c.ws === ws);
    if (client) return client;
  }
  return undefined;
}

// Remove client from map
function removeClient(ws: WebSocket) {
  for (const [tenantId, tenantClients] of clients) {
    const index = tenantClients.findIndex(c => c.ws === ws);
    if (index > -1) {
      tenantClients.splice(index, 1);
      if (tenantClients.length === 0) {
        clients.delete(tenantId);
      }
      break;
    }
  }
}

// Handle incoming messages
function handleMessage(userId: string, message: any) {
  console.log(`📩 WebSocket message from ${userId}:`, message.type);

  switch (message.type) {
    case 'PING':
      sendToUser(userId, {
        type: 'PONG',
        timestamp: Date.now(),
      });
      break;

    case 'MARK_NOTIFICATION_READ':
      // Update notification in DB
      if (message.notificationId) {
        prisma.notification.update({
          where: { id: message.notificationId },
          data: { read: true },
        }).catch(err => console.error('Error marking notification read:', err));
      }
      break;

    default:
      console.log(`Unknown message type: ${message.type}`);
  }
}

// Get connected users count
export function getConnectedCount(): { total: number; tenants: Record<string, number> } {
  let total = 0;
  const tenants: Record<string, number> = {};

  for (const [tenantId, tenantClients] of clients) {
    const count = tenantClients.filter(c => c.ws.readyState === WebSocket.OPEN).length;
    tenants[tenantId] = count;
    total += count;
  }

  return { total, tenants };
}

// Notify all clients (for announcements)
export function broadcastToAll(message: any) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}
