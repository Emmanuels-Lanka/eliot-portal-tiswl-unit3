"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { AlertTriangle, Eye, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const schemaKeys = [
  "machineId",
  "machineType",
  "brandName",
  "modelNumber",
  "serialNumber",
  "unitName",
  "ownership",
  // "eliotDeviceName",
];
interface Error {
  row: number;
  message: string;
}

const BulkUploadSewingMachineData = () => {
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [jsonData, setJsonData] = useState("");
  const [previewData, setPreviewData] = useState("");
  const [errors, setErrors] = useState<Error[]>([]);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const handlePreviewData = () => {
    setPreviewData("Loading preview...");
    if (!file) {
      setPreviewData("No file selected.");
      toast({
        title: "No file selected",
        description: "Please select an Excel file to preview.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) {
        setPreviewData("Error reading file.");
        toast({
          title: "File read error",
          description: "Could not read data from the selected file.",
          variant: "error",
        });
        return;
      }

      try {
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        let allRows: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          blankrows: true,
          raw: false,
        });

        if (allRows.length < 3) {
          setPreviewData(
            "Excel file must contain at least 3 rows (title, headers, and at least one data row) for preview."
          );
          toast({
            title: "Invalid Excel Format",
            description:
              "Excel file must contain at least 3 rows (title, headers, and at least one data row) for preview.",
            variant: "error",
          });
          return;
        }

        const dataRows = allRows.slice(2);

        const mappedData = dataRows
          .map((row: any) => ({
            machineId: String(row[0] ?? ""),
            machineType: String(row[1] ?? ""),
            brandName: String(row[2] ?? ""),
            modelNumber: String(row[3] ?? ""),
            serialNumber: String(row[4] ?? ""),
            unitName: String(row[5] ?? ""),
            ownership: String(row[6] ?? ""),
            eliotDeviceName: String(row[7] ?? ""),
          }))
          .filter((row) => Object.values(row).some((value) => value !== ""));

        if (mappedData.length === 0) {
          setPreviewData(
            "No valid data found in rows starting from the third row."
          );
          toast({
            title: "No data found for preview",
            description:
              "No valid data was found starting from the third row of the Excel file.",
          });
          return;
        }

        setPreviewData(JSON.stringify(mappedData, null, 2));
      } catch (error: any) {
        setPreviewData("Error reading file.");
        toast({
          title: "Error processing Excel file",
          description: error.message || "Could not read the file.",
          variant: "error",
        });
        console.error("Error reading Excel file:", error);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Validate data format and extract data from Excel
  const handleDataValidation = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setJsonData("");
      if (!file) {
        toast({
          title: "No file selected",
          description: "Please select an Excel file before validating.",
          variant: "error",
        });
        resolve(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (!data) {
          toast({
            title: "File read error",
            description: "Could not read data from the selected file.",
            variant: "error",
          });
          resolve(false);
          return;
        }

        try {
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          let allRows: any[] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
            defval: "",
            blankrows: true,
            raw: false,
          });

          if (allRows.length < 2) {
            toast({
              title: "Invalid Excel Format",
              description:
                "Excel file must contain at least a title row and a header row (minimum 2 rows).",
              variant: "error",
            });
            resolve(false);
            return;
          }

          const columnHeaders: any[] = allRows[1] || [];
          console.log("Row 2 Headers:", columnHeaders);

          const missingHeaders = schemaKeys.filter(
            (key) => !columnHeaders.includes(key)
          );

          if (missingHeaders.length > 0) {
            toast({
              title: "Validation Failed",
              description: `Missing required headers in Row 2: ${missingHeaders.join(
                ", "
              )}`,
              variant: "error",
              duration: 15000,
            });
            resolve(false);
            return;
          }
          const dataRows = allRows.slice(2);
          console.log("Data Rows (from Row 3 onwards):", dataRows);

          if (dataRows.length === 0) {
            toast({
              title: "No data rows found",
              description:
                "No data was found starting from the third row of the Excel file.",
            });
            resolve(false);
            return;
          }

          const mappedData = dataRows
            .map((row: any) => ({
              machineId: String(row[0] ?? ""),
              machineType: String(row[1] ?? ""),
              brandName: String(row[2] ?? ""),
              modelNumber: String(row[3] ?? ""),
              serialNumber: String(row[4] ?? ""),
              unitName: String(row[5] ?? ""),
              ownership: String(row[6] ?? ""),
              eliotDeviceName: row[7] ? String(row[7]) : null,
            }))
            .filter((row) => Object.values(row).some((value) => value !== ""));

          console.log("Mapped Data (filtered):", mappedData);

          if (mappedData.length === 0) {
            toast({
              title: "No valid data found after mapping",
              description:
                "The Excel file contained rows after the header, but they were all empty or contained no recognizable data in the expected columns.",
            });
            resolve(false);
            return;
          }

          setJsonData(JSON.stringify(mappedData, null, 2));
          resolve(true);
        } catch (error: any) {
          toast({
            title: "Error processing Excel file",
            description: error.message || "Could not read the file.",
            variant: "error",
          });
          console.error("Error reading Excel file during validation:", error);
          resolve(false);
        }
      };
      reader.readAsBinaryString(file);
    });
  };

  // Call the API routes to store the bulk data
  const handleSaveData = async () => {
    if (errors.length > 0) {
      setIsErrorModalOpen(true);
      return;
    }

    setIsLoading(true);
    const isValid = await handleDataValidation();

    if (isValid && jsonData) {
      try {
        const dataToUpload = JSON.parse(jsonData);

        if (dataToUpload.length === 0) {
          toast({
            title: "No data to upload",
            description: "No valid data rows were found.",
          });
          setIsLoading(false);
          return;
        }

        await axios.post("/api/sewing-machine/bulk", dataToUpload, {
          headers: { "Content-Type": "application/json" },
        });

        toast({
          title: "Successfully uploaded to database",
          variant: "success",
        });

        setFile(null);
        setPreviewData("");
        setJsonData("");
        setErrors([]);
        setIsFileSelected(false);
      } catch (error: any) {
        console.error(
          "API Upload Error:",
          error.response?.data || error.message
        );

        const errorMessageString =
          error.response?.data?.errors ?? error.message ?? "Unknown error";
        const parsedErrors: Error[] = [];
        const errorEntries = errorMessageString
          .split("Row ")
          .filter((e: string) => e);

        errorEntries.forEach((entry: string) => {
          const colonIndex = entry.indexOf(":");

          if (colonIndex > -1) {
            const rowNumberStr = entry.substring(0, colonIndex).trim();
            const message = entry.substring(colonIndex + 1).trim();

            const rowNumber = parseInt(rowNumberStr, 10);

            if (!isNaN(rowNumber)) {
              parsedErrors.push({ row: rowNumber, message: message });
            }
          } else {
            parsedErrors.push({ row: 0, message: entry.trim() });
          }
        });
        if (parsedErrors.length === 0 && errorMessageString) {
          parsedErrors.push({ row: 0, message: errorMessageString });
        }
        setErrors(parsedErrors);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-slate-100 border border-slate-300 rounded-lg space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="file"
          placeholder="Select Excel file"
          accept=".xls,.xlsx"
          onChange={(e) => {
            setFile(e.target.files ? e.target.files[0] : null);
            setIsFileSelected(true);
            setPreviewData("");
            setJsonData("");
          }}
        />
        <Button
          className="gap-2"
          disabled={isLoading || !file}
          onClick={handlePreviewData}
          variant="outline"
        >
          <Eye className="w-4 h-4" />
          Preview Data
        </Button>

        <Button
          className={cn(
            "gap-2 w-48",
            errors.length > 0 && "bg-red-600 hover:bg-red-700"
          )}
          disabled={isLoading || !file}
          onClick={handleSaveData}
        >
          {errors.length > 0 ? (
            <>
              <AlertTriangle className="w-4 h-4" />
              View {errors.length} Errors
            </>
          ) : (
            <>
              {isLoading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Zap className="w-4 h-4" />
              )}{" "}
              Upload to Database
            </>
          )}
        </Button>
      </div>

      {previewData ? (
        <pre className="bg-white/50 border border-slate-300 p-2 rounded-md text-slate-700 text-sm overflow-y-auto max-h-60">
          {previewData}
        </pre>
      ) : (
        <p className="text-sm text-slate-500">
          {file
            ? "Click 'Preview Data' to see file content or 'Upload' to validate and save."
            : "Please select an Excel file to upload sewing machine data."}
        </p>
      )}

      {/* Error Dialog Modal - No changes here */}
      <Dialog open={isErrorModalOpen} onOpenChange={setIsErrorModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle />
              Validation Errors
            </DialogTitle>
            <DialogDescription>
              The errors were found in your Excel file. Please correct them and
              re-upload the file.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto pr-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold w-24">Row No.</th>
                  <th className="text-left p-2 font-semibold">
                    Error Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {errors.map((error, index) => (
                  <tr
                    key={index}
                    className={cn(
                      "border-b last:border-b-0 hover:bg-red-50/50",
                      error.row === 0 && "bg-red-50"
                    )}
                  >
                    <td className="p-2 text-center font-mono bg-slate-100 rounded-l-md">
                      {error.row === 0 ? "File" : error.row}
                    </td>
                    <td className="p-2 text-slate-700 rounded-r-md">
                      {error.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BulkUploadSewingMachineData;
