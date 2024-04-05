import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { name } = await req.json();

        const formattedName: string = name.toUpperCase();

        const existingOperationByName = await db.operation.findUnique({
            where: {
                name: formattedName
            }
        });

        if (existingOperationByName) {
            return new NextResponse("Already created a operation with this same name! please use different one", { status: 409 })
        }

        const newOperation = await db.operation.create({
            data: {
                name: formattedName
            }
        });

        return NextResponse.json({ data: newOperation, message: 'Operation created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[OPERATION_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}