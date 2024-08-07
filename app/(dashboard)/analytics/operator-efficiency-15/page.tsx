import { db } from '@/lib/db';
import AnalyticsChart from './_components/analytics-chart';

const OperatorEfficiency60 = async () => {
    const obbSheets = await db.obbSheet.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true
        }
    });

    return (
        <div>
            <AnalyticsChart
                obbSheets={obbSheets}
                title='Operator Efficiency Heatmap for 15min'
            />
        </div>
    )
}

export default OperatorEfficiency60