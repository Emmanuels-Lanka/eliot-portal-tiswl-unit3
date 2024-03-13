"use client"

import { SewingMachine } from "@prisma/client";
import { useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/db";
import axios from "axios";

interface AssignMachineProps {
    assignedMachines: SewingMachine[] | null;
    unassignedMachines: SewingMachine[] | null;
    lineId: string | null;
}

const AssignMachine = ({
    assignedMachines,
    unassignedMachines,
    lineId,
}: AssignMachineProps) => {
    const { toast } = useToast();
    const router = useRouter()

    const handleAssign = async (id: string) => {
        if (lineId) {
            try {
                const res = await axios.put(`/api/production-line/assign-machine/${lineId}`, { machineId:id });
                toast({
                    title: "Assigned the machine",
                    variant: "success",
                });
                console.log(res.data.data);
                router.refresh();
            } catch (error: any) {
                toast({
                    title: "Something went wrong! Try again",
                    variant: "error",
                    description: (
                        <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                            <code className="text-slate-800">
                                ERROR: {error.message}
                            </code>
                        </div>
                    ),
                });
            }
        }
    };

    const handleUnassign = async (id: string) => {
        if (lineId) {
            try {
                const res = await axios.put(`/api/production-line/unassign-machine/${lineId}`, { machineId:id });
                toast({
                    title: "Unassigned the machine",
                    variant: "success",
                });
                console.log(res.data.data);
                router.refresh();
            } catch (error: any) {
                toast({
                    title: "Something went wrong! Try again",
                    variant: "error",
                    description: (
                        <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                            <code className="text-slate-800">
                                ERROR: {error.message}
                            </code>
                        </div>
                    ),
                });
            }
        }
    }
    
    return (
        <div className="border px-8 pt-7 py-8 rounded-lg bg-slate-100">
            {lineId ? 
            <>
                <div className="flex flex-col">
                    <h3 className="font-medium text-slate-900">Assigned machines</h3>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-3">
                        {assignedMachines && assignedMachines.map((machine) => (
                            <Badge 
                                key={machine.id}
                                className="bg-green-600 cursor-pointer text-sm px-4 py-1 uppercase font-medium tracking-wide" 
                                onClick={() => handleUnassign(machine.id)}
                            >
                                {machine.brandName}-{machine.machineType}-{machine.machineId}
                            </Badge>
                        ))}
                    </div>
                </div>
                <Separator className="h-0.5 bg-slate-300 my-6" />
                <div className="flex flex-col">
                    <h3 className="font-medium text-slate-900">Unassigned machines</h3>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-3">
                        {unassignedMachines && unassignedMachines.map((machine) => (
                            <Badge 
                                key={machine.id}
                                className="bg-orange-600 cursor-pointer text-sm px-4 py-1 uppercase font-medium tracking-wide" 
                                onClick={() => handleAssign(machine.id)}
                            >
                                {machine.brandName}-{machine.machineType}-{machine.machineId}
                            </Badge>
                        ))}
                    </div>
                </div>
            </>
            :
                <p className="text-slate-600">🥺 Select the production line to assign the machine...</p>
            }
        </div>
    )
}

export default AssignMachine