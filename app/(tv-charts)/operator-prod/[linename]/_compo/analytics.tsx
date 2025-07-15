"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet } from "@prisma/client";
import { parseISO, getHours } from "date-fns";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";

import { fetchDirectProductionData } from "@/actions/efficiency-direct-action";
import { getLinebyOS } from "@/components/tv-charts/achievement-rate-operation/actions";
import EffiencyHeatmap from "./heatmap";
import Image from "next/image";
// import EffiencyHeatmap from "@/components/dashboard/charts/efficiency-heatmap";

type ProductionDataForChartTypes = {
  id: string;
  operatorRfid: string;
  eliotSerialNumber: string;
  obbOperationId: string;
  productionCount: number;
  totalPcs: number;
  timestamp: string;
  createdAt: Date;
  operator: {
    name: string;
    employeeId: string;
    rfid: string;
  };

  obbOperation: {
    id: string;
    seqNo: number;
    target: number;
    smv: number;
    part: string;
    operation: {
      name: string;
    };
    sewingMachine: {
      machineId: string;
    };
  };
  data: {};
};

interface AnalyticsChartProps {
  obbSheetId: string;
}

type EfficiencyResult = {
  data: {
    hourGroup: string;
    operation: {
      name: string;
      efficiency: number | null;
    }[];
  }[];
  categories: string[];
};

