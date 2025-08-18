import { db } from '@/lib/db'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { Prisma } from '@prisma/client'
import AddFactoryUnits from '@/components/dashboard/forms/add-unit-form'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const FactoryUnits = async ({
  searchParams,
}: {
  searchParams: { page?: string; pageSize?: string; search?: string };
}) => {
  // Get pagination parameters from URL or use defaults
  const page = Number(searchParams.page) || 0;
  const pageSize = Number(searchParams.pageSize) || 10;
  const search = searchParams.search || "";

  const skip = page * pageSize;

  // Create the where condition for searching
  const whereCondition = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        ],
      }
    : undefined;

  // Get total count for pagination
  const totalUnits = await db.unit.count({
    where: whereCondition,
  });

  // Get units with pagination
  const units = await db.unit.findMany({
    where: whereCondition,
    skip,
    take: pageSize,
    orderBy: {
      name: "asc"
    },
  });

  console.log("Units data:", units, "Total count:", totalUnits);

  return (
    <div className='mx-auto max-w-7xl mt-12'>
      {/* Header with title and Add Unit button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Factory Units</h1>
          <p className="text-muted-foreground">
            Manage your factory units and production lines
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Factory Unit</DialogTitle>
            </DialogHeader>
            <AddFactoryUnits mode="create" />
          </DialogContent>
        </Dialog>
      </div>

      {/* Data Table */}
      <DataTable 
        columns={columns} 
        data={units} 
        totalCount={totalUnits}
        pageCount={Math.ceil(totalUnits / pageSize)}
        pageSize={pageSize}
        pageIndex={page}
      />
    </div>
  )
}

export default FactoryUnits