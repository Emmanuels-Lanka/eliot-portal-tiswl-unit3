import { db } from '@/lib/db';
import AnalyticsChart from './_components/analytics-chart';

const ProductionEfficiency15 = async () => {
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
                title='Production Efficiency Heatmap for 15min'
            />
        </div>
    )
}

export default ProductionEfficiency15