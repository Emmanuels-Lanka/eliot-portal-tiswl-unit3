import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Key } from 'lucide-react';
import { ProductionDataType } from './LogTable';

interface TableProps {
  data: {
    [key: string]: ProductionDataType[];
  };
}

const TableComponent: React.FC<TableProps> = ({ data }) => {
  const staticLineNames = [
    'LINE-113-114',
    'LINE-115-116',
    'LINE-117-118',
    'LINE-119-120',
    'LINE-121-122',
    'LINE-123-124',
    'LINE-125-126',
  ];

  const getCountForLine = (row: ProductionDataType, lineName: string) => {
    return row.linename === lineName ? row.count : '-';
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2}>M/C Type</TableHead>
            <TableHead rowSpan={2}>No of M/C in Unit</TableHead>
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
          {Object.entries(data).map(([key, value]) => (
            <TableRow key={key} className="bg-accent">
              <TableCell>
                <div className="font-medium">{key}</div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {value.reduce((acc, current) => acc + current.count, 0)}
                </div>
              </TableCell>
              {staticLineNames.map((lineName) => (
                <TableCell key={lineName}>
                  <div className="font-medium">
                    {value.find((row) => row.linename === lineName)?.count || '-'}
                  </div>
                </TableCell>
              ))}
              <TableCell>
                <div className="font-medium">
                  {value.reduce((acc, current) => acc + current.notassigned, 0)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;