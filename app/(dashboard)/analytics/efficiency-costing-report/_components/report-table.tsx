import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"








const CostingReport=()=>{
    return(
        
        <div>
          
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Line No:</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Style#</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Input Date</TableHead>
              <TableHead>Day Target</TableHead>
              <TableHead>Efficiency(%)</TableHead>
              <TableHead>Achievement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            
          </TableBody>
        </Table>
        </div>
        
    )
}

export default CostingReport;