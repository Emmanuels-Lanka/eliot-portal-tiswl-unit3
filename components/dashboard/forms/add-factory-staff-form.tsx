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

const phoneRegex = new RegExp(
    /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const formSchema = z.object({
    designation: z.string().min(1, {
        message: "Designation is required"
    }),
    employeeId: z.number({
        required_error: "Employee ID is required",
        invalid_type_error: "Employee ID must be a number",
    }),
    name: z.string().min(1, {
        message: "Name is required"
    }),
    rfid: z.string().min(1, {
        message: "RFID is required"
    }),
    phone: z.string().regex(phoneRegex, 'Invalid Phone Number!'),
    email: z.string().min(1, {
        message: "Gender is required"
    }).email("This is not a valid email!"),
});

const AddFactoryStaffForm = () => {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            designation: "",
            employeeId: undefined,
            name: "",
            rfid: "OP-",
            phone: "",
            email: "",
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-8">
                        <FormField
                            control={form.control}
                            name="designation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Designation
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select designation" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="supervisor">Supervisor</SelectItem>
                                            <SelectItem value="mechanics">Mechanics</SelectItem>
                                            <SelectItem value="quality-inspector">Quality Inspector</SelectItem>
                                            <SelectItem value="accessories-input-man">Accessories Input man</SelectItem>
                                            <SelectItem value="fabric-input-man">Fabric Input man</SelectItem>
                                            <SelectItem value="production-manager">Production Manager</SelectItem>
                                            <SelectItem value="mechanics-manager">Mechanics Manager</SelectItem>
                                            <SelectItem value="industrial-engineer">Industrial Engineer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Employee ID
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="hide-steps-number-input"
                                            disabled={isSubmitting}
                                            placeholder="e.g. '1234'"
                                            {...field}
                                            onChange={(e) => {
                                                const employeeId: number = parseInt(e.target.value);
                                                form.setValue('employeeId', employeeId, { shouldValidate: true, shouldDirty: true });
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Name with Initial
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'V. Vinojan'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="rfid"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        RFID
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
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Phone
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="tel"
                                            disabled={isSubmitting}
                                            placeholder="e.g. '0771234567'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-base">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'example@gmail.com'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                            Add Staff
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddFactoryStaffForm