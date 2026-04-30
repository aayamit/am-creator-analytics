# Real-time Collaboration Plan (PM-4)

## 🎯 Overview
Add **real-time collaboration** for teams using **Yjs (CRDT)**:
- **Live cursors** (see what others are editing)
- **Real-time text editing** (campaigns, briefs)
- **Presence awareness** (who's online)
- **Conflict-free replication** (CRDT magic)

## 📦 Open-Source Stack
- **Yjs** - CRDT framework (MIT)
- **y-websocket** - WebSocket provider (MIT)
- **y-monaco** - Monaco editor binding (optional)

## 💰 Cost Savings
- **Google Docs API**: $1.50/user/month
- **Notion API**: $10/user/month
- **Our Approach**: $0 (self-hosted WebSocket server)

## 🛠️ Implementation

### 1. Install Dependencies
```bash
npm install yjs y-websocket
```

### 2. Create WebSocket Server (separate process)
```javascript
// server/collaboration-server.js
const WebSocket = require('ws');
const Y = require('yjs');
const { setupWSConnection } = require('y-websocket/bin/utils');

const wss = new WebSocket.Server({ port: 1234 });

wss.on('connection', (conn, req) => {
  setupWSConnection(conn, req, { gc: true });
});

console.log('Collaboration server running on ws://localhost:1234');
```

### 3. Client-Side Hook
```typescript
// hooks/use-collaboration.ts
import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function useCollaboration(docId: string) {
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      'ws://localhost:1234',
      docId,
      doc
    );

    docRef.current = doc;
    providerRef.current = provider;

    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [docId]);

  return { doc: docRef.current, provider: providerRef.current };
}
```

### 4. Example: Collaborative Text Editor
```tsx
'use client';

import { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Monaco } from '@monaco-editor/react';
import { yMonaco } from 'y-monaco';

export default function CollaborativeEditor({ documentId }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const doc = new Y.Doc();
    const provider = new WebsocketProvider('ws://localhost:1234', documentId, doc);
    const yText = doc.getText('monaco');

    // Bind to Monaco editor
    // (Implementation depends on editor choice)
  }, [documentId]);

  return <div id="editor" />;
}
```

## 🎨 Bloomberg × McKinsey Design
- **Live cursors**: Use brand colors (#1a1a2e, #92400e)
- **Presence avatars**: Circular, show online users
- **Change highlights**: Subtle background color for recent edits

## 📊 Integration Points
1. **Campaign Brief Editor** - collaborative editing
2. **Contract Negotiation** - live updates
3. **Media Kit Builder** - team collaboration

## ✅ Next Steps
1. Install dependencies
2. Create WebSocket server file
3. Build `useCollaboration` hook
4. Integrate into Campaign Brief page
5. Add presence indicators to UI