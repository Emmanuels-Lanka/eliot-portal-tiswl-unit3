"use client";
import React, { useEffect, useState } from "react";
import SelectObbSheetAndDate from "./select-obb";
import { toast } from "@/components/ui/use-toast";
import GraphCompo from "./graph";

export type AnalyticsChartProps = {
  obbSheets:
    | {
        id: string;
        name: string;
      }[]
    | null;
  units:
    | {
        id: string;
        name: string;
      }[]
    | null;
};

const AnalyticsCompo = ({ obbSheets, units }: AnalyticsChartProps) => {
  const [newDate, setNewDate] = useState<any>();
  const [obbSheetId, setObbSheetId] = useState<any>();
  const [userMessage, setUserMessage] = useState<string>(
    "Please select style and date ☝️"
  );
  const [filterApplied, setFilterApplied] = useState<boolean>(false);

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

      console.log(data);
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
  useEffect(() => {
    if (filterApplied) {
      setUserMessage("No data available....");
    }
  }, [filterApplied]);

  return (
    <div className="mx-auto max-w-full pl-6 pr-6">
      <div>
        <SelectObbSheetAndDate
          handleSubmit={handleFetchProductions}
          obbSheets={obbSheets}
          units={units}
        ></SelectObbSheetAndDate>
        <div>
          {obbSheetId && obbSheetId.length > 0 ? (
            <div className="my-8">
              <GraphCompo date={newDate} obbSheet={obbSheetId}></GraphCompo>
            </div>
          ) : (
            <div className="mt-12 w-full">
              <p className="text-center text-slate-500">{userMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCompo;
