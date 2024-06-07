"use client"

import { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Eye, Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const schemaKeys = ["machineId", "machineType", "brandName", "modelNumber", "serialNumber", "unitId", "ownership"];

const FeedMachineDataFromExcel = () => {
    const { toast } = useToast();
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false)
    const [jsonData, setJsonData] = useState("");
    const [previewData, setPreviewData] = useState("");

    // Preview data from Excel
    const handlePreviewData = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                if (data) {
                    const workbook = XLSX.read(data, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    
                    let json = XLSX.utils.sheet_to_json(worksheet, {
                        header: 1,
                        defval: "",
                        blankrows: true,
                        raw: false
                    });
                    json = json.slice(1).map((row: any) => ({
                        machineId: String(row[0]),
                        machineType: String(row[1]),
                        brandName: String(row[2]),
                        modelNumber: String(row[3]),
                        serialNumber: String(row[4]),
                        unitId: String(row[5]),
                        ownership: String(row[6])
                    }));
                    setPreviewData(JSON.stringify(json, null, 2));
                }
            };
            reader.readAsBinaryString(file);
        }
    };

    // Make sure that the file is matching with database schema
    const handleDataValidation = () => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = e.target?.result;
                if (data) {
                    const workbook = XLSX.read(data, { type: "binary" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    let json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    const columnHeaders: any = json[0];
                    const isMatchingWithSchema = schemaKeys.every(key => columnHeaders.includes(key));

                    if (!isMatchingWithSchema) {
                        toast({
                            title: "Excel data format does not match the database schema",
                            variant: "error"
                        });
                        return;
                    }

                    const dataRows = json.slice(1).map((row: any) => ({
                        machineId: String(row[0]),
                        machineType: String(row[1]),
                        brandName: String(row[2]),
                        modelNumber: String(row[3]),
                        serialNumber: String(row[4]),
                        unitId: String(row[5]),
                        ownership: String(row[6])
                    }));
                    setJsonData(JSON.stringify(dataRows, null, 2));
                }
            };
            reader.readAsBinaryString(file);
        }
    };

    // Call the API routes to store the bulk data
    const handleSaveData = async () => {
        handleDataValidation();
        if (jsonData) {
            try {
                setIsLoading(true);
                await axios.post('/api/sewing-machine/bulk', jsonData)
                    .then(response => {
                        toast({
                            title: "Successfully uploaded to database",
                            variant: "success"
                        });
                        console.log("RES_DATA", response.data);
                        setIsFileSelected(false);
                    })
                    .catch(error => console.error("API ERROR:", error));
            } catch (error) {
                console.log("SAVE_EXCEL_DATA_ERROR:", error);
                toast({
                    title: "Error uploading data",
                    variant: "error"
                });
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <div className="p-4 bg-slate-100 border border-slate-500 rounded-lg space-y-8">
            <div className="flex items-center gap-4">
                <Input
                    type="file"
                    placeholder="Enter installed date."
                    accept=".xls,.xlsx"
                    onChange={(e) => {
                        setFile(e.target.files ? e.target.files[0] : null);
                        setIsFileSelected(true);
                    }}
                />
                <Button
                    className="gap-2"
                    disabled={isLoading}
                    onClick={handlePreviewData}
                    variant="outline"
                >
                    <Eye className="w-4 h-4" />
                    Preview Data
                </Button>
                <Button
                    className="gap-2"
                    disabled={isLoading || !isFileSelected}
                    onClick={handleSaveData}
                >
                    <Zap className={cn("w-4 h-4", isLoading && "hidden")} />
                    <Loader2 className={cn("animate-spin w-4 h-4 hidden", isLoading && "flex")} />
                    Upload to Database
                </Button>
            </div>
            {previewData ?
                <pre className="bg-white/50 border border-slate-400 p-2 rounded-md text-slate-700">
                    {previewData}
                </pre>
                :
                <p className="text-sm text-slate-500">{isFileSelected ? "Please click 'Preview Data' to see" : "Please select the Excel file"}</p>
            }
        </div>
    )
}

export default FeedMachineDataFromExcel