import { Injectable, Inject } from '@nestjs/common';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { documents } from '../database/schema';
import { eq, ilike, or, desc, asc, sql, cosineDistance } from 'drizzle-orm';
import { CreateDocumentInput } from './dto/create-document.input';
import type { Document as DocumentEntity } from './document.entity';
import { ZERO_EMBEDDING, isValidEmbedding } from '../utils/vector';
import { DocumentSearchResult } from './document-search-result.entity';
import OpenAI from 'openai';
import { EMBEDDING_DIMENSIONS } from '../utils/constants';


@Injectable()
export class DocumentService {
    constructor(@Inject('DRIZZLE') private db: NodePgDatabase) { }
    private openai = new OpenAI();

    // CREATE
    async create(
        input: CreateDocumentInput & { embedding?: number[] | null }
    ): Promise<DocumentEntity> {
        const embedding = isValidEmbedding(input.embedding) ? input.embedding : ZERO_EMBEDDING;

        const [doc] = await this.db
            .insert(documents)
            .values({
                filename: input.filename ?? 'No filename',
                title: input.title ?? 'Untitled Document',
                summary: input.summary ?? 'No summary generated.',
                content: input.content ?? '(empty)',
                embedding,
            })
            .returning();

        return doc;
    }

    // FIND ALL with search, sort, pagination
    async findAll(params: {
        search?: string;
        sortBy?: keyof typeof documents.$inferSelect;
        sortOrder?: 'asc' | 'desc';
        skip?: number;
        take?: number;
    }): Promise<DocumentEntity[]> {
        const { search, sortBy = 'createdAt', sortOrder = 'desc', skip = 0, take = 20 } = params;

        const whereClause = search
            ? or(
                ilike(documents.filename, `%${search}%`),
                ilike(documents.title, `%${search}%`),
                ilike(documents.summary, `%${search}%`),
                ilike(documents.content, `%${search}%`),
            )
            : undefined;

        const orderByClause = sortOrder === 'asc' ? asc(documents[sortBy]) : desc(documents[sortBy]);

        return this.db
            .select()
            .from(documents)
            .where(whereClause)
            .orderBy(orderByClause)
            .offset(skip)
            .limit(take);
    }

    // FIND ONE
    async findOne(id: number): Promise<DocumentEntity | null> {
        const result = await this.db.select().from(documents).where(eq(documents.id, id));
        return result[0] ?? null;
    }

    // SEMANTIC SEARCH
    async searchSemantic(query: string, limit = 8): Promise<DocumentSearchResult[]> {
        // 1. Generate query embedding
        const embeddingRes = await this.openai.embeddings.create({
            model: 'text-embedding-3-large',
            input: query,
            dimensions: EMBEDDING_DIMENSIONS,
        });
        const queryEmbedding = embeddingRes.data[0].embedding;

        // 2. pgvector search — explicit select + typed distance column
        const results = await this.db
            .select({
                id: documents.id,
                filename: documents.filename,
                title: documents.title,
                summary: documents.summary,
                content: documents.content,
                createdAt: documents.createdAt,
                updatedAt: documents.updatedAt,
                distance: sql<number>`${cosineDistance(documents.embedding, queryEmbedding)}`.as('distance'),
            })
            .from(documents)
            .where(sql`${documents.embedding} is not null`)
            .orderBy(t => t.distance)
            .limit(limit);

        // 3. Safe mapping — fix NaN with fallback score (0.0 for no match)
        return results.map(r => {
            const rawDistance = r.distance;
            let score = 0.0;

            if (typeof rawDistance === 'number' && !isNaN(rawDistance)) {
                score = Math.max(0, 1 - rawDistance);
            } else {
                console.warn(`Invalid distance for doc ${r.id}: ${rawDistance} (query: "${query}")`);  // Log for debugging
            }

            return {
                document: {
                    id: r.id,
                    filename: r.filename,
                    title: r.title,
                    summary: r.summary,
                    content: r.content,
                    createdAt: r.createdAt,
                    updatedAt: r.updatedAt,
                },
                score,
            };
        });
    }

    async deleteAll(): Promise<void> {
        await this.db.delete(documents);
    }
}

