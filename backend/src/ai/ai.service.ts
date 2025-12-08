import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { EMBEDDING_DIMENSIONS } from '../utils/constants';

@Injectable()
export class AiService {
    private readonly client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    async extractMetadata(text: string): Promise<{ title: string }> {
        const systemPrompt = `
Extract the following metadata from the document:

{
    "title": string
}

Return ONLY a valid JSON object.
`;

        const res = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: text }
            ],
            response_format: { type: "json_object" },
        });

        return JSON.parse(res.choices[0].message?.content || "{ title: 'no-title'}");
    }

    async summarizeChunk(chunk: string): Promise<string> {
        const res = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            messages: [
                {
                    role: "system",
                    content: `Summarize this section in 2–4 sentences.`
                },
                { role: "user", content: chunk }
            ]
        });
        return (res.choices[0].message?.content?.trim() || "");
    }


    async finalSummary(chunkSummaries: string[]): Promise<string> {
        const res = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.2,
            messages: [
                {
                    role: "system",
                    content: `
                        You are given summaries of different sections of a document.
                        Create ONE concise, coherent summary (4-8 sentences) of the entire document.
                    `
                },
                {
                    role: "user",
                    content: chunkSummaries.map((s, i) => `--- Section ${i + 1} ---\n${s}`).join("\n\n")
                }
            ]
        });

        return (res.choices[0].message?.content?.trim() || "No Summary");
    }

    async extractDocumentFields(chunks: string[]) {
        const metadata = await this.extractMetadata(chunks[0]);
        const chunkSummaries = await Promise.all(chunks.map(chunk => this.summarizeChunk(chunk)));
        const summary = await this.finalSummary(chunkSummaries);
        const embedding = await this.generateEmbeddings(summary);

        const result = {
            ...metadata,
            summary,
            embedding
        }

        return result;
    }

    async generateEmbeddings(text: string): Promise<number[]> {
        const embeddingRes = await this.client.embeddings.create({
            model: 'text-embedding-3-large',
            input: text,
            dimensions: EMBEDDING_DIMENSIONS,
        });

        const embedding = embeddingRes.data[0].embedding;
        return embedding;
    }
}
