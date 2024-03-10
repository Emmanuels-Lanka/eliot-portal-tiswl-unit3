import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { name, unitId } = await req.json();

        const newLine = await db.productionLine.create({
            data: {
                name,
                unitId 
            }
        });

        return NextResponse.json({ data: newLine, message: 'Production line is created successfully!'}, { status: 201 });
        
    } catch (error) {
        console.error("[PRODUCTION_LINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
