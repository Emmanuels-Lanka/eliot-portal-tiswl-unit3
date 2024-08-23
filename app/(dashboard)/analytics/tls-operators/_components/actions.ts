"use server";
import { neon } from "@neondatabase/serverless";


export async function   getDHUData(obbsheetid:string,date:string) :Promise<any[]>   {
    const sql = neon(process.env.DATABASE_URL2 || "");

    //console.log("dara",obbsheetid,"",date)
    const dataGmts = await sql`select count(*) as count ,"qcStatus" qc, "operatorName" as name from "GmtDefect"
    WHERE "qcStatus" <> 'pass' AND "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}
    group by "operatorName","qcStatus";`;
    console.log("data fetched1",dataGmts)
    const dataProducts = await sql`select count(*) as count ,"qcStatus" qc, "operatorName" as name 
    from "ProductDefect"
    WHERE "qcStatus" <> 'pass' AND "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}
    group by "operatorName","qcStatus";`;
    console.log("data fetched2",dataProducts)
    console.log("length1",dataProducts.length)

    const tc = await sql`select count(*) as count from "GmtDefect"
    WHERE "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}`;

    const tcProducts = await sql`select count(*) as count from "ProductDefect"
    WHERE "obbSheetId"= ${obbsheetid} AND timestamp LIKE ${date}`;

    // console.log("data fetched",data)
    console.log("Row Count",tc)
    const count  : number = Number(tc?.[0]?.count) ?? 1
    const countP  : number = Number(tcProducts?.[0]?.count) ?? 1

    //make 2 arrays in to one
    
    const updatedGmtDfcts :any[] = []
    
    for(const gmtdfct of dataGmts){
        const tmpIndex = dataProducts.findIndex(p=> p.name == gmtdfct.name)
      
        if(tmpIndex !=-1){
            const tmp = dataProducts[tmpIndex]
            console.log("tmp",tmp)
            updatedGmtDfcts.push({...gmtdfct,count:tmp.count + gmtdfct.count,})
            dataProducts.splice(tmpIndex,1)
        }else{
            updatedGmtDfcts.push( gmtdfct )
        }



    }
   
    console.log("length2",dataProducts.length)

    for(const prdDfct of dataProducts){
        updatedGmtDfcts.push(prdDfct)
    }



    const res= updatedGmtDfcts.map((d)=>(
        {
            ...d,count:(d.count/(count + countP))*100
        }
    ))



 
    return new Promise((resolve) => resolve(res  ))
}