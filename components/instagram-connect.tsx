'use client';

import { useState } from 'react';
import { Instagram } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InstagramConnectProps {
  creatorId: string;
  isConnected?: boolean;
  username?: string;
}

export default function InstagramConnect({ 
  creatorId, 
  isConnected = false, 
  username 
}: InstagramConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleConnect = () => {
    setIsConnecting(true);
    
    // Redirect to our Instagram auth API
    const authUrl = `/api/instagram/auth?creatorId=${encodeURIComponent(creatorId)}`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Instagram?')) return;
    
    try {
      const response = await fetch(`/api/social-accounts/instagram`, {
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
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Instagram size={24} className="text-pink-600" />
          <div>
            <p className="font-semibold text-green-800">Instagram Connected</p>
            {username && <p className="text-sm text-green-600">@{username}</p>}
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
        <Instagram size={24} className="text-gray-400" />
        <div>
          <p className="font-semibold text-gray-700">Connect Instagram</p>
          <p className="text-sm text-gray-500">Import followers, engagement, and media data</p>
        </div>
      </div>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 flex items-center gap-2"
      >
        <Instagram size={16} />
        {isConnecting ? 'Connecting...' : 'Connect Instagram'}
      </button>
    </div>
  );
}
