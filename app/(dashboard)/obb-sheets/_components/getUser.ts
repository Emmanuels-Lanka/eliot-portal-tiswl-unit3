"use server"

import { JwtPayload, verify } from "jsonwebtoken";
import { cookies } from "next/headers";

 const cookieStore = cookies();
    const token = cookieStore.get('AUTH_TOKEN');

    const { value } = token as any;
    const secret = process.env.JWT_SECRET || "";
    
    const verifiedUser = verify(value, secret) as JwtPayload;


    export  async function  getUser(){
        return {
            email: verifiedUser.email,
            role: verifiedUser.role
        };
    }