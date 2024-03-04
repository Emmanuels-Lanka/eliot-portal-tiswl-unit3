"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { useState } from "react";
import { Check, Loader2, Plus, Zap } from "lucide-react";

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

const formSchema = z.object({
    productionUnit: z.string().min(1, {
        message: "Production Unit is required"
    }),
    productionLine: z.string().min(1, {
        message: "Production Line is required"
    }),
    industrialEngineer: z.string().min(1, {
        message: "Industrial Engineer is required"
    }),
    supervisor: z.string().min(1, {
        message: "Supervisor is required"
    }),
    mechanic: z.string().min(1, {
        message: "Mechanic is required"
    }),
    qualityInspector : z.string().min(1, {
        message: "Quality Inspector is required"
    }),
    accessoriesInputMan : z.string().min(1, {
        message: "Accessories Input Man is required"
    }),
    fabricInputMan : z.string().min(1, {
        message: "Fabric Input Man is required"
    }),
    buyer : z.string().min(1, {
        message: "Buyer is required"
    }),
    style : z.string().min(1, {
        message: "Style is required"
    }),
    item : z.string().min(1),
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
    mp: z.number().nullable(),
    smv: z.number().nullable(),
    bottleNeckTarget: z.number().nullable(),
    target100: z.number().nullable(),
    ucl: z.number().nullable(),
    lcl: z.number().nullable(),
    balancingLoss: z.number().nullable(),
    balancingRatio: z.number().nullable(),
    colour : z.string(),
    supervisorResponseTime: z.number().nullable(),
    mechanicResponseTime: z.number().nullable(),
    qiResponseTime: z.number().nullable(),
});

