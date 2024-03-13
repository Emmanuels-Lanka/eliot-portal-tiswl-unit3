import { NextResponse } from "next/server";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { staffId: string } }
) {
    try {
        const existingStaffByEmpId = await db.staff.findUnique({
            where: {
                id: params.staffId
            }
        });

        if (!existingStaffByEmpId) {
            return new NextResponse("Staff is not registered yet!", { status: 409 })
        }

        const deletedStaff = await db.staff.delete({
            where: {
                id: params.staffId
            }
        });

        return new NextResponse("Staff removed successfully", { status: 201 })
    } catch (error) {
        console.error("[DELETE_FACTORY_STAFF_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { staffId: string } }
) {
    try {
        const { designation, name, phone, email, rfid, employeeId, gender } = await req.json();

        const existingStaffById = await db.staff.findUnique({
            where: {
                id: params.staffId
            }
        });

        const existingStaffByEmpId = await db.staff.findUnique({
            where: {
                employeeId: params.staffId
            }
        });

        if (!existingStaffById) {
            return new NextResponse("The factory staff does not exist", { status: 409 })
        };

        if (existingStaffByEmpId) {
            return new NextResponse("Employee ID is already exist for another staff!", { status: 401 })
        };

        const updatedStaff = await db.staff.update({
            where: {
                id: params.staffId
            },
            data: {
                designation,
                rfid,
                name,
                employeeId,
                phone,
                email,
                gender
            }
        });

        return NextResponse.json({ data: updatedStaff, message: 'Factory staff updated successfully'}, { status: 201 });
        
    } catch (error) {
        console.error("[UPDATE_FACTORY_STAFF_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}