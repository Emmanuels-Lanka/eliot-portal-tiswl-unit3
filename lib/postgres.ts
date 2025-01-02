import { Client } from 'pg';

export const createPostgresClient = () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || "",
    });

    return client;
};
