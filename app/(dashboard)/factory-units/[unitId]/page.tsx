import AddSewingMachineForm from "@/components/dashboard/forms/add-sewing-machine-form";
import AddFactoryUnits from "@/components/dashboard/forms/add-unit-form";
import { db } from "@/lib/db";

const SewingMachineId = async ({
  params,
}: {
  params: { unitId: string };
}) => {


  const units = await db.unit.findUnique({
    where:{ 
      id:params.unitId
    }
  })


  // console.log("MACHINE", machine);

  
  return (
    <AddFactoryUnits
    initialData={units}
    />
  );
};

export default SewingMachineId;
