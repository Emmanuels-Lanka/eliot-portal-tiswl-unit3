"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import SelectObbSheetAndDate from "./unit-obb";
import BarChartGraphEfficiencyRate from "./barchart";

interface AnalyticsChartProps {
  obbSheets:
    | {
        id: string;
        name: string;
      }[]
    | null;
  title?: string;
  units: any;
}

export type newOperationEfficiencyOutputTypes = {
  data: {
    operation: {
      name: string;
      count: number | 0;
      earnMinute: number | 0;
    }[];
  }[];
  categories: string[];
  machines?: string[];
  eliot?: string[];
};

const AnalyticsChart = ({ obbSheets, units }: AnalyticsChartProps) => {
  const { toast } = useToast();
  const [filterApplied, setFilterApplied] = useState<boolean>(false);
  const [newDate, setNewDate] = useState<any>();
  const [obbSheetId, setObbSheetId] = useState<any>();

  const handleFetchProductions = async (data: {
    obbSheetId: string;
    date: Date;
  }) => {
    try {
      data.date.setDate(data.date.getDate() + 1);
      const formattedDate = data.date.toISOString().split("T")[0].toString();
      const obb = data.obbSheetId;

      setNewDate(formattedDate);

      setObbSheetId(obb);
      setFilterApplied(true);
    } catch (error: any) {
      console.error("Error fetching production data:", error);
      toast({
        title: "Something went wrong! Try again",
        variant: "error",
        description: (
          <div className="mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md">
            <code className="text-slate-800">ERROR: {error.message}</code>
          </div>
        ),
      });
    }
  };

  return (
    <div className="mx-auto max-w-full pl-6 pr-6 ">
      <div>
        <SelectObbSheetAndDate
          obbSheets={obbSheets}
          handleSubmit={handleFetchProductions}
          units={units}
        ></SelectObbSheetAndDate>
      </div>
      <div>
        {newDate && obbSheetId ? (
          <div className="mt-12">
            <BarChartGraphEfficiencyRate
              date={newDate}
              obbSheet={obbSheetId}
            ></BarChartGraphEfficiencyRate>
          </div>
        ) : (
          <div className="mt-12 w-full">
            <p className="text-center text-slate-500">
              Please select the OBB sheet and date ☝️
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
