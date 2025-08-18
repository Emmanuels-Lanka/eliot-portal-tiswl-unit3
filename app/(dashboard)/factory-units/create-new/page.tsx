import AddSewingMachineForm from "@/components/dashboard/forms/add-sewing-machine-form";
import { db } from "@/lib/db";
import FeedMachineDataFromExcel from "../_components/feed-data-from-excel";
import AddFactoryUnits from "@/components/dashboard/forms/add-unit-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const AddUnitDialog = async () => {
  const units = await db.unit.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Add Factory Unit</h2>
        <Link href="/factory-units">
          <Button variant="outline">
            View Factory Units
          </Button>
        </Link>
      </div>

      <AddFactoryUnits mode="create" />

      {/* Feeding the data to database from Excel */}
    </>
  );
};

export default AddUnitDialog;