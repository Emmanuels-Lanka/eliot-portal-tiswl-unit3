"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { ObbSheet, ProductionLine, Staff } from "@prisma/client";
import { ArrowLeft, Loader2, Zap } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
import Link from "next/link";

interface CreateObbSheetFormProps {
    units: {
        name: string;
        id: string;
    }[] | null;
    mechanics: Staff[] | null;
    supervisor: Staff[] | null;
    qualityInspector: Staff[] | null;
    industrialEngineer: Staff[] | null;
    accessoriesInputMan: Staff[] | null;
    fabricInputMan: Staff[] | null;
    initialData?: ObbSheet | null;
    obbSheetId?: string;
    mode?: string;
}

const formSchema = z.object({
    unitId: z.string().min(1, {
        message: "Production Unit is required"
    }),
    productionLineId: z.string().min(1, {
        message: "Production Line is required"
    }),
    indEngineer: z.string().min(1, {
        message: "Industrial Engineer is required"
    }),
    supervisor1: z.string().min(1, {
        message: "Supervisor is required"
    }),
    supervisor2: z.string().nullable(),
    mechanic: z.string().min(1, {
        message: "Mechanic is required"
    }),
    qualityIns: z.string().min(1, {
        message: "Quality Inspector is required"
    }),
    accInputMan: z.string().min(1, {
        message: "Accessories Input Man is required"
    }),
    fabInputMan: z.string().min(1, {
        message: "Fabric Input Man is required"
    }),
    buyer: z.string().min(1, {
        message: "Buyer is required"
    }),
    style: z.string().min(1, {
        message: "Style is required"
    }),
    item: z.string().min(1),
    operators: z.number(),
    helpers: z.number(),
    startingDate: z.date(),
    endingDate: z.date(),
    workingHours: z.number({
        required_error: "Working Hours is required",
    }),
    efficiencyLevel1: z.number(),
    efficiencyLevel2: z.number(),
    efficiencyLevel3: z.number(),
    itemReference: z.string().nullable(),
    totalMP: z.number().nullable(),
    totalSMV: z.number().nullable(),
    bottleNeckTarget: z.number().nullable(),
    target100: z.number().nullable(),
    ucl: z.number().nullable(),
    lcl: z.number().nullable(),
    balancingLoss: z.number().nullable(),
    balancingRatio: z.number().nullable(),
    colour: z.string(),
    supResponseTime: z.number().nullable(),
    mecResponseTime: z.number().nullable(),
    qiResponseTime: z.number().nullable(),
});

