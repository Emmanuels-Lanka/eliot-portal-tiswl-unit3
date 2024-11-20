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
              <TableCell>{invoice.seqNo}</TableCell>
              <TableCell>{invoice.availableHours}</TableCell>
              <TableCell>{invoice.stdHours}</TableCell>
              <TableCell>{invoice.offStand}</TableCell>
              <TableCell>{invoice.ovlEff}</TableCell>
              <TableCell>{invoice.onStndEff}</TableCell>
              {/* <TableCell className="text-right">{invoice.totalAmount}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  