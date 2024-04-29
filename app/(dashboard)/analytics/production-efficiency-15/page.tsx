import AnalyticsChart from '@/components/dashboard/common/analytics-chart';
import { db } from '@/lib/db';
import React from 'react'

const ProductionEfficiency15 = async () => {
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
        title='Production Efficiency Heatmap for 15min'
      />
    </div>
  )
}

export default ProductionEfficiency15