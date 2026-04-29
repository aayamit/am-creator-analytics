#!/usr/bin/env node
// test-contract-flow.js
// Tests the full OpenSign contract creation flow

const https = require('http');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Helper: make HTTP request
function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data: data }));
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function main() {
  console.log('🧪 Testing Full Contract Creation Flow...\n');

  try {
    // 1. Create test brand user
    console.log('1. Creating test brand user...');
    const brand = await prisma.user.upsert({
      where: { email: 'test-brand@amcreator.com' },
      update: {},
      create: {
        email: 'test-brand@amcreator.com',
        name: 'Test Brand',
        role: 'BRAND',
        brandProfile: {
          create: {
            companyName: 'Test Brand Inc',
            industry: 'Technology',
            website: 'https://testbrand.com',
            gstNumber: 'GST123456789',
          }
        }
      }
    });
    console.log(`   ✅ Brand created: ${brand.id}\n`);

    // 2. Create test creator user
    console.log('2. Creating test creator user...');
    const creator = await prisma.user.upsert({
      where: { email: 'test-creator@amcreator.com' },
      update: {},
      create: {
        email: 'test-creator@amcreator.com',
        name: 'Test Creator',
        role: 'CREATOR',
        creatorProfile: {
          create: {
            handle: 'testcreator',
            platform: 'YOUTUBE',
            followerCount: 25000, // <50K so eligible for signing bonus
            engagementRate: 4.5,
          }
        }
      }
    });
    console.log(`   ✅ Creator created: ${creator.id}\n`);

    // 3. Create a campaign
    console.log('3. Creating test campaign...');
    const campaign = await prisma.campaign.upsert({
      where: { id: 'test-campaign-1' },
      update: {},
      create: {
        id: 'test-campaign-1',
        title: 'Test Campaign',
        brandId: brand.id,
        status: 'ACTIVE',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30*24*60*60*1000),
      }
    });
    console.log(`   ✅ Campaign created: ${campaign.id}\n`);

    // 4. Create campaign-creator relationship
    console.log('4. Creating campaign-creator relationship...');
    const campaignCreator = await prisma.campaignCreator.upsert({
      where: { id: 'test-cc-1' },
      update: {},
      create: {
        id: 'test-cc-1',
        campaignId: campaign.id,
        creatorId: creator.id,
        status: 'ACCEPTED',
        agreedRate: 25000,
        deliverables: {
          posts: 2,
          stories: 3,
          reels: 1,
        }
      }
    });
    console.log(`   ✅ CampaignCreator created: ${campaignCreator.id}\n`);

    // 5. Call contract creation API
    console.log('5. Calling contract creation API...');
    const contractData = {
      initiatorType: 'BRAND',
      initiatorId: brand.id,
      counterpartyId: creator.id,
      campaignCreatorId: campaignCreator.id,
      contractType: 'STANDARD',
      country: 'IN',
      state: 'Maharashtra',
      startDate: '2026-05-01',
      endDate: '2026-06-30',
      amount: 25000,
      currency: 'INR',
      deliverables: {
        posts: 2,
        stories: 3,
        reels: 1,
      },
      platforms: ['YOUTUBE'],
      paymentTerms: 'ON_COMPLETION',
    };

    const response = await makeRequest('http://localhost:3000/api/contracts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contractData),
    });

    console.log(`   Status: ${response.status}`);
    console.log(`   Response: ${response.data}\n`);

    if (response.status === 200) {
      const result = JSON.parse(response.data);
      console.log('✅ Contract created successfully!');
      console.log(`   Contract ID: ${result.contractId}`);
      console.log(`   OpenSign Document ID: ${result.openSignDocumentId}`);
      console.log(`   OpenSign URL: ${result.openSignUrl}\n`);

      // 6. Verify OpenSign received the document
      console.log('6. Verifying OpenSign received document...');
      // Note: Would need OpenSign API key to verify
      console.log('   ⚠️  Need OpenSign API key to verify document in OpenSign\n');
    }

    // 7. Test webhook handler
    console.log('7. Testing webhook handler...');
    const webhookResponse = await makeRequest('http://localhost:3000/api/webhooks/opensign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'document.completed',
        documentId: 'test-doc-123',
        status: 'SIGNED',
      }),
    });
    console.log(`   Status: ${webhookResponse.status}`);
    console.log(`   Response: ${webhookResponse.data}\n`);

    console.log('✅ Test complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();