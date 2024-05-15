import { db } from "@/lib/db";
import AnalyticsChart from "./_components/analytics-chart";

const TLSProduction = async () => {
    const obbSheets = await db.obbSheet.findMany({
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
                title='Traffic Light System Chart for Production'
            />
        </div>
    )
}

export default TLSProduction