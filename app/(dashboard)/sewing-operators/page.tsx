import { db } from "@/lib/db";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const SewingOperators = async ({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string; search?: string };
}) => {
  // Get pagination parameters from URL or use defaults
  const page = Number(searchParams.page) || 0;
  const pageSize = Number(searchParams.pageSize) || 10;
  const search = searchParams.search || "";

  // Calculate skip value for pagination
  const skip = page * pageSize;

  // Fetch total count for pagination info
  const totalOperators = await db.operator.count({
    where: search
      ? {
          employeeId: {
            contains: search,
            mode: "insensitive",
          },
        }
      : undefined,
  });

  // Fetch only the required operators with pagination
  const operators = await db.operator.findMany({
    where: search
      ? {
          employeeId: {
            contains: search,
            mode: "insensitive",
          },
        }
      : undefined,
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