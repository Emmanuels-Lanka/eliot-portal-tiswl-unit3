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
    machineType: z.string().min(1, {
        message: "Machine Type is required"
    }),
    sewingMachineSerialNumber: z.string().min(1, {
        message: "Sewing Machine Serial Number is required"
    }),
    sewingMachineId: z.string().min(1, {
        message: "Sewing Machine ID is required"
    }),
    eliotDevice: z.string().min(1, {
        message: "Eliot Device is required"
    }),
    ownership: z.string().min(1, {
        message: "Machine Type is required"
    }),
});

const AddSewingMachineForm = () => {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productionUnit: "",
            machineType: "",
            sewingMachineSerialNumber: "",
            sewingMachineId: "",
            eliotDevice: "",
            ownership: ""
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
        <div className='mx-auto max-w-7xl mt-16 border px-12 pt-6 pb-10 rounded-lg shadow-xl'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6 mt-4"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <FormField
                            control={form.control}
                            name="productionUnit"
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
                            name="sewingMachineSerialNumber"
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
                            name="sewingMachineId"
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
                            name="eliotDevice"
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
                                            <SelectItem value="device1">Device 1</SelectItem>
                                            <SelectItem value="device2">Device 2</SelectItem>
                                        </SelectContent>
                                    </Select>
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
                    </div>
                    <div className="mt-4 flex justify-between gap-2">
                        <Button variant='secondary' className="flex gap-2 pr-5" onClick={() => form.reset()}>
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="flex gap-2 pr-5"
                        >
                            <Zap className={cn("w-5 h-5", isSubmitting && "hidden")} />
                            <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                            Add Machine
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddSewingMachineForm