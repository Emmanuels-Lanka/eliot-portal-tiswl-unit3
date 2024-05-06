import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

import { db } from "@/lib/db";

const MAX_AGE = 60 * 60 * 24 * 30;         // 30 days

export async function POST(
    req: Request,
) {
    try {
        const { email, password } = await req.json();
        console.log("Database URL:", process.env.DATABASE_URL);

        // Check if the email is already exist
        const existingUserByEmail = await db.user.findUnique({
            where: {
                email
            }
        });

        if (!existingUserByEmail) {
            return new NextResponse("Email does not exist!", { status: 409 });
        };

        // Check the password is correct
        const passwordMatch = await compare(password, existingUserByEmail.password);

        if (!passwordMatch) {
            return new NextResponse("Password does not match!", { status: 401 });
        }
        
        // Get the secret
        const secret = process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcwNjc2ODE4NCwiaWF0IjoxNzA2NzY4MTg0fQ.IORglRukNdhQ8XpHF1QwDt-_ZF92O71nA8oGkQFTx1s";

        // Sign the token
        const token = sign(
            { email },
            secret,
            { expiresIn: MAX_AGE },
        );

        // Serialize the token to cookie
        const serialized = serialize("AUTH_TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development' ? true : false,
            sameSite: "strict",
            maxAge: MAX_AGE,
            path: "/",
        });

        return new NextResponse("Successfully authenticated!", { 
            status: 200,
            headers: { "Set-Cookie": serialized },
        });
        
    } catch (error) {
        console.error("[SIGNIN_ERROR]", error);
        return new NextResponse("Internal Login Error", { status: 500 });
    }
}