import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { name } = await req.json();

        const res = await db.sampleTable.create({
            data: {
                name
            }
        });
        return NextResponse.json({ data: res, message: 'DATA updated successfully'}, { status: 201 });

    } catch (error) {
        console.error("[SAMPLE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}