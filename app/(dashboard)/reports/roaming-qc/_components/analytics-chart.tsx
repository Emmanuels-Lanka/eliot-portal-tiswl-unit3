"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PDFDownloadLink } from '@react-pdf/renderer';
import { DateRange } from "react-day-picker";
import { ObbOperation, ObbSheet, Operation, Operator, ProductionLine, RoamingQC } from "@prisma/client";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { fetchRoamingQcData } from "../_actions/fetch-roaming-qc-data";
import RoamingQcReportTemplate from "./roaming-qc-report-template";
import RoamingQcReportViewer from "./roaming-qc-report-viewer";
import SelectObbSheetAndDateRange from "@/components/dashboard/common/select-obbsheet-and-date-range";
import { fetchObbSheetDetails } from "../_actions/fetch-obb-sheet-details";

interface AnalyticsChartProps {
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}

type ReportDetailsType = {
    label: string;
    value: string;
};

type RawDataType = RoamingQC & {
    obbOperation: ObbOperation & {
        obbSheet: ObbSheet & {
            productionLine: ProductionLine;
        };
        operation: Operation
    };
    operator: Operator
}

type ProcessedDataType = {
    date: string;
    data: {
        obbOperationId: string;
        records: RawDataType[];
    }[];
};

const AnalyticsChart = ({
    obbSheets
}: AnalyticsChartProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const [pdfLink, setPdfLink] = useState<JSX.Element | null>(null);
    const [reportData, setReportData] = useState<ProcessedDataType[]>([]);
    const [reportDetails, setReportDetails] = useState<ReportDetailsType[]>([]);

    const processData = (rawData: RawDataType[]): ProcessedDataType[] => {
        const groupedByDate = rawData.reduce<Record<string, Record<string, RawDataType[]>>>((acc, item) => {
            const date = item.timestamp.split(' ')[0]; // Extract the date (e.g., "2024-12-14")
            if (!acc[date]) acc[date] = {};
            if (!acc[date][item.obbOperationId]) acc[date][item.obbOperationId] = [];
            acc[date][item.obbOperationId].push(item);
            return acc;
        }, {});

        return Object.entries(groupedByDate).map(([date, obbOperationGroups]) => ({
            date,
            data: Object.entries(obbOperationGroups).map(([obbOperationId, records]) => ({
                obbOperationId,
                records,
            })),
        }));
    };

    const handleFetchProductions = async (data: { obbSheetId: string; date: DateRange }) => {
        const response: RawDataType[] = await fetchRoamingQcData(data.obbSheetId, data.date);
        // console.log("Fetched data: ", response);

        const processedData = processData(response);
        // console.log("processedData: ", processedData);

        const obbSheet = await fetchObbSheetDetails(data.obbSheetId);

        const reportDetails = [
            { label: "Start date", value: data.date.from?.toLocaleDateString() ?? "" },
            { label: "End date", value: data.date.to?.toLocaleDateString() ?? "" },
            { label: "Line", value: response[0].obbOperation.obbSheet.productionLine.name },
            { label: "Style", value: obbSheet?.style ?? "" },
            { label: "Buyer", value: obbSheet?.buyer ?? "" },
            { label: "Color", value: obbSheet?.colour ?? "" },
            // { label: "Total DHU", value: formattedData.map(value => value.data.totalDHU).reduce((accumulator, currentValue) => accumulator + currentValue, 0).toFixed(2).toString() },
        ];

        setPdfLink(generatePdfReport(processedData, reportDetails));
        setReportData(processedData);
        setReportDetails(reportDetails);
    }

    const generatePdfReport = (reportData: any[], reportDetails: ReportDetailsType[]) => {
        return (
            <PDFDownloadLink
                document={
                    <RoamingQcReportTemplate
                        details={reportDetails}
                        data={reportData}
                    />
                }
                fileName="roaming-qc-report.pdf"
            >
                Download PDF Report
            </PDFDownloadLink>
        );
    };

    return (
        <div className="mx-auto max-w-7xl">
            <SelectObbSheetAndDateRange
                obbSheets={obbSheets}
                handleSubmit={handleFetchProductions}
            />
            {(reportData.length > 0 && reportDetails.length > 0) &&
                <div className='mt-8 p-8 bg-slate-100 rounded-lg border flex flex-col items-end gap-4'>
                    <div className='space-x-4'>
                        {pdfLink && (
                            <Button variant="default">
                                {pdfLink}
                            </Button>
                        )}
                    </div>
                    <div className='w-full pdf-viewer'>
                        <RoamingQcReportViewer
                            details={reportDetails}
                            data={reportData}
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default AnalyticsChart