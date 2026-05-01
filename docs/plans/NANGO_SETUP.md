# AM Creator Analytics - Nango Self-Hosted Setup

## Overview
AM Creator Analytics uses **Nango** (open-source, self-hosted) for CRM integrations instead of paid SaaS tools like Merge.dev. This saves $500-2000/month in ongoing costs.

## Quick Start

### 1. Start Nango via Docker
```bash
docker run -p 3003:3003 nango/nango:latest
```

Default credentials:
- **Nango URL**: `http://localhost:3003`
- **Secret Key**: `nango-secret-key` (change in production!)

### 2. Configure OAuth Apps

#### Salesforce
1. Go to [Salesforce Connected App](https://developer.salesforce.com/)
2. Create a Connected App with:
   - Callback URL: `http://localhost:3003/oauth/callback`
   - Scopes: `api`, `refresh_token`, `offline_access`
3. Get `Client ID` and `Client Secret`
4. Add to Nango dashboard or via API

#### HubSpot
1. Go to [HubSpot Developer Portal](https://developers.hubspot.com/)
2. Create an app with:
   - Redirect URL: `http://localhost:3003/oauth/callback`
   - Scopes: `crm.objects.contacts.read`, `crm.objects.deals.read`
3. Get `Client ID` and `Client Secret`

### 3. Configure Nango
Run this script to set up providers:
```bash
curl -X POST http://localhost:3003/provider-config \
  -H "Content-Type: application/json" \
  -d '{
    "provider_config_key": "salesforce",
    "provider": "salesforce",
    "client_id": "YOUR_SALESFORCE_CLIENT_ID",
    "client_secret": "YOUR_SALESFORCE_CLIENT_SECRET",
    "scopes": ["api", "refresh_token", "offline_access"],
    "redirect_uri": "http://localhost:3003/oauth/callback"
  }'

curl -X POST http://localhost:3003/provider-config \
  -H "Content-Type: application/json" \
  -d '{
    "provider_config_key": "hubspot",
    "provider": "hubspot",
    "client_id": "YOUR_HUBSPOT_CLIENT_ID",
    "client_secret": "YOUR_HUBSPOT_CLIENT_SECRET",
    "scopes": ["crm.objects.contacts.read"],
    "redirect_uri": "http://localhost:3003/oauth/callback"
  }'
```

### 4. Update Environment Variables
Edit `.env` in the project root:
```
NANGO_BASE_URL=http://localhost:3003
NANGO_SECRET_KEY=nango-secret-key
```

For production:
```
NANGO_BASE_URL=https://nango.yourdomain.com
NANGO_SECRET_KEY=your-production-secret-key
```

### 5. Test the Integration
1. Start the Next.js dev server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/brands/crm`

3. Click "Connect Salesforce" or "Connect HubSpot"

4. Complete OAuth flow in the popup

5. Verify connection appears in the dashboard

## Production Deployment

### Option A: Self-Hosted (Recommended)
Deploy Nango on your own infrastructure:
```bash
# Using Docker Compose
git clone https://github.com/NangoHQ/nango.git
cd nango
docker-compose -f docker-compose.prod.yml up -d
```

See: https://docs.nango.dev/self-hosting/deployment

### Option B: Nango Cloud
For managed hosting (removes self-hosting overhead):
- Sign up at https://nango.dev
- Costs: ~$99/month for managed version

## Architecture

```
AM Creator Analytics (Next.js)
    ↓
Nango Self-Hosted (Docker)
    ↓
Salesforce / HubSpot / 200+ integrations
```

Benefits:
- ✅ Zero ongoing SaaS costs
- ✅ Full data privacy (self-hosted)
- ✅ Complete control over data flow
- ✅ 200+ pre-built integrations via Nango

## Troubleshooting

### Nango container won't start
```bash
docker logs <container_id>
# Check if port 3003 is already in use
lsof -i :3003
```

### OAuth flow fails
1. Verify callback URL matches exactly: `http://localhost:3003/oauth/callback`
2. Check client ID/secret are correct
3. Ensure scopes are properly configured

### Connection not syncing
```bash
# Check Nango logs
docker exec -it <container_id> tail -f /var/log/nango.log
```

## Next Steps
1. **Add frontend SDK**: Install `@nango/connector` for smoother OAuth UX
2. **Set up syncs**: Configure Nango sync scripts for automated data sync
3. **Add more CRMs**: Nango supports 200+ integrations (Pipedrive, Zoho, etc.)

## Resources
- [Nango Documentation](https://docs.nango.dev/)
- [Self-Hosting Guide](https://docs.nango.dev/self-hosting)
- [Nango GitHub](https://github.com/NangoHQ/nango)
- [Supported Integrations](https://docs.nango.dev/integrate/guides/supported-apis)
