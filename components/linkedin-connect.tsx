'use client';

import { useState } from 'react';
import { Linkedin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LinkedInConnectProps {
  creatorId: string;
  isConnected?: boolean;
  username?: string;
  connectionCount?: number;
}

export default function LinkedInConnect({ 
  creatorId, 
  isConnected = false, 
  username,
  connectionCount
}: LinkedInConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleConnect = () => {
    setIsConnecting(true);
    const authUrl = `/api/linkedin/auth?creatorId=${encodeURIComponent(creatorId)}`;
    window.location.href = authUrl;
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect LinkedIn?')) return;
    
    try {
      const response = await fetch(`/api/social-accounts/linkedin`, {
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
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Linkedin size={24} className="text-blue-600" />
          <div>
            <p className="font-semibold text-blue-800">LinkedIn Connected</p>
            {username && <p className="text-sm text-blue-600">{username} • {connectionCount?.toLocaleString()} connections</p>}
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
        <Linkedin size={24} className="text-gray-400" />
        <div>
          <p className="font-semibold text-gray-700">Connect LinkedIn</p>
          <p className="text-sm text-gray-500">Import connections, profile views, and post engagement</p>
        </div>
      </div>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 flex items-center gap-2"
      >
        <Linkedin size={16} />
        {isConnecting ? 'Connecting...' : 'Connect LinkedIn'}
      </button>
    </div>
  );
}
