type productionLineTypes = {
    id: string;
    name: string;
    sewingMachineId: string | null;
    unitId: string;
    createdAt: Date;
    updatedAt: Date;
}

type ObbOperationData = {
  id: string;
  seqNo: number;
  operationId: string;
  sewingMachineId: string | null;
  obbSheetId: string;
  smv: number;
  target: number;
  spi: number;
  length: number;
  totalStitches: number;
  createdAt: Date;
  updatedAt: Date;
  operation: {
    id: string;
    name: string;
  };
  sewingMachine?: {
    id: string;
    brandName: string;
    machineType: string;
    machineId: string;
  } | null;
};