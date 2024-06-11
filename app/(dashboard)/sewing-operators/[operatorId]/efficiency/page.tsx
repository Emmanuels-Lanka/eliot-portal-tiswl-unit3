import { db } from '@/lib/db';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/table"
import AnalyticsChart from '../../_components/analytics-chart';
import { Separator } from '@/components/ui/separator';

const OperatorEfficiencyPage = async ({
    params
}: {
    params: { operatorId: string }
}) => {
    const obbSheets = await db.obbSheet.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true
        }
    });

    const operator = await db.operator.findUnique({
        where: {
            id: params.operatorId
        }
    });

    return (
        <section className='w-full flex flex-col mx-auto max-w-7xl'>
            {operator && 
                <div className='mt-16'>
                    <h2 className='text-lg font-medium mb-2'>🙍‍♂️Operator&apos;s Details</h2>
                    <Table className='border md:w-1/2'>
                        <TableBody className='text-base'>
                            <TableRow>
                                <TableCell className="font-medium">Name</TableCell>
                                <TableCell className='text-slate-600'>{operator?.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Employee ID</TableCell>
                                <TableCell className='text-slate-600'>{operator?.employeeId}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">RFID</TableCell>
                                <TableCell className='text-slate-600'>{operator?.rfid}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="font-medium">Designation</TableCell>
                                <TableCell className='capitalize text-slate-600'>{operator?.designation}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            }
            <Separator className='h-0.5 mt-12' />
            <div className='w-full'>
                <h1 className='-mb-12 mt-16 text-xl font-medium text-slate-900'>{operator?.name}&apos;s Efficiency Analytics 🎊</h1>
                <AnalyticsChart
                    obbSheets={obbSheets}
                    title='Hourly Production Efficiency Heatmap'
                    operatorId={params.operatorId}
                />
            </div>
        </section>
    )
}

export default OperatorEfficiencyPage