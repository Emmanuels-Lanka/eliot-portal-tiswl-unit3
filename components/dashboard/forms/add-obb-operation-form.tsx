"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ObbOperation, Operation, SewingMachine, Staff } from "@prisma/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Loader2, PlusCircle, Zap } from "lucide-react";
import axios from "axios";

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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import ObbOperationsTable from "@/components/dashboard/common/obb-operations-table";
import { Separator } from "@/components/ui/separator";

interface AddObbOperationFormProps {
    operations: Operation[] | null;
    machines: SewingMachine[] | null;
    assignedMachinesToOperations: (string | undefined)[] | undefined;
    obbOperations: ObbOperationData[] | undefined;
    obbSheetId: string;
    supervisor1: Staff | null;
    supervisor2: Staff | null;
}

type FormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
    operationId: z.string().min(1, {
        message: "Operation is required",
    }),
    sewingMachineId: z.string().min(1, {
        message: "Sewing machine is required",
    }),
    smv: z.number(),
    target: z.number(),
    spi: z.number(),
    length: z.number(),
    totalStitches: z.number(),
    obbSheetId: z.string(),
    supervisorId: z.string().min(1, {
        message: "Responsive supervisor is required",
    }),
});

const AddObbOperationForm = ({
    operations,
    machines,
    assignedMachinesToOperations,
    obbOperations,
    obbSheetId,
    supervisor1,
    supervisor2,
}: AddObbOperationFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [operationId, setOperationId] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingData, setUpdatingData] = useState<ObbOperationData | undefined>();

    console.log("operationId", operationId);
    

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            operationId: "",
            sewingMachineId: "",
            smv: 0,
            target: undefined,
            spi: 0,
            length: 0,
            totalStitches: 0,
            obbSheetId: obbSheetId,
            supervisorId: ""
        },
    });

    const { isSubmitting, isValid } = form.formState;

    useEffect(() => {
        if (updatingData) {
            const mappedData: FormValues = {
                operationId: updatingData.operationId,
                sewingMachineId: updatingData.sewingMachine?.id || '',
                smv: updatingData.smv,
                target: updatingData.target,
                spi: updatingData.spi,
                length: updatingData.length,
                totalStitches: updatingData.totalStitches,
                obbSheetId: updatingData.obbSheetId,
                supervisorId: updatingData.supervisorId || '',
            };
            form.reset(mappedData);
        }
    }, [updatingData, form]);

    const onSubmit = async (data: FormValues) => {
        if (!isUpdating) {
            try {
                const res = await axios.post('/api/obb-operation', data);
                toast({
                    title: "Successfully added new OBB operation",
                    variant: "success",
                });
                router.refresh();
                form.reset();
                setIsEditing(false);
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
            if (updatingData) {
                try {
                    const res = await axios.put(`/api/obb-operation/${updatingData?.id}`, data);
                    toast({
                        title: "Successfully updated",
                        variant: "success",
                    });
                    router.refresh();
                    form.reset();
                    setIsUpdating(false);
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
                } finally {
                    setUpdatingData(undefined);
                }
            }
        }
    };

    const handleEdit = (data: any) => {
        try {
            setIsUpdating(true);
            setUpdatingData(data);
        } catch (error) {
            console.error("Handle Edit OBB Operation Error", error);
        }
    }

    const handleCancel = () => {
        setIsUpdating(false);
        setIsEditing(false);
        setUpdatingData(undefined);
        form.reset({
            operationId: "",
            sewingMachineId: "",
            smv: undefined,
            target: undefined,
            spi: undefined,
            length: undefined,
            totalStitches: undefined,
            obbSheetId: obbSheetId,
            supervisorId: "",
        });
    }

    return (
        <div className="mx-auto max-w-7xl border px-6 pt-4 pb-6 rounded-lg bg-slate-100">
            <div className="font-medium flex items-center justify-between">
                <h2 className="text-slate-800 text-lg font-medium">{isEditing ? 'Add OBB Operation' : isUpdating ? 'Update OBB Operations' : 'OBB Operations'}</h2>
                <Button onClick={() => setIsEditing(true)} variant='ghost' className="text-base">
                    {!isUpdating && !isEditing && (
                        <>
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Create new
                        </>
                    )}
                </Button>
            </div>

            {(isUpdating || isEditing) && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="w-full space-y-6 mt-4"
                    >
                        <div className="flex flex-row gap-x-2">
                            <div className="w-14">
                                <FormItem>
                                    <FormLabel>
                                        Seq
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={true}
                                            value={updatingData?.seqNo}
                                            className="bg-white border-black/20"
                                            placeholder="@"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </div>
                            <div className="w-5/12">
                                <FormField
                                    control={form.control}
                                    name="operationId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Operation
                                            </FormLabel>
                                            {/* <Select onValueChange={field.onChange} defaultValue={updatingData?.operationId ? updatingData.operationId : field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select operation" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {operations && operations.map((operation) => (
                                                        <SelectItem key={operation.id} value={operation.id}>{operation.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select> */}
                                            <Popover open={open} onOpenChange={setOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        aria-expanded={open}
                                                        className="w-full justify-between font-normal"
                                                    >
                                                        {operations ?
                                                            <>
                                                                {field.value
                                                                    ? operations.find((operation) => operation.id === field.value)?.name
                                                                    : "Select Operation..."}
                                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                            </>
                                                            :
                                                            "No operation available!"
                                                        }
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search operation..." />
                                                        <CommandList>
                                                            <CommandEmpty>No operation found!</CommandEmpty>
                                                            <CommandGroup>
                                                                {operations && operations.map((operation) => (
                                                                    <CommandItem
                                                                        key={operation.id}
                                                                        value={operation.name}
                                                                        onSelect={() => {
                                                                            form.setValue("operationId", operation.id)
                                                                            setOpen(false)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                field.value === operation.id ? "opacity-100" : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {operation.name}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-3/12">
                                <FormField
                                    control={form.control}
                                    name="sewingMachineId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Machine
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={updatingData?.sewingMachine?.id || field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select machine" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {assignedMachinesToOperations !== undefined ?
                                                        <>
                                                            {machines && machines.filter(machine => !assignedMachinesToOperations.includes(machine.id)).map((machine) => (
                                                                <SelectItem key={machine.id} value={machine.id}>
                                                                    {machine.brandName}-{machine.machineType}-{machine.machineId}
                                                                </SelectItem>
                                                            ))}
                                                        </>
                                                        :
                                                        <>
                                                            {machines && machines.map((machine) => (
                                                                <SelectItem key={machine.id} value={machine.id}>{machine.brandName}-{machine.machineType}-{machine.machineId}</SelectItem>
                                                            ))}
                                                        </>
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-3/12">
                                <FormField
                                    control={form.control}
                                    name="supervisorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Responsible Supervisor
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={updatingData?.supervisorId ? updatingData.supervisorId : field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select supervisor" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {supervisor1 && <SelectItem value={supervisor1.id}>{supervisor1.name} - {supervisor1.employeeId}</SelectItem>}
                                                    {supervisor2 && <SelectItem value={supervisor2.id}>{supervisor2.name} - {supervisor2.employeeId}</SelectItem>}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* <div className="w-16">
                                <FormField
                                    control={form.control}
                                    name="smv"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                SMV
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('smv', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                            <div className="w-1/12">
                                <FormField
                                    control={form.control}
                                    name="target"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Target
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('target', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* <div className="w-16">
                                <FormField
                                    control={form.control}
                                    name="spi"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                spi
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('spi', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-16">
                                <FormField
                                    control={form.control}
                                    name="length"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Length
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('length', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-44">
                                <FormField
                                    control={form.control}
                                    name="totalStitches"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="max-lg:line-clamp-1">
                                                Total Stitches
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    className="hide-steps-number-input"
                                                    disabled={isSubmitting}
                                                    {...field}
                                                    onChange={(e) => {
                                                        const newValue: number = parseInt(e.target.value);
                                                        form.setValue('totalStitches', newValue, { shouldValidate: true, shouldDirty: true });
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div> */}
                        </div>
                        <div className="mt-4 flex justify-between gap-2">
                            <Button variant='outline' className="flex gap-2 pr-5 text-red-600" onClick={handleCancel}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="flex gap-2 pr-5"
                            >
                                <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                {isUpdating ? 'Update' : 'Add OBB Operation'}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}

            {isUpdating &&
                <Separator className="mt-8 h-0.5 bg-slate-300/80" />
            }

            {!isEditing && (
                <div className="space-y-2">
                    {obbOperations && obbOperations?.length > 0 ?
                        <ObbOperationsTable
                            tableData={obbOperations}
                            handleEdit={handleEdit}
                        />
                        : (
                            <p className="text-sm mt-2 text-slate-500 italic">
                                No operations available
                            </p>
                        )}
                </div>
            )}
        </div>
    )
}

export default AddObbOperationForm