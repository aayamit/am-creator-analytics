/**
 * useCollaboration Hook (Simplified)
 * Client-side hook for Yjs (local-only for now)
 * WebSocket integration can be added later
 */

'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as Y from 'yjs';

interface UseCollaborationOptions {
  documentId: string;
  username?: string;
  color?: string;
}

interface UseCollaborationReturn {
  doc: Y.Doc | null;
  provider: null; // Provider disabled for now
  isConnected: boolean;
  awareness: null;
  getText: (fieldName: string) => Y.Text | null;
  getArray: (fieldName: string) => Y.Array<any> | null;
  getMap: <T = any>(fieldName: string) => Y.Map<T> | null;
}

export function useCollaboration({
  documentId,
  username = 'Anonymous',
  color = '#1a1a2e',
}: UseCollaborationOptions): UseCollaborationReturn {
  const docRef = useRef<Y.Doc | null>(null);
  const [isConnected] = useState(true); // Local-only, always "connected"

  useEffect(() => {
    if (!documentId || typeof window === 'undefined') return;

    // Create Yjs document
    const doc = new Y.Doc();
    docRef.current = doc;

    // Cleanup on unmount
    return () => {
      doc.destroy();
      docRef.current = null;
    };
  }, [documentId, username, color]);

  // Helper functions
  const getText = useCallback(
    (fieldName: string): Y.Text | null => {
      if (!docRef.current) return null;
      return docRef.current.getText(fieldName);
    },
    []
  );

  const getArray = useCallback(
    (fieldName: string): Y.Array<any> | null => {
      if (!docRef.current) return null;
      return docRef.current.getArray(fieldName);
    },
    []
  );

  const getMap = useCallback(
    <T = any>(fieldName: string): Y.Map<T> | null => {
      if (!docRef.current) return null;
      return docRef.current.getMap<T>(fieldName);
    },
    []
  );

  return {
    doc: docRef.current,
    provider: null,
    isConnected,
    awareness: null,
    getText,
    getArray,
    getMap,
  };
}

export default useCollaboration;
