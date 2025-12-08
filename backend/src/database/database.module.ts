import { Global, Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { ConfigService } from '@nestjs/config';

const databaseProvider = {
    provide: 'DRIZZLE',
    useFactory: async () => {
        const client = new Client({
            connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/memoria',
        });
        await client.connect();

        await client.query('CREATE EXTENSION IF NOT EXISTS vector');

        return drizzle(client);
    },
    inject: [ConfigService],
};

@Global()
@Module({
    providers: [databaseProvider],
    exports: [databaseProvider],
})
export class DatabaseModule { }