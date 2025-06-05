import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TableComponentProps = {
  data: any;
  isLoading: boolean;
};

const TableComponent = ({ data, isLoading }: TableComponentProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader className="bg-muted ">
          <TableRow>
            <TableHead>Seq No</TableHead>
            <TableHead>Operator Name</TableHead>
            <TableHead className="hidden sm:table-cell">Employee ID</TableHead>
            <TableHead className="hidden sm:table-cell">Machine ID</TableHead>
            <TableHead>ELIOT ID</TableHead>
            <TableHead>Operation Code</TableHead>
            <TableHead>Operation Name</TableHead>
            <TableHead>Live Total Production</TableHead>
            <TableHead>Target</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((d: any) => (
            <TableRow key={d.rid} className="bg-accent/50">
              <TableCell className="font-medium">{d.seqNo}</TableCell>
              <TableCell className="font-medium">{d.name}</TableCell>
              <TableCell className="hidden sm:table-cell">
                {d.employeeId}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {d.machineId}
              </TableCell>
              <TableCell>{d.eliotSerialNumber}</TableCell>
              <TableCell className="text-right">{d.code}</TableCell>
              <TableCell className="text-right">{d.operationname}</TableCell>
              <TableCell className="text-center">{d.totprod}</TableCell>
              <TableCell className="text-left">{d.target}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
