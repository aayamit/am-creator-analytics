/**
 * API Route: Nango Webhook Handler
 * Receives sync completion events from Nango and updates Leads
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mapHubSpotContactToLead } from '@/lib/nango';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { connectionId, providerConfigKey, syncName, model, responseResults } = body;

    console.log('Nango webhook received:', {
      connectionId,
      providerConfigKey,
      syncName,
      model,
    });

    // Handle different CRM providers
    if (providerConfigKey === 'hubspot') {
      await handleHubSpotSync(responseResults, connectionId);
    } else if (providerConfigKey === 'pipedrive') {
      await handlePipedriveSync(responseResults, connectionId);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Nango webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function handleHubSpotSync(results: any[], connectionId: string) {
  for (const result of results) {
    if (result.model !== 'contact') continue;

    const contacts = result.records || [];
    
    for (const contact of contacts) {
      try {
        // Check if lead already exists
        const existingLead = await prisma.lead.findFirst({
          where: { email: contact.properties?.email },
        });

        if (existingLead) {
          console.log(`Lead already exists: ${contact.properties?.email}`);
          continue;
        }

        // Create new lead (you'll need to map to a campaign and creator)
        // For now, create with minimal data
        await prisma.lead.create({
          data: {
            email: contact.properties?.email,
            stage: 'MQL',
            source: 'CREATOR_POST',
            // Note: You'll need to connect to actual campaign and creator
            // This is a placeholder - update based on your logic
            campaign: { connect: { id: 'placeholder-campaign-id' } },
            creator: { connect: { id: 'placeholder-creator-id' } },
            metadata: {
              hubspotId: contact.id,
              firstName: contact.properties?.firstname,
              lastName: contact.properties?.lastname,
              company: contact.properties?.company,
            },
          },
        });

        console.log(`Lead created: ${contact.properties?.email}`);
      } catch (error) {
        console.error(`Error processing contact ${contact.id}:`, error);
      }
    }
  }
}

async function handlePipedriveSync(results: any[], connectionId: string) {
  // Similar implementation for Pipedrive
  console.log('Pipedrive sync not yet implemented');
}
