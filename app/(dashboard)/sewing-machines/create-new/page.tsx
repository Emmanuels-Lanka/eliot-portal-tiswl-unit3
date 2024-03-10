import AddSewingMachineForm from '@/components/dashboard/forms/add-sewing-machine-form';
import { db } from '@/lib/db';

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
    }
  });

  const units = await db.unit.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      createdAt: "desc",
    }
  })
  
  return <AddSewingMachineForm devices={devices} units={units} mode='create' />
}

export default CreateNewSewingMachine