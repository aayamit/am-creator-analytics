/**
 * Payout Sent Email Template
 * Sent when a payout is processed
 */

import {
  Body, Button, Container, Content, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text,
} from '@react-email/components';
import * as React from 'react';

interface PayoutSentEmailProps {
  creatorName: string;
  amount: number;
  currency: string;
  payoutMethod: string;
  transactionId: string;
  dashboardUrl: string;
}

export default function PayoutSentEmail({
  creatorName = 'Creator',
  amount = 0,
  currency = '₹',
  payoutMethod = 'Stripe Connect',
  transactionId = 'txn_123456',
  dashboardUrl = 'http://localhost:3000',
}: PayoutSentEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Payout of {currency}{amount.toLocaleString()} sent! 💰</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={contentSection}>
            <Heading style={h1}>Payout Sent! 💰</Heading>
            <Text style={text}>
              Hi {creatorName}, your payout has been processed successfully.
            </Text>

            <Section style={detailsSection}>
              <Text style={detailLabel}>Amount:</Text>
              <Text style={detailValue}>{currency}{amount.toLocaleString()}</Text>

              <Text style={detailLabel}>Method:</Text>
              <Text style={detailValue}>{payoutMethod}</Text>

              <Text style={detailLabel}>Transaction ID:</Text>
              <Text style={detailValue}>{transactionId}</Text>
            </Section>

            <Section style={buttonSection}>
              <Button style={button} href={dashboardUrl}>
                View Earnings
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={text}>
              The funds should arrive in your account within 2-3 business days.
              Check your <Link style={link} href={`${dashboardUrl}/dashboard/payouts`}>payout settings</Link> for details.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © 2026 AM Creator Analytics. All rights reserved.
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

const text = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#1a1a2e',
  marginBottom: '16px',
};

const detailsSection = {
  backgroundColor: '#f8f7f4',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
};

const detailLabel = {
  fontSize: '14px',
  color: '#92400e',
  opacity: '0.8',
  marginBottom: '4px',
};

const detailValue = {
  fontSize: '16px',
  fontWeight: '600',
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
