'use client';

import { useState } from 'react';
import { Youtube } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface YouTubeConnectProps {
  creatorId: string;
  isConnected?: boolean;
  username?: string;
  subscriberCount?: number;
}

export default function YouTubeConnect({ 
  creatorId, 
  isConnected = false, 
  username,
  subscriberCount
}: YouTubeConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleConnect = () => {
    setIsConnecting(true);
    const authUrl = `/api/youtube/auth?creatorId=${encodeURIComponent(creatorId)}`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect YouTube?')) return;
    
    try {
      const response = await fetch(`/api/social-accounts/youtube`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId }),
      });
      
      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Youtube size={24} className="text-red-600" />
          <div>
            <p className="font-semibold text-red-800">YouTube Connected</p>
            {username && <p className="text-sm text-red-600">{username} • {subscriberCount?.toLocaleString()} subscribers</p>}
          </div>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <Youtube size={24} className="text-gray-400" />
        <div>
          <p className="font-semibold text-gray-700">Connect YouTube</p>
          <p className="text-sm text-gray-500">Import subscribers, views, and video data</p>
        </div>
      </div>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 disabled:opacity-50 flex items-center gap-2"
      >
        <Youtube size={16} />
        {isConnecting ? 'Connecting...' : 'Connect YouTube'}
      </button>
    </div>
  );
}
