import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Instagram OAuth Callback
 * Step 2: Handle the OAuth callback and exchange code for access token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.json(
      { error: `Instagram OAuth error: ${error}` },
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
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/api/instagram/callback';
  
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'Instagram credentials not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Token exchange failed: ${JSON.stringify(errorData)}`);
    }
    
    const tokenData = await tokenResponse.json();
    const { access_token, user_id } = tokenData;
    
    // Get user profile
    const profileResponse = await fetch(
      `https://graph.instagram.com/v18.0/me?fields=id,username,account_type,media_count&access_token=${access_token}`
    );
    
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch Instagram profile');
    }
    
    const profileData = await profileResponse.json();
    
    // Store the connection in database
    await prisma.socialAccount.upsert({
      where: {
        creatorId_platform_accountId: {
          creatorId: creatorId,
          platform: 'INSTAGRAM',
          accountId: profileData.username || user_id,
        },
      },
      update: {
        accessToken: access_token,
        username: profileData.username,
        accountType: profileData.account_type,
        mediaCount: profileData.media_count,
        isConnected: true,
        updatedAt: new Date(),
      },
      create: {
        creatorId: creatorId,
        platform: 'INSTAGRAM',
        accountId: profileData.username || user_id,
        accessToken: access_token,
        username: profileData.username,
        accountType: profileData.account_type,
        mediaCount: profileData.media_count,
        isConnected: true,
      },
    });
    
    // Redirect to frontend with success
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      `${frontendUrl}/creators/${creatorId}/connections?platform=instagram&status=success`
    );
    
  } catch (error: any) {
    console.error('Instagram OAuth error:', error);
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(
      `${frontendUrl}/creators/${creatorId}/connections?platform=instagram&status=error&message=${encodeURIComponent(error.message)}`
    );
  }
}
