import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE() {
    try {
        const data = await db.productionLine.findMany({
            include: {
                machines: true
            }
        });
        // const data = await db.eliotDevice.deleteMany();

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("[DELETE_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}