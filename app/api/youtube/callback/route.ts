import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * YouTube OAuth Callback
 * Step 2: Handle the OAuth callback and exchange code for access token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.json(
      { error: `YouTube OAuth error: ${error}` },
      { status: 400 }
    );
  }
  
  if (!code || !state) {
    return NextResponse.json(
      { error: 'Missing code or state parameter' },
      { status: 400 }
    );
  }
  
  // Decode state to get creatorId
  let creatorId: string;
  try {
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    creatorId = stateData.creatorId;
  } catch {
    return NextResponse.json(
      { error: 'Invalid state parameter' },
      { status: 400 }
    );
  }
  
  // Exchange code for access token
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/youtube/callback';
  
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'YouTube credentials not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Token exchange failed: ${JSON.stringify(errorData)}`);
    }
    
    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;
    
    // Get channel info
    const channelResponse = await fetch(
      'https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true',
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    
    if (!channelResponse.ok) {
      throw new Error('Failed to fetch YouTube channel');
    }
    
    const channelData = await channelResponse.json();
    const channel = channelData.items?.[0];
    
    if (!channel) {
      throw new Error('No YouTube channel found');
    }
    
    // Calculate token expiry
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    
    // Store the connection in database
    await prisma.socialAccount.upsert({
      where: {
        creatorId_platform_accountId: {
          creatorId: creatorId,
          platform: 'YOUTUBE',
          accountId: channel.id,
        },
      },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: expiresAt,
        username: channel.snippet.title,
        channelId: channel.id,
        subscriberCount: parseInt(channel.statistics?.subscriberCount || '0'),
        videoCount: parseInt(channel.statistics?.videoCount || '0'),
        viewCount: parseInt(channel.statistics?.viewCount || '0'),
        isConnected: true,
        updatedAt: new Date(),
      },
      create: {
        creatorId: creatorId,
        platform: 'YOUTUBE',
        accountId: channel.id,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: expiresAt,
        username: channel.snippet.title,
        channelId: channel.id,
        subscriberCount: parseInt(channel.statistics?.subscriberCount || '0'),
        videoCount: parseInt(channel.statistics?.videoCount || '0'),
        viewCount: parseInt(channel.statistics?.viewCount || '0'),
        isConnected: true,
      },
    });
    
    // Redirect to frontend with success
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      `${frontendUrl}/creators/${creatorId}/connections?platform=youtube&status=success`
    );
    
  } catch (error: any) {
    console.error('YouTube OAuth error:', error);
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      `${frontendUrl}/creators/${creatorId}/connections?platform=youtube&status=error&message=${encodeURIComponent(error.message)}`
    );
  }
}
