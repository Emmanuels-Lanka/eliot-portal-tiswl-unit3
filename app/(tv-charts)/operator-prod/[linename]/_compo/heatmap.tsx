import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import  { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface EffiencyHeatmapProps {
    xAxisLabel: string;
    height: number;
    efficiencyLow?: number;
    efficiencyHigh?: number;
    heatmapData: OperationEfficiencyOutputTypes;
}

const EffiencyHeatmap = ({
    xAxisLabel,
    efficiencyLow = 70,
    efficiencyHigh = 80,
    heatmapData
}: EffiencyHeatmapProps) => {
    const categories = heatmapData.categories || [];
    const machines= heatmapData.machines|| [];
    const eliot = heatmapData.eliot || [];

    let series: { name: string; data: (number | null)[] }[] = heatmapData.data.map(hourGroup => ({
        name: hourGroup.hourGroup,
        data: hourGroup.operation.map(op => op.efficiency === null ? -1 : op.efficiency)
    }));

    const chartRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<any>([]);
    const [chartWidth, setChartWidth] = useState<number>(1800);


    const exportToCSV = () => {
      // Create an object where each key is a category (row) and contains an object with hour groups as columns
      const transposedData = categories.reduce((acc, category, categoryIndex) => {
        acc[category] = {
            Category: category,
            'Machine ID': machines[categoryIndex] || '',  // Add Machine ID column
            'Eliot ID': eliot[categoryIndex] || '',  // Add Machine ID column
            ...series.reduce((hourAcc, serie) => {
                hourAcc[serie.name] = serie.data[categoryIndex];
                return hourAcc;
            }, {} as Record<string, number | null>)
        };
        return acc;
    }, {} as Record<string, any>); 

      // Convert the object to an array for XLSX
      const csvData = Object.values(transposedData);

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "HeatmapData");
      
      // Save file
      XLSX.writeFile(wb, "heatmap-data.csv");
  };
    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        tooltip: {
          custom: function({ series, seriesIndex, dataPointIndex ,w }:{series:any, seriesIndex:any, dataPointIndex:any,w:any}) {

              const value = series[seriesIndex][dataPointIndex];
              const category = w.globals.categoryLabels[dataPointIndex];
              const eliotDevice = value.eliotid;
              return `<div style="padding: 10px; color: #000; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(5px);">
                       
                      
                        <strong>Machine Id: </strong> ${heatmapData.machines && heatmapData.machines[dataPointIndex]} <br/>
                        <strong>Sewing Id: </strong> ${heatmapData.eliot && heatmapData.eliot[dataPointIndex]} <br/>
                        
                      
                
                         
                      </div>`;
            },
        },
        plotOptions: {
            heatmap: {
                 distributed: true,
          enableShades: false,
          radius: 50,
          useFillColorAsStroke: true,
                colorScale: {
                    ranges: [
                        {
                            from: -10,
                            to: 0,
                            name: 'No Data',
                            color: '#FFFFFF'
                        },
                        {
                            from: 1,
                            to: 50000,
                            name: 'Nuber of Products',
                            color: '#0171c1'
                        },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff']
            }
        },
        stroke: {
            width: 0,
        },
        xaxis: {
            title: {
                text: xAxisLabel,
                style: {
                    color: '#0070c0',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                    
                }
            },
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                }, rotate: -90,
                minHeight:400,
            },
            categories: categories,
        
           
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
        },
    };

   



    const totalCount = series.length;
    const height = totalCount < 50 ? '600%' : totalCount < 60 ? '700%' : '600%';


    


    const getChartWidth = () => {
      if (!heatmapData?.categories?.length) return 1000; // Default if no data
      
      const minWidth = 600;  // Minimum width (for 1-2 categories)
      const maxWidth = 2000; // Maximum width (to prevent overflow)
      const baseWidthPerCategory = 60; // Base width per category
      
      // Calculate width, but clamp between min and max
      const calculatedWidth = heatmapData.categories.length * baseWidthPerCategory;
      
      return Math.min(Math.max(calculatedWidth, minWidth), maxWidth);
    };
    
    const width = getChartWidth();
    return (
        <div className="mx-auto max-w-full h-full w-full">
            <div id="chart" ref={chartRef} className='w-full'>
<p className="text-md text-gray-500 italic mx-6">📌 indicates operator has multiple operations</p>

                <ReactApexChart 
                    options={options} 
                    series={series} 
                    type="heatmap" 
                    height={height}
                    width={chartWidth}
                />
            </div>
        {/* Button Section */}
 {true && (
      <div className="flex flex-col items-center mt-5">
        {/* <div className="flex gap-2">
          <Button onClick={() => setChartWidth((p) => p + 20)} className="rounded-full bg-gray-300">
            +
          </Button>
          <Button onClick={() => setChartWidth((p) => p - 20)} className="rounded-full bg-gray-300">
            -
          </Button>
        </div> */}

        {/* <div className="flex gap-3 mt-3">
          <Button type="button" className="mr-3" onClick={saveAsPDF}>
            Save as PDF
          </Button>
          <Button type="button" onClick={exportToCSV}>
            Save as Excel
          </Button>
        </div> */}
      </div>
    )}
                    </div>
        
        
    )
}

export default EffiencyHeatmap