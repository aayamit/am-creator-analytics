/**
 * Verification Email Template
 * Sent when user requests email verification
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
import { render } from '@react-email/components';

interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

export default function VerificationEmail({ userName, verificationUrl }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email for AM Creator Analytics</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://amcreatoranalytics.com/logo.png"
              width="120"
              height="40"
              alt="AM Creator Analytics"
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Verify Your Email</Heading>
            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              Thanks for signing up for AM Creator Analytics! Please verify your email address to get started.
            </Text>
            
            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Verify Email
              </Button>
            </Section>

            <Text style={text}>
              Or copy and paste this link into your browser:
            </Text>
            <Text style={link}>{verificationUrl}</Text>

            <Hr style={hr} />

            <Text style={footerText}>
              If you didn't create an account, you can safely ignore this email.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © 2026 AM Creator Analytics. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link style={link} href="https://amcreatoranalytics.com/privacy">
                Privacy Policy
              </Link>{' | '}
              <Link style={link} href="https://amcreatoranalytics.com/terms">
                Terms of Service
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles (Bloomberg × McKinsey design)
const main = {
  backgroundColor: '#F8F7F4',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#1a1a2e',
  padding: '20px',
  textAlign: 'center' as const,
};

const content = {
  backgroundColor: '#FFFFFF',
  padding: '40px 30px',
  borderRadius: '8px',
  border: '1px solid #e5e7eb',
};

const h1 = {
  fontSize: '28px',
  fontWeight: 700,
  color: '#1a1a2e',
  marginBottom: '16px',
  textAlign: 'center' as const,
};

const text = {
  fontSize: '16px',
  color: '#1a1a2e',
  lineHeight: '1.6',
  marginBottom: '16px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#1a1a2e',
  color: '#F8F7F4',
  padding: '12px 30px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 600,
};

const link = {
  color: '#92400e',
  textDecoration: 'underline',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '30px 0',
};

const footer = {
  padding: '20px 30px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#92400e',
  opacity: 0.8,
  marginBottom: '8px',
};
