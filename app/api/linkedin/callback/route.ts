import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * LinkedIn OAuth Callback
 * Step 2: Handle the OAuth callback and exchange code for access token
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  
  if (error) {
    return NextResponse.json(
      { error: `LinkedIn OAuth error: ${error}` },
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
  
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || 'https://amcreatoranalytics.com/api/linkedin/callback';
  
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: 'LinkedIn credentials not configured' },
      { status: 500 }
    );
  }
  
  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Token exchange failed: ${JSON.stringify(errorData)}`);
    }
    
    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;
    
    // Get user profile
    const profileResponse = await fetch('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
    if (!profileResponse.ok) {
      throw new Error('Failed to fetch LinkedIn profile');
    }
    
    const profileData = await profileResponse.json();
    
    // Get email address
    const emailResponse = await fetch(
      'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    
    let email = '';
    if (emailResponse.ok) {
      const emailData = await emailResponse.json();
      email = emailData.elements?.[0]?.['handle~']?.emailAddress || '';
    }
    
    // Calculate token expiry
    const expiresAt = new Date(Date.now() + expires_in * 1000);
    
    // Store the connection in database
    await prisma.socialAccount.upsert({
      where: {
        creatorId_platform_accountId: {
          creatorId: creatorId,
          platform: 'LINKEDIN',
          accountId: profileData.id,
        },
      },
      update: {
        accessToken: access_token,
        tokenExpiresAt: expiresAt,
        username: profileData.localizedFirstName + ' ' + profileData.localizedLastName,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
        email: email,
        profileId: profileData.id,
        isConnected: true,
        updatedAt: new Date(),
      },
      create: {
        creatorId: creatorId,
        platform: 'LINKEDIN',
        accountId: profileData.id,
        accessToken: access_token,
        tokenExpiresAt: expiresAt,
        username: profileData.localizedFirstName + ' ' + profileData.localizedLastName,
        firstName: profileData.localizedFirstName,
        lastName: profileData.localizedLastName,
        email: email,
        profileId: profileData.id,
        isConnected: true,
      },
    });
    
    // Redirect to frontend with success
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://amcreatoranalytics.com';
    return NextResponse.redirect(
      `${frontendUrl}/creators/${creatorId}/connections?platform=linkedin&status=success`
    );
    
  } catch (error: any) {
    console.error('LinkedIn OAuth error:', error);
    const frontendUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://amcreatoranalytics.com';
    return NextResponse.redirect(
      `${frontendUrl}/creators/${creatorId}/connections?platform=linkedin&status=error&message=${encodeURIComponent(error.message)}`
    );
  }
}
