import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const body = await req.json();
        // console.log("BODY", body);

        const machines = await db.sewingMachine.createMany({
            data: body,
            skipDuplicates: true
        })

        return NextResponse.json({ data: machines, message: 'Bulk machine data created successfully'}, { status: 201 });
    } catch (error) {
        console.error("[BULK_SEWING_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}