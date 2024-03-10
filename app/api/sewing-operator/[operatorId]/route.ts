import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { operatorId: string } }
) {
    try {
        const existingOperatorById = await db.operator.findUnique({
            where: {
                id: params.operatorId
            }
        });

        if (!existingOperatorById) {
            return new NextResponse("This operator does not exist", { status: 409 })
        }

        const deletedOperator = await db.operator.delete({
            where: {
                id: params.operatorId
            }
        });

        return new NextResponse("Operator deleted successfully", { status: 201 })
    } catch (error) {
        console.error("[DELETE_SEWING_OPERATOR_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { operatorId: string } }
) {
    try {
        const { name, employeeId, rfid, gender, designation } = await req.json();

        const existingOperatorById = await db.operator.findUnique({
            where: {
                id: params.operatorId
            }
        });

        if (!existingOperatorById) {
            return new NextResponse("This operator does not exist", { status: 409 })
        };

        const updatedMachine = await db.operator.update({
            where: {
                id: params.operatorId
            },
            data: {
                name,
                employeeId,
                rfid,
                gender,
                designation
            }
        });

        return NextResponse.json({ data: updatedMachine, message: 'Operator updated successfully'}, { status: 201 });
        
    } catch (error) {
        console.error("[UPDATE_SEWING_OPERATOR_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}