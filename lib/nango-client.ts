/**
 * Nango Self-Hosted Client
 * Documentation: https://docs.nango.dev/
 * Self-hosted: https://docs.nango.dev/self-hosting
 */

const NANGO_BASE_URL = process.env.NANGO_BASE_URL || "http://localhost:3003";
const NANGO_SECRET_KEY = process.env.NANGO_SECRET_KEY || "nango-secret-key"; // Set in .env

if (!NANGO_SECRET_KEY || NANGO_SECRET_KEY === "nango-secret-key") {
  console.warn("NANGO_SECRET_KEY not set in environment variables");
}

// Common headers for Nango API requests
const getHeaders = () => ({
  Authorization: `Bearer ${NANGO_SECRET_KEY}`,
  "Content-Type": "application/json",
});

// Types for Nango responses
export interface NangoConnection {
  id: number;
  connection_id: string;
  provider_config_key: string;
  environment_id: number;
  creation_date: string;
  metadata: Record<string, any>;
}

export interface NangoRecord<T> {
  id: string;
  [key: string]: any;
}

export interface SalesforceContact {
  Id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  AccountId: string;
  Title: string;
  CreatedDate: string;
}

export interface HubSpotContact {
  id: string;
  properties: {
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    jobtitle: string;
    createdate: string;
  };
}

/**
 * Get a connection by connection_id
 */
export async function getConnection(
  connectionId: string,
  providerConfigKey: string = "salesforce"
): Promise<NangoConnection> {
  const url = `${NANGO_BASE_URL}/connection/${connectionId}?provider_config_key=${providerConfigKey}`;

  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Nango API Error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * List all connections for an environment
 */
export async function listConnections(
  providerConfigKey?: string
): Promise<NangoConnection[]> {
  let url = `${NANGO_BASE_URL}/connection`;
  if (providerConfigKey) {
    url += `?provider_config_key=${providerConfigKey}`;
  }

  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Nango API Error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch records from a connection (contacts, deals, etc.)
 * Nango uses "passthrough" requests to proxy to the underlying CRM API
 */
export async function fetchRecords<T>(
  connectionId: string,
  providerConfigKey: string,
  endpoint: string,
  params?: Record<string, string>
): Promise<T[]> {
  const queryParams = new URLSearchParams(params);
  const url = `${NANGO_BASE_URL}/passthrough${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      ...getHeaders(),
      "Provider-Config-Key": providerConfigKey,
      "Connection-Id": connectionId,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Nango Passthrough Error: ${error.message || response.statusText}`);
  }

  const data = await response.json();
  return data.records || data.data || data;
}

/**
 * Get Salesforce contacts
 */
export async function getSalesforceContacts(
  connectionId: string
): Promise<SalesforceContact[]> {
  return fetchRecords<SalesforceContact>(
    connectionId,
    "salesforce",
    "/services/data/v58.0/query",
    { q: "SELECT Id,FirstName,LastName,Email,Phone,AccountId,Title,CreatedDate FROM Contact LIMIT 200" }
  );
}

/**
 * Get HubSpot contacts
 */
export async function getHubspotContacts(
  connectionId: string
): Promise<HubSpotContact[]> {
  return fetchRecords<HubSpotContact>(
    connectionId,
    "hubspot",
    "/crm/v3/objects/contacts",
    { properties: "firstname,lastname,email,phone,jobtitle,createdate" }
  );
}

/**
 * Trigger a sync for a connection
 */
export async function triggerSync(
  connectionId: string,
  providerConfigKey: string,
  syncName?: string
): Promise<{ sync_id: string }> {
  const url = `${NANGO_BASE_URL}/sync/trigger`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      connection_id: connectionId,
      provider_config_key: providerConfigKey,
      sync_name: syncName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Nango Sync Error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Get sync status for a connection
 */
export async function getSyncStatus(
  connectionId: string,
  providerConfigKey: string
): Promise<Array<{
  id: string;
  status: "RUNNING" | "SUCCESS" | "STOPPED" | "PAUSED";
  latest_action: string;
  created_at: string;
}>> {
  const url = `${NANGO_BASE_URL}/sync?connection_id=${connectionId}&provider_config_key=${providerConfigKey}`;

  const response = await fetch(url, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Nango Sync Status Error: ${error.message || response.statusText}`);
  }

  return response.json();
}

/**
 * Delete a connection
 */
export async function deleteConnection(
  connectionId: string,
  providerConfigKey: string
): Promise<void> {
  const url = `${NANGO_BASE_URL}/connection/${connectionId}?provider_config_key=${providerConfigKey}`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Nango Delete Error: ${error.message || response.statusText}`);
  }
}

export default {
  getConnection,
  listConnections,
  getSalesforceContacts,
  getHubspotContacts,
  triggerSync,
  getSyncStatus,
  deleteConnection,
};
