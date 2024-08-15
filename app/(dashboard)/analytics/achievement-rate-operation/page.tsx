import SelectObbSheetDateHour from "@/components/dashboard/common/select-obbsheet-date-hour"
import { db } from "@/lib/db";
import AnalyticsChartOperation from "./_components/analytics-chart";

const AchivementRateoperations = async () => {
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
            <AnalyticsChartOperation
                obbSheets={obbSheets}
            />
        </div>
    )
}

export default AchivementRateoperations