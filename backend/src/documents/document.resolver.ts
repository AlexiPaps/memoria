import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DocumentService } from './document.service';
import { Document } from './document.entity';
import { CreateDocumentInput } from './dto/create-document.input';
import { DocumentSearchResult } from './document-search-result.entity';
import { EMBEDDING_DIMENSIONS } from '../utils/constants';

@Resolver(() => Document)
export class DocumentResolver {
    constructor(private documentService: DocumentService) { }

    @Query(() => [Document])
    async documents(
        @Args('search', { nullable: true }) search?: string,
        @Args('take', { type: () => Int, nullable: true }) take?: number,
        @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    ) {
        return this.documentService.findAll({ search, take, skip });
    }

    @Query(() => Document, { nullable: true })
    async document(@Args('id', { type: () => Int }) id: number) {
        return this.documentService.findOne(id);
    }

    @Mutation(() => Document)
    async createMockDocument(@Args('input') input: CreateDocumentInput) {
        const fakeEmbedding = Array(EMBEDDING_DIMENSIONS).fill(0.01337);
        return this.documentService.create({ ...input, embedding: fakeEmbedding });
    }

    @Query(() => [DocumentSearchResult])
    async searchDocuments(
        @Args('query') query: string,
        @Args('limit', { type: () => Int, nullable: true, defaultValue: 8 }) limit: number,
    ): Promise<DocumentSearchResult[]> {
        return this.documentService.searchSemantic(query, limit);
    }

    @Mutation(() => Boolean)
    async deleteAllDocuments(): Promise<boolean> {
        await this.documentService.deleteAll();
        return true;
    }
}