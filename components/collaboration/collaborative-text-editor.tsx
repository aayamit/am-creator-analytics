/**
 * Simple Collaborative Text Editor
 * Uses Yjs + contentEditable (no Monaco dependency)
 * Real-time collaboration with live cursors
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Wifi, WifiOff } from 'lucide-react';
import useCollaboration from '@/hooks/use-collaboration';
import * as Y from 'yjs';

interface CollaborativeTextEditorProps {
  documentId: string;
  initialContent?: string;
  username?: string;
  label?: string;
  height?: string;
}

export default function CollaborativeTextEditor({
  documentId,
  initialContent = '',
  username = 'Anonymous',
  label = 'Collaborative Notes',
  height = '300px',
}: CollaborativeTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [onlineUsers, setOnlineUsers] = useState<Array<{ name: string; color: string }>>([]);
  const [localContent, setLocalContent] = useState(initialContent);

  const { doc, provider, isConnected, awareness } = useCollaboration({
    documentId,
    username,
    color: '#1a1a2e',
  });

  // Initialize Yjs text binding
  useEffect(() => {
    if (!doc || !editorRef.current) return;

    const yText = doc.getText('content');

    // Initialize with initial content if empty
    if (yText.length === 0 && initialContent) {
      yText.insert(0, initialContent);
      setLocalContent(initialContent);
    }

    // Sync Yjs text to DOM
    const syncFromYText = () => {
      if (editorRef.current) {
        const content = yText.toString();
        if (editorRef.current.innerText !== content) {
          editorRef.current.innerText = content;
          setLocalContent(content);
        }
      }
    };

    // Listen for Yjs updates
    yText.observe(syncFromYText);

    // Initial sync
    syncFromYText();

    // Listen for awareness updates (online users)
    awareness?.on('change', () => {
      const states = awareness.getStates();
      const users: Array<{ name: string; color: string }> = [];
      states.forEach((state: any) => {
        if (state.user) {
          users.push({
            name: state.user.name || 'Anonymous',
            color: state.user.color || '#1a1a2e',
          });
        }
      });
      setOnlineUsers(users);
    });

    return () => {
      yText.unobserve(syncFromYText);
    };
  }, [doc, awareness, initialContent]);

  // Handle input changes
  const handleInput = useCallback(() => {
    if (!doc || !editorRef.current) return;

    const yText = doc.getText('content');
    const currentContent = editorRef.current.innerText || '';
    
    // Simple sync: replace entire text (for MVP)
    if (yText.toString() !== currentContent) {
      yText.delete(0, yText.length);
      yText.insert(0, currentContent);
    }
  }, [doc]);

  return (
    <Card style={{ border: '1px solid #e5e7eb', backgroundColor: '#FFFFFF' }}>
      <CardHeader>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <CardTitle style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#1a1a2e',
            fontSize: '16px',
          }}>
            <Users size={18} />
            {label}
          </CardTitle>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Online users */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {onlineUsers.map((user, idx) => (
                <div
                  key={idx}
                  title={user.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: user.color,
                    color: '#F8F7F4',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 600,
                    border: '2px solid #F8F7F4',
                    marginLeft: idx > 0 ? '-8px' : '0',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>

            {/* Connection status */}
            <Badge style={{
              backgroundColor: isConnected ? '#DCFCE7' : '#FEE2E2',
              color: isConnected ? '#166534' : '#991B1B',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              {isConnected ? (
                <>
                  <Wifi size={12} /> Live
                </>
              ) : (
                <>
                  <WifiOff size={12} /> Offline
                </>
              )}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          style={{
            minHeight: height,
            padding: '16px',
            border: `1px solid ${isConnected ? '#92400e' : '#e5e7eb'}`,
            borderRadius: '8px',
            backgroundColor: '#F8F7F4',
            color: '#1a1a2e',
            fontSize: '14px',
            lineHeight: 1.6,
            fontFamily: 'Inter, -apple-system, sans-serif',
            outline: 'none',
            overflowY: 'auto',
          }}
          suppressContentEditableWarning
        />
        <p style={{
          margin: '8px 0 0 0',
          fontSize: '12px',
          color: '#92400e',
          opacity: 0.7,
        }}>
          {isConnected
            ? `🟢 Connected — Changes sync in real-time with ${onlineUsers.length} user(s)`
            : '⚪ Offline — Changes saved locally, will sync when reconnected'}
        </p>
      </CardContent>
    </Card>
  );
}
