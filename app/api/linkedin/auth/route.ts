import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * LinkedIn OAuth Initiation
 * Step 1: Redirect user to LinkedIn authorization URL
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
  
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'https://amcreatoranalytics.com/api/linkedin/callback';
  const scope = 'r_liteprofile r_emailaddress w_member_social';
  
  if (!clientId) {
    return NextResponse.json(
      { error: 'LinkedIn Client ID not configured' },
      { status: 500 }
    );
  }
  
  // Store state parameter for CSRF protection
  const state = Buffer.from(JSON.stringify({ creatorId })).toString('base64');
  
  const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('state', state);
  
  return NextResponse.redirect(authUrl.toString());
}
