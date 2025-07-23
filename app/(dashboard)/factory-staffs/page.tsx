import { db } from "@/lib/db";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { StaffTabs } from "./_components/staff-tabs";

const STAFF_DESIGNATIONS = [
  "All Staff",
  "mechanics",
  "supervisor",
  "quality-inspector",
];

const FactoryStaffPage = async ({
  searchParams,
}: {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
    designation?: string;
  };
}) => {
  const page = Number(searchParams.page) || 0;
  const pageSize = Number(searchParams.pageSize) || 10;
  const search = searchParams.search || "";
  const activeDesignation =
    searchParams.designation &&
    STAFF_DESIGNATIONS.includes(searchParams.designation)
      ? searchParams.designation
      : STAFF_DESIGNATIONS[0];

  const skip = page * pageSize;

  const whereClause = {
    ...(activeDesignation !== "All Staff" && {
      designation: activeDesignation,
    }),
    ...(search && {
      OR: [
        { employeeId: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const totalStaff = await db.staff.count({
    where: whereClause as any,
  });

  const staffs = await db.staff.findMany({
    where: whereClause as any,
    skip,
    take: pageSize,
    orderBy: {
      designation: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl mt-2 p-4">
      <StaffTabs
        designations={STAFF_DESIGNATIONS}
        activeDesignation={activeDesignation}
      />
      <DataTable
        columns={columns}
        data={staffs}
        pageCount={Math.ceil(totalStaff / pageSize)}
        pageSize={pageSize}
        pageIndex={page}
      />
    </div>
  );
};

export default FactoryStaffPage;
