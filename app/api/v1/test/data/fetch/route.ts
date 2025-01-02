import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
    try {
        const data = await db.operation.findMany({
            orderBy: {
                createdAt: "asc"
            }
        });

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error("[UPDATE_DATA_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}