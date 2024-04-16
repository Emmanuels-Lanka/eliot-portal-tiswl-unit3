import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        let id = generateUniqueId();

        const existingId = await db.sampleTable.findUnique({
            where: {
                id
            }
        });

        if (existingId) {
            return new NextResponse("ID is exist!", { status: 409 })
        }

        const sampple = await db.sampleTable.create({
            data: {
                id,
                name: "Sample Table",
            }
        });

        return NextResponse.json({ data: sampple, message: 'Sample created successfully'}, { status: 201 });
        
    } catch (error) {
        console.error("[SAMPLE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}