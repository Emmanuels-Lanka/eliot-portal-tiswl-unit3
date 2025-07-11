"use client"
import { useEffect, useState } from "react";
 
 
import { Cog } from "lucide-react";
import { getObbSheetID } from "@/components/tv-charts/achievement-rate-operation/actions";
import BarChartGraphEfficiencyRate from "@/app/(dashboard)/analytics/efficiency-rate/_components/bar-chart-graph";
import { fetchDirectProductionData } from "@/actions/efficiency-direct-action";
import { finalDataTypes } from "@/app/(dashboard)/analytics/efficiency-rate/_components/analytics-chart";
//import HmapChart15Compo from "@/app/(dashboard)/analytics/operation-efficiency-15/_components/heatmap-15-min";
//import HmapChart15Compo from "@/app/(dashboard)/analytics/operation-efficiency-15/_components/heatmap-15-min";
// import HmapChart15Compo from "@/app/(dashboard)/analytics/operator-efficiency-15/_components/heatmap-15-min";


const Hmap15CompoOperation = ({ linename }: { linename: string }) => {

  const [obbSheetId, setobbSheetId] = useState<string>("")
  const [date, setdate] = useState<string>("")
    const[finalData,setFinalData]=useState<finalDataTypes[]>([])

  const getObbSheetID1 = async () => {

    setobbSheetId(linename)

    const y = new Date().getFullYear().toString()
    const m = (new Date().getMonth() + 1).toString().padStart(2, "0")
    //const d = new Date().getDate().toString().padStart(2, "0")
    const today = new Date();
    const yyyyMMdd = today.getFullYear() + '-' + (today.getMonth() + 1).toString().padStart(2, '0') + '-' + today.getDate().toString().padStart(2, '0');
  
   const date =  yyyyMMdd.toString()
    setdate(date)



    const dataa = await fetchDirectProductionData(linename,date)
   
    processData(dataa.data)
  }

 

    const processData = (productionData: any[]) => {
    
             const operationsMap: { [key: string]: any[] } = {};
            productionData.forEach(data => {
                if (!operationsMap[data.obbOperation?.id]) {
                    operationsMap[data.obbOperation?.id] = [];
                }
                operationsMap[data.obbOperation?.id].push(data);
            });
    
            const operations = Object.values(operationsMap).map(group => ({
                obbOperation: group[0].obbOperation,
                
                data: group
            })).sort((a, b) => a.obbOperation.seqNo - b.obbOperation.seqNo);
    
            console.log(operations)

            const formattedData = operations.map((o)=>{
               const log =  o.data[0].operator.operatorSessions?.find((s:any)=>s.obbOperationId === o.obbOperation.id )?.LoginTimestamp
               const loginTime = new Date(log);
               const  lastProductionTime = o.data[0].timestamp;
               const lastTime = new Date(lastProductionTime)
               let timeDiffMinutes = (lastTime.getTime() - loginTime.getTime()) / (1000 * 60);
               let is2Passed :boolean = false
                  let isLoggedBfr2 :boolean =false
               if (
                 lastTime.getHours() > 14 ||
                 (lastTime.getHours() === 14 && lastTime.getMinutes() >= 5)
               ) {
                 if (
                   loginTime.getHours() < 14 ||
                   (loginTime.getHours() === 14 && loginTime.getMinutes() < 5)
                 ) {
                   timeDiffMinutes -= 60;
                   isLoggedBfr2 = true;
                 }
                 is2Passed = true;
               }


                const smv = o.obbOperation.smv
                const lastProd = o.data[0].totalPcs
                const earnMins = smv* lastProd
                const efficiency = timeDiffMinutes > 0  ? Math.max(Math.min((earnMins * 100) / timeDiffMinutes, 100), 0)  : 0
                return{
                    operation: o.data[0].obbOperation.seqNo+"-"+o.obbOperation.operation.name,
                    operator:o.data[0].operator.name,
                    
                    efficiency : Number(Math.round(efficiency))
                }
            })

            console.log(formattedData,"fd")
            setFinalData(formattedData)
            
          }



  useEffect(() => {
     
    getObbSheetID1()
  }, [linename])


  return (
    <div className="h-[200]">
      <div className='flex justify-center items-center gap-3'>
        <Cog className='w-7 h-7 text-voilet' />
        <h1 className='text-slate-500 m-4 text-3xl'>ELIoT Web Portal - Overall Operation Efficiency {linename}</h1>
      </div>

      {obbSheetId.length > 0 ? <BarChartGraphEfficiencyRate
        obbSheetId={obbSheetId}
        date={date}
        finalData={finalData}
      /> : <span>No Layout for Line {linename} - {date}</span>}
    </div>
  )
}
export default Hmap15CompoOperation;