"use client"

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { EfficiencyChart } from "./efficiency-chart";

interface AnalyticsChartProps {
  obbSheets: {
    id: string;
    name: string;
  }[] | null;
}

export const EfficiencyAnalyticsChart = ({ obbSheets }: AnalyticsChartProps) => {
  const { toast } = useToast();
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [filterApplied, setFilterApplied] = useState(false);

  const handleSubmit = async (data: { obbSheetId: string; date: Date }) => {
    try {
      const year = data.date.getFullYear();
      const month = (data.date.getMonth() + 1).toString().padStart(2, "0");
      const day = data.date.getDate().toString().padStart(2, "0");
      
      setObbSheetId(data.obbSheetId);
      setDate(`${year}-${month}-${day}`);
      setFilterApplied(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply filters",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-7xl">
        <SelectObbSheetAndDate 
          obbSheets={obbSheets}
          handleSubmit={handleSubmit}
        />
      </div>

      <div className="mx-auto max-w-[1680px]">
        {obbSheetId ? (
          <EfficiencyChart 
            obbSheetId={obbSheetId}
            date={date}
          />
        ) : (
          <div className="mt-12 w-full">
            <p className="text-center text-slate-500">
              {filterApplied ? "No data available." : "Please select OBB Sheet and date"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
