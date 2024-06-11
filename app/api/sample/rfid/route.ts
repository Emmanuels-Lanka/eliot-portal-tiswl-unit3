import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { tagId } = await req.json();

        const newTag = await db.sampleTable.create({
            data: {
                tagId
            }
        });
        return NextResponse.json({ data: newTag, message: 'New RFID tag updated successfully'}, { status: 201 });
        
    } catch (error) {
        console.error("[RFID_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}