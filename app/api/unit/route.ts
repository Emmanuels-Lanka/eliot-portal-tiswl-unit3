import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(
    req: Request,
) {
    try {
        const { unitName } = await req.json();


        const existingUnit = await db.unit.findFirst(({
            where:{
                name:unitName
            }
        }))

       

        if (existingUnit ) {
            return new NextResponse("Unit is already registered", { status: 409 })
        }

        const newUnit = await db.unit.create({
            data:{
                name:unitName
            }
        })
        // Create a new machine
        

        // Change the device state of isAssigned
     

        return NextResponse.json({ data: newUnit, message: 'New Unit  is created successfully'}, { status: 201 });

    } catch (error) {
        console.error("[SEWING_MACHINE_ERROR]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}



