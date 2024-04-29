"use client"

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Filter, Loader2 } from "lucide-react";

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

interface SelectObbSheetAndDateProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
    handleSubmit: ( data: {obbSheetId: string; date: Date }) => void;
};

const formSchema = z.object({
    obbSheetId: z.string().min(1, {
        message: "OBB Sheet is required"
    }),
    date: z.date()
});

const SelectObbSheetAndDate = ({
    obbSheets,
    handleSubmit
}: SelectObbSheetAndDateProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            obbSheetId: "",
            date: undefined,
        },
    });

    const { isSubmitting, isValid } = form.formState;

    return (
        <div className='mt-16 border px-12 pt-6 pb-10 rounded-lg bg-slate-100'>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col lg:flex-row items-end gap-x-8 gap-y-6 mt-4"
                >
                    <div className="w-full flex gap-6">
                        <div className="w-2/3">
                            <FormField
                                control={form.control}
                                name="obbSheetId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            OBB Sheet
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select obb sheet" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {obbSheets && obbSheets.map((sheet) => (
                                                    <SelectItem key={sheet.id} value={sheet.id}>{sheet.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="w-1/3">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }: { field: FieldValues['fields']['date'] }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">
                                            Date
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                disabled={isSubmitting}
                                                placeholder="Enter date"
                                                {...field}
                                                value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={(e) => {
                                                    const selectedDate = new Date(e.target.value);
                                                    form.setValue('date', selectedDate, { shouldValidate: true, shouldDirty: true });
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={!isValid || isSubmitting}
                        className="flex max-md:w-full w-32 gap-2 pr-5"
                    >
                        <Filter className={cn("w-5 h-5", isSubmitting && "hidden")} />
                        <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                        Filter
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default SelectObbSheetAndDate