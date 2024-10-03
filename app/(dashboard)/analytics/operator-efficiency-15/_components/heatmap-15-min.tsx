"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ObbSheet, ProductionData } from "@prisma/client";

import HeatmapChart from "@/components/dashboard/charts/heatmap-chart";
import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import { useToast } from "@/components/ui/use-toast";

import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { geOperatorList, getOperatorEfficiencyData15M } from "./actions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import  { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
// import { Button } from "@/components/ui/button";


interface AnalyticsChartProps {
    obbSheetId: string
    date: string;
}

type HourGroup = {
    [key: string]: {
        totalProduction: number;
        target: number;
        xAxis: string;
        count: number; // Count of productions
    };
}

// const options :ApexOptions =  {
//     chart: {
//       height: 350,
//       type: 'heatmap',
//     },
//     dataLabels: {
//       enabled: false
//     },
//     colors: ["#008FFB"],
//     title: {
//       text: 'HeatMap Chart (Single color)'
//     },
//   }


const xAxisLabel = "Operators"
const efficiencyLow = 5
const efficiencyHigh = 50





const ensureAllCategoriesHaveData = (series: any, categories: any, defaultValue = -1) => {
    console.log("categories", categories)
    return series.map((serie: any) => {
        const filledData = categories.map((category: any) => {
            const dataPoint = serie.data.find((d: any) => d.x === category);
            return {
                x: category,
                y: dataPoint ? dataPoint.y : defaultValue,
            };
        });
        return {
            ...serie,
            data: filledData,
        };
    });
};


