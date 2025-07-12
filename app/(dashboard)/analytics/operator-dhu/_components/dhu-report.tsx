"use client";

import SelectObbSheetAndDate from "@/components/dashboard/common/select-obbsheet-and-date";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDailyData, getDefectsNew } from "./actions";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getCheckedForReport } from "../../dhu-operator/_components/actions";
import { Loader2 } from "lucide-react";
import SelectObbSheetAndDateRange from "@/components/dashboard/common/select-obbsheet-and-date-range";

interface AnalyticsChartProps {
  obbSheets:
    | {
        id: string;
        name: string;
      }[]
    | null;
}

export type ReportData1 = {
  id: string;
  operatorid: string;
  operatorname: string;
  operationname: string;
  smv: number;
  target: number;
  efficiency: number;
  achievements: string;
  unitname: string;
  style: string;
  machineid: string;
  linename: string;
  buyer: string;
  seqNo: number;
  inspect: number;
  employeeId: string;
};

const DhuReport = ({ obbSheets }: AnalyticsChartProps) => {
  const [date, setDate] = useState<any>();
  const [dates, setDates] = useState<any>();
  const [details, setDetails] = useState<ReportData1[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [combined, setcombined] = useState<any[]>([]);
  const [obbSheetId, setObbSheetId] = useState<string>("");
  const reportRef = useRef<HTMLDivElement>(null);

  const handleFetchProductions = async (data: {
    obbSheetId: string;
    date: { from: Date; to: Date };
  }) => {
    data.date.from.setDate(data.date.from.getDate() + 1);
    data.date.to.setDate(data.date.to.getDate() + 1);

    const dateFrom = data.date.from.toISOString().split("T")[0] + " 00:00:00";
    const dateTo = data.date.to.toISOString().split("T")[0] + " 23:59:59";

    const formattedDate = {
      from: dateFrom,
      to: dateTo,
    };

    setDate(formattedDate);
    setDates(formattedDate);
    setObbSheetId(data.obbSheetId);
  };

  const getDetails = async () => {
    setIsLoading(true);
    const defects = await getDefectsNew(obbSheetId, date.from, date.to);
    const checked = await getCheckedForReport(obbSheetId, date.from, date.to);

    const newMap = defects.map((d: any) => ({
      ...d,
      dhu: Number(((d.count / checked.total) * 100).toFixed(3)),
      totalCount: checked,
    }));

    const details = await getDailyData(obbSheetId, date.from, date.to);

    setDetails(details);
    setcombined(newMap);
    setIsLoading(false);
  };

  useEffect(() => {
    if (obbSheetId && date) {
      getDetails();
    }
  }, [obbSheetId, date]);

  const handleDownloadPDF = async () => {
    if (!reportRef.current || !details.length) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await html2canvas(reportRef.current, {
        scale: 1,
        logging: false,
        useCORS: true,
      } as any);

      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();

      const footerHeight = 15; // approx height of your footer

      if (imgHeight + footerHeight <= pageHeight - 20) {
        // fits on one page
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          10,
          10,
          imgWidth,
          imgHeight
        );

        const footerY = imgHeight + 20;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink("https://rfid-tracker.eliot.global/", 10, footerY, {
          url: "https://rfid-tracker.eliot.global/",
        });

        const footerLogo = new Image();
        footerLogo.src = "/logo.png";
        footerLogo.onload = () => {
          pdf.addImage(
            footerLogo,
            "PNG",
            pdf.internal.pageSize.getWidth() - 40,
            footerY - 5,
            30,
            10
          );
          pdf.save(`Operator_DHU_Report_${details[0]?.linename}_${dates}.pdf`);
        };
      } else {
        // image already fills page — put footer on new page
        pdf.addImage(
          canvas.toDataURL("image/png"),
          "PNG",
          10,
          10,
          imgWidth,
          imgHeight
        );

        pdf.addPage();

        const footerY = 20;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink("https://rfid-tracker.eliot.global/", 10, footerY, {
          url: "https://rfid-tracker.eliot.global/",
        });

        const footerLogo = new Image();
        footerLogo.src = "/logo.png";
        footerLogo.onload = () => {
          pdf.addImage(
            footerLogo,
            "PNG",
            pdf.internal.pageSize.getWidth() - 40,
            footerY - 5,
            30,
            10
          );
          pdf.save(`Operator_DHU_Report_${details[0]?.linename}_${dates}.pdf`);
        };
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <SelectObbSheetAndDateRange
        obbSheets={obbSheets}
        handleSubmit={handleFetchProductions}
      />

      {obbSheetId && date && (
        <div className="mt-5 mb-16 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
            </div>
          ) : combined.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-slate-500 text-lg">No Data Available.</p>
            </div>
          ) : (
            <div className="p-8 bg-slate-100 rounded-lg border">
              <div className="flex justify-end mb-4">
                <Button className="shadow-md" onClick={handleDownloadPDF}>
                  Download as PDF
                </Button>
              </div>

              {/* Only report content */}
              <div ref={reportRef}>
                <div className="text-center">
                  <img
                    src="/ha-meem.png"
                    alt="Ha-Meem Logo"
                    className="mx-auto w-[120px] h-auto mt-[10px]"
                  />
                  <h5 className="mt-[10px]">~ Bangladesh ~</h5>
                  <h1 className="text-center">Operator DHU Report</h1>
                  <hr className="my-4" />
                </div>

                <div className="flex justify-around mt-5 text-sm mb-5">
                  <div className="flex-1 mr-[10px] leading-[1.5]">
                    <h5 className="m-0 font-semibold">
                      Factory Name: Apparel Gallery LTD
                    </h5>
                    <h5 className="m-0 font-semibold">
                      Unit: {details[0]?.unitname}
                    </h5>
                    <h5 className="font-semibold">
                      Line Name: {details[0]?.linename}
                    </h5>
                  </div>
                  <div className="flex-1 ml-[10px] leading-[1.5]">
                    <h5 className="m-0 font-semibold">
                      Style Name: {details[0]?.style}
                    </h5>
                    <h5 className="m-0 font-semibold">
                      Date:{" "}
                      {date.from.slice(0, 10) === date.to.slice(0, 10)
                        ? date.from.slice(0, 10)
                        : `${date.from.slice(0, 10)} to ${date.to.slice(
                            0,
                            10
                          )}`}
                    </h5>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Operator Name</TableHead>
                      <TableHead>Operation Name</TableHead>
                      <TableHead>Operated Machine</TableHead>
                      <TableHead>No. Of Gmt inspect</TableHead>
                      <TableHead>No. Of defects</TableHead>
                      <TableHead>DHU</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {combined.map((d, rid) => (
                      <TableRow key={rid}>
                        <TableCell className="px-2 py-2 text-left">
                          {d.operatorName}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-left">
                          {d.operationName}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-left">
                          {d.machineId}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-center">
                          {d.totalCount.total}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-center">
                          {d.count}
                        </TableCell>
                        <TableCell className="px-2 py-2 text-center">
                          {d.dhu}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {/* End reportRef */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DhuReport;
