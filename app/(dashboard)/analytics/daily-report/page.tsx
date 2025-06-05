import React from "react";
import { db } from "@/lib/db";
import ReportTable from "./_components/daily-report";

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

  return (
    <div>
      <div>
        <ReportTable obbSheets={obbSheets}></ReportTable>
      </div>
    </div>
  );
};

export default page;
