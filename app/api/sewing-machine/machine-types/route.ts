import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, code } = await request.json();

    const existingType = await db.machineType.findUnique({
      where: { code },
    });

    if (existingType) {
      return NextResponse.json(
        { error: "Machine type with this code already exists" },
        { status: 400 }
      );
    }

    const machineType = await db.machineType.create({
      data: {
        name,
        code,
      },
    });

    return NextResponse.json(machineType);
  } catch (error) {
    console.error("[MACHINE_TYPE_POST]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
