"use client"

import { useState } from "react";
import { PDFDownloadLink } from '@react-pdf/renderer';

import { Button } from "@/components/ui/button";
import { fetchObbDetailsForReport } from "../../_actions/fetch-obb-details-for-report";
import { Loader2 } from "lucide-react";
import ObbReportTemplate from "./obb-report-template";

const GenerateObbReport = ({ obbSheetId }: { obbSheetId: string }) => {
    const [pdfLink, setPdfLink] = useState<JSX.Element | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateObbReport = async () => {
        setIsLoading(true);
        const obbDetails = await fetchObbDetailsForReport(obbSheetId);
        if (obbDetails) {
            console.log("OBB", obbDetails);
            const pdfElement = generatePdfReport(obbDetails);
            setPdfLink(pdfElement);
        }
        setIsLoading(false);
    }

    const generatePdfReport = (data: ReportObbDetailsTypes) => {
        return (
            <PDFDownloadLink
                document={
                    <ObbReportTemplate
                        data={data}
                    />
                }
                fileName="obb-report.pdf"
            >
                {/* {({ loading }) => (loading ? "Generating PDF..." : "Download PDF Report")} */}
                Download PDF Report
            </PDFDownloadLink>
        );
    };

    return (
        <div className="flex gap-2">
            {pdfLink ? (
                <Button variant="outline">
                    {pdfLink}
                </Button>
            ): (
                <Button
                    disabled={isLoading}
                    className="w-32"
                    onClick={handleGenerateObbReport}
                >
                    {isLoading ?
                        <Loader2 className="animate-spin" />
                        : "Print OBB"
                    }
                </Button>
            )}
        </div>
    )
}

export default GenerateObbReport