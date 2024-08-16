import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const TableComponent = ({data}:{data:any}) => {
  return (
    <div><Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name of operator</TableHead>
        <TableHead className="hidden sm:table-cell">
        EMPLOYEE ID
        </TableHead>
        <TableHead className="hidden sm:table-cell">
        MACHINE ID
        </TableHead>
        <TableHead className="">
        ELIOT ID
        </TableHead>
        <TableHead className="">
        OPERATION code
        </TableHead>
        <TableHead className="">
        Operation Name
        </TableHead>
        
        <TableHead className="">
        LIVE TOTAL PRODUCTION
        </TableHead>
        <TableHead className="">
        LOG IN TIME
        </TableHead>
        <TableHead className="">
        LOG OUT TIME
        </TableHead>
        <TableHead className="">
        target/Hr
        </TableHead>
       
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((d:any)=>(

     
      <TableRow key={d.rid} className="bg-accent">
        <TableCell>
          <div className="font-medium">{d.name}</div>
          
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {d.employeeId}
        </TableCell>
        <TableCell className="hidden sm:table-cell">
          {d.machineId}
        </TableCell>
        <TableCell className="">
          {d.eliotSerialNumber}
        </TableCell>
        <TableCell className="text-right">{d.code}</TableCell>
        <TableCell className="text-right">{d.operationname}</TableCell>
        <TableCell className="text-right">{d.totprod}</TableCell>
        <TableCell className="text-right">{d.LoginTimestamp}</TableCell>
        <TableCell className="text-right">{d.LogoutTimestamp}</TableCell>
        <TableCell className="text-right">{d.target}</TableCell>
        
      </TableRow>
      ))}

    </TableBody>
  </Table></div>
  )
}

export default TableComponent