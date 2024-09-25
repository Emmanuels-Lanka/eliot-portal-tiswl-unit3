"use client"

import { ProductionLine, Unit } from "@prisma/client";
import qs from "query-string";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import {
    usePathname,
    useRouter,
    useSearchParams
} from "next/navigation";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { fetchObbSheetByUnit } from "@/actions/fetch-obb-sheet-by-unit";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface SelectUnitObbSheetDateProps {
    units: Unit[];
    handleSubmit: (data: { unitId: string, date: string, obbSheetId: string }) => void;
};

const SelectUnitObbSheetDate = ({
    units,
    handleSubmit
}: SelectUnitObbSheetDateProps) => {
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [obbSheets, setObbSheets] = useState<{ id: string; name: string }[]>([]);
    const [selectedUnit, setSelectedUnit] = useState({ id: '', name: '' });
    const [selectedDate, setSelectedDate] = useState<string>();
    const [selectedObbSheet, setSelectedObbSheet] = useState<string>();

    const handleSelectUnit = async (unitId: string) => {
        setSelectedUnit({ id: unitId, name: units.find(u => u.id === unitId)?.name as string });
        const response = await fetchObbSheetByUnit(unitId);
        if (response.length > 0) {
            setObbSheets(response);
        } else {
            toast({
                title: "No OBB sheet found for this unit",
                variant: "error"
            });
        }
    };

    useEffect(() => {
        if (selectedDate && selectedObbSheet) {
            handleSubmit({
                unitId: selectedUnit.id,
                date: selectedDate,
                obbSheetId: selectedObbSheet
            });
        }
    }, [selectedDate, selectedObbSheet]);

    return (
        <div className="mt-2 md:mt-8 mx-auto max-w-7xl border px-6 pt-6 pb-8 md:px-12 md:pt-8 md:pb-10 rounded-lg bg-slate-100">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-slate-600">Unit</h3>
                    <Select onValueChange={handleSelectUnit} defaultValue={selectedUnit.id as string}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                            {units && units.map(unit => (
                                <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-slate-600">Date (Today)</h3>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                            >
                                {selectedDate ? (
                                    format(new Date(selectedDate), "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={
                                    selectedDate ? new Date(selectedDate) : undefined
                                }
                                onSelect={(value) => {
                                    if (value) {
                                        value.setDate(value.getDate() + 1);
                                        const formattedDate = value.toISOString().split('T')[0];
                                        setSelectedDate(formattedDate);
                                    }
                                }}
                                disabled={(date) =>
                                    date > new Date() || date < new Date("2024-01-01")
                                }
                                initialFocus
                                className="w-full"
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="font-medium text-slate-600">OBB Sheet</h3>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-full justify-between font-normal"
                            >
                                {obbSheets.length > 0 ?
                                    <>
                                        {selectedObbSheet
                                            ? obbSheets.find((sheet) => sheet.id === selectedObbSheet)?.name
                                            : "Select OBB Sheets..."}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </>
                                    :
                                    "No OBB sheets available!"
                                }
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command>
                                <CommandInput placeholder="Search OBB sheet..." />
                                <CommandList>
                                    <CommandEmpty>No OBB sheet found!</CommandEmpty>
                                    <CommandGroup>
                                        {obbSheets.length > 0 && obbSheets.map((sheet) => (
                                            <CommandItem
                                                key={sheet.id}
                                                value={sheet.name}
                                                onSelect={() => {
                                                    setSelectedObbSheet(sheet.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedObbSheet === sheet.id ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {sheet.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    )
}

export default SelectUnitObbSheetDate