/**
 * OpenSign API Client
 * Self-hosted OpenSign integration
 * Docs: https://docs.opensignlabs.com
 */

const OPENSIGN_API_URL = process.env.OPENSIGN_URL || 'http://localhost:3001/api/v1';
const OPENSIGN_API_KEY = process.env.OPENSIGN_API_KEY || '';

export interface OpenSignDocument {
  id: string;
  title: string;
  status: 'draft' | 'sent' | 'signed' | 'cancelled';
  signers: OpenSignSigner[];
  createdAt: string;
  updatedAt: string;
}

export interface OpenSignSigner {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'signed' | 'declined';
  signedAt?: string;
}

export interface CreateDocumentPayload {
  title: string;
  templateId?: string;
  files?: { url: string; name: string }[];
  htmlContent?: string;
  signers: {
    name: string;
    email: string;
    role: 'creator' | 'brand';
  }[];
  fields?: {
    type: 'signature' | 'initials' | 'text' | 'date';
    signerId: string;
    page: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }[];
}

/**
 * Create a new document in OpenSign
 */
export async function createDocument(payload: CreateDocumentPayload): Promise<OpenSignDocument> {
  const response = await fetch(`${OPENSIGN_API_URL}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENSIGN_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenSign API error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Send document to signers
 */
export async function sendDocument(documentId: string): Promise<void> {
  const response = await fetch(`${OPENSIGN_API_URL}/documents/${documentId}/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENSIGN_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to send document: ${error.message || response.statusText}`);
  }
}

/**
 * Get document status
 */
export async function getDocument(documentId: string): Promise<OpenSignDocument> {
  const response = await fetch(`${OPENSIGN_API_URL}/documents/${documentId}`, {
    headers: {
      'Authorization': `Bearer ${OPENSIGN_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get document: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Cancel a document
 */
export async function cancelDocument(documentId: string): Promise<void> {
  const response = await fetch(`${OPENSIGN_API_URL}/documents/${documentId}/cancel`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENSIGN_API_KEY}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to cancel document: ${error.message || response.statusText}`);
  }
}

/**
 * Generate contract HTML from template
 */
export function generateContractHTML(contractData: {
  brandName: string;
  creatorName: string;
  deliverables: { posts: number; stories: number; reels: number };
  compensation: { amount: number; currency: string };
  timeline: { start: string; end: string };
  terms: Record<string, any>;
}): string {
  const { brandName, creatorName, deliverables, compensation, timeline, terms } = contractData;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Creator Agreement - ${brandName} x ${creatorName}</title>
  <style>
    body { font-family: 'Inter', sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #1a1a2e; }
    h1 { color: #92400e; border-bottom: 2px solid #92400e; padding-bottom: 10px; }
    h2 { color: #1a1a2e; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f8f7f4; font-weight: 600; }
    .section { margin: 20px 0; }
    .signature-box { border: 1px solid #ccc; padding: 40px; margin: 20px 0; text-align: center; }
  </style>
</head>
<body>
  <h1>Creator Agreement</h1>
  
  <div class="section">
    <h2>Parties</h2>
    <p><strong>Brand:</strong> ${brandName}</p>
    <p><strong>Creator:</strong> ${creatorName}</p>
  </div>

  <div class="section">
    <h2>Scope of Work</h2>
    <table>
      <tr><th>Deliverable</th><th>Quantity</th></tr>
      <tr><td>Posts</td><td>${deliverables.posts}</td></tr>
      <tr><td>Stories</td><td>${deliverables.stories}</td></tr>
      <tr><td>Reels/Videos</td><td>${deliverables.reels}</td></tr>
    </table>
  </div>

  <div class="section">
    <h2>Compensation</h2>
    <p><strong>Total Amount:</strong> ${compensation.currency} ${compensation.amount.toLocaleString()}</p>
    <p><strong>Payment Terms:</strong> Within 7 days of deliverable approval</p>
  </div>

  <div class="section">
    <h2>Timeline</h2>
    <p><strong>Start Date:</strong> ${timeline.start}</p>
    <p><strong>End Date:</strong> ${timeline.end}</p>
  </div>

  <div class="section">
    <h2>Terms & Conditions</h2>
    <p><strong>Governing Law:</strong> Laws of India</p>
    <p><strong>Jurisdiction:</strong> Bangalore, Karnataka</p>
    <p><strong>Dispute Resolution:</strong> Arbitration under Arbitration and Conciliation Act, 1996</p>
  </div>

  <div class="section">
    <h2>Signatures</h2>
    <table>
      <tr>
        <td><div class="signature-box">Brand Signature</div></td>
        <td><div class="signature-box">Creator Signature</div></td>
      </tr>
    </table>
  </div>
</body>
</html>
  `.trim();
}
