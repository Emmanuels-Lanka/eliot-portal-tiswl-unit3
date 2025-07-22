import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const SewingOperators = async ({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string; search?: string };
}) => {
  const page = Number(searchParams.page) || 0;
  const pageSize = Number(searchParams.pageSize) || 10;
  const search = searchParams.search || "";

  const skip = page * pageSize;

  const whereClause = search
    ? {
        OR: [
          {
            employeeId: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            rfid: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const totalOperators = await db.operator.count({
    where: whereClause as any,
  });

  const operators = await db.operator.findMany({
    where: whereClause as any,
    skip,
    take: pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl mt-12">
      <DataTable
        columns={columns}
        data={operators}
        totalCount={totalOperators}
        pageCount={Math.ceil(totalOperators / pageSize)}
        pageSize={pageSize}
        pageIndex={page}
      />
    </div>
  );
};

export default SewingOperators;
