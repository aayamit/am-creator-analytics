# GraphQL API Plan

## 🌐 Overview
Add **GraphQL API** as alternative to REST endpoints:
- **Single endpoint** for all data (`/api/graphql`)
- **Client-specified queries** (no over-fetching)
- **Real-time subscriptions** (WebSocket)
- **Type-safe** (auto-generated types)

**Benefits**: Modern API, better performance, easier mobile app integration.

## 🚀 Quick Setup

### 1. Install Apollo Server
```bash
npm install @apollo/server graphql
npm install -D @types/graphql
```

### 2. Define Schema
```graphql
# graphql/schema.graphql
type Creator {
  id: ID!
  name: String!
  platform: String
  followerCount: Int
  engagementRate: Float
  campaigns: [Campaign!]!
}

type Campaign {
  id: ID!
  name: String!
  status: CampaignStatus!
  creators: [Creator!]!
  budget: Float
}

type Query {
  creator(id: ID!): Creator
  creators(tenantId: String!): [Creator!]!
  campaign(id: ID!): Campaign
  campaigns(tenantId: String!): [Campaign!]!
}

type Mutation {
  createCampaign(input: CreateCampaignInput!): Campaign!
  addCreatorToCampaign(campaignId: ID!, creatorId: ID!): Campaign!
}

input CreateCampaignInput {
  name: String!
  tenantId: String!
  budget: Float
}
```

### 3. Create Resolvers
```typescript
// graphql/resolvers.ts
import { prisma } from '@/lib/prisma';

export const resolvers = {
  Query: {
    creator: async (_: any, { id }: { id: string }) => {
      return await prisma.creator.findUnique({
        where: { id },
        include: { campaigns: true },
      });
    },
    creators: async (_: any, { tenantId }: { tenantId: string }) => {
      return await prisma.creator.findMany({
        where: { tenantId },
      });
    },
    // ... more queries
  },
  Mutation: {
    createCampaign: async (_: any, { input }: { input: any }) => {
      return await prisma.campaign.create({
        data: input,
      });
    },
    // ... more mutations
  },
  // Nested resolvers
  Creator: {
    campaigns: async (parent: any) => {
      return await prisma.campaign.findMany({
        where: { creators: { some: { id: parent.id } } },
      });
    },
  },
};
```

### 4. Create GraphQL Endpoint
```typescript
// app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@apollo/server/next';
import { resolvers } from '@/graphql/resolvers';
import { readFileSync } from 'fs';
import { join } from 'path';

const typeDefs = readFileSync(
  join(process.cwd(), 'graphql/schema.graphql'),
  'utf-8'
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };
```

## 📱 Mobile App Integration

### Apollo Client Setup
```typescript
// lib/apollo-client.ts
import { ApolloClient, InMemoryCache } from '@apollo/client';

export const apolloClient = new ApolloClient({
  uri: 'https://your-api.com/api/graphql',
  cache: new InMemoryCache(),
});

// Use in components
import { gql, useQuery } from '@apollo/client';

const GET_CAMPAIGNS = gql`
  query GetCampaigns($tenantId: String!) {
    campaigns(tenantId: $tenantId) {
      id
      name
      status
      budget
    }
  }
`;

export default function Campaigns() {
  const { loading, error, data } = useQuery(GET_CAMPAIGNS, {
    variables: { tenantId: '123' },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <ul>
      {data.campaigns.map((c: any) => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  );
}
```

## 🚀 Build Order

1. **Install Apollo Server** + GraphQL
2. **Define schema** (graphql/schema.graphql)
3. **Create resolvers** (graphql/resolvers.ts)
4. **Create API route** (app/api/graphql/route.ts)
5. **Test with Apollo Sandbox** (auto-generated UI)
6. **Add to mobile app** (Apollo Client)
7. **Deprecate old REST endpoints** (optional)

## 📊 Comparison: REST vs GraphQL

| Feature | REST | GraphQL |
|---------|------|----------|
| Endpoints | Multiple | Single (`/graphql`) |
| Over-fetching | Common | No (client specifies) |
| Type Safety | Manual | Auto-generated |
| Real-time | Polling | Subscriptions (WebSocket) |
| Mobile App | Fetch/Axios | Apollo Client |

## 💰 Cost
- **Apollo Server**: FREE (open-source)
- **Apollo Client**: FREE
- **Total**: **₹0** (fits your open-source preference!)

## 🎯 Why GraphQL?
1. **Mobile App** (React Native) integrates easier
2. **Modern API** (industry standard)
3. **Type Safety** (auto-generated types)
4. **Performance** (no over-fetching)

---

**Ready to build GraphQL? Say "graphql now" and I'll start!** 🌐
