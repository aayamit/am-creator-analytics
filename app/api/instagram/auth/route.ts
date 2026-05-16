import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Instagram OAuth Initiation
 * Step 1: Redirect user to Instagram authorization URL
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
  
  // Instagram OAuth parameters
  const clientId = process.env.INSTAGRAM_CLIENT_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/api/instagram/callback';
  const scope = 'user_profile,user_media';
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'Instagram Client ID not configured' },
      { status: 500 }
    );
  }
  
  // Store state parameter for CSRF protection
  const state = Buffer.from(JSON.stringify({ creatorId })).toString('base64');
  
  const authUrl = new URL('https://api.instagram.com/oauth/authorize');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('state', state);
  
  return NextResponse.redirect(authUrl.toString());
}
