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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
    serialNumber: z.string().min(1, {
        message: "Serial Number is required"
    }),
    modelNumber: z.string().min(1, {
        message: "Model Number is required"
    }),
    installedDate: z.date(),
});

const AddEliotDeviceForm = () => {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            serialNumber: "ELIoT-",
            modelNumber: "",
            installedDate: undefined,
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
                            name="serialNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Serial Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'ELIoT-xxx'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="modelNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Model Number
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'ELIOTXXXX'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="installedDate"
                            render={({ field }: { field: FieldValues['fields']['date'] }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Installed Date
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="date"
                                            disabled={isSubmitting}
                                            placeholder="Enter installed date."
                                            {...field}
                                            value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                            onChange={(e) => {
                                                const selectedDate = new Date(e.target.value);
                                                form.setValue('installedDate', selectedDate, { shouldValidate: true, shouldDirty: true });
                                            }}
                                        />
                                    </FormControl>
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
                            Add Device
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddEliotDeviceForm