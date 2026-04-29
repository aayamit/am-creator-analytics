/**
 * Contract Signed Email Template
 * Sent when a creator signs a contract
 */

import {
  Body, Button, Container, Content, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text,
} from '@react-email/components';
import * as React from 'react';

interface ContractSignedEmailProps {
  creatorName: string;
  brandName: string;
  campaignName: string;
  contractAmount: number;
  signingBonus: number;
  currency: string;
  contractUrl: string;
  dashboardUrl: string;
}

export default function ContractSignedEmail({
  creatorName = 'Creator',
  brandName = 'Brand',
  campaignName = 'Campaign',
  contractAmount = 0,
  signingBonus = 0,
  currency = '₹',
  contractUrl = 'http://localhost:3000',
  dashboardUrl = 'http://localhost:3000',
}: ContractSignedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Contract signed! {campaignName} is ready to go 🎉</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={contentSection}>
            <Heading style={h1}>Contract Signed! 🎉</Heading>
            <Text style={text}>
              Great news! <strong>{creatorName}</strong> has signed the contract for{' '}
              <strong>{campaignName}</strong>.
            </Text>

            <Section style={detailsSection}>
              <Text style={detailLabel}>Brand:</Text>
              <Text style={detailValue}>{brandName}</Text>

              <Text style={detailLabel}>Campaign:</Text>
              <Text style={detailValue}>{campaignName}</Text>

              <Text style={detailLabel}>Contract Amount:</Text>
              <Text style={detailValue}>{currency}{contractAmount.toLocaleString()}</Text>

              <Text style={detailLabel}>Signing Bonus:</Text>
              <Text style={{...detailValue, color: '#16a34a', fontWeight: '600'}}>
                {currency}{signingBonus.toLocaleString()} (will be paid out)
              </Text>
            </Section>

            <Section style={buttonSection}>
              <Button style={button} href={contractUrl}>
                View Contract
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={text}>
              The creator will be notified about the signing bonus payout. You can track the campaign progress in your{' '}
              <Link style={link} href={`${dashboardUrl}/dashboard/campaigns`}>
                dashboard
              </Link>.
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

// Styles (reuse from welcome.tsx with additions)
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
