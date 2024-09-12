"use client"

import { useState } from "react";
import { Unit } from "@prisma/client";

import SelectUnitLineObbSheet from "@/components/roaming-qc/select-unit-line-obbsheet";
import QrCodeReader from "@/components/roaming-qc/qr-code-reader";

interface RoamingQcDashboardProps {
    units: Unit[];
    obbSheets: {
        id: string;
        name: string;
    }[] | null;
}

const RoamingQcDashboard = ({
    units,
    obbSheets,
}: RoamingQcDashboardProps) => {
    const [selectedData, setSelectedData] = useState<{ unit: string, lineId: string, obbSheetId: string }>();
    const [isScanningQr, setIsScanningQr] = useState(false);
    const [qrCode, setQrCode] = useState<string>('');

    const handleSelectedData = (data: { unit: string, lineId: string, obbSheetId: string }) => {
        setSelectedData(data);
        setIsScanningQr(true);
    }
    console.log("qrCode", qrCode);

    return (
        <div>
            <SelectUnitLineObbSheet
                units={units}
                obbSheets={obbSheets}
                handleSubmit={handleSelectedData}
            />
            {selectedData && isScanningQr ?
                <div className="mt-8 mx-auto max-w-xl w-full camera-box">
                    <QrCodeReader setQrCode={setQrCode} />
                </div>
                :
                <p className="w-full text-center mt-16">
                    ☝️ Please select Unit, Line, and Obb Sheet
                </p>
            }
            {qrCode &&
                <p className="mt-8 py-2 px-4 border bg-slate-100">{qrCode}</p>
            }
        </div>
    )
}

export default RoamingQcDashboard