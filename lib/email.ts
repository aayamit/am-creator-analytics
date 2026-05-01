/**
 * Email Utility using Resend + React Email
 * Saves ₹8K/month vs SendGrid
 */

import { Resend } from 'resend';
import { render } from '@react-email/components';

// Only initialize Resend if API key exists
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123') {
  resend = new Resend(process.env.RESEND_API_KEY);
}

export interface EmailOptions {
  to: string | string[];
  subject: string;
  react?: React.ReactElement;
  html?: string;
  from?: string;
}

export async function sendEmail({ to, subject, react, html, from }: EmailOptions) {
  try {
    // Check if Resend is initialized
    if (!resend) {
      console.log('⚠️ Resend not configured (missing API key). Skipping email:', subject);
      return { id: 'mock-email-id', skipped: true };
    }

    const fromAddress = from || process.env.EMAIL_FROM || 'AM Creator Analytics <noreply@amcreatoranalytics.com>';

    let htmlContent = html;
    if (react && !html) {
      htmlContent = await render(react as any);
    }

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: Array.isArray(to) ? to : [to],
      subject,
      html: htmlContent!,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log('✅ Email sent:', data?.id);
    return data;
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw - let the calling code decide how to handle
    return null;
  }
}

// Email templates mapping
export function getTemplateForType(type: string) {
  const templateMap: Record<string, string> = {
    'CONTRACT_SIGNED': 'contract-signed',
    'PAYOUT_SENT': 'payout-sent',
    'CAMPAIGN_INVITE': 'campaign-invite',
    'WELCOME': 'welcome',
  };
  return templateMap[type] || 'welcome';
}

// Check if email should be sent for notification type
export function shouldSendEmail(type: string): boolean {
  const emailTypes = [
    'CONTRACT_SIGNED',
    'PAYOUT_SENT',
    'CAMPAIGN_INVITE',
    'WELCOME',
    'PASSWORD_RESET',
  ];
  return emailTypes.includes(type);
}
