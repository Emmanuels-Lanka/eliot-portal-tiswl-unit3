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
    obbSheetId: string;
    smv: number;
    target: number;
    spi: number;
    length: number;
    totalStitches: number;
    createdAt: Date;
    updatedAt: Date;
    part: string | null;
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
    supervisor?: {
        id: string;
        name: string;
        employeeId: string;
    } | null;
    supervisorId: string | null;
};

type SendEmailAlertResponseProps = {
    status: number;
    message: string;
}

type MachineDataWithObbOperation = {
    obbOperation: {
        id: string;
        target: number;
    } | null;
}

type ProductionDataForChartTypes = {
    id: string;
    operatorRfid: string;
    eliotSerialNumber: string;
    obbOperationId: string;
    productionCount: number;
    timestamp: string;
    createdAt: Date;
    operator: {
        name: string;
        employeeId: string;
        rfid: string;
    };
    obbOperation: {
        id: string;
        seqNo: number;
        target: number;
        smv: number;
        operation: {
            name: string;
        };
    };
};

type OperationEfficiencyOutputTypes = {
    data: {
        hourGroup: string,
        operation: {
            name: string,
            efficiency: number | null
        }[];
    }[];
    categories: string[];
};

type OperatorEfficiencyOutputTypes = {
    data: {
        hourGroup: string,
        operator: {
            name: string,
            efficiency: number | null
        }[];
    }[];
    categories: string[];
};

type ProductionSMVDataTypes = {
    id: number;
    obbOperationId: string;
    operatorRfid: string;
    obbOperation: {
        smv: string;
        operation: {
            name: string;
            code: string;
        }
    }
    smv: string;
    timestamp: string;
}

type DHUDefectsDataTypes = {
    id: string;
    qcStatus: string;
    itemId: string;
    timestamp: string;
    obbOperationId: string;
    operatorId: string;
    operatorName: string;
    defects: string[];
}[];

type DataTypesForRoamingQC = {
    style: string;
    buyerName: string;
    obbOperationId: string;
    operationName: string;
    operationCode?: string;
    operatorName: string;
    operatorRfid: string;
}