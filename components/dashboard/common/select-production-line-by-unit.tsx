"use client"

import { ProductionLine, Unit } from "@prisma/client";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectProductionLineByUnitProps {
    units: Unit[] | null;
}

const SelectProductionLineByUnit = ({
    units
}: SelectProductionLineByUnitProps) => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [unitId, setUnitId] = useState<string | null>(null);
    const [lines, setLines] = useState<ProductionLine[]>([]);

    const selectedLineId = searchParams.get("lineId");

    const handleSearchParams = (lineId: string) => {
        if (unitId !== null) {
            const url = qs.stringifyUrl({
                url: pathname,
                query: {
                    lineId: lineId
                }
            }, { skipNull: true, skipEmptyString: true });
    
            router.push(url);
            router.refresh();
        }
    };
    
    const fetchLines = useCallback(async () => {
        try {
            const response = await axios.get(`/api/production-line/${unitId}`);
            setLines(response.data.data);
        } catch (error) {
            console.error("Error fetching lines:", error);
        }
    }, [unitId]);

    useEffect(() => {
        const fetchData = async () => {
            if (unitId !== null) {
                await fetchLines();
            } else {
                setLines([]);
            }
        };

        fetchData();
    }, [unitId, fetchLines]);

    return (
        <div className="mx-auto max-w-7xl border px-12 pt-8 py-10 rounded-lg bg-slate-100">
            <h2 className="text-lg font-medium text-slate-900">Select the unit & production line to assign the sewing machine 🧵🪡</h2>
            <div className="mt-8 w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-slate-600">Select a unit</h3>
                    <Select onValueChange={setUnitId} defaultValue={unitId as string}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {units && units.map((unit) => (
                                <SelectItem key={unit.id} value={unit.id}>
                                    {unit.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-slate-600">Select production line</h3>
                    <Select onValueChange={handleSearchParams} defaultValue={selectedLineId as string | undefined}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select production line" />
                        </SelectTrigger>
                        <SelectContent>
                            {lines && lines.map((line) => (
                                <SelectItem key={line.id} value={line.id}>{line.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}

export default SelectProductionLineByUnit