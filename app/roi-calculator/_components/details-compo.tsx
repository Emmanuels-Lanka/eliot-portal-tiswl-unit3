import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { formDataType } from './form-compo'

const ROICompo = ({formData}:{formData:formDataType}) => {
    console.log(formData)
  return (
    <div>

<Table>
  <TableCaption>Return of Investment</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]"> Results
      </TableHead>
     
      <TableHead className="text-right">Value
      </TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
   
      {
        Object.entries(formData).map((([Key,value])=>(
            <TableRow key={Key}>
                <TableCell>{Key}</TableCell>
                <TableCell className='text-right'>{value}</TableCell>


            </TableRow>
        )))
      }
    
  </TableBody>
</Table>


    </div>
  )
}

export default ROICompo