const CreateObbSheetForm = ({
    units,
    mechanics,
    supervisor,
    qualityInspector,
    industrialEngineer,
    accessoriesInputMan,
    fabricInputMan,
    initialData,
    obbSheetId,
    mode
}: CreateObbSheetFormProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const startingDateFormated = initialData?.startingDate ? new Date(initialData.startingDate) : undefined
    const endingDateFormated = initialData?.endingDate ? new Date(initialData.endingDate) : undefined

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            unitId: initialData?.unitId || "",
            productionLineId: initialData?.productionLineId || "",
            indEngineer: initialData?.indEngineerId || "",
            supervisor1: initialData?.supervisor1Id || "",
            supervisor2: initialData?.supervisor2Id || "",
            mechanic: initialData?.mechanicId || "",
            qualityIns: initialData?.qualityInsId || "",
            accInputMan: initialData?.accInputManId || "",
            fabInputMan: initialData?.fabInputManId || "",
            buyer: initialData?.buyer || "",
            style: initialData?.style || "",
            item: initialData?.item || "",
            operators: initialData?.operators || 0,
            helpers: initialData?.helpers || 0,
            startingDate: startingDateFormated || undefined,
            endingDate: endingDateFormated || undefined,
            workingHours: initialData?.workingHours || 0,
            efficiencyLevel1: initialData?.efficiencyLevel1 || 0,
            efficiencyLevel2: initialData?.efficiencyLevel2 || 0,
            efficiencyLevel3: initialData?.efficiencyLevel3 || 0,
            itemReference: initialData?.itemReference || "",
            totalMP: initialData?.totalMP || 0,
            totalSMV: initialData?.totalSMV || 0,
            bottleNeckTarget: initialData?.bottleNeckTarget || 0,
            target100: initialData?.target100 || 0,
            ucl: initialData?.ucl || 0,
            lcl: initialData?.lcl || 0,
            balancingLoss: initialData?.balancingLoss || 0,
            balancingRatio: initialData?.balancingRatio || 0,
            colour: initialData?.colour || "",
            supResponseTime: initialData?.supResponseTime || 10,
            mecResponseTime: initialData?.mecResponseTime || 15,
            qiResponseTime: initialData?.qiResponseTime || 12,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const [lines, setLines] = useState<ProductionLine[]>([]);
    const [selectedSupervisor, setSelectedSupervisor] = useState('');

    const handleUnitChange = async (selectedUnitId: string) => {
        try {
            const response = await axios.get(`/api/production-line?unitId=${selectedUnitId}`);
            setLines(response.data.data);
        } catch (error) {
            console.error("Error fetching production lines:", error);
        }
    };

    useEffect(() => {
        if (mode !== 'create') {
            handleUnitChange(initialData?.unitId as string);
        };
    });

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        if (mode && mode === 'create') {
            try {
                const res = await axios.post('/api/obb-sheet', data);
                toast({
                    title: "Successfully created new OBB sheet",
                    variant: "success",
                    description: (
                        <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                            <code className="text-slate-800">
                                Style: {res.data.data.style}
                            </code>
                        </div>
                    ),
                });
                router.push(`/obb-sheets/${res.data.data.id}`);
                router.refresh();
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
                const res = await axios.put(`/api/obb-sheet/${obbSheetId}`, data);
                toast({
                    title: "Updated successfully",
                    variant: "success",
                });
                router.refresh();
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
        <div className={cn('mx-auto max-w-7xl border rounded-lg', mode === 'create' ? 'shadow-xl my-16 px-12 pt-6 pb-10 max-xl:px-8 max-xl:pt-4' : 'bg-slate-100 px-8 pt-4 pb-8')}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 mt-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                        <div className="flex flex-col gap-y-6">
                            <FormField
                                control={form.control}
                                name="unitId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Production Unit
                                        </FormLabel>
                                        <Select onValueChange={(value) => { field.onChange(value); handleUnitChange(value); }} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a unit" />
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
                                name="productionLineId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Production Line
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {lines.length > 0 && lines.map((line) => (
                                                    <SelectItem key={line.id} value={line.id}>{line.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="indEngineer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Responsible Industrial Engineer
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {industrialEngineer && industrialEngineer.map((eng) => (
                                                    <SelectItem key={eng.id} value={eng.id}>{eng.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="supervisor1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Responsible Supervisor 1
                                        </FormLabel>
                                        <Select 
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedSupervisor(value);
                                            }} 
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {supervisor && supervisor.map((sup) => (
                                                    <SelectItem key={sup.id} value={sup.id}>{sup.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="supervisor2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Responsible Supervisor 2
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {supervisor && 
                                                    supervisor.map((sup) => {
                                                        if (sup.id === selectedSupervisor) {
                                                            return null;
                                                        }
                                                        return (
                                                            <SelectItem key={sup.id} value={sup.id}>
                                                                {sup.name}
                                                            </SelectItem>
                                                        )
                                                    })
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mechanic"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Responsible Mechanic
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {mechanics && mechanics.map((mech) => (
                                                    <SelectItem key={mech.id} value={mech.id}>{mech.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="qualityIns"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Responsible Quality Inspector
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {qualityInspector && qualityInspector.map((qi) => (
                                                    <SelectItem key={qi.id} value={qi.id}>{qi.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-y-6">
                            <FormField
                                control={form.control}
                                name="accInputMan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Responsible Accessories Input Man
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {accessoriesInputMan && accessoriesInputMan.map((acc) => (
                                                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fabInputMan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Responsible Fabric Input Man
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {fabricInputMan && fabricInputMan.map((fab) => (
                                                    <SelectItem key={fab.id} value={fab.id}>{fab.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="buyer"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Buyer
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Enter the buyer name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="style"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Style
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Enter the style"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="item"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Item
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Enter the item"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="startingDate"
                                render={({ field }: { field: FieldValues['fields']['date'] }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Starting Date
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                disabled={isSubmitting}
                                                placeholder="Enter starting date."
                                                {...field}
                                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    const selectedDate = new Date(e.target.value);
                                                    form.setValue('startingDate', selectedDate, { shouldValidate: true, shouldDirty: true });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="endingDate"
                                render={({ field }: { field: FieldValues['fields']['date'] }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Ending Date
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                disabled={isSubmitting}
                                                placeholder="Enter ending date."
                                                {...field}
                                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    const selectedDate = new Date(e.target.value);
                                                    form.setValue('endingDate', selectedDate, { shouldValidate: true, shouldDirty: true });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-y-6">
                            <FormField
                                control={form.control}
                                name="workingHours"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Working Hours
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the hours"
                                                {...field}
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('workingHours', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="efficiencyLevel1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Efficiency Set Level 1 (Low)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the number"
                                                {...field}
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('efficiencyLevel1', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="efficiencyLevel3"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Efficiency Set Level 3 (High)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the number"
                                                {...field}
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('efficiencyLevel3', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="itemReference"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Item Reference
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? ''} // Ensure value is always a string
                                                onChange={field.onChange}
                                                onBlur={field.onBlur}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="colour"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Colour
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isSubmitting}
                                                placeholder="Enter the colour"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* <FormField
                                control={form.control}
                                name="supResponseTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Supervisor Response Time
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the time"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('supResponseTime', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                                onBlur={field.onBlur}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="mecResponseTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Mechanic Response Time
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the time"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('mecResponseTime', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                                onBlur={field.onBlur}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="qiResponseTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            QI Response Time
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the time"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('qiResponseTime', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                                onBlur={field.onBlur}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}
                        </div>
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
                                Create OBB Sheet
                            </Button>
                        </div>
                        :
                        <div className="mt-4 flex justify-between gap-2">
                            <Link href='/obb-sheets'>
                                <Button variant='outline' className="flex gap-2 pr-5 hover:border-slate-300 text-slate-600" onClick={() => form.reset()}>
                                    <ArrowLeft className="w-4 h-4" />
                                    View all sheets
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                className="flex gap-2 pr-5"
                            >
                                <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                                <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                                Update Sheet
                            </Button>
                        </div>
                    }
                </form>
            </Form>
        </div>
    )
}

export default CreateObbSheetForm