const AnalyticsChart = ({ obbSheetId }: AnalyticsChartProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [heatmapData, setHeatmapData] =
    useState<OperationEfficiencyOutputTypes>();
  const [obbSheet, setObbSheet] = useState<ObbSheet | null>(null);
  const [isNew, setIsNew] = useState<boolean>(true);
  const [obbId, setObbId] = useState<string>("");
  const [lineName, setLineName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [date, setDate] = useState<string>("");

  const fetchObbSheetId = async () => {
    try {
      //   const id = await getObbSheetID(linename);
      const line = await getLinebyOS(obbSheetId);
      if (line) {
        setObbId(obbSheetId);
        setLineName(line);
        setDate(getFormattedDate());
      }
    } catch (error) {
      console.error("Error fetching OBB Sheet ID:", error);
      toast({
        title: "Error fetching OBB Sheet ID",
        variant: "destructive",
      });
    }
  };

  const getFormattedDate = () => {
    const today = new Date();
    return (
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(today.getDate()).padStart(2, "0")
    );
  };

 useEffect(() => {
        fetchObbSheetId();
      }, [obbSheetId]);
    
      useEffect(() => {
        if (obbSheetId && date) {
          handleFetchProductions();
          const intervalId = setInterval(handleFetchProductions, 5 * 60 * 1000);
          return () => clearInterval(intervalId);
        }
      }, [obbSheetId, date,obbId]);

  function processProductionData(
    productionData: ProductionDataForChartTypes[],
    state: boolean
  ): OperationEfficiencyOutputTypes {

    const hourGroups = [
      "7:00 AM - 8:00 AM",
      "8:00 AM - 9:00 AM",
      "9:00 AM - 10:00 AM",
      "10:00 AM - 11:00 AM",
      "11:00 AM - 12:00 PM",
      "12:00 PM - 1:00 PM",
      "1:00 PM - 2:00 PM",
      "2:00 PM - 3:00 PM",
      "3:00 PM - 4:00 PM",
      "4:00 PM - 5:00 PM",
      "5:00 PM - 6:00 PM",
      "6:00 PM - 7:00 PM",
      "7:00 PM - 8:00 PM",
    ];

    // const getHourGroup = (timestamp: string): string => {
    //     const hour = new Date(timestamp).getHours();
    //     return hourGroups[Math.max(0, Math.min(11, hour - 7))];
    // };

    const getHourGroup = (timestamp: string): string => {
      const date = new Date(timestamp);
      const hour = date.getHours();
      const minutes = date.getMinutes();
      if (minutes >= 5) {
        return hourGroups[Math.max(0, Math.min(11, hour - 7))];
      } else {
        // If minutes are less than 5, group it to the previous hour group
        return hourGroups[Math.max(0, Math.min(11, hour - 8))];
      }
      // const hour = new Date(timestamp).getHours();
      // return hourGroups[Math.max(0, Math.min(11, hour - 7))];
    };

    const operationsMap: { [key: string]: any[] } = {};
    productionData.forEach((data) => {
      const operationId = data.obbOperation?.id;
      const operatorId = data.operator?.employeeId;
      const key = `${operationId}_${operatorId}`;
      if (!operationsMap[key]) {
        operationsMap[key] = [];
      }
      operationsMap[key].push(data);
    });

    // Grouped by operator and operation
    const operations = Object.values(operationsMap)
      .map((group) => ({
        obbOperation: group[0].obbOperation,
        operator: group[0].operator,
        data: group,
      }))
      .sort((a, b) => a.obbOperation.seqNo - b.obbOperation.seqNo);

    console.log("op", operations);

    const formattedDataRaw = operations.map((o) => {
      return {
        operation: o.obbOperation.operation.name,
        operator: o.operator.name,
        operatorId: o.operator.rfid,
        machine: o.obbOperation.sewingMachine.machineId,
        seqNo: o.obbOperation.seqNo,
        eliotSerialNumber: o.data[0].eliotSerialNumber,
        data: o,
      };
    });

    // Step 2: Count how many times each operator appears
    const operatorCountMap: { [key: string]: number } = {};
    formattedDataRaw.forEach((item) => {
      operatorCountMap[item.operator] =
        (operatorCountMap[item.operator] || 0) + 1;
    });

    const formattedData = formattedDataRaw
      .map((item) => ({
        ...item,
        operatorOperation:
          operatorCountMap[item.operator] > 1
            ? `${item.operation} - ${item.operator} 📌 ` // mark multi-ops
            : `${item.operation} - ${item.operator}`,
      }))
      .sort((a, b) => {
        const nameCompare = a.operator.localeCompare(b.operator);
        if (nameCompare !== 0) return nameCompare;
        return a.seqNo - b.seqNo;
      });

    console.log("for", formattedData);

    // const categories = operations.map(op => `${op.obbOperation.operation.name}-${op.obbOperation.seqNo}`);
    const categories = formattedData.map((op) => `${op.operatorOperation}`);
    const machines = formattedData.map(
      (op) =>
        ` ${
          op.data.obbOperation?.sewingMachine?.machineId || "Unknown Machine ID"
        }`
    );
    const eliot = formattedData.map(
      (op) => ` ${op.data.data[0].eliotSerialNumber}`
    );
    const resultData = hourGroups.map((hourGroup) => ({
      hourGroup,
      operation: formattedData.map((op) => {
        const filteredData = op.data.data.filter(
          (data) => getHourGroup(data.timestamp) === hourGroup
        );

        let prod: number;
        if (!state) {
          prod = filteredData.reduce(
            (sum, curr) => sum + curr.productionCount,
            0
          );
        } else {
          if (filteredData.length === 0)
            return {
              name: op.data.obbOperation.operation.name,
              efficiency: null,
            };
          const lastProduction = filteredData[0].totalPcs;
          const currentHourIndex = hourGroups.indexOf(hourGroup);
          let previousHourData: number = 0;

          if (currentHourIndex > 0) {
            // Iterate backward to find the nearest previous hour with data
            for (let i = currentHourIndex - 1; i >= 0; i--) {
              const previousHourGroup = hourGroups[i];

              // Filter data for the previous valid hour group
              const filteredPreviousData = op.data.data.filter(
                (data) => getHourGroup(data.timestamp) === previousHourGroup
              );

              if (filteredPreviousData.length > 0) {
                previousHourData = filteredPreviousData[0].totalPcs;
                break; // Stop looping once a valid previous hour is found
              }
            }
          }
          // const lastHourProd =
          prod = lastProduction - previousHourData;
        }

        const totalProduction = prod;
        // const earnmins = op.obbOperation.smv * totalProduction
        // const efficiency = filteredData.length > 0 ? (totalProduction === 0 ? 0 : (earnmins / 60) * 100) : null;

        return {
          name: `${op.operatorOperation}`,
          efficiency:
            totalProduction !== null
              ? parseFloat(totalProduction.toFixed(1))
              : null,
        };
      }),
    }));

    return {
      data: resultData,
      categories,
      machines,
      eliot,
    };
  }
  useEffect(() => {
    console.log(isNew);
  }, [isNew]);

  const handleFetchProductions = async () => {
     if (!obbSheetId || !date) return;
    try {
     setIsLoading(true); 

       let response :any
                              let state = true
                             
                              // response = await axios.get(`/api/efficiency-direct?obbSheetId=${data.obbSheetId}&date=${formattedDate}`);
                               response  = await fetchDirectProductionData(obbSheetId, date);
                  
                              if(response.data.length !== 0){
                                  const heatmapData = processProductionData(response.data,state);
                              
                              setHeatmapData(heatmapData);
                              setObbSheet(response.data.obbSheet);
                              }
                              else{
                                  toast({
                      title: "That Obb Sheet Doesnt Have Any Data for That Date",
                      variant: "error",
                      description: (
                          <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                              <code className="text-slate-800">
                                  ERROR: {"No Data Available"}
                              </code>
                          </div>
                      ),
                  });
                                  
                              }
      router.refresh();
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
    }finally{
          setIsLoading(false);
    }
  };

  return (
    <>
    

    <div className="h-screen  w-screen flex flex-col ">
          {/* Header Section */}
            <div className="flex justify-center items-center gap-3 w-full py-4">
              
                <div>
                
                <Image
                                src="/eliot-logo.png"
                                alt='logo'
                                width={200}
                                height={200}
                                className='py-0'
                            />
                
                    </div>


              <h1 className="text-[#0071c1] text-3xl text-center">
                Dashboard - Hourly Production (Operator) TV Graph - {lineName}
              </h1>
            </div>

          {/* Heatmap Section */}
          <div className="flex w-screen mx-4 justify-center items-center min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center w-full h-[600px]">
            <span className="text-2xl text-[#0071c1] font-semibold mb-4">Loading...</span>
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-[#0071c1]"></div>
          </div>
        ) : heatmapData ? (
          <EffiencyHeatmap
            xAxisLabel="Operations"
            height={1200}
            efficiencyLow={obbSheet?.efficiencyLevel1}
            efficiencyHigh={obbSheet?.efficiencyLevel3}
            heatmapData={heatmapData}
          />
        ) : (
          <span className="text-lg text-gray-500">
            No Layout for Line {lineName} - {date}
          </span>
        )}
      </div>
        </div>

</>
    
  );
};

export default AnalyticsChart;
