import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { unitId } = await req.json();

        const lines = await db.productionLine.findMany({
            where: {
                unitId,
            },
        });

        return NextResponse.json({ data: lines, message: 'Production lines fetched successfully!' }, { status: 200 });

    } catch (error) {
        console.error("[PRODUCTION_LINES_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
