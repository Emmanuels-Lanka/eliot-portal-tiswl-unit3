import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
};

const DATABASE_URL = "postgresql://emmanuelslankapvtltd:bs2DOdxjXhu5@ep-floral-base-a1je3p6t-pooler.ap-southeast-1.aws.neon.tech/eliot-web-portal?sslmode=require"

export const db = globalThis.prisma || new PrismaClient({
    datasources: { db: { url: DATABASE_URL } }
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db;