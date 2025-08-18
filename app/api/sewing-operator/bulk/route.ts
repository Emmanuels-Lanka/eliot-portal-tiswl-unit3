import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateUniqueId } from "@/actions/generate-unique-id";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const GENDER = ["male", "female", "other"];
    const DESIGNATION = ["junior-operator", "operator", "senior-operator"];

    if (!Array.isArray(body)) {
      return new NextResponse("Invalid data format. Expected an array.", {
        status: 400,
      });
    }

    const errors: string[] = [];
    const machinesData = await Promise.all(
      body.map(async (item, index) => {
        const { name, employeeId, rfid, gender, designation } = item;

        const isInvalid = (val: any) =>
          !val ||
          val === "undefined" ||
          val === null ||
          val?.toString().trim() === "";

        const fieldsToCheck = {
          name,
          employeeId,
          rfid,
          gender,
          designation,
        };

        const missingFields = Object.entries(fieldsToCheck)
          .filter(([_, val]) => isInvalid(val))
          .map(([key]) => key);

        if (missingFields.length > 0) {
          errors.push(
            `Row ${index + 1}: Missing fields - ${missingFields.join(", ")}`
          );
          return null;
        }

        const [
          existingOperatorByRFID,
          existingDesignation,
          existingGender,
          existingOperatorByEmpID,
        ] = await Promise.all([
          db.operator.findUnique({
            where: {
              rfid: rfid as string,
            },
          }),

          DESIGNATION.find(
            (existingDesignation) => existingDesignation === designation
          ),
          GENDER.find((existingGender) => existingGender === gender),

          db.operator.findUnique({
            where: {
              employeeId: employeeId as string,
            },
          }),
        ]);

        if (existingOperatorByRFID)
          errors.push(
            `Row ${
              index + 1
            }: The RFID you entered is already registered with another operator.`
          );

        if (existingOperatorByEmpID)
          errors.push(
            `Row ${
              index + 1
            }: The employee ID you entered is already registered with another operator.`
          );

        if (!existingDesignation)
          errors.push(
            `Row ${index + 1}: The designation you entered is not valid.`
          );

        if (!existingGender)
          errors.push(`Row ${index + 1}: The gender you entered is not valid.`);

        if (!employeeId || !rfid || !gender || !designation) return null;

        return {
          id: generateUniqueId(),
          name,
          employeeId,
          rfid,
          gender,
          designation,
        };
      })
    );

    const validOperator = machinesData.filter((m) => m !== null) as NonNullable<
      (typeof machinesData)[number]
    >[];

    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Validation failed", errors: errors.join("\n") },
        { status: 400 }
      );
    }
    console.log(validOperator);

    await db.operator.createMany({
      data: validOperator,
      skipDuplicates: true,
    });

    return NextResponse.json(
      { message: "Bulk operator data created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[BULK_OPERATOR_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
