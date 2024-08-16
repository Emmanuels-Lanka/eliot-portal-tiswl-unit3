"use client"
import React, { useEffect } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
import { getData } from './action'

const LogTable = () => {




    const getDetails = async ()=> {

        const details = await getData(",","j")
        console.log(details)

    }

    useEffect(()=>{
        getDetails()
    }
    ,[])


  return (
    <div>LogTable
        <div>
            <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Logs</CardTitle>
                    <CardDescription>
                      Logs of ELIoT
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
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
                          TEACHING STATUS
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
                        <TableRow className="bg-accent">
                          <TableCell>
                            <div className="font-medium">Liam Johnson</div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              liam@example.com
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            Sale
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs" variant="secondary">
                              Fulfilled
                            </Badge>
                          </TableCell>
                          <TableCell className="">
                            2023-06-23
                          </TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                       

                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
            </div>
    </div>
  )
}

export default LogTable