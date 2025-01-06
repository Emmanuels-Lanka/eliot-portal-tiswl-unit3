import { Client } from 'pg';

export const createPostgresClient = () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL || "",
    });

    return client;
};
export const createPostgresClientRfid = () => {
    const client = new Client({
        connectionString: process.env.RFID_DATABASE_URL || "",
    });

    return client;
};
