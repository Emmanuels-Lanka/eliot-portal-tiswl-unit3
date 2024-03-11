import { NextResponse } from "next/server";
import { hash } from "bcrypt";

import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const existingUserById = await db.user.findUnique({
            where: {
                id: params.userId
            }
        });

        if (!existingUserById) {
            return new NextResponse("Portal account is not created yet!", { status: 409 })
        }

        const deletedAccount = await db.user.delete({
            where: {
                id: params.userId
            }
        });

        return new NextResponse("Portal account removed successfully", { status: 201 })
    } catch (error) {
        console.error("[DELETE_PORTAL_ACCOUNT_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: { userId: string } }
) {
    try {
        const { name, phone, email, password, employeeId, role } = await req.json();

        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        });

        if (!existingUser) {
            return new NextResponse("User is not registered yet!", { status: 409 })
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create a new user
        const updatedUser = await db.user.update({
            where: {
                id: params.userId
            },
            data: {
                name,
                email,
                phone,
                role,
                password: hashedPassword,
                employeeId,
            }
        });

        // remove the password from the response
        const { password: updatedUserPassword, ...rest } = updatedUser;

        return NextResponse.json({ user: rest, message: 'Portal user updated successfully'}, { status: 201 });
    } catch (error) {
        console.error("[USER_UPDATE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}