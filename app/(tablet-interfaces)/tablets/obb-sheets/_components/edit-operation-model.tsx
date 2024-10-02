"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog-large";
import { Button } from "@/components/ui/button";
import { fetchEliotDeviceForMachine } from "../_actions/fetch-eliot-device-for-machine";
import MachineBinder from "./machine-binder";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { fetchMachineDataByMachineId } from "../_actions/fetch-machine-data-by-machineid";

type MachineWithDeviceDataType = {
    id: string;
    machineId: string;
    modelNumber: string;
    brandName: string;
    eliotDevice: {
        id: string;
        serialNumber: string;
        modelNumber: string;
    } | null;
};

interface EditOperationModelProps {
    machine: {
        id: string;
        machineId: string;
    } | undefined;
    obbOperationId: string;
};

const EditOperationModel = ({
    machine,
    obbOperationId
}: EditOperationModelProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [machineData, setMachineData] = useState<MachineWithDeviceDataType | null>(null);

    const handleToggleDialog = () => setIsDialogOpen((prev) => !prev);

    const fetchMachineData = async () => {
        if (machine) {
            const machineData = await fetchMachineDataByMachineId(machine.machineId);
            if (machineData) {
                setMachineData(machineData);
            }
        }
    };

    useEffect(() => {
        if (isDialogOpen) {
            fetchMachineData();
        }
    }, [machine, isDialogOpen]);

    const handleUnassignMachine = () => {

    }

    return (
        <Dialog open={isDialogOpen}>
            <DialogTrigger asChild>
                <Button className="w-full flex justify-start gap-2" variant="outline" onClick={() => setIsDialogOpen(true)}>
                    <Edit className="w-4 h-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-md:py-8 md:p-8 w-full">
                <DialogHeader className="mt-2">
                    <DialogTitle>
                        {machine ? `Machine ID : ${machine.machineId}` : "Assign the machine to this operation"}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                {machine && machineData && (
                    <div className="w-full flex justify-center gap-4">
                        {machineData.eliotDevice &&
                            <div className='h-full w-1/2 px-4 py-6 border bg-slate-50 rounded-lg flex flex-col items-center justify-between'>
                                <h1 className='text-center font-semibold text-xl'>ELIoT Device</h1>
                                <div className='flex justify-start items-center'>
                                    <Image
                                        src="/eliot-device.svg"
                                        alt='sewing machine'
                                        width={152}
                                        height={152}
                                        className='mr-4'
                                    />
                                    <div className='ml-4 w-full flex flex-col gap-2 items-center'>
                                        <p className='font-semibold'>Serial No: {machineData?.eliotDevice.serialNumber}</p>
                                        <p className=''>{machineData?.eliotDevice.modelNumber}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className='rounded-full opacity-0'
                                    // onClick={handleUnassignDevice}
                                >
                                    Unassign Device
                                </Button>
                            </div>
                        }
                        <div className='px-4 py-6 w-1/2 border bg-slate-50 rounded-lg flex flex-col items-center'>
                            <h1 className='text-center font-semibold text-xl'>Sewing Machine</h1>
                            <div className='-mt-4 flex justify-start items-center'>
                                <Image
                                    src="/sewing-machine.svg"
                                    alt='sewing machine'
                                    width={240}
                                    height={240}
                                    className='ml-2'
                                />
                                <div className='w-full flex flex-col gap-2 items-center'>
                                    <Badge className='text-lg px-8 tracking-wide bg-gray-600'>{machineData?.brandName.toUpperCase()}</Badge>
                                    <p className='mt-2 font-medium'>Machine ID: {machine.machineId}</p>
                                    <p className='text-sm'>{machineData?.modelNumber}</p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className='rounded-full -mt-4'
                                onClick={handleUnassignMachine}
                            >
                                Unassign Machine
                            </Button>
                        </div>
                    </div>
                )}

                {!machine &&
                    <MachineBinder
                        handleDialogOpen={handleToggleDialog}
                        obbOperationId={obbOperationId}
                    />
                }
                {machine &&
                    <DialogFooter>
                        <Button
                            variant='outline'
                            className="flex gap-2 pr-5 text-red-600"
                            onClick={handleToggleDialog}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                }
            </DialogContent>
        </Dialog>
    )
}

export default EditOperationModel