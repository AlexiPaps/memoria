import { pgTable, serial, text, timestamp, vector } from 'drizzle-orm/pg-core';
import { EMBEDDING_DIMENSIONS } from '../utils/constants';

export const documents = pgTable('documents', {
    id: serial('id').primaryKey(),
    filename: text('filename'),
    title: text('title'),
    content: text('content').notNull(),
    summary: text('summary'),
    embedding: vector('embedding', { dimensions: EMBEDDING_DIMENSIONS }),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});