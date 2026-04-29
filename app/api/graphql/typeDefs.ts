/**
 * GraphQL Type Definitions
 * Loaded from schema.graphql file
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { gql } from 'graphql-tag';

const schemaPath = join(process.cwd(), 'graphql/schema.graphql');
const typeDefsString = readFileSync(schemaPath, 'utf-8');

export const typeDefs = gql`${typeDefsString}`;
