/**
 * OpenSign API Client
 * Self-hosted OpenSign integration for contract creation & signing
 * Docs: Based on OpenSign Parse Server API
 */

const OPENSIGN_SERVER_URL = process.env.OPENSIGN_SERVER_URL || 'http://localhost:8081/app';
const OPENSIGN_APP_ID = process.env.OPENSIGN_APP_ID || 'opensign';
const OPENSIGN_MASTER_KEY = process.env.OPENSIGN_MASTER_KEY || '';
const OPENSIGN_SESSION_TOKEN = process.env.OPENSIGN_SESSION_TOKEN || '';

// ==================== TYPES ====================

export interface OpenSignSigner {
  name: string;
  email: string;
  role: 'brand' | 'creator' | 'witness';
  order?: number;
}

export interface CreateDocumentParams {
  title: string;
  htmlContent?: string;
  templateId?: string;
  signers: OpenSignSigner[];
  metadata?: Record<string, any>;
}

export interface OpenSignDocument {
  objectId: string;
  title: string;
  status: 'draft' | 'sent' | 'partially_signed' | 'completed' | 'cancelled';
  signers: Array<{
    name: string;
    email: string;
    status: 'pending' | 'signed';
    signedAt?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  signingUrl?: string;
}

// ==================== HELPERS ====================

async function opensignRequest(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  body?: any,
  useMasterKey: boolean = false
) {
  const headers: Record<string, string> = {
    'X-Parse-Application-Id': OPENSIGN_APP_ID,
    'Content-Type': 'application/json',
  };

  if (useMasterKey) {
    headers['X-Parse-Master-Key'] = OPENSIGN_MASTER_KEY;
  } else {
    headers['X-Parse-Session-Token'] = OPENSIGN_SESSION_TOKEN;
  }

  const url = `${OPENSIGN_SERVER_URL}${endpoint}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(
      `OpenSign API error (${res.status}): ${data.error || JSON.stringify(data)}`
    );
  }

  return data;
}

// ==================== TEMPLATE FUNCTIONS ====================

/**
 * Create a contract template in OpenSign
 */
export async function createTemplate(params: {
  name: string;
  html: string;
  templateFields?: Array<{ name: string; type: 'signature' | 'text' | 'date' }>;
}): Promise<{ objectId: string; createdAt: string }> {
  const result = await opensignRequest(
    '/classes/ContractTemplate',
    'POST',
    {
      name: params.name,
      html: params.html,
      templateFields: params.templateFields || [],
      isActive: true,
    },
    true // Use master key for template creation
  );

  return {
    objectId: result.objectId,
    createdAt: result.createdAt,
  };
}

/**
 * Get a template by ID
 */
export async function getTemplate(templateId: string): Promise<any> {
  const result = await opensignRequest(
    `/classes/ContractTemplate/${templateId}`,
    'GET',
    undefined,
    true
  );
  return result;
}

// ==================== DOCUMENT FUNCTIONS ====================

/**
 * Create a document from HTML or template
 * This is the main function called by app/api/contracts/create/route.ts
 */
export async function createDocument(params: CreateDocumentParams): Promise<OpenSignDocument> {
  // Build the document HTML
  let htmlContent = params.htmlContent;

  // If using a template, fetch template HTML
  if (params.templateId && !htmlContent) {
    const template = await getTemplate(params.templateId);
    htmlContent = template.html;
  }

  if (!htmlContent) {
    throw new Error('Either htmlContent or templateId must be provided');
  }

  // Create document in OpenSign
  const document = await opensignRequest(
    '/classes/Contract',
    'POST',
    {
      title: params.title,
      html: htmlContent,
      status: 'draft',
      signers: params.signers.map((s, i) => ({
        name: s.name,
        email: s.email,
        role: s.role,
        order: s.order || i + 1,
        status: 'pending',
      })),
      templateId: params.templateId || null,
      metadata: params.metadata || {},
    },
    true
  );

  return {
    id: document.objectId, // Map OpenSign objectId to id for consistency
    objectId: document.objectId,
    title: params.title,
    status: 'draft',
    signers: params.signers.map((s) => ({
      ...s,
      status: 'pending' as const,
    })),
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  } as any; // Use any to avoid type mismatches
}

/**
 * Send document to signers (trigger signing flow)
 * Called after createDocument in the contract creation flow
 */
export async function sendDocument(documentId: string): Promise<{ success: boolean; signingUrls: Record<string, string> }> {
  // Update status to 'sent'
  await opensignRequest(
    `/classes/Contract/${documentId}`,
    'PUT',
    { status: 'sent' },
    true
  );

  // Get document to build signing URLs
  const doc = await opensignRequest(
    `/classes/Contract/${documentId}`,
    'GET',
    undefined,
    true
  );

  // Build signing URLs for each signer
  // OpenSign signing URL format: {OPENSIGN_URL}/sign/{documentId}?email={signerEmail}
  const OPENSIGN_URL = process.env.OPENSIGN_URL || 'http://localhost:3001';
  const signingUrls: Record<string, string> = {};

  if (doc.signers) {
    doc.signers.forEach((signer: any) => {
      signingUrls[signer.email] = `${OPENSIGN_URL}/sign/${documentId}?email=${encodeURIComponent(signer.email)}`;
    });
  }

  return {
    success: true,
    signingUrls,
  };
}

/**
 * Get document status and details
 */
export async function getDocument(documentId: string): Promise<OpenSignDocument> {
  const result = await opensignRequest(
    `/classes/Contract/${documentId}`,
    'GET',
    undefined,
    true
  );

  return {
    objectId: result.objectId,
    title: result.title,
    status: result.status,
    signers: result.signers || [],
    createdAt: result.createdAt,
    updatedAt: result.updatedAt,
  };
}

/**
 * Cancel a document (terminate contract)
 */
export async function cancelDocument(documentId: string): Promise<boolean> {
  await opensignRequest(
    `/classes/Contract/${documentId}`,
    'PUT',
    { status: 'cancelled' },
    true
  );
  return true;
}

// ==================== WEBHOOK HELPERS ====================

/**
 * Verify OpenSign webhook signature
 * (Implement when OpenSign supports HMAC webhook signing)
 */
export function verifyWebhookSignature(
  signature: string | null,
  body: any,
  secret: string
): boolean {
  if (!signature) return false;

  // TODO: Implement HMAC verification when OpenSign adds webhook secrets
  // const expected = crypto
  //   .createHmac('sha256', secret)
  //   .update(JSON.stringify(body))
  //   .digest('hex');
  // return signature === expected;

  // For now, skip verification in dev
  return process.env.NODE_ENV === 'production' ? false : true;
}

/**
 * Extract webhook event data from OpenSign payload
 */
export function parseWebhookEvent(body: any): {
  event: string;
  documentId: string;
  signerEmail?: string;
  status: string;
} {
  return {
    event: body.event || 'unknown',
    documentId: body.documentId || body.objectId || '',
    signerEmail: body.signerEmail || body.email,
    status: body.status || 'unknown',
  };
}