const CreateObbSheetForm = () => {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productionUnit: "",
            productionLine: "",
            industrialEngineer: "",
            supervisor: "",
            mechanic: "",
            qualityInspector: "",
            accessoriesInputMan: "",
            fabricInputMan: "",
            buyer: "",
            style: "",
            item: "",
            operators: 0,
            helpers: 0,
            startingDate: undefined,
            endingDate: undefined,
            workingHours: 0,
            efficiencyLevel1: 0,
            efficiencyLevel2: 0,
            efficiencyLevel3: 0,
            itemReference: "",
            mp: 0,
            smv: 0,
            bottleNeckTarget: 0,
            target100: 0,
            ucl: 0,
            lcl: 0,
            balancingLoss: 0,
            balancingRatio: 0,
            colour: "",
            supervisorResponseTime: 10,
            mechanicResponseTime: 15,
            qiResponseTime: 12,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // Data store api
            toast({
                title: "DATA",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            {JSON.stringify(data, null, 2)}
                        </code>
                    </div>
                ),
            });
            // form.reset();
        } catch (error: any) {
            toast({
                title: "Something went wrong!",
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

    return (
        <div className='mx-auto max-w-7xl my-16 border px-12 pt-6 pb-10 rounded-lg shadow-xl'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 mt-4"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                        <div className="flex flex-col gap-y-6">
                            <FormField
                                control={form.control}
                                name="productionUnit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Production Unit
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select production unit" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="unit1">Unit 1</SelectItem>
                                                <SelectItem value="unit2">Unit 2</SelectItem>
                                                <SelectItem value="unit3">Unit 3</SelectItem>
                                                <SelectItem value="unit4">Unit 4</SelectItem>
                                                <SelectItem value="unit5">Unit 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="productionLine"
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
                                                <SelectItem value="unit1">Unit 1</SelectItem>
                                                <SelectItem value="unit2">Unit 2</SelectItem>
                                                <SelectItem value="unit3">Unit 3</SelectItem>
                                                <SelectItem value="unit4">Unit 4</SelectItem>
                                                <SelectItem value="unit5">Unit 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="industrialEngineer"
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
                                                <SelectItem value="unit1">Unit 1</SelectItem>
                                                <SelectItem value="unit2">Unit 2</SelectItem>
                                                <SelectItem value="unit3">Unit 3</SelectItem>
                                                <SelectItem value="unit4">Unit 4</SelectItem>
                                                <SelectItem value="unit5">Unit 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="supervisor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">
                                            Responsible Supervisor
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an option" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="unit1">Unit 1</SelectItem>
                                                <SelectItem value="unit2">Unit 2</SelectItem>
                                                <SelectItem value="unit3">Unit 3</SelectItem>
                                                <SelectItem value="unit4">Unit 4</SelectItem>
                                                <SelectItem value="unit5">Unit 5</SelectItem>
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
                                                <SelectItem value="unit1">Unit 1</SelectItem>
                                                <SelectItem value="unit2">Unit 2</SelectItem>
                                                <SelectItem value="unit3">Unit 3</SelectItem>
                                                <SelectItem value="unit4">Unit 4</SelectItem>
                                                <SelectItem value="unit5">Unit 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="qualityInspector"
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
                                                <SelectItem value="unit1">Unit 1</SelectItem>
                                                <SelectItem value="unit2">Unit 2</SelectItem>
                                                <SelectItem value="unit3">Unit 3</SelectItem>
                                                <SelectItem value="unit4">Unit 4</SelectItem>
                                                <SelectItem value="unit5">Unit 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="accessoriesInputMan"
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
                                                <SelectItem value="unit1">Unit 1</SelectItem>
                                                <SelectItem value="unit2">Unit 2</SelectItem>
                                                <SelectItem value="unit3">Unit 3</SelectItem>
                                                <SelectItem value="unit4">Unit 4</SelectItem>
                                                <SelectItem value="unit5">Unit 5</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fabricInputMan"
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
                                                <SelectItem value="unit1">Unit 1</SelectItem>
                                                <SelectItem value="unit2">Unit 2</SelectItem>
                                                <SelectItem value="unit3">Unit 3</SelectItem>
                                                <SelectItem value="unit4">Unit 4</SelectItem>
                                                <SelectItem value="unit5">Unit 5</SelectItem>
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
                                name="operators"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Operators
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
                                                    form.setValue('operators', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="helpers"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Helpers
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
                                                    form.setValue('helpers', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
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
                        </div>

                        <div className="flex flex-col gap-y-6">
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
                                name="efficiencyLevel2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Efficiency Set Level 2 (Mid)
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
                                                    form.setValue('efficiencyLevel2', newValue, { shouldValidate: true, shouldDirty: true });
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
                                name="mp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Total MP
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('mp', newValue, { shouldValidate: true, shouldDirty: true });
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
                                name="smv"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Total SMV
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('smv', newValue, { shouldValidate: true, shouldDirty: true });
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
                                name="bottleNeckTarget"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Bottle Neck Target
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('bottleNeckTarget', newValue, { shouldValidate: true, shouldDirty: true });
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
                                name="target100"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Target 100%
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('target100', newValue, { shouldValidate: true, shouldDirty: true });
                                                }}
                                                onBlur={field.onBlur}
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
                                name="ucl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            UCL
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('ucl', newValue, { shouldValidate: true, shouldDirty: true });
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
                                name="lcl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            LCL
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('lcl', newValue, { shouldValidate: true, shouldDirty: true });
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
                                name="balancingLoss"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Balancing Loss
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('balancingLoss', newValue, { shouldValidate: true, shouldDirty: true });
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
                                name="balancingRatio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Balancing Ratio
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="hide-steps-number-input"
                                                disabled={isSubmitting}
                                                placeholder="Enter the value"
                                                value={field.value ?? 0}   // Nullable input
                                                onChange={(e) => {
                                                    const newValue: number = parseInt(e.target.value);
                                                    form.setValue('balancingRatio', newValue, { shouldValidate: true, shouldDirty: true });
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
                            <FormField
                                control={form.control}
                                name="supervisorResponseTime"
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
                                                    form.setValue('supervisorResponseTime', newValue, { shouldValidate: true, shouldDirty: true });
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
                                name="mechanicResponseTime"
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
                                                    form.setValue('mechanicResponseTime', newValue, { shouldValidate: true, shouldDirty: true });
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
                            />
                        </div>
                    </div>
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
                </form>
            </Form>
        </div>
    )
}

export default CreateObbSheetForm