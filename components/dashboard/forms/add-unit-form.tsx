"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Building2, RotateCcw } from "lucide-react";
import Link from "next/link";

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
import { MACHINE_BRANDS } from "@/constants";
import { AddMachineTypeDialog } from "@/app/(dashboard)/sewing-machines/_components/add-machine-type-dialog";
import { Separator } from "@/components/ui/separator";

interface AddSewingMachineFormProps {
  initialData?: any | null;
  mode?: string;
}

const formSchema = z.object({
  unitName: z.string().min(1, {
    message: "Production Unit is required",
  }),
});

const AddFactoryUnits = ({
  initialData,
  mode,
}: AddSewingMachineFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitName: initialData?.name || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (mode && mode === "create") {
      try {
        const res = await axios.post("/api/unit", data);
        toast({
          title: "Factory unit created successfully",
          variant: "success",
          description: (
            <div className="mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md">
              <code className="text-slate-800">
                Unit: {res.data.data.name}
              </code>
            </div>
          ),
        });
        router.push("/factory-units");
        router.refresh();
        console.log(data);
      } catch (error: any) {
        console.error("ERROR", error);
        toast({
          title: error.response.data || "Something went wrong! Try again",
          variant: "error",
        });
      }
    } else {
      try {
        const res = await axios.put(`/api/unit/${initialData?.id}`, data);
        toast({
          title: "Unit updated successfully",
          variant: "success",
        });
        router.push("/factory-units");
        router.refresh();
        console.log(data);
      } catch (error: any) {
        console.error("ERROR", error);
        toast({
          title: error.response.data || "Something went wrong! Try again",
          variant: "error",
        });
      }
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {mode === "create" ? "Add New Factory Unit" : "Edit Factory Unit"}
              </h2>
              <p className="text-sm text-gray-600">
                {mode === "create" 
                  ? "Create a new production unit for your factory" 
                  : "Update the factory unit information"
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="unitName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Unit Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. Unit 1"
                        className="h-11 text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />

              {/* Action Buttons */}
              {mode && mode === "create" ? (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-11 text-base font-medium"
                    onClick={() => form.reset()}
                    disabled={isSubmitting}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="flex-1 h-11 text-base font-medium bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Unit...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Unit
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link href="/factory-units" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11 text-base font-medium text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="flex-1 h-11 text-base font-medium bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Building2 className="mr-2 h-4 w-4" />
                        Update Unit
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AddFactoryUnits;