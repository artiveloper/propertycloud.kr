"use client"

import {useEffect, useState} from "react"
import {Input} from "@workspace/ui/components/input"
import {Label} from "@workspace/ui/components/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@workspace/ui/components/select"
import {fetchLodgingFilters} from "@/domain/lodging"
import type {LodgingFilterParams, LodgingFiltersResponse} from "@/domain/lodging"

interface LodgingFilterProps {
    filters: LodgingFilterParams
    onFiltersChange: (filters: LodgingFilterParams) => void
}

export function LodgingFilter({filters, onFiltersChange}: LodgingFilterProps) {
    const [filterOptions, setFilterOptions] = useState<LodgingFiltersResponse | null>(null)

    useEffect(() => {
        async function loadFilterOptions() {
            try {
                const data = await fetchLodgingFilters()
                setFilterOptions(data)
            } catch (error) {
                console.error("Failed to fetch filter options:", error)
            }
        }

        loadFilterOptions()
    }, [])

    const handleBusinessTypeChange = (value: string) => {
        onFiltersChange({
            ...filters,
            businessType: value === "all" ? undefined : value,
        })
    }

    const handleMinRoomCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        onFiltersChange({
            ...filters,
            minRoomCount: value ? parseInt(value, 10) : undefined,
        })
    }

    const businessTypes = filterOptions?.businessTypes.filter((filter) => filter.value !== "") ?? []

    return (
        <div className="shrink-0 space-y-4 border-b px-4 py-3">
            <div className="space-y-2">
                <Label htmlFor="businessType" className="text-xs">업태</Label>
                <Select
                    value={filters.businessType ?? "all"}
                    onValueChange={handleBusinessTypeChange}
                >
                    <SelectTrigger id="businessType" className="h-8 text-sm">
                        <SelectValue placeholder="전체"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">전체</SelectItem>
                        {businessTypes.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="minRoomCount" className="text-xs">최소 객실 수</Label>
                <Input
                    id="minRoomCount"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={filters.minRoomCount ?? ""}
                    onChange={handleMinRoomCountChange}
                    className="h-8 text-sm"
                />
            </div>
        </div>
    )
}
