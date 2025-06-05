import React from "react";
import { db } from "@/lib/db";
import ReportTable from "./_components/daily-report";
import { getEmployee } from "./_components/actions";

const page = async () => {
  const obbSheets = await db.obbSheet.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const emp = await getEmployee();

  return (
    <div>
      <div>
        <ReportTable obbSheets={obbSheets} operators={emp}></ReportTable>
      </div>
    </div>
  );
};

export default page;
