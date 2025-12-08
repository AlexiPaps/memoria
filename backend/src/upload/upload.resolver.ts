import { Resolver, Mutation, Args } from '@nestjs/graphql';
import type { FileUpload } from 'graphql-upload-ts';
import { GraphQLUpload } from 'graphql-upload-ts';
import { UploadService } from './upload.service';
import { Document } from '../documents/document.entity';

@Resolver()
export class UploadResolver {
    constructor(private readonly uploadService: UploadService) { }

    @Mutation(() => Document)
    async uploadDocument(
        @Args({ name: 'file', type: () => GraphQLUpload })
        file: FileUpload,
    ): Promise<any> {
        return this.uploadService.handleUpload(file);
    }
}