import { db } from "@/lib/db";
import AnalyticsChart from "./_components/analytics-chart";

const RoamingQcReportPage = async () => {
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
        <AnalyticsChart obbSheets={obbSheets}/>
    )
}

export default RoamingQcReportPage