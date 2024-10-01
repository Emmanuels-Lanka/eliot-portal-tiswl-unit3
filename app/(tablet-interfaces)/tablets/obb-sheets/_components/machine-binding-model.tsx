"use client"

import axios from "axios";
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
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { fetchEliotDeviceDetails } from "../_actions/fetch-eliot-device-details";

type EliotDeviceDataType = {
    id: string;
    modelNumber: string;
    serialNumber: string;
};

interface MachineBindingModelProps {
    machine: {
        id: string;
        machineId: string;
    } | undefined;
};

const MachineBindingModel = ({
    machine
}: MachineBindingModelProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [eliotDeviceDetail, setEliotDeviceDetail] = useState<EliotDeviceDataType | null>(null);

    const handleFetchEliotDevice = async () => {
        if (machine) {
            const device = await fetchEliotDeviceDetails(machine.id);
            console.log(device);
            setEliotDeviceDetail(device);
        }
    };

    useEffect(() => {
        if (isDialogOpen) {
            handleFetchEliotDevice();
        }
    }, [machine, isDialogOpen]);

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
                {eliotDeviceDetail && (
                    <div>
                        <h2 className="pl-2 mb-1 text-lg font-medium">ELIoT Device</h2>
                        <div className="py-4 px-6 bg-slate-100 border rounded-lg space-y-2">
                            <p className='font-medium'>Model Number : <span className='font-normal'>{eliotDeviceDetail.modelNumber}</span></p>
                            <p className='font-medium'>Serial Number : <span className='font-normal'>{eliotDeviceDetail.serialNumber}</span></p>
                        </div>
                    </div>
                )}
                <div>
                    {!eliotDeviceDetail && (
                        <p>No Eliot device found for this machine.</p>
                    )}
                </div>
                <DialogFooter>
                    <div className="mt-4 flex justify-between gap-2">
                        <Button
                            variant='outline'
                            className="flex gap-2 pr-5 text-red-600"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            // disabled={isSubmitting || !isValid}
                            className="flex gap-2 pr-5 w-40"
                        >
                            {/* <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                            <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} /> */}
                            Save
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default MachineBindingModel