const HmapChart15Compo = ({
    obbSheetId,
    date
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();


    const [heatmapData, setHeatmapData] = useState<any | null>(null);
    const [heatmapFullData, setHeatmapFullData] = useState<any | null>(null);
    const [operationList, setoperationList] = useState<any[]>([]);
    const [chartWidth, setChartWidth] = useState<number>(4000)
    const [timeList, settimeList] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const chartRef = useRef<HTMLDivElement>(null);
    const [chartData, setChartData] = useState<any>([]);



    const options = {
        chart: {
            type: 'heatmap' as const,
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
                            from: 0,
                            to: 70,
                            name: 'Low(Below 70%)',
                            color: '#ef4444'
                        },
                        {
                            from: 70,
                            to: 80,
                            name: 'Medium(70%-80%)',
                            color: '#FFAA33'
                        },
                        {
                            from: 80,
                            to: 1000,
                            name: 'High(above 80%)',
                            color: '#16a34a'
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
                    fontSize: '12px',
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
                minHeight: 300,
            },
           categories: operationList.map(o => o.name), // x-axis categories


        },

        yaxis: {
            title: {
                text: "Time",
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
                    marginBottom: '100px',
                },
                offsetY: 10,
                minheight:300,
            },
        },
        grid: {
            padding: {
                top: 0,
                right: 10,
                bottom: 10,
                left: 10,
            },
        },
    };


    const handleFetchProductions = async () => {
        try {
            setIsSubmitting(true)
            console.log("test111")
            const sqlDate = date + "%";
            const prod = await getOperatorEfficiencyData15M(obbSheetId, sqlDate)

            const opList = await geOperatorList(obbSheetId,sqlDate)
            setoperationList(opList)

            const heatmapData = getProcessData(prod as any[], operationList as any[]);
            const t = heatmapData.time
            settimeList(t as any)

            console.log("heatmapData1", heatmapData)
            setHeatmapData(heatmapData.dataSeries);
            setIsSubmitting(false)



            //setHeatmapCategories(heatmapData.xAxisCategories);
            //setObbSheet(response.data.obbSheet);


        } catch (error: any) {
            console.error("Error fetching production data:", error);
            toast({
                title: "Something went wrong! Try again",
                variant: "error",
                description: (
                    <div className='mt-2 bg-slate-200 py-2 px-3 md:w-[336px] rounded-md'>
                        <code className="text-slate-800">
                            ERROR: {error.message}
                        </code>
                    </div>
                ),
            });
        }
    }

    useEffect(() => {
        if (heatmapData?.length > 0) {
            const filledSeries = ensureAllCategoriesHaveData(heatmapData, operationList.map(o => o.name));
            setHeatmapFullData(filledSeries)
            //setHeatmapFullData(heatmapData)
        }
    }, [heatmapData])

    useEffect(() => {
        handleFetchProductions()

    }, [obbSheetId, date])

    //const height: string = timeList.length < 21 ? '200%' : timeList.length < 30 ? '300%' : '500%';
    // const totalCount = Object.keys(timeList).reduce((acc, curr) => acc + curr.length, 0);
    // const height: string = totalCount < 21 ? '200%' : totalCount < 30 ? '300%' : '500%';


    const saveAsPDF = async () => {
        if (chartRef.current) {
          // Get the SVG from the ApexChart
          const svg = chartRef.current.querySelector("svg");
          
          if (!svg) {
            console.error("SVG not found");
            return;
          }
      
          // Create a canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
      
          // Set the canvas dimensions
          const svgRect = svg.getBoundingClientRect();
          canvas.width = svgRect.width;
          canvas.height = svgRect.height;
      
          // Create an image from the SVG data
          const svgData = new XMLSerializer().serializeToString(svg);
          const img = new Image();
          img.src = "data:image/svg+xml;base64," + window.btoa(svgData);
      
          img.onload = () => {
            context?.drawImage(img, 0, 0);
      
            // Convert the canvas to an image
            const imgData = canvas.toDataURL("image/png");
      
            // Initialize jsPDF
            const pdf = new jsPDF({
              orientation: "landscape",
              unit: "px",
              format: [canvas.width, canvas.height + 150],
            });
      
            // Add the image to the PDF
            pdf.addImage(imgData, "PNG", 0, 150, canvas.width, canvas.height);

             const baseUrl = window.location.origin;
          const logoUrl = `${baseUrl}/logo.png`;
      
         const logo = new Image();
      logo.src = logoUrl;
    // //       logo.onload = () => {
             const logoWidth = 110; 
             const logoHeight = 50;
             const logoX = (canvas.width / 2) - (logoWidth + 250); // Adjust to place the logo before the text
             const logoY = 50;
      
    // //         // Add the logo to the PDF
          pdf.addImage(logo, 'PNG', logoX, logoY, logoWidth, logoHeight);
      
    // //         // Set text color to blue
         pdf.setTextColor(0, 113 ,193); // RGB for blue
      
    // //         // Set larger font size and align text with the logo
            pdf.setFontSize(30);
            pdf.text('Dashboard - Operation Efficiency (60) ', logoX + logoWidth + 10, 83, { align: 'left' });
      
    // //         // Add the chart image to the PDF
             pdf.addImage(imgData, 'PNG', 0, 150, canvas.width, canvas.height);
      
            // Add your title or logo here, as you did before
      
            // Save the PDF
            pdf.save("chart.pdf");
          };
        }
      };
      const saveAsExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(chartData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Chart Data");
        XLSX.writeFile(workbook, `chart-data.xlsx`);
    };


let timeSlots = heatmapData ? heatmapData.length : 0;
let operatorCount = operationList ? operationList.length : 0;

let heights = timeSlots < 15 ? 1300 : timeSlots * 50; // Adjust height based on time slots
// let width = operatorCount > 15 ? operatorCount * 40 : "100%";


let height;
if (heatmapData) {
    if (heatmapData.length > 30) {
      height = heatmapData.length * 50
    } else if (heatmapData.length > 20) {
      height = heatmapData.length * 50
    } else { 
      height = heatmapData.length * 55
    }
  }
