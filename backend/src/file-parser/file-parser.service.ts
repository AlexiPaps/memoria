import { Injectable } from '@nestjs/common';
import { splitIntoChunks } from '../utils/chunk-text.util';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { DocxLoader } from "@langchain/community/document_loaders/fs/docx";

@Injectable()
export class FileParserService {
    async extractText(file: { buffer: Buffer; mimetype: string }) {
        const { buffer, mimetype } = file;

        let text = '';
        let chunks: string[] = [];

        const blob = new Blob([new Uint8Array(buffer)], { type: mimetype });

        try {
            let loader;

            if (mimetype === 'application/pdf') {
                loader = new PDFLoader(blob);
            } else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                loader = new DocxLoader(blob);
            } else if (mimetype === 'text/plain' || mimetype === 'text/html') {
                const textContent = buffer.toString('utf-8');
                text = mimetype === 'text/html' ? this.cleanHtml(textContent) : textContent;
                chunks = splitIntoChunks(text);
                return { text, chunks };
            } else {
                throw new Error(`Unsupported file type: ${mimetype}`);
            }

            // For PDF & DOCX
            const docs = await loader.load();
            text = docs.map(doc => doc.pageContent).join('\n\n');
            chunks = splitIntoChunks(text);

            return { text, chunks };
        } catch (error) {
            console.error('Text extraction failed:', error);
            throw new Error('Failed to extract text from document');
        }
    }

    private cleanHtml(html: string): string {
        return html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }
}