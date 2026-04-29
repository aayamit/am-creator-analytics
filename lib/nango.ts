/**
 * Nango API Client
 * Self-hosted Nango integration for CRM sync
 * Saves ₹40K-1.6L/month vs Merge.dev
 */

const NANGO_SERVER_URL = process.env.NANGO_SERVER_URL || 'http://localhost:3003';
const NANGO_SECRET_KEY = process.env.NANGO_SECRET_KEY || 'nango-secret-key';

export interface NangoSyncResult {
  success: boolean;
  records?: any[];
  error?: string;
}

/**
 * Trigger a sync for a specific integration
 */
export async function triggerSync(
  connectionId: string,
  providerConfigKey: string,
  syncName: string
): Promise<NangoSyncResult> {
  try {
    const response = await fetch(
      `${NANGO_SERVER_URL}/api/v1/sync/trigger`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NANGO_SECRET_KEY}`,
        },
        body: JSON.stringify({
          connection_id: connectionId,
          provider_config_key: providerConfigKey,
          sync_name: syncName,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Sync trigger failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, records: data };
  } catch (error: any) {
    console.error('Nango sync error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch synced records from Nango
 */
export async function fetchRecords(
  connectionId: string,
  providerConfigKey: string,
  model: string
): Promise<NangoSyncResult> {
  try {
    const response = await fetch(
      `${NANGO_SERVER_URL}/api/v1/connection/${connectionId}/environment-variables`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${NANGO_SECRET_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, records: data };
  } catch (error: any) {
    console.error('Nango fetch error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supported CRM integrations
 */
export const SUPPORTED_CRMS = {
  HUBSPOT: 'hubspot',
  PIPEDRIVE: 'pipedrive',
  SALESFORCE: 'salesforce',
  ZOHO: 'zoho-crm',
};

/**
 * Map HubSpot contact to our Lead model
 */
export function mapHubSpotContactToLead(hubspotContact: any, campaignId: string, creatorId: string) {
  return {
    email: hubspotContact.properties?.email,
    stage: 'MQL',
    source: 'CREATOR_POST',
    campaign: { connect: { id: campaignId } },
    creator: { connect: { id: creatorId } },
    metadata: {
      hubspotId: hubspotContact.id,
      firstName: hubspotContact.properties?.firstname,
      lastName: hubspotContact.properties?.lastname,
      company: hubspotContact.properties?.company,
      phone: hubspotContact.properties?.phone,
    },
  };
}
