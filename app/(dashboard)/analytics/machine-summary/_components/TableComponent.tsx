import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Key } from 'lucide-react';
  

const TableComponent = ({data}:{data:any}) => {


  const staticLineNames = [
    'LINE 113-114',
    'LINE 115-116',
    'LINE 117-118',
    'LINE 119-120',
    'LINE 121-122',
    'LINE 123-124',
    'LINE 125-126',
  ];


const test = (lineName: string) => {
  return lineName === data.linename ? data.count : '-';
};


  
  
  return (
    <div><Table >
    <TableHeader>
      <TableRow>
        <TableHead rowSpan={2}>M/C Type</TableHead>
        <TableHead rowSpan={2}>No of M/C in Unit  </TableHead>
        <TableHead colSpan={7} className='text-center'>
        Assigned M/C
        </TableHead>
        <TableHead rowSpan={2}>
        Un Assigned M/C
        </TableHead>
        
        
       
      </TableRow>
      <TableRow>
      {staticLineNames.map((lineName) => (
              <TableHead key={lineName} className="text-center">
                {lineName}
              </TableHead>
            ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      
      {data.map((d:any)=>(

     
      <TableRow key={d.type} className="bg-accent">
        <TableCell>
          <div className="font-medium">{d.type}</div>
        </TableCell>
        <TableCell>
          <div className="font-medium">{d.count}</div>
        </TableCell>
        <TableCell >
          <div className="font-medium" >{test(d.linename)}</div>
        </TableCell>
        

    
      </TableRow>
      ))}

    </TableBody>
  </Table></div>
  )
}

export default TableComponent