import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const obbSheetId = searchParams.get('obbSheetId');
  const date = searchParams.get('date');

  if (!obbSheetId || !date) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const cleanDate = date.endsWith('%') ? date.slice(0, -1) : date;
    
    const result = await db.$queryRaw`
    SELECT 
  efficiency,
  "seqNo",
  operation_name
FROM (
  SELECT 
    "ProductionEfficiency"."efficiency",
    "ObbOperation"."seqNo",
    "Operation"."name" AS operation_name,
    ROW_NUMBER() OVER (
      PARTITION BY "Operation"."id", "ObbOperation"."seqNo"
      ORDER BY "ProductionEfficiency"."timestamp"::timestamp DESC
    ) AS rn
  FROM 
    "ProductionEfficiency"
  JOIN 
    "ObbOperation" ON "ProductionEfficiency"."obbOperationId" = "ObbOperation"."id"
  JOIN 
    "Operation" ON "ObbOperation"."operationId" = "Operation"."id"
  WHERE 
    "ObbOperation"."obbSheetId" = $1
    AND TO_CHAR("ProductionEfficiency"."timestamp"::timestamp, 'YYYY-MM-DD') = $2
) ranked_data
WHERE rn = 1
ORDER BY operation_name, "seqNo"
    `;

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching production efficiency:', error);
    return NextResponse.json(
      { error: 'Failed to fetch efficiency data' },
      { status: 500 }
    );
  }
}