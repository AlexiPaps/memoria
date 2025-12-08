import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload-ts';
import { FileParserService } from '../file-parser/file-parser.service';
import { AiService } from '../ai/ai.service';
import { DocumentService } from '../documents/document.service';
import { streamToBuffer } from '../utils/stream-to-buffer';

@Injectable()
export class UploadService {
    constructor(
        private readonly fileParserService: FileParserService,
        private readonly aiService: AiService,
        private readonly documentService: DocumentService,
    ) { }

    async handleUpload(file: FileUpload) {
        const { createReadStream, filename, mimetype } = file;

        // 1. Stream → Buffer (in memory!)
        const buffer = await streamToBuffer(createReadStream());

        // 2. Extract text from the file
        const { text, chunks } = await this.fileParserService.extractText({ buffer, mimetype });

        // 3. Send chunks of text to AI for field extraction
        const extractedFields = await this.aiService.extractDocumentFields(chunks);

        // 4. Save the extracted fields to DB
        const documentInputData = { ...extractedFields, filename, content: text };
        const document = await this.documentService.create(documentInputData);

        return document;
    }
}