import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { TablePropType } from "./barchart"


  export interface TableProps {
    tableProp: TablePropType[];
}
export function TableDemo({ tableProp }: TableProps) {




    console.log("td",tableProp)
    return (
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>SeqNo</TableHead>
            <TableHead>Available Hours</TableHead>
            <TableHead>Prodution Standard Hours </TableHead>
            <TableHead>Off Stand Hours </TableHead>
            <TableHead>Overall Efficiency </TableHead>
            <TableHead>On Stand Efficiency </TableHead>
            {/* <TableHead className="text-right">Amount</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableProp.map((invoice,index) => (
            <TableRow key={index}>
              
              <TableCell className="font-medium">{invoice.operator}</TableCell>
              <TableCell className="text-right">{invoice.seqNo}</TableCell>

              <TableCell className="text-right">{invoice.availableHours}</TableCell>
              <TableCell className="text-right">{invoice.stdHours}</TableCell>
              <TableCell className="text-right">{invoice.offStand}</TableCell>
              <TableCell className="text-right">{invoice.ovlEff}</TableCell>
              <TableCell className="text-right">{invoice.onStndEff}</TableCell>
              {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
        
          <TableRow >
            <TableCell colSpan={2} >Line Efficiency</TableCell>
            <TableCell className="text-right">{tableProp.reduce((a,b)=>a+b.availableHours,0).toFixed(1)}</TableCell>
            <TableCell className="text-right">{tableProp.reduce((a,b)=>a+b.stdHours,0).toFixed(1)}</TableCell>
            <TableCell className="text-right">{tableProp.reduce((a,b)=>a+b.offStand,0).toFixed(1)}</TableCell>
            <TableCell className="text-right">{tableProp.reduce((a,b)=>a+b.ovlEff,0).toFixed(1)}</TableCell>
            <TableCell className="text-right">{tableProp.reduce((a,b)=>a+b.onStndEff,0).toFixed(1)}</TableCell>
          </TableRow>
 
        </TableFooter>
      </Table>
    )
  }
  