"use client"

import { useState, useEffect } from "react";
import axios from "axios";

import { cn } from "@/lib/utils";

interface ShowProductionLinesProps {
    units: {
        id: string;
        name: string;
    }[];
}

const ShowProductionLines = ({
    units
}: ShowProductionLinesProps) => {
    const [selectedUnit, setSelectedUnit] = useState('');

    const [lines, setLines] = useState<productionLineTypes[]>([]);

    useEffect(() => {
        const fetchLines = async () => {
            if (selectedUnit) {
                try {
                    const response = await axios.get(`/api/production-line?unitId=${selectedUnit}`);
                    setLines(response.data.data);
                } catch (error) {
                    console.error("Error fetching lines:", error);
                }
            }
        };

        fetchLines();
    }, [selectedUnit]);

    return (
        <div className="w-full flex gap-4">
            <div className="md:w-1/3 flex flex-col space-y-2">
                {units && units.map((unit) => (
                    <div 
                        key={unit.id}
                        className={cn(
                            "bg-white border rounded-md py-3 px-4 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition",
                            selectedUnit === unit.id && "border-slate-400 bg-slate-200"
                        )}
                        onClick={() => setSelectedUnit(unit.id)}
                    >
                        {unit.name}
                    </div>
                ))}
            </div>
            <div className="md:w-2/3 bg-slate-300 rounded-md py-3 px-4 overflow-y-auto">
                {selectedUnit ? 
                <div>
                    <h2 className="text-lg font-semibold mb-2 text-slate-800">Production Lines</h2>
                    <div className="mt-2">
                        {lines.length === 0 ? (
                            <p className="text-slate-500 text-sm">No lines found for the selected unit.</p>
                        ) : (
                            <ul className="flex gap-2 flex-wrap">
                                {lines.map((line) => (
                                    <li key={line.id} className="rounded-full px-4 py-1.5 bg-white/50">
                                        {line.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                :
                <div className="w-full h-full flex justify-center items-center text-slate-600">
                    Please select a unit!
                </div>
                }
            </div>
        </div>
    )
}

export default ShowProductionLines