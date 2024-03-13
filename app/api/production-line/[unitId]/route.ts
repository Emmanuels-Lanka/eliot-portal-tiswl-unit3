import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function GET(
    req: Request,
    { params }: { params: { unitId: string } }
) {
    try {

        const lines = await db.productionLine.findMany({
            where: {
                unitId: params.unitId,
            },
        });

        return NextResponse.json({ data: lines, message: 'Production lines fetched successfully!' }, { status: 200 });
    } catch (error) {
        console.error("[FETCH_PRODUCTION_LINES_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
