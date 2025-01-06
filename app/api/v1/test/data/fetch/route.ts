import { NextResponse } from "next/server";
import fs from "fs/promises"; 
import path from "path";

import { db } from "@/lib/db";

export async function GET() {
    const page = 0;
    const pageSize = 100000;

    const skip = page * pageSize;
    const take = pageSize;

    try {
        const data = await db.productionData.findMany({
            where: {
                timestamp: {
                    gte: "2024-11-01 00:00:00",
                    lte: "2025-01-03 23:59:59"
                },
            },
            orderBy: {
                createdAt: "asc"
            },
            // take,
            // skip
        });
        console.log("COUNT:", data.length);

        // Define the path for the JSON file
        const filePath = "D:/Documents/EL/eliot-portal/app/api/v1/test/data/data.json";

        // Write the data to a JSON file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');

        // const data = await db.gmtData.deleteMany();

        return NextResponse.json(data.length, { status: 201 });
    } catch (error) {
        console.error("[UPDATE_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}