import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { name, employeeId, rfid, gender, designation } = await req.json();

        let id = generateUniqueId();

        const existingOperatorByRFID = await db.operator.findUnique({
            where: {
                rfid
            }
        });

        const existingOperatorByEmpID = await db.operator.findUnique({
            where: {
                employeeId
            }
        });

        if (existingOperatorByRFID || existingOperatorByEmpID) {
            return new NextResponse("Operator is already registered", { status: 409 })
        }

        const newOperator = await db.operator.create({
            data: {
                id,
                name,
                employeeId,
                rfid,
                gender,
                designation
            }
        });

        return NextResponse.json({ data: newOperator, message: 'Sewing operator created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[SEWING_OPERATOR_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}