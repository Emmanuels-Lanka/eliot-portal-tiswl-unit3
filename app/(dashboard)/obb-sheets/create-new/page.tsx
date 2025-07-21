import { Staff } from "@prisma/client";

import CreateObbSheetForm from "@/components/dashboard/forms/create-obb-sheet-form";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verify,JwtPayload } from "jsonwebtoken";

interface CategorizedStaff {
  [key: string]: Staff[];
}
 const cookieStore = cookies();
    const token = cookieStore.get('AUTH_TOKEN');

    const { value } = token as any;
    const secret = process.env.JWT_SECRET || "";
    
    const verifiedUser = verify(value, secret) as JwtPayload;
const CreateNewObbSheet = async () => {
  const units = await db.unit.findMany({
    select: {
      name: true,
      id: true,
    }
  });

  const staffs = await db.staff.findMany();

  const categorizedStaff: CategorizedStaff = staffs.reduce((acc: CategorizedStaff, staff: Staff) => {
    const { designation } = staff;
    if (!acc[designation]) {
      acc[designation] = [];
    }
    acc[designation].push(staff);
    return acc;
  }, {});

  // console.log("Line Chief:", categorizedStaff?.["line-chief"]);

  return (
    <CreateObbSheetForm 
      units={units} 
      mechanics={categorizedStaff?.["mechanics"]}
      supervisor={categorizedStaff?.["supervisor"]}
      qualityInspector={categorizedStaff?.["quality-inspector"]}
      industrialEngineer={categorizedStaff?.["industrial-engineer"]}
      accessoriesInputMan={categorizedStaff?.["accessories-input-man"]}
      fabricInputMan={categorizedStaff?.["fabric-input-man"]}
      lineChief={categorizedStaff?.["line-chief"]}
      mode="create" 
      user={{
                        email: verifiedUser.email,
                        role: verifiedUser.role,
                    }}
    />
  )
}

export default CreateNewObbSheet