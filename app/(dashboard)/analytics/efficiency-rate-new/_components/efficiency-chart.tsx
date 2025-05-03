"use client"

import { useEffect, useState } from "react";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';

interface EfficiencyData {
  operation_name: string;
  efficiency: number;
  operation_id: string;
  seqNo : string;
}

interface EfficiencyChartProps {
  obbSheetId: string;
  date: string;
}

export const EfficiencyChart = ({ obbSheetId, date }: EfficiencyChartProps) => {
  const [data, setData] = useState<EfficiencyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch data from API endpoint instead of direct Prisma call
        const response = await fetch(
          `/api/efficiency-rate?obbSheetId=${encodeURIComponent(obbSheetId)}&date=${encodeURIComponent(date)}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        // Type validation and transformation
        if (Array.isArray(result)) {
          const typedData = result.map(item => ({
            operation_name: String(item.operation_name),
            efficiency: Number(item.efficiency),
            operation_id: String(item.operation_id),
            seqNo: item.seqNo
          }));
          setData(typedData);
        } else {
          throw new Error("Invalid data format received from API");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load efficiency data. Please try again.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    if (obbSheetId && date) {
      fetchData();
      
      // Set up refresh every minute
      const interval = setInterval(fetchData, 60000);
      return () => clearInterval(interval);
    } else {
      setData([]);
      setLoading(false);
    }
  }, [obbSheetId, date]);

  const saveAsPDF = async () => {
    if (chartRef.current) {
      try {
        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('/eliot-logo.png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), 0);
        pdf.save('Overall Operation Efficiency Chart.pdf');
      } catch (err) {
        console.error("Failed to generate PDF:", err);
        alert("Failed to generate PDF. Please try again.");
      }
    }
  };

  const saveAsExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Efficiency Data");
      XLSX.writeFile(workbook, `efficiency-data-${new Date().toISOString()}.xlsx`);
    } catch (err) {
      console.error("Failed to generate Excel:", err);
      alert("Failed to generate Excel file. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      {loading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {!loading && !error && data.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No Overall Operation Efficiency data available for the selected date
        </div>
      )}

      {!loading && data.length > 0 && (
        <>
          <Card ref={chartRef}>
            <CardHeader>
              <CardTitle>Overall Operation Efficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={(entry) =>
                        `${entry.operation_name} (${entry.seqNo})`
                      }
                      angle={-90}
                      textAnchor="end"
                      height={70}
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    {/* <XAxis 
                      dataKey="operation_name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70}
                      tick={{ fontSize: 12 }}
                    /> */}
                    <YAxis
                      domain={[0, 100]}
                      label={{
                        value: "Efficiency (%)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`, "Efficiency"]}
                      labelFormatter={(label) => `Operation: ${label}`}
                    />
                    <Legend />
                    <Bar
                      dataKey="efficiency"
                      name="Efficiency"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={saveAsPDF} variant="outline">
              Export as PDF
            </Button>
            <Button onClick={saveAsExcel} variant="outline">
              Export as Excel
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

