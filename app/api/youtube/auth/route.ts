import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * YouTube OAuth Initiation
 * Step 1: Redirect user to Google authorization URL
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const creatorId = searchParams.get('creatorId');
  
  if (!creatorId) {
    return NextResponse.json(
      { error: 'Missing creatorId parameter' },
      { status: 400 }
    );
  }
  
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/api/youtube/callback';
  const scope = 'https://www.googleapis.com/auth/youtube.readonly';
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'YouTube Client ID not configured' },
      { status: 500 }
    );
  }
  
  // Store state parameter for CSRF protection
  const state = Buffer.from(JSON.stringify({ creatorId })).toString('base64');
  
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('access_type', 'offline'); // Get refresh token
  authUrl.searchParams.set('prompt', 'consent');
  
  return NextResponse.redirect(authUrl.toString());
}
