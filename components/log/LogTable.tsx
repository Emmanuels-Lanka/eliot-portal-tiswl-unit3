"use client";
import React, { useEffect, useState } from "react";
import { getData } from "./action";
import SelectObbSheetAndDate from "../dashboard/common/select-obbsheet-and-date";
import TableComponent from "./TableComponent";

interface AnalyticsChartProps {
  obbSheets:
    | {
        id: string;
        name: string;
      }[]
    | null;
}

export type ProductionDataType = {
  name: string;
  count: number;
  target: number;
  employeeId: string;
  machineId: string;
  eliotSerialNumber: string;
  code: string;
  operationname: string;
  totprod: number;
  LoginTimestamp: string;
  LogoutTimestamp: string;
};

const LogTable = ({ obbSheets }: AnalyticsChartProps) => {
  const [date, setDate] = useState<string>("");
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const [data, setData] = useState<ProductionDataType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFetchProductions = async (data: {
    obbSheetId: string;
    date: Date;
  }) => {
    data.date.setDate(data.date.getDate() + 1);
    const formattedDate =
      data.date.toISOString().split("T")[0].toString() + "%";

    setObbSheetId(data.obbSheetId);
    setDate(formattedDate);
  };

  const getDetails = async () => {
    try {
      setIsLoading(true);
      const details = await getData(obbSheetId, date);
      setData(details);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching production data:", error);
    }
  };

  useEffect(() => {
    getDetails();
  }, [date, obbSheetId]);

  return (
    <div className="mx-auto max-w-full p-6">
      <div>
        <SelectObbSheetAndDate
          obbSheets={obbSheets}
          handleSubmit={handleFetchProductions}
        />
        <div>
          {obbSheetId && obbSheetId.length > 0 ? (
            <div className="my-8">
              <TableComponent data={data} isLoading={isLoading} />
            </div>
          ) : (
            <div className="mt-12 w-full">
              <p className="text-center text-slate-500">
                Please select style and date
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogTable;
