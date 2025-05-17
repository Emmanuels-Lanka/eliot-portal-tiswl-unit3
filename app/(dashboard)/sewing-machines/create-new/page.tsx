import AddSewingMachineForm from "@/components/dashboard/forms/add-sewing-machine-form";
import { db } from "@/lib/db";
import FeedMachineDataFromExcel from "../_components/feed-data-from-excel";

const CreateNewSewingMachine = async () => {
  const devices = await db.eliotDevice.findMany({
    where: {
      isAssigned: false,
    },
    select: {
      id: true,
      serialNumber: true,
      modelNumber: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const units = await db.unit.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const machineTypes = await db.machineType.findMany({
    select: {
      name: true,
      code: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <>
      <AddSewingMachineForm
        devices={devices}
        units={units}
        machineTypes={machineTypes}
        mode="create"
      />

      {/* Feeding the data to database from Excel */}
      <div className="mt-12 lg:mt-20 mx-auto max-w-7xl w-full max-lg:p-4">
        <h2 className="font-medium text-slate-700 mb-2">
          Upload Bulk Machine Data
        </h2>
        <FeedMachineDataFromExcel />
      </div>
    </>
  );
};

export default CreateNewSewingMachine;
