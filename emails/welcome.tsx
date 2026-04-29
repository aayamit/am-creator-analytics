/**
 * Welcome Email Template
 * Sent when a new user joins
 */

import {
  Body,
  Button,
  Container,
  Content,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  userName: string;
  role: 'ADMIN' | 'BRAND' | 'CREATOR';
  tenantName: string;
  dashboardUrl: string;
}

export default function WelcomeEmail({
  userName = 'there',
  role = 'CREATOR',
  tenantName = 'AM Creator Analytics',
  dashboardUrl = 'http://localhost:3000',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {tenantName}! Let's get started.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Img
              src={`${dashboardUrl}/logo.png`}
              width="120"
              height="36"
              alt="AM Creator Analytics"
            />
          </Section>

          <Section style={contentSection}>
            <Heading style={h1}>Welcome, {userName}! 🎉</Heading>
            <Text style={text}>
              You've been added to <strong>{tenantName}</strong> as a{' '}
              <strong>{role.toLowerCase()}</strong>. We're excited to have you on board!
            </Text>

            <Section style={buttonSection}>
              <Button style={button} href={dashboardUrl}>
                Go to Dashboard
              </Button>
            </Section>

            <Hr style={hr} />

            <Heading style={h2}>Quick Start Guide</Heading>
            {role === 'CREATOR' && (
              <ul style={list}>
                <li style={listItem}>Complete your profile</li>
                <li style={listItem}>Browse available campaigns</li>
                <li style={listItem}>Set up Stripe Connect for payouts</li>
              </ul>
            )}
            {role === 'BRAND' && (
              <ul style={list}>
                <li style={listItem}>Create your first campaign</li>
                <li style={listItem}>Browse creator catalog</li>
                <li style={listItem}>Set up payment methods</li>
              </ul>
            )}
            {role === 'ADMIN' && (
              <ul style={list}>
                <li style={listItem}>Invite team members</li>
                <li style={listItem}>Configure integrations</li>
                <li style={listItem}>Review system settings</li>
              </ul>
            )}

            <Hr style={hr} />

            <Text style={text}>
              Need help? Reply to this email or check out our{' '}
              <Link style={link} href={`${dashboardUrl}/help`}>
                help center
              </Link>.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2026 AM Creator Analytics. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link style={link} href={`${dashboardUrl}/settings`}>
                Update email preferences
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#F8F7F4',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const logoSection = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const contentSection = {
  backgroundColor: 'white',
  padding: '40px',
  borderRadius: '8px',
  border: '1px solid rgba(26,26,46,0.1)',
};

const h1 = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#1a1a2e',
  marginBottom: '16px',
};

const h2 = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#1a1a2e',
  marginBottom: '12px',
};

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#1a1a2e',
  marginBottom: '16px',
};

const button = {
  backgroundColor: '#1a1a2e',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: '600',
};

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const hr = {
  borderColor: 'rgba(26,26,46,0.1)',
  margin: '32px 0',
};

const list = {
  paddingLeft: '20px',
  marginBottom: '16px',
};

const listItem = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#1a1a2e',
  marginBottom: '8px',
};

const link = {
  color: '#92400e',
  textDecoration: 'underline',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px 0',
};

const footerText = {
  fontSize: '14px',
  color: '#92400e',
  opacity: 0.8,
  marginBottom: '8px',
};
