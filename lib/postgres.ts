import { Client, Pool } from 'pg';

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

export const poolForRfid = new Pool({
    connectionString: process.env.RFID_DATABASE_URL || "",
    max: 20,
    idleTimeoutMillis: 30000,
});

export const poolForPortal = new Pool({
    connectionString: process.env.DATABASE_URL || "",
    max: 20,
    idleTimeoutMillis: 30000,
});
