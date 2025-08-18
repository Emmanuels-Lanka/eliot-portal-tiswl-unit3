import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { unitId: string } }
) {
    try {
        const {
            unitName
        } = await req.json();

        const exisitingUnitById = await db.unit.findUnique({
            where: {
                id: params.unitId,
            },
        });

        if (!exisitingUnitById) {
            return new NextResponse("This Unit does not exist", {
                status: 409,
            });
        }


        const updatedUnit = await db.unit.update({
            where: {
                id: params.unitId,
            },
            data: {
                name:unitName
            },
        });

        return NextResponse.json(
            {
                data: updatedUnit,
                message: "Unit updated successfully",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("[UPDATE_Unit_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


export async function DELETE(
    req: Request,
    { params }: { params: { unitId: string } }
) {
    try {
        const existingMachineById = await db.unit.findUnique({
            where: {
                id: params.unitId,
            },
        });

        if (!existingMachineById) {
            return new NextResponse("Unit does not exist", {
                status: 409,
            });
        }

        // Fetch the eliot device id
   

        const deletedMachine = await db.unit.delete({
            where: {
                id: params.unitId,
            },
        });

        return new NextResponse("Unit deleted successfully", {
            status: 201,
        });
    } catch (error) {
        console.error("[DELETE_UNIT_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}