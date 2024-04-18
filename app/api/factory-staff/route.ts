import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { designation, name, phone, email, rfid, employeeId, gender } = await req.json();

        let id = generateUniqueId();

        const existingStaffByEmail = await db.staff.findUnique({
            where: {
                email
            }
        });

        const existingStaffByEmpID = await db.staff.findUnique({
            where: {
                employeeId
            }
        });

        if (existingStaffByEmail || existingStaffByEmpID) {
            return new NextResponse("Factory staff is already registered", { status: 409 })
        }

        const newStaff = await db.staff.create({
            data: {
                id,
                designation,
                rfid,
                name,
                employeeId,
                phone,
                email,
                gender
            }
        });

        return NextResponse.json({ user: newStaff, message: 'Factory staff created successfully' }, { status: 201 });

    } catch (error) {
        console.error("[FACTORY_STAFF_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}