const width = operationList && operationList.length > 0 ? operationList.length * 50 : 600;






    // let width = heatmapData && heatmapData?.length > 15  ? 3000 :  100+"%"; 
    // let height = heatmapData && heatmapData?.length < 15  ?  900 : 1500;

    return (
        <>





            <div className="mx-auto max-w-[1680px]">
                {<div className=" flex justify-center items-center">
                    <Loader2 className={cn("animate-spin w-5 h-5 hidden", isSubmitting && "flex")} />
                </div>}

                {heatmapFullData !== null ?
                    // <div className="mt-12 bg-slate-100 pt-5 pl-8 rounded-lg border w-full mb-16 overflow-x-auto ">
                    <div className='bg-slate-50 pt-5 -pl-8 rounded-lg border w-full h-[400px] mb-16 overflow-scroll'>

                        <h2 className="text-lg mb-2 font-medium text-slate-700">{" "}</h2>
                        <div id="chart"  ref={chartRef}>
                        <ReactApexChart options={options} series={heatmapFullData} type="heatmap" height={height} width={width} />
                        </div>
                    </div>
                    
                    :
                    <div className="mt-12 w-full">
                        <p className="text-center text-slate-500">No data Available</p>
                    </div>

                    

                    
                }
                
                   
                
                {
                    <div className="flex flex-col items-center mt-5">
                    <div className="flex gap-3 mt-3">
                    <Button type="button" className="mr-3" onClick={saveAsPDF}>
                      Save as PDF
                    </Button>
                    <Button type="button" onClick={saveAsExcel}>
                      Save as Excel
                    </Button>
                  </div>
                    </div>
                }
            </div>
        </>
    )
}

export default HmapChart15Compo;


const getTimeSlotLabel = (hr: number, qtrIndex: number) => {
    let res: string = ""
    hr = hr ?? 0
    let qtrStartLabel = (qtrIndex * 15).toString().padStart(2, "0")
    let hrStartLabel = hr.toString()
    let qtrEndLabel = qtrIndex != 3 ? ((qtrIndex + 1) * 15).toString().padStart(2, "0") : "00"
    let hrEndLabel = qtrIndex == 3 ? (hr + 1).toString() : hr.toString()

    res = `${hrStartLabel}:${qtrStartLabel}- ${hrEndLabel}:${qtrEndLabel}`
    // console.log("aaaaa",res)
    return res


}


const getProcessData = (data: any[], operationList: any[]) => {
    // console.log("aaaaasssss",data)
    const fmtDataSeries = []
    const dataWithQuarter = data.map((d) => (
        {
            ...d, hour: new Date(d.timestamp).getHours(),
            qtrIndex: Math.floor(new Date(d.timestamp).getMinutes() / 15)
        }
    )
    )

    //   const result = Object.groupBy(dataWithQuarter, (d) => d.hour.toString() + d.qtrIndex.toString());
    const result = Object.groupBy(dataWithQuarter, (d) => getTimeSlotLabel(d.hour, d.qtrIndex));
    console.log(result)

    let rc = 0
    for (const [key, value] of Object.entries(result)) {

        const dataGBOp = Object.groupBy(value || [], (d) => d.name);
        // console.log("abc",dataGBOp)
        const dataPoints = []
        for (const [key1, value1] of Object.entries(dataGBOp)) {
            const target = value1?.[0].target ?? 1;


            const v = value1?.reduce((a, d) => {

                return a + (d?.count ?? 0)
            }, 0)

            //   console.log("vqw", v)

            dataPoints.push({ x: key1, y: ((v / (target / 4)) * 100).toFixed(0) ?? 0 })
            rc += v

        }

        //fill unavailble timeslots



        fmtDataSeries.push({ name: key, data: dataPoints })


    }
 



    return { dataSeries: fmtDataSeries, time: result }


}




 
//      const fmtDataSeries = [];
//      const dataWithQuarter = data.map((d) => ({
//          ...d,
//          hour: new Date(d.timestamp).getHours(),
//          qtrIndex: Math.floor(new Date(d.timestamp).getMinutes() / 15),
//      }));

//      const result = Object.entries(
//          dataWithQuarter.reduce((acc, current) => {
//              const key = `${current.hour}${current.qtrIndex}`;
//              if (!acc[key]) {
//                  acc[key] = [];
//              }
//              acc[key].push(current);
//              return acc;
//          }, {})
//      );

//      for (const [key, value] of result) {
//          const dataGBOp = Object.entries(
//              value.reduce((acc, current) => {
//                  if (!acc[current.name]) {
//                      acc[current.name] = [];
//                  }
//                  acc[current.name].push(current);
//                  return acc;
//              }, {})
//          );

//          const dataPoints = [];
//          for (const [name, values] of dataGBOp) {
//              const count = values.reduce((a, d) => a + d.count, 0);
//              dataPoints.push({ x: name, y: count });
//          }
//          fmtDataSeries.push({ name: key, data: dataPoints });
//      }

//      console.log("dataaaaaa", fmtDataSeries);

//      return fmtDataSeries;
//  };