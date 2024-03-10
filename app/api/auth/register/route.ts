import { NextResponse } from "next/server";
import { hash } from "bcrypt";

import { db } from "@/lib/db";

export async function POST(
    req: Request,
) {
    try {
        const { name, phone, email, password, employeeId, role } = await req.json();

        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        });

        if (existingUser) {
            return new NextResponse("User already registered", { status: 409 })
        }

        // Hash the password
        const hashedPassword = await hash(password, 10);

        // Create a new user
        const newUser = await db.user.create({
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
        const { password: newUserPassword, ...rest } = newUser;

        return NextResponse.json({ user: rest, message: 'Portal user created successfully'}, { status: 201 });
    } catch (error) {
        console.error("[USER_REGISTRATION]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}