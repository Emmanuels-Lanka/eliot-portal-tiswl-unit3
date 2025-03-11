"use client";

import React, { useState } from "react";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { cn } from "@/lib/utils";
import Image from "next/image";
import ROICompo from "./details-compo";

export type formDataType = 
  {
    dailyProduction: number;
    newDailyProduction: number,
    totalDailyProduction: number,
    totalNewProduction: number,
    additionalGarmentDay: number,
    additionalGarmentMonth: number,
    additionalRevenueMonth: number,
    additionalCostMonth: number,
    additionalProfitMonth: number,
    profitPerYear: number
  
}

const formSchema = z.object({
  sewingMachines: z.coerce.number().min(1, {
    message: "required",
  }),
  smv: z.coerce.number().min(1),
  operations: z.coerce.number().min(1),
  currentEfficiency: z.coerce.number().min(-1),
  workHours: z.coerce.number().min(1),
  workDays: z.coerce.number().min(1),
  price: z.coerce.number().min(1),
  cost: z.coerce.number().min(1),
  line: z.coerce.number().min(1),
  newEfficiency: z.coerce.number().min(-1),
});

const CalculatorForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sewingMachines: undefined,
      smv: undefined,
      operations: undefined,
      currentEfficiency: undefined,
      workDays: undefined,
      workHours: undefined,
      price: undefined,
      cost: undefined,
      line: 1,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const [formData,setFormData] = useState<any>()
  const [open,setOpen] = useState <Boolean> (false)


  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);

    const {
      sewingMachines,
      cost,
      currentEfficiency,
      operations,
      price,
      line,
      smv,
      workDays,
      workHours,
      newEfficiency,
    } = data;

    const production = (
      (sewingMachines * workHours * 60 * (currentEfficiency / 100)) / smv
    );
    const newProduction = (
      (sewingMachines * workHours * 60 * (newEfficiency / 100)) / smv
    );

    const extraProduction = newProduction - production;

    const additionalGarment = (extraProduction * workDays)*line;

    const additionalRevenue = additionalGarment * price;

    const additionalCost = additionalGarment * cost;

    const additionalProfit = additionalRevenue - additionalCost;

    const profitForYear = additionalProfit * 12;

    const totalDailyProduction = production* line
    const totalNewProduction = newProduction * line
    const additionalGarmentDay = totalNewProduction-totalDailyProduction
    const additionalGarmentMonth = additionalGarmentDay *workDays
    const additionalRevenueMonth = additionalGarmentMonth*price
    const additionalCostMonth = additionalGarmentMonth * cost
    const additionalProfitMonth = additionalRevenueMonth - additionalCostMonth
    const profitPerYear = additionalProfitMonth *12


    const passData:formDataType = {
      dailyProduction:production,
      newDailyProduction:newProduction,
      totalDailyProduction:totalDailyProduction,
      totalNewProduction:totalNewProduction,
      additionalGarmentDay:additionalGarmentDay,
      additionalGarmentMonth :additionalGarmentMonth,
      additionalRevenueMonth:additionalRevenueMonth,
      additionalCostMonth:additionalCostMonth,
      additionalProfitMonth:additionalProfitMonth,
      profitPerYear:profitPerYear

    }

   
    console.log(passData)
    setFormData(passData)

    // console.log(
    //   production,
    //   newProduction,
    //   extraProduction,
    //   additionalGarment,
    //   additionalRevenue,
    //   additionalCost,
    //   additionalProfit,
    //   "additionalProfit",
    //   profitForYear,
    //   "profitForYear"
    // );

    // console.log(production,"-current daily",newProduction,"-newProduction",totalDailyProduction,"-totalDailyProduction",totalNewProduction,"-totalNewProduction"
    //   ,additionalGarmentDay,"-additionalGarmentDay"
    // )
  };

  return (
    <>
      <div className="rounded-lg shadow-lg w-full h-full m-4 p-6 bg-white">
        <div className="mx-auto max-w-5xl border px-8 py-10 rounded-lg bg-slate-100">
          <Form {...form}>
            <form
              className="w-full space-y-8"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                {/* Profit */}
                <FormField
                  control={form.control}
                  name="line"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Lines</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 2"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Sewing Machines */}
                <FormField
                  control={form.control}
                  name="sewingMachines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sewing Machines</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 43"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* SMV */}
                <FormField
                  control={form.control}
                  name="smv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMV (Standard Minutes)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 1.67"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Operations */}
                <FormField
                  control={form.control}
                  name="operations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operations per Garment</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 43"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Current Efficiency */}
                <FormField
                  control={form.control}
                  name="currentEfficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Efficiency (%)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Work Hours */}
                <FormField
                  control={form.control}
                  name="workHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Hours per Day</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 8"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Work Days */}
                <FormField
                  control={form.control}
                  name="workDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Working Days per Month</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 26"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Price */}
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price per Garment ($)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Cost */}
                <FormField
                  control={form.control}
                  name="cost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost per Garment ($)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target Efficiency */}
                <FormField
                  control={form.control}
                  name="newEfficiency"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 lg:col-span-3">
                      <FormLabel>Target Efficiency (%)</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isSubmitting}
                          placeholder="e.g. 51"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
              
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white hover:bg-blue-500 rounded-lg transition"
                onClick={() => setOpen(true)}
              >
                Submit
              </button>


              </div>
            </form>
          </Form>
        </div>
      </div>
      {
        open && formData &&
        (
          <>
          <div className="absolute left-0 top-0 w-screen h-screen bg-black bg-opacity-60 z-50 flex justify-center items-center">
            <div className="bg-white p-4  rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%]"> 

           
            <div onClick={()=>{setOpen(false)}}>
              <Image
                src={"/close.png"}
                alt=""
                width={14}
                height={14}
                className="absolute top-2 right-2 cursor-pointer"

              />

              <ROICompo formData={formData}/>
            </div>
            </div>
          </div>
          </>
        )
      }
    </>
  );
};

export default CalculatorForm;
