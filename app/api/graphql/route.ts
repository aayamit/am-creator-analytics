/**
 * GraphQL API Endpoint
 * Single endpoint for all queries/mutations: /api/graphql
 * Apollo Server with Next.js App Router
 */

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@apollo/server/next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { resolvers } from '@/graphql/resolvers';
import { typeDefs } from './typeDefs';

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production', // Disable introspection in prod
});

// Create Next.js handler
const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    // Add auth context if needed
    return {
      req,
    };
  },
});

// Export GET and POST handlers
export { handler as GET, handler as POST };

// Optional: Disable body parser (Apollo handles it)
export const config = {
  api: {
    bodyParser: false,
  },
};
