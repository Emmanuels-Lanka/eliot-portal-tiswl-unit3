"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Zap } from "lucide-react";
import { SewingMachine } from "@prisma/client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface AddSewingMachineFormProps {
    devices: {
        id: string;
        serialNumber: string;
        modelNumber: string;
    }[];
    units: {
        id: string;
        name: string;
    }[];
    initialData?: SewingMachine | null;
    machineId?: string;
    mode?: string;
}

const formSchema = z.object({
    unitId: z.string().min(1, {
        message: "Production Unit is required"
    }),
    machineType: z.string().min(1, {
        message: "Machine Type is required"
    }),
    brandName: z.string().min(1, {
        message: "Brand Name is required"
    }),
    serialNumber: z.string().min(1, {
        message: "Sewing Machine Serial Number is required"
    }),
    machineId: z.string().min(1, {
        message: "Sewing Machine ID is required"
    }),
    eliotDeviceId: z.string().min(1, {
        message: "Eliot Device is required"
    }),
    ownership: z.string().min(1, {
        message: "Machine Type is required"
    }),
});

const AddSewingMachineForm = ({
    devices,
    units,
    initialData,
    machineId,
    mode
}: AddSewingMachineFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unitId: initialData?.unitId || "",
            machineType: initialData?.machineType || "",
            brandName: initialData?.brandName || "",
            serialNumber: initialData?.serialNumber || "",
            machineId: initialData?.machineId || "",
            eliotDeviceId: initialData?.eliotDeviceId || "",
            ownership: initialData?.ownership || "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (mode && mode === 'create') {
            try {
                const res = await axios.post('/api/sewing-machine', data);
                toast({
                    title: "Successfully created new machine",
                    variant: "success",
                    description: (
                        <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                            <code className="text-slate-800">
                                Serial No: {res.data.data.serialNumber}
                            </code>
                        </div>
                    ),
                });
                router.refresh();
                form.reset();
            } catch (error: any) {
                if (error.response && error.response.status === 409) {
                    toast({
                        title: error.response.data,
                        variant: "error"
                    });
                } else {
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
        } else {
            try {
                const res = await axios.put(`/api/sewing-machine/${machineId}`, data);
                toast({
                    title: "Updated successfully",
                    variant: "success",
                });
                router.refresh();
                router.push('/sewing-machines');
            } catch (error: any) {
                if (error.response && error.response.status === 409) {
                    toast({
                        title: error.response.data,
                        variant: "error"
                    });
                } else {
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
    }

    return (
        <div className='mx-auto max-w-7xl mt-16 border px-12 pt-6 pb-10 rounded-lg shadow-xl'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 mt-4"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                        <FormField
                            control={form.control}
                            name="unitId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Production Unit
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select production unit" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {units && units.map((unit) => (
                                                <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="brandName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Brand Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'JUKI'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="machineType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Machine Type
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select machine type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ol5t">OL5T</SelectItem>
                                            <SelectItem value="dnls">DNLS</SelectItem>
                                            <SelectItem value="snls">SNLS</SelectItem>
                                            <SelectItem value="ol3t">OL3T</SelectItem>
                                            <SelectItem value="fl">FL</SelectItem>
                                            <SelectItem value="ks">KS</SelectItem>
                                            <SelectItem value="hw">HW</SelectItem>
                                            <SelectItem value="snap">SNAP</SelectItem>
                                            <SelectItem value="foa">FOA</SelectItem>
                                            <SelectItem value="iron">IRON</SelectItem>
                                            <SelectItem value="snec">SNEC</SelectItem>
                                            <SelectItem value="sncs">SNCS</SelectItem>
                                            <SelectItem value="eh">EH</SelectItem>
                                            <SelectItem value="dna">DNA</SelectItem>
                                            <SelectItem value="bt">BT</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="machineId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                    Sewing Machine ID
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'xxxxx'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="serialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Sewing Machine Serial Number / Model Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'xxxxxxx'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="ownership"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Ownership
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select the ownership" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="rented">Rented</SelectItem>
                                            <SelectItem value="owned">Owned</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="eliotDeviceId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        ELIoT Device (Unassigned)
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select ELIoT device" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {devices.length > 0 ? devices.map((device) => (
                                                <SelectItem key={device.id} value={device.id}>{device.serialNumber} ~ {device.modelNumber}</SelectItem>
                                            )) : (
                                                <p className="text-slate-500 italic text-sm px-2">No devices available. Please create new</p>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {mode && mode === 'create' ? 
                        <div className="mt-4 flex justify-between gap-2">
                            <Button variant='outline' className="flex gap-2 pr-5" onClick={() => form.reset()}>
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="flex gap-2 pr-5"
                            >
                                <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                Add Device
                            </Button>
                        </div>
                        :
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="flex gap-2 pr-5"
                        >
                            <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                            <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                            Update
                        </Button>
                    }
                </form>
            </Form>
        </div>
    )
}

export default AddSewingMachineForm